-- ADD WRITE POLICIES (CRITICAL SECURITY FIX)

-- Users: Only create own profile during signup
CREATE POLICY "users_insert_own" ON users FOR INSERT WITH CHECK (auth_id = auth.uid());
CREATE POLICY "users_update_own" ON users FOR UPDATE USING (auth_id = auth.uid());

-- Bookings: Only create + update own bookings
CREATE POLICY "bookings_insert_own" ON bookings FOR INSERT WITH CHECK (
  resident_id = (SELECT id FROM users WHERE auth_id = auth.uid())
);
CREATE POLICY "bookings_update_own" ON bookings FOR UPDATE USING (
  resident_id = (SELECT id FROM users WHERE auth_id = auth.uid())
);
CREATE POLICY "bookings_delete_own" ON bookings FOR DELETE USING (
  resident_id = (SELECT id FROM users WHERE auth_id = auth.uid())
);

-- Reviews: Only create reviews for own bookings
CREATE POLICY "reviews_insert_own" ON reviews FOR INSERT WITH CHECK (
  booking_id IN (
    SELECT id FROM bookings
    WHERE resident_id = (SELECT id FROM users WHERE auth_id = auth.uid())
  )
);
CREATE POLICY "reviews_update_own" ON reviews FOR UPDATE USING (
  resident_id = (SELECT id FROM users WHERE auth_id = auth.uid())
);

-- Vendors: No direct updates from frontend (admin only)
-- Vendors table is read-only from app; updates via backend admin dashboard only
CREATE POLICY "vendors_insert_never" ON vendors FOR INSERT WITH CHECK (false);
CREATE POLICY "vendors_update_never" ON vendors FOR UPDATE WITH CHECK (false);
CREATE POLICY "vendors_delete_never" ON vendors FOR DELETE WITH CHECK (false);

-- Appeals: Only vendors can create own appeals
CREATE POLICY "appeals_insert_own" ON appeals FOR INSERT WITH CHECK (
  vendor_id IN (
    -- Allow if current user has a vendor record (if we implement vendor signup)
    -- For now, restrict to backend/admin only
    SELECT id FROM vendors WHERE id = 'admin-only'::uuid -- Will always be false
  )
);
-- Appeals: Only admin can update/approve
CREATE POLICY "appeals_update_admin_only" ON appeals FOR UPDATE WITH CHECK (
  -- Only users with is_admin = true can update appeals
  (SELECT is_admin FROM users WHERE auth_id = auth.uid()) = true
);
CREATE POLICY "appeals_delete_admin_only" ON appeals FOR DELETE USING (
  (SELECT is_admin FROM users WHERE auth_id = auth.uid()) = true
);

-- Note: Societies is public read-only (no RLS needed, no sensitive data exposed)
