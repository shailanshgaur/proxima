# Pre-Launch Tests - Quick Reference

## One-Line Setup

```bash
export SUPABASE_URL="https://xxx.supabase.co" && \
export SUPABASE_ANON_KEY="xxx" && \
export SUPABASE_SERVICE_KEY="xxx" && \
bash scripts/pre-launch-tests.sh
```

## Test Execution Commands

### Run Tests Locally
```bash
bash scripts/pre-launch-tests.sh
```

### Run Tests with Verbose Output
```bash
bash scripts/pre-launch-tests.sh 2>&1 | tee test-output.txt
```

### Run Tests in Background
```bash
bash scripts/pre-launch-tests.sh &
wait
```

### Check Test Results
```bash
echo $?  # 0 = PASS, 1 = FAIL
tail -50 /tmp/proxima_test_*.log
```

## Environment Variables

### Required (2)
```bash
SUPABASE_URL              # https://xxx.supabase.co
SUPABASE_ANON_KEY         # anon key from Supabase dashboard
```

### Optional (1)
```bash
SUPABASE_SERVICE_KEY      # service role key (for admin queries)
```

### Set from File
```bash
export $(cat .env.local | xargs)
```

### Verify Set
```bash
env | grep SUPABASE
```

## Test Categories (16 tests)

| # | Category | Tests | Pass |
|---|----------|-------|------|
| 1 | Connectivity | 2 | DB + Auth |
| 2 | Configuration | 2 | Env vars + secrets |
| 3 | Database | 3 | Constraints + fields |
| 4 | Authentication | 2 | Phone signup + session |
| 5 | Booking Flow | 3 | Create + photo + rating |
| 6 | RLS | 2 | Resident + society isolation |
| 7 | Performance | 4 | Vendor search + booking + review + profile |
| **Total** | | **16** | **All** |

## Key Files

| File | Purpose |
|------|---------|
| `scripts/pre-launch-tests.sh` | Main test script |
| `scripts/test-fixtures.sh` | Test data helpers |
| `scripts/PRE_LAUNCH_TESTS_GUIDE.md` | Complete guide |
| `scripts/SETUP_TESTING.md` | Setup instructions |
| `.github/workflows/pre-launch-tests.yml` | CI/CD automation |

## Common Issues & Fixes

### "Missing Supabase environment variables"
```bash
export SUPABASE_URL="https://xxx.supabase.co"
export SUPABASE_ANON_KEY="xxx"
```

### "Database connectivity failed"
```bash
# Check URL is correct
echo $SUPABASE_URL

# Check project is active in Supabase dashboard
# Ensure no typos in credentials
```

### "curl: command not found"
```bash
# macOS
brew install curl

# Linux
sudo apt-get install curl
```

### "Permission denied"
```bash
chmod +x scripts/pre-launch-tests.sh
```

## Performance Targets

| Query | Target | Test Name |
|-------|--------|-----------|
| Vendor search | <500ms | `test_vendor_search_latency` |
| Booking list | <500ms | `test_booking_list_latency` |
| Review aggregation | <500ms | `test_review_aggregation_latency` |
| User profile | <100ms | `test_user_profile_latency` |

## Expected Output

### Success
```
Status: ALL TESTS PASSED
Total Tests:    16
Passed:         16
Failed:         0
Success Rate:   100%
```

### Failure
```
Status: TESTS FAILED
Total Tests:    16
Passed:         15
Failed:         1
Success Rate:   93%
```

## Pre-Launch Checklist

- [ ] Environment variables set
- [ ] `bash scripts/pre-launch-tests.sh` exits with 0
- [ ] All 16 tests pass
- [ ] No FAIL lines in output
- [ ] Performance targets met (<500ms)
- [ ] GitHub Actions workflow runs successfully
- [ ] Database backup verified
- [ ] Monitoring configured
- [ ] Rollback plan documented

## CI/CD Integration

### GitHub Actions
- Runs on: push, PR, daily schedule
- Logs uploaded as artifacts
- Comments results on PRs

### Manual Trigger
Go to: GitHub → Actions → Pre-Launch Tests → Run workflow

## Test Data Management

### Create Test Data
```bash
source scripts/test-fixtures.sh
resident_id=$(create_test_resident "$society_id")
vendor_id=$(create_test_vendor "Test Vendor")
booking_id=$(create_test_booking "$resident_id" "$vendor_id" "$society_id")
```

### Cleanup
```bash
cleanup_all_test_data
```

## Log Files

### Location
```bash
/tmp/proxima_test_*.log
```

### View Latest
```bash
tail -100 /tmp/proxima_test_*.log
```

### Search for Errors
```bash
grep "\[FAIL\]" /tmp/proxima_test_*.log
grep "ERROR" /tmp/proxima_test_*.log
```

## Performance Tuning

### If Tests Timeout
1. Check database status
2. Run at off-peak hours
3. Increase timeout in script

### If Tests Fail (Slow Queries)
1. Add database indexes
2. Implement pagination
3. Cache aggregations

## Documentation

- **Setup**: `scripts/SETUP_TESTING.md`
- **Full Guide**: `scripts/PRE_LAUNCH_TESTS_GUIDE.md`
- **Testing Strategy**: `docs/testing/TESTING.md`
- **This File**: `scripts/QUICK_REFERENCE.md`

## Contacts

- **Scalability Issues**: Architecture Agent
- **Security Issues**: Security Agent
- **Test Coverage**: Product Agent

## Useful Commands

```bash
# Make executable
chmod +x scripts/pre-launch-tests.sh

# Run with logging
bash scripts/pre-launch-tests.sh 2>&1 | tee results.txt

# Check specific test
grep "test_vendor_search_latency" /tmp/proxima_test_*.log

# Count test results
grep "\[PASS\]" /tmp/proxima_test_*.log | wc -l

# Export logs
cp /tmp/proxima_test_*.log ./test-results.log

# Schedule test (cron)
0 2 * * * cd /path/to/proxima && bash scripts/pre-launch-tests.sh >> /var/log/proxima-tests.log 2>&1
```

## Exit Codes

```bash
0    # All tests passed - safe to deploy
1    # Tests failed - do not deploy
```

## Production Deployment Gates

Tests must pass:
1. Before merging to main
2. Before staging deployment
3. Before production deployment
4. Daily health check (scheduled)

---

**Last Updated**: 2026-06-12  
**Quick Ref Version**: 1.0
