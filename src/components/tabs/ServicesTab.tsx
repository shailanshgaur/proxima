import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ResidentProfile, Vendor } from '../../types';
import { vendorService } from '../../lib/vendorService';
import { BookingForm } from '../Resident/BookingForm';

const CATEGORIES = ['All', 'Plumber', 'Electrician', 'Cook', 'AC Technician', 'Carpenter', 'Housekeeping'] as const;

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w: string) => w[0])
    .join('')
    .toUpperCase();
}

interface ServicesTabProps { profile: ResidentProfile; }

export const ServicesTab: React.FC<ServicesTabProps> = ({ profile }) => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('All');
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  useEffect(() => {
    vendorService.getVendorsBySociety(profile.society_id)
      .then(setVendors)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [profile.society_id]);

  const filtered = vendors.filter(v =>
    (category === 'All' || v.categories.includes(category)) &&
    (!search || v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.categories.some(c => c.toLowerCase().includes(search.toLowerCase())))
  );

  if (selectedVendor) {
    return (
      <div className="max-w-4xl mx-auto">
        <BookingForm
          vendor={selectedVendor}
          residentId={profile.user_id}
          residentPhone={profile.email}
          flatNumber={profile.flat_number ?? ''}
          societyId={profile.society_id ?? ''}
          onBack={() => setSelectedVendor(null)}
          onSuccess={() => setSelectedVendor(null)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-black text-proxima-text">
          Verified Society Desk
        </h1>
        <p className="text-sm text-proxima-muted mt-1">
          Hire high-quality servicemen vetted and already working inside the society perimeter.
        </p>
      </div>

      {/* Search */}
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search vendors or services…"
        className="w-full px-4 py-2.5 bg-proxima-base border border-proxima-border rounded-xl text-sm text-white placeholder:text-proxima-muted outline-none focus:border-proxima-primary transition-colors"
      />

      {/* Category filter — 2×3 grid (7 items wraps naturally) */}
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              category === cat
                ? 'bg-proxima-primary/15 border-proxima-primary text-white'
                : 'bg-proxima-card border-proxima-border text-proxima-muted hover:bg-proxima-active'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-proxima-card border border-proxima-border rounded-2xl h-36 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-proxima-muted">
          <p className="text-sm">
            {search ? `No vendors found for "${search}"` : 'No vendors in your society yet.'}
          </p>
        </div>
      ) : (
        <>
          <p className="text-xs text-proxima-muted font-mono">
            Top Rated Professionals — {filtered.length} available
          </p>

          <div className="space-y-3">
            {filtered.map((vendor, i) => (
              <motion.div
                key={vendor.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-proxima-card border border-proxima-border rounded-2xl p-4 hover:border-proxima-primary/30 transition-all"
              >
                <div className="flex items-start gap-4">

                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-proxima-primary/20 to-proxima-secondary/20 border border-proxima-secondary/30 flex items-center justify-center font-mono font-bold text-proxima-secondary-light text-sm shrink-0">
                    {getInitials(vendor.name)}
                  </div>

                  <div className="flex-1 min-w-0">

                    {/* Name row */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-proxima-text truncate">{vendor.name}</h3>
                        {vendor.categories?.[0] && (
                          <span className="inline-block mt-0.5 px-2 py-0.5 bg-proxima-primary/10 border border-proxima-primary/20 rounded-md text-[10px] font-mono text-proxima-primary">
                            {vendor.categories[0]}
                          </span>
                        )}
                      </div>

                      {/* Rating badge */}
                      <div className="flex items-center gap-1 px-2 py-1 bg-proxima-warning/10 border border-proxima-warning/20 rounded-lg shrink-0">
                        <span className="text-proxima-warning text-xs">★</span>
                        <span className="text-xs font-bold text-proxima-warning font-mono">
                          {vendor.rating.toFixed(1)}
                        </span>
                        <span className="text-[10px] text-proxima-muted font-mono">
                          {vendor.review_count} ratings
                        </span>
                      </div>
                    </div>

                    {/* Meta chips */}
                    {(vendor.distance != null || vendor.response_time || (vendor.jobs_this_month != null && vendor.jobs_this_month > 0)) && (
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {vendor.distance != null && (
                          <span className="text-[11px] text-proxima-muted bg-proxima-active border border-proxima-border px-2 py-1 rounded-lg font-mono">
                            {vendor.distance.toFixed(1)} km
                          </span>
                        )}
                        {vendor.response_time && (
                          <span className="text-[11px] text-proxima-muted bg-proxima-active border border-proxima-border px-2 py-1 rounded-lg font-mono">
                            ~{vendor.response_time}
                          </span>
                        )}
                        {vendor.jobs_this_month != null && vendor.jobs_this_month > 0 && (
                          <span className="text-[11px] text-proxima-success bg-proxima-success/10 border border-proxima-success/20 px-2 py-1 rounded-lg font-mono">
                            {vendor.jobs_this_month} jobs nearby
                          </span>
                        )}
                      </div>
                    )}

                    {/* Review snippet */}
                    {vendor.review_snippet && (
                      <p className="text-xs text-proxima-muted italic mt-2 border-l-2 border-proxima-border pl-2 line-clamp-1">
                        "{vendor.review_snippet}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-3">
                  <a
                    href={`https://wa.me/91${vendor.phone}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center py-2 bg-proxima-success hover:bg-proxima-success/80 text-white text-xs font-semibold rounded-xl transition-all"
                  >
                    WhatsApp
                  </a>
                  <button
                    onClick={() => setSelectedVendor(vendor)}
                    className="flex-1 py-2 bg-proxima-primary hover:bg-proxima-primary-dim text-white text-xs font-semibold rounded-xl transition-all"
                  >
                    Book {vendor.name.split(' ')[0]}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
