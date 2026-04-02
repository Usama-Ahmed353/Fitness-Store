import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download } from 'lucide-react';
import usePWA from '../../hooks/usePWA';
import Button from '../ui/Button';

const PWAInstallPrompt = () => {
  const { isInstallable, isInstalled, promptInstall, dismissPrompt } = usePWA();

  // Don't show if already installed
  if (!isInstallable || isInstalled) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed top-20 left-4 right-4 z-40 max-w-sm mx-auto"
      >
        <div className="bg-gradient-to-r from-accent/90 to-secondary/90 backdrop-blur-md rounded-lg shadow-2xl p-4 border border-accent/50">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className="flex-shrink-0 mt-1">
              <Download size={24} className="text-white" />
            </div>

            {/* Content */}
            <div className="flex-grow">
              <h3 className="font-bold text-white mb-1">Install CrunchFit</h3>
              <p className="text-sm text-white/90 mb-3">
                Add CrunchFit Pro to your home screen for quick access and offline support.
              </p>

              {/* Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={promptInstall}
                  className="text-sm font-semibold px-3 py-1 rounded bg-white text-accent hover:bg-white/90 transition-colors"
                >
                  Install
                </button>
                <button
                  onClick={dismissPrompt}
                  className="text-sm font-semibold px-3 py-1 rounded bg-white/20 text-white hover:bg-white/30 transition-colors"
                >
                  Later
                </button>
              </div>
            </div>

            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={dismissPrompt}
              className="flex-shrink-0 text-white/70 hover:text-white transition-colors"
            >
              <X size={20} />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PWAInstallPrompt;
