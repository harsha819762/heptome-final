-- Add platform fee and provider payout tracking to payments
ALTER TABLE payments
  ADD COLUMN IF NOT EXISTS platform_fee FLOAT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS provider_payout FLOAT DEFAULT 0;

-- Add total_platform_revenue and total_provider_payout columns to service_providers for quick stats
ALTER TABLE service_providers
  ADD COLUMN IF NOT EXISTS total_earnings FLOAT DEFAULT 0;

-- Index for admin revenue aggregation
CREATE INDEX IF NOT EXISTS idx_payments_status_created
  ON payments (status, created_at DESC);
