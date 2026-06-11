# ZingConnect Hybrid MVP - 3-4 Day Sprint Plan

> **For subagent-driven execution:** 10 parallel tasks, fresh subagent per task, two-stage review (spec + quality), no human-in-loop between tasks.

**Goal:** Ship working MVP: residents book vendors via app, vendors confirm via WhatsApp, residents rate, admin reviews appeals in Google Sheets.

**Architecture:** React frontend (Vercel) + Supabase backend (Postgres/Auth/Storage) + Google Sheets admin dashboard + Apps Script nightly jobs.

**MVP Scope (core only):**
- Resident: signup, view vendors, book, upload photo, rate
- Vendor Type A: receive WhatsApp, reply to confirm
- Admin: Google Sheets (vendors, bookings, reviews, appeals), nightly auto-archive job
- No: vendor dashboard, real-time, push notifications, multi-society

---

## Task 1: Supabase Schema & RLS

**Files:**
- Create: `migrations/001-core-schema.sql`

**Scope:**
- Tables: societies, users, vendors, bookings, reviews, appeals
- RLS: users can only see their society's vendors and their own bookings
- Indexes on vendor_id, resident_id, status, scheduled_date

**Code:**
```sql
-- Core schema
CREATE TABLE societies (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name TEXT UNIQUE, location TEXT, created_at TIMESTAMP DEFAULT NOW());

CREATE TABLE users (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), auth_id UUID REFERENCES auth.users(id), society_id UUID REFERENCES societies(id), name TEXT, phone TEXT UNIQUE, flat_number TEXT, is_admin BOOLEAN DEFAULT false, created_at TIMESTAMP DEFAULT NOW());

CREATE TABLE vendors (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name TEXT, phone TEXT UNIQUE, type TEXT CHECK (type IN ('A', 'B')), categories JSONB DEFAULT '[]', societies JSONB DEFAULT '[]', rating DECIMAL(3,2) DEFAULT 0, review_count INT DEFAULT 0, is_archived BOOLEAN DEFAULT false, appeal_status TEXT DEFAULT 'none', created_at TIMESTAMP DEFAULT NOW());

CREATE TABLE bookings (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), resident_id UUID REFERENCES users(id), vendor_id UUID REFERENCES vendors(id), society_id UUID REFERENCES societies(id), service_type TEXT, scheduled_date DATE, scheduled_time TIME, status TEXT DEFAULT 'pending', confirmed_at TIMESTAMP, completed_at TIMESTAMP, photo_url TEXT, rating_given BOOLEAN DEFAULT false, created_at TIMESTAMP DEFAULT NOW());

CREATE TABLE reviews (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE, resident_id UUID REFERENCES users(id), vendor_id UUID REFERENCES vendors(id), rating INT CHECK (rating >= 1 AND rating <= 5), text TEXT, created_at TIMESTAMP DEFAULT NOW());

CREATE TABLE appeals (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), vendor_id UUID REFERENCES vendors(id), reason TEXT, evidence_url TEXT, status TEXT DEFAULT 'pending', decision_reason TEXT, created_at TIMESTAMP DEFAULT NOW(), decided_at TIMESTAMP, deadline_at TIMESTAMP DEFAULT (NOW() + INTERVAL '48 hours'));

-- RLS (basic)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_record" ON users FOR SELECT USING (auth_id = auth.uid());
CREATE POLICY "vendors_visible_to_society" ON vendors FOR SELECT USING (societies @> ARRAY[(SELECT society_id FROM users WHERE id = (SELECT id FROM users WHERE auth_id = auth.uid()))]::UUID[]);
CREATE POLICY "bookings_resident_only" ON bookings FOR SELECT USING (resident_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

-- Indexes
CREATE INDEX idx_users_auth ON users(auth_id);
CREATE INDEX idx_vendors_type ON vendors(type);
CREATE INDEX idx_bookings_resident ON bookings(resident_id);
CREATE INDEX idx_bookings_vendor ON bookings(vendor_id);
CREATE INDEX idx_bookings_status ON bookings(status);
```

---

## Task 2: React Scaffolding & Routing

**Files:**
- Create: `src/App.tsx`, `src/main.tsx`, `src/pages/`, `package.json`, `vite.config.ts`

**Scope:**
- Vite + React 18 + TypeScript
- Routes: /login, /signup, /home (resident), /admin (status only)
- Basic layout wrapper

**Steps:**
1. `npm create vite@latest zing-connect -- --template react-ts && cd zing-connect`
2. `npm install @supabase/supabase-js react-router-dom typescript`
3. Create routing structure
4. Commit

---

## Task 3: Supabase Client & Auth Service

**Files:**
- Create: `src/lib/supabaseClient.ts`, `src/lib/authService.ts`, `src/types/index.ts`

**Scope:**
- Supabase client init (env vars)
- Phone OTP signup/login
- Get current user
- Types for User, Vendor, Booking, Review, Appeal

**Code:**
```typescript
// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';
export const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

// src/lib/authService.ts - signup, signInWithOtp, verifyOtp, getSession, getUserProfile
```

---

## Task 4: Resident Auth UI (Phone OTP)

**Files:**
- Create: `src/components/Auth/PhoneLogin.tsx`, `src/components/Auth/SignupFlow.tsx`

**Scope:**
- Phone input → OTP → verify → society/name/flat form
- On success: redirect to /home
- Error handling

**Steps:**
1. PhoneLogin (2 forms: send OTP, verify OTP)
2. SignupFlow (3 steps: phone, OTP, details)
3. Wire to authService
4. Commit

---

## Task 5: Vendor List & Booking Form

