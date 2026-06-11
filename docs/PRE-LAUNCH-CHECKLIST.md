# Pre-Launch Checklist

**Status:** Ready for soft launch (20 residents)  
**Date:** 2026-06-12  
**Target Launch:** 2026-06-15 (Day 3)

---

## Critical Blockers (Must Fix)

- [ ] **Migration 002** — Apply in Supabase dashboard (5 min, RLS write policies)
- [ ] **Migration 003** — Apply in Supabase dashboard (5 min, UNIQUE constraints + indexes)
- [ ] **Migration 004** — Apply in Supabase dashboard (5 min, vendor rating trigger)
- [ ] **WhatsApp Message** — Fixed (includes booking ID)
- [ ] **Admin Pagination** — Fixed (limit 100 records per tab)
- [ ] **Vendor Rating Sort** — Fixed (sort by rating or name)

**Status:** ✅ All code fixes applied

---

## Pre-Launch Tests (Must Pass)

- [ ] **End-to-End Test**
  1. Signup with phone OTP
  2. Select vendor from list
  3. Create booking
  4. Receive WhatsApp message (with booking ID)
  5. Upload photo
  6. Rate vendor
  7. Verify review appears on vendor profile

- [ ] **Constraint Tests**
  - [ ] Second review for same (resident, vendor) fails (UNIQUE constraint)
  - [ ] 6th active booking for resident fails (CHECK constraint)
  - [ ] Vendor rating updates atomically after review (trigger)

- [ ] **Admin Dashboard Tests**
  - [ ] Admin can view vendors (first 100)
  - [ ] Admin can view bookings (first 100)
  - [ ] Admin can view appeals (first 100)
  - [ ] Pagination shows newest first (order by created_at DESC)

- [ ] **Data Integrity Tests**
  - [ ] Photo cleanup job runs (no photos >90 days old)
  - [ ] RLS prevents resident seeing other resident's bookings
  - [ ] RLS prevents resident modifying other resident's data

---

## Infrastructure Setup

- [ ] **Error Logging** — Add Sentry or Vercel Analytics
- [ ] **Alerting** — Set alerts (errors >5/min, latency >1s)
- [ ] **Monitoring Dashboard** — Set up latency, error rate, uptime tracking
- [ ] **Photo Cleanup Job** — Create Supabase scheduled function (delete after 90 days)

---

## Deployment Plan

### Day 1 (3:00 AM)
```
Maintenance Window (5 min)

1. Pause accepting new residents (soft block in UI)
2. Apply migration 002 in Supabase
3. Apply migration 003 in Supabase
4. Apply migration 004 in Supabase
5. Verify all data intact (SELECT COUNT(*) on each table)
6. Resume accepting residents
```

### Day 2 (10:00 AM)
```
Code Deployment

1. Verify all code changes in git (show git status)
2. Deploy to Vercel (auto-deploy on git push)
3. Wait for build to complete (2 min)
4. Monitor error rate + latency (5 min)
5. Run smoke test (signup → book → rate)
6. Declare green or rollback
```

### Day 2-3 (Throughout)
```
Monitoring

- Error rate <0.1% ✅
- Latency p99 <1s ✅
- Uptime 100% ✅
- No data anomalies ✅
```

### Day 3 (5:00 PM)
```
Soft Launch

1. Email 20 residents: "Zing Connect is live! Book a service."
2. Team on standby (support mode)
3. Monitor for issues (live for 1 hour before sleep)
```

---

## Rollback Plan

If deployment breaks:

```
1. git revert <commit>
2. git push (triggers Vercel redeploy)
3. Wait for green
4. Investigate issue
5. Fix + retest
6. Redeploy
```

**Rollback time:** <5 minutes

---

## Post-Launch Monitoring (Week 1)

**Daily (24/7):**
- Error rate (alert if >1%)
- Latency (alert if p99 >1s)
- Uptime (alert if any downtime)
- Storage growth (alert if >1GB/day)

**Metrics to Track:**
- Signups (target: 20 residents)
- Bookings created (target: 5+)
- Bookings completed (target: 3+)
- Avg vendor rating (target: 3.5+)
- Review count (target: 10+)

**Issues to Watch:**
- Vendor adoption of WhatsApp flow (manual check)
- Fraud attempts (review admin dashboard)
- No-show rate (track in bookings)
- Photo upload failures (check logs)

---

## Soft Launch Metrics (Success Criteria)

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Signups | 20 residents | TBD | |
| Bookings | 5+ created | TBD | |
| Completion | 3+ completed | TBD | |
| Avg Rating | 3.5+ | TBD | |
| Uptime | 100% | TBD | |
| Error Rate | <0.1% | TBD | |
| Latency p99 | <1s | TBD | |

---

## Rollback Criteria

Rollback immediately if:
- 🔴 Any data breach (auth bypass, RLS broken)
- 🔴 >10% error rate (system is broken)
- 🔴 >50% no-shows (product is unusable)
- 🔴 Type A vendors don't use WhatsApp (core assumption fails)

---

## Day 10 Post-Mortem

After 1 week soft launch:
- [ ] What went right?
- [ ] What went wrong?
- [ ] What did we learn?
- [ ] What's next (full launch, iterate, pivot)?

---

## Contacts

- **On-Call:** [Team lead]
- **Escalation:** [Manager]
- **Slack Channel:** #zing-connect-launch
