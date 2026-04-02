import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Lock,
  Eye,
  EyeOff,
  Check,
  X,
  Shield,
  Save,
  AlertCircle,
  CheckCircle,
  LogOut,
  Smartphone
} from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { useLanguage } from '../../../context/LanguageContext';
import { validatePassword } from '../../../utils/settingsCalculator';

const SecuritySettings = ({ userId, currentUser, onUnsavedChanges, onUpdate }) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [passwordErrors, setPasswordErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  const [two2FAEnabled, setTwoFAEnabled] = useState(currentUser?.twoFactorEnabled ?? false);
  const [show2FASetup, setShow2FASetup] = useState(false);

  // Password strength indicator
  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(passwordForm.newPassword);

  const passwordRequirements = [
    { label: 'At least 8 characters', met: passwordForm.newPassword.length >= 8 },
    { label: 'Uppercase and lowercase letters', met: /[a-z]/.test(passwordForm.newPassword) && /[A-Z]/.test(passwordForm.newPassword) },
    { label: 'Numbers', met: /[0-9]/.test(passwordForm.newPassword) },
    { label: 'Special characters', met: /[^a-zA-Z0-9]/.test(passwordForm.newPassword) }
  ];

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validatePasswordForm = () => {
    const errors = {};

    if (!passwordForm.currentPassword.trim()) {
      errors.currentPassword = 'Current password is required';
    }

    if (!passwordForm.newPassword.trim()) {
      errors.newPassword = 'New password is required';
    } else if (passwordForm.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])/.test(passwordForm.newPassword)) {
      errors.newPassword = 'Password must contain uppercase and lowercase letters';
    } else if (!/[0-9]/.test(passwordForm.newPassword)) {
      errors.newPassword = 'Password must contain numbers';
    } else if (!/[^a-zA-Z0-9]/.test(passwordForm.newPassword)) {
      errors.newPassword = 'Password must contain special characters';
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (passwordForm.currentPassword === passwordForm.newPassword) {
      errors.newPassword = 'New password must be different from current password';
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!validatePasswordForm()) return;

    setIsSaving(true);
    setSaveStatus(null);

    // Simulate API call
    setTimeout(() => {
      setSaveStatus({
        type: 'success',
        message: 'Password changed successfully!'
      });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setIsSaving(false);
      onUnsavedChanges(false);
    }, 1500);
  };

  const handle2FAToggle = (e) => {
    e.preventDefault();
    if (!two2FAEnabled) {
      setShow2FASetup(true);
    } else {
      setTwoFAEnabled(false);
      onUnsavedChanges(true);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
          {t('settings.security') || 'Security'}
        </h2>
        <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {t('settings.securityDescription') || 'Manage your account security and privacy'}
        </p>
      </div>

      {/* Change Password */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-6 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-orange-500/20 rounded-lg">
            <Lock size={24} className="text-orange-500" />
          </div>
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {t('settings.changePassword') || 'Change Password'}
          </h3>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          {/* Current Password */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {t('settings.currentPassword') || 'Current Password'}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <input
                type={showPasswords.current ? 'text' : 'password'}
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                className={`w-full px-4 py-2 pr-12 rounded-lg border transition-colors ${
                  passwordErrors.currentPassword
                    ? isDark
                      ? 'border-red-500 bg-red-500/10'
                      : 'border-red-400 bg-red-50'
                    : isDark
                    ? 'bg-gray-700 border-gray-600 focus:border-orange-400'
                    : 'bg-white border-gray-300 focus:border-orange-400'
                } text-${isDark ? 'white' : 'gray-900'} focus:outline-none focus:ring-1 focus:ring-orange-400`}
              />
              <button
                type="button"
                onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'}`}
              >
                {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {passwordErrors.currentPassword && (
              <p className="text-xs text-red-400 mt-1">{passwordErrors.currentPassword}</p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {t('settings.newPassword') || 'New Password'}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <input
                type={showPasswords.new ? 'text' : 'password'}
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                className={`w-full px-4 py-2 pr-12 rounded-lg border transition-colors ${
                  passwordErrors.newPassword
                    ? isDark
                      ? 'border-red-500 bg-red-500/10'
                      : 'border-red-400 bg-red-50'
                    : isDark
                    ? 'bg-gray-700 border-gray-600 focus:border-orange-400'
                    : 'bg-white border-gray-300 focus:border-orange-400'
                } text-${isDark ? 'white' : 'gray-900'} focus:outline-none focus:ring-1 focus:ring-orange-400`}
              />
              <button
                type="button"
                onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'}`}
              >
                {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {passwordErrors.newPassword && (
              <p className="text-xs text-red-400 mt-1">{passwordErrors.newPassword}</p>
            )}

            {/* Password Strength */}
            {passwordForm.newPassword && (
              <div className="mt-3 space-y-2">
                <div className="flex gap-1">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded ${
                        i < passwordStrength
                          ? passwordStrength === 1
                            ? 'bg-red-500'
                            : passwordStrength === 2
                            ? 'bg-yellow-500'
                            : passwordStrength === 3
                            ? 'bg-blue-500'
                            : 'bg-green-500'
                          : isDark ? 'bg-gray-700' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>

                <div className="space-y-1">
                  {passwordRequirements.map((req, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      {req.met ? (
                        <Check size={16} className="text-green-500 flex-shrink-0" />
                      ) : (
                        <X size={16} className="text-gray-400 flex-shrink-0" />
                      )}
                      <span className={`text-xs ${req.met ? 'text-green-500' : isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {req.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {t('settings.confirmPassword') || 'Confirm Password'}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                className={`w-full px-4 py-2 pr-12 rounded-lg border transition-colors ${
                  passwordErrors.confirmPassword
                    ? isDark
                      ? 'border-red-500 bg-red-500/10'
                      : 'border-red-400 bg-red-50'
                    : isDark
                    ? 'bg-gray-700 border-gray-600 focus:border-orange-400'
                    : 'bg-white border-gray-300 focus:border-orange-400'
                } text-${isDark ? 'white' : 'gray-900'} focus:outline-none focus:ring-1 focus:ring-orange-400`}
              />
              <button
                type="button"
                onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'}`}
              >
                {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {passwordErrors.confirmPassword && (
              <p className="text-xs text-red-400 mt-1">{passwordErrors.confirmPassword}</p>
            )}
          </div>

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
                {t('common.updatePassword') || 'Update Password'}
              </>
            )}
          </motion.button>
        </form>
      </motion.div>

      {/* Two-Factor Authentication */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`p-6 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Shield size={24} className="text-blue-500" />
            </div>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {t('settings.twoFactor') || 'Two-Factor Authentication'}
            </h3>
          </div>
          <motion.button
            type="button"
            onClick={handle2FAToggle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              two2FAEnabled ? 'bg-blue-500' : isDark ? 'bg-gray-700' : 'bg-gray-300'
            }`}
            whileHover={{ scale: 1.05 }}
          >
            <motion.span
              className="inline-block h-4 w-4 transform rounded-full bg-white"
              animate={{ x: two2FAEnabled ? 20 : 2 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </motion.button>
        </div>

        {two2FAEnabled ? (
          <div className="space-y-4">
            <div className={`p-4 rounded-lg flex gap-3 ${
              isDark ? 'bg-green-500/10 border border-green-500/20' : 'bg-green-50 border border-green-200'
            }`}>
              <CheckCircle size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className={`font-medium ${isDark ? 'text-green-300' : 'text-green-800'}`}>
                  {t('settings.twoFactorEnabled') || 'Two-factor authentication is enabled'}
                </p>
                <p className={`text-sm mt-1 ${isDark ? 'text-green-300/70' : 'text-green-700/70'}`}>
                  {t('settings.twoFactorDescription') || 'Your account is protected with an additional authentication layer'}
                </p>
              </div>
            </div>

            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-2 px-4 rounded-lg border border-red-500 text-red-500 hover:bg-red-500/10 font-medium transition-colors"
            >
              {t('settings.disable2FA') || 'Disable Two-Factor'}
            </motion.button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {t('settings.enableTwoFactorDescription') || 'Add an extra layer of security to your account by enabling two-factor authentication'}
            </p>

            {show2FASetup ? (
              <div className={`p-4 rounded-lg border ${isDark ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50 border-blue-200'}`}>
                <p className={`font-medium mb-3 ${isDark ? 'text-blue-300' : 'text-blue-800'}`}>
                  {t('settings.setupAuthenticator') || 'Setup Authenticator App'}
                </p>
                <ol className={`text-sm space-y-2 ${isDark ? 'text-blue-200/80' : 'text-blue-700'}`}>
                  <li>1. Download an authenticator app (Google Authenticator, Authy, Microsoft Authenticator)</li>
                  <li>2. Scan the QR code below or enter the setup key</li>
                  <li>3. Enter the 6-digit code from your authenticator app</li>
                </ol>

                <div className="mt-4 space-y-4">
                  <div className={`p-4 rounded-lg bg-white flex items-center justify-center ${isDark ? 'bg-gray-700' : ''}`}>
                    {/* QR Code placeholder */}
                    <div className="w-40 h-40 bg-gray-300 rounded flex items-center justify-center text-gray-600">
                      QR Code
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {t('settings.verificationCode') || 'Verification Code'}
                    </label>
                    <input
                      type="text"
                      placeholder="000000"
                      className={`w-full px-4 py-2 rounded-lg border text-center tracking-widest ${
                        isDark
                          ? 'bg-gray-700 border-gray-600 focus:border-blue-400 text-white'
                          : 'bg-white border-gray-300 focus:border-blue-400 text-gray-900'
                      } focus:outline-none focus:ring-1 focus:ring-blue-400`}
                      maxLength="6"
                    />
                  </div>

                  <div className="flex gap-3">
                    <motion.button
                      type="button"
                      onClick={() => setShow2FASetup(false)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
                        isDark
                          ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {t('common.cancel') || 'Cancel'}
                    </motion.button>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 py-2 px-4 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors"
                    >
                      {t('common.verify') || 'Verify'}
                    </motion.button>
                  </div>
                </div>
              </div>
            ) : (
              <motion.button
                type="button"
                onClick={() => setShow2FASetup(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-2 px-4 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors"
              >
                {t('settings.enableNow') || 'Enable Now'}
              </motion.button>
            )}
          </div>
        )}
      </motion.div>

      {/* Login Activity */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`p-6 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
      >
        <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {t('settings.activeDevices') || 'Active Devices'}
        </h3>

        <div className="space-y-3">
          {[
            { device: 'Chrome on Windows', lastActive: 'Just now', isCurrent: true },
            { device: 'Safari on iPhone', lastActive: '2 hours ago', isCurrent: false },
            { device: 'Chrome on Android', lastActive: '1 day ago', isCurrent: false }
          ].map((item, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-lg flex items-center justify-between ${
                isDark ? 'bg-gray-700/50 border border-gray-600' : 'bg-gray-50 border border-gray-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <Smartphone size={20} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
                <div>
                  <p className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
                    {item.device}
                  </p>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {item.lastActive}
                    {item.isCurrent && <span className="ml-2 text-orange-500 font-medium">(Current)</span>}
                  </p>
                </div>
              </div>
              {!item.isCurrent && (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-2 rounded-lg transition-colors ${
                    isDark ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-gray-200 text-gray-600'
                  }`}
                >
                  <LogOut size={18} />
                </motion.button>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default SecuritySettings;
