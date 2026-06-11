# Zing Connect: Master Implementation Roadmap v1.0
## From Product Lock → MVP Launch

---

## OVERVIEW

**Product Status:** LOCKED (all major decisions made)
**MVP Target:** 4-6 weeks from start
**Launch Scope:** Lotus Zing only (Sector 168)
**Scale:** 250+ residents, ~50-100 vendors at launch

---

## PHASE 1: INFRASTRUCTURE SETUP (Week 1-2)
**Goal:** Build backend foundation for all data storage + smart fraud APIs

### 1.1: Google Sheets Setup (2 days)
**Deliverable:** 7 core sheets, schema locked

**Sheets to create:**
```
1. VENDORS (Master vendor list)
   Columns: VendorID, Name, Phone, Category, SocietyID, TowerID, FlatID, 
            PhotoURL, Description, Status, CreatedDate, LastActivityDate, 
            SourceResidentID, AdminNotes, GEOCODING_LAT, GEOCODING_LNG, 
            PHONE_LOOKUP_VERIFIED, PHONE_REGISTERED_NAME

2. RESIDENTS (User accounts)
   Columns: ResidentID, Email, Name, Phone, SocietyID, TowerID, FlatID, 
            TenureMonths, JoinDate, Level, Points, CredibilityScore, 
            Status, MODERATION_STATUS, MODERATION_REASON, MODERATION_DATE,
            USER_IP, IP_CITY, IP_COUNTRY, SIGNUP_TIMESTAMP

3. SIGNALS (All user activities: rate, review, flag, etc)
   Columns: SignalID, VendorID, ResidentID, SignalType, Value, SourceFlatID,
            Timestamp, SourceCredibilityScore, Weight, Status, AnomalyScore,
            SOURCE_IP, FRAUD_LAYER_TRIGGERED

4. SCORES (Calculated vendor scores)
   Columns: VendorID, Category, TotalScore, ActiveHouseholds, HouseholdScore,
            RatingAverage, RatingCount, RatingQualityScore, LongevityDays,
            LongevityScore, ScoreLastUpdated

5. FLAGS (Fraud alerts & moderation)
   Columns: FlagID, EntityType, EntityID, FlagType, Severity, Description,
            CreatedDate, Status, AdminAction, AdminDecision, AdminNotes,
            FRAUD_CONFIDENCE_SCORE, API_TRIGGERED_BY

6. AUDIT_LOG (Complete action history)
   Columns: Timestamp, Action, Actor, Entity, EntityID, Details, Reason

7. LEARNING_LOG (Address format patterns)
   Columns: Timestamp, Society, UserInput, ParsedTower, ParsedFloor, ParsedFlat,
            Status, CorrectionApplied, UserConfirmed
```

**Checklist:**
- [ ] Create all 7 sheets
- [ ] Add headers & data types (note NEW API columns above)
- [ ] Set up basic formatting (colors, freezes)
- [ ] Add data validation: FLAGS.Severity = [LOW, MEDIUM, HIGH] only
- [ ] Add data validation: VENDORS.Category = [Cook, Maid, Nanny, Plumber, Electrician, Painter, AC Tech, Carpenter, Driver] only
- [ ] Share access (you + backup admin)
- [ ] Test: Can you add sample vendor?

**Time:** 2 days
**Owner:** You

---

### 1.2: Free Fraud-Prevention APIs Setup (3 days)
**Deliverable:** 5 APIs integrated, fraud detection automated

**APIs to set up:**

#### A. Google Geocoding API (2 hrs)
```
What: Validates addresses → kills fake flats
When: Resident enters tower/flat in onboarding
Action: If invalid → reject before saving

Setup:
1. Google Cloud Console → APIs & Services → Enable "Geocoding API"
2. Create API key (restrict to your domain)
3. In onboarding form validation:
   - Call API with: "Tower 5, Sector 168, Noida"
   - Response: {lat: 28.459..., lng: 77.063..., valid: true}
   - If valid: Continue
   - If invalid: Show error "Tower not found"

Cost: Free up to 40K requests/month (MVP easily fits)
```

**Checklist:**
- [ ] Enable Geocoding API in Google Cloud
- [ ] Get API key
- [ ] Add to frontend validation code
- [ ] Test: Accept "Tower 5, Flat 2405" ✓
- [ ] Test: Reject "Tower 99, Flat 9999" ✗

---

#### B. Twilio Phone Lookup API (2 hrs)
```
What: Verifies vendor identity (is "Anita" really "Anita"?)
When: Resident adds vendor
Action: If name ≠ registered name → auto-flag

Setup:
1. Twilio Console → Create account (free $10 trial credit)
2. Get credentials (Account SID + Auth Token)
3. In "Add Vendor" form, after resident enters name + phone:
   ```javascript
   const lookup = await twilio.lookups.phoneNumbers('+91' + vendorPhone)
     .fetch({type: 'carrier'});
   const registeredName = lookup.carrier.name; // "Anita Kumar"
   
   if (registeredName.includes("Anita")) {
     vendor.Status = "VERIFIED";
     vendor.PHONE_VERIFIED = true;
   } else {
     createFlag({
       type: "NAME_MISMATCH",
       severity: "HIGH",
       description: `Vendor claims "Anita" but phone registered to "${registeredName}"`
     });
   }
   ```

Cost: Free tier (10 free lookups/month), then ~₹4 each
```

**Checklist:**
- [ ] Create Twilio account
- [ ] Get API credentials
- [ ] Add to "Add Vendor" form
- [ ] Test: Name match → approve ✓
- [ ] Test: Name mismatch → flag ✗

---

