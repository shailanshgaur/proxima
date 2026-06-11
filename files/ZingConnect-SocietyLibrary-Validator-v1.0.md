# Zing Connect: Sector 137 Society Library v1.0
## Complete Tower/Flat Numbering Formats & Auto-Correction Validator

---

## LOTUS ZING (CONFIRMED - PRIMARY MVP)
**Status:** Fully mapped, confirmed by user
**Location:** Sector 168, Noida
**Tower Format:** NUMBERED (Tower 1, Tower 2... Tower 15)
**Floors:** 28
**Total Units:** 2,454
**Flat Format:** XYZZ (Floor + Unit)
- Example: 2405 = Floor 24, Unit 05
- Valid flat range: 0101–2828

---

## SECTOR 137 SOCIETIES (Parallel Mapping)

### 1. SUPERTECH ECOCITI
**Status:** Partially mapped
**Towers:** 20-22 (conflicting sources)
**Floors:** 20 per tower
**Total Units:** ~1,619
**Tower Format:** Likely NUMBERED (Tower 1, 2, 3... Tower 20+)
**Flat Format:** ASSUMED Floor+Unit (like 1001, 1002, 2001, etc.)
- Needs confirmation: Exact tower naming convention
- Needs confirmation: Exact flat numbering pattern

**Data To Fetch:**
- [ ] Verify exact tower count (20 vs 22)
- [ ] Confirm tower names (numbered vs named)
- [ ] Confirm flat numbering (XYZZ pattern vs other)
- [ ] Any special flat types (penthouse, shops)

---

### 2. LOGIX BLOSSOM COUNTY
**Status:** CONFIRMED
**Towers:** 18-20 towers (sources vary)
**Floors:** 20 per tower
**Total Units:** 1,600-2,395 (conflicting sources)
**Tower Format:** Named (likely A, B, C, D, L, M, etc. or similar)
**Flat Format:** CONFIRMED Floor+Unit (XYZZ pattern)

**Confirmed Flat Numbers:**
```
Floor 1: 101, 102, 103, 105, 106, 108 (skip 104, 107)
Floor 2: 201, 202, 203, 205, 206, 208
Floor 3: 301, 302, 303, 305, 306, 308
Floor 4: 401, 402, 403, 405, 406, 408
...and so on
```

**Pattern Notes:**
- Flats 104, 107 are skipped (likely unlucky numbers or structural)
- Format: Floor number (1-20) + Unit number (01-08 with gaps)
- Example valid: 501, 502, 503, 505, 506, 508

**Data To Fetch:**
- [ ] Confirm exact tower names (A, B, C, L, M confirmed; need rest)
- [ ] Confirm if skip pattern (104, 107) applies to all towers
- [ ] Verify penthouse/shop flat numbers (if different format)

---

### 3. PARAMOUNT FLORAVILLE
**Status:** Not yet mapped
**Likely Details:** High-rise tower-based (standard Sector 137 pattern)
**Towers:** TBD
**Floors:** TBD
**Total Units:** TBD
**Tower Format:** TBD
**Flat Format:** TBD

**Data To Fetch:** All

---

### 4. PARAS TIEREA
**Status:** Not yet mapped
**Likely Details:** Tower-based residential
**Towers:** TBD
**Floors:** TBD
**Total Units:** TBD
**Tower Format:** TBD
**Flat Format:** TBD

**Data To Fetch:** All

---

### 5. PURVANCHAL ROYAL PARK
**Status:** Not yet mapped
**Likely Details:** Tower-based residential
**Towers:** TBD
**Floors:** TBD
**Total Units:** TBD
**Tower Format:** TBD
**Flat Format:** TBD

**Data To Fetch:** All

---

### 6. GULSHAN VIVANTE
**Status:** Not yet mapped
**Likely Details:** Tower-based residential
**Towers:** TBD
**Floors:** TBD
**Total Units:** TBD
**Tower Format:** TBD
**Flat Format:** TBD

