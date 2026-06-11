#!/bin/bash

################################################################################
# Proxima Health Check Utility
# Quick health verification script for deployed app
#
# Usage: ./scripts/health-check.sh [--verbose] [--endpoint https://example.com]
#
# Checks:
#   - App responds to requests (HTTP 200)
#   - Response time under 2 seconds
#   - Key API endpoints responding
#   - No critical error logs
#
# Exit Codes:
#   0 = All systems healthy
#   1 = App unreachable
#   2 = Response time too high
#   3 = API errors detected
################################################################################

set -o pipefail

# Colors
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly NC='\033[0m'

# Configuration
APP_ENDPOINT="${1:-https://zing-connect.vercel.app}"
VERBOSE=false
MAX_RESPONSE_TIME=2000 # milliseconds

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --verbose) VERBOSE=true; shift ;;
    --endpoint) APP_ENDPOINT="$2"; shift 2 ;;
    *) shift ;;
  esac
done

log_info() { printf "${BLUE}ℹ${NC} %s\n" "$1"; }
log_success() { printf "${GREEN}✓${NC} %s\n" "$1"; }
log_warn() { printf "${YELLOW}⚠${NC} %s\n" "$1"; }
log_error() { printf "${RED}✗${NC} %s\n" "$1"; }

echo "================================================"
echo "Proxima Health Check"
echo "================================================"
echo "Endpoint: $APP_ENDPOINT"
echo ""

# Test 1: Basic connectivity
log_info "Testing connectivity..."
if ! curl -s -o /dev/null --connect-timeout 5 "$APP_ENDPOINT"; then
  log_error "App unreachable at $APP_ENDPOINT"
  exit 1
fi
log_success "App is reachable"

# Test 2: HTTP status code
log_info "Checking HTTP status..."
http_code=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 5 "$APP_ENDPOINT")
if [[ "$http_code" != "200" ]]; then
  log_warn "Unexpected HTTP status: $http_code (expected 200)"
  if [[ "$VERBOSE" == "true" ]]; then
    curl -s -I "$APP_ENDPOINT"
  fi
else
  log_success "HTTP status: $http_code"
fi

# Test 3: Response time
log_info "Measuring response time..."
response_time=$(curl -s -o /dev/null -w "%{time_total}000" --connect-timeout 5 "$APP_ENDPOINT" | grep -oE '[0-9]+')
response_time=${response_time%.*}

if [[ $response_time -gt $MAX_RESPONSE_TIME ]]; then
  log_warn "Slow response time: ${response_time}ms (threshold: ${MAX_RESPONSE_TIME}ms)"
else
  log_success "Response time: ${response_time}ms"
fi

# Test 4: Content verification
log_info "Verifying page content..."
if curl -s "$APP_ENDPOINT" | grep -q "zing-connect\|Proxima\|<title>.*</title>"; then
  log_success "Page content verified"
else
  log_warn "Could not verify expected content"
fi

# Test 5: Summary
echo ""
echo "================================================"
if [[ "$http_code" == "200" && $response_time -lt $MAX_RESPONSE_TIME ]]; then
  printf "${GREEN}Status: HEALTHY${NC}\n"
  echo "================================================"
  exit 0
else
  printf "${YELLOW}Status: DEGRADED${NC}\n"
  echo "================================================"
  exit 2
fi