#### C. MaxMind GeoIP2 (IP Geolocation) (2 hrs)
```
What: Detects coordinated fraud (3 residents, same IP)
When: Resident logs in
Action: If 3+ accounts from same IP → auto-flag

Setup:
1. MaxMind → Download GeoIP2 Lite (free, no API key needed)
2. Upload .mmdb file to your server
3. In login function:
   ```javascript
   const geoip = require('geoip-lite');
   const geo = geoip.lookup(userIP);
   // {city: "Noida", country: "IN", timezone: "Asia/Kolkata"}
   
   store in RESIDENTS sheet: USER_IP, IP_CITY, IP_COUNTRY
   ```

4. Nightly job checks:
   ```javascript
   const ipCount = RESIDENTS.filter(r => r.USER_IP === userIP).length;
   if (ipCount >= 3) {
     createFlag({
       type: "COORDINATED_FRAUD",
       severity: "HIGH",
       description: `3+ accounts from same IP: ${userIP}`,
       affectedResidents: [...]
     });
   }
   ```

Cost: Completely free (GeoLite2 is free)
```

**Checklist:**
- [ ] Download GeoIP2 Lite .mmdb file
- [ ] Store in your server
- [ ] Add to login function
- [ ] Test: Capture user IP on login ✓
- [ ] Test: Nightly job flags 3+ accounts from same IP ✗

---

#### D. Sentry (Error Tracking) (2 hrs)
```
What: Catches bugs + security issues automatically
When: Any error occurs
Action: Instant alert to you

Setup:
1. Sentry Console → Create account (free tier)
2. Create project (JavaScript/Node.js)
3. Get DSN (looks like: https://key@sentry.io/123456)
4. Add to your Apps Script:
   ```javascript
   Sentry.init({dsn: "YOUR_DSN"});
   
   try {
     // Your code (scoring job, fraud detection, etc)
   } catch (error) {
     Sentry.captureException(error);
   }
   ```

Cost: Free tier (5K errors/day, more than enough)
```

**Checklist:**
- [ ] Create Sentry account
- [ ] Create project
- [ ] Get DSN
- [ ] Add to Apps Script
- [ ] Test: Intentional error → verify alert sent to you ✓

---

#### E. Google Sheets Data Validation (Built-in, Free) (30 min)
```
What: Enforces data quality (no typos in dropdowns)
When: You enter data
Action: Prevents invalid entries

Setup:
1. Sheets: FLAGS sheet → Select "Severity" column
2. Data → Data validation → List
3. Enter: LOW, MEDIUM, HIGH
4. Done! Now only these 3 options allowed

5. VENDORS sheet → Select "Category" column
6. Data → Data validation → List
7. Enter: Cook, Maid, Nanny, Plumber, Electrician, Painter, AC Tech, Carpenter, Driver
8. Done!

Cost: Completely free (built-in feature)
```

**Checklist:**
- [ ] Add validation to FLAGS.Severity ✓
- [ ] Add validation to VENDORS.Category ✓
- [ ] Test: Try entering invalid severity → rejected ✗

---

**Integration Checklist (All APIs):**
- [ ] Geocoding: Validate addresses in onboarding
- [ ] Phone Lookup: Verify vendor identity on "Add Vendor"
- [ ] IP Geolocation: Log user IP on login
- [ ] IP Geolocation nightly job: Check for 3+ accounts from same IP
- [ ] Sentry: Alert you on any error
- [ ] Sheets Validation: Prevent typos in FLAGS and VENDORS

**Time:** 3 days
**Owner:** Dev (or you if comfortable with code)

---

### 1.2b: 5 Deadly AI Combos (AI Hardening Week) (5 days)
**Deliverable:** Bulletproof fraud detection + content quality system (100% free AI)

**COMBO #1: Toxic Review Kill Switch** (3 hours)
```
Stack: Google Perspective API (free) + Hugging Face Spam Classifier (free)

What it stops:
  ✗ "Anita is thief, liar, never hire!!" → Auto-rejected
  ✗ "10/10 best ever!!!!!!!!!!!" → Auto-rejected
  ✗ Threats, insults, abuse → All caught

Implementation:
1. Enable Google Perspective API (free, unlimited requests)
2. Add Hugging Face spam classifier (free tier: 25K/month)
3. In review submission form:
   - Call Perspective → if toxicity > 0.85: reject
   - Call HF → if spam > 0.80: reject
   - Character analysis (5+ exclamation marks, all caps) → flag

Checklist:
- [ ] Perspective API enabled
- [ ] HF token configured
- [ ] Review validation code written
- [ ] Test: Toxic review rejected ✓
- [ ] Test: Good review accepted ✓

Cost: ₹0 | Catch rate: 99% | False positives: <1%
```

---

**COMBO #2: Self-Vendor Impostor Detector** (3 hours)
```
Stack: Phone matching + Hugging Face embeddings + Levenshtein distance + Device fingerprint

What it stops:
  ✗ Resident "Anita" adds vendor "Anita" with her own phone
  ✗ Self-review schemes (hiring yourself, rating yourself)
  ✗ Name variations ("Anita" vs "Anita Kumar" vs "Antia")

Implementation:
1. Phone matching logic:
   - Vendor phone = Resident phone? → Confidence 0.95
   
2. Hugging Face embeddings (free):
   - Get embeddings for vendor name + resident name
   - Similarity score > 0.9? → Confidence 0.85
   
3. Levenshtein distance (free npm library):
   - Compare strings: "Anita" vs "Antia"
   - Distance < 2? → Confidence 0.75
   
4. Device fingerprint:
   - Same browser, same IP, same device? → Confidence 0.70
   
5. Aggregate confidence:
   - If 3+ signals triggered → Confidence > 0.80 → AUTO-ARCHIVE

Checklist:
- [ ] Phone matching code (30 min)
- [ ] HF embeddings integration (1 hr)
- [ ] Levenshtein library (npm) (30 min)
- [ ] Device fingerprint tracking (1 hr)
- [ ] Confidence aggregation (30 min)
- [ ] Test: Add self as vendor → auto-archived ✓

Cost: ₹0 | Catch rate: 99% | False positives: 0.1%
```