**Data To Fetch:** All

---

## VALIDATOR SYSTEM: How to Handle User Input Errors

### Problem Statement
Residents onboarding will mess up flat inputs. Examples:
- "Tower 5" vs "Tower Five"
- "2405" vs "24-05" vs "24/05" vs "2405A"
- "Blossom County Tower A" vs just "A"
- Typos: "Towar 5" vs "Tower 5"
- Reversals: "0524" instead of "2405"

**Solution:** 3-Layer Validator System

---

## LAYER 1: PATTERN RECOGNITION

### Tower Recognition
```javascript
const towerPatterns = {
  "Lotus Zing": {
    format: "NUMBERED",
    pattern: /^Tower\s*(\d{1,2})$|^(\d{1,2})$/i,
    range: [1, 15],
    examples: ["Tower 5", "5", "tower 5", "TOWER 5"]
  },
  "Logix Blossom County": {
    format: "LETTERED",
    pattern: /^Tower\s*([A-Z])$|^([A-Z])$/i,
    range: ["A", "B", "C", "L", "M"], // Need to complete
    examples: ["Tower A", "A", "tower a"]
  },
  "Supertech Ecociti": {
    format: "NUMBERED",
    pattern: /^Tower\s*(\d{1,2})$|^(\d{1,2})$/i,
    range: [1, 22],
    examples: ["Tower 1", "1", "tower 1"]
  }
}
```

### Flat Recognition
```javascript
const flatPatterns = {
  "standard_xyzz": /^(\d{4})$/, // 2405
  "standard_with_separator": /^(\d{2})-(\d{2})$/, // 24-05
  "typo_reversed": /^(\d{4})$/, // Check if floor > 28/20
  "with_letters": /^(\d{4})[A-Z]?$/, // 2405A
  "with_spaces": /^(\d{2})\s*-?\s*(\d{2})$/, // 24 05
  "written_form": /^[Ff]loor\s+(\d{1,2})\s*,?\s*[Uu]nit\s+(\d{1,2})$/ // Floor 24, Unit 05
}
```

---

## LAYER 2: INTELLIGENT AUTO-CORRECTION

### Correction Rules (In Priority Order)

**Rule 1: Case Normalization**
```
Input: "tower 5" → Output: "Tower 5"
Input: "TOWER 5" → Output: "Tower 5"
```

**Rule 2: Format Standardization**
```
Input: "24-05" → Parsed as: Floor 24, Unit 05 → Check against society patterns
Input: "24 05" → Parsed as: Floor 24, Unit 05
Input: "Floor 24 Unit 05" → Parsed as: Floor 24, Unit 05 → Validate
```

**Rule 3: Typo Detection (Levenshtein Distance)**
```
Input: "Towar 5" 
Distance to "Tower 5" = 1 (one character swap)
→ Auto-correct to "Tower 5"

Input: "Blossum County"
Distance to "Blossom County" = 1 (one character mismatch)
→ Suggest correction
```

**Rule 4: Reversal Detection**
```
Input: "0524" (user typed flat backwards)
Check if:
- Valid floor (05) + valid unit (24)? 
- Valid floor (24) + valid unit (05)? ← YES
→ Suggest: "Did you mean 2405?"

Rule: If reversed version is valid and current isn't, flag for confirmation
```

**Rule 5: Range Validation**
```
Lotus Zing (28 floors, ~2 units per floor):
Input: "2905" → Floor 29 exceeds max 28 → Reject
Input: "2805" → Valid (Floor 28, Unit 05)

Logix Blossom (20 floors, 8 units with gaps):
Input: "2104" → Floor 21 exceeds max 20 → Reject
Input: "104" → Valid (Floor 1, Unit 04)
Input: "107" → Invalid (skipped unit) → Suggest 105 or 106 or 108
```

