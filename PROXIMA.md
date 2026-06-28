# PROXIMA — PRODUCT BIBLE
**Single Source of Truth | Version 2.0 | June 2026**

> This document supersedes all prior docs (PROXIMA-MASTER-DESIGN.md, ZingConnect-*, docs/MVP-STATUS.md). When in doubt, this is the answer.

---

## 0. TL;DR

Proxima is a **hyperlocal vendor marketplace for residential societies** — residents find, book, and rate trusted service vendors (plumbers, maids, electricians, etc.) within their gated community.

- **Live at:** https://proxima-marketplace.vercel.app
- **Repo:** https://github.com/shailanshgaur/proxima
- **Stack:** React + TypeScript + Vite → Vercel / Supabase (Postgres + Auth + Storage)
- **Status:** Built. Deployed. Ready for soft launch.
- **First society:** Lotus Zing

---

## 1. WHY THIS EXISTS

Every residential society in India has a WhatsApp group. Residents ask for vendor recommendations there. The answers get buried in chat within days. New residents have no institutional memory. Good vendors have no way to prove their track record. Bad ones get quietly tolerated.

**The problem Proxima solves:** Make every resident's first day in a new home as informed as their thousandth.

**The real competitor:** The RWA WhatsApp group — not Justdial, not Urban Company.

**The defensible moat:** Hyperlocal, community-verified vendor history. Once a society has 6 months of booking and rating data, switching to any alternative means starting from zero.

---

## 2. PRODUCT VISION

> **Proxima is the trust layer for your neighborhood — a living, community-built record of who serves you well and who doesn't.**

**One-line pitch to residents:** *"Find the people your neighbors already trust."*
**One-line pitch to vendors:** *"Your reputation, preserved and growing."*
**One-line pitch to RWAs:** *"Stop answering the same WhatsApp question 200 times."*

### North Star Metric
**Monthly Active Residents / Total Registered Residents** (Engagement Rate per Society)

Target: >40% within 90 days of launch per society.

---

## 3. USERS

### Resident (Primary User)
Wants to find a trusted vendor fast. Skeptical of fake reviews. Won't fill forms. Uses WhatsApp 4+ hours/day. Device: Android mid-range or iPhone.

Two sub-types:
- **Established resident** — has 3+ years of context, wants to contribute recommendations
- **New resident** — zero social capital, needs the directory urgently

### Vendor (Passive Beneficiary)
Two types that determine their entire product experience:

| | Type A | Type B |
|---|---|---|
| Digital literacy | Low | Medium–High |
| How they receive bookings | WhatsApp message | In-app notification |
| How they confirm | Reply YES/DECLINE | Tap in app |
| Profile management | Admin-managed | Self-managed |
| Onboarding | Admin adds them | Self-registers |

**Critical constraint:** Vendors must benefit from Proxima passively. They cannot be required to do anything to appear on the platform.

### Admin / RWA Member
Wants to spend <10 minutes/week on platform governance. Currently drowning in WhatsApp vendor queries. Is the distribution channel, not a power user.

### Moderator (V1.5)
Trusted resident with limited elevated privileges. Reviews flagged listings. Cannot change ratings — only flag for system action.

---

## 4. CURRENT STATE (WHAT'S BUILT)

### What works today
- Residents sign up via email OTP (no password friction)
- Browse vendors by society + category
- Book services → WhatsApp link sent to vendor (Type A) or in-app notification (Type B)
- Upload photo proof of completion
- Rate vendors (1–5 stars + optional comment)
- Admin dashboard with metrics, bookings, vendors, appeals workflow
- Vendor auto-archive if rating <3.0 or 3+ no-shows in 30 days
- 48-hour appeals SLA with admin approve/reject
- RLS: residents only see their own society's vendors and their own bookings

### What's explicitly deferred (not bugs, design decisions)
- Push notifications (can add via FCM later)
- In-app payment (cash/UPI out-of-band for now)
- Vendor dashboard for Type B (they see bookings in admin sheet)
- SMS OTP in prod (uses Supabase email OTP in dev; Twilio switchable)
- Multi-society auto-expand (manual admin add for now)
- Advanced analytics (Google Sheets automation is optional)
- Moderator roles (admin handles exceptions directly in V1)
- Native mobile app (PWA covers it; native justified only if engagement data supports it)

