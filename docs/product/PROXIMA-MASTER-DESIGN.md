# PROXIMA — MASTER PRODUCT DESIGN DOCUMENT
**Version 1.0 | June 2026 | CONFIDENTIAL**

> *Authored under the lens of: Principal PM · Staff Engineer · Solutions Architect · UX Lead · Security Architect · Startup CTO*

---

## PREAMBLE: SHOULD THIS PRODUCT EXIST?

Before designing anything, the most important question is whether Proxima — a hyperlocal vendor reputation platform for residential societies — deserves to be built at all. This section delivers a brutally honest pre-mortem.

### The Honest Case Against Building This

**Problem 1: WhatsApp already does this, badly but sufficiently.**
Every residential society in India has a WhatsApp group. Residents already share vendor recommendations there. The product must answer: why will residents switch from a zero-friction "send a message" to a structured platform requiring sign-up, onboarding, and behavioral change? The answer cannot be "it's better organized." That is not enough activation energy.

**Problem 2: Cold start is existential, not just hard.**
A vendor directory with zero vendors is worse than useless — it creates the impression the product is dead. A vendor directory with 10 vendors out of 80 creates a false sense of completeness. The cold start problem is not a product challenge; it's a survival challenge. The existing plan has not solved it.

**Problem 3: Trust in the platform requires trust in the platform operator.**
For residents to trust ratings, they must trust that the admin is not gaming them. For vendors to participate, they must trust that bad-faith flags won't destroy their livelihood. This is a governance problem, not a technical problem. No amount of automation resolves it — someone has to be accountable.

**Problem 4: The "₹0 forever" business model is a liability, not a feature.**
Free infrastructure is fine. But "free forever" with no monetization path means this dies when the founding energy runs out. Volunteers burn out. The product must have a sustainable operating model even if V1 is free.

**Problem 5: Rating systems are adversarial by nature.**
Any vendor with money at stake will try to game the system. Any vendor with a grievance will seek revenge. The product must be designed for bad actors as the default state, not as an edge case.

### The Honest Case For Building This

**The WhatsApp alternative is genuinely broken.** Recommendations disappear in chat history within days. There is no aggregation, no credibility weighting, no persistence. A resident who moves in today has no institutional memory available to them. This is a real pain point.

**Hyperlocal context creates defensibility.** A vendor rated by 80 residents in your society is a fundamentally more trustworthy signal than a vendor rated by 10,000 strangers on Justdial. Proximity is the moat.

**The total addressable market is enormous.** India has approximately 50,000+ gated residential societies and townships. Even 1% penetration at ₹500/month per society = ₹25 crore ARR. The opportunity is real.

**Verdict: Build it. But not as currently designed.**

The current design has the right instincts but wrong architecture for scale. The Google Sheets backend, society-specific UI, and unresolved cold start are blocking problems that must be resolved before a single line of code is written. This document redesigns the product from first principles while preserving what works.

---

# PART 1: PRODUCT DISCOVERY

## 1.1 Core User Personas

### Persona 1: The Established Resident (Primary)
- **Name:** Anita, 38, lives in the society for 3+ years
- **Role:** Homemaker or working professional, deeply embedded in society social fabric
- **Pain:** Has lost money or time hiring an unknown vendor. Wants to share good vendors with neighbors and warn against bad ones.
- **Motivation:** Reciprocity. She received recommendations from others; she wants to pay it forward.
- **Barrier:** Doesn't want to "fill forms." Any onboarding beyond 2 steps will lose her.
- **Device:** Android mid-range. Uses WhatsApp 4+ hours/day.

### Persona 2: The New Resident (High Value)
- **Name:** Rahul, 31, moved in 3 months ago
- **Role:** Working professional, limited time, zero social capital in the society
- **Pain:** Doesn't know anyone. Needs a plumber urgently. Can't access the WhatsApp group's 18-month backlog.
- **Motivation:** Pure utility. He needs the maid's number, the electrician's number, the AC service guy.
- **Barrier:** Skepticism. Are these reviews real? Is this up to date?
- **Device:** iPhone. Expects app-store quality UX.

### Persona 3: The Vendor
- **Name:** Ramesh, 45, electrician serving 6 societies in the area
- **Pain:** Relies entirely on word-of-mouth. Has no way to showcase his track record.
- **Motivation:** More work. Simple.
- **Barrier:** Low digital literacy. Will not install an app. Will not manage a profile. Will not understand a rating system.
- **Critical insight:** Ramesh must benefit from Proxima passively. He cannot be required to do anything.

### Persona 4: The Society Admin / RWA Member
- **Name:** Sharma ji, 58, retired, elected to RWA
- **Pain:** Constantly fielding WhatsApp messages asking for vendor recommendations. Also dealing with vendor complaints.
- **Motivation:** Reduce personal load. Look organized and modern.
- **Barrier:** Suspicious of technology. Needs to feel in control.
- **Critical insight:** Sharma ji is the distribution channel, not a power user. Win him and you win the society.

### Persona 5: The Skeptical Non-User (Must Be Designed For)
- **Name:** Priya, 44, engineer mindset
- **Pain:** Doesn't trust ratings. Knows they can be faked. Won't use until convinced the system is honest.
- **Motivation:** Evidence. Show her the methodology.
- **Barrier:** Everything. She's the hardest to win and the most valuable evangelist if you do.

---

## 1.2 Primary Pain Points (Validated)

| Pain | Severity | Currently Solved By | Why That Solution Fails |
|------|----------|---------------------|------------------------|
| Can't find trusted vendors after moving in | Critical | WhatsApp group | History buried, no search, no ratings |
| Good vendors have no reputation proof | High | Word of mouth | Doesn't scale, loses institutional memory |
| Bad vendor experiences not shared effectively | High | WhatsApp complaints | Ephemeral, no accountability, emotional not factual |
| Duplicate vendor numbers across neighbors | Medium | Nothing | Genuine gap |
| No way to know if a vendor is still active | Medium | Calling the number | High friction |
| Admin overwhelmed with vendor queries | Medium | Direct WhatsApp | Not scalable, admin burnout |

---

## 1.3 Existing Alternatives & Why They Fail

| Alternative | Why Residents Use It | Why It Fails for This Use Case |
|-------------|---------------------|-------------------------------|
| **WhatsApp groups** | Zero friction, already there | No persistence, no structure, no credibility |
| **Justdial** | National coverage | Not hyperlocal, reviews from strangers, vendor-paid placement |
| **Urban Company** | Professional, reliable | Limited service categories, doesn't cover informal vendors |
| **Google Maps** | Reviews, ratings | Vendors not listed, generic geographic search |
| **Sulekha** | Lead generation | Vendor-centric, residents don't trust it |
| **Society apps (MyGate, NoBroker)** | Already installed | Vendor directory is secondary feature, no trust system |

