import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../hooks/useLanguage';
import { Button } from '../../components/ui/Button';
import { Star, X } from 'lucide-react';

/**
 * ReviewModal - Leave a class review with star rating and optional text
 */
const ReviewModal = ({ booking, existingReview, onClose, onSubmit }) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState(existingReview?.text || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error(t('member.bookings.ratingRequired') || 'Please select a rating');
      return;
    }

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    onSubmit(rating, text);
    setIsLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className={`rounded-xl shadow-2xl max-w-md w-full overflow-hidden ${
          isDark ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        {/* Header */}
        <div
          className={`px-6 py-4 border-b flex items-center justify-between ${
            isDark
              ? 'border-gray-700 bg-gray-700/50'
              : 'border-gray-200 bg-gray-50'
          }`}
        >
          <div>
            <h2
              className={`text-xl font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              {t('member.bookings.leaveReview') || 'Leave a Review'}
            </h2>
            <p
              className={`text-sm mt-1 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              {booking.className}
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-all ${
              isDark
                ? 'hover:bg-gray-700 text-gray-400'
                : 'hover:bg-gray-100 text-gray-500'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Instructor Info */}
          <div className="flex items-center gap-4 p-4 rounded-lg" style={{
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'
          }}>
            <img
              src={`https://via.placeholder.com/48?text=${booking.instructor.charAt(0)}`}
              alt={booking.instructor}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {booking.instructor}
              </p>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {booking.className}
              </p>
            </div>
          </div>

          {/* Star Rating */}
          <div>
            <label className={`block text-sm font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {t('member.bookings.howDidYouEnjoy') || 'How did you enjoy this class?'}
            </label>
            <div className="flex gap-2 justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110 active:scale-95"
                >
                  <Star
                    className="w-8 h-8 transition-all"
                    fill={
                      star <= (hoverRating || rating) ? '#FBBF24' : 'none'
                    }
                    stroke={
                      star <= (hoverRating || rating)
                        ? '#FBBF24'
                        : isDark
                          ? '#6B7280'
                          : '#D1D5DB'
                    }
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-center text-sm mt-2 font-semibold text-yellow-500">
                {rating === 1 && (t('member.bookings.ratePoor') || 'Poor')}
                {rating === 2 && (t('member.bookings.rateFair') || 'Fair')}
                {rating === 3 && (t('member.bookings.rateGood') || 'Good')}
                {rating === 4 && (t('member.bookings.rateVeryGood') || 'Very Good')}
                {rating === 5 && (t('member.bookings.rateExcellent') || 'Excellent')}
              </p>
            )}
          </div>

          {/* Review Text */}
          <div>
            <label
              htmlFor="review-text"
              className={`block text-sm font-semibold mb-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              {t('member.bookings.reviewText') || 'Tell us more (optional)'}
            </label>
            <textarea
              id="review-text"
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, 500))}
              placeholder={
                t('member.bookings.reviewPlaceholder') ||
                'Share your experience with this class...'
              }
              maxLength={500}
              rows={4}
              className={`w-full px-3 py-2 rounded-lg border transition-all resize-none ${
                isDark
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-accent focus:ring-2 focus:ring-accent/20'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-accent focus:ring-2 focus:ring-accent/20'
              }`}
            />
            <p
              className={`text-xs mt-1 ${
                isDark ? 'text-gray-500' : 'text-gray-500'
              }`}
            >
              {text.length}/500 {t('member.bookings.characters') || 'characters'}
            </p>
          </div>

          {/* Helpful Note */}
          <div
            className={`p-3 rounded-lg text-xs ${
              isDark
                ? 'bg-blue-900/20 text-blue-200'
                : 'bg-blue-50 text-blue-800'
            }`}
          >
            💡 {t('member.bookings.reviewTip') || 'Your review helps other members choose the right class for them'}
          </div>
        </div>

        {/* Actions */}
        <div
          className={`px-6 py-4 flex gap-3 border-t ${
            isDark ? 'border-gray-700' : 'border-gray-200'
          }`}
        >
          <button
            onClick={onClose}
            disabled={isLoading}
            className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
              isDark
                ? 'bg-gray-700 hover:bg-gray-600 text-white disabled:opacity-50'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-900 disabled:opacity-50'
            }`}
          >
            {t('member.bookings.skipReview') || 'Skip'}
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading || rating === 0}
            className={`flex-1 px-4 py-2 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2 ${
              isLoading || rating === 0
                ? 'bg-accent/50 cursor-not-allowed'
                : 'bg-accent hover:bg-accent/90 active:scale-95'
            }`}
          >
            {isLoading && (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            {isLoading
              ? t('member.bookings.submitting') || 'Submitting...'
              : t('member.bookings.submitReview') || 'Submit Review'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ReviewModal;