---

## 5. TECH STACK

### What's deployed

```
Frontend (Vercel)
├── React 18 + TypeScript + Vite
├── Pages: Login, Signup, Home (resident), Admin
└── Auto-deploy from GitHub main branch

Backend (Supabase)
├── Database: PostgreSQL (6 tables)
├── Auth: Email/Phone OTP via native Supabase Auth
├── Storage: booking-photos bucket (photo proof uploads)
├── RLS: enforced at DB level (not just API)
└── Real-time: bookings + reviews sync instantly

Optional
└── Google Sheets + Apps Script (nightly sync + auto-archive notifications)
```

### Technology decisions and their rationale

| Decision | Choice | Why |
|---|---|---|
| Database | Supabase (Postgres) | Free tier, RLS built-in, real-time, Auth included |
| Frontend hosting | Vercel | Free tier, auto-deploy from git, SPA routing via vercel.json |
| Auth | Supabase OTP | Email OTP → no password friction; phone OTP available when Twilio connected |
| Storage | Supabase Storage | Co-located with DB, 500MB free, no egress costs |
| Framework | React + Vite | Fast builds, largest ecosystem, team familiarity |

### What the original design doc specified (and why we diverged)

The design doc specified Cloudflare Workers + D1 + Firebase Auth. We went with Supabase + Vercel instead. Both are valid choices; the actual build used Supabase because:
- D1 (SQLite at edge) lacks native RLS — critical for multi-tenant security
- Supabase collocates Auth + DB + Storage + RLS in one platform
- Vercel is simpler for React SPA deployment than Cloudflare Pages

**Migration path if needed:** Supabase Postgres → Neon or PlanetScale is straightforward. Vercel → Cloudflare Pages requires only vercel.json changes.

---

## 6. DATA MODEL

### Tables (current schema)

**`societies`** — residential communities (tenant root)
```
id, name, location, resident_count, created_at
```

**`users`** — residents (phone-verified, society-scoped)
```
id, auth_id, society_id, name, phone, flat_number, is_admin, created_at
```

**`vendors`** — service providers (global entity, multi-society)
```
id, name, phone (unique), type ('A'|'B'), categories[], societies[],
rating (computed), review_count, is_archived, appeal_status, created_at
```

**`bookings`** — service requests (society-scoped)
```
id, resident_id, vendor_id, society_id, service_type,
scheduled_date, scheduled_time,
status ('pending'|'confirmed'|'completed'|'no_show'|'cancelled'),
whatsapp_sent_at, confirmation_method ('whatsapp_timeout'|'app_tap'|'manual'),
confirmed_at, completed_at, photo_url, rating_given, created_at
```

**`reviews`** — ratings + comments (tied to completed bookings)
```
id, booking_id, resident_id, vendor_id, rating (1-5),
text, reviewer_level ('new'|'regular'|'trusted'), created_at
```

**`appeals`** — vendor archival disputes (48h SLA)
```
id, vendor_id, reason, evidence_url, status ('pending'|'approved'|'rejected'),
decision_reason, created_at, decided_at, deadline_at
```

### Key constraints applied (migrations 003-004)
- `UNIQUE(resident_id, vendor_id)` on reviews — one review per resident per vendor
- `CHECK` max 5 active bookings per resident
- SQL trigger: vendor `rating` auto-updates atomically on review INSERT
- Indexes on `vendors.rating`, `bookings.created_at`, `bookings.status`

### Security (RLS policies)
- Residents can only read vendors in their own society
- Residents can only read/write their own bookings
- Society ID is derived from the auth token — never trusted from client input
- Admin role is `is_admin` flag on the `users` table (set via DB only, not app UI)

---

## 7. CORE FLOWS

### Resident books a vendor
```
Email OTP signup
→ Verify flat number + society (signup flow step 3)
→ Browse vendors (filter by society + category)
→ Select vendor → fill booking form (date, time, service type)
→ WhatsApp link generated → sent to vendor (Type A) or in-app notification (Type B)
→ Vendor confirms (or auto-confirmed after 30min for Type A)
→ Service happens
→ Resident uploads photo proof → marks complete
→ Unlocks rating form → 1–5 stars + optional comment
```

