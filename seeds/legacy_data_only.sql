-- Legacy public data only: run this in Supabase SQL Editor
-- This seeds the old hardcoded content into public tables.

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

INSERT INTO yatra_dates (trip_date, description)
SELECT v.trip_date, v.description
FROM (
  VALUES
    (DATE '2026-06-01', 'Monthly Yatra - June 2026'),
    (DATE '2026-07-01', 'Monthly Yatra - July 2026')
) AS v(trip_date, description)
WHERE NOT EXISTS (
  SELECT 1
  FROM yatra_dates yd
  WHERE yd.trip_date = v.trip_date
);

INSERT INTO sponsorship_schemes (title, description, amount, sort_order, is_active)
SELECT v.title, v.description, v.amount, v.sort_order, v.is_active
FROM (
  VALUES
    ('Full Yatra Sponsor', 'Support the full monthly journey and receive top-level recognition.', 31000, 1, TRUE),
    ('Main Pillar Sponsor', 'Sponsor one major pillar of the monthly trip experience.', 21000, 2, TRUE),
    ('Pillar Sponsor', 'Sponsor an important service pillar for selected trips.', 11000, 3, TRUE),
    ('Assistant Sponsor', 'Smaller contribution option for families and groups.', 4000, 4, TRUE)
) AS v(title, description, amount, sort_order, is_active)
WHERE NOT EXISTS (
  SELECT 1
  FROM sponsorship_schemes ss
  WHERE ss.title = v.title
);

SELECT 'upashrays' AS table_name, count(*) AS row_count FROM upashrays;
SELECT 'members' AS table_name, count(*) AS row_count FROM members;
SELECT 'jinalayas' AS table_name, count(*) AS row_count FROM jinalayas;
SELECT 'yatra_dates' AS table_name, count(*) AS row_count FROM yatra_dates;
SELECT 'sponsorship_schemes' AS table_name, count(*) AS row_count FROM sponsorship_schemes;