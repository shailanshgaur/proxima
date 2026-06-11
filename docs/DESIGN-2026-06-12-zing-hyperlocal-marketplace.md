# ZingConnect: Hyperlocal Marketplace MVP Design
**Date:** 2026-06-12  
**Status:** Design Approved  
**Author:** Claude Code + User Brainstorm

---

## 1. Vision

Convert ZingConnect from single-building service directory into a hyperlocal marketplace. Start in one residential society (250+ residents, local vendors), expand outward in ripple effect to adjacent societies as demand grows. Eventually reach city/neighborhood scale.

**Monetization:** Free to operate today. Premium listings (year 2), transaction fees (year 3+), data insights (all years). All data captured from day 1, monetized when you have leverage.

---

## 2. Constraints (Hard)

- **Zero cost to operate.** No paid services. No infrastructure spend.
- **Your time ≈ 0.** Admin role: minimal. ~1 hour/week reviewing appeals. That's it.
- **Not responsible for anything.** Platform is coordination only. Residents & vendors use at own risk. ToS: "Platform not liable for service quality, disputes, payment, issues."
- **Both vendor types:** Illiterate vendors (WhatsApp-only) + literate vendors (app). Must support both.

---

## 3. Tech Stack (Free, Scalable)

| Component | Service | Why |
|---|---|---|
| Frontend | React (Vercel) | Auto-deploy from git, free tier, fast |
| Database | Supabase (Postgres) | Postgres from day 1, real-time, free tier, scales to millions |
| Auth | Supabase Auth | Email/phone, no password friction |
| Storage | Supabase (500MB free) + image compression | Photos, proof of service, auto-cleanup |
| Deployment | Vercel (React), Supabase (backend) | Both free tier, auto-scaling |
| Vendor communication | WhatsApp (click-to-chat links) | Free, native WhatsApp, no API cost |

**Cost breakdown:**
- MVP (single society, <500 bookings/month): $0
  * Estimate: 500 bookings × 1 photo × 2MB = 1GB/month
  * 500MB Supabase free tier = 2 months of photos
  * Cleanup: auto-delete photos after 90 days (booking complete, dispute unlikely)
  * Storage cycle: 500MB × 2 months = manageable
- Society 2-3 (2000+ bookings/month): still free
  * Cleanup policy: photos deleted after 90 days
  * If storage overflows: reduce photo quality (compress to 500KB per image)
- Society 5+ (10k+ bookings/month): ~$25/month Supabase (you monetize by then)

---

## 4. Data Model

### Core Tables

**`societies`** — Each community
```
id, name, location, resident_count, created_at
```

**`users`** — Residents
```
id, society_id, name, phone (primary, verified via OTP), email (optional), flat_number, created_at
```

**Auth flow:**
- Resident enters phone number
- System sends OTP via SMS (free tier)
- Resident enters OTP → logged in
- Optional: enter email and flat number
- Email optional (can update later)

**`vendors`** — Service providers (both types)
```
id, name, phone, type ('A'|'B'), societies (JSON array), 
categories (JSON), rating, review_count, 
is_archived, appeal_status, created_at
```

**`bookings`** — Service requests (core transaction)
```
id, resident_id, vendor_id, society_id, service_type, 
scheduled_date, scheduled_time, 
status ('pending'|'confirmed'|'completed'|'no_show'|'cancelled'),
whatsapp_sent_at, confirmation_method ('whatsapp_timeout'|'app_tap'|'manual'),
confirmed_at, completed_at, rating_given, photo_url,
created_at
```

**`reviews`** — Resident ratings of vendors
```
id, booking_id, resident_id, vendor_id, rating (1-5), 
text, reviewer_level, created_at
```

**`appeals`** — Vendor disputes on archival
```
id, vendor_id, reason, evidence_url, status ('pending'|'approved'|'rejected'),
decided_at, decision_reason, created_at, deadline_at (created_at + 48h)
```

