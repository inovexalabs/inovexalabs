import { ButtonLink } from "@/components/ui/button";
import { ADMIN_HOME } from "@/lib/constants/admin-nav";

export default function AdminNotFound() {
  return (
    <div className="rounded-xl border border-line bg-surface p-8 shadow-xs">
      <h1 className="font-display text-h3 text-fg">Not found</h1>
      <p className="mt-2 max-w-reading text-fg-muted">
        This item doesn&apos;t exist. It may have been deleted, or the link is out of date.
      </p>
      <ButtonLink href={ADMIN_HOME} variant="outline" className="mt-6">
        Back to the admin
      </ButtonLink>
    </div>
  );
}
