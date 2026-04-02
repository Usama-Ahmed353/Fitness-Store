import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard,
  AlertTriangle,
  Download,
  Edit,
  LogOut,
  Check,
  X,
  ChevronRight,
  ArrowUpRight,
  Users,
  Dumbbell,
  Calendar,
  DollarSign,
  ExternalLink,
  FileText,
} from 'lucide-react';
import { ThemeContext } from '../../contexts/ThemeContext';

// Subscription plans with features and pricing
const plans = [
  {
    id: 'starter',
    name: 'Starter',
    monthlyPrice: 99,
    annualPrice: 999,
    billingCycle: 'month',
    description: 'Perfect for small gyms',
    features: [
      { name: 'Up to 100 members', limit: 100 },
      { name: 'Up to 5 trainers', limit: 5 },
      { name: 'Basic class scheduling', limit: 25 },
      { name: 'Email support',limite: Infinity },
    ],
  },
  {
    id: 'professional',
    name: 'Professional',
    monthlyPrice: 299,
    annualPrice: 2999,
    billingCycle: 'month',
    popular: true,
    description: 'For growing fitness businesses',
    features: [
      { name: 'Up to 1,000 members', limit: 1000 },
      { name: 'Up to 50 trainers', limit: 50 },
      { name: 'Advanced class scheduling', limit: Infinity },
      { name: 'Priority support', limit: Infinity },
      { name: 'Advanced analytics', limit: Infinity },
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    monthlyPrice: 799,
    annualPrice: 7999,
    billingCycle: 'month',
    description: 'Unlimited scaling for large chains',
    features: [
      { name: 'Unlimited members', limit: Infinity },
      { name: 'Unlimited trainers', limit: Infinity },
      { name: 'Unlimited classes', limit: Infinity },
      { name: '24/7 priority support', limit: Infinity },
      { name: 'Custom integrations', limit: Infinity },
      { name: 'White-label option', limit: Infinity },
    ],
  },
];

// Mock billing data
const mockBillingHistory = [
  {
    id: 'inv-2026-003',
    date: '2026-03-01',
    amount: 299,
    status: 'paid',
    period: 'Mar 1 - Apr 1, 2026',
  },
  {
    id: 'inv-2026-002',
    date: '2026-02-01',
    amount: 299,
    status: 'paid',
    period: 'Feb 1 - Mar 1, 2026',
  },
  {
    id: 'inv-2026-001',
    date: '2026-01-01',
    amount: 299,
    status: 'paid',
    period: 'Jan 1 - Feb 1, 2026',
  },
];

// Cancel reasons
const cancelReasons = [
  'Too expensive',
  'Found a better alternative',
  'No longer need the service',
  'Switching to a different platform',
  'Temporary closure',
  'Other',
];

const SubscriptionPage = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  // Current subscription state
  const [currentPlan, setCurrentPlan] = useState('professional');
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [nextBillingDate] = useState('April 1, 2026');

  // Usage state
  const [usage, setUsage] = useState({
    members: 480,
    memberLimit: 1000,
    trainers: 12,
    trainerLimit: 50,
    classesThisMonth: 28,
  });

  // UI states
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCancelFlow, setShowCancelFlow] = useState(false);
  const [cancelStep, setCancelStep] = useState(1);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelText, setCancelText] = useState('');
  const [cardLast4] = useState('4242');
  const [cardExpiry] = useState('12/25');

  // Selected plan for upgrade
  const [selectedPlan, setSelectedPlan] = useState(null);

  const currentPlanData = plans.find((p) => p.id === currentPlan);
  const currentPrice = billingCycle === 'monthly' ? currentPlanData.monthlyPrice : currentPlanData.annualPrice / 12;

  // Calculate usage percentage
  const memberUsagePercent = (usage.members / usage.memberLimit) * 100;
  const trainerUsagePercent = (usage.trainers / usage.trainerLimit) * 100;

  // Check if at 80% threshold
  const memberUsageAlert = memberUsagePercent >= 80;
  const trainerUsageAlert = trainerUsagePercent >= 80;

  const handleUpgrade = (planId) => {
    setSelectedPlan(planId);
    setShowUpgradeModal(true);
  };

  const handleConfirmUpgrade = () => {
    const upgradingTo = plans.find((p) => p.id === selectedPlan);
    const priceDiff =
      (billingCycle === 'monthly'
        ? upgradingTo.monthlyPrice - currentPrice * 12
        : upgradingTo.annualPrice - (currentPrice * 12)) / 12;

    console.log('Upgrading to:', upgradingTo.name);
    console.log('Price difference:', priceDiff);
    setShowUpgradeModal(false);
    setCurrentPlan(selectedPlan);
  };

  const handleUpdatePaymentMethod = () => {
    setShowPaymentModal(true);
  };

  const handleCancelSubscription = () => {
    setShowCancelFlow(true);
    setCancelStep(1);
  };

  const handleCancelStepNext = () => {
    if (cancelStep === 1 && !cancelReason) {
      alert('Please select a reason');
      return;
    }
    setCancelStep(cancelStep + 1);
  };

  const handleCancelStepBack = () => {
    setCancelStep(cancelStep - 1);
  };

  const handleConfirmCancel = () => {
    console.log('Canceling subscription:', {
      reason: cancelReason,
      details: cancelText,
    });
    // In production: API call to cancel subscription
    setShowCancelFlow(false);
    setCancelStep(1);
    setCancelReason('');
    setCancelText('');
    alert('Subscription cancelled. Your access will remain until April 1, 2026.');
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} py-8 px-4`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Subscription & Billing</h1>
          <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Manage your CrunchFit Pro subscription, billing, and payments
          </p>
        </motion.div>

        {/* Usage Alerts */}
        <AnimatePresence>
          {(memberUsageAlert || trainerUsageAlert) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`mb-6 p-4 rounded-lg border-l-4 ${
                isDark
                  ? 'bg-yellow-900/20 border-yellow-700 text-yellow-300'
                  : 'bg-yellow-50 border-yellow-400 text-yellow-800'
              }`}
            >
              <div className="flex gap-3 items-start">
                <AlertTriangle size={20} className="flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold mb-1">Usage Alert</p>
                  <div className="space-y-1 text-sm">
                    {memberUsageAlert && (
                      <p>
                        You've used {usage.members}/{usage.memberLimit} member slots (
                        {Math.round(memberUsagePercent)}%).
                      </p>
                    )}
                    {trainerUsageAlert && (
                      <p>
                        You've used {usage.trainers}/{usage.trainerLimit} trainer slots (
                        {Math.round(trainerUsagePercent)}%).
                      </p>
                    )}
                    <button
                      onClick={() => handleUpgrade('enterprise')}
                      className="text-yellow-600 dark:text-yellow-300 hover:underline font-semibold mt-2 inline-block"
                    >
                      Upgrade your plan →
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Current Plan */}
          <div className="lg:col-span-2 space-y-8">
            {/* Current Plan Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6`}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className={`text-sm font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Current Plan
                  </p>
                  <h2 className="text-3xl font-bold mt-1">{currentPlanData.name}</h2>
                  <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Billing cycle: {billingCycle === 'monthly' ? 'Monthly' : 'Annual'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-bold text-blue-600">
                    ${currentPrice.toFixed(2)}
                  </p>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>/month</p>
                </div>
              </div>

              {/* Next Billing Date */}
              <div className={`mb-6 p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <Calendar size={16} className="text-blue-600" />
                  <span className="text-sm font-semibold">Next Billing Date</span>
                </div>
                <p className="text-lg font-bold">{nextBillingDate}</p>
              </div>

              {/* Usage Meters */}
              <div className="space-y-4">
                <h3 className="font-semibold mb-4">Usage Overview</h3>

                {/* Members */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-blue-600" />
                      <span className="text-sm font-semibold">Members</span>
                    </div>
                    <span className="text-sm font-bold">
                      {usage.members}/{usage.memberLimit}
                    </span>
                  </div>
                  <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}>
                    <motion.div
                      className={`h-full ${memberUsageAlert ? 'bg-red-500' : 'bg-blue-600'}`}
                      animate={{ width: `${memberUsagePercent}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {Math.round(memberUsagePercent)}% used
                  </p>
                </div>

                {/* Trainers */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Dumbbell size={16} className="text-purple-600" />
                      <span className="text-sm font-semibold">Trainers</span>
                    </div>
                    <span className="text-sm font-bold">
                      {usage.trainers}/{usage.trainerLimit}
                    </span>
                  </div>
                  <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}>
                    <motion.div
                      className={`h-full ${trainerUsageAlert ? 'bg-red-500' : 'bg-purple-600'}`}
                      animate={{ width: `${trainerUsagePercent}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {Math.round(trainerUsagePercent)}% used
                  </p>
                </div>

                {/* Classes */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-green-600" />
                      <span className="text-sm font-semibold">Classes This Month</span>
                    </div>
                    <span className="text-sm font-bold">{usage.classesThisMonth}</span>
                  </div>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Unlimited classes on this plan
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Upgrade/Downgrade Section */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6`}
            >
              <h3 className="text-xl font-bold mb-6">All Plans</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {plans.map((plan) => (
                  <motion.div
                    key={plan.id}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      currentPlan === plan.id
                        ? isDark
                          ? 'border-blue-600 bg-blue-600/10'
                          : 'border-blue-600 bg-blue-50'
                        : isDark
                        ? 'border-gray-700 hover:border-blue-600'
                        : 'border-gray-300 hover:border-blue-600'
                    }`}
                  >
                    {plan.popular && (
                      <div className="text-xs font-bold text-blue-600 mb-2">⭐ POPULAR</div>
                    )}
                    <h4 className="font-bold mb-1">{plan.name}</h4>
                    <p className={`text-xs mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {plan.description}
                    </p>
                    <p className="text-2xl font-bold text-blue-600 mb-1">
                      ${billingCycle === 'monthly' ? plan.monthlyPrice : Math.round(plan.annualPrice / 12)} <span className="text-sm">/mo</span>
                    </p>

                    {currentPlan === plan.id ? (
                      <div className="w-full py-2 rounded font-semibold text-center text-green-600 mb-3">
                        Current Plan
                      </div>
                    ) : (
                      <button
                        onClick={() => handleUpgrade(plan.id)}
                        className="w-full py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition-colors mb-3"
                      >
                        {currentPlan && plans.find((p) => p.id === currentPlan).monthlyPrice < plan.monthlyPrice
                          ? 'Upgrade'
                          : 'Downgrade'}
                      </button>
                    )}

                    <ul className="space-y-2 text-xs">
                      {plan.features.slice(0, 3).map((feature) => (
                        <li key={feature.name} className="flex gap-2">
                          <Check size={14} className="text-green-500 flex-shrink-0 mt-0.5" />
                          <span>{feature.name}</span>
                        </li>
                      ))}
                      {plan.features.length > 3 && (
                        <li className="text-gray-500">+{plan.features.length - 3} more features</li>
                      )}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Billing History */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6`}
            >
              <h3 className="text-xl font-bold mb-6">Billing History</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr
                      className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-300'}`}
                    >
                      <th className="text-left py-3 px-4 font-semibold">Date</th>
                      <th className="text-left py-3 px-4 font-semibold">Invoice</th>
                      <th className="text-left py-3 px-4 font-semibold">Period</th>
                      <th className="text-right py-3 px-4 font-semibold">Amount</th>
                      <th className="text-center py-3 px-4 font-semibold">Status</th>
                      <th className="text-right py-3 px-4 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockBillingHistory.map((invoice) => (
                      <tr key={invoice.id} className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-300'}`}>
                        <td className="py-4 px-4">
                          {new Date(invoice.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </td>
                        <td className="py-4 px-4 font-mono">{invoice.id}</td>
                        <td className="py-4 px-4 text-xs">{invoice.period}</td>
                        <td className="py-4 px-4 text-right font-bold">${invoice.amount.toFixed(2)}</td>
                        <td className="py-4 px-4 text-center">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 justify-end">
                            <Download size={14} />
                            PDF
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Payment & Settings */}
          <div className="space-y-6">
            {/* Payment Method */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6`}
            >
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <CreditCard size={20} />
                Payment Method
              </h3>

              <div className={`p-4 rounded-lg mb-4 ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <p className={`text-xs font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Visa
                </p>
                <p className="text-lg font-bold mt-2">•••• {cardLast4}</p>
                <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Expires {cardExpiry}
                </p>
              </div>

              <button
                onClick={handleUpdatePaymentMethod}
                className="w-full py-2 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-semibold transition-colors"
              >
                <Edit size={16} className="inline mr-2" />
                Update Card
              </button>

              <button className="w-full py-2 mt-3 text-blue-600 hover:underline font-semibold flex items-center justify-center gap-2">
                <ExternalLink size={16} />
                Billing Portal
              </button>
            </motion.div>

            {/* Plan Features */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6`}
            >
              <h3 className="font-bold mb-4">{currentPlanData.name} Features</h3>
              <ul className="space-y-3">
                {currentPlanData.features.map((feature) => (
                  <li key={feature.name} className="flex gap-3">
                    <Check size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature.name}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Danger Zone */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${isDark ? 'bg-red-900/20 border-red-900' : 'bg-red-50 border-red-200'} rounded-lg border p-6`}
            >
              <h3 className="font-bold mb-4 text-red-600">Danger Zone</h3>
              <button
                onClick={handleCancelSubscription}
                className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                <LogOut size={18} />
                Cancel Subscription
              </button>
              <p className={`text-xs mt-3 ${isDark ? 'text-red-400/80' : 'text-red-700/80'}`}>
                You'll retain access until your billing period ends. Data retained for 90 days.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Upgrade Modal */}
        <AnimatePresence>
          {showUpgradeModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowUpgradeModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                onClick={(e) => e.stopPropagation()}
                className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg p-8 max-w-md w-full`}
              >
                <div className="flex items-center gap-2 mb-4">
                  <ArrowUpRight className="text-blue-600" />
                  <h3 className="text-lg font-bold">
                    {currentPlan && plans.find((p) => p.id === currentPlan).monthlyPrice < plans.find((p) => p.id === selectedPlan).monthlyPrice
                      ? 'Upgrade to '
                      : 'Downgrade to '}
                    {plans.find((p) => p.id === selectedPlan).name}
                  </h3>
                </div>

                <p className={`text-sm mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Your plan change will take effect immediately.
                </p>

                {/* Proration Info */}
                <div
                  className={`p-4 rounded-lg mb-6 ${
                    isDark ? 'bg-blue-900/20 border-blue-900' : 'bg-blue-50 border-blue-200'
                  } border`}
                >
                  <p className="text-sm font-semibold mb-2">Billing Impact</p>
                  <p className="text-xs mb-2">
                    Based on your billing cycle, you'll be charged for the remaining 28 days of this billing period.
                  </p>
                  <p className="text-lg font-bold text-blue-600">+$87.25</p>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    at the end of your current billing cycle
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowUpgradeModal(false)}
                    className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
                      isDark
                        ? 'bg-gray-700 hover:bg-gray-600 text-white'
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmUpgrade}
                    className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    Confirm
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Payment Modal */}
        <AnimatePresence>
          {showPaymentModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowPaymentModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                onClick={(e) => e.stopPropagation()}
                className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg p-8 max-w-md w-full`}
              >
                <h3 className="text-lg font-bold mb-6">Update Payment Method</h3>

                {/* Stripe Elements Placeholder */}
                <div
                  className={`p-6 rounded-lg border-2 border-dashed mb-6 ${
                    isDark ? 'border-gray-700 bg-gray-700' : 'border-gray-300 bg-gray-50'
                  }`}
                >
                  <p className="text-center text-sm font-mono text-gray-500">
                    Stripe Elements Card Component
                  </p>
                  <p className="text-center text-xs text-gray-400 mt-2">
                    Production: Full Stripe payment form integration
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
                      isDark
                        ? 'bg-gray-700 hover:bg-gray-600 text-white'
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setShowPaymentModal(false);
                      alert('Payment method updated!');
                    }}
                    className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    Update Card
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cancel Subscription Flow */}
        <AnimatePresence>
          {showCancelFlow && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowCancelFlow(false)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                onClick={(e) => e.stopPropagation()}
                className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg max-w-md w-full overflow-hidden`}
              >
                {/* Step 1: Reason */}
                {cancelStep === 1 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-8">
                    <h3 className="text-lg font-bold mb-2">We'd like to understand why you're leaving</h3>
                    <p className={`text-sm mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Your feedback helps us improve.
                    </p>

                    <div className="space-y-2 mb-6">
                      {cancelReasons.map((reason) => (
                        <label key={reason} className="flex items-center p-3 rounded-lg border cursor-pointer transition-colors"
                          style={{
                            borderColor: cancelReason === reason ? '#2563eb' : 'transparent',
                            backgroundColor: cancelReason === reason ? (isDark ? 'rgba(37, 99, 235, 0.1)' : 'rgba(37, 99, 235, 0.05)') : ''
                          }}
                        >
                          <input
                            type="radio"
                            name="reason"
                            value={reason}
                            checked={cancelReason === reason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            className="w-4 h-4"
                          />
                          <span className="ml-3 text-sm">{reason}</span>
                        </label>
                      ))}
                    </div>

                    {cancelReason === 'Other' && (
                      <textarea
                        value={cancelText}
                        onChange={(e) => setCancelText(e.target.value)}
                        placeholder="Tell us more..."
                        rows="3"
                        className={`w-full px-3 py-2 rounded-lg border mb-6 ${
                          isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300'
                        }`}
                      />
                    )}

                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowCancelFlow(false)}
                        className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
                          isDark
                            ? 'bg-gray-700 hover:bg-gray-600 text-white'
                            : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleCancelStepNext}
                        className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                      >
                        Next
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Retention Offer */}
                {cancelStep === 2 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-8">
                    <h3 className="text-lg font-bold mb-4">Wait, we have an offer for you 🎁</h3>

                    <div className={`p-4 rounded-lg mb-6 ${isDark ? 'bg-green-900/20 border-green-900' : 'bg-green-50 border-green-200'} border`}>
                      <p className="font-bold text-green-700 dark:text-green-300 mb-2">1 Month Free</p>
                      <p className="text-sm text-green-700 dark:text-green-300/80">
                        We'll pause your billing for 1 month if you stay with us. That's ${(currentPrice * 30).toFixed(2)} in savings!
                      </p>
                    </div>

                    <p className={`text-sm mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      We understand if you need flexibility. Your first month on us, no strings attached.
                    </p>

                    <div className="flex gap-3">
                      <button
                        onClick={handleCancelStepBack}
                        className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
                          isDark
                            ? 'bg-gray-700 hover:bg-gray-600 text-white'
                            : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                      >
                        Back
                      </button>
                      <button
                        onClick={() => {
                          console.log('Accepted retention offer');
                          setShowCancelFlow(false);
                          alert('Thank you! Your free month starts now.');
                        }}
                        className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                      >
                        Accept Offer
                      </button>
                      <button
                        onClick={handleCancelStepNext}
                        className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
                          isDark
                            ? 'bg-gray-700 hover:bg-gray-600 text-white'
                            : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                      >
                        Decline
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Final Confirmation */}
                {cancelStep === 3 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-8">
                    <h3 className="text-lg font-bold mb-2">Cancel Subscription?</h3>
                    <p className={`text-sm mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Last confirmation: are you sure you want to cancel?
                    </p>

                    <div className={`p-4 rounded-lg mb-6 ${isDark ? 'bg-yellow-900/20 border-yellow-900' : 'bg-yellow-50 border-yellow-200'} border`}>
                      <p className="text-sm font-semibold mb-2">What happens next:</p>
                      <ul className="space-y-1 text-xs">
                        <li>✓ Your access continues until April 1, 2026</li>
                        <li>✓ No refunds for unused time</li>
                        <li>✓ Your data is retained for 90 days</li>
                        <li>✓ You can reactivate anytime</li>
                      </ul>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={handleCancelStepBack}
                        className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
                          isDark
                            ? 'bg-gray-700 hover:bg-gray-600 text-white'
                            : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                      >
                        Back
                      </button>
                      <button
                        onClick={handleConfirmCancel}
                        className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                      >
                        Cancel Subscription
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SubscriptionPage;