**`vendor_interactions`** — Type A vendor logs (manual entry by admin)
```
id, vendor_id, booking_id, message_sent_text, response_received,
response_text, admin_note, created_at
```

**Future monetization tables (year 2+):**
- `vendor_premiums` — who paid for featured listing
- `transaction_fees` — cuts taken per booking
- `disputes` — resident-vendor payment conflicts

---

## 5. Core Flows (4 Essentials)

### 5.1 Service Request Flow (Essential #1)

**Type A Vendor (Illiterate, WhatsApp-only):**
```
1. Resident opens app → selects vendor + service type + date/time
2. Resident taps "Confirm Booking"
3. System creates booking record (status: pending)
4. System generates WhatsApp click-to-chat link (free, no API):
   `https://wa.me/[vendor-phone]?text=...pre-filled-message...`
   - Resident sees button: "Confirm with Vendor"
   - Resident clicks → opens WhatsApp with pre-filled message:
     "[Vendor Name], you have a new booking! 📍
      Flat: [2405], Date: [Sat June 14], Time: [2 PM]
      Service: [Plumbing]
      Reply YES to confirm or DECLINE"
   - Resident hits send
   - Vendor replies in WhatsApp (not in app)
   - Resident screenshot/copy vendor's reply into app (manual, but simple)
5. 30-min wait:
   - If vendor replies "YES" / "✓" → booking confirmed
   - If vendor replies "NO" / "DECLINE" → booking cancelled, resident notified
   - If no reply after 30 min → auto-confirm (assume agreement)
6. Confirmed booking: resident sees "Vendor confirmed ✓"
7. Vendor arrives, completes service
8. Resident taps "Mark Complete" + uploads photo (proof of payment/service)
9. Photo must show: vendor + flat entrance + any proof (receipt, service, etc.)
10. Only after photo: resident can rate vendor
11. Booking status: completed, review published
```

**Type B Vendor (Literate, App-enabled):**
```
1-3. Same as Type A
4. System sends app push notification (instead of WhatsApp)
5. Vendor sees in-app notification: "[Resident Name], Flat [2405], [Plumbing], [2 PM]"
6. Vendor taps "Confirm" or "Decline"
7. If confirmed: booking status updates real-time (resident sees ✓ instantly)
8-11. Same as Type A (completion, photo, rating)
```

**Booking status flow:**
```
pending (30 min) → confirmed → completed (when photo uploaded)
                ↘ cancelled (vendor declines OR 30-min timeout with no confirm)
                ↘ no_show (resident marks at scheduled_time + 15 min)
                ↘ cancelled (resident cancels before confirmation)

Timing:
- Booking created: status = pending
- WhatsApp sent immediately
- No response in 30 min: auto-confirm (status = confirmed, assume vendor saw it)
- Vendor declines: auto-cancel immediately
- Resident doesn't mark complete by scheduled_time + 15 min: auto-cancel (no-show)
```

---

### 5.2 Review System (Essential #3)

**All reviews shown equally. No weighting algorithm.**

```
1. After booking completed, resident rates (1-5 stars)
2. Optional comment field
3. System captures:
   - Rating, text, resident level, timestamp
   - No metadata hiding
4. Display:
   - All reviews sorted by newest/oldest (or optional: helpful votes)
   - Show reviewer level (new resident, regular, trusted) for transparency
   - No algorithm (no "weighted 1.2x for community champion")
5. Resident decides whose review matters
```

**Data captured for monetization:**
- Vendor rating trends (pricing insights)
- Review sentiment (satisfaction score)
- Resident trust patterns (who rates whom)

---

### 5.3 Appeal SLA (Essential #2)

**Vendor can appeal archival within 48 hours.**

```
1. Vendor auto-archived (by system rule):
   - Rating drops below 3.0 (out of 5), OR
   - 3+ no-shows in last 30 days, OR
   - 5+ negative reviews in last 30 days
   
   You can also manually archive: click "Archive" on vendor profile (no reason required)
