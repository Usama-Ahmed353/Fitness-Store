import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../hooks/useLanguage';
import { Star, X, ChevronLeft, ChevronRight, Award, Clock, User } from 'lucide-react';

/**
 * TrainerProfileModal - Full trainer profile with gallery, certifications, reviews
 */
const TrainerProfileModal = ({ trainer, onClose, onBook }) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  const [avatarFailed, setAvatarFailed] = useState(false);
  const [galleryFailed, setGalleryFailed] = useState({});

  const trainerInitials = (trainer.name || 'Trainer')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const daysOfWeek = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ];
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

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
        {/* Header with Close Button */}
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
            {trainer.name}
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

        {/* Scrollable Content */}
        <div className="max-h-[70vh] overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Rating and Stats */}
            <div
              className={`flex items-start gap-4 p-4 rounded-lg ${
                isDark ? 'bg-gray-700/50' : 'bg-gray-50'
              }`}
            >
              {!avatarFailed && trainer.photo ? (
                <img
                  src={trainer.photo}
                  alt={trainer.name}
                  onError={() => setAvatarFailed(true)}
                  className="w-20 h-20 rounded-lg object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-accent to-secondary flex flex-col items-center justify-center text-white">
                  <User className="w-6 h-6 mb-1" />
                  <span className="text-xs font-bold tracking-[0.1em]">{trainerInitials}</span>
                </div>
              )}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(trainer.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                  </div>
                  <span
                    className={`font-semibold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {trainer.rating}
                  </span>
                  <span
                    className={`text-sm ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    ({trainer.reviewCount} reviews)
                  </span>
                </div>
                <p
                  className={`text-sm ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  ${trainer.hourlyRate}/hour
                </p>
              </div>
            </div>

            {/* Bio */}
            <div>
              <h3
                className={`text-lg font-bold mb-2 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                {t('member.trainers.aboutTrainer') || 'About'}
              </h3>
              <p
                className={`text-sm leading-relaxed ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                {trainer.bio}
              </p>
            </div>

            {/* Specializations */}
            <div>
              <h3
                className={`text-lg font-bold mb-3 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                {t('member.trainers.specializations') || 'Specializations'}
              </h3>
              <div className="flex flex-wrap gap-2">
                {trainer.specializations.map((spec) => (
                  <span
                    key={spec}
                    className={`px-4 py-2 rounded-full font-semibold text-sm ${
                      isDark
                        ? 'bg-accent/20 text-accent'
                        : 'bg-accent/10 text-accent'
                    }`}
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div>
              <h3
                className={`text-lg font-bold mb-3 flex items-center gap-2 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                <Award className="w-5 h-5" />
                {t('member.trainers.certifications') || 'Certifications'}
              </h3>
              <div className="space-y-2">
                {trainer.certifications.map((cert) => (
                  <div
                    key={cert}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      isDark
                        ? 'bg-green-900/20 border border-green-800'
                        : 'bg-green-50 border border-green-200'
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        isDark ? 'bg-green-400' : 'bg-green-600'
                      }`}
                    />
                    <span
                      className={`text-sm font-semibold ${
                        isDark ? 'text-green-300' : 'text-green-700'
                      }`}
                    >
                      {cert}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Gallery */}
            {trainer.gallery && trainer.gallery.length > 0 && (
              <div>
                <h3
                  className={`text-lg font-bold mb-3 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {t('member.trainers.gallery') || 'Gallery'}
                </h3>
                <div className="relative">
                  {!galleryFailed[currentGalleryIndex] ? (
                    <img
                      src={trainer.gallery[currentGalleryIndex]}
                      alt={`Gallery ${currentGalleryIndex + 1}`}
                      onError={() =>
                        setGalleryFailed((prev) => ({
                          ...prev,
                          [currentGalleryIndex]: true,
                        }))
                      }
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-64 rounded-lg bg-gradient-to-br from-accent to-secondary flex items-center justify-center text-white">
                      <div className="text-center">
                        <User className="w-10 h-10 mx-auto mb-2" />
                        <p className="text-sm font-semibold">Training Gallery</p>
                      </div>
                    </div>
                  )}
                  {trainer.gallery.length > 1 && (
                    <>
                      <button
                        onClick={() =>
                          setCurrentGalleryIndex((prev) =>
                            prev === 0 ? trainer.gallery.length - 1 : prev - 1
                          )
                        }
                        className={`absolute left-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-all ${
                          isDark
                            ? 'bg-black/50 hover:bg-black/70 text-white'
                            : 'bg-white/50 hover:bg-white/70 text-gray-900'
                        }`}
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() =>
                          setCurrentGalleryIndex((prev) =>
                            prev === trainer.gallery.length - 1 ? 0 : prev + 1
                          )
                        }
                        className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-all ${
                          isDark
                            ? 'bg-black/50 hover:bg-black/70 text-white'
                            : 'bg-white/50 hover:bg-white/70 text-gray-900'
                        }`}
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                      <div className="flex justify-center gap-1 mt-2">
                        {trainer.gallery.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentGalleryIndex(idx)}
                            className={`w-2 h-2 rounded-full transition-all ${
                              idx === currentGalleryIndex
                                ? 'bg-accent w-6'
                                : isDark
                                  ? 'bg-gray-600'
                                  : 'bg-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Availability Calendar */}
            <div>
              <h3
                className={`text-lg font-bold mb-3 flex items-center gap-2 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                <Clock className="w-5 h-5" />
                {t('member.trainers.availability') || 'Availability'}
              </h3>
              <div className="grid grid-cols-7 gap-1">
                {daysOfWeek.map((day, idx) => (
                  <div key={day} className="text-center">
                    <p
                      className={`text-xs font-semibold mb-2 ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      {dayLabels[idx]}
                    </p>
                    <div
                      className={`p-2 rounded text-xs font-semibold ${
                        trainer.availability[day]?.length > 0
                          ? isDark
                            ? 'bg-green-900/20 text-green-400'
                            : 'bg-green-50 text-green-700'
                          : isDark
                            ? 'bg-gray-700 text-gray-500'
                            : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {trainer.availability[day]?.length || 0}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            {trainer.reviews && trainer.reviews.length > 0 && (
              <div>
                <h3
                  className={`text-lg font-bold mb-3 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {t('member.trainers.reviews') || 'Reviews'}
                </h3>
                <div className="space-y-3">
                  {trainer.reviews.map((review) => (
                    <div
                      key={review.id}
                      className={`p-4 rounded-lg ${
                        isDark ? 'bg-gray-700/50' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p
                          className={`font-semibold ${
                            isDark ? 'text-white' : 'text-gray-900'
                          }`}
                        >
                          {review.member}
                        </p>
                        <div className="flex">
                          {Array(5)
                            .fill(0)
                            .map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-400'
                                }`}
                              />
                            ))}
                        </div>
                      </div>
                      <p
                        className={`text-sm mb-1 ${
                          isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}
                      >
                        {review.text}
                      </p>
                      <p
                        className={`text-xs ${
                          isDark ? 'text-gray-500' : 'text-gray-500'
                        }`}
                      >
                        {review.date}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer with Book Button */}
        <div
          className={`p-6 border-t flex gap-3 ${
            isDark ? 'border-gray-700' : 'border-gray-200'
          }`}
        >
          <button
            onClick={onClose}
            className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
              isDark
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
            }`}
          >
            {t('member.trainers.close') || 'Close'}
          </button>
          <button
            onClick={onBook}
            className="flex-1 px-4 py-3 rounded-lg font-semibold text-white bg-accent hover:bg-accent/90 transition-all"
          >
            {t('member.trainers.bookNow') || 'Book Now'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TrainerProfileModal;
