-- Add UNIQUE constraint: one review per (resident, vendor) pair
ALTER TABLE reviews ADD CONSTRAINT unique_resident_vendor_review UNIQUE (resident_id, vendor_id);

-- Add CHECK constraint: limit 5 active bookings per resident
ALTER TABLE bookings ADD CONSTRAINT max_active_bookings CHECK (
  (SELECT COUNT(*) FROM bookings
   WHERE resident_id = bookings.resident_id
   AND status IN ('pending', 'confirmed')) <= 5
);

-- Add index on vendor rating (for sorting)
CREATE INDEX idx_vendors_rating ON vendors(rating DESC);

-- Add index on created_at (for sorting)
CREATE INDEX idx_bookings_created_at ON bookings(created_at DESC);

-- Rollback (if needed)
-- DROP INDEX idx_bookings_created_at;
-- DROP INDEX idx_vendors_rating;
-- ALTER TABLE bookings DROP CONSTRAINT max_active_bookings;
-- ALTER TABLE reviews DROP CONSTRAINT unique_resident_vendor_review;
