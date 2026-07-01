-- Production scalability indexes
-- These optimize the most common query patterns for high traffic

-- Provider dashboard: finding PENDING bookings matching provider service types
CREATE INDEX IF NOT EXISTS idx_bookings_pending_service
  ON bookings (status, service_type)
  WHERE status = 'PENDING';

-- Provider dashboard: finding bookings assigned to a provider
CREATE INDEX IF NOT EXISTS idx_bookings_provider_status
  ON bookings (provider_id, status);

-- Customer my-bookings page: finding customer's bookings
CREATE INDEX IF NOT EXISTS idx_bookings_customer_status
  ON bookings (customer_id, status);

-- Admin dashboard: revenue aggregation
CREATE INDEX IF NOT EXISTS idx_bookings_completed_price
  ON bookings (total_price)
  WHERE status = 'COMPLETED';

-- Notifications: unread count for badge
CREATE INDEX IF NOT EXISTS idx_notifications_unread_profile
  ON notifications (profile_id, is_read)
  WHERE is_read = false;

-- Messages: latest messages per booking
CREATE INDEX IF NOT EXISTS idx_messages_booking_created
  ON messages (booking_id, created_at DESC);

-- Earnings: provider payout aggregation
CREATE INDEX IF NOT EXISTS idx_earnings_provider_status
  ON earnings (provider_id, status);
