-- Brand assets editable from /admin/settings: the logo shown in the site
-- header and footer, and the browser favicon. Both are images in the public
-- media bucket under site/. When empty, the site falls back to the built-in
-- mark. Safe to run more than once.

alter table public.site_settings
  add column if not exists logo_path text,
  add column if not exists favicon_path text;

alter table public.site_settings
  drop constraint if exists site_settings_logo_path_format,
  add constraint site_settings_logo_path_format check (
    logo_path is null or logo_path ~ '^site/[A-Za-z0-9._-]+$'
  ),
  drop constraint if exists site_settings_favicon_path_format,
  add constraint site_settings_favicon_path_format check (
    favicon_path is null or favicon_path ~ '^site/[A-Za-z0-9._-]+$'
  );
