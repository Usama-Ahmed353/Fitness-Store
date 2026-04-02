import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../hooks/useLanguage';
import { Button } from '../../components/ui/Button';
import { AlertCircle, CreditCard, DollarSign } from 'lucide-react';

/**
 * CancellationModal - Confirm class cancellation with policy details
 */
const CancellationModal = ({ booking, onClose, onConfirm }) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const [selectedRefund, setSelectedRefund] = useState('credit');
  const [isLoading, setIsLoading] = useState(false);

  // Calculate time until class
  const getHourUntilClass = () => {
    const classDateTime = new Date(`${booking.date}T${booking.time}`);
    const now = new Date();
    const hoursDiff = (classDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursDiff;
  };

  // Determine refund percentage and message
  const hourUntil = getHourUntilClass();
  const refundPercentage = hourUntil > 48 ? 100 : hourUntil > 24 ? 100 : 50;
  const refundAmount = (100 * refundPercentage) / 100;

  // Handle cancellation confirmation
  const handleConfirm = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    onConfirm(selectedRefund);
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
          className={`px-6 py-4 border-b ${
            isDark
              ? 'border-gray-700 bg-gray-700/50'
              : 'border-gray-200 bg-gray-50'
          }`}
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h2
                className={`text-xl font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                {t('member.bookings.cancelClass') || 'Cancel Class'}
              </h2>
              <p
                className={`text-sm mt-1 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                {booking.className} · {booking.date}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Cancellation Policy */}
          <div
            className={`p-4 rounded-lg border-2 border-yellow-500/30 ${
              isDark
                ? 'bg-yellow-900/20 text-yellow-200'
                : 'bg-yellow-50 text-yellow-800'
            }`}
          >
            <p className="font-semibold mb-2">
              {t('member.bookings.cancellationPolicy') ||
                'Cancellation Policy'}
            </p>
            <ul className="text-sm space-y-1">
              <li>
                ✓{' '}
                {t('member.bookings.policy48h') ||
                  'Cancel more than 48h before: Full credit'}
              </li>
              <li>
                ✓{' '}
                {t('member.bookings.policy24h') ||
                  'Cancel 24-48h before: Full credit'}
              </li>
              <li>
                ✗{' '}
                {t('member.bookings.policyLess24h') ||
                  'Cancel less than 24h before: 50% credit loss'}
              </li>
            </ul>
          </div>

          {/* Refund Summary */}
          <div
            className={`p-4 rounded-lg ${
              isDark ? 'bg-gray-700/50' : 'bg-gray-100'
            }`}
          >
            <p
              className={`text-sm font-semibold mb-3 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              {t('member.bookings.refundAmount') || 'Refund Amount'}
            </p>
            <div className="flex items-baseline gap-2">
              <span
                className={`text-3xl font-bold ${
                  refundPercentage === 100
                    ? isDark
                      ? 'text-green-400'
                      : 'text-green-600'
                    : isDark
                      ? 'text-orange-400'
                      : 'text-orange-600'
                }`}
              >
                {refundPercentage}%
              </span>
              <span
                className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                {t('member.bookings.classCredit') || '($100 class credit)'}
              </span>
            </div>
            <p
              className={`text-xs mt-2 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              {refundPercentage === 100
                ? t('member.bookings.fullRefundLine') ||
                  'You will receive full credit to your account'
                : t('member.bookings.partialRefundLine') ||
                  'You will lose 50% credit due to late cancellation'}
            </p>
          </div>

          {/* Refund Method Selection */}
          <div>
            <p
              className={`text-sm font-semibold mb-3 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              {t('member.bookings.refundMethod') || 'Refund Method'}
            </p>
            <div className="space-y-2">
              <label className="flex items-center p-3 cursor-pointer border-2 rounded-lg transition-all" style={{
                borderColor: selectedRefund === 'credit' ? '#ef4444' : (isDark ? '#374151' : '#e5e7eb'),
                backgroundColor: selectedRefund === 'credit' ? (isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)') : 'transparent'
              }}>
                <input
                  type="radio"
                  value="credit"
                  checked={selectedRefund === 'credit'}
                  onChange={(e) => setSelectedRefund(e.target.value)}
                  className="w-4 h-4 text-red-500 cursor-pointer"
                />
                <div className="ml-3 flex-1">
                  <p
                    className={`font-semibold text-sm ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 inline mr-2" />
                    {t('member.bookings.classCredit') || 'Class Credit'}
                  </p>
                  <p
                    className={`text-xs ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    {t('member.bookings.creditDesc') ||
                      'Receive credit for future classes'}
                  </p>
                </div>
              </label>

              <label className="flex items-center p-3 cursor-pointer border-2 rounded-lg transition-all"
                style={{
                  borderColor: selectedRefund === 'refund' ? '#ef4444' : (isDark ? '#374151' : '#e5e7eb'),
                  backgroundColor: selectedRefund === 'refund' ? (isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)') : 'transparent'
                }}>
                <input
                  type="radio"
                  value="refund"
                  checked={selectedRefund === 'refund'}
                  onChange={(e) => setSelectedRefund(e.target.value)}
                  className="w-4 h-4 text-red-500 cursor-pointer"
                />
                <div className="ml-3 flex-1">
                  <p
                    className={`font-semibold text-sm ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    <DollarSign className="w-4 h-4 inline mr-2" />
                    {t('member.bookings.refund') || 'Refund to Payment'}
                  </p>
                  <p
                    className={`text-xs ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    {t('member.bookings.refundDesc') ||
                      'Refund sent to original payment method (3-5 business days)'}
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Confirmation Message */}
          <div
            className={`p-3 rounded-lg text-sm ${
              isDark
                ? 'bg-blue-900/20 text-blue-200'
                : 'bg-blue-50 text-blue-800'
            }`}
          >
            {t('member.bookings.confirmEmail') ||
              '✓ A confirmation email will be sent to your registered email address'}
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
            {t('member.bookings.keepClass') || 'Keep Class'}
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className={`flex-1 px-4 py-2 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2 ${
              isLoading
                ? 'bg-red-600/50 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700 active:scale-95'
            }`}
          >
            {isLoading && (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            {isLoading
              ? t('member.bookings.canceling') || 'Canceling...'
              : t('member.bookings.confirmCancel') || 'Confirm Cancellation'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CancellationModal;
