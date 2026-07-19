-- Migration 005: Products table for Society Bazar
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  society_id UUID NOT NULL REFERENCES societies(id),
  title TEXT NOT NULL CHECK (char_length(title) BETWEEN 3 AND 100),
  description TEXT CHECK (char_length(description) <= 1000),
  price INTEGER NOT NULL CHECK (price >= 0),
  category TEXT NOT NULL CHECK (category IN ('Furniture','Electronics','Kids','Appliances','Sports','Other')),
  condition TEXT NOT NULL DEFAULT 'good' CHECK (condition IN ('new','like_new','good','fair')),
  photo_url TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','sold','removed')),
  seller_flat TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_society ON products(society_id);
CREATE INDEX idx_products_seller ON products(seller_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_created ON products(created_at DESC);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY products_select ON products FOR SELECT
  USING (
    status = 'active' AND
    society_id = (SELECT society_id FROM users WHERE auth_id = auth.uid())
  );

CREATE POLICY products_insert ON products FOR INSERT
  WITH CHECK (
    seller_id = (SELECT id FROM users WHERE auth_id = auth.uid())
    AND society_id = (SELECT society_id FROM users WHERE auth_id = auth.uid())
  );

CREATE POLICY products_update ON products FOR UPDATE
  USING (seller_id = (SELECT id FROM users WHERE auth_id = auth.uid()))
  WITH CHECK (society_id = (SELECT society_id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY products_delete ON products FOR DELETE
  USING (seller_id = (SELECT id FROM users WHERE auth_id = auth.uid()));
