import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { vendorService } from '../lib/vendorService';
import { Vendor } from '../types';
import { t } from '../lib/ui';

export const HomePageNew: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'distance' | 'rating'>('distance');
  const [search, setSearch] = useState('');

  useEffect(() => {
    vendorService.getVendorsBySociety('sample-society-id')
      .then(data => setVendors(data.sort((a, b) =>
        sortBy === 'distance' ? (a.distance || 0) - (b.distance || 0) : b.rating - a.rating
      )))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [sortBy]);

  const filtered = vendors.filter(v =>
    !search ||
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    v.categories.some(c => c.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ minHeight: '100dvh', backgroundColor: t.bg, paddingBottom: '72px', fontFamily: t.font }}>

      {/* Header */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 20,
        backgroundColor: 'rgba(5,5,6,0.85)',
        borderBottom: `1px solid ${t.border}`,
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        padding: '14px 16px',
      }}>
        <div style={{ maxWidth: '560px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '22px', height: '22px', borderRadius: '6px', background: `linear-gradient(135deg, ${t.ochre}, ${t.ochreDark})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="11" height="11" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="7" r="3.5" fill="white"/>
                  <path d="M2 17c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <span style={{ fontSize: '15px', fontWeight: 700, color: t.ink, letterSpacing: '-0.02em' }}>Services nearby</span>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {(['distance', 'rating'] as const).map(opt => (
                <button key={opt} onClick={() => setSortBy(opt)}
                  style={{
                    padding: '4px 12px', borderRadius: t.radiusFull,
                    border: `1px solid ${sortBy === opt ? t.ochreBorder : t.border}`,
                    backgroundColor: sortBy === opt ? t.ochreDim : 'transparent',
                    color: sortBy === opt ? t.ochre : t.muted,
                    fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                    transition: `all 200ms ${t.ease}`, fontFamily: t.font,
                  }}
                >
                  {opt === 'distance' ? 'Nearest' : 'Top rated'}
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div style={{ position: 'relative' }}>
            <svg style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="6" cy="6" r="4" stroke={t.subtle} strokeWidth="1.5"/>
              <path d="M9.5 9.5L12 12" stroke={t.subtle} strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search AC repair, plumbing…"
              style={{ width: '100%', padding: '9px 12px 9px 30px', borderRadius: t.radius, border: `1px solid ${t.border}`, backgroundColor: t.elevated, color: t.ink, fontSize: '14px', fontFamily: t.font, outline: 'none', transition: `border-color 200ms ${t.ease}, box-shadow 200ms ${t.ease}` }}
              onFocus={e => { e.target.style.borderColor = t.ochre; e.target.style.boxShadow = `0 0 0 3px ${t.ochreGlow}`; }}
              onBlur={e => { e.target.style.borderColor = t.border; e.target.style.boxShadow = 'none'; }}
            />
          </div>
        </div>
      </header>

      {/* List */}
      <main style={{ maxWidth: '560px', margin: '0 auto', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {loading && <SkeletonList />}
        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: t.muted, fontSize: '14px' }}>
            {search ? `No results for "${search}"` : 'No vendors nearby yet.'}
          </div>
        )}
        {filtered.map((vendor, idx) => <VendorCard key={vendor.id} vendor={vendor} idx={idx} />)}
      </main>

      {/* Bottom nav */}
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        backgroundColor: 'rgba(5,5,6,0.92)',
        borderTop: `1px solid ${t.border}`,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        height: '60px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-around',
        padding: '0 8px', fontFamily: t.font,
      }}>
        <NavBtn label="Home" active icon={<HomeIcon />} />
        <NavBtn label="Bookings" icon={<BookIcon />} />
        <NavBtn label="Profile" icon={<UserIcon />} />
      </nav>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: -800px 0; }
          100% { background-position: 800px 0; }
        }
      `}</style>
    </div>
  );
};

// ── Vendor card ──────────────────────────────────────────────────────────────

const VendorCard = ({ vendor, idx }: { vendor: Vendor; idx: number }) => {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? t.surfaceHover : t.surface,
        border: `1px solid ${hovered ? t.borderHover : t.border}`,
        borderRadius: t.radiusLg,
        padding: '16px',
        transition: `all 200ms ${t.ease}`,
        animation: `fadeUp 0.4s ${t.ease} ${idx * 0.06}s both`,
        transform: hovered ? 'translateY(-1px)' : 'translateY(0)',
      }}
    >
      {/* Name + rating row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: t.ink, letterSpacing: '-0.01em', margin: '0 0 3px 0' }}>
            {vendor.name}
          </h2>
          <p style={{ fontSize: '12px', color: t.muted, margin: 0, fontWeight: 500 }}>
            {vendor.categories?.[0] || 'Home services'}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', backgroundColor: t.ochreDim, border: `1px solid ${t.ochreBorder}`, padding: '3px 9px', borderRadius: t.radiusFull }}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill={t.ochre}>
            <path d="M5 1l1.2 2.5L9 3.9 7 5.8l.5 2.7L5 7.2 2.5 8.5 3 5.8 1 3.9l2.8-.4z"/>
          </svg>
          <span style={{ fontSize: '13px', fontWeight: 700, color: t.ochre }}>{vendor.rating.toFixed(1)}</span>
          <span style={{ fontSize: '11px', color: t.subtle }}>({vendor.review_count})</span>
        </div>
      </div>

      {/* Separator */}
      <div style={{ height: '1px', backgroundColor: t.border, marginBottom: '12px' }} />

      {/* Metadata pills */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
        <Pill text={`${vendor.distance?.toFixed(1)} km`} />
        <Pill text={`~${vendor.response_time}`} />
        {(vendor.jobs_this_month ?? 0) > 0 && (
          <Pill text={`${vendor.jobs_this_month} jobs nearby`} green />
        )}
      </div>

      {/* Review */}
      {vendor.review_snippet && (
        <p style={{ fontSize: '13px', color: t.muted, fontStyle: 'italic', margin: '0 0 14px 0', lineHeight: 1.55 }}>
          "{vendor.review_snippet}"
        </p>
      )}

      {/* CTA */}
      <button
        onClick={() => navigate('/booking-confirmation')}
        style={{
          width: '100%', padding: '10px',
          borderRadius: t.radius, border: 'none',
          backgroundColor: t.ochre, color: 'white',
          fontWeight: 600, fontSize: '14px', fontFamily: t.font,
          cursor: 'pointer', letterSpacing: '-0.01em',
          transition: `all 200ms ${t.ease}`,
          boxShadow: `0 0 0 1px ${t.ochreBorder}`,
        }}
        onMouseOver={e => { e.currentTarget.style.backgroundColor = t.ochreDark; e.currentTarget.style.boxShadow = `0 0 20px ${t.ochreGlow}, 0 0 0 1px ${t.ochreBorder}`; }}
        onMouseOut={e => { e.currentTarget.style.backgroundColor = t.ochre; e.currentTarget.style.boxShadow = `0 0 0 1px ${t.ochreBorder}`; }}
        onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
        onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        Book {vendor.name.split(' ')[0]}
      </button>
    </div>
  );
};

// ── Atoms ────────────────────────────────────────────────────────────────────

const Pill = ({ text, green }: { text: string; green?: boolean }) => (
  <span style={{
    display: 'inline-block', padding: '3px 9px', borderRadius: t.radiusFull,
    fontSize: '12px', fontWeight: 500,
    backgroundColor: green ? t.successBg : 'rgba(255,255,255,0.05)',
    border: `1px solid ${green ? t.successBorder : t.border}`,
    color: green ? t.successText : t.muted,
  }}>{text}</span>
);

const SkeletonList = () => (
  <>
    {[1, 2, 3].map(i => (
      <div key={i} style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: t.radiusLg, padding: '16px' }}>
        {[60, 40, 80].map((w, j) => (
          <div key={j} style={{
            height: j === 0 ? '15px' : '11px', width: `${w}%`, borderRadius: '4px',
            marginBottom: j < 2 ? '8px' : 0,
            background: `linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%)`,
            backgroundSize: '800px 100%',
            animation: 'shimmer 1.6s infinite linear',
          }} />
        ))}
      </div>
    ))}
  </>
);

const NavBtn = ({ label, icon, active }: { label: string; icon: React.ReactNode; active?: boolean }) => (
  <button style={{
    background: 'none', border: 'none', cursor: 'pointer',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px',
    color: active ? t.ochre : t.subtle,
    fontSize: '11px', fontWeight: active ? 600 : 400,
    padding: '4px 24px', fontFamily: t.font,
    transition: `color 200ms ${t.ease}`,
    minHeight: '44px', justifyContent: 'center',
  }}
    onMouseOver={e => (e.currentTarget.style.color = active ? t.ochre : t.muted)}
    onMouseOut={e => (e.currentTarget.style.color = active ? t.ochre : t.subtle)}
  >
    {icon}
    {label}
  </button>
);

const HomeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M2 8l7-6 7 6v8a1 1 0 01-1 1H3a1 1 0 01-1-1V8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M6.5 17V12h5v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const BookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <rect x="2.5" y="2.5" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M6 7.5h6M6 10.5h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <circle cx="9" cy="6" r="3" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M3 16c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
