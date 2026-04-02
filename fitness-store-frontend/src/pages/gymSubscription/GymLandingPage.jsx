import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Check,
  Users,
  Calendar,
  TrendingUp,
  Smartphone,
  Code,
  ChevronDown,
  Star,
  Shield,
  Zap,
  Lock,
  BarChart3,
  FileText,
} from 'lucide-react';
import { ThemeContext } from '../../contexts/ThemeContext';
import { LanguageContext } from '../../contexts/LanguageContext';

// Mock testimonials
const testimonials = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    gym: 'FitLife Gym',
    city: 'Austin, TX',
    quote:
      'CrunchFit Pro transformed how we manage our gym. Our members love the booking system, and we\'re saving 10 hours per week on admin.',
    photo: 'https://via.placeholder.com/100',
    rating: 5,
  },
  {
    id: 2,
    name: 'David Chen',
    gym: 'CrossFit Champions',
    city: 'San Francisco, CA',
    quote:
      'The revenue analytics feature is a game-changer. We can now identify trends and optimize our classes based on real data.',
    photo: 'https://via.placeholder.com/100',
    rating: 5,
  },
  {
    id: 3,
    name: 'Maria Rodriguez',
    gym: 'Yoga & Wellness Studio',
    city: 'Miami, FL',
    quote:
      'Simple to set up, intuitive to use, and our members are paying on time. The mobile app is absolutely beautiful.',
    photo: 'https://via.placeholder.com/100',
    rating: 5,
  },
];

// Mock pricing
const pricingPlans = [
  {
    id: 'starter',
    name: 'Starter',
    monthlyPrice: 99,
    annualPrice: 999,
    features: [
      'Up to 100 members',
      'Online class booking',
      '5 trainers',
      'Basic analytics',
      'Email support',
      'Mobile app access',
    ],
  },
  {
    id: 'professional',
    name: 'Professional',
    monthlyPrice: 299,
    annualPrice: 2999,
    features: [
      'Up to 1,000 members',
      'Online class booking + recurring schedules',
      'Unlimited trainers',
      'Advanced analytics & reports',
      'Priority email + phone support',
      'Mobile app + web portal',
      'Email marketing integration',
      'Custom branding',
    ],
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    monthlyPrice: 799,
    annualPrice: 7999,
    features: [
      'Unlimited members',
      'Full-featured booking + waitlist',
      'Unlimited trainers',
      'Business intelligence & forecasting',
      '24/7 phone + email support',
      'Mobile app + web portal + API',
      'Email marketing + SMS integration',
      'White-label solution',
      'Dedicated account manager',
    ],
  },
];

// Mock comparison data
const competitors = [
  { name: 'CrunchFit Pro', pricing: '$99-$799/mo', features: 'All-in-one', setup: '5 mins', contract: 'None' },
  { name: 'MindBody', pricing: '$199-$599/mo', features: 'Basic', setup: '2 weeks', contract: 'Required' },
  { name: 'Glofox', pricing: '$99-$499/mo', features: 'Class bookings', setup: '1 week', contract: 'Required' },
  { name: 'PushPress', pricing: '$199-$799/mo', features: 'Full-featured', setup: '3 days', contract: 'None' },
];

