import React, { useState } from 'react';
import { Booking } from '../../types';
import { storageService } from '../../lib/storageService';
import { bookingService } from '../../lib/bookingService';

interface BookingStatusProps {
  booking: Booking;
  onPhotoUploaded: () => void;
}

const statusClassMap: Record<string, string> = {
  completed: 'text-proxima-success',
  confirmed: 'text-proxima-primary',
  pending: 'text-proxima-warning',
  cancelled: 'text-proxima-error',
  no_show: 'text-proxima-error',
};

export const BookingStatus: React.FC<BookingStatusProps> = ({ booking, onPhotoUploaded }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setError(null);
      setSuccess(false);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a photo');
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const photoUrl = await storageService.uploadBookingPhoto(booking.id, file);
      await bookingService.updateBookingPhoto(booking.id, photoUrl);
      await bookingService.updateBookingStatus(booking.id, 'completed');
      setSuccess(true);
      setFile(null);
      onPhotoUploaded();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-proxima-card border border-proxima-border rounded-xl p-4 space-y-3">
      <h3>Booking Status</h3>

      <p>
        Status:{' '}
        <span className={`font-bold ${statusClassMap[booking.status] ?? 'text-proxima-muted'}`}>
          {booking.status}
        </span>
      </p>

      <p>Service: {booking.service_type}</p>
      <p>
        Scheduled: {booking.scheduled_date} at {booking.scheduled_time}
      </p>

      {booking.status === 'confirmed' && !booking.photo_url && (
        <div className="bg-proxima-active border border-proxima-border rounded-xl p-4 space-y-3">
          <h4>Service Complete? Upload Photo Proof</h4>
          <p className="text-sm text-proxima-muted">
            Photo must show the vendor or completed service + your flat location
          </p>

          {error && <p className="text-proxima-error text-sm">{error}</p>}
          {success && <p className="text-proxima-success text-sm">Photo uploaded successfully! Ready to rate.</p>}

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="text-sm text-proxima-muted"
          />

          {file && <p>Selected: {file.name}</p>}

          <button
            onClick={handleUpload}
            disabled={uploading || !file}
            className="w-full bg-proxima-primary hover:bg-proxima-primary-dim text-white text-sm font-semibold rounded-lg transition-all disabled:opacity-60 cursor-pointer"
            style={{ minHeight: '48px' }}
          >
            {uploading ? 'Uploading...' : 'Upload & Mark Complete'}
          </button>
        </div>
      )}

      {booking.photo_url && (
        <div>
          <p>Photo uploaded:</p>
          <img
            src={booking.photo_url}
            alt="Booking proof"
            className="max-w-[200px] rounded-xl border border-proxima-border"
          />
        </div>
      )}

      {booking.status === 'completed' && (
        <p className="text-proxima-success font-bold">Booking completed! You can now rate this vendor.</p>
      )}
    </div>
  );
};
