import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { t } from '../lib/ui';

export const BookingConfirmationNew: React.FC = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(id);
  }, []);

  const details = [
    { label: 'Service',   value: 'AC Repair' },
    { label: 'Provider',  value: 'Raj' },
    { label: 'Scheduled', value: 'Today, 4:00 PM' },
    { label: 'Booking',   value: 'BK-2024-7293', mono: true },
  ];

  return (
    <div style={{
      minHeight: '100dvh',
      background: `radial-gradient(ellipse 70% 40% at 50% 30%, rgba(74,222,128,0.04) 0%, transparent 60%), ${t.bgDeep}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px 16px', fontFamily: t.font,
    }}>
      <div style={{
        width: '100%', maxWidth: '360px',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        transition: `opacity 400ms ${t.ease}, transform 400ms ${t.ease}`,
      }}>
        <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: t.radiusLg, overflow: 'hidden', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
          {/* Top success stripe */}
          <div style={{ height: '1px', background: `linear-gradient(90deg, transparent, ${t.successText}55, transparent)` }} />

          <div style={{ padding: '32px 24px', textAlign: 'center' }}>
            {/* Checkmark */}
            <div style={{
              width: '60px', height: '60px', borderRadius: '50%',
              backgroundColor: t.successBg,
              border: `1px solid ${t.successBorder}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
              opacity: visible ? 1 : 0,
              transform: visible ? 'scale(1)' : 'scale(0.5)',
              transition: `opacity 400ms ${t.ease} 100ms, transform 500ms cubic-bezier(0.34,1.4,0.64,1) 100ms`,
              boxShadow: visible ? `0 0 24px rgba(74,222,128,0.15)` : 'none',
            }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path d="M5 13l4 4L19 7" stroke={t.successText} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            <h1 style={{ fontSize: '20px', fontWeight: 700, color: t.ink, letterSpacing: '-0.02em', marginBottom: '6px' }}>
              Booking confirmed
            </h1>
            <p style={{ fontSize: '14px', color: t.muted, marginBottom: '28px', lineHeight: 1.5 }}>
              Raj will respond within 15 minutes.
            </p>

            {/* Divider */}
            <div style={{ height: '1px', backgroundColor: t.border, marginBottom: '20px' }} />

            {/* Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '28px', textAlign: 'left' }}>
              {details.map(({ label, value, mono }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', color: t.muted, fontWeight: 500 }}>{label}</span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: t.ink, fontFamily: mono ? t.fontMono : t.font, letterSpacing: mono ? '0.04em' : 0 }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div style={{ height: '1px', backgroundColor: t.border, marginBottom: '20px' }} />

            <button
              onClick={() => navigate('/home')}
              style={{
                width: '100%', padding: '11px', borderRadius: t.radius, border: 'none',
                backgroundColor: t.ochre, color: 'white',
                fontWeight: 600, fontSize: '14px', fontFamily: t.font,
                cursor: 'pointer', letterSpacing: '-0.01em',
                transition: `all 200ms ${t.ease}`,
                boxShadow: `0 0 0 1px ${t.ochreBorder}`,
                marginBottom: '10px',
              }}
              onMouseOver={e => { e.currentTarget.style.backgroundColor = t.ochreDark; e.currentTarget.style.boxShadow = `0 0 20px ${t.ochreGlow}, 0 0 0 1px ${t.ochreBorder}`; }}
              onMouseOut={e => { e.currentTarget.style.backgroundColor = t.ochre; e.currentTarget.style.boxShadow = `0 0 0 1px ${t.ochreBorder}`; }}
              onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
              onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              Back to services
            </button>

            <p style={{ fontSize: '12px', color: t.subtle }}>Updates will be sent to your email</p>
          </div>
        </div>
      </div>
    </div>
  );
};
