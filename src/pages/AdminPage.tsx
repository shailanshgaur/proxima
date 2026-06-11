import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Vendor, Booking, Review, Appeal } from '../types';
import { AppealsQueue } from '../components/Admin/AppealsQueue';

export const AdminPage: React.FC = () => {
  const [tab, setTab] = useState<'overview' | 'bookings' | 'vendors' | 'appeals'>('overview');
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [appeals, setAppeals] = useState<Appeal[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [vendorsData, bookingsData, appealsData, reviewsData] = await Promise.all([
          supabase.from('vendors').select('*'),
          supabase.from('bookings').select('*'),
          supabase.from('appeals').select('*'),
          supabase.from('reviews').select('*'),
        ]);

        if (!vendorsData.error) setVendors(vendorsData.data || []);
        if (!bookingsData.error) setBookings(bookingsData.data || []);
        if (!appealsData.error) setAppeals(appealsData.data || []);
        if (!reviewsData.error) setReviews(reviewsData.data || []);
      } catch (err) {
        console.error('Failed to load admin data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const completedBookings = bookings.filter((b) => b.status === 'completed').length;
  const avgRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : 'N/A';
  const pendingAppeals = appeals.filter((a) => a.status === 'pending').length;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Admin Dashboard</h1>
        <button
          onClick={() => (window.location.href = '/home')}
          style={{ padding: '8px 16px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Back
        </button>
      </div>

      <div style={{ marginBottom: '30px', display: 'flex', gap: '20px' }}>
        <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '4px', minWidth: '150px' }}>
          <p style={{ color: '#666', margin: '0 0 5px 0' }}>Total Bookings</p>
          <h2 style={{ margin: 0 }}>{bookings.length}</h2>
        </div>
        <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '4px', minWidth: '150px' }}>
          <p style={{ color: '#666', margin: '0 0 5px 0' }}>Completed</p>
          <h2 style={{ margin: 0 }}>{completedBookings}</h2>
        </div>
        <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '4px', minWidth: '150px' }}>
          <p style={{ color: '#666', margin: '0 0 5px 0' }}>Avg Rating</p>
          <h2 style={{ margin: 0 }}>{avgRating}</h2>
        </div>
        <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '4px', minWidth: '150px', background: pendingAppeals > 0 ? '#fff3cd' : '' }}>
          <p style={{ color: '#666', margin: '0 0 5px 0' }}>Pending Appeals</p>
          <h2 style={{ margin: 0, color: pendingAppeals > 0 ? '#d39e00' : 'inherit' }}>{pendingAppeals}</h2>
        </div>
        <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '4px', minWidth: '150px' }}>
          <p style={{ color: '#666', margin: '0 0 5px 0' }}>Active Vendors</p>
          <h2 style={{ margin: 0 }}>{vendors.filter((v) => !v.is_archived).length}</h2>
        </div>
      </div>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        {(['overview', 'bookings', 'vendors', 'appeals'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '10px 20px',
              background: tab === t ? '#007bff' : '#e0e0e0',
              color: tab === t ? 'white' : 'black',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              textTransform: 'capitalize',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {loading && <p>Loading...</p>}

      {!loading && tab === 'overview' && (
        <div>
          <h2>Overview</h2>
          <p>Bookings: {bookings.length} | Completed: {completedBookings} | Avg Rating: {avgRating}</p>
          <p>Vendors: {vendors.length} (Active: {vendors.filter((v) => !v.is_archived).length})</p>
          <p>Pending Appeals: {pendingAppeals}</p>
        </div>
      )}

      {!loading && tab === 'bookings' && (
        <div>
          <h2>All Bookings</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f0f0f0' }}>
                <th style={{ border: '1px solid #ddd', padding: '10px' }}>Date</th>
                <th style={{ border: '1px solid #ddd', padding: '10px' }}>Vendor</th>
                <th style={{ border: '1px solid #ddd', padding: '10px' }}>Status</th>
                <th style={{ border: '1px solid #ddd', padding: '10px' }}>Flat</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td style={{ border: '1px solid #ddd', padding: '10px' }}>{b.scheduled_date}</td>
                  <td style={{ border: '1px solid #ddd', padding: '10px' }}>{b.vendor_id}</td>
                  <td style={{ border: '1px solid #ddd', padding: '10px' }}>{b.status}</td>
                  <td style={{ border: '1px solid #ddd', padding: '10px' }}>-</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && tab === 'vendors' && (
        <div>
          <h2>All Vendors</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f0f0f0' }}>
                <th style={{ border: '1px solid #ddd', padding: '10px' }}>Name</th>
                <th style={{ border: '1px solid #ddd', padding: '10px' }}>Type</th>
                <th style={{ border: '1px solid #ddd', padding: '10px' }}>Rating</th>
                <th style={{ border: '1px solid #ddd', padding: '10px' }}>Reviews</th>
                <th style={{ border: '1px solid #ddd', padding: '10px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((v) => (
                <tr key={v.id}>
                  <td style={{ border: '1px solid #ddd', padding: '10px' }}>{v.name}</td>
                  <td style={{ border: '1px solid #ddd', padding: '10px' }}>{v.type}</td>
                  <td style={{ border: '1px solid #ddd', padding: '10px' }}>{v.rating.toFixed(1)}</td>
                  <td style={{ border: '1px solid #ddd', padding: '10px' }}>{v.review_count}</td>
                  <td style={{ border: '1px solid #ddd', padding: '10px' }}>{v.is_archived ? 'Archived' : 'Active'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && tab === 'appeals' && <AppealsQueue appeals={appeals} onAppealResolved={() => {}} />}
    </div>
  );
};
