-- societies table
CREATE TABLE societies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  location TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  society_id UUID REFERENCES societies(id),
  name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  flat_number TEXT,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- vendors table
CREATE TABLE vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('A', 'B')),
  categories JSONB DEFAULT '[]'::jsonb,
  societies JSONB DEFAULT '[]'::jsonb,
  rating DECIMAL(3,2) DEFAULT 0.0,
  review_count INT DEFAULT 0,
  is_archived BOOLEAN DEFAULT false,
  appeal_status TEXT DEFAULT 'none',
  created_at TIMESTAMP DEFAULT NOW()
);

-- bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resident_id UUID REFERENCES users(id) ON DELETE CASCADE,
  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
  society_id UUID REFERENCES societies(id),
  service_type TEXT NOT NULL,
  scheduled_date DATE NOT NULL,
  scheduled_time TIME NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'completed', 'no_show', 'cancelled')),
  confirmed_at TIMESTAMP,
  completed_at TIMESTAMP,
  photo_url TEXT,
  rating_given BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  resident_id UUID REFERENCES users(id) ON DELETE CASCADE,
  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- appeals table
CREATE TABLE appeals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  evidence_url TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  decision_reason TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  decided_at TIMESTAMP,
  deadline_at TIMESTAMP DEFAULT (NOW() + INTERVAL '48 hours')
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE appeals ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "users_select_own" ON users FOR SELECT USING (auth_id = auth.uid());
CREATE POLICY "vendors_select_by_society" ON vendors FOR SELECT USING (
  (SELECT society_id FROM users WHERE auth_id = auth.uid()) IS NULL
  OR societies @> ARRAY[(SELECT society_id FROM users WHERE auth_id = auth.uid())]::UUID[]
);
CREATE POLICY "bookings_select_own" ON bookings FOR SELECT USING (
  resident_id = (SELECT id FROM users WHERE auth_id = auth.uid())
);
CREATE POLICY "reviews_select_own_or_public" ON reviews FOR SELECT USING (true);
CREATE POLICY "appeals_select_own" ON appeals FOR SELECT USING (
  vendor_id IN (SELECT id FROM vendors)
);

-- Indexes
CREATE INDEX idx_users_auth_id ON users(auth_id);
CREATE INDEX idx_users_society_id ON users(society_id);
CREATE INDEX idx_vendors_phone ON vendors(phone);
CREATE INDEX idx_vendors_type ON vendors(type);
CREATE INDEX idx_bookings_resident_id ON bookings(resident_id);
CREATE INDEX idx_bookings_vendor_id ON bookings(vendor_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_scheduled_date ON bookings(scheduled_date);
CREATE INDEX idx_reviews_vendor_id ON reviews(vendor_id);
CREATE INDEX idx_reviews_booking_id ON reviews(booking_id);
CREATE INDEX idx_appeals_vendor_id ON appeals(vendor_id);
