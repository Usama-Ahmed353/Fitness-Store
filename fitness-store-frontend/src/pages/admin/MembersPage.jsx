import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Download,
  Shield,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  MoreVertical,
  Eye,
  Edit2,
  Trash2,
  Clock,
  Zap,
  Users,
  TrendingUp,
  UserCheck,
  UserX,
  Loader2
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import AdminLayout from '../../layouts/AdminLayout';
import axios from 'axios';
import { useSelector } from 'react-redux';

const runtimeHost = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
const API = import.meta.env.VITE_API_BASE_URL || `http://${runtimeHost}:5001/api`;

const MembersPage = () => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const { accessToken } = useSelector((s) => s.auth);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [showActionMenu, setShowActionMenu] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  const headers = { Authorization: `Bearer ${accessToken}` };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (roleFilter) params.role = roleFilter;
      const { data } = await axios.get(`${API}/admin/users`, { headers, params });
      setUsers(data.data || []);
      setPagination(data.pagination || { total: 0, pages: 1 });
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  }, [page, roleFilter, accessToken]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  // Client-side search filter on fetched users
  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    const s = searchTerm.toLowerCase();
    return users.filter(u =>
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(s) ||
      u.email.toLowerCase().includes(s)
    );
  }, [users, searchTerm]);

  // Stats
  const stats = useMemo(() => ({
    total: pagination.total,
    active: users.filter(u => u.isActive).length,
    inactive: users.filter(u => !u.isActive).length,
    admins: users.filter(u => u.role === 'admin' || u.role === 'super_admin').length,
    members: users.filter(u => u.role === 'member').length,
  }), [users, pagination]);

  const handleSelectUser = (id) => {
    const next = new Set(selectedUsers);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedUsers(next);
  };

  const handleSelectAll = () => {
    if (selectedUsers.size === filteredUsers.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(filteredUsers.map(u => u._id)));
    }
  };

  const handleUpdateUser = async (userId, updates) => {
    try {
      await axios.patch(`${API}/admin/users/${userId}`, updates, { headers });
      fetchUsers();
      setShowActionMenu(null);
      setEditingUser(null);
    } catch (err) {
      console.error('Failed to update user:', err);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`${API}/admin/users/${userId}`, { headers });
      fetchUsers();
      setShowActionMenu(null);
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };

  const handleExportCSV = () => {
    const hdrs = ['Name', 'Email', 'Role', 'Status', 'Joined'];
    const source = selectedUsers.size > 0
      ? filteredUsers.filter(u => selectedUsers.has(u._id))
      : filteredUsers;
    const rows = source.map(u => [
      `${u.firstName} ${u.lastName}`, u.email, u.role,
      u.isActive ? 'active' : 'inactive',
      new Date(u.createdAt).toLocaleDateString()
    ]);
    const csv = [hdrs, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'users.csv'; a.click();
  };

  const roleColors = {
    member: isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-800',
    admin: isDark ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-800',
    super_admin: isDark ? 'bg-red-500/20 text-red-300' : 'bg-red-100 text-red-800',
    gym_owner: isDark ? 'bg-yellow-500/20 text-yellow-300' : 'bg-yellow-100 text-yellow-800',
    trainer: isDark ? 'bg-green-500/20 text-green-300' : 'bg-green-100 text-green-800',
  };

  const QuickStatsCard = ({ icon: Icon, label, value, sublabel }) => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -2 }}
      className={`p-4 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${isDark ? 'bg-orange-500/20' : 'bg-orange-50'}`}>
          <Icon size={20} className={isDark ? 'text-orange-400' : 'text-orange-600'} />
        </div>
        <div>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{label}</p>
          <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{value}</p>
          {sublabel && <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>{sublabel}</p>}
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
            {t('admin.members') || 'User Management'}
          </h1>
          <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Manage all registered users
          </p>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <QuickStatsCard icon={Users} label="Total Users" value={stats.total} />
          <QuickStatsCard icon={UserCheck} label="Active" value={stats.active} />
          <QuickStatsCard icon={UserX} label="Inactive" value={stats.inactive} />
          <QuickStatsCard icon={Shield} label="Admins" value={stats.admins} />
          <QuickStatsCard icon={TrendingUp} label="Members" value={stats.members} />
        </div>

        {/* Controls */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg border flex items-center justify-between gap-4 flex-wrap ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className={`flex-1 min-w-64 flex items-center gap-2 px-4 py-2 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <Search size={18} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
            <input type="text" placeholder="Search by name or email..." value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`flex-1 bg-transparent outline-none text-sm ${isDark ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-500'}`} />
          </div>
          <div className="flex items-center gap-2">
            {selectedUsers.size > 0 && (
              <span className={`px-3 py-2 rounded-lg text-sm font-medium ${isDark ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-50 text-orange-700'}`}>
                {selectedUsers.size} selected
              </span>
            )}
            <button onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
              <Filter size={20} />
            </button>
            <button onClick={handleExportCSV}
              className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
              <Download size={20} />
            </button>
          </div>
        </motion.div>

        {/* Role Filter */}
        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className={`p-4 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <h3 className={`text-sm font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Filter by Role</h3>
              <div className="flex flex-wrap gap-2">
                {['', 'member', 'admin', 'super_admin', 'gym_owner', 'trainer'].map(r => (
                  <button key={r} onClick={() => { setRoleFilter(r); setPage(1); }}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                      roleFilter === r
                        ? 'bg-orange-500 text-white'
                        : isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}>
                    {r || 'All'}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Users Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className={`rounded-lg border overflow-hidden ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
          ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                  <th className="px-4 py-3 text-left">
                    <input type="checkbox" checked={selectedUsers.size === filteredUsers.length && filteredUsers.length > 0}
                      onChange={handleSelectAll} className="w-4 h-4 rounded accent-orange-500" />
                  </th>
                  {['User', 'Email', 'Role', 'Status', 'Joined', 'Last Login', 'Actions'].map(h => (
                    <th key={h} className={`px-4 py-3 text-left text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, idx) => (
                  <motion.tr key={user._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.02 }}
                    className={`border-b transition-colors ${isDark ? 'border-gray-700 hover:bg-gray-700/50' : 'border-gray-200 hover:bg-gray-50'}`}>
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={selectedUsers.has(user._id)}
                        onChange={() => handleSelectUser(user._id)} className="w-4 h-4 rounded accent-orange-500" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-sm font-bold">
                          {user.firstName?.[0]}{user.lastName?.[0]}
                        </div>
                        <span className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                          {user.firstName} {user.lastName}
                        </span>
                      </div>
                    </td>
                    <td className={`px-4 py-3 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{user.email}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${roleColors[user.role] || ''}`}>
                        {user.role?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        user.isActive
                          ? (isDark ? 'bg-green-500/20 text-green-300' : 'bg-green-100 text-green-800')
                          : (isDark ? 'bg-red-500/20 text-red-300' : 'bg-red-100 text-red-800')
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className={`px-4 py-3 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className={`px-4 py-3 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-4 py-3 relative">
                      <button onClick={() => setShowActionMenu(showActionMenu === user._id ? null : user._id)}
                        className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                        <MoreVertical size={18} />
                      </button>
                      <AnimatePresence>
                        {showActionMenu === user._id && (
                          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                            className={`absolute right-4 top-10 w-52 rounded-lg shadow-xl z-50 ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                            <div className="p-2 space-y-1">
                              <button onClick={() => handleUpdateUser(user._id, { isActive: !user.isActive })}
                                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}>
                                {user.isActive ? <UserX size={16} /> : <UserCheck size={16} />}
                                {user.isActive ? 'Deactivate' : 'Activate'}
                              </button>
                              <button onClick={() => setEditingUser(user)}
                                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}>
                                <Edit2 size={16} /> Change Role
                              </button>
                              <button onClick={() => handleDeleteUser(user._id)}
                                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${isDark ? 'hover:bg-red-500/10 text-red-400' : 'hover:bg-red-50 text-red-600'}`}>
                                <Trash2 size={16} /> Delete
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
          )}

          {!loading && filteredUsers.length === 0 && (
            <div className={`p-12 text-center ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <p className={`text-lg font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>No users found</p>
              <p className={`text-sm mt-1 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>Try adjusting your filters or search term</p>
            </div>
          )}
        </motion.div>

        {/* Pagination */}
        <div className={`flex items-center justify-between text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          <span>Page {page} of {pagination.pages} ({pagination.total} users)</span>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}
              className={`px-3 py-1.5 rounded flex items-center gap-1 disabled:opacity-40 ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
              <ChevronLeft size={16} /> Previous
            </button>
            <button onClick={() => setPage(p => Math.min(pagination.pages, p + 1))} disabled={page >= pagination.pages}
              className={`px-3 py-1.5 rounded flex items-center gap-1 disabled:opacity-40 ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Role Change Modal */}
        <AnimatePresence>
          {editingUser && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setEditingUser(null)}>
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={e => e.stopPropagation()}
                className={`w-96 p-6 rounded-xl shadow-2xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Change Role — {editingUser.firstName} {editingUser.lastName}
                </h3>
                <div className="space-y-2">
                  {['member', 'admin', 'super_admin', 'gym_owner', 'trainer'].map(r => (
                    <button key={r} onClick={() => handleUpdateUser(editingUser._id, { role: r })}
                      className={`w-full px-4 py-2.5 rounded-lg text-left text-sm font-medium capitalize transition ${
                        editingUser.role === r
                          ? 'bg-orange-500 text-white'
                          : isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}>
                      {r.replace('_', ' ')}
                    </button>
                  ))}
                </div>
                <button onClick={() => setEditingUser(null)}
                  className={`mt-4 w-full px-4 py-2 rounded-lg text-sm transition ${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                  Cancel
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
};

export default MembersPage;
