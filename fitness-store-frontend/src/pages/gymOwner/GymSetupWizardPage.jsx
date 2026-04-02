import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  ChevronLeft,
  Check,
  Upload,
  Plus,
  X,
  Copy,
  Download,
  Mail,
  FileUp,
  Lock,
  CheckCircle2,
  SkipForward,
  Zap,
  Clock,
  Users,
  CreditCard,
  Shield,
} from 'lucide-react';
import { ThemeContext } from '../../contexts/ThemeContext';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const amenitiesList = [
  'Pool',
  'Sauna/Steam Room',
  'Childcare',
  'Parking',
  'Locker Rooms',
  'Wi-Fi',
  'Towel Service',
  'Juice Bar',
  'Personal Training',
  'Group Classes',
  'Yoga Studio',
  'Rehabilitation Services',
];

const classCategories = ['Cardio', 'Strength', 'Yoga', 'Pilates', 'Swimming', 'CrossFit', 'Dance', 'Other'];

// Confetti component
const Confetti = () => {
  const confetti = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 1,
  }));

  return (
    <>
      {confetti.map((item) => (
        <motion.div
          key={item.id}
          initial={{ y: -10, opacity: 1 }}
          animate={{ y: 500, opacity: 0 }}
          transition={{ delay: item.delay, duration: item.duration }}
          className="fixed w-2 h-2 rounded-full pointer-events-none"
          style={{
            left: `${item.left}%`,
            backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'][
              Math.floor(Math.random() * 5)
            ],
          }}
        />
      ))}
    </>
  );
};