**The real competitor is the RWA WhatsApp group.** That is what Proxima must beat. Not Justdial.

---

## 1.4 Adoption Barriers (Ranked by Risk)

1. **Cold start** — If there are no vendors, no one installs. If no one installs, no vendors get added.
2. **Onboarding friction** — Any step that requires effort before value is delivered = user drop-off.
3. **Platform distrust** — "Is this fake?" is the default assumption of urban Indian users toward rating systems.
4. **Vendor passivity** — Vendors cannot be required to participate. They must benefit passively.
5. **Admin dependency** — If the product requires a motivated admin to function, it will die when that admin disengages.
6. **Network fragmentation** — A vendor known to 3 residents by different names/numbers creates confusion that erodes trust faster than it builds it.

---

# PART 2: PRODUCT VISION

## 2.1 Vision Statement

> **Proxima is the trust layer for your neighborhood — a living, community-built record of who serves you well and who doesn't.**

## 2.2 Mission Statement

> Make every resident's first day in a new home as informed as their thousandth.

## 2.3 Unique Value Proposition

Proxima provides hyperlocal, community-verified vendor reputation that cannot be gamed, cannot be bought, and cannot be forgotten — because it is owned and governed by the residents themselves.

**The one-line pitch to residents:** *"Find the people your neighbors already trust."*
**The one-line pitch to vendors:** *"Your reputation, preserved and growing."*
**The one-line pitch to RWAs:** *"Stop answering the same WhatsApp question 200 times."*

## 2.4 Long-Term Moat

The moat is **network-locked institutional memory.**

Once a society has 6 months of rating history, switching to any alternative means starting from zero. The data is the product. Every rating, every flag, every reconfirmation is a compound asset that cannot be replicated.

Secondary moats:
- **Cross-society vendor reputation** — a vendor's record follows them across societies
- **Resident trust scores** — a resident's review credibility follows them if they move
- **RWA relationships** — institutional buy-in creates switching costs

## 2.5 North Star Metric

**Monthly Active Residents / Total Registered Residents** (Engagement Rate per Society)

Target: >40% MAR within 90 days of launch per society.

Why this metric: It measures whether the platform has become habitual, not merely installed. A society with 60% of residents actively using Proxima is a society that cannot churn.

## 2.6 Supporting KPIs

| Metric | Target (90 days post-launch) | Why It Matters |
|--------|------------------------------|----------------|
| Vendor listings per society | ≥30 | Enough coverage to be useful |
| Ratings submitted per resident per month | ≥0.5 | Platform is generating feedback |
| Search-to-contact conversion | ≥30% | Residents finding and acting on listings |
| Vendor dispute rate | <5% | Trust system is working |
| Admin time per week | <10 min | System is self-governing |
| Society retention at 6 months | >80% | Platform has become habitual |

---

# PART 3: PRODUCT STRATEGY

## 3.1 The Cold Start Strategy (Most Critical Section)

The cold start is the product's single biggest existential risk. The existing design does not resolve it. Here is a genuine resolution.

### Phase 0: Pre-Launch Seeding (Before Any Resident Signs Up)

**Step 1: Admin-seeded vendor list**
The RWA admin (or the founding resident) imports the society's existing vendor list before launch. This does not require residents. It can be as simple as: vendor name, category, phone number. No ratings yet — but listings exist.

**How to get this data:** Every society WhatsApp group has shared vendor contact cards at some point. The founding team (manually, before technical launch) collects these. 30 vendors seeded = credible directory from Day 1.

**Step 2: "Unrated but Known" state**
Vendors seeded without ratings display as "Listed — not yet rated." This is honest. It tells new residents: this person exists and is known to this community, but no formal rating exists yet. This is more useful than an empty page and more honest than a fake rating.

**Step 3: First-Week Activation Campaign**
The RWA admin sends one WhatsApp message: *"We've built a vendor directory for our society. 30 vendors already listed. Rate the ones you've used — takes 90 seconds. [Link]"*

This works because:
- There's already content when people arrive
- The ask is specific (rate someone you already know)
- The social proof is built-in (30 vendors listed = other people care about this)

### Phase 1: Growth Flywheel

Resident adds a vendor → Resident rates the vendor → Other residents see the rating → Other residents use the vendor → Other residents rate the vendor → Vendor's reputation grows → More residents use the platform to find similar vendors → Repeat.

The flywheel must start turning within the first 72 hours of launch per society. If it doesn't, the society is at churn risk.

### Phase 2: Cross-Society Expansion

**Unit of growth is the society, not the individual resident.**

Expansion model:
1. Pick a cluster of geographically proximate societies (same area, same vendors often overlap)
2. Launch in Society A with full seeding
3. After 60 days, approach Society B: *"Your neighbor society has 45 vendors rated by 120 residents. Many of those vendors serve your area too. Join and inherit their ratings."*
4. Cross-society vendor data transfers with credibility markers

This is the moat-building mechanism. Each new society makes the platform more valuable to adjacent societies.

## 3.2 Multi-Tenancy Architecture (From Day One)

Every society is a **tenant**. The data model, API design, and permission system must be tenant-aware from line one of code.

This means:
- Every database record carries a `society_id`
- Authentication tokens include `society_id` claims
- API routes are scoped per society
- Vendor records can exist in multiple societies (cross-tenant vendor profile)
- Resident records are tied to exactly one society at a time (with migration path)

**The vendor cross-tenant model is the key architectural decision:**
A vendor is a global entity. A vendor's *reputation in a specific society* is a tenant-scoped entity. This distinction must be built into the data model from day one or a painful migration awaits.

## 3.3 Revenue Model (Not Optional)

"Free forever" is not a strategy. It is a deferred decision that kills products.

**V1: Free.** Full stop. First 5 societies free forever. No strings. Build credibility.

**V1.5: Freemium.**
- Free tier: up to 100 vendor listings, basic ratings, WhatsApp integration
- Pro tier (₹499/month per society): unlimited listings, analytics dashboard, verified vendor badges, priority dispute resolution, custom branding

**V2: Marketplace.**
- Vendors pay ₹99/month for a "Verified Pro" badge (independent verification of credentials)
- RWAs pay for a white-label version with their society branding
- Enterprise: property management companies managing 50+ societies get bulk pricing

**The ethical constraint:** Monetization must never influence ratings. Paying vendors cannot buy better ratings. This must be structurally enforced, not just promised.

---

# PART 4: USER EXPERIENCE

## 4.1 Core Design Principles

