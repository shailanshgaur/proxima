# Database Monitoring Guide — Post-Launch

**Last Updated:** 2026-06-12  
**Project:** ZingConnect (Supabase PostgreSQL)  
**Audience:** DevOps, Backend Lead, Founders

---

## Overview

This guide provides SQL queries, baseline targets, and alert thresholds for monitoring the ZingConnect database post-launch. PostgreSQL runs on Supabase with Row-Level Security (RLS) enabled.

**Key Tables:**
- `users` — Residents registered in the app
- `vendors` — Service providers (Type A/B)
- `bookings` — Service requests + photos
- `reviews` — Vendor ratings
- `societies` — Geographic/administrative groupings
- `appeals` — Vendor appeal disputes

**Storage:** Photos stored in Supabase Storage bucket `booking-photos`

---

## 1. Query Performance Monitoring

### 1.1 Find Slow Queries (>1 second)

**Baseline:** Most queries should execute in <500ms. Anything >1000ms is slow.

```sql
-- Enable query logging (run once in Supabase SQL Editor)
ALTER SYSTEM SET log_min_duration_statement = 1000;  -- Log queries >1s
SELECT pg_reload_conf();

-- View slow queries from pg_stat_statements
SELECT 
  query,
  calls,
  mean_exec_time,
  max_exec_time,
  stddev_exec_time
FROM pg_stat_statements
WHERE mean_exec_time > 1000  -- milliseconds
ORDER BY mean_exec_time DESC
LIMIT 20;

-- Alternative: Check slow queries in Supabase logs
-- Dashboard > Logs > Database Logs > search "duration:"
```

**Alert Threshold:** If `mean_exec_time` > 1500ms

**Action Plan:**
- Review the query plan: `EXPLAIN ANALYZE <query>`
- Check if indexes are being used (see Index Effectiveness)
- Consider adding missing indexes (see section 1.4)
- Rewrite query to reduce JOIN count

---

### 1.2 Query Statistics Over Time

**Baseline:** Track baseline metrics daily for 1 week post-launch.

```sql
-- Query execution metrics (PostgreSQL 13+)
SELECT 
  schemaname,
  tablename,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch,
  seq_scan,
  seq_tup_read
FROM pg_stat_user_tables
ORDER BY seq_scan DESC
LIMIT 10;

-- Example interpretation:
-- - High seq_scan (sequential scans) = table is scanned without index
-- - idx_scan = number of times index was used
-- - If seq_scan >> idx_scan, missing index likely
```

**Alert Threshold:** If any table has `seq_scan > 10000` without corresponding `idx_scan` increase

---

### 1.3 Current Active Queries

Check what's running right now:

```sql
SELECT 
  pid,
  usename,
  application_name,
  state,
  query_start,
  state_change,
  query
FROM pg_stat_activity
WHERE state != 'idle'
ORDER BY query_start DESC;

-- Count by state
SELECT state, COUNT(*) as count
FROM pg_stat_activity
WHERE usename != 'postgres'
GROUP BY state;
```

**Baseline:** Should see <5 concurrent queries (avg)

**Alert Threshold:** >10 concurrent queries for >2 minutes

---

### 1.4 Index Usage Analysis

**Baseline:** All indexes should show `idx_scan > 0` within 48 hours of launch.

```sql
-- Check index effectiveness
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch,
  pg_size_pretty(pg_relation_size(indexrelid)) as index_size
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;

-- Find unused indexes (not good—why keep them?)
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan,
  pg_size_pretty(pg_relation_size(indexrelid)) as index_size
FROM pg_stat_user_indexes
WHERE idx_scan = 0
AND indexname NOT LIKE '%pk%'  -- Exclude primary keys
ORDER BY pg_relation_size(indexrelid) DESC;

-- Monitor index bloat
SELECT
  schemaname,
  tablename,
  indexname,
  round(100.0 * (pg_relation_size(indexrelid) - 
        pg_relation_size(indexrelid, 'main')) / 
        pg_relation_size(indexrelid), 2) as bloat_ratio
FROM pg_stat_user_indexes
WHERE pg_relation_size(indexrelid) > 1000000  -- >1MB
ORDER BY bloat_ratio DESC;
```

