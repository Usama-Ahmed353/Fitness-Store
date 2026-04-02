import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CheckCircle, MapPin, Calendar, Gift } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import toast from 'react-hot-toast';

const signupSchema = z.object({
  firstName: z.string().min(2, 'First name required'),
  lastName: z.string().min(2, 'Last name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(10, 'Valid phone number required'),
  gymLocation: z.string().min(1, 'Please select a gym location'),
});

const FreeTrialPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const [selectedGym, setSelectedGym] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const gyms = [
    { id: 'times-square', name: 'Times Square, New York, NY' },
    { id: 'east-village', name: 'East Village, New York, NY' },
    { id: 'midtown', name: 'Midtown, New York, NY' },
    { id: 'brooklyn', name: 'Brooklyn Heights, Brooklyn, NY' },
    { id: 'long-island', name: 'Long Island City, Queens, NY' },
    { id: 'jersey', name: 'Jersey City, New Jersey' },
  ];

  const onSubmit = async (data) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Signup data:', data);
      setSubmitted(true);
      
      toast.success('Welcome! Check your email for confirmation.');
      
      // Simulate redirect to member portal after a delay
      setTimeout(() => {
        window.location.href = '/member/dashboard';
      }, 2000);
    } catch (error) {
      toast.error('Signup failed. Please try again.');
    }
  };

  const benefits = [
    {
      icon: '⏰',
      title: '7 Days Free',
      description: 'Full access to all BASE plan features',
    },
    {
      icon: '💳',
      title: 'No Credit Card Required',
      description: 'Start working out immediately, no payment info needed upfront',
    },
    {
      icon: '🏋️',
      title: 'Unlimited Access',
      description: 'Use any of our 250+ locations worldwide',
    },
    {
      icon: '🎯',
      title: 'Full Amenities',
      description: 'All gym facilities, classes, and digital content included',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-dark-navy"
    >
      {/* HERO SECTION */}
      <section className="relative h-96 bg-gradient-to-b from-dark-navy via-dark-navy/95 to-dark-navy flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-dark-navy/90 to-transparent z-10" />
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 50%, rgba(233, 69, 96, 0.3) 0%, transparent 50%)',
          }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        <div className="relative z-20 text-center max-w-2xl px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold text-white mb-4"
          >
            Get 7 Days Free
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-light-bg/80 text-xl"
          >
            No credit card required. Start your fitness journey today.
          </motion.p>
        </div>
      </section>

      {/* BENEFITS GRID */}
      <section className="bg-dark-navy py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card variant="dark">
                  <div className="p-6 text-center">
                    <div className="text-5xl mb-4">{benefit.icon}</div>
                    <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
                    <p className="text-light-bg/70 text-sm">{benefit.description}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SIGNUP SECTION */}
      <section className="bg-gradient-to-b from-dark-navy/50 to-dark-navy py-12 md:py-20 border-t border-accent/20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h2 className="text-3xl font-bold text-white mb-8 text-center">
                  Claim Your Free Trial
                </h2>

                <Card variant="dark-hover" className="border border-accent/30">
                  <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
                    {/* Name Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          First Name
                        </label>
                        <Input
                          placeholder="John"
                          {...register('firstName')}
                          error={errors.firstName?.message}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          Last Name
                        </label>
                        <Input
                          placeholder="Doe"
                          {...register('lastName')}
                          error={errors.lastName?.message}
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Email Address
                      </label>
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        {...register('email')}
                        error={errors.email?.message}
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Phone Number
                      </label>
                      <Input
                        type="tel"
                        placeholder="(555) 123-4567"
                        {...register('phone')}
                        error={errors.phone?.message}
                      />
                    </div>

                    {/* Gym Selection */}
                    <div>
                      <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
                        <MapPin size={16} className="text-accent" />
                        Nearest Gym Location
                      </label>
                      <select
                        {...register('gymLocation')}
                        value={selectedGym}
                        onChange={(e) => setSelectedGym(e.target.value)}
                        className={`w-full px-4 py-3 rounded-lg bg-dark-navy/50 border transition-all text-white focus:outline-none focus:border-accent ${
                          errors.gymLocation ? 'border-red-500' : 'border-accent/30 hover:border-accent/50 focus:border-accent'
                        }`}
                      >
                        <option value="">Select a gym location...</option>
                        {gyms.map((gym) => (
                          <option key={gym.id} value={gym.id}>
                            {gym.name}
                          </option>
                        ))}
                      </select>
                      {errors.gymLocation && (
                        <p className="text-red-500 text-sm mt-1">{errors.gymLocation.message}</p>
                      )}
                    </div>

                    {/* Terms */}
                    <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
                      <p className="text-sm text-light-bg/70">
                        By signing up, you agree to our Terms of Service and Privacy Policy. Your free trial will automatically convert to a paid subscription unless you cancel before it ends.
                      </p>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      disabled={isSubmitting}
                      className="w-full"
                    >
                      {isSubmitting ? 'Creating Your Trial...' : 'Start My Free Trial'}
                    </Button>

                    <p className="text-center text-light-bg/60 text-sm">
                      Already have an account? <a href="/login" className="text-accent hover:underline">Log in here</a>
                    </p>
                  </form>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <Card variant="dark-hover" className="border border-accent">
                  <div className="p-8 md:p-12 text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                      className="mb-6 flex justify-center"
                    >
                      <CheckCircle size={64} className="text-accent" />
                    </motion.div>

                    <h2 className="text-3xl font-bold text-white mb-4">
                      Welcome to Crunch!
                    </h2>

                    <p className="text-light-bg/80 text-lg mb-8">
                      Your free trial is ready to use. Check your email for next steps.
                    </p>

                    <div className="space-y-3 mb-8 text-start max-w-sm mx-auto">
                      <div className="flex items-start gap-3">
                        <CheckCircle size={20} className="text-accent flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-white">Confirmation sent</p>
                          <p className="text-sm text-light-bg/70">Check your email for login credentials</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle size={20} className="text-accent flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-white">7 days free access</p>
                          <p className="text-sm text-light-bg/70">Full access to all BASE plan features</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle size={20} className="text-accent flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-white">No credit card charged</p>
                          <p className="text-sm text-light-bg/70">Only charges after your trial ends</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Button variant="primary" size="lg" className="w-full">
                        Go to My Gym Dashboard
                      </Button>
                      <Button variant="outline" size="lg" className="w-full">
                        Continue Shopping Plans
                      </Button>
                    </div>

                    <p className="text-light-bg/60 text-sm mt-6">
                      Redirecting to your dashboard in a moment...
                    </p>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* FAQ MINI */}
      <section className="bg-dark-navy py-12 md:py-20 border-t border-accent/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Common Questions
          </h2>

          <div className="space-y-4">
            {[
              {
                q: 'Do I really need to provide my credit card?',
                a: 'No credit card needed for your free trial. You can enjoy all features for 7 days without payment information.',
              },
              {
                q: 'What if I want to cancel?',
                a: 'You can cancel anytime before your trial ends. We will not charge you if you cancel within 7 days.',
              },
              {
                q: 'Can I upgrade during my trial?',
                a: 'Yes! You can upgrade to Peak, Peak Results, or Peak Plus plans anytime. Your free trial credit applies to your first month.',
              },
              {
                q: 'Which gym can I use with my trial?',
                a: 'Your trial membership gives you access to your selected gym location and all digital Crunch+ content.',
              },
            ].map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-6 rounded-lg border border-accent/20 hover:border-accent/50 transition-all"
              >
                <h3 className="font-bold text-white mb-2">{faq.q}</h3>
                <p className="text-light-bg/70 text-sm">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* BUILD TRUST SECTION */}
      <section className="bg-gradient-to-r from-accent/10 to-secondary/10 py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <p className="text-light-bg/80 mb-4">
              ⭐ Trusted by <span className="font-bold text-white">2 million+ members</span> worldwide
            </p>
            <p className="text-light-bg/70 text-sm">
              95% of our trial users convert to paid memberships
            </p>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default FreeTrialPage;
