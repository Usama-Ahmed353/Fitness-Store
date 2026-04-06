import { useState, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../hooks/useLanguage';
import MemberLayout from '../../layouts/MemberLayout';
import SEO from '../../components/seo/SEO';
import SessionNotesModal from '../../components/member/SessionNotesModal';
import TrainerReviewModal from '../../components/member/TrainerReviewModal';
import { Calendar, Clock, MapPin, CheckCircle, AlertCircle, RotateCcw } from 'lucide-react';
import { Card } from '../../components/ui/Card';

/**
 * MySessionsPage - Calendar view of all PT sessions
 */
const MySessionsPage = () => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const { accessToken } = useSelector((state) => state.auth);
  const runtimeHost = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  const API = import.meta.env.VITE_API_BASE_URL || `http://${runtimeHost}:5001/api`;
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedSession, setSelectedSession] = useState(null);
  const [showNotes, setShowNotes] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSessions = async () => {
      if (!accessToken) {
        setSessions([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const headers = { Authorization: `Bearer ${accessToken}` };
        const { data } = await axios.get(`${API}/trainers/sessions/my`, { headers });
        const mapped = (data?.data || []).map((session) => {
          const trainerUser = session.trainerId?.userId;
          return {
            _id: session._id,
            trainerId: session.trainerId?._id,
            trainerName: trainerUser
              ? `${trainerUser.firstName || ''} ${trainerUser.lastName || ''}`.trim()
              : 'Trainer',
            date: new Date(session.scheduledDate),
            duration: session.duration || 60,
            type: 'in-person',
            gym: session.trainerId?.gymId?.name || 'Gym',
            status:
              session.status === 'scheduled'
                ? 'upcoming'
                : session.status === 'completed'
                  ? 'completed'
                  : 'canceled',
            notes: null,
          };
        });
        setSessions(mapped);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load trainer sessions');
        setSessions([]);
      } finally {
        setLoading(false);
      }
    };

    loadSessions();
  }, [API, accessToken]);

  // Get calendar days
  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i));

  // Get sessions for a specific day
  const getSessionsForDay = (day) => {
    if (!day) return [];
    return sessions.filter(
      (s) =>
        s.date.getDate() === day.getDate() &&
        s.date.getMonth() === day.getMonth() &&
        s.date.getFullYear() === day.getFullYear()
    );
  };

  // Tab filtering
  const [activeTab, setActiveTab] = useState('all');
  const filteredSessions = useMemo(() => {
    if (activeTab === 'all') return sessions;
    return sessions.filter((s) => s.status === activeTab);
  }, [activeTab, sessions]);

  // Handle rebook
  const handleRebook = (session) => {
    toast.success(`Booking another session with ${session.trainerName}!`);
  };

  return (
    <>
      <SEO
        title="My PT Sessions - CrunchFit Pro"
        description="View all your personal training sessions"
        noIndex={true}
      />

      <MemberLayout>
        <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 lg:pb-8">
            {/* Page Header */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-8"
            >
              <h1
                className={`text-3xl md:text-4xl font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                {t('member.sessions.title') || 'My PT Sessions'}
              </h1>
              <p
                className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
              >
                {t('member.sessions.subtitle') ||
                  'View and manage your personal training sessions'}
              </p>
            </motion.div>

            {/* Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 flex gap-2 overflow-x-auto pb-2"
            >
              {['all', 'upcoming', 'completed', 'canceled'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                    activeTab === tab
                      ? 'bg-accent text-white'
                      : isDark
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {tab === 'all'
                    ? t('member.sessions.allSessions') || 'All'
                    : tab === 'upcoming'
                      ? t('member.sessions.upcoming') || 'Upcoming'
                      : tab === 'completed'
                        ? t('member.sessions.completed') || 'Completed'
                        : t('member.sessions.canceled') || 'Canceled'}
                </button>
              ))}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Calendar */}
              <div className="lg:col-span-1">
                <Card className={`${isDark ? 'bg-gray-800' : 'bg-white'} sticky top-24`}>
                  {/* Calendar Header */}
                  <div className="p-4 border-b flex items-center justify-between" style={{
                    borderColor: isDark ? '#374151' : '#e5e7eb'
                  }}>
                    <button
                      onClick={() =>
                        setCurrentMonth(
                          new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
                        )
                      }
                      className={`p-2 rounded transition-all ${
                        isDark
                          ? 'hover:bg-gray-700 text-gray-400'
                          : 'hover:bg-gray-100 text-gray-600'
                      }`}
                    >
                      ←
                    </button>
                    <h3
                      className={`font-bold text-center flex-1 ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {currentMonth.toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </h3>
                    <button
                      onClick={() =>
                        setCurrentMonth(
                          new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
                        )
                      }
                      className={`p-2 rounded transition-all ${
                        isDark
                          ? 'hover:bg-gray-700 text-gray-400'
                          : 'hover:bg-gray-100 text-gray-600'
                      }`}
                    >
                      →
                    </button>
                  </div>

                  {/* Day Headers */}
                  <div className="grid grid-cols-7 gap-1 p-4 pt-2 text-center">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                      <div
                        key={day}
                        className={`text-xs font-bold py-2 ${
                          isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Days Grid */}
                  <div className="grid grid-cols-7 gap-1 p-4 pt-0">
                    {days.map((day, idx) => {
                      const daySessions = day ? getSessionsForDay(day) : [];
                      const isToday =
                        day &&
                        day.toDateString() === new Date().toDateString();

                      return (
                        <div
                          key={idx}
                          className={`aspect-square flex flex-col items-center justify-center rounded text-xs font-semibold cursor-pointer transition-all ${
                            !day
                              ? ''
                              : isToday
                                ? 'bg-accent text-white'
                                : daySessions.length > 0
                                  ? isDark
                                    ? 'bg-accent/20 text-accent hover:bg-accent/30'
                                    : 'bg-accent/10 text-accent hover:bg-accent/20'
                                  : isDark
                                    ? 'text-gray-400 hover:bg-gray-700'
                                    : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {day && (
                            <>
                              <span>{day.getDate()}</span>
                              {daySessions.length > 0 && (
                                <div className="flex gap-0.5 mt-0.5">
                                  {daySessions.map((s, i) => (
                                    <div
                                      key={i}
                                      className={`w-1 h-1 rounded-full ${
                                        s.status === 'completed'
                                          ? 'bg-green-500'
                                          : s.status === 'canceled'
                                            ? 'bg-red-500'
                                            : 'bg-blue-500'
                                      }`}
                                    />
                                  ))}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </div>

              {/* Sessions List */}
              <div className="lg:col-span-2">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  {loading ? (
                    <Card>
                      <div className="p-8 text-center">
                        <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>Loading sessions...</p>
                      </div>
                    </Card>
                  ) : filteredSessions.length === 0 ? (
                    <Card>
                      <div className="p-8 text-center">
                        <AlertCircle
                          className={`w-12 h-12 mx-auto mb-4 ${
                            isDark ? 'text-gray-500' : 'text-gray-400'
                          }`}
                        />
                        <p
                          className={`font-semibold ${
                            isDark ? 'text-gray-300' : 'text-gray-700'
                          }`}
                        >
                          {t('member.sessions.noSessions') || 'No sessions found'}
                        </p>
                      </div>
                    </Card>
                  ) : (
                    filteredSessions.map((session, idx) => (
                      <motion.div
                        key={session._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                          <div className="p-6 flex items-start justify-between">
                            <div className="flex-1">
                              {/* Header */}
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <h3
                                    className={`text-lg font-bold ${
                                      isDark ? 'text-white' : 'text-gray-900'
                                    }`}
                                  >
                                    {session.trainerName}
                                  </h3>
                                  <span
                                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-1 ${
                                      session.status === 'upcoming'
                                        ? isDark
                                          ? 'bg-blue-900/30 text-blue-400'
                                          : 'bg-blue-100 text-blue-800'
                                        : session.status === 'completed'
                                          ? isDark
                                            ? 'bg-green-900/30 text-green-400'
                                            : 'bg-green-100 text-green-800'
                                          : isDark
                                            ? 'bg-red-900/30 text-red-400'
                                            : 'bg-red-100 text-red-800'
                                    }`}
                                  >
                                    {session.status === 'upcoming'
                                      ? t('member.sessions.upcoming') || 'Upcoming'
                                      : session.status === 'completed'
                                        ? t('member.sessions.completed') || 'Completed'
                                        : t('member.sessions.canceled') || 'Canceled'}
                                  </span>
                                </div>
                                <div
                                  className={`text-sm font-semibold ${
                                    isDark ? 'text-gray-400' : 'text-gray-600'
                                  }`}
                                >
                                  {session.date.toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                  })}
                                </div>
                              </div>

                              {/* Details Grid */}
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4 text-accent" />
                                  <span
                                    className={`text-sm ${
                                      isDark ? 'text-gray-400' : 'text-gray-600'
                                    }`}
                                  >
                                    {session.date.toLocaleTimeString('en-US', {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`text-sm ${
                                      isDark ? 'text-gray-400' : 'text-gray-600'
                                    }`}
                                  >
                                    {session.duration} min
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4 text-accent" />
                                  <span
                                    className={`text-sm ${
                                      isDark ? 'text-gray-400' : 'text-gray-600'
                                    }`}
                                  >
                                    {session.type === 'video' ? 'Virtual' : 'In-Person'}
                                  </span>
                                </div>
                              </div>

                              {session.status === 'completed' && session.notes && (
                                <div
                                  className={`p-2 rounded text-xs mb-3 ${
                                    isDark
                                      ? 'bg-green-900/20 text-green-300'
                                      : 'bg-green-50 text-green-700'
                                  }`}
                                >
                                  ✓ {t('member.sessions.notesAdded') || 'Session notes added'}
                                </div>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-2 ml-4">
                              {session.status === 'completed' && session.notes && (
                                <button
                                  onClick={() => {
                                    setSelectedSession(session);
                                    setShowNotes(true);
                                  }}
                                  className="px-3 py-1 rounded text-sm font-semibold text-accent hover:bg-accent/10 transition-all"
                                >
                                  {t('member.sessions.viewNotes') || 'View Notes'}
                                </button>
                              )}
                              {session.status === 'completed' && (
                                <button
                                  onClick={() => {
                                    setSelectedSession(session);
                                    setShowReview(true);
                                  }}
                                  className="px-3 py-1 rounded text-sm font-semibold text-accent hover:bg-accent/10 transition-all"
                                >
                                  {t('member.sessions.leaveReview') || 'Leave Review'}
                                </button>
                              )}
                              {(session.status === 'completed' ||
                                session.status === 'canceled') && (
                                <button
                                  onClick={() => handleRebook(session)}
                                  className="px-3 py-1 rounded text-sm font-semibold text-accent hover:bg-accent/10 transition-all flex items-center gap-1"
                                >
                                  <RotateCcw className="w-3 h-3" />
                                  Rebook
                                </button>
                              )}
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </MemberLayout>

      {/* Modals */}
      {showNotes && selectedSession && (
        <SessionNotesModal
          session={selectedSession}
          onClose={() => {
            setShowNotes(false);
            setSelectedSession(null);
          }}
        />
      )}

      {showReview && selectedSession && (
        <TrainerReviewModal
          session={selectedSession}
          onClose={() => {
            setShowReview(false);
            setSelectedSession(null);
          }}
        />
      )}
    </>
  );
};

export default MySessionsPage;
