import React, { useState, useMemo, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import {
  ArrowLeft,
  BarChart3,
  Check,
  ChevronDown,
  Clouds,
  Copy,
  DollarSign,
  Edit2,
  Filter,
  Link as LinkIcon,
  Mail,
  MapPin,
  Plus,
  Search,
  Settings,
  Trash2,
  TrendingUp,
  Unlink,
  Users,
  X,
} from 'lucide-react';
import { ThemeContext } from '../../contexts/ThemeContext';
import { LanguageContext } from '../../contexts/LanguageContext';
import AdminLayout from '../../layouts/AdminLayout';

// Mock gym chains data
const mockChains = [
  {
    id: 'CHAIN-001',
    name: 'NYC Fitness Network',
    description: 'Premium fitness centers across New York metropolitan area',
    owner: 'John Smith',
    status: 'active',
    createdDate: '2023-06-15',
    gyms: ['GYM-001', 'GYM-002', 'GYM-004'],
    totalMembers: 568,
    totalRevenue: 28150.55,
    totalClasses: 125,
    sharedTrainers: ['T-001', 'T-002', 'T-003'],
  },
  {
    id: 'CHAIN-002',
    name: 'CrossFit Elite Centers',
    description: 'Specialized CrossFit facilities in New York',
    owner: 'Mike Chen',
    status: 'active',
    createdDate: '2024-01-20',
    gyms: ['GYM-003', 'GYM-005'],
    totalMembers: 156,
    totalRevenue: 5745.20,
    totalClasses: 45,
    sharedTrainers: ['T-004', 'T-005'],
  },
];

// Mock gyms for linking
const mockAllGyms = [
  { id: 'GYM-001', name: 'NYC Downtown Fitness', city: 'New York', members: 245, chain: 'CHAIN-001' },
  { id: 'GYM-002', name: 'Brooklyn Elite Gym', city: 'Brooklyn', members: 178, chain: 'CHAIN-001' },
  { id: 'GYM-003', name: 'Manhattan CrossFit Hub', city: 'New York', members: 92, chain: 'CHAIN-002' },
  { id: 'GYM-004', name: 'Queens Fitness Center', city: 'Queens', members: 156, chain: 'CHAIN-001' },
  { id: 'GYM-005', name: 'Bronx Athletic Club', city: 'Bronx', members: 64, chain: 'CHAIN-002' },
];

// Mock shared trainers
const mockSharedTrainers = [
  { id: 'T-001', name: 'Mike Davis', specialization: 'HIIT Training', chains: ['CHAIN-001'], gyms: ['GYM-001', 'GYM-002'] },
  { id: 'T-002', name: 'Lisa Chen', specialization: 'Yoga & Flexibility', chains: ['CHAIN-001'], gyms: ['GYM-001', 'GYM-004'] },
  { id: 'T-003', name: 'Alex Rodriguez', specialization: 'CrossFit', chains: ['CHAIN-001'], gyms: ['GYM-001', 'GYM-002'] },
  { id: 'T-004', name: 'Emma Wilson', specialization: 'CrossFit', chains: ['CHAIN-002'], gyms: ['GYM-003', 'GYM-005'] },
  { id: 'T-005', name: 'John Smith', specialization: 'Strength Training', chains: ['CHAIN-002'], gyms: ['GYM-003'] },
];

// Mock chain analytics data
const chainMemberTrend = [
  { month: 'Jan', members: 450, newMembers: 25 },
  { month: 'Feb', members: 490, newMembers: 40 },
  { month: 'Mar', members: 530, newMembers: 40 },
  { month: 'Apr', members: 558, newMembers: 28 },
  { month: 'May', members: 566, newMembers: 8 },
  { month: 'Jun', members: 568, newMembers: 2 },
];

const chainRevenueByGym = [
  { gym: 'Downtown', revenue: 12045, percent: 43 },
  { gym: 'Brooklyn', revenue: 8234, percent: 29 },
  { gym: 'Queens', revenue: 7620, percent: 27 },
];

const chainClassDistribution = [
  { name: 'HIIT', value: 30, fill: '#3b82f6' },
  { name: 'Yoga', value: 25, fill: '#10b981' },
  { name: 'CrossFit', value: 25, fill: '#f59e0b' },
  { name: 'Spin', value: 15, fill: '#8b5cf6' },
  { name: 'Other', value: 5, fill: '#6b7280' },
];

const GymChainPage = () => {
  const { theme } = useContext(ThemeContext);
  const { language } = useContext(LanguageContext);
  const isDark = theme === 'dark';

  const [chains, setChains] = useState(mockChains);
  const [selectedChain, setSelectedChain] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showLinkGymModal, setShowLinkGymModal] = useState(false);
  const [selectedGymToLink, setSelectedGymToLink] = useState(null);
  const [newChainName, setNewChainName] = useState('');
  const [newChainDesc, setNewChainDesc] = useState('');

  const filteredChains = useMemo(() => {
    return chains.filter(
      (chain) =>
        chain.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chain.owner.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [chains, searchTerm]);

  const handleCreateChain = () => {
    if (newChainName.trim()) {
      const newChain = {
        id: `CHAIN-${chains.length + 1}`,
        name: newChainName,
        description: newChainDesc,
        owner: 'Current Admin',
        status: 'active',
        createdDate: new Date().toISOString().split('T')[0],
        gyms: [],
        totalMembers: 0,
        totalRevenue: 0,
        totalClasses: 0,
        sharedTrainers: [],
      };
      setChains([...chains, newChain]);
      setNewChainName('');
      setNewChainDesc('');
      setShowCreateModal(false);
    }
  };

  const handleLinkGym = () => {
    if (selectedChain && selectedGymToLink) {
      const updatedChains = chains.map((chain) => {
        if (chain.id === selectedChain.id) {
          const gym = mockAllGyms.find((g) => g.id === selectedGymToLink);
          return {
            ...chain,
            gyms: [...chain.gyms, selectedGymToLink],
            totalMembers: chain.totalMembers + gym.members,
          };
        }
        return chain;
      });
      setChains(updatedChains);
      setSelectedChain(updatedChains.find((c) => c.id === selectedChain.id));
      setSelectedGymToLink(null);
      setShowLinkGymModal(false);
    }
  };

  const handleUnlinkGym = (chainId, gymId) => {
    const updatedChains = chains.map((chain) => {
      if (chain.id === chainId) {
        const gym = mockAllGyms.find((g) => g.id === gymId);
        return {
          ...chain,
          gyms: chain.gyms.filter((g) => g !== gymId),
          totalMembers: chain.totalMembers - gym.members,
        };
      }
      return chain;
    });
    setChains(updatedChains);
    setSelectedChain(updatedChains.find((c) => c.id === chainId) || null);
  };

  const getGymName = (gymId) => mockAllGyms.find((g) => g.id === gymId)?.name || 'Unknown';
  const getGymCity = (gymId) => mockAllGyms.find((g) => g.id === gymId)?.city || '';

  const availableGymsForLinking = mockAllGyms.filter(
    (gym) => !selectedChain?.gyms.includes(gym.id)
  );

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
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold">Gym Chains & Networks</h1>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Manage multi-location gym networks</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 rounded-lg font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <Plus size={18} />
                Create Chain
              </motion.button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className={`${isDark ? 'bg-gray-700' : 'bg-blue-50'} p-3 rounded-lg`}>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Chains</p>
                <p className="text-2xl font-bold">{chains.length}</p>
              </div>
              <div className={`${isDark ? 'bg-gray-700' : 'bg-green-50'} p-3 rounded-lg`}>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Linked Gyms</p>
                <p className="text-2xl font-bold">{chains.reduce((sum, c) => sum + c.gyms.length, 0)}</p>
              </div>
              <div className={`${isDark ? 'bg-gray-700' : 'bg-purple-50'} p-3 rounded-lg`}>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Chain Members</p>
                <p className="text-2xl font-bold">{chains.reduce((sum, c) => sum + c.totalMembers, 0)}</p>
              </div>
              <div className={`${isDark ? 'bg-gray-700' : 'bg-orange-50'} p-3 rounded-lg`}>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Revenue</p>
                <p className="text-2xl font-bold">${(chains.reduce((sum, c) => sum + c.totalRevenue, 0) / 1000).toFixed(1)}K</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="p-6">
          {selectedChain ? (
            // Chain Detail View
            <motion.div
              key="detail"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <button
                onClick={() => setSelectedChain(null)}
                className={`mb-6 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'}`}
              >
                <ArrowLeft size={18} />
                Back to Chains
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chain Info */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6`}
                >
                  <h2 className="text-xl font-bold mb-2">{selectedChain.name}</h2>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-4`}>{selectedChain.description}</p>

                  <div className="space-y-3 mb-4 pb-4 border-b border-gray-700 dark:border-gray-700">
                    <div>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Owner</p>
                      <p className="font-medium">{selectedChain.owner}</p>
                    </div>
                    <div>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Created</p>
                      <p className="font-medium">{new Date(selectedChain.createdDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Status</p>
                      <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ${isDark ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'}`}>
                        {selectedChain.status.charAt(0).toUpperCase() + selectedChain.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Members</p>
                      <p className="text-2xl font-bold">{selectedChain.totalMembers}</p>
                    </div>
                    <div>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Revenue</p>
                      <p className="text-2xl font-bold">${selectedChain.totalRevenue.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Classes Offered</p>
                      <p className="text-2xl font-bold">{selectedChain.totalClasses}</p>
                    </div>
                  </div>
                </motion.div>

                {/* Linked Gyms */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Clouds size={18} />
                      Linked Gyms ({selectedChain.gyms.length})
                    </h3>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      onClick={() => setShowLinkGymModal(true)}
                      className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                    >
                      <Plus size={16} />
                    </motion.button>
                  </div>

                  <div className="space-y-2">
                    {selectedChain.gyms.map((gymId) => (
                      <motion.div
                        key={gymId}
                        whileHover={{ x: 4 }}
                        className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} p-3 rounded-lg flex items-center justify-between`}
                      >
                        <div>
                          <p className="text-sm font-medium">{getGymName(gymId)}</p>
                          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{getGymCity(gymId)}</p>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          onClick={() => handleUnlinkGym(selectedChain.id, gymId)}
                          className="p-1 rounded hover:bg-red-500 hover:text-white transition-colors"
                        >
                          <Unlink size={14} />
                        </motion.button>
                      </motion.div>
                    ))}
                    {selectedChain.gyms.length === 0 && (
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} text-center py-4`}>
                        No gyms linked yet
                      </p>
                    )}
                  </div>
                </motion.div>

                {/* Shared Trainers */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6`}
                >
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Users size={18} />
                    Shared Trainers ({selectedChain.sharedTrainers.length})
                  </h3>

                  <div className="space-y-2">
                    {selectedChain.sharedTrainers.map((trainerId) => {
                      const trainer = mockSharedTrainers.find((t) => t.id === trainerId);
                      return trainer ? (
                        <motion.div
                          key={trainerId}
                          whileHover={{ x: 4 }}
                          className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} p-3 rounded-lg`}
                        >
                          <p className="text-sm font-medium">{trainer.name}</p>
                          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{trainer.specialization}</p>
                          <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'} mt-1`}>
                            Available in {trainer.gyms.length} locations
                          </p>
                        </motion.div>
                      ) : null;
                    })}
                  </div>
                </motion.div>
              </div>

              {/* Chain Analytics */}
              <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Member Growth */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6`}
                >
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp size={18} />
                    Member Growth
                  </h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chainMemberTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#4b5563' : '#e5e7eb'} />
                      <XAxis dataKey="month" stroke={isDark ? '#9ca3af' : '#6b7280'} />
                      <YAxis stroke={isDark ? '#9ca3af' : '#6b7280'} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: isDark ? '#1f2937' : '#fff',
                          border: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}`,
                          borderRadius: '8px',
                        }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="members" stroke="#3b82f6" strokeWidth={2} name="Total Members" />
                      <Line type="monotone" dataKey="newMembers" stroke="#10b981" strokeWidth={2} name="New Members" />
                    </LineChart>
                  </ResponsiveContainer>
                </motion.div>

                {/* Revenue by Gym */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6`}
                >
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <DollarSign size={18} />
                    Revenue by Gym
                  </h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chainRevenueByGym}>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#4b5563' : '#e5e7eb'} />
                      <XAxis dataKey="gym" stroke={isDark ? '#9ca3af' : '#6b7280'} />
                      <YAxis stroke={isDark ? '#9ca3af' : '#6b7280'} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: isDark ? '#1f2937' : '#fff',
                          border: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}`,
                          borderRadius: '8px',
                        }}
                      />
                      <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>

                {/* Class Distribution */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6`}
                >
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <BarChart3 size={18} />
                    Class Distribution
                  </h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={chainClassDistribution} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name} ${value}`} outerRadius={100} fill="#8884d8" dataKey="value">
                        {chainClassDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            // Chains List View
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Search */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6 mb-6`}
              >
                <div className="relative">
                  <Search className={`absolute left-3 top-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} size={18} />
                  <input
                    type="text"
                    placeholder="Search chains..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                      isDark
                        ? 'bg-gray-700 border-gray-600 placeholder-gray-500'
                        : 'bg-white border-gray-300 placeholder-gray-400'
                    }`}
                  />
                </div>
              </motion.div>

              {/* Chains Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredChains.map((chain, idx) => (
                  <motion.div
                    key={chain.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => setSelectedChain(chain)}
                    className={`${isDark ? 'bg-gray-800 border-gray-700 hover:border-blue-600' : 'bg-white border-gray-200 hover:border-blue-500'} rounded-lg border p-6 cursor-pointer transition-all hover:shadow-lg`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold">{chain.name}</h3>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{chain.description}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${isDark ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'}`}>
                        {chain.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700 dark:border-gray-700">
                      <div>
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Linked Gyms</p>
                        <p className="text-2xl font-bold">{chain.gyms.length}</p>
                      </div>
                      <div>
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Members</p>
                        <p className="text-2xl font-bold">{chain.totalMembers}</p>
                      </div>
                      <div>
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Revenue</p>
                        <p className="text-lg font-bold">${(chain.totalRevenue / 1000).toFixed(1)}K</p>
                      </div>
                      <div>
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Trainers</p>
                        <p className="text-2xl font-bold">{chain.sharedTrainers.length}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {filteredChains.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-8 text-center`}
                >
                  <Clouds size={32} className="mx-auto mb-2 opacity-50" />
                  <p className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>No chains found</p>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Create Chain Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg max-w-md w-full p-6`}
            >
              <h3 className="text-lg font-bold mb-4">Create New Chain</h3>
              <input
                type="text"
                placeholder="Chain name..."
                value={newChainName}
                onChange={(e) => setNewChainName(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} mb-4 text-sm`}
              />
              <textarea
                placeholder="Description..."
                value={newChainDesc}
                onChange={(e) => setNewChainDesc(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} mb-6 text-sm`}
                rows="3"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewChainName('');
                    setNewChainDesc('');
                  }}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateChain}
                  disabled={!newChainName.trim()}
                  className="flex-1 px-4 py-2 rounded-lg font-medium bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Create
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {showLinkGymModal && selectedChain && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg max-w-md w-full p-6`}
            >
              <h3 className="text-lg font-bold mb-4">Link Gym to Chain</h3>
              <div className="space-y-2 mb-6">
                {availableGymsForLinking.map((gym) => (
                  <label key={gym.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="gym"
                      value={gym.id}
                      checked={selectedGymToLink === gym.id}
                      onChange={(e) => setSelectedGymToLink(e.target.value)}
                      className="w-4 h-4"
                    />
                    <div>
                      <p className="font-medium text-sm">{gym.name}</p>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{gym.city}</p>
                    </div>
                  </label>
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowLinkGymModal(false);
                    setSelectedGymToLink(null);
                  }}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleLinkGym}
                  disabled={!selectedGymToLink}
                  className="flex-1 px-4 py-2 rounded-lg font-medium bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Link Gym
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default GymChainPage;
