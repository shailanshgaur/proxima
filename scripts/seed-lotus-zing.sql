-- =============================================================
-- SEED: Lotus Zing Society + Vendors
-- Society: Lotus Zing, Sector 168, Noida
-- Vendors: 8 (sourced from lotus-zing-vendor-directory.jsx)
-- =============================================================
--
-- BEFORE RUNNING — replace every placeholder phone number:
--   Search for: +91__REPLACE_PHONE_
--   Format: '+91XXXXXXXXXX' (country code + 10-digit mobile, no spaces)
--
--   1  Ramesh Kumar        → +91__REPLACE_PHONE_1__
--   2  Suresh Electricals  → +91__REPLACE_PHONE_2__
--   3  Anita Didi          → +91__REPLACE_PHONE_3__
--   4  Mohan Carpentry     → +91__REPLACE_PHONE_4__
--   5  Priya Maid Services → +91__REPLACE_PHONE_5__
--   6  Deepak Painting     → +91__REPLACE_PHONE_6__
--   7  Vijay AC Repair     → +91__REPLACE_PHONE_7__
--   8  Sunita Cook         → +91__REPLACE_PHONE_8__
--
-- Vendor type key (from schema CHECK constraint):
--   'A' = serves Lotus Zing only (local radius ≤ 2 km)
--   'B' = serves Lotus Zing + nearby societies (radius > 2 km)
--
-- Run once. Safe to re-run: ON CONFLICT DO NOTHING / DO UPDATE
-- protects against duplicate inserts.
-- =============================================================


WITH society AS (
  -- Insert society; if name already exists, update location (no-op
  -- if same) so RETURNING always gives back the row's id.
  INSERT INTO societies (name, location)
  VALUES ('Lotus Zing', 'Sector 168, Noida')
  ON CONFLICT (name) DO UPDATE SET location = EXCLUDED.location
  RETURNING id
)

INSERT INTO vendors (
  name,
  phone,
  type,
  categories,
  societies,
  rating,
  review_count,
  is_archived,
  appeal_status
)
SELECT
  v.name,
  v.phone,
  v.type,
  v.categories::JSONB,
  jsonb_build_array(s.id),   -- society UUID stored as JSONB array element
  0.00,                      -- no real ratings yet; reviews will drive this via trigger
  0,
  false,
  'none'
FROM society s,
(VALUES
  -- name                     phone                       type   categories
  ('Ramesh Kumar',            '+91__REPLACE_PHONE_1__',   'A',   '["Plumber"]'),
  ('Suresh Electricals',      '+91__REPLACE_PHONE_2__',   'B',   '["Electrician"]'),
  ('Anita Didi',              '+91__REPLACE_PHONE_3__',   'A',   '["Cook"]'),
  ('Mohan Carpentry',         '+91__REPLACE_PHONE_4__',   'B',   '["Carpenter"]'),
  ('Priya Maid Services',     '+91__REPLACE_PHONE_5__',   'A',   '["Housekeeping"]'),
  ('Deepak Painting',         '+91__REPLACE_PHONE_6__',   'B',   '["Painter"]'),
  ('Vijay AC Repair',         '+91__REPLACE_PHONE_7__',   'B',   '["AC Technician"]'),
  ('Sunita Cook',             '+91__REPLACE_PHONE_8__',   'A',   '["Cook"]')
) AS v(name, phone, type, categories)
ON CONFLICT (phone) DO NOTHING;


-- =============================================================
-- VERIFY after running: confirm society + all 8 vendors seeded
-- =============================================================

SELECT
  s.id   AS society_id,
  s.name AS society_name,
  s.location,
  COUNT(v.id) AS vendors_seeded
FROM societies s
LEFT JOIN vendors v
  ON v.societies @> jsonb_build_array(s.id)
WHERE s.name = 'Lotus Zing'
GROUP BY s.id, s.name, s.location;
-- Expected: 1 row, vendors_seeded = 8

-- Breakdown by category
SELECT
  v.categories ->> 0   AS category,
  v.type,
  v.name,
  v.phone
FROM vendors v
WHERE v.societies @> jsonb_build_array(
  (SELECT id FROM societies WHERE name = 'Lotus Zing')
)
ORDER BY category, v.name;
-- Expected: 8 rows across 7 distinct categories
