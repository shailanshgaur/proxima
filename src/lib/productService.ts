import { supabase } from './supabaseClient';
import { Product } from '../types';

export const productService = {
  async getProducts(societyId: string | null): Promise<Product[]> {
    if (!societyId) return [];

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('society_id', societyId)
      .eq('status', 'active')
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  },

  async createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'status'>): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .insert({ ...product, status: 'active' })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  async markSold(productId: string): Promise<void> {
    const { error } = await supabase
      .from('products')
      .update({ status: 'sold', updated_at: new Date().toISOString() })
      .eq('id', productId);
    if (error) throw new Error(error.message);
  },

  async deleteProduct(productId: string): Promise<void> {
    const { error } = await supabase
      .from('products')
      .update({ status: 'removed' })
      .eq('id', productId);
    if (error) throw new Error(error.message);
  },
};
