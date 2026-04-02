import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Trash2,
  Edit,
  Mail,
  Copy,
  Check,
  AlertCircle,
  X,
  Shield,
  Clock,
  MoreVertical,
  Send,
  Eye,
  EyeOff,
} from 'lucide-react';
import { ThemeContext } from '../../contexts/ThemeContext';

const roles = [
  { id: 'trainer', name: 'Trainer', description: 'Can manage own schedule and classes' },
  { id: 'front-desk', name: 'Front Desk', description: 'Can check-in members and manage bookings' },
  { id: 'manager', name: 'Manager', description: 'Full access except billing' },
];

const mockStaff = [
  {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah@fitlife.com',
    role: 'trainer',
    status: 'active',
    joinedDate: '2025-12-15',
    specialties: ['Yoga', 'Pilates'],
  },
  {
    id: 2,
    name: 'Mike Chen',
    email: 'mike@fitlife.com',
    role: 'trainer',
    status: 'active',
    joinedDate: '2026-01-20',
    specialties: ['Strength Training', 'CrossFit'],
  },
  {
    id: 3,
    name: 'Emma Wilson',
    email: 'emma@fitlife.com',
    role: 'front-desk',
    status: 'active',
    joinedDate: '2026-02-01',
    specialties: [],
  },
  {
    id: 4,
    name: 'Alex Rodriguez',
    email: 'alex@fitlife.com',
    role: 'manager',
    status: 'pending',
    joinedDate: null,
    specialties: [],
  },
];

