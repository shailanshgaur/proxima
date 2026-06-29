import React, { useState, useEffect } from 'react';
import { vendorService } from '../../lib/vendorService';
import { Vendor } from '../../types';
import { BookingForm } from './BookingForm';

interface VendorListProps {
  societyId: string;
  residentId: string;
  residentPhone: string;
  flatNumber: string;
}

const CATEGORIES = ['All', 'Plumbing', 'Electrical', 'Cleaning', 'Painting', 'Carpentry'];

function RatingBadge({ rating, reviewCount }: { rating: number; reviewCount: number }) {
  return (
    <span className="text-sm font-semibold text-proxima-warning">
      {rating.toFixed(1)}&thinsp;/&thinsp;5
      <span className="text-xs font-normal text-proxima-muted ml-1.5">
        ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
      </span>
    </span>
  );
}

export const VendorList: React.FC<VendorListProps> = ({
  societyId,
  residentId,
  residentPhone,
  flatNumber,
}) => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'rating' | 'name'>('rating');

  useEffect(() => {
    const fetchVendors = async () => {
      setLoading(true);
      setError(null);
      try {
        let data: Vendor[];
        if (category && category !== 'All') {
          data = await vendorService.searchVendorsByCategory(societyId, category);
        } else {
          data = await vendorService.getVendorsBySociety(societyId);
        }
        if (sortBy === 'rating') {
          data = data.sort((a, b) => b.rating - a.rating);
        } else {
          data = data.sort((a, b) => a.name.localeCompare(b.name));
        }
        setVendors(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch vendors');
      } finally {
        setLoading(false);
      }
    };
    fetchVendors();
  }, [societyId, category, sortBy]);

  if (selectedVendor) {
    return (
      <BookingForm
        vendor={selectedVendor}
        residentId={residentId}
        residentPhone={residentPhone}
        flatNumber={flatNumber}
        societyId={societyId}
        onBack={() => setSelectedVendor(null)}
        onSuccess={() => {
          setSelectedVendor(null);
          alert('Booking created! WhatsApp link will open.');
        }}
      />
    );
  }

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-semibold text-proxima-text">Available Vendors</h2>

      {/* Filters */}
      <div className="space-y-3">
        {/* Category pills */}
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                category === cat
                  ? 'bg-proxima-primary text-white'
                  : 'bg-proxima-card border border-proxima-border text-proxima-muted hover:text-proxima-text hover:border-proxima-primary/40'
              }`}
              style={{ minHeight: '36px' }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-proxima-muted shrink-0">Sort by</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'rating' | 'name')}
            className="form-control text-sm border border-proxima-border rounded-lg px-3 bg-proxima-card text-proxima-text cursor-pointer"
            style={{ minHeight: '36px' }}
          >
            <option value="rating">Rating — high to low</option>
            <option value="name">Name — A to Z</option>
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          className="p-3 rounded-xl text-sm text-proxima-error"
          style={{ background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.20)' }}
        >
          {error}
        </div>
      )}

      {/* Loading skeletons */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-proxima-card border border-proxima-border rounded-xl h-28 animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && vendors.length === 0 && !error && (
        <div
          className="text-center py-14 bg-proxima-card border border-proxima-border rounded-xl space-y-2"
        >
          <p className="text-sm font-medium text-proxima-text">No vendors found</p>
          <p className="text-sm text-proxima-muted">
            {category !== 'All'
              ? `No vendors in the "${category}" category.`
              : 'No vendors have been added to your society yet.'}
          </p>
          {category !== 'All' && (
            <button
              onClick={() => setCategory('All')}
              className="mt-1 text-sm text-proxima-primary underline underline-offset-2 cursor-pointer"
            >
              Clear filter
            </button>
          )}
        </div>
      )}

      {/* Vendor cards */}
      {!loading && vendors.length > 0 && (
        <div className="space-y-3">
          {vendors.map((vendor) => (
            <div
              key={vendor.id}
              className="bg-proxima-card border border-proxima-border rounded-xl p-4 cursor-pointer hover:border-proxima-primary/40 transition-all"
              style={{ boxShadow: '0 1px 3px rgba(28,25,23,0.06)' }}
              onClick={() => setSelectedVendor(vendor)}
            >
              <div className="flex items-start justify-between gap-3">
                {/* Initials avatar */}
                <div
                  className="w-10 h-10 rounded-full bg-proxima-active border border-proxima-border flex items-center justify-center text-sm font-bold text-proxima-primary shrink-0"
                >
                  {vendor.name
                    .split(' ')
                    .slice(0, 2)
                    .map((w: string) => w[0])
                    .join('')
                    .toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-proxima-text leading-tight">
                    {vendor.name}
                  </h3>
                  <p className="text-sm text-proxima-muted mt-0.5">
                    {vendor.categories.join(', ') || 'General services'}
                  </p>
                  <div className="mt-2 flex items-center gap-3 flex-wrap">
                    <RatingBadge rating={vendor.rating} reviewCount={vendor.review_count} />
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={
                        vendor.type === 'A'
                          ? { background: '#F0FDF4', color: '#15803D', border: '1px solid #BBF7D0' }
                          : { background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE' }
                      }
                    >
                      {vendor.type === 'A' ? 'WhatsApp booking' : 'App booking'}
                    </span>
                  </div>
                </div>

                {/* CTA */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedVendor(vendor);
                  }}
                  className="shrink-0 px-4 bg-proxima-primary text-white text-sm font-semibold rounded-lg hover:bg-proxima-primary-dim transition-colors cursor-pointer"
                  style={{ minHeight: '44px' }}
                >
                  Book
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
