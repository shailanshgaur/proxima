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
