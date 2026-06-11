import React, { useState, useEffect } from 'react';
import { authService } from '../../lib/authService';
import { supabase } from '../../lib/supabaseClient';
import { Society } from '../../types';

interface SignupFlowProps {
  onSuccess: () => void;
  onLoginClick: () => void;
}

export const SignupFlow: React.FC<SignupFlowProps> = ({ onSuccess, onLoginClick }) => {
  const [stage, setStage] = useState<'phone' | 'otp' | 'details'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [flatNumber, setFlatNumber] = useState('');
  const [societyId, setSocietyId] = useState('');
  const [societies, setSocieties] = useState<Society[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authId, setAuthId] = useState<string | null>(null);

  useEffect(() => {
    const fetchSocieties = async () => {
      const { data, error } = await supabase.from('societies').select('*');
      if (error) {
        console.error('Failed to fetch societies:', error);
      } else {
        setSocieties(data || []);
      }
    };
    fetchSocieties();
  }, []);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await authService.signUpWithPhone(phone);
      setStage('otp');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { session } = await authService.verifyOtp(phone, otp);
      if (session?.user?.id) {
        setAuthId(session.user.id);
        setStage('details');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (!authId) throw new Error('Auth ID missing');
      await authService.createUserProfile(authId, phone, societyId, name, flatNumber);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h2>Create Zing Connect Account</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {stage === 'phone' && (
        <form onSubmit={handleSendOtp}>
          <input
            type="tel"
            placeholder="Enter phone number (+91...)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px' }}>
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </form>
      )}

      {stage === 'otp' && (
        <form onSubmit={handleVerifyOtp}>
          <p>OTP sent to {phone}</p>
          <input
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            maxLength={6}
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px' }}>
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
          <button
            type="button"
            onClick={() => setStage('phone')}
            style={{ width: '100%', padding: '10px', marginTop: '10px' }}
          >
            Back
          </button>
        </form>
      )}

      {stage === 'details' && (
        <form onSubmit={handleCreateProfile}>
          <input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
          <input
            type="text"
            placeholder="Flat number (e.g., 2405)"
            value={flatNumber}
            onChange={(e) => setFlatNumber(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
          <select
            value={societyId}
            onChange={(e) => setSocietyId(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          >
            <option value="">Select your society</option>
            {societies.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px' }}>
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
      )}

      <p style={{ marginTop: '20px', textAlign: 'center' }}>
        Already have an account?{' '}
        <button
          onClick={onLoginClick}
          style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer' }}
        >
          Log in here
        </button>
      </p>
    </div>
  );
};
