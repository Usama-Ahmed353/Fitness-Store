import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  ChevronLeft,
  Check,
  AlertCircle,
  Upload,
  Eye,
  EyeOff,
  MapPin,
  Building2,
  User,
  DollarSign,
  LogIn,
} from 'lucide-react';
import { ThemeContext } from '../../contexts/ThemeContext';
import { LanguageContext } from '../../contexts/LanguageContext';

// Countries list (subset)
const countries = [
  'United States',
  'Canada',
  'United Kingdom',
  'Australia',
  'New Zealand',
  'Ireland',
  'Germany',
  'France',
  'Spain',
  'Italy',
  'Netherlands',
  'Belgium',
  'Switzerland',
  'Sweden',
  'Norway',
  'Denmark',
  'Finland',
  'Poland',
  'Portugal',
  'Greece',
  'Japan',
  'South Korea',
  'Singapore',
  'Hong Kong',
  'India',
  'Mexico',
  'Brazil',
  'Argentina',
  'Chile',
  'Colombia',
  'South Africa',
  'UAE',
];

// US States
const usStates = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];

// Gym types
const gymTypes = ['Independent Gym', 'Boutique Studio', 'Fitness Chain', 'CrossFit Box', 'Yoga Studio', 'Other'];

// Amenities
const amenities = [
  'Free Weights',
  'Cardio Equipment',
  'Swimming Pool',
  'Sauna/Steam Room',
  'Personal Training',
  'Group Classes',
  'Juice Bar',
  'Locker Rooms',
  'Childcare',
  'Rehabilitation Services',
];

// Pricing plans
const pricingPlans = [
  {
    id: 'starter',
    name: 'Starter',
    monthlyPrice: 99,
    annualPrice: 999,
    features: ['Up to 100 members', 'Online class booking', '5 trainers', 'Basic analytics'],
  },
  {
    id: 'professional',
    name: 'Professional',
    monthlyPrice: 299,
    annualPrice: 2999,
    popular: true,
    features: ['Up to 1,000 members', 'Unlimited trainers', 'Advanced analytics', 'Email marketing'],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    monthlyPrice: 799,
    annualPrice: 7999,
    features: ['Unlimited members', '24/7 support', 'White-label', 'API access'],
  },
];

