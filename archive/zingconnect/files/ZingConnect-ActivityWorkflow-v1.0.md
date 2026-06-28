# Zing Connect: Complete Resident Activity Workflow
## All Possible Activities & Points Through the System

---

## STAGE 1: ONBOARDING (First-Time)

### Activity: Complete Onboarding Form
- **When:** First login, before directory access
- **What:** Fill society, tower, flat, phone, tenure
- **Points:** 0 (gate-keeping, not contribution)
- **Frequency:** 1 time only
- **State After:** Level 🌱 (New Resident, 0.2x credibility for 7 days)

---

## STAGE 2: DISCOVERY & PASSIVE USE

### Activity: Browse Directory
- **When:** Anytime after onboarding
- **What:** View vendor list, search by category, sort by rating
- **Points:** 0 (passive consumption)
- **Frequency:** Unlimited
- **Visibility:** Unauthenticated users can see names + category + rating only

### Activity: View Vendor Profile
- **When:** Click on vendor card
- **What:** See vendor details, reviews, dimensions breakdown, contact options
- **Points:** 0 (passive)
- **Frequency:** Unlimited
- **Visibility:** Authenticated users see full profile + call/WhatsApp buttons

### Activity: Call or WhatsApp Vendor
- **When:** From vendor profile
- **What:** Direct contact (doesn't go through Zing Connect)
- **Points:** 0 (external action, not tracked)
- **Frequency:** Unlimited
- **Outcome:** Resident hires vendor (happens offline)

---

## STAGE 3: FIRST CONTRIBUTION (Becomes "Active Member")

### Activity 3a: Add Vendor (First Time)
- **When:** Resident wants to share a vendor not in directory
- **What:** Submit name, phone, category, society, tower/flat, optional photo, optional description
- **Points:** 1 point
- **Frequency:** Multiple times (same vendor can be added by different residents)
- **State After:** If 1 activity → Level ⭐ (Active Member, 1.0x credibility)
- **Validation:**
  - Phone must be unique (not already a resident)
  - Self-reference check (resident phone ≠ vendor phone)
  - Duplicate check (same phone, different name → flagged)

### Activity 3b: Rate Vendor (First Rating)
- **When:** Resident has hired vendor (48+ hours after adding them)
- **What:** Select 1-5 stars for each dimension:
  - Work Quality
  - Punctuality
  - Pricing Honesty
  - Behavior
  - Communication
  - Reliability
  - Cleanliness (if applicable)
  - Safety
- **Points:** 1 point
- **Frequency:** Once per vendor (can update/override later)
- **Credibility Weight:** 0.2x (new resident) → 1.0x (active) → scales to 1.5x (guardian)
- **Validation:**
  - Must have 48+ hour gap since adding vendor
  - Rating quality gates check: review text <20 chars = low quality signal

### Activity 3c: Write Review (First Review)
- **When:** After rating, optional detailed feedback
- **What:** Text box (50-500 chars): "Great sabzi, very reliable", "Good work but charges extra"
- **Points:** 1 point
- **Frequency:** Once per vendor (can edit)
- **Visibility:** Shows under vendor profile with resident name + rating breakdown
- **Immutability:** Cannot delete, only vendor can dispute or you can flag as false
- **Validation:**
  - Minimum 20 characters
  - Maximum 500 characters
  - Must be first-person experience (review quality gates check for this)

### Activity 3d: Mark Employed (First Hire Confirmation)
- **When:** Resident confirms they actually hired this vendor
- **What:** Checkbox: "I have hired this vendor" + optional date
- **Points:** 1 point
- **Frequency:** Once per vendor per year (can mark again if hired again)
- **Impact:** Increases "Active Households" signal for vendor (Residential scoring)
- **Validation:** 
  - Prevents self-marking (resident phone ≠ vendor phone already checked)
  - Prevents employer false claims (velocity check)

### Activity 3e: Flag Spam / Fraud / False Claim
- **When:** Resident sees suspicious activity
- **What:** Select reason:
  - Spam (not a real vendor)
  - Self-review (resident reviewing their own vendor)
  - False claim (vendor doesn't exist, phone wrong)
  - Abusive behavior (reported incident)
  - Pricing fraud (charges way more than stated)
  - Safety concern (unsafe person, theft, abuse)
- **Points:** 1 point (risk-taking, helps community safety)
- **Frequency:** Unlimited
- **Impact:** Flags vendor for admin review, triggers anomaly detection
- **Validation:**
  - Velocity check (5+ flags from same resident in 24h = suspicious)
  - Reporter credibility matters (0.2x reporter = low weight, 1.5x reporter = high weight)
  - Retaliatory flagging detection (competitor flagging to sabotage)

---

## STAGE 4: SUSTAINED CONTRIBUTION (Becomes "Community Champion" or "Society Guardian")

### Activity 4a: Add Vendor (Repeat)
- **When:** Find a new vendor, share with community
- **What:** Same as first add, but now at 1.2x-1.5x credibility
- **Points:** 1 point (each new vendor)
- **Frequency:** Repeatable, unlimited
- **Cumulative:** 3-5 adds in 60 days → moving toward Champion

### Activity 4b: Rate Vendor (Additional Vendors)
- **When:** Hire more vendors, rate them
- **What:** Same 8D rating process
- **Points:** 1 point per vendor rated
- **Frequency:** Repeatable
- **Cumulative:** 3-5 ratings in 60 days → Champion progress

### Activity 4c: Write Reviews (Additional Vendors)
- **When:** After hiring multiple vendors
- **What:** Detailed feedback per vendor
- **Points:** 1 point per review
- **Frequency:** Repeatable
- **Cumulative:** 3-5 reviews in 60 days → Champion progress

### Activity 4d: Mark Employed (Repeat Hires)
- **When:** Hire same vendor again, confirm
- **What:** Mark employed checkbox again
- **Points:** 1 point per reconfirmation (but capped at once per year per vendor)
- **Frequency:** Once per vendor per year max
- **Impact:** Signals "Active Household" to vendor (recurring business)

### Activity 4e: Flag / Report (Ongoing)
- **When:** Continue to protect community
- **What:** Same fraud/spam flags
- **Points:** 1 point per flag
- **Frequency:** Repeatable
- **Cumulative:** Multiple flags establish "Community Guardian" credibility

---

## STAGE 5: MATURE CONTRIBUTOR (Future, Not MVP)

### Activity 5a: Answer Resident Questions (FUTURE)
- **When:** Another resident asks about vendor in comments
- **What:** Provide helpful response
- **Points:** 2 points (helpful, substantive)
- **Frequency:** Repeatable
- **Validation:** Upvote/downvote by community (quality check)

### Activity 5b: Suggest Improvements (FUTURE)
- **When:** Propose new vendors, tag categories, improvements
- **What:** Submit suggestion for society library or category expansion
- **Points:** 2 points if adopted
- **Frequency:** Repeatable
- **Validation:** Admin reviews, implements if useful

### Activity 5c: Volunteer Moderation (FUTURE)
- **When:** Trusted Guardian volunteers to help manage flags
- **What:** Review flags, suggest actions to admin, help community
- **Points:** 3 points per flag resolved
- **Frequency:** Repeatable
- **Validation:** Admin approval, training required

---

## SUMMARY: ALL ACTIVITIES BY POINT VALUE

| Activity | Points | Repeatable | Cumulative in 60-day window |
|---|---|---|---|
| Onboarding | 0 | No | N/A |
| Browse directory | 0 | Yes | N/A (passive) |
| View vendor profile | 0 | Yes | N/A (passive) |
| Call/WhatsApp vendor | 0 | Yes | N/A (external) |
| **Add vendor** | **1** | **Yes** | **3-5 → Champion** |
| **Rate vendor** | **1** | **Yes (once per vendor)** | **3-5 → Champion** |
| **Write review** | **1** | **Yes (once per vendor)** | **3-5 → Champion** |
| **Mark employed** | **1** | **Limited (1x/year per vendor)** | **1-2 typical** |
| **Flag fraud/spam** | **1** | **Yes** | **1-2 typical** |
| **[Future] Answer Q** | 2 | Yes | Not MVP |
| **[Future] Suggest improvement** | 2 | Yes | Not MVP |
| **[Future] Volunteer mod** | 3 | Yes | Not MVP |

---

## RESIDENT LEVEL PROGRESSION (60-day Rolling Window)

### Example Resident: Priya (Homemaker, Tower 5)

**Week 1:**
- Completes onboarding
- Browses directory (0 points, passive)
- Finds cook "Anita", marks employed (1 point)
- **Total: 1 point → Level ⭐ Active Member (1.0x credibility)**

**Week 2-3:**
- Rates Anita 5⭐ (1 point)
- Writes review: "Great sabzi, very reliable" (1 point)
- Finds electrician "Raj", adds to directory (1 point)
- **Total: 4 points → Still ⭐ Active Member**

**Week 4:**
- Hires Raj, marks employed (1 point)
- Finds new maid "Priya K", adds to directory (1 point)
- Finds plumber "Vikram", adds to directory (1 point)
- **Total: 7 points → Level 🏆 Community Champion (1.2x credibility)**

**Week 5-8:**
- Rates Raj, Priya K, Vikram (3 points)
- Writes reviews for all (3 points)
- Flags suspicious vendor (self-review spam) (1 point)
- **Total: 14 points → Still 🏆 Champion**

**Week 9-12:**
- Helps neighbor find cook (indirect, no points)
- Answers question about Anita in comments (FUTURE: 2 points)
- Proposes new "Pet Sitter" category (FUTURE: could earn 2 points if adopted)
- **Total: ~18 points → Still 🏆 Champion (or 👑 Guardian if unlocked)**

**60-Day Expiration:**
- If no activities in next 30 days → drops from 🏆 to ⭐
- If only 1-2 activities in week 7-12 → drops to ⭐
- Rolling window = recent activity matters

---

## ACTIVITY POINT DECISION POINTS

**For Question 12, we need to decide:**

1. **Are all activities worth 1 point? Or different weights?**
   - Add vendor = 1 point
   - Rate vendor = 1 point
   - Write review = 1 point
   - Mark employed = 1 point
   - Flag fraud = 1 point? Or 2-3 points?

2. **Should "harder" activities (long review, flag fraud) be worth more?**
   - Add vendor (easy) = 1 point
   - Rate vendor (quick) = 1 point
   - Write review (detailed) = 2 points?
   - Mark employed (confirmation) = 1 point
   - Flag fraud (risk + effort) = 2-3 points?

3. **Or keep all at 1 point for simplicity?**
   - All activities = 1 point
   - Leveling based on QUANTITY not QUALITY
   - Simpler to explain, easier to implement

Which approach?