### Vendor archival + appeal
```
Vendor rating drops below 3.0 OR accumulates 3+ no-shows in 30 days
→ Auto-archived (hidden from directory)
→ Vendor can submit appeal within 48h with reason + evidence
→ Admin reviews in appeals queue
→ Approve: vendor restored  |  Reject: vendor stays archived
```

### Admin governance (target: <10 min/week)
```
Dashboard overview → metrics (bookings, completion rate, avg rating, pending appeals)
Bookings tab → searchable by date/vendor/status
Vendors tab → all vendors with rating/review/archive status
Appeals tab → pending appeals with 48h deadline tracking → approve/reject with reason
```

---

## 8. BOOKING FLOW MECHANICS

**Type A Vendor (WhatsApp)**
- Resident books → system generates WhatsApp pre-fill link to vendor's number
- Vendor receives: booking details + YES/DECLINE instruction
- If vendor replies YES → booking confirmed
- If no reply in 30 min → auto-confirmed
- If vendor declines → booking cancelled, resident notified

**Type B Vendor (In-App)**
- Resident books → vendor sees in-app notification
- Vendor taps confirm/decline in app
- 2-hour blocking per confirmed service (prevents double-booking)

**Photo proof requirement**
- Resident must upload photo before rating is unlocked
- Photo stored in Supabase `booking-photos` bucket
- Image compressed client-side before upload (storageService.ts)

---

## 9. TRUST & REPUTATION SYSTEM

### Current implementation (V1)
- 1–5 star rating per completed booking
- Optional text comment
- Vendor `rating` = average of all reviews (auto-computed by SQL trigger)
- `reviewer_level` field exists ('new'|'regular'|'trusted') — not yet weighted in V1

### Fraud prevention (V1)
- Photo proof required before rating unlocks — prevents rating without service
- One review per resident per vendor (UNIQUE constraint)
- Rating only available after booking status = completed
- Auto-archive acts as a circuit breaker on bad vendors

### Trust system roadmap (V1.5+)
The original design doc defined a more sophisticated system. Implement in V1.5:
- **Reviewer tiers with weight multipliers** — New (0.2×), Active (1.0×), Champion (1.2×), Guardian (1.5×)
- **Recency decay** — ratings >12 months decay to 0.5× weight
- **8-dimension rating** — Quality, Punctuality, Pricing, Behavior, Communication, Reliability, Cleanliness, Safety (3-point per dimension, not 5-star)
- **Spike detection** — vendor receiving >3 ratings in 24h → held for review
- **Cooling period** — accounts <48h old cannot rate

### Dispute resolution
- Vendor disputes → formal appeal flow (existing, see Section 7)
- Resident disputes → flagging system (V1.5: moderator queue)
- Admin cannot edit ratings directly — only system actions can change scores

---

## 10. DESIGN SYSTEM

### Brand
- **Name:** Proxima
- **Tagline:** Find the people your neighbors already trust.

### Colors
```
Primary:        #FF5B1F  (Proxima Orange — CTAs, links)
Primary Dark:   #CC3D00  (hover/pressed states)
Surface:        #0F0F0F  (header, navigation)
Background:     #F8F8F6  (app background)
Card:           #FFFFFF
Text Primary:   #1A1A1A
Text Secondary: #6B6B6B
Text Disabled:  #ADADAD
Trust Green:    #22C55E  (positive ratings, verified badges)
Warning:        #F59E0B  (flags, caution)
Danger:         #EF4444  (suspension, negative signals)
```

### Typography
```
Display:  Inter Bold, 28px
Heading:  Inter SemiBold, 20px
Body:     Inter Regular, 16px
Caption:  Inter Regular, 13px
Label:    Inter Medium, 12px (uppercase, 0.5px tracking)
```

