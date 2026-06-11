import React, { useState } from 'react';
import { authService } from '../../lib/authService';

interface PhoneLoginProps {
  onSuccess: () => void;
  onSignupClick: () => void;
}

export const PhoneLogin: React.FC<PhoneLoginProps> = ({ onSuccess, onSignupClick }) => {
  const [stage, setStage] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      await authService.verifyOtp(phone, otp);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h2>Login to Zing Connect</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {stage === 'phone' ? (
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
      ) : (
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

      <p style={{ marginTop: '20px', textAlign: 'center' }}>
        New to Zing Connect?{' '}
        <button
          onClick={onSignupClick}
          style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer' }}
        >
          Sign up here
        </button>
      </p>
    </div>
  );
};