**Expected Index Usage (post-launch):**
- `idx_users_auth_id` — Used heavily (every login)
- `idx_bookings_resident_id` — Used heavily (load bookings)
- `idx_bookings_status` — Used heavily (filter by status)
- `idx_vendors_type` — Used moderately (filter vendors)
- `idx_bookings_created_at` — Used in reports
- `idx_vendors_rating` — Used for sorting

**Alert Threshold:** 
- Unused index = review why it exists, consider dropping
- Index bloat >30% = run `REINDEX INDEX <index_name>`

---

## 2. Storage Growth Monitoring

### 2.1 Database Size

**Baseline:** Expect ~2-5 MB at launch (schema + test data)

```sql
-- Total database size
SELECT pg_size_pretty(pg_database_size(current_database())) as db_size;

-- Size by table
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as total_size,
  pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) as table_size,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) as indexes_size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Size by table + row count (estimates)
SELECT 
  schemaname,
  tablename,
  n_live_tup as live_rows,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as total_size
FROM pg_stat_user_tables
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

**Alert Thresholds:**
- Growth >1 GB/day = anomaly (check bookings table for duplicates)
- Database >5 GB = contact Supabase to upgrade plan

**Action Plan if Alert Triggers:**
1. Check `bookings` row count: `SELECT COUNT(*) FROM bookings;`
2. Check for duplicate rows: `SELECT vendor_id, resident_id, COUNT(*) FROM bookings GROUP BY vendor_id, resident_id HAVING COUNT(*) > 1;`
3. If duplicates: Delete with `DELETE FROM bookings WHERE id IN (SELECT id FROM bookings WHERE ... LIMIT n);`
4. Vacuum database: `VACUUM FULL;` (requires Supabase Enterprise or run off-hours)

---

### 2.2 Photo Storage (Supabase Storage)

Photos are stored in `booking-photos` bucket. Monitor separately from DB.

```sql
-- Count bookings with photos (estimate storage need)
SELECT 
  COUNT(*) as total_bookings,
  COUNT(CASE WHEN photo_url IS NOT NULL THEN 1 END) as bookings_with_photos,
  ROUND(100.0 * COUNT(CASE WHEN photo_url IS NOT NULL THEN 1 END) / COUNT(*), 2) as photo_percentage
FROM bookings;

-- Monitor by month (estimate growth)
SELECT 
  DATE_TRUNC('month', created_at) as month,
  COUNT(*) as total_bookings,
  COUNT(CASE WHEN photo_url IS NOT NULL THEN 1 END) as bookings_with_photos
FROM bookings
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC;
```

**Baseline:**
- Assume ~2 MB per photo (compressed JPEG)
- At 100 bookings/day, expect ~200 MB/day if all have photos
- Supabase free tier = 1 GB storage, ~$5/10GB thereafter

**Alert Thresholds:**
- Storage bucket >800 MB = almost at free limit, upgrade soon
- Growth >500 MB/week = faster than expected, review booking volume

**Action Plan:**
- Review Supabase dashboard: Storage > bucket usage
- Delete test photos: access Supabase Storage console, delete `test-*` prefixed files
- Consider image compression post-upload (crop, resize, lower quality)

---

## 3. Connection Pool Monitoring

### 3.1 Active Connections

**Baseline:** ZingConnect is a web app, expect 2-10 concurrent DB connections (Supabase manages pools)

```sql
-- Current connection count
SELECT COUNT(*) as active_connections
FROM pg_stat_activity
WHERE datname = current_database()
AND pid <> pg_backend_pid();

-- Breakdown by application
SELECT 
  application_name,
  COUNT(*) as count,
  STRING_AGG(state, ', ') as states
FROM pg_stat_activity
WHERE datname = current_database()
GROUP BY application_name;

-- Idle connections (might waste resources)
SELECT 
  usename,
  application_name,
  state,
  query_start,
  state_change,
  EXTRACT(EPOCH FROM (NOW() - state_change)) as idle_seconds
