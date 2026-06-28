# Testing Strategy - Proxima Marketplace

## Overview

Proxima uses a comprehensive testing strategy to ensure reliability, security, and performance before launch. This document outlines all testing approaches and how to run them.

## Test Suites

### 1. Pre-Launch Tests (`scripts/pre-launch-tests.sh`)

**Purpose**: Verify all critical systems are working before production deployment

**Coverage**:
- Database constraints (UNIQUE review constraint)
- Authentication flow (phone signup, OTP, session management)
- Booking workflow (create, photo upload, rating)
- Row-Level Security (resident isolation, society-based access)
- Performance metrics (query latency <500ms)
- Data integrity (required fields, constraints)
- Configuration validation (env vars, secrets management)
- Service connectivity (database, Auth service)

**Run locally**:
```bash
bash scripts/pre-launch-tests.sh
```

**Run in CI/CD**:
```yaml
- name: Run Pre-Launch Tests
  run: bash scripts/pre-launch-tests.sh
```

**What it tests**:

| Component | Test | Requirement |
|-----------|------|-------------|
| Database | UNIQUE constraint (resident_id, vendor_id) on reviews | Prevents duplicate reviews |
| Auth | Phone signup, OTP verification, session creation | Users can register and stay logged in |
| Booking | Create, update status, upload photo | Complete booking lifecycle works |
| Reviews | Create, automatic vendor rating update | Ratings are accurate and current |
| RLS | Resident A cannot see resident B's data | Data is properly isolated |
| Performance | Vendor search <500ms, profile fetch <100ms | Users see fast responses |
| Security | No secrets in logs, env vars configured | Production-safe deployment |

### 2. Integration Tests

Located in `src/__tests__/integration/` (to be created)

**Purpose**: Test complete user flows across multiple services

**Examples**:
- Full signup flow: phone → OTP → profile → session
- Full booking flow: search → create → confirm → rate
- Review flow: submit rating → vendor rating updates

```bash
npm test -- integration
```

### 3. Unit Tests

Located in `src/__tests__/unit/` (to be created)

**Purpose**: Test individual functions and components

**Examples**:
- Phone number validation (authService.ts)
- Booking status transitions
- Review rating aggregation
- RLS policy enforcement

```bash
npm test -- unit
```

### 4. End-to-End Tests (E2E)

Located in `e2e/` (to be created)

**Purpose**: Test complete user journeys in a browser

**Tools**: Playwright or Cypress

**Examples**:
- Resident signup, login, search, book, rate
- Vendor receives booking, confirms, completes service
- Admin approves appeals

```bash
npm run test:e2e
```

### 5. Performance Tests

Located in `scripts/performance-tests.sh` (to be created)

**Purpose**: Measure query performance and identify bottlenecks

**Measures**:
- Database query latency
- API response times
- Page load times
- Bundle size

```bash
bash scripts/performance-tests.sh
```

### 6. Security Tests

Located in `scripts/security-tests.sh` (to be created)

**Purpose**: Validate security controls

**Checks**:
- RLS policies prevent unauthorized access
- Input validation blocks injection attacks
- Authentication is required for protected endpoints
- Secrets are not logged
- CORS is properly configured

```bash
bash scripts/security-tests.sh
```

## Test Data Management

### Test Fixtures (`scripts/test-fixtures.sh`)

Provides utilities to create and destroy test data:

```bash
source scripts/test-fixtures.sh

# Create test data
resident_id=$(create_test_resident "$society_id")
vendor_id=$(create_test_vendor "Test Vendor")
booking_id=$(create_test_booking "$resident_id" "$vendor_id" "$society_id")

# Run test
# ...

# Cleanup
cleanup_all_test_data
```

### Idempotency

All tests are idempotent - they can run multiple times safely:
- Test data is isolated (unique IDs)
- Cleanup runs automatically
- No persistent side effects
- Read-only where possible

## CI/CD Integration

### GitHub Actions Workflow (`.github/workflows/pre-launch-tests.yml`)

Automatically runs:

1. **On every push to main/staging**
2. **On every pull request**
3. **Daily at 2 AM UTC (scheduled)**

Runs:
- Pre-launch test suite
- Database health checks
- Security validation
- Performance baseline
- Build size checks

**Example output**:
```
Pre-Launch Tests: PASSED (15/15)
Database Checks: PASSED
Security Checks: PASSED
Performance Baseline: PASSED
Build Size: 245KB
```

