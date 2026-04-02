import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Check,
  X,
  Bell,
  Clock,
  AlertCircle,
  Send,
  Trash2,
  UserCheck,
  Mail,
  MessageSquare,
} from 'lucide-react';
import { ThemeContext } from '../../contexts/ThemeContext';

// Mock waitlist data
const mockWaitlists = {
  1: {
    classId: 1,
    className: 'Morning Cardio',
    capacity: 30,
    booked: 28,
    waitlist: [
      {
        id: 101,
        name: 'John Smith',
        email: 'john@email.com',
        phone: '+1-555-0101',
        joinedAt: '2026-03-23T14:30:00',
        position: 1,
        notified: false,
      },
      {
        id: 102,
        name: 'Lisa Anderson',
        email: 'lisa@email.com',
        phone: '+1-555-0102',
        joinedAt: '2026-03-23T15:45:00',
        position: 2,
        notified: false,
      },
    ],
  },
};

const ClassWaitlistManager = ({ classId = 1 }) => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const [waitlistData, setWaitlistData] = useState(mockWaitlists[1]);
  const [showManageModal, setShowManageModal] = useState(false);
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [autoPromoteEnabled, setAutoPromoteEnabled] = useState(true);
  const [notificationTemplate, setNotificationTemplate] = useState('default');

  const availableSlots = waitlistData.capacity - waitlistData.booked;

  const handlePromoteMember = (memberId) => {
    console.log('Promoting member:', memberId);
    // Remove from waitlist

    setWaitlistData((prev) => ({
      ...prev,
      waitlist: prev.waitlist
        .filter((m) => m.id !== memberId)
        .map((m, idx) => ({ ...m, position: idx + 1 })),
    }));

    // Show notification
    alert(`Member promoted and notification sent!`);
  };

  const handleRemoveFromWaitlist = (memberId) => {
    setWaitlistData((prev) => ({
      ...prev,
      waitlist: prev.waitlist
        .filter((m) => m.id !== memberId)
        .map((m, idx) => ({ ...m, position: idx + 1 })),
    }));
  };

  const handleSendNotification = (memberId) => {
    setSelectedMember(
      waitlistData.waitlist.find((m) => m.id === memberId)
    );
    setShowNotifyModal(true);
  };

  const handleSendCustomNotification = () => {
    if (!selectedMember) return;

    console.log('Sending notification to:', selectedMember.email);
    // Update notification status
    setWaitlistData((prev) => ({
      ...prev,
      waitlist: prev.waitlist.map((m) =>
        m.id === selectedMember.id ? { ...m, notified: true } : m
      ),
    }));

    setShowNotifyModal(false);
    alert('Notification sent!');
  };

  return (
    <div className={`${isDark ? 'bg-gray-900' : 'bg-gray-50'} p-6 rounded-lg`}>
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-2">Waitlist Management</h3>
        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {waitlistData.className} — {waitlistData.waitlist.length} members waiting
        </p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-4`}
        >
          <p className={`text-xs font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Available Slots
          </p>
          <p className="text-2xl font-bold mt-1">{availableSlots}</p>
          <p className={`text-xs mt-2 ${availableSlots > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {availableSlots > 0 ? '✓ Can auto-promote' : 'Waitlist pending'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-4`}
        >
          <p className={`text-xs font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Waitlist Length
          </p>
          <p className="text-2xl font-bold mt-1">{waitlistData.waitlist.length}</p>
          <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Position {waitlistData.waitlist.length > 0 ? '1–' + waitlistData.waitlist.length : '—'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-4`}
        >
          <p className={`text-xs font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Auto-Promote
          </p>
          <div className="mt-2 flex items-center gap-2">
            <input
              type="checkbox"
              checked={autoPromoteEnabled}
              onChange={(e) => setAutoPromoteEnabled(e.target.checked)}
              className="w-5 h-5 rounded"
            />
            <span className="text-sm font-semibold">
              {autoPromoteEnabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>
          <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Auto-fill on cancellation
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`${isDark ? 'bg-blue-900 border-blue-700' : 'bg-blue-50 border-blue-300'} rounded-lg border p-4`}
        >
          <p className={`text-xs font-semibold ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>
            Notified
          </p>
          <p className="text-2xl font-bold mt-1">
            {waitlistData.waitlist.filter((m) => m.notified).length}/{waitlistData.waitlist.length}
          </p>
          <p className={`text-xs mt-2 ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>
            {waitlistData.waitlist.filter((m) => !m.notified).length} pending
          </p>
        </motion.div>
      </div>

      {/* Waitlist Table */}
      {waitlistData.waitlist.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg overflow-hidden border ${
            isDark ? 'border-gray-700' : 'border-gray-200'
          }`}
        >
          <div className={`overflow-x-auto`}>
            <table className="w-full">
              <thead className={`${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold">Position</th>
                  <th className="px-6 py-3 text-left text-xs font-bold">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-bold">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-bold">Joined</th>
                  <th className="px-6 py-3 text-left text-xs font-bold">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {waitlistData.waitlist.map((member, idx) => (
                  <motion.tr
                    key={member.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`border-t ${
                      isDark ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'
                    } transition-colors`}
                  >
                    <td className="px-6 py-4 font-bold">#{member.position}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold">{member.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        <p>{member.email}</p>
                        <p>{member.phone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {new Date(member.joinedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          member.notified
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {member.notified ? 'Notified' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {availableSlots > 0 && (
                          <button
                            onClick={() => handlePromoteMember(member.id)}
                            title="Promote to booking"
                            className="p-2 rounded-lg bg-green-600 hover:bg-green-700 text-white transition-colors"
                          >
                            <UserCheck size={16} />
                          </button>
                        )}
                        {!member.notified && (
                          <button
                            onClick={() => handleSendNotification(member.id)}
                            title="Send notification"
                            className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                          >
                            <Bell size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => handleRemoveFromWaitlist(member.id)}
                          title="Remove from waitlist"
                          className="p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg p-8 text-center border ${
            isDark ? 'border-gray-700' : 'border-gray-200'
          }`}
        >
          <Users size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="text-lg font-semibold mb-2">No Members on Waitlist</p>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            All available slots are filled!
          </p>
        </motion.div>
      )}

      {/* Notification Modal */}
      <AnimatePresence>
        {showNotifyModal && selectedMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowNotifyModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg p-8 max-w-md w-full`}
            >
              <h3 className="text-xl font-bold mb-4">Notify Member</h3>

              <div className={`p-4 rounded-lg mb-4 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <p className="font-semibold">{selectedMember.name}</p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {selectedMember.email}
                </p>
              </div>

              <div className="space-y-3 mb-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="template"
                    value="default"
                    checked={notificationTemplate === 'default'}
                    onChange={(e) => setNotificationTemplate(e.target.value)}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-semibold text-sm">Slot Available</p>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Notify about available slot in their preferred class
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="template"
                    value="promoted"
                    checked={notificationTemplate === 'promoted'}
                    onChange={(e) => setNotificationTemplate(e.target.value)}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-semibold text-sm">You're Promoted</p>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Confirm that they've been automatically promoted
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="template"
                    value="removed"
                    checked={notificationTemplate === 'removed'}
                    onChange={(e) => setNotificationTemplate(e.target.value)}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-semibold text-sm">Class Details</p>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Send class timing and details reminder
                    </p>
                  </div>
                </label>
              </div>

              {/* Preview */}
              <div className={`p-3 rounded-lg mb-6 ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <p className="text-xs font-bold mb-2">Preview:</p>
                <p className="text-xs leading-relaxed">
                  {notificationTemplate === 'default'
                    ? `Hi ${selectedMember.name}, great news! A spot has opened up in Morning Cardio. Book your seat now!`
                    : notificationTemplate === 'promoted'
                    ? `Hi ${selectedMember.name}, you've been automatically promoted from the waitlist to Morning Cardio. See you there!`
                    : `Hi ${selectedMember.name}, reminder: Morning Cardio is on March 24 at 6:00 AM in Studio A. Don't be late!`}
                </p>
              </div>

              {/* Notification channels */}
              <div className="space-y-2 mb-6">
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                  <Mail size={16} />
                  <span className="text-sm font-semibold">Email</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                  <Bell size={16} />
                  <span className="text-sm font-semibold">Push Notification</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4 rounded" />
                  <MessageSquare size={16} />
                  <span className="text-sm font-semibold">SMS</span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowNotifyModal(false)}
                  className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
                    isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendCustomNotification}
                  className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2"
                >
                  <Send size={16} />
                  Send
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClassWaitlistManager;
