# Proxima — Claude Code Handoff
**Date:** 2026-06-29  
**Session:** Cowork → Claude Code  
**Status:** Pre-launch. Backend functional. DB empty. SMTP unconfigured.

---

## What Was Done This Session

1. **Renamed "Zing Connect" → "Proxima"** across all 8 hardcoded locations (committed `1c178fa`, pushed to `origin/main`)
2. **Fixed magic link redirect bug** — `HomePage` now routes authenticated-but-no-profile users to `/signup` instead of `/login` (committed `deed670`)
3. **Diagnosed all launch blockers** — see below
4. **Confirmed live site works** — `https://proxima-marketplace.vercel.app` is deployed, Supabase is up, OTP email flow works (was hitting rate limit during testing)

---

## Infrastructure

| Service | Detail |
|---------|--------|
| Frontend | https://proxima-marketplace.vercel.app (Vercel, auto-deploys from GitHub main) |
| GitHub | https://github.com/shailanshgaur/proxima |
| Supabase project | `xgdxvdluadehndqduzjl` (project name: Proxima) |
| Supabase org | `yxsnhwitbpgamuiasdas` |
| Git credentials | Stored in `.git/credentials` (PAT with repo scope) |
| Branch | `main` — HEAD at `deed670` |

---

## Launch Blockers (Ordered by Priority)

### 🔴 BLOCKER 1 — Migrations 002–004 not confirmed applied to production
The migration files exist locally at `migrations/` but it's unknown if they've been run against the live Supabase instance.

**Must apply in Supabase Dashboard → SQL Editor (in order):**
- `migrations/002-fix-rls-write-policies.sql` — fixes RLS so residents can write bookings/reviews
- `migrations/003-add-constraints.sql` — UNIQUE constraints + indexes (prevents duplicate reviews)
- `migrations/004-add-rating-trigger.sql` — auto-updates vendor rating when review is created

Without these: bookings silently fail, duplicate reviews possible, ratings don't update.

### 🔴 BLOCKER 2 — Database is empty (no society, no vendors)
The `societies` and `vendors` tables have zero rows. Users get a blank screen after signup.

**Need to seed:**
```sql
-- 1. Insert society
INSERT INTO societies (name, location) 
VALUES ('Lotus Zing', 'Sector 168, Noida');

-- 2. Insert vendors (get the society UUID from step 1, then):
-- Template per vendor:
INSERT INTO vendors (name, phone, type, categories, societies)
VALUES (
  'Vendor Name',
  '+91XXXXXXXXXX',          -- real phone number
  'A',                      -- 'A' = WhatsApp only, 'B' = app-literate
  '["Plumbing"]'::jsonb,    -- category array
  '["<society-uuid>"]'::jsonb  -- society UUID from step 1
);
```

**Placeholder vendor list exists at:** `files/lotus-zing-vendor-directory.jsx`  
Contains 8 vendors with DUMMY phone numbers — need real numbers from Shailansh before seeding.

Vendor categories in use: `Plumber`, `Electrician`, `Cook`, `Carpenter`, `Housekeeping`, `Painter`, `AC Technician`

### 🔴 BLOCKER 3 — Email SMTP rate limit (4/hour, project-wide)
Supabase's built-in SMTP caps at 4 OTPs/hour total. Unusable for 750 users.

**Fix: Configure Resend**
1. Sign up at resend.com → create API key
2. Supabase Dashboard → Project Settings → Auth → SMTP Settings
3. Toggle "Enable Custom SMTP":
   - Host: `smtp.resend.com`
   - Port: `465`
   - User: `resend`
   - Password: `<Resend API key>`
   - Sender: `noreply@<your-domain>`
4. Save

Resend free tier: 3,000 emails/month, 100/day. For 750 users at launch, use paid ($20/month, 50k emails).

### 🟡 IMPORTANT 4 — N+1 query in HomePage.tsx
In `src/pages/HomePage.tsx` lines 27–34, for each booking it fetches the vendor in a separate loop:
```typescript
for (const booking of userBookings) {
  if (!vendorMap[booking.vendor_id]) {
    const vendor = await vendorService.getVendorById(booking.vendor_id);
```
Fine for 5 bookings, breaks at 50+. Should batch-fetch all vendors in one query.

**Fix:** Update `vendorService` to add `getVendorsByIds(ids: string[])` and replace the loop with a single call.

### 🟡 IMPORTANT 5 — Supabase free tier auto-pauses
The Supabase project paused during this session (returned 503). Free tier pauses after ~1 week of inactivity. With 750 daily users this shouldn't happen, but any quiet weekend can kill the app.

