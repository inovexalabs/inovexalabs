import { SettingsEditor, type EditableSetting } from "@/components/admin/settings-editor";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";

const KNOWN_KEYS = ["company", "hero", "seo_defaults", "socials"];

export default async function AdminSettingsPage() {
  if (!isSupabaseConfigured) {
    return (
      <p className="max-w-xl text-sm leading-relaxed text-bone-dim">
        Supabase is not configured, so settings cannot be loaded.
      </p>
    );
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .neq("group_name", "internal")
    .order("group_name");

  if (error) {
    console.error("[inovexa:admin:settings:list]", error);
  }

  const rows = (data ?? []) as {
    key: string;
    group_name: string;
    label: string;
    value: Record<string, unknown>;
  }[];

  // Surface the settings that drive the site first, then anything else.
  const ordered = [
    ...rows.filter((row) => KNOWN_KEYS.includes(row.key)),
    ...rows.filter((row) => !KNOWN_KEYS.includes(row.key)),
  ];

  const settings: EditableSetting[] = ordered.map((row) => ({
    key: row.key,
    group_name: row.group_name,
    label: row.label,
    value: row.value ?? {},
  }));

  return (
    <div>
      <header className="mb-8">
        <h1 className="font-display text-3xl font-medium tracking-tight text-bone">Settings</h1>
        <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-ash">
          Company information, homepage copy and SEO defaults. These values feed the header,
          footer, hero, structured data and every metadata fallback on the site.
        </p>
      </header>

      {settings.length === 0 ? (
        <p className="max-w-xl rounded-[var(--radius-panel)] border border-dashed border-steel bg-carbon/60 p-6 text-sm leading-relaxed text-ash">
          No settings rows found. Run the seed migration (
          <code className="font-mono text-bone">supabase/migrations/0003_seed.sql</code>) to create
          the default groups.
        </p>
      ) : (
        <SettingsEditor settings={settings} />
      )}
    </div>
  );
}
