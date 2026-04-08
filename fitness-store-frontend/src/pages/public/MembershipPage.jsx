import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Check, X, ArrowRight } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import SEO from '../../components/seo/SEO';

const MembershipPage = () => {
  const navigate = useNavigate();
  const appUrl = import.meta.env.VITE_APP_URL || 'http://localhost:5173';
  const [billingPeriod, setBillingPeriod] = useState('monthly');

  const scrollToSection = (id) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const plans = [
    {
      name: 'BASE',
      monthlyPrice: 9.99,
      annualPrice: 99.99,
      popular: true,
      badge: 'Most Popular',
      description: 'Perfect for getting started',
      features: [
        'Access to home gym',
        'Locker room access',
        '2 guest passes per year',
        'Basic app access',
      ],
      cta: 'Join Now',
      color: 'primary',
    },
    {
      name: 'PEAK',
      monthlyPrice: 21.99,
      annualPrice: 219.99,
      popular: false,
      badge: 'Best Value',
      description: 'Everything you need',
      features: [
        'All Base features +',
        'Unlimited tanning',
        'HydroMassage access',
        'Reciprocal access (all locations)',
        'Premium app features',
      ],
      cta: 'Choose Plan',
      color: 'secondary',
    },
    {
      name: 'PEAK RESULTS',
      monthlyPrice: 29.99,
      annualPrice: 299.99,
      popular: false,
      badge: 'Upgrade',
      description: 'Transform your body',
      features: [
        'All Peak features +',
        '1 personal training session/month',
        'Nutrition app access',
        'Performance tracking',
        'Priority support',
      ],
      cta: 'Choose Plan',
      color: 'accent',
    },
    {
      name: 'PEAK PLUS',
      monthlyPrice: 34.99,
      annualPrice: 349.99,
      popular: false,
      badge: 'Ultimate',
      description: 'Complete transformation',
      features: [
        'All Peak Results features +',
        'Unlimited Crunch+',
        'Unlimited personal training',
        'Nutrition coaching',
        'Priority class booking',
        'VIP concierge',
      ],
      cta: 'Choose Plan',
      color: 'accent',
    },
  ];

  const comparisonFeatures = [
    { category: 'Gym Access', features: [
      { name: 'Single location access', base: true, peak: false, results: false, plus: false },
      { name: 'All Crunch locations', base: false, peak: true, results: true, plus: true },
      { name: 'Reciprocal access', base: false, peak: true, results: true, plus: true },
    ]},
    { category: 'Fitness Services', features: [
      { name: 'Group fitness classes', base: true, peak: true, results: true, plus: true },
      { name: 'Monthly PT sessions', base: false, peak: false, results: true, plus: true },
      { name: 'Unlimited PT', base: false, peak: false, results: false, plus: true },
      { name: 'Nutrition coaching', base: false, peak: false, results: false, plus: true },
    ]},
    { category: 'Amenities', features: [
      { name: 'Locker room access', base: true, peak: true, results: true, plus: true },
      { name: 'Unlimited tanning', base: false, peak: true, results: true, plus: true },
      { name: 'HydroMassage access', base: false, peak: true, results: true, plus: true },
      { name: '2 guest passes/year', base: true, peak: false, results: false, plus: false },
    ]},
    { category: 'Digital', features: [
      { name: 'Crunch+ library', base: false, peak: false, results: false, plus: true },
      { name: 'Nutrition app', base: false, peak: false, results: true, plus: true },
      { name: 'Performance tracking', base: false, peak: false, results: true, plus: true },
      { name: 'Mobile app premium', base: false, peak: true, results: true, plus: true },
    ]},
  ];

  const currentPrice = billingPeriod === 'annual';
  const annualSavings = 20;

  return (
    <>
      <SEO
        title="Membership Plans"
        description="Compare CrunchFit Pro membership plans with pricing, features, and benefits to choose the perfect fit."
        canonical={`${appUrl}/membership`}
      />
      <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-dark-navy"
    >
      {/* HERO SECTION */}
      <section className="relative h-96 bg-gradient-to-b from-dark-navy via-dark-navy/95 to-dark-navy flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-dark-navy/90 to-transparent z-10" />
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 50%, rgba(233, 69, 96, 0.3) 0%, transparent 50%)',
          }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        <div className="relative z-20 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold text-white mb-4"
          >
            Choose Your Plan
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-light-bg/80 text-xl"
          >
            Start your fitness journey today
          </motion.p>
        </div>
      </section>

      {/* BILLING TOGGLE */}
      <section className="bg-dark-navy py-8 border-b border-accent/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center gap-6">
          <span className={`text-lg font-semibold ${billingPeriod === 'monthly' ? 'text-white' : 'text-light-bg/60'}`}>
            Monthly
          </span>
          <motion.button
            onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'annual' : 'monthly')}
            className="relative inline-flex h-12 w-24 items-center rounded-full bg-dark-navy/50 border border-accent/30 hover:border-accent transition-all"
            whileHover={{ borderColor: '#E94560' }}
          >
            <motion.div
              className="h-10 w-10 rounded-full bg-accent flex items-center justify-center"
              animate={{ x: billingPeriod === 'annual' ? 52 : 4 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </motion.button>
          <div>
            <span className={`text-lg font-semibold ${billingPeriod === 'annual' ? 'text-white' : 'text-light-bg/60'}`}>
              Annual
            </span>
            <Badge variant="success" size="sm" className="ml-2">
              Save {annualSavings}%
            </Badge>
          </div>
        </div>
      </section>

      {/* PLANS SECTION */}
      <section className="bg-dark-navy py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <Card
                  variant={plan.popular ? 'dark-hover' : 'dark'}
                  className={`h-full relative cursor-pointer ${plan.popular ? 'ring-2 ring-accent' : ''}`}
                  onClick={() => {
                    const planId = plan.name.toLowerCase().replace(' ', '-');
                    localStorage.setItem('selectedPlan', planId);
                    navigate('/join');
                  }}
                >
                  {plan.popular && (
                    <div className={`absolute -top-4 left-1/2 -translate-x-1/2`}>
                      <Badge variant="primary" size="lg">
                        {plan.badge}
                      </Badge>
                    </div>
                  )}

                  <div className="p-8 h-full flex flex-col">
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <p className="text-light-bg/70 text-sm mb-6">{plan.description}</p>

                    {/* Price */}
                    <div className="mb-6">
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-white">
                          ${currentPrice ? (plan.annualPrice / 12).toFixed(2) : plan.monthlyPrice}
                        </span>
                        <span className="text-light-bg/60">/month</span>
                      </div>
                      {currentPrice && (
                        <p className="text-accent text-sm mt-2">
                          ${plan.annualPrice}/year (Save {annualSavings}%)
                        </p>
                      )}
                    </div>

                    {/* Features */}
                    <ul className="space-y-3 mb-8 flex-grow">
                      {plan.features.map((feature, fidx) => (
                        <li key={fidx} className="flex items-start gap-3">
                          <Check size={18} className="text-accent flex-shrink-0 mt-0.5" />
                          <span className="text-light-bg/80 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <Button
                      variant={plan.popular ? 'primary' : 'outline'}
                      size="md"
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        const planId = plan.name.toLowerCase().replace(' ', '-');
                        localStorage.setItem('selectedPlan', planId);
                        navigate('/join');
                      }}
                    >
                      {plan.cta}
                      <ArrowRight size={16} className="ml-2" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARISON TABLE */}
      <section id="faq-section" className="bg-dark-navy py-12 md:py-20 border-t border-accent/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Compare All Features</h2>
            <p className="text-light-bg/70 text-lg">
              Detailed breakdown of what's included in each plan
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="overflow-x-auto"
          >
            <table className="w-full">
              <thead>
                <tr className="border-b border-accent/20">
                  <th className="text-left p-4 font-bold text-white w-1/3">Feature</th>
                  <th className="text-center p-4 font-bold text-white">BASE</th>
                  <th className="text-center p-4 font-bold text-white">PEAK</th>
                  <th className="text-center p-4 font-bold text-white">PEAK RESULTS</th>
                  <th className="text-center p-4 font-bold text-white">PEAK PLUS</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((group, gidx) => (
                  <React.Fragment key={gidx}>
                    {/* Category Header */}
                    <tr>
                      <td colSpan={5} className="p-4 bg-dark-navy/50 border-t border-accent/10">
                        <h4 className="font-bold text-accent text-sm">{group.category}</h4>
                      </td>
                    </tr>
                    {/* Features */}
                    {group.features.map((feature, fidx) => (
                      <tr
                        key={fidx}
                        className={`border-b border-accent/10 ${fidx % 2 === 0 ? 'bg-dark-navy/30' : ''}`}
                      >
                        <td className="p-4 text-light-bg/80 text-sm">{feature.name}</td>
                        <td className="text-center p-4">
                          {feature.base ? (
                            <Check size={20} className="text-accent mx-auto" />
                          ) : (
                            <X size={20} className="text-light-bg/30 mx-auto" />
                          )}
                        </td>
                        <td className="text-center p-4">
                          {feature.peak ? (
                            <Check size={20} className="text-accent mx-auto" />
                          ) : (
                            <X size={20} className="text-light-bg/30 mx-auto" />
                          )}
                        </td>
                        <td className="text-center p-4">
                          {feature.results ? (
                            <Check size={20} className="text-accent mx-auto" />
                          ) : (
                            <X size={20} className="text-light-bg/30 mx-auto" />
                          )}
                        </td>
                        <td className="text-center p-4">
                          {feature.plus ? (
                            <Check size={20} className="text-accent mx-auto" />
                          ) : (
                            <X size={20} className="text-light-bg/30 mx-auto" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="bg-dark-navy py-12 md:py-20 border-t border-accent/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-2">Frequently Asked Questions</h2>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                q: 'Can I change plans anytime?',
                a: '100% flexible. Change or cancel your plan anytime with no penalty.',
                action: () => navigate('/contact'),
              },
              {
                q: 'Do you offer a trial?',
                a: 'Yes! Start with a 7-day free trial on any plan. No credit card required.',
                action: () => navigate('/free-trial'),
              },
              {
                q: 'Are there contracts?',
                a: 'No contracts. You can cancel anytime through your account settings.',
                action: () => navigate('/contact'),
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards, PayPal, and Apple/Google Pay.',
                action: () => navigate('/contact'),
              },
              {
                q: 'Do I get a refund if I cancel?',
                a: 'Refunds available within 30 days of signup. Otherwise, service continues until billing date.',
                action: () => navigate('/contact'),
              },
            ].map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="cursor-pointer p-6 rounded-lg border border-accent/20 hover:border-accent/50 transition-all"
                onClick={faq.action}
              >
                <h3 className="font-bold text-white mb-2">{faq.q}</h3>
                <p className="text-light-bg/70 text-sm">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="bg-gradient-to-r from-accent/20 to-secondary/20 py-12 md:py-16 border-t border-accent/20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Start?
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button onClick={() => navigate('/free-trial')} variant="primary" size="lg">
                Start Your Free Trial
              </Button>
              <Button onClick={() => scrollToSection('faq-section')} variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
      </motion.div>
    </>
  );
};

export default MembershipPage;
