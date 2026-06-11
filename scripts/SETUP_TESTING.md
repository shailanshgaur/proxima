# Setting Up Pre-Launch Testing

Complete guide to configure and run the Proxima pre-launch test suite.

## Prerequisites

- Bash shell (macOS, Linux, or WSL on Windows)
- `curl` command-line tool
- Active Supabase project
- Environment variables configured

## Step 1: Get Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your Proxima project
3. Navigate to **Settings** → **API**
4. Copy:
   - **Project URL** (SUPABASE_URL)
   - **Anon Key** (SUPABASE_ANON_KEY)
   - **Service Role Key** (SUPABASE_SERVICE_KEY)

Example values:
```
SUPABASE_URL = https://abcdefgh.supabase.co
SUPABASE_ANON_KEY = eyJhbGc...  (long string)
SUPABASE_SERVICE_KEY = eyJhbGc...  (longer string)
```

## Step 2: Configure Environment

### Option A: Using .env file (recommended for local development)

```bash
# Create or edit .env.local
cat > .env.local <<EOF
SUPABASE_URL=https://abcdefgh.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_KEY=your-service-key-here
EOF

# Load environment
export $(cat .env.local | xargs)
```

### Option B: Using environment variables directly

```bash
export SUPABASE_URL="https://abcdefgh.supabase.co"
export SUPABASE_ANON_KEY="your-anon-key-here"
export SUPABASE_SERVICE_KEY="your-service-key-here"
```

### Option C: Using GitHub Secrets (for CI/CD)

In GitHub repository settings:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Create new repository secrets:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_KEY`

These are automatically injected into CI/CD workflows.

## Step 3: Verify Configuration

```bash
# Test Supabase connectivity
curl -s -H "apikey: ${SUPABASE_ANON_KEY}" \
  "${SUPABASE_URL}/rest/v1/" | head -20

# Should return: {"message":"No Content"}
```

## Step 4: Make Test Script Executable

```bash
chmod +x scripts/pre-launch-tests.sh
chmod +x scripts/test-fixtures.sh
```

## Step 5: Run Pre-Launch Tests

### Local Run

```bash
# From project root
bash scripts/pre-launch-tests.sh

# Or use the executable
./scripts/pre-launch-tests.sh
```

### Expected Output

```
[14:32:45] Proxima Pre-Launch Test Suite Starting...
[14:32:45] Supabase URL: https://abcdefgh.supabase.co

==== CONNECTIVITY TESTS ====
[PASS] Database connectivity verified (HTTP 200)
[PASS] Auth service connectivity verified (HTTP 422)

==== CONFIGURATION TESTS ====
[PASS] All required environment variables are set
[PASS] No secrets detected in test output

... (more tests)

============================================================================
PROXIMA PRE-LAUNCH TEST REPORT
============================================================================
Total Tests:    16
Passed:         15
Failed:         1
Success Rate:   93%

Status: TESTS PASSED
```

### Exit Codes

- Exit code **0**: All tests passed
- Exit code **1**: One or more tests failed

## Step 6: View Test Logs

```bash
# List recent test logs
ls -lh /tmp/proxima_test_*.log | tail -5

# View latest test log
cat /tmp/proxima_test_*.log | tail -100

# Search for failures in logs
grep "\[FAIL\]" /tmp/proxima_test_*.log
```

## Step 7: CI/CD Setup (GitHub Actions)

The workflow file is pre-configured at `.github/workflows/pre-launch-tests.yml`

### Enable Workflow

1. Ensure `.github/workflows/pre-launch-tests.yml` exists (it's included)
2. Go to **Actions** tab in GitHub
3. Click **"Pre-Launch Tests"** workflow
4. Click **"Enable workflow"**

### Verify Secrets Are Set

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Verify all three secrets exist:
   - SUPABASE_URL
   - SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_KEY

### View Workflow Runs

1. Go to **Actions** tab
2. Click **"Pre-Launch Tests"** workflow
3. View all runs with their status

## Step 8: Customize Test Configuration (Optional)

### Change Performance Targets

Edit `scripts/pre-launch-tests.sh`:

```bash
# Find these lines and adjust thresholds:
if [ "$latency" -lt 500 ]; then
  success "Vendor search latency: ${latency}ms (target: <500ms)"
