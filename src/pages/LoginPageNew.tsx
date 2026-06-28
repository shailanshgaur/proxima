import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../lib/authService';
import { t } from '../lib/ui';

export const LoginPageNew: React.FC = () => {
  const navigate = useNavigate();
  const [stage, setStage] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown <= 0) return;
    const id = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(id);
  }, [countdown]);

  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setLoading(true);
    try {
      await authService.signUpWithEmail(email);
      setStage('otp'); setCountdown(60);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send code');
    } finally { setLoading(false); }
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setLoading(true);
    try {
      await authService.verifyEmailOtp(email, otp);
      navigate('/signup');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid code');
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: '100dvh',
      background: `radial-gradient(ellipse 80% 50% at 50% -10%, rgba(224,123,57,0.08) 0%, transparent 60%), ${t.bgDeep}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px 16px', fontFamily: t.font,
    }}>
      <div style={{ width: '100%', maxWidth: '360px', animation: `fadeUp 0.5s ${t.ease} both` }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: `linear-gradient(135deg, ${t.ochre} 0%, ${t.ochreDark} 100%)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 0 20px ${t.ochreGlow}`,
            }}>
              <ProximaIcon />
            </div>
            <span style={{ fontSize: '20px', fontWeight: 700, color: t.ink, letterSpacing: '-0.03em' }}>
              Proxima
            </span>
          </div>
        </div>

        {/* Card */}
        <div style={{
          background: t.surface,
          border: `1px solid ${t.border}`,
          borderRadius: t.radiusLg,
          overflow: 'hidden',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}>
          {/* Top glow stripe */}
          <div style={{ height: '1px', background: `linear-gradient(90deg, transparent 0%, ${t.ochre}55 50%, transparent 100%)` }} />

          <div style={{ padding: '28px 24px' }}>
            {stage === 'email' ? (
              <form onSubmit={sendOtp}>
                <h1 style={{ fontSize: '20px', fontWeight: 700, color: t.ink, letterSpacing: '-0.02em', marginBottom: '4px' }}>
                  Sign in
                </h1>
                <p style={{ fontSize: '13px', color: t.muted, marginBottom: '24px' }}>
                  Enter your email to continue to Proxima
                </p>

                {error && <ErrorBox msg={error} />}

                <Field label="Email address">
                  <Input
                    type="email" value={email} placeholder="you@example.com"
                    onChange={e => setEmail(e.target.value)} required autoFocus
                  />
                </Field>

                <PrimaryBtn disabled={loading || !email} label={loading ? 'Sending…' : 'Continue'} />

                <p style={{ textAlign: 'center', fontSize: '12px', color: t.subtle, marginTop: '16px' }}>
                  No account?{' '}
                  <a href="/signup" style={{ color: t.ochre, fontWeight: 600, cursor: 'pointer' }}>Create one</a>
                </p>
              </form>
            ) : (
              <form onSubmit={verifyOtp}>
                <button type="button" onClick={() => { setStage('email'); setOtp(''); setError(null); }}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: t.muted, fontSize: '13px', cursor: 'pointer', padding: '0', marginBottom: '20px', fontFamily: t.font }}
                  onMouseOver={e => (e.currentTarget.style.color = t.ink)}
                  onMouseOut={e => (e.currentTarget.style.color = t.muted)}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Back
                </button>

                <h1 style={{ fontSize: '20px', fontWeight: 700, color: t.ink, letterSpacing: '-0.02em', marginBottom: '4px' }}>
                  Check your email
                </h1>
                <p style={{ fontSize: '13px', color: t.muted, marginBottom: '24px' }}>
                  6-digit code sent to <strong style={{ color: t.ink }}>{email}</strong>
                </p>

                {error && <ErrorBox msg={error} />}

                <Field label="Verification code" hint={
                  countdown > 0
                    ? <span style={{ color: t.subtle }}>{countdown}s</span>
                    : <span style={{ color: t.ochre, cursor: 'pointer', fontWeight: 600 }}
                        onClick={() => { setCountdown(60); authService.signUpWithEmail(email); }}>
                        Resend
                      </span>
                }>
                  <input
                    type="text" inputMode="numeric" maxLength={6}
                    value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="000000" autoFocus
                    style={{
                      width: '100%', padding: '13px 16px',
                      borderRadius: t.radius, border: `1px solid ${t.border}`,
                      backgroundColor: t.elevated, color: t.ink,
                      fontSize: '24px', fontWeight: 700,
                      fontFamily: t.fontMono, letterSpacing: '0.3em',
                      textAlign: 'center', outline: 'none',
                      transition: `border-color 200ms ${t.ease}, box-shadow 200ms ${t.ease}`,
                    }}
                    onFocus={e => { e.target.style.borderColor = t.ochre; e.target.style.boxShadow = `0 0 0 3px ${t.ochreGlow}`; }}
                    onBlur={e => { e.target.style.borderColor = t.border; e.target.style.boxShadow = 'none'; }}
                  />
                </Field>

                <PrimaryBtn disabled={otp.length !== 6 || loading} label={loading ? 'Verifying…' : 'Verify code'} />
              </form>
            )}
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: '11px', color: t.subtle, marginTop: '20px', lineHeight: 1.6 }}>
          By continuing you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

// ── Reusable atoms ───────────────────────────────────────────────────────────

const ProximaIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <circle cx="9" cy="7" r="3.5" fill="white"/>
    <path d="M2 17c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

const Field = ({ label, hint, children }: { label: string; hint?: React.ReactNode; children: React.ReactNode }) => (
  <div style={{ marginBottom: '14px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
      <label style={{ fontSize: '12px', fontWeight: 500, color: t.muted, letterSpacing: '0.04em' }}>{label}</label>
      {hint && <span style={{ fontSize: '12px' }}>{hint}</span>}
    </div>
    {children}
  </div>
);

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    style={{
      width: '100%', padding: '10px 12px',
      borderRadius: t.radius, border: `1px solid ${t.border}`,
      backgroundColor: t.elevated, color: t.ink,
      fontSize: '15px', fontFamily: t.font, outline: 'none',
      transition: `border-color 200ms ${t.ease}, box-shadow 200ms ${t.ease}`,
    }}
    onFocus={e => { e.target.style.borderColor = t.ochre; e.target.style.boxShadow = `0 0 0 3px ${t.ochreGlow}`; props.onFocus?.(e); }}
    onBlur={e => { e.target.style.borderColor = t.border; e.target.style.boxShadow = 'none'; props.onBlur?.(e); }}
  />
);

const PrimaryBtn = ({ disabled, label }: { disabled: boolean; label: string }) => (
  <button type="submit" disabled={disabled}
    style={{
      width: '100%', padding: '11px',
      borderRadius: t.radius, border: 'none',
      backgroundColor: disabled ? 'rgba(255,255,255,0.06)' : t.ochre,
      color: disabled ? t.subtle : 'white',
      fontWeight: 600, fontSize: '14px', fontFamily: t.font,
      cursor: disabled ? 'not-allowed' : 'pointer',
      letterSpacing: '-0.01em',
      transition: `all 200ms ${t.ease}`,
      boxShadow: disabled ? 'none' : `0 0 0 1px ${t.ochreBorder}`,
    }}
    onMouseOver={e => { if (!disabled) { e.currentTarget.style.backgroundColor = t.ochreDark; e.currentTarget.style.boxShadow = `0 0 20px ${t.ochreGlow}`; } }}
    onMouseOut={e => { if (!disabled) { e.currentTarget.style.backgroundColor = t.ochre; e.currentTarget.style.boxShadow = `0 0 0 1px ${t.ochreBorder}`; } }}
    onMouseDown={e => { if (!disabled) e.currentTarget.style.transform = 'scale(0.98)'; }}
    onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
  >{label}</button>
);

const ErrorBox = ({ msg }: { msg: string }) => (
  <div style={{ background: t.errBg, border: `1px solid ${t.errBorder}`, borderRadius: t.radius, padding: '10px 12px', marginBottom: '14px' }}>
    <p style={{ fontSize: '13px', color: t.errText, margin: 0, fontWeight: 500 }}>{msg}</p>
  </div>
);
