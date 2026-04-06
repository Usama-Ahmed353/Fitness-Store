import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import {
  Clock,
  Flame,
  Dumbbell,
  Users,
  Activity,
  Heart,
  Zap,
  Target,
  Search as SearchIcon,
  Grid3x3,
  List,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import SEO from '../../components/seo/SEO';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Mock classes data
const mockClasses = [
  {
    id: 1,
    name: 'Morning Spin',
    category: 'Ride',
    instructor: 'Lisa Chen',
    gym: 'Times Square',
    difficulty: 'Intermediate',
    duration: 45,
    intensity: 8,
    time: 'Mon, Wed, Fri - 6:00 AM',
    description: 'High-energy cycling class with motivational music.',
    members: 24,
    image: 'ride',
  },
  {
    id: 2,
    name: 'Power Yoga',
    category: 'Mind Body',
    instructor: 'Marcus Adams',
    gym: 'East Village',
    difficulty: 'Beginner',
    duration: 60,
    intensity: 5,
    time: 'Tue, Thu - 10:00 AM',
    description: 'Build strength and flexibility with flowing poses.',
    members: 18,
    image: 'mind-body',
  },
  {
    id: 3,
    name: 'HIIT Blast',
    category: 'Cardio',
    instructor: 'Sarah Williams',
    gym: 'Midtown',
    difficulty: 'Advanced',
    duration: 35,
    intensity: 10,
    time: 'Mon, Wed, Fri - 6:00 PM',
    description: 'Intense interval training for maximum calorie burn.',
    members: 32,
    image: 'hiit',
  },
  {
    id: 4,
    name: 'Strength & Conditioning',
    category: 'Strength',
    instructor: 'James Porter',
    gym: 'Times Square',
    difficulty: 'Intermediate',
    duration: 60,
    intensity: 9,
    time: 'Tue, Thu, Sat - 7:00 AM',
    description: 'Build muscle with weight training and conditioning.',
    members: 28,
    image: 'strength',
  },
  {
    id: 5,
    name: 'Zumba Party',
    category: 'Dance',
    instructor: 'Rosa Martinez',
    gym: 'East Village',
    difficulty: 'Beginner',
    duration: 50,
    intensity: 7,
    time: 'Wed, Fri, Sat - 5:30 PM',
    description: 'Dance your way to fitness with Latin rhythms.',
    members: 35,
    image: 'dance',
  },
  {
    id: 6,
    name: 'Boxing Basics',
    category: 'Strength',
    instructor: 'Tony Brooks',
    gym: 'Midtown',
    difficulty: 'Beginner',
    duration: 45,
    intensity: 8,
    time: 'Mon, Wed, Fri - 4:00 PM',
    description: 'Learn boxing technique and build confidence.',
    members: 22,
    image: 'boxing',
  },
  {
    id: 7,
    name: 'Pilates Core',
    category: 'Mind Body',
    instructor: 'Emma Johnson',
    gym: 'Times Square',
    difficulty: 'Intermediate',
    duration: 50,
    intensity: 6,
    time: 'Tue, Thu - 9:30 AM',
    description: 'Core-strengthening pilates for toned muscles.',
    members: 20,
    image: 'pilates',
  },
  {
    id: 8,
    name: 'Dance Cardio',
    category: 'Dance',
    instructor: 'Jessica Lee',
    gym: 'East Village',
    difficulty: 'Intermediate',
    duration: 45,
    intensity: 8,
    time: 'Mon, Wed - 6:00 PM',
    description: 'Dance to modern hits while getting cardio in.',
    members: 27,
    image: 'dance-cardio',
  },
  {
    id: 9,
    name: 'Yoga Flow',
    category: 'Mind Body',
    instructor: 'Zara Khan',
    gym: 'Midtown',
    difficulty: 'All Levels',
    duration: 60,
    intensity: 4,
    time: 'Daily - 9:00 PM',
    description: 'Relaxing vinyasa flow yoga for all levels.',
    members: 38,
    image: 'yoga',
  },
  {
    id: 10,
    name: 'TRX Suspension',
    category: 'Strength',
    instructor: 'Michael Chen',
    gym: 'Times Square',
    difficulty: 'Advanced',
    duration: 45,
    intensity: 9,
    time: 'Sat, Sun - 10:00 AM',
    description: 'Full-body workout using suspension straps.',
    members: 19,
    image: 'trx',
  },
  {
    id: 11,
    name: 'Aqua Aerobics',
    category: 'Cardio',
    instructor: 'David Lee',
    gym: 'Midtown',
    difficulty: 'Beginner',
    duration: 45,
    intensity: 6,
    time: 'Mon, Wed, Fri - 10:00 AM',
    description: 'Low-impact water exercises for all fitness levels.',
    members: 15,
    image: 'aqua',
  },
  {
    id: 12,
    name: 'Kettlebell Kickass',
    category: 'Strength',
    instructor: 'Alex Thompson',
    gym: 'East Village',
    difficulty: 'Intermediate',
    duration: 50,
    intensity: 8,
    time: 'Tue, Thu, Sat - 6:00 PM',
    description: 'Dynamic kettlebell training for functional strength.',
    members: 21,
    image: 'kettlebell',
  },
];

const categories = ['All', 'Strength', 'Ride', 'Mind Body', 'Dance', 'Cardio', 'Specialty'];
const timeOfDay = ['Morning (5-9 AM)', 'Afternoon (12-5 PM)', 'Evening (5-11 PM)'];
const difficulties = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];
const gyms = ['All Gyms', 'Times Square', 'East Village', 'Midtown'];

