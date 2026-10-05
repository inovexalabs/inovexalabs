import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { AccessDenied } from "@/components/admin/access-denied";
import { AdminShell } from "@/components/admin/admin-shell";
import { getAdminSession, getCurrentUser } from "@/lib/supabase/auth";
import { getSiteSettings } from "@/lib/supabase/queries/settings";
import { mediaUrl } from "@/lib/utils/storage-url";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Admin | Inovexa Labs" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin");

  const session = await getAdminSession();
  if (!session) return <AccessDenied email={user.email} />;

  const { data: settings } = await getSiteSettings();
  const brand = {
    logoUrl: settings?.logo_path ? mediaUrl(settings.logo_path) : null,
    siteName: settings?.site_name ?? null,
  };

  return (
    <AdminShell session={session} brand={brand}>
      {children}
    </AdminShell>
  );
}
