import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../hooks/useLanguage';
import {
  Bell,
  Lock,
  Eye,
  Globe,
  Zap,
  Download,
  Trash2,
  LogOut,
  Save,
  Check,
} from 'lucide-react';

/**
 * SettingsPage - Manage member account settings
 */
const SettingsPage = () => {
  const { isDark, toggleTheme } = useTheme();
  const { t, language, setLanguage } = useLanguage();
  const [activeSection, setActiveSection] = useState('notifications');
  const [settings, setSettings] = useState({
    notifications: {
      emailOnSession: true,
      emailOnUpdate: true,
      emailOnReview: true,
      smsReminders: false,
      pushNotifications: true,
    },
    privacy: {
      profilePrivacy: 'public',
      showProgress: true,
      allowMessages: true,
    },
    preferences: {
      theme: isDark ? 'dark' : 'light',
      language: language || 'en',
      twoFactorAuth: false,
    },
  });

  const [savedMessage, setSavedMessage] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const sections = [
    { id: 'notifications', label: t('settings.notifications') || 'Notifications', icon: <Bell className="w-5 h-5" /> },
    { id: 'privacy', label: t('settings.privacy') || 'Privacy & Security', icon: <Lock className="w-5 h-5" /> },
    { id: 'preferences', label: t('settings.preferences') || 'Preferences', icon: <Zap className="w-5 h-5" /> },
    { id: 'account', label: t('settings.account') || 'Account', icon: <Eye className="w-5 h-5" /> },
  ];

  const handleSettingChange = (section, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  const handleSave = () => {
    // API call to save settings
    setSavedMessage(t('settings.saveSuccess') || 'Settings saved successfully!');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      alert(t('settings.passwordMismatch') || 'Passwords do not match');
      return;
    }
    // API call to change password
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setSavedMessage(t('settings.passwordChanged') || 'Password changed successfully!');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1
          className={`text-4xl font-bold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}
        >
          {t('settings.title') || 'Settings'}
        </h1>
        <p
          className={`text-sm mt-1 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          {t('settings.subtitle') || 'Manage your account settings and preferences'}
        </p>
      </div>

      {/* Success Message */}
      {savedMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="p-4 rounded-lg bg-green-500/20 border border-green-800 text-green-200 flex items-center gap-2"
        >
          <Check className="w-5 h-5" />
          {savedMessage}
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div
          className={`rounded-lg border ${
            isDark
              ? 'border-gray-700 bg-gray-800'
              : 'border-gray-200 bg-white'
          }`}
        >
          <nav className="flex lg:flex-col p-2 gap-2">
            {sections.map((section) => (
              <motion.button
                key={section.id}
                whileHover={{ x: 4 }}
                onClick={() => setActiveSection(section.id)}
                className={`w-full px-4 py-3 rounded-lg font-semibold transition-all flex items-center gap-3 text-left ${
                  activeSection === section.id
                    ? 'bg-accent text-white'
                    : isDark
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {section.icon}
                {section.label}
              </motion.button>
            ))}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Notifications Section */}
          {activeSection === 'notifications' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`rounded-lg border p-6 ${
                isDark
                  ? 'border-gray-700 bg-gray-800'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <h2
                className={`text-2xl font-bold mb-6 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                {t('settings.notifications') || 'Notification Settings'}
              </h2>

              <div className="space-y-4">
                <SettingToggle
                  label={t('settings.emailSessionReminders') || 'Email session reminders'}
                  checked={settings.notifications.emailOnSession}
                  onChange={(value) =>
                    handleSettingChange('notifications', 'emailOnSession', value)
                  }
                  isDark={isDark}
                />
                <SettingToggle
                  label={t('settings.emailUpdates') || 'Email on gym updates'}
                  checked={settings.notifications.emailOnUpdate}
                  onChange={(value) =>
                    handleSettingChange('notifications', 'emailOnUpdate', value)
                  }
                  isDark={isDark}
                />
                <SettingToggle
                  label={t('settings.emailReviews') || 'Email on trainer reviews'}
                  checked={settings.notifications.emailOnReview}
                  onChange={(value) =>
                    handleSettingChange('notifications', 'emailOnReview', value)
                  }
                  isDark={isDark}
                />
                <SettingToggle
                  label={t('settings.smsReminders') || 'SMS reminders'}
                  checked={settings.notifications.smsReminders}
                  onChange={(value) =>
                    handleSettingChange('notifications', 'smsReminders', value)
                  }
                  isDark={isDark}
                />
                <SettingToggle
                  label={t('settings.pushNotifications') || 'Push notifications'}
                  checked={settings.notifications.pushNotifications}
                  onChange={(value) =>
                    handleSettingChange('notifications', 'pushNotifications', value)
                  }
                  isDark={isDark}
                />
              </div>
            </motion.div>
          )}

          {/* Privacy & Security Section */}
          {activeSection === 'privacy' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`rounded-lg border p-6 ${
                isDark
                  ? 'border-gray-700 bg-gray-800'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <h2
                className={`text-2xl font-bold mb-6 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                {t('settings.privacyAndSecurity') || 'Privacy & Security'}
              </h2>

              <div className="space-y-6">
                {/* Profile Privacy */}
                <div>
                  <label
                    className={`block text-sm font-semibold mb-3 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    {t('settings.profileVisibility') || 'Profile Visibility'}
                  </label>
                  <select
                    value={settings.privacy.profilePrivacy}
                    onChange={(e) =>
                      handleSettingChange('privacy', 'profilePrivacy', e.target.value)
                    }
                    className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-accent ${
                      isDark
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300'
                    }`}
                  >
                    <option value="public">{t('settings.public') || 'Public'}</option>
                    <option value="friends">
                      {t('settings.friendsOnly') || 'Friends Only'}
                    </option>
                    <option value="private">{t('settings.private') || 'Private'}</option>
                  </select>
                </div>

                {/* Progress Photos */}
                <SettingToggle
                  label={t('settings.showProgress') || 'Allow others to see my progress photos'}
                  checked={settings.privacy.showProgress}
                  onChange={(value) =>
                    handleSettingChange('privacy', 'showProgress', value)
                  }
                  isDark={isDark}
                />

                {/* Messages */}
                <SettingToggle
                  label={t('settings.allowMessages') || 'Allow trainers to send me messages'}
                  checked={settings.privacy.allowMessages}
                  onChange={(value) =>
                    handleSettingChange('privacy', 'allowMessages', value)
                  }
                  isDark={isDark}
                />

                {/* Two-Factor Authentication */}
                <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3
                        className={`font-semibold ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        {t('settings.twoFactorAuth') || 'Two-Factor Authentication'}
                      </h3>
                      <p
                        className={`text-sm mt-1 ${
                          isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}
                      >
                        {t('settings.twoFactorDescription') ||
                          'Add an extra layer of security to your account'}
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 rounded-lg bg-accent text-white hover:bg-accent/90 font-semibold text-sm"
                    >
                      {t('settings.enable') || 'Enable'}
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Preferences Section */}
          {activeSection === 'preferences' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`rounded-lg border p-6 ${
                isDark
                  ? 'border-gray-700 bg-gray-800'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <h2
                className={`text-2xl font-bold mb-6 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                {t('settings.preferences') || 'Preferences'}
              </h2>

              <div className="space-y-6">
                {/* Theme */}
                <div>
                  <label
                    className={`block text-sm font-semibold mb-3 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    {t('settings.theme') || 'Theme'}
                  </label>
                  <div className="flex gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        handleSettingChange('preferences', 'theme', 'light');
                        if (isDark) toggleTheme();
                      }}
                      className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                        settings.preferences.theme === 'light'
                          ? 'bg-accent text-white'
                          : isDark
                          ? 'bg-gray-700 text-gray-300'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      ☀️ {t('settings.light') || 'Light'}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        handleSettingChange('preferences', 'theme', 'dark');
                        if (!isDark) toggleTheme();
                      }}
                      className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                        settings.preferences.theme === 'dark'
                          ? 'bg-accent text-white'
                          : isDark
                          ? 'bg-gray-700 text-gray-300'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      🌙 {t('settings.dark') || 'Dark'}
                    </motion.button>
                  </div>
                </div>

                {/* Language */}
                <div>
                  <label
                    className={`block text-sm font-semibold mb-3 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    {t('settings.language') || 'Language'}
                  </label>
                  <select
                    value={settings.preferences.language}
                    onChange={(e) => {
                      handleSettingChange('preferences', 'language', e.target.value);
                      setLanguage(e.target.value);
                    }}
                    className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-accent ${
                      isDark
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300'
                    }`}
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {/* Account Section */}
          {activeSection === 'account' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Change Password */}
              <motion.div
                className={`rounded-lg border p-6 ${
                  isDark
                    ? 'border-gray-700 bg-gray-800'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <h3
                  className={`text-xl font-bold mb-4 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {t('settings.changePassword') || 'Change Password'}
                </h3>

                <div className="space-y-4">
                  <div>
                    <label
                      className={`text-sm font-semibold block mb-2 ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      {t('settings.currentPassword') || 'Current Password'}
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-accent ${
                        isDark
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300'
                      }`}
                    />
                  </div>
                  <div>
                    <label
                      className={`text-sm font-semibold block mb-2 ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      {t('settings.newPassword') || 'New Password'}
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-accent ${
                        isDark
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300'
                      }`}
                    />
                  </div>
                  <div>
                    <label
                      className={`text-sm font-semibold block mb-2 ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      {t('settings.confirmPassword') || 'Confirm Password'}
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-accent ${
                        isDark
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300'
                      }`}
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleChangePassword}
                    className="w-full px-4 py-3 rounded-lg bg-accent text-white hover:bg-accent/90 font-semibold transition-all"
                  >
                    {t('settings.updatePassword') || 'Update Password'}
                  </motion.button>
                </div>
              </motion.div>

              {/* Data & Privacy */}
              <motion.div
                className={`rounded-lg border p-6 ${
                  isDark
                    ? 'border-gray-700 bg-gray-800'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <h3
                  className={`text-xl font-bold mb-4 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {t('settings.dataPrivacy') || 'Data & Privacy'}
                </h3>

                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-semibold transition-all ${
                      isDark
                        ? 'bg-gray-700/50 text-white hover:bg-gray-700'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Download className="w-5 h-5" />
                      {t('settings.downloadData') || 'Download My Data'}
                    </span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-semibold transition-all ${
                      isDark
                        ? 'bg-red-900/20 text-red-300 hover:bg-red-900/40'
                        : 'bg-red-50 text-red-600 hover:bg-red-100'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Trash2 className="w-5 h-5" />
                      {t('settings.deleteAccount') || 'Delete Account'}
                    </span>
                  </motion.button>
                </div>
              </motion.div>

              {/* Logout */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all ${
                  isDark
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                }`}
              >
                <LogOut className="w-5 h-5" />
                {t('settings.logout') || 'Logout'}
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Save Button */}
      {activeSection !== 'account' && (
        <div className="flex justify-end gap-3 pt-6 border-t border-gray-700 dark:border-gray-600">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            className="px-6 py-3 rounded-lg bg-accent text-white hover:bg-accent/90 font-semibold transition-all flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            {t('settings.saveChanges') || 'Save Changes'}
          </motion.button>
        </div>
      )}
    </div>
  );
};

/**
 * SettingToggle - Reusable toggle switch component
 */
const SettingToggle = ({ label, checked, onChange, isDark }) => {
  return (
    <div className="flex items-center justify-between">
      <label className={`font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
        {label}
      </label>
      <motion.button
        initial={false}
        animate={{ backgroundColor: checked ? '#FF6B35' : isDark ? '#4B5563' : '#D1D5DB' }}
        onClick={() => onChange(!checked)}
        className="relative w-14 h-8 rounded-full transition-all"
      >
        <motion.div
          initial={false}
          animate={{ x: checked ? 28 : 2 }}
          className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full"
        />
      </motion.button>
    </div>
  );
};

export default SettingsPage;
