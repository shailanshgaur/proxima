# Zing Connect: Dead End Audit
## Potential System Breaks & Missing Fallbacks

---

## CRITICAL DEAD ENDS (High Risk)

### Dead End 1: Vendor Fraud Appeal
**Scenario:** Vendor is auto-archived (Confidence 0.95 - self-reference)
**Current state:** Archive is reversible (60 days)
**Dead end:** Vendor contacts you claiming it's false
- **Missing:** Formal appeal process / evidence submission mechanism
- **Question:** How does vendor submit appeal? Email? WhatsApp? Form?
- **Question:** What evidence overturns a 0.95 confidence flag?
- **Fallback:** None defined yet

---

### Dead End 2: Admin Unavailability
**Scenario:** System flags HIGH severity (Confidence 0.65+) vendor for review
**Current state:** You (admin) must review within 1 hour
**Dead end:** You're unreachable for 24 hours (sick, away, emergency)
- **Missing:** Backup admin role / escalation path
- **Question:** Does system auto-archive after X hours if unreviewed?
- **Question:** Who has authority if you're gone?
- **Fallback:** None defined yet

---

### Dead End 3: Serious Violation Permanent Lock (After 60 Days)
**Scenario:** Vendor archived for THEFT allegation
**Current state:** Reversible for 60 days, then PERMANENT
**Dead end:** After 60 days, resident comes forward: "It was a lie"
- **Missing:** Post-60-day appeal mechanism
- **Question:** Is permanent really permanent? Ever?
- **Question:** What level of evidence overturns permanent archive?
- **Fallback:** None defined yet

---

### Dead End 4: Resident Account Closure
**Scenario:** Resident self-reviews (caught in fraud detection)
**Current state:** Flag created, resident flagged
**Dead end:** What happens to resident's account?
- **Missing:** Do they lose directory access? Are they suspended?
- **Missing:** Can they appeal?
- **Missing:** Are they notified?
- **Fallback:** None defined yet

---

## MODERATE DEAD ENDS (Medium Risk)

### Dead End 5: Review Quality Gate Enforcement
**Scenario:** Resident writes review <20 characters ("good work!")
**Current state:** System flags as low quality, weights it down
**Dead end:** 
- **Missing:** Does system REJECT the review? Or just weights it?
- **Missing:** Does resident know WHY their review matters less?
- **Missing:** Can they re-write to improve weight?
- **Fallback:** Unclear

---

### Dead End 6: Household Gaming (Multiple Hires)
**Scenario:** One household marks same vendor employed 3 times in 60 days
**Current state:** Each mark = +1 Active Household signal
**Dead end:**
- **Missing:** Does "Active Household" count multiple times per vendor?
- **Missing:** Is it capped at 1 per vendor per year? Or unlimited?
- **Missing:** What prevents marking employed falsely?
- **Fallback:** None defined

---