**Rule 6: Flat Skip Pattern (Logix Blossom)**
```
Logix has locked pattern: Skip units 104, 107 in every floor
Input: "2007" 
→ System detects: Floor 20, Unit 07 (SKIPPED)
→ Suggest: "Floor 20, Unit 08 (next valid)" or "Floor 20, Unit 06 (previous valid)"
```

**Rule 7: Phonetic Similarity (Tower Names)**
```
Input: "Tower Ay" (user typed verbally)
→ Phonetically similar to "Tower A"
→ Suggest: "Did you mean Tower A?"

Input: "Blossum" (common misspelling)
→ Matches "Blossom"
→ Auto-correct
```

---

## LAYER 3: CONFIRMATION & FALLBACK

### If Auto-Correction Succeeds
```
Input: "24-05"
Parsed: Floor 24, Unit 05 (Lotus Zing)
Status: VALID ✅
→ Accept and proceed to next field
```

### If Auto-Correction Finds ONE Option
```
Input: "0524" (reversed)
Detected: "Did you mean 2405?"
Options: 1 (only one valid reversal)
→ Ask: "I found your flat: 2405. Is this correct? [Yes/No]"
→ If Yes: Accept
→ If No: Show manual entry form
```

### If Auto-Correction Finds MULTIPLE Options
```
Input: "107" (Logix Blossom)
Detected: "Unit 07 is skipped. Did you mean:"
Options: 
  - Floor 1, Unit 06? 
  - Floor 1, Unit 08?
→ Ask user to pick one
```

### If Auto-Correction Fails
```
Input: "2912" (Floor 29, Unit 12 - invalid)
Status: Cannot correct
→ Show error: "Invalid flat number. Lotus Zing has 28 floors max. Please try again."
→ Provide hint: "Format: Floor (01-28) + Unit (01-02). Example: 2405"
→ Allow manual re-entry
```

---

## IMPLEMENTATION: Data Structure

### Society Library (JSON)
```json
{
  "societies": {
    "lotus_zing": {
      "name": "Lotus Zing",
      "sector": 168,
      "towers": {
        "format": "NUMBERED",
        "count": 15,
        "naming": "Tower {number}",
        "examples": ["Tower 1", "Tower 15"]
      },
      "floors": {
        "min": 1,
        "max": 28
      },
      "units_per_floor": 2,
      "unit_numbers": [1, 2],
      "skip_patterns": [], // No skipped units
      "flat_format": "XYZZ", // XXYY
      "flat_examples": ["0101", "0102", "2801", "2802"],
      "validation_rules": ["range_check", "format_xyzz"]
    },
    "logix_blossom_county": {
      "name": "Logix Blossom County",
      "sector": 137,
      "towers": {
        "format": "LETTERED",
        "count": 18,
        "naming": "Tower {letter}",
        "examples": ["Tower A", "Tower M", "Tower L"]
      },
      "floors": {
        "min": 1,
        "max": 20
      },
      "units_per_floor": 6, // With skips: 01, 02, 03, 05, 06, 08
      "unit_numbers": [1, 2, 3, 5, 6, 8],
      "skip_patterns": [4, 7], // Units 04 and 07 skipped in every floor
      "flat_format": "XYZZ",
      "flat_examples": ["0101", "0102", "0103", "0105", "0106", "0108"],
      "validation_rules": ["range_check", "format_xyzz", "skip_pattern_check"]
    }
  }
}
```

