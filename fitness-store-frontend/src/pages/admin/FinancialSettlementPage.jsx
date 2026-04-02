import React, { useState, useMemo, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Calendar,
  Check,
  ChevronDown,
  DollarSign,
  Download,
  Filter,
  MoreVertical,
  Search,
  TrendingUp,
  X,
  AlertCircle,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { ThemeContext } from '../../contexts/ThemeContext';
import { LanguageContext } from '../../contexts/LanguageContext';
import AdminLayout from '../../layouts/AdminLayout';

// Mock settlements data
const mockSettlements = [
  {
    id: 'SETTLE-001',
    gym: 'NYC Downtown Fitness',
    gymId: 'GYM-001',
    period: 'March 2024',
    month: '2024-03',
    grossRevenue: 18500,
    memberCount: 580,
    classesHeld: 85,
    platformCommission: 1850,
    platformPercentage: 10,
    netPayment: 16650,
    status: 'processing',
    processedDate: null,
    disbursedDate: null,
    breakdown: {
      subscriptionRevenue: 15200,
      classAddonRevenue: 3300,
      refunds: 0,
    },
  },
  {
    id: 'SETTLE-002',
    gym: 'Brooklyn Elite Gym',
    gymId: 'GYM-002',
    period: 'March 2024',
    month: '2024-03',
    grossRevenue: 15200,
    memberCount: 420,
    classesHeld: 62,
    platformCommission: 1520,
    platformPercentage: 10,
    netPayment: 13680,
    status: 'processed',
    processedDate: '2024-03-31',
    disbursedDate: '2024-04-03',
    breakdown: {
      subscriptionRevenue: 12500,
      classAddonRevenue: 2700,
      refunds: 0,
    },
  },
  {
    id: 'SETTLE-003',
    gym: 'Manhattan CrossFit Hub',
    gymId: 'GYM-003',
    period: 'March 2024',
    month: '2024-03',
    grossRevenue: 16800,
    memberCount: 520,
    classesHeld: 78,
    platformCommission: 1680,
    platformPercentage: 10,
    netPayment: 15120,
    status: 'processed',
    processedDate: '2024-03-31',
    disbursedDate: '2024-04-03',
    breakdown: {
      subscriptionRevenue: 13900,
      classAddonRevenue: 2900,
      refunds: 0,
    },
  },
  {
    id: 'SETTLE-004',
    gym: 'Queens Fitness Center',
    gymId: 'GYM-004',
    period: 'March 2024',
    month: '2024-03',
    grossRevenue: 10900,
    memberCount: 310,
    classesHeld: 45,
    platformCommission: 1090,
    platformPercentage: 10,
    netPayment: 9810,
    status: 'processed',
    processedDate: '2024-03-31',
    disbursedDate: '2024-04-03',
    breakdown: {
      subscriptionRevenue: 8900,
      classAddonRevenue: 2000,
      refunds: 0,
    },
  },
  {
    id: 'SETTLE-005',
    gym: 'NYC Downtown Fitness',
    gymId: 'GYM-001',
    period: 'February 2024',
    month: '2024-02',
    grossRevenue: 17200,
    memberCount: 560,
    classesHeld: 82,
    platformCommission: 1720,
    platformPercentage: 10,
    netPayment: 15480,
    status: 'processed',
    processedDate: '2024-02-29',
    disbursedDate: '2024-03-04',
    breakdown: {
      subscriptionRevenue: 14200,
      classAddonRevenue: 3000,
      refunds: 0,
    },
  },
];

const FinancialSettlementPage = () => {
  const { theme } = useContext(ThemeContext);
  const { language } = useContext(LanguageContext);
  const isDark = theme === 'dark';

  const [settlements, setSettlements] = useState(mockSettlements);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterMonth, setFilterMonth] = useState('2024-03');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [selectedSettlement, setSelectedSettlement] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const filteredSettlements = useMemo(() => {
    return settlements.filter((settlement) => {
      const matchesSearch =
        settlement.gym.toLowerCase().includes(searchTerm.toLowerCase()) ||
        settlement.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = filterStatus === 'all' || settlement.status === filterStatus;
      const matchesMonth = settlement.month === filterMonth;

      return matchesSearch && matchesStatus && matchesMonth;
    });
  }, [settlements, searchTerm, filterStatus, filterMonth]);

  const summaryStats = useMemo(() => {
    const filtered = filteredSettlements;
    return {
      totalGrossRevenue: filtered.reduce((sum, s) => sum + s.grossRevenue, 0),
      totalCommission: filtered.reduce((sum, s) => sum + s.platformCommission, 0),
      totalNetPayment: filtered.reduce((sum, s) => sum + s.netPayment, 0),
      processingCount: filtered.filter((s) => s.status === 'processing').length,
      processedCount: filtered.filter((s) => s.status === 'processed').length,
    };
  }, [filteredSettlements]);

  const handleOpenDetail = (settlement) => {
    setSelectedSettlement(settlement);
    setShowDetailModal(true);
  };

  const handleOpenProcess = (settlement) => {
    setSelectedSettlement(settlement);
    setShowProcessModal(true);
  };

  const handleProcessSettlement = () => {
    if (selectedSettlement) {
      setSettlements(
        settlements.map((s) =>
          s.id === selectedSettlement.id
            ? {
                ...s,
                status: 'processed',
                processedDate: new Date().toISOString().split('T')[0],
                disbursedDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
                  .toISOString()
                  .split('T')[0],
              }
            : s
        )
      );
      setShowProcessModal(false);
      setShowDetailModal(false);
      setSelectedSettlement(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'processed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'processing':
        return <Clock size={14} />;
      case 'processed':
        return <CheckCircle size={14} />;
      default:
        return <AlertCircle size={14} />;
    }
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
            <h1 className="text-2xl font-bold mb-4">Financial Settlement</h1>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <div className={`${isDark ? 'bg-gray-700' : 'bg-blue-50'} p-3 rounded-lg`}>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Gross Revenue</p>
                <p className="text-2xl font-bold">${(summaryStats.totalGrossRevenue / 1000).toFixed(1)}K</p>
              </div>
              <div className={`${isDark ? 'bg-gray-700' : 'bg-red-50'} p-3 rounded-lg`}>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Platform Commission</p>
                <p className="text-2xl font-bold text-red-600">${(summaryStats.totalCommission / 1000).toFixed(1)}K</p>
              </div>
              <div className={`${isDark ? 'bg-gray-700' : 'bg-green-50'} p-3 rounded-lg`}>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Gym Net Payment</p>
                <p className="text-2xl font-bold text-green-600">${(summaryStats.totalNetPayment / 1000).toFixed(1)}K</p>
              </div>
              <div className={`${isDark ? 'bg-gray-700' : 'bg-orange-50'} p-3 rounded-lg`}>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Processing</p>
                <p className="text-2xl font-bold text-orange-600">{summaryStats.processingCount}</p>
              </div>
              <div className={`${isDark ? 'bg-gray-700' : 'bg-green-50'} p-3 rounded-lg`}>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Processed</p>
                <p className="text-2xl font-bold text-green-600">{summaryStats.processedCount}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search & Filters */}
        <div className="p-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6 mb-6`}
          >
            <div className="flex gap-4 mb-4 flex-wrap">
              <div className="flex-1 min-w-64 relative">
                <Search className={`absolute left-3 top-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} size={18} />
                <input
                  type="text"
                  placeholder="Search by gym name or settlement ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                    isDark
                      ? 'bg-gray-700 border-gray-600 placeholder-gray-500'
                      : 'bg-white border-gray-300 placeholder-gray-400'
                  }`}
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <Filter size={18} />
                Filters
              </button>
            </div>

            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
              >
                <div>
                  <label className="block text-sm font-medium mb-2">Month</label>
                  <input
                    type="month"
                    value={filterMonth}
                    onChange={(e) => setFilterMonth(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                  >
                    <option value="all">All Statuses</option>
                    <option value="processing">Processing</option>
                    <option value="processed">Processed</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Settlements Table */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border overflow-hidden`}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`border-b ${isDark ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
                    <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Gym
                    </th>
                    <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Period
                    </th>
                    <th className={`text-right py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Gross Revenue
                    </th>
                    <th className={`text-right py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Platform Commission
                    </th>
                    <th className={`text-right py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Net Payment
                    </th>
                    <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Status
                    </th>
                    <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSettlements.map((settlement) => (
                    <motion.tr
                      key={settlement.id}
                      whileHover={{ backgroundColor: isDark ? '#374151' : '#f9fafb' }}
                      className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
                    >
                      <td className="py-3 px-4">
                        <p className="font-semibold text-sm">{settlement.gym}</p>
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {settlement.id}
                        </p>
                      </td>
                      <td className="py-3 px-4 text-sm">{settlement.period}</td>
                      <td className="py-3 px-4 text-right font-semibold">
                        ${settlement.grossRevenue.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="font-semibold text-red-600">
                          -${settlement.platformCommission.toLocaleString()}
                        </span>
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {settlement.platformPercentage}%
                        </p>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="font-bold text-green-600">
                          ${settlement.netPayment.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit ${getStatusColor(
                            settlement.status
                          )}`}
                        >
                          {getStatusIcon(settlement.status)}
                          {settlement.status.charAt(0).toUpperCase() + settlement.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            onClick={() => handleOpenDetail(settlement)}
                            className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                            title="View Details"
                          >
                            <ChevronDown size={16} />
                          </motion.button>
                          {settlement.status === 'processing' && (
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              onClick={() => handleOpenProcess(settlement)}
                              className="px-3 py-1 rounded-lg font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors text-xs flex items-center gap-1"
                            >
                              <Check size={14} />
                              Process
                            </motion.button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredSettlements.length === 0 && (
              <div className="p-8 text-center">
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  No settlements found
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedSettlement && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg max-w-2xl w-full p-6 my-8`}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold">{selectedSettlement.gym}</h3>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Settlement for {selectedSettlement.period}
                  </p>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className={`p-1 rounded ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Status & Dates */}
                <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} p-4 rounded-lg`}>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Status</p>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 mt-1 ${getStatusColor(
                          selectedSettlement.status
                        )}`}
                      >
                        {getStatusIcon(selectedSettlement.status)}
                        {selectedSettlement.status.charAt(0).toUpperCase() + selectedSettlement.status.slice(1)}
                      </span>
                    </div>
                    <div>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Processed Date</p>
                      <p className="font-semibold text-sm mt-1">
                        {selectedSettlement.processedDate
                          ? new Date(selectedSettlement.processedDate).toLocaleDateString()
                          : 'Pending'}
                      </p>
                    </div>
                    <div>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Disbursed Date</p>
                      <p className="font-semibold text-sm mt-1">
                        {selectedSettlement.disbursedDate
                          ? new Date(selectedSettlement.disbursedDate).toLocaleDateString()
                          : 'Pending'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Financial Summary */}
                <div>
                  <h4 className="font-semibold mb-3">Financial Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                      <span className="text-sm">Subscription Revenue</span>
                      <span className="font-semibold">${selectedSettlement.breakdown.subscriptionRevenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                      <span className="text-sm">Class Add-on Revenue</span>
                      <span className="font-semibold">${selectedSettlement.breakdown.classAddonRevenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                      <span className="text-sm">Refunds</span>
                      <span className="font-semibold text-red-600">
                        -${selectedSettlement.breakdown.refunds.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-t-2 border-b-2 border-gray-700">
                      <span className="font-semibold">Total Gross Revenue</span>
                      <span className="font-bold text-lg">${selectedSettlement.grossRevenue.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Commission Calculation */}
                <div>
                  <h4 className="font-semibold mb-3">Platform Commission Calculation</h4>
                  <div className={`${isDark ? 'bg-blue-900/20' : 'bg-blue-50'} p-4 rounded-lg space-y-2`}>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Gross Revenue</span>
                      <span className="font-semibold">${selectedSettlement.grossRevenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">× Platform Fee</span>
                      <span className="font-semibold">{selectedSettlement.platformPercentage}%</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-blue-300">
                      <span className="font-semibold">Platform Commission</span>
                      <span className="font-bold text-red-600">
                        ${selectedSettlement.platformCommission.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Net Payment */}
                <div>
                  <h4 className="font-semibold mb-3">Net Payment to Gym</h4>
                  <div className={`${isDark ? 'bg-green-900/20' : 'bg-green-50'} p-4 rounded-lg`}>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Gross Revenue</span>
                      <span className="font-semibold">${selectedSettlement.grossRevenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-red-600">
                      <span className="text-sm">- Platform Commission</span>
                      <span className="font-semibold">-${selectedSettlement.platformCommission.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-t-2 border-green-300 mt-2">
                      <span className="font-bold">Net Payment Amount</span>
                      <span className="font-bold text-lg text-green-600">
                        ${selectedSettlement.netPayment.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Gym Metrics */}
                <div>
                  <h4 className="font-semibold mb-3">Performance Metrics</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} p-3 rounded-lg text-center`}>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Members</p>
                      <p className="font-bold text-lg">{selectedSettlement.memberCount}</p>
                    </div>
                    <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} p-3 rounded-lg text-center`}>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Classes Held</p>
                      <p className="font-bold text-lg">{selectedSettlement.classesHeld}</p>
                    </div>
                    <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} p-3 rounded-lg text-center`}>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Revenue Per Member</p>
                      <p className="font-bold text-lg">
                        ${(selectedSettlement.grossRevenue / selectedSettlement.memberCount).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-6 border-t border-gray-700">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  Close
                </button>
                <button className="flex-1 px-4 py-2 rounded-lg font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors flex items-center justify-center gap-2">
                  <Download size={16} />
                  Download Statement
                </button>
                {selectedSettlement.status === 'processing' && (
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      handleOpenProcess(selectedSettlement);
                    }}
                    className="flex-1 px-4 py-2 rounded-lg font-medium bg-green-500 text-white hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <Check size={16} />
                    Process Settlement
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* Process Settlement Modal */}
        {showProcessModal && selectedSettlement && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg max-w-md w-full p-6`}
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 mx-auto mb-4">
                <CheckCircle className="text-green-600 dark:text-green-200" size={24} />
              </div>
              <h3 className="text-lg font-bold text-center mb-2">Process Settlement</h3>
              <p className={`text-sm text-center ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                Confirm processing of settlement for{' '}
                <span className="font-semibold">{selectedSettlement.gym}</span> for{' '}
                <span className="font-semibold">{selectedSettlement.period}</span>
              </p>

              <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} p-4 rounded-lg mb-4`}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">Net Payment Amount:</span>
                  <span className="font-bold text-green-600">
                    ${selectedSettlement.netPayment.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Disbursement Date:</span>
                  <span className="font-semibold">
                    {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowProcessModal(false)}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleProcessSettlement}
                  className="flex-1 px-4 py-2 rounded-lg font-medium bg-green-500 text-white hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Check size={16} />
                  Confirm & Process
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default FinancialSettlementPage;
