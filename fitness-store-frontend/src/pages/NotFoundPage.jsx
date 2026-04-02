import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, MapPin, Home, Search } from 'lucide-react';
import Button from '../components/ui/Button';
import SEO from '../components/seo/SEO';

const NotFoundPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Animated 404 text
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <>
      <SEO
        title="Page Not Found - CrunchFit Pro"
        description="The page you're looking for doesn't exist. Find a gym location or explore our fitness programs."
        noindex={true}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gradient-to-b from-dark-navy via-dark-navy/95 to-accent/5 flex items-center justify-center px-4 py-20"
      >
        <div className="max-w-2xl w-full">
          {/* Animated 404 */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center mb-12"
          >
            {/* Large 404 with Animation */}
            <motion.div
              variants={itemVariants}
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
              className="mb-8"
            >
              <h1 className="text-9xl md:text-[150px] font-black text-accent leading-none">
                4
                <span className="inline-block relative">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="inline-block"
                  >
                    0
                  </motion.span>
                </span>
                4
              </h1>
            </motion.div>

            {/* Alert Icon */}
            <motion.div
              variants={itemVariants}
              className="flex justify-center mb-6"
            >
              <div className="p-4 rounded-full bg-accent/20 border border-accent/40">
                <AlertCircle size={48} className="text-accent" />
              </div>
            </motion.div>

            {/* Title */}
            <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold text-white mb-3">
              Looks Like You Hit a Blocked Barbell
            </motion.h2>

            {/* Description */}
            <motion.p variants={itemVariants} className="text-light-bg/80 text-lg mb-8 max-w-lg mx-auto">
              The page you're looking for isn't here. But don't worry—we have plenty of fitness content to explore!
            </motion.p>

            {/* Fun Fitness Message */}
            <motion.div
              variants={itemVariants}
              className="bg-accent/10 border border-accent/30 rounded-lg p-6 mb-12"
            >
              <p className="text-light-bg italic">
                "Every great workout starts with finding the right gym. Let's get you moving! 💪"
              </p>
            </motion.div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {/* Home Button */}
            <motion.div variants={itemVariants}>
              <Button
                onClick={() => navigate('/')}
                variant="primary"
                size="lg"
                className="w-full justify-center"
              >
                <Home size={20} className="mr-2" />
                Go Home
              </Button>
            </motion.div>

            {/* Find Gym Button */}
            <motion.div variants={itemVariants}>
              <Button
                onClick={() => navigate('/locations')}
                variant="outline"
                size="lg"
                className="w-full justify-center border-accent text-accent hover:bg-accent/10"
              >
                <MapPin size={20} className="mr-2" />
                Find a Gym Near You
              </Button>
            </motion.div>

            {/* Explore Classes Button */}
            <motion.div variants={itemVariants}>
              <Button
                onClick={() => navigate('/classes')}
                variant="outline"
                size="lg"
                className="w-full justify-center border-light-bg/30 text-light-bg hover:bg-light-bg/10"
              >
                <Search size={20} className="mr-2" />
                Explore Classes
              </Button>
            </motion.div>
          </motion.div>

          {/* Additional Links */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mt-12 pt-12 border-t border-accent/10"
          >
            <p className="text-center text-light-bg/70 mb-6">Not finding what you need?</p>

            <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4 text-sm">
              <a href="/membership" className="text-accent hover:underline">
                View Plans
              </a>
              <span className="text-light-bg/30">•</span>
              <a href="/training" className="text-accent hover:underline">
                Personal Training
              </a>
              <span className="text-light-bg/30">•</span>
              <a href="/about" className="text-accent hover:underline">
                About Us
              </a>
              <span className="text-light-bg/30">•</span>
              <a href="/contact" className="text-accent hover:underline">
                Contact Support
              </a>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default NotFoundPage;
