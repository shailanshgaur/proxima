import React, { useState } from 'react';
import { Booking } from '../../types';
import { storageService } from '../../lib/storageService';
import { bookingService } from '../../lib/bookingService';

interface BookingStatusProps {
  booking: Booking;
  onPhotoUploaded: () => void;
}

export const BookingStatus: React.FC<BookingStatusProps> = ({ booking, onPhotoUploaded }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'green';
      case 'confirmed':
        return 'blue';
      case 'pending':
        return 'orange';
      case 'cancelled':
      case 'no_show':
        return 'red';
      default:
        return 'gray';
    }
  };

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
    <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '4px', marginBottom: '20px' }}>
      <h3>Booking Status</h3>

      <p>
        Status: <span style={{ color: getStatusColor(booking.status), fontWeight: 'bold' }}>{booking.status}</span>
      </p>

      <p>Service: {booking.service_type}</p>
      <p>
        Scheduled: {booking.scheduled_date} at {booking.scheduled_time}
      </p>

      {booking.status === 'confirmed' && !booking.photo_url && (
        <div style={{ marginTop: '20px', padding: '15px', background: '#f0f0f0', borderRadius: '4px' }}>
          <h4>Service Complete? Upload Photo Proof</h4>
          <p style={{ fontSize: '14px', color: '#666' }}>
            Photo must show the vendor or completed service + your flat location
          </p>

          {error && <p style={{ color: 'red' }}>{error}</p>}
          {success && <p style={{ color: 'green' }}>Photo uploaded successfully! Ready to rate.</p>}

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            style={{ marginBottom: '10px', display: 'block' }}
          />

          {file && <p>Selected: {file.name}</p>}

          <button
            onClick={handleUpload}
            disabled={uploading || !file}
            style={{
              padding: '10px 20px',
              background: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: uploading ? 'not-allowed' : 'pointer',
            }}
          >
            {uploading ? 'Uploading...' : 'Upload & Mark Complete'}
          </button>
        </div>
      )}

      {booking.photo_url && (
        <div style={{ marginTop: '20px' }}>
          <p>Photo uploaded:</p>
          <img src={booking.photo_url} alt="Booking proof" style={{ maxWidth: '200px', borderRadius: '4px' }} />
        </div>
      )}

      {booking.status === 'completed' && (
        <p style={{ color: 'green', fontWeight: 'bold' }}>Booking completed! You can now rate this vendor.</p>
      )}
    </div>
  );
};
