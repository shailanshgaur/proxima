import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Society } from '../types';
import { t } from '../lib/ui';

export const SignupPageNew: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', flatNumber: '', societyId: '' });
  const [societies, setSocieties] = useState<Society[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fallback: Society[] = [
    { id: 'soc-1', name: 'Mahindra Apts', created_at: '' },
    { id: 'soc-2', name: 'Lodha Park', created_at: '' },
    { id: 'soc-3', name: 'Prestige Towers', created_at: '' },
  ];

  useEffect(() => {
    supabase.from('societies').select('*').then(({ data, error }) => {
      setSocieties(!error && data?.length ? data : fallback);
    });
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.name.trim()) return setError('Name is required');
    if (!form.flatNumber.trim()) return setError('Flat number is required');
    if (!form.societyId) return setError('Select your society');
    setLoading(true);
    navigate('/home');
  };

  const disabled = loading || !form.name || !form.flatNumber || !form.societyId;

  return (
    <div style={{
      minHeight: '100dvh',
      background: `radial-gradient(ellipse 80% 50% at 50% -10%, rgba(224,123,57,0.06) 0%, transparent 60%), ${t.bgDeep}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px 16px', fontFamily: t.font,
    }}>
      <div style={{ width: '100%', maxWidth: '360px', animation: `fadeUp 0.5s ${t.ease} both` }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `linear-gradient(135deg, ${t.ochre}, ${t.ochreDark})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 20px ${t.ochreGlow}` }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="7" r="3.5" fill="white"/>
                <path d="M2 17c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </div>
            <span style={{ fontSize: '20px', fontWeight: 700, color: t.ink, letterSpacing: '-0.03em' }}>Proxima</span>
          </div>
        </div>

        {/* Card */}
        <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: t.radiusLg, overflow: 'hidden', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
          <div style={{ height: '1px', background: `linear-gradient(90deg, transparent, ${t.ochre}55, transparent)` }} />

          <div style={{ padding: '28px 24px' }}>
            {/* Step progress */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: t.ochre, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                  <path d="M2 5.5l2.5 2.5 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div style={{ flex: 1, height: '1px', background: `linear-gradient(90deg, ${t.ochre}, ${t.ochreBorder})` }} />
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: `2px solid ${t.ochre}`, backgroundColor: t.ochreDim, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: t.ochre }}>2</span>
              </div>
            </div>

            <h1 style={{ fontSize: '20px', fontWeight: 700, color: t.ink, letterSpacing: '-0.02em', marginBottom: '4px' }}>
              Your profile
            </h1>
            <p style={{ fontSize: '13px', color: t.muted, marginBottom: '24px' }}>
              Last step — where do you live?
            </p>

            <form onSubmit={submit}>
              {error && (
                <div style={{ background: t.errBg, border: `1px solid ${t.errBorder}`, borderRadius: t.radius, padding: '10px 12px', marginBottom: '14px' }}>
                  <p style={{ fontSize: '13px', color: t.errText, margin: 0, fontWeight: 500 }}>{error}</p>
                </div>
              )}

              {[
                { id: 'name', label: 'Full name', placeholder: 'Priya Sharma', value: form.name, key: 'name' as const },
                { id: 'flat', label: 'Flat number', placeholder: 'A-501', value: form.flatNumber, key: 'flatNumber' as const },
              ].map(field => (
                <div key={field.id} style={{ marginBottom: '14px' }}>
                  <label htmlFor={field.id} style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: t.muted, marginBottom: '6px', letterSpacing: '0.04em' }}>{field.label}</label>
                  <input
                    id={field.id} type="text" value={field.value} placeholder={field.placeholder} required autoFocus={field.id === 'name'}
                    onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: t.radius, border: `1px solid ${t.border}`, backgroundColor: t.elevated, color: t.ink, fontSize: '15px', fontFamily: t.font, outline: 'none', transition: `border-color 200ms ${t.ease}, box-shadow 200ms ${t.ease}` }}
                    onFocus={e => { e.target.style.borderColor = t.ochre; e.target.style.boxShadow = `0 0 0 3px ${t.ochreGlow}`; }}
                    onBlur={e => { e.target.style.borderColor = t.border; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
              ))}

              <div style={{ marginBottom: '24px' }}>
                <label htmlFor="society" style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: t.muted, marginBottom: '6px', letterSpacing: '0.04em' }}>Society</label>
                <div style={{ position: 'relative' }}>
                  <select
                    id="society" value={form.societyId} required
                    onChange={e => setForm({ ...form, societyId: e.target.value })}
                    style={{ width: '100%', padding: '10px 36px 10px 12px', borderRadius: t.radius, border: `1px solid ${t.border}`, backgroundColor: t.elevated, color: form.societyId ? t.ink : t.subtle, fontSize: '15px', fontFamily: t.font, outline: 'none', appearance: 'none', cursor: 'pointer', transition: `border-color 200ms ${t.ease}, box-shadow 200ms ${t.ease}` }}
                    onFocus={e => { e.target.style.borderColor = t.ochre; e.target.style.boxShadow = `0 0 0 3px ${t.ochreGlow}`; }}
                    onBlur={e => { e.target.style.borderColor = t.border; e.target.style.boxShadow = 'none'; }}
                  >
                    <option value="">Select society...</option>
                    {societies.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                  <svg style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 4l4 4 4-4" stroke={t.muted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

              <button type="submit" disabled={disabled}
                style={{ width: '100%', padding: '11px', borderRadius: t.radius, border: 'none', backgroundColor: disabled ? 'rgba(255,255,255,0.06)' : t.ochre, color: disabled ? t.subtle : 'white', fontWeight: 600, fontSize: '14px', fontFamily: t.font, cursor: disabled ? 'not-allowed' : 'pointer', letterSpacing: '-0.01em', transition: `all 200ms ${t.ease}`, boxShadow: disabled ? 'none' : `0 0 0 1px ${t.ochreBorder}` }}
                onMouseOver={e => { if (!disabled) { e.currentTarget.style.backgroundColor = t.ochreDark; e.currentTarget.style.boxShadow = `0 0 20px ${t.ochreGlow}`; } }}
                onMouseOut={e => { if (!disabled) { e.currentTarget.style.backgroundColor = t.ochre; e.currentTarget.style.boxShadow = `0 0 0 1px ${t.ochreBorder}`; } }}
                onMouseDown={e => { if (!disabled) e.currentTarget.style.transform = 'scale(0.98)'; }}
                onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                {loading ? 'Creating account…' : 'Create account'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
