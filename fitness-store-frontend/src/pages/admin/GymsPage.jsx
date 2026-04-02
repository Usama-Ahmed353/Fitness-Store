import React, { useState, useMemo, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUpDown,
  Check,
  ChevronDown,
  Clock,
  Download,
  Edit2,
  Eye,
  Filter,
  MapPin,
  MoreVertical,
  Plus,
  Search,
  Shield,
  Trash2,
  X,
  AlertCircle,
  FileText,
  Phone,
  Mail,
} from 'lucide-react';
import { ThemeContext } from '../../contexts/ThemeContext';
import { LanguageContext } from '../../contexts/LanguageContext';
import AdminLayout from '../../layouts/AdminLayout';

// Mock gyms data
const mockGyms = [
  {
    id: 'GYM-001',
    name: 'NYC Downtown Fitness',
    owner: 'John Smith',
    ownerEmail: 'john@nycdowntown.com',
    ownerPhone: '+1 (555) 123-4567',
    city: 'New York',
    state: 'NY',
    location: '123 Fitness Ave, New York, NY 10001',
    plan: 'enterprise',
    status: 'verified',
    members: 245,
    revenue: 12045.50,
    joinDate: '2023-06-15',
    verificationDate: '2023-06-20',
  },
  {
    id: 'GYM-002',
    name: 'Brooklyn Elite Gym',
    owner: 'Sarah Wilson',
    ownerEmail: 'sarah@brooklynelite.com',
    ownerPhone: '+1 (555) 234-5678',
    city: 'Brooklyn',
    state: 'NY',
    location: '456 Muscle St, Brooklyn, NY 11201',
    plan: 'professional',
    status: 'verified',
    members: 178,
    revenue: 8234.75,
    joinDate: '2023-09-10',
    verificationDate: '2023-09-15',
  },
  {
    id: 'GYM-003',
    name: 'Manhattan CrossFit Hub',
    owner: 'Mike Davis',
    ownerEmail: 'mike@manhattancf.com',
    ownerPhone: '+1 (555) 345-6789',
    city: 'New York',
    state: 'NY',
    location: '789 CrossFit Blvd, New York, NY 10019',
    plan: 'starter',
    status: 'verified',
    members: 92,
    revenue: 3895.20,
    joinDate: '2024-01-05',
    verificationDate: '2024-01-10',
  },
  {
    id: 'GYM-004',
    name: 'Queens Fitness Center',
    owner: 'Lisa Chen',
    ownerEmail: 'lisa@queensfitness.com',
    ownerPhone: '+1 (555) 456-7890',
    city: 'Queens',
    state: 'NY',
    location: '321 Strength Lane, Queens, NY 11375',
    plan: 'professional',
    status: 'verified',
    members: 156,
    revenue: 7620.30,
    joinDate: '2024-02-20',
    verificationDate: '2024-02-25',
  },
  {
    id: 'GYM-005',
    name: 'Bronx Athletic Club',
    owner: 'Alex Rodriguez',
    ownerEmail: 'alex@bronxathletic.com',
    ownerPhone: '+1 (555) 567-8901',
    city: 'Bronx',
    state: 'NY',
    location: '654 Power St, Bronx, NY 10451',
    plan: 'starter',
    status: 'suspended',
    members: 64,
    revenue: 1850.00,
    joinDate: '2023-12-01',
    verificationDate: '2023-12-05',
    suspensionReason: 'Non-payment of subscription fees',
  },
];

// Mock pending gyms for verification
const mockPendingGyms = [
  {
    id: 'PENDING-001',
    name: 'Long Island Wellness',
    owner: 'Emma Thompson',
    ownerEmail: 'emma@liwell.com',
    ownerPhone: '+1 (555) 678-9012',
    city: 'Hempstead',
    state: 'NY',
    location: '999 Health Ave, Hempstead, NY 11550',
    appliedPlan: 'professional',
    appliedDate: '2026-03-15',
    submittedDocuments: [
      { id: 1, name: 'Business License', url: '#', size: '2.3 MB', uploadedDate: '2026-03-15' },
      { id: 2, name: 'Property Certification', url: '#', size: '1.8 MB', uploadedDate: '2026-03-15' },
      { id: 3, name: 'Insurance Certificate', url: '#', size: '0.9 MB', uploadedDate: '2026-03-15' },
    ],
  },
  {
    id: 'PENDING-002',
    name: 'Westchester Fitness Pro',
    owner: 'Robert Martinez',
    ownerEmail: 'robert@westfitness.com',
    ownerPhone: '+1 (555) 789-0123',
    city: 'Yonkers',
    state: 'NY',
    location: '222 Training Rd, Yonkers, NY 10701',
    appliedPlan: 'starter',
    appliedDate: '2026-03-18',
    submittedDocuments: [
      { id: 1, name: 'Business License', url: '#', size: '2.1 MB', uploadedDate: '2026-03-18' },
      { id: 2, name: 'Insurance Certificate', url: '#', size: '1.2 MB', uploadedDate: '2026-03-18' },
    ],
  },
];

