import React, { useState, useMemo, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertCircle,
  Archive,
  Award,
  BookOpen,
  Check,
  ChevronDown,
  Clock,
  Download,
  Edit2,
  Eye,
  FileText,
  Filter,
  Mail,
  MoreVertical,
  Phone,
  Search,
  Star,
  Trash2,
  User,
  X,
  CheckCircle,
  XCircle,
  MessageSquare,
} from 'lucide-react';
import { ThemeContext } from '../../contexts/ThemeContext';
import { LanguageContext } from '../../contexts/LanguageContext';
import AdminLayout from '../../layouts/AdminLayout';

// Mock pending applications
const mockPendingApplications = [
  {
    id: 'APP-001',
    firstName: 'Sarah',
    lastName: 'Anderson',
    email: 'sarah.anderson@email.com',
    phone: '(212) 555-0142',
    bio: 'Certified fitness trainer with 8 years of experience in personal training and group fitness.',
    experience: '8 years',
    certifications: [
      { id: 'CERT-001', name: 'ACE Personal Trainer', issuer: 'American Council on Exercise', date: '2018-06-15', document: 'ace-cert.pdf' },
      { id: 'CERT-002', name: 'NASM Nutrition Specialist', issuer: 'National Academy of Sports Medicine', date: '2019-03-20', document: 'nasm-nutrition.pdf' },
    ],
    specializations: ['HIIT', 'CrossFit', 'Strength Training'],
    availability: { monday: '6AM-8PM', tuesday: '6AM-8PM', wednesday: '6AM-8PM', thursday: '6AM-8PM', friday: '6AM-8PM', saturday: '8AM-6PM', sunday: 'Closed' },
    gym: 'GYM-001',
    status: 'pending',
    appliedDate: '2024-03-10',
    photo: 'https://images.unsplash.com/photo-1549819972-339815a4dfea?w=150&h=150&fit=crop',
  },
  {
    id: 'APP-002',
    firstName: 'Marcus',
    lastName: 'Johnson',
    email: 'marcus.j@email.com',
    phone: '(212) 555-0165',
    bio: 'Yoga instructor specializing in Vinyasa flow and meditation. Master\'s degree in Health & Wellness.',
    experience: '6 years',
    certifications: [
      { id: 'CERT-003', name: 'RYT 500 Yoga Alliance', issuer: 'Yoga Alliance', date: '2020-01-10', document: 'ryt500.pdf' },
    ],
    specializations: ['Yoga', 'Meditation', 'Flexibility'],
    availability: { monday: 'Closed', tuesday: '6AM-7PM', wednesday: '6AM-7PM', thursday: 'Closed', friday: '6AM-7PM', saturday: '8AM-12PM', sunday: 'Closed' },
    gym: 'GYM-002',
    status: 'pending',
    appliedDate: '2024-03-11',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
  },
  {
    id: 'APP-003',
    firstName: 'Jessica',
    lastName: 'Rodriguez',
    email: 'jrodriguez@email.com',
    phone: '(212) 555-0178',
    bio: 'Spinning instructor with passion for high-energy group fitness classes. 5 years of competitive cycling background.',
    experience: '5 years',
    certifications: [
      { id: 'CERT-004', name: 'Peloton Master Instructor', issuer: 'Peloton University', date: '2021-05-20', document: 'peloton.pdf' },
      { id: 'CERT-005', name: 'Group Fitness Instructor', issuer: 'ACE', date: '2019-11-05', document: 'group-fitness.pdf' },
    ],
    specializations: ['Cycling', 'Cardio', 'Endurance'],
    availability: { monday: '5AM-9PM', tuesday: '5AM-9PM', wednesday: '5AM-9PM', thursday: '5AM-9PM', friday: '5AM-9PM', saturday: '6AM-6PM', sunday: '6AM-6PM' },
    gym: 'GYM-003',
    status: 'pending',
    appliedDate: '2024-03-12',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
  },
  {
    id: 'APP-004',
    firstName: 'David',
    lastName: 'Chen',
    email: 'dchen.trainer@email.com',
    phone: '(212) 555-0191',
    bio: 'Former college athlete coaching strength and conditioning. Expert in functional fitness and rehabilitation.',
    experience: '7 years',
    certifications: [
      { id: 'CERT-006', name: 'CSCS Strength Coach', issuer: 'NSCA', date: '2017-08-10', document: 'cscs.pdf' },
      { id: 'CERT-007', name: 'Corrective Exercise Specialist', issuer: 'NASM-CES', date: '2018-12-15', document: 'nasm-ces.pdf' },
      { id: 'CERT-008', name: 'CPR/AED Certification', issuer: 'American Heart Association', date: '2024-01-20', document: 'cpr.pdf' },
    ],
    specializations: ['Strength Training', 'Rehabilitation', 'Functional Fitness'],
    availability: { monday: '6AM-8PM', tuesday: '6AM-8PM', wednesday: '6AM-8PM', thursday: '6AM-8PM', friday: '6AM-8PM', saturday: '8AM-5PM', sunday: 'Closed' },
    gym: 'GYM-001',
    status: 'pending',
    appliedDate: '2024-03-13',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
  },
];

