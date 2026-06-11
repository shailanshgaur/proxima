import React, { useState, useEffect } from 'react';
import { Booking, Review, Vendor } from '../../types';
import { reviewService } from '../../lib/reviewService';

interface ReviewFormProps {
  booking: Booking;
  vendor: Vendor;
  residentId: string;
  onReviewSubmitted: () => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ booking, vendor, residentId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [hasReviewed, setHasReviewed] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const vendorReviews = await reviewService.getVendorReviews(vendor.id);
        setReviews(vendorReviews);

        const alreadyReviewed = vendorReviews.some((r) => r.booking_id === booking.id);
        setHasReviewed(alreadyReviewed);
      } catch (err) {
        console.error('Failed to load reviews:', err);
      } finally {
        setLoadingReviews(false);
      }
    };

    if (booking.status === 'completed') {
      fetchReviews();
    }
  }, [booking, vendor.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      await reviewService.createReview(booking.id, residentId, vendor.id, rating, text);
      setSuccess(true);
      setRating(0);
      setText('');
      onReviewSubmitted();

      const updatedReviews = await reviewService.getVendorReviews(vendor.id);
      setReviews(updatedReviews);
      setHasReviewed(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (booking.status !== 'completed') {
    return null;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Rate {vendor.name}</h2>
      <p>Vendor Average: {vendor.rating.toFixed(1)} out of 5 ({vendor.review_count} reviews)</p>

      {!hasReviewed && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '30px', padding: '15px', background: '#f9f9f9', borderRadius: '4px' }}>
          <h3>Share Your Experience</h3>

          {error && <p style={{ color: 'red' }}>{error}</p>}
          {success && <p style={{ color: 'green' }}>Thank you for your review!</p>}

          <div style={{ marginBottom: '15px' }}>
            <label>Rating:</label>
            <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  style={{
                    fontSize: '24px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    opacity: rating >= star ? 1 : 0.3,
                  }}
                >
                  {'⭐'}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Review (optional):</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Share your experience with this vendor..."
              maxLength={500}
              style={{
                width: '100%',
                padding: '8px',
                marginTop: '5px',
                minHeight: '100px',
                fontFamily: 'inherit',
              }}
            />
            <p style={{ fontSize: '12px', color: '#666' }}>{text.length}/500</p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{
              padding: '10px 20px',
              background: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: submitting ? 'not-allowed' : 'pointer',
            }}
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      )}

      <div>
        <h3>All Reviews ({reviews.length})</h3>
        {loadingReviews && <p>Loading reviews...</p>}
        {reviews.length === 0 && <p>No reviews yet.</p>}

        <div style={{ display: 'grid', gap: '10px' }}>
          {reviews.map((review) => (
            <div key={review.id} style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold' }}>{'⭐'.repeat(review.rating)}</span>
                <span style={{ fontSize: '12px', color: '#666' }}>{new Date(review.created_at).toLocaleDateString()}</span>
              </div>
              {review.text && <p>{review.text}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
