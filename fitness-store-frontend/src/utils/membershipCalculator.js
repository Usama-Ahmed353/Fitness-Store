/**
 * Billing & Membership Management Utilities
 * Plan comparison, billing calculations, payment processing
 */

/**
 * Membership plans
 */
export const MEMBERSHIP_PLANS = {
  BASIC: 'basic',
  PREMIUM: 'premium',
  ELITE: 'elite'
};

export const PLAN_DETAILS = {
  basic: {
    id: 'basic',
    name: 'Basic',
    displayName: 'Basic Membership',
    description: 'Get started with fitness',
    price: 29.99,
    billingCycle: 'monthly',
    features: [
      'Gym access',
      'Open hours only',
      'Equipment access',
      'Locker rooms',
      '1 guest pass per month',
      'Mobile app access'
    ],
    limitations: [
      'No trainer access',
      'No group classes',
      'No premium amenities'
    ],
    color: 'bg-blue-500/20 text-blue-400',
    icon: 'Dumbbell'
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    displayName: 'Premium Membership',
    description: 'Full gym experience with classes',
    price: 59.99,
    billingCycle: 'monthly',
    features: [
      'Unlimited gym access',
      'Extended hours (24/7)',
      'All equipment access',
      'Group classes included',
      'Sauna & steam room',
      ' 5 guest passes per month',
      'Mobile app access',
      'Fitness assessments (quarterly)'
    ],
    limitations: [
      'Limited trainer consultations'
    ],
    color: 'bg-purple-500/20 text-purple-400',
    icon: 'Star',
    badge: 'Most Popular'
  },
  elite: {
    id: 'elite',
    name: 'Elite',
    displayName: 'Elite Membership',
    description: 'Premium experience with personal training',
    price: 129.99,
    billingCycle: 'monthly',
    features: [
      'Unlimited gym access',
      '24/7 access',
      'All facilities',
      'Unlimited group classes',
      'Premium amenities',
      'Unlimited guest passes',
      'Mobile app access',
      'Monthly fitness assessments',
      'Unlimited trainer consultations',
      '2 personal training sessions per month',
      'Nutrition coaching',
      'Priority member support',
      'VIP lounge access'
    ],
    limitations: [],
    color: 'bg-yellow-500/20 text-yellow-400',
    icon: 'Crown',
    badge: 'Premium'
  }
};

/**
 * Get plan by ID
 */
export const getPlanDetails = (planId) => {
  return PLAN_DETAILS[planId] || null;
};

/**
 * Get all plans for comparison
 */
export const getAllPlans = () => {
  return Object.values(PLAN_DETAILS);
};

/**
 * Calculate membership cost
 */
export const calculateMembershipCost = (planId, billingCycle = 'monthly', numberOfMonths = 1) => {
  const plan = getPlanDetails(planId);
  if (!plan) return null;

  const monthlyPrice = plan.price;
  const totalPrice = monthlyPrice * numberOfMonths;

  // Annual discount (25% off if paying annually)
  let finalPrice = totalPrice;
  let discount = 0;

  if (billingCycle === 'annual') {
    discount = totalPrice * 0.25;
    finalPrice = totalPrice - discount;
  }

  return {
    monthlyPrice,
    numberOfMonths,
    subtotal: totalPrice,
    discount,
    finalPrice,
    savingsPercentage: discount > 0 ? ((discount / totalPrice) * 100).toFixed(1) : 0
  };
};

/**
 * Calculate membership freeze cost
 */
export const calculateFreezeMonthCost = (baseMonthlyPrice, freezeMonths = 1) => {
  // Typically 10-15% of monthly price per freeze month
  const costPerMonth = baseMonthlyPrice * 0.10;
  return costPerMonth * freezeMonths;
};

/**
 * Billing history entry validation
 */
export const formatBillingDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Billing status colors
 */
export const getBillingStatusColor = (status) => {
  const colors = {
    completed: 'bg-green-500/20 text-green-400',
    pending: 'bg-yellow-500/20 text-yellow-400',
    failed: 'bg-red-500/20 text-red-400',
    refunded: 'bg-blue-500/20 text-blue-400'
  };
  return colors[status] || 'bg-gray-500/20 text-gray-400';
};

/**
 * Billing status label
 */
export const getBillingStatusLabel = (status) => {
  const labels = {
    completed: 'Completed',
    pending: 'Pending',
    failed: 'Failed',
    refunded: 'Refunded'
  };
  return labels[status] || status;
};

/**
 * Next billing date calculation
 */
export const calculateNextBillingDate = (lastBillingDate, billingCycle = 'monthly') => {
  const date = new Date(lastBillingDate);

  if (billingCycle === 'monthly') {
    date.setMonth(date.getMonth() + 1);
  } else if (billingCycle === 'annual') {
    date.setFullYear(date.getFullYear() + 1);
  }

  return date;
};