// Mock active trainers
const mockActiveTrainers = [
  {
    id: 'T-001',
    firstName: 'Mike',
    lastName: 'Davis',
    email: 'mike.davis@crunchfit.com',
    phone: '(212) 555-0100',
    gym: 'GYM-001',
    specializations: ['HIIT', 'Cardio', 'Personal Training'],
    rating: 4.8,
    reviews: 145,
    sessionsThisMonth: 32,
    revenue: 4800,
    status: 'active',
    bio: 'High-energy HIIT instructor with 10 years of experience. Specializes in functional fitness.',
    certifications: 5,
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop',
    joinedDate: '2023-06-15',
  },
  {
    id: 'T-002',
    firstName: 'Emma',
    lastName: 'Wilson',
    email: 'emma.wilson@crunchfit.com',
    phone: '(212) 555-0111',
    gym: 'GYM-001',
    specializations: ['Yoga', 'Pilates', 'Flexibility'],
    rating: 4.9,
    reviews: 198,
    sessionsThisMonth: 28,
    revenue: 4200,
    status: 'active',
    bio: 'Certified yoga instructor with a focus on mindfulness and flexibility training.',
    certifications: 3,
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop',
    joinedDate: '2023-08-20',
  },
  {
    id: 'T-003',
    firstName: 'Lisa',
    lastName: 'Chen',
    email: 'lisa.chen@crunchfit.com',
    phone: '(212) 555-0122',
    gym: 'GYM-002',
    specializations: ['Cycling', 'Cardio', 'Aerobics'],
    rating: 4.7,
    reviews: 167,
    sessionsThisMonth: 35,
    revenue: 5250,
    status: 'active',
    bio: 'Dynamic spinning instructor energizing group fitness classes daily.',
    certifications: 4,
    photo: 'https://images.unsplash.com/photo-1507527173188-db96521e409d?w=80&h=80&fit=crop',
    joinedDate: '2023-07-10',
  },
  {
    id: 'T-004',
    firstName: 'Alex',
    lastName: 'Rodriguez',
    email: 'alex.rodriguez@crunchfit.com',
    phone: '(212) 555-0133',
    gym: 'GYM-003',
    specializations: ['CrossFit', 'Strength Training', 'Olympic Lifting'],
    rating: 4.6,
    reviews: 134,
    sessionsThisMonth: 40,
    revenue: 6000,
    status: 'active',
    bio: 'CrossFit coach with competition experience. Expert in strength and power development.',
    certifications: 6,
    photo: 'https://images.unsplash.com/photo-1500377752852-e6b9f8102b3b?w=80&h=80&fit=crop',
    joinedDate: '2023-05-01',
  },
  {
    id: 'T-005',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@crunchfit.com',
    phone: '(212) 555-0144',
    gym: 'GYM-001',
    specializations: ['Boxing', 'Combat Sports', 'Conditioning'],
    rating: 4.5,
    reviews: 89,
    sessionsThisMonth: 25,
    revenue: 3750,
    status: 'active',
    bio: 'Former boxer teaching boxing fundamentals and combat conditioning.',
    certifications: 4,
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop',
    joinedDate: '2024-01-15',
  },
  {
    id: 'T-006',
    firstName: 'Rachel',
    lastName: 'Martinez',
    email: 'rachel.martinez@crunchfit.com',
    phone: '(212) 555-0155',
    gym: 'GYM-002',
    specializations: ['Personal Training', 'Nutrition Coaching', 'Strength'],
    rating: 4.9,
    reviews: 176,
    sessionsThisMonth: 30,
    revenue: 4500,
    status: 'active',
    bio: 'Holistic fitness coach combining training and nutrition expertise.',
    certifications: 5,
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop',
    joinedDate: '2023-09-05',
  },
];

