import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, ChevronRight, Share2, Rss, Send } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const sections = [
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'Contact', href: '/contact' },
        { label: 'Careers', href: '#' },
        { label: 'Press', href: '#' },
      ],
    },
    {
      title: 'Membership',
      links: [
        { label: 'Plans', href: '/crunch-plus' },
        { label: 'Free Trial', href: '/free-trial' },
        { label: 'Classes', href: '/classes' },
        { label: 'Locations', href: '/locations' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', href: '#' },
        { label: 'Account', href: '/login' },
        { label: 'Accessibility', href: '#' },
        { label: 'Safety', href: '#' },
      ],
    },
  ];

  const socialLinks = [
    { icon: Share2, label: 'Social', href: '#' },
    { icon: Rss, label: 'News', href: '#' },
    { icon: Send, label: 'Updates', href: '#' },
  ];

  return (
    <footer className="mt-10 border-t border-slate-300/70 bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link to="/" className="group inline-flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-secondary shadow-lg shadow-accent/30 transition-transform duration-200 group-hover:scale-105">
                <span className="text-sm font-extrabold tracking-wide text-white">CF</span>
              </div>
              <div>
                <p className="text-base font-extrabold leading-none text-white">CrunchFit</p>
                <p className="mt-0.5 text-[11px] font-bold uppercase tracking-[0.18em] text-accent">Pro</p>
              </div>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-300">
              Professional coaching, modern facilities, and member-first training experiences built for consistent, long-term results.
            </p>

            <div className="mt-6 flex items-center gap-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    whileHover={{ y: -2 }}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 text-slate-300 transition-colors duration-200 hover:border-accent/60 hover:text-accent"
                  >
                    <Icon size={16} />
                  </motion.a>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 lg:col-span-8">
            {sections.map((section) => (
              <div key={section.title}>
                <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-slate-400">{section.title}</h3>
                <ul className="mt-4 space-y-3">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.href}
                        className="group inline-flex items-center gap-1 text-sm text-slate-300 transition-colors duration-200 hover:text-white"
                      >
                        <ChevronRight size={14} className="text-accent/70 transition-transform duration-200 group-hover:translate-x-0.5" />
                        <span>{link.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 border-t border-slate-800 pt-7 sm:grid-cols-3">
          <a href="tel:+1234567890" className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/70 p-3 text-sm text-slate-200 transition-colors duration-200 hover:border-accent/50 hover:text-white">
            <Phone size={16} className="text-accent" />
            <span>+1 (234) 567-890</span>
          </a>
          <a href="mailto:support@crunchfit.com" className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/70 p-3 text-sm text-slate-200 transition-colors duration-200 hover:border-accent/50 hover:text-white">
            <Mail size={16} className="text-accent" />
            <span>support@crunchfit.com</span>
          </a>
          <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/70 p-3 text-sm text-slate-200">
            <MapPin size={16} className="text-accent" />
            <span>Multiple Locations</span>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-3 border-t border-slate-800 pt-6 text-xs text-slate-400 sm:flex-row sm:items-center">
          <p>© {currentYear} CrunchFit Pro. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="#" className="hover:text-slate-200">Terms</Link>
            <Link to="#" className="hover:text-slate-200">Privacy</Link>
            <Link to="#" className="hover:text-slate-200">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