const GymsPage = () => {
  const { theme } = useContext(ThemeContext);
  const { language } = useContext(LanguageContext);
  const isDark = theme === 'dark';

  const [gyms, setGyms] = useState(mockGyms);
  const [pendingGyms, setPendingGyms] = useState(mockPendingGyms);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('gyms');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectingGymId, setRejectingGymId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [expandedDocuments, setExpandedDocuments] = useState(null);

  const [filters, setFilters] = useState({
    plan: [],
    status: [],
    city: [],
    state: [],
  });

  const planColors = {
    starter: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    professional: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    enterprise: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  };

  const statusColors = {
    verified: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    suspended: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };

  const filteredGyms = useMemo(() => {
    return gyms.filter((gym) => {
      const matchesSearch =
        gym.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        gym.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
        gym.city.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;
      if (filters.plan.length && !filters.plan.includes(gym.plan)) return false;
      if (filters.status.length && !filters.status.includes(gym.status)) return false;
      if (filters.city.length && !filters.city.includes(gym.city)) return false;
      if (filters.state.length && !filters.state.includes(gym.state)) return false;

      return true;
    });
  }, [gyms, searchTerm, filters]);

  const handleApproveGym = (gymId) => {
    const gym = pendingGyms.find((g) => g.id === gymId);
    if (gym) {
      // Move to verified gyms
      const newGym = {
        ...gym,
        id: `GYM-${gyms.length + 1}`,
        plan: gym.appliedPlan,
        status: 'verified',
        members: 0,
        revenue: 0,
        joinDate: new Date().toISOString().split('T')[0],
        verificationDate: new Date().toISOString().split('T')[0],
      };
      setGyms([...gyms, newGym]);
      setPendingGyms(pendingGyms.filter((g) => g.id !== gymId));
    }
  };

  const handleRejectGym = () => {
    if (rejectReason.trim() && rejectingGymId) {
      setPendingGyms(pendingGyms.filter((g) => g.id !== rejectingGymId));
      setShowRejectModal(false);
      setRejectReason('');
      setRejectingGymId(null);
    }
  };

  const stats = {
    totalGyms: gyms.length,
    verifiedGyms: gyms.filter((g) => g.status === 'verified').length,
    suspendedGyms: gyms.filter((g) => g.status === 'suspended').length,
    totalMembers: gyms.reduce((sum, gym) => sum + gym.members, 0),
    totalRevenue: gyms.reduce((sum, gym) => sum + gym.revenue, 0),
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
            <h1 className="text-2xl font-bold mb-4">Gym Directory</h1>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className={`${isDark ? 'bg-gray-700' : 'bg-blue-50'} p-3 rounded-lg`}>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Gyms</p>
                <p className="text-2xl font-bold">{stats.totalGyms}</p>
              </div>
              <div className={`${isDark ? 'bg-gray-700' : 'bg-green-50'} p-3 rounded-lg`}>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Verified</p>
                <p className="text-2xl font-bold text-green-600">{stats.verifiedGyms}</p>
              </div>
              <div className={`${isDark ? 'bg-gray-700' : 'bg-red-50'} p-3 rounded-lg`}>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Suspended</p>
                <p className="text-2xl font-bold text-red-600">{stats.suspendedGyms}</p>
              </div>
              <div className={`${isDark ? 'bg-gray-700' : 'bg-purple-50'} p-3 rounded-lg`}>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Members</p>
                <p className="text-2xl font-bold">{stats.totalMembers}</p>
              </div>
              <div className={`${isDark ? 'bg-gray-700' : 'bg-orange-50'} p-3 rounded-lg`}>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Revenue</p>
                <p className="text-2xl font-bold">${(stats.totalRevenue / 1000).toFixed(1)}K</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="px-6 py-4 flex gap-4 border-b border-gray-700">
          <button
            onClick={() => setActiveTab('gyms')}
            className={`px-4 py-2 font-medium rounded-lg transition-colors ${
              activeTab === 'gyms'
                ? 'bg-blue-500 text-white'
                : isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            Gym Directory
          </button>
          <button
            onClick={() => setActiveTab('verification')}
            className={`px-4 py-2 font-medium rounded-lg transition-colors relative ${
              activeTab === 'verification'
                ? 'bg-blue-500 text-white'
                : isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            Verification Queue
            {pendingGyms.length > 0 && (
              <span className="ml-2 inline-block px-2 py-0.5 rounded-full text-xs font-bold bg-red-500 text-white">
                {pendingGyms.length}
              </span>
            )}
          </button>
        </div>

        {/* Main Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {activeTab === 'gyms' && (
              <motion.div key="gyms" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
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
                        placeholder="Search gyms, owners, locations..."
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

                  {/* Filter Panel */}
                  {showFilters && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className={`grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
                    >
                      <div>
                        <label className="block text-sm font-medium mb-2">Plan</label>
                        <div className="space-y-2">
                          {['starter', 'professional', 'enterprise'].map((plan) => (
                            <label key={plan} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={filters.plan.includes(plan)}
                                onChange={(e) => {
                                  setFilters({
                                    ...filters,
                                    plan: e.target.checked
                                      ? [...filters.plan, plan]
                                      : filters.plan.filter((p) => p !== plan),
                                  });
                                }}
                                className="w-4 h-4"
                              />
                              <span className="text-sm capitalize">{plan}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Status</label>
                        <div className="space-y-2">
                          {['verified', 'suspended'].map((status) => (
                            <label key={status} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={filters.status.includes(status)}
                                onChange={(e) => {
                                  setFilters({
                                    ...filters,
                                    status: e.target.checked
                                      ? [...filters.status, status]
                                      : filters.status.filter((s) => s !== status),
                                  });
                                }}
                                className="w-4 h-4"
                              />
                              <span className="text-sm capitalize">{status}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">City</label>
                        <div className="space-y-2">
                          {['New York', 'Brooklyn', 'Queens', 'Bronx'].map((city) => (
                            <label key={city} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={filters.city.includes(city)}
                                onChange={(e) => {
                                  setFilters({
                                    ...filters,
                                    city: e.target.checked
                                      ? [...filters.city, city]
                                      : filters.city.filter((c) => c !== city),
                                  });
                                }}
                                className="w-4 h-4"
                              />
                              <span className="text-sm">{city}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">State</label>
                        <div className="space-y-2">
                          {['NY'].map((state) => (
                            <label key={state} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={filters.state.includes(state)}
                                onChange={(e) => {
                                  setFilters({
                                    ...filters,
                                    state: e.target.checked
                                      ? [...filters.state, state]
                                      : filters.state.filter((s) => s !== state),
                                  });
                                }}
                                className="w-4 h-4"
                              />
                              <span className="text-sm font-medium">{state}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>

                {/* Gyms Table */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border overflow-hidden`}
                >
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                          <th className="text-left py-3 px-4 font-semibold text-sm">Gym Name</th>
                          <th className="text-left py-3 px-4 font-semibold text-sm">Owner</th>
                          <th className="text-left py-3 px-4 font-semibold text-sm">Location</th>
                          <th className="text-left py-3 px-4 font-semibold text-sm">Plan</th>
                          <th className="text-left py-3 px-4 font-semibold text-sm">Status</th>
                          <th className="text-left py-3 px-4 font-semibold text-sm">Members</th>
                          <th className="text-left py-3 px-4 font-semibold text-sm">Revenue</th>
                          <th className="text-left py-3 px-4 font-semibold text-sm">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredGyms.map((gym) => (
                          <motion.tr
                            key={gym.id}
                            whileHover={{ backgroundColor: isDark ? '#374151' : '#f9fafb' }}
                            className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
                          >
                            <td className="py-3 px-4">
                              <div>
                                <p className="font-semibold text-sm">{gym.name}</p>
                                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{gym.id}</p>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-sm">{gym.owner}</td>
                            <td className="py-3 px-4 text-sm flex items-center gap-1">
                              <MapPin size={14} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
                              {gym.city}, {gym.state}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`${planColors[gym.plan]} px-2 py-1 rounded-full text-xs font-medium`}>
                                {gym.plan.charAt(0).toUpperCase() + gym.plan.slice(1)}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`${statusColors[gym.status]} px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit`}>
                                {gym.status === 'verified' && <Check size={12} />}
                                {gym.status.charAt(0).toUpperCase() + gym.status.slice(1)}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-semibold text-sm">{gym.members}</td>
                            <td className="py-3 px-4 font-semibold text-sm">${gym.revenue.toFixed(2)}</td>
                            <td className="py-3 px-4">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                              >
                                <MoreVertical size={16} />
                              </motion.button>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {filteredGyms.length === 0 && (
                    <div className="p-8 text-center">
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>No gyms match your filters</p>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}

            {activeTab === 'verification' && (
              <motion.div key="verification" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="space-y-6">
                  {pendingGyms.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-8 text-center`}
                    >
                      <Check size={32} className="mx-auto mb-2 text-green-500" />
                      <p className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>All Gyms Verified!</p>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>No pending verification requests</p>
                    </motion.div>
                  ) : (
                    pendingGyms.map((pendingGym, idx) => (
                      <motion.div
                        key={pendingGym.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6`}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                          <div>
                            <h3 className="font-bold text-lg mb-1">{pendingGym.name}</h3>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{pendingGym.location}</p>
                            <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                              Plan: {pendingGym.appliedPlan.charAt(0).toUpperCase() + pendingGym.appliedPlan.slice(1)}
                            </span>
                          </div>

                          <div>
                            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                              <User size={16} />
                              Owner Information
                            </h4>
                            <p className="text-sm">{pendingGym.owner}</p>
                            <p className="text-xs flex items-center gap-1 mt-1">
                              <Mail size={12} />
                              {pendingGym.ownerEmail}
                            </p>
                            <p className="text-xs flex items-center gap-1">
                              <Phone size={12} />
                              {pendingGym.ownerPhone}
                            </p>
                          </div>

                          <div>
                            <h4 className="font-semibold text-sm mb-2">Submitted</h4>
                            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                              {new Date(pendingGym.appliedDate).toLocaleDateString()}
                            </p>
                            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-2`}>
                              {pendingGym.submittedDocuments.length} documents
                            </p>
                          </div>
                        </div>

                        {/* Documents */}
                        <motion.div
                          initial={false}
                          animate={{ height: expandedDocuments === pendingGym.id ? 'auto' : 0, opacity: expandedDocuments === pendingGym.id ? 1 : 0 }}
                          className="overflow-hidden mb-4"
                        >
                          {expandedDocuments === pendingGym.id && (
                            <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} p-4 rounded-lg mb-4 space-y-2`}>
                              {pendingGym.submittedDocuments.map((doc) => (
                                <div
                                  key={doc.id}
                                  className={`flex items-center justify-between p-3 rounded ${isDark ? 'bg-gray-600' : 'bg-white'} border ${isDark ? 'border-gray-500' : 'border-gray-200'}`}
                                >
                                  <div className="flex items-center gap-2">
                                    <FileText size={16} className={isDark ? 'text-blue-400' : 'text-blue-500'} />
                                    <div>
                                      <p className="text-sm font-medium">{doc.name}</p>
                                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{doc.size}</p>
                                    </div>
                                  </div>
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    className={`p-2 rounded ${isDark ? 'hover:bg-gray-500' : 'hover:bg-gray-200'} transition-colors`}
                                  >
                                    <Download size={16} />
                                  </motion.button>
                                </div>
                              ))}
                            </div>
                          )}
                        </motion.div>

                        <button
                          onClick={() => setExpandedDocuments(expandedDocuments === pendingGym.id ? null : pendingGym.id)}
                          className={`mb-4 text-sm font-medium flex items-center gap-1 ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                        >
                          <Eye size={14} />
                          {expandedDocuments === pendingGym.id ? 'Hide' : 'View'} Documents
                        </button>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            onClick={() => handleApproveGym(pendingGym.id)}
                            className="flex-1 px-4 py-2 rounded-lg font-medium bg-green-500 text-white hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                          >
                            <Check size={18} />
                            Approve & Verify
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            onClick={() => {
                              setRejectingGymId(pendingGym.id);
                              setShowRejectModal(true);
                            }}
                            className="flex-1 px-4 py-2 rounded-lg font-medium bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                          >
                            <X size={18} />
                            Reject
                          </motion.button>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Reject Modal */}
      <AnimatePresence>
        {showRejectModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg max-w-md w-full p-6`}
            >
              <h3 className="text-lg font-bold mb-2">Reject Gym Application</h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-4`}>Owner will be notified of the rejection reason.</p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Reason for rejection..."
                className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} mb-6 text-sm`}
                rows="4"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectingGymId(null);
                    setRejectReason('');
                  }}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleRejectGym}
                  disabled={!rejectReason.trim()}
                  className="flex-1 px-4 py-2 rounded-lg font-medium bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Send Rejection
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default GymsPage;