```

Change `500` to your desired target (in milliseconds).

### Add Custom Tests

Add new test function to `scripts/pre-launch-tests.sh`:

```bash
test_my_custom_test() {
  ((TOTAL_TESTS++))
  log "TEST: My custom validation"

  # Your test logic here
  if [ condition_true ]; then
    success "My test passed"
  else
    fail "My test failed"
  fi
}
```

Then call it from `main()`:

```bash
main() {
  # ... other tests ...
  log "==== CUSTOM TESTS ===="
  test_my_custom_test
  # ... rest of main ...
}
```

## Troubleshooting

### Error: "Missing Supabase environment variables"

**Problem**: SUPABASE_URL or SUPABASE_ANON_KEY not set

**Solution**:
```bash
# Check if variables are set
echo $SUPABASE_URL
echo $SUPABASE_ANON_KEY

# If empty, set them:
export SUPABASE_URL="https://abcdefgh.supabase.co"
export SUPABASE_ANON_KEY="your-key-here"
```

### Error: "Database connectivity failed (HTTP 0)"

**Problem**: Cannot reach Supabase server

**Possible causes**:
- Supabase project is paused
- Network connectivity issue
- Wrong URL format
- Firewall blocking requests

**Solution**:
```bash
# Check URL format
echo $SUPABASE_URL
# Should be: https://something.supabase.co

# Test with curl directly
curl -v "$SUPABASE_URL/rest/v1/"

# Check Supabase dashboard - is project active?
```

### Error: "curl: command not found"

**Problem**: curl is not installed

**Solution**:

macOS:
```bash
brew install curl
```

Linux:
```bash
sudo apt-get install curl
```

WSL (Windows):
```bash
sudo apt-get install curl
```

### Error: "Permission denied"

**Problem**: Script is not executable

**Solution**:
```bash
chmod +x scripts/pre-launch-tests.sh
chmod +x scripts/test-fixtures.sh
```

### Tests timeout or run slowly

**Problem**: Database queries are taking too long

**Solutions**:
1. Check Supabase database status
2. Verify database has test data (tables exist)
3. Increase timeout values (edit `pre-launch-tests.sh`)
4. Run tests at off-peak hours

### GitHub Actions workflow doesn't run

**Problem**: Workflow is not executing automatically

**Solutions**:
1. Verify workflow file exists: `.github/workflows/pre-launch-tests.yml`
2. Check repository secrets are set (Settings → Secrets)
3. Go to Actions tab and manually trigger workflow
4. Check workflow syntax: `git push` triggers on main/staging branches

## Advanced Configuration

### Run Tests Periodically

Set schedule in `.github/workflows/pre-launch-tests.yml`:

```yaml
schedule:
  - cron: '0 2 * * *'  # Every day at 2 AM UTC
  - cron: '0 12 * * 0' # Every Sunday at 12 PM UTC
```

### Send Slack Notifications

Add to GitHub Actions workflow:

```yaml
- name: Slack Notification
  if: failure()
  uses: slackapi/slack-github-action@v1
  with:
    webhook-url: ${{ secrets.SLACK_WEBHOOK_URL }}
    payload: |
      {
        "text": "Pre-launch tests failed",
        "blocks": [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "Pre-launch tests failed in branch ${{ github.ref }}"
            }
          }
        ]
      }
```

### Run Tests Locally with Docker

```bash
docker run -it -e SUPABASE_URL -e SUPABASE_ANON_KEY \
  -v $(pwd):/app \
  -w /app \
  ubuntu:latest \
  bash scripts/pre-launch-tests.sh
```

## Performance Optimization

If tests run slowly:

1. **Parallel execution**: Run multiple test groups in parallel
2. **Caching**: Cache API responses between test runs
3. **Sampling**: Run subset of tests on every push, full suite daily

Example - parallel execution:

```bash
# Run tests in background
bash scripts/pre-launch-tests.sh &
bash scripts/security-tests.sh &
bash scripts/performance-tests.sh &

# Wait for all to complete
wait
```

## Next Steps

After completing setup:

1. [ ] Run `bash scripts/pre-launch-tests.sh` locally (should pass)
2. [ ] Push code to trigger GitHub Actions
3. [ ] Verify workflow runs successfully
4. [ ] Check logs in GitHub Actions tab
5. [ ] Set up email/Slack notifications
6. [ ] Schedule daily test runs
7. [ ] Document any custom tests added

## Support

For issues or questions:

1. Check [TESTING.md](../TESTING.md) for general testing info
2. Check [PRE_LAUNCH_TESTS_GUIDE.md](PRE_LAUNCH_TESTS_GUIDE.md) for test details
3. Review Supabase documentation: https://supabase.com/docs
4. Contact: Product/Security/Architecture agents

---

**Last Updated**: 2026-06-12  
**Version**: 1.0 (MVP)
