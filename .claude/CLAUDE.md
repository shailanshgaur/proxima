# Proxima Project Configuration

**Project:** Proxima - Hyperlocal Service Marketplace  
**Date Created:** 2026-06-12  
**Team:** Product, Security, Architecture, Leadership

---

## Priorities (in order)
1. **Trust** — residents + vendors trust platform with real transactions
2. **User Experience** — frictionless signup, search, booking
3. **Reliability** — zero downtime, data integrity
4. **Growth** — viral onboarding to adjacent societies
5. **Monetization** — sustainable revenue (Year 2+)

---

## Feature Gate: Every feature MUST improve at least one:
- **Discovery** — Can residents find vendors easily?
- **Trust** — Can residents trust vendors? (ratings, reviews, proofs)
- **Transactions** — Can residents easily book + pay?
- **Retention** — Do residents return for repeat bookings?

**Example:** A feature that doesn't improve any of these → defer to Year 2.

---

## Specialist Agents

Each agent evaluates PRs/features from their domain:

### Security Agent
Assume hostile users + compromised frontends. Red-team all changes.
- Auth bypass? RLS bypass? Injection? File upload exploits? Rate limit bypasses?
- Verdict: ✅ SAFE | ⚠️ CONDITIONAL | 🔴 BLOCK

### Architect Agent
Review scalability, maintainability, tech debt.
- Will this work at 10k/100k residents? Zero-downtime deploy? Reversible migration?
- Verdict: ✅ APPROVE | ⚠️ CONDITIONAL | 🔴 BLOCK

### Product Agent
Review user value, monetization fit, UX.
- Does resident/vendor actually want this? Will they pay for premium version?
- Verdict: ✅ SHIP | ⚠️ DEFER | 🔴 BLOCK

### CEO Agent (Final Authority)
Consolidate all three agents → ship/block decision.
- Security 🔴 = always BLOCK (no exceptions)
- Architect 🔴 + scale-critical = BLOCK (fix first)
- Product 🔴 + non-MVP = DEFER (Year 2)

---

## Future Monetization (Year 2+)

All built on data captured from day 1:

1. **Featured Listings** — Vendor pays $10/month → appears first in search
2. **Sponsored Discovery** — Vendor pays per click/impression
3. **Business Subscriptions** — Vendor dashboard, analytics, bulk booking
4. **Lead Generation** — Sell anonymized demand insights to vendors
5. **Transaction Fees** — Platform takes 5% per completed booking

**Guiding Rule:** Monetization must improve value for users, not exploit them.

---

## Engineering Rules

- **No breaking changes** without migration plan + rollback procedure
- **All writes** require RLS policy + input validation
- **Security mindset:** Assume compromised frontend, hostile users
- **Scalability plan** before MVP launch (how do we expand to 2nd society?)
- **User data:** Minimize collection, transparent ToS, honor deletions
- **Admin actions:** All logged + auditable (for appeals, archival disputes)
- **Testing:** Every API endpoint should have a test (even if simple)
- **Monitoring:** Can we see if prod is broken? (error logs, latency, SLA)

---

## Code Style

- **TypeScript:** Strict mode enforced
- **React:** Functional components only, hooks for state
- **Comments:** Only "why", not "what" (code is self-explanatory)
- **Errors:** Mask in prod, verbose in dev
- **Secrets:** Never in code or logs. Use Supabase/Vercel env vars only.

---

## Escalation

| Issue | Path |
|-------|------|
| Security blocker | → Security Agent + CEO → block until fixed |
| UX regression | → Product Agent + CEO → revert if MVP-critical |
| Scale concern | → Architect Agent + CEO → test at 10x traffic |
| Monetization conflict | → Product + CEO → user value always first |

---

## Shipping Checklist

Before marking any feature complete:

- [ ] Security: Red-teamed, RLS + validation, no secrets exposed
- [ ] Architect: Indexed queries, tested, logged, zero-downtime deploy
- [ ] Product: Improves Discovery/Trust/Transactions/Retention
- [ ] Legal: ToS covers it, no surprise liabilities
- [ ] Metrics: Can measure success (bookings, retention, satisfaction)
- [ ] Revert: Has rollback plan if broken

**No exceptions.** If any unchecked, send back for review.

---

## Git Workflow

**Branch naming:**
- `feature/discovery-sort` — new feature
- `fix/auth-rls-bypass` — bug fix
- `refactor/booking-service` — code cleanup
- `docs/deployment-guide` — documentation

**Commit message:**
- First line: what changed (present tense, <50 chars)
- Blank line
- Why (context, trade-offs, metrics)
- Co-Authored-By: Agent Name if applicable

**Example:**
```
Add vendor search by rating (Discovery improvement)

Residents can now sort vendors by rating (high→low).
This improves Discovery metric: +15% vendor views in beta.
RLS: vendors visible only in resident's society.

Co-Authored-By: Product Agent <product@proxima.local>
```

---

## Definition of Done

A feature is "done" when:
1. ✅ Code merged to main
2. ✅ All agents signed off (Security, Architect, Product)
3. ✅ CEO approved for ship
4. ✅ Deployed to staging + tested end-to-end
5. ✅ Metrics baseline established (for evaluation post-launch)
6. ✅ Revert procedure documented
7. ✅ Changelog updated

---

## Contact

- **Product Questions:** Product Agent
- **Security Questions:** Security Agent
- **Scalability Questions:** Architect Agent
- **Final Decision:** CEO Agent

---

**Last Updated:** 2026-06-12  
**Version:** 1.0 (MVP)
