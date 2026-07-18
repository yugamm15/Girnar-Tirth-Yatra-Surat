# Supabase → MySQL Migration Plan
> **Status:** In Progress — Migration incomplete. This document tracks ALL changes needed.

---

## 1. Current Architecture (Supabase)

| Layer | File | Role |
|---|---|---|
| DB Client | `src/lib/supabaseClient.js` | Creates Supabase JS client |
| DB Operations | `src/lib/database.js` | All CRUD using Supabase query builder |
| Auth | `src/components/Auth.jsx` | Uses `supabase.auth` for login/logout/session |
| File Storage | `src/lib/database.js` → `uploadWebPImage()` | Uploads images to Supabase Storage buckets |
| Schema | `DATABASE_SCHEMA.sql` | Written for PostgreSQL/Supabase |
| Env Vars | `.env.local` | `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` |

---

## 2. What Needs to Change

### 2.1 Dependencies

**Remove:**
```
@supabase/supabase-js
```

**Add:**
```
mysql2          ← for backend DB queries
axios           ← or fetch, for frontend to call your own API
multer          ← for file uploads on your own server
cloudinary      ← OR any S3-compatible service for image storage
                   (Supabase Storage must be replaced too)
```

---

### 2.2 New MySQL Schema (`DATABASE_SCHEMA_MYSQL.sql`)

The existing `DATABASE_SCHEMA.sql` is PostgreSQL-only. MySQL needs these fixes:

| PostgreSQL Syntax | MySQL Equivalent |
|---|---|
| `BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY` | `BIGINT PRIMARY KEY AUTO_INCREMENT` |
| `BOOLEAN` | `TINYINT(1)` |
| `NUMERIC` | `DECIMAL(10,2)` |
| `JSONB` | `JSON` |
| `TIMESTAMP DEFAULT CURRENT_TIMESTAMP` | `DATETIME DEFAULT CURRENT_TIMESTAMP` |
| `TEXT CHECK (col IN ('a','b'))` | Use `ENUM('a','b')` |
| `UUID` (for auth.users) | `VARCHAR(36)` |
| `REFERENCES auth.users(id)` | Remove — Supabase Auth tables don't exist in MySQL |

**Tables affected:**
- `upashrays` — change `GENERATED ALWAYS AS IDENTITY` → `AUTO_INCREMENT`
- `members` — same + change `BOOLEAN` → `TINYINT(1)`
- `jinalayas` — same
- `yatra_dates` — `NUMERIC` → `DECIMAL`, `BOOLEAN` → `TINYINT(1)`
- `sponsorship_schemes` — `NUMERIC` → `DECIMAL`, `BOOLEAN` → `TINYINT(1)`
- `payment_intents` — `JSONB` → `JSON`, `NUMERIC` → `DECIMAL`, remove CHECK constraints or convert to ENUM
- `yatrik_registrations` — straightforward
- `checking_reports` — `JSONB` → `JSON`
- `contact_messages` — straightforward
- `upashray_media` — CHECK → ENUM
- `site_settings` — `JSONB` → `JSON`, primary key stays `VARCHAR(100)`
- `admin_profiles` — `UUID PRIMARY KEY REFERENCES auth.users(id)` → `VARCHAR(36) PRIMARY KEY` (no foreign key to auth)
- `audit_logs` — `UUID` → `VARCHAR(36)`, `JSONB` → `JSON`

**The migration cleanup block at the bottom of `DATABASE_SCHEMA.sql` (lines 211-240) uses PostgreSQL-only syntax:**
- `DO $$ BEGIN ... END $$` — not valid in MySQL
- `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` — MySQL 8.0+ supports this, but older versions don't
- `DROP COLUMN IF EXISTS` — MySQL 8.0+ only

---

### 2.3 File: `src/lib/supabaseClient.js`

**Must be deleted or replaced.**

Replace with a simple API base URL config:
```js
// src/lib/apiClient.js  (NEW FILE)
export const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';
```

---

### 2.4 File: `src/lib/database.js`

This is the **biggest change**. Every function uses the Supabase query builder.

**Strategy:** Replace each DB object's methods with `fetch()` calls to your own backend REST API.

