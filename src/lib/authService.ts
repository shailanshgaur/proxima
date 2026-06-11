import { supabase } from './supabaseClient';
import { User } from '../types';

export const authService = {
  async signUpWithPhone(phone: string) {
    const { data, error } = await supabase.auth.signInWithOtp({
      phone,
      options: { shouldCreateUser: true },
    });
    if (error) throw error;
    return data;
  },

  async verifyOtp(phone: string, token: string) {
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: 'sms',
    });
    if (error) throw error;
    return data;
  },

  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  async getCurrentUser(): Promise<User | null> {
    const session = await this.getSession();
    if (!session) return null;

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', session.user.id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  },

  async createUserProfile(
    authId: string,
    phone: string,
    societyId: string,
    name: string,
    flatNumber: string
  ) {
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          auth_id: authId,
          phone,
          society_id: societyId,
          name,
          flat_number: flatNumber,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data as User;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },
};
