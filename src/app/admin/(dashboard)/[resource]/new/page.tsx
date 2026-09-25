import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ResourceForm } from "@/components/admin/resource-form";
import { saveResource } from "@/actions/admin";
import { allFields, getResource, groupFields } from "@/lib/admin/resources";

export const dynamic = "force-dynamic";

export default async function NewResourcePage({
  params,
}: {
  params: Promise<{ resource: string }>;
}) {
  const { resource: resourceKey } = await params;
  const resource = getResource(resourceKey);
  if (!resource) notFound();

  if (!resource.canCreate) {
    redirect(`/admin/${resource.key}`);
  }

  // Fields marked editOnly (the slug) are generated on create, not typed.
  const groups = groupFields(allFields(resource).filter((field) => !field.editOnly));

  const action = saveResource.bind(null, resource.key, null);

  return (
    <div>
      <header className="mb-8">
        <Link
          href={`/admin/${resource.key}`}
          className="mono-label inline-flex items-center gap-2 text-ash transition-colors hover:text-bone"
        >
          <ArrowLeft className="size-3" />
          {resource.label}
        </Link>
        <h1 className="mt-5 font-display text-3xl font-medium tracking-tight text-bone">
          New {resource.singular.toLowerCase()}
        </h1>
        <p className="mt-2.5 text-sm leading-relaxed text-ash">
          The slug is generated from the title. Leave Published off until the content is ready —
          unpublished records never reach the site or the sitemap.
        </p>
      </header>

      <ResourceForm
        action={action}
        groups={groups}
        defaults={{}}
        isCreate
        cancelHref={`/admin/${resource.key}`}
      />
    </div>
  );
}
