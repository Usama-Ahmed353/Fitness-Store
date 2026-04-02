import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../hooks/useLanguage';
import { X, Star, Award, MessageSquare } from 'lucide-react';

/**
 * TrainerReviewModal - Write and view trainer reviews
 */
const TrainerReviewModal = ({ trainer, review, onReviewSubmit, onClose }) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();

  const handleSubmitReview = () => {
    // Implementation in parent component
    onReviewSubmit?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className={`rounded-xl shadow-2xl w-full max-w-2xl my-8 overflow-hidden ${
          isDark ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-6 border-b ${
            isDark ? 'border-gray-700' : 'border-gray-200'
          }`}
        >
          <h2
            className={`text-2xl font-bold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            {t('member.reviews.reviewTrainer') || 'Review Your Trainer'}
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-all ${
              isDark
                ? 'hover:bg-gray-700 text-gray-400'
                : 'hover:bg-gray-100 text-gray-500'
            }`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Trainer Info */}
          <div
            className={`p-4 rounded-lg flex items-center gap-4 ${
              isDark ? 'bg-gray-700/50' : 'bg-gray-50'
            }`}
          >
            <img
              src={trainer?.profileImage || '/default-trainer.png'}
              alt={trainer?.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h3
                className={`font-bold text-lg ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                {trainer?.name}
              </h3>
              <p
                className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                {trainer?.specialty || 'Fitness Trainer'}
              </p>
              {trainer?.rating && (
                <div className="flex items-center gap-1 mt-1">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(trainer.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-400'
                        }`}
                      />
                    ))}
                  </div>
                  <span
                    className={`text-sm font-semibold ml-1 ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}
                  >
                    {trainer.rating.toFixed(1)} ({trainer.reviewCount || 0})
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Review Section */}
          {review ? (
            // View Review
            <div>
              <h3
                className={`text-lg font-bold mb-4 flex items-center gap-2 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                <Award className="w-5 h-5" />
                {t('member.reviews.yourReview') || 'Your Review'}
              </h3>

              {/* Rating */}
              <div
                className={`p-4 rounded-lg mb-4 ${
                  isDark ? 'bg-gray-700/50' : 'bg-gray-50'
                }`}
              >
                <p
                  className={`text-sm font-semibold mb-2 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  {t('member.reviews.rating') || 'Rating'}
                </p>
                <div className="flex gap-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-6 h-6 ${
                        i < review.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-400'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Review Text */}
              {review.text && (
                <div
                  className={`p-4 rounded-lg mb-4 ${
                    isDark
                      ? 'bg-blue-900/20 border border-blue-800'
                      : 'bg-blue-50 border border-blue-200'
                  }`}
                >
                  <p
                    className={`text-sm ${
                      isDark ? 'text-blue-200' : 'text-blue-800'
                    }`}
                  >
                    {review.text}
                  </p>
                </div>
              )}

              {/* Review Date */}
              <p
                className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                {t('member.reviews.reviewedOn') || 'Reviewed on'}{' '}
                {review.date.toLocaleDateString('en-US')}
              </p>
            </div>
          ) : (
            // Write Review
            <form className="space-y-4">
              {/* Rating Stars */}
              <div>
                <label
                  className={`block text-sm font-semibold mb-3 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  {t('member.reviews.rateTrainer') || 'Rate Your Trainer'}
                </label>
                <div className="flex gap-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star className="w-8 h-8 fill-yellow-400 text-yellow-400" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Text */}
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  {t('member.reviews.yourFeedback') || 'Your Feedback'}
                </label>
                <textarea
                  placeholder={
                    t('member.reviews.feedbackPlaceholder') ||
                    'Share your experience with this trainer...'
                  }
                  className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-accent resize-none ${
                    isDark
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  rows="4"
                />
              </div>

              {/* Anonymous Option */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="anonymous"
                  className="w-4 h-4"
                />
                <label
                  htmlFor="anonymous"
                  className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  {t('member.reviews.postAnonymously') ||
                    'Post review anonymously'}
                </label>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div
          className={`p-6 border-t flex gap-3 ${
            isDark ? 'border-gray-700' : 'border-gray-200'
          }`}
        >
          <button
            onClick={onClose}
            className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
              isDark
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
            }`}
          >
            {t('member.reviews.cancel') || 'Cancel'}
          </button>
          {!review && (
            <button
              onClick={handleSubmitReview}
              className="flex-1 px-4 py-3 rounded-lg font-semibold bg-accent text-white hover:bg-accent/90 transition-all"
            >
              {t('member.reviews.submitReview') || 'Submit Review'}
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TrainerReviewModal;
