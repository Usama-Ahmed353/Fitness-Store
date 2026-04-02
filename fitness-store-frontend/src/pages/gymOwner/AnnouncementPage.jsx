import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Trash2,
  Edit,
  Send,
  Calendar,
  Clock,
  Users,
  Mail,
  Bell,
  Zap,
  ChevronRight,
  X,
  Check,
  AlertCircle,
} from 'lucide-react';
import { ThemeContext } from '../../contexts/ThemeContext';

const announcementTypes = [
  { id: 'promotion', label: 'Promotion', icon: Zap, color: 'yellow' },
  { id: 'holiday', label: 'Holiday Hours', icon: Calendar, color: 'purple' },
  { id: 'class', label: 'New Class', icon: Users, color: 'blue' },
  { id: 'trainer', label: 'New Trainer', icon: Users, color: 'green' },
  { id: 'maintenance', label: 'Maintenance', icon: AlertCircle, color: 'red' },
];

const mockAnnouncements = [
  {
    id: 1,
    title: 'Summer Special: 30% Off Annual Memberships',
    description: 'Get 30% off any annual membership through August 31st!',
    type: 'promotion',
    recipients: 847,
    status: 'sent',
    createdAt: '2 days ago',
    scheduledFor: null,
    sendsTo: ['in-app', 'email', 'push'],
  },
  {
    id: 2,
    title: 'New Morning Yoga Class',
    description: 'Join us for a new early morning power yoga session starting next Monday.',
    type: 'class',
    recipients: 0,
    status: 'scheduled',
    createdAt: 'Today',
    scheduledFor: '2026-03-27 08:00 AM',
    sendsTo: ['in-app', 'email'],
  },
  {
    id: 3,
    title: 'Easter Holiday Hours',
    description: 'We will be closed on Easter Sunday. Normal hours resume Monday.',
    type: 'holiday',
    recipients: 0,
    status: 'draft',
    createdAt: 'Today',
    scheduledFor: null,
    sendsTo: ['in-app'],
  },
];

