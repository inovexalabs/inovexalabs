-- Repairs the https URL checks created by earlier migrations. They were written
-- as '[^\\s]', which Postgres reads as "not a backslash and not the letter s",
-- so every URL containing an "s" (including "https") was rejected. The earlier
-- files now use '[^\s]'; this migration brings already-migrated databases in
-- line and is safe to run on a fresh one.

create or replace function public.is_valid_social_links(items jsonb, max_items integer)
returns boolean
language sql
immutable
set search_path = ''
as $$
  select jsonb_typeof(items) = 'array'
    and jsonb_array_length(items) <= max_items
    and not exists (
      select 1
      from jsonb_array_elements(items) as item
      where jsonb_typeof(item) <> 'object'
        or jsonb_typeof(item -> 'label') is distinct from 'string'
        or jsonb_typeof(item -> 'url') is distinct from 'string'
        or char_length(btrim(item ->> 'label')) not between 2 and 30
        or item ->> 'url' !~ '^https://[^\s]+$'
    );
$$;

create or replace function public.is_valid_social_map(map jsonb)
returns boolean
language sql
immutable
set search_path = ''
as $$
  select jsonb_typeof(map) = 'object'
    and not exists (
      select 1
      from jsonb_each(map) as entry
      where entry.key not in (
        'github', 'linkedin', 'twitter', 'x', 'youtube', 'instagram', 'discord'
      )
      or jsonb_typeof(entry.value) is distinct from 'string'
      or (btrim(entry.value #>> '{}') <> '' and entry.value #>> '{}' !~ '^https://[^\s]+$')
    );
$$;

alter table public.projects
  drop constraint if exists projects_project_url_format,
  drop constraint if exists projects_github_url_format,
  add constraint projects_project_url_format check (
    project_url is null or project_url ~ '^https://[^\s]+$'
  ),
  add constraint projects_github_url_format check (
    github_url is null or github_url ~ '^https://[^\s]+$'
  );

alter table public.innovation_projects
  drop constraint if exists innovation_github_url_format,
  drop constraint if exists innovation_demo_url_format,
  add constraint innovation_github_url_format check (github_url is null or github_url ~ '^https://[^\s]+$'),
  add constraint innovation_demo_url_format check (demo_url is null or demo_url ~ '^https://[^\s]+$');

alter table public.technologies
  drop constraint if exists technologies_website_format,
  add constraint technologies_website_format check (website is null or website ~ '^https://[^\s]+$');

alter table public.blog_posts
  drop constraint if exists blog_canonical_url_format,
  add constraint blog_canonical_url_format check (canonical_url is null or canonical_url ~ '^https://[^\s]+$');

alter table public.site_settings
  drop constraint if exists site_settings_final_cta_href_format,
  add constraint site_settings_final_cta_href_format check (
    final_cta_href ~ '^(/[^\s]*|#[A-Za-z][A-Za-z0-9_-]*|https://[^\s]+)$'
  );

alter table public.navigation_items
  drop constraint if exists navigation_href_format,
  add constraint navigation_href_format check (
    href ~ '^(/[^\s]*|https://[^\s]+)$'
  );
