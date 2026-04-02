import { useState, useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../hooks/useLanguage';
import MemberLayout from '../../layouts/MemberLayout';
import SEO from '../../components/seo/SEO';
import TrainerCard from '../../components/member/TrainerCard';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Star,
  DollarSign,
  Users,
  Calendar,
  X,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';

/**
 * TrainersPage - Browse and book personal trainers
 */
const TrainersPage = () => {
  const { isDark } = useTheme();
  const { t } = useLanguage();

  // Search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    specializations: [],
    priceRange: [0, 150],
    minRating: 0,
    availability: 'any',
    gender: 'any',
  });

  // Mock trainer data
  const trainers = [
    {
      id: 1,
      name: 'Alex Martinez',
      photo: 'https://via.placeholder.com/200?text=Alex',
      specializations: ['Strength', 'HIIT', 'CrossFit'],
      rating: 4.9,
      reviewCount: 156,
      hourlyRate: 75,
      nextAvailable: 'Today 4:00 PM',
      gender: 'male',
      bio: 'Certified personal trainer with 8 years of experience in strength training and athletic performance.',
      videoUrl: 'https://res.cloudinary.com/demo/video/upload/sample',
      certifications: ['NASM-CPT', 'TRX', 'CrossFit Level 1'],
      gallery: [
        'https://via.placeholder.com/300?text=Training+1',
        'https://via.placeholder.com/300?text=Training+2',
        'https://via.placeholder.com/300?text=Training+3',
      ],
      reviews: [
        {
          id: 1,
          member: 'John D.',
          rating: 5,
          text: 'Amazing trainer! Push me to my limits in the most motivating way.',
          date: '2 weeks ago',
        },
        {
          id: 2,
          member: 'Sarah M.',
          rating: 5,
          text: 'Very knowledgeable about form and technique. Highly recommend!',
          date: '1 month ago',
        },
      ],
      availability: {
        monday: ['10:00', '14:00', '16:00', '18:00'],
        tuesday: ['10:00', '14:00', '17:00'],
        wednesday: ['09:00', '15:00', '18:00'],
        thursday: ['10:00', '14:00', '16:00'],
        friday: ['09:00', '12:00', '17:00'],
        saturday: ['10:00', '14:00'],
        sunday: [],
      },
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      photo: 'https://via.placeholder.com/200?text=Sarah',
      specializations: ['Yoga', 'Flexibility', 'Mind & Body'],
      rating: 4.8,
      reviewCount: 203,
      hourlyRate: 65,
      nextAvailable: 'Tomorrow 10:00 AM',
      gender: 'female',
      bio: 'Yoga instructor and wellness coach specializing in mindfulness-based fitness.',
      videoUrl: 'https://res.cloudinary.com/demo/video/upload/sample',
      certifications: ['RYT-200', 'Yoga Alliance', 'Wellness Coach'],
      gallery: [
        'https://via.placeholder.com/300?text=Yoga+1',
        'https://via.placeholder.com/300?text=Yoga+2',
      ],
      reviews: [
        {
          id: 1,
          member: 'Emma W.',
          rating: 5,
          text: 'Transformed my flexibility and mindset. Life-changing!',
          date: '3 weeks ago',
        },
      ],
      availability: {
        monday: ['09:00', '11:00', '17:00'],
        tuesday: ['10:00', '15:00'],
        wednesday: ['09:00', '11:00', '18:00'],
        thursday: ['10:00', '14:00'],
        friday: ['09:00', '16:00'],
        saturday: ['10:00'],
        sunday: ['10:00'],
      },
    },
    {
      id: 3,
      name: 'Mike Thompson',
      photo: 'https://via.placeholder.com/200?text=Mike',
      specializations: ['Boxing', 'Cardio', 'Weight Loss'],
      rating: 4.7,
      reviewCount: 134,
      hourlyRate: 80,
      nextAvailable: 'Thursday 5:00 PM',
      gender: 'male',
      bio: 'Professional boxing coach and cardiovascular fitness specialist.',
      videoUrl: 'https://res.cloudinary.com/demo/video/upload/sample',
      certifications: ['ACE', 'Boxing Coach', 'Nutrition Specialist'],
      gallery: [
        'https://via.placeholder.com/300?text=Boxing+1',
        'https://via.placeholder.com/300?text=Boxing+2',
        'https://via.placeholder.com/300?text=Boxing+3',
      ],
      reviews: [
        {
          id: 1,
          member: 'David L.',
          rating: 5,
          text: 'Lost 20 lbs in 3 months with Mike\'s program!',
          date: '1 month ago',
        },
      ],
      availability: {
        monday: ['16:00', '18:00'],
        tuesday: ['17:00', '19:00'],
        wednesday: ['16:00', '18:00'],
        thursday: ['17:00', '19:00'],
        friday: ['16:00', '18:00'],
        saturday: [],
        sunday: [],
      },
    },
    {
      id: 4,
      name: 'Jennifer Lee',
      photo: 'https://via.placeholder.com/200?text=Jennifer',
      specializations: ['Pilates', 'Rehabilitation', 'Posture'],
      rating: 4.9,
      reviewCount: 178,
      hourlyRate: 70,
      nextAvailable: 'Today 6:00 PM',
      gender: 'female',
      bio: 'Certified Pilates instructor specializing in injury rehabilitation and postural correction.',
      videoUrl: 'https://res.cloudinary.com/demo/video/upload/sample',
      certifications: ['NAMA', 'Pilates Certification', 'Physical Therapy'],
      gallery: [
        'https://via.placeholder.com/300?text=Pilates+1',
        'https://via.placeholder.com/300?text=Pilates+2',
      ],
      reviews: [
        {
          id: 1,
          member: 'Lisa K.',
          rating: 5,
          text: 'Helped me recover from back injury. Professional and caring.',
          date: '2 weeks ago',
        },
      ],
      availability: {
        monday: ['09:00', '14:00', '18:00'],
        tuesday: ['09:00', '15:00', '18:00'],
        wednesday: ['14:00', '18:00'],
        thursday: ['09:00', '14:00'],
        friday: ['09:00', '14:00', '18:00'],
        saturday: ['10:00', '14:00'],
        sunday: [],
      },
    },
    {
      id: 5,
      name: 'Carlos Ruiz',
      photo: 'https://via.placeholder.com/200?text=Carlos',
      specializations: ['Nutrition', 'Muscle Building', 'Supplements'],
      rating: 4.6,
      reviewCount: 98,
      hourlyRate: 85,
      nextAvailable: 'Wednesday 3:00 PM',
      gender: 'male',
      bio: 'Nutrition specialist and muscle-building expert with 6+ years in fitness coaching.',
      videoUrl: 'https://res.cloudinary.com/demo/video/upload/sample',
      certifications: ['ISSN-SNS', 'NASM-CNC', 'Muscle Building'],
      gallery: [
        'https://via.placeholder.com/300?text=Nutrition+1',
        'https://via.placeholder.com/300?text=Nutrition+2',
        'https://via.placeholder.com/300?text=Nutrition+3',
      ],
      reviews: [],
      availability: {
        monday: ['12:00', '15:00', '18:00'],
        tuesday: ['12:00', '17:00'],
        wednesday: ['15:00', '18:00'],
        thursday: ['12:00', '15:00'],
        friday: ['12:00', '18:00'],
        saturday: [],
        sunday: [],
      },
    },
    {
      id: 6,
      name: 'Michelle Davis',
      photo: 'https://via.placeholder.com/200?text=Michelle',
      specializations: ['Zumba', 'Dance Fitness', 'Group Training'],
      rating: 4.8,
      reviewCount: 212,
      hourlyRate: 60,
      nextAvailable: 'Today 5:30 PM',
      gender: 'female',
      bio: 'Energetic fitness instructor specializing in dance-based workouts and group training programs.',
      videoUrl: 'https://res.cloudinary.com/demo/video/upload/sample',
      certifications: ['ACE', 'Zumba Instructor', 'Group Fitness'],
      gallery: [
        'https://via.placeholder.com/300?text=Dance+1',
        'https://via.placeholder.com/300?text=Dance+2',
      ],
      reviews: [
        {
          id: 1,
          member: 'Rachel T.',
          rating: 5,
          text: 'So much fun! Best workouts ever! Always smiling.',
          date: '1 week ago',
        },
      ],
      availability: {
        monday: ['17:00', '18:30'],
        tuesday: ['17:00', '18:30'],
        wednesday: ['17:00', '18:30'],
        thursday: ['17:00', '18:30'],
        friday: ['17:00', '18:30'],
        saturday: ['10:00', '14:00'],
        sunday: ['10:00'],
      },
    },
  ];

  // Filter trainers
  const filteredTrainers = useMemo(() => {
    return trainers.filter((trainer) => {
      // Search filter
      if (
        searchQuery &&
        !trainer.name.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Specialization filter
      if (activeFilters.specializations.length > 0) {
        const hasSpecialization = activeFilters.specializations.some((spec) =>
          trainer.specializations.includes(spec)
        );
        if (!hasSpecialization) return false;
      }

      // Price range filter
      if (
        trainer.hourlyRate < activeFilters.priceRange[0] ||
        trainer.hourlyRate > activeFilters.priceRange[1]
      ) {
        return false;
      }

      // Rating filter
      if (trainer.rating < activeFilters.minRating) {
        return false;
      }

      // Gender filter
      if (
        activeFilters.gender !== 'any' &&
        trainer.gender !== activeFilters.gender
      ) {
        return false;
      }

      return true;
    });
  }, [searchQuery, activeFilters]);

  // Get all unique specializations
  const allSpecializations = [
    ...new Set(trainers.flatMap((t) => t.specializations)),
  ];

  // Toggle specialization filter
  const toggleSpecialization = (spec) => {
    setActiveFilters((prev) => ({
      ...prev,
      specializations: prev.specializations.includes(spec)
        ? prev.specializations.filter((s) => s !== spec)
        : [...prev.specializations, spec],
    }));
  };

  // Reset filters
  const resetFilters = () => {
    setActiveFilters({
      specializations: [],
      priceRange: [0, 150],
      minRating: 0,
      availability: 'any',
      gender: 'any',
    });
    setSearchQuery('');
  };

  const hasActiveFilters =
    searchQuery ||
    activeFilters.specializations.length > 0 ||
    activeFilters.priceRange[0] > 0 ||
    activeFilters.priceRange[1] < 150 ||
    activeFilters.minRating > 0 ||
    activeFilters.gender !== 'any' ||
    activeFilters.availability !== 'any';

  return (
    <>
      <SEO
        title="Personal Trainers - CrunchFit Pro"
        description="Find and book your personal trainer"
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
                {t('member.trainers.title') || 'Personal Trainers'}
              </h1>
              <p
                className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
              >
                {t('member.trainers.subtitle') ||
                  'Find the perfect trainer for your fitness goals'}
              </p>
            </motion.div>

            {/* Search and Filter Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 space-y-4"
            >
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder={t('member.trainers.searchByName') || 'Search by name...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-12 pr-4 py-3 rounded-lg border transition-all ${
                    isDark
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-accent focus:ring-2 focus:ring-accent/20'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-accent focus:ring-2 focus:ring-accent/20'
                  }`}
                />
              </div>

              {/* Filter Toggle and Result Count */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                    showFilters
                      ? 'bg-accent text-white'
                      : isDark
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  {t('member.trainers.filters') || 'Filters'}
                  {hasActiveFilters && (
                    <span className="ml-2 px-2 py-0.5 bg-white/20 rounded text-xs font-bold">
                      {activeFilters.specializations.length +
                        (activeFilters.minRating > 0 ? 1 : 0) +
                        (activeFilters.gender !== 'any' ? 1 : 0)}
                    </span>
                  )}
                </button>

                <p
                  className={`text-sm font-semibold ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  {filteredTrainers.length}{' '}
                  {t('member.trainers.trainersFound') || 'trainers found'}
                </p>
              </div>

              {/* Filters Panel */}
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`p-6 rounded-lg border ${
                    isDark
                      ? 'bg-gray-800 border-gray-700'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Specialization Filter */}
                    <div>
                      <h3
                        className={`font-semibold mb-3 ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        {t('member.trainers.specialization') || 'Specialization'}
                      </h3>
                      <div className="space-y-2">
                        {allSpecializations.map((spec) => (
                          <label
                            key={spec}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={activeFilters.specializations.includes(
                                spec
                              )}
                              onChange={() => toggleSpecialization(spec)}
                              className="w-4 h-4 rounded accent"
                            />
                            <span
                              className={`text-sm ${
                                isDark
                                  ? 'text-gray-300'
                                  : 'text-gray-700'
                              }`}
                            >
                              {spec}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Price Range Filter */}
                    <div>
                      <h3
                        className={`font-semibold mb-3 ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        <DollarSign className="w-4 h-4 inline mr-2" />
                        {t('member.trainers.priceRange') || 'Price Range'}
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            max="150"
                            value={activeFilters.priceRange[0]}
                            onChange={(e) =>
                              setActiveFilters((prev) => ({
                                ...prev,
                                priceRange: [
                                  parseInt(e.target.value),
                                  prev.priceRange[1],
                                ],
                              }))
                            }
                            className={`w-full px-2 py-1 rounded text-sm border ${
                              isDark
                                ? 'bg-gray-700 border-gray-600 text-white'
                                : 'bg-white border-gray-300'
                            }`}
                          />
                          <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                            -
                          </span>
                          <input
                            type="number"
                            min="0"
                            max="150"
                            value={activeFilters.priceRange[1]}
                            onChange={(e) =>
                              setActiveFilters((prev) => ({
                                ...prev,
                                priceRange: [
                                  prev.priceRange[0],
                                  parseInt(e.target.value),
                                ],
                              }))
                            }
                            className={`w-full px-2 py-1 rounded text-sm border ${
                              isDark
                                ? 'bg-gray-700 border-gray-600 text-white'
                                : 'bg-white border-gray-300'
                            }`}
                          />
                        </div>
                        <p
                          className={`text-xs ${
                            isDark ? 'text-gray-400' : 'text-gray-600'
                          }`}
                        >
                          ${activeFilters.priceRange[0]} - $
                          {activeFilters.priceRange[1]}/hr
                        </p>
                      </div>
                    </div>

                    {/* Rating Filter */}
                    <div>
                      <h3
                        className={`font-semibold mb-3 ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        <Star className="w-4 h-4 inline mr-2" />
                        {t('member.trainers.minimumRating') || 'Minimum Rating'}
                      </h3>
                      <select
                        value={activeFilters.minRating}
                        onChange={(e) =>
                          setActiveFilters((prev) => ({
                            ...prev,
                            minRating: parseFloat(e.target.value),
                          }))
                        }
                        className={`w-full px-3 py-2 rounded border text-sm ${
                          isDark
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300'
                        }`}
                      >
                        <option value="0">
                          {t('member.trainers.anyRating') || 'Any Rating'}
                        </option>
                        <option value="4">4+ Stars</option>
                        <option value="4.5">4.5+ Stars</option>
                        <option value="4.8">4.8+ Stars</option>
                      </select>
                    </div>

                    {/* Gender Filter */}
                    <div>
                      <h3
                        className={`font-semibold mb-3 ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        <Users className="w-4 h-4 inline mr-2" />
                        {t('member.trainers.gender') || 'Gender'}
                      </h3>
                      <select
                        value={activeFilters.gender}
                        onChange={(e) =>
                          setActiveFilters((prev) => ({
                            ...prev,
                            gender: e.target.value,
                          }))
                        }
                        className={`w-full px-3 py-2 rounded border text-sm ${
                          isDark
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300'
                        }`}
                      >
                        <option value="any">
                          {t('member.trainers.anyGender') || 'Any'}
                        </option>
                        <option value="male">
                          {t('member.trainers.male') || 'Male'}
                        </option>
                        <option value="female">
                          {t('member.trainers.female') || 'Female'}
                        </option>
                      </select>
                    </div>

                    {/* Availability Filter */}
                    <div>
                      <h3
                        className={`font-semibold mb-3 ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        <Calendar className="w-4 h-4 inline mr-2" />
                        {t('member.trainers.availability') || 'Availability'}
                      </h3>
                      <select
                        value={activeFilters.availability}
                        onChange={(e) =>
                          setActiveFilters((prev) => ({
                            ...prev,
                            availability: e.target.value,
                          }))
                        }
                        className={`w-full px-3 py-2 rounded border text-sm ${
                          isDark
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300'
                        }`}
                      >
                        <option value="any">
                          {t('member.trainers.anyTime') || 'Any Time'}
                        </option>
                        <option value="today">
                          {t('member.trainers.today') || 'Today'}
                        </option>
                        <option value="week">
                          {t('member.trainers.thisWeek') || 'This Week'}
                        </option>
                      </select>
                    </div>
                  </div>

                  {/* Reset Filters Button */}
                  {hasActiveFilters && (
                    <button
                      onClick={resetFilters}
                      className="mt-4 flex items-center gap-2 text-sm font-semibold text-accent hover:opacity-80 transition-all"
                    >
                      <X className="w-4 h-4" />
                      {t('member.trainers.resetFilters') || 'Reset Filters'}
                    </button>
                  )}
                </motion.div>
              )}
            </motion.div>

            {/* Trainers Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredTrainers.length === 0 ? (
                <div className={`col-span-full ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg p-12 text-center`}>
                  <p
                    className={`font-semibold mb-2 ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {t('member.trainers.noTrainersFound') ||
                      'No trainers match your filters'}
                  </p>
                  <p
                    className={`text-sm ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    {t('member.trainers.tryAdjustingFilters') ||
                      'Try adjusting your filters to see more results'}
                  </p>
                </div>
              ) : (
                filteredTrainers.map((trainer, index) => (
                  <motion.div
                    key={trainer.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <TrainerCard trainer={trainer} />
                  </motion.div>
                ))
              )}
            </motion.div>
          </div>
        </div>
      </MemberLayout>
    </>
  );
};

export default TrainersPage;
