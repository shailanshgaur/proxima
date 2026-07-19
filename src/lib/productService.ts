import { supabase } from './supabaseClient';
import { Product } from '../types';

const demoProducts: Product[] = [
  {
    id: 'demo-product-1',
    seller_id: 'demo-user',
    society_id: 'demo-society',
    title: 'Study table with chair',
    description: 'Lightly used, available for pickup this weekend.',
    price: 3200,
    category: 'Furniture',
    condition: 'good',
    status: 'active',
    seller_flat: 'A-1204',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-product-2',
    seller_id: 'demo-user-2',
    society_id: 'demo-society',
    title: 'Kids bicycle',
    description: 'Neighbourhood sale, ready to ride.',
    price: 1800,
    category: 'Kids',
    condition: 'like_new',
    status: 'active',
    seller_flat: 'B-604',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
];

export const productService = {
  async getProducts(societyId: string | null): Promise<Product[]> {
    if (societyId === 'demo-society') return demoProducts;
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
