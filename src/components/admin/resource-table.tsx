"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { Eye, EyeOff, Pencil, Plus, Search, Trash2, Loader2 } from "lucide-react";
import { deleteResource, togglePublished } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusPill } from "@/components/admin/status-pill";
import { cn, formatDate } from "@/lib/utils";
import type { ListColumn, ResourceDef } from "@/lib/admin/resources";

type Row = Record<string, unknown>;

export function ResourceTable({
  resource,
  rows,
}: {
  resource: ResourceDef;
  rows: Row[];
}) {
  const [query, setQuery] = useState("");
  const [pending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return rows;
    return rows.filter((row) =>
      resource.searchColumns.some((column) =>
        String(row[column] ?? "")
          .toLowerCase()
          .includes(needle),
      ),
    );
  }, [rows, query, resource.searchColumns]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[14rem] flex-1">
          <Search
            aria-hidden
            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ash-deep"
          />
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={`Filter ${resource.label.toLowerCase()}…`}
            aria-label={`Filter ${resource.label}`}
            className="h-10 pl-10"
          />
        </div>

        <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-ash-deep">
          {filtered.length} / {rows.length}
        </span>

        {resource.canCreate ? (
          <Button asChild size="sm">
            <Link href={`/admin/${resource.key}/new`}>
              <Plus className="size-3.5" />
              New {resource.singular.toLowerCase()}
            </Link>
          </Button>
        ) : null}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-8 rounded-[var(--radius-panel)] border border-dashed border-steel bg-carbon/60 px-6 py-14 text-center">
          <p className="font-display text-lg text-bone">
            {rows.length === 0 ? `No ${resource.label.toLowerCase()} yet.` : "Nothing matches that filter."}
          </p>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ash">
            {rows.length === 0
              ? resource.description
              : "Try a different search term, or clear the filter to see everything."}
          </p>
          {resource.canCreate && rows.length === 0 ? (
            <Button asChild size="sm" className="mt-6">
              <Link href={`/admin/${resource.key}/new`}>
                <Plus className="size-3.5" />
                Create the first one
              </Link>
            </Button>
          ) : null}
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="mt-6 hidden overflow-hidden rounded-[var(--radius-panel)] border border-steel lg:block">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-steel bg-graphite">
                  {resource.listColumns.map((column) => (
                    <th
                      key={column.name}
                      scope="col"
                      className="px-4 py-3 font-mono text-[0.625rem] font-medium uppercase tracking-[0.14em] text-ash-deep"
                    >
                      {column.label}
                    </th>
                  ))}
                  <th scope="col" className="px-4 py-3 text-right font-mono text-[0.625rem] font-medium uppercase tracking-[0.14em] text-ash-deep">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => {
                  const id = String(row.id);
                  const published = row.published === true;
                  return (
                    <tr key={id} className="border-b border-steel/60 last:border-b-0 hover:bg-graphite/50">
                      {resource.listColumns.map((column) => (
                        <td key={column.name} className="max-w-[22rem] px-4 py-3 align-middle">
                          <Cell column={column} row={row} resource={resource} />
                        </td>
                      ))}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1.5">
                          {resource.publishable ? (
                            <button
                              type="button"
                              disabled={pending}
                              onClick={() =>
                                startTransition(() => {
                                  void togglePublished(resource.key, id, !published);
                                })
                              }
                              aria-label={published ? "Unpublish" : "Publish"}
                              title={published ? "Unpublish" : "Publish"}
                              className={cn(
                                "flex size-8 items-center justify-center rounded-lg border transition-colors",
                                published
                                  ? "border-signal/40 text-signal hover:bg-signal/10"
                                  : "border-steel text-ash hover:border-steel-bright hover:text-bone",
                              )}
                            >
                              {pending ? (
                                <Loader2 className="size-3.5 animate-spin" />
                              ) : published ? (
                                <Eye className="size-3.5" />
                              ) : (
                                <EyeOff className="size-3.5" />
                              )}
                            </button>
                          ) : null}

                          <Link
                            href={`/admin/${resource.key}/${id}`}
                            className="flex size-8 items-center justify-center rounded-lg border border-steel text-ash transition-colors hover:border-steel-bright hover:text-bone"
                            aria-label="Edit"
                            title="Edit"
                          >
                            <Pencil className="size-3.5" />
                          </Link>

                          {resource.canDelete ? (
                            <DeleteButton
                              resourceKey={resource.key}
                              resourceLabel={resource.singular}
                              id={id}
                              title={
                                String(row[resource.titleField] ?? row.slug ?? "this record")
                              }
                            />
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <ul className="mt-6 space-y-3 lg:hidden">
            {filtered.map((row) => {
              const id = String(row.id);
              const published = row.published === true;
              return (
                <li key={id} className="panel p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link
                        href={`/admin/${resource.key}/${id}`}
                        className="block font-display text-base font-medium tracking-tight text-bone"
                      >
                        {String(row[resource.titleField] ?? columnFallback(row))}
                      </Link>
                      {resource.subtitleField && row[resource.subtitleField] ? (
                        <p className="mt-1 truncate text-sm text-ash">
                          {String(row[resource.subtitleField])}
                        </p>
                      ) : null}
                    </div>
                    {resource.publishable ? (
                      <StatusPill active={published} />
                    ) : null}
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    {resource.publishable ? (
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        disabled={pending}
                        onClick={() =>
                          startTransition(() => {
                            void togglePublished(resource.key, id, !published);
                          })
                        }
                      >
                        {published ? "Unpublish" : "Publish"}
                      </Button>
                    ) : null}
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/admin/${resource.key}/${id}`}>Edit</Link>
                    </Button>
                    {resource.canDelete ? (
                      <DeleteButton
                        resourceKey={resource.key}
                        resourceLabel={resource.singular}
                        id={id}
                        title={String(row[resource.titleField] ?? "this record")}
                        compact
                      />
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}

function columnFallback(row: Row) {
  return String(row.slug ?? row.name ?? row.title ?? "Untitled");
}

function Cell({
  column,
  row,
  resource,
}: {
  column: ListColumn;
  row: Row;
  resource: ResourceDef;
}) {
  const value = row[column.name];
  const id = String(row.id);
  const isTitle = column.name === resource.titleField;

  if (column.type === "boolean") {
    return value ? (
      <span className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-signal">Yes</span>
    ) : (
      <span className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-ash-deep">No</span>
    );
  }

  if (column.type === "badge" && value) {
    return <StatusPill label={String(value).replace(/_/g, " ")} />;
  }

  if (column.type === "date") {
    return <span className="font-mono text-[0.6875rem] text-ash">{formatDate(value as string)}</span>;
  }

  if (value === null || value === undefined || value === "") {
    return <span className="text-ash-deep">—</span>;
  }

  if (isTitle) {
    return (
      <Link
        href={`/admin/${resource.key}/${id}`}
        className="font-medium text-bone transition-colors hover:text-signal"
      >
        {String(value)}
      </Link>
    );
  }

  return (
    <span className={cn("text-sm text-bone-dim", column.type === "truncate" && "line-clamp-1")}>
      {String(value)}
    </span>
  );
}

function DeleteButton({
  resourceKey,
  resourceLabel,
  id,
  title,
  compact,
}: {
  resourceKey: string;
  resourceLabel: string;
  id: string;
  title: string;
  compact?: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <span className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            startTransition(() => {
              void deleteResource(resourceKey, id);
            })
          }
          className="rounded-lg border border-red-500/50 bg-red-500/10 px-2.5 py-1.5 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-red-300 transition-colors hover:bg-red-500/20"
        >
          {pending ? "Deleting…" : "Confirm"}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="rounded-lg border border-steel px-2.5 py-1.5 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-ash transition-colors hover:text-bone"
        >
          Cancel
        </button>
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      aria-label={`Delete ${title}`}
      title={`Delete ${resourceLabel.toLowerCase()}`}
      className={cn(
        "flex items-center justify-center rounded-lg border border-steel text-ash transition-colors hover:border-red-500/50 hover:text-red-300",
        compact ? "px-2.5 py-1.5 font-mono text-[0.625rem] uppercase tracking-[0.12em]" : "size-8",
      )}
    >
      {compact ? "Delete" : <Trash2 className="size-3.5" />}
    </button>
  );
}