#### Functions / DB Objects that need rewriting:

| Export | Methods to Replace |
|---|---|
| `uploadWebPImage()` | Currently uses `supabase.storage.upload()` + `getPublicUrl()` — must POST to your own upload endpoint |
| `upashraysDB` | `getAll`, `getById`, `getBySlug`, `create`, `update`, `delete`, `search` |
| `membersDB` | `getAll`, `getById`, `getByEmail`, `create`, `update`, `delete`, `search` |
| `jinalayasDB` | `getAll`, `getById`, `create`, `update`, `delete`, `search` |
| `yatraDatesDB` | `getAll`, `getById`, `create`, `update`, `delete` |
| `sponsorshipSchemesDB` | `getAll`, `getById`, `create`, `update`, `delete` |
| `paymentIntentsDB` | `getAll`, `create`, `update`, `delete` |
| `upashrayMediaDB` | `getAll`, `getByUpashrayId`, `getByUpashrayIdAndType`, `create`, `upload`, `update`, `delete` |
| `siteSettingsDB` | `getAll`, `getByKey`, `upsert`, `delete` |
| `adminProfilesDB` | `getAll`, `getByUserId`, `upsert`, `delete` |
| `auditLogsDB` | `getAll`, `getByEntity`, `create` |
| `yatrikRegistrationsDB` | `getAll`, `getByYatraId`, `create`, `createMultiple`, `delete` |
| `demoYatrikRegistrationsDB` | `createMultiple` |
| `checkingReportsDB` | `getAll`, `getById`, `getByUpashrayId`, `getByJinalayaId`, `create`, `delete` |
| `contactMessagesDB` | `getAll`, `create`, `delete` |

#### Supabase-specific patterns that must change:

```js
// CURRENT (Supabase)
const { data, error } = await supabase.from('table').select('*').eq('id', id).single();
if (error) throw error;
return data;

// NEW (MySQL via your API)
const res = await fetch(`${API_BASE}/table/${id}`);
if (!res.ok) throw new Error(await res.text());
return res.json();
```

```js
// CURRENT — Supabase .or() filter
.or(`name.ilike.%${query}%,village.ilike.%${query}%`)

// NEW — send search param to backend, backend does LIKE query
const res = await fetch(`${API_BASE}/upashrays?search=${encodeURIComponent(query)}`);
```

```js
// CURRENT — Supabase upsert
await supabase.from('site_settings').upsert([payload], { onConflict: 'setting_key' })

// NEW — MySQL INSERT ... ON DUPLICATE KEY UPDATE (handled in backend)
await fetch(`${API_BASE}/site-settings`, { method: 'PUT', body: JSON.stringify(payload) });
```

---

### 2.5 File: `src/components/Auth.jsx`

Supabase Auth is used in 6 places. All must be replaced:

| Line | Current Code | Replacement |
|---|---|---|
| 3 | `import { supabase } from '../lib/supabaseClient.js'` | Remove this import |
| 553–570 | `supabase.auth.getSession()` — checks existing session | Replace with a token stored in `localStorage` + verify against your own `/api/auth/verify` endpoint |
| 621–664 | `trySupabaseAuthLogin()` — signs in via Supabase Auth | Replace with `POST /api/auth/login` on your backend |
| 647, 659 | `supabase.auth.signOut()` | Replace with `POST /api/auth/logout` or just clear `localStorage` token |
| 739 | `supabase.auth.signOut()` in `handleLogout` | Same as above |

**Auth flow replacement:**
- No more Supabase JWT tokens
- Backend should issue its own JWT or session token on login
- Store token in `localStorage`
- Send token in `Authorization: Bearer <token>` header for all protected API calls
- The hardcoded `ADMIN_CREDENTIALS` object (email/password in frontend) is a **security risk** — move to backend

---

### 2.6 Image / File Storage

Supabase Storage is used for upashray image uploads in `uploadWebPImage()`:
- `supabase.storage.from(bucketName).upload(...)` 
- `supabase.storage.from(bucketName).getPublicUrl(...)`

**Replacement options (pick one):**

