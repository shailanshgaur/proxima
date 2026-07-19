-- Add UNIQUE constraint: one review per (resident, vendor) pair
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'unique_resident_vendor_review'
  ) THEN
    ALTER TABLE reviews ADD CONSTRAINT unique_resident_vendor_review UNIQUE (resident_id, vendor_id);
  END IF;
END $$;

-- Enforce max 5 active bookings per resident with a trigger.
-- Postgres does not allow subqueries inside CHECK constraints.
CREATE OR REPLACE FUNCTION enforce_max_active_bookings()
RETURNS TRIGGER AS $$
DECLARE
  active_count INTEGER;
BEGIN
  IF NEW.status IN ('pending', 'confirmed') THEN
    SELECT COUNT(*) INTO active_count
    FROM bookings
    WHERE resident_id = NEW.resident_id
      AND status IN ('pending', 'confirmed')
      AND id IS DISTINCT FROM NEW.id;

    IF active_count >= 5 THEN
      RAISE EXCEPTION 'Residents can only have 5 active bookings at a time';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_enforce_max_active_bookings ON bookings;
CREATE TRIGGER trg_enforce_max_active_bookings
BEFORE INSERT OR UPDATE OF status, resident_id ON bookings
FOR EACH ROW
EXECUTE FUNCTION enforce_max_active_bookings();

-- Add indexes used by sorted views.
CREATE INDEX IF NOT EXISTS idx_vendors_rating ON vendors(rating DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at DESC);

-- Rollback (if needed)
-- DROP TRIGGER IF EXISTS trg_enforce_max_active_bookings ON bookings;
-- DROP FUNCTION IF EXISTS enforce_max_active_bookings();
-- DROP INDEX IF EXISTS idx_bookings_created_at;
-- DROP INDEX IF EXISTS idx_vendors_rating;
-- ALTER TABLE reviews DROP CONSTRAINT IF EXISTS unique_resident_vendor_review;
