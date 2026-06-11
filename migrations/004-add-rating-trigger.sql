-- Trigger: Update vendor rating when review is inserted
CREATE OR REPLACE FUNCTION update_vendor_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE vendors
  SET rating = (
    SELECT COALESCE(AVG(rating), 0)::DECIMAL(3,2)
    FROM reviews
    WHERE vendor_id = NEW.vendor_id
  ),
  review_count = (
    SELECT COUNT(*)
    FROM reviews
    WHERE vendor_id = NEW.vendor_id
  )
  WHERE id = NEW.vendor_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_update_vendor_rating ON reviews;
CREATE TRIGGER tr_update_vendor_rating
AFTER INSERT ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_vendor_rating();
