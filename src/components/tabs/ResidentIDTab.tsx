import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ResidentProfile } from '../../types';

interface ResidentIDTabProps { profile: ResidentProfile; }

export const ResidentIDTab: React.FC<ResidentIDTabProps> = ({ profile }) => {
  const [activeSection, setActiveSection] = useState(0);

  const initials = profile.name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0] ?? '')
    .join('')
    .toUpperCase();

  const sections = [
    { label: 'Profile details & Settings' },
    { label: 'My Listings for Sale (0)' },
    { label: 'My Shared Commutes (0)' },
    { label: 'Services & Bookings' },
  ];

  const stats = [
    { value: '0', label: 'My Listings' },
    { value: '0', label: 'Carpools Shared' },
    { value: '0', label: 'Bookmarks' },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <h1 className="text-2xl font-display font-black text-proxima-text">My Resident ID</h1>

      {/* Profile Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-proxima-card border border-proxima-border rounded-3xl p-6 relative overflow-hidden"
      >
        {/* Ambient glow decoration */}
        <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-proxima-primary/10 blur-3xl pointer-events-none" />

        {/* Avatar + info row */}
        <div className="flex items-start gap-5 relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-proxima-primary to-proxima-primary-light flex items-center justify-center shrink-0">
            <span className="font-display font-black text-proxima-base text-2xl">{initials}</span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h2 className="text-xl font-display font-black text-white">{profile.name}</h2>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-proxima-primary/20 text-proxima-primary-light border border-proxima-primary/30 rounded-full">
                Primary Resident
              </span>
            </div>
            <p className="text-sm text-proxima-muted font-mono mb-0.5">
              Unit {profile.flat_number} · {profile.society_name ?? 'Proxima Heights'}
            </p>
            <p className="text-xs text-proxima-muted font-mono">
              Resident Portal Card ID:{' '}
              <span className="text-proxima-primary-light">PXM-{profile.flat_number}</span>
            </p>
            <p className="text-xs text-proxima-muted font-mono mt-0.5">
              Member since <span className="text-proxima-text">{profile.member_since}</span>
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3.5 border-t border-proxima-border/60 pt-5 mt-5">
          {stats.map(({ value, label }) => (
            <div
              key={label}
              className="bg-proxima-base/40 p-2.5 rounded-xl border border-proxima-border/50 text-center"
            >
              <div className="text-lg font-display font-black text-proxima-primary">{value}</div>
              <div className="text-[10px] text-proxima-muted font-mono">{label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Account Sections */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="flex gap-4"
      >
        {/* Left sidebar */}
        <div className="w-1/3 space-y-1.5 shrink-0">
          {sections.map((section, i) => (
            <button
              key={section.label}
              onClick={() => setActiveSection(i)}
              className={`w-full text-left p-3.5 rounded-xl text-xs font-semibold flex items-center justify-between border transition-all ${
                activeSection === i
                  ? 'bg-proxima-active text-white border-proxima-border'
                  : 'bg-proxima-card text-proxima-muted hover:text-white border-transparent'
              }`}
            >
              <span>{section.label}</span>
              <span className="text-base leading-none ml-1">›</span>
            </button>
          ))}
        </div>

        {/* Right content */}
        <div className="flex-1 bg-proxima-card border border-proxima-border rounded-3xl p-5 min-w-0">
          {activeSection === 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-display font-black text-white mb-4">Profile Details</h3>

              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-proxima-muted mb-1 block">
                    Full Name
                  </label>
                  <input
                    disabled
                    value={profile.name}
                    readOnly
                    className="w-full bg-proxima-base/40 border border-proxima-border/50 rounded-xl px-3 py-2 text-sm text-proxima-text font-mono cursor-not-allowed opacity-70"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-proxima-muted mb-1 block">
                    Flat / Unit
                  </label>
                  <input
                    disabled
                    value={profile.flat_number}
                    readOnly
                    className="w-full bg-proxima-base/40 border border-proxima-border/50 rounded-xl px-3 py-2 text-sm text-proxima-text font-mono cursor-not-allowed opacity-70"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-proxima-muted mb-1 block">
                    Email
                  </label>
                  <input
                    disabled
                    value={profile.email}
                    readOnly
                    className="w-full bg-proxima-base/40 border border-proxima-border/50 rounded-xl px-3 py-2 text-sm text-proxima-text font-mono cursor-not-allowed opacity-70"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-proxima-muted mb-1 block">
                    Member Since
                  </label>
                  <input
                    disabled
                    value={profile.member_since}
                    readOnly
                    className="w-full bg-proxima-base/40 border border-proxima-border/50 rounded-xl px-3 py-2 text-sm text-proxima-text font-mono cursor-not-allowed opacity-70"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-proxima-muted mb-1 block">
                    Portal ID
                  </label>
                  <input
                    disabled
                    value={profile.portal_id}
                    readOnly
                    className="w-full bg-proxima-base/40 border border-proxima-border/50 rounded-xl px-3 py-2 text-sm text-proxima-primary-light font-mono cursor-not-allowed opacity-70"
                  />
                </div>
              </div>

              <p className="text-[10px] text-proxima-muted font-mono pt-2">
                <span className="text-proxima-success mr-1">✓</span>
                Profile is managed via Google Sign-In
              </p>
            </div>
          )}

          {activeSection === 1 && (
            <div className="flex flex-col items-center justify-center h-40 text-center">
              <p className="text-sm font-semibold text-white mb-1">No listings yet</p>
              <p className="text-xs text-proxima-muted">Visit the Bazar tab to post listings</p>
            </div>
          )}

          {activeSection === 2 && (
            <div className="flex flex-col items-center justify-center h-40 text-center">
              <p className="text-sm font-semibold text-white mb-1">No commutes shared</p>
              <p className="text-xs text-proxima-muted">Visit the Carpools tab to offer rides</p>
            </div>
          )}

          {activeSection === 3 && (
            <div className="flex flex-col items-center justify-center h-40 text-center">
              <p className="text-sm font-semibold text-white mb-1">No bookings yet</p>
              <p className="text-xs text-proxima-muted">Browse services to make your first booking</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