| Option | Description |
|---|---|
| **Cloudinary** | Free tier available. Upload via their REST API. Get public URL back. |
| **AWS S3 / Backblaze B2** | Send file to your backend, backend uploads to S3 |
| **Your own server** | Store files in `public/uploads/` on your server, serve statically |

The `upashrayMediaDB.upload()` function must also be updated to call your new upload endpoint.

---

### 2.7 Backend API Required (`/api` routes)

Currently the app only has `/api/create-order.js` and `/api/verify-payment.js` (Razorpay only). You need to create a full REST API backend that connects to MySQL.

**New endpoints needed:**

```
POST   /api/auth/login
POST   /api/auth/logout

GET    /api/upashrays
GET    /api/upashrays/:id
GET    /api/upashrays/slug/:slug
POST   /api/upashrays
PUT    /api/upashrays/:id
DELETE /api/upashrays/:id

GET    /api/members
GET    /api/members/:id
POST   /api/members
PUT    /api/members/:id
DELETE /api/members/:id

GET    /api/jinalayas
GET    /api/jinalayas/:id
POST   /api/jinalayas
PUT    /api/jinalayas/:id
DELETE /api/jinalayas/:id

GET    /api/yatra-dates
GET    /api/yatra-dates/:id
POST   /api/yatra-dates
PUT    /api/yatra-dates/:id
DELETE /api/yatra-dates/:id

GET    /api/sponsorship-schemes
GET    /api/sponsorship-schemes/:id
POST   /api/sponsorship-schemes
PUT    /api/sponsorship-schemes/:id
DELETE /api/sponsorship-schemes/:id

GET    /api/payment-intents
POST   /api/payment-intents
PUT    /api/payment-intents/:id
DELETE /api/payment-intents/:id

GET    /api/upashray-media
GET    /api/upashray-media/upashray/:upashrayId
POST   /api/upashray-media         (multipart/form-data for file upload)
PUT    /api/upashray-media/:id
DELETE /api/upashray-media/:id

GET    /api/site-settings
GET    /api/site-settings/:key
PUT    /api/site-settings/:key     (upsert)
DELETE /api/site-settings/:key

GET    /api/admin-profiles
GET    /api/admin-profiles/:userId
PUT    /api/admin-profiles         (upsert)
DELETE /api/admin-profiles/:userId

GET    /api/audit-logs
POST   /api/audit-logs

GET    /api/yatrik-registrations
GET    /api/yatrik-registrations/yatra/:yatraId
POST   /api/yatrik-registrations
DELETE /api/yatrik-registrations/:id

GET    /api/checking-reports
GET    /api/checking-reports/:id
POST   /api/checking-reports
DELETE /api/checking-reports/:id

GET    /api/contact-messages
POST   /api/contact-messages
DELETE /api/contact-messages/:id
```

---

### 2.8 Environment Variables