const StaffManagementPage = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const [staff, setStaff] = useState(mockStaff);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Invite form
  const [inviteForm, setInviteForm] = useState({
    name: '',
    email: '',
    role: 'trainer',
    specialties: '',
  });

  const [inviteError, setInviteError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInviteForm((prev) => ({ ...prev, [name]: value }));
    setInviteError('');
  };

  const handleInviteStaff = () => {
    if (!inviteForm.name.trim() || !inviteForm.email.trim()) {
      setInviteError('Please fill in all required fields');
      return;
    }

    const newStaff = {
      id: Date.now(),
      name: inviteForm.name,
      email: inviteForm.email,
      role: inviteForm.role,
      status: 'pending',
      joinedDate: null,
      specialties: inviteForm.specialties
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s),
    };

    setStaff((prev) => [newStaff, ...prev]);
    setInviteForm({ name: '', email: '', role: 'trainer', specialties: '' });
    setShowInviteModal(false);
  };

  const handleRemoveStaff = (id) => {
    if (confirm('Are you sure you want to remove this staff member?')) {
      setStaff((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const handleViewCredentials = (staffMember) => {
    setSelectedStaff(staffMember);
    setShowCredentialsModal(true);
  };

  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const getRoleInfo = (roleId) => roles.find((r) => r.id === roleId);

  const colorMap = {
    trainer: 'blue',
    'front-desk': 'green',
    manager: 'purple',
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} p-6`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Staff Management</h1>
              <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Invite trainers, managers, and front desk staff
              </p>
            </div>
            <button
              onClick={() => {
                setInviteForm({ name: '', email: '', role: 'trainer', specialties: '' });
                setInviteError('');
                setShowInviteModal(true);
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2"
            >
              <Plus size={20} />
              Invite Staff Member
            </button>
          </div>
        </motion.div>

        {/* Role Guide */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`grid md:grid-cols-3 gap-4 mb-8`}
        >
          {roles.map((role) => (
            <div
              key={role.id}
              className={`${
                isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              } rounded-lg border p-4`}
            >
              <h3 className="font-bold text-lg mb-1">{role.name}</h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {role.description}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Staff List */}
        <div className="space-y-4">
          {staff.map((member, idx) => {
            const roleInfo = getRoleInfo(member.role);
            const color = colorMap[member.role];

            return (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6 hover:shadow-lg transition-shadow`}
              >
                <div className="flex items-start justify-between">
                  {/* Staff Info */}
                  <div className="flex items-start gap-4 flex-1">
                    <div
                      className={`w-12 h-12 rounded-full bg-${color}-100 dark:bg-${color}-900/30 flex items-center justify-center font-bold text-lg flex-shrink-0`}
                    >
                      {member.name.charAt(0)}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold">{member.name}</h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            member.status === 'active'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                          }`}
                        >
                          {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                        </span>
                      </div>

                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {member.email}
                      </p>

                      <div className="flex flex-wrap gap-3 mt-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-${color}-100 text-${color}-800 dark:bg-${color}-900/30 dark:text-${color}-300`}>
                          {roleInfo.name}
                        </span>
                        {member.specialties.length > 0 && (
                          <div className="flex gap-2">
                            {member.specialties.map((specialty) => (
                              <span
                                key={specialty}
                                className={`px-2 py-1 rounded text-xs font-semibold ${
                                  isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                                }`}
                              >
                                {specialty}
                              </span>
                            ))}
                          </div>
                        )}
                        {member.joinedDate && (
                          <span className={`text-xs flex items-center gap-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            <Clock size={14} />
                            Joined {new Date(member.joinedDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-shrink-0">
                    {member.status === 'pending' && (
                      <button
                        onClick={() => handleViewCredentials(member)}
                        className={`p-2 rounded-lg transition-colors ${
                          isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                        }`}
                        title="View login credentials"
                      >
                        <Shield size={18} className="text-blue-600" />
                      </button>
                    )}
                    <button
                      onClick={() => handleRemoveStaff(member.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                      }`}
                      title="Remove staff member"
                    >
                      <Trash2 size={18} className="text-red-600" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Invite Modal */}
        <AnimatePresence>
          {showInviteModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowInviteModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                onClick={(e) => e.stopPropagation()}
                className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg p-8 max-w-md w-full`}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold">Invite Staff Member</h3>
                  <button
                    onClick={() => setShowInviteModal(false)}
                    className={`p-2 rounded-lg transition-colors ${
                      isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={inviteForm.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Sarah Johnson"
                      className={`w-full px-4 py-2 rounded-lg border ${
                        isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300'
                      }`}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={inviteForm.email}
                      onChange={handleInputChange}
                      placeholder="sarah@example.com"
                      className={`w-full px-4 py-2 rounded-lg border ${
                        isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300'
                      }`}
                    />
                  </div>

                  {/* Role */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">Role</label>
                    <select
                      name="role"
                      value={inviteForm.role}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300'
                      }`}
                    >
                      {roles.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                    <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {getRoleInfo(inviteForm.role).description}
                    </p>
                  </div>

                  {/* Specialties (for trainers) */}
                  {inviteForm.role === 'trainer' && (
                    <div>
                      <label className="block text-sm font-semibold mb-2">Specialties (Optional)</label>
                      <input
                        type="text"
                        name="specialties"
                        value={inviteForm.specialties}
                        onChange={handleInputChange}
                        placeholder="e.g., Yoga, Pilates (comma-separated)"
                        className={`w-full px-4 py-2 rounded-lg border ${
                          isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300'
                        }`}
                      />
                    </div>
                  )}

                  {/* Error Message */}
                  {inviteError && (
                    <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-900">
                      <p className="text-sm text-red-800 dark:text-red-300">{inviteError}</p>
                    </div>
                  )}
                </div>

                {/* Info Box */}
                <div
                  className={`p-4 rounded-lg mb-6 border ${
                    isDark ? 'border-blue-900 bg-blue-900/20' : 'border-blue-200 bg-blue-50'
                  }`}
                >
                  <p className={`text-sm ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                    📧 An invitation email will be sent to {inviteForm.email || 'staff member'} with login credentials.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowInviteModal(false)}
                    className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
                      isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleInviteStaff}
                    className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2"
                  >
                    <Mail size={18} />
                    Send Invite
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Credentials Modal */}
        <AnimatePresence>
          {showCredentialsModal && selectedStaff && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowCredentialsModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                onClick={(e) => e.stopPropagation()}
                className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg p-8 max-w-md w-full`}
              >
                <h3 className="text-2xl font-bold mb-6">Login Credentials</h3>

                <p className={`text-sm mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Share these credentials with {selectedStaff.name} to access their account:
                </p>

                {/* Email */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2">Email</label>
                  <div className={`flex items-center gap-2 p-3 rounded-lg border ${isDark ? 'border-gray-700 bg-gray-700' : 'border-gray-300 bg-gray-50'}`}>
                    <input
                      type="text"
                      readOnly
                      value={selectedStaff.email}
                      className="flex-1 bg-transparent outline-none font-mono text-sm"
                    />
                    <button
                      onClick={() => handleCopyToClipboard(selectedStaff.email)}
                      className="p-1 hover:bg-gray-600 dark:hover:bg-gray-600 rounded transition-colors"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>

                {/* Password */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-2">Temporary Password</label>
                  <div className={`flex items-center gap-2 p-3 rounded-lg border ${isDark ? 'border-gray-700 bg-gray-700' : 'border-gray-300 bg-gray-50'}`}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      readOnly
                      value="TempPass123!@#"
                      className="flex-1 bg-transparent outline-none font-mono text-sm"
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-1 hover:bg-gray-600 dark:hover:bg-gray-600 rounded transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    <button
                      onClick={() => handleCopyToClipboard('TempPass123!@#')}
                      className="p-1 hover:bg-gray-600 dark:hover:bg-gray-600 rounded transition-colors"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>

                {/* Info Box */}
                <div
                  className={`p-4 rounded-lg mb-6 border ${
                    isDark ? 'border-yellow-900 bg-yellow-900/20' : 'border-yellow-200 bg-yellow-50'
                  }`}
                >
                  <p className={`text-sm font-semibold ${isDark ? 'text-yellow-300' : 'text-yellow-800'}`}>
                    ⚠️ Temporary Password
                  </p>
                  <p className={`text-xs mt-2 ${isDark ? 'text-yellow-300/80' : 'text-yellow-700'}`}>
                    They will be required to change this password on first login for security.
                  </p>
                </div>

                {/* Login URL */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-2">Login URL</label>
                  <div className={`flex items-center gap-2 p-3 rounded-lg border ${isDark ? 'border-gray-700 bg-gray-700' : 'border-gray-300 bg-gray-50'}`}>
                    <input
                      type="text"
                      readOnly
                      value="https://crunchfitpro.com/staff-login"
                      className="flex-1 bg-transparent outline-none font-mono text-xs"
                    />
                    <button
                      onClick={() => handleCopyToClipboard('https://crunchfitpro.com/staff-login')}
                      className="p-1 hover:bg-gray-600 dark:hover:bg-gray-600 rounded transition-colors"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowCredentialsModal(false)}
                    className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
                      isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    Close
                  </button>
                  <button className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2">
                    <Send size={18} />
                    Send Details
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

export default StaffManagementPage;
