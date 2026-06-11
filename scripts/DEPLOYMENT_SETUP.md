# Proxima Deployment Automation Setup

## Overview

Complete production-grade deployment automation for Proxima with:
- Automated safety checks before deployment
- TypeScript + Vite build verification
- Vercel push-triggered deployment
- Post-deployment smoke tests
- Automatic rollback on failure
- Comprehensive logging for audit trail

## Scripts Created

### 1. `./scripts/deploy.sh` (Main Script)

Production-grade deployment automation that:
- Enforces clean git status (no uncommitted changes)
- Validates TypeScript compilation
- Builds with Vite and verifies output
- Pushes to Vercel (triggers automatic deployment)
- Runs post-deployment health checks
- Offers automatic rollback if anything fails

**Usage:**
```bash
# Standard deployment
./scripts/deploy.sh

# Simulation (no actual push)
./scripts/deploy.sh --dry-run

# Force deployment (skip git status check)
./scripts/deploy.sh --force

# Skip build checks (not recommended)
./scripts/deploy.sh --skip-tests
```

**Exit Codes:**
- `0` = Success
- `1` = Pre-deploy checks failed
- `2` = Build failed
- `3` = Deployment failed
- `4` = Smoke tests failed
- `5` = Rollback cancelled

### 2. `./scripts/health-check.sh` (Utility Script)

Quick health verification for deployed app:
```bash
./scripts/health-check.sh
./scripts/health-check.sh --verbose
./scripts/health-check.sh --endpoint https://zing-connect.vercel.app
```

Checks:
- HTTP connectivity and status code
- Response time (should be <2s)
- Page content loads correctly
- No obvious errors

### 3. `./scripts/DEPLOY_README.md` (Documentation)

Complete guide covering:
- Quick start examples
- Step-by-step explanation of what deploy.sh does
- Common issues and solutions
- Manual deployment procedures
- Team workflow recommendations

### 4. `./scripts/deploy-checklist.md` (Pre-Deployment Checklist)

Comprehensive checklist to verify before running deploy script:
- Code quality checks
- Security and data validation
- Testing requirements
- Git status verification
- Post-deployment verification

## How It Works

### Deployment Flow

```
1. PRE-DEPLOY CHECKS (30s)
   ├─ Verify prerequisites (git, npm, curl)
   ├─ Check git branch is main/master
   └─ Ensure no uncommitted changes

2. BUILD VERIFICATION (60s)
   ├─ TypeScript compilation (tsc --noEmit)
   └─ Vite production build (npm run build)

3. VERCEL DEPLOYMENT (30s)
   └─ git push origin main (Vercel auto-deploys)

4. SMOKE TESTS (60s)
   ├─ Health check: curl app 5 times
   ├─ Content verification: check HTML loaded
   └─ Error log review

5. COMPLETION
   ├─ Success: Report stats, exit 0
   └─ Failure: Prompt for rollback options
```

### Safety Features

**Pre-Deployment:**
- Blocks if git is dirty (use `--force` to override)
- Refuses deployment from non-main branches
- Verifies all prerequisites installed

**Build Phase:**
- TypeScript strict mode must pass
- Vite build must succeed
- Dist directory must exist

**Deployment:**
- Uses git push (no direct Vercel CLI calls)
- Relies on Vercel's automatic deployment
- Waits for build to start before testing

**Post-Deployment:**
- 5 retries with 3-second intervals for health check
- Verifies actual HTTP 200 response
- Checks page content loaded
- Reports any errors found

**Rollback:**
- If smoke tests fail, offers immediate rollback
- One-command revert: `git revert HEAD && git push origin main`
- Preserves audit trail (revert is a new commit)

## Integration with Vercel

The script assumes:

1. **Git-based deployment** (not Vercel CLI)
   - Vercel is connected to your GitHub repo
   - `git push origin main` triggers automatic deployment

2. **Environment variables** pre-configured in Vercel
   - Supabase credentials
   - API keys
   - Any other secrets

3. **Build command** in Vercel project settings:
   ```
   npm run build
   ```

4. **Output directory** in Vercel:
   ```
   dist
   ```

To verify Vercel is properly configured:
```bash
# Check Vercel dashboard
open https://vercel.com/dashboard

# Or check git remote
git remote -v
```

## Logging

All deployments logged to `.deploy-logs/deployment-YYYYMMDD-HHMMSS.log`

