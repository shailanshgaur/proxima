# Zing Connect: Constitution v1.0
## Core Laws Governing the System

---

## Law 1: Proof Before Opinion
**A rating or review can only exist if a real and verifiable service interaction occurred between the resident and vendor.**

### What This Means
- No theoretical opinions ("I've heard Anita is good")
- No speculation ("She probably does good work")
- No secondhand information ("My sister used her")
- Only first-person, paid-for service experience counts

### Implementation
- ✅ **First-Contact Delay (48 hours):** Can't rate/review until 48h after adding vendor
- ✅ **Signal Type:** Only EMPLOY, RATE, REVIEW signals from direct experience
- ✅ **Verification:** Admin can mark false claims as unverified
- ✅ **Failsafe:** Single review quality issue (Law 1 violation) ≠ auto-action. Requires evidence of non-experience.

### Protection
- Vendors cannot be rated based on rumors
- Residents cannot build credibility on hearsay
- Reviews without experience are marked low-weight
- False claim = can be reported by community

---

## Law 2: Trust Is Earned Slowly, Lost Quickly
**Vendor reputation is cumulative but fragile. Serious violations, fraud, abuse, or repeated complaints outweigh historical positive ratings.**

### What This Means
- 100 good ratings over 1 year = real trust
- 1 verified case of fraud → vendor archived (regardless of prior ratings)
- 3 serious complaints (unsafety, theft, abuse) → escalates to admin block
- Time in system matters; recency matters more

### Implementation
- ✅ **New Resident Penalty (7 days, 0.2x):** Trust starts near zero
- ✅ **Longevity Score:** 30% of residential vendor score (rewards 90+ day vendors)
- ✅ **Auto-Archive Thresholds:** Self-reference (0.95) = immediate loss of trust
- ✅ **Severity Escalation:** HIGH confidence fraud (Confidence ≥ 0.90) = removed instantly
- ✅ **Serious Violations:** FRAUD, THEFT, ABUSE flags → permanently archive (no 30-day window)

### Protection
- 1 fraud case ≠ reputation recovered by 100 good ratings
- System favors vendors proven over time
- New vendors start skeptical
- Serious violations are permanent (with appeal process)

