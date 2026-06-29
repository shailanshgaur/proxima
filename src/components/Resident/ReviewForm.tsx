import React, { useState, useEffect } from 'react';
import { Booking, Review, Vendor } from '../../types';
import { reviewService } from '../../lib/reviewService';

interface ReviewFormProps {
  booking: Booking;
  vendor: Vendor;
  residentId: string;
  onReviewSubmitted: () => void;
}

const RATING_LABELS: Record<number, string> = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Very good',
  5: 'Excellent',
};

/* Number-circle rating picker — no emoji, no icon fonts */
function RatingPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={`w-10 h-10 rounded-full border-2 text-sm font-semibold transition-all cursor-pointer ${
              value >= n
                ? 'bg-proxima-primary border-proxima-primary text-white'
                : 'border-proxima-border text-proxima-muted hover:border-proxima-primary/60 hover:text-proxima-primary'
            }`}
          >
            {n}
          </button>
        ))}
      </div>
      {value > 0 && (
        <p className="text-sm text-proxima-muted">{RATING_LABELS[value]}</p>
      )}
    </div>
  );
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  booking,
  vendor,
  residentId,
  onReviewSubmitted,
}) => {
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
      setError('Please select a rating (1–5)');
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
    <div className="space-y-4">
      {/* Vendor summary */}
      <div
        className="bg-proxima-card border border-proxima-border rounded-xl p-4"
        style={{ boxShadow: '0 1px 3px rgba(28,25,23,0.06)' }}
      >
        <h2 className="text-base font-semibold text-proxima-text">Rate {vendor.name}</h2>
        <p className="text-sm text-proxima-muted mt-0.5">
          Average: {vendor.rating.toFixed(1)}&thinsp;/&thinsp;5
          &nbsp;&middot;&nbsp;
          {vendor.review_count} {vendor.review_count === 1 ? 'review' : 'reviews'}
        </p>
      </div>

      {/* Write review */}
      {!hasReviewed && (
        <div
          className="bg-proxima-card border border-proxima-border rounded-xl p-4 space-y-5"
          style={{ boxShadow: '0 1px 3px rgba(28,25,23,0.06)' }}
        >
          <h3 className="text-sm font-semibold text-proxima-text">Share your experience</h3>

          {error && (
            <div
              className="p-3 rounded-xl text-sm text-proxima-error"
              style={{ background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.20)' }}
            >
              {error}
            </div>
          )}

          {success && (
            <div
              className="p-3 rounded-xl text-sm text-proxima-success"
              style={{ background: 'rgba(21,128,61,0.06)', border: '1px solid rgba(21,128,61,0.20)' }}
            >
              Thank you — your review has been submitted.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-proxima-text">Rating</label>
              <RatingPicker value={rating} onChange={setRating} />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-proxima-text">
                Review{' '}
                <span className="font-normal text-proxima-muted">(optional)</span>
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Share your experience with this vendor…"
                maxLength={500}
                rows={3}
                className="form-control w-full px-3 py-2.5 border border-proxima-border rounded-lg text-sm text-proxima-text placeholder:text-proxima-muted bg-proxima-base resize-none"
              />
              <p className="text-xs text-proxima-muted text-right">
                {text.length}&thinsp;/&thinsp;500
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-proxima-primary hover:bg-proxima-primary-dim text-white text-sm font-semibold rounded-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              style={{ minHeight: '48px' }}
            >
              {submitting ? 'Submitting…' : 'Submit Review'}
            </button>
          </form>
        </div>
      )}

      {/* Review list */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-proxima-text">
          All reviews ({reviews.length})
        </h3>

        {loadingReviews && (
          <div className="space-y-2">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-proxima-card border border-proxima-border rounded-xl h-16 animate-pulse"
              />
            ))}
          </div>
        )}

        {!loadingReviews && reviews.length === 0 && (
          <div className="py-10 bg-proxima-card border border-proxima-border rounded-xl text-center">
            <p className="text-sm text-proxima-muted">
              No reviews yet. Be the first to review!
            </p>
          </div>
        )}

        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-proxima-card border border-proxima-border rounded-xl p-4 space-y-2"
            style={{ boxShadow: '0 1px 3px rgba(28,25,23,0.06)' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-proxima-primary">
                {review.rating}&thinsp;/&thinsp;5
                <span className="ml-2 font-normal text-proxima-muted text-xs">
                  {RATING_LABELS[review.rating] ?? ''}
                </span>
              </span>
              <span className="text-xs text-proxima-muted">
                {new Date(review.created_at).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>
            {review.text && (
              <p className="text-sm text-proxima-text leading-relaxed">{review.text}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