const AnnouncementPage = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const [announcements, setAnnouncements] = useState(mockAnnouncements);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'promotion',
    sendsTo: ['in-app', 'email'],
    scheduleType: 'immediate',
    scheduledDate: '',
    scheduledTime: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChannelToggle = (channel) => {
    setFormData((prev) => ({
      ...prev,
      sendsTo: prev.sendsTo.includes(channel)
        ? prev.sendsTo.filter((c) => c !== channel)
        : [...prev.sendsTo, channel],
    }));
  };

  const handleCreateAnnouncement = () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    const newAnnouncement = {
      id: Date.now(),
      title: formData.title,
      description: formData.description,
      type: formData.type,
      recipients: formData.scheduleType === 'immediate' ? 847 : 0,
      status: formData.scheduleType === 'immediate' ? 'sent' : 'scheduled',
      createdAt: 'just now',
      scheduledFor: formData.scheduleType === 'scheduled' ? `${formData.scheduledDate} ${formData.scheduledTime}` : null,
      sendsTo: formData.sendsTo,
    };

    if (editingId) {
      setAnnouncements((prev) =>
        prev.map((a) => (a.id === editingId ? { ...newAnnouncement, id: editingId } : a))
      );
      setEditingId(null);
    } else {
      setAnnouncements((prev) => [newAnnouncement, ...prev]);
    }

    setFormData({
      title: '',
      description: '',
      type: 'promotion',
      sendsTo: ['in-app', 'email'],
      scheduleType: 'immediate',
      scheduledDate: '',
      scheduledTime: '',
    });
    setShowCreateModal(false);
  };

  const handleEdit = (announcement) => {
    setFormData({
      title: announcement.title,
      description: announcement.description,
      type: announcement.type,
      sendsTo: announcement.sendsTo,
      scheduleType: announcement.scheduledFor ? 'scheduled' : 'immediate',
      scheduledDate: announcement.scheduledFor?.split(' ')[0] || '',
      scheduledTime: announcement.scheduledFor?.split(' ')[1] + ' ' + announcement.scheduledFor?.split(' ')[2] || '',
    });
    setEditingId(announcement.id);
    setShowCreateModal(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this announcement?')) {
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} p-6`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Announcements</h1>
              <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Communicate with your members across multiple channels
              </p>
            </div>
            <button
              onClick={() => {
                setEditingId(null);
                setFormData({
                  title: '',
                  description: '',
                  type: 'promotion',
                  sendsTo: ['in-app', 'email'],
                  scheduleType: 'immediate',
                  scheduledDate: '',
                  scheduledTime: '',
                });
                setShowCreateModal(true);
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2"
            >
              <Plus size={20} />
              Create Announcement
            </button>
          </div>
        </motion.div>

        {/* Announcements List */}
        <div className="space-y-4">
          {announcements.map((announcement, idx) => {
            const typeInfo = announcementTypes.find((t) => t.id === announcement.type);
            const TypeIcon = typeInfo.icon;

            return (
              <motion.div
                key={announcement.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6 hover:shadow-lg transition-shadow`}
              >
                <div className="flex items-start gap-4">
                  {/* Type Icon */}
                  <div className={`p-3 rounded-lg bg-${typeInfo.color}-100 dark:bg-${typeInfo.color}-900/30 flex-shrink-0`}>
                    <TypeIcon className={`text-${typeInfo.color}-600 dark:text-${typeInfo.color}-400`} size={24} />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-bold">{announcement.title}</h3>
                        <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {announcement.description}
                        </p>
                      </div>

                      {/* Status Badge */}
                      <div className="flex-shrink-0">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            announcement.status === 'sent'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                              : announcement.status === 'scheduled'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                              : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {announcement.status.charAt(0).toUpperCase() + announcement.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    {/* Meta Info */}
                    <div className="flex flex-wrap gap-4 mt-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Users size={16} className="text-gray-500" />
                        <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                          {announcement.recipients > 0 ? `${announcement.recipients} members` : 'Not sent yet'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={16} className="text-gray-500" />
                        <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                          {announcement.scheduledFor || announcement.createdAt}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {announcement.sendsTo.map((channel) => (
                          <span
                            key={channel}
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {channel === 'in-app' ? '📱' : channel === 'email' ? '✉️' : '🔔'} {channel}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {announcement.status !== 'sent' && (
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleEdit(announcement)}
                        className={`p-2 rounded-lg transition-colors ${
                          isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                        }`}
                      >
                        <Edit size={18} className="text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(announcement.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                        }`}
                      >
                        <Trash2 size={18} className="text-red-600" />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Create/Edit Modal */}
        <AnimatePresence>
          {showCreateModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowCreateModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                onClick={(e) => e.stopPropagation()}
                className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg p-8 max-w-2xl w-full max-h-96 overflow-y-auto`}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold">
                    {editingId ? 'Edit Announcement' : 'Create Announcement'}
                  </h3>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className={`p-2 rounded-lg transition-colors ${
                      isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="e.g., Summer Special: 30% Off"
                      className={`w-full px-4 py-2 rounded-lg border ${
                        isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300'
                      }`}
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">Description *</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="What do your members need to know?"
                      rows="3"
                      className={`w-full px-4 py-2 rounded-lg border ${
                        isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300'
                      }`}
                    />
                  </div>

                  {/* Type */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">Type</label>
                    <div className="grid grid-cols-5 gap-2">
                      {announcementTypes.map((t) => {
                        const Icon = t.icon;
                        return (
                          <button
                            key={t.id}
                            onClick={() => setFormData((prev) => ({ ...prev, type: t.id }))}
                            className={`p-3 rounded-lg border-2 transition-all ${
                              formData.type === t.id
                                ? 'border-blue-600 bg-blue-100 dark:bg-blue-900/30'
                                : isDark
                                ? 'border-gray-700 hover:border-gray-600'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            <Icon size={20} className="mx-auto mb-1" />
                            <p className="text-xs font-semibold text-center">{t.label}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Send Channels */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">Send Via (select all that apply)</label>
                    <div className="space-y-2">
                      {['in-app', 'email', 'push'].map((channel) => (
                        <label key={channel} className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                          <input
                            type="checkbox"
                            checked={formData.sendsTo.includes(channel)}
                            onChange={() => handleChannelToggle(channel)}
                            className="w-4 h-4"
                          />
                          <span className="text-sm font-semibold capitalize">
                            {channel === 'in-app' ? '📱 In-App Notification' : channel === 'email' ? '✉️ Email' : '🔔 Push Notification'}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Schedule */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">Send Type</label>
                    <div className="grid grid-cols-2 gap-3">
                      {['immediate', 'scheduled'].map((type) => (
                        <button
                          key={type}
                          onClick={() => setFormData((prev) => ({ ...prev, scheduleType: type }))}
                          className={`p-3 rounded-lg border-2 transition-all text-center ${
                            formData.scheduleType === type
                              ? 'border-blue-600 bg-blue-100 dark:bg-blue-900/30'
                              : isDark
                              ? 'border-gray-700 hover:border-gray-600'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <p className="text-sm font-semibold capitalize">
                            {type === 'immediate' ? '📤 Send Now' : '⏰ Schedule'}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Scheduled Date/Time */}
                  {formData.scheduleType === 'scheduled' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2">Date</label>
                        <input
                          type="date"
                          name="scheduledDate"
                          value={formData.scheduledDate}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2 rounded-lg border ${
                            isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Time</label>
                        <input
                          type="time"
                          name="scheduledTime"
                          value={formData.scheduledTime}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2 rounded-lg border ${
                            isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300'
                          }`}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
                      isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateAnnouncement}
                    className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2"
                  >
                    <Check size={18} />
                    {formData.scheduleType === 'immediate' ? 'Send Now' : 'Schedule'}
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

export default AnnouncementPage;
