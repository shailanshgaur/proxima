import { supabase } from './supabaseClient';
import { Vendor } from '../types';

const mockVendors: Vendor[] = [
  {
    id: 'v1',
    name: 'Raj',
    phone: '+919876543210',
    type: 'A',
    categories: ['AC Repair', 'Electrical'],
    societies: ['soc-1'],
    rating: 4.8,
    review_count: 47,
    is_archived: false,
    appeal_status: 'none',
    distance: 2.4,
    response_time: '15 min',
    review_snippet: 'Fixed my AC in 2 hours, very professional',
    jobs_this_month: 5,
    created_at: new Date().toISOString(),
  },
  {
    id: 'v2',
    name: 'Pradeep Plumbing',
    phone: '+919876543211',
    type: 'A',
    categories: ['Plumbing', 'Leaks'],
    societies: ['soc-1'],
    rating: 4.6,
    review_count: 32,
    is_archived: false,
    appeal_status: 'none',
    distance: 1.8,
    response_time: '20 min',
    review_snippet: 'Quick service, fixed the leak same day',
    jobs_this_month: 8,
    created_at: new Date().toISOString(),
  },
  {
    id: 'v3',
    name: 'Sunny Locksmith',
    phone: '+919876543212',
    type: 'A',
    categories: ['Locks', 'Keys'],
    societies: ['soc-1'],
    rating: 4.7,
    review_count: 28,
    is_archived: false,
    appeal_status: 'none',
    distance: 3.1,
    response_time: '10 min',
    review_snippet: 'Installed new locks, very reliable',
    jobs_this_month: 3,
    created_at: new Date().toISOString(),
  },
];

export const vendorService = {
  async getVendorsBySociety(societyId: string | null): Promise<Vendor[]> {
    if (process.env.NODE_ENV === 'development' || societyId === 'demo-society') {
      return mockVendors;
    }

    if (!societyId) return [];

    const { data, error } = await supabase
      .from('vendors')
      .select('*')
      .contains('societies', [societyId])
      .eq('is_archived', false)
      .order('rating', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getVendorById(vendorId: string): Promise<Vendor | null> {
    const { data, error } = await supabase
      .from('vendors')
      .select('*')
      .eq('id', vendorId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  },

  async getVendorsByIds(ids: string[]): Promise<Vendor[]> {
    if (ids.length === 0) return [];

    if (process.env.NODE_ENV === 'development') {
      return mockVendors.filter(v => ids.includes(v.id));
    }

    const { data, error } = await supabase
      .from('vendors')
      .select('*')
      .in('id', ids);

    if (error) throw error;
    return data || [];
  },

  async searchVendorsByCategory(societyId: string | null, category: string): Promise<Vendor[]> {
    if (!societyId) return [];

    const { data, error } = await supabase
      .from('vendors')
      .select('*')
      .contains('societies', [societyId])
      .contains('categories', [category])
      .eq('is_archived', false)
      .order('rating', { ascending: false });

    if (error) throw error;
    return data || [];
  },
};
