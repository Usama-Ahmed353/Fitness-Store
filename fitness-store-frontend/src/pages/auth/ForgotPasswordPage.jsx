import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import toast from 'react-hot-toast';

const schema = z.object({
  email: z.string().email('Valid email required'),
});

const ForgotPasswordPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitted(true);
      setCountdown(60);
      toast.success('Reset instructions sent to your email');

      // Countdown logic
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      toast.error('Failed to send reset instructions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    setCountdown(60);
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
                <p className="text-light-bg/70">Reset Your Password</p>
              </div>

              {!submitted ? (
                <motion.form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <p className="text-light-bg/70 text-sm text-center">
                    Enter your email address and we'll send you a link to reset your password.
                  </p>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      {...register('email')}
                      error={errors.email?.message}
                      disabled={isLoading}
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? (
                      <>
                        <div className="inline-block animate-spin mr-2">
                          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                        </div>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Reset Link
                        <ArrowRight size={16} className="ml-2" />
                      </>
                    )}
                  </Button>

                  <p className="text-center text-light-bg/70 text-sm">
                    Remembered your password?{' '}
                    <Link to="/login" className="text-accent hover:underline font-semibold">
                      Sign in
                    </Link>
                  </p>
                </motion.form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center"
                >
                  <div className="mb-6 flex justify-center">
                    <div className="p-4 rounded-full bg-accent/20">
                      <Mail size={32} className="text-accent" />
                    </div>
                  </div>

                  <h2 className="text-xl font-bold text-white mb-2">
                    Check Your Email
                  </h2>
                  <p className="text-light-bg/70 text-sm mb-6">
                    We sent password reset instructions to your email address. Click the link in the email to reset your password.
                  </p>

                  <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 mb-6">
                    <p className="text-sm text-light-bg/80">
                      <strong>Didn't receive the email?</strong> Check your spam folder or try resending.
                    </p>
                  </div>

                  <Button
                    onClick={handleResend}
                    variant="outline"
                    size="lg"
                    disabled={countdown > 0}
                    className="w-full mb-4"
                  >
                    {countdown > 0 ? (
                      <>
                        <Clock size={16} className="mr-2" />
                        Resend in {countdown}s
                      </>
                    ) : (
                      <>
                        <Mail size={16} className="mr-2" />
                        Resend Email
                      </>
                    )}
                  </Button>

                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center text-accent hover:underline text-sm"
                  >
                    Back to Sign In
                  </Link>
                </motion.div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ForgotPasswordPage;
