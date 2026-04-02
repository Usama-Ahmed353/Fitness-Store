import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../hooks/useLanguage';
import Button from '../ui/Button';
import { ArrowUpRight } from 'lucide-react';

/**
 * MembershipCard - Credit card style membership card with QR code
 */
export const MembershipCard = () => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const canvasRef = useRef(null);
  const [qrCode, setQrCode] = useState(null);

  const { profile: memberProfile, currentMembership } = useSelector(
    (state) => state.member
  );
  const user = useSelector((state) => state.auth.user);

  const memberName = memberProfile?.name || user?.name || 'Member';
  const gymName = memberProfile?.preferredGym?.name || 'CrunchFit';
  const planName = currentMembership?.plan?.name || 'Premium';
  const memberSince = memberProfile?.createdAt
    ? new Date(memberProfile.createdAt).toLocaleDateString([], {
        year: 'numeric',
        month: 'short',
      })
    : new Date().toLocaleDateString([], { year: 'numeric', month: 'short' });

  // Generate QR code
  useEffect(() => {
    // Dynamic membership ID for QR (refreshes every 5 minutes for security)
    const generateQRToken = () => {
      // In production, this would be a JWT token or secure ID
      const timestamp = Math.floor(Date.now() / (5 * 60 * 1000)) * 5 * 60 * 1000;
      return `CF:${user?.id}:${Math.floor(timestamp / 1000)}`;
    };

    const token = generateQRToken();

    // Simple QR code generation (using text representation)
    // In production, use qr-code library like 'qrcode'
    setQrCode(token);

    // Refresh every 5 minutes
    const interval = setInterval(() => {
      setQrCode(generateQRToken());
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user?.id]);

  // Draw QR code visualization
  useEffect(() => {
    if (!canvasRef.current || !qrCode) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Simple QR pattern visualization
    const size = canvas.width;
    const cellSize = size / 21; // QR standard grid

    // Clear canvas
    ctx.fillStyle = isDark ? '#f3f4f6' : '#ffffff';
    ctx.fillRect(0, 0, size, size);

    // Draw pattern based on token hash
    let hash = 0;
    for (let i = 0; i < qrCode.length; i++) {
      hash = ((hash << 5) - hash) + qrCode.charCodeAt(i);
      hash = hash & hash; // Convert to 32bit integer
    }

    ctx.fillStyle = isDark ? '#111827' : '#000000';
    for (let i = 0; i < 21; i++) {
      for (let j = 0; j < 21; j++) {
        const seed = (hash + i * 21 + j) ^ (i | j);
        if ((seed % 2) === 0) {
          ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
        }
      }
    }
  }, [qrCode, isDark]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className={`rounded-xl overflow-hidden shadow-lg ${
        isDark
          ? 'bg-gradient-to-br from-accent/30 via-accent/10 to-transparent'
          : 'bg-gradient-to-br from-accent/20 via-accent/5 to-transparent'
      } border ${isDark ? 'border-accent/30' : 'border-accent/20'}`}
    >
      {/* Card Header */}
      <div className="p-6 md:p-8">
        {/* Logo and Plan */}
        <div className="flex items-start justify-between mb-12">
          <div>
            <div className="text-2xl font-bold text-white mb-1">CF</div>
            <p className="text-xs text-white/70 uppercase tracking-wider">
              {planName}
            </p>
          </div>
          <motion.div
            whileHover={{ scale: 1.1, rotate: 180 }}
            transition={{ duration: 0.3 }}
          >
            <ArrowUpRight size={24} className="text-white/70" />
          </motion.div>
        </div>

        {/* QR Code */}
        <div className="flex justify-center mb-8">
          <div className={`p-3 rounded-lg ${isDark ? 'bg-white/10' : 'bg-white/20'}`}>
            <canvas
              ref={canvasRef}
              width={120}
              height={120}
              className="w-30 h-30"
            />
          </div>
        </div>

        {/* Card Info */}
        <div className="space-y-4 mb-8 text-white">
          <div>
            <p className="text-xs text-white/70 uppercase tracking-wide mb-1">
              {t('member.membership.memberName')}
            </p>
            <p className="text-lg font-semibold">{memberName}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-white/70 uppercase tracking-wide mb-1">
                {t('member.membership.gym')}
              </p>
              <p className="font-medium">{gymName}</p>
            </div>
            <div>
              <p className="text-xs text-white/70 uppercase tracking-wide mb-1">
                {t('member.membership.memberSince')}
              </p>
              <p className="font-medium">{memberSince}</p>
            </div>
          </div>
        </div>

        {/* Upgrade Button */}
        <Button
          variant="outline"
          fullWidth
          className="text-white border-white/30 hover:bg-white/10"
        >
          {t('member.membership.upgrade')}
        </Button>
      </div>
    </motion.div>
  );
};

export default MembershipCard;
