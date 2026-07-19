-- =============================================================
-- PROXIMA: Migration Verification Queries
-- Run in Supabase SQL editor (Dashboard → SQL Editor)
-- Each block returns rows if the artifact exists.
-- Zero rows = migration not yet applied.
-- =============================================================


-- ─────────────────────────────────────────────────────────────
-- MIGRATION 001: core-schema.sql
-- Checks: tables, base indexes, base RLS SELECT policies
-- ─────────────────────────────────────────────────────────────

-- 001-A: All 6 core tables present
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('societies', 'users', 'vendors', 'bookings', 'reviews', 'appeals')
ORDER BY table_name;
-- Expected: 6 rows

-- 001-B: Base indexes (11 expected)
SELECT indexname, tablename
FROM pg_indexes
WHERE schemaname = 'public'
  AND indexname IN (
    'idx_users_auth_id',
    'idx_users_society_id',
    'idx_vendors_phone',
    'idx_vendors_type',
    'idx_bookings_resident_id',
    'idx_bookings_vendor_id',
    'idx_bookings_status',
    'idx_bookings_scheduled_date',
    'idx_reviews_vendor_id',
    'idx_reviews_booking_id',
    'idx_appeals_vendor_id'
  )
ORDER BY indexname;
-- Expected: 11 rows

-- 001-C: Base RLS SELECT policies (5 expected)
SELECT policyname, tablename, cmd
FROM pg_policies
WHERE schemaname = 'public'
  AND policyname IN (
    'users_select_own',
    'vendors_select_by_society',
    'bookings_select_own',
    'reviews_select_own_or_public',
    'appeals_select_own'
  )
ORDER BY policyname;
-- Expected: 5 rows

-- 001 status summary
SELECT
  (SELECT COUNT(*) FROM information_schema.tables
   WHERE table_schema = 'public'
     AND table_name IN ('societies','users','vendors','bookings','reviews','appeals'))::INT AS tables_found,
  6 AS tables_expected,
  CASE WHEN (SELECT COUNT(*) FROM information_schema.tables
             WHERE table_schema = 'public'
               AND table_name IN ('societies','users','vendors','bookings','reviews','appeals')) = 6
       THEN 'APPLIED' ELSE 'NOT APPLIED' END AS migration_001_status;


-- ─────────────────────────────────────────────────────────────
-- MIGRATION 002: fix-rls-write-policies.sql
-- Checks: 13 write policies across users, bookings, reviews,
--         vendors, and appeals tables
-- ─────────────────────────────────────────────────────────────

-- 002-A: All write policies (13 expected)
SELECT policyname, tablename, cmd
FROM pg_policies
WHERE schemaname = 'public'
  AND policyname IN (
    'users_insert_own',
    'users_update_own',
    'bookings_insert_own',
    'bookings_update_own',
    'bookings_delete_own',
    'reviews_insert_own',
    'reviews_update_own',
    'vendors_insert_never',
    'vendors_update_never',
    'vendors_delete_never',
    'appeals_insert_own',
    'appeals_update_admin_only',
    'appeals_delete_admin_only'
  )
ORDER BY tablename, cmd;
-- Expected: 13 rows

-- 002 status summary
SELECT
  COUNT(*)::INT AS policies_found,
  13            AS policies_expected,
  CASE WHEN COUNT(*) = 13 THEN 'APPLIED'
       WHEN COUNT(*) = 0  THEN 'NOT APPLIED'
       ELSE 'PARTIAL (' || COUNT(*) || '/13)'
  END AS migration_002_status
FROM pg_policies
WHERE schemaname = 'public'
  AND policyname IN (
    'users_insert_own','users_update_own',
    'bookings_insert_own','bookings_update_own','bookings_delete_own',
    'reviews_insert_own','reviews_update_own',
    'vendors_insert_never','vendors_update_never','vendors_delete_never',
    'appeals_insert_own','appeals_update_admin_only','appeals_delete_admin_only'
  );


-- ─────────────────────────────────────────────────────────────
-- MIGRATION 003: add-constraints.sql
-- Checks: 1 UNIQUE constraint, 1 CHECK constraint, 2 new indexes
-- ─────────────────────────────────────────────────────────────

