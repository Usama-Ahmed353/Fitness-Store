import { useState, useMemo, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../hooks/useLanguage';
import MemberLayout from '../../layouts/MemberLayout';
import SEO from '../../components/seo/SEO';
import BookingModal from '../../components/member/BookingModal';
import {
  Calendar,
  Clock,
  Users,
  Filter,
  Grid3x3,
  List,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  AlertCircle,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

/**
 * ClassesPage - Browse, filter, and book fitness classes
 */
const ClassesPage = () => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const { profile } = useSelector((state) => state.member);
  const { accessToken } = useSelector((state) => state.auth);
  const runtimeHost = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  const API = import.meta.env.VITE_API_BASE_URL || `http://${runtimeHost}:5001/api`;

  // View modes
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
  const [tabMode, setTabMode] = useState('today'); // 'today', 'week', or 'all'
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date());

  // Filters
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);

  // Bookings and modals
  const [selectedClass, setSelectedClass] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookedClasses, setBookedClasses] = useState([]);
  const [waitlistedClasses, setWaitlistedClasses] = useState([]);
  const [allClasses, setAllClasses] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(true);

  // Fallback class data
  const fallbackClasses = [
    {
      id: 1,
      name: 'Morning Spin',
      category: 'Ride',
      description: 'High-energy cycling workout to pump up your morning.',
      time: '06:00',
      duration: 45,
      instructor: {
        name: 'Sarah Johnson',
        id: 'instr-1',
        bio: 'Certified cycling instructor with 10+ years experience',
        image: 'https://via.placeholder.com/80?text=SJ',
      },
      difficulty: 'Intermediate',
      maxSpots: 20,
      bookedSpots: 18,
      equipment: ['Spin Bike'],
      cancellationPolicy: 'Cancel up to 48hr before for full credit',
      date: new Date().toISOString().split('T')[0],
    },
    {
      id: 2,
      name: 'Yoga Flow',
      category: 'Mind & Body',
      description: 'Relaxing yoga session to start your day with zen.',
      time: '07:00',
      duration: 60,
      instructor: {
        name: 'Maria Garcia',
        id: 'instr-2',
        bio: 'Yoga instructor specializing in flow and breathwork',
        image: 'https://via.placeholder.com/80?text=MG',
      },
      difficulty: 'Beginner',
      maxSpots: 25,
      bookedSpots: 12,
      equipment: ['Yoga Mat'],
      cancellationPolicy: 'Cancel up to 48hr before for full credit',
      date: new Date().toISOString().split('T')[0],
    },
    {
      id: 3,
      name: 'HIIT Blast',
      category: 'Strength',
      description: 'Intense interval training combining cardio and weights.',
      time: '18:00',
      duration: 50,
      instructor: {
        name: 'Alex Martinez',
        id: 'instr-3',
        bio: 'Former athlete and fitness coach passionate about HIIT',
        image: 'https://via.placeholder.com/80?text=AM',
      },
      difficulty: 'Advanced',
      maxSpots: 16,
      bookedSpots: 16,
      equipment: ['Dumbbells', 'Mat'],
      cancellationPolicy: 'Cancel up to 48hr before for full credit',
      date: new Date().toISOString().split('T')[0],
    },
    {
      id: 4,
      name: 'Pilates Core',
      category: 'Strength',
      description: 'Core-focused pilates for strength and flexibility.',
      time: '09:00',
      duration: 55,
      instructor: {
        name: 'Jennifer Lee',
        id: 'instr-4',
        bio: 'Certified pilates instructor with a focus on core stability',
        image: 'https://via.placeholder.com/80?text=JL',
      },
      difficulty: 'Intermediate',
      maxSpots: 18,
      bookedSpots: 8,
      equipment: ['Pilates Mat'],
      cancellationPolicy: 'Cancel up to 48hr before for full credit',
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    },
    {
      id: 5,
      name: 'Zumba Party',
      category: 'Cardio',
      description: 'Dance-based cardio workout with fun Latin rhythms.',
      time: '17:00',
      duration: 45,
      instructor: {
        name: 'Carlos Ruiz',
        id: 'instr-5',
        bio: 'Professional dancer and energetic zumba instructor',
        image: 'https://via.placeholder.com/80?text=CR',
      },
      difficulty: 'Beginner',
      maxSpots: 30,
      bookedSpots: 28,
      equipment: [],
      cancellationPolicy: 'Cancel up to 48hr before for full credit',
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    },
    {
      id: 6,
      name: 'Boxing Training',
      category: 'Cardio',
      description: 'Learn boxing techniques while getting an amazing cardio workout.',
      time: '19:00',
      duration: 60,
      instructor: {
        name: 'Mike Thompson',
        id: 'instr-6',
        bio: 'Former boxer bringing street skills to fitness',
        image: 'https://via.placeholder.com/80?text=MT',
      },
      difficulty: 'Intermediate',
      maxSpots: 12,
      bookedSpots: 5,
      equipment: ['Boxing Gloves', 'Heavy Bag'],
      cancellationPolicy: 'Cancel up to 48hr before for full credit',
      date: new Date(Date.now() + 172800000).toISOString().split('T')[0], // In 2 days
    },
  ];

  const loadClasses = useCallback(async () => {
    try {
      setLoadingClasses(true);
      const { data } = await axios.get(`${API}/classes`, {
        params: { limit: 100 },
      });

      const mapped = (data?.data || []).map((cls) => {
        const trainerUser = cls.instructorId?.userId;
        const instructorName = trainerUser
          ? `${trainerUser.firstName || ''} ${trainerUser.lastName || ''}`.trim()
          : 'Trainer';

        return {
          id: cls._id,
          name: cls.name,
          category: cls.category,
          description: cls.description || '',
          time: cls.schedule?.time || '00:00',
          duration: cls.duration || 60,
          instructor: {
            name: instructorName,
            id: cls.instructorId?._id || 'instr',
            bio: cls.instructorId?.bio || 'Certified trainer',
            image: trainerUser?.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(instructorName)}&background=2B3E50&color=E94560&size=128`,
          },
          difficulty:
            cls.difficulty?.charAt(0).toUpperCase() + cls.difficulty?.slice(1) || 'Intermediate',
          maxSpots: cls.maxCapacity || 0,
          bookedSpots: cls.currentBookings || 0,
          equipment: cls.equipment || [],
          cancellationPolicy: 'Cancel up to 48hr before for full credit',
          date:
            cls.schedule?.date
              ? new Date(cls.schedule.date).toISOString().split('T')[0]
              : new Date().toISOString().split('T')[0],
        };
      });

      setAllClasses(mapped.length ? mapped : fallbackClasses);
    } catch (error) {
      setAllClasses(fallbackClasses);
      toast.error(error.response?.data?.message || 'Failed to load classes');
    } finally {
      setLoadingClasses(false);
    }
  }, [API]);

  useEffect(() => {
    loadClasses();
  }, [loadClasses]);

  const categories = ['Ride', 'Strength', 'Cardio', 'Mind & Body', 'Hiit', 'Dance', 'Mind_body', 'Specialty'];
  const timeSlots = [
    { label: 'Morning (6-12)', value: 'morning', start: 6, end: 12 },
    { label: 'Afternoon (12-17)', value: 'afternoon', start: 12, end: 17 },
    { label: 'Evening (17-22)', value: 'evening', start: 17, end: 22 },
  ];
  const difficulties = ['Beginner', 'Intermediate', 'Advanced'];

  // Filter classes
  const filteredClasses = useMemo(() => {
    let filtered = allClasses;

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter((c) => c.category === selectedCategory);
    }

    // Time slot filter
    if (selectedTimeSlot) {
      const slot = timeSlots.find((ts) => ts.value === selectedTimeSlot);
      filtered = filtered.filter((c) => {
        const classHour = parseInt(c.time.split(':')[0]);
        return classHour >= slot.start && classHour < slot.end;
      });
    }

    // Instructor filter
    if (selectedInstructor) {
      filtered = filtered.filter((c) => c.instructor.id === selectedInstructor);
    }

    // Difficulty filter
    if (selectedDifficulty) {
      filtered = filtered.filter((c) => c.difficulty === selectedDifficulty);
    }

    // Tab filter
    if (tabMode === 'today') {
      const today = new Date().toISOString().split('T')[0];
      filtered = filtered.filter((c) => c.date === today);
    } else if (tabMode === 'week') {
      const weekStart = new Date(currentWeekStart);
      weekStart.setHours(0, 0, 0, 0);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);

      filtered = filtered.filter((c) => {
        const classDate = new Date(c.date);
        return classDate >= weekStart && classDate < weekEnd;
      });
    }

    return filtered;
  }, [
    selectedCategory,
    selectedTimeSlot,
    selectedInstructor,
    selectedDifficulty,
    tabMode,
    currentWeekStart,
  ]);

  // Open booking modal
  const handleBookClass = (classItem) => {
    setSelectedClass(classItem);
    setShowBookingModal(true);
  };

  // Confirm booking
  const handleConfirmBooking = async (classItem, bookingType) => {
    if (!accessToken) {
      toast.error('Please log in to book classes');
      return;
    }

    try {
      const headers = { Authorization: `Bearer ${accessToken}` };
      const response = await axios.post(`${API}/classes/${classItem.id}/book`, {}, { headers });
      const waitlistPosition = response.data?.data?.waitlistPosition;

      if (waitlistPosition) {
        setWaitlistedClasses((prev) => (prev.includes(classItem.id) ? prev : [...prev, classItem.id]));
        toast.success(`Joined waitlist - Position #${waitlistPosition}`);
      } else {
        setBookedClasses((prev) => (prev.includes(classItem.id) ? prev : [...prev, classItem.id]));
        toast.success(t('member.classes.bookingSuccess') || `Successfully booked ${classItem.name}!`);
      }

      await loadClasses();
      setShowBookingModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to book class');
    }
  };

  // Get booking status
  const getBookingStatus = (classId) => {
    if (bookedClasses.includes(classId)) return 'booked';
    if (waitlistedClasses.includes(classId)) return 'waitlisted';
    return 'available';
  };

  // Format date
  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get unique instructors for filter
  const uniqueInstructors = Array.from(
    new Map(allClasses.map((c) => [c.instructor.id, c.instructor])).values()
  );

  return (
    <>
      <SEO
        title="Classes - CrunchFit Pro"
        description="Browse and book fitness classes"
        noIndex={true}
      />

      <MemberLayout>
        <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 lg:pb-8">
            {/* Page Header */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-8"
            >
              <h1
                className={`text-3xl md:text-4xl font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                {t('member.classes.title') || 'Classes'}
              </h1>
              <p
                className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
              >
                {t('member.classes.subtitle') ||
                  'Discover and book classes that match your fitness goals'}
              </p>
            </motion.div>

            {/* View Controls */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
              {/* Tabs */}
              <div className="flex gap-2">
                {[
                  { id: 'today', label: 'Today' },
                  { id: 'week', label: 'This Week' },
                  { id: 'all', label: 'Browse All' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setTabMode(tab.id)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      tabMode === tab.id
                        ? 'bg-accent text-white'
                        : isDark
                          ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* View Mode Toggle */}
              <div
                className={`flex gap-2 p-1 rounded-lg ${
                  isDark ? 'bg-gray-800' : 'bg-gray-200'
                }`}
              >
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-all ${
                    viewMode === 'list'
                      ? isDark
                        ? 'bg-gray-700 text-accent'
                        : 'bg-white text-accent'
                      : isDark
                        ? 'text-gray-400 hover:text-gray-200'
                        : 'text-gray-500 hover:text-gray-700'
                  }`}
                  title="List View"
                >
                  <List className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`p-2 rounded transition-all ${
                    viewMode === 'calendar'
                      ? isDark
                        ? 'bg-gray-700 text-accent'
                        : 'bg-white text-accent'
                      : isDark
                        ? 'text-gray-400 hover:text-gray-200'
                        : 'text-gray-500 hover:text-gray-700'
                  }`}
                  title="Calendar View"
                >
                  <Grid3x3 className="w-5 h-5" />
                </button>
              </div>
            </motion.div>

            {/* Filter Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`mb-8 p-4 rounded-lg border ${
                isDark
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-accent" />
                <h3
                  className={`font-semibold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {t('member.classes.filters') || 'Filters'}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Category Filter */}
                <div>
                  <label
                    className={`text-sm font-semibold block mb-2 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    {t('member.classes.category') || 'Category'}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={`px-3 py-1 rounded-full text-sm transition-all ${
                        selectedCategory === null
                          ? 'bg-accent text-white'
                          : isDark
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      All
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1 rounded-full text-sm transition-all ${
                          selectedCategory === cat
                            ? 'bg-accent text-white'
                            : isDark
                              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Slot Filter */}
                <div>
                  <label
                    className={`text-sm font-semibold block mb-2 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    {t('member.classes.timeOfDay') || 'Time of Day'}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedTimeSlot(null)}
                      className={`px-3 py-1 rounded-full text-sm transition-all ${
                        selectedTimeSlot === null
                          ? 'bg-accent text-white'
                          : isDark
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      All
                    </button>
                    {timeSlots.map((slot) => (
                      <button
                        key={slot.value}
                        onClick={() => setSelectedTimeSlot(slot.value)}
                        className={`px-3 py-1 rounded-full text-sm transition-all ${
                          selectedTimeSlot === slot.value
                            ? 'bg-accent text-white'
                            : isDark
                              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {slot.label.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Instructor Filter */}
                <div>
                  <label
                    className={`text-sm font-semibold block mb-2 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    {t('member.classes.instructor') || 'Instructor'}
                  </label>
                  <select
                    value={selectedInstructor || ''}
                    onChange={(e) =>
                      setSelectedInstructor(e.target.value || null)
                    }
                    className={`w-full px-3 py-2 rounded-lg text-sm ${
                      isDark
                        ? 'bg-gray-700 text-white border-gray-600'
                        : 'bg-white text-gray-900 border-gray-300'
                    } border`}
                  >
                    <option value="">All Instructors</option>
                    {uniqueInstructors.map((instr) => (
                      <option key={instr.id} value={instr.id}>
                        {instr.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Difficulty Filter */}
                <div>
                  <label
                    className={`text-sm font-semibold block mb-2 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    {t('member.classes.difficulty') || 'Difficulty'}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedDifficulty(null)}
                      className={`px-3 py-1 rounded-full text-sm transition-all ${
                        selectedDifficulty === null
                          ? 'bg-accent text-white'
                          : isDark
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      All
                    </button>
                    {difficulties.map((diff) => (
                      <button
                        key={diff}
                        onClick={() => setSelectedDifficulty(diff)}
                        className={`px-3 py-1 rounded-full text-sm transition-all ${
                          selectedDifficulty === diff
                            ? 'bg-accent text-white'
                            : isDark
                              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* List View */}
            {viewMode === 'list' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                {loadingClasses ? (
                  <Card variant={isDark ? 'dark' : 'default'}>
                    <div className="flex items-center justify-center py-12">
                      <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>Loading classes...</p>
                    </div>
                  </Card>
                ) : filteredClasses.length === 0 ? (
                  <Card variant={isDark ? 'dark' : 'default'}>
                    <div className="flex items-center justify-center py-12">
                      <AlertCircle className="w-12 h-12 text-gray-400 mr-4" />
                      <div>
                        <p
                          className={`font-semibold ${
                            isDark ? 'text-gray-300' : 'text-gray-700'
                          }`}
                        >
                          {t('member.classes.noClasses') ||
                            'No classes match your filters'}
                        </p>
                        <p
                          className={`text-sm ${
                            isDark ? 'text-gray-500' : 'text-gray-500'
                          }`}
                        >
                          {t('member.classes.noClassesDesc') ||
                            'Try adjusting your filters'}
                        </p>
                      </div>
                    </div>
                  </Card>
                ) : (
                  filteredClasses.map((classItem, idx) => {
                    const status = getBookingStatus(classItem.id);
                    const spotsLeft = classItem.maxSpots - classItem.bookedSpots;
                    const isFull = spotsLeft === 0;

                    return (
                      <motion.div
                        key={classItem.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <Card variant={isDark ? 'dark-hover' : 'hover'} className="p-4 sm:p-6">
                          <div className="flex flex-col sm:flex-row gap-4">
                            {/* Instructor Image */}
                            <img
                              src={classItem.instructor.image}
                              alt={classItem.instructor.name}
                              className="w-24 h-24 rounded-lg object-cover flex-shrink-0 bg-dark-navy/20"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(classItem.instructor.name || 'Trainer')}&background=2B3E50&color=E94560&size=128`;
                              }}
                            />

                            {/* Class Details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
                                <h3
                                  className={`text-xl font-bold ${
                                    isDark ? 'text-white' : 'text-gray-900'
                                  }`}
                                >
                                  {classItem.name}
                                </h3>
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                      classItem.difficulty === 'Beginner'
                                        ? isDark
                                          ? 'bg-green-900/30 text-green-400'
                                          : 'bg-green-100 text-green-800'
                                        : classItem.difficulty === 'Intermediate'
                                          ? isDark
                                            ? 'bg-yellow-900/30 text-yellow-400'
                                            : 'bg-yellow-100 text-yellow-800'
                                          : isDark
                                            ? 'bg-red-900/30 text-red-400'
                                            : 'bg-red-100 text-red-800'
                                    }`}
                                  >
                                    {classItem.difficulty}
                                  </span>
                                </div>
                              </div>

                              <p
                                className={`text-sm mb-3 ${
                                  isDark ? 'text-gray-400' : 'text-gray-600'
                                }`}
                              >
                                {classItem.description}
                              </p>

                              <div className="flex flex-wrap gap-4 mb-4 text-sm">
                                <span
                                  className={isDark ? 'text-gray-400' : 'text-gray-600'}
                                >
                                  <Clock className="w-4 h-4 inline mr-1" />
                                  {classItem.time} · {classItem.duration} min
                                </span>
                                <span
                                  className={isDark ? 'text-gray-400' : 'text-gray-600'}
                                >
                                  {classItem.instructor.name}
                                </span>
                                <span
                                  className={`flex items-center ${
                                    isFull && status !== 'booked'
                                      ? isDark
                                        ? 'text-red-400'
                                        : 'text-red-600'
                                      : isDark
                                        ? 'text-gray-400'
                                        : 'text-gray-600'
                                  }`}
                                >
                                  <Users className="w-4 h-4 mr-1" />
                                  {spotsLeft}/{classItem.maxSpots} spots
                                </span>
                                <span
                                  className={`text-xs ${
                                    isDark ? 'text-gray-500' : 'text-gray-500'
                                  }`}
                                >
                                  {formatDate(classItem.date)}
                                </span>
                              </div>
                            </div>

                            {/* Action Button */}
                            <div className="flex-shrink-0 flex items-end">
                              {status === 'booked' ? (
                                <div
                                  className={`px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 ${
                                    isDark
                                      ? 'bg-green-900/30 text-green-400'
                                      : 'bg-green-100 text-green-800'
                                  }`}
                                >
                                  ✓ Booked
                                </div>
                              ) : status === 'waitlisted' ? (
                                <div
                                  className={`px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 ${
                                    isDark
                                      ? 'bg-blue-900/30 text-blue-400'
                                      : 'bg-blue-100 text-blue-800'
                                  }`}
                                >
                                  ◴ Waitlisted
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleBookClass(classItem)}
                                  disabled={isFull && status !== 'booked'}
                                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                                    isFull
                                      ? isDark
                                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                      : 'bg-accent text-white hover:opacity-90'
                                  }`}
                                >
                                  {isFull ? 'Full' : 'Book'}
                                </button>
                              )}
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })
                )}
              </motion.div>
            )}

            {/* Calendar View */}
            {viewMode === 'calendar' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Card variant={isDark ? 'dark' : 'default'}>
                  <div className="space-y-6">
                    {/* Week navigation */}
                    <div className="flex items-center justify-between mb-6">
                      <button
                        onClick={() => {
                          const newDate = new Date(currentWeekStart);
                          newDate.setDate(newDate.getDate() - 7);
                          setCurrentWeekStart(newDate);
                        }}
                        className="p-2 hover:bg-accent/10 rounded-lg"
                      >
                        <ChevronLeft className="w-5 h-5 text-accent" />
                      </button>

                      <h3
                        className={`font-semibold ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        Week of{' '}
                        {currentWeekStart.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </h3>

                      <button
                        onClick={() => {
                          const newDate = new Date(currentWeekStart);
                          newDate.setDate(newDate.getDate() + 7);
                          setCurrentWeekStart(newDate);
                        }}
                        className="p-2 hover:bg-accent/10 rounded-lg"
                      >
                        <ChevronRight className="w-5 h-5 text-accent" />
                      </button>
                    </div>

                    {/* Calendar grid */}
                    <div
                      className={`grid grid-cols-1 md:grid-cols-7 gap-2 p-4 rounded-lg ${
                        isDark ? 'bg-gray-800' : 'bg-gray-100'
                      }`}
                    >
                      {Array.from({ length: 7 }).map((_, dayIdx) => {
                        const date = new Date(currentWeekStart);
                        date.setDate(date.getDate() + dayIdx);
                        const dateStr = date.toISOString().split('T')[0];
                        const dayClasses = filteredClasses.filter(
                          (c) => c.date === dateStr
                        );

                        return (
                          <motion.div
                            key={dayIdx}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className={`p-3 rounded-lg border ${
                              isDark
                                ? 'border-gray-700 bg-gray-900'
                                : 'border-gray-300 bg-white'
                            }`}
                          >
                            <p
                              className={`text-sm font-semibold mb-2 ${
                                isDark ? 'text-gray-300' : 'text-gray-700'
                              }`}
                            >
                              {date.toLocaleDateString('en-US', {
                                weekday: 'short',
                              })}{' '}
                              {date.getDate()}
                            </p>

                            <div className="space-y-1">
                              {dayClasses.length === 0 ? (
                                <p
                                  className={`text-xs ${
                                    isDark
                                      ? 'text-gray-500'
                                      : 'text-gray-500'
                                  }`}
                                >
                                  No classes
                                </p>
                              ) : (
                                dayClasses.map((c) => (
                                  <button
                                    key={c.id}
                                    onClick={() => handleBookClass(c)}
                                    className={`w-full text-left px-2 py-1 rounded text-xs font-semibold transition-all hover:scale-105 ${
                                      getBookingStatus(c.id) === 'booked'
                                        ? isDark
                                          ? 'bg-green-900/40 text-green-300'
                                          : 'bg-green-100 text-green-800'
                                        : isDark
                                          ? 'bg-accent/30 text-accent'
                                          : 'bg-accent/20 text-accent'
                                    }`}
                                  >
                                    {c.time.slice(0, 5)} {c.name.split(' ')[0]}
                                  </button>
                                ))
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </MemberLayout>

      {/* Booking Modal */}
      <AnimatePresence>
        {showBookingModal && selectedClass && (
          <BookingModal
            classItem={selectedClass}
            onClose={() => {
              setShowBookingModal(false);
              setSelectedClass(null);
            }}
            onConfirmBooking={handleConfirmBooking}
            bookingStatus={getBookingStatus(selectedClass.id)}
            waitlistPosition={
              waitlistedClasses.includes(selectedClass.id)
                ? waitlistedClasses.indexOf(selectedClass.id) + 1
                : null
            }
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default ClassesPage;
