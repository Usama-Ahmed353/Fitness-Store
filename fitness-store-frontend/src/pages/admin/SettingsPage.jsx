import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  DollarSign,
  CreditCard,
  Mail,
  ToggleRight,
  ToggleLeft,
  ChevronDown,
  Plus,
  Edit,
  Trash2,
  Eye,
  Save,
  X,
  Copy,
  Check,
  AlertCircle,
  Variable,
} from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';
import { LanguageContext } from '../../context/LanguageContext';
import AdminLayout from '../../layouts/AdminLayout';

// Mock pricing data
const mockPricingPlans = [
  {
    id: 'starter',
    name: 'Starter',
    monthlyPrice: 29.99,
    annualPrice: 299.99,
    monthlyStripeId: 'price_starter_monthly',
    annualStripeId: 'price_starter_annual',
    features: ['5 classes/month', 'Basic support', 'Mobile app'],
  },
  {
    id: 'professional',
    name: 'Professional',
    monthlyPrice: 79.99,
    annualPrice: 799.99,
    monthlyStripeId: 'price_prof_monthly',
    annualStripeId: 'price_prof_annual',
    features: ['Unlimited classes', 'Priority support', 'Personal trainer session'],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    monthlyPrice: 149.99,
    annualPrice: 1499.99,
    monthlyStripeId: 'price_ent_monthly',
    annualStripeId: 'price_ent_annual',
    features: ['Unlimited everything', '24/7 support', 'Custom training plan'],
  },
];

// Mock email templates
const mockEmailTemplates = [
  {
    id: 'welcome',
    name: 'Welcome Email',
    subject: 'Welcome to CrunchFit Pro!',
    content: '<h1>Welcome {{member_name}}!</h1><p>Thank you for joining CrunchFit Pro...</p>',
    variables: ['member_name', 'gym_name', 'start_date', 'promo_code'],
  },
  {
    id: 'trial-ending',
    name: 'Trial Ending Reminder',
    subject: 'Your trial expires in 3 days',
    content: '<h1>{{member_name}}, your trial is ending!</h1><p>Convert to paid plan now...</p>',
    variables: ['member_name', 'days_left', 'plan_name', 'discount_percent'],
  },
  {
    id: 'class-reminder',
    name: 'Class Reminder',
    subject: 'Class starting in 1 hour - {{class_name}}',
    content: '<p>Hi {{member_name}}, reminder: {{class_name}} starts at {{class_time}}</p>',
    variables: ['member_name', 'class_name', 'class_time', 'gym_address'],
  },
];

// Mock feature flags
const mockFeatureFlags = [
  { id: 'social-login', name: 'Social Login (Google/Apple)', enabled: true },
  { id: 'referral-program', name: 'Referral Rewards Program', enabled: false },
  { id: 'gym-transfer', name: 'Gym Transfer Feature', enabled: true },
  { id: 'video-classes', name: 'Video On-Demand Classes', enabled: false },
  { id: 'ai-recommendations', name: 'AI Class Recommendations', enabled: false },
  { id: 'group-training', name: 'Group Training Sessions', enabled: true },
];

// Mock general settings
const mockGeneralSettings = {
  platformName: 'CrunchFit Pro',
  supportEmail: 'support@crunchfit.com',
  notificationEmail: 'notifications@crunchfit.com',
  platformCommissionRate: 10,
  maintenanceMode: false,
};

