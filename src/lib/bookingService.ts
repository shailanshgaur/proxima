import { supabase } from './supabaseClient';
import { Booking } from '../types';

export const bookingService = {
  async createBooking(
    residentId: string,
    vendorId: string,
    societyId: string,
    serviceType: string,
    scheduledDate: string,
    scheduledTime: string
  ): Promise<Booking> {
    const { data, error } = await supabase
      .from('bookings')
      .insert([
        {
          resident_id: residentId,
          vendor_id: vendorId,
          society_id: societyId,
          service_type: serviceType,
          scheduled_date: scheduledDate,
          scheduled_time: scheduledTime,
          status: 'pending',
          whatsapp_sent_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  generateWhatsAppLink(vendorPhone: string, vendorName: string, booking: Booking, flatNumber: string): string {
    const message = `${vendorName}, you have a new booking!
📍 Flat: ${flatNumber}
📅 Date: ${booking.scheduled_date}
🕐 Time: ${booking.scheduled_time}
Service: ${booking.service_type}
🔐 Booking ID: ${booking.id}

Reply YES to confirm or DECLINE`;

    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${vendorPhone.replace(/\D/g, '')}?text=${encodedMessage}`;
  },

  async getBookingsByResident(residentId: string): Promise<Booking[]> {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('resident_id', residentId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getBookingById(bookingId: string): Promise<Booking | null> {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  },

  async updateBookingStatus(bookingId: string, status: string): Promise<Booking> {
    const validStatuses = ['pending', 'confirmed', 'completed', 'no_show', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid booking status');
    }

    const { data, error } = await supabase
      .from('bookings')
      .update({ status, completed_at: status === 'completed' ? new Date().toISOString() : null })
      .eq('id', bookingId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateBookingPhoto(bookingId: string, photoUrl: string): Promise<Booking> {
    const { data, error } = await supabase
      .from('bookings')
      .update({ photo_url: photoUrl })
      .eq('id', bookingId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
