import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { MapPin, Mail, Phone, Clock, Send, ChevronDown } from 'lucide-react';
import { Disclosure } from '@headlessui/react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import toast from 'react-hot-toast';

const contactSchema = z.object({
  name: z.string().min(2, 'Name required'),
  email: z.string().email('Valid email required'),
  subject: z.string().min(5, 'Subject required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(contactSchema),
  });

  const gyms = [
    {
      id: 'ts',
      name: 'Times Square',
      address: '404 W 42nd St, New York, NY 10036',
      phone: '(212) 555-0100',
      email: 'times-square@crunch.com',
      hours: '5am - 12am',
      amenities: ['Pool', 'Rock Climbing', 'Sauna', 'Yoga Studio'],
    },
    {
      id: 'ev',
      name: 'East Village',
      address: '128 E Houston St, New York, NY 10002',
      phone: '(212) 555-0101',
      email: 'east-village@crunch.com',
      hours: '6am - 11pm',
      amenities: ['Boxing Ring', 'Spinning Studio', 'CrossFit', 'Tanning'],
    },
    {
      id: 'mt',
      name: 'Midtown',
      address: '750 3rd Ave, New York, NY 10017',
      phone: '(212) 555-0102',
      email: 'midtown@crunch.com',
      hours: '5:30am - 11:30pm',
      amenities: ['Olympic Pool', 'Basketball Court', 'Hydromassage', 'Bouldering'],
    },
  ];

  const faqItems = [
    {
      q: 'What are your gym hours?',
      a: 'Most locations are open 5am-12am, with some variation. Check your specific gym location for exact hours.',
    },
    {
      q: 'Can I have a guest?',
      a: 'BASE members get 2 guest passes per year. PEAK and higher plans get more frequent guest privileges. Guests must sign a waiver.',
    },
    {
      q: 'Do you offer childcare?',
      a: 'Yes, most Crunch locations offer supervised childcare during peak hours for members. Please ask staff for availability and age requirements.',
    },
    {
      q: 'What about parking?',
      a: 'Parking availability varies by location. Call your gym location for details on parking options and rates.',
    },
    {
      q: 'Can I freeze my membership?',
      a: 'Yes, you can freeze your membership for up to 3 months per year with no additional charges. Contact member services to arrange.',
    },
    {
      q: 'Do you offer personal training?',
      a: 'Yes! Personal training is available as add-ons or included in PEAK RESULTS and PEAK PLUS plans. Book a consultation with a trainer.',
    },
    {
      q: 'What happens if I forget my access card?',
      a: 'Contact your gym and we can either mail a replacement or provide temporary access. There is a $15 replacement fee.',
    },
    {
      q: 'Can I transfer to a different location?',
      a: 'Yes! PEAK members get reciprocal access to all Crunch locations. BASE members can pay a small fee to use other locations.',
    },
    {
      q: 'Is there a sign-up fee?',
      a: 'Your free trial has no fees. If you choose a paid plan, there is no sign-up fee—you only pay the monthly or annual rate.',
    },
    {
      q: 'How do I contact customer service?',
      a: 'You can reach us via phone at 1-800-CRUNCH-1, email at support@crunch.com, or through the contact form below.',
    },
    {
      q: 'Do you have group fitness classes?',
      a: 'Yes! We offer 100+ group fitness classes weekly including spin, yoga, zumba, HIIT, CrossFit, and more. All included with membership.',
    },
    {
      q: 'Can I do Crunch+ (streaming) outside the gym?',
      a: 'Yes! PEAK RESULTS and PEAK PLUS members get unlimited access to Crunch+ with 500+ on-demand and live workout videos.',
    },
    {
      q: 'What payment methods do you accept?',
      a: 'We accept major credit cards (Visa, Mastercard, American Express), PayPal, Apple Pay, and Google Pay.',
    },
    {
      q: 'How can I update my payment method?',
      a: 'Log into your member portal and go to Account Settings > Billing. You can update your payment method anytime.',
    },
    {
      q: 'What is your cancellation policy?',
      a: 'Members can cancel anytime with no contract. You can cancel online through your member portal or by calling our support team.',
    },
    {
      q: 'Do you offer wedding packages?',
      a: 'Yes! Our group fitness packages are perfect for bachelorette parties and pre-wedding group workouts. Contact your gym manager.',
    },
    {
      q: 'Are there any age restrictions?',
      a: 'Minors (13-17) can join with parental consent. Children under 13 can visit amenities with their parents but cannot use equipment unsupervised.',
    },
    {
      q: 'Can I purchase gift memberships?',
      a: 'Yes! Gift memberships are available for 1, 3, 6, or 12 months. Perfect for fitness enthusiasts. Go to our gift shop or call for details.',
    },
    {
      q: 'Do you hire personal trainers?',
      a: 'We are always looking for certified fitness professionals. Visit our careers page or contact your local gym manager for opportunities.',
    },
    {
      q: 'Where can I report a safety concern?',
      a: 'Please report any safety concerns immediately to the gym manager on duty or call 1-800-CRUNCH-1 to speak with management.',
    },
  ];

  const onSubmit = async (data) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Contact form:', data);
      setSubmitted(true);
      reset();
      toast.success('Message sent! We\'ll get back to you soon.');
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    }
  };

  return (
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
              'radial-gradient(circle at 80% 50%, rgba(233, 69, 96, 0.3) 0%, transparent 50%)',
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
            Contact Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-light-bg/80 text-xl"
          >
            We're here to help
          </motion.p>
        </div>
      </section>

      {/* CONTACT INFO CARDS */}
      <section className="bg-dark-navy py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <Card variant="dark-hover">
                <div className="p-8 text-center">
                  <Phone size={32} className="text-accent mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Call Us</h3>
                  <p className="text-light-bg/70 mb-4">1-800-CRUNCH-1</p>
                  <p className="text-sm text-light-bg/60">Available 7am-10pm EST</p>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card variant="dark-hover">
                <div className="p-8 text-center">
                  <Mail size={32} className="text-accent mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Email Us</h3>
                  <p className="text-light-bg/70 mb-4">support@crunch.com</p>
                  <p className="text-sm text-light-bg/60">Response within 24 hours</p>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card variant="dark-hover">
                <div className="p-8 text-center">
                  <MapPin size={32} className="text-accent mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Visit Us</h3>
                  <p className="text-light-bg/70 mb-4">250+ Locations</p>
                  <p className="text-sm text-light-bg/60">Worldwide</p>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CONTACT FORM & GYM FINDER */}
      <section className="bg-gradient-to-b from-dark-navy/50 to-dark-navy py-12 md:py-20 border-y border-accent/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* CONTACT FORM */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <h2 className="text-3xl font-bold text-white mb-6">Send us a Message</h2>

              <Card variant="dark" className="border border-accent/30">
                <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Your Name
                    </label>
                    <Input
                      placeholder="John Doe"
                      {...register('name')}
                      error={errors.name?.message}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      {...register('email')}
                      error={errors.email?.message}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Subject
                    </label>
                    <Input
                      placeholder="How can we help?"
                      {...register('subject')}
                      error={errors.subject?.message}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Message
                    </label>
                    <textarea
                      {...register('message')}
                      placeholder="Tell us more..."
                      rows={5}
                      className={`w-full px-4 py-3 rounded-lg bg-dark-navy/50 border transition-all text-white placeholder-light-bg/40 focus:outline-none resize-none ${
                        errors.message ? 'border-red-500' : 'border-accent/30 hover:border-accent/50 focus:border-accent'
                      }`}
                    />
                    {errors.message && (
                      <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                    <Send size={16} className="ml-2" />
                  </Button>

                  {submitted && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-4 rounded-lg bg-accent/10 border border-accent/30 text-accent text-sm"
                    >
                      ✓ Message sent successfully!
                    </motion.div>
                  )}
                </form>
              </Card>
            </motion.div>

            {/* GYM FINDER */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <h2 className="text-3xl font-bold text-white mb-6">Find a Gym</h2>

              <div className="space-y-4">
                {gyms.map((gym, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card variant="dark-hover" className="border border-accent/30">
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-white mb-4">{gym.name}</h3>

                        <div className="space-y-3 text-light-bg/80 text-sm mb-4">
                          <div className="flex items-start gap-3">
                            <MapPin size={16} className="text-accent flex-shrink-0 mt-0.5" />
                            <p>{gym.address}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <Phone size={16} className="text-accent" />
                            <a href={`tel:${gym.phone}`} className="hover:text-accent transition">
                              {gym.phone}
                            </a>
                          </div>
                          <div className="flex items-center gap-3">
                            <Mail size={16} className="text-accent" />
                            <a href={`mailto:${gym.email}`} className="hover:text-accent transition">
                              {gym.email}
                            </a>
                          </div>
                          <div className="flex items-center gap-3">
                            <Clock size={16} className="text-accent" />
                            <p>{gym.hours}</p>
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-xs text-accent font-semibold mb-2">AMENITIES</p>
                          <div className="flex flex-wrap gap-2">
                            {gym.amenities.map((amenity, aidx) => (
                              <span key={aidx} className="px-3 py-1 rounded-full bg-accent/20 text-accent text-xs">
                                {amenity}
                              </span>
                            ))}
                          </div>
                        </div>

                        <Button variant="outline" size="sm" className="w-full">
                          Get Directions
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="bg-dark-navy py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-light-bg/70 text-lg">
              Answers to common questions about memberships and gym services
            </p>
          </motion.div>

          <div className="space-y-3">
            {faqItems.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: (idx % 5) * 0.05 }}
              >
                <Disclosure>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="w-full p-5 rounded-lg border border-accent/20 hover:border-accent/50 bg-dark-navy/50 hover:bg-dark-navy/80 transition-all flex items-center justify-between group">
                        <span className="text-left font-semibold text-white group-hover:text-accent transition">
                          {item.q}
                        </span>
                        <ChevronDown
                          size={20}
                          className={`text-accent flex-shrink-0 transition-transform ${
                            open ? 'transform rotate-180' : ''
                          }`}
                        />
                      </Disclosure.Button>
                      <Disclosure.Panel className="px-5 py-4 text-light-bg/70 border-b border-accent/10 bg-dark-navy/30">
                        {item.a}
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SUPPORT CTA */}
      <section className="bg-gradient-to-r from-accent/20 to-secondary/20 py-12 md:py-16 border-t border-accent/20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Still have questions?
            </h2>
            <p className="text-light-bg/80 text-lg mb-8">
              Our team is here to help. Reach out anytime.
            </p>
            <Button variant="primary" size="lg">
              Start Your Free Trial
            </Button>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default ContactPage;
