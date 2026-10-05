import type { Metadata } from "next";
import { GlowOrb } from "@/components/animations/glow-orb";
import { LoginForm } from "@/components/forms/login-form";
import { Logo } from "@/components/layout/logo";
import { getSiteSettings } from "@/lib/supabase/queries/settings";
import { mediaUrl } from "@/lib/utils/storage-url";
import { safeAdminRedirect } from "@/lib/validations/auth";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

interface LoginPageProps {
  searchParams: Promise<{ next?: string | string[] }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const [{ next }, { data: settings }] = await Promise.all([searchParams, getSiteSettings()]);

  return (
    <main className="relative isolate grid min-h-dvh place-items-center overflow-hidden hero-wash px-gutter py-16">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 grid-lines" />
        <GlowOrb color="violet" size="lg" intensity="soft" className="-right-40 -top-40" />
      </div>
      <div className="w-full max-w-sm">
        <div className="flex justify-center">
          <Logo
            logoUrl={settings?.logo_path ? mediaUrl(settings.logo_path) : null}
            siteName={settings?.site_name}
          />
        </div>
        <div className="mt-8 rounded-xl border border-line bg-surface p-6 shadow-lg sm:p-8">
          <h1 className="font-display text-h3 text-fg">Sign in to the admin</h1>
          <p className="mt-2 text-sm text-fg-muted">For the Inovexa Labs team. Accounts are created by the site owner.</p>
          <div className="mt-6">
            <LoginForm next={safeAdminRedirect(Array.isArray(next) ? next[0] : next)} />
          </div>
        </div>
      </div>
    </main>
  );
}
