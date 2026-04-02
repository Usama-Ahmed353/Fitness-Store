import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../hooks/useLanguage';
import { Calendar, Clock, User, MapPin, Check, X } from 'lucide-react';

/**
 * BookingManagement - Book and manage training sessions
 */
const BookingManagement = () => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const [step, setStep] = useState('selectTrainer'); // selectTrainer, selectDateTime, confirm, success
  const [formData, setFormData] = useState({
    trainerId: null,
    date: null,
    time: null,
    focusArea: '',
    notes: '',
  });

  const [trainers] = useState([
    {
      id: 1,
      name: 'Alex Johnson',
      specialty: 'Strength Training',
      image: '/trainer1.jpg',
    },
    {
      id: 2,
      name: 'Sarah Smith',
      specialty: 'Cardio & Flexibility',
      image: '/trainer2.jpg',
    },
    {
      id: 3,
      name: 'Mike Davis',
      specialty: 'HIIT & Conditioning',
      image: '/trainer3.jpg',
    },
  ]);

  const [availableTimes] = useState([
    '08:00 AM',
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
    '05:00 PM',
  ]);

  const focusAreas = [
    'Weight Loss',
    'Muscle Building',
    'Strength Training',
    'Flexibility & Mobility',
    'Cardio Fitness',
    'Core Strength',
    'Injury Recovery',
    'General Fitness',
  ];

  const selectedTrainer = trainers.find((t) => t.id === formData.trainerId);

  const handleSelectTrainer = (trainerId) => {
    setFormData((prev) => ({ ...prev, trainerId }));
    setStep('selectDateTime');
  };

  const handleSelectDateTime = () => {
    if (formData.date && formData.time) {
      setStep('confirm');
    }
  };

  const handleConfirmBooking = () => {
    setStep('success');
    setTimeout(() => {
      setStep('selectTrainer');
      setFormData({
        trainerId: null,
        date: null,
        time: null,
        focusArea: '',
        notes: '',
      });
    }, 3000);
  };

  // Get minimum date (tomorrow)
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8 flex justify-between">
        {['selectTrainer', 'selectDateTime', 'confirm', 'success'].map(
          (s, idx) => (
            <div key={s} className="flex items-center">
              <motion.div
                animate={{
                  backgroundColor:
                    ['selectTrainer', 'selectDateTime', 'confirm'].indexOf(
                      step
                    ) >= idx
                      ? '#FF6B35'
                      : isDark
                      ? '#4B5563'
                      : '#E5E7EB',
                  color:
                    ['selectTrainer', 'selectDateTime', 'confirm'].indexOf(
                      step
                    ) >= idx
                      ? 'white'
                      : isDark
                      ? '#9CA3AF'
                      : '#6B7280',
                }}
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold"
              >
                {idx + 1}
              </motion.div>
              {idx < 3 && (
                <div
                  className={`h-1 w-8 mx-1 ${
                    ['selectTrainer', 'selectDateTime', 'confirm'].indexOf(
                      step
                    ) > idx
                      ? 'bg-accent'
                      : isDark
                      ? 'bg-gray-700'
                      : 'bg-gray-300'
                  }`}
                />
              )}
            </div>
          )
        )}
      </div>

      {/* Content */}
      <motion.div
        key={step}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="space-y-6"
      >
        {/* Select Trainer */}
        {step === 'selectTrainer' && (
          <div>
            <h3
              className={`text-xl font-bold mb-4 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              {t('member.booking.selectTrainer') ||
                'Select Your Trainer'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trainers.map((trainer) => (
                <motion.button
                  key={trainer.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectTrainer(trainer.id)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    formData.trainerId === trainer.id
                      ? 'border-accent bg-accent/10'
                      : isDark
                      ? 'border-gray-700 hover:border-gray-600'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={trainer.image}
                    alt={trainer.name}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                  <h4
                    className={`font-bold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {trainer.name}
                  </h4>
                  <p
                    className={`text-sm ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    {trainer.specialty}
                  </p>
                  {formData.trainerId === trainer.id && (
                    <div className="mt-3 flex items-center gap-2 text-accent font-semibold">
                      <Check className="w-5 h-5" />
                      {t('member.booking.selected') || 'Selected'}
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Select Date & Time */}
        {step === 'selectDateTime' && (
          <div className="space-y-6">
            <div>
              <h3
                className={`text-xl font-bold mb-4 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                {t('member.booking.selectDateTime') ||
                  'Select Date & Time'}
              </h3>

              {/* Date Input */}
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  {t('member.booking.date') || 'Date'}
                </label>
                <input
                  type="date"
                  min={minDate.toISOString().split('T')[0]}
                  value={formData.date || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, date: e.target.value }))
                  }
                  className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-accent ${
                    isDark
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300'
                  }`}
                />
              </div>

              {/* Time Slots */}
              <div>
                <label
                  className={`block text-sm font-semibold mb-3 mt-4 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  {t('member.booking.time') || 'Time'}
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {availableTimes.map((time) => (
                    <motion.button
                      key={time}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, time }))
                      }
                      className={`py-2 px-3 rounded-lg font-semibold text-sm transition-all ${
                        formData.time === time
                          ? 'bg-accent text-white'
                          : isDark
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                      }`}
                    >
                      {time}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Focus Area */}
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 mt-4 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  {t('member.booking.focusArea') || 'Focus Area'}
                </label>
                <select
                  value={formData.focusArea}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, focusArea: e.target.value }))
                  }
                  className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-accent ${
                    isDark
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300'
                  }`}
                >
                  <option value="">
                    {t('member.booking.selectFocusArea') ||
                      'Select focus area...'}
                  </option>
                  {focusAreas.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              </div>

              {/* Additional Notes */}
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 mt-4 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  {t('member.booking.additionalNotes') ||
                    'Additional Notes (Optional)'}
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  placeholder={
                    t('member.booking.notesPlaceholder') ||
                    'Any special requirements or injuries we should know about?'
                  }
                  className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-accent resize-none ${
                    isDark
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 placeholder-gray-500'
                  }`}
                  rows="3"
                />
              </div>
            </div>
          </div>
        )}

        {/* Confirm Booking */}
        {step === 'confirm' && (
          <div className="space-y-6">
            <h3
              className={`text-xl font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              {t('member.booking.confirmBooking') || 'Confirm Your Booking'}
            </h3>

            <div
              className={`p-6 rounded-lg border ${
                isDark ? 'border-gray-700 bg-gray-700/50' : 'border-gray-200 bg-gray-50'
              }`}
            >
              {/* Trainer */}
              <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-700 dark:border-gray-600">
                <img
                  src={selectedTrainer?.image}
                  alt={selectedTrainer?.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <h4
                    className={`font-bold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {selectedTrainer?.name}
                  </h4>
                  <p
                    className={`text-sm ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    {selectedTrainer?.specialty}
                  </p>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-accent" />
                  <div>
                    <p
                      className={`text-sm font-semibold ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      {t('member.booking.date') || 'Date'}
                    </p>
                    <p
                      className={`font-bold ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {new Date(formData.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-accent" />
                  <div>
                    <p
                      className={`text-sm font-semibold ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      {t('member.booking.time') || 'Time'}
                    </p>
                    <p
                      className={`font-bold ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {formData.time}
                    </p>
                  </div>
                </div>

                {formData.focusArea && (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-accent" />
                    <div>
                      <p
                        className={`text-sm font-semibold ${
                          isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}
                      >
                        {t('member.booking.focusArea') || 'Focus Area'}
                      </p>
                      <p
                        className={`font-bold ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        {formData.focusArea}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Success */}
        {step === 'success' && (
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-center py-12"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-block"
            >
              <div className="bg-green-500/20 rounded-full p-6 mb-4">
                <Check className="w-12 h-12 text-green-500 mx-auto" />
              </div>
            </motion.div>
            <h3
              className={`text-2xl font-bold mb-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              {t('member.booking.bookingConfirmed') ||
                'Booking Confirmed!'}
            </h3>
            <p
              className={`text-lg mb-4 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              {t('member.booking.sessionScheduled') ||
                'Your session has been scheduled'}
            </p>
            <p
              className={`text-sm ${
                isDark ? 'text-gray-500' : 'text-gray-500'
              }`}
            >
              {t('member.booking.confirmationSent') ||
                'A confirmation email has been sent to your registered email'}
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Action Buttons */}
      {step !== 'success' && (
        <div className="flex gap-3 mt-8 pt-6 border-t border-gray-700 dark:border-gray-600">
          {step !== 'selectTrainer' && (
            <button
              onClick={() => {
                if (step === 'selectDateTime') setStep('selectTrainer');
                else if (step === 'confirm') setStep('selectDateTime');
              }}
              className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
                isDark
                  ? 'bg-gray-700 text-white hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
              }`}
            >
              {t('member.booking.back') || 'Back'}
            </button>
          )}
          <button
            onClick={() => {
              if (step === 'selectTrainer' && formData.trainerId)
                handleSelectTrainer(formData.trainerId);
              else if (step === 'selectDateTime') handleSelectDateTime();
              else if (step === 'confirm') handleConfirmBooking();
            }}
            disabled={
              (step === 'selectTrainer' && !formData.trainerId) ||
              (step === 'selectDateTime' &&
                (!formData.date || !formData.time))
            }
            className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all text-white ${
              (step === 'selectTrainer' && !formData.trainerId) ||
              (step === 'selectDateTime' && (!formData.date || !formData.time))
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-accent hover:bg-accent/90'
            }`}
          >
            {step === 'confirm' ? (t('member.booking.confirmBooking') || 'Confirm Booking') : (t('member.booking.next') || 'Next')}
          </button>
        </div>
      )}
    </div>
  );
};

export default BookingManagement;