1. **Value before registration.** Residents can browse the directory without signing up. Registration is required only to rate or add vendors.
2. **No empty states.** Every screen must have content or a meaningful call to action. Never show a blank page.
3. **Mobile-first, thumb-friendly.** All primary actions reachable with one thumb, bottom 60% of screen.
4. **Transparency by default.** Every rating shows who rated it (flat number, not name), when, and with what confidence level.
5. **Progressively revealed complexity.** The trust system is sophisticated. Residents should never need to understand it to use the product — but they can if they want to.

## 4.2 Resident Journey

**Goal:** Find a trusted vendor and contact them.

**Entry Points:**
- Direct link shared in WhatsApp group
- QR code posted in society lobby
- RWA app integration (future)
- Google search: "[Society name] vendor directory"

**User Flow:**

```
Land on homepage (no login required)
→ See category grid: Electrician, Plumber, Maid, Cook, Carpenter, AC Service, Pest Control, Driver...
→ Tap category
→ See vendor list sorted by trust score (highest first)
→ Tap vendor card
→ See: photo, name, phone, categories served, rating breakdown (8 dimensions), review snippets, last active date
→ Tap "Contact via WhatsApp" → WhatsApp pre-fill opens
→ [Optional] Rate this vendor after service → login required
```

**Decision Points:**
- Will I trust this rating? → Show methodology link inline
- Is this vendor still active? → Show "Last booked: 3 weeks ago" from community data
- Are there multiple vendors for this category? → Show comparison view

**Failure States:**
- No vendors in this category → "Be the first to add one. It takes 2 minutes." + add button
- No ratings for this vendor → "Listed but not yet rated. Be the first." + rate button
- Vendor phone disconnected → flag mechanic with one tap

**Recovery States:**
- After flagging → "Thanks. We'll check with residents who've used them recently."
- After rating → "Your rating has been added. [Society] residents thank you."

## 4.3 Vendor Journey

**Critical constraint: Vendors should not need to do anything to appear on Proxima.**

**Passive discovery flow (ideal):**
1. Resident adds the vendor
2. System sends vendor an optional SMS: *"You've been listed on [Society] Proxima. Your ratings so far: 4.2/5. See your profile: [link]"*
3. Vendor claims profile (optional): adds photo, bio, service areas, availability
4. Vendor shares their Proxima profile link on their own WhatsApp status

**Active vendor flow (for tech-savvy vendors):**
1. Vendor self-registers with phone number
2. System checks: are you already listed in any society?
3. If yes: claim existing listing, verify via OTP
4. Add services, areas, photo
5. Request rating from past customers via WhatsApp pre-fill

**Failure States:**
- Vendor disputes a rating → formal appeal flow (see trust system)
- Vendor is auto-suspended → receives SMS with appeal link
- Photo not uploaded → nudge after 7 days

## 4.4 Moderator Journey

**Who is a moderator?** A trusted resident with limited elevated privileges. Not the admin. Does not have override powers.

**Responsibilities:**
- Review flagged listings in their queue (shown as a simple list)
- Confirm or dismiss pending duplicate alerts
- Mark inactive vendor reports as verified or not

**UX constraints:**
- All moderator actions are audited
- Moderator cannot change ratings, only flag for system action
- Moderator queue appears as a badge on their profile, not a separate dashboard

## 4.5 Admin Journey

**Goal:** Spend <10 minutes per week on platform governance.

**Dashboard shows (only what requires action):**
- Formal appeals awaiting review (target: 0)
- Listings in Photo Pending >14 days
- Anomalies unresolved >7 days
- New society health summary (ratings added this week, active residents, trending categories)

**Admin should never need to:**
- Approve routine vendor additions
- Resolve duplicate listings
- Manually adjust ratings
- Review individual flags

**Failure States:**
- Admin is unavailable → backup moderator covers queue view only
- Admin takes a biased action → logged and auditable; future two-admin override required for high-impact decisions

---

# PART 5: INFORMATION ARCHITECTURE

## 5.1 Sitemap

```
/ (Home — public)
  /browse (Vendor directory — public)
    /browse/:category
    /vendor/:id (Vendor profile — public)
      /vendor/:id/rate (Rate vendor — auth required)
      /vendor/:id/flag (Flag vendor — auth required)
      /vendor/:id/appeal (Vendor appeal — vendor auth)
  /request-board (Community requests — public view, post requires auth)
  /about (How Proxima works — public)
  /join (Onboarding — auth flow)

/dashboard (Resident — auth required)
  /dashboard/my-ratings
  /dashboard/bookmarks
  /dashboard/notifications

/moderator (Moderator — elevated auth)
  /moderator/flags
  /moderator/duplicates

/admin (Admin — highest auth)
  /admin/appeals
  /admin/analytics
  /admin/listings
  /admin/residents
  /admin/settings

/vendor-portal (Vendor — vendor auth)
  /vendor-portal/profile
  /vendor-portal/ratings
  /vendor-portal/appeal
```

## 5.2 Screen Inventory

| Screen | Who Sees It | Why It Exists |
|--------|-------------|---------------|
| Home / Category Grid | Everyone | Primary entry point, navigation |
| Category List | Everyone | Browse vendors by category |
| Vendor Profile | Everyone | Core information + trust signals |
| Rate Vendor | Auth residents | Generate trust data |
| Flag Vendor | Auth residents | Abuse detection input |
| Add Vendor | Auth residents | Directory growth |
| Request Board | Everyone (post: auth) | Demand-side matching |
| How It Works | Everyone | Build platform trust with skeptics |
| Resident Dashboard | Auth residents | Personal history + notifications |
| Moderator Queue | Moderators | Lightweight governance |
| Admin Dashboard | Admin | Exception handling only |
| Vendor Portal | Vendors | Profile management + appeals |

**Screens that were designed and cut:**
- Vendor leaderboard (gamification risk — creates perverse incentives)
- Resident leaderboard (privacy concern, adds no user value)
- Society comparison view (premature for V1, creates inter-society friction)

## 5.3 Permissions Matrix

| Action | Guest | Resident | Moderator | Admin | Vendor |
|--------|-------|----------|-----------|-------|--------|
| Browse directory | ✓ | ✓ | ✓ | ✓ | ✓ |
| View vendor profile | ✓ | ✓ | ✓ | ✓ | ✓ |
| Rate vendor | ✗ | ✓ | ✓ | ✗ | ✗ |
| Add vendor | ✗ | ✓ | ✓ | ✓ | ✗ |
| Flag vendor | ✗ | ✓ | ✓ | ✓ | ✗ |
| Review flags | ✗ | ✗ | ✓ | ✓ | ✗ |
| Resolve duplicates | ✗ | ✗ | ✓ | ✓ | ✗ |
| Override suspension | ✗ | ✗ | ✗ | ✓ | ✗ |
| Edit own profile | ✗ | ✓ | ✓ | ✓ | ✓ |
| View analytics | ✗ | ✗ | ✗ | ✓ | limited |
| Appeal rating | ✗ | ✗ | ✗ | ✗ | ✓ |
| Post request | ✗ | ✓ | ✓ | ✓ | ✗ |

