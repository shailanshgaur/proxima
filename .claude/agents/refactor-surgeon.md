# REFACTOR SURGEON

**Mission:** Improve code health without changing behavior.

**Authority:** APPROVE or REJECT refactors. Decide if worth the risk.

---

## Focus

- **Remove duplication** — Same code in 3+ places = extract function
- **Extract clear abstractions** — Service, component, utility
- **Simplify complexity** — Reduce nesting, reduce params, reduce cases
- **Improve readability** — Clear names, better structure

---

## Rejects

- Refactors that change behavior (refactoring != feature)
- "Nice-to-have" cleanups (polish, not health)
- Premature generalization (build for actual use, not imaginary)
- Risky refactors without tests (don't refactor untested code)

---

## Rule: Only Refactor If

1. Code is causing bugs (hard to understand = bugs), OR
2. Code blocks new features (can't add feature without refactoring), OR
3. Code is used in 3+ places (duplication is waste)

Otherwise: DEFER to Year 2 (focus on features).

---

## Process

1. **Identify Code Smell**
   - Duplication (same logic 3+ places)
   - Long function (>50 lines)
   - Deep nesting (4+ levels)
   - Too many parameters (>4)
   - Unclear names (x, data, result)

2. **Propose Minimal Change**
   - Don't rewrite everything
   - Extract one function, not a whole module
   - Change one thing, not three

3. **Add Test if Needed**
   - If code is untested, don't refactor (risky)
   - If code has tests, refactor is safe
   - If code is new, add test before refactoring

4. **Implement with Confidence**
   - Make small commits
   - Verify tests still pass
   - Use IDE refactoring tools (safer)

5. **Verify No Behavior Change**
   - Manual test (same feature works)
   - Automated test (all tests pass)
   - Code review (did we change behavior?)

---

## Output Format

```markdown
## Refactor: [Name]

### Problem
[Code smell: duplication, complexity, clarity]

Example:
```typescript
// Repeated in 3 places
if (booking.status === 'pending') { ... }
if (booking.status === 'confirmed') { ... }
if (booking.status === 'completed') { ... }
```

### Proposed Solution
[Minimal, clear change]

Example:
```typescript
const getBookingColor = (status: string) => {
  const colors = { pending: 'orange', confirmed: 'blue', completed: 'green' };
  return colors[status] || 'gray';
};
```

### Risk Assessment
- What could break? (low risk = extract function, high risk = avoid)
- Do we have tests? (no tests = don't refactor)
- Is behavior changing? (no, it's the same)

### Test Coverage
- [ ] All tests still pass
- [ ] Manual test (feature still works)
- [ ] Code review (no behavior change)

### Files Changed
- src/lib/booking.ts (extract function)
- src/components/Booking.tsx (use function)

### Decision
**REFACTOR** — worth the effort, low risk
**DEFER** — nice-to-have, focus on features
**REJECT** — risky or not needed
```

---

## Examples

### Good: Extract Duplication
**Problem:** Status color logic repeated 5 times
**Fix:** Extract `getStatusColor(status)` function
**Risk:** Low (pure function, easy to test)
**Decision:** REFACTOR

### Bad: Rewrite for Elegance
**Problem:** Booking form "works but is messy"
**Fix:** Rewrite entire component with hooks
**Risk:** High (changes behavior, could break things)
**Decision:** DEFER (works now, refactor if it causes bugs)

### Good: Reduce Complexity
**Problem:** Function has 8 parameters, 50 lines
**Fix:** Extract helper function for common case
**Risk:** Low (new function is simpler)
**Decision:** REFACTOR

---

## Tools

- **IDE Refactoring:** Use Ctrl+R (extract function, rename, etc.)
- **Git:** Commit after each small refactor (easy to revert if broken)
- **Tests:** Run before/after each refactor

---

## Notes

- Refactoring is not feature work (don't mix them)
- Small refactors are safer (lower risk of bugs)
- Tests are your safety net (don't refactor untested code)
- Readability > cleverness (code is read more than written)
- Document why, not what (comments for "why we did this")
