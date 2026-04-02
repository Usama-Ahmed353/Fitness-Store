import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Check, User, Building2, Award } from 'lucide-react';
import { registerAsync } from '../../app/slices/authSlice';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import toast from 'react-hot-toast';

const accountTypes = [
  {
    id: 'member',
    name: 'Member',
    icon: User,
    description: 'Join a gym and workout',
    color: 'from-accent/20',
  },
  {
    id: 'trainer',
    name: 'Trainer',
    icon: Award,
    description: 'Offer personal training',
    color: 'from-secondary/20',
  },
  {
    id: 'gym-owner',
    name: 'Gym Owner',
    icon: Building2,
    description: 'Manage your gym',
    color: 'from-primary/20',
  },
];

// Step 2 Validation Schema
const step2Schema = z.object({
  firstName: z.string().min(2, 'First name required'),
  lastName: z.string().min(2, 'Last name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(10, 'Valid phone required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords must match',
  path: ['confirmPassword'],
});

// Step 3 Member Schema
const step3MemberSchema = z.object({
  gymId: z.string().min(1, 'Please select a gym'),
  planId: z.string().min(1, 'Please select a plan'),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms',
  }),
});

// Step 3 Gym Owner Schema
const step3OwnerSchema = z.object({
  gymName: z.string().min(2, 'Gym name required'),
  address: z.string().min(5, 'Address required'),
  phone: z.string().min(10, 'Valid phone required'),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms',
  }),
});

// Mock data
const mockGyms = [
  { id: 'gym-1', name: 'Times Square, New York' },
  { id: 'gym-2', name: 'East Village, New York' },
  { id: 'gym-3', name: 'Midtown, New York' },
];

const mockPlans = [
  { id: 'base', name: 'Base - $9.99/month' },
  { id: 'peak', name: 'Peak - $21.99/month' },
  { id: 'peak-results', name: 'Peak Results - $29.99/month' },
  { id: 'peak-plus', name: 'Peak Plus - $34.99/month' },
];

