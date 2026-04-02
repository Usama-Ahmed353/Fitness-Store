import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, LogIn, ArrowRight } from 'lucide-react';
import { loginAsync } from '../../app/slices/authSlice';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import toast from 'react-hot-toast';

const loginSchema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const demoAccounts = [
  { role: 'Member', email: 'member@demo.com', password: 'Demo1234' },
  { role: 'Admin', email: 'admin@demo.com', password: 'Admin1234' },
  { role: 'Gym Owner', email: 'owner@demo.com', password: 'Owner1234' },
];

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading, error } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/member/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data) => {
    try {
      const result = await dispatch(loginAsync({
        email: data.email,
        password: data.password,
        rememberMe,
      })).unwrap();

      if (result) {
        toast.success('Welcome back!');
      }
    } catch (err) {
      toast.error(err.message || 'Login failed');
    }
  };

  const fillDemoAccount = (account) => {
    setValue('email', account.email);
    setValue('password', account.password);
    toast.success(`Filled ${account.role} credentials`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-dark-navy relative overflow-hidden"
    >
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600&h=900&fit=crop)',
          opacity: 0.1,
        }}
      />
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
              {/* Logo/Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-accent mb-2">Crunch</h1>
                <p className="text-light-bg/70">Sign In to Your Account</p>
              </div>

              {/* Error Banner */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400 text-sm"
                >
                  {error}
                </motion.div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mb-8">
                {/* Email */}
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

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      {...register('password')}
                      error={errors.password?.message}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-light-bg/60 hover:text-light-bg transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-accent/30 bg-dark-navy/50 text-accent focus:ring-accent"
                    />
                    <span className="text-light-bg/70">Remember me</span>
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-accent hover:text-accent/80 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Sign In Button */}
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
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <LogIn size={16} className="ml-2" />
                    </>
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-accent/20" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-dark-navy text-light-bg/60">Or continue with</span>
                </div>
              </div>

              {/* Social Login */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                <Button variant="outline" size="md" className="w-full">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  </svg>
                  Google
                </Button>
                <Button variant="outline" size="md" className="w-full">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </Button>
              </div>

              {/* Sign Up Link */}
              <p className="text-center text-light-bg/70 text-sm mb-6">
                Don't have an account?{' '}
                <Link to="/register" className="text-accent hover:underline font-semibold">
                  Create one
                </Link>
              </p>

              {/* Demo Accounts */}
              <div className="border-t border-accent/20 pt-6">
                <p className="text-xs text-light-bg/60 font-semibold mb-3 uppercase">Demo Accounts</p>
                <div className="space-y-2">
                  {demoAccounts.map((account, idx) => (
                    <motion.button
                      key={idx}
                      onClick={() => fillDemoAccount(account)}
                      whileHover={{ scale: 1.02 }}
                      className="w-full p-3 rounded-lg bg-dark-navy/50 border border-accent/20 hover:border-accent/50 transition-all text-left text-sm"
                    >
                      <div className="font-semibold text-white">{account.role}</div>
                      <div className="text-light-bg/70 text-xs">{account.email}</div>
                    </motion.button>
                  ))}
                </div>
                <p className="text-xs text-light-bg/50 mt-3">
                  Tap any account to auto-fill credentials
                </p>
              </div>
            </div>
          </Card>

          {/* Footer Links */}
          <div className="text-center mt-6 text-xs text-light-bg/60 space-y-2">
            <p>
              <Link to="/" className="text-accent hover:underline">
                Return Home
              </Link>
            </p>
            <p>
              <Link to="/contact" className="text-accent hover:underline">
                Need help?
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LoginPage;