View recent deployments:
```bash
ls -lht .deploy-logs/
tail -100 .deploy-logs/deployment-*.log | sort -r | head
```

Log rotation: Keeps last 10 deployments, auto-deletes older logs.

## Prerequisites

**Required commands:**
- `git` — version control
- `npm` — package management
- `curl` — HTTP requests (health checks)
- `tsc` — TypeScript compiler

Install TypeScript globally (if not already):
```bash
npm install -g typescript
```

Or use local npm installation (script uses `npm exec tsc`).

## Usage Examples

### Basic Deployment
```bash
./scripts/deploy.sh
```
Deploys main branch to Vercel with all safety checks.

### Test Without Deploying
```bash
./scripts/deploy.sh --dry-run
```
Simulates deployment (checks, builds, but doesn't push).

### Force Deployment
```bash
./scripts/deploy.sh --force
```
Skips git status check (use only if you know what you're doing).

### Skip Build Tests
```bash
./scripts/deploy.sh --skip-tests
```
Skips TypeScript and Vite verification (not recommended for production).

### Manual Rollback
```bash
git log --oneline -5           # Find bad commit
git revert <commit-hash>       # Create revert commit
git push origin main           # Push revert (triggers redeploy)
```

### Check App Health
```bash
./scripts/health-check.sh      # Quick health check
./scripts/health-check.sh --verbose  # Detailed output
```

## Team Workflow

1. **Before Deployment:**
   - Ensure all PRs merged to main
   - Run locally: `npm run dev`
   - Review checklist: `cat scripts/deploy-checklist.md`

2. **During Deployment:**
   - Run: `./scripts/deploy.sh`
   - Monitor console output
   - If prompted, choose rollback option (1, 2, or 3)

3. **After Deployment:**
   - Verify at https://zing-connect.vercel.app
   - Test key flows (signup, search, booking)
   - Check Vercel dashboard for errors

4. **If Deployment Fails:**
   - Review logs: `cat .deploy-logs/deployment-*.log`
   - Choose rollback option 1 (automatic revert)
   - Fix issue and redeploy

## Troubleshooting

### "Working tree is not clean"
```bash
git status                    # see uncommitted files
git add .                     # stage all
git commit -m "message"       # commit
./scripts/deploy.sh           # retry
```

### "TypeScript compilation failed"
```bash
npm exec tsc --noEmit         # see exact errors
# fix TypeScript errors in source files
./scripts/deploy.sh           # retry
```

### "Build failed"
```bash
npm run build                 # see full error output
# fix the issue (import, syntax, etc.)
./scripts/deploy.sh           # retry
```

### "Health check failed"
Vercel build might still be in progress:
```bash
sleep 120                     # wait 2 minutes
./scripts/health-check.sh     # check again
```

Or check Vercel dashboard:
```bash
open https://vercel.com/dashboard
```

### "Failed to push to Vercel"
Check git credentials:
```bash
git push origin main          # try manually
git remote -v                 # verify remote
git config user.email        # verify git config
```

## File Permissions

Make scripts executable:
```bash
chmod +x scripts/deploy.sh
chmod +x scripts/health-check.sh
```

Or one-time per script:
```bash
bash scripts/deploy.sh        # run without execute permission
```

## Security Considerations

1. **No secrets in script** — All credentials in Vercel env vars
2. **No hardcoded URLs** — App URL extracted from config
3. **Audit trail** — Every deployment logged for compliance
4. **Rollback capability** — Can quickly revert if needed
5. **Team visibility** — Anyone can safely deploy (script has all guards)

## Next Steps

1. ✅ Test script locally:
   ```bash
   ./scripts/deploy.sh --dry-run
   ```

2. ✅ Run pre-deployment checklist:
   ```bash
   cat scripts/deploy-checklist.md
   ```

3. ✅ Verify Vercel is configured:
   ```bash
   git remote -v
   open https://vercel.com/dashboard
   ```

4. ✅ Do first real deployment:
   ```bash
   ./scripts/deploy.sh
   ```

5. ✅ Document in team wiki/README

## Support

For issues:
1. Check `.deploy-logs/deployment-*.log` for error details
2. Review `./scripts/DEPLOY_README.md` troubleshooting section
3. Test manually: `npm run build && git push origin main`
4. Check Vercel dashboard for build/runtime errors

---

**Created:** 2026-06-12  
**Project:** Proxima - Hyperlocal Service Marketplace  
**Maintained By:** Product Engineering Team