FROM pg_stat_activity
WHERE state = 'idle'
AND query_start < NOW() - INTERVAL '5 minutes'
ORDER BY state_change DESC;
```

**Alert Thresholds:**
- Active connections >50 = connection leak (app not closing connections)
- Idle connections >30 for >10 minutes = pool misconfiguration

**Action Plan:**
1. Check app logs for database connection errors
2. Verify Supabase client not creating new pool each request
3. Review `src/lib/supabaseClient.ts` for connection reuse
4. If persists: restart app or contact Supabase support

---

## 4. Index Effectiveness Report

### 4.1 Comprehensive Index Health

Run this weekly post-launch:

```sql
-- Create a health report
WITH index_stats AS (
  SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch,
    pg_relation_size(indexrelid) as index_bytes,
    CASE 
      WHEN idx_scan = 0 THEN 'UNUSED'
      WHEN idx_tup_read = 0 THEN 'DEFINED_NOT_USEFUL'
      WHEN idx_tup_fetch > idx_tup_read * 0.5 THEN 'EFFECTIVE'
      ELSE 'LOW_EFFECTIVE'
    END as effectiveness
  FROM pg_stat_user_indexes
)
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan as scans,
  pg_size_pretty(index_bytes) as size,
  effectiveness,
  CASE 
    WHEN effectiveness = 'UNUSED' THEN 'Consider dropping'
    WHEN effectiveness = 'DEFINED_NOT_USEFUL' THEN 'May not help queries'
    WHEN effectiveness = 'EFFECTIVE' THEN 'Healthy'
    ELSE 'Monitor'
  END as recommendation
FROM index_stats
ORDER BY effectiveness, index_bytes DESC;
```

**Expected Results (ZingConnect):**

| Index | Status | Notes |
|-------|--------|-------|
| `idx_bookings_resident_id` | EFFECTIVE | Used for "my bookings" |
| `idx_bookings_vendor_id` | EFFECTIVE | Used for vendor filtering |
| `idx_bookings_status` | EFFECTIVE | Used for status filters |
| `idx_vendors_rating` | EFFECTIVE | Used for sorting/recommendations |
| `idx_users_auth_id` | EFFECTIVE | Used every login |
| `idx_bookings_created_at` | EFFECTIVE | Used for feed/timeline |

---

### 4.2 Missing Indexes

Identify slow queries that might need indexes:

```sql
-- Look for sequential scans on large tables
SELECT 
  schemaname,
  tablename,
  seq_scan,
  seq_tup_read,
  ROUND(100.0 * seq_scan / (seq_scan + idx_scan), 2) as seq_scan_pct,
  n_live_tup as row_count
FROM pg_stat_user_tables
WHERE n_live_tup > 1000
AND (seq_scan + idx_scan) > 0
ORDER BY seq_scan DESC
LIMIT 10;

-- Example: If bookings has high seq_scan + low idx_scan
-- Might need: CREATE INDEX idx_bookings_scheduled_date ON bookings(scheduled_date);
```

**If Adding Index:**

```sql
-- Example: Adding index for "get upcoming bookings"
CREATE INDEX idx_bookings_scheduled_date_status 
ON bookings(scheduled_date DESC, status)
WHERE status IN ('pending', 'confirmed');

-- Verify it's used (run after week of traffic)
SELECT idx_scan FROM pg_stat_user_indexes 
WHERE indexname = 'idx_bookings_scheduled_date_status';
```

---

## 5. Data Integrity Monitoring

### 5.1 Orphaned Records

Identify rows referencing deleted parents (shouldn't happen with CASCADE, but verify):

```sql
-- Orphaned bookings (resident deleted, but booking remains)
SELECT COUNT(*) as orphaned_count
FROM bookings b
WHERE b.resident_id IS NOT NULL
AND NOT EXISTS (SELECT 1 FROM users u WHERE u.id = b.resident_id);

-- Orphaned reviews (booking deleted, review remains)
SELECT COUNT(*) as orphaned_count
FROM reviews r
WHERE NOT EXISTS (SELECT 1 FROM bookings b WHERE b.id = r.booking_id);

