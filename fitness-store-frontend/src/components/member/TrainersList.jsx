import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../hooks/useLanguage';
import { Star, MessageSquare, Calendar, Badge } from 'lucide-react';
import TrainerReviewModal from './TrainerReviewModal';

/**
 * TrainersList - Display and manage trainers
 */
const TrainersList = ({ trainers = [] }) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [filterSpecialty, setFilterSpecialty] = useState('all');

  // Get unique specialties for filter
  const specialties = ['all', ...new Set(trainers.map((t) => t.specialty))];

  // Filter trainers
  const filteredTrainers =
    filterSpecialty === 'all'
      ? trainers
      : trainers.filter((t) => t.specialty === filterSpecialty);

  const handleReviewClick = (trainer) => {
    setSelectedTrainer(trainer);
    setShowReviewModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {specialties.map((specialty) => (
          <button
            key={specialty}
            onClick={() => setFilterSpecialty(specialty)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${
              filterSpecialty === specialty
                ? `bg-accent text-white ${isDark ? '' : ''}`
                : isDark
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {specialty === 'all'
              ? t('member.trainers.all') || 'All Trainers'
              : specialty}
          </button>
        ))}
      </div>

      {/* Trainers Grid */}
      {filteredTrainers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTrainers.map((trainer, index) => (
            <motion.div
              key={trainer.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`rounded-lg border overflow-hidden hover:shadow-lg transition-all ${
                isDark
                  ? 'border-gray-700 bg-gray-700/50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              {/* Trainer Image */}
              <div className="relative h-48 overflow-hidden bg-gray-300">
                <img
                  src={trainer.profileImage || '/default-trainer.png'}
                  alt={trainer.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-0 right-0 bg-accent text-white px-3 py-1 rounded-bl-lg flex items-center gap-1">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-bold">
                    {trainer.rating.toFixed(1)}
                  </span>
                </div>
              </div>

              {/* Trainer Info */}
              <div className="p-4 space-y-3">
                {/* Name */}
                <div>
                  <h3
                    className={`font-bold text-lg ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {trainer.name}
                  </h3>
                  <p
                    className={`text-sm ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    {trainer.specialty}
                  </p>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2">
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
                    className={`text-sm font-semibold ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    {trainer.reviewCount || 0} {t('member.trainers.reviews') || 'reviews'}
                  </span>
                </div>

                {/* Bio/Description */}
                {trainer.bio && (
                  <p
                    className={`text-xs leading-relaxed ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    {trainer.bio}
                  </p>
                )}

                {/* Certifications */}
                {trainer.certifications && (
                  <div className="flex flex-wrap gap-1">
                    {trainer.certifications.slice(0, 2).map((cert, idx) => (
                      <span
                        key={idx}
                        className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${
                          isDark
                            ? 'bg-blue-900/30 text-blue-200'
                            : 'bg-blue-50 text-blue-700'
                        }`}
                      >
                        <Badge className="w-3 h-3" />
                        {cert}
                      </span>
                    ))}
                    {trainer.certifications?.length > 2 && (
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          isDark
                            ? 'bg-gray-700 text-gray-300'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        +{trainer.certifications.length - 2}
                      </span>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-3">
                  <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-accent text-white hover:bg-accent/90 font-semibold transition-all text-sm">
                    <Calendar className="w-4 h-4" />
                    {t('member.trainers.bookSession') || 'Book Session'}
                  </button>
                  <button
                    onClick={() => handleReviewClick(trainer)}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-semibold transition-all text-sm ${
                      isDark
                        ? 'bg-gray-600 text-white hover:bg-gray-500'
                        : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4" />
                    {t('member.trainers.review') || 'Review'}
                  </button>
                </div>

                {/* Availability */}
                {trainer.availability && (
                  <div
                    className={`text-xs p-2 rounded ${
                      isDark
                        ? 'bg-green-900/20 text-green-200'
                        : 'bg-green-50 text-green-700'
                    }`}
                  >
                    ✓ {t('member.trainers.availableToday') ||
                      'Available Today'}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        // Empty State
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`text-center py-12 rounded-lg ${
            isDark ? 'bg-gray-700/30' : 'bg-gray-50'
          }`}
        >
          <MessageSquare
            className={`w-12 h-12 mx-auto mb-3 ${
              isDark ? 'text-gray-600' : 'text-gray-400'
            }`}
          />
          <p
            className={`font-semibold ${
              isDark ? 'text-gray-300' : 'text-gray-900'
            }`}
          >
            {t('member.trainers.noTrainersFound') || 'No trainers found'}
          </p>
          <p
            className={`text-sm mt-2 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            {t('member.trainers.tryAnotherFilter') ||
              'Try selecting a different specialty'}
          </p>
        </motion.div>
      )}

      {/* Review Modal */}
      {showReviewModal && selectedTrainer && (
        <TrainerReviewModal
          trainer={selectedTrainer}
          review={selectedTrainer.myReview || null}
          onReviewSubmit={() => {
            setShowReviewModal(false);
            // Handle review submission
          }}
          onClose={() => {
            setShowReviewModal(false);
            setSelectedTrainer(null);
          }}
        />
      )}
    </div>
  );
};

export default TrainersList;