### UX principles
1. Value before registration — guests can browse without signing up
2. No empty states — every screen has content or a clear CTA
3. Mobile-first, thumb-friendly — all primary actions in bottom 60% of screen
4. Transparency by default — every rating shows when and from how many residents
5. Progressively revealed complexity — trust system is sophisticated but invisible until needed

---

## 11. INFORMATION ARCHITECTURE

### Sitemap (V1)
```
/ (Home — browse vendors, public)
  /browse/:category
  /vendor/:id (profile, public)
/login
/signup (3-step: OTP → name/flat → society)
/home (resident dashboard — auth required)
  → VendorList (search + filter)
  → BookingForm (create booking)
  → BookingStatus (photo upload + completion)
  → ReviewForm (rating)
/admin (admin dashboard — is_admin required)
  → Overview (metrics)
  → Bookings tab
  → Vendors tab
  → Appeals tab (AppealsQueue)
```

### Permissions
| Action | Guest | Resident | Admin | Vendor |
|---|---|---|---|---|
| Browse directory | ✓ | ✓ | ✓ | ✓ |
| View vendor profile | ✓ | ✓ | ✓ | ✓ |
| Create booking | ✗ | ✓ | ✗ | ✗ |
| Rate vendor | ✗ | ✓ (post-completion) | ✗ | ✗ |
| Add vendor | ✗ | ✓ | ✓ | ✗ |
| View all bookings | ✗ | own only | ✓ | ✗ |
| Resolve appeals | ✗ | ✗ | ✓ | ✗ |
| Archive/restore vendor | ✗ | ✗ | ✓ | ✗ |
| Submit appeal | ✗ | ✗ | ✗ | ✓ |

---

## 12. SECURITY

### Implemented
- RLS enforced at the database layer (not just API)
- Society ID always derived from JWT token, never from request body
- All inputs validated in service layer
- Photo EXIF stripping should be added (current: images stored as-is)
- Admin role set via DB directly, not through app UI

### Known gaps (address pre-full-launch)
- [ ] EXIF GPS data in uploaded photos — strip before storage
- [ ] Rate limiting on write endpoints (Vercel Edge Config or Supabase rate limiting)
- [ ] Photo content moderation (manual review for V1; automated V1.5)
- [ ] Dependency audit in CI (npm audit)
- [ ] CSP headers

### Threat model highlights
- **Fake reviews:** Prevented by photo proof requirement + one-review-per-vendor constraint
- **Vendor self-boost:** Cooling period (V1.5) + spike detection (V1.5)
- **Cross-society data leak:** RLS + society_id from token (implemented)
- **Admin bias:** Admin cannot edit ratings directly; all actions logged (audit_log table — add in V1.5)

---

## 13. LAUNCH PLAN

### Pre-launch (do these before inviting anyone)
- [ ] Run all 4 migrations on production Supabase
- [ ] Set up `booking-photos` storage bucket with correct RLS
- [ ] Seed initial vendor list (target: 25+ vendors from WhatsApp history)
- [ ] Create admin account (set `is_admin = true` directly in DB)
- [ ] Test full flow: signup → book → photo → rate on mobile
- [ ] Test on Android Chrome + iOS Safari
- [ ] Verify RLS: two test accounts in different societies cannot see each other's data

### Soft launch (Week 1)
- Invite 20 residents manually via WhatsApp
- Goal: 10+ bookings, 5+ ratings in first week
- Monitor Supabase logs for errors
- Collect feedback verbally

### Full launch (Week 2)
- RWA admin sends WhatsApp announcement to all residents
- QR code in lobby, lift, and noticeboard
- Week 2 goal: 50 verified residents, 30+ vendors, 3+ community-added vendors

### 30-day targets
- 40% Monthly Active Residents
- ≥30 vendor listings
- ≥0.5 ratings per resident per month
- ≥30% search-to-contact conversion

---

## 14. ROADMAP

### V1 (Now — built and deployed)
Vendor browse, booking (WhatsApp + in-app), photo proof, 1–5 star rating, admin dashboard, appeals workflow

### V1.5 (60–90 days post-launch)
- Weighted trust scores (reviewer tiers + recency decay)
- 8-dimension rating (3-point scale)
- Vendor claim portal (OTP-verify profile)
- Moderator roles
- WhatsApp notification nudges (rate after service)
- Cross-society vendor lookup (read-only)
- Reconfirmation prompts for aging ratings
- Fraud detection: spike detection, cooling period
- Audit log table

