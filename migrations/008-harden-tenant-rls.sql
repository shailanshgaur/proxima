-- Repair tenant isolation policies for databases that already ran earlier migrations.

DROP POLICY IF EXISTS "vendors_select_by_society" ON vendors;
CREATE POLICY "vendors_select_by_society" ON vendors FOR SELECT USING (
  (SELECT society_id FROM users WHERE auth_id = auth.uid()) IS NULL
  OR societies @> jsonb_build_array((SELECT society_id FROM users WHERE auth_id = auth.uid()))
);

DROP POLICY IF EXISTS products_insert ON products;
CREATE POLICY products_insert ON products FOR INSERT
  WITH CHECK (
    seller_id = (SELECT id FROM users WHERE auth_id = auth.uid())
    AND society_id = (SELECT society_id FROM users WHERE auth_id = auth.uid())
  );

DROP POLICY IF EXISTS products_update ON products;
CREATE POLICY products_update ON products FOR UPDATE
  USING (seller_id = (SELECT id FROM users WHERE auth_id = auth.uid()))
  WITH CHECK (society_id = (SELECT society_id FROM users WHERE auth_id = auth.uid()));

DROP POLICY IF EXISTS rides_insert ON rides;
CREATE POLICY rides_insert ON rides FOR INSERT
  WITH CHECK (
    driver_id = (SELECT id FROM users WHERE auth_id = auth.uid())
    AND society_id = (SELECT society_id FROM users WHERE auth_id = auth.uid())
  );

DROP POLICY IF EXISTS rides_update ON rides;
CREATE POLICY rides_update ON rides FOR UPDATE
  USING (driver_id = (SELECT id FROM users WHERE auth_id = auth.uid()))
  WITH CHECK (society_id = (SELECT society_id FROM users WHERE auth_id = auth.uid()));
