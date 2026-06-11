import { supabase } from './supabaseClient';
import { User } from '../types';

const validatePhone = (phone: string): string => {
  // If it's an email (contains @), return as-is
  if (phone.includes('@')) {
    return phone.toLowerCase();
  }
  const cleaned = phone.replace(/\D/g, '');
  // Indian phone: 10 digits (91 country code optional)
  if (cleaned.length === 10) {
    return '+91' + cleaned;
  } else if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return '+' + cleaned;
  }
  throw new Error('Invalid phone number or email. Use 10-digit Indian number or email.');
};

export const authService = {
  async signUpWithEmail(email: string) {
    const { data, error } = await supabase.auth.signInWithOtp({
      email: email.toLowerCase(),
      options: { shouldCreateUser: true },
    });
    if (error) throw error;
    return data;
  },

  async verifyEmailOtp(email: string, token: string) {
    if (!token || token.length !== 6 || !/^\d+$/.test(token)) {
      throw new Error('Invalid OTP format');
    }
    const { data, error } = await supabase.auth.verifyOtp({
      email: email.toLowerCase(),
      token,
      type: 'email',
    });
    if (error) throw error;
    return data;
  },

  async signUpWithPhone(phone: string) {
    const validatedPhone = validatePhone(phone);
    const { data, error } = await supabase.auth.signInWithOtp({
      phone: validatedPhone,
      options: { shouldCreateUser: true },
    });
    if (error) throw error;
    return data;
  },

  async verifyOtp(phone: string, token: string) {
    const validatedPhone = validatePhone(phone);
    if (!token || token.length !== 6 || !/^\d+$/.test(token)) {
      throw new Error('Invalid OTP format');
    }
    const { data, error } = await supabase.auth.verifyOtp({
      phone: validatedPhone,
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
    // Validate authId is UUID
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(authId)) {
      throw new Error('Invalid auth ID');
    }

    // Validate societyId is UUID
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(societyId)) {
      throw new Error('Invalid society ID');
    }

    // Validate name
    if (!name || name.trim().length === 0) {
      throw new Error('Name is required');
    }
    if (name.length > 100) {
      throw new Error('Name too long');
    }

    // Validate flat number
    if (!flatNumber || flatNumber.trim().length === 0) {
      throw new Error('Flat number is required');
    }
    if (flatNumber.length > 50) {
      throw new Error('Flat number too long');
    }

    const validatedPhone = validatePhone(phone);

    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          auth_id: authId,
          phone: validatedPhone,
          society_id: societyId,
          name: name.trim(),
          flat_number: flatNumber.trim(),
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