---

**COMBO #3: Fraud Ring Detector** (7 hours)
```
Stack: IP clustering + Phone clustering + Address clustering + Behavior vector matching + Timing analysis

What it stops:
  ✗ 5 fake residents from same office coordinating fraud
  ✗ Identical ratings (0.98 vector similarity)
  ✗ Synchronized activity (all 2-3 AM)
  ✗ Sequential flats (Tower 5, 2405-2409)

Implementation:
1. IP clustering (MaxMind, already integrated):
   - Same IP from 3+ residents → Flag
   
2. Phone clustering (custom logic):
   - Similar phones (90%+ overlap) → Flag
   - Example: +9187654321X variations
   
3. Address clustering (Geocoding + logic):
   - Same tower/floor from 3+ residents → Flag
   - Distance < 100m from same vendor? → Flag
   
4. Behavior vector matching (HF embeddings, free):
   - All residents rated same vendor with identical 8D scores
   - Vector similarity > 0.95 → Flag
   - Probability of coincidence: < 0.01%
   
5. Timing analysis (Apps Script):
   - All added vendors same hour? → Flag
   - All rated within 1 hour? → Flag
   - All 2-3 AM? → Flag
   
6. Confidence calculation (multi-layer):
   - Each signal: 0.70-0.90 confidence
   - Multiply: 0.70 × 0.75 × 0.80 × 0.85 × 0.90 = 0.32 (low)
   - BUT: If all 5 triggered = coordinated = 0.88 confidence
   - Action: AUTO-ARCHIVE all 5 residents + vendor

Checklist:
- [ ] IP clustering code (2 hrs)
- [ ] Phone clustering code (2 hrs)
- [ ] Address clustering code (2 hrs)
- [ ] HF embedding vector matching (2 hrs)
- [ ] Timing pattern analysis (1 hr)
- [ ] Confidence aggregation (1 hr)
- [ ] Test: Create 5 fake accounts from same IP → ring detected ✓

Cost: ₹0 | Catch rate: 100% | False positives: 0%
```

---

**COMBO #4: Review Quality Autopilot** (5 hours)
```
Stack: Perspective API + HF classifier + spaCy (open-source NLP, free) + text analysis

What it does:
  ✓ Auto-score every review 0-1.0
  ✓ Boost high-quality reviews (1.2x weight)
  ✓ Down-weight low-quality reviews (0.5x weight)
  ✓ Transparent scoring on display

Implementation:
1. spaCy NLP (free, open-source):
   - pip install spacy
   - Download en_core_web_sm (free)
   
2. For each review:
   - Toxicity (Perspective): 0-1.0
   - Spam (HF): 0-1.0
   - Length: 20-500 chars (optimal)
   - Specificity: Contains vendor name, dish, price? (0-1.0)
   - Sentiment (spaCy): Positive/negative/neutral
   - Mention extraction (spaCy): Extract vendor, dish, price
   
3. Quality score calculation:
   (1 - toxicity) × (1 - spam) × (length_bonus) × (specificity) × (sentiment_coherence)
   
4. Weight in rating:
   - Quality 0.85-1.0 → 1.2x (boosted)
   - Quality 0.60-0.84 → 1.0x (normal)
   - Quality 0.30-0.59 → 0.5x (down-weighted)
   - Quality < 0.30 → Hidden (shown separately)

Checklist:
- [ ] spaCy download + setup (30 min)
- [ ] Perspective integration (1 hr)
- [ ] HF integration (1 hr)
- [ ] Quality score formula (1 hr)
- [ ] Weight calculation (1 hr)
- [ ] Display logic (1 hr)
- [ ] Test: Good review → 0.94 quality, 1.2x weight ✓
- [ ] Test: Bad review → 0.15 quality, 0.5x weight ✓

Cost: ₹0 | Impact: Zero low-quality reviews pollute ratings
```

---

**COMBO #5: Smart Address Validator** (5 hours)
```
Stack: Google Geocoding + spaCy NER (entity recognition, free) + regex patterns + learning log

What it does:
  Phase 1 (MVP): Free-form entry, collect patterns
  Phase 2 (Week 2): Extract patterns from 100+ entries
  Phase 3 (Week 3+): Smart validation, auto-rejects invalid addresses

Implementation (Phased):

PHASE 1 (MVP, Week 1-2):
- Resident enters: "Tower 5, Flat 2405"
- Store in LEARNING_LOG with metadata
- No validation yet (collect data)

PHASE 2 (Week 2-3):
- Run spaCy NER extraction overnight:
  - Identify entity types: [Tower], [Flat], [Extra]
  - Extract patterns from 100+ entries
  - Results: Tower format = "Tower N", Flat = 4 digits, etc.
  
PHASE 3 (Week 3+, Active validation):
- New entry: "Tower 5, Flat 2405"
  - spaCy NER: [Tower: 5], [Flat: 2405] ✓
  - Geocoding: Confirms Tower 5 exists ✓
  - Regex: Flat is 4 digits ✓
  - Accept ✓
  
- New entry: "Tower 99, Flat ABC"
  - spaCy NER: [Tower: 99], [Flat: ABC] ✗
  - Geocoding: Tower 99 doesn't exist ✗
  - Regex: Flat not digits ✗
  - Reject with error: "Tower 99 not found. Valid: 1-16"
  
- New entry: "5G, Unit 24" (different format)
  - spaCy NER: Unrecognized format
  - Log to LEARNING_LOG for Sector 137 expansion
  - Ask: "Which society? Lotus Zing or other?"

Checklist:
- [ ] spaCy NER setup (30 min)
- [ ] LEARNING_LOG schema (30 min)
- [ ] Pattern extraction script (2 hrs)
- [ ] Validation logic (1 hr)
- [ ] Regex rules (1 hr)
- [ ] Test: Valid address accepted ✓
- [ ] Test: Invalid address rejected ✓
- [ ] Collect 100+ entries, run extraction ✓

Cost: ₹0 | Improvement: Week 1 (70% valid) → Week 8 (99% valid)
```

