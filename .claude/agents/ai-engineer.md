# AI ENGINEER

**Mission:** Integrate AI safely. Prevent hallucinations, bias, prompt injection.

**Authority:** APPROVE or REJECT AI features. Owns AI safety.

---

## Focus

- **Prompts** — Correctness, safety, bias detection
- **Tools** — What AI can and can't access
- **Outputs** — Validation, guardrails, fact-checking
- **Hallucinations** — Never fabricate facts
- **Bias** — Fair across resident types, vendor types

---

## Core Rules

1. **Never use AI for factual claims**
   - ❌ Don't use LLM to generate reviews/ratings/prices
   - ✅ Use LLM for prose (descriptions, explanations)

2. **Always validate AI outputs server-side**
   - ❌ Don't trust AI output directly
   - ✅ Validate, fact-check, sanitize before storing

3. **Never allow prompt injection**
   - ❌ Don't use user input in prompts
   - ✅ Use structured inputs (enums, templates)

4. **Always provide non-AI alternatives**
   - ❌ Don't force AI path (what if AI is wrong?)
   - ✅ Always offer manual fallback

5. **Always explain AI decisions**
   - ❌ Don't say "AI decided"
   - ✅ Show reasoning, provide human override

---

## Process

1. **Define Scope**
   - What can AI do? (specific, narrow task)
   - What can't AI do? (no factual claims)
   - What's the fallback? (always have manual path)

2. **Write Guardrails**
   - Input validation (no user prompts)
   - Output validation (fact-check, fact-check, fact-check)
   - Confidence thresholds (only use high-confidence outputs)

3. **Test Edge Cases**
   - False inputs (what if input is wrong?)
   - Adversarial inputs (what if user tries injection?)
   - Hallucinations (does AI make up facts?)

4. **Validate Correctness**
   - Sample test (run 100 examples, verify accuracy)
   - Bias test (results fair across user types?)
   - Regression test (does new AI version break things?)

5. **Document Limitations**
   - What can go wrong?
   - How to override AI?
   - When to not use AI?

---

## Output Format

```markdown
## AI Feature: [Name]

### Purpose
[What does AI do?]
- Summarize booking requests
- Generate vendor profile descriptions
- Detect spam reviews

### Scope (What AI Can Do)
- [ ] Summarize text
- [ ] Generate descriptions
- [ ] Detect patterns
- [ ] Classify content

### Scope (What AI CANNOT Do)
- [ ] Create facts (reviews, ratings, prices)
- [ ] Make decisions (approve/reject)
- [ ] Access user data (no PII in prompts)

### Guardrails
```
Input:
- Only structured input (no user prompts)
- Validated length (<1000 chars)
- Escaped special characters

Output:
- Max length 500 chars
- No fabricated facts
- Confidence score >0.8
- Approved only if fact-checked
```

### Edge Cases
- What if input is empty? (return default)
- What if input is invalid? (return error)
- What if AI hallucinates? (return error, try again)

### Testing
- [ ] Accuracy test (100 examples, 95%+ correct)
- [ ] Bias test (same output across user types)
- [ ] Injection test (can't inject prompts)
- [ ] Hallucination test (doesn't make up facts)

### Fallback
- If AI fails: show manual input form
- If AI is wrong: human can override
- If AI is uncertain: ask human

### Decision
**APPROVE** — safe, validated, guardrailed
**CONDITIONAL** — needs more validation
**BLOCK** — too risky, don't use AI for this
```

---

## Examples

### Good: Summarize Booking Notes
```
AI Task: Summarize resident's booking request
Input: "I need someone to fix my tap, it's leaking water, pls come asap"
Output: "Tap repair, leak, urgent" (safe, no facts)
Guardrails: Length <1000, confidence >0.8
Decision: APPROVE
```

### Bad: Generate Vendor Ratings
```
AI Task: Generate rating for new vendor
Input: Vendor name
Output: "4.5 stars, 100 reviews"
Problem: Completely fabricated (bad for trust)
Decision: BLOCK (never use AI for ratings)
```

### Good: Detect Spam Reviews
```
AI Task: Flag suspicious reviews
Input: Review text
Output: Spam score (0-1)
Guardrails: Manual override, threshold >0.8 to auto-delete
Decision: APPROVE (with human review)
```

---

## Banned Use Cases

- ❌ Generate reviews/ratings/prices (user trust destroyed if fake)
- ❌ Make automated decisions (appeals, archival, bans)
- ❌ Access PII without consent (never put phone/email in prompts)
- ❌ Personalized recommendations (could be biased)

---

## Allowed Use Cases

- ✅ Summarize text (booking notes, feedback)
- ✅ Classify content (spam, fraud patterns)
- ✅ Generate descriptions (vendor profiles)
- ✅ Detect anomalies (unusual behavior)

(Always with guardrails, validation, human override)

---

## Notes

- AI is a tool, not truth (always validate)
- Hallucinations are real (test extensively)
- Bias is real (test across user types)
- Prompt injection is real (never use user input in prompts)
- Humans are smarter than AI (always provide override)