### V2 (6+ months)
- Multi-society onboarding flow
- Vendor Verified Pro (paid, with credential verification)
- RWA Pro subscription (₹499/month)
- Vendor monthly reputation report (WhatsApp summary)
- Native mobile app (if PWA engagement data justifies it)
- In-app payment (Razorpay/PayU integration)
- API for MyGate / NoBroker integration

### Revenue model
- **V1:** Free. Build network effects.
- **V1.5 (Freemium):** Up to 50 vendors free. Pro tier ₹499/month per society: unlimited vendors, analytics, verified badges.
- **V2 (Marketplace):** ₹99/month Vendor Verified Pro badge; enterprise bulk pricing for property management companies.

**Ethical constraint:** Monetization must never influence ratings. Paying vendors cannot buy better ratings. This is structurally enforced — not just promised.

---

## 15. OPEN ITEMS (must resolve before V1.5)

| Gap | What's needed |
|---|---|
| Vendor notification for listing | SMS to vendor when listed: "You're on Proxima, your rating so far: X" |
| Request Board | Demand-matching feature: resident posts need → vendor responds. Cold start problem unsolved. |
| Cross-society vendor reputation | When vendor moves to Society B, what weight do Society A ratings carry? |
| Dispute resolution SLA | What's communicated to vendors? What happens if admin is unavailable? |
| Vendor monthly report | WhatsApp summary: bookings, rating, reviews this month |
| EXIF stripping | Strip GPS from uploaded photos before storage |

---

## 16. COLD START STRATEGY

The platform's single biggest existential risk. The existing build solves it partially. Full resolution:

**Phase 0 — Pre-launch seeding (before any resident signs up)**
1. Admin imports existing vendor list from WhatsApp history — minimum 25 vendors, name + phone + category only
2. Unrated vendors display as "Listed — not yet rated" (honest, still useful)
3. RWA admin sends one WhatsApp: "We built a vendor directory. 25 vendors listed. Rate the ones you've used. [Link]"

**Phase 1 — Growth flywheel**
Resident adds vendor → rates vendor → others see rating → others use vendor → others rate → vendor's reputation grows → more residents use platform → repeat.

Flywheel must start turning within 72 hours of launch per society. If it doesn't, that society is churn risk.

**Phase 2 — Cross-society expansion**
Unit of growth is the society, not the individual resident.
1. Launch in Society A with full seeding
2. After 60 days, approach Society B: "Your neighbor society has 45 vendors rated by 120 residents. Many serve your area too. Join and inherit their ratings."
3. Cross-society vendor data transfers with credibility markers

---

## 17. KNOWN RISKS

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Cold start fails — <20 residents in first 2 weeks | Medium | Critical | Pre-seed vendor list; founding team manually activates 10 residents |
| Admin burns out, platform goes unmaintained | High | Critical | Build self-governing system by V1.5; recruit backup admin |
| Vendor gaming the system | Low | High | Photo proof + cooling period (V1.5) catches it |
| Supabase free tier hits limits | Low | Medium | 500MB storage, 50K MAU — safe until ~100 societies |
| Society politics — RWA becomes platform adversary | Low | Critical | Design for admin removal without data loss; resident trust independent of RWA |
| Email OTP deliverability in India | Medium | High | Switch to Twilio SMS OTP in production (one env var change) |

---

## 18. AGENT FRAMEWORK (.claude/agents/)

Nine specialist Claude Code agents govern all code changes:

| Agent | Role | Decision Authority |
|---|---|---|
| `builder` | Ship features end-to-end | Implements |
| `security-fixer` | Eliminate vulnerabilities | SAFE / CONDITIONAL / BLOCK |
| `architect` | Scalability + tech debt | APPROVE / CONDITIONAL / BLOCK |
| `product` | User value + UX | SHIP / DEFER / BLOCK |
| `refactor-surgeon` | Code health | Low-risk refactors only |
| `database-titan` | Schema + performance | Schema decisions |
| `performance-assassin` | Latency + cost | Optimization |
| `ai-engineer` | AI integration safety | AI feature decisions |
| `test-destroyer` | Break things | Edge cases + regressions |
| `devops-commander` | Ship safely | Zero-downtime deploys |
| `ceo` | Final verdict | SHIP / CONDITIONAL / BLOCK / DEFER |

