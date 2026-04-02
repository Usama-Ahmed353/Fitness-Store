import React from 'react';
import { motion } from 'framer-motion';

const MemberBookings = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <h1 className="text-4xl font-bold text-white mb-8">My Bookings</h1>
      <div className="bg-dark-navy/50 border border-accent/20 rounded-xl p-8 text-light-bg/70 text-center h-96 flex items-center justify-center">
        <p>Bookings page coming soon...</p>
      </div>
    </motion.div>
  );
};

export default MemberBookings;
