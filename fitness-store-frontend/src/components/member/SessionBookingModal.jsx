import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../hooks/useLanguage';
import { ChevronLeft, ChevronRight, Clock, Video, MapPin, X } from 'lucide-react';

/**
 * SessionBookingModal - Multi-step booking flow for trainer sessions
 */
const SessionBookingModal = ({ trainer, onClose }) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const [step, setStep] = useState('date'); // date, time, duration, type, notes, payment, confirmation
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [duration, setDuration] = useState(60);
  const [sessionType, setSessionType] = useState('in-person');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const durationOptions = [30, 45, 60, 90];
  const rates = {
    30: Math.round((trainer.hourlyRate / 60) * 30),
    45: Math.round((trainer.hourlyRate / 60) * 45),
    60: trainer.hourlyRate,
    90: Math.round((trainer.hourlyRate / 60) * 90),
  };

  // Get next 7 days
  const getDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  // Get available time slots for selected date
  const getTimeSlots = () => {
    if (!selectedDate) return [];
    const dayIndex = selectedDate.getDay();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[dayIndex];
    return trainer.availability[dayName] || [];
  };

  const timeSlots = getTimeSlots();

  // Handle booking submission
  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) {
      toast.error(t('member.trainers.selectDateTime') || 'Please select date and time');
      return;
    }

    setIsLoading(true);
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    toast.success(
      t('member.trainers.bookingConfirmed') || 'Session booked successfully!'
    );
    setStep('confirmation');
    setIsLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className={`rounded-xl shadow-2xl w-full max-w-md overflow-hidden ${
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
            className={`text-xl font-bold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            {step === 'confirmation'
              ? t('member.trainers.bookingConfirmed') || 'Booking Confirmed'
              : t('member.trainers.bookSession') || 'Book Session'}
          </h2>
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

        {/* Progress Bar */}
        {step !== 'confirmation' && (
          <div className={`flex gap-1 p-4 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
            {['date', 'time', 'duration', 'type', 'notes', 'payment'].map(
              (s) => (
                <div
                  key={s}
                  className={`h-1.5 flex-1 rounded-full transition-all ${
                    s === step
                      ? 'bg-accent'
                      : ['date', 'time', 'duration', 'type', 'notes', 'payment'].indexOf(
                          s
                        ) < ['date', 'time', 'duration', 'type', 'notes', 'payment'].indexOf(step)
                        ? 'bg-accent'
                        : isDark
                          ? 'bg-gray-600'
                          : 'bg-gray-300'
                  }`}
                />
              )
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-6 min-h-[400px]">
          {/* Confirmation Screen */}
          {step === 'confirmation' && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {t('member.trainers.bookingConfirmed') || 'Session Booked!'}
                </h3>
                <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Confirmation email sent to your registered email address
                </p>
              </div>
              <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {new Date(selectedDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })}{' '}
                  at {selectedTime}
                </p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {duration} minutes with {trainer.name}
                </p>
                <p className={`text-lg font-bold mt-2 text-accent`}>
                  ${rates[duration]}
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-full px-4 py-2 bg-accent text-white rounded-lg font-semibold hover:bg-accent/90 transition-all"
              >
                {t('member.trainers.close') || 'Close'}
              </button>
            </div>
          )}

          {/* Date Selection */}
          {step === 'date' && (
            <div className="space-y-4">
              <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {t('member.trainers.selectDate') || 'Select Date'}
              </h3>
              <div className="grid grid-cols-7 gap-1">
                {getDates().map((date) => (
                  <button
                    key={date.toISOString()}
                    onClick={() => setSelectedDate(date)}
                    className={`p-2 rounded text-center text-xs font-semibold transition-all ${
                      selectedDate?.toDateString() === date.toDateString()
                        ? 'bg-accent text-white'
                        : isDark
                          ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    }`}
                  >
                    <div>{date.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 1)}</div>
                    <div>{date.getDate()}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Time Selection */}
          {step === 'time' && (
            <div className="space-y-4">
              <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {t('member.trainers.selectTime') || 'Select Time'}
              </h3>
              {selectedDate && (
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {new Date(selectedDate).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              )}
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.length > 0 ? (
                  timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`p-2 rounded font-semibold text-sm transition-all ${
                        selectedTime === time
                          ? 'bg-accent text-white'
                          : isDark
                            ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                      }`}
                    >
                      {time}
                    </button>
                  ))
                ) : (
                  <p className={`col-span-3 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    No available slots for this date
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Duration Selection */}
          {step === 'duration' && (
            <div className="space-y-4">
              <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {t('member.trainers.selectDuration') || 'Session Duration'}
              </h3>
              <div className="space-y-2">
                {durationOptions.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    className={`w-full p-3 rounded-lg text-left font-semibold transition-all flex items-center justify-between ${
                      duration === d
                        ? 'bg-accent text-white'
                        : isDark
                          ? 'bg-gray-700 hover:bg-gray-600 text-white'
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                    }`}
                  >
                    <span>{d} minutes</span>
                    <span>${rates[d]}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Session Type */}
          {step === 'type' && (
            <div className="space-y-4">
              <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {t('member.trainers.sessionType') || 'Session Type'}
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSessionType('in-person')}
                  className={`w-full p-4 rounded-lg text-left font-semibold transition-all flex items-center gap-3 border-2 ${
                    sessionType === 'in-person'
                      ? isDark
                        ? 'border-accent bg-accent/10 text-white'
                        : 'border-accent bg-accent/10 text-gray-900'
                      : isDark
                        ? 'border-gray-700 bg-gray-700 text-gray-300 hover:border-gray-600'
                        : 'border-gray-300 bg-gray-100 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  <MapPin className="w-5 h-5" />
                  <div>
                    <p>{t('member.trainers.inPerson') || 'In-Person'}</p>
                    <p className="text-xs font-normal opacity-70">
                      {t('member.trainers.atGym') || 'At the gym'}
                    </p>
                  </div>
                </button>
                <button
                  onClick={() => setSessionType('video')}
                  className={`w-full p-4 rounded-lg text-left font-semibold transition-all flex items-center gap-3 border-2 ${
                    sessionType === 'video'
                      ? isDark
                        ? 'border-accent bg-accent/10 text-white'
                        : 'border-accent bg-accent/10 text-gray-900'
                      : isDark
                        ? 'border-gray-700 bg-gray-700 text-gray-300 hover:border-gray-600'
                        : 'border-gray-300 bg-gray-100 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  <Video className="w-5 h-5" />
                  <div>
                    <p>{t('member.trainers.video') || 'Virtual'}</p>
                    <p className="text-xs font-normal opacity-70">
                      {t('member.trainers.onlineSession') || 'Online session'}
                    </p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Notes */}
          {step === 'notes' && (
            <div className="space-y-4">
              <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {t('member.trainers.notes') ||
                  'Notes for Trainer (Optional)'}
              </h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value.slice(0, 500))}
                placeholder={
                  t('member.trainers.notesPlaceholder') ||
                  'Share your fitness goals, injuries, or preferences...'
                }
                maxLength={500}
                rows={5}
                className={`w-full px-3 py-2 rounded-lg border transition-all resize-none ${
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-accent focus:ring-2 focus:ring-accent/20'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-accent focus:ring-2 focus:ring-accent/20'
                }`}
              />
              <p
                className={`text-xs ${
                  isDark ? 'text-gray-500' : 'text-gray-500'
                }`}
              >
                {notes.length}/500
              </p>
            </div>
          )}

          {/* Payment Summary */}
          {step === 'payment' && (
            <div className="space-y-4">
              <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {t('member.trainers.orderSummary') || 'Order Summary'}
              </h3>
              <div
                className={`p-4 rounded-lg space-y-2 ${
                  isDark ? 'bg-gray-700' : 'bg-gray-100'
                }`}
              >
                <div className="flex justify-between">
                  <span>{trainer.name}</span>
                  <span className="font-semibold">${rates[duration]}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                    {duration} min {sessionType === 'video' ? 'Virtual' : 'In-Person'}
                  </span>
                </div>
                <div className="border-t border-opacity-30 pt-2 flex justify-between font-bold">
                  <span>{t('member.trainers.total') || 'Total'}</span>
                  <span>${rates[duration]}</span>
                </div>
              </div>
              <div className={`p-3 rounded-lg text-sm ${
                isDark
                  ? 'bg-blue-900/20 text-blue-200'
                  : 'bg-blue-50 text-blue-800'
              }`}>
                💳 {t('member.trainers.stripePayment') || 'Payment processed securely via Stripe'}
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        {step !== 'confirmation' && (
          <div
            className={`p-6 flex gap-3 border-t ${
              isDark ? 'border-gray-700' : 'border-gray-200'
            }`}
          >
            <button
              onClick={() => {
                const steps = [
                  'date',
                  'time',
                  'duration',
                  'type',
                  'notes',
                  'payment',
                ];
                const currentIndex = steps.indexOf(step);
                if (currentIndex > 0) {
                  setStep(steps[currentIndex - 1]);
                }
              }}
              disabled={['date'].includes(step)}
              className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                ['date'].includes(step)
                  ? isDark
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : isDark
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              {t('member.trainers.back') || 'Back'}
            </button>

            <button
              onClick={() => {
                if (step === 'payment') {
                  handleBooking();
                } else {
                  const steps = [
                    'date',
                    'time',
                    'duration',
                    'type',
                    'notes',
                    'payment',
                  ];
                  const currentIndex = steps.indexOf(step);
                  if (currentIndex < steps.length - 1) {
                    setStep(steps[currentIndex + 1]);
                  }
                }
              }}
              disabled={
                (step === 'date' && !selectedDate) ||
                (step === 'time' && !selectedTime) ||
                isLoading
              }
              className={`flex-1 px-4 py-2 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2 ${
                ((step === 'date' && !selectedDate) ||
                  (step === 'time' && !selectedTime) ||
                  isLoading)
                  ? 'bg-accent/50 cursor-not-allowed'
                  : 'bg-accent hover:bg-accent/90 active:scale-95'
              }`}
            >
              {isLoading && (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {step === 'payment'
                ? t('member.trainers.bookNow') || 'Book Now'
                : t('member.trainers.next') || 'Next'}
              {step !== 'payment' && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default SessionBookingModal;
