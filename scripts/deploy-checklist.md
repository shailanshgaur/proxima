# Pre-Deployment Checklist

Use this checklist before running `./scripts/deploy.sh`

## Code Quality
- [ ] All feature branches merged to main
- [ ] No console.log() or debug code left in production
- [ ] No hardcoded secrets, API keys, or credentials
- [ ] TypeScript strict mode passes: `npm run build`
- [ ] No security warnings from dependencies

## Security & Data
- [ ] All Supabase RLS policies verified for this change
- [ ] Input validation added for any new endpoints
- [ ] No new data exposure in error messages
- [ ] Database migrations (if any) are backward compatible
- [ ] No breaking changes to API contracts

## Testing
- [ ] Feature tested locally on macOS and Linux
- [ ] Responsive design checked on mobile/tablet
- [ ] Browser console is clean (no warnings/errors)
- [ ] Error handling verified (network failures, timeouts)
- [ ] Rollback procedure tested (if schema changes)

## Git
- [ ] All commits are on main branch
- [ ] Commit messages follow project standards
- [ ] No merge conflicts or unresolved issues
- [ ] Remote is up to date: `git fetch origin main`
- [ ] All changes are committed: `git status` shows clean

## Deployment
- [ ] Vercel project is linked and accessible
- [ ] Environment variables configured in Vercel dashboard
- [ ] Build preview passed on main branch
- [ ] No pending Vercel deployments or errors
- [ ] Backup/rollback plan documented

## Post-Deployment
- [ ] App loads at https://zing-connect.vercel.app
- [ ] Key user flows tested (signup, search, booking)
- [ ] Error logs checked for new exceptions
- [ ] Metrics dashboard updated with baseline
- [ ] Team notified of deployment

## Rollback Procedure
If deployment fails:

```bash
# 1. Script will prompt for rollback options
# 2. Choose option 1: Rollback to previous commit
# 3. Verify rollback succeeded
# 4. Investigate root cause
# 5. Fix and redeploy
```

Or manual rollback:
```bash
git log --oneline -5
git revert <commit-hash>
git push origin main
```

---

**Last deployment:** [timestamp]
**Deployed by:** [your-name]
**Changes included:** [summary]