### Dead End 7: Failsafe Rule Conflict
**Scenario:** Vendor has 90+ days, zero flags (Failsafe Rule #3 = protected)
**BUT:** Vendor self-references (Confidence 0.95 = auto-archive)
**Dead end:**
- **Missing:** Which rule takes priority?
- **Missing:** Does Rule #3 override high-confidence fraud?
- **Missing:** Or does self-reference override everything?
- **Fallback:** Undefined priority

---

### Dead End 8: Credibility Score Overflow
**Scenario:** Resident reaches 1.5x max credibility
**Current state:** Capped at 1.5x
**Dead end:**
- **Missing:** What happens at 1.5x? Can they grow further?
- **Missing:** Is 1.5x forever? Or does it decay?
- **Missing:** How do they maintain it?
- **Fallback:** None defined

---

### Dead End 9: New Resident Credibility Lock (7 Day Cap)
**Scenario:** New resident writes excellent, detailed review
**Current state:** System weights it at 0.2x (new resident penalty)
**Dead end:**
- **Missing:** Can they earn their way out of 0.2x penalty before 7 days?
- **Missing:** If they get 100 helpful reactions, does penalty drop early?
- **Missing:** Or is 7 days mandatory?
- **Fallback:** Penalty is fixed, no early exit

---

## LOWER RISK DEAD ENDS (Design Gaps)

### Dead End 10: Vendor with No Activity (180+ Days)
**Scenario:** On-call vendor hasn't worked in 180 days, gets dimmed
**Current state:** One new hire = goes back to ACTIVE
**Dead end:**
- **Missing:** How many dimmed vendors clutter the directory?
- **Missing:** Should we archive instead of dim after 180+ days?
- **Missing:** What's the user experience (seeing 200 dimmed vendors)?
- **Fallback:** None defined

---

### Dead End 11: False Allegation Retraction
**Scenario:** Resident flags vendor for THEFT, then admits false accusation
**Current state:** Flag exists, vendor archived
**Dead end:**
- **Missing:** Does resident's retraction automatically restore vendor?
- **Missing:** Or does admin need to manually review + approve?
- **Missing:** What's the timeline?
- **Fallback:** Unclear

---

### Dead End 12: Tower Clustering Complexity
**Scenario:** Multiple residents from same tower rate same vendor in 24 hours
**Current state:** Triggers Tower Clustering anomaly detection (Confidence 0.55)
**Dead end:**
- **Missing:** How high must Confidence be to flag?
- **Missing:** What if Tower 5 genuinely loves Anita cook and all rate her same day?
- **Missing:** False positive tolerance?
- **Fallback:** None defined

---

### Dead End 13: Data Backup & Recovery
**Scenario:** Google Sheets corrupts (accidental deletion, sync error)
**Current state:** No backup mentioned
**Dead end:**
- **Missing:** Do we backup Google Sheets daily?
- **Missing:** Where? Google Drive version history? External backup?
- **Missing:** RTO (Recovery Time Objective)?
- **Missing:** Who can restore?
- **Fallback:** None defined

---

### Dead End 14: Dispute Between Two Residents
**Scenario:** Resident A: "Cook Anita stole my jewelry" (flags fraud)
**Resident B: "I love Anita, she's been with me 2 years" (5-star review)
**Current state:** Both signals exist, contradiction
**Dead end:**
- **Missing:** How does system resolve conflicting signals?
- **Missing:** Does community voting decide? Or admin investigation?
- **Missing:** What weight does each get?
- **Fallback:** Unclear

---

### Dead End 15: Serious Violation Evidence Standard
**Scenario:** Resident flags vendor for ABUSE
**Current state:** Flag created, vendor archived
**Dead end:**
- **Missing:** What constitutes proof of abuse?
- **Missing:** Is FIR required? Police clearance?
- **Missing:** Is resident testimony enough?
- **Missing:** What if no police complaint exists (victim too scared)?
- **Fallback:** Evidence standard undefined

---

## DEAD END SUMMARY TABLE

| Dead End | Risk | Blocker? | Area |
|----------|------|----------|------|
| Vendor fraud appeal | CRITICAL | YES | Appeal process |
| Admin unavailability | CRITICAL | YES | Governance |
| Serious violation 60-day lock | CRITICAL | YES | Appeals |
| Resident account closure | CRITICAL | YES | Moderation |
| Review quality gate | MODERATE | NO | UX clarity |
| Household gaming | MODERATE | YES | Scoring |
| Failsafe rule conflict | MODERATE | YES | Priority |
| Credibility overflow | MODERATE | NO | Cap behavior |
| New resident lock | MODERATE | NO | Growth path |
| Vendor dimming clutter | LOW | NO | UX/Scale |
| False allegation retraction | LOW | YES | Process |
| Tower clustering conflicts | LOW | YES | Tolerance |
| Data backup | CRITICAL | YES | Ops |
| Dispute resolution | MODERATE | YES | Governance |
| Evidence standard | CRITICAL | YES | Moderation |

---

## WHICH TO FIX FIRST?

**CRITICAL (System won't work without):**
- Dead End 1: Vendor appeal process
- Dead End 2: Admin backup/escalation
- Dead End 3: Post-60-day appeals
- Dead End 4: Resident account policy
- Dead End 13: Data backup strategy
- Dead End 15: Evidence standards

**MODERATE (System limps without):**
- Dead End 6: Household gaming prevention
- Dead End 7: Failsafe rule priority
- Dead End 14: Dispute resolution

**LOWER (Nice to have):**
- Dead End 5: Review quality clarity
- Dead End 8: Credibility overflow behavior
- Dead End 9: New resident early exit
- Dead End 10: Vendor dimming strategy
- Dead End 11: Retraction workflow
- Dead End 12: Tower clustering tolerance
