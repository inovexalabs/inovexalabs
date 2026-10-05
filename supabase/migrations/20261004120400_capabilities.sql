-- Capabilities: the large "What We Build" pillars on the home page.
-- Their order (sort_order) is their visible number: 01, 02, 03 ...

create table public.capabilities (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null,
  visual text not null default 'interface',
  sort_order integer not null default 0,
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint capabilities_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  constraint capabilities_title_length check (char_length(title) between 2 and 60),
  constraint capabilities_description_length check (char_length(description) between 20 and 400),
  -- Keep in sync with lib/constants/capability-visuals.ts
  constraint capabilities_visual_check check (visual in ('interface', 'neural', 'shield', 'orbit'))
);

create index capabilities_status_sort_idx on public.capabilities (status, sort_order);

create trigger capabilities_set_updated_at
  before update on public.capabilities
  for each row execute function public.set_updated_at();

alter table public.capabilities enable row level security;

create policy "Published capabilities are public"
  on public.capabilities for select
  to anon, authenticated
  using (status = 'published');

create policy "Admins can read all capabilities"
  on public.capabilities for select
  to authenticated
  using ((select public.is_admin()));

create policy "Admins can create capabilities"
  on public.capabilities for insert
  to authenticated
  with check ((select public.is_admin()));

create policy "Admins can update capabilities"
  on public.capabilities for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "Admins can delete capabilities"
  on public.capabilities for delete
  to authenticated
  using ((select public.is_admin()));

-- Company statement shown with the capabilities. Optional: the section
-- renders without it.
alter table public.site_settings
  add column studio_statement text,
  add constraint site_settings_studio_statement_length
    check (studio_statement is null or char_length(studio_statement) between 20 and 280);

update public.site_settings
set studio_statement = 'We don''t just deliver software. We explore, engineer and turn ideas into systems people can actually use.'
where id = true and studio_statement is null;
