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
      const newBooking = await bookingService.createBooking(
        residentId,
        vendor.id,
        societyId,
        serviceType,
        date,
        time,
      );
      setBooking(newBooking);

      const whatsappLink = bookingService.generateWhatsAppLink(
        vendor.phone,
        vendor.name,
        newBooking,
        flatNumber,
      );

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

  /* Success state */
  if (booking) {
    return (
      <div className="space-y-4">
        <div
          className="bg-proxima-card border border-proxima-border rounded-xl p-8 text-center space-y-3"
          style={{ boxShadow: '0 1px 3px rgba(28,25,23,0.06)' }}
        >
          <p className="text-lg font-semibold text-proxima-success">Booking confirmed</p>
          <p className="text-sm text-proxima-muted">
            Opening WhatsApp to confirm with {vendor.name}…
          </p>
          <button
            onClick={onBack}
            className="mt-2 px-6 border border-proxima-border rounded-lg text-sm font-medium text-proxima-muted hover:text-proxima-text hover:border-proxima-primary/40 transition-all cursor-pointer"
            style={{ minHeight: '44px' }}
          >
            Back to vendors
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Back link */}
      <button
        onClick={onBack}
        className="text-sm text-proxima-muted hover:text-proxima-text transition-colors cursor-pointer flex items-center gap-1"
        style={{ minHeight: '44px' }}
      >
        &larr; Back to vendors
      </button>

      {/* Vendor summary */}
      <div
        className="bg-proxima-card border border-proxima-border rounded-xl p-4"
        style={{ boxShadow: '0 1px 3px rgba(28,25,23,0.06)' }}
      >
        <h2 className="text-lg font-semibold text-proxima-text">Book {vendor.name}</h2>
        <p className="text-sm text-proxima-muted mt-0.5">
          Rating: {vendor.rating.toFixed(1)}&thinsp;/&thinsp;5
          &nbsp;&middot;&nbsp;
          {vendor.categories.join(', ') || 'General services'}
        </p>
      </div>

      {/* Form */}
      <div
        className="bg-proxima-card border border-proxima-border rounded-xl p-4 space-y-4"
        style={{ boxShadow: '0 1px 3px rgba(28,25,23,0.06)' }}
      >
        {error && (
          <div
            className="p-3 rounded-xl text-sm text-proxima-error"
            style={{ background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.20)' }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-proxima-text">
              Service needed
            </label>
            <input
              type="text"
              placeholder="e.g. Fix leaking tap, General cleaning"
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              required
              className="form-control w-full px-3 border border-proxima-border rounded-lg text-sm text-proxima-text placeholder:text-proxima-muted bg-proxima-base"
              style={{ minHeight: '48px' }}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-proxima-text">
              Preferred date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="form-control w-full px-3 border border-proxima-border rounded-lg text-sm text-proxima-text bg-proxima-base"
              style={{ minHeight: '48px' }}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-proxima-text">
              Preferred time
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              className="form-control w-full px-3 border border-proxima-border rounded-lg text-sm text-proxima-text bg-proxima-base"
              style={{ minHeight: '48px' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-proxima-primary hover:bg-proxima-primary-dim text-white text-sm font-semibold rounded-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            style={{ minHeight: '52px' }}
          >
            {loading ? 'Creating booking…' : 'Confirm Booking — Opens WhatsApp'}
          </button>
        </form>
      </div>
    </div>
  );
};
