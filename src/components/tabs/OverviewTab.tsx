import React from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, Car, Wrench, User, ArrowRight, Sparkles } from 'lucide-react';
import { ResidentProfile, Tab } from '../../types';

interface OverviewTabProps {
  profile: ResidentProfile;
  onNavigate: (tab: Tab) => void;
}

const STAT_CARDS: { label: string; tab: Tab; icon: React.ReactNode; color: string }[] = [
  { label: 'Active Bazar Offers',   tab: 'bazar',    icon: <ShoppingBag className="w-5 h-5" />, color: 'text-proxima-primary' },
  { label: 'Open Carpools',         tab: 'carpools', icon: <Car className="w-5 h-5" />,         color: 'text-proxima-secondary' },
  { label: 'Verified Services',     tab: 'services', icon: <Wrench className="w-5 h-5" />,      color: 'text-proxima-success' },
  { label: 'My Profile',            tab: 'profile',  icon: <User className="w-5 h-5" />,        color: 'text-proxima-warning' },
];

const QUICK_ACTIONS: { label: string; sub: string; tab: Tab; icon: React.ReactNode }[] = [
  { label: 'Post a Listing', sub: 'Sell items in the Bazar',      tab: 'bazar',    icon: <ShoppingBag className="w-5 h-5" /> },
  { label: 'Offer a Ride',   sub: 'Share your commute route',     tab: 'carpools', icon: <Car className="w-5 h-5" /> },
  { label: 'Hire a Service', sub: 'Book verified professionals',  tab: 'services', icon: <Wrench className="w-5 h-5" /> },
];

export const OverviewTab: React.FC<OverviewTabProps> = ({ profile, onNavigate }) => {
  const firstName = profile.name.split(' ')[0];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="bg-proxima-card border border-proxima-border rounded-2xl p-6 flex items-start justify-between gap-4"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-proxima-primary font-mono uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Premium Residency Portal
          </div>
          <h1 className="text-3xl font-display font-black text-proxima-text tracking-tight">
            Greetings, {firstName}
          </h1>
          <p className="text-sm text-proxima-muted max-w-md leading-relaxed">
            Welcome back to the Proxima home owner dashboard. Manage community carpools, verified service providers, and society marketplace listings.
          </p>
        </div>
        <div className="shrink-0 text-right space-y-2">
          <div className="px-3 py-1.5 bg-proxima-active border border-proxima-border rounded-xl">
            <div className="text-[9px] text-proxima-muted font-mono uppercase tracking-wider">Registered Unit</div>
            <div className="text-sm font-bold text-proxima-text font-mono">Flat {profile.flat_number}</div>
          </div>
          <div className="px-3 py-1.5 bg-proxima-success/10 border border-proxima-success/20 rounded-xl">
            <div className="text-[9px] text-proxima-muted font-mono uppercase tracking-wider">Member Status</div>
            <div className="text-sm font-bold text-proxima-success">Verified</div>
          </div>
        </div>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map((card, i) => (
          <motion.button
            key={card.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => onNavigate(card.tab)}
            className="bg-proxima-card border border-proxima-border rounded-xl p-4 text-left hover:border-proxima-primary/30 hover:bg-proxima-active transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className={card.color}>{card.icon}</span>
              <ArrowRight className="w-3.5 h-3.5 text-proxima-muted group-hover:text-proxima-text transition-colors" />
            </div>
            <div className="text-2xl font-black text-proxima-text font-mono">—</div>
            <div className="text-xs text-proxima-muted mt-1">{card.label}</div>
          </motion.button>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-xs font-semibold text-proxima-muted uppercase tracking-wider font-mono mb-3">Concierge Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {QUICK_ACTIONS.map((action, i) => (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              onClick={() => onNavigate(action.tab)}
              className="bg-proxima-card border border-proxima-border rounded-xl p-4 text-left hover:border-proxima-primary/40 hover:bg-proxima-active transition-all group flex items-center gap-3"
            >
              <div className="p-2 rounded-lg bg-proxima-primary/10 text-proxima-primary group-hover:bg-proxima-primary/20 transition-colors">
                {action.icon}
              </div>
              <div>
                <div className="text-sm font-semibold text-proxima-text">{action.label}</div>
                <div className="text-xs text-proxima-muted">{action.sub}</div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};