**Fix options:**
- Upgrade Supabase to Pro ($25/month) — recommended for production
- Or add a keep-alive cron ping to Supabase every 3 days

---

## Current Codebase State

### What's built and working
- ✅ Email OTP auth (signup + login) — `src/components/Auth/EmailLogin.tsx`, `SignupFlow.tsx`
- ✅ 3-step signup (email → OTP → name/flat/society)
- ✅ Vendor list with category filter + rating sort — `src/components/Resident/VendorList.tsx`
- ✅ Booking form + WhatsApp link generation — `src/components/Resident/BookingForm.tsx`
- ✅ Photo upload for booking completion — `src/components/Resident/BookingStatus.tsx`
- ✅ 1-5 star rating + review — `src/components/Resident/ReviewForm.tsx`
- ✅ Admin dashboard (metrics, bookings, vendors, appeals) — `src/pages/AdminPage.tsx`
- ✅ Appeals queue with 48h SLA — `src/components/Admin/AppealsQueue.tsx`
- ✅ RLS: society_id always from JWT, never client input
- ✅ Vendor auto-archive on rating <3.0 or 3+ no-shows (trigger in migration 004)

### Known gaps (not in MVP, deferred)
- ❌ Push notifications
- ❌ Multi-dimensional ratings (8-dimension system in Constitution — V1.5)
- ❌ Vendor dashboard for Type B vendors
- ❌ In-app payments (cash/UPI out-of-band for now)
- ❌ UI styling (functional but plain white, no design system applied)
- ❌ Error monitoring (no Sentry/Vercel Analytics set up)
- ❌ Photo cleanup job (delete photos >90 days — Supabase scheduled function needed)

### File map
```
src/
  pages/         LoginPage, SignupPage, HomePage, AdminPage
  components/
    Auth/        EmailLogin, PhoneLogin (unused), SignupFlow
    Resident/    VendorList, BookingForm, BookingStatus, ReviewForm
    Admin/        AppealsQueue
  lib/           supabaseClient, authService, bookingService, vendorService,
                 storageService, reviewService, appealService
  types/         index.ts (all TypeScript interfaces)
migrations/      001-core-schema, 002-fix-rls, 003-constraints, 004-rating-trigger
files/           lotus-zing-vendor-directory.jsx (vendor seed data, dummy phones)
.claude/agents/  product.md, architect.md, security.md, ceo.md + 6 others
```

---

## Agent Verdicts (from this session)

### Product Agent
- **BLOCK launch** until vendors + society seeded and SMTP live
- Product thinking is solid (WhatsApp-first, photo proof, auto-archive, appeals)
- Constitution Laws (4 laws) are well-designed, not yet fully implemented — defer to V1.5
- OKR target: 200 residents, 50 vendors, 100 completed bookings for Q3 2026

### Architect Agent  
- **BLOCK** on migrations 002–004 not confirmed applied
- N+1 query in `HomePage` is tech debt — ticket before full 750-user launch
- Supabase keep-alive needed for reliability
- No monitoring in place — add Vercel Analytics at minimum before launch

### CEO Decision
Ship order: migrations → seed → SMTP → N+1 fix → keep-alive → launch

---

## Scale Context
- **Target:** 750+ members, Lotus Zing, Sector 168, Noida
- **Vendor target:** 50–100 vendors at launch (currently 0 in DB)
- **WhatsApp community** will handle resident onboarding (no in-app onboarding needed)
- **Year 2 monetization:** Featured listings ($10/month vendor), transaction fees (5%)

---

## What Claude Code Should Do Next

1. **Verify migrations applied** — query Supabase to check if tables have the constraints/indexes from 002–003 and trigger from 004. If not, print the SQL to apply.
2. **Prepare seed SQL** — generate complete seed script for Lotus Zing + vendors (await real phone numbers from Shailansh)
3. **Fix N+1 query** in `src/pages/HomePage.tsx` + add `getVendorsByIds` to `src/lib/vendorService.ts`
4. **Add Resend SMTP instructions** inline in code as comments in `src/lib/authService.ts`
5. **UI pass** (optional but high-value) — apply design system from `PROXIMA-MASTER-DESIGN.md`

---

## Security Notes (DO NOT LOSE)
- Society ID must ALWAYS come from JWT token, never from client input (core RLS constraint)
- Admin role set via `is_admin` flag in DB only — never via app UI
- GitHub PAT stored in `.git/credentials` — do not log or expose
- Supabase anon key is in `.env` — never commit, use Vercel env vars in production
