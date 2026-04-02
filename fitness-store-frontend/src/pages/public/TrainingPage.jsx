import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import {
  CheckCircle,
  Zap,
  Users,
  Trophy,
  Award,
  Star,
  ArrowRight,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Rating from '../../components/ui/Rating';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const TrainingPage = () => {
  const navigate = useNavigate();

  const benefits = [
    { icon: '🎯', label: 'Custom Workout Plans', desc: 'Tailored to your goals and fitness level' },
    { icon: '📈', label: 'Progress Tracking', desc: 'Real-time metrics and improvement monitoring' },
    { icon: '💪', label: 'Motivation & Accountability', desc: 'One-on-one support every step' },
    { icon: '🏆', label: 'Expert Guidance', desc: 'Certified trainers with 5+ years experience' },
  ];

  const certifications = [
    { name: 'NASM', acronym: 'ACE' },
    { name: 'ISSA', acronym: 'CPT' },
    { name: 'NCCPT', acronym: 'IYCA' },
    { name: 'IFPA', acronym: 'ACE' },
  ];

  const equipment = [
    { name: 'Battle Ropes', emoji: '🔗' },
    { name: 'Kettlebells', emoji: '⚫' },
    { name: 'TRX Straps', emoji: '🎯' },
    { name: 'Bulgarian Bags', emoji: '💼' },
    { name: 'Medicine Balls', emoji: '🏋️' },
    { name: 'Resistance Bands', emoji: '🟦' },
  ];

  const trainers = [
    {
      name: 'Marcus Johnson',
      specialty: 'Strength & Conditioning',
      experience: 8,
      rating: 4.9,
      reviews: 127,
      image: '👨‍🏫',
      bio: 'NASM Certified, specializes in powerlifting',
    },
    {
      name: 'Sarah Martinez',
      specialty: 'HIIT & Cardio',
      experience: 6,
      rating: 4.8,
      reviews: 98,
      image: '👩‍🏫',
      bio: 'Expert in high-intensity interval training',
    },
    {
      name: 'James Chen',
      specialty: 'Flexibility & Recovery',
      experience: 10,
      rating: 4.9,
      reviews: 156,
      image: '👨',
      bio: 'Specializes in mobility and injury prevention',
    },
    {
      name: 'Emma Wilson',
      specialty: 'Nutrition & Wellness',
      experience: 7,
      rating: 4.8,
      reviews: 112,
      image: '👩',
      bio: 'Certified nutritionist and wellness coach',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-dark-navy"
    >
      {/* HERO SECTION */}
      <section className="relative h-screen bg-gradient-to-b from-dark-navy via-dark-navy/95 to-dark-navy flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
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

        <div className="relative z-20 max-w-4xl mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6"
          >
            Goals Are Made to Be <span className="text-accent">Crushed</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-light-bg/80 text-xl md:text-2xl mb-8 max-w-2xl mx-auto"
          >
            Get expert coaching from certified personal trainers dedicated to your success
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button onClick={() => navigate('#trainers')} variant="primary" size="lg">
              Book a Session
            </Button>
            <Button onClick={() => navigate('/free-trial')} variant="outline" size="lg">
              Free Trial
            </Button>
          </motion.div>
        </div>

        {/* Hero Image Placeholder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="absolute right-0 bottom-0 opacity-20 z-0 hidden lg:block"
        >
          <div className="text-9xl">💪</div>
        </motion.div>
      </section>

      {/* BENEFITS SECTION */}
      <section className="bg-dark-navy py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              One-on-One Personal Training
            </h2>
            <p className="text-light-bg/70 text-lg max-w-2xl mx-auto">
              Transform your body and mind with personalized coaching from certified professionals
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <Card variant="dark-hover">
                  <div className="p-6 text-center h-full flex flex-col items-center justify-center">
                    <div className="text-4xl mb-4">{benefit.icon}</div>
                    <h3 className="text-lg font-bold text-white mb-2">{benefit.label}</h3>
                    <p className="text-light-bg/70 text-sm">{benefit.desc}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CERTIFICATIONS SECTION */}
      <section className="bg-dark-navy/80 border-y border-accent/20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h3 className="text-white font-bold text-lg mb-2">Certified Trainers</h3>
            <p className="text-light-bg/70">Industry-leading certifications and credentials</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {certifications.map((cert, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center justify-center p-4 rounded-lg border border-accent/30 hover:border-accent transition-all"
              >
                <div className="text-center">
                  <div className="text-accent font-bold text-lg">{cert.name}</div>
                  <div className="text-light-bg/60 text-xs">{cert.acronym}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SMALL GROUP TRAINING */}
      <section className="bg-dark-navy py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <h2 className="text-4xl font-bold text-white mb-4">
                Small Group Training
              </h2>
              <p className="text-light-bg/70 text-lg mb-6">
                Get the benefits of personal training in an energetic group setting. Train with 3-5 people at the same fitness level and dramatically reduce costs while maintaining personalization.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <CheckCircle className="text-accent" size={20} />
                  <span className="text-light-bg/80">Lower cost than 1-on-1 training</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="text-accent" size={20} />
                  <span className="text-light-bg/80">Social accountability & motivation</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="text-accent" size={20} />
                  <span className="text-light-bg/80">Customized for group goals</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="text-accent" size={20} />
                  <span className="text-light-bg/80">Same expert trainer guidance</span>
                </li>
              </ul>
              <Button variant="primary" size="lg">
                Book Group Session
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="relative h-96 rounded-xl overflow-hidden bg-gradient-to-br from-accent/20 to-secondary/20 flex items-center justify-center"
            >
              <span className="text-9xl">👥</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* HIITZONE SECTION */}
      <section className="bg-gradient-to-r from-accent/10 to-secondary/10 py-12 md:py-20 border-y border-accent/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Badge variant="primary" size="lg" className="mb-4">
              Exclusive Program
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              HIITZone Program
            </h2>
            <p className="text-light-bg/70 text-lg max-w-2xl mx-auto">
              High-Intensity Interval Training proven to maximize fat burn and build lean muscle in minimal time
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-12">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <h3 className="text-2xl font-bold text-white mb-6">Premium Equipment</h3>
              <div className="grid grid-cols-2 gap-4">
                {equipment.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-dark-navy/50 border border-accent/20"
                  >
                    <span className="text-3xl">{item.emoji}</span>
                    <span className="text-light-bg/80 font-semibold">{item.name}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <h3 className="text-2xl font-bold text-white mb-6">Proven Results</h3>
              <div className="space-y-4">
                {[
                  { metric: '45%', label: 'Avg Weight Loss (12 weeks)' },
                  { metric: '30%', label: 'Metabolism Boost' },
                  { metric: '8x', label: 'More Effective Than Steady Cardio' },
                  { metric: '95%', label: 'Member Satisfaction Rate' },
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="p-4 rounded-lg bg-dark-navy/50 border border-accent/20"
                  >
                    <div className="text-3xl font-bold text-accent">{item.metric}</div>
                    <div className="text-light-bg/80 text-sm">{item.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Button variant="primary" size="lg">
              Start HIITZone Training
            </Button>
          </motion.div>
        </div>
      </section>

      {/* NUTRITION SECTION */}
      <section className="bg-dark-navy py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="relative h-96 rounded-xl overflow-hidden bg-gradient-to-br from-accent/20 to-secondary/20 flex items-center justify-center"
            >
              <span className="text-9xl">🥗</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <h2 className="text-4xl font-bold text-white mb-4">
                Nutrition Coaching
              </h2>
              <p className="text-light-bg/70 text-lg mb-6">
                Partner with our nutritionists for personalized meal plans powered by dotFIT technology. Macro tracking, real-time adjustments, and science-backed guidance.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  'Custom macro calculations',
                  'Real-time meal planning app',
                  'Weekly progress reviews',
                  'Recipe database with 10,000+ options',
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle className="text-accent flex-shrink-0" size={20} />
                    <span className="text-light-bg/80">{item}</span>
                  </motion.div>
                ))}
              </div>

              <Button variant="primary" size="lg">
                Start Your Nutrition Plan
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* TRAINER CARDS SECTION */}
      <section className="bg-dark-navy py-12 md:py-20" id="trainers">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Featured Trainers
            </h2>
            <p className="text-light-bg/70 text-lg max-w-2xl mx-auto">
              Our elite team of certified professionals ready to transform your fitness journey
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trainers.map((trainer, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -10 }}
              >
                <Card variant="dark-hover">
                  <div className="h-full flex flex-col">
                    {/* Avatar */}
                    <div className="relative h-40 bg-gradient-to-br from-accent/30 to-secondary/30 rounded-t-lg flex items-center justify-center">
                      <span className="text-6xl">{trainer.image}</span>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-lg font-bold text-white mb-1">{trainer.name}</h3>
                      <p className="text-accent text-sm font-semibold mb-2">
                        {trainer.specialty}
                      </p>
                      <p className="text-light-bg/70 text-xs mb-4 flex-grow">
                        {trainer.experience} years of experience
                      </p>

                      {/* Rating */}
                      <div className="flex items-center justify-between mb-4">
                        <Rating value={trainer.rating} readonly size="sm" />
                        <span className="text-light-bg/60 text-xs">
                          ({trainer.reviews})
                        </span>
                      </div>

                      {/* CTA */}
                      <Button variant="primary" size="sm" className="w-full">
                        Book Session
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="bg-gradient-to-r from-accent/20 to-secondary/20 py-12 md:py-16 border-y border-accent/20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Transform?
            </h2>
            <p className="text-light-bg/80 text-lg mb-8">
              Book your free consultation with one of our trainers today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => navigate('/free-trial')} variant="primary" size="lg">
                Start Free Trial
              </Button>
              <Button variant="outline" size="lg">
                Schedule Consultation
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default TrainingPage;
