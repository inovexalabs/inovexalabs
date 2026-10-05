-- Newsletter subscriptions from the footer form and /contact.
-- Anyone may subscribe; only admins can read, deactivate or remove rows.

create type public.subscriber_status as enum ('active', 'unsubscribed');

create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  status public.subscriber_status not null default 'active',
  source text not null default 'site',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint newsletter_email_format check (email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
  constraint newsletter_email_length check (char_length(email) <= 254),
  constraint newsletter_source_length check (char_length(source) between 2 and 40)
);

create index newsletter_status_idx on public.newsletter_subscribers (status, created_at desc);

create trigger newsletter_subscribers_set_updated_at
  before update on public.newsletter_subscribers
  for each row execute function public.set_updated_at();

alter table public.newsletter_subscribers enable row level security;

create policy "Anyone can subscribe"
  on public.newsletter_subscribers for insert
  to anon, authenticated
  with check (status = 'active');

create policy "Admins can read subscribers"
  on public.newsletter_subscribers for select
  to authenticated
  using ((select public.is_admin()));

create policy "Admins can update subscribers"
  on public.newsletter_subscribers for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "Admins can delete subscribers"
  on public.newsletter_subscribers for delete
  to authenticated
  using ((select public.is_admin()));
