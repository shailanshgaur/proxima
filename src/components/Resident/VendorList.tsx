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

export const VendorList: React.FC<VendorListProps> = ({ societyId, residentId, residentPhone, flatNumber }) => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [category, setCategory] = useState('');

  const categories = ['Plumbing', 'Electrical', 'Cleaning', 'Painting', 'Carpentry'];

  useEffect(() => {
    const fetchVendors = async () => {
      setLoading(true);
      setError(null);
      try {
        let data: Vendor[];
        if (category) {
          data = await vendorService.searchVendorsByCategory(societyId, category);
        } else {
          data = await vendorService.getVendorsBySociety(societyId);
        }
        setVendors(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch vendors');
      } finally {
        setLoading(false);
      }
    };
    fetchVendors();
  }, [societyId, category]);

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
    <div style={{ padding: '20px' }}>
      <h2>Available Vendors</h2>

      <div style={{ marginBottom: '20px' }}>
        <label>Filter by category: </label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: '8px' }}>
          <option value="">All</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading && <p>Loading vendors...</p>}

      {!loading && vendors.length === 0 && <p>No vendors found in your society.</p>}

      <div style={{ display: 'grid', gap: '10px' }}>
        {vendors.map((vendor) => (
          <div
            key={vendor.id}
            style={{
              border: '1px solid #ccc',
              padding: '15px',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
            onClick={() => setSelectedVendor(vendor)}
          >
            <h3>{vendor.name}</h3>
            <p>
              Rating: {vendor.rating.toFixed(1)} ({vendor.review_count} reviews)
            </p>
            <p>Type: {vendor.type === 'A' ? 'WhatsApp' : 'App-enabled'}</p>
            <p>Categories: {vendor.categories.join(', ') || 'General'}</p>
            <button style={{ padding: '8px 16px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
              Book Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