**Remove from `.env.local`:**
```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

**Add to `.env.local`:**
```
VITE_API_BASE_URL=http://localhost:3001/api    # or your deployed backend URL
```

**Add to backend `.env` (server-side only):**
```
DB_HOST=localhost
DB_PORT=3306
DB_NAME=girnar_yatra
DB_USER=root
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
```

---

### 2.9 MySQL-specific Issues with JSONB fields

These columns store JSON in Supabase as `JSONB`:
- `payment_intents.items`
- `payment_intents.metadata`
- `checking_reports.points`
- `audit_logs.changes`
- `site_settings.setting_value`

In MySQL these become `JSON` type. The difference:
- MySQL `JSON` does **not** support the `::jsonb` default cast syntax
- Default values for JSON in MySQL must be set differently (MySQL 8.0.13+ supports `DEFAULT (JSON_OBJECT())`)
- Frontend code that reads these fields will still work — JSON parses the same way

**MySQL defaults for JSON columns:**
```sql
-- MySQL 8.0.13+
items JSON NOT NULL DEFAULT (JSON_ARRAY()),
metadata JSON NOT NULL DEFAULT (JSON_OBJECT())
```

---

## 3. Migration Problems Found (Incomplete Migration)

These are specific issues in the current codebase that indicate the migration was not completed:

1. **`src/lib/supabaseClient.js` still exists** — still creates a Supabase client
2. **`src/lib/database.js` still imports from `supabaseClient`** — all 14 DB objects still use Supabase query builder
3. **`src/components/Auth.jsx` still imports `supabase`** — auth logic not migrated
4. **`DATABASE_SCHEMA.sql` is PostgreSQL-only** — no MySQL version exists
5. **`@supabase/supabase-js` is still in `package.json`** — dependency not removed
6. **`.env.local` still has Supabase keys** — not cleaned up
7. **No backend MySQL server exists** — `/api` folder only has Razorpay handlers
8. **`admin_profiles` table references `auth.users`** — this table only exists in Supabase; in MySQL there is no `auth` schema
9. **`audit_logs.actor_user_id` references `auth.users`** — same problem
10. **Image uploads use `supabase.storage`** — no replacement storage solution chosen yet
11. **`SUPABASE_STORAGE_SETUP.md`** — still references Supabase buckets, will be outdated

---

## 4. Step-by-Step Migration Order

Follow this order to avoid breaking things:

```
Step 1:  Write MySQL schema (fix all PostgreSQL-only syntax)
Step 2:  Set up MySQL database locally and run the new schema
Step 3:  Set up a Node.js/Express backend with mysql2
Step 4:  Create all REST API endpoints (see section 2.7)
Step 5:  Add auth endpoint (POST /api/auth/login) with JWT
Step 6:  Choose image storage solution (Cloudinary recommended)
Step 7:  Create upload endpoint on backend
Step 8:  Replace src/lib/supabaseClient.js with src/lib/apiClient.js
Step 9:  Rewrite src/lib/database.js to use fetch() calls to your API
Step 10: Update uploadWebPImage() to use new storage
Step 11: Update src/components/Auth.jsx to remove supabase.auth calls
Step 12: Remove VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY from .env.local
Step 13: Remove @supabase/supabase-js from package.json
Step 14: Test every page and admin panel feature
Step 15: Deploy backend + update VITE_API_BASE_URL to production URL
```

---

## 5. Files That Need Changes (Summary)

| File | Change Type | Priority |
|---|---|---|
| `DATABASE_SCHEMA.sql` | Rewrite for MySQL | 🔴 Critical |
| `src/lib/supabaseClient.js` | Delete / Replace | 🔴 Critical |
| `src/lib/database.js` | Full rewrite | 🔴 Critical |
| `src/components/Auth.jsx` | Auth section rewrite | 🔴 Critical |
| `package.json` | Remove supabase dep | 🔴 Critical |
| `.env.local` | Update env vars | 🔴 Critical |
| `api/` folder | Add all MySQL API routes | 🔴 Critical |
| `SUPABASE_STORAGE_SETUP.md` | Replace with new storage docs | 🟡 Medium |
| `src/utils/imageUtils.js` | May need updates for new storage URLs | 🟡 Medium |
| `vite.config.js` | Add proxy for `/api` if using dev server | 🟡 Medium |

---

## 6. Pages That Use Database (All Will Break Without Migration)

| Page | DB Objects Used |
|---|---|
| `UpashrayJirnodharPage.jsx` | `upashraysDB` |
| `UpashrayDetailPage.jsx` | `upashraysDB`, `upashrayMediaDB` |
| `JinalayJirnodharPage.jsx` | `jinalayasDB` |
| `JinalayDetailPage.jsx` | `jinalayasDB` |
| `MonthlyBusYatraPage.jsx` | `yatraDatesDB`, `yatrikRegistrationsDB` |
| `MonthlyBusSponsorshipPage.jsx` | `sponsorshipSchemesDB`, `paymentIntentsDB` |
| `YatraBookingPage.jsx` | `yatraDatesDB`, `yatrikRegistrationsDB`, `paymentIntentsDB` |
| `YatraPaymentPage.jsx` | `paymentIntentsDB` |
| `ContactUsPage.jsx` | `contactMessagesDB` |
| `Auth.jsx` (Admin Panel) | All DB objects + `supabase.auth` |
| `PrintReportView.jsx` | `checkingReportsDB` |

---

## 7. Complete MySQL Schema (Ready to Run)

> Copy-paste this into your MySQL client (MySQL Workbench, phpMyAdmin, or `mysql` CLI).
> Requires **MySQL 8.0.13+** for JSON default values.

```sql
-- ============================================================
-- Girnar Tirth Yatra — MySQL Schema
-- Converted from PostgreSQL/Supabase schema
-- Requires MySQL 8.0.13+
-- ============================================================

