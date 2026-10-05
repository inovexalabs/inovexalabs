import { Container } from "@/components/layout/container";
import { HeaderShell } from "@/components/layout/header-shell";
import { Logo } from "@/components/layout/logo";
import { DesktopNav } from "@/components/navigation/desktop-nav";
import { MobileNav } from "@/components/navigation/mobile-nav";
import { SolutionsMenu } from "@/components/navigation/solutions-menu";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { PRIMARY_CTA } from "@/lib/constants/routes";
import { getServiceSummaries } from "@/lib/supabase/queries/services";
import { getSiteSettings } from "@/lib/supabase/queries/settings";
import { mediaUrl } from "@/lib/utils/storage-url";

/** Global site header. Fetches published services on the server for the Solutions menus. */
export async function SiteHeader() {
  const [{ data: services }, { data: settings }] = await Promise.all([getServiceSummaries(), getSiteSettings()]);

  return (
    <HeaderShell>
      {/* `relative` makes this container the positioning context for the mega menu panel. */}
      <Container size="wide" className="relative flex h-full items-center justify-between gap-6">
        <Logo logoUrl={settings?.logo_path ? mediaUrl(settings.logo_path) : null} siteName={settings?.site_name} />

        <DesktopNav solutionsMenu={<SolutionsMenu services={services} variant="panel" />} />

        <div className="flex items-center gap-2">
          <MagneticButton href={PRIMARY_CTA.href} size="sm" wrapperClassName="hidden sm:inline-flex">
            {PRIMARY_CTA.label}
          </MagneticButton>
          <MobileNav solutionsMenu={<SolutionsMenu services={services} variant="list" />} />
        </div>
      </Container>
    </HeaderShell>
  );
}
