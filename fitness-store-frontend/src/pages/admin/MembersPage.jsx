import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Download,
  Mail,
  Shield,
  Building2,
  Calendar,
  ChevronDown,
  Check,
  X,
  MoreVertical,
  Eye,
  Edit2,
  Trash2,
  Clock,
  Zap,
  Users,
  TrendingUp
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import AdminLayout from '../layouts/AdminLayout';

const MembersPage = () => {
  const { isDark } = useTheme();
  const { t } = useLanguage();

  // Mock Member Data
  const mockMembers = [
    { id: 1, name: 'Sarah Johnson', email: 'sarah.j@email.com', gym: 'FitZone Pro', plan: 'Professional', status: 'active', joined: '2023-10-15', lastActive: '2 hours ago', revenue: 1245.00, avatar: '👩' },
    { id: 2, name: 'Marcus Chen', email: 'marcus.c@email.com', gym: 'PowerFit', plan: 'Enterprise', status: 'active', joined: '2023-08-22', lastActive: '1 hour ago', revenue: 3580.00, avatar: '👨' },
    { id: 3, name: 'Emma Davis', email: 'emma.d@email.com', gym: 'CoreCore', plan: 'Starter', status: 'active', joined: '2024-01-10', lastActive: '30 min ago', revenue: 320.00, avatar: '👩' },
    { id: 4, name: 'James Wilson', email: 'james.w@email.com', gym: 'FitZone Pro', plan: 'Professional', status: 'frozen', joined: '2023-12-05', lastActive: '5 days ago', revenue: 890.00, avatar: '👨' },
    { id: 5, name: 'Lisa Anderson', email: 'lisa.a@email.com', gym: 'PowerFit', plan: 'Trial', status: 'active', joined: '2024-03-01', lastActive: '1 hour ago', revenue: 0.00, avatar: '👩' },
    { id: 6, name: 'Alex Rodriguez', email: 'alex.r@email.com', gym: 'FitZone Pro', plan: 'Starter', status: 'canceled', joined: '2023-06-18', lastActive: '2 weeks ago', revenue: 450.00, avatar: '👨' },
    { id: 7, name: 'Jessica Lee', email: 'jess.l@email.com', gym: 'CoreCore', plan: 'Professional', status: 'active', joined: '2023-11-30', lastActive: '45 min ago', revenue: 2100.00, avatar: '👩' },
    { id: 8, name: 'David Thompson', email: 'david.t@email.com', gym: 'PowerFit', plan: 'Enterprise', status: 'active', joined: '2023-07-12', lastActive: '20 min ago', revenue: 4200.00, avatar: '👨' },
    { id: 9, name: 'Nina Patel', email: 'nina.p@email.com', gym: 'FitZone Pro', plan: 'Starter', status: 'frozen', joined: '2024-02-08', lastActive: '3 days ago', revenue: 180.00, avatar: '👩' },
    { id: 10, name: 'Chris Brown', email: 'chris.b@email.com', gym: 'CoreCore', plan: 'Professional', status: 'active', joined: '2023-09-25', lastActive: '4 hours ago', revenue: 1680.00, avatar: '👨' }
  ];

  // State Management
  const [members, setMembers] = useState(mockMembers);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(null);

  // Filters State
  const [filters, setFilters] = useState({
    status: [],
    plan: [],
    gym: [],
    dateRange: { from: '', to: '' }
  });

  // Filtered and Searched Members
  const filteredMembers = useMemo(() => {
    return members.filter(member => {
      // Search filter
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        const matchesSearch = member.name.toLowerCase().includes(search) ||
                            member.email.toLowerCase().includes(search);
        if (!matchesSearch) return false;
      }

      // Status filter
      if (filters.status.length > 0 && !filters.status.includes(member.status)) {
        return false;
      }

      // Plan filter
      if (filters.plan.length > 0 && !filters.plan.includes(member.plan)) {
        return false;
      }

      // Gym filter
      if (filters.gym.length > 0 && !filters.gym.includes(member.gym)) {
        return false;
      }

      return true;
    });
  }, [members, searchTerm, filters]);

  // Stats Calculation
  const stats = useMemo(() => {
    return {
      active: members.filter(m => m.status === 'active').length,
      frozen: members.filter(m => m.status === 'frozen').length,
      canceled: members.filter(m => m.status === 'canceled').length,
      trial: members.filter(m => m.plan === 'Trial').length,
      total: members.length
    };
  }, [members]);

  // Filter Options
  const statusOptions = ['active', 'frozen', 'canceled'];
  const planOptions = [...new Set(members.map(m => m.plan))];
  const gymOptions = [...new Set(members.map(m => m.gym))];

  // Handlers
  const handleSelectMember = (id) => {
    const newSelected = new Set(selectedMembers);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedMembers(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedMembers.size === filteredMembers.length) {
      setSelectedMembers(new Set());
    } else {
      setSelectedMembers(new Set(filteredMembers.map(m => m.id)));
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      const updated = { ...prev };
      if (updated[filterType].includes(value)) {
        updated[filterType] = updated[filterType].filter(v => v !== value);
      } else {
        updated[filterType] = [...updated[filterType], value];
      }
      return updated;
    });
  };

  const handleExportCSV = () => {
    const headers = ['Name', 'Email', 'Gym', 'Plan', 'Status', 'Joined', 'Revenue'];
    const rows = (selectedMembers.size > 0 
      ? filteredMembers.filter(m => selectedMembers.has(m.id))
      : filteredMembers
    ).map(m => [
      m.name, m.email, m.gym, m.plan, m.status, m.joined, `$${m.revenue.toFixed(2)}`
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'members.csv';
    a.click();
  };

  const QuickStatsCard = ({ icon: Icon, label, value, sublabel }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={`p-4 rounded-lg border ${
        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${
          isDark ? 'bg-orange-500/20' : 'bg-orange-50'
        }`}>
          <Icon size={20} className={isDark ? 'text-orange-400' : 'text-orange-600'} />
        </div>
        <div>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {label}
          </p>
          <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {value}
          </p>
          {sublabel && (
            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
              {sublabel}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <AdminLayout>
      <div className={`p-6 space-y-6 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        {/* Header */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {t('admin.members') || 'Members'}
          </h1>
          <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Manage and monitor all gym members
          </p>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <QuickStatsCard icon={TrendingUp} label="Active" value={stats.active} sublabel={`${((stats.active/stats.total)*100).toFixed(1)}%`} />
          <QuickStatsCard icon={Clock} label="Frozen" value={stats.frozen} />
          <QuickStatsCard icon={X} label="Canceled" value={stats.canceled} />
          <QuickStatsCard icon={Zap} label="Trial" value={stats.trial} />
          <QuickStatsCard icon={Users} label="Total" value={stats.total} />
        </div>

        {/* Controls Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg border flex items-center justify-between gap-4 flex-wrap ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}
        >
          {/* Search */}
          <div className={`flex-1 min-w-64 flex items-center gap-2 px-4 py-2 rounded-lg ${
            isDark ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            <Search size={18} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`flex-1 bg-transparent outline-none text-sm ${
                isDark
                  ? 'text-white placeholder-gray-500'
                  : 'text-gray-900 placeholder-gray-500'
              }`}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {selectedMembers.size > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  isDark ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-50 text-orange-700'
                }`}
              >
                {selectedMembers.size} selected
              </motion.div>
            )}

            <motion.button
              onClick={() => setShowFilters(!showFilters)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-2 rounded-lg transition-colors ${
                isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              <Filter size={20} />
            </motion.button>

            {selectedMembers.size > 0 && (
              <motion.button
                onClick={() => setShowBulkActions(!showBulkActions)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-3 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${
                  isDark
                    ? 'bg-orange-500 hover:bg-orange-600 text-white'
                    : 'bg-orange-500 hover:bg-orange-600 text-white'
                }`}
              >
                Actions
                <ChevronDown size={16} />
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Bulk Actions Menu */}
        <AnimatePresence>
          {showBulkActions && selectedMembers.size > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-4 rounded-lg border grid grid-cols-1 md:grid-cols-4 gap-3 ${
                isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isDark
                    ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400'
                    : 'bg-blue-50 hover:bg-blue-100 text-blue-700'
                }`}
              >
                <Mail size={18} />
                Send Email
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleExportCSV}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isDark
                    ? 'bg-green-500/20 hover:bg-green-500/30 text-green-400'
                    : 'bg-green-50 hover:bg-green-100 text-green-700'
                }`}
              >
                <Download size={18} />
                Export CSV
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isDark
                    ? 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400'
                    : 'bg-yellow-50 hover:bg-yellow-100 text-yellow-700'
                }`}
              >
                <Shield size={18} />
                Suspend
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isDark
                    ? 'bg-purple-500/20 hover:bg-purple-500/30 text-purple-400'
                    : 'bg-purple-50 hover:bg-purple-100 text-purple-700'
                }`}
              >
                <Building2 size={18} />
                Change Gym
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filters Sidebar */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className={`p-6 rounded-lg border space-y-6 ${
                isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Status Filter */}
                <div>
                  <h3 className={`text-sm font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Status
                  </h3>
                  <div className="space-y-2">
                    {statusOptions.map(status => (
                      <label key={status} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.status.includes(status)}
                          onChange={() => handleFilterChange('status', status)}
                          className="w-4 h-4 rounded accent-orange-500"
                        />
                        <span className={`text-sm capitalize ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {status}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Plan Filter */}
                <div>
                  <h3 className={`text-sm font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Plan
                  </h3>
                  <div className="space-y-2">
                    {planOptions.map(plan => (
                      <label key={plan} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.plan.includes(plan)}
                          onChange={() => handleFilterChange('plan', plan)}
                          className="w-4 h-4 rounded accent-orange-500"
                        />
                        <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {plan}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Gym Filter */}
                <div>
                  <h3 className={`text-sm font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Gym
                  </h3>
                  <div className="space-y-2">
                    {gymOptions.map(gym => (
                      <label key={gym} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.gym.includes(gym)}
                          onChange={() => handleFilterChange('gym', gym)}
                          className="w-4 h-4 rounded accent-orange-500"
                        />
                        <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {gym}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Date Range - Placeholder */}
                <div>
                  <h3 className={`text-sm font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Join Date
                  </h3>
                  <div className="space-y-2">
                    <input
                      type="date"
                      className={`w-full px-3 py-2 rounded-lg border text-sm ${
                        isDark
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="From"
                    />
                    <input
                      type="date"
                      className={`w-full px-3 py-2 rounded-lg border text-sm ${
                        isDark
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="To"
                    />
                  </div>
                </div>
              </div>

              {Object.values(filters).some(f => Array.isArray(f) ? f.length > 0 : f) && (
                <motion.button
                  onClick={() => setFilters({ status: [], plan: [], gym: [], dateRange: { from: '', to: '' } })}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isDark
                      ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400'
                      : 'bg-red-50 hover:bg-red-100 text-red-700'
                  }`}
                >
                  Clear All Filters
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Members Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-lg border overflow-hidden ${
            isDark ? 'border-gray-700' : 'border-gray-200'
          }`}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedMembers.size === filteredMembers.length && filteredMembers.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded accent-orange-500"
                    />
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Member
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Email
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Gym
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Plan
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Status
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Joined
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Last Active
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Revenue
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member, idx) => (
                  <motion.tr
                    key={member.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.02 }}
                    className={`border-b transition-colors ${
                      isDark
                        ? 'border-gray-700 hover:bg-gray-700/50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedMembers.has(member.id)}
                        onChange={() => handleSelectMember(member.id)}
                        className="w-4 h-4 rounded accent-orange-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white">
                          {member.avatar}
                        </div>
                        <span className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                          {member.name}
                        </span>
                      </div>
                    </td>
                    <td className={`px-6 py-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {member.email}
                    </td>
                    <td className={`px-6 py-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
                      {member.gym}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        member.plan === 'Enterprise' ? (isDark ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-800') :
                        member.plan === 'Professional' ? (isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-800') :
                        member.plan === 'Trial' ? (isDark ? 'bg-yellow-500/20 text-yellow-300' : 'bg-yellow-100 text-yellow-800') :
                        (isDark ? 'bg-gray-500/20 text-gray-300' : 'bg-gray-100 text-gray-800')
                      }`}>
                        {member.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        member.status === 'active' ? (isDark ? 'bg-green-500/20 text-green-300' : 'bg-green-100 text-green-800') :
                        member.status === 'frozen' ? (isDark ? 'bg-yellow-500/20 text-yellow-300' : 'bg-yellow-100 text-yellow-800') :
                        (isDark ? 'bg-red-500/20 text-red-300' : 'bg-red-100 text-red-800')
                      }`}>
                        {member.status}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {member.joined}
                    </td>
                    <td className={`px-6 py-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {member.lastActive}
                    </td>
                    <td className={`px-6 py-4 text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                      ${member.revenue.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 relative">
                      <motion.button
                        onClick={() => setShowActionMenu(showActionMenu === member.id ? null : member.id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-2 rounded-lg transition-colors ${
                          isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                        }`}
                      >
                        <MoreVertical size={18} />
                      </motion.button>

                      <AnimatePresence>
                        {showActionMenu === member.id && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className={`absolute right-0 top-10 w-48 rounded-lg shadow-xl z-50 ${
                              isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                            }`}
                          >
                            <div className="p-2 space-y-1">
                              <button className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                                isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                              }`}>
                                <Eye size={16} />
                                View Profile
                              </button>
                              <button className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                                isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                              }`}>
                                <Edit2 size={16} />
                                Edit
                              </button>
                              <button className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                                isDark ? 'hover:bg-red-500/10 text-red-400' : 'hover:bg-red-50 text-red-600'
                              }`}>
                                <Trash2 size={16} />
                                Delete
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredMembers.length === 0 && (
            <div className={`p-12 text-center ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <p className={`text-lg font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                No members found
              </p>
              <p className={`text-sm mt-1 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                Try adjusting your filters or search term
              </p>
            </div>
          )}
        </motion.div>

        {/* Pagination Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`flex items-center justify-between text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
        >
          <span>
            Showing {filteredMembers.length} of {members.length} members
          </span>
          <div className="flex gap-2">
            <button className={`px-3 py-1 rounded ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
              Previous
            </button>
            <button className={`px-3 py-1 rounded ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
              Next
            </button>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default MembersPage;
