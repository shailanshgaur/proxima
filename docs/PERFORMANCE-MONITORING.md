# Performance Monitoring Guide — Proxima Post-Launch

**Last Updated:** 2026-06-12  
**Project:** Proxima (Hyperlocal Service Marketplace)  
**Audience:** Operations, Engineering Leads, Founders  
**Status:** Production Operations Manual

---

## Table of Contents

1. [Performance Targets (SLAs)](#1-performance-targets-slas)
2. [Cost Tracking](#2-cost-tracking)
3. [Bottleneck Detection](#3-bottleneck-detection)
4. [Optimization Priorities](#4-optimization-priorities)
5. [Weekly Checklist](#5-weekly-checklist)

---

## 1. Performance Targets (SLAs)

Production SLA targets for MVP (20 residents, 5+ bookings/week baseline):

| Endpoint | Metric | Target | Alert | Critical |
|----------|--------|--------|-------|----------|
| **Vendor Search** | Latency (p95) | <500ms | >700ms | >1s |
| **Booking Creation** | Latency (p95) | <1s | >1.5s | >2s |
| **Admin Dashboard Load** | Latency (p95) | <2s | >3s | >5s |
| **Photo Upload** | Latency (p95) | <5s | >7s | >10s |
| **OTP Submission** | Latency (p95) | <2s | >3s | >5s |
| **Overall Error Rate** | % of requests | <0.1% | >0.5% | >1% |
| **Uptime** | Monthly target | 99.9% | <99.5% | <99% |

**Definitions:**
- **p95:** 95% of requests complete faster than this time
- **Error Rate:** 5xx errors / total requests
- **Alert:** Investigate immediately, create ticket
- **Critical:** Page on-call engineer, active remediation

---

### 1.1 Endpoint Baseline Measurements

**After first week of launch, establish baseline:**

```bash
# Option 1: Extract from Vercel Monitoring
# https://vercel.com/dashboard/[project-name]/monitoring
# Set timeframe to "Last 7 days", note p95 latencies by endpoint

# Option 2: Extract from Sentry Performance
# https://sentry.io/organizations/[org-slug]/performance/
# Query: All transactions grouped by transaction.name

# Option 3: Manual load test (dev environment)
curl -w "\nLatency: %{time_total}s\n" https://proxima.vercel.app/api/vendors?society=society_1
curl -w "\nLatency: %{time_total}s\n" https://proxima.vercel.app/api/bookings -X POST -d '...'
```

**Record baseline in shared spreadsheet:**

| Endpoint | Baseline p50 | Baseline p95 | Baseline p99 | Target | Status |
|----------|---|---|---|---|---|
| GET /api/vendors | 150ms | 380ms | 650ms | <500ms | ✅ Pass |
| POST /api/bookings | 400ms | 850ms | 1.2s | <1s | ⚠️ Monitor |
| GET /api/admin/dashboard | 1.2s | 2.1s | 3.5s | <2s | ⚠️ Monitor |
| POST /api/photos | 2.3s | 4.8s | 7.2s | <5s | ✅ Pass |
| POST /api/auth/otp | 300ms | 1.8s | 2.5s | <2s | ✅ Pass |

---

## 2. Cost Tracking

Monitor three cost centers: Supabase compute, storage, and Vercel bandwidth.

### 2.1 Supabase Compute Cost

**Baseline:** Supabase free tier (~$0/month for MVP scale)
- Compute: Shared PostgreSQL instance (~500 concurrent connections max)
- Connections: ZingConnect uses <5 concurrent (web app, not high-concurrency)
- Query rate: Estimate ~100 queries/min at 5 bookings/day

**Cost increase triggers:**
- >10 concurrent connections → move to dedicated instance ($15/month+)
- >500k query/month → optimize before upgrading ($25/month standard)
- >1 GB database size → included; >2 GB → $5 per GB/month

**Monthly tracking SQL:**

```sql
-- Run weekly to track connection usage
SELECT 
  DATE_TRUNC('day', query_start)::DATE as date,
  COUNT(DISTINCT usename) as unique_users,
  COUNT(*) as total_queries,
  MAX(EXTRACT(EPOCH FROM (state_change - query_start)))::INT as max_query_duration_sec,
  ROUND(AVG(EXTRACT(EPOCH FROM (state_change - query_start)))::numeric, 3) as avg_query_duration_sec
FROM pg_stat_activity
WHERE usename != 'postgres'
AND query NOT LIKE '%pg_stat_activity%'
GROUP BY DATE_TRUNC('day', query_start)
ORDER BY date DESC
LIMIT 30;
```

**Alert Thresholds:**
- Concurrent connections >8 → investigate; contact support if >20
- Average query duration >500ms → look for slow queries (see DATABASE-MONITORING.md)

---

### 2.2 Storage Cost

**Baseline:** Expect <100 MB total (schema + test data)

**Photo storage (Supabase Storage bucket `booking-photos`):**
- Assume ~2 MB per photo (compressed JPEG 1280x720)
- At 5 bookings/week with 80% having photos = ~8 MB/week = ~32 MB/month
- Free tier: 1 GB included (~$0)
- Cost kicks in at >1 GB (~$5/10 GB additional)

**Monthly tracking:**

```sql
-- Estimate photo growth
SELECT 
  DATE_TRUNC('month', created_at)::DATE as month,
  COUNT(*) as total_bookings,
  COUNT(CASE WHEN photo_url IS NOT NULL THEN 1 END) as with_photos,
  ROUND(100.0 * COUNT(CASE WHEN photo_url IS NOT NULL THEN 1 END) / COUNT(*), 1) as photo_percentage
FROM bookings
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC;
```

**Manual storage check (Supabase Dashboard):**
1. Go to **Storage** → **booking-photos** bucket
2. Note size of bucket (MB / GB)
3. Record in spreadsheet with date
4. Alert if growth >500 MB/week

**Cleanup procedure (if hitting limits):**
```sql
-- Delete photos from completed bookings >90 days old
-- (Keep proof for 90 days for dispute resolution, then can prune)
DELETE FROM bookings
WHERE status = 'completed'
  AND completed_at < NOW() - INTERVAL '90 days'
  AND photo_url IS NOT NULL;

-- Manually delete from Supabase Storage:
-- Dashboard → Storage → booking-photos → delete old files
```

---

### 2.3 Vercel Bandwidth Cost

**Baseline:** Vercel free tier (~$0/month for <100 GB bandwidth)
- API response size (JSON): ~50-200 KB per request
- Static assets (compiled React): ~150 KB per page load
- Photos served via Supabase Storage, not Vercel (no bandwidth cost)

**Estimated bandwidth per activity:**
- 100 API requests/day × 100 KB avg = 10 MB/day = 300 MB/month (free)
- Even at 10x scale (1000 requests/day) = 3 GB/month (still free)

**Cost kicks in at:**
- >100 GB/month bandwidth (~$0.50 per GB overage)
- Would require ~2M requests/month (unrealistic for MVP)

**Monthly tracking (Vercel Dashboard):**
1. Go to https://vercel.com/dashboard/[project]/analytics/usage
2. Check **Bandwidth** (should show GB used)
3. Note in spreadsheet

**Optimization if approaching limits:**
- Enable Vercel Edge Caching for static assets (Settings → Advanced → Cache)
- Compress API responses (already enabled in React 18 + Vite)
- Serve images from Supabase CDN directly (not via Vercel proxy)

---

### 2.4 Monthly Budget Tracking Spreadsheet

**Save this as a Google Sheet / shared document:**

| Component | Free Tier | Baseline Usage | Cost | Alert Level | Status |
|-----------|-----------|---|---|---|---|
| **Supabase Compute** | Included | <5 concurrent | $0 | >8 conn | ✅ OK |
| **Supabase Storage** | 1 GB | ~40 MB (photos) | $0 | >800 MB | ✅ OK |
| **Database Size** | Included | ~20 MB | $0 | >5 GB | ✅ OK |
| **Vercel Bandwidth** | 100 GB | ~300 MB | $0 | >50 GB | ✅ OK |
| **Vercel Functions** | 100 GB-hours | 10 GB-hours | $0 | >50 GB-hrs | ✅ OK |
| **Supabase Edge Functions** | 500k calls | 50k calls | $0 | >200k calls | ✅ OK |
| **GitHub Actions** | 2000 min/mo | 100 min | $0 | >1000 min | ✅ OK |
| | | **TOTAL COST** | **$0** | - | ✅ OK |

**Update weekly. Cost alert = exceed 50% of free tier on any component.**

---

## 3. Bottleneck Detection

Identify operations that slow first under load.

### 3.1 Database Bottlenecks

**Watch these queries (most likely to slow under load):**

```sql
-- Vendor search (heavy filtering)
SELECT vendors.*, 
       COUNT(DISTINCT reviews.id) as review_count,
       AVG(reviews.rating) as avg_rating
FROM vendors
LEFT JOIN reviews ON reviews.vendor_id = vendors.id
WHERE vendors.society_id = $1
  AND vendors.type = $2
  AND vendors.is_archived = false
GROUP BY vendors.id
ORDER BY avg_rating DESC
LIMIT 20;

-- Admin dashboard queries (multiple aggregations)
SELECT 
  (SELECT COUNT(*) FROM bookings WHERE status = 'pending') as pending_count,
  (SELECT COUNT(*) FROM bookings WHERE status = 'completed') as completed_count,
  (SELECT COUNT(*) FROM appeals WHERE status = 'pending') as appeal_count,
  (SELECT COUNT(*) FROM users WHERE is_active = true) as active_users,
  (SELECT AVG(rating) FROM reviews) as avg_rating;

-- Booking photo retrieval
SELECT bookings.*, photos.url
FROM bookings
LEFT JOIN photos ON photos.booking_id = bookings.id
WHERE bookings.resident_id = $1
ORDER BY bookings.created_at DESC
LIMIT 50;
```

**Monitoring plan:**

1. **After launch (Week 1):** Run baseline query latencies (see DATABASE-MONITORING.md section 1.1)
2. **Weekly:** Check for slow queries trending up
3. **Alert:** If any baseline query >2x original latency

**Expected slow-point progression:**

| Load Level | First Bottleneck | Second Bottleneck | Third |
|-----------|---|---|---|
| MVP (5 bookings/week) | None | — | — |
| 20 bookings/week | Admin dashboard aggregations | Photo retrieval (disk I/O) | — |
| 100 bookings/week | Vendor search (large result set) | Booking list pagination | Review aggregations |
| 1000 bookings/week | Database connection pool | Index maintenance | Memory usage |

---

### 3.2 Frontend Bottlenecks

**Watch these operations (most likely to cause UI lag):**

| Component | Bottleneck | Load Metric | Alert Threshold |
|-----------|-----------|---|---|
| **Vendor List** | Re-render when sorting/filtering | Sort 100+ vendors | >200ms render |
| **Booking Form** | Date/time pickers + validation | Submit booking with photo | >500ms validation |
| **Admin Dashboard** | Table render (100 rows paginated) | Load dashboard | >3s initial load |
| **Photo Upload** | File input + preview generation | Select large photo | >1s preview |
| **Review Modal** | Modal open/close animation | Rating submission | >300ms animation |

**Monitoring with React DevTools:**

1. Open DevTools in Chrome
2. React tab → Profiler
3. Hit operation (e.g., click "Sort by Rating")
4. Check "Render time" — should be <200ms for MVP scale
5. If >500ms: identify component causing re-render, use `React.memo()` or `useMemo()`

**Quick optimization checklist:**

```typescript
// ❌ Bad: Re-renders entire vendor list when sorting
function VendorList({ vendors, sort }) {
  return vendors.map(v => <VendorCard vendor={v} />);
}

// ✅ Good: Memoize vendor card to prevent unnecessary re-renders
const VendorCard = React.memo(({ vendor }) => (
  <div>{vendor.name}</div>
));

function VendorList({ vendors, sort }) {
  return vendors.map(v => <VendorCard key={v.id} vendor={v} />);
}
```

---

### 3.3 Network Bottlenecks

**Track these metrics (Chrome DevTools → Network tab):**

| Operation | File Type | Target Size | Alert if >Target |
|-----------|-----------|---|---|
| **Page Load** | HTML + JS bundle | <150 KB | >200 KB |
| **Vendor Search API** | JSON response | <50 KB | >100 KB |
| **Booking API** | JSON response | <10 KB | >20 KB |
| **Photo Upload** | JPEG image | <2 MB | >5 MB |
| **Admin Export** | CSV download | <500 KB | >1 MB |

**Optimization tactics:**

1. **Compress responses:** Already enabled in Vite (gzip + brotli)
2. **Lazy load images:** Use `<img loading="lazy" />` on vendor cards
3. **Pagination:** Never fetch >50 records in single API call
4. **Caching:** Vercel Edge Cache static assets for 1 hour
5. **Code splitting:** Lazy load admin dashboard (only load if user is admin)

**Enable Vercel Edge Caching:**

```javascript
// In Vercel deployment: Add cache-control headers
// vercel.json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    },
    {
      "source": "/api/vendors",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=300" }
      ]
    }
  ]
}
```

---

## 4. Optimization Priorities

Ranked by effort vs. impact.

### 4.1 Quick Wins (1-2 hours, high impact)

**Priority: Do immediately after launch**

1. **Add missing database indexes**
   ```sql
   -- Check which indexes exist
   SELECT indexname FROM pg_indexes WHERE tablename IN ('vendors', 'bookings', 'reviews');
   
   -- Add these if missing:
   CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
   CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at DESC);
   CREATE INDEX IF NOT EXISTS idx_vendors_rating ON vendors((
     (SELECT AVG(rating) FROM reviews WHERE reviews.vendor_id = vendors.id)
   ) DESC);
   CREATE INDEX IF NOT EXISTS idx_bookings_resident_id_status ON bookings(resident_id, status);
   ```
   **Impact:** 3-5x faster vendor search, admin queries

2. **Enable Vercel caching for static assets**
   - File: `vercel.json` (or Vercel dashboard Settings → Advanced)
   - Add: Cache-Control headers for `/assets/`, `/images/`
   - Impact: 10-100x faster page reloads for returning users

3. **Compress photo uploads on client**
   ```typescript
   // In upload handler, compress before sending
   const compressImage = (file) => {
     const reader = new FileReader();
     reader.readAsDataURL(file);
     return new Promise((resolve) => {
       reader.onload = (event) => {
         const img = new Image();
         img.onload = () => {
           const canvas = document.createElement('canvas');
           canvas.width = 1280;
           canvas.height = 720;
           const ctx = canvas.getContext('2d');
           ctx.drawImage(img, 0, 0, 1280, 720);
           canvas.toBlob(resolve, 'image/jpeg', 0.8);
         };
         img.src = event.target.result;
       };
     });
   };
   ```
   **Impact:** 50-70% smaller photos, 2-3x faster upload

---

### 4.2 Medium Effort (4-8 hours, medium impact)

**Priority: Do in Week 2-3 if still seeing bottlenecks**

1. **Implement lazy loading for vendor lists**
   ```typescript
   // Instead of loading 100 vendors, load 20 + "Load More" button
   const [vendorPage, setVendorPage] = useState(0);
   
   const loadMore = () => {
     const newVendors = await fetchVendors(vendorPage + 1);
     setVendors([...vendors, ...newVendors]);
     setVendorPage(vendorPage + 1);
   };
   
   return (
     <>
       {vendors.map(v => <VendorCard key={v.id} vendor={v} />)}
       <button onClick={loadMore}>Load More</button>
     </>
   );
   ```
   **Impact:** 50% faster vendor list render, 30% lower initial data transfer

2. **Paginate admin dashboard tables (already done, verify)**
   - Confirm: Admin table shows 50 rows max + pagination controls
   - SQL: Use `LIMIT 50 OFFSET (page-1)*50`
   - Impact: Dashboard load <2s even with 1000+ bookings

3. **Add debounce to search input**
   ```typescript
   const [search, setSearch] = useState('');
   const [results, setResults] = useState([]);
   
   useEffect(() => {
     const timer = setTimeout(() => {
       if (search.length > 2) fetchVendors(search);
     }, 300); // Wait 300ms after user stops typing
     return () => clearTimeout(timer);
   }, [search]);
   ```
   **Impact:** 70% fewer API calls, 50% faster search feel

4. **Optimize review aggregation queries**
   ```sql
   -- ❌ Slow: Aggregates on every query
   SELECT AVG(rating) FROM reviews WHERE vendor_id = $1;
   
   -- ✅ Fast: Denormalized (update on review insert)
   SELECT rating_count, rating_sum FROM vendor_stats WHERE vendor_id = $1;
   -- Calculate: rating_sum / rating_count = average
   
   -- On review insert, update vendor_stats:
   UPDATE vendor_stats 
   SET rating_count = rating_count + 1,
       rating_sum = rating_sum + $1
   WHERE vendor_id = $2;
   ```
   **Impact:** 100x faster vendor sorting

---

### 4.3 Strategic (16+ hours, foundational)

**Priority: Do if reaching scale (100+ bookings/week)**

1. **Migrate to dedicated Supabase instance** ($15+/month)
   - Trigger: >10 concurrent connections, frequent slow queries
   - Benefit: Better memory, faster compute, auto-scaling

2. **Implement CDN for photo storage**
   - Use Supabase's built-in CDN (free with Pro plan) or Cloudflare
   - Benefit: Photos served from edge locations, 10-100x faster globally

3. **Consider read replicas** (if >1000 bookings/month)
   - Route admin queries to read replica, writes to primary
   - Benefit: Admin dashboard doesn't block resident writes

4. **Implement caching layer** (Redis)
   - Cache: vendor listings, top-rated vendors, user session data
   - Tool: Supabase Edge Functions + Redis (or Upstash)
   - Benefit: <50ms latency for cached queries

---

## 5. Weekly Checklist

**Post-launch operational rhythm.**

### Monday: Error Review

**Time:** 15 minutes  
**Owner:** Engineering Lead

- [ ] **Sentry Dashboard**
  - Go to https://sentry.io/organizations/[org]/issues/
  - Questions:
    - Any new errors vs. last week?
    - Did error count increase >50%?
    - Any errors affecting >10% of sessions?
  - Action: Assign top 3 errors to team, estimate fix time
  
- [ ] **Latency p95 check**
  - Sentry: Performance tab, last 7 days
  - Vercel: Monitoring tab, "Response Time Distribution"
  - Questions:
    - Any endpoint slower than target (see Section 1)?
    - Is latency trending up? (might indicate load growth)
  - Action: If trend, investigate query logs (DATABASE-MONITORING.md)

- [ ] **Vercel build status**
  - https://vercel.com/dashboard/[project]/deployments
  - Questions:
    - Any failed deployments last week?
    - Build time increasing? (might indicate code bloat)
  - Action: If >2 failures, review CI/CD pipeline

**Example Monday Report:**
```
Health: Yellow (up from Green last week)

Key Metrics:
- Error rate: 0.2% (up from 0.05%) → 4x increase
- P95 latency: 650ms (target: 500ms vendor search) → investigate
- Deployments: 3 (1 failed due to timeout)

Top Issues to Fix:
1. "ReferenceError: localStorage undefined" — 150 sessions affected
   → Likely mobile Safari issue, fix in phone-detection logic
2. "Supabase connection timeout" — 50 sessions affected
   → Check if database hitting connection limit
3. Vendor search latency drifting → add index or optimize query

Action Items:
- [ ] Investigate localStorage issue (1 hour)
- [ ] Check DB connections + slow queries (30 min)
- [ ] Profile vendor search (1 hour)
```

---

### Wednesday: Cost & Capacity Review

**Time:** 15 minutes  
**Owner:** DevOps / Finance

- [ ] **Database query performance**
  - Run slow query report (DATABASE-MONITORING.md, Section 1.1):
    ```sql
    SELECT query, mean_exec_time FROM pg_stat_statements
    WHERE mean_exec_time > 1000 ORDER BY mean_exec_time DESC LIMIT 10;
    ```
  - Questions:
    - Any queries >2x slower than Week 1 baseline?
    - Any new slow queries?
  - Action: If found, add index or rewrite query

- [ ] **Storage growth tracking**
  - Database size: `SELECT pg_size_pretty(pg_database_size(current_database()));`
  - Photo bucket: Supabase dashboard → Storage
  - Questions:
    - Is growth rate predictable? (e.g., ~30 MB/month)
    - Are we on track to exceed free tier?
  - Action: If >500 MB/week growth, review why

- [ ] **Cost tracking**
  - Update spreadsheet (Section 2.4)
  - Questions:
    - Any component used >50% of free tier?
    - Should we upgrade anything preemptively?
  - Action: Plan upgrades for next month if needed

**Example Wednesday Report:**
```
Cost Status: Green

Database: 25 MB (baseline: 20 MB) — expected growth
Photos: 45 MB (from 15 MB last week) — 30 MB growth, trending higher
Compute: 3 concurrent connections avg — well below limit
Bandwidth: 250 MB (well below 100 GB free tier)

Slow Queries Found:
- Admin dashboard aggregation query: 1.8s (target <2s) ✅ OK
- Vendor search with rating: 680ms (target <500ms) ⚠️ Monitor
- → Remedy: Add composite index on (society_id, is_archived, rating)

Recommendations:
- Photo growth is accelerating (might indicate more bookings) — good sign
- Add vendor search index preemptively before hitting target
```

---

### Friday: Uptime & Summary

**Time:** 20 minutes  
**Owner:** Engineering Lead (for summary)

- [ ] **Uptime check**
  - Vercel: Status page https://status.vercel.com/
  - Supabase: https://status.supabase.com/
  - Manual: Visit https://proxima.vercel.app/health (if endpoint exists)
  - Questions:
    - Any downtime last 7 days?
    - Any near-misses (alerts that resolved)?
  - Action: Calculate monthly uptime = (1 - downtime_minutes / 43200) × 100%
    - Target: >99.9% = max 4.3 minutes downtime/month
    - Alert: If <99.5%

- [ ] **Performance summary for team**
  - Create Slack message (pin to #engineering):
  ```
  Weekly Performance Summary (Week of June 12-18, 2026)
  
  Health: Green ✅
  Uptime: 99.95% (target: 99.9%)
  Error Rate: 0.15% (target: <0.1%, alert threshold: >0.5%)
  
  Latency (p95):
  - Vendor Search: 480ms (target: <500ms) ✅
  - Booking Creation: 920ms (target: <1s) ✅
  - Admin Dashboard: 1.8s (target: <2s) ✅
  - Photo Upload: 4.2s (target: <5s) ✅
  - OTP Submit: 1.6s (target: <2s) ✅
  
  Business Metrics:
  - Active Residents (7-day): 12
  - Active Vendors: 5
  - Bookings This Week: 6 (target: 5+) ✅
  - Avg Rating (7-day): 4.3 / 5.0 (target: 3.5+) ✅
  
  Cost Tracking:
  - Supabase: $0 (free tier)
  - Vercel: $0 (free tier)
  - Total: $0/month
  
  Issues Resolved This Week:
  - Fixed localStorage mobile issue (PR #45)
  - Optimized vendor search query (-200ms latency)
  - Added photo compression (25% smaller uploads)
  
  Next Week Focus:
  - Monitor new vendor search index effectiveness
  - Review photo upload metrics (compression working?)
  - Prepare for Week 2 scale test (target 20 concurrent users)
  ```

- [ ] **Dashboard health check**
  - Open Sentry: https://sentry.io/organizations/[org]/dashboard/
  - Check: "Error Rate over Time" graph trending down/flat
  - Open Vercel: https://vercel.com/dashboard/[project]/monitoring
  - Check: "Response Time Distribution" histogram not shifting right
  - Action: Take screenshot for records

---

## Alerts & Escalation

### Alert Thresholds & Response

| Alert | Threshold | Initial Response | Escalation |
|-------|-----------|---|---|
| **Error Rate High** | >0.5% | Check Sentry, identify error | Page on-call if >1% |
| **P95 Latency High** | >700ms (vendor search) | Check slow queries | Page if blocking users |
| **DB Connection Limit** | >8 concurrent | Check for leaks in app | Contact Supabase if >20 |
| **Storage Growing Fast** | >500 MB/week | Review booking volume | Upgrade plan if trend |
| **Uptime Below 99.5%** | Any downtime >30 min | RCA + fix | CEO notification |
| **Failed Deployments** | >1 per day | Review logs, fix CI | Pause releases if >2 |
| **Memory Usage High** | >80% of pod limit | Investigate leaks | Restart pod if stuck |

---

### Incident Response Workflow

**If critical alert fires (P95 >1s, Error >1%, Downtime):**

1. **Acknowledge** (5 min)
   - Post in #alerts Slack channel
   - Tag on-call engineer
   - Sentry / Vercel notifies automatically

2. **Triage** (10 min)
   - Is it a real issue? (Check metrics in multiple tools)
   - User-facing or backend-only?
   - Rollback candidate? (revert last deployment)

3. **Remediate** (15-30 min depending on severity)
   - For latency: Check slow queries, add index, or revert change
   - For errors: Fix bug or revert, deploy immediately
   - For downtime: Check infrastructure, escalate to Vercel/Supabase

4. **Communicate** (5 min)
   - Post status in #alerts with ETA
   - Once fixed, post summary + root cause

5. **Postmortem** (within 24 hours)
   - Document what happened + why
   - What should prevent recurrence?
   - Add to runbook if new scenario

**Example incident:**
```
[ALERT] Error rate spiked to 2.1%

Triage: 
- Sentry shows "ReferenceError: localStorage is not defined" on 45% of errors
- Started at 2:15 PM, correlates with last deploy at 2:10 PM
- Verdict: New code bug, user-facing

Remediation:
- Revert PR #46 immediately (git revert abc1234)
- Deploy v0.1.5 hotfix
- Errors drop to 0.1% within 5 min ✅

Postmortem:
- localStorage not checked for mobile/SSR environments
- Missing unit test for localStorage access
- Action: Add test, require mobile testing in PR checklist
```

---

## Thresholds by Stage

Adjust targets based on MVP phase:

### Phase 1: First Week (20 residents, 5 bookings)
- Error Rate Alert: >1% (more lenient during early bugs)
- Latency Alert: >1s (initial launch always slightly slow)
- Uptime Target: >99% (acceptable for MVP)

### Phase 2: Stabilized (20 residents, steady 5+ bookings/week)
- Error Rate Alert: >0.5%
- Latency Alert: >700ms (vendor search), >1.5s (booking)
- Uptime Target: >99.5%

### Phase 3: Growth Phase (50+ residents, 20+ bookings/week)
- Error Rate Alert: >0.2%
- Latency Alert: >500ms (any endpoint)
- Uptime Target: >99.9%

---

## Tools & Dashboards

| Tool | Purpose | Link | Frequency |
|------|---------|------|-----------|
| **Sentry** | Error tracking + perf | https://sentry.io/organizations/[org]/ | Daily |
| **Vercel Monitoring** | Latency + uptime | https://vercel.com/dashboard/[proj]/monitoring | Daily |
| **Supabase Logs** | Database queries + errors | Supabase dashboard → Logs | Weekly |
| **Supabase Monitoring** | DB performance | Supabase dashboard → Monitoring | Weekly |
| **Google Sheets** | Cost tracking | [Link to shared sheet] | Weekly |
| **Slack** | Alerts + reporting | #alerts, #engineering | Real-time |

---

## Related Documentation

- [MONITORING-SETUP.md](./MONITORING-SETUP.md) — Sentry + Vercel configuration
- [DATABASE-MONITORING.md](./DATABASE-MONITORING.md) — SQL queries + baselines
- [DEPLOYMENT.md](./DEPLOYMENT.md) — Release process + rollback
- [SECURITY-AUDIT.md](./SECURITY-AUDIT.md) — Security monitoring

---

## Ownership & Escalation

| Role | Responsibility | Contact |
|------|---|---|
| **Engineering Lead** | Weekly checklist, alert response | @eng-lead |
| **DevOps / Platform** | Cost tracking, infrastructure alerts | @devops |
| **Founder / CEO** | Uptime SLA breaches, major incidents | @ceo |
| **Supabase Support** | DB performance issues | support@supabase.io |
| **Vercel Support** | Deployment / edge issues | support@vercel.com |

**On-Call Schedule:** [Link to PagerDuty or Slack rotation]

---

**Last Modified:** 2026-06-12  
**Next Review:** 2026-06-19
