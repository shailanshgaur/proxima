# Testing the Deployment Script

Guide for validating the deploy script before using it in production.

## Prerequisites

```bash
# Ensure you're in project root
cd /Users/shailanshgaur/LZ\ Project/Proxima

# Verify script exists
ls -la scripts/deploy.sh

# Make executable
chmod +x scripts/deploy.sh
```

## Test 1: Dry Run (Safe - No Push)

Simulates the entire deployment without actually pushing to Vercel.

```bash
# Run with --dry-run flag
./scripts/deploy.sh --dry-run
```

Expected output:
- ✓ Pre-flight checks pass
- ✓ TypeScript compilation succeeds
- ✓ Build verification passes
- ✓ Reports "Would execute: git push origin main" (no actual push)
- ✓ Exit code 0 (success)

Log file created: `.deploy-logs/deployment-YYYYMMDD-HHMMSS.log`

## Test 2: Health Check Script

Verify the health check utility works.

```bash
# Quick health check
./scripts/health-check.sh

# Verbose output
./scripts/health-check.sh --verbose

# Check against specific endpoint (if needed)
./scripts/health-check.sh --endpoint https://zing-connect.vercel.app
```

Expected output:
- ✓ Connectivity test passes
- ✓ HTTP 200 status
- ✓ Response time shown
- ✓ Content verification passes
- ✓ Final status: HEALTHY

## Test 3: Skip Build Checks

Test the `--skip-tests` flag (useful for CI/CD pipelines).

```bash
./scripts/deploy.sh --skip-tests --dry-run
```

Expected behavior:
- Skips TypeScript check
- Skips Vite build
- Proceeds directly to deployment simulation
- Shows "Skipping TypeScript check" warning
- Shows "Skipping build verification" warning

## Test 4: Force Deploy

Test the `--force` flag to skip git status checks.

```bash
# Create a test uncommitted change
echo "test" > test-file.txt

# Try normal deploy (should fail)
./scripts/deploy.sh --dry-run
# Should fail with: "Working tree is not clean"

# Now use --force flag
./scripts/deploy.sh --force --dry-run
# Should proceed despite uncommitted changes

# Clean up
rm test-file.txt
```

Expected behavior:
- Normal deploy blocked with warning
- Force deploy proceeds with "Proceeding despite uncommitted changes" warning

## Test 5: Build Verification Alone

Test that the build system actually works.

```bash
# Clean previous build
rm -rf dist/

# Run build
npm run build

# Verify dist directory exists
ls -la dist/

# Check bundle size
du -sh dist/

# TypeScript check
npm exec tsc --noEmit
```

Expected output:
- No TypeScript errors
- No build errors
- dist/ folder created
- Bundle size reasonable (< 500KB for Vite + React app)

## Test 6: Git Status Check

Verify the git status checks work correctly.

```bash
# Check current branch (should be main or master)
git branch -v

# Check working tree status (should be clean)
git status

# If not clean, see what changed
git diff
git status --porcelain
```

Expected output:
```
On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean
```

## Test 7: Log Rotation

Verify logs are created and rotated properly.

```bash
# Check log directory
ls -lht .deploy-logs/

# View recent deployments
cat .deploy-logs/deployment-*.log | head -50

# Count total logs
ls .deploy-logs/deployment-*.log | wc -l
```

Expected behavior:
- Log files created with timestamp
- Each run creates new log file
- Old logs auto-deleted when > 10 files
- All output captured in logs

## Test 8: Manual Rollback Test

