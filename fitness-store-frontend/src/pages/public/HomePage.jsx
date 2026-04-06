import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Star, MapPin, Heart, Users, Dumbbell, Activity, Zap, Flame, Sparkles, Award } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import Rating from '../../components/ui/Rating';
import SEO from '../../components/seo/SEO';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const HomePage = () => {
  const navigate = useNavigate();
  const appUrl = import.meta.env.VITE_APP_URL || 'http://localhost:5173';
  const [location, setLocation] = useState('');
  const [cycleIndex, setCycleIndex] = useState(0);
  const [counter, setCounter] = useState({ locations: 0, members: 0, classes: 0 });

  const cycleText = ['Get Stronger', 'Get Faster', 'Get Healthier'];
  const stats = [
    { label: 'Locations', value: 400, prefix: '' },
    { label: 'Members', value: 1000000, prefix: '1M+' },
    { label: 'Classes', value: 30, prefix: '' },
  ];

  // Text cycling animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCycleIndex((prev) => (prev + 1) % cycleText.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Counter animation
  useEffect(() => {
    const animateCounter = () => {
      const duration = 2000;
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        setCounter({
          locations: Math.floor(400 * progress),
          members: Math.floor(1000000 * progress),
          classes: Math.floor(30 * progress),
        });
        if (progress === 1) clearInterval(interval);
      }, 50);
    };
    animateCounter();
  }, []);

  const handleSearch = () => {
    if (location.trim()) {
      navigate(`/locations?search=${encodeURIComponent(location)}`);
    }
  };

  const classes = [
    { name: 'Strength', icon: Dumbbell, color: 'from-accent' },
    { name: 'Ride', icon: Activity, color: 'from-secondary' },
    { name: 'Mind Body', icon: Heart, color: 'from-blue-600' },
    { name: 'Dance', icon: Zap, color: 'from-pink-600' },
    { name: 'Cardio', icon: Flame, color: 'from-orange-600' },
    { name: 'Specialty', icon: Star, color: 'from-purple-600' },
  ];

  const testimonials = [
    {
      name: 'Sarah M.',
      location: 'New York',
      rating: 5,
      quote: 'Crunch changed my life! The no-judgments attitude is exactly what I needed.',
      avatar: 'SM',
    },
    {
      name: 'James D.',
      location: 'Los Angeles',
      rating: 5,
      quote: 'Best gym membership ever. Great equipment and amazing trainers!',
      avatar: 'JD',
    },
    {
      name: 'Maria L.',
      location: 'Chicago',
      rating: 5,
      quote: 'The variety of classes is incredible. I never get bored with my workouts.',
      avatar: 'ML',
    },
    {
      name: 'Alex T.',
      location: 'Houston',
      rating: 5,
      quote: 'The community vibe is unmatched. Everyone is supportive and encouraging.',
      avatar: 'AT',
    },
    {
      name: 'Jessica P.',
      location: 'Miami',
      rating: 5,
      quote: 'Clean facilities, friendly staff, and flexible hours. Perfect for my schedule!',
      avatar: 'JP',
    },
    {
      name: 'Marcus W.',
      location: 'Boston',
      rating: 5,
      quote: 'Personal trainers are top-notch. Saw results within weeks!',
      avatar: 'MW',
    },
  ];

  const membershipPlans = [
    { name: 'Crunch Basic', price: '$9.99/mo', features: ['All Gyms Access', 'Basic Classes', 'App Access'] },
    { name: 'Crunch Plus', price: '$19.99/mo', features: ['All Gyms Access', 'All Classes', 'HydroMassage'] },
    { name: 'Crunch Premier', price: '$24.99/mo', features: ['All Above +', 'Personal Training', 'Priority Booking'] },
  ];

  const philosophyItems = [
    { title: 'Positivity', description: 'We celebrate every win, big or small, in a judgment-free zone.', icon: Sparkles },
    { title: 'Inclusivity', description: 'Every body is welcome here. Fitness looks different for everyone.', icon: Users },
    { title: 'Fun', description: 'Working out should feel good. Energy is for everyone.', icon: Award },
  ];

  return (
    <>
      <SEO
        title="Fitness Gym Membership & Classes"
        description="Discover CrunchFit Pro memberships, classes, personal training, and gym locations to kickstart your fitness journey."
        canonical={`${appUrl}/`}
      />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      {/* HERO SECTION */}
      <section className="relative h-screen bg-gradient-to-b from-dark-navy via-dark-navy/95 to-dark-navy flex items-center justify-start overflow-hidden">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-dark-navy/90 to-transparent z-10" />

        {/* Animated background elements */}
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 50%, rgba(233, 69, 96, 0.3) 0%, transparent 50%)',
          }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center">
          <div className="max-w-2xl">
            {/* Tag */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Badge variant="primary" size="md" className="mb-6">
                #NoJudgments
              </Badge>
            </motion.div>

            {/* Main heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight"
            >
              Find Your Nearest <span className="text-accent">Crunch</span> and Join Today!
            </motion.h1>

            {/* Animated cycling text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="h-12 mb-8"
            >
              <AnimatePresence mode="wait">
                <motion.p
                  key={cycleIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-2xl text-accent font-semibold"
                >
                  {cycleText[cycleIndex]}
                </motion.p>
              </AnimatePresence>
            </motion.div>

            {/* Location search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-3 mb-8"
            >
              <div className="flex-1">
                <Input
                  placeholder="Enter your location..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  icon={<MapPin size={18} />}
                />
              </div>
              <Button
                onClick={handleSearch}
                variant="primary"
                size="md"
                className="min-w-max"
              >
                Find a Crunch
              </Button>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                onClick={() => navigate('/join')}
                variant="primary"
                size="lg"
                className="px-8"
              >
                Join Now
              </Button>
              <Button
                onClick={() => navigate('/free-trial')}
                variant="outline"
                size="lg"
                className="px-8"
              >
                Free Trial
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="bg-dark-navy/80 border-y border-accent/20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { label: '400+', desc: 'Locations' },
              { label: '1M+', desc: 'Members' },
              { label: '30+', desc: 'Classes' },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="py-2"
              >
                <div className="text-3xl md:text-4xl font-bold text-accent mb-2">{stat.label}</div>
                <div className="text-light-bg/70 text-sm md:text-base">{stat.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES CAROUSEL */}
      <section className="bg-dark-navy py-12 md:py-20">
        <div className="mb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Gym is Your Gym</h2>
          <p className="text-light-bg/70 text-lg max-w-2xl mx-auto">
            We've got everything you need to reach your fitness goals
          </p>
        </div>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          className="max-w-7xl mx-auto px-4"
        >
          {[
            { title: 'Group Fitness Studios', desc: 'High-energy classes every day' },
            { title: 'Things to Lift', desc: 'Everything from free weights to machines' },
            { title: 'Miles of Cardio', desc: 'State-of-the-art cardio equipment' },
            { title: 'People Who Care', desc: 'Supportive community atmosphere' },
            { title: 'Sparkling Clean', desc: 'Pristine facilities and equipment' },
          ].map((feature, idx) => (
            <SwiperSlide key={idx}>
              <div className="relative h-96 md:h-[500px] bg-gradient-to-r from-accent/20 to-secondary/20 rounded-xl overflow-hidden group">
                <div className="absolute inset-0 bg-dark-navy/60 group-hover:bg-dark-navy/40 transition-all duration-300 z-10" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-20">
                  <motion.h3
                    initial={{ oppacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl md:text-5xl font-bold text-white mb-4"
                  >
                    {feature.title}
                  </motion.h3>
                  <p className="text-light-bg/80 text-lg md:text-xl max-w-md">{feature.desc}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* PHILOSOPHY SECTION */}
      <section className="bg-dark-navy py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {philosophyItems.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -10 }}
                className="group cursor-pointer"
                onClick={() => navigate('/about')}
              >
                <Card variant="dark-hover">
                  <div className="p-8 text-center h-full flex flex-col items-center justify-center">
                    <div className="mb-4 rounded-2xl border border-accent/30 bg-accent/10 p-4">
                      <item.icon size={36} className="text-accent" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                    <p className="text-light-bg/70 leading-relaxed">{item.description}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CLASSES GRID */}
      <section className="bg-dark-navy py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Energy is for Everyone</h2>
            <p className="text-light-bg/70 text-lg">Explore our diverse range of fitness classes</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((cls, idx) => (
              <motion.button
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => navigate(`/classes?category=${cls.name.toLowerCase()}`)}
                className={`relative h-48 rounded-xl overflow-hidden bg-gradient-to-br ${cls.color} to-transparent group cursor-pointer`}
              >
                <div className="absolute inset-0 bg-dark-navy/40 group-hover:bg-dark-navy/20 transition-all duration-300 z-10" />
                <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                  <div className="mb-3 rounded-2xl border border-white/20 bg-dark-navy/60 p-4 backdrop-blur-sm">
                    <cls.icon size={34} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">{cls.name}</h3>
                </div>
              </motion.button>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              onClick={() => navigate('/classes')}
              variant="outline"
              size="lg"
            >
              Explore All Classes
            </Button>
          </div>
        </div>
      </section>

      {/* TRAINING CTA */}
      <section className="bg-dark-navy py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="relative h-96 rounded-xl overflow-hidden bg-gradient-to-br from-accent/30 to-secondary/30 flex items-center justify-center"
            >
              <div className="rounded-3xl border border-white/20 bg-dark-navy/55 p-8 backdrop-blur-sm">
                <Users size={86} className="text-white" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <h2 className="text-4xl font-bold text-white mb-4">
                Personal Training That Works
              </h2>
              <p className="text-light-bg/70 text-lg mb-6 leading-relaxed">
                Our certified personal trainers will help you achieve your goals with customized workout
                plans tailored to your fitness level and objectives.
              </p>
              <Button
                onClick={() => navigate('/training')}
                variant="primary"
                size="lg"
              >
                Learn About Personal Training
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-dark-navy py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Member Stories</h2>
            <p className="text-light-bg/70 text-lg">See why thousands of members love Crunch</p>
          </div>

          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 6000, disableOnInteraction: false }}
            slidesPerView={1}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="max-w-7xl mx-auto"
          >
            {testimonials.map((testimonial, idx) => (
              <SwiperSlide key={idx}>
                <Card variant="dark" className="h-full">
                  <div className="p-8 h-full flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-accent to-secondary text-sm font-bold tracking-[0.1em] text-white">
                          {testimonial.avatar}
                        </div>
                        <div>
                          <h4 className="text-white font-bold">{testimonial.name}</h4>
                          <p className="text-light-bg/60 text-sm">{testimonial.location}</p>
                        </div>
                      </div>
                      <Rating value={testimonial.rating} size="sm" readonly className="mb-4" />
                    </div>
                    <p className="text-light-bg/80 italic">&quot;{testimonial.quote}&quot;</p>
                  </div>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* MEMBERSHIP TEASER */}
      <section className="bg-dark-navy py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Choose Your Crunch</h2>
            <p className="text-light-bg/70 text-lg">Flexible plans for every fitness level</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {membershipPlans.map((plan, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <Card variant={idx === 1 ? 'dark-hover' : 'dark'} className="h-full">
                  <div className="p-8 flex flex-col h-full">
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <p className="text-3xl font-bold text-accent mb-6">{plan.price}</p>
                    <ul className="space-y-3 mb-8 flex-grow">
                      {plan.features.map((feature, fidx) => (
                        <li key={fidx} className="flex items-center gap-2 text-light-bg/80">
                          <span className="text-accent">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button onClick={() => navigate('/membership')} variant="primary" size="md" className="w-full">
                      Learn More
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Button
              onClick={() => navigate('/crunch-plus')}
              variant="outline"
              size="lg"
            >
              Compare All Plans
            </Button>
          </div>
        </div>
      </section>

      {/* DOWNLOAD APP BANNER */}
      <section className="bg-gradient-to-r from-accent/20 to-secondary/20 py-12 md:py-16 border-y border-accent/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Train Anywhere with CrunchFit Pro App
            </h2>
            <p className="text-light-bg/80 mb-8 max-w-2xl mx-auto">
              Book classes, track workouts, and connect with the community on the go
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => navigate('/crunch-plus')} variant="primary" size="lg">
                App Store
              </Button>
              <Button onClick={() => navigate('/crunch-plus')} variant="secondary" size="lg">
                Google Play
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
      </motion.div>
    </>
  );
};

export default HomePage;
