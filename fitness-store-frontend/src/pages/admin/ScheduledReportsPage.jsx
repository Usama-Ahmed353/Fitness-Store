import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Calendar,
  Check,
  Copy,
  Download,
  Edit2,
  Eye,
  Mail,
  MoreVertical,
  Plus,
  Search,
  Trash2,
  X,
  CheckCircle,
} from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';
import { LanguageContext } from '../../context/LanguageContext';
import AdminLayout from '../../layouts/AdminLayout';

// Mock scheduled reports
const mockScheduledReports = [
  {
    id: 'SCH-001',
    name: 'Weekly Financial Summary',
    description: 'MRR, Revenue by Plan, Payment Metrics',
    frequency: 'weekly',
    dayOfWeek: 'Monday',
    time: '09:00 AM',
    recipients: ['admin@crunchfit.com', 'finance@crunchfit.com'],
    metrics: ['MRR', 'Revenue by Plan', 'Payment Success Rate', 'Churn Rate'],
    template: 'financial',
    status: 'active',
    createdDate: '2024-02-01',
    lastSent: '2024-03-24',
    nextSend: '2024-03-31',
  },
  {
    id: 'SCH-002',
    name: 'Monthly Performance Report',
    description: 'All gym metrics, attendance, instructor performance',
    frequency: 'monthly',
    dayOfMonth: '1',
    time: '08:00 AM',
    recipients: ['admin@crunchfit.com', 'ops@crunchfit.com'],
    metrics: ['Total Revenue', 'Members', 'Classes', 'Attendance Rate', 'Instructor Performance'],
    template: 'comprehensive',
    status: 'active',
    createdDate: '2024-01-15',
    lastSent: '2024-03-01',
    nextSend: '2024-04-01',
  },
  {
    id: 'SCH-003',
    name: 'Gym Manager Weekly Update',
    description: 'Gym-specific metrics and performance',
    frequency: 'weekly',
    dayOfWeek: 'Friday',
    time: '05:00 PM',
    recipients: ['gym@crunchfit.com'],
    metrics: ['Gym Revenue', 'Members Count', 'Classes Offered', 'Avg Rating'],
    template: 'gym',
    status: 'paused',
    createdDate: '2024-03-10',
    lastSent: '2024-03-22',
    nextSend: null,
  },
];

