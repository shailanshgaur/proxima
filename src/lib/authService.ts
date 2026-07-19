import { supabase } from './supabaseClient';
import { ResidentProfile, Society } from '../types';

export const authService = {
  // SMTP CONFIGURATION REQUIRED FOR PRODUCTION
  // Supabase built-in SMTP: 4 emails/hour — dev only
  // Switch to Resend before launch:
  //   1. resend.com → create API key
  //   2. Supabase Dashboard → Project Settings → Auth → SMTP Settings
  //   3. Enable Custom SMTP:
  //      Host:     smtp.resend.com
  //      Port:     465
  //      User:     resend
  //      Password: <RESEND_API_KEY>
  //      Sender:   noreply@<your-domain>
  //   4. Resend free: 3,000/month, 100/day — use paid ($20/mo) for 750 users
  async signInWithGoogle(): Promise<void> {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/` },
    });
    if (error) throw new Error(error.message);
  },

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  },

  async getSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },

  async getCurrentAuthUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  async getSocieties(): Promise<Society[]> {
    const { data, error } = await supabase
      .from('societies')
      .select('id, name, location, created_at')
      .order('name');

    if (error) throw new Error(error.message);
    return data ?? [];
  },

  async getCurrentProfile(): Promise<ResidentProfile | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('users')
      .select('id, name, flat_number, society_id, is_admin, created_at, auth_id')
      .eq('auth_id', user.id)
      .single();

    if (error || !data) return null;

    return {
      user_id: data.id,
      flat_number: data.flat_number,
      name: data.name,
      email: user.email ?? '',
      society_id: data.society_id,
      avatar_url: user.user_metadata?.avatar_url,
      portal_id: `PXM-${data.flat_number}`,
      member_since: new Date(data.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
      is_admin: data.is_admin ?? false,
    };
  },

  async createProfile(authId: string, name: string, flatNumber: string, societyId: string, email: string, phone: string): Promise<ResidentProfile> {
    if (!name.trim() || name.trim().length < 2) throw new Error('Name must be at least 2 characters');
    if (!flatNumber.trim()) throw new Error('Flat number required');
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) throw new Error('Valid phone number required');

    const { data, error } = await supabase.from('users').insert({
      auth_id: authId,
      name: name.trim(),
      phone: phone.replace(/\D/g, ''),
      flat_number: flatNumber.trim().toUpperCase(),
      society_id: societyId,
      is_admin: false,
    }).select().single();

    if (error) throw new Error(error.message);

    return {
      user_id: data.id,
      flat_number: data.flat_number,
      name: data.name,
      email,
      society_id: data.society_id,
      portal_id: `PXM-${data.flat_number}`,
      member_since: new Date(data.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
      is_admin: false,
    };
  },

  onAuthChange(callback: (profile: ResidentProfile | null) => void) {
    return supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session) { callback(null); return; }
      const profile = await authService.getCurrentProfile();
      callback(profile);
    });
  },
};
