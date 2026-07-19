import { supabase } from './supabaseClient';
import { Ride } from '../types';

const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

const demoRides: Ride[] = [
  {
    id: 'demo-ride-1',
    driver_id: 'demo-driver-1',
    society_id: 'demo-society',
    origin: 'Lotus Zing Gate 2',
    destination: 'Noida Sector 142 Metro',
    departure_date: tomorrow,
    departure_time: '09:15',
    seats_available: 2,
    fuel_split: 60,
    vehicle_model: 'White Swift',
    no_smoking: true,
    ev_only: false,
    status: 'open',
    created_at: new Date().toISOString(),
  },
];

export const rideService = {
  async getRides(societyId: string | null): Promise<Ride[]> {
    if (societyId === 'demo-society') return demoRides;
    if (!societyId) return [];

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
    if (driverId === 'demo-user') return [];

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