**Full swarm review** for significant changes. **Silent review** (relevant agents + CEO) for small changes.

---

## 19. FILE MAP

```
proxima/
├── src/
│   ├── pages/
│   │   ├── LoginPage.tsx         — login UI
│   │   ├── SignupPage.tsx         — 3-step signup
│   │   ├── HomePage.tsx           — resident dashboard
│   │   └── AdminPage.tsx          — admin dashboard (4 tabs)
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── EmailLogin.tsx     — email OTP form
│   │   │   ├── PhoneLogin.tsx     — phone OTP form (legacy)
│   │   │   └── SignupFlow.tsx     — 3-step registration
│   │   ├── Resident/
│   │   │   ├── VendorList.tsx     — search + filter vendors
│   │   │   ├── BookingForm.tsx    — booking + WhatsApp link
│   │   │   ├── BookingStatus.tsx  — photo upload + completion
│   │   │   └── ReviewForm.tsx     — rating + comment
│   │   └── Admin/
│   │       └── AppealsQueue.tsx   — appeal review + decision
│   ├── lib/
│   │   ├── supabaseClient.ts      — Supabase init
│   │   ├── authService.ts         — OTP + session management
│   │   ├── bookingService.ts      — create/update bookings
│   │   ├── vendorService.ts       — fetch vendors by society/category
│   │   ├── reviewService.ts       — create reviews + rating calc
│   │   ├── storageService.ts      — photo upload + compression
│   │   └── appealService.ts       — create/fetch appeals
│   ├── types/index.ts             — TypeScript interfaces
│   ├── App.tsx                    — routing
│   └── main.tsx                   — entry point
├── migrations/
│   ├── 001-core-schema.sql        — 6 tables + indexes + RLS
│   ├── 002-fix-rls-write-policies.sql
│   ├── 003-add-constraints.sql    — unique review, max bookings
│   └── 004-add-rating-trigger.sql — auto-update vendor rating
├── .claude/
│   ├── CLAUDE.md                  — project config + agent rules
│   └── agents/                    — 9 specialist agents
├── docs/                          — historical docs (defer to this file)
├── files/                         — ZingConnect design artifacts (archived)
├── scripts/                       — deploy.sh, health-check.sh, pre-launch tests
├── vercel.json                    — SPA routing config
└── .env.example                   — required env vars
```

---

## 20. DECISIONS LOG

| Decision | Outcome | Rationale |
|---|---|---|
| Backend | Supabase (not Cloudflare D1) | RLS built-in, Auth+DB+Storage in one platform, mature tooling |
| Frontend hosting | Vercel (not Cloudflare Pages) | Simpler SPA deploy, auto-deploy from git |
| Auth | Email OTP (switched from phone OTP) | Email is more reliable in dev; phone OTP (Twilio) easy to add for prod |
| Rating scale | 1–5 stars (V1) | Lower friction; 8-dimension weighted system planned for V1.5 |
| Guest access | Browse allowed without login | Value before registration. Critical for adoption. |
| Vendor types | Type A (WhatsApp) + Type B (in-app) | Practical reality: most vendors in India are WhatsApp-only |
| Photo proof | Required before rating | Prevents fake ratings; creates accountability |
| Monetization | Free V1, freemium V1.5 | Build trust and network effects before charging |
| Native app | Deferred to V2 | PWA sufficient; native costs 3× and adds no network effect |
| Vendor as global entity | `vendors` table is cross-society | Vendor's reputation should follow them across societies |
| Admin | Exception handler only | Self-governing system is the goal; admin dependency is a failure mode |

---

*Proxima Product Bible v2.0 | June 2026*
*Maintained in repo root. All other design docs are historical reference only.*
*Next review: After soft launch (Week 1 feedback) or at V1.5 planning.*
