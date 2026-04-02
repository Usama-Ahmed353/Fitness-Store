import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download,
  FileText,
  BarChart3,
  X,
  Check,
  Loader,
} from 'lucide-react';
import { ThemeContext } from '../../contexts/ThemeContext';

const AnalyticsReportGenerator = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const [showModal, setShowModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedSections, setSelectedSections] = useState({
    revenue: true,
    members: true,
    classes: true,
    operations: true,
  });
  const [exportFormat, setExportFormat] = useState('pdf'); // pdf or csv
  const [dateRange, setDateRange] = useState('thisMonth');

  const reportSections = [
    {
      id: 'revenue',
      name: 'Revenue Analytics',
      icon: '💰',
      description: 'MRR, revenue breakdown, daily revenue, renewals, payment health',
    },
    {
      id: 'members',
      name: 'Member Analytics',
      icon: '👥',
      description: 'Growth, churn, retention cohorts, demographics, NPS',
    },
    {
      id: 'classes',
      name: 'Class Analytics',
      icon: '🏋️',
      description: 'Popular classes, attendance, peak hours, instructor performance',
    },
    {
      id: 'operations',
      name: 'Operational Analytics',
      icon: '⚙️',
      description: 'Check-ins, facility utilization, at-risk members, peak hours',
    },
  ];

  const handleSectionToggle = (section) => {
    setSelectedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleGenerateReport = async () => {
    // Validate at least one section selected
    if (!Object.values(selectedSections).some((v) => v)) {
      alert('Select at least one section');
      return;
    }

    setIsGenerating(true);

    // Simulate report generation
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const selectedCount = Object.values(selectedSections).filter((v) => v).length;
    const fileName = `GymAnalytics_${new Date().toISOString().split('T')[0]}.${
      exportFormat === 'pdf' ? 'pdf' : 'csv'
    }`;

    console.log(`Generating ${selectedCount} section(s) ${exportFormat.toUpperCase()} report...`);
    console.log('File:', fileName);

    setIsGenerating(false);
    alert(`✅ Report generated! Downloading ${fileName}`);
    setShowModal(false);
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center gap-2"
      >
        <FileText size={20} />
        Custom Report
      </button>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg p-8 max-w-2xl w-full max-h-96 overflow-y-auto`}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold">Generate Custom Report</h3>
                  <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Select sections and format for your analytics report
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className={`p-2 rounded-lg transition-colors ${
                    isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Export Format */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-3">Export Format</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="format"
                      value="pdf"
                      checked={exportFormat === 'pdf'}
                      onChange={(e) => setExportFormat(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-semibold">
                      📄 PDF (with charts & tables)
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="format"
                      value="csv"
                      checked={exportFormat === 'csv'}
                      onChange={(e) => setExportFormat(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-semibold">📊 CSV (data only)</span>
                  </label>
                </div>
              </div>

              {/* Date Range */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-3">Date Range</label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300'
                  }`}
                >
                  <option value="thisMonth">This Month</option>
                  <option value="lastMonth">Last Month</option>
                  <option value="thisQuarter">This Quarter</option>
                  <option value="lastQuarter">Last Quarter</option>
                  <option value="ytd">Year-to-Date</option>
                  <option value="lastYear">Last Year</option>
                </select>
              </div>

              {/* Report Sections */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-3">Select Sections</label>
                <div className="space-y-3">
                  {reportSections.map((section) => (
                    <label
                      key={section.id}
                      className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50"
                      style={{
                        backgroundColor: isDark ? '#374151' : '#f3f4f6',
                        borderColor: isDark ? '#4b5563' : '#e5e7eb',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedSections[section.id]}
                        onChange={() => handleSectionToggle(section.id)}
                        className="w-4 h-4 mt-1 accent-blue-600"
                      />
                      <div>
                        <p className="font-semibold">
                          {section.icon} {section.name}
                        </p>
                        <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {section.description}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Report Preview */}
              <div className={`p-4 rounded-lg mb-6 ${isDark ? 'bg-gray-700' : 'bg-blue-50'}`}>
                <p className={`text-sm font-bold ${isDark ? 'text-gray-300' : 'text-blue-900'}`}>
                  📋 Report Summary:
                </p>
                <ul className={`text-xs mt-2 space-y-1 ${isDark ? 'text-gray-400' : 'text-blue-800'}`}>
                  <li>
                    • {Object.values(selectedSections).filter((v) => v).length} sections included
                  </li>
                  <li>• Format: {exportFormat.toUpperCase()}</li>
                  <li>• Period: {dateRange}</li>
                  <li>• Generated: {new Date().toLocaleDateString()}</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
                    isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleGenerateReport}
                  disabled={isGenerating}
                  className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <Loader size={18} className="animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download size={18} />
                      Generate Report
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AnalyticsReportGenerator;