/**
 * Days until next billing
 */
export const daysUntilNextBilling = (nextBillingDate) => {
  const now = new Date();
  const next = new Date(nextBillingDate);
  const diffTime = next - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};

/**
 * Membership freeze options
 */
export const FREEZE_DURATIONS = [
  { value: 1, label: '1 Month' },
  { value: 2, label: '2 Months' },
  { value: 3, label: '3 Months' }
];

/**
 * Calculate freeze end date
 */
export const calculateFreezeEndDate = (startDate, freezeMonths) => {
  const date = new Date(startDate);
  date.setMonth(date.getMonth() + freezeMonths);
  return date;
};

/**
 * Cancellation reasons
 */
export const CANCELLATION_REASONS = [
  { id: 'cost', label: 'Too expensive', icon: '💰' },
  { id: 'time', label: 'Not enough time to use', icon: '⏱️' },
  { id: 'relocation', label: 'Moving/Relocating', icon: '📍' },
  { id: 'health', label: 'Health/Injury reasons', icon: '⚕️' },
  { id: 'facilities', label: 'Poor facilities', icon: '🏢' },
  { id: 'service', label: 'Poor customer service', icon: '😞' },
  { id: 'personal', label: 'Personal reasons', icon: '🤝' },
  { id: 'other', label: 'Other', icon: '❓' }
];

export const getCancellationReasonLabel = (reasonId) => {
  const reason = CANCELLATION_REASONS.find(r => r.id === reasonId);
  return reason ? reason.label : 'Other';
};

/**
 * Retention offers
 */
export const RETENTION_OFFERS = [
  {
    id: 'discount',
    title: '20% Discount',
    description: 'Get 20% off your next 3 months',
    icon: '🎉',
    value: '20%'
  },
  {
    id: 'pause',
    title: 'Pause Membership',
    description: 'Freeze your membership for up to 3 months',
    icon: '⏸️',
    value: 'Free'
  },
  {
    id: 'downgrade',
    title: 'Switch to Basic',
    description: 'Downgrade to Basic plan at $19.99/month',
    icon: '📉',
    value: '-50%'
  },
  {
    id: 'trainer',
    title: 'Free Training Session',
    description: 'Get a free session with our certified trainers',
    icon: '💪',
    value: 'Free'
  }
];

/**
 * Payment method types
 */
export const PAYMENT_METHOD_TYPES = {
  CARD: 'card',
  BANK: 'bank',
  PAYPAL: 'paypal'
};

/**
 * Get payment method display
 */
export const getPaymentMethodDisplay = (method) => {
  const lastDigits = method.lastFourDigits || '****';
  const expiry = method.expiryMonth && method.expiryYear
    ? `${method.expiryMonth}/${method.expiryYear}`
    : 'N/A';

  return {
    display: `${method.brand || 'Card'} ending in ${lastDigits}`,
    expiry,
    isExpired: isPaymentMethodExpired(method),
    expiresIn: getPaymentMethodExpiryDays(method)
  };
};

/**
 * Check if payment method is expired
 */
export const isPaymentMethodExpired = (method) => {
  if (!method.expiryMonth || !method.expiryYear) return false;

  const now = new Date();
  const expiry = new Date(method.expiryYear, method.expiryMonth - 1);

  return now > expiry;
};

/**
 * Get days until payment method expires
 */
export const getPaymentMethodExpiryDays = (method) => {
  if (!method.expiryMonth || !method.expiryYear) return null;

  const now = new Date();
  const expiry = new Date(method.expiryYear, method.expiryMonth, 0);
  const diffTime = expiry - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return Math.max(0, diffDays);
};

/**
 * Invoice/Receipt generation
 */
export const generateInvoiceData = (billingRecord) => {
  return {
    invoiceNumber: billingRecord.invoiceNumber || `INV-${billingRecord.id}`,
    date: formatBillingDate(billingRecord.date),
    dueDate: formatBillingDate(billingRecord.dueDate || billingRecord.date),
    amount: `$${parseFloat(billingRecord.amount).toFixed(2)}`,
    status: getBillingStatusLabel(billingRecord.status),
    plan: billingRecord.planName,
    description: billingRecord.description || 'Monthly membership',
    paymentMethod: billingRecord.paymentMethod || 'Credit Card'
  };
};

/**
 * Billing cycle display
 */
export const getBillingCycleLabel = (cycle) => {
  const labels = {
    monthly: 'Monthly',
    annual: 'Annually'
  };
  return labels[cycle] || cycle;
};

/**
 * Pro-rata billing calculation
 */
export const calculateProRataBilling = (dayUsed, daysInMonth, monthlyPrice) => {
  return (dayUsed / daysInMonth) * monthlyPrice;
};
