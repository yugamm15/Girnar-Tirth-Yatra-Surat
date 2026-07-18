-- ============================================================
-- Girnar Tirth Yatra — Complete MySQL Setup
-- Run this ENTIRE file in phpMyAdmin > SQL tab
-- Database: u215012529_girnargroup
-- ============================================================

-- ============================================================
-- TABLE: admin_users (for login — JWT auth)
-- Default admin: admin@girnar.com / Admin@123
-- Password hash below = bcrypt of "Admin@123"
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_users (
  id            BIGINT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
  email         VARCHAR(255)    NOT NULL UNIQUE,
  password_hash VARCHAR(255)    NOT NULL,
  display_name  VARCHAR(255),
  role          ENUM('admin', 'editor') DEFAULT 'admin',
  is_active     TINYINT(1)      DEFAULT 1,
  created_at    DATETIME        DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME        DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default admin (email: admin@girnar.com, password: Admin@123)
INSERT IGNORE INTO admin_users (email, password_hash, display_name, role, is_active)
VALUES (
  'admin@girnar.com',
  '$2b$10$Xk9Q2Oq7P3mVnL6R1sW8OeZJkN2TgAeKqDfL3mCvB5nXpYrUwSiTu',
  'Girnar Admin',
  'admin',
  1
);

-- ============================================================
-- TABLE: upashrays
-- ============================================================
CREATE TABLE IF NOT EXISTS upashrays (
  id            BIGINT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(255)    NOT NULL,
  village       VARCHAR(255)    NOT NULL,
  route         VARCHAR(255),
  trusty        VARCHAR(255),
  mobile        VARCHAR(20),
  location      VARCHAR(500),
  description   TEXT,
  before_img    VARCHAR(500),
  process_img   VARCHAR(500),
  after_img     VARCHAR(500),
  status        ENUM('plan', 'process', 'done') DEFAULT 'plan',
  slug          VARCHAR(255)    UNIQUE,
  created_at    DATETIME        DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME        DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: members
-- ============================================================
CREATE TABLE IF NOT EXISTS members (
  id            BIGINT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(255)    NOT NULL,
  email         VARCHAR(255)    UNIQUE NOT NULL,
  phone         VARCHAR(20),
  code          VARCHAR(20)     UNIQUE,
  password      VARCHAR(255),
  has_access    TINYINT(1)      DEFAULT 0,
  created_at    DATETIME        DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME        DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: jinalayas
-- ============================================================
CREATE TABLE IF NOT EXISTS jinalayas (
  id            BIGINT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(255)    NOT NULL,
  village       VARCHAR(255),
  route         VARCHAR(255),
  mulnayak      VARCHAR(255),
  location      VARCHAR(500),
  description   TEXT,
  before_img    VARCHAR(500),
  process_img   VARCHAR(500),
  after_img     VARCHAR(500),
  status        ENUM('plan', 'process', 'done') DEFAULT 'plan',
  created_at    DATETIME        DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME        DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: yatra_dates
-- ============================================================
CREATE TABLE IF NOT EXISTS yatra_dates (
  id                  BIGINT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
  trip_date           DATE            NOT NULL,
  description         TEXT,
  image               VARCHAR(500),
  registration_open   TINYINT(1)      DEFAULT 0,
  price_per_person    DECIMAL(10,2)   DEFAULT 900.00,
  max_capacity        INT             DEFAULT NULL,
  created_at          DATETIME        DEFAULT CURRENT_TIMESTAMP,
  updated_at          DATETIME        DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: sponsorship_schemes
-- ============================================================
CREATE TABLE IF NOT EXISTS sponsorship_schemes (
  id            BIGINT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title         VARCHAR(255)    NOT NULL,
  description   TEXT,
  amount        DECIMAL(10,2)   NOT NULL DEFAULT 0.00,
  sort_order    INT             DEFAULT 0,
  is_active     TINYINT(1)      DEFAULT 1,
  created_at    DATETIME        DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME        DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: payment_intents
-- ============================================================
CREATE TABLE IF NOT EXISTS payment_intents (
  id                      BIGINT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
  module_key              VARCHAR(100)    NOT NULL,
  reference_type          VARCHAR(100),
  reference_id            VARCHAR(100),
  payer_name              VARCHAR(255)    NOT NULL,
  phone                   VARCHAR(20),
  email                   VARCHAR(255),
  city                    VARCHAR(255),
  amount                  DECIMAL(10,2)   NOT NULL DEFAULT 0.00,
  currency                VARCHAR(10)     DEFAULT 'INR',
  status                  ENUM('pending', 'paid', 'failed', 'cancelled') DEFAULT 'pending',
  gateway_order_id        VARCHAR(255),
  gateway_payment_id      VARCHAR(255),
  refund_status           ENUM('not_requested', 'requested', 'processed', 'failed') DEFAULT 'not_requested',
  refund_transaction_id   VARCHAR(255),
  refund_contact          VARCHAR(20),
  refund_notes            TEXT,
  refund_requested_at     DATETIME        DEFAULT NULL,
  refund_processed_at     DATETIME        DEFAULT NULL,
  admin_notes             TEXT,
  items                   JSON            NOT NULL,
  metadata                JSON            NOT NULL,
  created_at              DATETIME        DEFAULT CURRENT_TIMESTAMP,
  updated_at              DATETIME        DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: yatrik_registrations
-- ============================================================
CREATE TABLE IF NOT EXISTS yatrik_registrations (
  id                    BIGINT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first_name            VARCHAR(255)    NOT NULL,
  last_name             VARCHAR(255)    NOT NULL,
  phone                 VARCHAR(20)     NOT NULL,
  alt_phone             VARCHAR(20),
  birthdate             DATE            NOT NULL,
  gender                VARCHAR(50),
  remarks               TEXT,
  yatra_id              BIGINT,
  registration_source   VARCHAR(20)     DEFAULT 'online',
  created_at            DATETIME        DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_yatrik_yatra FOREIGN KEY (yatra_id)
    REFERENCES yatra_dates(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: checking_reports
-- ============================================================
CREATE TABLE IF NOT EXISTS checking_reports (
  id            BIGINT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
  member_id     BIGINT          DEFAULT NULL,
  upashray_id   BIGINT          DEFAULT NULL,
  jinalaya_id   BIGINT          DEFAULT NULL,
  report_date   DATE            NOT NULL,
  points        JSON,
  general_notes TEXT,
  created_at    DATETIME        DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_report_member   FOREIGN KEY (member_id)
    REFERENCES members(id)    ON DELETE SET NULL,
  CONSTRAINT fk_report_upashray FOREIGN KEY (upashray_id)
    REFERENCES upashrays(id)  ON DELETE CASCADE,
  CONSTRAINT fk_report_jinalaya FOREIGN KEY (jinalaya_id)
    REFERENCES jinalayas(id)  ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: contact_messages
-- ============================================================
CREATE TABLE IF NOT EXISTS contact_messages (
  id          BIGINT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
  full_name   VARCHAR(255)    NOT NULL,
  phone       VARCHAR(20),
  email       VARCHAR(255),
  message     TEXT            NOT NULL,
  created_at  DATETIME        DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: upashray_media
-- ============================================================
CREATE TABLE IF NOT EXISTS upashray_media (
  id            BIGINT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
  upashray_id   BIGINT          NOT NULL,
  media_type    ENUM('before', 'process', 'after', 'gallery') NOT NULL,
  file_url      VARCHAR(500)    NOT NULL,
  alt_text      TEXT,
  sort_order    INT             DEFAULT 0,
  created_at    DATETIME        DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME        DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_media_upashray FOREIGN KEY (upashray_id)
    REFERENCES upashrays(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: site_settings
-- ============================================================
CREATE TABLE IF NOT EXISTS site_settings (
  setting_key     VARCHAR(100)    NOT NULL PRIMARY KEY,
  setting_value   JSON            NOT NULL,
  updated_at      DATETIME        DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: admin_profiles
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_profiles (
  user_id       VARCHAR(36)     NOT NULL PRIMARY KEY,
  display_name  VARCHAR(255),
  role          ENUM('admin', 'editor', 'member') DEFAULT 'admin',
  is_active     TINYINT(1)      DEFAULT 1,
  created_at    DATETIME        DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME        DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: audit_logs
-- ============================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id              BIGINT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
  actor_user_id   VARCHAR(36)     DEFAULT NULL,
  entity_type     VARCHAR(100)    NOT NULL,
  entity_id       VARCHAR(100),
  action          VARCHAR(50)     NOT NULL,
  changes         JSON,
  created_at      DATETIME        DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================
CREATE INDEX idx_upashrays_status        ON upashrays(status);
CREATE INDEX idx_upashrays_slug          ON upashrays(slug);

CREATE INDEX idx_members_email           ON members(email);
CREATE INDEX idx_members_has_access      ON members(has_access);

CREATE INDEX idx_yatrik_yatra_id         ON yatrik_registrations(yatra_id);
CREATE INDEX idx_yatrik_created_at       ON yatrik_registrations(created_at);
CREATE INDEX idx_yatrik_reg_source       ON yatrik_registrations(registration_source);

CREATE INDEX idx_yatra_dates_trip_date   ON yatra_dates(trip_date);

CREATE INDEX idx_sponsor_is_active       ON sponsorship_schemes(is_active);
CREATE INDEX idx_sponsor_sort_order      ON sponsorship_schemes(sort_order);

CREATE INDEX idx_payment_module_key      ON payment_intents(module_key);
CREATE INDEX idx_payment_status          ON payment_intents(status);
CREATE INDEX idx_payment_reference       ON payment_intents(reference_type, reference_id);

CREATE INDEX idx_reports_upashray_id     ON checking_reports(upashray_id);
CREATE INDEX idx_reports_jinalaya_id     ON checking_reports(jinalaya_id);
CREATE INDEX idx_reports_member_id       ON checking_reports(member_id);

CREATE INDEX idx_contact_created_at      ON contact_messages(created_at);

CREATE INDEX idx_media_upashray_id       ON upashray_media(upashray_id);
CREATE INDEX idx_media_type              ON upashray_media(media_type);

CREATE INDEX idx_admin_role              ON admin_profiles(role);

CREATE INDEX idx_audit_entity_type       ON audit_logs(entity_type);
CREATE INDEX idx_audit_actor             ON audit_logs(actor_user_id);
CREATE INDEX idx_audit_created_at        ON audit_logs(created_at);

-- ============================================================
-- VERIFY: Run these to confirm all tables created
-- ============================================================
SHOW TABLES;
