import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../hooks/useLanguage';
import {
  Calendar,
  Clock,
  User,
  ChevronDown,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import SessionNotesModal from './SessionNotesModal';

/**
 * SessionList - Display member's training sessions
 */
const SessionList = ({ sessions = [] }) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const [expandedSession, setExpandedSession] = useState(null);
  const [selectedSessionForNotes, setSelectedSessionForNotes] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all'); // all, upcoming, completed

  // Filter sessions
  const filteredSessions = sessions.filter((session) => {
    if (filterStatus === 'all') return true;
    return session.status === filterStatus;
  });

  // Sort sessions by date (upcoming first, then completed)
  const sortedSessions = [...filteredSessions].sort((a, b) => {
    if (a.status === 'upcoming' && b.status === 'completed') return -1;
    if (a.status === 'completed' && b.status === 'upcoming') return 1;
    return new Date(b.date) - new Date(a.date);
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return isDark ? 'bg-blue-900/20 text-blue-300' : 'bg-blue-50 text-blue-700';
      case 'completed':
        return isDark ? 'bg-green-900/20 text-green-300' : 'bg-green-50 text-green-700';
      case 'cancelled':
        return isDark ? 'bg-red-900/20 text-red-300' : 'bg-red-50 text-red-700';
      default:
        return isDark ? 'bg-gray-700' : 'bg-gray-100';
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      upcoming: t('member.sessions.upcoming') || 'Upcoming',
      completed: t('member.sessions.completed') || 'Completed',
      cancelled: t('member.sessions.cancelled') || 'Cancelled',
    };
    return labels[status] || status;
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-2">
        {['all', 'upcoming', 'completed'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              filterStatus === status
                ? `bg-accent text-white ${isDark ? '' : ''}`
                : isDark
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {status === 'all'
              ? t('member.sessions.all') || 'All'
              : status === 'upcoming'
              ? t('member.sessions.upcoming') || 'Upcoming'
              : t('member.sessions.completed') || 'Completed'}
          </button>
        ))}
      </div>

      {/* Sessions List */}
      {sortedSessions.length > 0 ? (
        <div className="space-y-3">
          <AnimatePresence>
            {sortedSessions.map((session) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`rounded-lg border overflow-hidden ${
                  isDark
                    ? 'border-gray-700 bg-gray-700/50 hover:bg-gray-700'
                    : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                } transition-all cursor-pointer`}
              >
                {/* Session Header */}
                <button
                  onClick={() =>
                    setExpandedSession(
                      expandedSession === session.id ? null : session.id
                    )
                  }
                  className="w-full p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4 flex-1 text-left">
                    {/* Status Icon */}
                    <div>
                      {session.status === 'completed' ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : session.status === 'upcoming' ? (
                        <Clock className="w-5 h-5 text-blue-500" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>

                    {/* Session Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3
                          className={`font-bold ${
                            isDark ? 'text-white' : 'text-gray-900'
                          }`}
                        >
                          {session.focus}
                        </h3>
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-semibold ${getStatusColor(
                            session.status
                          )}`}
                        >
                          {getStatusLabel(session.status)}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {session.date.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {session.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {session.trainer}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Expand Icon */}
                  <motion.div
                    animate={{
                      rotate: expandedSession === session.id ? 180 : 0,
                    }}
                  >
                    <ChevronDown
                      className={`w-5 h-5 ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    />
                  </motion.div>
                </button>

                {/* Expanded Content */}
                <AnimatePresence>
                  {expandedSession === session.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`border-t ${
                        isDark ? 'border-gray-600' : 'border-gray-200'
                      }`}
                    >
                      <div
                        className={`p-4 space-y-3 ${
                          isDark ? 'bg-gray-600/50' : 'bg-white'
                        }`}
                      >
                        {/* Duration */}
                        <div>
                          <p
                            className={`text-sm font-semibold ${
                              isDark ? 'text-gray-300' : 'text-gray-600'
                            }`}
                          >
                            {t('member.sessions.duration') || 'Duration'}
                          </p>
                          <p
                            className={`font-semibold mt-1 ${
                              isDark ? 'text-white' : 'text-gray-900'
                            }`}
                          >
                            {session.duration} {t('member.sessions.minutes') || 'minutes'}
                          </p>
                        </div>

                        {/* Session Details */}
                        <div>
                          <p
                            className={`text-sm font-semibold ${
                              isDark ? 'text-gray-300' : 'text-gray-600'
                            }`}
                          >
                            {t('member.sessions.details') || 'Details'}
                          </p>
                          <p
                            className={`mt-1 text-sm ${
                              isDark ? 'text-gray-400' : 'text-gray-600'
                            }`}
                          >
                            {session.details ||
                              'No additional details available'}
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-3">
                          {session.status === 'completed' && session.notes && (
                            <button
                              onClick={() => setSelectedSessionForNotes(session)}
                              className="flex-1 px-4 py-2 rounded-lg bg-accent text-white hover:bg-accent/90 font-semibold transition-all text-sm"
                            >
                              {t('member.sessions.viewNotes') || 'View Notes'}
                            </button>
                          )}
                          {session.status === 'upcoming' && (
                            <>
                              <button className="flex-1 px-4 py-2 rounded-lg bg-accent text-white hover:bg-accent/90 font-semibold transition-all text-sm">
                                {t('member.sessions.reschedule') || 'Reschedule'}
                              </button>
                              <button className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
                                isDark
                                  ? 'bg-red-900/20 text-red-300 hover:bg-red-900/40'
                                  : 'bg-red-50 text-red-600 hover:bg-red-100'
                              }`}>
                                {t('member.sessions.cancel') || 'Cancel'}
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        // Empty State
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`text-center py-12 rounded-lg ${
            isDark ? 'bg-gray-700/30' : 'bg-gray-50'
          }`}
        >
          <Calendar
            className={`w-12 h-12 mx-auto mb-3 ${
              isDark ? 'text-gray-600' : 'text-gray-400'
            }`}
          />
          <p
            className={`font-semibold ${
              isDark ? 'text-gray-300' : 'text-gray-900'
            }`}
          >
            {t('member.sessions.noSessions') || 'No sessions found'}
          </p>
          <p
            className={`text-sm mt-2 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            {filterStatus === 'all'
              ? t('member.sessions.bookSessionToStart') ||
                'Book a session with a trainer to get started'
              : t('member.sessions.noSessionsInStatus') ||
                'No sessions in this category'}
          </p>
        </motion.div>
      )}

      {/* Session Notes Modal */}
      {selectedSessionForNotes && (
        <SessionNotesModal
          session={selectedSessionForNotes}
          onClose={() => setSelectedSessionForNotes(null)}
        />
      )}
    </div>
  );
};

export default SessionList;
