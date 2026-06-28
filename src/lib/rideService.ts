import { supabase } from './supabaseClient';
import { Ride } from '../types';

export const rideService = {
  async getRides(societyId: string): Promise<Ride[]> {
    const { data, error } = await supabase
      .from('rides')
      .select('*')
      .eq('society_id', societyId)
      .eq('status', 'open')
      .gte('departure_date', new Date().toISOString().split('T')[0])
      .order('departure_date', { ascending: true })
      .order('departure_time', { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  },

  async getMyRides(driverId: string): Promise<Ride[]> {
    const { data, error } = await supabase
      .from('rides')
      .select('*')
      .eq('driver_id', driverId)
      .order('departure_date', { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  },

  async createRide(ride: Omit<Ride, 'id' | 'created_at' | 'status'>): Promise<Ride> {
    const { data, error } = await supabase
      .from('rides')
      .insert({ ...ride, status: 'open' })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  async cancelRide(rideId: string): Promise<void> {
    const { error } = await supabase
      .from('rides')
      .update({ status: 'cancelled' })
      .eq('id', rideId);
    if (error) throw new Error(error.message);
  },
};
