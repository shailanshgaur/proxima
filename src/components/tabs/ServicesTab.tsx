import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Wrench, Search, Star, MapPin, Clock, Phone } from 'lucide-react';
import { ResidentProfile, Vendor } from '../../types';
import { vendorService } from '../../lib/vendorService';

const CATEGORIES = ['All', 'Plumber', 'Electrician', 'Cook', 'AC Technician', 'Carpenter', 'Housekeeping'] as const;

interface ServicesTabProps { profile: ResidentProfile; }

export const ServicesTab: React.FC<ServicesTabProps> = ({ profile }) => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('All');

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

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-display font-black text-proxima-text flex items-center gap-2">
          <Wrench className="w-6 h-6 text-proxima-success" />
          Verified Society Desk
        </h1>
        <p className="text-sm text-proxima-muted mt-1">Hire high-quality servicemen vetted and already working inside the society perimeter.</p>
      </div>

      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-proxima-muted" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search vendors or services…"
            className="w-full pl-10 pr-4 py-2.5 bg-proxima-card border border-proxima-border rounded-xl text-sm text-proxima-text placeholder:text-proxima-muted outline-none focus:border-proxima-success/50 transition-colors" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${category === cat ? 'bg-proxima-success text-white' : 'bg-proxima-card border border-proxima-border text-proxima-muted hover:text-proxima-text'}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="bg-proxima-card border border-proxima-border rounded-xl h-32 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-proxima-muted">
          <Wrench className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">{search ? `No vendors found for "${search}"` : 'No vendors in your society yet.'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((vendor, i) => (
            <motion.div key={vendor.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="bg-proxima-card border border-proxima-border rounded-xl p-4 hover:border-proxima-success/30 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-proxima-success/10 border border-proxima-success/20 flex items-center justify-center text-base font-black text-proxima-success font-mono shrink-0">
                  {vendor.name.split(' ').slice(0,2).map((w: string) => w[0]).join('').toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-proxima-text">{vendor.name}</h3>
                      <p className="text-xs text-proxima-muted">{vendor.categories?.[0]}</p>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-proxima-warning/10 border border-proxima-warning/20 rounded-lg shrink-0">
                      <Star className="w-3 h-3 fill-proxima-warning text-proxima-warning" />
                      <span className="text-xs font-bold text-proxima-warning">{vendor.rating.toFixed(1)}</span>
                      <span className="text-[10px] text-proxima-muted">({vendor.review_count})</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {vendor.distance != null && (
                      <span className="flex items-center gap-1 text-[11px] text-proxima-muted bg-proxima-active border border-proxima-border px-2 py-1 rounded-lg">
                        <MapPin className="w-3 h-3" />{vendor.distance.toFixed(1)} km
                      </span>
                    )}
                    {vendor.response_time && (
                      <span className="flex items-center gap-1 text-[11px] text-proxima-muted bg-proxima-active border border-proxima-border px-2 py-1 rounded-lg">
                        <Clock className="w-3 h-3" />~{vendor.response_time}
                      </span>
                    )}
                    {vendor.jobs_this_month != null && vendor.jobs_this_month > 0 && (
                      <span className="flex items-center gap-1 text-[11px] text-proxima-success bg-proxima-success/10 border border-proxima-success/20 px-2 py-1 rounded-lg">
                        {vendor.jobs_this_month} jobs nearby
                      </span>
                    )}
                  </div>
                  {vendor.review_snippet && (
                    <p className="text-xs text-proxima-muted italic mt-2 border-l-2 border-proxima-border pl-2 line-clamp-1">"{vendor.review_snippet}"</p>
                  )}
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <a href={`https://wa.me/91${vendor.phone}`} target="_blank" rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-proxima-success hover:bg-proxima-success/80 text-white text-xs font-semibold rounded-xl transition-all">
                  <Phone className="w-3.5 h-3.5" /> WhatsApp
                </a>
                <button className="flex-1 py-2 bg-proxima-primary hover:bg-proxima-primary-dim text-white text-xs font-semibold rounded-xl transition-all">
                  Book {vendor.name.split(' ')[0]}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