**Files:**
- Create: `src/components/Resident/VendorList.tsx`, `src/components/Resident/BookingForm.tsx`, `src/lib/bookingService.ts`

**Scope:**
- Fetch vendors by society (not archived)
- Display: name, rating, categories
- Click → booking form (date, time, service type)
- Generate WhatsApp click-to-chat link
- Submit → create booking record
- Show link to resident (click to open WhatsApp)

**Code:**
```typescript
// bookingService - createBooking, generateWhatsAppLink
// VendorList - list + filter by category
// BookingForm - form + WhatsApp link generation
```

---

## Task 6: Photo Upload & Storage

**Files:**
- Create: `src/lib/storageService.ts`, `src/components/Resident/BookingStatus.tsx`

**Scope:**
- After booking confirmed, resident uploads photo
- Compress image (max 1000px, 80% quality)
- Store in Supabase bucket
- Mark booking complete
- Show status in UI

**Code:**
```typescript
// storageService - uploadBookingPhoto, compressImage
// BookingStatus - show status, photo upload UI, mark complete
```

---

## Task 7: Review System (Rating & Display)

**Files:**
- Create: `src/components/Resident/ReviewForm.tsx`, `src/lib/reviewService.ts`

**Scope:**
- After booking completed, resident rates (1-5 stars) + optional comment
- Store review
- Update vendor rating (avg of all reviews)
- Display reviews on vendor profile

**Code:**
```typescript
// reviewService - createReview, getVendorReviews, updateVendorRating
// ReviewForm - star rating + text input
```

---

## Task 8: Google Sheets Admin Dashboard Setup

**Files:**
- Create: `sheets/Lotus-Zing-Admin-Dashboard.md` (instructions)

**Scope:**
- Create Google Sheet with tabs:
  1. Vendors (name, phone, type, rating, review_count, is_archived, appeal_status)
  2. Bookings (resident, vendor, date, time, status, photo_url, rating_given)
  3. Reviews (vendor_id, resident_id, rating, text, created_at)
  4. Appeals (vendor_id, reason, status, decision_reason, deadline, decided_at)
  5. Config (society_id, admin_email, nightly_job_schedule)

**Steps:**
1. Create blank Google Sheet
2. Add tabs with headers (no formulas, just structure)
3. Set sharing (view only for sharing, edit for you)
4. Share link in docs

**Manual data sync:** Apps Script job will populate data (Task 9)

---

## Task 9: Apps Script Nightly Job (Auto-Archive & Sync)

**Files:**
- Create: `scripts/nightly-job.gs` (Google Apps Script)

**Scope:**
- Triggered at 2 AM daily
- Fetch all bookings from Supabase (via API call)
- Auto-archive vendors: rating < 3.0 OR 3+ no-shows in 30 days
- Sync to Google Sheets: update Vendors, Bookings, Reviews tabs
- Log failures to admin email

**Code:**
```javascript
// nightly-job.gs
function nightly() {
  // 1. Fetch data from Supabase (REST API)
  // 2. Check auto-archive conditions
  // 3. Update Supabase vendors table
  // 4. Sync Vendors, Bookings, Reviews to Sheets
  // 5. Send email if failures
}

// Set trigger: every day 2 AM
```

**REST API Calls:**
- GET /rest/v1/bookings?status=eq.completed
- GET /rest/v1/vendors
- PATCH /rest/v1/vendors (archive)

---

## Task 10: Appeals & Admin Manual Workflow

**Files:**
- Create: `sheets/Appeals-Sheet-Instructions.md`, `scripts/appeal-handler.gs`

**Scope:**
- Appeals tab in Google Sheet (vendor_id, reason, evidence_url, status, decision_reason, deadline_at)
- Manual workflow: you review → click "Approve" or "Reject" in dropdown → add reason
- Apps Script sends email to vendor (approved/rejected)
- If approved: Apps Script un-archives vendor in Supabase

**Code:**
```javascript
// appeal-handler.gs
function onEdit(e) {
  // When Appeals sheet status changed to "approved"/"rejected"
  // 1. Read decision + reason
  // 2. Send email to vendor
  // 3. If approved: un-archive vendor in Supabase
  // 4. Update decided_at timestamp
}
```

---

## Task Dependencies

```
Task 1 (Supabase) → Task 3 (Client) → Task 4, 5, 6, 7 (React components)
Task 2 (Scaffolding) → Task 4, 5, 6, 7
Task 8 (Google Sheets) → Task 9 (Nightly job)
Task 9 → Task 10 (Appeals automation)
```

**Parallelizable:** Tasks 1-2 in parallel, then 3-7 in parallel, then 8-10 in parallel.

---

## Success Criteria

- ✅ Resident can signup → view vendors → book → upload photo → rate
- ✅ Vendor receives WhatsApp message (link generated, resident clicks)
- ✅ Bookings appear in Google Sheets within 2 hours (nightly job)
- ✅ Vendors auto-archive when rating < 3.0
- ✅ Appeals workflow: submit → you decide → email sent
- ✅ Zero blockers to launch
- ✅ Basic UI (no visual polish, focus on function)

---

## Timeline

- **Day 1:** Tasks 1-3 (infrastructure ready)
- **Day 2:** Tasks 4-7 (resident app working)
- **Day 3:** Tasks 8-10 (admin dashboard + nightly jobs)
- **Day 4 (buffer):** Testing, bug fixes, deploy

---

## Execution Mode

**Subagent-Driven:** 10 fresh subagents, one per task, two-stage review (spec + quality), no human-in-loop between tasks. Execute all tasks continuously.