-- 003-A: UNIQUE constraint on reviews(resident_id, vendor_id)
SELECT constraint_name, table_name, constraint_type
FROM information_schema.table_constraints
WHERE table_schema = 'public'
  AND constraint_name = 'unique_resident_vendor_review';
-- Expected: 1 row (constraint_type = 'UNIQUE')

-- 003-B: CHECK constraint limiting active bookings per resident
SELECT constraint_name, table_name, constraint_type
FROM information_schema.table_constraints
WHERE table_schema = 'public'
  AND constraint_name = 'max_active_bookings';
-- Expected: 1 row (constraint_type = 'CHECK')

-- 003-C: New indexes added in migration 003
SELECT indexname, tablename, indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND indexname IN ('idx_vendors_rating', 'idx_bookings_created_at');
-- Expected: 2 rows

-- 003 status summary
SELECT
  (SELECT CASE WHEN COUNT(*) = 1 THEN 'YES' ELSE 'NO' END
   FROM information_schema.table_constraints
   WHERE table_schema = 'public'
     AND constraint_name = 'unique_resident_vendor_review')      AS unique_constraint_applied,
  (SELECT CASE WHEN COUNT(*) = 1 THEN 'YES' ELSE 'NO' END
   FROM information_schema.table_constraints
   WHERE table_schema = 'public'
     AND constraint_name = 'max_active_bookings')                AS check_constraint_applied,
  (SELECT COUNT(*) FROM pg_indexes
   WHERE schemaname = 'public'
     AND indexname IN ('idx_vendors_rating','idx_bookings_created_at'))::INT AS new_indexes_found,
  2                                                              AS new_indexes_expected,
  CASE
    WHEN (SELECT COUNT(*) FROM information_schema.table_constraints
          WHERE table_schema = 'public'
            AND constraint_name IN ('unique_resident_vendor_review','max_active_bookings')) = 2
     AND (SELECT COUNT(*) FROM pg_indexes
          WHERE schemaname = 'public'
            AND indexname IN ('idx_vendors_rating','idx_bookings_created_at')) = 2
    THEN 'APPLIED'
    ELSE 'NOT APPLIED or PARTIAL'
  END AS migration_003_status;


-- ─────────────────────────────────────────────────────────────
-- MIGRATION 004: add-rating-trigger.sql
-- Checks: update_vendor_rating function + tr_update_vendor_rating
--         trigger on reviews table (AFTER INSERT)
-- ─────────────────────────────────────────────────────────────

-- 004-A: Trigger on reviews table
SELECT trigger_name, event_object_table, event_manipulation, action_timing
FROM information_schema.triggers
WHERE trigger_schema = 'public'
  AND trigger_name = 'tr_update_vendor_rating';
-- Expected: 1 row (event_manipulation=INSERT, action_timing=AFTER)

-- 004-B: Underlying PL/pgSQL function
SELECT proname AS function_name, prosrc IS NOT NULL AS has_body
FROM pg_proc
WHERE proname = 'update_vendor_rating'
  AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');
-- Expected: 1 row

-- 004 status summary
SELECT
  (SELECT CASE WHEN COUNT(*) > 0 THEN 'EXISTS' ELSE 'MISSING' END
   FROM information_schema.triggers
   WHERE trigger_schema = 'public'
     AND trigger_name = 'tr_update_vendor_rating')           AS trigger_status,
  (SELECT CASE WHEN COUNT(*) > 0 THEN 'EXISTS' ELSE 'MISSING' END
   FROM pg_proc
   WHERE proname = 'update_vendor_rating'
     AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')) AS function_status,
  CASE
    WHEN (SELECT COUNT(*) FROM information_schema.triggers
          WHERE trigger_schema = 'public'
            AND trigger_name = 'tr_update_vendor_rating') > 0
     AND (SELECT COUNT(*) FROM pg_proc
          WHERE proname = 'update_vendor_rating'
            AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')) > 0
    THEN 'APPLIED'
    ELSE 'NOT APPLIED'
  END AS migration_004_status;