-- Orphaned appeals (vendor deleted, appeal remains)
SELECT COUNT(*) as orphaned_count
FROM appeals a
WHERE NOT EXISTS (SELECT 1 FROM vendors v WHERE v.id = a.vendor_id);

-- If any count > 0, data integrity issue exists
```

**Alert Threshold:** Any count >0

**Action Plan:**
```sql
-- Delete orphaned bookings (if found)
DELETE FROM bookings b
WHERE NOT EXISTS (SELECT 1 FROM users u WHERE u.id = b.resident_id);

-- Re-run query to verify count is now 0
SELECT COUNT(*) FROM bookings b
WHERE NOT EXISTS (SELECT 1 FROM users u WHERE u.id = b.resident_id);
```

---

### 5.2 Constraint Violations

Check for data violating business logic:

```sql
-- Reviews with invalid ratings (should be 1-5)
SELECT COUNT(*) as invalid_count
FROM reviews
WHERE rating < 1 OR rating > 5;

-- Bookings with invalid status
SELECT COUNT(*) as invalid_count
FROM bookings
WHERE status NOT IN ('pending', 'confirmed', 'completed', 'no_show', 'cancelled');

-- Vendors with invalid type
SELECT COUNT(*) as invalid_count
FROM vendors
WHERE type NOT IN ('A', 'B');

-- Appeals past deadline with no decision
SELECT COUNT(*) as overdue_count
FROM appeals
WHERE status = 'pending'
AND deadline_at < NOW();

-- Bookings with future dates but 'completed' status
SELECT COUNT(*) as anomaly_count
FROM bookings
WHERE status = 'completed'
AND scheduled_date > CURRENT_DATE;

-- Bookings scheduled in past but still 'pending'
SELECT COUNT(*) as anomaly_count
FROM bookings
WHERE status = 'pending'
AND scheduled_date < CURRENT_DATE;
```

**Alert Threshold:** Any count >0 = data corruption or business logic error

**Action Plan:**
```sql
-- Example: Fix old pending bookings
UPDATE bookings
SET status = 'no_show'
WHERE status = 'pending'
AND scheduled_date < CURRENT_DATE - INTERVAL '7 days'
AND completed_at IS NULL;

-- Notify admins of changed bookings
SELECT COUNT(*) as fixed_count FROM bookings WHERE status = 'no_show';
```

---

### 5.3 RLS Policy Verification

Verify Row-Level Security is working:

```sql
-- Check RLS is enabled on all tables
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- Expected: all should have rowsecurity = true

-- List all RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

**Alert Threshold:** If `rowsecurity = false` for any table = security gap

**Action Plan:**
```sql
-- Re-enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE appeals ENABLE ROW LEVEL SECURITY;
```

---

## 6. Backup Status Monitoring

### 6.1 Backup Verification

Supabase automatically backs up databases, but verify they're working:

**In Supabase Dashboard:**

1. Go to **Settings > Backups**
2. Check:
   - Daily automated backups are enabled
   - Last backup timestamp is <24 hours old
   - Backup size is growing (indicates data being captured)

```sql
-- Estimate daily change
SELECT 
  DATE_TRUNC('day', created_at)::DATE as date,
  COUNT(*) as new_records
FROM bookings
GROUP BY DATE_TRUNC('day', created_at)::DATE
ORDER BY date DESC
LIMIT 7;

-- Expect growing count if app is being used
```

**Alert Threshold:**
- Last backup >24 hours old = contact Supabase
- Backup size not increasing for 3 days = might indicate backup failure

---

### 6.2 Recovery Testing

Test backup recovery quarterly:

```sql
-- Create test table
CREATE TABLE backup_test (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_value TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert test data
INSERT INTO backup_test (test_value) VALUES ('test-marker-2026-06-12');

-- Wait 24 hours, then:
-- 1. Go to Supabase dashboard
-- 2. Settings > Backups > Select a backup point before this test
-- 3. Restore to a new project
-- 4. Verify test table does NOT exist in restore (good—backup was from before)
-- 5. Delete test table from production after verification

DROP TABLE backup_test;
```

