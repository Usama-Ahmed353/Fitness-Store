import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Heart,
  Share2,
  Send,
  Rss,
  Code,
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const sections = {
    about: {
      title: 'About CrunchFit',
      links: [
        { label: 'Who We Are', href: '/about' },
        { label: 'Careers', href: '#' },
        { label: 'Press Kit', href: '#' },
        { label: 'Blog', href: '#' },
      ],
    },
    memberships: {
      title: 'Memberships',
      links: [
        { label: 'Crunch Basic', href: '/crunch-plus' },
        { label: 'Crunch Plus', href: '/crunch-plus' },
        { label: 'Crunch Premier', href: '/crunch-plus' },
        { label: 'Day Pass', href: '/join' },
      ],
    },
    resources: {
      title: 'Resources',
      links: [
        { label: 'Help Center', href: '#' },
        { label: 'Classes', href: '/classes' },
        { label: 'Locations', href: '/locations' },
        { label: 'Privacy Policy', href: '#' },
      ],
    },
    connect: {
      title: 'Connect With Us',
      links: [
        { label: 'Contact Us', href: '#' },
        { label: 'Support', href: '#' },
        { label: 'Feedback', href: '#' },
        { label: 'Partnerships', href: '#' },
      ],
    },
  };

  const socialLinks = [
    { icon: Code, href: '#', label: 'Code' },
    { icon: Share2, href: '#', label: 'Share' },
    { icon: Rss, href: '#', label: 'RSS' },
    { icon: Send, href: '#', label: 'Contact' },
  ];

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
      transition: { duration: 0.5 },
    },
  };

  return (
    <footer className="bg-dark-navy text-light-bg border-t border-dark-navy/50">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12"
        >
          {/* Brand Column */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-10 h-10 bg-gradient-to-br from-accent to-accent/70 rounded-lg flex items-center justify-center group-hover:shadow-lg group-hover:shadow-accent/50 transition-shadow">
                <span className="text-white font-bold text-lg">CF</span>
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-lg leading-none">
                  CrunchFit
                </span>
                <span className="text-accent text-xs font-semibold">Pro</span>
              </div>
            </Link>

            <p className="text-light-bg/70 text-sm mb-4">
              Transform your fitness journey with world-class gyms and personal training.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    whileHover={{ scale: 1.2, color: '#E94560' }}
                    whileTap={{ scale: 0.95 }}
                    className="text-light-bg/70 hover:text-accent transition-colors duration-200"
                  >
                    <Icon size={20} />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Footer Sections */}
          {Object.values(sections).map((section, idx) => (
            <motion.div
              key={section.title}
              variants={itemVariants}
              className="lg:col-span-1"
            >
              <h3 className="text-white font-bold text-base mb-4 text-accent">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <motion.li
                    key={link.label}
                    whileHover={{ x: 5 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  >
                    <Link
                      to={link.href}
                      className="text-light-bg/70 hover:text-accent text-sm transition-colors duration-200 inline-block"
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Contact Info Section */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 pt-8 border-t border-dark-navy/50"
        >
          {/* Phone */}
          <motion.a
            href="tel:+1234567890"
            whileHover={{ x: 5 }}
            className="flex items-center gap-3 group cursor-pointer"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all duration-200">
              <Phone size={20} className="text-accent group-hover:text-white" />
            </div>
            <div>
              <p className="text-xs text-light-bg/60 uppercase tracking-wide">Phone</p>
              <p className="text-light-bg font-semibold">+1 (234) 567-890</p>
            </div>
          </motion.a>

          {/* Email */}
          <motion.a
            href="mailto:support@crunchfit.com"
            whileHover={{ x: 5 }}
            className="flex items-center gap-3 group cursor-pointer"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all duration-200">
              <Mail size={20} className="text-accent group-hover:text-white" />
            </div>
            <div>
              <p className="text-xs text-light-bg/60 uppercase tracking-wide">Email</p>
              <p className="text-light-bg font-semibold">support@crunchfit.com</p>
            </div>
          </motion.a>

          {/* Address */}
          <motion.div
            whileHover={{ x: 5 }}
            className="flex items-center gap-3"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <MapPin size={20} className="text-accent" />
            </div>
            <div>
              <p className="text-xs text-light-bg/60 uppercase tracking-wide">Location</p>
              <p className="text-light-bg font-semibold">Multiple Locations</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Newsletter Signup Section */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-r from-accent/10 to-secondary/10 rounded-xl p-6 md:p-8 mb-12 border border-accent/20"
        >
          <div className="max-w-md">
            <h3 className="text-white font-bold text-lg mb-2">
              Stay Updated on Deals & Tips
            </h3>
            <p className="text-light-bg/70 text-sm mb-4">
              Subscribe to our newsletter for fitness tips and exclusive member offers.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-dark-navy/50 border border-dark-navy/50 rounded-lg text-light-bg placeholder-light-bg/40 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all duration-200 text-sm"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-accent hover:bg-accent/90 text-white font-semibold rounded-lg transition-colors duration-200 text-sm"
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <motion.div
        variants={itemVariants}
        className="border-t border-dark-navy/50 bg-dark-navy/50 py-6"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <div className="flex items-center gap-1 text-light-bg/70 text-sm">
              <span>© {currentYear} CrunchFit Pro. All rights reserved.</span>
              <Heart size={16} className="text-accent ml-1" fill="currentColor" />
            </div>

            {/* Legal Links */}
            <div className="flex items-center gap-6 text-sm">
              <Link
                to="#"
                className="text-light-bg/70 hover:text-accent transition-colors duration-200"
              >
                Terms of Service
              </Link>
              <Link
                to="#"
                className="text-light-bg/70 hover:text-accent transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link
                to="#"
                className="text-light-bg/70 hover:text-accent transition-colors duration-200"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
