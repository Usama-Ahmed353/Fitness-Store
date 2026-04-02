import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../hooks/useLanguage';
import SEO from '../../components/seo/SEO';
import MemberLayout from '../../layouts/MemberLayout';
import {
  WelcomeCard,
  StatsRow,
} from '../../components/member/WelcomeCard';
import TodaysSchedule from '../../components/member/TodaysSchedule';
import CountdownTimer from '../../components/member/CountdownTimer';
import QuickActions from '../../components/member/QuickActions';
import MembershipCard from '../../components/member/MembershipCard';
import ActivityFeed from '../../components/member/ActivityFeed';
import Achievements from '../../components/member/Achievements';
import { Zap, Heart, TrendingUp } from 'lucide-react';

/**
 * DashboardPage - Member dashboard with overview, stats, and quick actions
 */
const DashboardPage = () => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const dispatch = useDispatch();

  // Redux state
  const { profile: memberProfile, bookings, currentMembership } = useSelector(
    (state) => state.member
  );
  const user = useSelector((state) => state.auth.user);

  const memberName = memberProfile?.name || user?.name || 'Member';

  // Get next class within 24 hours
  const getNextClass = () => {
    if (!bookings || bookings.length === 0) return null;

    const now = new Date();
    const nextDay = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    return bookings
      .filter((b) => {
        const classTime = new Date(b.classTime);
        return classTime > now && classTime <= nextDay;
      })
      .sort((a, b) => new Date(a.classTime) - new Date(b.classTime))[0];
  };

  // Stats data
  const statsData = [
    {
      label: t('member.stats.classesThisMonth'),
      value: bookings?.filter((b) => {
        const classDate = new Date(b.classTime);
        const today = new Date();
        return (
          classDate.getMonth() === today.getMonth() &&
          classDate.getFullYear() === today.getFullYear()
        );
      }).length || 0,
      trend: '+3',
      trendUp: true,
      icon: Zap,
    },
    {
      label: t('member.stats.checkIns'),
      value: memberProfile?.checkInStreak || 0,
      trend: '+1',
      trendUp: true,
      icon: Heart,
    },
    {
      label: t('member.stats.ptSessions'),
      value: memberProfile?.trainerSessions || 0,
      trend: '0',
      trendUp: false,
      icon: TrendingUp,
    },
    {
      label: t('member.stats.pointsEarned'),
      value: memberProfile?.points || 0,
      trend: '+150',
      trendUp: true,
      icon: Zap,
    },
  ];

  // TODO: Fetch member data on mount
  useEffect(() => {
    if (!memberProfile) {
      // Dispatch fetchMemberProfile if not already loaded
      console.log('Member profile not loaded');
    }
  }, [memberProfile, dispatch]);

  const nextClass = getNextClass();

  return (
    <>
      {/* SEO */}
      <SEO
        title={`Dashboard - ${memberName}`}
        description="Your CrunchFit Pro member dashboard with classes, progress, and achievements"
        noIndex={true}
      />

      {/* Main Content */}
      <MemberLayout>
        <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
          {/* Content Container */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 pb-24 lg:pb-6">
            {/* Welcome Section */}
            <WelcomeCard />

            {/* Stats Row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 md:mt-8"
            >
              <StatsRow stats={statsData} />
            </motion.div>

            {/* Countdown Timer (if next class within 24h) */}
            {nextClass && (
              <div className="mt-6 md:mt-8">
                <CountdownTimer nextClass={nextClass} />
              </div>
            )}

            {/* Quick Actions */}
            <div className="mt-6 md:mt-8">
              <QuickActions />
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mt-6 md:mt-8">
              {/* Left Column (Main Content) */}
              <div className="lg:col-span-2 space-y-6 md:space-y-8">
                {/* Today's Schedule */}
                <TodaysSchedule bookings={bookings} />

                {/* Activity Feed */}
                <ActivityFeed />
              </div>

              {/* Right Column (Sidebars) */}
              <div className="space-y-6 md:space-y-8">
                {/* Membership Card */}
                <MembershipCard />

                {/* Achievements Preview */}
                <div className="md:hidden lg:block">
                  <Achievements />
                </div>
              </div>
            </div>

            {/* Mobile Achievements (below main content) */}
            <div className="md:block lg:hidden mt-6 md:mt-8">
              <Achievements />
            </div>
          </div>
        </div>
      </MemberLayout>
    </>
  );
};

export default DashboardPage;
