-- Run only on a dedicated DV database after review. No customer identifiers or exact coordinates.
create table public.towing_quotes (
 id text primary key check (id ~ '^[0-9a-f]{64}$'),
 quoted_on date not null,
 service_id text not null check (service_id in ('general-towing','winch-out-recovery')),
 pickup_area text not null,
 destination_area text not null,
 rate_id text not null,
 quote jsonb not null,
 consent boolean not null default false,
 approved boolean not null default false,
 check (not approved or consent)
);
alter table public.towing_quotes enable row level security;
revoke all on public.towing_quotes from public, anon, authenticated, service_role;
grant select, insert on public.towing_quotes to service_role;
create index towing_quote_service_date on public.towing_quotes(service_id,quoted_on desc) where approved and consent;
create index towing_quote_pickup_date on public.towing_quotes(pickup_area,quoted_on desc) where approved and consent;
create index towing_quote_destination_date on public.towing_quotes(destination_area,quoted_on desc) where approved and consent;
-- Owner reviews consented rows in SQL/dashboard; approve or withdraw by id.
-- Do not grant client access. Add infrastructure-level request rate limiting before enabling capture.

-- Append-only owner-published rate schedules. Unique predecessor prevents concurrent stale publications.
create table public.towing_rate_versions (
 id uuid primary key,
 previous_id text not null unique,
 effective_at timestamptz not null default clock_timestamp(),
 rates jsonb not null check (jsonb_typeof(rates)='object'),
 created_by uuid not null
);
alter table public.towing_rate_versions enable row level security;
revoke all on public.towing_rate_versions from public, anon, authenticated, service_role;
grant select, insert on public.towing_rate_versions to service_role;
create index towing_rate_effective on public.towing_rate_versions(effective_at desc);
