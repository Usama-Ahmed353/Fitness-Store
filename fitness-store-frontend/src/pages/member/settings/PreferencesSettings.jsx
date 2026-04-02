import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Globe,
  Moon,
  Sun,
  Eye,
  Mail,
  Save,
  CheckCircle
} from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { useLanguage } from '../../../context/LanguageContext';

const PreferencesSettings = ({ userId, currentUser, onUnsavedChanges, onUpdate }) => {
  const { isDark, toggleTheme } = useTheme();
  const { t, language, setLanguage } = useLanguage();

  const [preferences, setPreferences] = useState({
    language: language || 'en',
    theme: isDark ? 'dark' : 'light',
    privacyLevel: currentUser?.privacyLevel || 'friends',
    showProfilePublicly: currentUser?.showProfilePublicly ?? true,
    allowMessages: currentUser?.allowMessages ?? true,
    subscribeNewsletter: currentUser?.subscribeNewsletter ?? true
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'it', name: 'Italiano' },
    { code: 'pt', name: 'Português' }
  ];

  const privacyLevels = [
    { value: 'public', label: 'Public', description: 'Anyone can see your profile' },
    { value: 'friends', label: 'Friends Only', description: 'Only your connections can see your profile' },
    { value: 'private', label: 'Private', description: 'Only you can see your profile' }
  ];

  const handleLanguageChange = (lang) => {
    setPreferences(prev => ({ ...prev, language: lang }));
    setLanguage(lang);
    onUnsavedChanges(true);
  };

  const handleThemeChange = () => {
    const newTheme = preferences.theme === 'light' ? 'dark' : 'light';
    setPreferences(prev => ({ ...prev, theme: newTheme }));
    toggleTheme();
    onUnsavedChanges(true);
  };

  const handlePrivacyChange = (value) => {
    setPreferences(prev => ({ ...prev, privacyLevel: value }));
    onUnsavedChanges(true);
  };

  const handleToggle = (key) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
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
        message: 'Preferences saved successfully!'
      });
      setIsSaving(false);
      onUnsavedChanges(false);
      onUpdate?.();
    }, 1500);
  };

  const PreferenceToggle = ({ label, description, value, onChange }) => (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className={`p-4 rounded-lg border flex items-center justify-between ${
        isDark ? 'bg-gray-700/30 border-gray-600/50 hover:bg-gray-700/50' : 'bg-gray-50/50 border-gray-200 hover:bg-gray-100/50'
      } transition-colors`}
    >
      <div className="flex-1">
        <p className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
          {label}
        </p>
        {description && (
          <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {description}
          </p>
        )}
      </div>
      <motion.button
        type="button"
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ml-4 flex-shrink-0 ${
          value ? 'bg-orange-500' : isDark ? 'bg-gray-600' : 'bg-gray-300'
        }`}
        whileHover={{ scale: 1.05 }}
      >
        <motion.span
          className="inline-block h-4 w-4 transform rounded-full bg-white"
          animate={{ x: value ? 20 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </motion.button>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
          {t('settings.preferences') || 'Preferences'}
        </h2>
        <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {t('settings.preferencesDescription') || 'Customize your app experience'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Display Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
        >
          <h3 className={`text-lg font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {t('settings.displayPreferences') || 'Display Preferences'}
          </h3>

          <div className="space-y-4">
            {/* Theme */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className={`p-4 rounded-lg border flex items-center justify-between ${
                isDark ? 'bg-gray-700/30 border-gray-600/50 hover:bg-gray-700/50' : 'bg-gray-50/50 border-gray-200 hover:bg-gray-100/50'
              } transition-colors`}
            >
              <div className="flex items-center gap-3 flex-1">
                {isDark ? <Moon size={20} className="text-blue-400" /> : <Sun size={20} className="text-orange-400" />}
                <div>
                  <p className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
                    {t('settings.darkMode') || 'Dark Mode'}
                  </p>
                  <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {preferences.theme === 'dark'
                      ? t('settings.darkModeEnabled') || 'Currently enabled'
                      : t('settings.darkModeDisabled') || 'Currently disabled'}
                  </p>
                </div>
              </div>
              <motion.button
                type="button"
                onClick={handleThemeChange}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ml-4 flex-shrink-0 ${
                  preferences.theme === 'dark' ? 'bg-blue-500' : isDark ? 'bg-gray-600' : 'bg-gray-300'
                }`}
                whileHover={{ scale: 1.05 }}
              >
                <motion.span
                  className="inline-block h-4 w-4 transform rounded-full bg-white"
                  animate={{ x: preferences.theme === 'dark' ? 20 : 2 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </motion.button>
            </motion.div>

            {/* Language */}
            <div>
              <label className={`block text-sm font-medium mb-3 flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                <Globe size={18} />
                {t('settings.language') || 'Language'}
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {languages.map(lang => (
                  <motion.button
                    key={lang.code}
                    type="button"
                    onClick={() => handleLanguageChange(lang.code)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`py-2 px-4 rounded-lg font-medium transition-all border ${
                      preferences.language === lang.code
                        ? 'bg-orange-500 text-white border-orange-500'
                        : isDark
                        ? 'bg-gray-700 border-gray-600 text-gray-300 hover:border-gray-500'
                        : 'bg-white border-gray-300 text-gray-900 hover:border-gray-400'
                    }`}
                  >
                    {lang.name}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Privacy Settings */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`p-6 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Eye size={24} className="text-blue-500" />
            </div>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {t('settings.privacy') || 'Privacy'}
            </h3>
          </div>

          <div className="space-y-3 mb-6">
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {t('settings.privacyLevel') || 'Profile Visibility'}
            </p>
            <div className="space-y-2">
              {privacyLevels.map(level => (
                <motion.button
                  key={level.value}
                  type="button"
                  onClick={() => handlePrivacyChange(level.value)}
                  whileHover={{ scale: 1.02 }}
                  className={`w-full p-3 rounded-lg border text-left transition-all ${
                    preferences.privacyLevel === level.value
                      ? isDark
                        ? 'bg-blue-500/20 border-blue-500 shadow-lg shadow-blue-500/20'
                        : 'bg-blue-50 border-blue-500 shadow-lg shadow-blue-500/10'
                      : isDark
                      ? 'bg-gray-700/30 border-gray-600 hover:bg-gray-700/50'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <p className={`font-medium ${
                    preferences.privacyLevel === level.value
                      ? 'text-blue-400'
                      : isDark ? 'text-gray-300' : 'text-gray-900'
                  }`}>
                    {level.label}
                  </p>
                  <p className={`text-xs mt-1 ${
                    preferences.privacyLevel === level.value
                      ? 'text-blue-300/70'
                      : isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {level.description}
                  </p>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="space-y-3 border-t pt-6">
            <PreferenceToggle
              label={t('settings.showProfilePublicly') || 'Show Profile on Search'}
              description={t('settings.showProfilePubliclyDesc') || 'Allow other members to find you in search results'}
              value={preferences.showProfilePublicly}
              onChange={() => handleToggle('showProfilePublicly')}
            />
            <PreferenceToggle
              label={t('settings.allowMessages') || 'Allow Direct Messages'}
              description={t('settings.allowMessagesDesc') || 'Let other members send you messages'}
              value={preferences.allowMessages}
              onChange={() => handleToggle('allowMessages')}
            />
          </div>
        </motion.div>

        {/* Newsletter & Promotions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`p-6 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Mail size={24} className="text-purple-500" />
            </div>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {t('settings.communications') || 'Communications'}
            </h3>
          </div>

          <PreferenceToggle
            label={t('settings.subscribeNewsletter') || 'Subscribe to Newsletter'}
            description={t('settings.subscribeNewsletterDesc') || 'Get fitness tips, class updates, and exclusive offers'}
            value={preferences.subscribeNewsletter}
            onChange={() => handleToggle('subscribeNewsletter')}
          />
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

export default PreferencesSettings;