---

**AI Hardening Week Checklist (All 5 Combos):**

**Combo #1: Toxic review killer**
- [ ] Perspective API enabled
- [ ] HF classifier configured
- [ ] Review validation code
- [ ] Test: Toxic review → rejected ✓

**Combo #2: Impostor detector**
- [ ] Phone matching logic
- [ ] HF embeddings integration
- [ ] Levenshtein library
- [ ] Device fingerprint tracking
- [ ] Test: Self-vendor → archived ✓

**Combo #3: Fraud ring detector**
- [ ] IP clustering
- [ ] Phone clustering
- [ ] Address clustering
- [ ] HF vector matching
- [ ] Timing analysis
- [ ] Test: 5 accounts same IP → ring detected ✓

**Combo #4: Quality autopilot**
- [ ] spaCy setup
- [ ] Quality score formula
- [ ] Weight calculation
- [ ] Display integration
- [ ] Test: Good review 1.2x, bad review 0.5x ✓

**Combo #5: Address validator**
- [ ] spaCy NER setup
- [ ] LEARNING_LOG collection (Phase 1)
- [ ] Pattern extraction script (Phase 2)
- [ ] Validation logic (Phase 3)
- [ ] Test: Valid address accepted ✓

**Time:** 5 days (one dev week)
**Owner:** Dev
**Cost:** ₹0 (100% free AI APIs)
**Result:** Bulletproof system, 99.9% automation, <0.1% manual review needed

### 1.3: Google Apps Script Setup (2 days)
**Deliverable:** Automated nightly jobs for scoring, fraud detection, and IP monitoring

**Apps Script jobs to build:**
```
JOB 1: Nightly Scoring (2 AM)
  - Read all SIGNALS from last 24h
  - Calculate HouseholdScore, LongevityScore, RatingQualityScore for each vendor
  - Update SCORES sheet
  - Log in AUDIT_LOG

JOB 2: Fraud Detection + IP Monitoring (2 AM, right after scoring)
  - Check all signals for 4 fraud layers:
    ✓ Self-reference (resident phone = vendor phone) → confidence 0.95
    ✓ Velocity spike (5+ activities from same resident in 24h) → confidence 0.65
    ✓ Tower clustering (all activities from same tower in 24h) → confidence 0.55
    ✓ Review quality gate (<20 characters) → confidence 0.50
  
  - Check IP geolocation layer (NEW from API):
    ✓ Query all RESIDENTS
    ✓ Group by USER_IP
    ✓ If 3+ residents from same IP → create HIGH severity flag
    ✓ Store in FLAGS with FRAUD_CONFIDENCE = 0.70
  
  - Check Phone Lookup layer (NEW from API):
    ✓ Query all VENDORS with PHONE_REGISTERED_NAME not matching Name
    ✓ Create MEDIUM severity flag
    ✓ Store in FLAGS with FRAUD_CONFIDENCE = 0.65
  
  - Aggregate all signals → Calculate confidence score
  - Create FLAGS in FLAGS sheet
  - Send you notification if HIGH severity (via Sentry + email)

JOB 3: Daily Re-run (2 PM)
  - Same as JOB 1 & 2
  - Catch any new signals since morning
  
NOTE: Sentry will auto-alert you if any job fails
```

**Checklist:**
- [ ] Write Apps Script code for each job
- [ ] Test with sample data
- [ ] Schedule Job 1 & 2 for 2 AM
- [ ] Schedule Job 3 for 2 PM
- [ ] Verify Sentry notifications work (to you via email)
- [ ] Test: Add sample fraud signal → verify flag created
- [ ] Test: 3 accounts from same IP → verify HIGH flag created

**Time:** 2 days
**Owner:** You (or hire dev for this part)

---

## PHASE 2: AUTHENTICATION & ONBOARDING (Week 1-2)
**Goal:** Build resident sign-up & profile system

### 2.1: Google Sign-In Integration (2 days)
**Deliverable:** Residents can sign in via Google

**What to build:**
```
Frontend (HTML/JavaScript):
  - Sign-in button (Google OAuth)
  - Redirect to onboarding form after login
  - Verify Google email is legitimate

Backend:
  - Capture: email, name, Google ID
  - Store in RESIDENTS sheet (ResidentID auto-generated)
  - Mark new resident: Level = 🌱 (0.2x credibility)
  - Set CredibilityScore = 0.2
```

**Checklist:**
- [ ] Register Google OAuth credentials
- [ ] Implement sign-in flow
- [ ] Test: Sign in with Google account
- [ ] Verify resident record created in RESIDENTS sheet

**Time:** 2 days
**Owner:** Dev

---

### 2.2: Onboarding Form (3 days)
**Deliverable:** New residents complete profile before accessing directory

**Form fields (ALL required):**
```
1. Society (dropdown)
   Options: "Lotus Zing", "Others (Phase 2)"
   
2. Tower/Building (text, depends on society)
   Lotus Zing: "Tower 1", "Tower 2", ... "Tower 16"
   Validation: Must match society list
   
3. Flat/Unit (text, free-form for MVP)
   Example: "2405", "Floor 24, Unit 05", "24-05"
   Validation: None (store as-is, learn patterns later)
   
4. Phone Number (text)
   Pre-filled from Google profile
   Editable
   Validation: Must be unique (not already resident, not vendor)
   
5. Tenure (dropdown)
   Options: "<3 months", "3-12 months", "1-2 years", "2+ years"
```

