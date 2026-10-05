-- Project intake from /contact, and the admin-only lead pipeline behind
-- /admin/leads.
--
-- SECURITY: anyone may submit a lead (the public form needs no session), but
-- only admins can ever read them. There is no anon SELECT policy, so leads are
-- invisible to the public API even if a query is written by mistake.

create type public.lead_status as enum (
  'new', 'contacted', 'qualified', 'proposal',
  'negotiation', 'won', 'lost', 'archived'
);

create type public.lead_priority as enum ('low', 'normal', 'high', 'urgent');

create table public.contact_leads (
  id uuid primary key default gen_random_uuid(),
  reference_id text not null unique,
  name text not null,
  email text not null,
  phone text,
  company text,
  project_type text not null default 'Other',
  budget text,
  timeline text,
  services text[] not null default '{}',
  description text not null,
  source text not null default 'contact-form',
  status public.lead_status not null default 'new',
  priority public.lead_priority not null default 'normal',
  assigned_to uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint contact_leads_reference_format check (reference_id ~ '^INX-[A-Z0-9]{6}$'),
  constraint contact_leads_name_length check (char_length(name) between 2 and 80),
  constraint contact_leads_email_format check (email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
  constraint contact_leads_phone_length check (phone is null or char_length(phone) between 5 and 30),
  constraint contact_leads_company_length check (company is null or char_length(company) between 2 and 80),
  constraint contact_leads_project_type_length check (char_length(project_type) between 2 and 40),
  constraint contact_leads_budget_length check (budget is null or char_length(budget) between 2 and 40),
  constraint contact_leads_timeline_length check (timeline is null or char_length(timeline) between 2 and 40),
  constraint contact_leads_services_valid check (public.is_valid_tags(services, 8, 40)),
  constraint contact_leads_description_length check (char_length(description) between 10 and 5000),
  constraint contact_leads_source_length check (char_length(source) between 2 and 40),
  -- Only admins may set or change the pipeline fields.
  constraint contact_leads_pipeline_owned check (
    status in ('new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost', 'archived')
    and priority in ('low', 'normal', 'high', 'urgent')
  )
);

create index contact_leads_status_idx on public.contact_leads (status, created_at desc);
create index contact_leads_created_idx on public.contact_leads (created_at desc);
create index contact_leads_email_idx on public.contact_leads (lower(email));

create trigger contact_leads_set_updated_at
  before update on public.contact_leads
  for each row execute function public.set_updated_at();

alter table public.contact_leads enable row level security;

create policy "Anyone can submit a lead"
  on public.contact_leads for insert
  to anon, authenticated
  with check (true);

create policy "Admins can read leads"
  on public.contact_leads for select
  to authenticated
  using ((select public.is_admin()));

create policy "Admins can update leads"
  on public.contact_leads for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "Admins can delete leads"
  on public.contact_leads for delete
  to authenticated
  using ((select public.is_admin()));

-- Internal notes an admin attaches to a lead. Never readable outside the admin.
create table public.lead_notes (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.contact_leads (id) on delete cascade,
  author_id uuid not null,
  note text not null,
  created_at timestamptz not null default now(),

  constraint lead_notes_note_length check (char_length(note) between 2 and 2000)
);

create index lead_notes_lead_idx on public.lead_notes (lead_id, created_at desc);

alter table public.lead_notes enable row level security;

create policy "Admins can read lead notes"
  on public.lead_notes for select
  to authenticated
  using ((select public.is_admin()));

create policy "Admins can add lead notes"
  on public.lead_notes for insert
  to authenticated
  with check ((select public.is_admin()) and author_id = (select auth.uid()));

create policy "Admins can delete lead notes"
  on public.lead_notes for delete
  to authenticated
  using ((select public.is_admin()));
