-- "How We Work": the delivery process shown as a timeline on the homepage and
-- on /about. Public visitors see published rows only; admins manage everything.
-- Position in the list (sort_order) is the visible step number, exactly like
-- capabilities.

create table public.process_steps (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  short_description text not null,
  description text not null,
  icon text not null default 'compass',
  deliverables text[] not null default '{}',
  duration text,
  sort_order integer not null default 0,
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint process_steps_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  constraint process_steps_title_length check (char_length(title) between 2 and 60),
  constraint process_steps_short_length check (char_length(short_description) between 20 and 200),
  constraint process_steps_description_length check (char_length(description) between 40 and 900),
  -- Keep in sync with lib/constants/process-icons.ts
  constraint process_steps_icon_check check (
    icon in ('compass', 'search', 'layers', 'pen-tool', 'hammer', 'check', 'rocket')
  ),
  constraint process_steps_deliverables_valid check (public.is_valid_tags(deliverables, 8, 60)),
  constraint process_steps_duration_length check (duration is null or char_length(duration) between 2 and 40)
);

create index process_steps_status_sort_idx on public.process_steps (status, sort_order);

create trigger process_steps_set_updated_at
  before update on public.process_steps
  for each row execute function public.set_updated_at();

alter table public.process_steps enable row level security;

create policy "Published process steps are public"
  on public.process_steps for select
  to anon, authenticated
  using (status = 'published');

create policy "Admins can read all process steps"
  on public.process_steps for select
  to authenticated
  using ((select public.is_admin()));

create policy "Admins can create process steps"
  on public.process_steps for insert
  to authenticated
  with check ((select public.is_admin()));

create policy "Admins can update process steps"
  on public.process_steps for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "Admins can delete process steps"
  on public.process_steps for delete
  to authenticated
  using ((select public.is_admin()));