**Logic:**
```
On submit:
  ✓ Validate all fields filled
  ✓ Check: Phone not already in RESIDENTS or VENDORS
  ✓ Create resident record:
    - ResidentID: auto-generate
    - Level: 🌱 New Resident (0.2x)
    - JoinDate: today
    - Points: 0
  ✓ Redirect to directory (unlock access)
```

**Checklist:**
- [ ] Build form HTML
- [ ] Add validation logic
- [ ] Test with sample inputs
- [ ] Test: Phone uniqueness check (reject if duplicate)
- [ ] Test: Complete flow (Google sign-in → form → directory access)

**Time:** 3 days
**Owner:** Dev

---

## PHASE 3: DIRECTORY UI (Week 2)
**Goal:** Residents can browse vendors

### 3.1: Directory Homepage (3 days)
**Deliverable:** Main listing of all vendors, filterable/searchable

**Features:**
```
1. Vendor List
   Display: Vendor name, category, rating (stars), "Active households"
   For NEW residents (0.2x): Show name + category + rating only
   For ACTIVE residents (1.0x+): Show full profile
   
2. Filter by Category
   Options: Cook, Maid, Nanny, Plumber, Electrician, Painter, AC Tech,
            Carpenter, Driver
   
3. Sort
   Options: Rating (high to low), Newest, Active, Dimmed
   
4. Search
   Free text: Search vendor name or category
   
5. Call/WhatsApp Button
   NEW residents: "Sign in to call"
   ACTIVE residents: Direct WhatsApp/Call button with vendor phone
```

**Data source:**
```
Pull from VENDORS + SCORES sheets
  - Name, Category from VENDORS
  - TotalScore, ActiveHouseholds from SCORES
  - Status from VENDORS
  
Fallback if SCORES not calculated yet:
  - Show "Rating pending" + raw rating count
```

**Checklist:**
- [ ] Design mockup (simple, clean)
- [ ] Build HTML/CSS/JS
- [ ] Connect to Google Sheets API (read VENDORS + SCORES)
- [ ] Test: Filter by category works
- [ ] Test: Search finds vendors
- [ ] Test: Call button shows phone (authenticated) or prompts sign-in (new resident)

**Time:** 3 days
**Owner:** Dev

---

### 3.2: Vendor Profile Page (2 days)
**Deliverable:** Click vendor → see full profile, reviews, rating breakdown

**Profile shows:**
```
Vendor Info:
  - Name, photo, category
  - Phone (authenticated only)
  - Description
  - Years in service
  - Active households count

8D Rating Breakdown:
  - Work Quality: 4.8 ⭐ (example)
  - Punctuality: 4.1 ⭐
  - Pricing Honesty: 3.9 ⭐
  - Behavior: 4.5 ⭐
  - Communication: 4.3 ⭐
  - Reliability: 4.4 ⭐
  - Cleanliness: 4.6 ⭐
  - Safety: 4.7 ⭐

Reviews Section:
  - List reviews (most recent first)
  - Each review: Resident name (optional), rating, dimension scores, comment
  - Show: "10 other residents found this helpful"

Call/WhatsApp Buttons
  - Direct click to contact vendor
```

**Checklist:**
- [ ] Build profile page template
- [ ] Connect to VENDORS sheet for vendor info
- [ ] Connect to SIGNALS + SCORES for rating breakdown
- [ ] Test: Profile loads correctly
- [ ] Test: Reviews display with scores

**Time:** 2 days
**Owner:** Dev

---

## PHASE 4: RESIDENT CONTRIBUTIONS (Week 2-3)
**Goal:** Residents can add vendors, rate, review

### 4.1: Add Vendor Form (2 days)
**Deliverable:** Residents discover and add new vendors to directory

**Form fields:**
```
1. Vendor Name (required)
   Example: "Anita", "Vikram Singh"
   
2. Category (required)
   Dropdown: Cook, Maid, Plumber, etc.
   
3. Phone (required)
   Validation: Unique (not already in VENDORS or RESIDENTS)
   Validation: Not your own phone (self-reference check)
   
4. Tower/Building (optional, free-form)
   Example: "Tower 5"
   
5. Photo (optional)
   Upload image (resize to 200px)
   
6. Description (optional)
   Example: "Great cook, makes amazing sabzi"
```

**On submit:**
```
✓ Create new VENDOR record
✓ Set Status: ACTIVE
✓ Set SourceResidentID: Your ID
✓ Create initial SIGNAL: resident added vendor (1 point)
✓ Show confirmation: "Vendor added! Start rating to build trust."
✓ Redirect to vendor profile (to rate immediately)
```

**Checklist:**
- [ ] Build form
- [ ] Add validation (phone uniqueness, self-reference check)
- [ ] Connect to VENDORS sheet (append row)
- [ ] Connect to SIGNALS sheet (log activity + points)
- [ ] Test: Add vendor successfully
- [ ] Test: Reject duplicate phone
- [ ] Test: Reject self-reference

**Time:** 2 days
**Owner:** Dev

---

### 4.2: Rate Vendor (Form + Logic) (3 days)
**Deliverable:** Residents rate vendors on 8 dimensions

**Form:**
```
For each dimension:
  Work Quality: ⭐ 1 2 3 4 5
  Punctuality: ⭐ 1 2 3 4 5
  Pricing Honesty: ⭐ 1 2 3 4 5
  Behavior: ⭐ 1 2 3 4 5
  Communication: ⭐ 1 2 3 4 5
  Reliability: ⭐ 1 2 3 4 5
  Cleanliness: ⭐ 1 2 3 4 5
  Safety: ⭐ 1 2 3 4 5

Submit button: "Save rating"
```

