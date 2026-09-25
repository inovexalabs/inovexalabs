"use client";

import { useActionState, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, Plus, Save } from "lucide-react";
import { saveSettings } from "@/actions/settings";
import { SETTINGS_IDLE } from "@/lib/admin/form-state";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface EditableSetting {
  key: string;
  group_name: string;
  label: string;
  value: Record<string, unknown>;
}

const FIELD_LABELS: Record<string, string> = {
  name: "Company name",
  legalName: "Legal name",
  positioning: "Positioning statement",
  promise: "Brand promise",
  supportingLine: "Supporting line",
  shortDescription: "Short description",
  email: "Contact email",
  phone: "Phone",
  addressLine: "Street address",
  city: "City",
  region: "Region / state",
  country: "Country",
  countryCode: "Country code",
  postalCode: "Postal code",
  latitude: "Latitude",
  longitude: "Longitude",
  businessHours: "Business hours",
  founded: "Founded",
  eyebrow: "Eyebrow",
  headlineLine1: "Headline line 1",
  headlineLine2: "Headline line 2",
  supporting: "Supporting paragraph",
  primaryCtaLabel: "Primary CTA label",
  primaryCtaHref: "Primary CTA link",
  secondaryCtaLabel: "Secondary CTA label",
  secondaryCtaHref: "Secondary CTA link",
  titleTemplate: "Title template",
  defaultTitle: "Default title",
  defaultDescription: "Default description",
  ogImageUrl: "Default OG image URL",
  twitterHandle: "Twitter/X handle",
  robots: "Default robots",
  x: "X (Twitter)",
  linkedin: "LinkedIn",
  github: "GitHub",
  instagram: "Instagram",
};

function humanise(key: string) {
  return (
    FIELD_LABELS[key] ??
    key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (c) => c.toUpperCase())
      .trim()
  );
}

/**
 * Structured editor for the JSON-valued settings groups.
 *
 * Editors see labelled fields rather than raw JSON. The component keeps the
 * object in state and submits it as JSON through a hidden input, so the server
 * action still validates a single well-formed value per setting. An advanced
 * view exposes the raw JSON for anything the structured view does not cover.
 */
