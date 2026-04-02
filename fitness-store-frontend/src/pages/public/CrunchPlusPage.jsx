import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Play, Zap, Users, Clock, CheckCircle } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const CrunchPlusPage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('live');

  const categories = [
    { id: 'live', label: 'Live Classes', icon: '🔴' },
    { id: 'ondemand', label: 'On-Demand', icon: '⏱️' },
    { id: 'programs', label: 'Guided Programs', icon: '📅' },
  ];

  const liveClasses = [
    {
      title: 'Morning Power Yoga',
      instructor: 'Sarah Chen',
      time: 'Daily 6:00 AM',
      duration: 45,
      image: '🧘',
    },
    {
      title: 'HIIT Blast',
      instructor: 'Marcus Williams',
      time: 'MWF 5:30 PM',
      duration: 35,
      image: '🔥',
    },
    {
      title: 'Evening Strength',
      instructor: 'James Porter',
      time: 'TTh 6:00 PM',
      duration: 50,
      image: '💪',
    },
    {
      title: 'Dance Party Cardio',
      instructor: 'Rosa Martinez',
      time: 'Sat 10:00 AM',
      duration: 45,
      image: '💃',
    },
  ];

  const onDemandWorkouts = [
    {
      title: 'Quick Home Cardio',
      duration: 15,
      difficulty: 'Beginner',
      image: '🏃',
    },
    {
      title: 'Full Body Strength',
      duration: 30,
      difficulty: 'Intermediate',
      image: '🏋️',
    },
    {
      title: 'Core & Abs',
      duration: 20,
      difficulty: 'Advanced',
      image: '💪',
    },
    {
      title: 'Stretching & Recovery',
      duration: 25,
      difficulty: 'Beginner',
      image: '🧘',
    },
  ];

  const programs = [
    {
      title: '4-Week Fat Loss Program',
      weeks: 4,
      sessions: 16,
      image: '🔥',
      description: 'Intensive fat-burning program with daily workouts',
    },
    {
      title: '8-Week Strength Building',
      weeks: 8,
      sessions: 32,
      image: '💪',
      description: 'Progressive strength training for muscle gain',
    },
    {
      title: '6-Week Total Transformation',
      weeks: 6,
      sessions: 24,
      image: '✨',
      description: 'Complete body transformation program',
    },
  ];

  const features = [
    {
      icon: <Play size={24} />,
      title: '500+ Workouts',
      description: 'Unlimited access to our growing library',
    },
    {
      icon: <Users size={24} />,
      title: 'Live Classes',
      description: 'Real-time streaming with certified instructors',
    },
    {
      icon: <Clock size={24} />,
      title: 'On Your Schedule',
      description: 'Watch anytime, anywhere on any device',
    },
    {
      icon: <Zap size={24} />,
      title: 'New Content Weekly',
      description: 'Fresh workouts added every week',
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
            Your Gym is <span className="text-accent">Everywhere</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-light-bg/80 text-xl md:text-2xl mb-8 max-w-2xl mx-auto"
          >
            Stream live classes, access 500+ on-demand workouts, and follow guided programs from anywhere
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button variant="primary" size="lg">
              Start Free Trial
            </Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </motion.div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="bg-dark-navy py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card variant="dark-hover">
                  <div className="p-6 text-center h-full flex flex-col items-center justify-center">
                    <div className="text-accent mb-4">{feature.icon}</div>
                    <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-light-bg/70 text-sm">{feature.description}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTENT CATEGORY TABS */}
      <section className="sticky top-0 z-40 bg-dark-navy border-b border-accent/20 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 overflow-x-auto pb-0">
            {categories.map((cat) => (
              <motion.button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-6 py-3 rounded-full whitespace-nowrap font-semibold transition-all text-lg ${
                  selectedCategory === cat.id
                    ? 'bg-accent text-dark-navy'
                    : 'bg-dark-navy/50 text-light-bg/80 border border-accent/30 hover:border-accent'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {cat.icon} {cat.label}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* CONTENT DISPLAY */}
      <section className="bg-dark-navy py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            {selectedCategory === 'live' && (
              <motion.div
                key="live"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-white mb-2">Live Classes</h2>
                  <p className="text-light-bg/70">
                    Join real-time classes streamed daily with certified instructors
                  </p>
                </div>

                <Swiper
                  modules={[Navigation, Pagination, Autoplay]}
                  navigation
                  pagination={{ clickable: true }}
                  autoplay={{ delay: 5000 }}
                  slidesPerView={1}
                  breakpoints={{
                    768: { slidesPerView: 2 },
                    1024: { slidesPerView: 4 },
                  }}
                  className="w-full"
                >
                  {liveClasses.map((cls, idx) => (
                    <SwiperSlide key={idx}>
                      <Card variant="dark" className="h-full">
                        <div className="relative h-40 bg-gradient-to-br from-accent/30 to-secondary/30 rounded-t-lg flex items-center justify-center group overflow-hidden">
                          <span className="text-5xl">{cls.image}</span>
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                            <motion.div
                              initial={{ scale: 0 }}
                              whileHover={{ scale: 1 }}
                              className="w-12 h-12 rounded-full bg-accent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Play size={24} className="text-dark-navy fill-dark-navy" />
                            </motion.div>
                          </div>
                        </div>
                        <div className="p-6">
                          <Badge variant="primary" size="sm" className="mb-3">
                            🔴 LIVE
                          </Badge>
                          <h3 className="text-lg font-bold text-white mb-2">{cls.title}</h3>
                          <p className="text-accent text-sm font-semibold mb-3">
                            {cls.instructor}
                          </p>
                          <div className="flex items-center justify-between text-light-bg/70 text-sm">
                            <span>{cls.time}</span>
                            <span>{cls.duration} min</span>
                          </div>
                        </div>
                      </Card>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </motion.div>
            )}

            {selectedCategory === 'ondemand' && (
              <motion.div
                key="ondemand"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-white mb-2">On-Demand Workouts</h2>
                  <p className="text-light-bg/70">
                    Watch anytime with 500+ workouts in your library
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {onDemandWorkouts.map((workout, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <Card variant="dark-hover">
                        <div className="relative h-40 bg-gradient-to-br from-accent/30 to-secondary/30 rounded-t-lg flex items-center justify-center group overflow-hidden">
                          <span className="text-5xl">{workout.image}</span>
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                            <motion.div
                              initial={{ scale: 0 }}
                              whileHover={{ scale: 1 }}
                              className="w-12 h-12 rounded-full bg-accent flex items-center justify-center opacity-0 group-hover:opacity-100"
                            >
                              <Play size={24} className="text-dark-navy fill-dark-navy" />
                            </motion.div>
                          </div>
                        </div>
                        <div className="p-6">
                          <h3 className="text-lg font-bold text-white mb-2">
                            {workout.title}
                          </h3>
                          <div className="flex items-center justify-between text-light-bg/70 text-sm mb-4">
                            <span>{workout.duration} min</span>
                            <Badge size="sm" variant={
                              workout.difficulty === 'Beginner' ? 'success' :
                              workout.difficulty === 'Intermediate' ? 'primary' : 'danger'
                            }>
                              {workout.difficulty}
                            </Badge>
                          </div>
                          <Button variant="outline" size="sm" className="w-full">
                            Watch Now
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {selectedCategory === 'programs' && (
              <motion.div
                key="programs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-white mb-2">Guided Programs</h2>
                  <p className="text-light-bg/70">
                    Structured multi-week programs with daily guidance
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {programs.map((program, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ y: -10 }}
                    >
                      <Card variant="dark-hover" className="h-full">
                        <div className="relative h-48 bg-gradient-to-br from-accent/30 to-secondary/30 rounded-t-lg flex items-center justify-center">
                          <span className="text-7xl">{program.image}</span>
                        </div>
                        <div className="p-6 flex flex-col h-full">
                          <h3 className="text-2xl font-bold text-white mb-2">
                            {program.title}
                          </h3>
                          <p className="text-light-bg/70 text-sm mb-4 flex-grow">
                            {program.description}
                          </p>
                          <div className="space-y-2 mb-6 text-light-bg/80 text-sm">
                            <div className="flex items-center gap-2">
                              <CheckCircle size={16} className="text-accent" />
                              <span>{program.weeks} weeks</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle size={16} className="text-accent" />
                              <span>{program.sessions} sessions</span>
                            </div>
                          </div>
                          <Button variant="primary" size="md" className="w-full">
                            Start Program
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section className="bg-dark-navy py-12 md:py-20 border-t border-accent/20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Crunch+ Included in Premium Plans
            </h2>
            <p className="text-light-bg/70 text-lg mb-8">
              Upgrade to Peak Results or Peak Plus membership to get unlimited access to Crunch+<br/>
              or subscribe separately for $9.99/month
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button onClick={() => navigate('/membership')} variant="primary" size="lg">
                Compare Plans
              </Button>
              <Button variant="outline" size="lg">
                Subscribe Now
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 pt-12 border-t border-accent/20">
              <div className="text-left">
                <h3 className="text-xl font-bold text-white mb-4">Why Crunch+ is Better</h3>
                <ul className="space-y-3 text-light-bg/70">
                  <li className="flex items-center gap-3">
                    <CheckCircle size={20} className="text-accent flex-shrink-0" />
                    <span>500+ workouts (vs competitors' 100+)</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle size={20} className="text-accent flex-shrink-0" />
                    <span>New content every week</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle size={20} className="text-accent flex-shrink-0" />
                    <span>Live classes with real instructors</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle size={20} className="text-accent flex-shrink-0" />
                    <span>Offline download available</span>
                  </li>
                </ul>
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold text-white mb-4">What's Included</h3>
                <ul className="space-y-3 text-light-bg/70">
                  <li className="flex items-center gap-3">
                    <CheckCircle size={20} className="text-accent flex-shrink-0" />
                    <span>HD streaming on any device</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle size={20} className="text-accent flex-shrink-0" />
                    <span>Personalized recommendations</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle size={20} className="text-accent flex-shrink-0" />
                    <span>Community leaderboards</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle size={20} className="text-accent flex-shrink-0" />
                    <span>Progress tracking & stats</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default CrunchPlusPage;
