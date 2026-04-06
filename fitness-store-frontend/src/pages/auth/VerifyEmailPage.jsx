import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Mail } from 'lucide-react';
import axios from 'axios';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import toast from 'react-hot-toast';

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('awaiting'); // awaiting, verifying, success, error
  const [error, setError] = useState(null);
  const hasAttemptedVerification = useRef(false);

  const token = searchParams.get('token');
  const email = searchParams.get('email');
  const runtimeHost =
    typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || `http://${runtimeHost}:5001/api`;

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('awaiting');
        return;
      }

      if (hasAttemptedVerification.current) {
        return;
      }
      hasAttemptedVerification.current = true;

      try {
        setStatus('verifying');
        await axios.get(`${API_BASE_URL}/auth/verify-email`, {
          params: { token },
        });

        setStatus('success');
        toast.success('Email verified successfully!');
        
        // Redirect after 3 seconds
        setTimeout(() => navigate('/login'), 3000);
      } catch (err) {
        setStatus('error');
        setError(err.response?.data?.message || err.message || 'Failed to verify email');
        toast.error('Email verification failed');
      }
    };

    verifyEmail();
  }, [token, navigate, API_BASE_URL]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-dark-navy relative overflow-hidden flex items-center justify-center px-4"
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative z-10 w-full max-w-md"
      >
        <Card variant="default" className="border border-accent/30">
          <div className="p-8 text-center">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-accent mb-2">Crunch</h1>
              <p className="text-slate-600">Email Verification</p>
            </div>

            {/* Awaiting Token State */}
            {status === 'awaiting' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex justify-center mb-6">
                  <div className="p-4 rounded-full bg-accent/20">
                    <Mail size={48} className="text-accent" />
                  </div>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">
                  Verify From Your Email
                </h2>
                <p className="text-slate-600 mb-6">
                  We sent a verification link to {email || 'your email address'}. Open that link to verify your account.
                </p>
                <Button
                  onClick={() => navigate('/login')}
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  Back to Sign In
                </Button>
              </motion.div>
            )}

            {/* Verifying State */}
            {status === 'verifying' && (
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="flex justify-center mb-6">
                  <div className="p-4 rounded-full bg-accent/20">
                    <Mail size={48} className="text-accent animate-pulse" />
                  </div>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">
                  Verifying Your Email
                </h2>
                <p className="text-slate-600">
                  Please wait while we verify your email address...
                </p>
                <div className="mt-6 flex justify-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0s' }} />
                  <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              </motion.div>
            )}

            {/* Success State */}
            {status === 'success' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="flex justify-center mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="p-4 rounded-full bg-green-500/20"
                  >
                    <CheckCircle size={48} className="text-green-500" />
                  </motion.div>
                </div>

                <h2 className="text-xl font-bold text-slate-900 mb-2">
                  Email Verified!
                </h2>
                <p className="text-slate-600 mb-6">
                  Your email address has been verified successfully. Redirecting to sign in...
                </p>

                <Button
                  onClick={() => navigate('/login')}
                  variant="primary"
                  size="lg"
                  className="w-full"
                >
                  Go to Sign In
                </Button>
              </motion.div>
            )}

            {/* Error State */}
            {status === 'error' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="flex justify-center mb-6">
                  <div className="p-4 rounded-full bg-red-500/20">
                    <AlertCircle size={48} className="text-red-500" />
                  </div>
                </div>

                <h2 className="text-xl font-bold text-slate-900 mb-2">
                  Verification Failed
                </h2>
                <p className="text-slate-600 mb-6">
                  {error || 'We couldn\'t verify your email. Please try again or contact support.'}
                </p>

                <div className="space-y-3">
                  <Button
                    onClick={() => navigate('/register')}
                    variant="primary"
                    size="lg"
                    className="w-full"
                  >
                    Request New Verification
                  </Button>
                  <Button
                    onClick={() => navigate('/login')}
                    variant="outline"
                    size="lg"
                    className="w-full"
                  >
                    Back to Sign In
                  </Button>
                </div>

                <p className="text-slate-600 text-sm mt-6">
                  <Link to="/contact" className="text-accent hover:underline">
                    Contact Support
                  </Link>
                </p>
              </motion.div>
            )}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default VerifyEmailPage;
