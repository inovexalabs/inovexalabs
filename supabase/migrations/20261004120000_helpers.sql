-- Shared types and trigger functions used by every content table.

create type public.content_status as enum ('draft', 'published', 'archived');

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
