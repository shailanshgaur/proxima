#!/bin/bash

# Test Fixtures for Proxima Pre-Launch Tests
# Provides setup and teardown utilities for test data
# Source this file in other test scripts: source scripts/test-fixtures.sh

set -euo pipefail

# ============================================================================
# Configuration
# ============================================================================

SUPABASE_URL="${SUPABASE_URL:-https://your-project.supabase.co}"
SUPABASE_ANON_KEY="${SUPABASE_ANON_KEY:-your-anon-key}"
SUPABASE_SERVICE_KEY="${SUPABASE_SERVICE_KEY:-your-service-key}"

# Generated test IDs for cleanup
declare -A TEST_IDS=()

# ============================================================================
# Utility Functions
# ============================================================================

generate_uuid() {
  # Generate a valid UUID v4
  echo "$(uuidgen | tr '[:upper:]' '[:lower:]')"
}

generate_phone() {
  # Generate valid Indian phone number
  echo "+91$(shuf -i 9000000000-9999999999 -n 1)"
}

api_request() {
  local method="$1"
  local endpoint="$2"
  local data="${3:-}"
  local auth_token="${4:-}"

  local url="${SUPABASE_URL}/rest/v1${endpoint}"

  local headers=(
    "-H" "apikey: ${SUPABASE_ANON_KEY}"
    "-H" "Content-Type: application/json"
  )

  if [ -n "$auth_token" ]; then
    headers+=("-H" "Authorization: Bearer $auth_token")
  fi

  if [ -n "$data" ]; then
    curl -s -X "$method" "$url" "${headers[@]}" -d "$data"
  else
    curl -s -X "$method" "$url" "${headers[@]}"
  fi
}

# ============================================================================
# Test Society Fixtures
# ============================================================================

create_test_society() {
  local name="${1:-Test Society ${RANDOM}}"
  local location="${2:-Test Location}"

  local society_id=$(generate_uuid)

  # Note: Societies are typically created by admins, not via REST API
  # This is a placeholder for the structure
  echo "{\"id\":\"$society_id\",\"name\":\"$name\",\"location\":\"$location\"}"

  TEST_IDS["society_${society_id}"]="$society_id"
}

get_test_society() {
  # Get first available society from database
  api_request "GET" "/societies?limit=1&select=id,name,location"
}

# ============================================================================
# Test User Fixtures
# ============================================================================

create_test_resident() {
  local society_id="$1"
  local phone="${2:-$(generate_phone)}"
  local name="${3:-Test Resident ${RANDOM}}"
  local flat_number="${4:-${RANDOM}}"

  local user_id=$(generate_uuid)

  local data=$(cat <<EOF
{
  "id": "$user_id",
  "phone": "$phone",
  "society_id": "$society_id",
  "name": "$name",
  "flat_number": "$flat_number"
}
EOF
)

  api_request "POST" "/users" "$data"

  TEST_IDS["resident_${user_id}"]="$user_id"
  echo "$user_id"
}

create_test_vendor() {
  local name="${1:-Test Vendor ${RANDOM}}"
  local phone="${2:-$(generate_phone)}"
  local categories="${3:-plumbing,electrical}"

  local vendor_id=$(generate_uuid)

  local data=$(cat <<EOF
{
  "id": "$vendor_id",
  "name": "$name",
  "phone": "$phone",
  "type": "A",
  "categories": ["${categories//,/\",\"}"],
  "rating": 0,
  "review_count": 0
}
EOF
)

  api_request "POST" "/vendors" "$data"

  TEST_IDS["vendor_${vendor_id}"]="$vendor_id"
  echo "$vendor_id"
}

# ============================================================================
# Test Booking Fixtures
# ============================================================================

create_test_booking() {
  local resident_id="$1"
  local vendor_id="$2"
  local society_id="$3"
  local service_type="${4:-Plumbing}"
  local scheduled_date="${5:-$(date -u +%Y-%m-%d)}"
  local scheduled_time="${6:-14:00}"

  local booking_id=$(generate_uuid)

  local data=$(cat <<EOF
{
  "id": "$booking_id",
  "resident_id": "$resident_id",
  "vendor_id": "$vendor_id",
  "society_id": "$society_id",
  "service_type": "$service_type",
  "scheduled_date": "$scheduled_date",
  "scheduled_time": "$scheduled_time",
  "status": "pending",
  "whatsapp_sent_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "rating_given": false
}
EOF
)

  api_request "POST" "/bookings" "$data"

  TEST_IDS["booking_${booking_id}"]="$booking_id"
  echo "$booking_id"
}

