import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../hooks/useLanguage';
import MemberLayout from '../../layouts/MemberLayout';
import SEO from '../../components/seo/SEO';
import {
  MapPin,
  QrCode,
  CheckCircle,
  AlertCircle,
  Calendar,
  Clock,
  Building2,
  ChevronDown,
  AlertTriangle,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

/**
 * CheckInPage - Member check-in with QR code and GPS verification
 */
const CheckInPage = () => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { profile, bookings, currentMembership } = useSelector(
    (state) => state.member
  );
  const { user } = useSelector((state) => state.auth);

  // State
  const [qrToken, setQrToken] = useState('');
  const [qrRefreshCountdown, setQrRefreshCountdown] = useState(0);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [gpsError, setGpsError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [checkInHistory, setCheckInHistory] = useState([]);
  const [expandedDate, setExpandedDate] = useState(null);
  const qrCanvasRef = useRef(null);

  // Initialize QR token and refresh countdown
  useEffect(() => {
    const generateQRToken = () => {
      const timestamp = Math.floor(Date.now() / 1000);
      const token = `CF:${user?.id || 'member'}:${timestamp}`;
      setQrToken(token);
      setQrRefreshCountdown(300); // 5 minutes
    };

    generateQRToken();

    const qrTimer = setInterval(generateQRToken, 5 * 60 * 1000);
    return () => clearInterval(qrTimer);
  }, [user?.id]);

  // QR Countdown timer
  useEffect(() => {
    if (qrRefreshCountdown <= 0) return;

    const timer = setInterval(() => {
      setQrRefreshCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [qrRefreshCountdown]);

  // Generate QR code visualization
  useEffect(() => {
    if (!qrCanvasRef.current || !qrToken) return;

    const canvas = qrCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const size = 280;

    canvas.width = size;
    canvas.height = size;

    // Create simple pattern-based QR visualization
    ctx.fillStyle = isDark ? '#1f2937' : '#ffffff';
    ctx.fillRect(0, 0, size, size);

    ctx.fillStyle = isDark ? '#f3f4f6' : '#111827';
    const moduleSize = size / 29;

    // Generate pattern from token hash
    let hash = 0;
    for (let i = 0; i < qrToken.length; i++) {
      hash = ((hash << 5) - hash) + qrToken.charCodeAt(i);
      hash |= 0;
    }

    const random = Math.abs(hash % 1000) / 1000;

    // Draw finder patterns (QR corners)
    const drawFinderPattern = (x, y) => {
      // Outer square
      ctx.fillRect(x * moduleSize, y * moduleSize, 7 * moduleSize, 7 * moduleSize);

      // Inner white
      ctx.fillStyle = isDark ? '#1f2937' : '#ffffff';
      ctx.fillRect((x + 1) * moduleSize, (y + 1) * moduleSize, 5 * moduleSize, 5 * moduleSize);

      // Inner black
      ctx.fillStyle = isDark ? '#f3f4f6' : '#111827';
      ctx.fillRect((x + 2) * moduleSize, (y + 2) * moduleSize, 3 * moduleSize, 3 * moduleSize);
    };

    drawFinderPattern(0, 0);
    drawFinderPattern(22, 0);
    drawFinderPattern(0, 22);

    // Separator lines
    ctx.fillStyle = isDark ? '#1f2937' : '#ffffff';
    ctx.fillRect(7 * moduleSize, 0, moduleSize, 8 * moduleSize);
    ctx.fillRect(0, 7 * moduleSize, 8 * moduleSize, moduleSize);
    ctx.fillRect(22 * moduleSize, 0, moduleSize, 8 * moduleSize);
    ctx.fillRect(23 * moduleSize, 7 * moduleSize, 6 * moduleSize, moduleSize);

    // Draw data modules (pseudo-random pattern)
    ctx.fillStyle = isDark ? '#f3f4f6' : '#111827';
    for (let i = 0; i < 25; i++) {
      for (let j = 0; j < 25; j++) {
        if (
          (i < 9 && j < 9) ||
          (i > 20 && j < 9) ||
          (i < 9 && j > 20)
        ) {
          continue;
        }
        const pseudoRandom = Math.sin(i * 12.9898 + j * 78.233) * 43758.5453;
        if ((pseudoRandom - Math.floor(pseudoRandom)) * random < 0.5) {
          ctx.fillRect(i * moduleSize, j * moduleSize, moduleSize, moduleSize);
        }
      }
    }
  }, [qrToken, isDark]);

  // Format countdown time
  const formatCountdown = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get user location
  const getLocation = () => {
    setGpsError(null);
    setIsCheckingIn(true);

    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser');
      setIsCheckingIn(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
        performCheckIn(latitude, longitude);
      },
      (error) => {
        let errorMsg = 'Unable to get location';
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = 'Location permission denied. Enable GPS to check in.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMsg = 'Location information is unavailable';
        }
        setGpsError(errorMsg);
        setIsCheckingIn(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Check if location is within 500m of gym
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c * 1000; // Convert to meters
  };

  // Perform check-in
  const performCheckIn = async (latitude, longitude) => {
    try {
      // Mock gym location (should come from API)
      const gymLocation = {
        latitude: latitude + (Math.random() - 0.5) * 0.005, // Slight variation
        longitude: longitude + (Math.random() - 0.5) * 0.005,
      };

      const distance = calculateDistance(
        latitude,
        longitude,
        gymLocation.latitude,
        gymLocation.longitude
      );

      if (distance > 500) {
        setGpsError(
          `You are ${Math.round(distance)}m away. Must be within 500m of gym.`
        );
        setIsCheckingIn(false);
        return;
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Success!
      const now = new Date();
      const newCheckIn = {
        id: `checkin-${Date.now()}`,
        date: now.toISOString().split('T')[0],
        time: now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        gym: 'GymFit Downtown',
        class: 'Spin Class with Sarah',
        distance: Math.round(distance),
      };

      // Update check-in history
      setCheckInHistory((prev) => [newCheckIn, ...prev].slice(0, 50));

      // Confetti animation
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      // Success toast
      toast.success(
        t('member.checkin.successMessage') || 'Check-in successful! +10 points',
        {
          icon: '🎉',
          duration: 4000,
        }
      );

      setIsCheckingIn(false);
      setGpsError(null);

      // Update streak in Redux (mock)
      setTimeout(() => {
        toast.success(
          t('member.checkin.streakMessage') || 'Your 7-day streak continues!',
          {
            icon: '🔥',
          }
        );
      }, 1500);
    } catch (error) {
      setGpsError('Check-in failed. Please try again.');
      setIsCheckingIn(false);
    }
  };

  // Get today's bookings
  const todayBookings = bookings?.filter((b) => {
    const classDate = new Date(b.classTime).toDateString();
    return classDate === new Date().toDateString();
  }) || [];

  // Generate calendar heatmap data
  const generateHeatmapData = () => {
    const heatmap = [];
    const today = new Date();

    for (let i = 111; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      // Mock check-in data (simulate some check-ins)
      const hasCheckIn = Math.random() > 0.7;
      const intensity = hasCheckIn ? Math.floor(Math.random() * 4) + 1 : 0;

      heatmap.push({
        date: date.toISOString().split('T')[0],
        count: intensity,
      });
    }

    return heatmap;
  };

  const heatmapData = generateHeatmapData();

  return (
    <>
      <SEO
        title="Check In - CrunchFit Pro"
        description="Check in to your gym with QR code or GPS verification"
        noIndex={true}
      />

      <MemberLayout>
        <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 lg:pb-8">
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
                {t('member.checkin.title') || 'Check In'}
              </h1>
              <p
                className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
              >
                {t('member.checkin.subtitle') ||
                  'Check in to your gym with QR code or location'}
              </p>
            </motion.div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left: QR Code Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="h-fit">
                  <div className="flex flex-col items-center">
                    {/* QR Code */}
                    <div className="mb-6">
                      <div
                        className={`border-4 border-accent rounded-xl p-4 ${
                          isDark ? 'bg-gray-800' : 'bg-white'
                        }`}
                      >
                        <canvas
                          ref={qrCanvasRef}
                          className="rounded-lg"
                          width={280}
                          height={280}
                        />
                      </div>
                    </div>

                    {/* Instructions */}
                    <p
                      className={`text-sm font-semibold mb-4 text-center ${
                        isDark ? 'text-gray-200' : 'text-gray-700'
                      }`}
                    >
                      {t('member.checkin.showStaff') ||
                        'Show this to staff to check in'}
                    </p>

                    {/* Refresh Countdown */}
                    <div
                      className={`text-xs ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      {t('member.checkin.refreshIn') || 'Refreshes in'}{' '}
                      <span className="font-mono font-bold text-accent">
                        {formatCountdown(qrRefreshCountdown)}
                      </span>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Right: Manual Check-In Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <h2
                    className={`text-xl font-bold mb-4 ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {t('member.checkin.gpsCheckin') || 'GPS Check-In'}
                  </h2>

                  <p
                    className={`text-sm mb-6 ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    {t('member.checkin.gpsDescription') ||
                      'Use your phone location to check in. Must be within 500m of gym.'}
                  </p>

                  {/* Error Alert */}
                  <AnimatePresence>
                    {gpsError && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`mb-4 p-4 rounded-lg flex items-start gap-3 ${
                          isDark
                            ? 'bg-red-900/20 text-red-400'
                            : 'bg-red-50 text-red-600'
                        }`}
                      >
                        <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-sm">
                            {t('member.checkin.error') || 'Error'}
                          </p>
                          <p className="text-sm mt-1">{gpsError}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Today's Classes */}
                  <div className="mb-6">
                    <h3
                      className={`text-sm font-semibold mb-3 ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      {t('member.checkin.todaysClasses') || "Today's Classes"}
                    </h3>

                    {todayBookings.length === 0 ? (
                      <p
                        className={`text-sm ${
                          isDark ? 'text-gray-500' : 'text-gray-500'
                        }`}
                      >
                        {t('member.checkin.noClasses') ||
                          'No classes scheduled today'}
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {todayBookings.map((booking) => (
                          <div
                            key={booking.id}
                            className={`p-3 rounded-lg border ${
                              isDark
                                ? 'border-gray-700 bg-gray-800/50'
                                : 'border-gray-200 bg-gray-50'
                            }`}
                          >
                            <p className="font-semibold text-sm">
                              {booking.className}
                            </p>
                            <p
                              className={`text-xs mt-1 ${
                                isDark ? 'text-gray-400' : 'text-gray-600'
                              }`}
                            >
                              {new Date(booking.classTime).toLocaleTimeString(
                                'en-US',
                                {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                }
                              )}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Check-In Button */}
                  <Button
                    onClick={getLocation}
                    disabled={isCheckingIn}
                    className="w-full h-12 mb-3"
                  >
                    {isCheckingIn ? (
                      <>
                        <span className="animate-spin mr-2">⌛</span>
                        {t('member.checkin.checking') || 'Checking In...'}
                      </>
                    ) : (
                      <>
                        <MapPin className="w-5 h-5 mr-2" />
                        {t('member.checkin.gpsButton') || 'Check In Now'}
                      </>
                    )}
                  </Button>

                  {userLocation && (
                    <div
                      className={`p-3 rounded-lg text-sm ${
                        isDark
                          ? 'bg-green-900/20 text-green-400'
                          : 'bg-green-50 text-green-700'
                      }`}
                    >
                      <CheckCircle className="w-4 h-4 inline mr-2" />
                      {t('member.checkin.successShort') ||
                        'Location verified. Check-in confirmed!'}
                    </div>
                  )}
                </Card>
              </motion.div>
            </div>

            {/* Check-In History */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8"
            >
              <Card>
                <h2
                  className={`text-2xl font-bold mb-6 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {t('member.checkin.history') || 'Check-In History'}
                </h2>

                {/* Calendar Heatmap */}
                <div className="mb-8">
                  <h3
                    className={`text-sm font-semibold mb-4 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    {t('member.checkin.heatmap') || 'Last 4 Months'}
                  </h3>

                  <div className="overflow-x-auto pb-4">
                    <div className="flex gap-1 min-w-max">
                      {heatmapData.map((day, idx) => {
                        const intensities = [
                          isDark ? 'bg-gray-700' : 'bg-gray-200',
                          isDark
                            ? 'bg-accent/30'
                            : 'bg-accent/20',
                          isDark
                            ? 'bg-accent/60'
                            : 'bg-accent/40',
                          isDark
                            ? 'bg-accent/90'
                            : 'bg-accent/60',
                          'bg-accent',
                        ];

                        return (
                          <motion.div
                            key={idx}
                            whileHover={{ scale: 1.2 }}
                            className={`w-3 h-3 rounded-sm cursor-pointer ${
                              intensities[day.count]
                            }`}
                            title={`${day.date}: ${day.count} check-ins`}
                          />
                        );
                      })}
                    </div>
                  </div>

                  <p
                    className={`text-xs mt-3 ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  >
                    {t('member.checkin.lessDarkMore') ||
                      'Less'}{' '}
                    <span className={`inline-block w-2 h-2 rounded-sm ${isDark ? 'bg-gray-700' : 'bg-gray-200'} mx-1`}></span>
                    {t('member.checkin.more') || 'More'}
                  </p>
                </div>

                {/* Check-In List */}
                <div>
                  <h3
                    className={`text-sm font-semibold mb-4 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    {t('member.checkin.recentCheckIns') || 'Recent Check-Ins'}
                  </h3>

                  {checkInHistory.length === 0 ? (
                    <p
                      className={`text-sm ${
                        isDark ? 'text-gray-500' : 'text-gray-500'
                      }`}
                    >
                      {t('member.checkin.noHistory') || 'No check-ins yet'}
                    </p>
                  ) : (
                    <div className="space-y-1">
                      {checkInHistory.map((checkIn) => (
                        <motion.div
                          key={checkIn.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`p-4 rounded-lg flex items-center justify-between border ${
                            isDark
                              ? 'border-gray-700 hover:bg-gray-800/50'
                              : 'border-gray-200 hover:bg-gray-50'
                          } transition-colors`}
                        >
                          <div className="flex-1">
                            <p
                              className={`text-sm font-semibold ${
                                isDark ? 'text-white' : 'text-gray-900'
                              }`}
                            >
                              {checkIn.class}
                            </p>
                            <div
                              className={`flex gap-4 mt-1 text-xs ${
                                isDark ? 'text-gray-400' : 'text-gray-600'
                              }`}
                            >
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {checkIn.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {checkIn.time}
                              </span>
                              <span className="flex items-center gap-1">
                                <Building2 className="w-3 h-3" />
                                {checkIn.gym}
                              </span>
                            </div>
                          </div>
                          <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 ml-4" />
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </MemberLayout>
    </>
  );
};

export default CheckInPage;
