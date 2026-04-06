import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Bell,
  Lock,
  Settings,
  DollarSign,
  AlertCircle,
  Save,
  ShieldCheck,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { useLanguage } from '../../../context/LanguageContext';
import ProfileSettings from './ProfileSettings';
import NotificationSettings from './NotificationSettings';
import SecuritySettings from './SecuritySettings';
import PreferencesSettings from './PreferencesSettings';
import BillingSettings from './BillingSettings';

const SettingsPage = () => {
  const navigate = useNavigate();
  const runtimeHost = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  const API = import.meta.env.VITE_API_BASE_URL || `http://${runtimeHost}:5001/api`;
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const { accessToken, user } = useSelector((s) => s.auth);

  const [activeTab, setActiveTab] = useState('profile');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [pendingTab, setPendingTab] = useState(null);

  const [currentUser, setCurrentUser] = useState({
    id: user?.id || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    profilePhoto: user?.profilePhoto || null,
    notificationPreferences: {
      email: {
        classReminders: true,
        promotions: false,
        newsletter: true,
        accountUpdates: true,
        trainerMessages: true,
      },
      sms: {
        classReminders: true,
        paymentReminders: true,
        emergencyAlerts: true,
      },
      inApp: {
        classReminders: true,
        messages: true,
        promotions: false,
        systemAlerts: true,
      },
    },
    privacyLevel: 'friends',
    showProfilePublicly: true,
    allowMessages: true,
    subscribeNewsletter: true,
    subscription: {
      plan: 'premium',
      status: 'active',
    },
  });

  useEffect(() => {
    if (!accessToken) return;

    const headers = { Authorization: `Bearer ${accessToken}` };
    const loadMe = async () => {
      try {
        const { data } = await axios.get(`${API}/auth/me`, { headers });
        const me = data?.user;
        if (!me) return;

        setCurrentUser((prev) => ({
          ...prev,
          id: me._id || me.id,
          firstName: me.firstName || prev.firstName,
          lastName: me.lastName || prev.lastName,
          email: me.email || prev.email,
          phone: me.phone || prev.phone,
          profilePhoto: me.profilePhoto || prev.profilePhoto,
          notificationPreferences: {
            ...prev.notificationPreferences,
            ...(me.notificationSettings || {}),
          },
          privacyLevel: me.privacy?.profileVisibility === 'public'
            ? 'public'
            : me.privacy?.profileVisibility === 'private'
            ? 'private'
            : 'friends',
          allowMessages: typeof me.privacy?.allowMessages === 'boolean'
            ? me.privacy.allowMessages
            : prev.allowMessages,
        }));
      } catch {
        // Keep auth-store fallback values.
      }
    };

    loadMe();
  }, [API, accessToken]);

  const handleUpdate = async (payload = {}) => {
    if (!accessToken) return;
    const headers = { Authorization: `Bearer ${accessToken}` };

    const body = {
      firstName: payload.firstName,
      lastName: payload.lastName,
      phone: payload.phone,
      notificationSettings: payload.notificationPreferences,
      preferences: {
        theme: payload.theme,
        language: payload.language,
      },
      privacy: {
        profileVisibility: payload.privacyLevel === 'friends' ? 'members' : payload.privacyLevel,
        allowMessages: payload.allowMessages,
      },
    };

    const cleaned = Object.fromEntries(
      Object.entries(body).filter(([, value]) => typeof value !== 'undefined')
    );

    try {
      const { data } = await axios.patch(`${API}/auth/me`, cleaned, { headers });
      if (data?.user) {
        const me = data.user;
        setCurrentUser((prev) => ({
          ...prev,
          id: me._id || me.id,
          firstName: me.firstName || prev.firstName,
          lastName: me.lastName || prev.lastName,
          email: me.email || prev.email,
          phone: me.phone || prev.phone,
          profilePhoto: me.profilePhoto || prev.profilePhoto,
          notificationPreferences: {
            ...prev.notificationPreferences,
            ...(me.notificationSettings || {}),
          },
          privacyLevel: me.privacy?.profileVisibility === 'members'
            ? 'friends'
            : me.privacy?.profileVisibility || prev.privacyLevel,
          allowMessages: typeof me.privacy?.allowMessages === 'boolean'
            ? me.privacy.allowMessages
            : prev.allowMessages,
        }));
      }
    } catch {
      // Child components still show local success/error states.
    }
  };

  const tabs = [
    { id: 'profile', label: t('settings.profile') || 'Profile', icon: User },
    { id: 'notifications', label: t('settings.notifications') || 'Notifications', icon: Bell },
    { id: 'security', label: t('settings.security') || 'Security', icon: Lock },
    { id: 'preferences', label: t('settings.preferences') || 'Preferences', icon: Settings },
    { id: 'billing', label: t('settings.billing') || 'Billing', icon: DollarSign }
  ];

  const handleTabChange = (tabId) => {
    if (hasUnsavedChanges) {
      setPendingTab(tabId);
      setShowUnsavedModal(true);
    } else {
      setActiveTab(tabId);
    }
  };

  const handleDiscardChanges = () => {
    setHasUnsavedChanges(false);
    setShowUnsavedModal(false);
    if (pendingTab) {
      setActiveTab(pendingTab);
      setPendingTab(null);
    }
  };

  const handleKeepEditing = () => {
    setShowUnsavedModal(false);
    setPendingTab(null);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <ProfileSettings
            userId={currentUser.id}
            currentUser={currentUser}
            onUnsavedChanges={setHasUnsavedChanges}
            onUpdate={handleUpdate}
          />
        );
      case 'notifications':
        return (
          <NotificationSettings
            userId={currentUser.id}
            currentUser={currentUser}
            onUnsavedChanges={setHasUnsavedChanges}
            onUpdate={handleUpdate}
          />
        );
      case 'security':
        return (
          <SecuritySettings
            userId={currentUser.id}
            currentUser={currentUser}
            onUnsavedChanges={setHasUnsavedChanges}
            onUpdate={handleUpdate}
          />
        );
      case 'preferences':
        return (
          <PreferencesSettings
            userId={currentUser.id}
            currentUser={currentUser}
            onUnsavedChanges={setHasUnsavedChanges}
            onUpdate={handleUpdate}
          />
        );
      case 'billing':
        return (
          <BillingSettings
            userId={currentUser.id}
            currentUser={currentUser}
            onUnsavedChanges={setHasUnsavedChanges}
            onUpdate={handleUpdate}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Unsaved Changes Modal */}
      <AnimatePresence>
        {showUnsavedModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className={`rounded-lg shadow-xl max-w-md mx-4 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
                    <AlertCircle className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {t('settings.unsavedChanges') || 'Unsaved Changes'}
                    </h3>
                  </div>
                </div>

                <p className={`text-sm mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {t('settings.unsavedChangesDescription') || 'You have unsaved changes. Do you want to discard them?'}
                </p>

                <div className="flex gap-3">
                  <motion.button
                    onClick={handleDiscardChanges}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition-colors"
                  >
                    {t('common.discard') || 'Discard'}
                  </motion.button>
                  <motion.button
                    onClick={handleKeepEditing}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex-1 px-4 py-2 rounded-lg border font-medium transition-colors ${
                      isDark
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {t('common.keepEditing') || 'Keep Editing'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header with Unsaved Changes Badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`sticky top-0 z-40 border-b ${
          isDark ? 'bg-gray-800/95 border-gray-700 backdrop-blur' : 'bg-white/95 border-gray-200 backdrop-blur'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className={`mb-4 inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                  isDark
                    ? 'border-gray-600 bg-gray-800/70 text-gray-200 hover:bg-gray-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {t('settings.settings') || 'Settings'}
              </h1>
              <p className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Manage privacy, profile and notification preferences in one secure place.
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-semibold">
                <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 ${isDark ? 'bg-gray-700 text-gray-200' : 'border border-gray-200 bg-gray-50 text-gray-700'}`}>
                  <ShieldCheck size={12} className="text-emerald-500" /> Secure updates
                </span>
                <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 ${isDark ? 'bg-gray-700 text-gray-200' : 'border border-gray-200 bg-gray-50 text-gray-700'}`}>
                  <Sparkles size={12} className="text-orange-500" /> Live sync enabled
                </span>
              </div>
            </div>

            {hasUnsavedChanges && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/20 border border-orange-500/30"
              >
                <Save size={16} className="text-orange-500" />
                <span className="text-sm font-medium text-orange-500">
                  {t('common.unsavedChanges') || 'Unsaved Changes'}
                </span>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`lg:sticky lg:top-24 h-fit rounded-xl border ${
              isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200 shadow-sm'
            } p-2`}
          >
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    whileHover={{ x: 4 }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? isDark
                          ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30 shadow-sm'
                          : 'bg-orange-50 text-orange-600 border border-orange-200 shadow-sm'
                        : isDark
                        ? 'text-gray-300 hover:bg-gray-700/50'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={20} className="flex-shrink-0" />
                    <span className="text-sm font-medium">{tab.label}</span>
                    {isActive && hasUnsavedChanges && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-auto w-2 h-2 rounded-full bg-orange-500"
                      />
                    )}
                  </motion.button>
                );
              })}
            </nav>
          </motion.div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {renderActiveTab()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
