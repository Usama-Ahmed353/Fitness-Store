import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Plus,
  Trash2,
  Download,
  Calendar,
  CheckCircle,
  AlertCircle,
  Save,
  Edit2,
  X,
  DollarSign
} from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { useLanguage } from '../../../context/LanguageContext';

const BillingSettings = ({ userId, currentUser, onUnsavedChanges, onUpdate }) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();

  const [subscription, setSubscription] = useState({
    plan: currentUser?.subscription?.plan || 'premium',
    status: currentUser?.subscription?.status || 'active',
    nextBillingDate: '2024-04-15',
    amount: 29.99,
    frequency: 'monthly'
  });

  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: '1',
      type: 'card',
      last4: '4242',
      brand: 'Visa',
      expiryDate: '12/25',
      isDefault: true
    },
    {
      id: '2',
      type: 'card',
      last4: '5555',
      brand: 'Mastercard',
      expiryDate: '08/26',
      isDefault: false
    }
  ]);

  const [billingHistory, setBillingHistory] = useState([
    { id: '1', date: '2024-03-15', amount: 29.99, status: 'paid', invoice: 'INV-001' },
    { id: '2', date: '2024-02-15', amount: 29.99, status: 'paid', invoice: 'INV-002' },
    { id: '3', date: '2024-01-15', amount: 29.99, status: 'paid', invoice: 'INV-003' }
  ]);

  const [showAddCard, setShowAddCard] = useState(false);
  const [newCard, setNewCard] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryDate: '',
    cvc: ''
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  const handleAddCard = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    // Simulate API call
    setTimeout(() => {
      setSaveStatus({
        type: 'success',
        message: 'Card added successfully!'
      });
      setNewCard({
        cardNumber: '',
        cardholderName: '',
        expiryDate: '',
        cvc: ''
      });
      setShowAddCard(false);
      setIsSaving(false);
      onUnsavedChanges(false);
    }, 1500);
  };

  const handleRemoveCard = (id) => {
    setPaymentMethods(prev => prev.filter(card => card.id !== id));
    onUnsavedChanges(true);
  };

  const handleSetDefault = (id) => {
    setPaymentMethods(prev =>
      prev.map(card => ({
        ...card,
        isDefault: card.id === id
      }))
    );
    onUnsavedChanges(true);
  };

  const handleChangePlan = () => {
    // Navigate to plan selection
  };

  const formatCardNumber = (value) => {
    return value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
  };

  const formatExpiryDate = (value) => {
    value = value.replace(/\D/g, '');
    if (value.length >= 2) {
      return value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    return value;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
          {t('settings.billing') || 'Billing & Subscription'}
        </h2>
        <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {t('settings.billingDescription') || 'Manage your subscription and payment methods'}
        </p>
      </div>

      {/* Current Subscription */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-6 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {t('settings.currentPlan') || 'Current Plan'}
            </h3>
            <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {subscription.plan === 'premium' ? 'Premium Membership' : 'Standard Membership'}
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 rounded-full">
            <CheckCircle size={16} className="text-green-400" />
            <span className="text-sm font-medium text-green-400 capitalize">{subscription.status}</span>
          </div>
        </div>

        <div className="space-y-4 mb-6 pb-6 border-b border-gray-700/50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                {t('settings.amount') || 'Amount'}
              </p>
              <p className={`text-xl font-bold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                ${subscription.amount}
              </p>
            </div>
            <div>
              <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                {t('settings.frequency') || 'Frequency'}
              </p>
              <p className={`text-lg font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'} capitalize`}>
                {subscription.frequency}
              </p>
            </div>
            <div>
              <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                {t('settings.nextBilling') || 'Next Billing'}
              </p>
              <p className={`text-lg font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                {subscription.nextBillingDate}
              </p>
            </div>
            <div>
              <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                {t('settings.status') || 'Status'}
              </p>
              <p className={`text-lg font-semibold text-blue-400 capitalize`}>
                {subscription.status}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <motion.button
            type="button"
            onClick={handleChangePlan}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 py-2 px-4 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-medium transition-colors"
          >
            {t('settings.changePlan') || 'Change Plan'}
          </motion.button>
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex-1 py-2 px-4 rounded-lg border font-medium transition-colors ${
              isDark
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {t('settings.cancelSubscription') || 'Cancel Subscription'}
          </motion.button>
        </div>
      </motion.div>

      {/* Payment Methods */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`p-6 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <CreditCard size={24} className="text-blue-500" />
            </div>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {t('settings.paymentMethods') || 'Payment Methods'}
            </h3>
          </div>
          <motion.button
            type="button"
            onClick={() => setShowAddCard(!showAddCard)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white transition-colors"
          >
            <Plus size={20} />
          </motion.button>
        </div>

        {/* Add Card Form */}
        {showAddCard && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAddCard}
            className={`p-4 rounded-lg border mb-4 space-y-4 ${
              isDark ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-300'
            }`}
          >
            {/* Cardholder Name */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {t('settings.cardholderName') || 'Cardholder Name'}
              </label>
              <input
                type="text"
                value={newCard.cardholderName}
                onChange={(e) => setNewCard(prev => ({ ...prev, cardholderName: e.target.value }))}
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDark
                    ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400 focus:border-blue-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-400'
                } focus:outline-none focus:ring-1 focus:ring-blue-400`}
                placeholder="John Doe"
              />
            </div>

            {/* Card Number */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {t('settings.cardNumber') || 'Card Number'}
              </label>
              <input
                type="text"
                value={newCard.cardNumber}
                onChange={(e) => setNewCard(prev => ({ ...prev, cardNumber: formatCardNumber(e.target.value) }))}
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDark
                    ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400 focus:border-blue-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-400'
                } focus:outline-none focus:ring-1 focus:ring-blue-400`}
                placeholder="1234 5678 9012 3456"
                maxLength="19"
              />
            </div>

            {/* Expiry Date & CVC */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t('settings.expiryDate') || 'Expiry Date'}
                </label>
                <input
                  type="text"
                  value={newCard.expiryDate}
                  onChange={(e) => setNewCard(prev => ({ ...prev, expiryDate: formatExpiryDate(e.target.value) }))}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark
                      ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400 focus:border-blue-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-400'
                  } focus:outline-none focus:ring-1 focus:ring-blue-400`}
                  placeholder="MM/YY"
                  maxLength="5"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t('settings.cvc') || 'CVC'}
                </label>
                <input
                  type="text"
                  value={newCard.cvc}
                  onChange={(e) => setNewCard(prev => ({ ...prev, cvc: e.target.value.replace(/\D/g, '') }))}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark
                      ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400 focus:border-blue-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-400'
                  } focus:outline-none focus:ring-1 focus:ring-blue-400`}
                  placeholder="123"
                  maxLength="3"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <motion.button
                type="submit"
                disabled={isSaving}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-2 px-4 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 text-white font-medium transition-colors"
              >
                {isSaving ? 'Adding...' : 'Add Card'}
              </motion.button>
              <motion.button
                type="button"
                onClick={() => setShowAddCard(false)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex-1 py-2 px-4 rounded-lg border font-medium transition-colors ${
                  isDark
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Cancel
              </motion.button>
            </div>
          </motion.form>
        )}

        {/* Cards List */}
        <div className="space-y-3">
          {paymentMethods.map(card => (
            <motion.div
              key={card.id}
              layout
              className={`p-4 rounded-lg border flex items-center justify-between ${
                isDark ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center gap-4 flex-1">
                <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-600' : 'bg-gray-200'}`}>
                  <CreditCard size={24} className={isDark ? 'text-gray-300' : 'text-gray-700'} />
                </div>
                <div>
                  <p className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
                    {card.brand} •••• {card.last4}
                  </p>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {t('settings.expiresIn') || 'Expires'} {card.expiryDate}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {card.isDefault && (
                  <div className="px-2 py-1 bg-orange-500/20 rounded text-orange-400 text-xs font-medium">
                    Default
                  </div>
                )}

                <motion.button
                  type="button"
                  onClick={() => handleSetDefault(card.id)}
                  className={`p-2 rounded transition-colors ${
                    isDark ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-gray-200 text-gray-600'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Set as default"
                >
                  <Edit2 size={18} />
                </motion.button>

                <motion.button
                  type="button"
                  onClick={() => handleRemoveCard(card.id)}
                  className={`p-2 rounded transition-colors ${
                    isDark ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-red-50 text-red-600'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Remove card"
                >
                  <Trash2 size={18} />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Billing History */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`p-6 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
      >
        <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {t('settings.billingHistory') || 'Billing History'}
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <th className={`text-left py-3 px-4 text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
                  {t('settings.date') || 'Date'}
                </th>
                <th className={`text-left py-3 px-4 text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
                  {t('settings.invoice') || 'Invoice'}
                </th>
                <th className={`text-left py-3 px-4 text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
                  {t('settings.amount') || 'Amount'}
                </th>
                <th className={`text-left py-3 px-4 text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
                  {t('settings.status') || 'Status'}
                </th>
                <th className={`text-right py-3 px-4 text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
                  {t('settings.action') || 'Action'}
                </th>
              </tr>
            </thead>
            <tbody>
              {billingHistory.map(bill => (
                <tr
                  key={bill.id}
                  className={`border-b ${isDark ? 'border-gray-700 hover:bg-gray-700/30' : 'border-gray-200 hover:bg-gray-50'} transition-colors`}
                >
                  <td className={`py-3 px-4 ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
                    {bill.date}
                  </td>
                  <td className={`py-3 px-4 ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
                    {bill.invoice}
                  </td>
                  <td className={`py-3 px-4 font-medium ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                    ${bill.amount.toFixed(2)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className={`text-sm font-medium ${isDark ? 'text-green-300' : 'text-green-700'}`}>
                        {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`p-2 rounded transition-colors ${
                        isDark ? 'hover:bg-gray-700 text-blue-400' : 'hover:bg-gray-100 text-blue-600'
                      }`}
                    >
                      <Download size={18} />
                    </motion.button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Save Status */}
      {saveStatus && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg flex items-center gap-3 ${
            saveStatus.type === 'success'
              ? isDark
                ? 'bg-green-500/20 border border-green-500/30'
                : 'bg-green-50 border border-green-200'
              : 'bg-red-500/20 border border-red-500/30'
          }`}
        >
          <CheckCircle size={20} className="text-green-400 flex-shrink-0" />
          <p className={`font-medium ${isDark ? 'text-green-400' : 'text-green-800'}`}>
            {saveStatus.message}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default BillingSettings;
