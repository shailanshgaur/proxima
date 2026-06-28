import React from 'react';
import { LayoutDashboard, ShoppingBag, Car, Wrench, User, Lock, LogOut } from 'lucide-react';
import { ResidentProfile, Tab } from '../../types';
import { authService } from '../../lib/authService';

interface SidebarProps {
  profile: ResidentProfile;
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const NAV_ITEMS: { id: Tab; label: string; icon: React.ReactNode; badge?: string }[] = [
  { id: 'overview',  label: 'Hub Overview',       icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: 'bazar',     label: 'Society Bazar',       icon: <ShoppingBag className="w-4 h-4" />, badge: 'New' },
  { id: 'carpools',  label: 'Society Carpools',    icon: <Car className="w-4 h-4" /> },
  { id: 'services',  label: 'Verified Directory',  icon: <Wrench className="w-4 h-4" /> },
  { id: 'profile',   label: 'My Resident ID',      icon: <User className="w-4 h-4" /> },
  { id: 'admin',     label: 'Admin Desk',          icon: <Lock className="w-4 h-4" /> },
];

export const Sidebar: React.FC<SidebarProps> = ({ profile, activeTab, onTabChange }) => {
  const initials = profile.name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();

  return (
    <aside className="w-[280px] shrink-0 bg-proxima-card border-r border-proxima-border flex flex-col h-screen sticky top-0 overflow-y-auto">
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-proxima-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-proxima-primary/20 border border-proxima-primary/30 flex items-center justify-center">
            <LayoutDashboard className="w-4 h-4 text-proxima-primary" />
          </div>
          <div>
            <div className="text-sm font-display font-black text-proxima-text tracking-wider uppercase">PROXIMA</div>
            <div className="text-[9px] text-proxima-muted uppercase tracking-widest font-mono">RESIDENT ELITE</div>
          </div>
        </div>
        <div className="px-2 py-1 rounded-lg bg-proxima-active border border-proxima-border text-xs font-mono font-bold text-proxima-primary-light">
          {profile.flat_number}
        </div>
      </div>

      {/* Resident card */}
      <div className="p-4 border-b border-proxima-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-proxima-primary/20 border-2 border-proxima-primary/40 flex items-center justify-center text-sm font-bold text-proxima-primary-light font-mono">
            {initials}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-proxima-text truncate">{profile.name}</div>
            <div className="text-[10px] text-proxima-muted truncate">{profile.email}</div>
          </div>
        </div>
        <div className="mt-3 flex gap-4 text-[10px] text-proxima-muted">
          <div><span className="block text-proxima-text font-semibold text-xs">Member since</span>{profile.member_since}</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        <p className="text-[9px] font-mono uppercase tracking-widest text-proxima-muted px-2 py-2">Main Services</p>
        {NAV_ITEMS.filter(item => item.id !== 'admin' || profile.is_admin).map(item => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all duration-200 group ${
              activeTab === item.id
                ? 'bg-proxima-active text-proxima-primary-light'
                : 'text-proxima-muted hover:bg-proxima-active/50 hover:text-proxima-text'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className={activeTab === item.id ? 'text-proxima-primary' : 'text-proxima-muted group-hover:text-proxima-text'}>
                {item.icon}
              </span>
              <span className="text-sm font-medium">{item.label}</span>
            </div>
            {item.badge && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded font-mono bg-proxima-primary/20 text-proxima-primary-light border border-proxima-primary/30">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Sign out */}
      <div className="p-3 border-t border-proxima-border">
        <button
          onClick={() => authService.signOut()}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-proxima-muted hover:text-proxima-error hover:bg-proxima-error/10 transition-all text-sm"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};