# ============================================================================
# Test Review Fixtures
# ============================================================================

create_test_review() {
  local booking_id="$1"
  local resident_id="$2"
  local vendor_id="$3"
  local rating="${4:-5}"
  local text="${5:-Great service!}"

  local review_id=$(generate_uuid)

  local data=$(cat <<EOF
{
  "id": "$review_id",
  "booking_id": "$booking_id",
  "resident_id": "$resident_id",
  "vendor_id": "$vendor_id",
  "rating": $rating,
  "text": "$text",
  "reviewer_level": "new"
}
EOF
)

  api_request "POST" "/reviews" "$data"

  TEST_IDS["review_${review_id}"]="$review_id"
  echo "$review_id"
}

# ============================================================================
# Cleanup Utilities
# ============================================================================

cleanup_test_resident() {
  local resident_id="$1"
  # Note: Deletion requires service key and appropriate RLS policies
  api_request "DELETE" "/users?id=eq.$resident_id"
}

cleanup_test_vendor() {
  local vendor_id="$1"
  api_request "DELETE" "/vendors?id=eq.$vendor_id"
}

cleanup_test_booking() {
  local booking_id="$1"
  api_request "DELETE" "/bookings?id=eq.$booking_id"
}

cleanup_test_review() {
  local review_id="$1"
  api_request "DELETE" "/reviews?id=eq.$review_id"
}

cleanup_all_test_data() {
  echo "Cleaning up test data..."

  for key in "${!TEST_IDS[@]}"; do
    local id="${TEST_IDS[$key]}"
    local type="${key%%_*}"

    case "$type" in
      resident)
        cleanup_test_resident "$id"
        ;;
      vendor)
        cleanup_test_vendor "$id"
        ;;
      booking)
        cleanup_test_booking "$id"
        ;;
      review)
        cleanup_test_review "$id"
        ;;
    esac
  done

  echo "Cleanup complete"
}

# ============================================================================
# Integration Test Scenarios
# ============================================================================

# Test: Complete booking flow
test_complete_booking_flow() {
  echo "Setting up complete booking flow test..."

  # 1. Get or create test society
  local society_id=$(get_test_society | jq -r '.[0].id' 2>/dev/null || generate_uuid)
  echo "Society ID: $society_id"

  # 2. Create test resident
  local resident_id=$(create_test_resident "$society_id")
  echo "Resident ID: $resident_id"

  # 3. Create test vendor
  local vendor_id=$(create_test_vendor "Test Plumber")
  echo "Vendor ID: $vendor_id"

  # 4. Create booking
  local booking_id=$(create_test_booking "$resident_id" "$vendor_id" "$society_id" "Plumbing")
  echo "Booking ID: $booking_id"

  # 5. Create review
  local review_id=$(create_test_review "$booking_id" "$resident_id" "$vendor_id" 5 "Excellent work!")
  echo "Review ID: $review_id"

  echo "Test flow setup complete"
}

# Test: RLS isolation
test_rls_isolation() {
  echo "Setting up RLS isolation test..."

  # Create two separate residents
  local society_id=$(get_test_society | jq -r '.[0].id' 2>/dev/null || generate_uuid)

  local resident_a=$(create_test_resident "$society_id" "$(generate_phone)" "Resident A")
  local resident_b=$(create_test_resident "$society_id" "$(generate_phone)" "Resident B")

  # Create vendor
  local vendor_id=$(create_test_vendor "Test Vendor")

  # Create booking for resident A
  local booking_a=$(create_test_booking "$resident_a" "$vendor_id" "$society_id" "Service A")

  # Create booking for resident B
  local booking_b=$(create_test_booking "$resident_b" "$vendor_id" "$society_id" "Service B")

  echo "RLS isolation test setup complete"
  echo "Resident A ID: $resident_a"
  echo "Resident B ID: $resident_b"
  echo "Resident A booking: $booking_a"
  echo "Resident B booking: $booking_b"
}

# ============================================================================
# Export Functions
# ============================================================================

# Make functions available to sourcing scripts
export -f generate_uuid
export -f generate_phone
export -f api_request
export -f create_test_resident
export -f create_test_vendor
export -f create_test_booking
export -f create_test_review
export -f cleanup_test_resident
export -f cleanup_test_vendor
export -f cleanup_test_booking
export -f cleanup_test_review
export -f cleanup_all_test_data
export -f test_complete_booking_flow
export -f test_rls_isolation
