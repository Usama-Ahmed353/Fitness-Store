import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trash2,
  AlertTriangle,
  Bell,
  Check,
  X,
  Mail,
  Calendar,
  Send,
  MessageSquare,
} from 'lucide-react';
import { ThemeContext } from '../../contexts/ThemeContext';

// Mock classes with member details
const mockClassesWithMembers = [
  {
    id: 1,
    name: 'Morning Cardio',
    date: '2026-03-24',
    time: '06:00',
    memberCount: 28,
    members: [
      { id: 1, name: 'Alice Cooper', email: 'alice@email.com' },
      { id: 2, name: 'Bob Johnson', email: 'bob@email.com' },
      { id: 3, name: 'Carol Davis', email: 'carol@email.com' },
    ],
    waitlistCount: 2,
  },
  {
    id: 2,
    name: 'Strength Training',
    date: '2026-03-25',
    time: '17:00',
    memberCount: 18,
    members: [
      { id: 4, name: 'David Miller', email: 'david@email.com' },
      { id: 5, name: 'Emma Wilson', email: 'emma@email.com' },
    ],
    waitlistCount: 0,
  },
];

const ClassBulkOperations = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const [classes, setClasses] = useState(mockClassesWithMembers);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedClassForCancel, setSelectedClassForCancel] = useState(null);
  const [showNotificationPreview, setShowNotificationPreview] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [notifyOptions, setNotifyOptions] = useState({
    email: true,
    push: true,
    sms: false,
  });
  const [refundPolicy, setRefundPolicy] = useState('full');
  const [supportMessage, setSupportMessage] = useState('');

  const handleCancelClick = (classItem) => {
    setSelectedClassForCancel(classItem);
    setCancelReason('');
    setSupportMessage('');
    setShowCancelModal(true);
  };

  const handleConfirmCancel = () => {
    if (!cancelReason.trim()) {
      alert('Please provide a cancellation reason');
      return;
    }

    console.log('Cancelling class:', selectedClassForCancel);
    console.log('Reason:', cancelReason);
    console.log('Refund policy:', refundPolicy);
    console.log('Notifications:', notifyOptions);

    setClasses((prev) => prev.filter((c) => c.id !== selectedClassForCancel.id));
    setShowCancelModal(false);
    alert(`Class cancelled. ${selectedClassForCancel.memberCount + selectedClassForCancel.waitlistCount} members notified.`);
  };

  return (
    <div className={`${isDark ? 'bg-gray-900' : 'bg-gray-50'} p-6 rounded-lg`}>
      {/* Header */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-2">Class Operations</h3>
        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Bulk actions, cancellations, and member notifications
        </p>
      </div>

      {/* Operations List */}
      <div className="space-y-4">
        {classes.map((classItem, idx) => (
          <motion.div
            key={classItem.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-bold">{classItem.name}</h4>
                <div className="flex gap-4 text-sm mt-2">
                  <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {new Date(classItem.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      weekday: 'short',
                    })}
                  </span>
                  <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {classItem.time}
                  </span>
                </div>
              </div>

              {/* Status Pills */}
              <div className="flex gap-2">
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                  isDark ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'
                }`}>
                  {classItem.memberCount} members
                </div>
                {classItem.waitlistCount > 0 && (
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                    isDark ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {classItem.waitlistCount} waitlist
                  </div>
                )}
              </div>
            </div>

            {/* Member Preview */}
            <div className={`mb-4 px-4 py-2 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <p className="text-xs font-semibold mb-2">Booked Members ({classItem.members.length}):</p>
              <div className="space-y-1">
                {classItem.members.map((member) => (
                  <p key={member.id} className="text-xs">
                    • {member.name} ({member.email})
                  </p>
                ))}
                {classItem.members.length < classItem.memberCount && (
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    +{classItem.memberCount - classItem.members.length} more members
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => handleCancelClick(classItem)}
                className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-semibold flex items-center justify-center gap-2"
              >
                <Trash2 size={16} />
                Cancel Class
              </button>
              <button
                className={`flex-1 py-2 px-4 rounded-lg transition-colors font-semibold flex items-center justify-center gap-2 ${
                  isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                <Bell size={16} />
                Send Announcement
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Cancel Class Modal */}
      <AnimatePresence>
        {showCancelModal && selectedClassForCancel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowCancelModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg p-8 max-w-2xl w-full max-h-96 overflow-y-auto`}
            >
              {/* Header with warning */}
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 rounded-lg bg-red-100">
                  <AlertTriangle size={24} className="text-red-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Cancel Class</h3>
                  <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {selectedClassForCancel.name} — {selectedClassForCancel.date} at{' '}
                    {selectedClassForCancel.time}
                  </p>
                </div>
              </div>

              {/* Impact Warning */}
              <div className={`p-4 rounded-lg mb-6 flex gap-3 ${
                isDark ? 'bg-red-900 border border-red-700' : 'bg-red-50 border border-red-200'
              }`}>
                <AlertTriangle size={20} className={isDark ? 'text-red-400' : 'text-red-600'} />
                <div className="text-sm">
                  <p className={`font-bold ${isDark ? 'text-red-300' : 'text-red-700'}`}>Impact:</p>
                  <ul className={`text-xs mt-1 space-y-1 ${isDark ? 'text-red-200' : 'text-red-600'}`}>
                    <li>• {selectedClassForCancel.memberCount} members will be notified</li>
                    {selectedClassForCancel.waitlistCount > 0 && (
                      <li>• {selectedClassForCancel.waitlistCount} waitlisted members will be notified</li>
                    )}
                    <li>• All bookings will be cancelled</li>
                    <li>• Refunds will be issued based on policy</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                {/* Cancellation Reason */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Reason for Cancellation *
                  </label>
                  <select
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select a reason</option>
                    <option value="instructor-unavailable">Instructor unavailable</option>
                    <option value="facility-issue">Facility issue</option>
                    <option value="low-attendance">Low attendance expected</option>
                    <option value="emergency">Emergency cancellation</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Support Message */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Support Message to Members</label>
                  <textarea
                    value={supportMessage}
                    onChange={(e) => setSupportMessage(e.target.value)}
                    placeholder="Brief explanation to send to members..."
                    rows="3"
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300'
                    }`}
                  />
                </div>

                {/* Refund Policy */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Refund Policy</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="refund"
                        value="full"
                        checked={refundPolicy === 'full'}
                        onChange={(e) => setRefundPolicy(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Full refund</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="refund"
                        value="credit"
                        checked={refundPolicy === 'credit'}
                        onChange={(e) => setRefundPolicy(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Credit to account</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="refund"
                        value="reschedule"
                        checked={refundPolicy === 'reschedule'}
                        onChange={(e) => setRefundPolicy(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Auto-schedule for alternative class</span>
                    </label>
                  </div>
                </div>

                {/* Notification Channels */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Notify via:</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={notifyOptions.email}
                        onChange={(e) =>
                          setNotifyOptions((prev) => ({ ...prev, email: e.target.checked }))
                        }
                        className="w-4 h-4"
                      />
                      <Mail size={16} />
                      <span className="text-sm">Email</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={notifyOptions.push}
                        onChange={(e) =>
                          setNotifyOptions((prev) => ({ ...prev, push: e.target.checked }))
                        }
                        className="w-4 h-4"
                      />
                      <Bell size={16} />
                      <span className="text-sm">Push notification</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={notifyOptions.sms}
                        onChange={(e) =>
                          setNotifyOptions((prev) => ({ ...prev, sms: e.target.checked }))
                        }
                        className="w-4 h-4"
                      />
                      <MessageSquare size={16} />
                      <span className="text-sm">SMS</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Notification Preview */}
              {(notifyOptions.email || notifyOptions.push) && (
                <div className={`p-4 rounded-lg mb-6 ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <p className="text-xs font-bold mb-2">Notification Preview:</p>
                  <div className={`p-3 rounded border-l-4 ${
                    isDark ? 'border-blue-500 bg-gray-800' : 'border-blue-500 bg-blue-50'
                  }`}>
                    <p className="text-xs font-bold mb-1">Class Cancelled: {selectedClassForCancel.name}</p>
                    <p className="text-xs mb-2">
                      We regret to inform you that the {selectedClassForCancel.name} class on{' '}
                      {new Date(selectedClassForCancel.date).toLocaleDateString()} at{' '}
                      {selectedClassForCancel.time} has been cancelled.
                    </p>
                    <p className="text-xs mb-2">
                      <strong>Reason:</strong> {cancelReason || 'TBD'}
                    </p>
                    {supportMessage && (
                      <p className="text-xs mb-2">
                        <strong>Message:</strong> {supportMessage}
                      </p>
                    )}
                    <p className="text-xs font-bold">
                      <strong>Refund:</strong> {refundPolicy === 'full' ? 'Full refund' : refundPolicy === 'credit' ? 'Credit to your account' : 'Will be rescheduled'}
                    </p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
                    isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  Keep Class
                </button>
                <button
                  onClick={handleConfirmCancel}
                  className="flex-1 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center justify-center gap-2"
                >
                  <Trash2 size={18} />
                  Confirm Cancellation
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClassBulkOperations;
