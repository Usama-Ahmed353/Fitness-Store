import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Key,
  Copy,
  Eye,
  EyeOff,
  Trash2,
  Plus,
  Zap,
  Code,
  FileText,
  Bell,
  Webhook,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Play,
  Loader,
  Download,
  Settings,
  Briefcase,
} from 'lucide-react';
import { ThemeContext } from '../../contexts/ThemeContext';

const APIAccessPage = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  // API Keys State
  const [apiKeys, setApiKeys] = useState([
    {
      id: 1,
      name: 'Production API Key',
      prefix: 'sk_live_',
      fullKey: 'YOUR_PRODUCTION_API_KEY',
      created: '2026-01-15',
      lastUsed: '2026-03-24 14:32',
      scopes: ['read', 'write', 'webhook'],
      masked: true,
    },
    {
      id: 2,
      name: 'Testing Key',
      prefix: 'sk_test_',
      fullKey: 'YOUR_TEST_API_KEY',
      created: '2026-02-01',
      lastUsed: '2026-03-22 09:15',
      scopes: ['read'],
      masked: true,
    },
  ]);

  const [webhooks, setWebhooks] = useState([
    {
      id: 1,
      endpoint: 'https://mygym.example.com/webhooks/crunchfit',
      events: ['member.joined', 'member.canceled', 'class.booked'],
      active: true,
      lastEvent: '2026-03-24 14:05',
      successRate: 99.8,
    },
    {
      id: 2,
      endpoint: 'https://mygym.example.com/webhooks/payments',
      events: ['payment.received', 'payment.failed'],
      active: true,
      lastEvent: '2026-03-24 15:12',
      successRate: 100,
    },
  ]);

  const [eventLog, setEventLog] = useState([
    {
      id: 1,
      event: 'member.joined',
      timestamp: '2026-03-24 14:05:32',
      webhook: 'mygym.example.com/webhooks/crunchfit',
      status: 'delivered',
      statusCode: 200,
    },
    {
      id: 2,
      event: 'class.booked',
      timestamp: '2026-03-24 13:45:12',
      webhook: 'mygym.example.com/webhooks/crunchfit',
      status: 'delivered',
      statusCode: 200,
    },
    {
      id: 3,
      event: 'payment.received',
      timestamp: '2026-03-24 12:30:01',
      webhook: 'mygym.example.com/webhooks/payments',
      status: 'failed',
      statusCode: 500,
    },
  ]);

  const [integrations] = useState([
    {
      id: 1,
      name: 'Mailchimp',
      description: 'Sync member emails to Mailchimp lists',
      icon: '📧',
      connected: true,
      syncStatus: 'Last synced: 2 hours ago',
      action: 'Configure',
    },
    {
      id: 2,
      name: 'Google Calendar',
      description: 'Sync class schedule to gym calendar',
      icon: '📅',
      connected: true,
      syncStatus: 'Last synced: 1 hour ago',
      action: 'Configure',
    },
    {
      id: 3,
      name: 'Zapier',
      description: 'Connect to 5000+ apps (Slack, HubSpot, etc.)',
      icon: '⚡',
      connected: false,
      syncStatus: 'Not connected',
      action: 'Connect',
    },
    {
      id: 4,
      name: 'Mindbody Import',
      description: 'Import historical data from Mindbody',
      icon: '📥',
      connected: false,
      syncStatus: 'Not imported',
      action: 'Import',
    },
    {
      id: 5,
      name: 'Excel Export',
      description: 'Export member & class data to Excel',
      icon: '📊',
      connected: true,
      syncStatus: 'Ready to export',
      action: 'Export',
    },
    {
      id: 6,
      name: 'Google Sheets Sync',
      description: 'Bi-directional sync with Google Sheets',
      icon: '🔄',
      connected: false,
      syncStatus: 'Not connected',
      action: 'Connect',
    },
  ]);

  // UI States
  const [showCreateKeyModal, setShowCreateKeyModal] = useState(false);
  const [showWebhookModal, setShowWebhookModal] = useState(false);
  const [showDocModal, setShowDocModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyScopes, setNewKeyScopes] = useState({ read: false, write: false, webhook: false });
  const [newWebhook, setNewWebhook] = useState({ endpoint: '', events: [] });
  const [revealedKeys, setRevealedKeys] = useState<number[]>([]);
  const [testingWebhookId, setTestingWebhookId] = useState<number | null>(null);
  const [copyFeedback, setCopyFeedback] = useState<number | null>(null);

  // API Key Functions
  const toggleKeyVisibility = (id: number) => {
    setRevealedKeys((prev) =>
      prev.includes(id) ? prev.filter((k) => k !== id) : [...prev, id]
    );
  };

  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopyFeedback(id);
    setTimeout(() => setCopyFeedback(null), 2000);
  };

  const handleCreateKey = () => {
    if (!newKeyName.trim()) {
      alert('Enter a key name');
      return;
    }
    const newKey = {
      id: apiKeys.length + 1,
      name: newKeyName,
      prefix: 'sk_live_',
      fullKey: `sk_live_${Math.random().toString(36).substring(2, 28)}`,
      created: new Date().toISOString().split('T')[0],
      lastUsed: 'Never',
      scopes: Object.keys(newKeyScopes).filter((k) => newKeyScopes[k as keyof typeof newKeyScopes]),
      masked: true,
    };
    setApiKeys((prev) => [...prev, newKey]);
    setNewKeyName('');
    setNewKeyScopes({ read: false, write: false, webhook: false });
    setShowCreateKeyModal(false);
    alert('✅ API key created! Store it securely—you won\'t see it again.');
  };

  const handleRevokeKey = (id: number) => {
    if (confirm('Revoke this key? Applications using it will stop working.')) {
      setApiKeys((prev) => prev.filter((k) => k.id !== id));
      alert('✅ API key revoked');
    }
  };

  const handleAddWebhook = () => {
    if (!newWebhook.endpoint.trim() || newWebhook.events.length === 0) {
      alert('Enter an endpoint and select events');
      return;
    }
    const webhook = {
      id: webhooks.length + 1,
      endpoint: newWebhook.endpoint,
      events: newWebhook.events,
      active: true,
      lastEvent: 'Never',
      successRate: 0,
    };
    setWebhooks((prev) => [...prev, webhook]);
    setNewWebhook({ endpoint: '', events: [] });
    setShowWebhookModal(false);
    alert('✅ Webhook registered! We\'ll start sending events.');
  };

  const handleTestWebhook = (id: number) => {
    setTestingWebhookId(id);
    setTimeout(() => {
      setTestingWebhookId(null);
      alert('✅ Test webhook sent! Check your endpoint logs.');
    }, 2000);
  };

  const toggleWebhookEvent = (event: string) => {
    setNewWebhook((prev) => ({
      ...prev,
      events: prev.events.includes(event)
        ? prev.events.filter((e) => e !== event)
        : [...prev.events, event],
    }));
  };

  const webhookEvents = [
    'member.joined',
    'member.canceled',
    'member.updated',
    'class.booked',
    'class.canceled',
    'payment.received',
    'payment.failed',
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} p-6`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold mb-2">API Access</h1>
          <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Manage API keys, webhooks, and third-party integrations (Enterprise plan)
          </p>
        </motion.div>

        {/* API Keys Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-8 mb-8`}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Key size={28} className="text-blue-600" />
              <h2 className="text-2xl font-bold">API Keys</h2>
            </div>
            <button
              onClick={() => setShowCreateKeyModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={18} />
              Generate Key
            </button>
          </div>

          {/* API Keys Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={`border-b ${isDark ? 'border-gray-700 bg-gray-700' : 'border-gray-300 bg-gray-100'}`}>
                  <th className="px-4 py-3 text-left font-semibold">Name</th>
                  <th className="px-4 py-3 text-left font-semibold">Key</th>
                  <th className="px-4 py-3 text-left font-semibold">Created</th>
                  <th className="px-4 py-3 text-left font-semibold">Last Used</th>
                  <th className="px-4 py-3 text-left font-semibold">Scopes</th>
                  <th className="px-4 py-3 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {apiKeys.map((key) => (
                  <tr
                    key={key.id}
                    className={`border-b ${isDark ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'}`}
                  >
                    <td className="px-4 py-3 font-semibold">{key.name}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <code className={`px-2 py-1 rounded font-mono text-xs ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                          {revealedKeys.includes(key.id) ? key.fullKey : `${key.prefix}••••••••`}
                        </code>
                        <button
                          onClick={() => toggleKeyVisibility(key.id)}
                          className="p-1 text-gray-500 hover:text-gray-700"
                        >
                          {revealedKeys.includes(key.id) ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                        <button
                          onClick={() => copyToClipboard(key.fullKey, key.id)}
                          className="p-1 text-gray-500 hover:text-gray-700"
                        >
                          <Copy size={16} />
                        </button>
                        {copyFeedback === key.id && <span className="text-xs text-green-600">✓ Copied</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">{key.created}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">{key.lastUsed}</td>
                    <td className="px-4 py-3 text-xs">
                      <div className="flex flex-wrap gap-1">
                        {key.scopes.map((scope) => (
                          <span
                            key={scope}
                            className={`px-2 py-1 rounded-full text-xs font-bold ${
                              scope === 'read'
                                ? 'bg-blue-100 text-blue-700'
                                : scope === 'write'
                                  ? 'bg-orange-100 text-orange-700'
                                  : 'bg-purple-100 text-purple-700'
                            }`}
                          >
                            {scope}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleRevokeKey(key.id)}
                        className="text-red-600 hover:text-red-700 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Documentation Link */}
          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={() => setShowDocModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <FileText size={18} />
              View API Documentation
            </button>
            <a
              href="#"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm"
            >
              Open in New Tab <ExternalLink size={14} />
            </a>
          </div>
        </motion.div>

        {/* Webhooks Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-8 mb-8`}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Webhook size={28} className="text-purple-600" />
              <h2 className="text-2xl font-bold">Webhooks</h2>
            </div>
            <button
              onClick={() => setShowWebhookModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus size={18} />
              Register Webhook
            </button>
          </div>

          {/* Webhooks List */}
          <div className="space-y-4 mb-8">
            {webhooks.map((webhook, idx) => (
              <motion.div
                key={webhook.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`p-4 rounded-lg border ${isDark ? 'border-gray-700 bg-gray-700' : 'border-gray-300 bg-gray-50'}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="font-mono text-sm mb-1">{webhook.endpoint}</p>
                    <div className="flex items-center gap-2 text-xs">
                      <span className={`px-2 py-1 rounded ${webhook.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {webhook.active ? '✓ Active' : '✗ Inactive'}
                      </span>
                      <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                        Last event: {webhook.lastEvent}
                      </span>
                      <span className={`${webhook.successRate === 100 ? 'text-green-600' : 'text-yellow-600'}`}>
                        Success rate: {webhook.successRate}%
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleTestWebhook(webhook.id)}
                    disabled={testingWebhookId === webhook.id}
                    className="flex items-center gap-2 px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {testingWebhookId === webhook.id ? (
                      <>
                        <Loader size={14} className="animate-spin" />
                        Testing...
                      </>
                    ) : (
                      <>
                        <Play size={14} />
                        Test
                      </>
                    )}
                  </button>
                </div>

                {/* Events */}
                <div className="flex flex-wrap gap-1">
                  {webhook.events.map((event) => (
                    <span
                      key={event}
                      className={`px-2 py-1 rounded text-xs font-bold ${isDark ? 'bg-gray-600 text-gray-200' : 'bg-gray-200 text-gray-700'}`}
                    >
                      {event}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Event Log */}
          <div className="mt-8">
            <h3 className="text-lg font-bold mb-4">Recent Events</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className={`border-b ${isDark ? 'border-gray-700 bg-gray-700' : 'border-gray-300 bg-gray-100'}`}>
                    <th className="px-4 py-2 text-left">Event</th>
                    <th className="px-4 py-2 text-left">Timestamp</th>
                    <th className="px-4 py-2 text-left">Webhook</th>
                    <th className="px-4 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {eventLog.map((log) => (
                    <tr key={log.id} className={`border-b ${isDark ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'}`}>
                      <td className="px-4 py-2 font-mono">{log.event}</td>
                      <td className="px-4 py-2 text-gray-600">{log.timestamp}</td>
                      <td className="px-4 py-2 text-gray-600 font-mono text-xs">{log.webhook}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-bold ${
                            log.status === 'delivered'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {log.status} ({log.statusCode})
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Integrations Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-8`}
        >
          <div className="flex items-center gap-3 mb-6">
            <Briefcase size={28} className="text-green-600" />
            <h2 className="text-2xl font-bold">Pre-Built Integrations</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {integrations.map((integration, idx) => (
              <motion.div
                key={integration.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`p-4 rounded-lg border ${
                  isDark ? 'border-gray-700 bg-gray-700 hover:bg-gray-600' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                } transition-colors cursor-pointer`}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{integration.icon}</span>
                  {integration.connected ? (
                    <CheckCircle size={20} className="text-green-600" />
                  ) : (
                    <AlertCircle size={20} className="text-gray-500" />
                  )}
                </div>

                <h3 className="font-bold mb-1">{integration.name}</h3>
                <p className={`text-xs mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {integration.description}
                </p>

                <div className="text-xs mb-3">
                  <p
                    className={`${
                      integration.connected ? 'text-green-600 font-bold' : 'text-gray-600'
                    }`}
                  >
                    {integration.syncStatus}
                  </p>
                </div>

                <button className="w-full py-2 px-3 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors font-semibold">
                  {integration.action}
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Create API Key Modal */}
      <AnimatePresence>
        {showCreateKeyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowCreateKeyModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 w-full max-w-md`}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4">Generate API Key</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Key Name</label>
                  <input
                    type="text"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder="e.g., Mobile App Integration"
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-3">Scopes</label>
                  <div className="space-y-2">
                    {Object.keys(newKeyScopes).map((scope) => (
                      <label key={scope} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newKeyScopes[scope as keyof typeof newKeyScopes]}
                          onChange={(e) =>
                            setNewKeyScopes((prev) => ({
                              ...prev,
                              [scope]: e.target.checked,
                            }))
                          }
                          className="rounded"
                        />
                        <span className="text-sm capitalize">{scope}</span>
                        <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {scope === 'read' && '(Get members, classes)'}
                          {scope === 'write' && '(Create, update resources)'}
                          {scope === 'webhook' && '(Receive events)'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    onClick={() => setShowCreateKeyModal(false)}
                    className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
                      isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateKey}
                    className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors"
                  >
                    Create Key
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Register Webhook Modal */}
      <AnimatePresence>
        {showWebhookModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowWebhookModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 w-full max-w-md max-h-96 overflow-y-auto`}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4">Register Webhook</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Endpoint URL</label>
                  <input
                    type="url"
                    value={newWebhook.endpoint}
                    onChange={(e) => setNewWebhook((prev) => ({ ...prev, endpoint: e.target.value }))}
                    placeholder="https://example.com/webhook"
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-3">Events to Listen For</label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {webhookEvents.map((event) => (
                      <label key={event} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newWebhook.events.includes(event)}
                          onChange={() => toggleWebhookEvent(event)}
                          className="rounded"
                        />
                        <span className="text-sm">{event}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    onClick={() => setShowWebhookModal(false)}
                    className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
                      isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddWebhook}
                    className="flex-1 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold transition-colors"
                  >
                    Register
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* API Documentation Modal */}
      <AnimatePresence>
        {showDocModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowDocModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 w-full max-w-2xl max-h-96 overflow-y-auto`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">API Documentation</h3>
                <button onClick={() => setShowDocModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>

              <div className={`space-y-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                <div>
                  <h4 className="font-bold text-blue-600 mb-2">GET /api/v1/members</h4>
                  <p className="text-xs mb-2">Retrieve all members</p>
                  <pre className={`p-2 rounded text-xs overflow-x-auto ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
                    {`curl -X GET https://api.mygym.com/api/v1/members \\
  -H "Authorization: Bearer sk_live_..."`}
                  </pre>
                </div>

                <div>
                  <h4 className="font-bold text-blue-600 mb-2">GET /api/v1/classes</h4>
                  <p className="text-xs mb-2">Retrieve all classes</p>
                  <pre className={`p-2 rounded text-xs overflow-x-auto ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
                    {`curl -X GET https://api.mygym.com/api/v1/classes \\
  -H "Authorization: Bearer sk_live_..."`}
                  </pre>
                </div>

                <div>
                  <h4 className="font-bold text-blue-600 mb-2">POST /api/v1/check-ins</h4>
                  <p className="text-xs mb-2">Record a member check-in</p>
                  <pre className={`p-2 rounded text-xs overflow-x-auto ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
                    {`curl -X POST https://api.mygym.com/api/v1/check-ins \\
  -H "Authorization: Bearer sk_live_..." \\
  -d '{"member_id": "123", "timestamp": "2026-03-24T14:30:00Z"}'`}
                  </pre>
                </div>

                <p className="text-xs">
                  Full documentation available at{' '}
                  <a href="#" className="text-blue-600 hover:underline">
                    https://docs.crunchfit.com/api
                  </a>
                </p>
              </div>

              <button
                onClick={() => setShowDocModal(false)}
                className="mt-6 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default APIAccessPage;