const gyms = [
  { id: 'GYM-001', name: 'NYC Downtown Fitness' },
  { id: 'GYM-002', name: 'Brooklyn Elite Gym' },
  { id: 'GYM-003', name: 'Manhattan CrossFit Hub' },
];

const TrainerManagementPage = () => {
  const { theme } = useContext(ThemeContext);
  const { language } = useContext(LanguageContext);
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState('applications');
  const [applications, setApplications] = useState(mockPendingApplications);
  const [trainers, setTrainers] = useState(mockActiveTrainers);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showRequestInfoModal, setShowRequestInfoModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showEditTrainerModal, setShowEditTrainerModal] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [requestInfo, setRequestInfo] = useState('');
  const [suspendReason, setSuspendReason] = useState('');
  const [editTrainerData, setEditTrainerData] = useState({});

  const [filters, setFilters] = useState({
    gym: [],
    specialization: [],
  });

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const matchesSearch =
        app.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;
      if (filters.gym.length && !filters.gym.includes(app.gym)) return false;

      return true;
    });
  }, [applications, searchTerm, filters]);

  const filteredTrainers = useMemo(() => {
    return trainers.filter((trainer) => {
      const matchesSearch =
        trainer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trainer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trainer.email.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;
      if (filters.gym.length && !filters.gym.includes(trainer.gym)) return false;
      if (filters.specialization.length) {
        const hasSpecialization = filters.specialization.some((spec) =>
          trainer.specializations.includes(spec)
        );
        if (!hasSpecialization) return false;
      }

      return true;
    });
  }, [trainers, searchTerm, filters]);

  const handleApproveApplication = (applicationId) => {
    setApplications(applications.filter((app) => app.id !== applicationId));
    const approvedApp = applications.find((app) => app.id === applicationId);
    if (approvedApp) {
      const newTrainer = {
        id: `T-${Date.now()}`,
        firstName: approvedApp.firstName,
        lastName: approvedApp.lastName,
        email: approvedApp.email,
        phone: approvedApp.phone,
        gym: approvedApp.gym,
        specializations: approvedApp.specializations,
        rating: 4.5,
        reviews: 0,
        sessionsThisMonth: 0,
        revenue: 0,
        status: 'active',
        bio: approvedApp.bio,
        certifications: approvedApp.certifications.length,
        photo: approvedApp.photo,
        joinedDate: new Date().toISOString().split('T')[0],
      };
      setTrainers([...trainers, newTrainer]);
    }
    setShowApproveModal(false);
    setSelectedApplication(null);
  };

  const handleRejectApplication = () => {
    if (selectedApplication) {
      setApplications(applications.filter((app) => app.id !== selectedApplication.id));
      setShowRejectModal(false);
      setRejectReason('');
      setSelectedApplication(null);
    }
  };

  const handleRequestMoreInfo = () => {
    if (selectedApplication && requestInfo.trim()) {
      setShowRequestInfoModal(false);
      setRequestInfo('');
      setSelectedApplication(null);
    }
  };

  const handleSuspendTrainer = () => {
    if (selectedTrainer && suspendReason.trim()) {
      setTrainers(
        trainers.map((t) =>
          t.id === selectedTrainer.id ? { ...t, status: 'suspended' } : t
        )
      );
      setShowSuspendModal(false);
      setSuspendReason('');
      setSelectedTrainer(null);
    }
  };

  const handleEditTrainer = () => {
    if (selectedTrainer && editTrainerData.phone) {
      setTrainers(
        trainers.map((t) =>
          t.id === selectedTrainer.id
            ? { ...t, ...editTrainerData }
            : t
        )
      );
      setShowEditTrainerModal(false);
      setEditTrainerData({});
      setSelectedTrainer(null);
    }
  };

  const stats = {
    pendingApplications: applications.length,
    activeTrainers: trainers.filter((t) => t.status === 'active').length,
    suspendedTrainers: trainers.filter((t) => t.status === 'suspended').length,
    avgRating: (trainers.reduce((sum, t) => sum + t.rating, 0) / trainers.length).toFixed(1),
  };

  return (
    <AdminLayout>
      <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b sticky top-0 z-40`}
        >
          <div className="px-6 py-4">
            <h1 className="text-2xl font-bold mb-4">Trainer Management</h1>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className={`${isDark ? 'bg-gray-700' : 'bg-orange-50'} p-3 rounded-lg`}>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Pending</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pendingApplications}</p>
              </div>
              <div className={`${isDark ? 'bg-gray-700' : 'bg-green-50'} p-3 rounded-lg`}>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Active Trainers</p>
                <p className="text-2xl font-bold text-green-600">{stats.activeTrainers}</p>
              </div>
              <div className={`${isDark ? 'bg-gray-700' : 'bg-red-50'} p-3 rounded-lg`}>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Suspended</p>
                <p className="text-2xl font-bold text-red-600">{stats.suspendedTrainers}</p>
              </div>
              <div className={`${isDark ? 'bg-gray-700' : 'bg-yellow-50'} p-3 rounded-lg`}>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Avg Rating</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.avgRating}★</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="px-6 py-4 flex gap-4 border-b border-gray-700">
          <button
            onClick={() => setActiveTab('applications')}
            className={`px-4 py-2 font-medium rounded-lg transition-colors ${
              activeTab === 'applications'
                ? 'bg-blue-500 text-white'
                : isDark
                ? 'hover:bg-gray-700'
                : 'hover:bg-gray-100'
            }`}
          >
            Pending Applications
          </button>
          <button
            onClick={() => setActiveTab('trainers')}
            className={`px-4 py-2 font-medium rounded-lg transition-colors ${
              activeTab === 'trainers'
                ? 'bg-blue-500 text-white'
                : isDark
                ? 'hover:bg-gray-700'
                : 'hover:bg-gray-100'
            }`}
          >
            Active Trainers
          </button>
        </div>

        {/* Main Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {activeTab === 'applications' && (
              <motion.div key="applications" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {/* Search & Filters */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6 mb-6`}
                >
                  <div className="flex gap-4 mb-4">
                    <div className="flex-1 relative">
                      <Search className={`absolute left-3 top-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} size={18} />
                      <input
                        type="text"
                        placeholder="Search applicants..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                          isDark
                            ? 'bg-gray-700 border-gray-600 placeholder-gray-500'
                            : 'bg-white border-gray-300 placeholder-gray-400'
                        }`}
                      />
                    </div>
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                        isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      <Filter size={18} />
                      Filters
                    </button>
                  </div>

                  {showFilters && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className={`grid grid-cols-2 gap-4 pt-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
                    >
                      <div>
                        <label className="block text-sm font-medium mb-2">Gym</label>
                        <select
                          multiple
                          value={filters.gym}
                          onChange={(e) => {
                            setFilters({
                              ...filters,
                              gym: Array.from(e.target.selectedOptions, (option) => option.value),
                            });
                          }}
                          className={`w-full px-3 py-2 rounded-lg border text-sm ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                        >
                          {gyms.map((gym) => (
                            <option key={gym.id} value={gym.id}>
                              {gym.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </motion.div>
                  )}
                </motion.div>

                {/* Applications Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredApplications.map((application) => (
                    <motion.div
                      key={application.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6 hover:shadow-lg transition-shadow`}
                    >
                      {/* Header */}
                      <div className="flex items-start gap-4 mb-4">
                        <img
                          src={application.photo}
                          alt={`${application.firstName} ${application.lastName}`}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-bold text-lg">
                            {application.firstName} {application.lastName}
                          </h3>
                          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Applied {new Date(application.appliedDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="space-y-2 mb-4 pb-4 border-b border-gray-700">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail size={14} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
                          <a href={`mailto:${application.email}`} className="text-blue-500 hover:underline">
                            {application.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone size={14} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
                          <span>{application.phone}</span>
                        </div>
                      </div>

                      {/* Bio & Experience */}
                      <div className="mb-4">
                        <p className="text-sm font-medium mb-1">Bio</p>
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} line-clamp-2`}>
                          {application.bio}
                        </p>
                        <p className={`text-xs font-medium mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          Experience: {application.experience}
                        </p>
                      </div>

                      {/* Gym */}
                      <div className="mb-4">
                        <p className="text-sm font-medium mb-1">Target Gym</p>
                        <p className="text-sm">
                          {gyms.find((g) => g.id === application.gym)?.name}
                        </p>
                      </div>

                      {/* Specializations */}
                      <div className="mb-4">
                        <p className="text-sm font-medium mb-2">Specializations</p>
                        <div className="flex flex-wrap gap-2">
                          {application.specializations.map((spec) => (
                            <span
                              key={spec}
                              className={`${isDark ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'} px-2 py-1 rounded text-xs font-medium`}
                            >
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Certifications */}
                      <div className="mb-4">
                        <p className="text-sm font-medium mb-2">Certifications ({application.certifications.length})</p>
                        <div className="space-y-1">
                          {application.certifications.slice(0, 2).map((cert) => (
                            <div key={cert.id} className="flex items-center justify-between text-xs">
                              <span> {cert.name}</span>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                }}
                                className={`p-1 rounded ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                              >
                                <Download size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-4 border-t border-gray-700">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          onClick={() => {
                            setSelectedApplication(application);
                            setShowApplicationModal(true);
                          }}
                          className="flex-1 px-3 py-2 rounded-lg font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors text-sm flex items-center justify-center gap-1"
                        >
                          <Eye size={14} />
                          View Details
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          onClick={() => {
                            setSelectedApplication(application);
                            setShowApproveModal(true);
                          }}
                          className="flex-1 px-3 py-2 rounded-lg font-medium bg-green-500 text-white hover:bg-green-600 transition-colors text-sm flex items-center justify-center gap-1"
                        >
                          <Check size={14} />
                          Approve
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          onClick={() => {
                            setSelectedApplication(application);
                            setShowRejectModal(true);
                          }}
                          className="flex-1 px-3 py-2 rounded-lg font-medium bg-red-500 text-white hover:bg-red-600 transition-colors text-sm flex items-center justify-center gap-1"
                        >
                          <X size={14} />
                          Reject
                        </motion.button>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        onClick={() => {
                          setSelectedApplication(application);
                          setShowRequestInfoModal(true);
                        }}
                        className={`w-full mt-2 px-3 py-2 rounded-lg font-medium transition-colors text-sm flex items-center justify-center gap-1 ${
                          isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        <MessageSquare size={14} />
                        Request Info
                      </motion.button>
                    </motion.div>
                  ))}
                </div>

                {filteredApplications.length === 0 && (
                  <div className="text-center py-12">
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      No pending applications
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'trainers' && (
              <motion.div key="trainers" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {/* Search & Filters */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6 mb-6`}
                >
                  <div className="flex gap-4 mb-4">
                    <div className="flex-1 relative">
                      <Search className={`absolute left-3 top-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} size={18} />
                      <input
                        type="text"
                        placeholder="Search trainers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                          isDark
                            ? 'bg-gray-700 border-gray-600 placeholder-gray-500'
                            : 'bg-white border-gray-300 placeholder-gray-400'
                        }`}
                      />
                    </div>
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                        isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      <Filter size={18} />
                      Filters
                    </button>
                  </div>

                  {showFilters && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className={`grid grid-cols-2 gap-4 pt-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
                    >
                      <div>
                        <label className="block text-sm font-medium mb-2">Gym</label>
                        <select
                          multiple
                          value={filters.gym}
                          onChange={(e) => {
                            setFilters({
                              ...filters,
                              gym: Array.from(e.target.selectedOptions, (option) => option.value),
                            });
                          }}
                          className={`w-full px-3 py-2 rounded-lg border text-sm ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                        >
                          {gyms.map((gym) => (
                            <option key={gym.id} value={gym.id}>
                              {gym.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </motion.div>
                  )}
                </motion.div>

                {/* Trainers Table */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border overflow-hidden`}
                >
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className={`border-b ${isDark ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
                          <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Trainer</th>
                          <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Gym</th>
                          <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Specializations</th>
                          <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Rating</th>
                          <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Sessions This Month</th>
                          <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Revenue</th>
                          <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Status</th>
                          <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTrainers.map((trainer) => (
                          <motion.tr
                            key={trainer.id}
                            whileHover={{ backgroundColor: isDark ? '#374151' : '#f9fafb' }}
                            className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
                          >
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={trainer.photo}
                                  alt={`${trainer.firstName} ${trainer.lastName}`}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                                <div>
                                  <p className="font-semibold text-sm">
                                    {trainer.firstName} {trainer.lastName}
                                  </p>
                                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {trainer.email}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-sm">
                              {gyms.find((g) => g.id === trainer.gym)?.name}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex flex-wrap gap-1">
                                {trainer.specializations.slice(0, 2).map((spec) => (
                                  <span
                                    key={spec}
                                    className={`${isDark ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'} px-2 py-0.5 rounded text-xs`}
                                  >
                                    {spec}
                                  </span>
                                ))}
                                {trainer.specializations.length > 2 && (
                                  <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'} px-2 py-0.5 text-xs`}>
                                    +{trainer.specializations.length - 2}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-1">
                                <Star size={14} className="text-yellow-500 fill-yellow-500" />
                                <span className="font-semibold">{trainer.rating}</span>
                                <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                  ({trainer.reviews})
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-sm font-semibold">{trainer.sessionsThisMonth}</td>
                            <td className="py-3 px-4 text-sm font-semibold">${trainer.revenue.toLocaleString()}</td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  trainer.status === 'active'
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                }`}
                              >
                                {trainer.status.charAt(0).toUpperCase() + trainer.status.slice(1)}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-sm">
                              <div className="flex gap-1">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  onClick={() => {
                                    setSelectedTrainer(trainer);
                                    setShowApplicationModal(true);
                                  }}
                                  className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                                  title="View Profile"
                                >
                                  <Eye size={16} />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  onClick={() => {
                                    setSelectedTrainer(trainer);
                                    setEditTrainerData({ phone: trainer.phone });
                                    setShowEditTrainerModal(true);
                                  }}
                                  className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                                  title="Edit"
                                >
                                  <Edit2 size={16} />
                                </motion.button>
                                {trainer.status === 'active' && (
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    onClick={() => {
                                      setSelectedTrainer(trainer);
                                      setShowSuspendModal(true);
                                    }}
                                    className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors text-red-500`}
                                    title="Suspend"
                                  >
                                    <Archive size={16} />
                                  </motion.button>
                                )}
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {filteredTrainers.length === 0 && (
                    <div className="p-8 text-center">
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        No trainers match your filters
                      </p>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Application Detail Modal */}
      <AnimatePresence>
        {showApplicationModal && selectedApplication && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg max-w-2xl w-full p-6 my-8`}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedApplication.photo}
                    alt={`${selectedApplication.firstName} ${selectedApplication.lastName}`}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-bold">
                      {selectedApplication.firstName} {selectedApplication.lastName}
                    </h3>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Applied {new Date(selectedApplication.appliedDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowApplicationModal(false)}
                  className={`p-1 rounded ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4 max-h-[70vh] overflow-y-auto pb-6">
                <div>
                  <h4 className="font-semibold mb-2">Bio</h4>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {selectedApplication.bio}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm">{selectedApplication.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm">{selectedApplication.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Experience</p>
                    <p className="text-sm">{selectedApplication.experience}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Target Gym</p>
                    <p className="text-sm">
                      {gyms.find((g) => g.id === selectedApplication.gym)?.name}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Specializations</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedApplication.specializations.map((spec) => (
                      <span
                        key={spec}
                        className={`${isDark ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'} px-3 py-1 rounded-full text-xs font-medium`}
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-3">Certifications</p>
                  <div className="space-y-2">
                    {selectedApplication.certifications.map((cert) => (
                      <div
                        key={cert.id}
                        className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} p-3 rounded-lg flex items-center justify-between`}
                      >
                        <div>
                          <p className="text-sm font-medium">{cert.name}</p>
                          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {cert.issuer} • {new Date(cert.date).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          className={`p-2 rounded ${isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-100'} transition-colors text-blue-500`}
                        >
                          <Download size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Weekly Availability</p>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(selectedApplication.availability).map(([day, time]) => (
                      <div key={day} className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} p-2 rounded text-sm`}>
                        <span className="font-medium">{day}:</span> {time}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-6 border-t border-gray-700">
                <button
                  onClick={() => setShowApplicationModal(false)}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Approve Modal */}
        {showApproveModal && selectedApplication && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg max-w-md w-full p-6`}
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 mx-auto mb-4">
                <CheckCircle className="text-green-600 dark:text-green-200" size={24} />
              </div>
              <h3 className="text-lg font-bold text-center mb-2">Approve Application</h3>
              <p className={`text-sm text-center ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                Are you sure you want to approve{' '}
                <span className="font-semibold">
                  {selectedApplication.firstName} {selectedApplication.lastName}
                </span>
                ? An approval email will be sent to {selectedApplication.email}.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowApproveModal(false)}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleApproveApplication(selectedApplication.id)}
                  className="flex-1 px-4 py-2 rounded-lg font-medium bg-green-500 text-white hover:bg-green-600 transition-colors"
                >
                  Approve & Send Email
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Reject Modal */}
        {showRejectModal && selectedApplication && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg max-w-md w-full p-6`}
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900 mx-auto mb-4">
                <XCircle className="text-red-600 dark:text-red-200" size={24} />
              </div>
              <h3 className="text-lg font-bold text-center mb-2">Reject Application</h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                Provide a reason for rejection (will be sent to applicant):
              </p>

              <textarea
                placeholder="e.g., Certifications do not meet our requirements..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border mb-4 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                rows="3"
              />

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectReason('');
                  }}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleRejectApplication}
                  disabled={!rejectReason.trim()}
                  className="flex-1 px-4 py-2 rounded-lg font-medium bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Reject & Send Email
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Request Info Modal */}
        {showRequestInfoModal && selectedApplication && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg max-w-md w-full p-6`}
            >
              <h3 className="text-lg font-bold mb-2">Request More Information</h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                Send a message to {selectedApplication.firstName} requesting additional information:
              </p>

              <textarea
                placeholder="e.g., Can you provide additional references or a recent training video?"
                value={requestInfo}
                onChange={(e) => setRequestInfo(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border mb-4 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                rows="4"
              />

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowRequestInfoModal(false);
                    setRequestInfo('');
                  }}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleRequestMoreInfo}
                  disabled={!requestInfo.trim()}
                  className="flex-1 px-4 py-2 rounded-lg font-medium bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Send Message
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Suspend Modal */}
        {showSuspendModal && selectedTrainer && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg max-w-md w-full p-6`}
            >
              <h3 className="text-lg font-bold mb-2">Suspend Trainer</h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                Suspending{' '}
                <span className="font-semibold">
                  {selectedTrainer.firstName} {selectedTrainer.lastName}
                </span>{' '}
                will prevent them from booking new sessions. Provide a reason:
              </p>

              <textarea
                placeholder="e.g., Violation of conduct policy..."
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border mb-4 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                rows="3"
              />

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowSuspendModal(false);
                    setSuspendReason('');
                  }}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSuspendTrainer}
                  disabled={!suspendReason.trim()}
                  className="flex-1 px-4 py-2 rounded-lg font-medium bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Suspend Trainer
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Edit Trainer Modal */}
        {showEditTrainerModal && selectedTrainer && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg max-w-md w-full p-6 my-8`}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">Edit Trainer Profile</h3>
                <button
                  onClick={() => setShowEditTrainerModal(false)}
                  className={`p-1 rounded ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">First Name</label>
                  <input
                    type="text"
                    value={editTrainerData.firstName || selectedTrainer.firstName}
                    onChange={(e) => setEditTrainerData({ ...editTrainerData, firstName: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Last Name</label>
                  <input
                    type="text"
                    value={editTrainerData.lastName || selectedTrainer.lastName}
                    onChange={(e) => setEditTrainerData({ ...editTrainerData, lastName: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={editTrainerData.email || selectedTrainer.email}
                    onChange={(e) => setEditTrainerData({ ...editTrainerData, email: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <input
                    type="tel"
                    value={editTrainerData.phone || selectedTrainer.phone}
                    onChange={(e) => setEditTrainerData({ ...editTrainerData, phone: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Bio</label>
                  <textarea
                    value={editTrainerData.bio || selectedTrainer.bio}
                    onChange={(e) => setEditTrainerData({ ...editTrainerData, bio: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                    rows="3"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-6 border-t border-gray-700">
                <button
                  onClick={() => setShowEditTrainerModal(false)}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditTrainer}
                  disabled={!editTrainerData.phone}
                  className="flex-1 px-4 py-2 rounded-lg font-medium bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default TrainerManagementPage;