### Validator Algorithm (Pseudocode)
```javascript
function validateFlat(input, societyId) {
  const society = societies[societyId];
  
  // Step 1: Parse input
  const parsed = parseInput(input); // Returns {tower, flat}
  
  // Step 2: Validate tower
  if (!isValidTower(parsed.tower, society)) {
    // Try auto-correct
    const corrected = autoCorrectTower(parsed.tower, society);
    if (corrected) {
      return {
        status: "CORRECTED",
        original: input,
        tower: corrected,
        message: `Tower corrected to: ${corrected}`
      };
    } else {
      return {
        status: "INVALID_TOWER",
        error: `Invalid tower. Valid towers: ${society.towers.examples.join(", ")}`
      };
    }
  }
  
  // Step 3: Validate flat
  if (!isValidFlat(parsed.flat, society)) {
    // Check if reversed is valid
    const reversed = reverseFlat(parsed.flat);
    if (isValidFlat(reversed, society)) {
      return {
        status: "CONFIRMATION_NEEDED",
        original: input,
        flat: reversed,
        message: `Did you mean flat ${reversed}? [Yes/No]`
      };
    }
    
    // Check if skipped unit (suggest alternatives)
    if (isSkippedUnit(parsed.flat, society)) {
      const alternatives = getSimilarFlats(parsed.flat, society);
      return {
        status: "SKIPPED_UNIT",
        original: input,
        alternatives: alternatives,
        message: `Unit ${parsed.flat.unit} is skipped. Did you mean: ${alternatives.join(", ")}?`
      };
    }
    
    return {
      status: "INVALID_FLAT",
      error: `Invalid flat number for ${society.name}. ${getHelpText(society)}`
    };
  }
  
  // Step 4: All valid
  return {
    status: "VALID",
    tower: parsed.tower,
    flat: parsed.flat,
    message: "Flat validated successfully"
  };
}
```

---

## ERROR MESSAGES & HELP TEXT

### For Lotus Zing
```
"Invalid flat. Lotus Zing has 28 floors and 2 units per floor.
Format: XYZZ where:
  - XY = Floor (01-28)
  - ZZ = Unit (01-02)
Examples: 0101, 2801, 1402

Accepted formats:
  - 2405 (standard)
  - 24-05 (with hyphen)
  - 24 05 (with space)
  - Floor 24, Unit 05 (written form)"
```

### For Logix Blossom County
```
"Invalid flat. Logix Blossom County has 20 floors, 8 units per floor (with skips).
Valid units: 01, 02, 03, 05, 06, 08 (units 04 and 07 are skipped)
Format: XYZZ where:
  - XY = Floor (01-20)
  - ZZ = Unit (01, 02, 03, 05, 06, or 08)
Examples: 0101, 0105, 2008, 1503

Accepted formats:
  - 1005 (standard)
  - 10-05 (with hyphen)
  - 10 05 (with space)"
```

---

## LEARNING LOG: Feedback Loop

**Purpose:** Improve validator over time with real resident data

**Logged Data:**
```
timestamp, society, user_input, parsed_output, status, correction_applied, user_confirmed
2026-05-23 10:30:00, lotus_zing, "24-05", {floor:24, unit:5}, VALID, none, true
2026-05-23 10:32:15, logix_blossom, "2007", {floor:20, unit:7}, SKIPPED, suggested [2006, 2008], true
2026-05-23 10:35:00, supertech, "Tower 1, Flat 1501", {tower:1, flat:1501}, VALID, none, true
```

**Use Cases:**
1. Track which formats residents use most (prioritize in future UX)
2. Find patterns in errors (e.g., "residents always reverse flats" → improve detection)
3. Identify missing society data (e.g., high error rate for Paramount Floraville)
4. A/B test correction messages (which phrasing works best?)

---

## NEXT STEPS

**To Complete Sector 137 Mapping:**
1. [ ] Research Paramount Floraville (towers, floors, flat format)
2. [ ] Research Paras Tierea (towers, floors, flat format)
3. [ ] Research Purvanchal Royal Park (towers, floors, flat format)
4. [ ] Research Gulshan Vivante (towers, floors, flat format)
5. [ ] Verify Supertech Ecociti exact tower count and naming
6. [ ] Build SocietyLibrary.json with all confirmed data
7. [ ] Build FlatValidator.js with full 3-layer system
8. [ ] Test with resident feedback during beta
