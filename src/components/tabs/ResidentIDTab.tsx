import React from 'react';
import { motion } from 'motion/react';
import { User, ShoppingBag, Car, Bookmark, Settings, ChevronRight } from 'lucide-react';
import { ResidentProfile } from '../../types';

interface ResidentIDTabProps { profile: ResidentProfile; }

export const ResidentIDTab: React.FC<ResidentIDTabProps> = ({ profile }) => {
  const initials = profile.name.split(' ').slice(0,2).map(w => w[0]).join('').toUpperCase();

  const SECTIONS = [
    { icon: <Settings className="w-4 h-4" />, label: 'Profile details & Settings', sub: 'Manage your personal information' },
    { icon: <ShoppingBag className="w-4 h-4" />, label: 'My Listings for Sale', sub: '0 active listings' },
    { icon: <Car className="w-4 h-4" />, label: 'My Shared Commutes', sub: '0 rides offered' },
    { icon: <Bookmark className="w-4 h-4" />, label: 'Bookmarked Services', sub: '0 saved vendors' },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <h1 className="text-2xl font-display font-black text-proxima-text flex items-center gap-2">
        <User className="w-6 h-6 text-proxima-warning" />
        My Resident ID
      </h1>

      {/* ID Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-proxima-card border border-proxima-border rounded-2xl p-6"
      >
        <div className="flex items-start gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-proxima-primary/15 border-2 border-proxima-primary/40 flex items-center justify-center text-2xl font-black text-proxima-primary-light font-mono">
              {initials}
            </div>
            <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-proxima-success rounded-full border-2 border-proxima-card flex items-center justify-center">
              <span className="text-white text-[9px] font-bold">✓</span>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-display font-black text-proxima-text">{profile.name}</h2>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-proxima-primary/20 text-proxima-primary-light border border-proxima-primary/30 rounded-full">Primary Resident</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-proxima-muted font-mono">Unit {profile.flat_number} · {profile.society_name ?? 'Proxima Heights'}</p>
              <p className="text-xs text-proxima-muted font-mono">Resident Portal Card ID: <span className="text-proxima-primary-light">{profile.portal_id}</span></p>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-proxima-active border border-proxima-border rounded-xl">
                <span className="text-[9px] text-proxima-muted font-mono uppercase">Vetted Mode</span>
                <span className="text-[10px] font-bold text-proxima-secondary">Vendor/Skill Mode</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex mt-6 bg-proxima-active rounded-xl overflow-hidden border border-proxima-border">
          {[['0', 'My Listings'], ['0', 'Carpools Shared'], ['0', 'Bookmarks']].map(([val, label], i) => (
            <div key={label} className={`flex-1 px-4 py-3 text-center ${i < 2 ? 'border-r border-proxima-border' : ''}`}>
              <div className="text-xl font-black text-proxima-text font-mono">{val}</div>
              <div className="text-[10px] text-proxima-muted mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Account sections */}
      <div>
        <h2 className="text-xs font-mono uppercase tracking-widest text-proxima-muted mb-3">My Account Sections</h2>
        <div className="space-y-2">
          {SECTIONS.map((section, i) => (
            <motion.button
              key={section.label}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="w-full flex items-center gap-3 p-4 bg-proxima-card border border-proxima-border rounded-xl text-left hover:border-proxima-primary/30 hover:bg-proxima-active transition-all group"
            >
              <span className="text-proxima-muted group-hover:text-proxima-primary transition-colors">{section.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-proxima-text">{section.label}</div>
                <div className="text-xs text-proxima-muted">{section.sub}</div>
              </div>
              <ChevronRight className="w-4 h-4 text-proxima-muted shrink-0" />
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};