const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const [step, setStep] = useState(1);
  const [accountType, setAccountType] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/member/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Step 2 Form
  const form2 = useForm({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  // Step 3 Forms
  const form3Member = useForm({
    resolver: zodResolver(step3MemberSchema),
    defaultValues: {
      gymId: '',
      planId: '',
      termsAccepted: false,
    },
  });

  const form3Owner = useForm({
    resolver: zodResolver(step3OwnerSchema),
    defaultValues: {
      gymName: '',
      address: '',
      phone: '',
      termsAccepted: false,
    },
  });

  // Calculate password strength
  const calculatePasswordStrength = (pwd) => {
    if (pwd.length < 8) return 'Weak';
    if (pwd.length < 12) return 'Fair';
    if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd) && /[!@#$%^&*]/.test(pwd)) return 'Excellent';
    return 'Strong';
  };

  const handlePasswordChange = (e) => {
    const pwd = e.target.value;
    form2.setValue('password', pwd);
    setPasswordStrength(calculatePasswordStrength(pwd));
  };

  const onSubmitStep2 = (data) => {
    setStep(3);
  };

  const onSubmitStep3 = async (data) => {
    try {
      const payload = {
        firstName: form2.getValues('firstName'),
        lastName: form2.getValues('lastName'),
        email: form2.getValues('email'),
        phone: form2.getValues('phone'),
        password: form2.getValues('password'),
        accountType,
        ...data,
      };

      const result = await dispatch(registerAsync(payload)).unwrap();
      
      if (result) {
        toast.success('Account created! Check your email to verify.');
        navigate('/verify-email');
      }
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 'Weak':
        return 'bg-red-500';
      case 'Fair':
        return 'bg-yellow-500';
      case 'Strong':
        return 'bg-blue-500';
      case 'Excellent':
        return 'bg-green-500';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-dark-navy relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0" style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600&h=900&fit=crop)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.1,
      }} />
      <div className="absolute inset-0 bg-gradient-to-br from-dark-navy/95 via-dark-navy/90 to-dark-navy/95" />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-md"
        >
          <Card variant="default" className="border border-accent/30">
            <div className="p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-accent mb-2">Crunch</h1>
                <p className="text-light-bg/70">Create Your Account</p>
                <div className="flex justify-center gap-2 mt-4">
                  {[1, 2, 3].map((s) => (
                    <div
                      key={s}
                      className={`h-1 w-8 rounded transition-all ${
                        s <= step ? 'bg-accent' : 'bg-accent/30'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <AnimatePresence mode="wait">
                {/* STEP 1: Account Type Selection */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <p className="text-light-bg/70 text-sm mb-4 text-center">
                      What type of account do you want to create?
                    </p>
                    <div className="space-y-3 mb-6">
                      {accountTypes.map((type) => {
                        const Icon = type.icon;
                        return (
                          <motion.button
                            key={type.id}
                            onClick={() => {
                              setAccountType(type.id);
                              setStep(2);
                            }}
                            whileHover={{ scale: 1.02 }}
                            className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                              accountType === type.id
                                ? 'border-accent bg-accent/10'
                                : 'border-accent/20 bg-dark-navy/50 hover:border-accent/50'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <Icon size={24} className="text-accent" />
                              <div>
                                <div className="font-semibold text-white">{type.name}</div>
                                <div className="text-xs text-light-bg/60">{type.description}</div>
                              </div>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: Personal Info */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <form onSubmit={form2.handleSubmit(onSubmitStep2)} className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-white mb-1">
                            First Name
                          </label>
                          <Input
                            placeholder="John"
                            {...form2.register('firstName')}
                            error={form2.formState.errors.firstName?.message}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-white mb-1">
                            Last Name
                          </label>
                          <Input
                            placeholder="Doe"
                            {...form2.register('lastName')}
                            error={form2.formState.errors.lastName?.message}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-white mb-1">
                          Email
                        </label>
                        <Input
                          type="email"
                          placeholder="you@example.com"
                          {...form2.register('email')}
                          error={form2.formState.errors.email?.message}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-white mb-1">
                          Phone
                        </label>
                        <Input
                          placeholder="(555) 123-4567"
                          {...form2.register('phone')}
                          error={form2.formState.errors.phone?.message}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-white mb-1">
                          Password
                        </label>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...form2.register('password')}
                          onChange={handlePasswordChange}
                          error={form2.formState.errors.password?.message}
                        />
                        {passwordStrength && (
                          <div className="mt-2">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs text-light-bg/60">Strength:</span>
                              <span className={`text-xs font-semibold ${
                                passwordStrength === 'Weak' ? 'text-red-400' :
                                passwordStrength === 'Fair' ? 'text-yellow-400' :
                                passwordStrength === 'Strong' ? 'text-blue-400' :
                                'text-green-400'
                              }`}>
                                {passwordStrength}
                              </span>
                            </div>
                            <div className="h-1 bg-dark-navy/50 rounded-full overflow-hidden">
                              <div
                                className={`h-full transition-all ${getPasswordStrengthColor()}`}
                                style={{
                                  width: passwordStrength === 'Weak' ? '25%' :
                                         passwordStrength === 'Fair' ? '50%' :
                                         passwordStrength === 'Strong' ? '75%' :
                                         '100%',
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-white mb-1">
                          Confirm Password
                        </label>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...form2.register('confirmPassword')}
                          error={form2.formState.errors.confirmPassword?.message}
                        />
                      </div>

                      <div className="flex gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setStep(1)}
                          className="flex-1"
                        >
                          <ArrowLeft size={16} className="mr-2" />
                          Back
                        </Button>
                        <Button
                          type="submit"
                          variant="primary"
                          className="flex-1"
                        >
                          Next
                          <ArrowRight size={16} className="ml-2" />
                        </Button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {/* STEP 3: Member-Specific or Owner-Specific */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    {accountType === 'member' ? (
                      <form onSubmit={form3Member.handleSubmit(onSubmitStep3)} className="space-y-4">
                        <div>
                          <label className="block text-xs font-medium text-white mb-2">
                            Select Your Gym
                          </label>
                          <select
                            {...form3Member.register('gymId')}
                            className="w-full px-3 py-2 rounded-lg bg-dark-navy/50 border border-accent/30 text-white text-sm focus:outline-none focus:border-accent"
                          >
                            <option value="">Choose a location...</option>
                            {mockGyms.map((gym) => (
                              <option key={gym.id} value={gym.id}>
                                {gym.name}
                              </option>
                            ))}
                          </select>
                          {form3Member.formState.errors.gymId && (
                            <p className="text-red-400 text-xs mt-1">
                              {form3Member.formState.errors.gymId.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-white mb-2">
                            Choose Your Plan
                          </label>
                          <select
                            {...form3Member.register('planId')}
                            className="w-full px-3 py-2 rounded-lg bg-dark-navy/50 border border-accent/30 text-white text-sm focus:outline-none focus:border-accent"
                          >
                            <option value="">Select a plan...</option>
                            {mockPlans.map((plan) => (
                              <option key={plan.id} value={plan.id}>
                                {plan.name}
                              </option>
                            ))}
                          </select>
                          {form3Member.formState.errors.planId && (
                            <p className="text-red-400 text-xs mt-1">
                              {form3Member.formState.errors.planId.message}
                            </p>
                          )}
                        </div>

                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            {...form3Member.register('termsAccepted')}
                            className="w-4 h-4 rounded border-accent/30 bg-dark-navy/50 text-accent focus:ring-accent mt-1"
                          />
                          <span className="text-xs text-light-bg/70">
                            I agree to the{' '}
                            <a href="#" className="text-accent hover:underline">
                              Terms of Service
                            </a>{' '}
                            and{' '}
                            <a href="#" className="text-accent hover:underline">
                              Privacy Policy
                            </a>
                          </span>
                        </label>
                        {form3Member.formState.errors.termsAccepted && (
                          <p className="text-red-400 text-xs">
                            {form3Member.formState.errors.termsAccepted.message}
                          </p>
                        )}

                        <div className="flex gap-3">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setStep(2)}
                            className="flex-1"
                          >
                            <ArrowLeft size={16} className="mr-2" />
                            Back
                          </Button>
                          <Button
                            type="submit"
                            variant="primary"
                            disabled={isLoading}
                            className="flex-1"
                          >
                            {isLoading ? 'Creating...' : 'Create Account'}
                            <Check size={16} className="ml-2" />
                          </Button>
                        </div>
                      </form>
                    ) : (
                      <form onSubmit={form3Owner.handleSubmit(onSubmitStep3)} className="space-y-4">
                        <div>
                          <label className="block text-xs font-medium text-white mb-1">
                            Gym Name
                          </label>
                          <Input
                            placeholder="Your Gym Name"
                            {...form3Owner.register('gymName')}
                            error={form3Owner.formState.errors.gymName?.message}
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-white mb-1">
                            Address
                          </label>
                          <Input
                            placeholder="123 Main St, City, State"
                            {...form3Owner.register('address')}
                            error={form3Owner.formState.errors.address?.message}
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-white mb-1">
                            Phone
                          </label>
                          <Input
                            placeholder="(555) 123-4567"
                            {...form3Owner.register('phone')}
                            error={form3Owner.formState.errors.phone?.message}
                          />
                        </div>

                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            {...form3Owner.register('termsAccepted')}
                            className="w-4 h-4 rounded border-accent/30 bg-dark-navy/50 text-accent focus:ring-accent mt-1"
                          />
                          <span className="text-xs text-light-bg/70">
                            I agree to the{' '}
                            <a href="#" className="text-accent hover:underline">
                              Terms of Service
                            </a>{' '}
                            and{' '}
                            <a href="#" className="text-accent hover:underline">
                              Privacy Policy
                            </a>
                          </span>
                        </label>
                        {form3Owner.formState.errors.termsAccepted && (
                          <p className="text-red-400 text-xs">
                            {form3Owner.formState.errors.termsAccepted.message}
                          </p>
                        )}

                        <div className="flex gap-3">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setStep(2)}
                            className="flex-1"
                          >
                            <ArrowLeft size={16} className="mr-2" />
                            Back
                          </Button>
                          <Button
                            type="submit"
                            variant="primary"
                            disabled={isLoading}
                            className="flex-1"
                          >
                            {isLoading ? 'Creating...' : 'Create Account'}
                            <Check size={16} className="ml-2" />
                          </Button>
                        </div>
                      </form>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Login Link */}
              <p className="text-center text-light-bg/70 text-sm mt-6">
                Already have an account?{' '}
                <Link to="/login" className="text-accent hover:underline font-semibold">
                  Sign in
                </Link>
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default RegisterPage;