Test the rollback procedure manually (don't actually push).

```bash
# View recent commits
git log --oneline -5

# Create a test commit
echo "test" > test-rollback.txt
git add test-rollback.txt
git commit -m "Test rollback commit"

# Simulate what rollback would do (don't push)
git revert HEAD --no-edit

# View the revert
git log --oneline -5

# Clean up (reset to before test)
git reset --hard HEAD~2
```

Expected behavior:
- Revert commit created successfully
- Commit message shows revert information
- git log shows both original and revert commits

## Test 9: Integration Test (With Staging)

If you have a staging environment, do a full test deploy there.

```bash
# 1. Create a test branch
git checkout -b test/deployment-script

# 2. Make a small safe change (e.g., add comment to a file)
# 3. Commit change
git commit -m "Test deployment script"

# 4. Run deployment (this will push to staging)
./scripts/deploy.sh

# 5. Monitor the deployment
# - Check Vercel dashboard
# - Wait for build to complete
# - Verify app loads

# 6. Cleanup
git checkout main
git branch -D test/deployment-script
```

Expected behavior:
- Script completes successfully
- Vercel receives git push
- Build starts automatically
- App deploys and loads

## Test 10: Error Handling

Test that errors are handled gracefully.

### Test 10a: TypeScript Error

```bash
# Introduce a type error
echo "const x: string = 123;" >> src/main.tsx

# Run deploy
./scripts/deploy.sh --dry-run

# Should fail with: "TypeScript compilation failed"
# Exit code: 2

# Clean up
git checkout src/main.tsx
```

### Test 10b: Build Error

```bash
# Break an import
echo "import { nonexistent } from 'fake-module';" >> src/main.tsx

# Run deploy
./scripts/deploy.sh --dry-run

# Should fail with: "Build failed"
# Exit code: 2

# Clean up
git checkout src/main.tsx
```

### Test 10c: Git Dirty

```bash
# Create uncommitted change
echo "test" > uncommitted.txt

# Run deploy without --force
./scripts/deploy.sh --dry-run

# Should fail with: "Working tree is not clean"
# Exit code: 1

# Clean up
rm uncommitted.txt
```

## Test Checklist

Print and check off:

```
[ ] Test 1: Dry run completes successfully
[ ] Test 2: Health check script works
[ ] Test 3: --skip-tests flag works
[ ] Test 4: --force flag works
[ ] Test 5: Build system works
[ ] Test 6: Git status checks work
[ ] Test 7: Logs created and rotated
[ ] Test 8: Rollback procedure understood
[ ] Test 9: Integration test passes (if staging available)
[ ] Test 10a: TypeScript errors caught
[ ] Test 10b: Build errors caught
[ ] Test 10c: Git dirty state caught
```

## Debugging Failed Tests

If a test fails:

1. **Check logs:**
   ```bash
   tail -100 .deploy-logs/deployment-*.log
   ```

2. **Run components individually:**
   ```bash
   npm run build              # Test build
   npm exec tsc --noEmit      # Test TypeScript
   git status                 # Test git
   ```

3. **Check environment:**
   ```bash
   npm --version
   node --version
   git --version
   git config user.email
   git config user.name
   ```

4. **Review script output:**
   ```bash
   bash -x ./scripts/deploy.sh --dry-run
   ```
   (Enables debug mode, shows every command)

## Performance Testing

Verify deployment completes within expected time:

```bash
# Measure deployment time
time ./scripts/deploy.sh --dry-run

# Expected:
# - Pre-checks: 10-30s
# - TypeScript: 20-40s
# - Build: 30-60s
# - Smoke tests: 30-60s
# Total: 2-5 minutes
```

## Production Readiness Checklist

Before deploying to production:

```
[ ] All tests pass
[ ] Team has reviewed DEPLOY_README.md
[ ] Team has reviewed DEPLOY_QUICK_REF.txt
[ ] Rollback procedure practiced
[ ] Vercel project configured correctly
[ ] Environment variables set in Vercel
[ ] Log directory writable (.deploy-logs/)
[ ] Scripts have correct permissions (chmod +x)
[ ] Team trained on deployment process
```

## Quick Test Summary

For a quick validation, run this:

```bash
# Complete test sequence (5-10 minutes)
set -e
./scripts/deploy.sh --dry-run
./scripts/health-check.sh
npm run build
npm exec tsc --noEmit
echo "All tests passed!"
```

---

**Last Updated:** 2026-06-12
**Test Environment:** macOS / Linux
**Tested With:** Node 18+, npm 9+