const GymSetupWizardPage = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);

  // Form data
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('gymSetupWizardData');
    return saved
      ? JSON.parse(saved)
      : {
          // Step 1: Profile
          coverPhoto: null,
          description: '',
          openingHours: {
            Monday: { open: '08:00', close: '22:00', closed: false },
            Tuesday: { open: '08:00', close: '22:00', closed: false },
            Wednesday: { open: '08:00', close: '22:00', closed: false },
            Thursday: { open: '08:00', close: '22:00', closed: false },
            Friday: { open: '08:00', close: '23:00', closed: false },
            Saturday: { open: '09:00', close: '23:00', closed: false },
            Sunday: { open: '09:00', close: '21:00', closed: false },
          },
          amenities: [],

          // Step 2: Classes
          classes: [],

          // Step 3: Members
          inviteEmails: [],
          gymSlug: 'fitlife-gym', // Would be generated from gym name

          // Step 4: Payments
          stripeConnected: false,

          // Step 5: Documents
          documents: [],
        };
  });

  const [errors, setErrors] = useState({});
  const [completed, setCompleted] = useState(() => {
    const saved = localStorage.getItem('gymSetupCompleted');
    return saved ? JSON.parse(saved) : [false, false, false, false, false];
  });

  // Update progress
  useEffect(() => {
    const newProgress = completed.filter(Boolean).length * 20;
    setProgress(newProgress);
  }, [completed]);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('gymSetupWizardData', JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    localStorage.setItem('gymSetupCompleted', JSON.stringify(completed));
  }, [completed]);

  const stepTitles = [
    { num: 1, title: 'Complete Profile', icon: <Zap size={20} /> },
    { num: 2, title: 'Add Your Classes', icon: <Clock size={20} /> },
    { num: 3, title: 'Invite Members', icon: <Users size={20} /> },
    { num: 4, title: 'Set Up Payments', icon: <CreditCard size={20} /> },
    { num: 5, title: 'Verify Documents', icon: <Shield size={20} /> },
  ];

  const stepPercentages = [30, 50, 70, 85, 100];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAmenityToggle = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleHourChange = (day, field, value) => {
    setFormData((prev) => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        [day]: {
          ...prev.openingHours[day],
          [field]: value,
        },
      },
    }));
  };

  const handleToggleClosed = (day) => {
    setFormData((prev) => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        [day]: {
          ...prev.openingHours[day],
          closed: !prev.openingHours[day].closed,
        },
      },
    }));
  };

  // Classes management
  const [newClass, setNewClass] = useState({
    name: '',
    category: '',
    day: '',
    time: '09:00',
    duration: '60',
    capacity: '20',
    instructor: '',
  });

  const addClassToList = () => {
    if (newClass.name && newClass.category && newClass.day && newClass.instructor) {
      setFormData((prev) => ({
        ...prev,
        classes: [...prev.classes, { ...newClass, id: Date.now() }],
      }));
      setNewClass({
        name: '',
        category: '',
        day: '',
        time: '09:00',
        duration: '60',
        capacity: '20',
        instructor: '',
      });
    }
  };

  const removeClass = (id) => {
    setFormData((prev) => ({
      ...prev,
      classes: prev.classes.filter((c) => c.id !== id),
    }));
  };

  const addSampleClasses = () => {
    const samples = [
      {
        id: Date.now(),
        name: 'Morning Cardio',
        category: 'Cardio',
        day: 'Monday',
        time: '06:00',
        duration: '45',
        capacity: '30',
        instructor: 'Sarah Johnson',
      },
      {
        id: Date.now() + 1,
        name: 'Strength Training',
        category: 'Strength',
        day: 'Wednesday',
        time: '17:00',
        duration: '60',
        capacity: '20',
        instructor: 'Mike Chen',
      },
      {
        id: Date.now() + 2,
        name: 'Evening Yoga',
        category: 'Yoga',
        day: 'Friday',
        time: '18:00',
        duration: '90',
        capacity: '25',
        instructor: 'Emma Wilson',
      },
    ];
    setFormData((prev) => ({
      ...prev,
      classes: [...prev.classes, ...samples],
    }));
  };

  // Email invites management
  const [inviteEmail, setInviteEmail] = useState('');

  const addInviteEmail = () => {
    if (inviteEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setFormData((prev) => ({
        ...prev,
        inviteEmails: [...prev.inviteEmails, inviteEmail],
      }));
      setInviteEmail('');
    }
  };

  const removeInviteEmail = (email) => {
    setFormData((prev) => ({
      ...prev,
      inviteEmails: prev.inviteEmails.filter((e) => e !== email),
    }));
  };

  // Validation and navigation
  const validateStep = (stepNum) => {
    const newErrors = {};

    if (stepNum === 1) {
      if (!formData.description.trim()) newErrors.description = 'Description required';
      if (formData.amenities.length === 0) newErrors.amenities = 'Select at least one amenity';
    }

    if (stepNum === 2) {
      if (formData.classes.length === 0) newErrors.classes = 'Add at least one class';
    }

    // Steps 3, 4, 5 can be skipped
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      const newCompleted = [...completed];
      newCompleted[step - 1] = true;
      setCompleted(newCompleted);
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  const handleSkip = () => {
    const newCompleted = [...completed];
    newCompleted[step - 1] = true;
    setCompleted(newCompleted);
    setStep(step + 1);
    setShowSkipConfirm(false);
    window.scrollTo(0, 0);
  };

  const handleComplete = () => {
    const newCompleted = [...completed];
    newCompleted[step - 1] = true;
    setCompleted(newCompleted);
    setShowConfetti(true);
    
    // Clear data and redirect after animation
    setTimeout(() => {
      localStorage.removeItem('gymSetupWizardData');
      localStorage.removeItem('gymSetupCompleted');
      window.location.href = '/gym-owner-dashboard';
    }, 4000);
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} py-8 px-4`}>
      {showConfetti && <Confetti />}

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="text-center mb-4">
            <h1 className="text-4xl font-bold mb-2">Welcome to CrunchFit Pro! 🎉</h1>
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Let's set up your gym in just 5 minutes
            </p>
          </div>

          {/* Completion Celebration */}
          <AnimatePresence>
            {step === 6 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`${isDark ? 'bg-gradient-to-r from-blue-900 to-purple-900 border-blue-700' : 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-300'} rounded-lg border-2 p-8 text-center mb-8`}
              >
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2 }} className="inline-block mb-4">
                  <CheckCircle2 size={64} className="text-green-500" />
                </motion.div>
                <h2 className="text-3xl font-bold mb-2">Your Gym is Live! 🚀</h2>
                <p className={`text-lg mb-6 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Congratulations! Your gym profile is ready to welcome members.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {stepTitles.map((s, idx) => (
              <div key={s.num} className="flex flex-col items-center flex-1">
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold mb-2 transition-colors ${
                    completed[idx]
                      ? 'bg-green-500 text-white'
                      : s.num === step
                      ? isDark
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-600 text-white'
                      : isDark
                      ? 'bg-gray-700 text-gray-400'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {completed[idx] ? <Check size={20} /> : s.num}
                </motion.div>
                <span className={`text-xs font-semibold text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {s.title}
                </span>
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}>
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-right text-sm font-semibold text-blue-600 mt-2">{progress}% Complete</p>
        </div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-8 mb-8 min-h-96`}
        >
          <AnimatePresence mode="wait">
            {/* Completion Screen */}
            {step === 6 && (
              <motion.div key="complete" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <div className="text-center py-12">
                  <h3 className="text-2xl font-bold mb-6">What's Next?</h3>
                  <div className="space-y-3">
                    <a
                      href="/my-gym"
                      className="block p-4 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
                    >
                      View Your Gym Page
                    </a>
                    <a
                      href="/invite-members"
                      className="block p-4 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors"
                    >
                      Invite Members
                    </a>
                    <a
                      href="/add-class"
                      className="block p-4 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors"
                    >
                      Add a Class
                    </a>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 1: Complete Profile */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-2xl font-bold mb-2">Complete Your Gym Profile</h2>
                <p className={`text-sm mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>30% Progress</p>

                <div className="space-y-6">
                  {/* Cover Photo */}
                  <div>
                    <label className="block text-sm font-semibold mb-3">Cover Photo</label>
                    <div
                      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                        isDark
                          ? 'border-gray-700 hover:border-blue-600 hover:bg-gray-700'
                          : 'border-gray-300 hover:border-blue-600 hover:bg-gray-50'
                      }`}
                    >
                      <Upload size={32} className="mx-auto mb-2 text-gray-400" />
                      <p className="font-semibold">Click to upload or drag and drop</p>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>JPG, PNG up to 5MB</p>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">Gym Description *</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Tell members about your gym... What equipment, services, and culture do you offer?"
                      rows="4"
                      className={`w-full px-4 py-2 rounded-lg border ${
                        isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300'
                      }`}
                    />
                    {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                  </div>

                  {/* Opening Hours */}
                  <div>
                    <label className="block text-sm font-semibold mb-3">Opening Hours</label>
                    <div className="space-y-3">
                      {daysOfWeek.map((day) => (
                        <div key={day} className="flex items-center gap-3">
                          <span className="w-24 text-sm font-medium">{day}</span>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={formData.openingHours[day].closed}
                              onChange={() => handleToggleClosed(day)}
                              className="w-4 h-4"
                            />
                            <span className="text-sm">Closed</span>
                          </label>
                          {!formData.openingHours[day].closed && (
                            <>
                              <input
                                type="time"
                                value={formData.openingHours[day].open}
                                onChange={(e) => handleHourChange(day, 'open', e.target.value)}
                                className={`px-3 py-1 rounded border text-sm ${isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300'}`}
                              />
                              <span>to</span>
                              <input
                                type="time"
                                value={formData.openingHours[day].close}
                                onChange={(e) => handleHourChange(day, 'close', e.target.value)}
                                className={`px-3 py-1 rounded border text-sm ${isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300'}`}
                              />
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Amenities */}
                  <div>
                    <label className="block text-sm font-semibold mb-3">Amenities *</label>
                    <div className="grid grid-cols-2 gap-3">
                      {amenitiesList.map((amenity) => (
                        <label key={amenity} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={formData.amenities.includes(amenity)}
                            onChange={() => handleAmenityToggle(amenity)}
                            className="w-4 h-4"
                          />
                          <span className="text-sm">{amenity}</span>
                        </label>
                      ))}
                    </div>
                    {errors.amenities && <p className="text-red-500 text-xs mt-2">{errors.amenities}</p>}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Add Classes */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-2xl font-bold mb-2">Add Your Classes</h2>
                <p className={`text-sm mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>50% Progress</p>

                <div className="space-y-6">
                  {/* Quick Add Form */}
                  <div
                    className={`p-4 rounded-lg ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-blue-50 border-blue-200'} border`}
                  >
                    <h3 className="font-bold mb-4">Quick Add Class</h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <input
                        type="text"
                        placeholder="Class name (e.g., Yoga)"
                        value={newClass.name}
                        onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                        className={`px-3 py-2 rounded border text-sm ${isDark ? 'border-gray-600 bg-gray-800' : 'border-gray-300'}`}
                      />
                      <select
                        value={newClass.category}
                        onChange={(e) => setNewClass({ ...newClass, category: e.target.value })}
                        className={`px-3 py-2 rounded border text-sm ${isDark ? 'border-gray-600 bg-gray-800' : 'border-gray-300'}`}
                      >
                        <option value="">Category</option>
                        {classCategories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>

                      <select
                        value={newClass.day}
                        onChange={(e) => setNewClass({ ...newClass, day: e.target.value })}
                        className={`px-3 py-2 rounded border text-sm ${isDark ? 'border-gray-600 bg-gray-800' : 'border-gray-300'}`}
                      >
                        <option value="">Select day</option>
                        {daysOfWeek.map((day) => (
                          <option key={day} value={day}>
                            {day}
                          </option>
                        ))}
                      </select>

                      <input
                        type="time"
                        value={newClass.time}
                        onChange={(e) => setNewClass({ ...newClass, time: e.target.value })}
                        className={`px-3 py-2 rounded border text-sm ${isDark ? 'border-gray-600 bg-gray-800' : 'border-gray-300'}`}
                      />

                      <input
                        type="number"
                        placeholder="Duration (mins)"
                        value={newClass.duration}
                        onChange={(e) => setNewClass({ ...newClass, duration: e.target.value })}
                        className={`px-3 py-2 rounded border text-sm ${isDark ? 'border-gray-600 bg-gray-800' : 'border-gray-300'}`}
                      />

                      <input
                        type="number"
                        placeholder="Capacity"
                        value={newClass.capacity}
                        onChange={(e) => setNewClass({ ...newClass, capacity: e.target.value })}
                        className={`px-3 py-2 rounded border text-sm ${isDark ? 'border-gray-600 bg-gray-800' : 'border-gray-300'}`}
                      />

                      <input
                        type="text"
                        placeholder="Instructor name"
                        value={newClass.instructor}
                        onChange={(e) => setNewClass({ ...newClass, instructor: e.target.value })}
                        className={`px-3 py-2 rounded border text-sm col-span-2 ${isDark ? 'border-gray-600 bg-gray-800' : 'border-gray-300'}`}
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={addClassToList}
                        className="flex-1 px-3 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Plus size={16} /> Add Class
                      </button>
                      <button
                        onClick={addSampleClasses}
                        className={`flex-1 px-3 py-2 rounded font-semibold border transition-colors ${
                          isDark ? 'border-gray-600 hover:bg-gray-600' : 'border-gray-300 hover:bg-gray-100'
                        }`}
                      >
                        Add 3 Sample Classes
                      </button>
                    </div>
                  </div>

                  {/* Classes List */}
                  <div>
                    <h3 className="font-bold mb-3">Classes ({formData.classes.length})</h3>
                    {formData.classes.length === 0 ? (
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>No classes added yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {formData.classes.map((cls) => (
                          <div
                            key={cls.id}
                            className={`flex items-start justify-between p-3 rounded border ${
                              isDark ? 'border-gray-700 bg-gray-700' : 'border-gray-300 bg-gray-50'
                            }`}
                          >
                            <div>
                              <p className="font-semibold">{cls.name}</p>
                              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                {cls.category} • {cls.day} at {cls.time} • {cls.duration} mins •{' '}
                                <span>{cls.instructor}</span>
                              </p>
                            </div>
                            <button
                              onClick={() => removeClass(cls.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    {errors.classes && <p className="text-red-500 text-xs mt-2">{errors.classes}</p>}
                  </div>

                  {/* CSV Import */}
                  <div
                    className={`p-4 rounded-lg border-2 border-dashed ${isDark ? 'border-gray-600' : 'border-gray-300'}`}
                  >
                    <div className="flex items-center gap-3">
                      <FileUp size={20} className="text-gray-400" />
                      <div>
                        <p className="text-sm font-semibold">Import from CSV</p>
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          Bulk upload classes (integration ready)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Invite Members */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-2xl font-bold mb-2">Invite Your First Members</h2>
                <p className={`text-sm mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>70% Progress</p>

                <div className="space-y-6">
                  {/* Gym URL */}
                  <div>
                    <label className="block text-sm font-semibold mb-3">Your Unique Gym URL</label>
                    <div className={`flex items-center gap-2 p-4 rounded-lg border ${isDark ? 'border-gray-700 bg-gray-700' : 'border-gray-300 bg-gray-50'}`}>
                      <input
                        type="text"
                        value={`crunchfitpro.com/gyms/${formData.gymSlug}`}
                        disabled
                        className={`flex-1 bg-transparent outline-none font-mono ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                      />
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`crunchfitpro.com/gyms/${formData.gymSlug}`);
                          alert('Copied to clipboard!');
                        }}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Email Invites */}
                  <div>
                    <label className="block text-sm font-semibold mb-3">Send Invitation Emails</label>
                    <div className="flex gap-2 mb-4">
                      <input
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="member@example.com"
                        onKeyPress={(e) => e.key === 'Enter' && addInviteEmail()}
                        className={`flex-1 px-4 py-2 rounded border ${isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300'}`}
                      />
                      <button
                        onClick={addInviteEmail}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2"
                      >
                        <Plus size={18} /> Add
                      </button>
                    </div>

                    {formData.inviteEmails.length > 0 && (
                      <div className="space-y-2">
                        {formData.inviteEmails.map((email) => (
                          <div
                            key={email}
                            className={`flex items-center justify-between p-3 rounded border ${
                              isDark ? 'border-gray-700 bg-gray-700' : 'border-gray-300 bg-gray-50'
                            }`}
                          >
                            <span className="text-sm">{email}</span>
                            <button
                              onClick={() => removeInviteEmail(email)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Send Invites Button */}
                  {formData.inviteEmails.length > 0 && (
                    <button className="w-full px-4 py-3 bg-green-600 text-white rounded font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                      <Mail size={18} />
                      Send {formData.inviteEmails.length} Invitation{formData.inviteEmails.length !== 1 ? 's' : ''}
                    </button>
                  )}

                  {/* QR Code */}
                  <div
                    className={`p-6 rounded-lg border-2 border-dashed text-center ${
                      isDark ? 'border-gray-700 bg-gray-700' : 'border-gray-300 bg-gray-50'
                    }`}
                  >
                    <div className="w-32 h-32 bg-gray-400 rounded mx-auto mb-4 flex items-center justify-center">
                      <span className="text-xs text-gray-600">QR Code</span>
                    </div>
                    <p className="font-semibold mb-2">In-Gym QR Code</p>
                    <p className={`text-xs mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Print and display this QR code at your gym
                    </p>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 mx-auto">
                      <Download size={16} /> Download QR Code
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Payments */}
            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-2xl font-bold mb-2">Set Up Payments</h2>
                <p className={`text-sm mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>85% Progress</p>

                <div className="space-y-6">
                  <div
                    className={`p-6 rounded-lg border-2 ${isDark ? 'border-blue-900 bg-blue-900/20' : 'border-blue-200 bg-blue-50'}`}
                  >
                    <div className="flex gap-4">
                      <CreditCard size={40} className="text-blue-600 flex-shrink-0" />
                      <div>
                        <h3 className="font-bold mb-2">Stripe Connect Account</h3>
                        <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          Accept payments directly from your members. Seamless, secure payments via Stripe.
                        </p>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-semibold">
                          Connect Stripe Account
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-px bg-gray-400"></div>
                    <span className="text-gray-500 font-semibold">OR</span>
                    <div className="flex-1 h-px bg-gray-400"></div>
                  </div>

                  <div className={`p-6 rounded-lg border-2 ${isDark ? 'border-gray-700 bg-gray-700' : 'border-gray-300 bg-gray-50'}`}>
                    <h3 className="font-bold mb-2">Manage Payments Separately</h3>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      You can handle payment collection yourself and set up Stripe later.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 5: Verification */}
            {step === 5 && (
              <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-2xl font-bold mb-2">Verification Documents</h2>
                <p className={`text-sm mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>100% Progress (Final Step)</p>

                <div className="space-y-6">
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    To ensure compliance and security, please upload your business documents for verification.
                  </p>

                  {/* Document Upload Areas */}
                  {['Business Registration', 'Tax ID / EIN', 'Gym License'].map((docType, idx) => (
                    <div key={docType}>
                      <label className="block text-sm font-semibold mb-3">{docType} (Optional)</label>
                      <div
                        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                          isDark
                            ? 'border-gray-700 hover:border-blue-600 hover:bg-gray-700'
                            : 'border-gray-300 hover:border-blue-600 hover:bg-gray-50'
                        }`}
                      >
                        <Upload size={32} className="mx-auto mb-2 text-gray-400" />
                        <p className="text-sm font-semibold">Click to upload</p>
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          PDF, JPG, PNG up to 5MB
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Verification Info */}
                  <div
                    className={`p-4 rounded-lg border ${isDark ? 'border-yellow-900 bg-yellow-900/20' : 'border-yellow-200 bg-yellow-50'}`}
                  >
                    <p className={`text-sm font-semibold ${isDark ? 'text-yellow-400' : 'text-yellow-800'}`}>
                      ⏱️ Verification Timeline
                    </p>
                    <p className={`text-xs mt-2 ${isDark ? 'text-yellow-300/80' : 'text-yellow-700'}`}>
                      Your gym will display a "Pending Verification" badge. Most gyms are verified within 24-48 hours.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Navigation Buttons */}
        {step !== 6 && (
          <div className="flex gap-4 justify-between items-center">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className={`px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors ${
                step === 1
                  ? 'opacity-50 cursor-not-allowed'
                  : isDark
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
              }`}
            >
              <ChevronLeft size={18} />
              Back
            </button>

            <button
              onClick={() => setShowSkipConfirm(true)}
              className={`px-4 py-2 text-sm font-semibold flex items-center gap-2 transition-colors ${
                isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <SkipForward size={16} /> Skip for Now
            </button>

            <button
              onClick={step === 5 ? handleComplete : handleNext}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-colors flex items-center gap-2"
            >
              {step === 5 ? (
                <>
                  <Check size={18} />
                  Complete Setup
                </>
              ) : (
                <>
                  Next
                  <ChevronRight size={18} />
                </>
              )}
            </button>
          </div>
        )}

        {/* Skip Confirmation Modal */}
        <AnimatePresence>
          {showSkipConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              onClick={() => setShowSkipConfirm(false)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                onClick={(e) => e.stopPropagation()}
                className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 max-w-sm`}
              >
                <h3 className="text-lg font-bold mb-2">Skip This Step?</h3>
                <p className={`text-sm mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  You can always complete this step later from your dashboard.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowSkipConfirm(false)}
                    className={`flex-1 px-4 py-2 rounded font-semibold transition-colors ${
                      isDark
                        ? 'bg-gray-700 hover:bg-gray-600 text-white'
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSkip}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Skip
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GymSetupWizardPage;
