import React from 'react';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-12"
    >
      {/* Hero Section */}
      <section className="relative h-[600px] bg-gradient-to-br from-dark-navy via-dark-navy to-secondary/20 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-accent/20 to-secondary/20"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-white mb-4"
          >
            Your Fitness Journey Starts Here
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-light-bg/80 mb-8"
          >
            Join CrunchFit Pro and transform your body with world-class gyms, expert trainers, and
            cutting-edge facilities
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button variant="primary" size="lg" className="px-8">
              Start Free Trial
            </Button>
            <Button variant="outline" size="lg" className="px-8">
              Join Now
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-4xl font-bold text-white text-center mb-12">Why Choose CrunchFit?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'Premium Facilities', icon: '🏋️' },
            { title: 'Expert Trainers', icon: '👨‍🏫' },
            { title: 'Flexible Plans', icon: '💳' },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-dark-navy/50 border border-accent/20 rounded-xl p-8 text-center hover:border-accent/50 transition-all duration-200"
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-semibold text-white mb-4">{feature.title}</h3>
              <p className="text-light-bg/70">
                Experience world-class fitness services with modern equipment and professional
                guidance
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-r from-accent/10 to-secondary/10 rounded-2xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform?</h2>
          <p className="text-light-bg/80 mb-8">Start your free trial today—no credit card needed</p>
          <Button variant="primary" size="lg">
            Start Your Free Trial
          </Button>
        </div>
      </section>
    </motion.div>
  );
};

export default Home;
