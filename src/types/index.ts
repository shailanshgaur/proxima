export interface Society {
  id: string;
  name: string;
  location?: string;
  resident_count?: number;
  created_at: string;
}

export interface User {
  id: string;
  auth_id: string;
  society_id: string;
  name: string;
  phone: string;
  flat_number?: string;
  is_admin?: boolean;
  created_at: string;
}

export interface Vendor {
  id: string;
  name: string;
  phone: string;
  type: 'A' | 'B';
  categories: string[];
  societies: string[];
  rating: number;
  review_count: number;
  is_archived: boolean;
  appeal_status: 'none' | 'pending' | 'approved' | 'rejected';
  distance?: number;
  response_time?: string;
  review_snippet?: string;
  jobs_this_month?: number;
  created_at: string;
}

export interface Booking {
  id: string;
  resident_id: string;
  vendor_id: string;
  society_id: string;
  service_type: string;
  scheduled_date: string;
  scheduled_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'no_show' | 'cancelled';
  whatsapp_sent_at?: string;
  confirmation_method?: 'whatsapp_timeout' | 'app_tap' | 'manual';
  confirmed_at?: string;
  completed_at?: string;
  photo_url?: string;
  rating_given: boolean;
  created_at: string;
}

export interface Review {
  id: string;
  booking_id: string;
  resident_id: string;
  vendor_id: string;
  rating: number;
  text?: string;
  reviewer_level?: 'new' | 'regular' | 'trusted';
  created_at: string;
}

export interface Appeal {
  id: string;
  vendor_id: string;
  reason: string;
  evidence_url?: string;
  status: 'pending' | 'approved' | 'rejected';
  decision_reason?: string;
  created_at: string;
  decided_at?: string;
  deadline_at: string;
}

export interface Product {
  id: string;
  seller_id: string;
  society_id: string;
  title: string;
  description: string;
  price: number;
  category: 'Furniture' | 'Electronics' | 'Kids' | 'Appliances' | 'Sports' | 'Other';
  condition: 'new' | 'like_new' | 'good' | 'fair';
  photo_url?: string;
  status: 'active' | 'sold' | 'removed';
  seller_flat: string;
  created_at: string;
  updated_at: string;
}

export interface Ride {
  id: string;
  driver_id: string;
  society_id: string;
  origin: string;
  destination: string;
  waypoints?: string[];
  departure_date: string;
  departure_time: string;
  seats_available: number;
  fuel_split: number;
  vehicle_model?: string;
  vehicle_number?: string;
  no_smoking: boolean;
  ev_only: boolean;
  status: 'open' | 'full' | 'completed' | 'cancelled';
  created_at: string;
}

export interface ResidentProfile {
  user_id: string;
  flat_number: string;
  name: string;
  email: string;
  society_id: string | null;
  society_name?: string;
  avatar_url?: string;
  portal_id: string;
  member_since: string;
  is_admin: boolean;
}

export type Tab = 'overview' | 'bazar' | 'carpools' | 'services' | 'profile' | 'admin';