// Mock FAQ
const faqItems = [
  {
    question: 'How much does CrunchFit Pro cost?',
    answer:
      'We offer three plans: Starter ($99/mo), Professional ($299/mo, most popular), and Enterprise ($799/mo). All plans include a 14-day free trial.',
  },
  {
    question: 'Can I switch plans anytime?',
    answer: 'Yes! You can upgrade, downgrade, or cancel your plan anytime with no penalties. Changes take effect immediately.',
  },
  {
    question: 'Do I need a contract?',
    answer:
      'No contracts required. We believe in earning your business every month. Cancel anytime if you\'re not happy.',
  },
  {
    question: 'How do we migrate our members?',
    answer:
      'We handle the entire migration for you. Our team will import your member list, set up your classes, and train your staff. Free onboarding included.',
  },
  {
    question: 'Is there support available?',
    answer:
      'Yes! Starter plan includes email support. Professional and Enterprise plans include priority phone and email support with guaranteed response times.',
  },
  {
    question: 'Can we use our own branding?',
    answer:
      'Professional and Enterprise plans include custom branding. The member app can display your gym\'s logo, colors, and messaging.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit cards, bank transfers, and ACH payments. We use Stripe for secure payment processing.',
  },
  {
    question: 'Can we have multiple locations?',
    answer:
      'Yes! Enterprise plan supports unlimited locations. Professional supports up to 5 locations. Starter is single location.',
  },
  {
    question: 'Is our member data secure?',
    answer:
      'Absolutely. We use 256-bit encryption, are GDPR compliant, and maintain 99.9% uptime. Your data is backed up hourly.',
  },
  {
    question: 'Can we integrate with our existing tools?',
    answer:
      'Yes! Enterprise plan includes API access. We also integrate with popular tools like Mailchimp, Zapier, and Google Analytics.',
  },
];