const ScheduledReportsPage = () => {
  const { theme } = useContext(ThemeContext);
  const { language } = useContext(LanguageContext);
  const isDark = theme === 'dark';

  const [reports, setReports] = useState(mockScheduledReports);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    frequency: 'weekly',
    dayOfWeek: 'Monday',
    dayOfMonth: '1',
    time: '09:00',
    recipients: '',
    template: 'financial',
    metrics: [],
  });

  const frequencyOptions = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'biweekly', label: 'Bi-weekly' },
    { value: 'monthly', label: 'Monthly' },
  ];

  const templateOptions = [
    { value: 'financial', label: 'Financial (MRR, Revenue, Payments)' },
    { value: 'membership', label: 'Membership (Churn, LTV, Conversions)' },
    { value: 'attendance', label: 'Attendance (Classes, Instructors, Peak Hours)' },
    { value: 'gym', label: 'Gym Performance (Revenue, Members, Ratings)' },
    { value: 'comprehensive', label: 'Comprehensive (All Metrics)' },
  ];

  const allMetrics = [
    'MRR',
    'Revenue by Plan',
    'Payment Success Rate',
    'Churn Rate',
    'Total Members',
    'LTV',
    'Trial Conversions',
    'Classes per Day',
    'Avg Attendance',
    'Instructor Performance',
    'Peak Hours',
    'Gym Revenue',
    'Members Count',
    'Classes Offered',
    'Avg Rating',
  ];

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const daysOfMonth = Array.from({ length: 28 }, (_, i) => (i + 1).toString());

  const filteredReports = reports.filter((report) =>
    report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateReport = () => {
    if (formData.name && formData.recipients) {
      const newReport = {
        id: `SCH-${reports.length + 1}`,
        ...formData,
        recipients: formData.recipients.split(',').map((r) => r.trim()),
        status: 'active',
        createdDate: new Date().toISOString().split('T')[0],
        lastSent: null,
        nextSend: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      };
      setReports([...reports, newReport]);
      setShowCreateModal(false);
      resetForm();
    }
  };

  const handleEditReport = () => {
    if (selectedReport && formData.name && formData.recipients) {
      setReports(
        reports.map((r) =>
          r.id === selectedReport.id
            ? {
                ...r,
                ...formData,
                recipients: formData.recipients.split(',').map((c) => c.trim()),
              }
            : r
        )
      );
      setShowEditModal(false);
      resetForm();
      setSelectedReport(null);
    }
  };

  const handleToggleStatus = (reportId) => {
    setReports(
      reports.map((r) =>
        r.id === reportId
          ? { ...r, status: r.status === 'active' ? 'paused' : 'active' }
          : r
      )
    );
  };

  const handleDeleteReport = (reportId) => {
    setReports(reports.filter((r) => r.id !== reportId));
  };

  const handleOpenEditModal = (report) => {
    setSelectedReport(report);
    setFormData({
      name: report.name,
      description: report.description,
      frequency: report.frequency,
      dayOfWeek: report.dayOfWeek || 'Monday',
      dayOfMonth: report.dayOfMonth || '1',
      time: report.time.slice(0, 5),
      recipients: report.recipients.join(', '),
      template: report.template,
      metrics: report.metrics,
    });
    setShowEditModal(true);
  };

  const handleOpenPreviewModal = (report) => {
    setSelectedReport(report);
    setShowPreviewModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      frequency: 'weekly',
      dayOfWeek: 'Monday',
      dayOfMonth: '1',
      time: '09:00',
      recipients: '',
      template: 'financial',
      metrics: [],
    });
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
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">Scheduled Reports</h1>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => {
                  resetForm();
                  setShowCreateModal(true);
                }}
                className="px-4 py-2 rounded-lg font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <Plus size={18} />
                Create Report
              </motion.button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 md:grid-cols-3 gap-4">
              <div className={`${isDark ? 'bg-gray-700' : 'bg-blue-50'} p-3 rounded-lg`}>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Scheduled</p>
                <p className="text-2xl font-bold">{reports.length}</p>
              </div>
              <div className={`${isDark ? 'bg-gray-700' : 'bg-green-50'} p-3 rounded-lg`}>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Active</p>
                <p className="text-2xl font-bold text-green-600">
                  {reports.filter((r) => r.status === 'active').length}
                </p>
              </div>
              <div className={`${isDark ? 'bg-gray-700' : 'bg-orange-50'} p-3 rounded-lg`}>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Paused</p>
                <p className="text-2xl font-bold text-orange-600">
                  {reports.filter((r) => r.status === 'paused').length}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search */}
        <div className="p-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-4 mb-6`}
          >
            <div className="relative">
              <Search className={`absolute left-3 top-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} size={18} />
              <input
                type="text"
                placeholder="Search reports..."
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

          {/* Reports List */}
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6 hover:shadow-lg transition-shadow`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-lg">{report.name}</h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          report.status === 'active'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                        }`}
                      >
                        {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                      </span>
                    </div>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {report.description}
                    </p>
                  </div>

                  {/* Status Toggle */}
                  <label className="flex items-center gap-2 cursor-pointer ml-4">
                    <input
                      type="checkbox"
                      checked={report.status === 'active'}
                      onChange={() => handleToggleStatus(report.id)}
                      className="w-4 h-4"
                    />
                  </label>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4 pb-4 border-b border-gray-700">
                  <div>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Frequency</p>
                    <p className="font-semibold text-sm capitalize">
                      {report.frequency}
                      {report.frequency === 'weekly' && ` (${report.dayOfWeek})`}
                      {report.frequency === 'monthly' && ` (${report.dayOfMonth}${getOrdinalSuffix(parseInt(report.dayOfMonth))})`}
                    </p>
                  </div>
                  <div>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Time</p>
                    <p className="font-semibold text-sm">{report.time}</p>
                  </div>
                  <div>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Recipients</p>
                    <p className="font-semibold text-sm">{report.recipients.length}</p>
                  </div>
                  <div>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Last Sent</p>
                    <p className="font-semibold text-sm">
                      {report.lastSent ? new Date(report.lastSent).toLocaleDateString() : 'Never'}
                    </p>
                  </div>
                  <div>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Next Send</p>
                    <p className="font-semibold text-sm">
                      {report.nextSend ? new Date(report.nextSend).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Metrics Tags */}
                <div className="mb-4">
                  <p className={`text-xs font-semibold mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Metrics Included ({report.metrics.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {report.metrics.slice(0, 5).map((metric) => (
                      <span
                        key={metric}
                        className={`${isDark ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'} px-2 py-1 rounded text-xs`}
                      >
                        {metric}
                      </span>
                    ))}
                    {report.metrics.length > 5 && (
                      <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'} px-2 py-1 text-xs`}>
                        +{report.metrics.length - 5} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-wrap">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={() => handleOpenPreviewModal(report)}
                    className={`px-3 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors ${
                      isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <Eye size={14} />
                    Preview
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={() => handleOpenEditModal(report)}
                    className={`px-3 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors ${
                      isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <Edit2 size={14} />
                    Edit
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    className={`px-3 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors ${
                      isDark ? 'bg-blue-900 hover:bg-blue-800' : 'bg-blue-100 hover:bg-blue-200'
                    }`}
                  >
                    <Mail size={14} />
                    Send Now
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={() => handleDeleteReport(report.id)}
                    className={`px-3 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors text-red-600 ${
                      isDark ? 'bg-red-900/20 hover:bg-red-900/40' : 'bg-red-100 hover:bg-red-200'
                    }`}
                  >
                    <Trash2 size={14} />
                    Delete
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredReports.length === 0 && (
            <div className="text-center py-12">
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                No scheduled reports found
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Create Report Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg max-w-2xl w-full p-6 my-8`}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">Create Scheduled Report</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className={`p-1 rounded ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4 max-h-[70vh] overflow-y-auto pb-6">
                {/* Name & Description */}
                <div>
                  <label className="block text-sm font-medium mb-2">Report Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Weekly Financial Summary"
                    className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of what this report includes"
                    className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                  />
                </div>

                {/* Frequency Selection */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Frequency *</label>
                    <select
                      value={formData.frequency}
                      onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                      className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                    >
                      {frequencyOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {formData.frequency === 'weekly' && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Day of Week</label>
                      <select
                        value={formData.dayOfWeek}
                        onChange={(e) => setFormData({ ...formData, dayOfWeek: e.target.value })}
                        className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                      >
                        {daysOfWeek.map((day) => (
                          <option key={day} value={day}>
                            {day}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {formData.frequency === 'monthly' && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Day of Month</label>
                      <select
                        value={formData.dayOfMonth}
                        onChange={(e) => setFormData({ ...formData, dayOfMonth: e.target.value })}
                        className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                      >
                        {daysOfMonth.map((day) => (
                          <option key={day} value={day}>
                            {day}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium mb-2">Time</label>
                    <input
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                    />
                  </div>
                </div>

                {/* Recipients */}
                <div>
                  <label className="block text-sm font-medium mb-2">Recipients * (comma-separated emails)</label>
                  <textarea
                    value={formData.recipients}
                    onChange={(e) => setFormData({ ...formData, recipients: e.target.value })}
                    placeholder="admin@crunchfit.com, finance@crunchfit.com"
                    className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                    rows="3"
                  />
                </div>

                {/* Template */}
                <div>
                  <label className="block text-sm font-medium mb-2">Report Template</label>
                  <select
                    value={formData.template}
                    onChange={(e) => setFormData({ ...formData, template: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                  >
                    {templateOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Metrics Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2">Metrics to Include</label>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border rounded-lg border-gray-700">
                    {allMetrics.map((metric) => (
                      <label key={metric} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.metrics.includes(metric)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({ ...formData, metrics: [...formData.metrics, metric] });
                            } else {
                              setFormData({
                                ...formData,
                                metrics: formData.metrics.filter((m) => m !== metric),
                              });
                            }
                          }}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">{metric}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-6 border-t border-gray-700">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateReport}
                  disabled={!formData.name || !formData.recipients}
                  className="flex-1 px-4 py-2 rounded-lg font-medium bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 transition-colors"
                >
                  Create Report
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Edit Report Modal */}
        {showEditModal && selectedReport && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg max-w-2xl w-full p-6 my-8`}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">Edit Scheduled Report</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className={`p-1 rounded ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4 max-h-[70vh] overflow-y-auto pb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Report Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Frequency</label>
                    <select
                      value={formData.frequency}
                      onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                      className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                    >
                      {frequencyOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {formData.frequency === 'weekly' && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Day of Week</label>
                      <select
                        value={formData.dayOfWeek}
                        onChange={(e) => setFormData({ ...formData, dayOfWeek: e.target.value })}
                        className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                      >
                        {daysOfWeek.map((day) => (
                          <option key={day} value={day}>
                            {day}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {formData.frequency === 'monthly' && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Day of Month</label>
                      <select
                        value={formData.dayOfMonth}
                        onChange={(e) => setFormData({ ...formData, dayOfMonth: e.target.value })}
                        className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                      >
                        {daysOfMonth.map((day) => (
                          <option key={day} value={day}>
                            {day}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium mb-2">Time</label>
                    <input
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Recipients *</label>
                  <textarea
                    value={formData.recipients}
                    onChange={(e) => setFormData({ ...formData, recipients: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                    rows="3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Report Template</label>
                  <select
                    value={formData.template}
                    onChange={(e) => setFormData({ ...formData, template: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                  >
                    {templateOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Metrics to Include</label>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border rounded-lg border-gray-700">
                    {allMetrics.map((metric) => (
                      <label key={metric} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.metrics.includes(metric)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({ ...formData, metrics: [...formData.metrics, metric] });
                            } else {
                              setFormData({
                                ...formData,
                                metrics: formData.metrics.filter((m) => m !== metric),
                              });
                            }
                          }}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">{metric}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-6 border-t border-gray-700">
                <button
                  onClick={() => setShowEditModal(false)}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditReport}
                  disabled={!formData.name || !formData.recipients}
                  className="flex-1 px-4 py-2 rounded-lg font-medium bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Preview Modal */}
        {showPreviewModal && selectedReport && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg max-w-2xl w-full p-6 my-8`}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">Email Preview: {selectedReport.name}</h3>
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className={`p-1 rounded ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                >
                  <X size={20} />
                </button>
              </div>

              <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} p-6 rounded-lg mb-4 max-h-[60vh] overflow-y-auto`}>
                {/* Email Template Preview */}
                <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg`}>
                  <h2 className="text-2xl font-bold mb-2">{selectedReport.name}</h2>
                  <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {selectedReport.description}
                  </p>

                  <div className="mb-4 pb-4 border-b border-gray-700">
                    <p className="text-sm font-semibold mb-2">Report Period: March 1-31, 2024</p>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Generated for: {selectedReport.recipients.join(', ')}
                    </p>
                  </div>

                  <h3 className="font-semibold text-lg mb-3">Included Metrics</h3>
                  <div className="space-y-2 mb-4">
                    {selectedReport.metrics.map((metric) => (
                      <div key={metric} className={`${isDark ? 'bg-gray-700' : 'bg-gray-100'} p-3 rounded flex items-center`}>
                        <CheckCircle size={16} className="text-green-500 mr-2" />
                        <span className="text-sm">{metric}</span>
                      </div>
                    ))}
                  </div>

                  <p className={`text-xs mt-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    [Charts and detailed data visualizations will be embedded here]
                  </p>

                  <div className={`${isDark ? 'border-gray-700' : 'border-gray-300'} border-t mt-4 pt-4`}>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      This is an automated report from CrunchFit Pro. Do not reply to this email.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  Close
                </button>
                <button className="flex-1 px-4 py-2 rounded-lg font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors flex items-center justify-center gap-2">
                  <Mail size={16} />
                  Send Test Email
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

function getOrdinalSuffix(num) {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) {
    return 'st';
  }
  if (j === 2 && k !== 12) {
    return 'nd';
  }
  if (j === 3 && k !== 13) {
    return 'rd';
  }
  return 'th';
}

export default ScheduledReportsPage;