---

# PART 6: TRUST & REPUTATION SYSTEM

## 6.1 The Trust Framework

The entire product stands or falls on this section. A compromised trust system kills the product faster than any technical failure.

### Principle 1: Ratings are community property, not platform property.

No single actor — including the admin — can unilaterally change a rating. Ratings can only change through:
- The original rater updating or withdrawing their rating
- The community voting process (via flag resolution)
- System auto-action triggered by rules (not human judgment)

### Principle 2: Every automated action is auditable.

The system log records every automated decision with: timestamp, trigger rule ID, input data, output action. If anyone ever asks "why was this vendor suspended?" — there is a complete, immutable record.

### Principle 3: Severity of action scales with certainty of evidence.

- 1 flag = soft indicator (visible to moderators, not residents)
- 2 flags from different flats = community review triggered
- 3 uncontested flags = auto-suspension (reversible)
- Formal appeal = admin review required

## 6.2 Resident Verification

**Goal:** Ensure only actual residents of the society can rate vendors.

**Mechanism:**
1. Resident registers with Google Sign-In (email as primary identity)
2. Verifies flat number via OTP sent to society's registered phone for that flat OR via admin-managed resident whitelist
3. Until verified, resident can browse but not rate or add vendors

**Whitelist management:**
- Admin uploads flat → resident name → phone mapping (CSV or manual entry)
- System cross-references during registration
- Unverified flat registrations go to a pending queue visible to admin and moderator

**Attack vector: Resident leaves but retains account access**
- Accounts require annual re-verification of flat occupancy
- If a flat re-registers under a different owner, the previous account's rating weight is reduced to 0 (ratings remain for history, weight = 0)

## 6.3 Vendor Verification

**Levels of vendor credibility:**

| Level | Label | What It Means | How Earned |
|-------|-------|---------------|-----------|
| 0 | Listed | Name + phone only, added by community | Automatic on addition |
| 1 | Photo Verified | Has a profile photo | Photo upload + no duplicate face match |
| 2 | Community Verified | Rated by ≥3 different flats | Automatic at threshold |
| 3 | Proxima Verified | Background check + document verification | Future paid feature |

**The cold start vendor state:** A vendor at Level 0 still appears in search. They display as "Listed — Not Yet Rated." This is honest and useful. It does not pretend the vendor is good or bad.

## 6.4 Rating Architecture

### The 8 Dimensions (Preserved from prior design, with rationale)

| Dimension | Why It Matters | Who Cares Most |
|-----------|---------------|----------------|
| Work Quality | Core output | Everyone |
| Punctuality | Time is money | Working professionals |
| Pricing Honesty | No surprise bills | Everyone |
| Behavior | Safety and respect | Women, families |
| Communication | Responsiveness | Everyone |
| Reliability | Shows up when promised | Everyone |
| Cleanliness | Post-service state | Homemakers |
| Safety | Trustworthy in home | Families, women alone |

**UX simplification:** Residents rate on a 3-point scale per dimension (thumbs down / neutral / thumbs up), not a 5-star scale. This reduces cognitive load dramatically. The system internally converts to a weighted score.

**Why 3-point, not 5-star:** Research on rating systems consistently shows that non-expert raters cluster at extremes (1 or 5) on 5-star scales. A 3-point forced-choice yields more honest, more differentiated data.

### Review Weight Calculation

```
rating_weight = base_weight × recency_factor × reviewer_tier_multiplier

base_weight = 1.0
recency_factor = 1.0 for ratings <30 days, decays to 0.5 at 12 months
reviewer_tier_multiplier:
  New (0 points)     = 0.2x
  Active (1-2)       = 1.0x
  Champion (3-5)     = 1.2x
  Guardian (6+)      = 1.5x
```

**Reviewer tier points are earned by:**
- Completing a rating (1 point per rating, max 2/month)
- Rating being reconfirmed by community (1 point)
- Adding a vendor later confirmed by 2+ others (1 point)

**Reviewer tier points are lost by:**
- Rating being flagged and withdrawn after community review (-1 point)
- Account identified as potentially duplicate (-2 points, review required)

## 6.5 Fraud Detection

### The 5 Attack Vectors (Ranked by Likelihood)

**Attack 1: Vendor self-boost (most common)**
A vendor asks their cousin in Flat 304 to leave a 5-star review.

Detection:
- New accounts rating immediately after registration flagged (48-hour cooling period)
- Accounts from same WiFi network as another rater of same vendor flagged
- Accounts rating only one vendor ever flagged
- Spike detection: vendor receives >3 ratings in 24 hours → ratings held pending review

**Attack 2: Competitor brigading (medium risk)**
A competing vendor's relative systematically flags or downrates competitors.

Detection:
- Account flags >3 different vendors in 7 days → account reviewed
- Multiple flags on same vendor from accounts created within 30 days of each other → pattern flagged
- Flagging account must have Community Verified status (≥3 previous ratings accepted) to trigger flag response

**Attack 3: Fake resident accounts (medium risk)**
Someone creates multiple accounts to multiply their rating weight.

Detection:
- One flat = one verified account maximum
- Email + phone combination unique per account
- IP-based duplicate detection on registration

**Attack 4: Admin bias (resolved by design)**
Admin manually inflates or suppresses vendor scores.

Mitigation:
- Admin cannot directly edit ratings
- All admin actions logged with timestamps
- Rating changes require system-trigger (cannot be manually entered)
- Future: two-admin consensus required for override actions

**Attack 5: Vendor photo spoofing**
Vendor uploads someone else's photo.

Detection:
- Future: face similarity check against existing vendor photos in the system
- V1: manual moderator review of photos within 48 hours of upload

## 6.6 Dispute Resolution

### Resident Dispute Process
1. Resident flags a vendor with a reason
2. Flag recorded, vendor not notified yet
3. If threshold reached → previous raters prompted to reconfirm
4. Resolution through community vote (see addendum design — preserved)

