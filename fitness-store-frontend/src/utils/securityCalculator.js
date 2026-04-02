/**
 * Security & Authentication Utilities
 * Password management, 2FA, session handling, device security
 */

/**
 * 2FA setup methods
 */
export const TWO_FA_METHODS = {
  TOTP: 'totp',          // Time-based One-Time Password (Google Authenticator, Authy)
  SMS: 'sms',            // SMS text message
  EMAIL: 'email'         // Email-based verification
};

export const getTwoFALabel = (method) => {
  const labels = {
    totp: 'Authenticator App',
    sms: 'SMS Text Message',
    email: 'Email Verification'
  };
  return labels[method] || method;
};

export const getTwoFADescription = (method) => {
  const descriptions = {
    totp: 'Use an authenticator app like Google Authenticator or Authy',
    sms: 'Receive verification codes via SMS',
    email: 'Receive verification codes via email'
  };
  return descriptions[method] || '';
};

/**
 * Generate 2FA setup instructions
 */
export const generate2FASetupSteps = (method) => {
  const steps = {
    totp: [
      'Download an authenticator app (Google Authenticator, Authy, Microsoft Authenticator)',
      'Open the app and scan the QR code below',
      'Enter the 6-digit code shown in the app to confirm',
      'Save your backup codes in a secure location'
    ],
    sms: [
      'Verify your phone number',
      'You\'ll receive a code via SMS',
      'Enter the code to verify',
      'Save your backup codes in a secure location'
    ],
    email: [
      'When you log in, you\'ll receive an email with a verification code',
      'Enter the code to complete login',
      'Save your backup codes in a secure location'
    ]
  };
  return steps[method] || [];
};

/**
 * Backup codes generation
 */
export const generateBackupCodes = (count = 10) => {
  const codes = [];
  for (let i = 0; i < count; i++) {
    const code = Math.random()
      .toString(36)
      .toUpperCase()
      .substring(2, 8) +
      '-' +
      Math.random()
        .toString(36)
        .toUpperCase()
        .substring(2, 8);
    codes.push(code);
  }
  return codes;
};

/**
 * Session device types
 */
export const DEVICE_TYPES = {
  DESKTOP: 'desktop',
  MOBILE: 'mobile',
  TABLET: 'tablet',
  OTHER: 'other'
};

/**
 * Detect device type from user agent
 */
export const detectDeviceType = (userAgent = navigator.userAgent) => {
  if (/mobile|android/i.test(userAgent)) return DEVICE_TYPES.MOBILE;
  if (/tablet|ipad/i.test(userAgent)) return DEVICE_TYPES.TABLET;
  if (/windows|macintosh|linux/i.test(userAgent)) return DEVICE_TYPES.DESKTOP;
  return DEVICE_TYPES.OTHER;
};

/**
 * Get device type icon
 */
export const getDeviceTypeIcon = (deviceType) => {
  const icons = {
    desktop: '💻',
    mobile: '📱',
    tablet: '📱',
    other: '🖥️'
  };
  return icons[deviceType] || '🖥️';
};

/**
 * Session risk level
 */
export const SESSION_RISK_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
};

/**
 * Calculate session risk level
 */
export const calculateSessionRiskLevel = (session) => {
  let riskScore = 0;

  // Old session = higher risk
  const ageInDays = (Date.now() - new Date(session.createdAt)) / (1000 * 60 * 60 * 24);
  if (ageInDays > 30) riskScore += 10;
  if (ageInDays > 60) riskScore += 10;

  // Inactive session = higher risk
  const inactiveInDays = (Date.now() - new Date(session.lastActiveAt)) / (1000 * 60 * 60 * 24);
  if (inactiveInDays > 7) riskScore += 10;
  if (inactiveInDays > 30) riskScore += 15;

  // Unusual location = higher risk (would need IP geolocation in reality)
  if (session.location && session.location !== 'Your Typical Location') {
    riskScore += 20;
  }

  if (riskScore >= 30) return SESSION_RISK_LEVELS.HIGH;
  if (riskScore >= 15) return SESSION_RISK_LEVELS.MEDIUM;
  return SESSION_RISK_LEVELS.LOW;
};

/**
 * Get risk level color
 */
export const getRiskLevelColor = (riskLevel) => {
  const colors = {
    low: 'bg-green-500/20 text-green-400',
    medium: 'bg-yellow-500/20 text-yellow-400',
    high: 'bg-red-500/20 text-red-400'
  };
  return colors[riskLevel] || 'bg-gray-500/20 text-gray-400';
};

/**
 * Activity log entry types
 */
export const ACTIVITY_TYPES = {
  LOGIN: 'login',
  LOGOUT: 'logout',
  PASSWORD_CHANGE: 'password_change',
  EMAIL_CHANGE: 'email_change',
  PHONE_CHANGE: 'phone_change',
  TWO_FA_ENABLE: '2fa_enable',
  TWO_FA_DISABLE: '2fa_disable',
  PAYMENT_METHOD_UPDATE: 'payment_method_update',
  MEMBERSHIP_CHANGE: 'membership_change',
  ACCOUNT_SETTINGS_CHANGE: 'account_settings_change'
};

