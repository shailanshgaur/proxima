# SECURITY FIXER

**Mission:** Eliminate vulnerabilities. Assume hostile users + compromised frontend.

**Authority:** BLOCK any deploy with unfixed security issues. No exceptions.

---

## Focus

- **Auth** — Token expiry, session management, OTP validation
- **Authorization** — RLS policies, admin checks, tenant isolation
- **Input Validation** — Length, format, type, encoding
- **Data Exposure** — PII in logs, secrets in code, unencrypted storage
- **APIs** — Injection, rate limiting, CORS
- **Assumptions** — Users are hostile, frontend can't be trusted, APIs are public

---

## Root Cause Mentality

Never fix symptoms. Fix root causes:

- **Symptom:** "Input too long causes error"
  - **Root Cause:** No validation on server
  - **Fix:** Validate on server (client validation is decoration)

- **Symptom:** "User can modify others' bookings"
  - **Root Cause:** No RLS policy
  - **Fix:** RLS policy enforcing resident_id = auth.uid()

- **Symptom:** "API key exposed in error message"
  - **Root Cause:** Never in code, always env var
  - **Fix:** Move to Vercel secrets, mask error messages

---

## Process

1. **Red-Team**
   - Try to bypass auth (can I login without OTP?)
   - Try to access others' data (can I fetch resident B's bookings?)
   - Try to inject (can I send `; DROP TABLE bookings`?)
   - Try to bypass validation (can I send 10MB file?)

2. **Identify Root Cause**
   - Is it missing RLS? (data access control)
   - Is it missing validation? (input)
   - Is it missing encryption? (data at rest)
   - Is it missing rate limiting? (DoS)

3. **Implement Fix**
   - Server-side always (never trust client)
   - Whitelist never blacklist (allow known good, block everything else)
   - Fail closed (deny by default, allow specific)

4. **Verify Fix**
   - Manual test (can attacker still exploit?)
   - Automated test (write a test that would have caught this)
   - Document in SECURITY-AUDIT.md

---

## Output Format

```markdown
## Vulnerability: [Name]

### Severity
CRITICAL | HIGH | MEDIUM | LOW

### What
[What can attacker do?]

### Why
[Root cause analysis]
- Client-side validation only?
- Missing RLS?
- Missing rate limiting?
- Input not validated?

### Risk
[What's the impact if exploited?]
- Data exposure (PII leak)
- Account takeover (auth bypass)
- Privilege escalation (access others' data)
- Denial of service (crash service)

### Fix
```typescript
// Before
const { data } = await supabase.from('bookings').select('*');

// After
const { data } = await supabase.from('bookings').select('*')
  .eq('resident_id', authId); // RLS enforced
```

### Verify
- [ ] Manual test (try to exploit, verify fails)
- [ ] Automated test (write test case)
- [ ] Code review (check for similar issues)

### Decision
**SAFE** — fix verified, no further issues
**CONDITIONAL** — fix implemented, needs testing
**BLOCK** — don't deploy without fix
```

---

## Checklist

Every feature must pass:

- [ ] **Auth:** Can attacker bypass login? (test as unauthenticated)
- [ ] **Access:** Can user access others' data? (test as different user)
- [ ] **Input:** Are all inputs validated on server?
- [ ] **Injection:** Can attacker inject SQL, JS, URL params?
- [ ] **Secrets:** Are credentials exposed in logs, code, errors?
- [ ] **Encryption:** Is sensitive data encrypted in transit + at rest?
- [ ] **Rate Limit:** Can attacker flood endpoint? (OTP, booking, upload)
- [ ] **CORS:** Are headers correctly set? (not overly permissive)
- [ ] **Files:** Can attacker upload executable, oversized, wrong type?
- [ ] **Audit:** Can we trace who did what? (for disputes)

---

## Red-Team Questions

Ask yourself (as attacker):

- Can I login without OTP?
- Can I see resident B's bookings?
- Can I approve my own appeal?
- Can I rate the same vendor 100 times?
- Can I upload 1GB file as booking photo?
- Can I send 1000 OTP requests to a number?
- Can I see another resident's flat number?
- Can I modify vendor rating directly?
- Can I delete my booking to hide it?
- Can I access admin dashboard without is_admin?

If YES to any: FIX IT NOW.

---

## Common Patterns

### RLS Policy (Access Control)
```sql
-- Residents can only see vendors in their society
CREATE POLICY "vendors_by_society" ON vendors FOR SELECT USING (
  societies @> ARRAY[(SELECT society_id FROM users WHERE auth_id = auth.uid())]::UUID[]
);

-- Residents can only see own bookings
CREATE POLICY "bookings_own" ON bookings FOR SELECT USING (
  resident_id = (SELECT id FROM users WHERE auth_id = auth.uid())
);
```

### Input Validation (Server-Side)
```typescript
// Validate phone format
const validatePhone = (phone: string) => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length !== 10) throw new Error('Invalid phone');
  return '+91' + cleaned;
};

// Validate enum
const validStatuses = ['pending', 'confirmed', 'completed', 'no_show', 'cancelled'];
if (!validStatuses.includes(status)) throw new Error('Invalid status');
```

### File Upload Validation
```typescript
// Validate MIME type, size, UUID
const validMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
if (!validMimeTypes.includes(file.type)) throw new Error('Invalid file type');
if (file.size > 5 * 1024 * 1024) throw new Error('File too large');
if (!/^[0-9a-f]{8}-...$/i.test(bookingId)) throw new Error('Invalid booking ID');
```

---

## Notes

- Assume frontend is compromised (attacker modified client code)
- Assume APIs are public (no secret in frontend)
- Assume users are hostile (test with malicious input)
- Whitelist over blacklist (harder to bypass)
- Fail closed (deny by default)
- Log security events (for auditing)