const classVisuals = {
  'Strength': Dumbbell,
  'Ride': Activity,
  'Mind Body': Heart,
  'Dance': Zap,
  'Cardio': Flame,
  'Specialty': Target,
};

const ClassesPage = () => {
  const navigate = useNavigate();
  const appUrl = import.meta.env.VITE_APP_URL || 'http://localhost:5173';
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || 'All'
  );
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    gym: 'All Gyms',
    timeOfDay: '',
    duration: '',
    difficulty: 'All Levels',
  });

  // Filter classes
  const filteredClasses = useMemo(() => {
    let result = mockClasses;

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter((cls) => cls.category === selectedCategory);
    }

    // Search
    if (searchQuery) {
      result = result.filter(
        (cls) =>
          cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cls.instructor.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Gym filter
    if (filters.gym !== 'All Gyms') {
      result = result.filter((cls) => cls.gym === filters.gym);
    }

    // Difficulty filter
    if (filters.difficulty !== 'All Levels' && filters.difficulty) {
      result = result.filter((cls) => cls.difficulty === filters.difficulty);
    }

    // Time of day filter
    if (filters.timeOfDay) {
      result = result.filter((cls) => {
        const hour = parseInt(cls.time.match(/\d+/)?.[0] || 0);
        if (filters.timeOfDay === 'Morning (5-9 AM)') return hour >= 5 && hour < 12;
        if (filters.timeOfDay === 'Afternoon (12-5 PM)') return hour >= 12 && hour < 17;
        if (filters.timeOfDay === 'Evening (5-11 PM)') return hour >= 17;
        return true;
      });
    }

    // Duration filter
    if (filters.duration) {
      const [min, max] = filters.duration.split('-').map(Number);
      result = result.filter((cls) => cls.duration >= min && cls.duration <= max);
    }

    return result;
  }, [selectedCategory, searchQuery, filters]);

  const handleBookClass = (classId) => {
    navigate(`/login?redirect=/classes/${classId}`);
  };

  // Weekly schedule
  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeSlots = ['6:00 AM', '9:00 AM', '10:00 AM', '4:00 PM', '5:30 PM', '6:00 PM', '9:00 PM'];

  return (
    <>
      <SEO
        title="Explore Fitness Classes"
        description="Browse group classes by category, schedule, level, and intensity at CrunchFit Pro gyms."
        canonical={`${appUrl}/classes`}
      />
      <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-dark-navy"
    >
      {/* Hero Banner */}
      <section className="relative h-96 md:h-[500px] bg-gradient-to-r from-dark-navy via-dark-navy/85 to-dark-navy overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-accent/10 to-secondary/10" />
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle at 80% 50%, rgba(233, 69, 96, 0.4) 0%, transparent 50%)',
          }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        <div className="relative z-20 h-full flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl px-4"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Find Your Perfect Class
            </h1>
            <p className="text-light-bg/80 text-lg md:text-xl">
              From cardio to strength training, yoga to dance — we have it all
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="sticky top-0 z-40 bg-dark-navy border-b border-accent/20 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-4">
            {categories.map((category) => (
              <motion.button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full whitespace-nowrap font-semibold transition-all ${
                  selectedCategory === category
                    ? 'bg-accent text-dark-navy'
                    : 'bg-dark-navy/50 text-light-bg/80 border border-accent/30 hover:border-accent'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="bg-dark-navy border-b border-accent/20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Input
                placeholder="Search by class name or instructor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<SearchIcon size={18} />}
              />
            </motion.div>

            {/* Filters Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {/* Gym Filter */}
              <select
                value={filters.gym}
                onChange={(e) => setFilters({ ...filters, gym: e.target.value })}
                className="px-3 py-2 border border-accent/30 bg-dark-navy/50 text-light-bg rounded-lg focus:outline-none focus:border-accent"
              >
                {gyms.map((gym) => (
                  <option key={gym} value={gym}>
                    {gym}
                  </option>
                ))}
              </select>

              {/* Time of Day Filter */}
              <select
                value={filters.timeOfDay}
                onChange={(e) => setFilters({ ...filters, timeOfDay: e.target.value })}
                className="px-3 py-2 border border-accent/30 bg-dark-navy/50 text-light-bg rounded-lg focus:outline-none focus:border-accent"
              >
                <option value="">Any Time</option>
                {timeOfDay.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>

              {/* Duration Filter */}
              <select
                value={filters.duration}
                onChange={(e) => setFilters({ ...filters, duration: e.target.value })}
                className="px-3 py-2 border border-accent/30 bg-dark-navy/50 text-light-bg rounded-lg focus:outline-none focus:border-accent"
              >
                <option value="">Any Duration</option>
                <option value="30-45">30-45 min</option>
                <option value="45-60">45-60 min</option>
                <option value="60-90">60+ min</option>
              </select>

              {/* Difficulty Filter */}
              <select
                value={filters.difficulty}
                onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
                className="px-3 py-2 border border-accent/30 bg-dark-navy/50 text-light-bg rounded-lg focus:outline-none focus:border-accent"
              >
                {difficulties.map((diff) => (
                  <option key={diff} value={diff}>
                    {diff}
                  </option>
                ))}
              </select>
            </motion.div>

            {/* View Mode Toggle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-between"
            >
              <p className="text-light-bg/80">
                Found <span className="text-accent font-bold">{filteredClasses.length}</span> classes
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg border transition-all ${
                    viewMode === 'grid'
                      ? 'bg-accent text-dark-navy border-accent'
                      : 'border-accent/30 text-light-bg/70 hover:border-accent'
                  }`}
                >
                  <Grid3x3 size={20} />
                </button>
                <button
                  onClick={() => setViewMode('schedule')}
                  className={`p-2 rounded-lg border transition-all ${
                    viewMode === 'schedule'
                      ? 'bg-accent text-dark-navy border-accent'
                      : 'border-accent/30 text-light-bg/70 hover:border-accent'
                  }`}
                >
                  <List size={20} />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AnimatePresence mode="wait">
          {viewMode === 'grid' ? (
            // Grid View
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredClasses.length > 0 ? (
                filteredClasses.map((cls, idx) => {
                  const ClassIcon = classVisuals[cls.category] || Activity;
                  return (
                  <motion.div
                    key={cls.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ y: -10 }}
                  >
                    <Card variant="dark-hover" className="h-full flex flex-col">
                      <div className="relative h-40 bg-gradient-to-br from-accent/20 to-secondary/20 rounded-t-lg flex items-center justify-center group overflow-hidden">
                        <motion.div whileHover={{ scale: 1.1 }}>
                          <ClassIcon size={54} className="text-white" />
                        </motion.div>
                      </div>

                      <div className="p-6 flex flex-col flex-grow">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div>
                            <h3 className="text-lg font-bold text-white mb-1">{cls.name}</h3>
                            <p className="text-light-bg/70 text-sm">{cls.instructor}</p>
                          </div>
                          <Badge variant="primary" size="sm">
                            {cls.difficulty}
                          </Badge>
                        </div>

                        {/* Info Grid */}
                        <div className="grid grid-cols-2 gap-3 mb-4 py-3 border-t border-b border-light-bg/10">
                          <div className="flex items-center gap-2 text-light-bg/70">
                            <Clock size={16} className="text-accent" />
                            <span className="text-xs">{cls.duration} min</span>
                          </div>
                          <div className="flex items-center gap-2 text-light-bg/70">
                            <Flame size={16} className="text-accent" />
                            <span className="text-xs">Intensity {cls.intensity}/10</span>
                          </div>
                          <div className="flex items-center gap-2 text-light-bg/70">
                            <Users size={16} className="text-accent" />
                            <span className="text-xs">{cls.members} members</span>
                          </div>
                          <div className="text-accent text-xs font-semibold">{cls.gym}</div>
                        </div>

                        {/* Description */}
                        <p className="text-light-bg/70 text-sm mb-4 flex-grow">
                          {cls.description}
                        </p>

                        {/* Schedule */}
                        <p className="text-light-bg/60 text-xs mb-4 italic border-l-2 border-accent pl-3">
                          {cls.time}
                        </p>

                        {/* CTA */}
                        <Button
                          onClick={() => handleBookClass(cls.id)}
                          variant="primary"
                          size="sm"
                          className="w-full"
                        >
                          Book Now
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                );
                })
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full flex flex-col items-center justify-center py-16"
                >
                  <p className="text-light-bg/60 text-lg mb-4">No classes found</p>
                  <Button
                    onClick={() => {
                      setSelectedCategory('All');
                      setSearchQuery('');
                      setFilters({
                        gym: 'All Gyms',
                        timeOfDay: '',
                        duration: '',
                        difficulty: 'All Levels',
                      });
                    }}
                    variant="outline"
                    size="md"
                  >
                    Reset Filters
                  </Button>
                </motion.div>
              )}
            </motion.div>
          ) : (
            // Schedule View
            <motion.div
              key="schedule"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="overflow-x-auto"
            >
              <div className="min-w-max">
                {/* Header Row */}
                <div className="grid gap-1 mb-2" style={{ gridTemplateColumns: '150px repeat(7, 150px)' }}>
                  <div className="font-bold text-light-bg/60 text-sm p-2">Time</div>
                  {weekDays.map((day) => (
                    <div key={day} className="font-bold text-white text-sm p-2 text-center">
                      {day.slice(0, 3)}
                    </div>
                  ))}
                </div>

                {/* Time Slots */}
                {timeSlots.map((time) => (
                  <div
                    key={time}
                    className="grid gap-1 mb-2 border-t border-accent/10 pt-2"
                    style={{ gridTemplateColumns: '150px repeat(7, 150px)' }}
                  >
                    {/* Time Label */}
                    <div className="text-light-bg/70 text-sm p-2 font-semibold">{time}</div>

                    {/* Class Cells */}
                    {weekDays.map((day) => {
                      const classForSlot = filteredClasses.find(
                        (cls) =>
                          cls.time.toLowerCase().includes(day.toLowerCase()) &&
                          cls.time.includes(time)
                      );

                      return (
                        <div key={`${day}-${time}`} className="p-1">
                          {classForSlot ? (
                            <motion.button
                              onClick={() => handleBookClass(classForSlot.id)}
                              whileHover={{ scale: 1.05 }}
                              className="w-full px-3 py-2 bg-accent/20 border border-accent/50 text-accent rounded text-xs font-semibold hover:bg-accent hover:text-dark-navy transition-all"
                            >
                              {classForSlot.name}
                              <br />
                              <span className="text-accent/70 text-xs">{classForSlot.instructor}</span>
                            </motion.button>
                          ) : (
                            <div className="w-full h-16 bg-dark-navy/30 border border-accent/10 rounded" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
      </motion.div>
    </>
  );
};

export default ClassesPage;