## Running Tests Locally

### Setup

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with Supabase credentials
export $(cat .env.local | xargs)
```

### Run All Tests

```bash
npm test
```

### Run Specific Test Suite

```bash
# Pre-launch validation
bash scripts/pre-launch-tests.sh

# Unit tests
npm test -- unit --watch

# Integration tests
npm test -- integration

# E2E tests
npm run test:e2e

# Security tests
bash scripts/security-tests.sh --report

# Performance tests
bash scripts/performance-tests.sh
```

### Run Tests in CI Mode

```bash
npm test -- --ci --coverage
```

## Test Coverage Goals

| Component | Target Coverage |
|-----------|-----------------|
| Services | >80% |
| Components | >70% |
| Utils | >90% |
| Overall | >75% |

Generate coverage report:
```bash
npm test -- --coverage --collectCoverageFrom='src/**/*.{ts,tsx}'
```

## Pre-Launch Checklist

Before deploying to production, ensure:

- [ ] All unit tests pass (`npm test`)
- [ ] All integration tests pass (`npm test -- integration`)
- [ ] Pre-launch script passes (`bash scripts/pre-launch-tests.sh`)
- [ ] Security tests pass (`bash scripts/security-tests.sh`)
- [ ] Performance tests pass (`bash scripts/performance-tests.sh`)
- [ ] E2E tests pass with real test accounts
- [ ] Code coverage meets targets (>75%)
- [ ] No console errors or warnings
- [ ] No secrets in code or logs
- [ ] Database migrations are reversible
- [ ] Backups are configured
- [ ] Monitoring is set up
- [ ] Error tracking is configured

## Test Results Interpretation

### Pre-Launch Script Exit Codes

- `0`: All tests passed, safe to deploy
- `1`: One or more tests failed, investigate before deploying

### Common Failures and Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| Database connectivity failed | Supabase project paused | Resume project in Supabase dashboard |
| Missing environment variables | SUPABASE_URL not set | `export SUPABASE_URL=...` |
| RLS test fails | Policies not enabled | Enable RLS in Supabase Auth settings |
| Performance test slow | Missing indexes | Run `CREATE INDEX ...` for hot tables |
| Auth service returns 422 | Expected behavior | Tests handle this correctly |
| Secrets exposed in logs | Logging too verbose | Check log configuration |

## Performance Targets

| Query | Target | Action if Exceeded |
|-------|--------|-------------------|
| Vendor search | <500ms | Add indexes, pagination |
| Booking list | <500ms | Add indexes, pagination |
| User profile | <100ms | Cache, optimize query |
| Review aggregation | <500ms | Use materialized view |

## Security Testing

### RLS Policy Validation

```bash
# Test resident isolation
./scripts/test-rls-isolation.sh

# Expected output:
# - Resident A sees only own bookings
# - Resident A cannot see resident B's data
# - Vendor A cannot see vendor B's bookings
```

### Secret Scanning

```bash
# Check for exposed secrets
git grep -i "apikey\|secret\|password" -- src/

# Should return nothing (except env variable references)
```

### Input Validation

```bash
# Test invalid phone numbers
curl -X POST /auth/signup -d '{"phone":"invalid"}'
# Should return 400 Bad Request

# Test SQL injection
curl -X POST /reviews -d '{"text":"'; DROP TABLE reviews; --"}'
# Should be sanitized/escaped
```

## Continuous Monitoring

### Production Monitoring Setup

After launch, monitor:
- Database query performance (Supabase dashboard)
- API response times (error tracking tool)
- Error rates (error tracking tool)
- User session health (Auth metrics)
- RLS policy violations (audit logs)

### Alerting Rules

Set up alerts for:
- Query latency > 1 second
- Error rate > 1%
- Failed authentication attempts > 10/minute
- Database connection failures

## Resources

- [Testing Best Practices](https://testing-library.com/docs/queries/about)
- [Supabase Testing Guide](https://supabase.com/docs/guides/testing)
- [RLS Testing](https://supabase.com/docs/guides/auth/row-level-security#testing)
- [Playwright Documentation](https://playwright.dev)
- [Jest Documentation](https://jestjs.io)

## Contact

For testing questions:
- Architecture: Scalability, performance tests
- Security: RLS validation, secret management
- Product: Test coverage, user flows

---

**Last Updated**: 2026-06-12  
**Version**: 1.0 (MVP)
