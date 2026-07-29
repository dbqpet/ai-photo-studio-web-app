-- Idempotency ledger for Stripe checkout sessions.
--
-- Credit grants (preview_credits / hd_unlocks) can now be triggered from two
-- independent places for the same purchase: the Stripe webhook (source of
-- truth) AND a client-side fallback call (/api/verify-payment) that covers
-- cases where the webhook is delayed, misconfigured, or not running in local
-- dev. Recording processed session ids here lets both paths call the same
-- "grant once" helper safely — whichever runs first performs the grant, the
-- second becomes a no-op.

create table if not exists public.processed_stripe_sessions (
  session_id text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.processed_stripe_sessions enable row level security;

-- Only the service role touches this table (webhook + verify-payment run
-- with the service-role admin client); no public policies are needed.