---

## 7. Weekly Monitoring Checklist

**Every Monday morning:**

- [ ] **Query Performance**
  - [ ] Run slow query report (Section 1.1)
  - [ ] Check if any queries >1500ms
  - [ ] Review active connections (Section 3.1)

- [ ] **Storage**
  - [ ] Check DB size growth (Section 2.1)
  - [ ] Check photos bucket size (Section 2.2)
  - [ ] Alert if growth >1 GB/day

- [ ] **Indexes**
  - [ ] Run index health report (Section 4.1)
  - [ ] Check for unused indexes (Section 4.2)
  - [ ] Plan to drop unused indexes

- [ ] **Data Integrity**
  - [ ] Run orphan checks (Section 5.1)
  - [ ] Run constraint violation checks (Section 5.2)
  - [ ] Verify RLS enabled (Section 5.3)

- [ ] **Backups**
  - [ ] Verify last backup <24 hours old
  - [ ] Check backup size is increasing

- [ ] **Business Metrics**
  - [ ] Active residents: `SELECT COUNT(DISTINCT resident_id) FROM bookings WHERE created_at > NOW() - INTERVAL '7 days';`
  - [ ] Active vendors: `SELECT COUNT(*) FROM vendors WHERE is_archived = false;`
  - [ ] Bookings this week: `SELECT COUNT(*) FROM bookings WHERE created_at > NOW() - INTERVAL '7 days';`
  - [ ] Avg booking rating: `SELECT ROUND(AVG(rating)::numeric, 2) FROM reviews WHERE created_at > NOW() - INTERVAL '7 days';`

---

## 8. Remediation Playbook

### Issue: Slow Query Performance

**Symptom:** API responses slow (>2s), users report lag

**Diagnosis:**
```sql
SELECT query, mean_exec_time 
FROM pg_stat_statements 
WHERE mean_exec_time > 1000 
ORDER BY mean_exec_time DESC LIMIT 5;
```

**Remediation Steps:**
1. Copy slow query to Supabase SQL editor
2. Run `EXPLAIN ANALYZE <query>` to see plan
3. Look for "Sequential Scan" in plan — this is the culprit
4. Add index: `CREATE INDEX idx_<table>_<column> ON <table>(<column>);`
5. Re-run query, check `EXPLAIN ANALYZE` again
6. If still slow, consider query rewrite or data denormalization

**Prevention:**
- Add indexes proactively (see Section 4.2)
- Monitor `pg_stat_statements` weekly

---

### Issue: Rapid Storage Growth

**Symptom:** Database size growing >1 GB/day

