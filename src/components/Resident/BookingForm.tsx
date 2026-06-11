import React, { useState } from 'react';
import { bookingService } from '../../lib/bookingService';
import { Vendor, Booking } from '../../types';

interface BookingFormProps {
  vendor: Vendor;
  residentId: string;
  residentPhone: string;
  flatNumber: string;
  societyId: string;
  onBack: () => void;
  onSuccess: () => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  vendor,
  residentId,
  flatNumber,
  societyId,
  onBack,
  onSuccess,
}) => {
  const [serviceType, setServiceType] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const newBooking = await bookingService.createBooking(residentId, vendor.id, societyId, serviceType, date, time);
      setBooking(newBooking);

      const whatsappLink = bookingService.generateWhatsAppLink(vendor.phone, vendor.name, newBooking, flatNumber);

      setTimeout(() => {
        window.open(whatsappLink, '_blank');
        onSuccess();
      }, 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  if (booking) {
    return (
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
        <h2>Booking Created!</h2>
        <p>Opening WhatsApp to confirm with {vendor.name}...</p>
        <button onClick={onBack} style={{ padding: '10px 20px' }}>
          Back to Vendors
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <button onClick={onBack} style={{ marginBottom: '20px' }}>
        Back
      </button>

      <h2>Book {vendor.name}</h2>
      <p>Rating: {vendor.rating.toFixed(1)}</p>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Service Type:</label>
          <input
            type="text"
            placeholder="e.g., Fix tap, General cleaning"
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Preferred Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Preferred Time:</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            background: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Creating Booking...' : 'Confirm Booking & Open WhatsApp'}
        </button>
      </form>
    </div>
  );
};