const SettingsPage = () => {
  const { theme } = useContext(ThemeContext);
  const { language } = useContext(LanguageContext);
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState('general');
  const [generalSettings, setGeneralSettings] = useState(mockGeneralSettings);
  const [pricingPlans, setPricingPlans] = useState(mockPricingPlans);
  const [emailTemplates, setEmailTemplates] = useState(mockEmailTemplates);
  const [featureFlags, setFeatureFlags] = useState(mockFeatureFlags);

  // Modal states
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const [editingPlan, setEditingPlan] = useState(null);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [previewContent, setPreviewContent] = useState('');

  // Form states
  const [pricingForm, setPricingForm] = useState({
    monthlyPrice: '',
    annualPrice: '',
  });

  const [emailForm, setEmailForm] = useState({
    subject: '',
    content: '',
  });

  const [stripeKey, setStripeKey] = useState('sk_test_51234567890abcdefghijk');
  const [stripeKeyVisible, setStripeKeyVisible] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  // Handlers
  const handleEditPlan = (plan) => {
    setEditingPlan(plan);
    setPricingForm({
      monthlyPrice: plan.monthlyPrice,
      annualPrice: plan.annualPrice,
    });
    setShowPricingModal(true);
  };

  const handleSavePlan = () => {
    setPricingPlans(
      pricingPlans.map((p) =>
        p.id === editingPlan.id
          ? {
              ...p,
              monthlyPrice: parseFloat(pricingForm.monthlyPrice),
              annualPrice: parseFloat(pricingForm.annualPrice),
            }
          : p
      )
    );
    setShowPricingModal(false);
    setEditingPlan(null);
  };

  const handleEditTemplate = (template) => {
    setEditingTemplate(template);
    setEmailForm({
      subject: template.subject,
      content: template.content,
    });
    setShowEmailModal(true);
  };

  const handleSaveTemplate = () => {
    setEmailTemplates(
      emailTemplates.map((t) =>
        t.id === editingTemplate.id
          ? {
              ...t,
              subject: emailForm.subject,
              content: emailForm.content,
            }
          : t
      )
    );
    setShowEmailModal(false);
    setEditingTemplate(null);
  };

  const handleToggleFeature = (id) => {
    setFeatureFlags(
      featureFlags.map((f) =>
        f.id === id ? { ...f, enabled: !f.enabled } : f
      )
    );
  };

  const handlePreviewTemplate = (template) => {
    setPreviewContent(template.content);
    setShowPreviewModal(true);
  };

  const handleCopyStripeKey = () => {
    navigator.clipboard.writeText(stripeKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <AdminLayout>
      <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b sticky top-0 z-40`}
        >
          <div className="px-6 py-4">
            <div className="flex items-center gap-3 mb-4">
              <Settings size={28} className="text-blue-500" />
              <h1 className="text-2xl font-bold">Platform Settings</h1>
            </div>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Manage platform configuration, pricing, email templates, and feature flags
            </p>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className={`px-6 border-b ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} sticky top-16 z-30`}>
          <div className="flex gap-2 overflow-x-auto">
            {[
              { id: 'general', label: 'General', icon: Settings },
              { id: 'pricing', label: 'Membership Pricing', icon: DollarSign },
              { id: 'stripe', label: 'Stripe Config', icon: CreditCard },
              { id: 'email', label: 'Email Templates', icon: Mail },
              { id: 'features', label: 'Feature Flags', icon: ToggleRight },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 font-medium rounded-t-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? `${isDark ? 'bg-gray-700 border-b-2 border-blue-500' : 'bg-gray-50 border-b-2 border-blue-500'}`
                      : isDark
                      ? 'hover:bg-gray-700'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {/* General Tab */}
            {activeTab === 'general' && (
              <motion.div
                key="general"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-2xl"
              >
                <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6 space-y-6`}>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Platform Name</label>
                    <input
                      type="text"
                      value={generalSettings.platformName}
                      onChange={(e) =>
                        setGeneralSettings({ ...generalSettings, platformName: e.target.value })
                      }
                      className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Support Email</label>
                    <input
                      type="email"
                      value={generalSettings.supportEmail}
                      onChange={(e) =>
                        setGeneralSettings({ ...generalSettings, supportEmail: e.target.value })
                      }
                      className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Notification Email</label>
                    <input
                      type="email"
                      value={generalSettings.notificationEmail}
                      onChange={(e) =>
                        setGeneralSettings({ ...generalSettings, notificationEmail: e.target.value })
                      }
                      className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Platform Commission Rate (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={generalSettings.platformCommissionRate}
                      onChange={(e) =>
                        setGeneralSettings({
                          ...generalSettings,
                          platformCommissionRate: parseFloat(e.target.value),
                        })
                      }
                      className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-900">
                    <div>
                      <p className="font-semibold text-orange-900 dark:text-orange-100">Maintenance Mode</p>
                      <p className={`text-sm ${isDark ? 'text-orange-300' : 'text-orange-700'}`}>
                        Disable platform access for maintenance
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setGeneralSettings({
                          ...generalSettings,
                          maintenanceMode: !generalSettings.maintenanceMode,
                        })
                      }
                      className="p-2 rounded-lg transition-colors"
                    >
                      {generalSettings.maintenanceMode ? (
                        <ToggleRight size={28} className="text-orange-500" />
                      ) : (
                        <ToggleLeft size={28} className="text-gray-400" />
                      )}
                    </button>
                  </div>

                  <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors">
                    <Save size={18} className="inline mr-2" />
                    Save Changes
                  </button>
                </div>
              </motion.div>
            )}

            {/* Pricing Tab */}
            {activeTab === 'pricing' && (
              <motion.div
                key="pricing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="space-y-4">
                  {pricingPlans.map((plan) => (
                    <motion.div
                      key={plan.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold">{plan.name}</h3>
                          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {plan.features.join(' • ')}
                          </p>
                        </div>
                        <button
                          onClick={() => handleEditPlan(plan)}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center gap-2"
                        >
                          <Edit size={16} />
                          Edit Pricing
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} p-4 rounded-lg`}>
                          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Monthly Price</p>
                          <p className="text-2xl font-bold">${plan.monthlyPrice.toFixed(2)}</p>
                          <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'} mt-1`}>ID: {plan.monthlyStripeId}</p>
                        </div>
                        <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} p-4 rounded-lg`}>
                          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Annual Price</p>
                          <p className="text-2xl font-bold">${plan.annualPrice.toFixed(2)}</p>
                          <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'} mt-1`}>ID: {plan.annualStripeId}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Stripe Config Tab */}
            {activeTab === 'stripe' && (
              <motion.div
                key="stripe"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-2xl"
              >
                <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6 space-y-6`}>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Stripe Secret Key</label>
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <input
                          type={stripeKeyVisible ? 'text' : 'password'}
                          value={stripeKey}
                          readOnly
                          className={`w-full px-3 py-2 rounded-lg border font-mono text-sm ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}
                        />
                      </div>
                      <button
                        onClick={() => setStripeKeyVisible(!stripeKeyVisible)}
                        className={`px-3 py-2 rounded-lg transition-colors ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={handleCopyStripeKey}
                        className={`px-3 py-2 rounded-lg transition-colors ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                      >
                        {copiedKey ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                      </button>
                    </div>
                    <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Keep this key secure. Never share publicly. Used for payment processing.
                    </p>
                  </div>

                  <div className={`${isDark ? 'bg-blue-900/20 border-blue-900' : 'bg-blue-50 border-blue-200'} border rounded-lg p-4`}>
                    <p className="font-semibold text-sm mb-2 flex items-center gap-2">
                      <AlertCircle size={16} />
                      Connection Status
                    </p>
                    <p className="text-sm flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Connected and verified
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Webhook Settings</h4>
                    <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} p-4 rounded-lg font-mono text-sm space-y-2`}>
                      <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                        Webhook URL: https://api.crunchfit.com/webhooks/stripe
                      </p>
                      <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                        Events: payment_intent.succeeded, customer.subscription.updated
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Email Templates Tab */}
            {activeTab === 'email' && (
              <motion.div
                key="email"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="space-y-4">
                  {emailTemplates.map((template) => (
                    <motion.div
                      key={template.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold">{template.name}</h3>
                          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {template.subject}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handlePreviewTemplate(template)}
                            className="px-3 py-2 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors flex items-center gap-2"
                          >
                            <Eye size={16} />
                            Preview
                          </button>
                          <button
                            onClick={() => handleEditTemplate(template)}
                            className="px-3 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center gap-2"
                          >
                            <Edit size={16} />
                            Edit
                          </button>
                        </div>
                      </div>

                      <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} p-3 rounded-lg mb-3`}>
                        <p className="text-xs font-semibold mb-2 flex items-center gap-1">
                          <Variable size={14} />
                          Available Variables
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {template.variables.map((v) => (
                            <code
                              key={v}
                              className={`px-2 py-1 text-xs rounded font-mono ${isDark ? 'bg-gray-600 text-blue-300' : 'bg-white text-blue-600'}`}
                            >
                              {`{{${v}}}`}
                            </code>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Feature Flags Tab */}
            {activeTab === 'features' && (
              <motion.div
                key="features"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-2xl"
              >
                <div className="space-y-3">
                  {featureFlags.map((flag) => (
                    <motion.div
                      key={flag.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-4 flex items-center justify-between hover:shadow-md transition-shadow`}
                    >
                      <p className="font-medium">{flag.name}</p>
                      <button
                        onClick={() => handleToggleFeature(flag.id)}
                        className="transition-transform"
                      >
                        {flag.enabled ? (
                          <ToggleRight size={28} className="text-green-500" />
                        ) : (
                          <ToggleLeft size={28} className="text-gray-400" />
                        )}
                      </button>
                    </motion.div>
                  ))}
                </div>

                <button className="w-full mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors">
                  <Save size={18} className="inline mr-2" />
                  Save Feature Flags
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Edit Pricing Modal */}
      <AnimatePresence>
        {showPricingModal && editingPlan && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg max-w-md w-full p-6`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Edit {editingPlan.name} Pricing</h3>
                <button
                  onClick={() => setShowPricingModal(false)}
                  className={`p-1 rounded ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Monthly Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={pricingForm.monthlyPrice}
                    onChange={(e) =>
                      setPricingForm({ ...pricingForm, monthlyPrice: e.target.value })
                    }
                    className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Annual Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={pricingForm.annualPrice}
                    onChange={(e) =>
                      setPricingForm({ ...pricingForm, annualPrice: e.target.value })
                    }
                    className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                  />
                </div>

                <div className={`${isDark ? 'bg-blue-900/20 border-blue-900' : 'bg-blue-50 border-blue-200'} border rounded-lg p-3`}>
                  <p className="text-xs font-semibold mb-2">Annual Savings</p>
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    ${(
                      parseFloat(pricingForm.monthlyPrice) * 12 - parseFloat(pricingForm.annualPrice)
                    ).toFixed(2)}
                    /year
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowPricingModal(false)}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePlan}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Save size={16} />
                  Save & Publish to Stripe
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Email Template Preview Modal */}
      <AnimatePresence>
        {showPreviewModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg max-w-2xl w-full p-6 my-8`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Email Preview</h3>
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className={`p-1 rounded ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                >
                  <X size={20} />
                </button>
              </div>

              <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} p-6 rounded-lg min-h-96 mb-6`}>
                <div className="space-y-4">
                  {editingTemplate && (
                    <>
                      <div>
                        <p className={`text-xs font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                          Subject Line
                        </p>
                        <p className="font-bold">{emailForm.subject}</p>
                      </div>
                      <div className="border-t border-gray-600 pt-4" dangerouslySetInnerHTML={{ __html: emailForm.content }} />
                    </>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  Close
                </button>
                <button className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors">
                  Send Test Email
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default SettingsPage;
