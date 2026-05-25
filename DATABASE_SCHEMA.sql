-- Girnar Tirth Yatra Database Schema for Supabase
-- Execute these SQL commands in Supabase SQL Editor

-- ============== UPASHRAYS TABLE ==============
CREATE TABLE upashrays (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(255) NOT NULL,
  village VARCHAR(255) NOT NULL,
  route VARCHAR(255),
  trusty VARCHAR(255),
  mobile VARCHAR(20),
  location VARCHAR(500),
  description TEXT,
  before_img VARCHAR(500),
  process_img VARCHAR(500),
  after_img VARCHAR(500),
  status VARCHAR(50) DEFAULT 'plan' CHECK (status IN ('plan', 'process', 'done')),
  slug VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============== MEMBERS TABLE ==============
CREATE TABLE members (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  code VARCHAR(20) UNIQUE,
  has_access BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============== JINALAYAS TABLE ==============
CREATE TABLE jinalayas (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(255) NOT NULL,
  village VARCHAR(255),
  route VARCHAR(255),
  mulnayak VARCHAR(255),
  location VARCHAR(500),
  description TEXT,
  before_img VARCHAR(500),
  process_img VARCHAR(500),
  after_img VARCHAR(500),
  status VARCHAR(50) DEFAULT 'plan' CHECK (status IN ('plan', 'process', 'done')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============== YATRA DATES TABLE ==============
CREATE TABLE yatra_dates (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  trip_date DATE NOT NULL,
  description TEXT,
  image VARCHAR(500),
  registration_open BOOLEAN DEFAULT FALSE,
  price_per_person NUMERIC DEFAULT 900,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============== SPONSORSHIP SCHEMES TABLE ==============
-- Admin-managed sponsor/labharthi options that apply universally across trips.
CREATE TABLE sponsorship_schemes (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  amount NUMERIC NOT NULL DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Generic payment intent table that can be used by sponsorship and future payment modules.
CREATE TABLE payment_intents (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  module_key VARCHAR(100) NOT NULL,
  reference_type VARCHAR(100),
  reference_id VARCHAR(100),
  payer_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(255),
  city VARCHAR(255),
  amount NUMERIC NOT NULL DEFAULT 0,
  currency VARCHAR(10) DEFAULT 'INR',
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'cancelled')),
  gateway_order_id VARCHAR(255),
  gateway_payment_id VARCHAR(255),
  refund_status VARCHAR(50) DEFAULT 'not_requested' CHECK (refund_status IN ('not_requested', 'requested', 'processed', 'failed')),
  refund_transaction_id VARCHAR(255),
  refund_contact VARCHAR(20),
  refund_notes TEXT,
  refund_requested_at TIMESTAMP,
  refund_processed_at TIMESTAMP,
  admin_notes TEXT,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============== YATRIK REGISTRATIONS TABLE ==============
-- KEY CHANGE: Using birthdate instead of age, age can be calculated on frontend
CREATE TABLE yatrik_registrations (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  alt_phone VARCHAR(20),
  birthdate DATE NOT NULL,  -- NEW: Store birthdate instead of age
  gender VARCHAR(50),
  remarks TEXT,
  yatra_id BIGINT REFERENCES yatra_dates(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============== CHECKING REPORTS TABLE ==============
CREATE TABLE checking_reports (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  upashray_id BIGINT REFERENCES upashrays(id) ON DELETE CASCADE,
  report_date DATE DEFAULT CURRENT_DATE,
  points JSONB,  -- Array of checking points with descriptions and status
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============== CONTACT MESSAGES TABLE ==============
CREATE TABLE contact_messages (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(255),
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============== UPASHRAY MEDIA TABLE ==============
CREATE TABLE upashray_media (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  upashray_id BIGINT NOT NULL REFERENCES upashrays(id) ON DELETE CASCADE,
  media_type VARCHAR(50) NOT NULL CHECK (media_type IN ('before', 'process', 'after', 'gallery')),
  file_url VARCHAR(500) NOT NULL,
  alt_text TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============== SITE SETTINGS TABLE ==============
-- Stores editable public content such as contact info, footer copy, yatra notices, and homepage blocks.
CREATE TABLE site_settings (
  setting_key VARCHAR(100) PRIMARY KEY,
  setting_value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============== ADMIN PROFILES TABLE ==============
-- Pair this with Supabase Auth so access control stays tied to auth.users.
CREATE TABLE admin_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'admin' CHECK (role IN ('admin', 'editor', 'member')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============== AUDIT LOGS TABLE ==============
CREATE TABLE audit_logs (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  actor_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id VARCHAR(100),
  action VARCHAR(50) NOT NULL,
  changes JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============== INDEXES FOR PERFORMANCE ==============
CREATE INDEX idx_upashrays_status ON upashrays(status);
CREATE INDEX idx_upashrays_slug ON upashrays(slug);
CREATE INDEX idx_members_email ON members(email);
CREATE INDEX idx_members_has_access ON members(has_access);
CREATE INDEX idx_yatrik_yatra_id ON yatrik_registrations(yatra_id);
CREATE INDEX idx_yatrik_created_at ON yatrik_registrations(created_at);
CREATE INDEX idx_yatra_dates_trip_date ON yatra_dates(trip_date);
CREATE INDEX idx_sponsorship_schemes_active ON sponsorship_schemes(is_active);
CREATE INDEX idx_sponsorship_schemes_sort_order ON sponsorship_schemes(sort_order);
CREATE INDEX idx_payment_intents_module_key ON payment_intents(module_key);
CREATE INDEX idx_payment_intents_status ON payment_intents(status);
CREATE INDEX idx_payment_intents_reference ON payment_intents(reference_type, reference_id);
CREATE INDEX idx_checking_reports_upashray_id ON checking_reports(upashray_id);
CREATE INDEX idx_contact_created_at ON contact_messages(created_at);
CREATE INDEX idx_upashray_media_upashray_id ON upashray_media(upashray_id);
CREATE INDEX idx_upashray_media_type ON upashray_media(media_type);
CREATE INDEX idx_admin_profiles_role ON admin_profiles(role);
CREATE INDEX idx_audit_logs_entity_type ON audit_logs(entity_type);
CREATE INDEX idx_audit_logs_actor_user_id ON audit_logs(actor_user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- ============== MIGRATION CLEANUP FOR THE OLD BUS-SPONSORSHIP FIELDS ==============
-- Run these after the new tables exist and the old data has been moved or replaced.
ALTER TABLE yatra_dates ADD COLUMN IF NOT EXISTS trip_date DATE;
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'yatra_dates'
      AND column_name = 'date_text'
  ) THEN
    EXECUTE $cmd$
      UPDATE yatra_dates
      SET trip_date = CASE
        WHEN trip_date IS NOT NULL THEN trip_date
        ELSE to_date(
          regexp_replace(date_text, '(\d+)(st|nd|rd|th)', '\1', 'gi'),
          'DD FMMonth YYYY'
        )
      END;
    $cmd$;
    ALTER TABLE yatra_dates ALTER COLUMN trip_date SET NOT NULL;
    ALTER TABLE yatra_dates DROP COLUMN IF EXISTS date_text;
  END IF;
END $$;
ALTER TABLE yatra_dates DROP COLUMN IF EXISTS sponsorship_tiers;
ALTER TABLE yatra_dates DROP COLUMN IF EXISTS sponsorship_online_only;
DROP TABLE IF EXISTS sponsorship_scheme_trips CASCADE;

-- ============== ROW SECURITY POLICIES (Optional - Enable as needed) ==============
-- ALTER TABLE upashrays ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Public read access to upashrays"
-- ON upashrays FOR SELECT USING (true);

-- ALTER TABLE members ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Authenticated access to members"
-- ON members FOR ALL USING (auth.role() = 'authenticated');