**Diagnosis:**
```sql
SELECT tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename))
FROM pg_tables WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

**Remediation Steps:**
1. Identify largest table (usually `bookings`)
2. Check for duplicates: `SELECT vendor_id, resident_id, COUNT(*) FROM bookings GROUP BY vendor_id, resident_id HAVING COUNT(*) > 1;`
3. If duplicates found: `DELETE FROM bookings WHERE id IN (SELECT id FROM bookings WHERE ... QUALIFY ROW_NUMBER() OVER (...) > 1);`
4. Run `VACUUM FULL;` (request Supabase to do this if scale issue)
5. Check if photos stored in database (shouldn't be) — verify `photo_url` is just path, not blob

**Prevention:**
- Monitor growth weekly (Section 7)
- Don't store binary files in database (use Supabase Storage only)

---

### Issue: Connection Pool Exhaustion

**Symptom:** Database connection errors, "too many connections"

**Diagnosis:**
```sql
SELECT COUNT(*) FROM pg_stat_activity WHERE state != 'idle';
```

**Remediation Steps:**
1. Check if >50 concurrent queries: restart app or check for infinite loop
2. Review app logs for repeated connection attempts
3. Verify `supabaseClient.ts` reuses client (don't create new instance per request)
4. Kill long-idle connections: `SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE idle_in_transaction FOR LONGER THAN INTERVAL '5 minutes';`
5. Contact Supabase if persists after app restart

**Prevention:**
- Use connection pooling (Supabase does by default)
- Close connections properly in app code
- Monitor concurrent connections weekly

---

### Issue: Data Integrity Violation

**Symptom:** Orphaned records, constraint violations, RLS bypass

**Diagnosis:**
- Run Section 5.1 (orphan checks)
- Run Section 5.2 (constraint checks)
- Run Section 5.3 (RLS verification)

**Remediation Steps:**
1. Identify affected records
2. Create backup: request Supabase to make snapshot
3. Delete or fix records: `DELETE FROM <table> WHERE <condition>;`
4. Review app code for where corruption originated
5. Add database constraints to prevent recurrence: `ALTER TABLE <table> ADD CONSTRAINT <name> CHECK (...);`

**Prevention:**
- Use foreign key constraints (schema already has them)
- Verify RLS policies on sensitive tables
- Test app thoroughly before launch

---

### Issue: Backup Failure

**Symptom:** Last backup >24 hours old, or backup size not increasing

**Diagnosis:**
- Check Supabase dashboard: Settings > Backups
- Look at backup history timestamps

**Remediation Steps:**
1. Contact Supabase support with project ID
2. Request manual backup creation
3. Verify backup completes
4. Check if any data loading script is failing

**Prevention:**
- Check backup status weekly (Section 7)
- Subscribe to Supabase status page for outages

---

## 9. Dashboard Setup Recommendations

**For non-technical founders/ops:**

Use Supabase's built-in dashboard, or set up a simple monitoring dashboard:

```sql
-- Save this as a view for weekly review
CREATE VIEW monitoring_snapshot AS
SELECT 
  'Database Size' as metric,
  pg_size_pretty(pg_database_size(current_database())) as value
UNION ALL
SELECT 'Active Connections', COUNT(*)::TEXT
FROM pg_stat_activity WHERE state != 'idle'
UNION ALL
SELECT 'Total Bookings', COUNT(*)::TEXT FROM bookings
UNION ALL
SELECT 'Total Users', COUNT(*)::TEXT FROM users
UNION ALL
SELECT 'Total Vendors', COUNT(*)::TEXT FROM vendors
UNION ALL
SELECT 'Bookings This Week', COUNT(*)::TEXT 
FROM bookings WHERE created_at > NOW() - INTERVAL '7 days'
UNION ALL
SELECT 'Avg Rating (This Week)', ROUND(AVG(rating)::numeric, 2)::TEXT
FROM reviews WHERE created_at > NOW() - INTERVAL '7 days';

-- Query it weekly
SELECT * FROM monitoring_snapshot;
```

---

## 10. Escalation Contacts

| Issue | Contact | Link |
|-------|---------|------|
| Database Performance | Supabase Support | https://supabase.com/dashboard/support |
| Storage/Backup Issues | Supabase Support | https://supabase.com/dashboard/support |
| Emergency Down | Supabase Status | https://status.supabase.com |
| Security Incident | Supabase Security | security@supabase.io |
| Connection Issues | Supabase Community | https://discord.supabase.io |

---

## Appendix: Quick Reference SQL

**Run these first thing after launch:**

```sql
-- 1. Check all tables exist
\dt public.*

-- 2. Verify RLS enabled
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';

-- 3. Database baseline size
SELECT pg_size_pretty(pg_database_size(current_database()));

-- 4. Index baseline
SELECT COUNT(*) as total_indexes FROM pg_stat_user_indexes;

-- 5. Connection baseline
SELECT COUNT(*) as connections FROM pg_stat_activity WHERE state != 'idle';

-- 6. Data baseline
SELECT 
  (SELECT COUNT(*) FROM users) as users_count,
  (SELECT COUNT(*) FROM vendors) as vendors_count,
  (SELECT COUNT(*) FROM bookings) as bookings_count,
  (SELECT COUNT(*) FROM reviews) as reviews_count;
```

Save this output for comparison in 1 week, 1 month, 3 months.

---

**Version History:**
- v1.0 (2026-06-12): Initial monitoring guide for ZingConnect MVP launch
