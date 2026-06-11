import React, { useState, useEffect } from 'react';
import { authService } from '../lib/authService';
import { bookingService } from '../lib/bookingService';
import { User, Booking, Vendor } from '../types';
import { VendorList } from '../components/Resident/VendorList';
import { BookingStatus } from '../components/Resident/BookingStatus';
import { ReviewForm } from '../components/Resident/ReviewForm';
import { vendorService } from '../lib/vendorService';

export const HomePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [vendors, setVendors] = useState<{ [key: string]: Vendor }>({});
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'bookings' | 'vendors'>('bookings');

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (!currentUser) {
          window.location.href = '/login';
          return;
        }
        setUser(currentUser);

        const userBookings = await bookingService.getBookingsByResident(currentUser.id);
        setBookings(userBookings);

        const vendorMap: { [key: string]: Vendor } = {};
        for (const booking of userBookings) {
          if (!vendorMap[booking.vendor_id]) {
            const vendor = await vendorService.getVendorById(booking.vendor_id);
            if (vendor) vendorMap[booking.vendor_id] = vendor;
          }
        }
        setVendors(vendorMap);
      } catch (err) {
        console.error('Failed to load user data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>Not logged in</p>;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Welcome, {user.name}</h1>
        <button
          onClick={() => authService.signOut().then(() => (window.location.href = '/login'))}
          style={{ padding: '8px 16px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Logout
        </button>
      </div>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button
          onClick={() => setView('bookings')}
          style={{
            padding: '10px 20px',
            background: view === 'bookings' ? '#007bff' : '#e0e0e0',
            color: view === 'bookings' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          My Bookings ({bookings.length})
        </button>
        <button
          onClick={() => setView('vendors')}
          style={{
            padding: '10px 20px',
            background: view === 'vendors' ? '#007bff' : '#e0e0e0',
            color: view === 'vendors' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Browse Vendors
        </button>
      </div>

      {view === 'bookings' && (
        <div>
          <h2>Your Bookings</h2>
          {bookings.length === 0 ? (
            <p>No bookings yet. Start by browsing vendors!</p>
          ) : (
            <div>
              {bookings.map((booking) => (
                <div key={booking.id} style={{ marginBottom: '20px' }}>
                  <BookingStatus booking={booking} onPhotoUploaded={() => {}} />
                  {vendors[booking.vendor_id] && booking.status === 'completed' && (
                    <ReviewForm
                      booking={booking}
                      vendor={vendors[booking.vendor_id]}
                      residentId={user.id}
                      onReviewSubmitted={() => {}}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {view === 'vendors' && user && (
        <VendorList societyId={user.society_id} residentId={user.id} residentPhone={user.phone} flatNumber={user.flat_number || ''} />
      )}
    </div>
  );
};