### Vendor Dispute Process
1. Vendor identifies a specific rating they believe is unfair
2. Vendor submits appeal via vendor portal with their account of events
3. Original rater notified: "A vendor has disputed your rating. Would you like to respond?"
4. Original rater responds (or doesn't within 7 days)
5. Admin reviews batch of appeals weekly
6. Possible outcomes: rating stands, rating marked "disputed," rating removed
7. Neither party sees the other's identity during the process

### What Cannot Be Disputed
- Rating score itself (only the vendor's response can be added)
- Community-voted flag resolution
- Auto-suspension from 3+ uncontested flags

---

# PART 7: DATABASE DESIGN

## 7.1 Core Entities

```
SOCIETY (tenant root)
├── id (UUID)
├── name
├── slug (unique, URL-safe)
├── address
├── city
├── pincode
├── resident_count_approx
├── created_at
├── is_active
└── settings (JSON — feature flags per society)

RESIDENT
├── id (UUID)
├── society_id (FK → SOCIETY)
├── auth_uid (Firebase Auth UID)
├── flat_number (verified)
├── display_name
├── email
├── phone (optional, for notifications)
├── tier (new/active/champion/guardian)
├── points
├── is_verified
├── is_moderator
├── is_admin
├── created_at
├── last_active_at
└── deleted_at (soft delete)

VENDOR (global entity — not society-scoped)
├── id (UUID)
├── name
├── phone (unique index — primary dedup key)
├── photo_url
├── photo_verified_at
├── created_at
└── claimed_at (null if unclaimed)

VENDOR_SOCIETY (junction — reputation is society-scoped)
├── id (UUID)
├── vendor_id (FK → VENDOR)
├── society_id (FK → SOCIETY)
├── status (pending_photo/active/dimmed/suspended)
├── added_by_resident_id
├── is_seeded (true if admin-imported, not resident-added)
├── trust_score (computed, cached)
├── last_rated_at
├── reconfirm_requested_at
└── created_at

VENDOR_CATEGORY
├── vendor_society_id (FK → VENDOR_SOCIETY)
├── category_id (FK → CATEGORY)
└── is_primary

CATEGORY
├── id
├── name
├── icon
└── parent_id (for subcategories — future)

RATING
├── id (UUID)
├── vendor_society_id (FK → VENDOR_SOCIETY)
├── resident_id (FK → RESIDENT)
├── quality_score (1/2/3)
├── punctuality_score
├── pricing_score
├── behavior_score
├── communication_score
├── reliability_score
├── cleanliness_score
├── safety_score
├── review_text (optional)
├── weight (computed from tier + recency)
├── status (pending/active/withdrawn/disputed)
├── created_at
├── updated_at
└── service_date (when was the service used — for 48hr delay check)

FLAG
├── id (UUID)
├── vendor_society_id (FK → VENDOR_SOCIETY)
├── flagged_by_resident_id (FK → RESIDENT)
├── reason (enum: inactive/unprofessional/fake_listing/safety/other)
├── detail (text, optional)
├── status (open/resolved/dismissed)
├── created_at
└── resolved_at

APPEAL
├── id (UUID)
├── vendor_id (FK → VENDOR)
├── rating_id (FK → RATING, nullable)
├── flag_id (FK → FLAG, nullable)
├── submitted_by_vendor_id
├── vendor_statement (text)
├── resident_response (text, nullable)
├── admin_decision (enum: stands/disputed/removed)
├── admin_notes
├── status (pending/in_review/resolved)
├── created_at
└── resolved_at

REQUEST_BOARD_POST
├── id (UUID)
├── society_id (FK → SOCIETY)
├── resident_id (FK → RESIDENT)
├── category_id (FK → CATEGORY)
├── description
├── urgency (low/medium/high)
├── status (open/filled/expired)
├── recommended_vendor_id (FK → VENDOR, nullable)
├── created_at
└── expires_at (auto-expire after 30 days)

AUDIT_LOG
├── id (UUID)
├── society_id
├── actor_type (system/resident/moderator/admin/vendor)
├── actor_id
├── action (enum — comprehensive list)
├── target_type
├── target_id
├── payload (JSON — before/after state)
├── triggered_by_rule_id (for system actions)
└── created_at
```

## 7.2 Indexing Strategy

```sql
-- High-traffic query: browse vendors by category in a society
CREATE INDEX idx_vendor_society_category ON vendor_category(society_id, category_id, trust_score DESC);

-- Vendor lookup by phone (dedup)
CREATE UNIQUE INDEX idx_vendor_phone ON vendor(phone);

-- Resident lookup by auth UID
CREATE UNIQUE INDEX idx_resident_auth_uid ON resident(auth_uid, society_id);

-- Ratings per vendor per society (for score computation)
CREATE INDEX idx_rating_vendor_society ON rating(vendor_society_id, status, created_at DESC);

-- Flags per vendor (for threshold check)
CREATE INDEX idx_flag_vendor_status ON flag(vendor_society_id, status);

-- Audit log queries
CREATE INDEX idx_audit_log_target ON audit_log(target_type, target_id, created_at DESC);
CREATE INDEX idx_audit_log_society ON audit_log(society_id, created_at DESC);
```

## 7.3 Multi-Tenancy Notes

- Every query that touches resident data, ratings, flags, or vendor_society records MUST include `society_id` in the WHERE clause
- The API layer enforces this at middleware level — a request authenticated to Society A cannot ever see Society B's data
- Global vendor records (VENDOR table) are accessible cross-society — only reputation data (VENDOR_SOCIETY, RATING, FLAG) is scoped

---

# PART 8: SYSTEM ARCHITECTURE

## 8.1 Architecture Overview

```
                    ┌─────────────────────────────────┐
                    │         Cloudflare CDN           │
                    │    (DDoS, Rate Limiting, TLS)    │
                    └──────────────┬──────────────────┘
                                   │
                    ┌──────────────▼──────────────────┐
                    │       React SPA (Web App)        │
                    │     Cloudflare Pages (CDN)       │
                    │   Mobile-responsive, PWA-ready   │
                    └──────────────┬──────────────────┘
                                   │ HTTPS API calls
                    ┌──────────────▼──────────────────┐
                    │      API Layer                   │
                    │   Cloudflare Workers             │
                    │  (Hono.js framework)             │
                    │  Stateless, edge-deployed        │
                    └──────┬────────────┬─────────────┘
                           │            │
              ┌────────────▼──┐    ┌────▼──────────────┐
              │  Auth Check   │    │   Business Logic   │
              │ Firebase Auth │    │   (Workers)        │
              │  JWT verify   │    │                    │
              └───────────────┘    └────┬──────────────┘
                                        │
                    ┌───────────────────▼─────────────┐
                    │        Cloudflare D1             │
                    │    (SQLite at the edge)          │
                    │  Primary operational database    │
                    └─────────────────────────────────┘
                    ┌─────────────────────────────────┐
                    │        Cloudflare R2             │
                    │    (Object storage)              │
                    │  Vendor photos, exports          │
                    └─────────────────────────────────┘
                    ┌─────────────────────────────────┐
                    │     Background Jobs              │
                    │  Cloudflare Workers (Cron)       │
                    │  Score recompute, nudges,        │
                    │  inactive detection, cleanup     │
                    └─────────────────────────────────┘
                    ┌─────────────────────────────────┐
                    │   Error Tracking + Monitoring    │
                    │          Sentry                  │
                    └─────────────────────────────────┘
```

## 8.2 Technology Decisions & Justifications

### Frontend: React + Vite
- **Why React:** Largest ecosystem, best hiring pool, Vite gives fast builds, component reuse across web and future React Native
- **Why not Next.js:** SSR is unnecessary for this use case (data is auth-gated, not SEO-critical per-vendor)
- **Why not Vue/Svelte:** React's component ecosystem and team familiarity wins

### API: Cloudflare Workers + Hono.js
- **Why Workers:** Free tier is generous (100K req/day), edge-deployed = low latency, no server management
- **Why Hono.js:** Typed, fast, built for Workers, excellent middleware support
- **Tradeoff:** Workers have execution limits (30s CPU time, 128MB memory). This is fine for this use case. Complex computation (score recomputation) runs as scheduled jobs, not in request path.

### Database: Cloudflare D1
- **Why D1:** Free tier (5GB, 5M reads/writes), runs at edge alongside Workers, zero latency to API
- **Honest tradeoff:** D1 is still maturing. Complex queries and high-write scenarios have known limitations. For V1 scale (<500 residents per society), this is fine. At 100 societies, re-evaluate.
- **Migration path:** D1 uses SQLite-compatible schema. Migration to PlanetScale (MySQL) or Neon (Postgres) is feasible if needed.

### Authentication: Firebase Auth
- **Why Firebase:** Google Sign-In is ubiquitous in India, free tier handles our scale, battle-tested
- **Why not Auth0 or Supabase Auth:** Cost at scale and complexity of migration are higher
- **Tradeoff:** Firebase Auth is a Google dependency. If Google deprecates the free tier, migration required.

### Storage: Cloudflare R2
- **Why R2:** 10GB free, S3-compatible API, zero egress fees (vs S3's egress costs)
- **Use case:** Vendor photos only. Not large volumes.

### Scheduled Jobs: Cloudflare Workers Cron
- **Why move from Google Apps Script:** Apps Script is a dependency on a Google account, has execution limits, is not auditable in git, and creates operational risk. Workers Cron is code-in-repo, version-controlled, deployable.
- **This is a change from the prior design.** Google Sheets as a backend is a prototype pattern, not a production pattern. It is removed.

### Notifications: WhatsApp Business API via Twilio (or direct)
- **V1:** Pre-fill links only (no API cost)
- **V1.5:** Twilio WhatsApp API for automated nudges (at cost, but minimal)

## 8.3 What Is NOT Built in V1

| Component | Why Deferred |
|-----------|-------------|
| Native mobile app | PWA covers 90% of use cases at 10% of cost |
| Elasticsearch / search | SQLite FTS (full-text search) is sufficient for <5000 vendors |
| Redis cache | D1 at edge is fast enough for read-heavy use case |
| Analytics platform | Cloudflare Analytics + manual admin dashboard is sufficient |
| ML-based fraud detection | Rule-based detection catches 95% of attacks at V1 scale |

---

# PART 9: SECURITY REVIEW

## 9.1 Threat Model

### Threat 1: Account Takeover
- **Vector:** Attacker gains access to a resident's Google account → controls their rating weight
- **Mitigation:** This is Google's problem, not ours. We inherit Google's security. Resident accounts have limited blast radius (one society, limited rating weight).

### Threat 2: Vendor Profile Hijacking
- **Vector:** Bad actor claims to be a vendor, takes over their profile, edits information
- **Mitigation:** Vendor profile claiming requires OTP to the phone number on the listing. Phone ownership = identity.

### Threat 3: Admin Privilege Escalation
- **Vector:** Moderator account upgraded to admin by insider or via session manipulation
- **Mitigation:** Admin roles assigned only via database-level change (not through the app UI). Requires direct database access. All role changes logged in audit trail with before/after state.

### Threat 4: API Abuse / Rate Abuse
- **Vector:** Automated script hammers the API to scrape data or submit fake ratings
- **Mitigation:**
  - Cloudflare Rate Limiting: 60 requests/minute per IP for reads, 10/minute for writes
  - Write endpoints require Firebase Auth token (not just a cookie)
  - Captcha on vendor submission (hCaptcha, free tier)
  - Rating submissions require service_date (48hrs before submission minimum) — automated scripts can't know future service dates

### Threat 5: Data Leakage
- **Vector:** API endpoint returns data belonging to a different society
- **Mitigation:** Society ID is derived from the JWT token, not from the request body. The API middleware extracts society_id from the verified token. It is never trusted from client input.

### Threat 6: Resident PII Exposure
- **Vector:** Vendor or other resident sees reviewer's identity and targets them
- **Mitigation:**
  - Reviews display flat number, not name (e.g., "Flat 304" not "Anita Sharma")
  - Vendor portal shows aggregate stats, not individual reviewer flat numbers
  - Appeal process hides identities from both parties

### Threat 7: Photo Misuse
- **Vector:** Vendor photo is someone else's image (stock photo, stolen image)
- **Mitigation:**
  - V1: Manual photo review by moderator within 48 hours
  - V1.5: Reverse image search API check on upload
  - R2 signed URLs — photos are not publicly guessable URLs

### Threat 8: SQL Injection
- **Vector:** Attacker injects SQL via API parameters
- **Mitigation:** All D1 queries use parameterized statements (enforced by Hono.js middleware and code review). No raw string concatenation in SQL.

## 9.2 Security Baseline Checklist

- [ ] All API endpoints require auth token validation before executing any business logic
- [ ] Society ID always derived from token, never from request body
- [ ] All writes logged to AUDIT_LOG before confirmation returned
- [ ] Rate limiting on all write endpoints
- [ ] Photo uploads scanned for EXIF data (strip GPS coordinates before storage)
- [ ] No PII (email, phone, flat number) returned in list endpoints — only in profile endpoints with appropriate auth
- [ ] Admin dashboard accessible only from registered admin account, no "secret URL" patterns
- [ ] Dependency audit in CI pipeline (npm audit, automated)
- [ ] CSP headers set on all pages
- [ ] HTTPS enforced everywhere (Cloudflare handles this)

---

# PART 10: MVP DEFINITION

## 10.1 What Proxima V1 Must Do

V1 must answer this question for any new resident: **"Who can I trust to fix my geyser?"**

That's it. Everything else is secondary.

### V1 Feature Set (Non-Negotiable)

**1. Vendor Directory (Browse & Search)**
- Browse by category
- Search by name or service
- Vendor card: name, photo, categories, trust score, last rated date, phone (WhatsApp link)
- Guest access (no login required to browse)

**2. Vendor Rating**
- Auth required
- 8-dimension 3-point rating
- Optional 200-char review text
- 48-hour delay from service date
- One rating per resident per vendor

**3. Add a Vendor**
- Auth required
- Name, phone, categories, photo (soft-mandatory)
- Duplicate detection on phone number

**4. Flag a Vendor**
- One tap
- Reason selection (5 options)
- Feeds into automated flag resolution

**5. Authentication**
- Google Sign-In
- Flat number verification (against admin-uploaded whitelist)
- One account per flat

**6. Admin Panel (Minimal)**
- Upload resident whitelist (CSV)
- View pending appeals (list view)
- View Photo Pending listings >14 days
- View auto-suspended vendors

**7. "How It Works" Page**
- Explains the trust system in plain language
- Addresses skeptic questions directly
- Not a nice-to-have — it is the skeptic conversion tool

### V1 Explicitly Excludes

- Request Board (design is incomplete — cold start on requests is a separate problem)
- Vendor self-registration portal (too complex for V1, vendors are passive in V1)
- Cross-society vendor reputation (requires more societies to be meaningful)
- Notifications (WhatsApp nudges, SMS)
- Analytics dashboard for admin (basic metrics only in V1)
- Moderator accounts (admin handles exceptions directly in V1)
- Native mobile app (PWA only)
- Paid features of any kind

## 10.2 V1.5 Additions (60-90 days post V1 launch)

- Request Board (if cold start is solved by then)
- Vendor claim portal (vendor OTP-verify and manage profile)
- Moderator roles (admin can delegate queue review)
- WhatsApp notification nudges (automated reminders to rate after service)
- Basic analytics dashboard for admin
- Cross-society vendor lookup (read-only — see vendor's ratings in other societies)
- Reconfirmation system (automated prompts to reconfirm aging ratings)

## 10.3 V2 (6+ months post launch)

- Multi-society expansion infrastructure (onboarding flow for new societies)
- Vendor Verified Pro tier (paid, with credential verification)
- RWA Pro subscription (₹499/month)
- Vendor monthly reputation report (automated WhatsApp summary)
- Native mobile app (if PWA engagement data justifies it)
- API for integration with MyGate / NoBroker society apps
- ML-enhanced fraud detection (at scale, rule-based is insufficient)

---

# PART 11: DESIGN SYSTEM

## 11.1 Design Principles

1. **Clarity over cleverness.** Every element has a job. No decorative complexity.
2. **Trust signals are primary.** The visual language must make trust information immediately legible.
3. **Mobile-first, always.** Design for 360px wide. Desktop is secondary.
4. **High contrast by default.** Accessibility is non-negotiable.
5. **Speed perception.** Skeleton screens over spinners. Optimistic UI for ratings.

## 11.2 Color System

```
Primary:      #FF5B1F  (Proxima Orange — action, CTAs, links)
Primary Dark: #CC3D00  (Hover states, pressed states)
Surface:      #0F0F0F  (Dark header, navigation)
Background:   #F8F8F6  (App background — off-white, not pure white)
Card:         #FFFFFF
Text Primary: #1A1A1A
Text Secondary: #6B6B6B
Text Disabled: #ADADAD

Trust Green:  #22C55E  (Positive ratings, verified badges)
Warning:      #F59E0B  (Flags, caution states)
Danger:       #EF4444  (Suspension, negative signals)
```

## 11.3 Typography

```
Display:  Inter Bold, 28px / 34px line-height
Heading:  Inter SemiBold, 20px / 26px
Body:     Inter Regular, 16px / 24px
Caption:  Inter Regular, 13px / 18px
Label:    Inter Medium, 12px / 16px (uppercase, 0.5px tracking)
```

## 11.4 Core Components

- **VendorCard:** Photo thumbnail, name, primary category badge, trust score bar (visual, not numeric in V1), last rated date. Tappable to full profile.
- **TrustScoreBar:** Visual representation of 8-dimension aggregate. No numbers shown by default — numbers revealed on tap. This avoids anchoring bias on raw scores.
- **RatingThumb:** Three-state button: thumbs down / neutral / thumbs up. Large touch targets (min 44px).
- **CategoryChip:** Pill-shaped category label. Tappable for browse filtering.
- **VerifiedBadge:** Camera icon (photo verified), Community icon (community verified), Proxima shield (Proxima verified).
- **FlagButton:** Subtle, icon-only at card level. Expands to reason selection.
- **EmptyState:** Always includes an action CTA. Never just "nothing here."

## 11.5 Accessibility Standards

- WCAG 2.1 AA minimum
- Color contrast ratio ≥ 4.5:1 for all text
- Touch targets minimum 44×44px
- Screen reader labels on all interactive elements
- No color as the only indicator of state (always paired with icon or text)

---

# PART 12: ANALYTICS FRAMEWORK

## 12.1 Instrumented Events

| Event | Properties | Why It Matters |
|-------|-----------|----------------|
| `vendor_viewed` | vendor_id, category, source (search/browse/direct) | Discovery funnel |
| `vendor_contact_tapped` | vendor_id, contact_type (whatsapp/phone) | Conversion metric |
| `rating_started` | vendor_id | Intent signal |
| `rating_submitted` | vendor_id, dimensions, has_review_text | Core engagement |
| `rating_abandoned` | vendor_id, last_dimension_reached | Drop-off analysis |
| `vendor_added` | category, has_photo | Supply growth |
| `vendor_flagged` | vendor_id, reason | Trust system health |
| `search_performed` | query, category_filter, results_count | Search behavior |
| `search_zero_results` | query | Missing supply gaps |
| `resident_verified` | flat_number (hashed) | Activation rate |
| `resident_registered` | — | Acquisition |
| `session_start` | source | Traffic analysis |

## 12.2 Core Dashboards (Admin View)

**Society Health Dashboard**
- Registered residents / Total flats
- Monthly Active Residents (MAR)
- Vendors added this month
- Ratings submitted this month
- Pending flags / Auto-suspensions

**Trust System Health Dashboard**
- Flag rate per 1000 ratings (should be <5%)
- Dispute rate (should be <2%)
- Average time from flag to resolution
- Ratings withdrawn after community review (should be <10%)

**Supply Dashboard**
- Categories with zero vendors (coverage gaps)
- Vendors with zero ratings (unrated backlog)
- Search zero-result queries (supply demand mismatch)

## 12.3 Retention Funnel

```
Week 1: Install → Browse → Register → Verify flat
Week 2: First rating submitted
Week 4: Second rating OR vendor added
Month 3: Still monthly active

D7 retention target: 60%
D30 retention target: 40%
D90 retention target: 30%
```

---

# PART 13: IMPLEMENTATION PLAN

## 13.1 Pre-Build (Week 0) — Non-Technical Foundations

- [ ] Recruit founding resident champion for Lotus Zing (not the admin — a motivated resident)
- [ ] Collect initial vendor list (min 25 vendors from WhatsApp history)
- [ ] Create resident whitelist (all flat numbers + resident phone)
- [ ] Define category taxonomy (10-12 categories, no more)
- [ ] Write "How It Works" page copy
- [ ] Design mockups for 5 core screens (Figma)
- [ ] Set up Cloudflare account, Firebase project, Sentry project

## 13.2 Build Phase (Days 1–14)

**Days 1–2: Infrastructure**
- Cloudflare Pages project + CI/CD pipeline (GitHub → Cloudflare)
- D1 database creation + schema migration
- Firebase Auth project + Google Sign-In configuration
- Sentry error tracking integration
- Hono.js API scaffold with auth middleware
- Environment variables and secrets management

**Days 3–4: Core Data Layer**
- All database tables created with indexes
- API endpoints: GET /vendors, GET /vendor/:id, GET /categories
- Seed script for initial vendor import
- Auth token validation middleware tested

**Days 5–6: Directory UI**
- Category grid (home screen)
- Category browse list
- Vendor card component
- Vendor profile screen
- Search (SQLite FTS)
- WhatsApp contact pre-fill

**Days 7–8: Auth + Resident Verification**
- Google Sign-In flow
- Flat number verification step
- Whitelist validation logic
- Resident profile creation

**Days 9–10: Rating System**
- Rating form (8 dimensions, 3-point)
- 48-hour service date validation
- Rating submission API with weight calculation
- Trust score recomputation job (Cron trigger)
- Rating history view

**Days 11–12: Add Vendor + Flag System**
- Add vendor form
- Duplicate detection (phone match + name+category fuzzy match)
- Photo upload to R2 (with size/type validation)
- Flag form + flag threshold logic
- Auto-suspension trigger

**Days 13–14: Admin Panel + Polish**
- Resident whitelist upload (CSV)
- Pending appeals list
- Photo Pending vendor list
- Auto-suspended vendor list
- "How It Works" page
- Error states, empty states, loading states
- Mobile responsiveness audit

## 13.3 Testing Phase (Days 15–18)

**Days 15–16: Internal Testing**
- 5 test accounts across different flat numbers
- Full end-to-end flows: browse → rate → flag → resolve
- Security: test society isolation (two test societies, confirm data separation)
- Performance: load test with 50 concurrent requests
- Mobile: test on Android Chrome, iOS Safari, and lower-end devices

**Days 17–18: Soft Launch**
- Invite 10 early-adopter residents (manually, via WhatsApp)
- Seed the full vendor list (25+ vendors)
- Monitor Sentry for errors
- Collect feedback verbally (no in-app feedback yet)
- Fix critical bugs

## 13.4 Launch (Day 19+)

- RWA admin sends WhatsApp announcement
- QR code placed in lobby, lift, and noticeboard
- Week 1 goal: 30 verified residents, 10 ratings submitted
- Week 2 goal: 50 verified residents, 3 vendors added by community
- 30-day goal: 40% MAR, 30+ vendors rated

## 13.5 Key Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| D1 query performance degrades at scale | Medium | High | Index all hot queries now; plan migration path to Postgres |
| Admin burns out, platform goes unmaintained | High | Critical | Build self-governing system by V1.5; recruit backup admin |
| Cold start fails — <20 residents in first 2 weeks | Medium | Critical | Pre-seed vendor list; founding team manually activates 10 residents |
| Key vendor gaming the system early | Low | High | Flag detection catches it; early incidents actually validate the trust system |
| Society politics — admin or RWA becomes a platform adversary | Low | Critical | Maintain resident trust independently of RWA approval; design for admin removal without data loss |
| Firebase free tier changes pricing | Low | Medium | Architect auth layer with abstraction; swap to Supabase Auth if needed |

---

# PART 14: OPEN ITEMS (Unresolved — Must Be Resolved Before V1.5)

These gaps were identified in the previous design and remain open:

**Gap 4 — Cold Start for New Vendors**
The platform tells residents about vendors but doesn't tell vendors about the platform. A vendor with 0 ratings who knows they're listed but can't claim their profile is a frustrated vendor who may become hostile to the platform.
*Resolution needed:* Design the vendor SMS notification flow and the vendor claim portal.

**Gap 5 — Request Board Design**
The demand-matching algorithm is undefined. Who sees the request? How does a resident's request get connected to the right vendor? What prevents spam?
*Resolution needed:* Full request board spec including matching logic, spam prevention, and expiry mechanics.

**Gap 6 — Cross-Society Logic**
When a vendor is rated in Society A and then listed in Society B, does their rating transfer? At what weight? What if their Society B behavior is worse?
*Resolution needed:* Vendor reputation portability rules.

**Gap 7 — Vendor Monthly Report**
The WhatsApp summary to vendors (their month's performance) needs full design including content, format, and delivery mechanism.

**Gap 8 — Dispute Resolution SLA**
The admin reviews disputes weekly. But what is the SLA communicated to vendors? What happens if admin is on vacation?

---

# APPENDIX: KEY DECISIONS LOG

| Decision | Outcome | Rationale |
|----------|---------|-----------|
| Backend | Cloudflare Workers + D1, not Google Sheets | Sheets is not production infrastructure. Workers is version-controlled, auditable, scalable. |
| Auth | Firebase Auth (Google Sign-In only in V1) | Ubiquitous in India, free tier, best UX for non-technical users |
| Rating scale | 3-point per dimension, not 5-star | Reduces cognitive load, prevents clustering at extremes |
| Guest access | Browse allowed without login | Value before registration. Critical for adoption. |
| Admin role | Exception handler only (~5 min/week) | Self-governing system is the goal. Admin dependency is a failure mode. |
| Photo requirement | Soft-mandatory | Balance between quality and submission friction |
| Monetization | Free for V1, freemium in V1.5 | Build trust and network effects before monetizing |
| Native app | Deferred to V2 | PWA is sufficient; native app costs 3x and adds 0 network effect |
| Request Board | Deferred to V1.5 | Cold start on requests is unsolved; don't launch with a dead feature |
| Vendor leveling (resident) | 4 tiers with weight multiplier | Rewards participation, deters fresh fake accounts |
| Database multi-tenancy | society_id on all tenant-scoped tables | No alternative if scale to 1000 societies is the goal |

---

*Proxima Master Design Document v1.0 | June 2026*
*Next review: Upon completion of soft launch (Day 19) or at V1.5 planning.*
