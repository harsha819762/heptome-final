-- Heptome Supabase Schema
-- Run this in Supabase SQL Editor

-- 1. Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Enums
CREATE TYPE user_role AS ENUM ('CUSTOMER', 'PROVIDER', 'ADMIN');
CREATE TYPE service_type AS ENUM ('BARBER', 'PLUMBER', 'ELECTRICIAN', 'CLEANER', 'CARPENTER', 'PAINTER', 'AC_REPAIR', 'APPLIANCE_REPAIR', 'PEST_CONTROL', 'BEAUTICIAN', 'MASSAGE', 'YOGA_TRAINER', 'HOME_NURSE', 'TUTOR');
CREATE TYPE booking_status AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'DISPUTED');
CREATE TYPE sender_type AS ENUM ('CUSTOMER', 'PROVIDER');
CREATE TYPE message_type AS ENUM ('TEXT', 'IMAGE', 'LOCATION', 'CALL');
CREATE TYPE payment_method AS ENUM ('CARD', 'UPI', 'WALLET', 'COD', 'NET_BANKING');
CREATE TYPE payment_status AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED');
CREATE TYPE notification_type AS ENUM ('NEW_BOOKING', 'BOOKING_ACCEPTED', 'BOOKING_REJECTED', 'BOOKING_STARTED', 'BOOKING_COMPLETED', 'NEW_MESSAGE', 'PAYMENT_RECEIVED', 'REVIEW_RECEIVED');
CREATE TYPE earning_type AS ENUM ('BOOKING_PAYMENT', 'BONUS', 'TIP', 'REFERRAL');
CREATE TYPE earning_status AS ENUM ('PENDING', 'PAID', 'CANCELLED');

-- 3. Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  image TEXT,
  role user_role DEFAULT 'CUSTOMER',
  phone TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (auth_id, email, name, image, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 4. Service Providers
CREATE TABLE service_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  service_types service_type[] DEFAULT '{}',
  bio TEXT,
  experience INT DEFAULT 0,
  rating FLOAT DEFAULT 0,
  total_jobs INT DEFAULT 0,
  completion_rate FLOAT DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  latitude FLOAT,
  longitude FLOAT,
  address TEXT,
  phone TEXT,
  portfolio TEXT[] DEFAULT '{}',
  id_proof TEXT,
  certificate TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Bookings
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES profiles(id) NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address JSONB NOT NULL,
  provider_id UUID REFERENCES service_providers(id),
  service_type service_type NOT NULL,
  service_name TEXT NOT NULL,
  service_description TEXT,
  special_instructions TEXT,
  scheduled_date DATE NOT NULL,
  scheduled_time TEXT NOT NULL,
  estimated_duration INT NOT NULL,
  status booking_status DEFAULT 'PENDING',
  base_price FLOAT NOT NULL,
  add_on_price FLOAT DEFAULT 0,
  discount FLOAT DEFAULT 0,
  total_price FLOAT NOT NULL,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  before_photos TEXT[] DEFAULT '{}',
  after_photos TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  sender_type sender_type NOT NULL,
  provider_id UUID REFERENCES service_providers(id),
  message TEXT NOT NULL,
  message_type message_type DEFAULT 'TEXT',
  media_url TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Payments
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) UNIQUE NOT NULL,
  amount FLOAT NOT NULL,
  method payment_method NOT NULL,
  status payment_status DEFAULT 'PENDING',
  transaction_id TEXT,
  gateway_response JSONB,
  refund_amount FLOAT,
  refunded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 8. Reviews
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) NOT NULL,
  profile_id UUID REFERENCES profiles(id) NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  images TEXT[] DEFAULT '{}',
  is_verified BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT true,
  helpful_count INT DEFAULT 0,
  provider_response TEXT,
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 9. Addresses
CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  street TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  latitude FLOAT,
  longitude FLOAT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 10. Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type notification_type NOT NULL,
  booking_id UUID,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 11. Earnings
CREATE TABLE earnings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES service_providers(id) NOT NULL,
  amount FLOAT NOT NULL,
  type earning_type NOT NULL,
  description TEXT,
  booking_id UUID,
  status earning_status DEFAULT 'PENDING',
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 12. Indexes
CREATE INDEX idx_bookings_customer ON bookings(customer_id);
CREATE INDEX idx_bookings_provider ON bookings(provider_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_service_type ON bookings(service_type);
CREATE INDEX idx_messages_booking ON messages(booking_id);
CREATE INDEX idx_notifications_profile ON notifications(profile_id);
CREATE INDEX idx_notifications_unread ON notifications(profile_id) WHERE is_read = false;
CREATE INDEX idx_earnings_provider ON earnings(provider_id);
CREATE INDEX idx_service_providers_type ON service_providers USING GIN (service_types);

-- 13. Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE earnings ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read own profile, admins read all
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT USING (auth_id = auth.uid());
CREATE POLICY "profiles_select_admin" ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE auth_id = auth.uid() AND role = 'ADMIN')
);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth_id = auth.uid());

-- Service Providers: anyone can read, only provider can update own
CREATE POLICY "sp_select_all" ON service_providers FOR SELECT USING (true);
CREATE POLICY "sp_insert_own" ON service_providers FOR INSERT WITH CHECK (
  profile_id IN (SELECT id FROM profiles WHERE auth_id = auth.uid())
);
CREATE POLICY "sp_update_own" ON service_providers FOR UPDATE USING (
  profile_id IN (SELECT id FROM profiles WHERE auth_id = auth.uid())
);

-- Bookings: customer sees own, provider sees assigned, admin sees all
CREATE POLICY "bookings_select" ON bookings FOR SELECT USING (
  customer_id IN (SELECT id FROM profiles WHERE auth_id = auth.uid())
  OR provider_id IN (SELECT id FROM service_providers WHERE profile_id IN (SELECT id FROM profiles WHERE auth_id = auth.uid()))
  OR EXISTS (SELECT 1 FROM profiles WHERE auth_id = auth.uid() AND role = 'ADMIN')
);
CREATE POLICY "bookings_insert" ON bookings FOR INSERT WITH CHECK (
  customer_id IN (SELECT id FROM profiles WHERE auth_id = auth.uid())
);

-- Notifications: user sees own
CREATE POLICY "notifications_select" ON notifications FOR SELECT USING (
  profile_id IN (SELECT id FROM profiles WHERE auth_id = auth.uid())
);
CREATE POLICY "notifications_update" ON notifications FOR UPDATE USING (
  profile_id IN (SELECT id FROM profiles WHERE auth_id = auth.uid())
);

-- Enable realtime for bookings and notifications
ALTER PUBLICATION supabase_realtime ADD TABLE bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
