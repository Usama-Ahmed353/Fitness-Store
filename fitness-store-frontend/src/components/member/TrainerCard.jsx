import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../hooks/useLanguage';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import TrainerProfileModal from './TrainerProfileModal';
import SessionBookingModal from './SessionBookingModal';
import { Star, Calendar, DollarSign, Tag } from 'lucide-react';

/**
 * TrainerCard - Individual trainer card in grid
 */
const TrainerCard = ({ trainer }) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const [showProfile, setShowProfile] = useState(false);
  const [showBooking, setShowBooking] = useState(false);

  return (
    <>
      <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
        <Card className="overflow-hidden hover:shadow-xl transition-shadow h-full flex flex-col">
          {/* Photo */}
          <div className="relative h-40 overflow-hidden bg-gray-300">
            <img
              src={trainer.photo}
              alt={trainer.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="p-4 flex flex-col flex-grow">
            {/* Name and Rating */}
            <div className="mb-2">
              <h3
                className={`text-lg font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                {trainer.name}
              </h3>
              <div className="flex items-center gap-1 mt-1">
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
                  className={`text-sm font-semibold ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  {trainer.rating} ({trainer.reviewCount})
                </span>
              </div>
            </div>

            {/* Specializations */}
            <div className="mb-3 flex flex-wrap gap-1">
              {trainer.specializations.slice(0, 2).map((spec) => (
                <span
                  key={spec}
                  className={`text-xs px-2 py-1 rounded-full font-semibold ${
                    isDark
                      ? 'bg-accent/20 text-accent'
                      : 'bg-accent/10 text-accent'
                  }`}
                >
                  {spec}
                </span>
              ))}
              {trainer.specializations.length > 2 && (
                <span
                  className={`text-xs px-2 py-1 rounded-full font-semibold ${
                    isDark
                      ? 'bg-gray-700 text-gray-300'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  +{trainer.specializations.length - 2}
                </span>
              )}
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
              <div
                className={`flex items-center gap-1 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                <DollarSign className="w-4 h-4 text-accent" />
                <span>${trainer.hourlyRate}/hr</span>
              </div>
              <div
                className={`flex items-center gap-1 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                <Calendar className="w-4 h-4 text-accent" />
                <span className="truncate">{trainer.nextAvailable}</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-auto flex gap-2">
              <button
                onClick={() => setShowProfile(true)}
                className={`flex-1 px-3 py-2 rounded-lg font-semibold text-sm transition-all ${
                  isDark
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                }`}
              >
                {t('member.trainers.viewProfile') || 'View Profile'}
              </button>
              <button
                onClick={() => setShowBooking(true)}
                className="flex-1 px-3 py-2 rounded-lg font-semibold text-sm text-white bg-accent hover:bg-accent/90 transition-all"
              >
                {t('member.trainers.bookSession') || 'Book Session'}
              </button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Modals */}
      {showProfile && (
        <TrainerProfileModal
          trainer={trainer}
          onClose={() => setShowProfile(false)}
          onBook={() => {
            setShowProfile(false);
            setShowBooking(true);
          }}
        />
      )}

      {showBooking && (
        <SessionBookingModal
          trainer={trainer}
          onClose={() => setShowBooking(false)}
        />
      )}
    </>
  );
};

export default TrainerCard;
