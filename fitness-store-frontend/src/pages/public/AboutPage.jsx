import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart, Users, Zap, Target, Award, Globe, MapPin, Star, Activity } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import SEO from '../../components/seo/SEO';

const AboutPage = () => {
  const navigate = useNavigate();
  const appUrl = import.meta.env.VITE_APP_URL || 'http://localhost:5173';
  const values = [
    {
      icon: Heart,
      title: 'Positivity',
      description: 'Every rep, every session builds confidence. We celebrate every milestone, no matter how small.',
      color: 'from-accent/20 to-transparent',
    },
    {
      icon: Users,
      title: 'Inclusivity',
      description: 'All bodies, all fitness levels, all goals. Welcome here. No judgment, just support.',
      color: 'from-secondary/20 to-transparent',
    },
    {
      icon: Zap,
      title: 'Fun',
      description: 'Fitness should be enjoyable. Great music, great community, great results.',
      color: 'from-primary/20 to-transparent',
    },
  ];

  const timeline = [
    {
      year: '2010',
      title: 'The Beginning',
      description: 'Crunch Fitness founded with a simple mission: fitness for everyone.',
      icon: Zap,
    },
    {
      year: '2015',
      title: 'First 100 Gyms',
      description: 'Expanded to 100+ locations across North America.',
      icon: MapPin,
    },
    {
      year: '2018',
      title: 'Digital Revolution',
      description: 'Launched Crunch+ streaming platform for at-home workouts.',
      icon: Activity,
    },
    {
      year: '2021',
      title: 'Community Milestone',
      description: 'Reached 1 million active members across all platforms.',
      icon: Users,
    },
    {
      year: '2023',
      title: 'Global Expansion',
      description: 'Opened first international locations in Europe and Asia.',
      icon: Globe,
    },
    {
      year: '2024',
      title: 'Today',
      description: 'Serving fitness enthusiasts with premium gyms and digital content worldwide.',
      icon: Star,
    },
  ];

  const pressLogos = [
    'Forbes',
    'Time Magazine',
    'Women\'s Health',
    'Men\'s Journal',
    'Shape',
    'Variety',
  ];

  const stats = [
    { number: '250+', label: 'Gym Locations' },
    { number: '2M+', label: 'Active Members' },
    { number: '500+', label: 'Workout Videos' },
    { number: '95%', label: 'Member Satisfaction' },
  ];

  return (
    <>
      <SEO
        title="About CrunchFit Pro"
        description="Learn about CrunchFit Pro values, mission, and global fitness community built for all levels."
        canonical={`${appUrl}/about`}
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
            About Crunch Fitness
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-light-bg/80 text-xl"
          >
            Fitness for Everyone, Always
          </motion.p>
        </div>
      </section>

      {/* BRAND STORY */}
      <section className="bg-dark-navy py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-4xl font-bold text-white mb-8">Our Story</h2>
            <div className="space-y-6 text-light-bg/80 text-lg leading-relaxed">
              <p>
                Crunch Fitness was born from frustration. Our founders saw gyms that intimidated members, charged excessive fees, and lacked community. They dreamed of something different—a place where fitness was accessible, affordable, and above all, fun.
              </p>
              <p>
                In 2010, the first Crunch gym opened its doors with a radical philosophy: <span className="text-accent font-semibold">#NoJudgments</span>. No criticism, no shame, no exclusivity. Just pure passion for helping people become their best selves.
              </p>
              <p>
                Today, Crunch serves over 2 million members across 250+ locations worldwide. But our core mission remains unchanged: to prove that fitness isn't about fitting in—it's about becoming who you want to be.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* #NOJUDGMENTS PHILOSOPHY */}
      <section className="bg-gradient-to-r from-accent/10 to-secondary/10 py-12 md:py-20 border-y border-accent/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h2 className="text-4xl font-bold text-white mb-4">#NoJudgments</h2>
            <p className="text-light-bg/80 text-xl mb-8">
              Our founding principle that guides everything we do
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: Heart,
                  title: 'No judgment on your body',
                  desc: 'Every body is a good body. We celebrate all shapes, sizes, and fitness levels.',
                },
                {
                  icon: Target,
                  title: 'No judgment on your goals',
                  desc: 'Whether you want to lose weight, gain muscle, or just feel better, your goals matter.',
                },
                {
                  icon: Users,
                  title: 'No judgment on your journey',
                  desc: 'Starting at square one? Starting over? We support you every step of the way.',
                },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-8 rounded-lg bg-dark-navy/50 border border-accent/20 hover:border-accent/50 transition-all"
                >
                  <div className="mb-4 inline-flex rounded-2xl border border-accent/30 bg-accent/10 p-3">
                    <item.icon size={28} className="text-accent" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-light-bg/70">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="bg-dark-navy py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Our Core Values</h2>
            <p className="text-light-bg/70 text-lg">
              The pillars that define who we are
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, idx) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -10 }}
                >
                  <Card variant="dark-hover" className="h-full">
                    <div className={`h-32 bg-gradient-to-r ${value.color} rounded-t-lg flex items-center justify-center`}>
                      <Icon size={48} className="text-accent" />
                    </div>
                    <div className="p-8">
                      <h3 className="text-2xl font-bold text-white mb-3">{value.title}</h3>
                      <p className="text-light-bg/70">{value.description}</p>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="bg-gradient-to-r from-accent/10 to-accent/5 py-12 md:py-20 border-y border-accent/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-accent mb-2">
                  {stat.number}
                </div>
                <p className="text-light-bg/80 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="bg-dark-navy py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Our Journey</h2>
            <p className="text-light-bg/70 text-lg">
              Key milestones in Crunch's evolution
            </p>
          </motion.div>

          <div className="space-y-8">
            {timeline.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex gap-6 items-start"
              >
                {/* Timeline dot */}
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-xl font-bold">
                    <item.icon size={20} className="text-dark-navy" />
                  </div>
                  {idx !== timeline.length - 1 && (
                    <div className="w-1 h-20 bg-accent/30 mt-4" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-grow pt-2">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                    <h3 className="text-2xl font-bold text-white">{item.year}</h3>
                    <Badge variant="primary">{item.title}</Badge>
                  </div>
                  <p className="text-light-bg/70">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRESS & RECOGNITION */}
      <section className="bg-gradient-to-r from-dark-navy/50 to-dark-navy py-12 md:py-20 border-t border-accent/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">As Featured In</h2>
            <p className="text-light-bg/70">
              Recognized by leading publications
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {pressLogos.map((publication, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="h-24 rounded-lg border border-accent/20 hover:border-accent/50 hover:bg-accent/10 transition-all flex items-center justify-center p-4 text-center"
              >
                <p className="font-semibold text-light-bg/80 text-sm">{publication}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* JOIN COMMUNITY */}
      <section className="bg-gradient-to-r from-accent/20 to-secondary/20 py-12 md:py-16 border-t border-accent/20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Join Our Community
            </h2>
            <p className="text-light-bg/80 text-lg mb-8">
              Become part of the fitness revolution. No judgments. Just gains.
            </p>
            <Button onClick={() => navigate('/free-trial')} variant="primary" size="lg">
              Start Your Free Trial
            </Button>
          </motion.div>
        </div>
      </section>
      </motion.div>
    </>
  );
};

export default AboutPage;
