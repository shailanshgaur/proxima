import { supabase } from './supabaseClient';
import { Vendor } from '../types';

export const vendorService = {
  async getVendorsBySociety(societyId: string): Promise<Vendor[]> {
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

  async searchVendorsByCategory(societyId: string, category: string): Promise<Vendor[]> {
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
