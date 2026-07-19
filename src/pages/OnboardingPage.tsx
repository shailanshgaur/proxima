import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { User } from '@supabase/supabase-js';
import { authService } from '../lib/authService';
import { ResidentProfile, Society } from '../types';

interface OnboardingPageProps {
  user: User;
  onComplete: (profile: ResidentProfile) => void;
}

export const OnboardingPage: React.FC<OnboardingPageProps> = ({ user, onComplete }) => {
  const [societies, setSocieties] = useState<Society[]>([]);
  const [name, setName] = useState(user.user_metadata?.full_name ?? '');
  const [flatNumber, setFlatNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [societyId, setSocietyId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    authService.getSocieties()
      .then((rows) => {
        setSocieties(rows);
        setSocietyId(rows[0]?.id ?? '');
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Could not load societies'))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const profile = await authService.createProfile(
        user.id,
        name,
        flatNumber,
        societyId,
        user.email ?? '',
        phone
      );
      onComplete(profile);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not finish profile setup');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-proxima-base px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-7">
          <p className="text-3xl font-bold text-proxima-primary mb-3" style={{ letterSpacing: '0.14em' }}>
            PROXIMA
          </p>
          <h1 className="text-lg font-semibold text-proxima-text mb-1">Set up your resident pass</h1>
          <p className="text-sm text-proxima-muted leading-relaxed">
            One quick verification profile unlocks the society marketplace, services, and carpools.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-proxima-card border border-proxima-border rounded-2xl p-6 space-y-4"
          style={{ boxShadow: '0 1px 4px rgba(28,25,23,0.08)' }}
        >
          {error && (
            <div className="p-3 rounded-xl text-sm text-proxima-error border border-red-500/20 bg-red-500/5">
              {error}
            </div>
          )}

          <label className="block">
            <span className="block text-xs font-semibold text-proxima-muted mb-1.5">Name</span>
            <input
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full px-3 py-2.5 bg-proxima-base border border-proxima-border rounded-xl text-sm text-proxima-text outline-none focus:border-proxima-primary/60"
              placeholder="Your full name"
            />
          </label>

          <label className="block">
            <span className="block text-xs font-semibold text-proxima-muted mb-1.5">Society</span>
            <select
              required
              disabled={loading || societies.length === 0}
              value={societyId}
              onChange={(event) => setSocietyId(event.target.value)}
              className="w-full px-3 py-2.5 bg-proxima-base border border-proxima-border rounded-xl text-sm text-proxima-text outline-none focus:border-proxima-primary/60"
            >
              {societies.length === 0 ? (
                <option value="">No societies available</option>
              ) : (
                societies.map((society) => (
                  <option key={society.id} value={society.id}>
                    {society.name}
                  </option>
                ))
              )}
            </select>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="block text-xs font-semibold text-proxima-muted mb-1.5">Flat</span>
              <input
                required
                value={flatNumber}
                onChange={(event) => setFlatNumber(event.target.value)}
                className="w-full px-3 py-2.5 bg-proxima-base border border-proxima-border rounded-xl text-sm text-proxima-text outline-none focus:border-proxima-primary/60"
                placeholder="A-1204"
              />
            </label>

            <label className="block">
              <span className="block text-xs font-semibold text-proxima-muted mb-1.5">Phone</span>
              <input
                required
                inputMode="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className="w-full px-3 py-2.5 bg-proxima-base border border-proxima-border rounded-xl text-sm text-proxima-text outline-none focus:border-proxima-primary/60"
                placeholder="9876543210"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={saving || loading || !societyId}
            className="w-full py-3 bg-proxima-primary hover:brightness-110 text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Creating pass...' : 'Enter Proxima'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