export function SettingsEditor({ settings }: { settings: EditableSetting[] }) {
  const [state, formAction, pending] = useActionState(saveSettings, SETTINGS_IDLE);

  const initial = useMemo(() => {
    const map: Record<string, Record<string, unknown>> = {};
    for (const setting of settings) map[setting.key] = { ...setting.value };
    return map;
  }, [settings]);

  const [values, setValues] = useState(initial);
  const [advanced, setAdvanced] = useState<Record<string, boolean>>({});

  const setField = (key: string, field: string, next: unknown) => {
    setValues((prev) => ({ ...prev, [key]: { ...prev[key], [field]: next } }));
  };

  const groups = useMemo(() => {
    const map = new Map<string, EditableSetting[]>();
    for (const setting of settings) {
      const bucket = map.get(setting.group_name) ?? [];
      bucket.push(setting);
      map.set(setting.group_name, bucket);
    }
    return Array.from(map.entries());
  }, [settings]);

  return (
    <form action={formAction}>
      {state.status === "success" && state.message ? (
        <p
          role="status"
          className="mb-7 flex items-center gap-3 rounded-xl border border-signal/40 bg-signal/[0.07] p-4 text-sm text-bone"
        >
          <CheckCircle2 className="size-4 shrink-0 text-signal" />
          {state.message}
        </p>
      ) : null}

      {state.status === "error" && state.message ? (
        <div
          role="alert"
          className="mb-7 flex items-start gap-3 rounded-xl border border-red-500/40 bg-red-500/[0.07] p-4"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-red-400" />
          <div className="text-sm leading-relaxed text-red-200">
            <p>{state.message}</p>
            {state.errors ? (
              <ul className="mt-2 space-y-1 font-mono text-[0.6875rem]">
                {Object.entries(state.errors).map(([key, message]) => (
                  <li key={key}>
                    {key}: {message}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="space-y-8">
        {groups.map(([groupName, items]) => (
          <section key={groupName} className="panel p-6">
            <h2 className="mono-label text-signal capitalize">{groupName.replace(/_/g, " ")}</h2>

            {items.map((setting) => {
              const value = values[setting.key] ?? {};
              const fields = Object.keys(value);
              const isAdvanced = advanced[setting.key] === true;

              return (
                <div key={setting.key} className="mt-7 border-t border-steel pt-7 first:mt-6 first:border-0 first:pt-0">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="font-display text-base font-medium tracking-tight text-bone">
                      {setting.label}
                    </h3>
                    <button
                      type="button"
                      onClick={() =>
                        setAdvanced((prev) => ({ ...prev, [setting.key]: !isAdvanced }))
                      }
                      aria-pressed={isAdvanced}
                      className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-ash-deep transition-colors hover:text-signal"
                    >
                      {isAdvanced ? "Structured view" : "Raw JSON"}
                    </button>
                  </div>

                  <input type="hidden" name={`value:${setting.key}`} value={JSON.stringify(value)} />
                  <input type="hidden" name="__keys" value={setting.key} />

                  {isAdvanced ? (
                    <div className="mt-5">
                      <Label htmlFor={`raw:${setting.key}`}>Raw JSON value</Label>
                      <Textarea
                        id={`raw:${setting.key}`}
                        defaultValue={JSON.stringify(value, null, 2)}
                        spellCheck={false}
                        className="min-h-56 font-mono text-[0.8125rem]"
                        onChange={(event) => {
                          try {
                            const parsed = JSON.parse(event.target.value) as Record<string, unknown>;
                            setValues((prev) => ({ ...prev, [setting.key]: parsed }));
                          } catch {
                            // Leave the last valid value in place; the action
                            // reports invalid JSON rather than silently saving it.
                          }
                        }}
                      />
                      <p className="mt-2 text-xs leading-relaxed text-ash-deep">
                        Editing raw JSON. The saved value follows the valid text you last typed.
                      </p>
                    </div>
                  ) : (
                    <div className="mt-5 grid gap-5 sm:grid-cols-2">
                      {fields.length === 0 ? (
                        <p className="text-sm text-ash">This setting has no fields yet.</p>
                      ) : null}
                      {fields.map((field) => {
                        const fieldValue = value[field];
                        const isLong =
                          typeof fieldValue === "string" && fieldValue.length > 90;

                        return (
                          <div
                            key={field}
                            className={cn(isLong && "sm:col-span-2")}
                          >
                            <Label htmlFor={`${setting.key}.${field}`}>
                              {humanise(field)}
                            </Label>
                            {typeof fieldValue === "boolean" ? (
                              <label className="flex items-center gap-3 rounded-xl border border-steel bg-carbon px-4 py-3">
                                <input
                                  id={`${setting.key}.${field}`}
                                  type="checkbox"
                                  checked={fieldValue}
                                  onChange={(event) =>
                                    setField(setting.key, field, event.target.checked)
                                  }
                                  className="size-4 accent-[var(--color-signal)]"
                                />
                                <span className="text-sm text-bone-dim">
                                  {fieldValue ? "Enabled" : "Disabled"}
                                </span>
                              </label>
                            ) : isLong ? (
                              <Textarea
                                id={`${setting.key}.${field}`}
                                value={String(fieldValue ?? "")}
                                onChange={(event) =>
                                  setField(setting.key, field, event.target.value)
                                }
                                className="min-h-24"
                              />
                            ) : typeof fieldValue === "string" ? (
                              <Input
                                id={`${setting.key}.${field}`}
                                value={fieldValue}
                                onChange={(event) =>
                                  setField(setting.key, field, event.target.value)
                                }
                              />
                            ) : (
                              <Textarea
                                id={`${setting.key}.${field}`}
                                value={JSON.stringify(fieldValue, null, 2)}
                                spellCheck={false}
                                onChange={(event) => {
                                  try {
                                    setField(setting.key, field, JSON.parse(event.target.value));
                                  } catch {
                                    // Keep the last valid value.
                                  }
                                }}
                                className="min-h-24 font-mono text-[0.8125rem]"
                              />
                            )}

                            {field === "addressLine" || field === "latitude" ? (
                              <p className="mt-1.5 text-xs leading-relaxed text-ash-deep">
                                Only fill this in if it is a real location. LocalBusiness
                                structured data is emitted only from accurate details.
                              </p>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </section>
        ))}

        {/* Add a new settings group for anything the registry does not model. */}
        <section className="panel p-6">
          <h2 className="mono-label text-ash-deep">
            <Plus className="mr-2 inline size-3" />
            Add a setting
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ash">
            Settings are key/value JSON, so new groups can be added without a database migration.
            Use this for content that has no dedicated content type.
          </p>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="new_key">Key</Label>
              <Input id="new_key" name="new_key" placeholder="announcement" />
            </div>
            <div>
              <Label htmlFor="new_label">Label</Label>
              <Input id="new_label" name="new_label" placeholder="Site announcement" />
            </div>
            <div>
              <Label htmlFor="new_group">Group</Label>
              <Input id="new_group" name="new_group" placeholder="homepage" defaultValue="general" />
            </div>
            <div>
              <Label htmlFor="new_value">Value (JSON)</Label>
              <Input id="new_value" name="new_value" placeholder='{"enabled":false,"text":""}' />
            </div>
          </div>
        </section>
      </div>

      <div className="lab-glass sticky bottom-0 z-20 mt-8 flex flex-wrap items-center gap-3 border-t border-steel py-4">
        <Button type="submit" disabled={pending}>
          {pending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Saving…
            </>
          ) : (
            <>
              <Save className="size-4" />
              Save settings
            </>
          )}
        </Button>
        <p className="text-xs leading-relaxed text-ash-deep">
          Saving invalidates the settings, SEO and layout caches immediately.
        </p>
      </div>
    </form>
  );
}
