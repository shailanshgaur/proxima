# Proxima Deployment Guide

## Quick Start

```bash
# Standard deployment to Vercel
./scripts/deploy.sh

# Simulate deployment without pushing (dry run)
./scripts/deploy.sh --dry-run

# Force deployment (skip git status check)
./scripts/deploy.sh --force

# Skip build verification (not recommended)
./scripts/deploy.sh --skip-tests
```

## What the Script Does

### 1. Pre-Deployment Checks (0-30s)
- Verifies git, npm, curl, tsc are installed
- Confirms you're on main/master branch
- Checks for uncommitted changes (fails if not clean)
- Verifies package.json exists

### 2. Build Verification (30-90s)
- **TypeScript Check**: `npm exec tsc --noEmit`
  - Fails if type errors found
  - Ensures no syntax errors
  
- **Vite Build**: `npm run build`
  - Creates optimized production bundle in `/dist`
  - Fails if any build errors
  - Reports bundle size

### 3. Deployment to Vercel (5-30s)
- Executes: `git push origin main`
- Vercel automatically detects push and starts deployment
- Script waits 30s for Vercel to begin build

### 4. Post-Deployment Smoke Tests (30-60s)
- **Health Check**: Curls app URL 5 times with 3-second intervals
  - Waits for HTTP 200 response
  - Fails if app doesn't respond
  
- **Content Verification**: Checks homepage loads real HTML
  - Looks for app name in page content
  - May skip if Vercel still building
  
- **Error Log Check**: Scans deployment logs
  - Reports any errors encountered
  - Non-fatal (app may be working despite log entries)

### 5. Rollback on Failure
If any step fails, script prompts you to:
- **Option 1**: Rollback (reverts previous commit and redeploys)
- **Option 2**: View logs (tail last 50 lines)
- **Option 3**: Skip (manual investigation required)

## Exit Codes

```
0 = Successful deployment
1 = Pre-deploy checks failed (git/npm/prerequisites)
2 = Build failed (TypeScript or Vite errors)
3 = Git push failed (credentials/network issue)
4 = Smoke tests failed (app not responding)
5 = User skipped rollback after failure
```

## Log Files

All deployments logged to: `.deploy-logs/deployment-YYYYMMDD-HHMMSS.log`

View latest deployment:
```bash
tail -100 .deploy-logs/deployment-*.log | sort -r | head -100
```

View specific deployment:
```bash
cat .deploy-logs/deployment-20260612-143022.log
```

## Common Issues

### "Working tree is not clean"
Your branch has uncommitted changes. Either:
```bash
git status                    # see what changed
git add .                     # stage changes
git commit -m "your message"  # commit
./scripts/deploy.sh           # retry
```

Or force (use with caution):
```bash
./scripts/deploy.sh --force
```

### "TypeScript compilation failed"
Fix type errors:
```bash
npm exec tsc --noEmit         # see errors
# fix files...
./scripts/deploy.sh           # retry
```

### "Build failed"
Check for syntax/import errors:
```bash
npm run build                 # see full error
# fix the issue...
./scripts/deploy.sh           # retry
```

### "Health check failed (app not responding)"
Vercel deployment is still in progress. Options:
1. Wait 2-3 minutes and run health check manually:
   ```bash
   curl https://zing-connect.vercel.app
   ```
2. Check Vercel dashboard for build errors:
   https://vercel.com/dashboard

3. Rollback and investigate:
   ```bash
   git revert HEAD
   git push origin main
   ```

### "Failed to push to Vercel"
Check credentials and connectivity:
```bash
git push origin main          # try manually
git status                    # verify remote
git remote -v                 # show remote URL
```

## Safety Features

1. **Pre-flight checks**: Blocks deployment if git is dirty
2. **Build verification**: Ensures TypeScript and Vite pass
3. **Smoke tests**: Verifies app is actually live
4. **Rollback option**: One-command revert to previous version
5. **Comprehensive logging**: Every step logged for audit trail
6. **Team safety**: Anyone can deploy (script has all safety checks)

## Advanced: Manual Deployment

If the script fails catastrophically:

```bash
# 1. Verify code is ready
npm run build
git status

# 2. Push to Vercel
git push origin main

# 3. Check Vercel deployment
open https://vercel.com/dashboard

# 4. Manual health check
curl https://zing-connect.vercel.app

# 5. If broken, revert manually
git log --oneline -5
git revert <bad-commit-hash>
git push origin main
```

## Troubleshooting Checklist

- [ ] Is main branch green on GitHub/Vercel?
- [ ] Are all environment variables set in Vercel?
- [ ] Did the build succeed in Vercel dashboard?
- [ ] Is the app actually loading at the Vercel URL?
- [ ] Check browser console for JS errors
- [ ] Check Supabase dashboard for connection issues
- [ ] Review recent Vercel deployment logs

## Team Workflow

**Before Deploying:**
1. Ensure all PRs are reviewed and merged to main
2. Run locally: `npm run dev` and test key flows
3. Review: `.deploy-logs/deployment-*.log` from last deployment

**Deploying:**
1. Run: `./scripts/deploy.sh`
2. Monitor console output
3. If prompted for rollback, read error message carefully

**After Deploying:**
1. Verify app at https://zing-connect.vercel.app
2. Test key user flows (signup, search, booking)
3. Check Vercel dashboard for metrics
4. Post deployment summary in #engineering Slack

## Vercel Integration

The script assumes:
- Vercel CLI is installed (may not be needed for git push deployment)
- git push origin main triggers Vercel deployment
- App URL is https://zing-connect.vercel.app
- Environment variables pre-configured in Vercel dashboard

To verify Vercel is configured:
```bash
# Check .git/config for remote
git remote -v

# Should show Vercel's git provider or GitHub
```

---

**Script Location:** `/scripts/deploy.sh`  
**Checklist:** `/scripts/deploy-checklist.md`  
**Last Updated:** 2026-06-12  
**Maintained By:** Product Engineering Team