2. Vendor sees: "Your profile is archived. Appeal your archival?"
3. Vendor fills form:
   - "Why should we restore?" (text)
   - Optional: evidence file (photo, video, docs)
4. System:
   - Creates appeal record (status: pending)
   - Auto-sends to vendor:
     * Type B vendors: in-app notification + email
     * Type A vendors: WhatsApp message (free, they use it) or SMS (free tier)
   - Message: "Appeal received. Decision within 48 hours."
   - Notifies you (admin): "New appeal from [Vendor]"
5. You review (once/week):
   - Read reason + evidence
   - Click "Approve" or "Reject" + add reason
6. System auto-sends decision to vendor:
   - Type B: in-app notification + email
   - Type A: WhatsApp or SMS
   - If approved: "Your profile restored. Bookings resume."
   - If rejected: "Appeal rejected. Reason: [your reason]"
7. Deadline tracked: 48h SLA enforced (shows you if overdue)
```

**You don't decide arbitrarily.** Decision data:
- Vendor's booking history (no-shows, cancellations)
- Resident complaints (text, pattern)
- Review scores (trend, recent vs old)
- Evidence submitted (credibility)

You make the call, but informed.

---

### 5.4 Admin Dashboard (Essential #4)

**Your view. Minimal, read-only.**

**Dashboard tabs:**

1. **Overview (Today)**
   - Bookings today: pending, confirmed, completed, cancelled
   - Vendor flags (spam, low rating, fraud signals)
   - Pending appeals (deadline alerts)

2. **Bookings (All)**
   - Table: vendor, resident, flat, date, time, status, rating
   - Filter by society, vendor, status
   - Sort by completion rate, response time

3. **Vendors (All)**
   - Table: name, rating, # bookings, # reviews, type (A|B), archived
   - Flags (low rating, no-shows, fraud)
   - Can archive manually (vendor can appeal)

4. **Appeals (Queue)**
   - Reason, evidence link, deadline (48h from creation)
   - Status (pending, approved, rejected)
   - One-click approve/reject + reason field

5. **Metrics (Auto-calculated)**
   - Response time (avg vendor time to confirm)
   - Completion rate (completed / confirmed)
   - Resident satisfaction (avg rating)
   - No-show rate (per vendor, per society)
   - Vendor performance ranking (by bookings, rating, repeat business)

6. **Growth (Per-society)**
   - Residents signed up, vendors signed up, bookings
   - Trend (this week, this month, all-time)

**Your job:** View it daily (5 min), review appeals weekly (1 hour). That's it.

---

## 5.5 Vendor Onboarding

**Type B Vendor (Literate, App):**
- Vendor enters phone number → OTP verification
- Fills profile: name, categories, photo, WhatsApp (optional)
- Chooses societies to serve (checkboxes)
- Immediately active, can receive bookings

**Type A Vendor (Illiterate, WhatsApp-only):**
- Residents recommend vendors via app: click "Suggest Vendor" → name + phone
- You (admin) receive list of suggested vendors weekly
- You contact vendor (WhatsApp/call): "You've been recommended on ZingConnect"
- Vendor says yes/no
- If yes: you add them manually (no registration needed, just phone number + name in database)
- Vendor starts receiving WhatsApp bookings immediately (no login required)

---

## 6. Growth: Zero-Code Expansion

### MVP (Day 1): Single Society

- App shows "Which society?" dropdown at signup
- You add initial society via admin panel: click "Add New Society" → form → save
- Society appears in dropdown immediately
- Residents/vendors sign up and pick their society
- Type A vendors: manually added by you (via resident suggestions)

### Expansion to Society 2 (Month 3+)

- You click: "Add New Society" in admin dashboard
- Fill form: name, location, resident count (optional)
- Click save
- Immediately appears in resident/vendor signup dropdowns
- No code change, no deployment, no git

### Vendor Expansion

**Vendor rating is global (same across all societies):**
- Vendor rated 4.8 in Society 1 → appears as 4.8 in Society 2 (when they expand)
- Reason: prevents sandbagging (vendor can't reset rating by moving)
- Creates incentive: good service in Society 1 = trusted in Society 2

**Type B vendors (app):** Can check boxes in profile: "I serve: [Society 1] [Society 2]"
- Vendor's global rating shows in all societies they're active in

**Type A vendors (WhatsApp):** You manage in admin dashboard (checkboxes per vendor)
- Mark vendor as "serving Society 2" → vendor's profile (with global rating) appears there

### Result

- You onboard new societies once per month (1 form fill)
- No DevOps, no code, no infrastructure changes
- Vendors naturally expand (more societies = more bookings = more income)
- Residents see vendors who serve their society

---

## 7. Safety Mechanisms (All Free)

### No Ghost Confirmations

**Type A (WhatsApp):**
- 30-min auto-confirm if no decline reply
- Reason: assume vendor saw message

**Type B (App):**
- Vendor taps confirm explicitly
- No timeout, immediate confirmation

### No-Show Prevention

**Type A:** Auto-cancel if booking reaches scheduled time and resident hasn't marked complete
- Resident can rebook immediately

**Type B:** Same as Type A
- If vendor was late, resident still marks complete (photo proof)

### Proof of Service

**All vendors:** Must upload photo at completion
- Resident taps "Mark Complete" → uploads photo
- App shows: "Photo must show vendor or service + flat location"
- No manual verification (too slow, you're busy)
- Resident confirms: "Service complete ✓" (binary: yes/no)
- If resident confirms: booking auto-marked complete, photo stored, rating unlocked
- If resident disputes later: you manually review photo + booking history, decide
- Fraud detection: track which vendors have highest dispute rate (data signal for year 2)

### Overbooking Prevention

**Type B vendors:** Calendar with 2-hour blocking per confirmed booking
- When vendor confirms booking, 2-hour window is blocked on their calendar
- System rejects new booking requests during that window
- Vendor must manually unblock if service ends early

**Type A vendors:** You manage manually via admin dashboard
- When Type A vendor gets booking, dashboard shows: [Vendor Name] - [Date] [Time] - BLOCKED
- You mark vendor as unavailable for that 2-hour slot (simple toggle)
- Prevents sending overlapping WhatsApps to same vendor
- If vendor confirms fast, you unblock early

### Illiterate Vendor Safety

**Type A design principles:**
- Simple WhatsApp message (3 lines, emojis, no complex language)
- Response options clear (YES/NO)
- Auto-confirm if unsure (assume good faith)
- Photo proof = accountability

**Type B design principles:**
- Icons + simple language
- Push notification instead of text
- Large tappable buttons

---

## 8. Data Captured (For Year 2-3 Monetization)

**From day 1, all captured:**

| Data | Why | Use (Year 2+) |
|---|---|---|
| Booking date/time/vendor/flat | Transaction timing | Demand patterns, peak hours |
| Service type, categories | What's requested | Market demand by category |
| Response time (vendor → confirm) | Vendor reliability | Premium tier: "fast responders" |
| Completion rate per vendor | Trust signal | Vendor ranking, fraud detection |
| No-show rate | Risk | Charge higher-risk vendors premium |
| Rating distribution | Satisfaction | Vendor score = money (premium) |
| Review text (sentiment) | Quality feedback | Vendor insights, pricing signals |
| Resident spend (bookings × avg price) | Lifetime value | Resident segmentation |
| Repeat bookings | Loyalty | Vendor performance, stickiness |

**Monetization paths (year 2+):**
1. Premium listings: vendor pays $10/month → featured badge → more bookings
2. Transaction fee: you take 5% of quoted price (or resident pays fee)
3. Data insights: sell anonymized demand/pricing to vendors (market trends)
4. Sponsored listings: vendor pays to appear first in category

---

## 9. Liability & Legal

**ToS (All residents & vendors agree at signup):**

> "ZingConnect is a coordination platform. We facilitate bookings between residents and vendors. We are not responsible for: (1) service quality or delivery, (2) payment accuracy or disputes, (3) vendor reliability or background, (4) resident conduct. Residents and vendors are responsible for their own agreements, conduct, and disputes. Appeals are reviewed at platform discretion; decisions are final and non-appealable. By using this platform, you accept these terms and release ZingConnect from liability for any issues arising from services booked."

**Your role (clear boundaries):**
- Platform operator: server uptime, feature maintenance
- Appeal arbiter: review vendor archival appeals, make final decision (discretionary)
- Spam moderation: delete fake accounts, block abuse only
- **NOT:** vendor vetting, background checks, quality assurance, payment processing, dispute arbitration

**You explicitly NOT responsible for:**
- Whether service was actually delivered
- Whether resident paid the quoted price
- Whether vendor shows up on time
- Whether quality meets resident expectations
- Anything vendors or residents claim happened after booking confirmed

---

## 10. Implementation Phases (Estimated)

| Phase | Timeline | Scope |
|---|---|---|
| 1 | Week 1-2 | Frontend scaffolding (React), Supabase setup, auth (email/phone), basic UI |
| 2 | Week 2-3 | Core booking flow (Type A + B), WhatsApp integration (message template), Postgres schema |
| 3 | Week 3 | Photo upload + storage, review system, approval SLA tracking |
| 4 | Week 4 | Admin dashboard (minimal), society management (add new society), appeals UI |
| 5 | Week 4-5 | Testing, deployment to Vercel, soft launch to 20 residents |
| 6 | Week 5 | Bug fixes, full launch to all residents |

**Team:** You (product/ops) + 1 developer (5-6 weeks full-time)

---

## 11. MVP Success Criteria

- ✅ Residents can book vendors via app
- ✅ Vendors get WhatsApp confirmations (Type A) or app notifications (Type B)
- ✅ Residents rate vendors
- ✅ Vendor appeals work (48h SLA)
- ✅ Admin dashboard shows all data
- ✅ Zero cost to operate
- ✅ No bugs blocking core flows

---

## 12. Known Risks & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Type A vendor doesn't read WhatsApp | Missed booking | Auto-confirm after 30 min, resident can call vendor directly |
| Vendor confirms but no-show | Resident frustrated | Booking marked no-show, affects vendor rating, auto-cancel at scheduled time |
| Resident doesn't upload photo | Can't prove service happened | Booking stays incomplete, vendor can dispute (but no appeal mechanism for vendor) |
| Vendor disputes you unfairly | Trust erosion | Show data in appeal decision (ratings, history), be transparent |
| Illiterate vendor can't confirm app (Type B) | Can't onboard | Stick to Type A (WhatsApp), only offer app to literate vendors |

---

## 13. Glossary

- **Type A Vendor:** Illiterate, WhatsApp-only, no app access
- **Type B Vendor:** Literate, app access, can confirm bookings in-app
- **Booking:** A service request from resident to vendor (core transaction)
- **Confirmation:** Vendor agrees to come (via WhatsApp yes/no or app tap)
- **Completion:** Booking finished, resident uploaded photo proof, rating given
- **Appeal:** Vendor disputes their archival, requests restoration
- **SLA:** Service Level Agreement (48-hour deadline for appeals)
- **Photo Proof:** Image resident uploads showing vendor + service + flat
- **Society:** One residential community (building, neighborhood, etc.)
- **Premium Listing:** Vendor pays for featured badge, increased visibility (year 2+)

---

## 14. Next Steps

1. Developer reviews this spec, asks clarifying questions
2. Frontend scaffolding + Supabase schema design
3. Begin Phase 1 (week 1-2)
4. Soft launch week 5
5. Full launch week 6

---

**Design Status:** ✅ APPROVED  
**Ready for implementation plan.**