const GymApplicationPage = () => {
  const { theme } = useContext(ThemeContext);
  const { language } = useContext(LanguageContext);
  const isDark = theme === 'dark';

  const [step, setStep] = useState(1);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState('professional');
  const [showSuccess, setShowSuccess] = useState(false);

  // Form data
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('gymApplicationData');
    return saved
      ? JSON.parse(saved)
      : {
          // Step 1: Account Setup
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
          isGymOwner: false,

          // Step 2: Gym Information
          gymName: '',
          gymType: '',
          website: '',
          gymPhone: '',
          primaryEmail: '',
          description: '',

          // Step 3: Location
          street: '',
          city: '',
          state: '',
          zip: '',
          country: 'United States',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          multipleLocations: false,
          numberOfLocations: '',

          // Step 4: Gym Details
          memberCount: '<100',
          operatingSince: '',
          logo: null,

          // Step 5: Plan
          planBillingCycle: 'monthly',
        };
  });

  const [errors, setErrors] = useState({});

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('gymApplicationData', JSON.stringify(formData));
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleAmenityToggle = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const validateStep = (stepNum) => {
    const newErrors = {};

    if (stepNum === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name required';
      if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = 'Valid email required';
      if (!formData.phone.match(/^\d{10,}$/)) newErrors.phone = 'Valid phone required (at least 10 digits)';
      if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
      if (!formData.isGymOwner) newErrors.isGymOwner = 'You must confirm you are a gym owner';
    }

    if (stepNum === 2) {
      if (!formData.gymName.trim()) newErrors.gymName = 'Gym name required';
      if (!formData.gymType) newErrors.gymType = 'Gym type required';
      if (!formData.gymPhone.match(/^\d{10,}$/)) newErrors.gymPhone = 'Valid phone required';
      if (!formData.primaryEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.primaryEmail = 'Valid email required';
    }

    if (stepNum === 3) {
      if (!formData.street.trim()) newErrors.street = 'Street address required';
      if (!formData.city.trim()) newErrors.city = 'City required';
      if (formData.country === 'United States' && !formData.state) newErrors.state = 'State required';
      if (!formData.zip.trim()) newErrors.zip = 'ZIP code required';
      if (!formData.country) newErrors.country = 'Country required';
      if (formData.multipleLocations && !formData.numberOfLocations) {
        newErrors.numberOfLocations = 'Please specify number of locations';
      }
    }

    if (stepNum === 4) {
      if (!formData.operatingSince) newErrors.operatingSince = 'Year required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = () => {
    if (validateStep(step)) {
      // Mock submission
      console.log('Submitting:', { formData, selectedPlan, selectedAmenities });
      setShowSuccess(true);
      // Clear saved data
      localStorage.removeItem('gymApplicationData');
      // Redirect after 3 seconds
      setTimeout(() => {
        window.location.href = '/gym-owner-dashboard';
      }, 3000);
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} py-8 px-4`}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="text-2xl font-bold text-blue-600 mb-2">CrunchFit Pro</div>
          <h1 className="text-3xl font-bold mb-2">Get Your Gym Started</h1>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Step {step} of 5 • Free 14-day trial
          </p>
        </motion.div>

        {/* Success Message */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 p-4 bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700 rounded-lg"
            >
              <div className="flex gap-3 items-center">
                <Check size={20} className="text-green-600 dark:text-green-200" />
                <div>
                  <p className="font-bold text-green-900 dark:text-green-100">Welcome to CrunchFit Pro!</p>
                  <p className="text-sm text-green-800 dark:text-green-200">Setting up your account...</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((s) => (
              <div key={s} className="flex-1">
                <motion.div
                  className={`h-2 rounded-full transition-colors ${
                    s <= step
                      ? 'bg-blue-600'
                      : isDark
                      ? 'bg-gray-700'
                      : 'bg-gray-300'
                  }`}
                  animate={{ scaleX: 1 }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs font-semibold text-gray-500">
            <span>Account</span>
            <span>Gym Info</span>
            <span>Location</span>
            <span>Details</span>
            <span>Plan</span>
          </div>
        </div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-8 mb-6`}
        >
          <AnimatePresence mode="wait">
            {/* Step 1: Account Setup */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <User size={24} className="text-blue-600" />
                  Create Your Account
                </h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">First Name *</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="John"
                        className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                          errors.firstName
                            ? 'border-red-500'
                            : isDark
                            ? 'border-gray-600 bg-gray-700'
                            : 'border-gray-300'
                        }`}
                      />
                      {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">Last Name *</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Smith"
                        className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                          errors.lastName
                            ? 'border-red-500'
                            : isDark
                            ? 'border-gray-600 bg-gray-700'
                            : 'border-gray-300'
                        }`}
                      />
                      {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com"
                      className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                        errors.email ? 'border-red-500' : isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300'
                      }`}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 000-0000"
                      className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                        errors.phone ? 'border-red-500' : isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300'
                      }`}
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Password *</label>
                    <div className="relative">
                      <input
                        type={passwordVisible ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="At least 8 characters"
                        className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                          errors.password
                            ? 'border-red-500'
                            : isDark
                            ? 'border-gray-600 bg-gray-700'
                            : 'border-gray-300'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setPasswordVisible(!passwordVisible)}
                        className={`absolute right-3 top-2.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                      >
                        {passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Confirm Password *</label>
                    <div className="relative">
                      <input
                        type={confirmPasswordVisible ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirm password"
                        className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                          errors.confirmPassword
                            ? 'border-red-500'
                            : isDark
                            ? 'border-gray-600 bg-gray-700'
                            : 'border-gray-300'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                        className={`absolute right-3 top-2.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                      >
                        {confirmPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                  </div>

                  <label className="flex items-start gap-3 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900">
                    <input
                      type="checkbox"
                      name="isGymOwner"
                      checked={formData.isGymOwner}
                      onChange={handleInputChange}
                      className="w-4 h-4 mt-1"
                    />
                    <span className="text-sm">I am registering as a Gym Owner and agree to the Terms of Service *</span>
                  </label>
                  {errors.isGymOwner && <p className="text-red-500 text-xs mt-1">{errors.isGymOwner}</p>}
                </div>
              </motion.div>
            )}

            {/* Step 2: Gym Information */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Building2 size={24} className="text-blue-600" />
                  Gym Information
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Gym Name *</label>
                    <input
                      type="text"
                      name="gymName"
                      value={formData.gymName}
                      onChange={handleInputChange}
                      placeholder="e.g., FitLife Gym"
                      className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                        errors.gymName ? 'border-red-500' : isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300'
                      }`}
                    />
                    {errors.gymName && <p className="text-red-500 text-xs mt-1">{errors.gymName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Gym Type *</label>
                    <select
                      name="gymType"
                      value={formData.gymType}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                        errors.gymType ? 'border-red-500' : isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select gym type...</option>
                      {gymTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    {errors.gymType && <p className="text-red-500 text-xs mt-1">{errors.gymType}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Website (Optional)</label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      placeholder="https://example.com"
                      className={`w-full px-4 py-2 rounded-lg border ${
                        isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Gym Phone *</label>
                    <input
                      type="tel"
                      name="gymPhone"
                      value={formData.gymPhone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 000-0000"
                      className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                        errors.gymPhone ? 'border-red-500' : isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300'
                      }`}
                    />
                    {errors.gymPhone && <p className="text-red-500 text-xs mt-1">{errors.gymPhone}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Primary Email *</label>
                    <input
                      type="email"
                      name="primaryEmail"
                      value={formData.primaryEmail}
                      onChange={handleInputChange}
                      placeholder="gym@example.com"
                      className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                        errors.primaryEmail
                          ? 'border-red-500'
                          : isDark
                          ? 'border-gray-600 bg-gray-700'
                          : 'border-gray-300'
                      }`}
                    />
                    {errors.primaryEmail && <p className="text-red-500 text-xs mt-1">{errors.primaryEmail}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">How did you hear about us?</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Tell us where you found CrunchFit Pro..."
                      rows="3"
                      className={`w-full px-4 py-2 rounded-lg border ${
                        isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300'
                      }`}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Location */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <MapPin size={24} className="text-blue-600" />
                  Gym Location
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Street Address *</label>
                    <input
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleInputChange}
                      placeholder="123 Main Street"
                      className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                        errors.street ? 'border-red-500' : isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300'
                      }`}
                    />
                    {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">City *</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="New York"
                        className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                          errors.city ? 'border-red-500' : isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300'
                        }`}
                      />
                      {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                    </div>

                    {formData.country === 'United States' && (
                      <div>
                        <label className="block text-sm font-semibold mb-2">State *</label>
                        <select
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                            errors.state ? 'border-red-500' : isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300'
                          }`}
                        >
                          <option value="">Select state...</option>
                          {usStates.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">ZIP Code *</label>
                      <input
                        type="text"
                        name="zip"
                        value={formData.zip}
                        onChange={handleInputChange}
                        placeholder="10001"
                        className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                          errors.zip ? 'border-red-500' : isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300'
                        }`}
                      />
                      {errors.zip && <p className="text-red-500 text-xs mt-1">{errors.zip}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">Country *</label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                          errors.country
                            ? 'border-red-500'
                            : isDark
                            ? 'border-gray-600 bg-gray-700'
                            : 'border-gray-300'
                        }`}
                      >
                        {countries.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                      {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Timezone</label>
                    <input
                      type="text"
                      value={formData.timezone}
                      disabled
                      className={`w-full px-4 py-2 rounded-lg border opacity-50 ${isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300'}`}
                    />
                    <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Auto-detected from your location</p>
                  </div>

                  <label className="flex items-center gap-3 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900">
                    <input
                      type="checkbox"
                      name="multipleLocations"
                      checked={formData.multipleLocations}
                      onChange={handleInputChange}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">This is part of a fitness chain with multiple locations</span>
                  </label>

                  {formData.multipleLocations && (
                    <div>
                      <label className="block text-sm font-semibold mb-2">Number of Locations *</label>
                      <input
                        type="number"
                        name="numberOfLocations"
                        value={formData.numberOfLocations}
                        onChange={handleInputChange}
                        placeholder="e.g., 5"
                        min="2"
                        className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                          errors.numberOfLocations
                            ? 'border-red-500'
                            : isDark
                            ? 'border-gray-600 bg-gray-700'
                            : 'border-gray-300'
                        }`}
                      />
                      {errors.numberOfLocations && (
                        <p className="text-red-500 text-xs mt-1">{errors.numberOfLocations}</p>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 4: Gym Details */}
            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-2xl font-bold mb-6">Gym Details</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Number of Members *</label>
                    <select
                      name="memberCount"
                      value={formData.memberCount}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300'}`}
                    >
                      <option value="<100">Less than 100</option>
                      <option value="100-500">100 - 500</option>
                      <option value="500-1000">500 - 1,000</option>
                      <option value="1000+">1,000+</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Operating Since (Year) *</label>
                    <input
                      type="number"
                      name="operatingSince"
                      value={formData.operatingSince}
                      onChange={handleInputChange}
                      placeholder="2020"
                      min="1900"
                      max={new Date().getFullYear()}
                      className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                        errors.operatingSince
                          ? 'border-red-500'
                          : isDark
                          ? 'border-gray-600 bg-gray-700'
                          : 'border-gray-300'
                      }`}
                    />
                    {errors.operatingSince && <p className="text-red-500 text-xs mt-1">{errors.operatingSince}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-3">Amenities</label>
                    <div className="space-y-2">
                      {amenities.map((amenity) => (
                        <label key={amenity} className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={selectedAmenities.includes(amenity)}
                            onChange={() => handleAmenityToggle(amenity)}
                            className="w-4 h-4"
                          />
                          <span className="text-sm">{amenity}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Gym Logo (Optional)</label>
                    <div
                      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                        isDark
                          ? 'border-gray-700 hover:border-blue-600 hover:bg-gray-700'
                          : 'border-gray-300 hover:border-blue-600 hover:bg-gray-50'
                      }`}
                    >
                      <Upload size={32} className="mx-auto mb-2 text-gray-400" />
                      <p className="text-sm font-semibold">Click to upload or drag and drop</p>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        PNG, JPG up to 5MB • Cloudinary integration ready
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 5: Plan Selection */}
            {step === 5 && (
              <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <DollarSign size={24} className="text-blue-600" />
                  Choose Your Plan
                </h2>

                <div className="mb-6">
                  <p className="text-sm font-semibold mb-4">All plans include a 14-day free trial. No credit card required.</p>

                  <div className="grid md:grid-cols-3 gap-4">
                    {pricingPlans.map((plan) => (
                      <motion.div
                        key={plan.id}
                        onClick={() => setSelectedPlan(plan.id)}
                        className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedPlan === plan.id
                            ? isDark
                              ? 'border-blue-600 bg-blue-600/10'
                              : 'border-blue-600 bg-blue-50'
                            : isDark
                            ? 'border-gray-700 hover:border-blue-400'
                            : 'border-gray-300 hover:border-blue-400'
                        }`}
                      >
                        {plan.popular && (
                          <div className="text-xs font-bold text-blue-600 mb-2 flex items-center gap-1">
                            ⭐ MOST POPULAR
                          </div>
                        )}
                        <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                        <p className="text-3xl font-bold text-blue-600 mb-1">${plan.monthlyPrice}</p>
                        <p className={`text-xs mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>/month (or ${plan.annualPrice}/year)</p>

                        <ul className="space-y-2 text-sm">
                          {plan.features.map((feature) => (
                            <li key={feature} className="flex gap-2">
                              <Check size={14} className="text-green-500 flex-shrink-0 mt-0.5" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Stripe placeholder */}
                {selectedPlan !== 'free' && (
                  <div className={`mt-6 p-4 rounded-lg border ${isDark ? 'border-gray-700 bg-gray-700' : 'border-gray-300 bg-gray-50'}`}>
                    <p className="font-semibold mb-3">💳 Payment Information</p>
                    <p className="text-xs text-gray-500 mb-3">Stripe Elements integration placeholder. Production: full Stripe payment form.</p>
                    <div className={`p-3 rounded border ${isDark ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-white'}`}>
                      <p className="text-xs font-mono text-gray-500">Stripe card element would render here</p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Navigation Buttons */}
        <div className="flex gap-4 justify-between">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className={`px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors ${
              step === 1
                ? 'opacity-50 cursor-not-allowed'
                : isDark
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
            }`}
          >
            <ChevronLeft size={18} />
            Back
          </button>

          <div className="flex-1 flex justify-center">
            <a href="/sign-in" className={`text-sm ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
              Already have an account? Sign in
            </a>
          </div>

          <button
            onClick={step === 5 ? handleSubmit : handleNext}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            {step === 5 ? (
              <>
                <Check size={18} />
                Create Account
              </>
            ) : (
              <>
                Next
                <ChevronRight size={18} />
              </>
            )}
          </button>
        </div>

        {/* Footer */}
        <div className={`mt-8 text-center text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          <p>
            By signing up, you agree to our{' '}
            <a href="/terms" className="text-blue-600 hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default GymApplicationPage;
