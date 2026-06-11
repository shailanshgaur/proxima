# Proxima Deployment Scripts

Complete deployment automation suite for Vercel with safety checks, health monitoring, and automatic rollback.

## Files in This Directory

### Core Scripts

| File | Purpose | Usage |
|------|---------|-------|
| **deploy.sh** | Main deployment automation | `./scripts/deploy.sh [--dry-run] [--force] [--skip-tests]` |
| **health-check.sh** | Health verification utility | `./scripts/health-check.sh [--verbose]` |

### Documentation

| File | Purpose |
|------|---------|
| **DEPLOY_README.md** | Complete deployment guide (detailed) |
| **DEPLOY_QUICK_REF.txt** | Quick reference card (1 page) |
| **DEPLOYMENT_SETUP.md** | Setup and integration guide |
| **deploy-checklist.md** | Pre-deployment verification checklist |
| **TEST_DEPLOYMENT.md** | Testing and validation guide |
| **README.md** | This file |

## Quick Start

```bash
# Standard deployment
./scripts/deploy.sh

# Simulate without pushing
./scripts/deploy.sh --dry-run

# Check app health
./scripts/health-check.sh
```

## What deploy.sh Does

1. **Pre-Deployment** (30s) — Verifies prerequisites, git status
2. **Build** (60s) — TypeScript compilation + Vite build
3. **Deploy** (30s) — Git push to Vercel (auto-builds)
4. **Smoke Tests** (60s) — Health checks, content verification
5. **Completion** — Success report or rollback options

**Total:** 3-5 minutes | **Exit code:** 0 on success, 1-5 on failure

## Key Features

✓ **Safety First**
- Blocks deployment if git is dirty
- Verifies TypeScript passes
- Ensures build succeeds before pushing
- Post-deployment smoke tests

✓ **Automatic Rollback**
- If anything fails, script offers immediate rollback
- One-command revert to previous version
- Preserves audit trail (revert is a commit)

✓ **Team-Friendly**
- Anyone can safely deploy (script has all guards)
- Clear error messages guide troubleshooting
- Comprehensive logging for audit trail
- Quick reference card for common tasks

✓ **Production-Grade**
- Handles all edge cases
- Configurable retries and timeouts
- Log rotation (keeps last 10 deployments)
- Exit codes for CI/CD integration

## Flags

```bash
./scripts/deploy.sh --dry-run     # Simulate (no push)
./scripts/deploy.sh --force       # Skip git status check
./scripts/deploy.sh --skip-tests  # Skip build verification
```

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Successful deployment |
| 1 | Pre-deploy checks failed |
| 2 | Build failed (TypeScript or Vite) |
| 3 | Git push failed |
| 4 | Smoke tests failed |
| 5 | User skipped rollback |

## Logging

All deployments logged to: `.deploy-logs/deployment-YYYYMMDD-HHMMSS.log`

```bash
# View latest deployment
tail -100 .deploy-logs/deployment-*.log | sort -r | head

# View specific deployment
cat .deploy-logs/deployment-20260612-143022.log
```

## Common Commands

```bash
# Deploy to production
./scripts/deploy.sh

# Simulate deployment (dry run)
./scripts/deploy.sh --dry-run

# Check if app is live
./scripts/health-check.sh

# Manual rollback
git revert HEAD
git push origin main

# Force redeploy after manual fix
./scripts/deploy.sh --force
```

## Team Workflow

**Before:**
1. Ensure all PRs merged to main
2. Review checklist: `cat scripts/deploy-checklist.md`
3. Test locally: `npm run dev`

**Deploy:**
1. Run: `./scripts/deploy.sh`
2. Monitor console output
3. If prompted: choose rollback option (1/2/3)

**After:**
1. Verify at https://zing-connect.vercel.app
2. Test key flows (signup, search, booking)
3. Check Vercel dashboard for errors

## Troubleshooting

**"Working tree is not clean"**
```bash
git add . && git commit -m "message"
./scripts/deploy.sh
```

**"TypeScript compilation failed"**
```bash
npm exec tsc --noEmit          # see errors
# fix files...
./scripts/deploy.sh
```

**"Health check failed"**
```bash
sleep 120                      # Vercel still building
./scripts/health-check.sh      # check again
```

See **DEPLOY_README.md** for detailed troubleshooting.

## Documentation Structure

```
Read First:  DEPLOY_QUICK_REF.txt     (1 page, common commands)
             ↓
Main Guide:  DEPLOY_README.md          (detailed guide + troubleshooting)
             ↓
Deep Dive:   DEPLOYMENT_SETUP.md       (setup, integration, workflow)
             ↓
Reference:   deploy-checklist.md       (pre-deployment checklist)
             ↓
Testing:     TEST_DEPLOYMENT.md        (validation and testing)
```

## Team Onboarding

New team member deploying for first time:

1. Read: `DEPLOY_QUICK_REF.txt` (2 min)
2. Review: `deploy-checklist.md` (5 min)
3. Test: `./scripts/deploy.sh --dry-run` (2 min)
4. Deploy: `./scripts/deploy.sh` (5 min)
5. Verify: `./scripts/health-check.sh` (1 min)

**Total:** 15 minutes to first deployment

## Prerequisites

Required commands:
- `git` — version control
- `npm` — package management
- `curl` — HTTP requests
- `tsc` — TypeScript compiler

Verify:
```bash
git --version
npm --version
curl --version
npm exec tsc --version
```

## Integration with Vercel

The script uses git push (not Vercel CLI):

```
git push origin main → GitHub webhook → Vercel auto-deploys
```

Verify setup:
```bash
git remote -v        # Check remote is configured
open https://vercel.com/dashboard  # Check Vercel project
```

## Monitoring & Alerts

For ongoing monitoring between deployments:

```bash
# Quick health check
./scripts/health-check.sh

# Monitor app performance
open https://vercel.com/dashboard
```

For advanced monitoring, integrate with:
- Sentry (error tracking)
- DataDog (performance monitoring)
- PagerDuty (on-call alerts)

## Security Notes

- No secrets in script (all in Vercel env vars)
- No hardcoded API keys or credentials
- Rollback preserves audit trail (git commits)
- All actions logged for compliance
- Script assumes clean git + GitHub authentication

## Support & Issues

If deployment fails:

1. **Check logs:**
   ```bash
   tail -50 .deploy-logs/deployment-*.log
   ```

2. **Check Vercel dashboard:**
   ```bash
   open https://vercel.com/dashboard
   ```

3. **Review relevant documentation:**
   - Quick issues: DEPLOY_QUICK_REF.txt
   - Detailed help: DEPLOY_README.md
   - Setup issues: DEPLOYMENT_SETUP.md

4. **Manual rollback (if needed):**
   ```bash
   git revert HEAD
   git push origin main
   ```

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-06-12 | Initial release |

## Contributing

To improve the deployment scripts:

1. Test changes locally with `--dry-run`
2. Update relevant documentation
3. Run TEST_DEPLOYMENT.md validation
4. Get team review before merging

## Questions?

1. **Quick answers:** DEPLOY_QUICK_REF.txt
2. **Common issues:** DEPLOY_README.md troubleshooting section
3. **Setup help:** DEPLOYMENT_SETUP.md
4. **Testing:** TEST_DEPLOYMENT.md
5. **Pre-deploy:** deploy-checklist.md

---

**Last Updated:** 2026-06-12  
**Maintainer:** Product Engineering Team  
**Project:** Proxima - Hyperlocal Service Marketplace
