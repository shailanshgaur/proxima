# Proxima Pre-Launch Tests Guide

## Overview

The `pre-launch-tests.sh` script is a comprehensive test suite that validates all critical systems before launching the Proxima marketplace to production. It tests database constraints, authentication, booking flows, row-level security (RLS), performance, and data integrity.

## Test Coverage

### 1. Database Constraints (2 tests)
- **UNIQUE Review Constraint**: Verifies `(resident_id, vendor_id)` uniqueness on reviews table
- **Booking Required Fields**: Validates all required fields are enforced at database level
- **Review Uniqueness**: Ensures one review per booking

### 2. Authentication Tests (2 tests)
- **Phone Signup with OTP**: Validates phone number format and OTP workflow
- **Session Management**: Verifies session tokens are created and persist across requests

### 3. Booking Flow Tests (3 tests)
- **Create Booking**: Tests booking creation with all required fields
- **Photo Upload**: Validates file upload to Supabase Storage
- **Vendor Rating**: Verifies automatic vendor rating recalculation after review

### 4. Row-Level Security Tests (2 tests)
- **Resident Isolation**: Confirms resident A cannot access resident B's bookings
- **Society Isolation**: Ensures vendors are only visible within assigned societies

### 5. Performance Tests (4 tests)
- **Vendor Search**: Measures latency on vendor list queries (target: <500ms)
- **Booking List**: Measures latency on resident's booking history (target: <500ms)
- **Review Aggregation**: Measures latency on rating calculations (target: <500ms)
- **User Profile**: Measures latency on profile fetch (target: <100ms)

### 6. Data Integrity Tests (included in other categories)
- Field validation and type checking
- Constraint enforcement
- Foreign key relationships

### 7. Configuration Tests (2 tests)
- **Environment Variables**: Verifies SUPABASE_URL and SUPABASE_ANON_KEY are set
- **Secret Management**: Ensures no API keys are leaked in logs

### 8. Connectivity Tests (2 tests)
- **Database Connectivity**: HTTP health check on Supabase REST API
- **Auth Service Connectivity**: Validates Auth service is reachable

## Running the Tests

### Prerequisites

1. **Set Environment Variables**

```bash
export SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_ANON_KEY="your-anon-key-here"
export SUPABASE_SERVICE_KEY="your-service-key-here"  # Optional, for admin queries
```

2. **Ensure Curl is Available**
The script uses `curl` for HTTP requests. Verify it's installed:

```bash
which curl
```

### Running Locally

```bash
# From project root
bash scripts/pre-launch-tests.sh

# Or make it executable first
chmod +x scripts/pre-launch-tests.sh
./scripts/pre-launch-tests.sh
```

### Running in CI/CD

For GitHub Actions, GitLab CI, or other CI systems:

```yaml
# Example: .github/workflows/pre-launch-tests.yml
name: Pre-Launch Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    env:
      SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
      SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
      SUPABASE_SERVICE_KEY: ${{ secrets.SUPABASE_SERVICE_KEY }}
    steps:
      - uses: actions/checkout@v3
      - name: Run Pre-Launch Tests
        run: bash scripts/pre-launch-tests.sh
```

### Output

The script produces:
1. **Console Output**: Real-time test results with pass/fail status
2. **Test Log File**: Detailed logs in `/tmp/proxima_test_*.log`
3. **Summary Report**: Final report with metrics and next steps

Example output:
```
============================================================================
PROXIMA PRE-LAUNCH TEST REPORT
============================================================================
Test Suite: Pre-Launch Validation
Generated: Thu Jun 12 14:32:45 UTC 2026
Duration: 12s

SUMMARY
-------
Total Tests:    16
Passed:         15
Failed:         1
Success Rate:   93%

Status: TESTS FAILED

TEST CATEGORIES
...
```

## Test Details

### Database Constraints Test

Verifies the critical constraint that prevents duplicate reviews from the same resident for the same vendor:

```sql
-- This constraint is verified:
ALTER TABLE reviews 
ADD CONSTRAINT unique_resident_vendor 
UNIQUE (resident_id, vendor_id);
```

### Auth Flow Test

Validates the signup flow:
1. Phone number validation (Indian format: 10 digits)
2. OTP sending via Supabase Auth
3. OTP verification (6-digit token)
4. User profile creation with validated inputs

### Booking Flow Test

