import React, { useState, useEffect } from 'react';
import { apiRequest } from '../services/api';
import './ReviewsSection.css';

// true = بيانات تجريبية لحد ما API التقييمات يجهز
const USE_MOCK = true;

const MOCK_REVIEWS = [
  { _id: 'm1', rating: 5, comment: 'خدمة ممتازة وسريعة', user: { name: 'أحمد' } },
  { _id: 'm2', rating: 4, comment: 'تعامل محترم وسعر مناسب', user: { name: 'منى' } },
];

function StarsDisplay({ value }) {
  return (
    <span className="stars" aria-label={value + ' من 5'}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= Math.round(value) ? 'star on' : 'star'}>★</span>
      ))}
    </span>
  );
}

export default function ReviewsSection({ providerId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState('');

  const loadReviews = async () => {
    try {
      setLoading(true);
      setError('');

      if (USE_MOCK) {
        setReviews(MOCK_REVIEWS);
        return;
      }

      const data = await apiRequest('/providers/' + providerId + '/reviews');
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.reviews)
        ? data.reviews
        : Array.isArray(data?.results)
        ? data.results
        : [];
      setReviews(list);
    } catch (err) {
      console.error('خطأ أثناء تحميل الآراء:', err);
      setError('تعذر تحميل الآراء، حاول مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [providerId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccess('');

if (!(Number.isInteger(rating) && rating >= 1 && rating <= 5)) {
        setFormError('اختاري تقييم من 1 إلى 5 نجوم');
      return;
    }

    if (!comment.trim()) {
      setFormError('اكتبي رأيك قبل الإرسال');
      return;
    }

    try {
      setSubmitting(true);

      if (USE_MOCK) {
        const newReview = {
          _id: 'local-' + Date.now(),
          rating: rating,
          comment: comment.trim(),
          user: { name: 'أنا' },
        };
        setReviews((prev) => [newReview, ...prev]);
      } else {
        await apiRequest('/providers/' + providerId + '/reviews', {
          method: 'POST',
          body: JSON.stringify({ rating: rating, comment: comment.trim() }),
        });
        await loadReviews();
      }

      setRating(0);
      setComment('');
      setSuccess('تم إضافة رأيك، شكراً لك');
    } catch (err) {
      console.error('خطأ أثناء إرسال الرأي:', err);
      setFormError('تعذر إرسال الرأي، تأكدي من تسجيل الدخول وحاولي مرة أخرى.');
    } finally {
      setSubmitting(false);
    }
  };

  const average = reviews.length
    ? reviews.reduce((sum, r) => sum + Number(r.rating ? r.rating : 0), 0) / reviews.length
    : 0;

  return (
    <section className="reviews-box">
      <h2 className="reviews-title">التقييمات والآراء</h2>

      {!loading && !error && reviews.length > 0 && (
        <div className="reviews-average">
          <span className="average-number">{average.toFixed(1)}</span>
          <StarsDisplay value={average} />
          <span className="average-count">({reviews.length} رأي)</span>
        </div>
      )}

      <form className="review-form" onSubmit={handleSubmit}>
        <div className="star-input" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              type="button"
              key={n}
              className={n <= (hover > 0 ? hover : rating) ? 'star-btn on' : 'star-btn'}
              onClick={() => setRating(n)}
              onMouseEnter={() => setHover(n)}
              aria-label={n + ' نجوم'}
            >
              ★
            </button>
          ))}
        </div>
        <textarea
          className="review-textarea"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="اكتبي رأيك في مقدم الخدمة..."
          maxLength={500}
          rows={3}
        />

        {formError && <div className="review-error">{formError}</div>}
        {success && <div className="review-success">{success}</div>}

        <button type="submit" className="review-submit" disabled={submitting}>
          {submitting ? 'جاري الإرسال...' : 'إرسال الرأي'}
        </button>
      </form>

      {loading && <div className="reviews-state">جاري تحميل الآراء...</div>}

      {!loading && error && (
        <div className="reviews-state reviews-state-error">
          {error}
          <button type="button" className="review-retry" onClick={loadReviews}>
            إعادة المحاولة
          </button>
        </div>
      )}

      {!loading && !error && reviews.length === 0 && (
        <div className="reviews-state">لا توجد آراء بعد، كوني أول من يقيّم.</div>
      )}

      {!loading && !error && reviews.length > 0 && (
        <ul className="reviews-list">
          {reviews.map((r) => (
            <li key={r._id ? r._id : r.id} className="review-item">
              <div className="review-head">
                <strong>{r.user && r.user.name ? r.user.name : 'مستخدم'}</strong>
                <StarsDisplay value={Number(r.rating ? r.rating : 0)} />
              </div>
              <p className="review-comment">{r.comment}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}