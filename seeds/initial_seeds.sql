-- Initial seeds for Girnar Tirth Yatra
-- Run via: `psql "postgresql://postgres:YOUR-PASSWORD@db.xphikdjdfkfbsemeqdlh.supabase.co:5432/postgres" -f seeds/initial_seeds.sql`
-- or with the Supabase CLI: `supabase db query < seeds/initial_seeds.sql`

-- 1) Map an existing Supabase Auth user (by email) to an admin profile
-- Replace the email below with your admin user's email in Auth
INSERT INTO admin_profiles(user_id, display_name, role)
SELECT id, 'Girnar Admin', 'admin'
FROM auth.users
WHERE email = 'GirnarTirthYatraGroup@Gmail.com'
ON CONFLICT DO NOTHING;

-- 1b) Seed the old public content into Supabase tables
INSERT INTO upashrays (name, village, route, trusty, mobile, location, description, before_img, process_img, after_img, status, slug)
SELECT v.name, v.village, v.route, v.trusty, v.mobile, v.location, v.description, v.before_img, v.process_img, v.after_img, v.status, v.slug
FROM (
  VALUES
    ('Vagad Upashray', 'Vagad', 'Surat to Girnar', NULL, NULL, 'https://maps.google.com/?q=Vagad%20Gujarat', 'Vagad Upashray has been refreshed with practical improvements for yatri comfort, basic cleanliness, and ritual readiness.', '/images/Vagad Before.webp', '/images/Vagad work in progree.webp', '/images/Vagad after.webp', 'done', 'vagad'),
    ('Ranpur Upashray', 'Ranpur', 'Surat to Palitana', NULL, NULL, 'https://maps.google.com/?q=Ranpur%20Gujarat', 'Ranpur Upashray is in active renovation with structural cleanup, utility updates, and pilgrim-friendly reorganization.', '/images/ranpur before.webp', '/images/Ranpur work in progress.webp', '/images/Ranpur after.webp', 'process', 'ranpur'),
    ('Umrala Upashray', 'Umrala', 'Surat to Girnar', NULL, NULL, 'https://maps.google.com/?q=Umrala%20Gujarat', 'Umrala Upashray planning includes sanitation upgrades, flow management, and readiness for future sangh stays.', '/images/umarala before.webp', '/images/umarala working in progress.webp', '/images/umarala after.webp', 'plan', 'umrala')
) AS v(name, village, route, trusty, mobile, location, description, before_img, process_img, after_img, status, slug)
WHERE NOT EXISTS (
  SELECT 1
  FROM upashrays u
  WHERE u.slug = v.slug
);

INSERT INTO members (name, email, phone, has_access, code)
SELECT v.name, v.email, v.phone, v.has_access, v.code
FROM (
  VALUES
    ('Yugam Kothari', 'Yugamkothari886@gmail.com', '+91 98765 43210', FALSE, 'YUGYG022'),
    ('Milan Bhai', 'milan.bhai@example.com', '+91 98250 12345', FALSE, 'MIGYG022'),
    ('Suresh Shah', 'suresh.shah@example.com', '+91 94260 67890', FALSE, 'SUGYG022')
) AS v(name, email, phone, has_access, code)
WHERE NOT EXISTS (
  SELECT 1
  FROM members m
  WHERE m.email = v.email OR m.code = v.code
);

INSERT INTO jinalayas (name, village, route, mulnayak, location, description, before_img, process_img, after_img, status)
SELECT v.name, v.village, v.route, v.mulnayak, v.location, v.description, v.before_img, v.process_img, v.after_img, v.status
FROM (
  VALUES
    ('Shri Neminath Bhagwan Jinalay', 'Girnar Taleti', 'Main Taleti', 'Shri Neminath Bhagwan', 'https://goo.gl/maps/example4', 'Historical Jinalay at the base of Girnar.', '/images/mobile/portrait.webp', '/images/mobile/portrait.webp', '/images/mobile/portrait.webp', 'done')
) AS v(name, village, route, mulnayak, location, description, before_img, process_img, after_img, status)
WHERE NOT EXISTS (
  SELECT 1
  FROM jinalayas j
  WHERE j.name = v.name
);

-- Yatra Dates (Optional initial dates)
-- INSERT INTO yatra_dates (date_text, description, image)
-- SELECT v.date_text, v.description, v.image
-- FROM (
--   VALUES
--     ('11th April Tuesday', 'Yatra starts from 10th April and finish by 12th April', '/image/1.JPG'),
--     ('5th May Friday', 'Yatra starts from 4th May and finish by 6th May', '/image/2.JPG'),
--     ('26th June Monday', 'Yatra starts from 25th June and finish by 27th June', '/image/4.JPG')
-- ) AS v(date_text, description, image)
-- WHERE NOT EXISTS (
--   SELECT 1
--   FROM yatra_dates yd
--   WHERE yd.date_text = v.date_text
-- );

-- 2) Seed a couple of monthly yatra dates if table exists
INSERT INTO yatra_dates (date_text, description)
SELECT v.date_text, v.description
FROM (
  VALUES
    ('1 June 2026', 'Monthly Yatra - June 2026'),
    ('1 July 2026', 'Monthly Yatra - July 2026')
) AS v(date_text, description)
WHERE NOT EXISTS (
  SELECT 1
  FROM yatra_dates yd
  WHERE yd.date_text = v.date_text
);

-- 3) Optional: sample upashray media entry if at least one upashray exists
WITH first_upashray AS (
  SELECT id
  FROM upashrays
  ORDER BY id
  LIMIT 1
)
INSERT INTO upashray_media (upashray_id, file_url, media_type, alt_text, sort_order)
SELECT
  first_upashray.id,
  'https://your-bucket.supabase.co/storage/v1/object/public/upashray-media/sample.jpg',
  'gallery',
  'Sample upashray image',
  10
FROM first_upashray
WHERE NOT EXISTS (
  SELECT 1
  FROM upashray_media um
  WHERE um.upashray_id = first_upashray.id
    AND um.file_url = 'https://your-bucket.supabase.co/storage/v1/object/public/upashray-media/sample.jpg'
);

-- 4) No-op select to indicate the script ran
SELECT 'seeds_completed' AS status;

-- 5) Quick verification rows so Supabase shows visible results after execution
SELECT 'admin_profiles' AS table_name, count(*) AS row_count FROM admin_profiles;
SELECT 'upashrays' AS table_name, count(*) AS row_count FROM upashrays;
SELECT 'members' AS table_name, count(*) AS row_count FROM members;
SELECT 'jinalayas' AS table_name, count(*) AS row_count FROM jinalayas;
SELECT 'yatra_dates' AS table_name, count(*) AS row_count FROM yatra_dates;
