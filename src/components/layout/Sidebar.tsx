import React from 'react';
import { ResidentProfile, Tab } from '../../types';
import { authService } from '../../lib/authService';

interface SidebarProps {
  profile: ResidentProfile;
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const NAV_ITEMS: { id: Tab; label: string; badge?: string }[] = [
  { id: 'overview',  label: 'Hub Overview' },
  { id: 'bazar',     label: 'Society Bazar', badge: 'New' },
  { id: 'carpools',  label: 'Society Carpools' },
  { id: 'services',  label: 'Verified Directory' },
  { id: 'profile',   label: 'My Resident ID' },
  { id: 'admin',     label: 'Admin Desk' },
];

export const Sidebar: React.FC<SidebarProps> = ({ profile, activeTab, onTabChange }) => {
  const initials = profile.name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <aside className="w-[260px] shrink-0 bg-proxima-card border-r border-proxima-border flex flex-col h-screen sticky top-0 overflow-y-auto">

      {/* Branding */}
      <div className="px-4 pt-5 pb-4 border-b border-proxima-border">
        <div className="flex items-start justify-between">
          <div>
            <p
              className="text-sm font-bold text-proxima-primary tracking-widest uppercase"
              style={{ letterSpacing: '0.14em' }}
            >
              PROXIMA
            </p>
            <p className="text-[10px] font-semibold text-proxima-muted mt-0.5 tracking-wider uppercase">
              Resident Elite
            </p>
          </div>
          <div
            className="px-2 py-1 rounded-md bg-proxima-active border border-proxima-secondary/40 text-xs font-bold text-white"
          >
            {profile.flat_number}
          </div>
        </div>
      </div>

      {/* Resident mini-profile */}
      <div className="px-4 py-4 border-b border-proxima-border space-y-3">
        <div className="flex items-center gap-3">
          {/* Gradient avatar */}
          <div
            className="w-10 h-10 rounded-full bg-gradient-to-br from-proxima-primary to-proxima-secondary flex items-center justify-center text-sm font-bold text-white shrink-0 shadow-md"
          >
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-white truncate leading-tight">
              {profile.name}
            </p>
            <p className="text-xs text-proxima-muted truncate mt-0.5">
              {profile.email}
            </p>
          </div>
        </div>

        {/* Status badge */}
        <div className="flex items-center gap-1.5">
          <span className="text-proxima-primary text-xs font-semibold">✓</span>
          <span className="text-xs font-medium text-proxima-primary">Verified Resident</span>
        </div>

        {/* Member since + vehicles row */}
        <div className="flex items-center justify-between text-xs text-proxima-muted">
          <span>
            Since{' '}
            <span className="font-medium text-proxima-text">{profile.member_since}</span>
          </span>
          <span>
            <span className="font-medium text-proxima-text">0 Active</span> vehicles
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 space-y-0.5">
        <p className="text-[10px] font-semibold text-proxima-muted px-2 py-2 uppercase tracking-widest">
          Navigation
        </p>
        {NAV_ITEMS.filter((item) => item.id !== 'admin' || profile.is_admin).map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center justify-between px-3 rounded-lg text-left transition-all cursor-pointer ${
              activeTab === item.id
                ? 'bg-proxima-active border border-proxima-border/70 text-proxima-primary glow-amber-active'
                : 'text-proxima-muted hover:bg-proxima-active hover:text-proxima-text border border-transparent'
            }`}
            style={{ minHeight: '44px' }}
          >
            <span
              className={`text-sm ${
                activeTab === item.id ? 'font-semibold text-proxima-primary' : 'font-medium'
              }`}
            >
              {item.label}
            </span>
            <div className="flex items-center gap-1.5">
              {item.badge && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-proxima-primary/10 text-proxima-primary border border-proxima-primary/20">
                  {item.badge}
                </span>
              )}
              <span
                className={`text-base leading-none ${
                  activeTab === item.id ? 'text-proxima-primary' : 'text-proxima-muted/40'
                }`}
              >
                ›
              </span>
            </div>
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-proxima-border">
        <button
          onClick={() => authService.signOut()}
          className="w-full px-3 rounded-lg text-sm font-medium text-proxima-muted hover:text-red-400 hover:bg-red-500/10 transition-all text-left cursor-pointer border border-transparent hover:border-red-500/20"
          style={{ minHeight: '44px' }}
        >
          Sign out
        </button>
      </div>
    </aside>
  );
};