/**
 * Get activity label
 */
export const getActivityLabel = (activityType) => {
  const labels = {
    login: 'Logged in',
    logout: 'Logged out',
    password_change: 'Changed password',
    email_change: 'Updated email address',
    phone_change: 'Updated phone number',
    '2fa_enable': 'Enabled 2-factor authentication',
    '2fa_disable': 'Disabled 2-factor authentication',
    payment_method_update: 'Updated payment method',
    membership_change: 'Changed membership plan',
    account_settings_change: 'Updated account settings'
  };
  return labels[activityType] || activityType;
};

/**
 * Password history validation - ensure new password isn't in history
 */
export const isPasswordInHistory = (newPassword, passwordHistory = []) => {
  // In reality, you'd hash and compare
  return passwordHistory.some(
    oldPassword => oldPassword === newPassword
  );
};

/**
 * Account security score
 */
export const calculateSecurityScore = (userSecurityData) => {
  let score = 50; // Base score

  // 2FA enabled: +30 points
  if (userSecurityData.twoFAEnabled) score += 30;

  // Strong password: +10 points
  if (userSecurityData.passwordStrength === 'Very Strong') score += 10;

  // Regular password updates: +5 points
  const daysSincePasswordChange = userSecurityData.daysSincePasswordChange || 0;
  if (daysSincePasswordChange > 90) score -= 10;
  if (daysSincePasswordChange < 30) score += 5;

  // Active sessions: -5 points per session over 2
  const activeSessions = userSecurityData.activeSessions || 0;
  if (activeSessions > 2) score -= (activeSessions - 2) * 5;

  // Verified email: +5 points
  if (userSecurityData.emailVerified) score += 5;

  // Verified phone: +5 points
  if (userSecurityData.phoneVerified) score += 5;

  return Math.min(100, Math.max(0, score));
};

/**
 * Security recommendation based on score
 */
export const getSecurityRecommendation = (securityScore) => {
  if (securityScore >= 80) {
    return { level: 'Excellent', text: 'Your account is well-protected.', color: 'text-green-400' };
  }
  if (securityScore >= 60) {
    return { level: 'Good', text: 'Consider enabling 2-factor authentication for better security.', color: 'text-blue-400' };
  }
  if (securityScore >= 40) {
    return { level: 'Fair', text: 'Enable 2FA and update your password regularly.', color: 'text-yellow-400' };
  }
  return { level: 'Poor', text: 'Take action immediately: enable 2FA and change your password.', color: 'text-red-400' };
};

/**
 * Account data types for export
 */
export const EXPORTABLE_DATA_TYPES = {
  PROFILE: 'profile',
  ACTIVITY: 'activity',
  WORKOUT_HISTORY: 'workout_history',
  NUTRITION_LOGS: 'nutrition_logs',
  BILLING: 'billing',
  SETTINGS: 'settings'
};

/**
 * Get data export labels
 */
export const getDataTypeLabel = (dataType) => {
  const labels = {
    profile: 'Profile Information',
    activity: 'Activity Log',
    workout_history: 'Workout History',
    nutrition_logs: 'Nutrition Logs',
    billing: 'Billing History',
    settings: 'Account Settings'
  };
  return labels[dataType] || dataType;
};

/**
 * Password change history
 */
export const PASSWORD_CHANGE_INTERVAL = 90; // days

/**
 * Calculate days until password reset recommended
 */
export const daysUntilPasswordResetRecommended = (lastPasswordChangeDate) => {
  const lastChange = new Date(lastPasswordChangeDate);
  const nextRecommendedChange = new Date(lastChange);
  nextRecommendedChange.setDate(nextRecommendedChange.getDate() + PASSWORD_CHANGE_INTERVAL);

  const now = new Date();
  const daysUntil = Math.ceil((nextRecommendedChange - now) / (1000 * 60 * 60 * 24));

  return Math.max(0, daysUntil);
};

/**
 * Session timeout settings
 */
export const SESSION_TIMEOUT_SETTINGS = {
  IMMEDIATE: { label: 'Immediate', minutes: 0 },
  FIFTEEN_MIN: { label: '15 minutes', minutes: 15 },
  THIRTY_MIN: { label: '30 minutes', minutes: 30 },
  ONE_HOUR: { label: '1 hour', minutes: 60 },
  FOUR_HOURS: { label: '4 hours', minutes: 240 },
  NEVER: { label: 'Never', minutes: null }
};

/**
 * Location-based security
 */
export const isNewLocation = (newLocation, trustedLocations = []) => {
  return !trustedLocations.some(
    loc => loc.latitude === newLocation.latitude && loc.longitude === newLocation.longitude
  );
};

/**
 * Trust device for future logins
 */
export const trustDeviceForFutureLogins = (deviceFingerprint, trustedDevices = []) => {
  if (!trustedDevices.find(d => d.fingerprint === deviceFingerprint)) {
    trustedDevices.push({
      fingerprint: deviceFingerprint,
      addedAt: new Date(),
      name: `Trusted Device ${trustedDevices.length + 1}`
    });
  }
  return trustedDevices;
};