### Edge Case
**Established vendor (90+ days) commits fraud:**
- Law 2 says: "Lost quickly" — trust crater
- Failsafe Rule #3 says: "Due process for established vendors"
- **Resolution:** Flag for review (don't auto-archive), but default to belief of fraud signal. You review, confirm, archive.

---

## Law 3: Transparency Over Manipulation
**Verified negative feedback remains visible unless proven fraudulent, abusive, misleading, or false. Vendors may respond or dispute, but cannot erase legitimate criticism.**

### What This Means
- No "delete bad review" button for vendors
- Negative reviews visible even if vendor is unhappy
- Vendor disputes must be evidence-based, not opinion-based
- Community sees the full story (both praise and criticism)

### Implementation
- ✅ **Immutable Review System:** Once published, reviews cannot be deleted (only flagged as disputed)
- ✅ **Vendor Response:** Vendors can comment on reviews, but cannot hide them
- ✅ **Admin Removal:** Reviews only removed if PROVEN fraudulent, abusive, or false
  - Not if vendor just "disagrees"
  - Not if vendor is unhappy
  - Only if evidence shows: false claim, defamation, abuse, non-resident writing it
- ✅ **Visibility:** Negative reviews weighted equally to positive (no suppression)
- ✅ **Dispute Trail:** When vendor disputes, residents see dispute (full transparency)

### Protection
- Vendors cannot silence dissent
- Community sees authentic feedback (good and bad)
- Trust is built on genuine reputation, not manipulation
- Bad vendors cannot game the system by hiding complaints

### Failsafe Impact
- **Never auto-hide negative reviews** based on vendor credibility
- **Only hide if:** Proven false, abusive language, non-resident posting, defamation
- **Vendor disagreement alone ≠ removal**

---

## Law 4: Multi-Dimensional Reputation
**Vendor trust scores must reflect multiple dimensions including work quality, punctuality, pricing honesty, behavior, communication, reliability, cleanliness, and safety — not a single vanity rating.**

### What This Means
- Not just "I give you 5 stars"
- Break down: quality, speed, cost honesty, safety, cleanliness, communication
- Vendor profile shows all dimensions
- Users can see where vendor excels and where they struggle

### Implementation
- ✅ **Current Design (Residential):** Score = Households (50%) + Longevity (30%) + Rating Quality (20%)
- ⚠️ **Gap:** Rating quality is simplified. Should expand to:
  - **Work Quality** (primary)
  - **Punctuality** (arrives on time, completion time)
  - **Pricing Honesty** (charges as quoted, no surprises)
  - **Behavior** (respectful, professional, safe)
  - **Communication** (responsive, clear)
  - **Reliability** (shows up, doesn't cancel)
  - **Cleanliness** (for house staff: leaves space clean)
  - **Safety** (no red flags, trustworthy with keys/valuables)

### Data Collection
```
Review form expands from:
  "Rate overall: 1-5 ⭐"
  
To:
  Work Quality: 1-5 ⭐
  Punctuality: 1-5 ⭐
  Pricing Honesty: 1-5 ⭐
  Behavior: 1-5 ⭐
  Communication: 1-5 ⭐
  Reliability: 1-5 ⭐
  Cleanliness: 1-5 ⭐ (if applicable to category)
  Safety: 1-5 ⭐
  
  Optional comment: [text]
```

### Vendor Profile
```
Anita (Residential Cook)
⭐ Overall: 4.2 / 5.0

Breakdown:
  Work Quality:      4.8 ⭐ (Great taste, variety)
  Punctuality:       4.1 ⭐ (Usually on time)
  Pricing Honesty:   3.9 ⭐ (Charges extra occasionally)
  Behavior:          4.5 ⭐ (Friendly, respectful)
  Communication:     4.3 ⭐ (Responds within 2h)
  Reliability:       4.4 ⭐ (Rarely cancels)
  Cleanliness:       4.6 ⭐ (Always cleans up)
  Safety:            4.7 ⭐ (Trusted with keys)
  
Residents say: "Excellent food and safety. Sometimes adds charges without notice."
```

### Protection
- Vendors can excel in specific areas (no single bad dimension kills them)
- Residents make informed decisions (know strengths and weaknesses)
- System rewards holistic excellence, not just one good attribute
- Pricing dishonesty flags = can lower hire credibility without killing overall rating

---

## Law 5: Resident Trust Above Revenue
**Trust systems and monetization systems must remain structurally separated. Sponsored visibility, paid boosts, or advertising must never influence vendor trust rankings.**

### What This Means
- ✅ MVP (Free Only): No monetization. Pure community value.
- ❌ Never: Pay-to-rank vendors
- ❌ Never: Sponsored visibility in directory
- ❌ Never: Advertising dollars → better placement
- ❌ Never: Premium tiers that improve trust scores
- ✅ Future (Optional): Monetization only OUTSIDE trust system
  - e.g., Vendor premium listing ₹99/month = extra visibility, but same trust score
  - e.g., Analytics insights sold, but trust signals not touched

### Implementation
- ✅ **Structural Separation:** 
  - `VENDORS` sheet = trust data (locked, admin-only edit)
  - `MONETIZATION` sheet (future) = separate, revenue data
  - Never joined, never influence each other
- ✅ **Admin Access Control:** Money handlers ≠ trust handlers
- ✅ **Algorithm Lock:** Trust score formula never touches monetization data
- ✅ **Transparency:** All residents see ranking methodology (no hidden revenue influence)

### Protection
- Residents trust the system because it's not for sale
- Vendors ranked on merit, not wallet
- Community stays authentic
- Monetization (if added) doesn't corrupt trust

### Failsafe Impact
- **Never rank vendors higher for sponsorship**
- **Never soften fraud flags based on vendor payment status**
- **Never suppress negative reviews based on monetization**
- **If vendor pays for premium listing, their score stays the same**

---

## Validation: How the Failsafe System Aligns with These Laws

| Law | Failsafe Decision | Alignment |
|---|---|---|
| Law 1: Proof Before Opinion | First-Contact Delay (48h) prevents rating before experience | ✅ Direct support |
| Law 2: Trust Lost Quickly | Self-reference (0.95) → auto-archive | ✅ Immediate trust loss |
| Law 2: Trust Earned Slowly | New resident (0.2x) for 7 days | ✅ Slow trust building |
| Law 3: Transparency | Never hide negative reviews (only fraudulent ones) | ✅ Direct support |
| Law 3: Vendor Cannot Erase | Immutable reviews, vendor can respond only | ✅ Built into design |
| Law 4: Multi-Dimensional | Rating quality score (20% of residential score) | ⚠️ Needs expansion |
| Law 5: Resident Trust Above Revenue | Scoring formula locked, monetization separate | ✅ Structural separation |

---

## Gaps to Address

**Gap A: Law 4 — Multi-Dimensional Expansion**
- Current: Overall rating (simplified)
- Needed: 8-dimension review form (quality, punctuality, honesty, behavior, communication, reliability, cleanliness, safety)
- Impact on Scoring: Rating quality score recalculated to reflect dimension breakdown

**Gap B: Law 2 — Serious Violations**
- Current: Fraud signals trigger failsafe
- Missing: Explicit handling of THEFT, ABUSE, UNSAFETY flags
- Needed: Permanent archive (no 30-day restoration) for serious violations
- Implementation: FLAGS sheet + new column `PERMANENT_VIOLATION` (TRUE/FALSE)

**Gap C: Law 5 — Future Monetization Governance**
- Current: MVP is free-only
- Future: Monetization governance framework needed
- Needed: Document describing how monetization stays separated from trust system

---

## Standing Rule

Every failsafe decision, every scoring rule, every admin action must align with these 5 laws. If a failsafe threshold conflicts with a law, law wins; failsafe adjusted.

Example:
- Scenario: Established vendor (90 days) self-references a cook. High confidence fraud (0.95).
- Failsafe Rule #3 says: "Don't auto-archive established vendors."
- Law 2 says: "Trust lost quickly. Fraud = trust crater."
- **Resolution:** Law 2 overrides Failsafe Rule #3. Auto-archive, but notify you immediately for review + appeal option.

---

## Next Questions for Product Strategy

1. Should we implement all 8 dimensions (Law 4) in MVP, or start with simplified rating and expand later?
2. For serious violations (THEFT, ABUSE, UNSAFETY), should archive be permanent (no 30-day restoration) or reversible with high-evidence bar?
3. Should we document the future monetization framework now, or wait until Phase 2?