Tests the complete booking lifecycle:
1. Create booking with resident, vendor, date/time
2. Generate WhatsApp link for vendor confirmation
3. Upload photo evidence after service
4. Submit rating and create review
5. Vendor rating auto-updates

### RLS Test

Validates Row-Level Security policies:

```sql
-- Resident can only see their own bookings
CREATE POLICY "Residents see own bookings" 
  ON bookings FOR SELECT 
  USING (resident_id = auth.uid());

-- Vendors can only see their own bookings
CREATE POLICY "Vendors see own bookings" 
  ON bookings FOR SELECT 
  USING (vendor_id = auth.uid());
```

### Performance Tests

Latency measurements are taken for key queries:

| Query | Target | Purpose |
|-------|--------|---------|
| Vendor search | <500ms | Discovery speed |
| Booking list | <500ms | Resident dashboard |
| Review aggregation | <500ms | Vendor rating calculation |
| User profile | <100ms | Auth/profile fetch |

**How to optimize** if tests fail:
- Add database indexes on frequently queried columns
- Implement query pagination for large result sets
- Cache aggregation results with periodic updates
- Use materialized views for complex queries

## Idempotency

The script is designed to be **idempotent** — it can run multiple times safely:

1. **No data modification**: Test queries are read-only
2. **Cleanup**: Test data files are cleaned up after each run
3. **Isolated data**: Each run uses unique temporary files
4. **Safe failures**: Script doesn't leave broken state

To run multiple times:
```bash
for i in {1..5}; do bash scripts/pre-launch-tests.sh; done
```

## Integration with CI/CD

### GitHub Actions Example

Add to `.github/workflows/pre-launch.yml`:

```yaml
name: Pre-Launch Validation

on:
  push:
    branches: [main]
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM

jobs:
  pre-launch-tests:
    runs-on: ubuntu-latest
    
    services:
      supabase:
        image: supabase/postgres:latest
        env:
          POSTGRES_DB: postgres
          POSTGRES_PASSWORD: password
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    env:
      SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
      SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
      SUPABASE_SERVICE_KEY: ${{ secrets.SUPABASE_SERVICE_KEY }}
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Run Pre-Launch Tests
        run: bash scripts/pre-launch-tests.sh
      
      - name: Upload Test Logs
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: test-logs
          path: /tmp/proxima_test_*.log
```

## Troubleshooting

### Tests Fail with "Missing Supabase environment variables"

**Solution**: Set environment variables before running:
```bash
export SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_ANON_KEY="your-anon-key"
```

### Database connectivity fails

**Solution**: Verify Supabase project is active:
1. Check Supabase Dashboard
2. Ensure project is not paused
3. Verify URL is correct (no typos)
4. Check firewall rules allow outbound HTTPS

### Auth service returns 422 error

**Solution**: Expected behavior for invalid phone numbers. Tests handle this gracefully.

### Performance tests timeout

**Solution**: 
1. Check database query performance
2. Add indexes to slow tables
3. Increase timeout thresholds in script (edit `test_*_latency` functions)

### RLS tests report failures

**Solution**: Verify RLS policies exist:
```sql
-- Check policies are enabled
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename IN ('bookings', 'reviews');
```

## Pre-Launch Checklist

Before production launch, ensure:

- [ ] All automated tests pass (run `bash scripts/pre-launch-tests.sh`)
- [ ] RLS policies are tested with real user accounts
- [ ] Database backups are configured
- [ ] Monitoring and alerting are set up
- [ ] Error logging is configured (Sentry, LogRocket, etc.)
- [ ] Rate limiting is enabled on all APIs
- [ ] CORS is properly configured
- [ ] SSL certificates are valid
- [ ] Environment variables are set in production
- [ ] Database indexes are optimized
- [ ] API response times meet SLA
- [ ] Load testing has been performed
- [ ] Security audit has been completed
- [ ] Terms of Service and Privacy Policy are final

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Supabase RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Performance](https://supabase.com/docs/guides/database/performance)
- [Proxima Architecture](../docs/ARCHITECTURE.md)
- [Database Schema](../docs/DATABASE.md)

## Questions?

For questions about the test suite, contact:
- Architecture Agent (scalability)
- Security Agent (RLS, secrets)
- Product Agent (test coverage)

---

**Last Updated**: 2026-06-12  
**Version**: 1.0 (MVP)
