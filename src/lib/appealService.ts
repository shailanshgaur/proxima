import { supabase } from './supabaseClient';
import { Appeal } from '../types';

export const appealService = {
  async createAppeal(vendorId: string, reason: string, evidenceUrl?: string): Promise<Appeal> {
    // Validate inputs
    if (!vendorId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(vendorId)) {
      throw new Error('Invalid vendor ID');
    }

    if (!reason || reason.trim().length === 0) {
      throw new Error('Appeal reason is required');
    }

    if (reason.length > 1000) {
      throw new Error('Appeal reason must be less than 1000 characters');
    }

    // Validate evidence URL format (must be valid URL if provided)
    if (evidenceUrl) {
      try {
        new URL(evidenceUrl);
      } catch {
        throw new Error('Invalid evidence URL');
      }

      if (evidenceUrl.length > 2000) {
        throw new Error('Evidence URL is too long');
      }
    }

    const { data, error } = await supabase
      .from('appeals')
      .insert([
        {
          vendor_id: vendorId,
          reason: reason.trim(),
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