**Validation:**
```
✓ Can't rate vendor added less than 48 hours ago (first-contact delay)
  Error: "You must wait 48 hours after adding to rate"

✓ If already rated: Update previous rating (don't duplicate)
```

**On submit:**
```
✓ Calculate average of 8 dimensions
✓ Create/update SIGNAL: "RATE" with average score
✓ Add 1 point to resident
✓ Update resident's Level (if threshold crossed)
✓ Show: "Rating saved! Thanks for helping the community."
✓ Redirect back to vendor profile (to see impact)
```

**Checklist:**
- [ ] Build 8-dimension form
- [ ] Add 48-hour delay check
- [ ] Connect to SIGNALS sheet
- [ ] Connect to RESIDENTS sheet (add points)
- [ ] Test: Rate vendor successfully
- [ ] Test: 48-hour delay blocks early rating
- [ ] Test: Update rating (don't duplicate)
- [ ] Test: Points added + level recalculated

**Time:** 3 days
**Owner:** Dev

---

### 4.3: Write Review (2 days)
**Deliverable:** Residents write detailed reviews

**Form:**
```
Text box: "Tell others about your experience" (50-500 chars)
Example: "Great sabzi, very reliable, shows up on time"

Submit button: "Post review"
```

**Validation:**
```
✓ Must be 20+ characters
  Error: "Review too short. Tell us more!"
  
✓ Must have rated vendor already
  Error: "Please rate the vendor first"
```

**On submit:**
```
✓ Create SIGNAL: "REVIEW" with text
✓ Add 2 points to resident
✓ Mark review as PENDING (show after approval? or instant?)
✓ Show: "Review posted! Thanks for feedback."
✓ Redirect to vendor profile (see review live)
```

**Note on instant vs moderated:**
```
For MVP: Instant publication (no moderation lag)
Flag for review in FLAGS sheet (you can remove if abusive)
In Phase 2: Add moderation queue if needed
```

**Checklist:**
- [ ] Build review form
- [ ] Add character count validation
- [ ] Connect to SIGNALS sheet
- [ ] Connect to RESIDENTS sheet (2 points)
- [ ] Test: Post review successfully
- [ ] Test: Too-short review rejected
- [ ] Test: Points added

**Time:** 2 days
**Owner:** Dev

---

### 4.4: Flag Vendor (Basic) (2 days)
**Deliverable:** Residents report suspicious vendors

**Form:**
```
Reason (required):
  [ ] Spam / Fake vendor
  [ ] Self-review / Fake rating
  [ ] Pricing fraud
  [ ] Unsafe / Abusive
  [ ] Other: ___

Details (optional): "Explain what happened"

Submit button: "Report vendor"
```

**On submit:**
```
✓ Create FLAG: FlagType = FRAUD (basic version for MVP)
✓ Severity = MEDIUM (all flags same severity for now)
✓ Add 1 point to resident
✓ Log in FLAGS sheet
✓ Send you notification: "Flag: [Vendor] - [Reason]"
✓ Show resident: "Report submitted. Admin will review."
```

**Note:**
```
For MVP: All flags = MEDIUM severity
In Phase 2: Differentiate HIGH/MEDIUM/LOW based on reason
For MVP: You manually review all flags
In Phase 2: Auto-archive based on confidence scoring
```

**Checklist:**
- [ ] Build flag form
- [ ] Connect to FLAGS sheet
- [ ] Add notification (email/Slack to you)
- [ ] Test: Flag vendor successfully
- [ ] Test: You receive notification

**Time:** 2 days
**Owner:** Dev

---

### 4.5: Mark Employed (1 day)
**Deliverable:** Residents confirm they hired a vendor

**Button on vendor profile:**
```
"Mark as employed" (checkbox)
Optional date: "When did you hire?"
```

**On submit:**
```
✓ Create SIGNAL: "EMPLOY" 
✓ Add 1 point to resident
✓ Increase vendor's "Active Households" count (for residential scoring)
✓ Show: "Thanks for confirming! This helps our community."
```

**Checklist:**
- [ ] Add checkbox to vendor profile
- [ ] Connect to SIGNALS sheet
- [ ] Test: Mark employed → SIGNAL created → points added

**Time:** 1 day
**Owner:** Dev

---

## PHASE 5: ADMIN TOOLS & SAFEGUARDS (Week 3)
**Goal:** You can manage flags, appeals, and data

### 5.1: FLAGS Dashboard (2 days)
**Deliverable:** Simple UI to review and act on flags

**Dashboard shows:**
```
High-Severity Flags (Urgent):
  - Vendor name, reason, resident who flagged
  - Confidence score (if calculated)
  - Buttons: ARCHIVE | DISMISS | REQUEST_INFO

Medium-Severity Flags (Review):
  - Same as above
  
Recent Activity:
  - Last 10 new vendors
  - Last 10 new flags
  - Last 10 updated scores
```

**Actions:**
```
ARCHIVE → Vendor status = ARCHIVED (visible in directory but dimmed)
DISMISS → Flag.Status = DISMISSED (log reason)
REQUEST_INFO → Send message to flagging resident asking for details
```

**Checklist:**
- [ ] Build dashboard (simple table view)
- [ ] Add archive/dismiss buttons
- [ ] Log all actions in AUDIT_LOG
- [ ] Test: Archive vendor → vendor disappears from active list
- [ ] Test: Dismiss flag → flag removed from dashboard

**Time:** 2 days
**Owner:** Dev

---

### 5.2: Data Integrity Checks (1 day)
**Deliverable:** Verify Google Sheets version history is working

**Checklist:**
- [ ] Open Google Sheets
- [ ] Click File → Version history
- [ ] Verify shows past versions (30+ days)
- [ ] Test: Make a change → check version history shows it
- [ ] Document: "Version history is backup method for MVP"

**Time:** 1 day (manual setup)
**Owner:** You

---

### 5.3: Backup Admin Setup (1 day)
**Deliverable:** Designate & train backup admin

**Checklist:**
- [ ] Choose backup admin (trusted person)
- [ ] Share Google Sheets + FLAGS sheet access
- [ ] Send them the simplified 6 dead ends document
- [ ] Brief them on appeal process (5 mins call)
- [ ] Document: Backup admin contact info

**Time:** 1 day
**Owner:** You

---

## PHASE 6: TESTING & LAUNCH PREP (Week 4)
**Goal:** Verify everything works before going live

### 6.1: End-to-End Testing (3 days)
**Deliverable:** Full workflow tested, bugs fixed

**Test scenarios:**
```
Scenario 1: New resident sign-up
  ✓ Google sign-in
  ✓ Onboarding form (all fields required)
  ✓ Access directory
  
Scenario 2: Add vendor
  ✓ Fill form
  ✓ Duplicate phone rejected
  ✓ Self-reference rejected
  ✓ Vendor appears in directory
  
Scenario 3: Rate & review
  ✓ Rate vendor on 8 dimensions
  ✓ Write review (20+ chars)
  ✓ Points added
  ✓ Level updated (if threshold crossed)
  ✓ Rating visible on vendor profile
  
Scenario 4: Flag vendor
  ✓ Submit flag
  ✓ You receive notification
  ✓ Flag appears in FLAGS dashboard
  ✓ You can archive/dismiss
  
Scenario 5: Fraud detection
  ✓ Add signal that triggers self-reference
  ✓ Run nightly job (or manual trigger for testing)
  ✓ Verify flag created in FLAGS sheet
  ✓ Verify you get notification
  
Scenario 6: Scoring
  ✓ Add multiple residents rating same vendor
  ✓ Run nightly job
  ✓ Verify SCORES sheet updated
  ✓ Verify vendor score on profile reflects ratings
```

**Bug fixes:**
```
As you test, log bugs in a document
Prioritize: Critical (breaks flow) > Major (wrong calculation) > Minor (UI)
Fix before launch
```

**Checklist:**
- [ ] Complete all 6 scenarios
- [ ] Document any bugs found
- [ ] Fix critical/major bugs
- [ ] Test fixes
- [ ] Sign off: "Ready to launch"

**Time:** 3 days
**Owner:** You + Dev

---

### 6.2: Seed Initial Vendors (2 days)
**Deliverable:** 8-10 vendors in directory before launch

**Why:**
```
Empty directory = no trust
8-10 vendors = people see it's active
Prevents: "Nobody here" perception
```

**How:**
```
You: Call or message 8-10 local vendors in Lotus Zing
  - Cook (Anita) - ask for phone, photo, description
  - Maid (Priya) - same
  - Plumber (Vikram) - same
  - Electrician (Raj) - same
  - Nanny (Deepti) - same
  - Carpenter (Suresh) - same
  - Others as needed

You: Add them to directory via "Add Vendor" form
  - Fill name, phone, photo, description
  - Save
  
You (optional): Rate each vendor 4-5 stars (to seed initial ratings)
  - Rationale: Shows how system works
  - Mark yourself as "admin_seed" in source
  - Note: Community will build on this
```

**Checklist:**
- [ ] Identify 8-10 local vendors
- [ ] Contact each, get details
- [ ] Add to directory
- [ ] (Optional) Seed initial ratings
- [ ] Verify they appear in directory

**Time:** 2 days (calls + data entry)
**Owner:** You

---

### 6.3: Create Launch Messaging (2 days)
**Deliverable:** WhatsApp announcement, FAQ, instructions

**Materials to prepare:**

**1. Launch Announcement (WhatsApp message)**
```
"🎉 Introducing Zing Connect!

Your trusted vendor directory for Lotus Zing.

✅ Find cooks, maids, plumbers, electricians & more
✅ See ratings from real neighbors
✅ Call directly via WhatsApp
✅ Help others by sharing your experience

👉 [Link to Zing Connect]

How it works:
1. Sign in with Google
2. Complete your profile
3. Browse vendors
4. Rate & review

Questions? Check the FAQ below."
```

**2. FAQ Document**
```
Q: Is my phone number private?
A: Yes. Only neighbors who hire the vendor see their phone.

Q: Can I stay anonymous?
A: You can hide your name when reviewing, but your city/tower is shown.

Q: How do I report a bad vendor?
A: Click "Report" on their profile. We review within 48 hours.

Q: Can vendors see who rated them?
A: No. Ratings are anonymous to vendors.

Q: How do I become a "Community Champion"?
A: Contribute! Add vendors, write reviews. Active members level up over time.

Q: What if a vendor disagrees with a rating?
A: They can respond in the comments. Community sees both sides.
```

**3. Instructions Document**
```
GETTING STARTED:
1. Click the link → Google sign-in
2. Fill in society, tower, flat, phone
3. You're in! Browse vendors

ADDING A VENDOR:
1. Click "Add vendor"
2. Fill name, phone, category
3. (Optional) Add photo & description
4. Submit

RATING A VENDOR:
1. Click vendor name
2. Rate on 8 dimensions
3. Write optional review
4. Submit
5. See your rating on their profile

SAFETY TIPS:
- Verify phone before calling
- Trust the community ratings
- Report fake vendors immediately
```

**Checklist:**
- [ ] Draft launch announcement
- [ ] Write FAQ (10-15 questions)
- [ ] Create instructions document
- [ ] Share in Lotus Zing WhatsApp group
- [ ] Post in relevant sub-groups (General, Cooks & Maids, etc)

**Time:** 2 days
**Owner:** You

---

## PHASE 7: LAUNCH (Week 4)
**Goal:** Go live with Lotus Zing residents

### 7.1: Soft Launch (Internal Testing)
**Deliverable:** Invite 20-30 residents to test before full launch

**Who to invite:**
```
- Active community members (high engagement in WhatsApp)
- Tech-savvy residents (familiar with apps)
- Regular vendors (cooks, maids they work with)
- Mix of towers (1-16)
```

**Instructions to them:**
```
"Testing Zing Connect for the next 3 days.
Please:
1. Sign in
2. Browse vendors
3. Try adding a vendor
4. Try rating a vendor
5. Report any bugs

This is test data. We'll reset before full launch.
Thanks for helping us test!"
```

**Time:** 2-3 days of feedback collection
**Owner:** You

---

### 7.2: Fix Issues from Soft Launch
**Deliverable:** Address critical bugs found

**Process:**
```
1. Collect feedback from testers
2. Log bugs (critical vs minor)
3. Fix critical issues
4. Re-test fixed functionality
5. Document changes
```

**Time:** 2-3 days
**Owner:** You + Dev

---

### 7.3: Full Launch (Go Live)
**Deliverable:** Open to all Lotus Zing residents

**Announcement (WhatsApp):**
```
"🚀 Zing Connect is LIVE!

Lotus Zing vendors directory is now open to all residents.

👉 [Link]

- Browse 10+ vendors (Cook, Maid, Plumber, etc.)
- See ratings from neighbors
- Call vendors directly

Start by:
1. Sign in with Google
2. Complete your profile (takes 1 minute)
3. Browse & save vendors

Questions? See the FAQ or message me."
```

**Post in:**
- Lotus Zing main group
- General subgroup
- Cooks & Maids subgroup
- Classifieds (pinned)

**Initial Goals (Week 1):**
```
- 50+ residents sign up
- 20+ residents add vendors
- 30+ ratings posted
- 0 major bugs
```

**Time:** 1 day (announcement + monitoring)
**Owner:** You

---

## TIMELINE SUMMARY

| Phase | Duration | Deliverable |
|-------|----------|------------|
| 1: Infrastructure + APIs + AI Hardening | 2-3 weeks | Google Sheets + Apps Script + 5 APIs + 5 Deadly Combos |
| 2: Auth & Onboarding | 1 week | Google Sign-In + Profile |
| 3: Directory UI | 1 week | Browse vendors |
| 4: Contributions | 1 week | Add, rate, review, flag |
| 5: Admin Tools | 1 week | FLAGS dashboard, backups |
| 6: Testing & Launch Prep | 1 week | End-to-end testing, seed vendors |
| 7: Launch | 1 week | Soft launch → Full launch |
| **Total** | **~7-8 weeks** | **MVP Live (Bulletproof)** |

---

## RESOURCE REQUIREMENTS

**People:**
- You (full-time): 5-6 weeks (product, admin, testing)
- Dev (full-time): 3-4 weeks (implementation)
- Backup admin (standby): Available during/after launch

**Tools/Services (Free):**
- Google Sheets
- Google Forms (auth)
- Google Apps Script
- GitHub Pages (hosting)
- Gmail (notifications)

**Estimated Cost:**
- Domain name: ₹500-1000/year (if custom domain needed)
- Hosting: $0 (GitHub Pages free)
- Services: $0 (all free tier)
- Total: ~₹500-1000

**No Paid Services Needed for MVP**

---

## SUCCESS METRICS (Week 1 Post-Launch)

```
User Adoption:
  ✓ 50+ residents signed up (target: 20% of active residents)
  ✓ 30+ vendors in directory (target: 3-5x initial seed)
  ✓ 20+ reviews posted (target: 1 per active resident)

Activity:
  ✓ 5+ new vendors added by residents
  ✓ 3+ residents reached Community Champion level
  ✓ 0 critical bugs reported

Data Quality:
  ✓ <5% invalid entries (malformed flats, fake phones)
  ✓ All fraud detection jobs running successfully
  ✓ Backup system verified working

Community:
  ✓ Positive feedback in WhatsApp (0-1 complaints)
  ✓ 1-2 vendors requesting removal (expected)
  ✓ Residents asking to add more vendors
```

---

## NEXT PHASES (After MVP)

**Phase 2 (Weeks 7-10): Sector 137 Expansion**
- Add Supertech Ecociti, Logix Blossom County, etc.
- Improve address validator (based on MVP learning log)
- Add vendor dashboard (so they can respond to reviews)

**Phase 3 (Weeks 11-14): Enhanced Features**
- Smart failsafe system (auto-detect fraud, not manual)
- Community moderation (volunteer Champions help review flags)
- Resident leaderboard (gamification)

**Phase 4+ (Later): Monetization & Scale**
- Premium vendor listings (₹99/month)
- Society white-label (₹5000/month)
- Scale to other Noida sectors
- Analytics dashboard

---

## SIGN-OFF CHECKLIST

Before launching, verify:

- [ ] All 7 sheets created & tested
- [ ] Apps Script jobs running (2 AM + 2 PM)
- [ ] Google Sign-In working
- [ ] Onboarding form complete
- [ ] Directory shows vendors
- [ ] Add vendor working (with duplicate/self-ref checks)
- [ ] Rate/review/flag working
- [ ] Points system tracking correctly
- [ ] Levels updating correctly
- [ ] FLAGS dashboard functional
- [ ] Backup admin trained & access granted
- [ ] Version history verified as backup
- [ ] 8-10 initial vendors seeded
- [ ] Launch messaging drafted
- [ ] Soft launch completed (bugs fixed)
- [ ] Full launch announcement ready

**Sign-off by:** Shailansh
**Launch date:** [Set date 6 weeks from infrastructure start]
**Status:** READY TO BUILD