const GymLandingPage = () => {
  const { theme } = useContext(ThemeContext);
  const { language } = useContext(LanguageContext);
  const isDark = theme === 'dark';

  const [billingCycle, setBillingCycle] = useState('monthly');
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const getPrice = (plan, cycle) => {
    return cycle === 'monthly' ? plan.monthlyPrice : Math.floor(plan.annualPrice / 12);
  };

  return (
    <div className={`${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 ${isDark ? 'bg-gray-800/95' : 'bg-white/95'} backdrop-blur border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-600">CrunchFit</div>
          <div className="flex gap-4">
            <a href="/for-gyms" className="text-sm font-medium hover:text-blue-600 transition-colors">
              For Gyms
            </a>
            <a href="/pricing" className="text-sm font-medium hover:text-blue-600 transition-colors">
              Pricing
            </a>
            <a href="/sign-in" className="text-sm font-medium hover:text-blue-600 transition-colors">
              Sign In
            </a>
            <a href="/gym-signup" className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Get Started
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={`pt-32 pb-20 px-6 ${isDark ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 to-white'}`}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
              Power Your Gym with <span className="text-blue-600">CrunchFit Pro</span>
            </h1>
            <p className={`text-xl mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              The all-in-one gym management platform that lets you focus on building an amazing community.
            </p>
            <div className="flex gap-4">
              <a
                href="/gym-signup"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                Start Free Trial
                <ArrowRight size={20} />
              </a>
              <a
                href="#pricing"
                className={`px-6 py-3 rounded-lg font-semibold border transition-colors flex items-center gap-2 ${
                  isDark ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-100'
                }`}
              >
                See Plans
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="h-96 rounded-lg overflow-hidden"
          >
            <img
              src="https://via.placeholder.com/600x400"
              alt="Gym interior"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            Running a Gym is Hard. <span className="text-blue-600">We Make the Tech Easy.</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Problems */}
            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="text-red-500">✕</span> The Problems
              </h3>
              <div className="space-y-4">
                {[
                  'Managing dozens of manual spreadsheets',
                  'Endless phone calls about class schedules',
                  'No visibility into your revenue',
                  'Chasing late payments from members',
                  'Outdated technology your members hate',
                  'Can\'t scale without hiring more staff',
                ].map((problem, i) => (
                  <div key={i} className={`flex gap-3 p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                    <span className="text-red-500 font-bold">•</span>
                    <p className="font-medium">{problem}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Solutions */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="text-green-500">✓</span> Our Solution
              </h3>
              <div className="space-y-4">
                {[
                  { icon: Users, text: 'Automated member management & check-ins' },
                  { icon: Calendar, text: 'Smart class scheduling & capacity planning' },
                  { icon: TrendingUp, text: 'Real-time revenue analytics & forecasts' },
                  { icon: Lock, text: 'Secure online payments & billing automation' },
                  { icon: Smartphone, text: 'Beautiful mobile app your members love' },
                  { icon: Zap, text: 'Everything integrates. No more silos.' },
                ].map(({ icon: Icon, text }, i) => (
                  <div key={i} className={`flex gap-3 p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                    <Icon size={24} className="text-green-500 flex-shrink-0" />
                    <p className="font-medium">{text}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className={`py-20 px-6 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Everything You Need</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: 'Member Management System',
                desc: 'Centralized member profiles, attendance tracking, waiver management, and member communication.',
              },
              {
                icon: Calendar,
                title: 'Online Class Booking',
                desc: 'Members book online 24/7. Recurring schedules, waitlists, automated reminders, and cancellations.',
              },
              {
                icon: BarChart3,
                title: 'Personal Trainer Scheduling',
                desc: 'Manage trainer schedules, assign certifications, track sessions, and automate billing.',
              },
              {
                icon: TrendingUp,
                title: 'Revenue Analytics',
                desc: 'Track MRR, member lifetime value, churn analysis, and identify your highest-value segments.',
              },
              {
                icon: Smartphone,
                title: 'Mobile-Ready Member App',
                desc: 'Your members get a beautiful iOS/Android app. Fully branded with your gym\'s identity.',
              },
              {
                icon: Code,
                title: 'White-Label Option',
                desc: 'Enterprise plan: Deploy with 100% your branding. Become a software platform yourself.',
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`p-8 rounded-lg border ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}
              >
                <feature.icon size={40} className="text-blue-600 mb-4" />
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">How We Compare</h2>

          <div className="overflow-x-auto">
            <table className={`w-full border-collapse border ${isDark ? 'border-gray-700' : 'border-gray-300'}`}>
              <thead>
                <tr className={isDark ? 'bg-gray-800' : 'bg-gray-100'}>
                  {['Feature', 'CrunchFit Pro', 'MindBody', 'Glofox', 'PushPress'].map((header) => (
                    <th key={header} className="p-4 text-left font-bold border-b border-gray-700">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { label: 'Pricing', crunchfit: '$99-$799/mo', mindody: '$199-$599/mo', glofox: '$99-$499/mo', pushpress: '$199-$799/mo' },
                  { label: 'Setup Time', crunchfit: '5 minutes', mindody: '2 weeks', glofox: '1 week', pushpress: '3 days' },
                  { label: 'Contract Required', crunchfit: '✗ No', mindody: '✓ Yes', glofox: '✓ Yes', pushpress: '✗ No' },
                  { label: 'Member Mobile App', crunchfit: '✓ Yes', mindody: '✓ Yes', glofox: '✓ Yes', pushpress: '✓ Yes' },
                  { label: 'White-Label Options', crunchfit: '✓ Yes (Ent)', mindody: '✗ No', glofox: '✗ No', pushpress: '✓ Yes' },
                  { label: 'API Access', crunchfit: '✓ Yes (Ent)', mindody: '✗ No', glofox: '✗ No', pushpress: '✓ Yes' },
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? (isDark ? 'bg-gray-800' : 'bg-gray-50') : ''}>
                    <td className="p-4 font-semibold border-b border-gray-700">{row.label}</td>
                    <td className="p-4 border-b border-gray-700 text-blue-600 font-semibold">{row.crunchfit}</td>
                    <td className="p-4 border-b border-gray-700">{row.mindody}</td>
                    <td className="p-4 border-b border-gray-700">{row.glofox}</td>
                    <td className="p-4 border-b border-gray-700">{row.pushpress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className={`py-20 px-6 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Loved by Gym Owners</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`p-8 rounded-lg border ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <Star key={j} size={16} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className={`mb-6 italic ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>"{testimonial.quote}"</p>

                <div className="flex gap-3 items-center">
                  <img
                    src={testimonial.photo}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover bg-gray-400"
                  />
                  <div>
                    <p className="font-bold">{testimonial.name}</p>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {testimonial.gym} • {testimonial.city}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Trust Badges */}
          <div className="mt-16 grid md:grid-cols-3 gap-8 text-center">
            {[
              { number: '500+', text: 'Gyms Powered' },
              { number: '200K+', text: 'Members Managed' },
              { number: '99.9%', text: 'Uptime Guaranteed' },
            ].map((badge, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl font-bold text-blue-600 mb-2">{badge.number}</div>
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>{badge.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">Simple, Transparent Pricing</h2>
          <p className={`text-center text-xl mb-10 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            No contracts, no hidden fees. Cancel anytime.
          </p>

          {/* Billing Toggle */}
          <div className="flex justify-center mb-12">
            <div className={`inline-flex rounded-lg border ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-gray-100'}`}>
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2 font-semibold transition-colors ${
                  billingCycle === 'monthly'
                    ? 'bg-blue-600 text-white'
                    : isDark
                    ? 'text-gray-400 hover:text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-6 py-2 font-semibold transition-colors ${
                  billingCycle === 'annual'
                    ? 'bg-blue-600 text-white'
                    : isDark
                    ? 'text-gray-400 hover:text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Annual
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`relative rounded-lg border p-8 transition-transform hover:scale-105 ${
                  plan.popular
                    ? isDark
                      ? 'border-blue-600 bg-gray-800 ring-2 ring-blue-600'
                      : 'border-blue-600 bg-white ring-2 ring-blue-600'
                    : isDark
                    ? 'border-gray-700 bg-gray-800'
                    : 'border-gray-300 bg-white'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-6 px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded-full">
                    Most Popular
                  </div>
                )}

                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">${getPrice(plan, billingCycle)}</span>
                  <span className={`ml-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>/month</span>
                  {billingCycle === 'annual' && (
                    <div className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Billed ${plan.annualPrice}/year
                    </div>
                  )}
                </div>

                <a
                  href="/gym-signup"
                  className={`w-full block text-center py-3 rounded-lg font-semibold mb-6 transition-colors ${
                    plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : isDark
                      ? 'border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
                      : 'border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
                  }`}
                >
                  Start Free 14-Day Trial
                </a>

                <div className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex gap-3">
                      <Check size={20} className="text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={`py-20 px-6 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Frequently Asked Questions</h2>

          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 5 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`rounded-lg border ${isDark ? 'border-gray-700 bg-gray-900' : 'border-gray-300 bg-white'}`}
              >
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === i ? null : i)}
                  className="w-full p-6 flex items-center justify-between hover:bg-opacity-50 transition-colors"
                >
                  <span className="font-semibold text-left">{item.question}</span>
                  <ChevronDown
                    size={20}
                    className={`transition-transform ${expandedFAQ === i ? 'rotate-180' : ''}`}
                  />
                </button>

                <AnimatePresence>
                  {expandedFAQ === i && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className={`border-t ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-gray-50'} px-6 py-4`}
                    >
                      <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>{item.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className={`py-20 px-6 ${isDark ? 'bg-gray-900' : 'bg-gradient-to-r from-blue-600 to-blue-700'} text-white`}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Grow Your Gym?</h2>
          <p className="text-xl mb-10 opacity-90">
            Join 500+ gym owners who are using CrunchFit Pro to run their business better.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/gym-signup"
              className="px-8 py-4 bg-white text-blue-600 rounded-lg font-bold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
            >
              Get Started Free
              <ArrowRight size={20} />
            </a>
            <a
              href="/contact"
              className="px-8 py-4 border-2 border-white text-white rounded-lg font-bold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Schedule a Demo
            </a>
          </div>

          <p className="text-sm opacity-75 mt-8">14-day free trial. No credit card required. Cancel anytime.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 px-6 border-t ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8 mb-8">
          {[
            { title: 'Product', links: ['Features', 'Pricing', 'Security'] },
            { title: 'Company', links: ['About', 'Blog', 'Careers'] },
            { title: 'Legal', links: ['Privacy', 'Terms', 'Contact'] },
            { title: 'Connect', links: ['Twitter', 'Facebook', 'Instagram'] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-bold mb-4">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className={`text-sm hover:text-blue-600 transition-colors ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-300'} pt-8 text-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          <p>&copy; 2024 CrunchFit Pro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default GymLandingPage;
