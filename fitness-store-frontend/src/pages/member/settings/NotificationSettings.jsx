import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  Mail,
  MessageSquare,
  Save,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { useLanguage } from '../../../context/LanguageContext';

const NotificationSettings = ({ userId, currentUser, onUnsavedChanges, onUpdate }) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();

  const [preferences, setPreferences] = useState({
    email: {
      classReminders: currentUser?.notificationPreferences?.email?.classReminders ?? true,
      promotions: currentUser?.notificationPreferences?.email?.promotions ?? false,
      newsletter: currentUser?.notificationPreferences?.email?.newsletter ?? true,
      accountUpdates: currentUser?.notificationPreferences?.email?.accountUpdates ?? true,
      trainerMessages: currentUser?.notificationPreferences?.email?.trainerMessages ?? true
    },
    sms: {
      classReminders: currentUser?.notificationPreferences?.sms?.classReminders ?? true,
      paymentReminders: currentUser?.notificationPreferences?.sms?.paymentReminders ?? true,
      emergencyAlerts: currentUser?.notificationPreferences?.sms?.emergencyAlerts ?? true
    },
    inApp: {
      classReminders: currentUser?.notificationPreferences?.inApp?.classReminders ?? true,
      messages: currentUser?.notificationPreferences?.inApp?.messages ?? true,
      promotions: currentUser?.notificationPreferences?.inApp?.promotions ?? false,
      systemAlerts: currentUser?.notificationPreferences?.inApp?.systemAlerts ?? true
    }
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  const handleToggle = (category, preference) => {
    setPreferences(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [preference]: !prev[category][preference]
      }
    }));
    onUnsavedChanges(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus(null);

    // Simulate API call
    setTimeout(() => {
      setSaveStatus({
        type: 'success',
        message: 'Notification preferences saved successfully!'
      });
      setIsSaving(false);
      onUnsavedChanges(false);
      onUpdate?.();
    }, 1500);
  };

  const NotificationToggle = ({ label, value, onChange }) => (
    <div className="flex items-center justify-between py-3">
      <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
        {label}
      </label>
      <motion.button
        type="button"
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          value ? 'bg-orange-500' : isDark ? 'bg-gray-700' : 'bg-gray-300'
        }`}
        whileHover={{ scale: 1.05 }}
      >
        <motion.span
          className="inline-block h-4 w-4 transform rounded-full bg-white"
          animate={{ x: value ? 20 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </motion.button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
          {t('settings.notifications') || 'Notifications'}
        </h2>
        <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {t('settings.notificationsDescription') || 'Manage how you receive updates'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <Mail size={24} className="text-orange-500" />
            </div>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {t('settings.emailNotifications') || 'Email Notifications'}
            </h3>
          </div>

          <div className="space-y-1">
            <NotificationToggle
              label={t('settings.classReminders') || 'Class Reminders'}
              value={preferences.email.classReminders}
              onChange={() => handleToggle('email', 'classReminders')}
            />
            <NotificationToggle
              label={t('settings.trainerMessages') || 'Messages from Trainers'}
              value={preferences.email.trainerMessages}
              onChange={() => handleToggle('email', 'trainerMessages')}
            />
            <NotificationToggle
              label={t('settings.accountUpdates') || 'Account Updates'}
              value={preferences.email.accountUpdates}
              onChange={() => handleToggle('email', 'accountUpdates')}
            />
            <NotificationToggle
              label={t('settings.newsletter') || 'Newsletter'}
              value={preferences.email.newsletter}
              onChange={() => handleToggle('email', 'newsletter')}
            />
            <NotificationToggle
              label={t('settings.promotions') || 'Promotions & Offers'}
              value={preferences.email.promotions}
              onChange={() => handleToggle('email', 'promotions')}
            />
          </div>

          <p className={`text-xs mt-4 pt-4 border-t ${
            isDark ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-600'
          }`}>
            {t('settings.emailFrequency') || 'We\'ll send you emails based on your preferences. You can unsubscribe from any of these notifications.'}
          </p>
        </motion.div>

        {/* SMS Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`p-6 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <MessageSquare size={24} className="text-blue-500" />
            </div>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {t('settings.smsNotifications') || 'SMS Notifications'}
            </h3>
          </div>

          <div className="space-y-1">
            <NotificationToggle
              label={t('settings.classReminders') || 'Class Reminders'}
              value={preferences.sms.classReminders}
              onChange={() => handleToggle('sms', 'classReminders')}
            />
            <NotificationToggle
              label={t('settings.paymentReminders') || 'Payment Reminders'}
              value={preferences.sms.paymentReminders}
              onChange={() => handleToggle('sms', 'paymentReminders')}
            />
            <NotificationToggle
              label={t('settings.emergencyAlerts') || 'Emergency Alerts'}
              value={preferences.sms.emergencyAlerts}
              onChange={() => handleToggle('sms', 'emergencyAlerts')}
            />
          </div>

          <p className={`text-xs mt-4 pt-4 border-t ${
            isDark ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-600'
          }`}>
            {t('settings.smsFrequency') || 'Standard SMS rates may apply. Emergency alerts cannot be disabled for safety reasons.'}
          </p>
        </motion.div>

        {/* In-App Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`p-6 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Bell size={24} className="text-purple-500" />
            </div>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {t('settings.inAppNotifications') || 'In-App Notifications'}
            </h3>
          </div>

          <div className="space-y-1">
            <NotificationToggle
              label={t('settings.classReminders') || 'Class Reminders'}
              value={preferences.inApp.classReminders}
              onChange={() => handleToggle('inApp', 'classReminders')}
            />
            <NotificationToggle
              label={t('settings.messages') || 'Messages'}
              value={preferences.inApp.messages}
              onChange={() => handleToggle('inApp', 'messages')}
            />
            <NotificationToggle
              label={t('settings.systemAlerts') || 'System Alerts'}
              value={preferences.inApp.systemAlerts}
              onChange={() => handleToggle('inApp', 'systemAlerts')}
            />
            <NotificationToggle
              label={t('settings.promotions') || 'Promotions & Offers'}
              value={preferences.inApp.promotions}
              onChange={() => handleToggle('inApp', 'promotions')}
            />
          </div>

          <p className={`text-xs mt-4 pt-4 border-t ${
            isDark ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-600'
          }`}>
            {t('settings.inAppFrequency') || 'You\'ll see these notifications in your app and notification center.'}
          </p>
        </motion.div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`p-4 rounded-lg flex gap-3 ${
            isDark ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 border border-blue-200'
          }`}
        >
          <AlertCircle size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
          <p className={`text-sm ${isDark ? 'text-blue-300' : 'text-blue-800'}`}>
            {t('settings.notificationInfo') || 'Make sure to grant the app permission to send notifications in your device settings.'}
          </p>
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
            {saveStatus.type === 'success' ? (
              <CheckCircle size={20} className="text-green-400 flex-shrink-0" />
            ) : (
              <AlertCircle size={20} className="text-red-400 flex-shrink-0" />
            )}
            <p className={`font-medium ${
              saveStatus.type === 'success'
                ? isDark ? 'text-green-400' : 'text-green-800'
                : isDark ? 'text-red-400' : 'text-red-800'
            }`}>
              {saveStatus.message}
            </p>
          </motion.div>
        )}

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isSaving}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          {isSaving ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
              />
              {t('common.saving') || 'Saving...'}
            </>
          ) : (
            <>
              <Save size={20} />
              {t('common.saveChanges') || 'Save Changes'}
            </>
          )}
        </motion.button>
      </form>
    </div>
  );
};

export default NotificationSettings;
