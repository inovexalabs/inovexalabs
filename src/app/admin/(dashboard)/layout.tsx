import type { Metadata } from "next";
import { AdminShell, type AdminNavItem } from "@/components/admin/admin-shell";
import { signOutAdmin } from "@/actions/admin";
import { requireAdmin } from "@/lib/admin/auth";
import { RESOURCES } from "@/lib/admin/resources";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: "Control room",
  robots: "noindex,nofollow",
};

/**
 * Never prerender the administration area. These routes read the session cookie
 * and must be evaluated per request — a build-time render would see no session
 * and bake a redirect to the login screen into the output.
 */
export const dynamic = "force-dynamic";

/** Resources that get a live count badge in the sidebar. */
const COUNTED = ["inquiries", "products", "projects", "experiments", "insights"];

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Middleware already bounced unauthenticated traffic; this is the second,
  // authoritative check against the admin allowlist.
  const context = await requireAdmin();

  const counts = new Map<string, number>();
  if (isSupabaseConfigured) {
    const supabase = await createSupabaseServerClient();
    const results = await Promise.all(
      RESOURCES.filter((resource) => COUNTED.includes(resource.key)).map(async (resource) => {
        const { count } = await supabase
          .from(resource.table)
          .select("id", { count: "exact", head: true });
        return [resource.key, count ?? 0] as const;
      }),
    );
    for (const [key, count] of results) counts.set(key, count);
  }

  const nav: AdminNavItem[] = RESOURCES.map((resource) => ({
    key: resource.key,
    label: resource.label,
    icon: resource.icon,
    count: counts.get(resource.key),
  }));

  return (
    <AdminShell nav={nav} userEmail={context.email} signOutAction={signOutAdmin}>
      {children}
    </AdminShell>
  );
}