CREATE DATABASE IF NOT EXISTS girnar_yatra
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE girnar_yatra;

-- ============================================================
-- TABLE: upashrays
-- ============================================================
CREATE TABLE upashrays (
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
CREATE TABLE members (
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
CREATE TABLE jinalayas (
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
CREATE TABLE yatra_dates (
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
CREATE TABLE sponsorship_schemes (
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
CREATE TABLE payment_intents (
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
CREATE TABLE yatrik_registrations (
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
CREATE TABLE checking_reports (
  id            BIGINT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
  member_id     BIGINT          DEFAULT NULL,
  upashray_id   BIGINT          DEFAULT NULL,
  jinalaya_id   BIGINT          DEFAULT NULL,
  report_date   DATE            DEFAULT (CURRENT_DATE),
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
CREATE TABLE contact_messages (
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
CREATE TABLE upashray_media (
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
-- NOTE: setting_key is the PRIMARY KEY (no auto-increment)
-- ============================================================
CREATE TABLE site_settings (
  setting_key     VARCHAR(100)    NOT NULL PRIMARY KEY,
  setting_value   JSON            NOT NULL,
  updated_at      DATETIME        DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: admin_profiles
-- NOTE: No Supabase auth.users in MySQL.
--       user_id is a plain VARCHAR(36) — store your own UUID or user ID.
--       You must manage admin users yourself (e.g. in a separate admins table).
-- ============================================================
CREATE TABLE admin_profiles (
  user_id       VARCHAR(36)     NOT NULL PRIMARY KEY,
  display_name  VARCHAR(255),
  role          ENUM('admin', 'editor', 'member') DEFAULT 'admin',
  is_active     TINYINT(1)      DEFAULT 1,
  created_at    DATETIME        DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME        DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: audit_logs
-- NOTE: actor_user_id is a plain VARCHAR(36) — no foreign key to auth.users
-- ============================================================
CREATE TABLE audit_logs (
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
```

---

### 7.1 Verification Queries (Run After Setup)

```sql
-- Check all tables were created
SHOW TABLES;

-- Verify column types
DESCRIBE upashrays;
DESCRIBE members;
DESCRIBE jinalayas;
DESCRIBE yatra_dates;
DESCRIBE sponsorship_schemes;
DESCRIBE payment_intents;
DESCRIBE yatrik_registrations;
DESCRIBE checking_reports;
DESCRIBE contact_messages;
DESCRIBE upashray_media;
DESCRIBE site_settings;
DESCRIBE admin_profiles;
DESCRIBE audit_logs;

-- Check all indexes
SHOW INDEX FROM upashrays;
SHOW INDEX FROM members;
SHOW INDEX FROM yatrik_registrations;
SHOW INDEX FROM payment_intents;
SHOW INDEX FROM checking_reports;
```

---

### 7.2 Data Migration Queries (If Moving Existing Data From Supabase)

If you export data from Supabase (via CSV or JSON), use these patterns to insert it:

```sql
-- Insert upashray (example)
INSERT INTO upashrays (name, village, route, trusty, mobile, location, description, before_img, process_img, after_img, status, slug, created_at, updated_at)
VALUES ('Upashray Name', 'Village', 'Route', 'Trustee', '9999999999', 'Location URL', 'Description', NULL, NULL, NULL, 'plan', 'upashray-slug', NOW(), NOW());

-- Insert member
INSERT INTO members (name, email, phone, code, password, has_access, created_at, updated_at)
VALUES ('Member Name', 'email@example.com', '9999999999', 'CODE01', 'hashed_password', 1, NOW(), NOW());

-- Insert yatra date
INSERT INTO yatra_dates (trip_date, description, image, registration_open, price_per_person, max_capacity, created_at, updated_at)
VALUES ('2026-08-15', 'Yatra description', NULL, 1, 900.00, 50, NOW(), NOW());

-- Insert payment intent with JSON fields
INSERT INTO payment_intents (module_key, payer_name, phone, email, city, amount, currency, status, items, metadata, created_at)
VALUES ('sponsorship', 'Payer Name', '9999999999', 'payer@example.com', 'Surat', 5100.00, 'INR', 'paid',
  JSON_ARRAY(),
  JSON_OBJECT('scheme_id', 1, 'scheme_title', 'Gold Sponsor'),
  NOW());

-- Insert site setting (JSON value)
INSERT INTO site_settings (setting_key, setting_value, updated_at)
VALUES ('contact_info', JSON_OBJECT('phone', '9999999999', 'email', 'info@example.com'), NOW())
ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value), updated_at = NOW();

-- Upsert site setting (update if exists)
INSERT INTO site_settings (setting_key, setting_value, updated_at)
VALUES ('homepage_notice', JSON_OBJECT('text', 'Yatra open!', 'active', true), NOW())
ON DUPLICATE KEY UPDATE
  setting_value = VALUES(setting_value),
  updated_at    = NOW();
```

---

### 7.3 Useful Admin Queries

```sql
-- Count registrations per yatra date
SELECT
  yd.trip_date,
  yd.price_per_person,
  yd.max_capacity,
  COUNT(yr.id) AS registered_count
FROM yatra_dates yd
LEFT JOIN yatrik_registrations yr ON yr.yatra_id = yd.id
GROUP BY yd.id
ORDER BY yd.trip_date DESC;

-- Get all payment intents with status summary
SELECT status, COUNT(*) AS count, SUM(amount) AS total_amount
FROM payment_intents
GROUP BY status;

-- Get all upashrays with their media count
SELECT u.id, u.name, u.village, u.status, COUNT(m.id) AS media_count
FROM upashrays u
LEFT JOIN upashray_media m ON m.upashray_id = u.id
GROUP BY u.id
ORDER BY u.created_at DESC;

-- Full text search on upashrays (for the .search() method)
SELECT * FROM upashrays
WHERE name LIKE '%search_term%' OR village LIKE '%search_term%'
ORDER BY created_at DESC;

-- Full text search on members
SELECT * FROM members
WHERE name LIKE '%search_term%' OR email LIKE '%search_term%'
ORDER BY created_at DESC;

-- Get checking reports with member and entity names
SELECT
  cr.id,
  cr.report_date,
  cr.general_notes,
  m.name     AS member_name,
  u.name     AS upashray_name,
  j.name     AS jinalaya_name
FROM checking_reports cr
LEFT JOIN members   m ON m.id = cr.member_id
LEFT JOIN upashrays u ON u.id = cr.upashray_id
LEFT JOIN jinalayas j ON j.id = cr.jinalaya_id
ORDER BY cr.report_date DESC;

-- Read JSON field value from site_settings
SELECT setting_key, JSON_UNQUOTE(JSON_EXTRACT(setting_value, '$.phone')) AS phone
FROM site_settings
WHERE setting_key = 'contact_info';

-- Read JSON array from payment_intents
SELECT id, payer_name, JSON_LENGTH(items) AS item_count
FROM payment_intents
WHERE status = 'paid';
```

---

### 7.4 Drop All Tables (Use With Caution — Development Only)

```sql
-- Disable FK checks first to drop in any order
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS admin_profiles;
DROP TABLE IF EXISTS site_settings;
DROP TABLE IF EXISTS upashray_media;
DROP TABLE IF EXISTS contact_messages;
DROP TABLE IF EXISTS checking_reports;
DROP TABLE IF EXISTS yatrik_registrations;
DROP TABLE IF EXISTS payment_intents;
DROP TABLE IF EXISTS sponsorship_schemes;
DROP TABLE IF EXISTS yatra_dates;
DROP TABLE IF EXISTS jinalayas;
DROP TABLE IF EXISTS members;
DROP TABLE IF EXISTS upashrays;

SET FOREIGN_KEY_CHECKS = 1;
```
