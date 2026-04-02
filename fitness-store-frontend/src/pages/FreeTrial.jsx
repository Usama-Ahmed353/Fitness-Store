import React from 'react';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';

const FreeTrial = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Start Your Free Trial</h1>
        <p className="text-light-bg/70 mb-8">
          Get 7 days of unlimited access to all our gyms and facilities. No credit card required.
        </p>

        <div className="bg-dark-navy/50 border border-accent/20 rounded-xl p-12">
          <p className="text-light-bg/70 mb-8">Free Trial Form Coming Soon</p>
          <Button variant="primary" size="lg">
            Proceed to Sign Up
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default FreeTrial;
