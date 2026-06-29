import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ResidentProfile, Tab, Product, Ride } from '../../types';
import { productService } from '../../lib/productService';
import { rideService } from '../../lib/rideService';
import { vendorService } from '../../lib/vendorService';

interface OverviewTabProps {
  profile: ResidentProfile;
  onNavigate: (tab: Tab) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ profile, onNavigate }) => {
  const firstName = profile.name.split(' ')[0];

  const [productCount, setProductCount] = useState<number | null>(null);
  const [rideCount, setRideCount] = useState<number | null>(null);
  const [vendorCount, setVendorCount] = useState<number | null>(null);
  const [latestProducts, setLatestProducts] = useState<Product[]>([]);
  const [latestRides, setLatestRides] = useState<Ride[]>([]);

  useEffect(() => {
    const sid = profile.society_id;

    productService.getProducts(sid).then((products) => {
      setProductCount(products.length);
      setLatestProducts(products.slice(0, 2));
    }).catch(() => {
      setProductCount(0);
    });

    rideService.getRides(sid).then((rides) => {
      setRideCount(rides.length);
      setLatestRides(rides.slice(0, 2));
    }).catch(() => {
      setRideCount(0);
    });

    vendorService.getVendorsBySociety(sid).then((vendors) => {
      setVendorCount(vendors.length);
    }).catch(() => {
      setVendorCount(0);
    });
  }, [profile.society_id]);

  const fmt = (n: number | null) => (n === null ? '—' : String(n));

  const STAT_CARDS: { label: string; tab: Tab; value: number | null; color: string }[] = [
    { label: 'Active Bazar Offers',  tab: 'bazar',    value: productCount, color: 'text-proxima-primary' },
    { label: 'Open Carpools',        tab: 'carpools', value: rideCount,    color: 'text-proxima-secondary' },
    { label: 'Verified Services',    tab: 'services', value: vendorCount,  color: 'text-proxima-success' },
    { label: 'My Profile',           tab: 'profile',  value: null,         color: 'text-proxima-warning' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Hero banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="bg-proxima-card border border-proxima-border rounded-2xl p-6 flex items-start justify-between gap-4"
      >
        <div className="space-y-2">
          <div className="text-xs text-proxima-primary font-mono uppercase tracking-wider">
            Premium Residency Portal
          </div>
          <h1 className="text-3xl font-display font-black text-white tracking-tight">
            Greetings, {firstName}
          </h1>
          <p className="text-sm text-proxima-muted max-w-md leading-relaxed">
            Welcome back to the Proxima home owner dashboard. Manage community carpools, verified service providers, and society marketplace listings.
          </p>
        </div>

        <div className="shrink-0 text-right space-y-2">
          <div className="px-3 py-1.5 bg-proxima-active border border-proxima-border rounded-xl">
            <div className="text-[9px] text-proxima-muted font-mono uppercase tracking-wider">Registered Unit</div>
            <div className="text-sm font-bold text-white font-mono">Flat {profile.flat_number}</div>
          </div>
          <div className="px-3 py-1.5 bg-proxima-success/10 border border-proxima-success/20 rounded-xl">
            <div className="text-[9px] text-proxima-muted font-mono uppercase tracking-wider">Member Status</div>
            <div className="text-sm font-bold text-proxima-success">Verified</div>
          </div>
        </div>
      </motion.div>

      {/* 4-card stat grid */}
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
              <span className="text-proxima-muted group-hover:text-proxima-text transition-colors text-sm">›</span>
            </div>
            <div className={`text-2xl font-black font-mono ${card.color}`}>
              {fmt(card.value)}
            </div>
            <div className="text-xs text-proxima-muted mt-1">{card.label}</div>
          </motion.button>
        ))}
      </div>

      {/* Spotlight */}
      <div>
        <h2 className="text-xs font-semibold text-proxima-muted uppercase tracking-wider font-mono mb-3">
          Community Spotlight
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Latest products */}
          <div className="space-y-3">
            <div className="text-[10px] text-proxima-primary font-mono uppercase tracking-wider">
              Latest Bazar Listings
            </div>
            {latestProducts.length === 0 ? (
              <div className="bg-proxima-card border border-proxima-border rounded-xl p-4 text-xs text-proxima-muted">
                No active listings yet.
              </div>
            ) : (
              latestProducts.map((product, i) => (
                <motion.button
                  key={product.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.05 }}
                  onClick={() => onNavigate('bazar')}
                  className="w-full bg-proxima-card border border-proxima-border rounded-xl p-4 text-left hover:border-proxima-primary/30 hover:bg-proxima-active transition-all group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-white truncate">{product.title}</div>
                      <div className="text-xs text-proxima-muted mt-0.5">
                        {product.category} &middot; Flat {product.seller_flat}
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="text-sm font-bold text-proxima-primary font-mono">
                        ₹{product.price.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px] text-proxima-muted group-hover:text-proxima-text transition-colors">›</div>
                    </div>
                  </div>
                </motion.button>
              ))
            )}
          </div>

          {/* Latest rides */}
          <div className="space-y-3">
            <div className="text-[10px] text-proxima-secondary font-mono uppercase tracking-wider">
              Open Carpools
            </div>
            {latestRides.length === 0 ? (
              <div className="bg-proxima-card border border-proxima-border rounded-xl p-4 text-xs text-proxima-muted">
                No open carpools right now.
              </div>
            ) : (
              latestRides.map((ride, i) => (
                <motion.button
                  key={ride.id}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.05 }}
                  onClick={() => onNavigate('carpools')}
                  className="w-full bg-proxima-card border border-proxima-border rounded-xl p-4 text-left hover:border-proxima-secondary/30 hover:bg-proxima-active transition-all group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-white truncate">
                        {ride.origin} → {ride.destination}
                      </div>
                      <div className="text-xs text-proxima-muted mt-0.5 font-mono">
                        {ride.departure_date} &middot; {ride.departure_time}
                      </div>
                    </div>
                    <div className="shrink-0 text-proxima-muted group-hover:text-proxima-text transition-colors text-sm">›</div>
                  </div>
                </motion.button>
              ))
            )}
          </div>

        </div>
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-xs font-semibold text-proxima-muted uppercase tracking-wider font-mono mb-3">
          Concierge Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {([
            { label: 'Sell on Bazar',      sub: 'List items for your neighbours',  tab: 'bazar'    as Tab },
            { label: 'Create Rideshare',   sub: 'Share your commute route',         tab: 'carpools' as Tab },
            { label: 'Hire Services',      sub: 'Book verified professionals',      tab: 'services' as Tab },
          ] as { label: string; sub: string; tab: Tab }[]).map((action, i) => (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.05 }}
              onClick={() => onNavigate(action.tab)}
              className="bg-proxima-card border border-proxima-border rounded-xl p-4 text-left hover:border-proxima-primary/40 hover:bg-proxima-active transition-all group flex items-center justify-between gap-3"
            >
              <div>
                <div className="text-sm font-semibold text-white">{action.label}</div>
                <div className="text-xs text-proxima-muted">{action.sub}</div>
              </div>
              <span className="text-proxima-muted group-hover:text-proxima-primary transition-colors text-lg leading-none">›</span>
            </motion.button>
          ))}
        </div>
      </div>

    </div>
  );
};
