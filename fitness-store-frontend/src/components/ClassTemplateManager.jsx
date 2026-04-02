import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Copy,
  Plus,
  Trash2,
  Edit,
  Calendar,
  Clock,
  Users,
  X,
  Save,
  AlertCircle,
} from 'lucide-react';
import { ThemeContext } from '../../contexts/ThemeContext';

// Mock template data
const mockTemplates = [
  {
    id: 'tpl-1',
    name: 'Morning Cardio',
    category: 'cardio',
    instructor: 'Sarah Johnson',
    time: '06:00',
    duration: 45,
    capacity: 30,
    room: 'Studio A',
    description: 'High-energy cardio kickboxing class',
    equipment: ['Punching Bag', 'Step Platform'],
    daysOfWeek: [1, 3, 5], // Mon, Wed, Fri
    createdAt: '2026-01-15',
    usageCount: 52,
    color: 'red',
  },
  {
    id: 'tpl-2',
    name: 'Strength Training',
    category: 'strength',
    instructor: 'Mike Chen',
    time: '17:00',
    duration: 60,
    capacity: 20,
    room: 'Weight Room',
    description: 'Full body strength training',
    equipment: ['Dumbbells', 'Barbells', 'Plates'],
    daysOfWeek: [0, 2, 4, 6], // Every day except Tuesday
    createdAt: '2026-02-01',
    usageCount: 78,
    color: 'blue',
  },
  {
    id: 'tpl-3',
    name: 'Evening Yoga',
    category: 'yoga',
    instructor: 'Emma Wilson',
    time: '18:00',
    duration: 90,
    capacity: 25,
    room: 'Studio B',
    description: 'Relaxing yoga & meditation',
    equipment: ['Yoga Mats', 'Blocks', 'Straps'],
    daysOfWeek: [1, 3, 5], // Mon, Wed, Fri
    createdAt: '2026-01-20',
    usageCount: 31,
    color: 'purple',
  },
];

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const ClassTemplateManager = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const [templates, setTemplates] = useState(mockTemplates);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [applyConfig, setApplyConfig] = useState({
    startDate: '',
    endDate: '',
    frequency: 'weekly',
  });

  const [formData, setFormData] = useState({
    name: '',
    category: 'cardio',
    instructor: 'Sarah Johnson',
    time: '09:00',
    duration: '60',
    capacity: '20',
    room: '',
    description: '',
    equipment: '',
    daysOfWeek: [],
  });

  const [errors, setErrors] = useState({});

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleDayToggle = (day) => {
    setFormData((prev) => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek.includes(day)
        ? prev.daysOfWeek.filter((d) => d !== day)
        : [...prev.daysOfWeek, day].sort(),
    }));
  };

  const handleSaveTemplate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Template name required';
    if (!formData.room.trim()) newErrors.room = 'Room required';
    if (formData.daysOfWeek.length === 0) newErrors.daysOfWeek = 'Select at least one day';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (showEditModal && selectedTemplate) {
      // Update
      setTemplates((prev) =>
        prev.map((t) =>
          t.id === selectedTemplate.id
            ? { ...t, ...formData, duration: parseInt(formData.duration) }
            : t
        )
      );
    } else {
      // Create
      const newTemplate = {
        id: `tpl-${Date.now()}`,
        ...formData,
        duration: parseInt(formData.duration),
        capacity: parseInt(formData.capacity),
        createdAt: new Date().toISOString().split('T')[0],
        usageCount: 0,
        color: 'blue',
      };
      setTemplates((prev) => [...prev, newTemplate]);
    }

    resetForm();
  };

  const handleDeleteTemplate = (id) => {
    if (confirm('Delete this template?')) {
      setTemplates((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const handleApplyTemplate = (template) => {
    setSelectedTemplate(template);
    setApplyConfig({
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      frequency: 'weekly',
    });
    setShowApplyModal(true);
  };

  const handleConfirmApply = () => {
    if (!applyConfig.startDate) {
      alert('Select a start date');
      return;
    }

    console.log('Applying template:', selectedTemplate.name, 'with config:', applyConfig);
    // This would create multiple class instances based on the template
    alert(`Created ${selectedTemplate.daysOfWeek.length} recurring classes from template!`);
    setShowApplyModal(false);
  };

  const handleEditTemplate = (template) => {
    setSelectedTemplate(template);
    setFormData({
      name: template.name,
      category: template.category,
      instructor: template.instructor,
      time: template.time,
      duration: template.duration.toString(),
      capacity: template.capacity.toString(),
      room: template.room,
      description: template.description,
      equipment: template.equipment.join(', '),
      daysOfWeek: [...template.daysOfWeek],
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'cardio',
      instructor: 'Sarah Johnson',
      time: '09:00',
      duration: '60',
      capacity: '20',
      room: '',
      description: '',
      equipment: '',
      daysOfWeek: [],
    });
    setErrors({});
    setShowCreateModal(false);
    setShowEditModal(false);
    setSelectedTemplate(null);
  };

  return (
    <div className={`${isDark ? 'bg-gray-900' : 'bg-gray-50'} p-6 rounded-lg`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-bold mb-2">Class Templates</h3>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Save and reuse recurring class schedules
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center gap-2"
        >
          <Plus size={20} />
          Create Template
        </button>
      </div>

      {/* Templates Grid */}
      {templates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {templates.map((template) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6 hover:shadow-lg transition-shadow`}
            >
              {/* Template Header */}
              <div className="mb-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-lg font-bold">{template.name}</h4>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {template.instructor}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-bold capitalize ${
                    template.color === 'red' ? 'bg-red-100 text-red-700' :
                    template.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                    template.color === 'purple' ? 'bg-purple-100 text-purple-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {template.category}
                  </span>
                </div>
              </div>

              {/* Template Details */}
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-gray-500" />
                  <span>{template.time} · {template.duration} min</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle size={16} className="text-gray-500" />
                  <span>{template.room}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-gray-500" />
                  <span>Max {template.capacity} members</span>
                </div>
              </div>

              {/* Days of week */}
              <div className="mb-4">
                <p className="text-xs font-semibold mb-2">Repeats on:</p>
                <div className="flex gap-1 flex-wrap">
                  {dayNames.map((day, idx) => (
                    <span
                      key={idx}
                      className={`text-xs font-bold px-2 py-1 rounded ${
                        template.daysOfWeek.includes(idx)
                          ? 'bg-blue-600 text-white'
                          : isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {day.slice(0, 1)}
                    </span>
                  ))}
                </div>
              </div>

              {/* Usage Stats */}
              <div className={`p-3 rounded mb-4 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <p className="text-xs font-bold">Used {template.usageCount} times</p>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Created {new Date(template.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleApplyTemplate(template)}
                  className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-sm flex items-center justify-center gap-1"
                >
                  <Copy size={16} />
                  Apply
                </button>
                <button
                  onClick={() => handleEditTemplate(template)}
                  className={`flex-1 py-2 rounded-lg transition-colors font-semibold text-sm flex items-center justify-center gap-1 ${
                    isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  <Edit size={16} />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteTemplate(template.id)}
                  className="py-2 px-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg p-12 text-center border ${
            isDark ? 'border-gray-700' : 'border-gray-200'
          }`}
        >
          <Copy size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="text-lg font-semibold mb-2">No Templates Yet</p>
          <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Create your first template to start scheduling recurring classes
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
          >
            Create Template
          </button>
        </motion.div>
      )}

      {/* Create/Edit Template Modal */}
      <AnimatePresence>
        {(showCreateModal || showEditModal) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={resetForm}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg p-8 max-w-2xl w-full max-h-96 overflow-y-auto`}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">
                  {showEditModal ? 'Edit Template' : 'Create Template'}
                </h3>
                <button
                  onClick={resetForm}
                  className={`p-2 rounded-lg transition-colors ${
                    isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Name */}
                <div className="col-span-2">
                  <label className="block text-sm font-semibold mb-2">Template Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    placeholder="e.g., Morning Yoga"
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300'
                    }`}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300'
                    }`}
                  >
                    <option value="cardio">Cardio</option>
                    <option value="strength">Strength</option>
                    <option value="yoga">Yoga</option>
                    <option value="pilates">Pilates</option>
                  </select>
                </div>

                {/* Instructor */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Instructor</label>
                  <select
                    name="instructor"
                    value={formData.instructor}
                    onChange={handleFormChange}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300'
                    }`}
                  >
                    <option value="Sarah Johnson">Sarah Johnson</option>
                    <option value="Mike Chen">Mike Chen</option>
                    <option value="Emma Wilson">Emma Wilson</option>
                  </select>
                </div>

                {/* Time */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Time</label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleFormChange}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300'
                    }`}
                  />
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Duration (min)</label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleFormChange}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300'
                    }`}
                  />
                </div>

                {/* Capacity */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Capacity</label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleFormChange}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300'
                    }`}
                  />
                </div>

                {/* Room */}
                <div className="col-span-2">
                  <label className="block text-sm font-semibold mb-2">Room *</label>
                  <input
                    type="text"
                    name="room"
                    value={formData.room}
                    onChange={handleFormChange}
                    placeholder="Studio A"
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300'
                    }`}
                  />
                  {errors.room && <p className="text-red-500 text-xs mt-1">{errors.room}</p>}
                </div>

                {/* Days of Week */}
                <div className="col-span-2">
                  <label className="block text-sm font-semibold mb-2">Repeats on (select days) *</label>
                  <div className="grid grid-cols-7 gap-2">
                    {dayNames.map((day, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleDayToggle(idx)}
                        className={`py-2 px-1 rounded font-bold text-xs transition-colors ${
                          formData.daysOfWeek.includes(idx)
                            ? 'bg-blue-600 text-white'
                            : isDark
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {day.slice(0, 1)}
                      </button>
                    ))}
                  </div>
                  {errors.daysOfWeek && <p className="text-red-500 text-xs mt-1">{errors.daysOfWeek}</p>}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={resetForm}
                  className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
                    isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveTemplate}
                  className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center gap-2"
                >
                  <Save size={18} />
                  {showEditModal ? 'Update' : 'Create'} Template
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Apply Template Modal */}
      <AnimatePresence>
        {showApplyModal && selectedTemplate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowApplyModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg p-8 max-w-md w-full`}
            >
              <h3 className="text-2xl font-bold mb-6">Apply Template</h3>

              <div className={`p-4 rounded-lg mb-6 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <p className="font-bold">{selectedTemplate.name}</p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Available {selectedTemplate.daysOfWeek.length}× per week
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Start Date *</label>
                  <input
                    type="date"
                    value={applyConfig.startDate}
                    onChange={(e) =>
                      setApplyConfig((prev) => ({ ...prev, startDate: e.target.value }))
                    }
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">End Date (Optional)</label>
                  <input
                    type="date"
                    value={applyConfig.endDate}
                    onChange={(e) =>
                      setApplyConfig((prev) => ({ ...prev, endDate: e.target.value }))
                    }
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300'
                    }`}
                  />
                  <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Leave blank for ongoing
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Frequency</label>
                  <select
                    value={applyConfig.frequency}
                    onChange={(e) =>
                      setApplyConfig((prev) => ({ ...prev, frequency: e.target.value }))
                    }
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300'
                    }`}
                  >
                    <option value="weekly">Every week</option>
                    <option value="biweekly">Every 2 weeks</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>

              {/* Info */}
              <div className={`p-3 rounded-lg mb-6 flex gap-2 ${isDark ? 'bg-blue-900' : 'bg-blue-50'}`}>
                <AlertCircle size={16} className={`flex-shrink-0 ${isDark ? 'text-blue-300' : 'text-blue-600'}`} />
                <p className={`text-xs ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>
                  This will create multiple class instances. You can edit each individually.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowApplyModal(false)}
                  className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
                    isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmApply}
                  className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center gap-2"
                >
                  <Copy size={16} />
                  Apply
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClassTemplateManager;
