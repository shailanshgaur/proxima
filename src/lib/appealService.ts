import { supabase } from './supabaseClient';
import { Appeal } from '../types';

export const appealService = {
  async createAppeal(vendorId: string, reason: string, evidenceUrl?: string): Promise<Appeal> {
    const { data, error } = await supabase
      .from('appeals')
      .insert([
        {
          vendor_id: vendorId,
          reason,
          evidence_url: evidenceUrl || null,
          status: 'pending',
          deadline_at: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getAppealsByVendor(vendorId: string): Promise<Appeal[]> {
    const { data, error } = await supabase
      .from('appeals')
      .select('*')
      .eq('vendor_id', vendorId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getPendingAppealByVendor(vendorId: string): Promise<Appeal | null> {
    const { data, error } = await supabase
      .from('appeals')
      .select('*')
      .eq('vendor_id', vendorId)
      .eq('status', 'pending')
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  },
};
