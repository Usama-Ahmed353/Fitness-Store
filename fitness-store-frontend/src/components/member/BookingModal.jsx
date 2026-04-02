import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../hooks/useLanguage';
import {
  X,
  Clock,
  Users,
  Zap,
  AlertCircle,
  Check,
  Package,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

/**
 * BookingModal - Modal for booking classes with details and options
 */
const BookingModal = ({
  classItem,
  onClose,
  onConfirmBooking,
  bookingStatus = 'available',
  waitlistPosition = null,
  classPacks = { count: 5, maxCount: 10 },
}) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();

  const [bookingType, setBookingType] = useState('book'); // 'book', 'waitlist', or 'pack'
  const [isConfirming, setIsConfirming] = useState(false);

  const spotsLeft = classItem.maxSpots - classItem.bookedSpots;
  const isFull = spotsLeft === 0;

  const handleConfirm = async () => {
    setIsConfirming(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    onConfirmBooking(classItem, bookingType);
    setIsConfirming(false);
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: 20 },
  };

  return (
    <motion.div
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden ${
          isDark ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-start justify-between p-6 border-b ${
            isDark ? 'border-gray-700' : 'border-gray-200'
          }`}
        >
          <div className="flex gap-4 flex-1">
            <img
              src={classItem.instructor.image}
              alt={classItem.instructor.name}
              className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
            />
            <div className="flex-1">
              <h2
                className={`text-2xl font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                {classItem.name}
              </h2>
              <p
                className={`text-sm mt-1 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                {classItem.description}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDark
                ? 'hover:bg-gray-700 text-gray-400'
                : 'hover:bg-gray-100 text-gray-500'
            }`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className={`p-6 max-h-[60vh] overflow-y-auto`}>
          {/* Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div>
              <p
                className={`text-xs font-semibold mb-1 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                {t('member.classes.time') || 'Time'}
              </p>
              <p
                className={`font-semibold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                {classItem.time}
              </p>
            </div>
            <div>
              <p
                className={`text-xs font-semibold mb-1 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                {t('member.classes.duration') || 'Duration'}
              </p>
              <p
                className={`font-semibold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                {classItem.duration} min
              </p>
            </div>
            <div>
              <p
                className={`text-xs font-semibold mb-1 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                {t('member.classes.difficulty') || 'Difficulty'}
              </p>
              <p
                className={`font-semibold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                {classItem.difficulty}
              </p>
            </div>
            <div>
              <p
                className={`text-xs font-semibold mb-1 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                {t('member.classes.spots') || 'Spots'}
              </p>
              <p
                className={`font-semibold ${
                  isFull ? 'text-red-600' : 'text-accent'
                }`}
              >
                {spotsLeft}/{classItem.maxSpots}
              </p>
            </div>
          </div>

          {/* Instructor Info */}
          <div
            className={`mb-6 p-4 rounded-lg border ${
              isDark
                ? 'border-gray-700 bg-gray-900/50'
                : 'border-gray-200 bg-gray-50'
            }`}
          >
            <p
              className={`text-sm font-semibold mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              {t('member.classes.instructorBio') || 'About Your Instructor'}
            </p>
            <p
              className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
            >
              <strong>{classItem.instructor.name}</strong> · {classItem.instructor.bio}
            </p>
          </div>

          {/* Equipment */}
          {classItem.equipment.length > 0 && (
            <div className="mb-6">
              <p
                className={`text-sm font-semibold mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                {t('member.classes.equipment') || 'Equipment Needed'}
              </p>
              <div className="flex flex-wrap gap-2">
                {classItem.equipment.map((item) => (
                  <span
                    key={item}
                    className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                      isDark
                        ? 'bg-gray-700 text-gray-300'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    <Package className="w-3 h-3" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Cancellation Policy */}
          <div
            className={`mb-6 p-4 rounded-lg border ${
              isDark
                ? 'border-yellow-900/30 bg-yellow-900/10'
                : 'border-yellow-200 bg-yellow-50'
            }`}
          >
            <div className="flex gap-3">
              <AlertCircle
                className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                  isDark ? 'text-yellow-400' : 'text-yellow-600'
                }`}
              />
              <div>
                <p
                  className={`text-sm font-semibold mb-1 ${
                    isDark ? 'text-yellow-400' : 'text-yellow-800'
                  }`}
                >
                  {t('member.classes.cancellation') || 'Cancellation Policy'}
                </p>
                <p
                  className={`text-sm ${
                    isDark ? 'text-yellow-300/80' : 'text-yellow-700'
                  }`}
                >
                  {classItem.cancellationPolicy}
                </p>
              </div>
            </div>
          </div>

          {/* Booking Options */}
          <div className="mb-6 space-y-3">
            {bookingStatus !== 'booked' && (
              <>
                {/* Standard Booking */}
                {!isFull && (
                  <label
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      bookingType === 'book'
                        ? isDark
                          ? 'border-accent bg-accent/10'
                          : 'border-accent bg-accent/10'
                        : isDark
                          ? 'border-gray-700 bg-transparent'
                          : 'border-gray-200 bg-transparent'
                    }`}
                  >
                    <input
                      type="radio"
                      name="bookingType"
                      value="book"
                      checked={bookingType === 'book'}
                      onChange={(e) => setBookingType(e.target.value)}
                      className="w-5 h-5 accent-accent cursor-pointer"
                    />
                    <div className="flex-1">
                      <p
                        className={`font-semibold ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        {t('member.classes.bookClass') || 'Book This Class'}
                      </p>
                      <p
                        className={`text-sm ${
                          isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}
                      >
                        {spotsLeft > 5
                          ? t('member.classes.plentySpotsLeft') || 'Plenty of spots available'
                          : t('member.classes.fewSpotsLeft') ||
                            `Only ${spotsLeft} spots left!`}
                      </p>
                    </div>
                  </label>
                )}

                {/* Waitlist Option */}
                {isFull && bookingStatus !== 'waitlisted' && (
                  <label
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      bookingType === 'waitlist'
                        ? isDark
                          ? 'border-blue-500 bg-blue-900/20'
                          : 'border-blue-500 bg-blue-50'
                        : isDark
                          ? 'border-gray-700 bg-transparent'
                          : 'border-gray-200 bg-transparent'
                    }`}
                  >
                    <input
                      type="radio"
                      name="bookingType"
                      value="waitlist"
                      checked={bookingType === 'waitlist'}
                      onChange={(e) => setBookingType(e.target.value)}
                      className="w-5 h-5 cursor-pointer"
                    />
                    <div className="flex-1">
                      <p
                        className={`font-semibold ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        {t('member.classes.joinWaitlist') ||
                          'Join Waitlist'}
                      </p>
                      <p
                        className={`text-sm ${
                          isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}
                      >
                        {t('member.classes.autoNotify') ||
                          'Get auto-notified if a spot opens up'}
                      </p>
                    </div>
                  </label>
                )}

                {/* Class Pack Option */}
                {classPacks && classPacks.count > 0 && !isFull && (
                  <label
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      bookingType === 'pack'
                        ? isDark
                          ? 'border-purple-500 bg-purple-900/20'
                          : 'border-purple-500 bg-purple-50'
                        : isDark
                          ? 'border-gray-700 bg-transparent'
                          : 'border-gray-200 bg-transparent'
                    }`}
                  >
                    <input
                      type="radio"
                      name="bookingType"
                      value="pack"
                      checked={bookingType === 'pack'}
                      onChange={(e) => setBookingType(e.target.value)}
                      className="w-5 h-5 cursor-pointer"
                    />
                    <div className="flex-1">
                      <p
                        className={`font-semibold ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        {t('member.classes.useClassPack') || 'Use Class Pack'}
                      </p>
                      <p
                        className={`text-sm ${
                          isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}
                      >
                        {classPacks.count} of {classPacks.maxCount} remaining
                      </p>
                    </div>
                  </label>
                )}
              </>
            )}

            {/* Booked Status */}
            {bookingStatus === 'booked' && (
              <div
                className={`p-4 rounded-lg border-2 flex items-center gap-3 ${
                  isDark
                    ? 'border-green-900/50 bg-green-900/20'
                    : 'border-green-200 bg-green-50'
                }`}
              >
                <Check
                  className={`w-6 h-6 flex-shrink-0 ${
                    isDark ? 'text-green-400' : 'text-green-600'
                  }`}
                />
                <div>
                  <p
                    className={`font-semibold ${
                      isDark ? 'text-green-400' : 'text-green-700'
                    }`}
                  >
                    {t('member.classes.alreadyBooked') || 'You are booked!'}
                  </p>
                  <p
                    className={`text-sm ${
                      isDark ? 'text-green-300/80' : 'text-green-600'
                    }`}
                  >
                    {t('member.classes.canCancelAnytime') ||
                      'You can cancel anytime before 48 hours'}
                  </p>
                </div>
              </div>
            )}

            {/* Waitlisted Status */}
            {bookingStatus === 'waitlisted' && (
              <div
                className={`p-4 rounded-lg border-2 flex items-center gap-3 ${
                  isDark
                    ? 'border-blue-900/50 bg-blue-900/20'
                    : 'border-blue-200 bg-blue-50'
                }`}
              >
                <Users
                  className={`w-6 h-6 flex-shrink-0 ${
                    isDark ? 'text-blue-400' : 'text-blue-600'
                  }`}
                />
                <div>
                  <p
                    className={`font-semibold ${
                      isDark ? 'text-blue-400' : 'text-blue-700'
                    }`}
                  >
                    {t('member.classes.youAreWaitlisted') || 'You are #POSITION on waitlist'}
                      .replace(
                        'POSITION',
                        waitlistPosition || '?'
                      )
                  </p>
                  <p
                    className={`text-sm ${
                      isDark ? 'text-blue-300/80' : 'text-blue-600'
                    }`}
                  >
                    {t('member.classes.willNotifySpotOpens') ||
                      "We'll notify you if a spot opens"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          className={`p-6 border-t flex gap-3 justify-end ${
            isDark ? 'border-gray-700' : 'border-gray-200'
          }`}
        >
          <button
            onClick={onClose}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              isDark
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
            }`}
          >
            {t('common.cancel') || 'Cancel'}
          </button>

          {bookingStatus !== 'booked' && (
            <button
              onClick={handleConfirm}
              disabled={isConfirming}
              className={`px-6 py-2 rounded-lg font-semibold text-white transition-all flex items-center gap-2 ${
                isConfirming
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-accent hover:opacity-90'
              }`}
            >
              {isConfirming ? (
                <>
                  <span className="animate-spin">⌛</span>
                  {t('member.classes.confirming') || 'Confirming...'}
                </>
              ) : (
                <>
                  {bookingType === 'book'
                    ? t('member.classes.confirmBooking') || 'Confirm Booking'
                    : bookingType === 'waitlist'
                      ? t('member.classes.joinWaitlist') || 'Join Waitlist'
                      : t('member.classes.usePackConfirm') || 'Use Pack'}
                </>
              )}
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BookingModal;
