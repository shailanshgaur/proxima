-- Migration 006: Rides table for Society Carpools
CREATE TABLE IF NOT EXISTS rides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  society_id UUID NOT NULL REFERENCES societies(id),
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  waypoints TEXT[] DEFAULT '{}',
  departure_date DATE NOT NULL,
  departure_time TIME NOT NULL,
  seats_available INTEGER NOT NULL CHECK (seats_available BETWEEN 1 AND 6),
  fuel_split INTEGER NOT NULL DEFAULT 0 CHECK (fuel_split >= 0),
  vehicle_model TEXT,
  vehicle_number TEXT,
  no_smoking BOOLEAN NOT NULL DEFAULT false,
  ev_only BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','full','completed','cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_rides_society ON rides(society_id);
CREATE INDEX idx_rides_driver ON rides(driver_id);
CREATE INDEX idx_rides_departure ON rides(departure_date, departure_time);
CREATE INDEX idx_rides_status ON rides(status);

ALTER TABLE rides ENABLE ROW LEVEL SECURITY;

CREATE POLICY rides_select ON rides FOR SELECT
  USING (
    status = 'open' AND
    society_id = (SELECT society_id FROM users WHERE auth_id = auth.uid())
  );

CREATE POLICY rides_insert ON rides FOR INSERT
  WITH CHECK (driver_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY rides_update ON rides FOR UPDATE
  USING (driver_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY rides_delete ON rides FOR DELETE
  USING (driver_id = (SELECT id FROM users WHERE auth_id = auth.uid()));
