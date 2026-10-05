-- First-party page-view counter, as described in the cookie policy: page
-- path, referrer and a saltless one-way hash of network + client, nothing
-- that identifies a person. Enabled only when the operator sets an
-- analytics ID in site settings; the server action no-ops otherwise.
--
-- SECURITY: anyone may insert (a page view needs no session) but nobody but
-- an admin can read, and anonymous callers cannot update or delete — events
-- are append-only from the public API.

create table public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  path text not null,
  referrer text,
  property text,
  visitor_hash text,
  created_at timestamptz not null default now(),

  constraint analytics_path_length check (char_length(path) between 1 and 300),
  constraint analytics_path_format check (path ~ '^/[^ ]*$'),
  constraint analytics_referrer_length check (referrer is null or char_length(referrer) <= 500),
  constraint analytics_property_length check (property is null or char_length(property) between 2 and 64),
  constraint analytics_visitor_length check (visitor_hash is null or char_length(visitor_hash) between 8 and 64)
);

create index analytics_events_created_idx on public.analytics_events (created_at desc);
create index analytics_events_path_idx on public.analytics_events (path, created_at desc);

alter table public.analytics_events enable row level security;

create policy "Anyone can record a page view"
  on public.analytics_events for insert
  to anon, authenticated
  with check (true);

create policy "Admins can read analytics"
  on public.analytics_events for select
  to authenticated
  using ((select public.is_admin()));

create policy "Admins can prune analytics"
  on public.analytics_events for delete
  to authenticated
  using ((select public.is_admin()));
