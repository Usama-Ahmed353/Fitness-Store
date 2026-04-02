import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Mail,
  Bell,
  MessageSquare,
  Target,
  TrendingUp,
  Eye,
  CheckCircle,
  X,
  Plus,
  Calendar,
  Users,
} from 'lucide-react';
import { ThemeContext } from '../../contexts/ThemeContext';

// Mock at-risk member data
const mockAtRiskCampaigns = [
  {
    id: 'camp-1',
    name: 'Win-Back Friday Feel-Good',
    createdAt: '2026-03-20',
    targetDays: 14,
    memberCount: 12,
    status: 'active',
    channels: ['email', 'push'],
    openRate: 0.42,
    clickRate: 0.18,
    conversionRate: 0.12,
  },
  {
    id: 'camp-2',
    name: '3-Week Absence Alert',
    createdAt: '2026-03-15',
    targetDays: 21,
    memberCount: 8,
    status: 'draft',
    channels: ['email'],
    openRate: null,
    clickRate: null,
    conversionRate: null,
  },
];

const AtRiskMembersManager = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const [campaigns, setCampaigns] = useState(mockAtRiskCampaigns);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    targetDays: '14',
    offer: 'discount10', // discount10, class-pass, free-pt-session, personal-check-in
    channels: { email: true, push: true, sms: false },
    subject: '',
    message: '',
    autoTrigger: true,
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChannelToggle = (channel) => {
    setFormData((prev) => ({
      ...prev,
      channels: {
        ...prev.channels,
        [channel]: !prev.channels[channel],
      },
    }));
  };

  const handleCreateCampaign = () => {
    if (!formData.name.trim()) {
      alert('Campaign name required');
      return;
    }

    const newCampaign = {
      id: `camp-${Date.now()}`,
      name: formData.name,
      createdAt: new Date().toISOString().split('T')[0],
      targetDays: parseInt(formData.targetDays),
      memberCount: 0,
      status: 'draft',
      channels: Object.keys(formData.channels).filter((k) => formData.channels[k]),
      openRate: null,
      clickRate: null,
      conversionRate: null,
    };

    setCampaigns((prev) => [...prev, newCampaign]);
    resetForm();
    alert('Campaign created! Ready to launch.');
  };

  const handleLaunchCampaign = (campaignId) => {
    setCampaigns((prev) =>
      prev.map((c) =>
        c.id === campaignId
          ? {
              ...c,
              status: 'active',
              memberCount: Math.floor(Math.random() * 20) + 5,
              openRate: 0.35 + Math.random() * 0.3,
              clickRate: 0.1 + Math.random() * 0.2,
            }
          : c
      )
    );
    alert('Campaign launched!');
  };

  const handleDeleteCampaign = (campaignId) => {
    if (confirm('Delete this campaign?')) {
      setCampaigns((prev) => prev.filter((c) => c.id !== campaignId));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      targetDays: '14',
      offer: 'discount10',
      channels: { email: true, push: true, sms: false },
      subject: '',
      message: '',
      autoTrigger: true,
    });
    setShowCreateModal(false);
  };

  const handlePreviewCampaign = (campaign) => {
    setSelectedCampaign(campaign);
    setShowPreviewModal(true);
  };

  return (
    <div className={`${isDark ? 'bg-gray-900' : 'bg-gray-50'} p-6 rounded-lg`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-bold mb-2">At-Risk Member Campaigns</h3>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Auto-trigger re-engagement campaigns for inactive members
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2"
        >
          <Plus size={20} />
          Create Campaign
        </button>
      </div>

      {/* Campaign Cards */}
      <div className="space-y-4">
        {campaigns.map((campaign, idx) => (
          <motion.div
            key={campaign.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-bold">{campaign.name}</h4>
                <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Target: No check-in for {campaign.targetDays}+ days
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  campaign.status === 'active'
                    ? 'bg-green-100 text-green-700'
                    : campaign.status === 'draft'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {campaign.status.toUpperCase()}
              </span>
            </div>

            {/* Campaign Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <p className={`text-xs font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Channels
                </p>
                <div className="flex gap-2 mt-2">
                  {campaign.channels.includes('email') && (
                    <Mail size={16} className="text-red-600" />
                  )}
                  {campaign.channels.includes('push') && (
                    <Bell size={16} className="text-blue-600" />
                  )}
                  {campaign.channels.includes('sms') && (
                    <MessageSquare size={16} className="text-green-600" />
                  )}
                </div>
              </div>

              <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <p className={`text-xs font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Members
                </p>
                <p className="text-2xl font-bold mt-1">{campaign.memberCount}</p>
              </div>

              {campaign.status === 'active' && campaign.openRate && (
                <>
                  <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <p className={`text-xs font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Open Rate
                    </p>
                    <p className="text-2xl font-bold mt-1">
                      {Math.round(campaign.openRate * 100)}%
                    </p>
                  </div>

                  <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <p className={`text-xs font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Conversion
                    </p>
                    <p className="text-2xl font-bold mt-1">
                      {Math.round(campaign.conversionRate * 100)}%
                    </p>
                  </div>
                </>
              )}

              {campaign.status === 'draft' && (
                <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <p className={`text-xs font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Created
                  </p>
                  <p className="text-sm font-bold mt-1">{campaign.createdAt}</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => handlePreviewCampaign(campaign)}
                className={`flex-1 py-2 rounded-lg transition-colors font-semibold flex items-center justify-center gap-2 ${
                  isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                <Eye size={16} />
                Preview
              </button>
              {campaign.status === 'draft' && (
                <button
                  onClick={() => handleLaunchCampaign(campaign.id)}
                  className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center gap-2"
                >
                  <Send size={16} />
                  Launch
                </button>
              )}
              {campaign.status === 'active' && (
                <button className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2">
                  <TrendingUp size={16} />
                  View Metrics
                </button>
              )}
              <button
                onClick={() => handleDeleteCampaign(campaign.id)}
                className={`py-2 px-3 rounded-lg transition-colors ${
                  isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Create Campaign Modal */}
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
              <h3 className="text-2xl font-bold mb-6">Create Re-engagement Campaign</h3>

              <div className="space-y-4 mb-6">
                {/* Campaign Name */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Campaign Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    placeholder="e.g., Win Back Lapsed Members"
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300'
                    }`}
                  />
                </div>

                {/* Target Days Inactive */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Target Members Inactive For (days)</label>
                  <select
                    name="targetDays"
                    value={formData.targetDays}
                    onChange={handleFormChange}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300'
                    }`}
                  >
                    <option value="7">7 days</option>
                    <option value="14">14 days</option>
                    <option value="21">21 days</option>
                    <option value="30">30 days</option>
                  </select>
                </div>

                {/* Offer Type */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Re-engagement Offer</label>
                  <select
                    name="offer"
                    value={formData.offer}
                    onChange={handleFormChange}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300'
                    }`}
                  >
                    <option value="discount10">10% Off Next Month</option>
                    <option value="discount20">20% Off Next Month</option>
                    <option value="class-pass">Free Class Pass (5 classes)</option>
                    <option value="free-pt-session">Free PT Consultation</option>
                    <option value="personal-check-in">Personal Check-in Call</option>
                  </select>
                </div>

                {/* Notification Channels */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Send via:</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={formData.channels.email}
                        onChange={() => handleChannelToggle('email')}
                        className="w-4 h-4"
                      />
                      <Mail size={16} />
                      <span className="text-sm">Email</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={formData.channels.push}
                        onChange={() => handleChannelToggle('push')}
                        className="w-4 h-4"
                      />
                      <Bell size={16} />
                      <span className="text-sm">Push Notification</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={formData.channels.sms}
                        onChange={() => handleChannelToggle('sms')}
                        className="w-4 h-4"
                      />
                      <MessageSquare size={16} />
                      <span className="text-sm">SMS</span>
                    </label>
                  </div>
                </div>

                {/* Auto-trigger */}
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.autoTrigger}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        autoTrigger: e.target.checked,
                      }))
                    }
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-semibold">
                    Auto-trigger when members become inactive
                  </span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
                    isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateCampaign}
                  className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Create Campaign
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreviewModal && selectedCampaign && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowPreviewModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg p-8 max-w-2xl w-full max-h-96 overflow-y-auto`}
            >
              <h3 className="text-2xl font-bold mb-6">Campaign Preview</h3>

              {/* Email Preview */}
              <div className={`p-6 rounded-lg mb-6 ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <p className="text-xs font-bold mb-3">SUBJECT LINE</p>
                <p className="text-lg font-bold mb-4">We miss you! Come back and get 10% off 🎉</p>

                <div className="border-t pt-4 mb-4">
                  <p className="text-sm font-bold mb-2">MESSAGE:</p>
                  <p className={`text-sm leading-relaxed mb-4 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Hi there! 👋

We noticed you haven't visited us in a while, and we'd love to see you back at the gym! Whether you need to get back on track or just need some motivation, we're here to help.

As a special welcome back gift, we're offering you <strong>10% off your next month</strong> of membership. Plus, our trainers are ready to help you reset your fitness goals.
                  </p>

                  <p className={`text-sm mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    <strong>Ready to get back?</strong> Click below to book your comeback session with one of our trainers.
                  </p>

                  <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                    Claim Offer & Book
                  </button>

                  <p className={`text-xs mt-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Questions? Reply to this email or call us at (555) 123-4567
                  </p>
                </div>
              </div>

              {/* Campaign Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className={`p-4 rounded-lg text-center ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <p className={`text-xs font-bold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Target Members
                  </p>
                  <p className="text-2xl font-bold mt-2">{selectedCampaign.memberCount || '8-15'}</p>
                </div>
                <div className={`p-4 rounded-lg text-center ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <p className={`text-xs font-bold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Channels
                  </p>
                  <p className="text-2xl font-bold mt-2">{selectedCampaign.channels.length}</p>
                </div>
                <div className={`p-4 rounded-lg text-center ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <p className={`text-xs font-bold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Est. ROI
                  </p>
                  <p className="text-2xl font-bold mt-2 text-green-600">$420</p>
                </div>
              </div>

              {/* Close Button */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
                    isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  Close
                </button>
                {selectedCampaign.status === 'draft' && (
                  <button className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center gap-2">
                    <Send size={16} />
                    Launch Campaign
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AtRiskMembersManager;
