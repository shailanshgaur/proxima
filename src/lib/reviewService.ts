import { supabase } from './supabaseClient';
import { Review } from '../types';

export const reviewService = {
  async createReview(
    bookingId: string,
    residentId: string,
    vendorId: string,
    rating: number,
    text?: string
  ): Promise<Review> {
    const { data, error } = await supabase
      .from('reviews')
      .insert([
        {
          booking_id: bookingId,
          resident_id: residentId,
          vendor_id: vendorId,
          rating,
          text: text || null,
          reviewer_level: 'new',
        },
      ])
      .select()
      .single();

    if (error) throw error;

    await this.updateVendorRating(vendorId);

    return data;
  },

  async getVendorReviews(vendorId: string): Promise<Review[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('vendor_id', vendorId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async updateVendorRating(vendorId: string): Promise<void> {
    const reviews = await this.getVendorReviews(vendorId);

    if (reviews.length === 0) {
      await supabase
        .from('vendors')
        .update({ rating: 0, review_count: 0 })
        .eq('id', vendorId);
      return;
    }

    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    const { error } = await supabase
      .from('vendors')
      .update({ rating: parseFloat(avgRating.toFixed(2)), review_count: reviews.length })
      .eq('id', vendorId);

    if (error) throw error;
  },

  async hasReviewForBooking(bookingId: string): Promise<boolean> {
    const { count, error } = await supabase
      .from('reviews')
      .select('id', { count: 'exact', head: true })
      .eq('booking_id', bookingId);

    if (error) throw error;
    return count! > 0;
  },
};
