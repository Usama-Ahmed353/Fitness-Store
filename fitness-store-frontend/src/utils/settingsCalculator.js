/**
 * Member Settings & Account Management Utilities
 * Password validation, profile updates, preference management
 */

import { useCallback } from 'react';

// Password validation rules
export const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecial: true
};

/**
 * Validate password strength
 */
export const validatePassword = (password) => {
  const requirements = {
    length: password.length >= PASSWORD_REQUIREMENTS.minLength,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    numbers: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };

  const meetsAll =
    requirements.length &&
    requirements.uppercase &&
    requirements.lowercase &&
    requirements.numbers &&
    requirements.special;

  const score =
    (requirements.length ? 1 : 0) +
    (requirements.uppercase ? 1 : 0) +
    (requirements.lowercase ? 1 : 0) +
    (requirements.numbers ? 1 : 0) +
    (requirements.special ? 1 : 0);

  let strength = 'Weak';
  if (score >= 5) strength = 'Very Strong';
  else if (score >= 4) strength = 'Strong';
  else if (score >= 3) strength = 'Moderate';

  return {
    isValid: meetsAll,
    score,
    strength,
    requirements
  };
};

/**
 * Validate email format
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number (US format)
 */
export const validatePhone = (phone) => {
  const phoneRegex = /^(\+1)?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$/;
  return phoneRegex.test(phone.trim());
};

/**
 * Format phone number
 */
export const formatPhone = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  if (cleaned.length === 11 && cleaned[0] === '1') {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  return phone;
};

/**
 * Validate date of birth
 */
export const validateDateOfBirth = (dateString) => {
  const dob = new Date(dateString);
  const today = new Date();
  const age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  const isValid = age >= 18 && age <= 150;
  return { isValid, age: isValid ? age : null };
};

/**
 * Format date for display
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Notification preference defaults
 */
export const NOTIFICATION_TYPES = {
  CLASS_REMINDERS: 'class_reminders',
  TRAINER_MESSAGES: 'trainer_messages',
  WAITLIST_UPDATES: 'waitlist_updates',
  CHALLENGES: 'challenges',
  NEWS_UPDATES: 'news_updates',
  PROMOTIONAL: 'promotional',
  ACCOUNT_ALERTS: 'account_alerts'
};

export const NOTIFICATION_CHANNELS = {
  EMAIL: 'email',
  PUSH: 'push',
  SMS: 'sms'
};

/**
 * Default notification preferences
 */
export const getDefaultNotificationPreferences = () => ({
  [NOTIFICATION_TYPES.CLASS_REMINDERS]: {
    [NOTIFICATION_CHANNELS.EMAIL]: true,
    [NOTIFICATION_CHANNELS.PUSH]: true,
    [NOTIFICATION_CHANNELS.SMS]: false
  },
  [NOTIFICATION_TYPES.TRAINER_MESSAGES]: {
    [NOTIFICATION_CHANNELS.EMAIL]: true,
    [NOTIFICATION_CHANNELS.PUSH]: true,
    [NOTIFICATION_CHANNELS.SMS]: false
  },
  [NOTIFICATION_TYPES.WAITLIST_UPDATES]: {
    [NOTIFICATION_CHANNELS.EMAIL]: true,
    [NOTIFICATION_CHANNELS.PUSH]: false,
    [NOTIFICATION_CHANNELS.SMS]: false
  },
  [NOTIFICATION_TYPES.CHALLENGES]: {
    [NOTIFICATION_CHANNELS.EMAIL]: true,
    [NOTIFICATION_CHANNELS.PUSH]: true,
    [NOTIFICATION_CHANNELS.SMS]: false
  },
  [NOTIFICATION_TYPES.NEWS_UPDATES]: {
    [NOTIFICATION_CHANNELS.EMAIL]: true,
    [NOTIFICATION_CHANNELS.PUSH]: false,
    [NOTIFICATION_CHANNELS.SMS]: false
  },
  [NOTIFICATION_TYPES.PROMOTIONAL]: {
    [NOTIFICATION_CHANNELS.EMAIL]: false,
    [NOTIFICATION_CHANNELS.PUSH]: false,
    [NOTIFICATION_CHANNELS.SMS]: false
  },
  [NOTIFICATION_TYPES.ACCOUNT_ALERTS]: {
    [NOTIFICATION_CHANNELS.EMAIL]: true,
    [NOTIFICATION_CHANNELS.PUSH]: true,
    [NOTIFICATION_CHANNELS.SMS]: true
  }
});

/**
 * Get notification type label
 */
export const getNotificationLabel = (notificationType) => {
  const labels = {
    class_reminders: 'Class Reminders',
    trainer_messages: 'Trainer Messages',
    waitlist_updates: 'Waitlist Updates',
    challenges: 'Challenges',
    news_updates: 'News & Updates',
    promotional: 'Promotional Offers',
    account_alerts: 'Account Security Alerts'
  };
  return labels[notificationType] || notificationType;
};

/**
 * Get notification channel label
 */
export const getChannelLabel = (channel) => {
  const labels = {
    email: 'Email',
    push: 'Push Notification',
    sms: 'SMS Text Message'
  };
  return labels[channel] || channel;
};

/**
 * Get notification description
 */
export const getNotificationDescription = (notificationType) => {
  const descriptions = {
    class_reminders: 'Reminders for upcoming classes you\'re registered for',
    trainer_messages: 'Messages and updates from your trainer',
    waitlist_updates: 'Notifications when you move up the waitlist',
    challenges: 'Updates about gym challenges and leaderboards',
    news_updates: 'General fitness news and gym announcements',
    promotional: 'Special offers and promotions',
    account_alerts: 'Critical account security notifications'
  };
  return descriptions[notificationType] || '';
};

/**
 * Session information
 */
export const getSessionInfo = (session) => {
  if (!session) return null;

  const now = new Date();
  const createdDate = new Date(session.createdAt);
  const lastActiveDate = new Date(session.lastActiveAt);

  const createdAgo = formatTimeAgo(createdDate);
  const lastActiveAgo = formatTimeAgo(lastActiveDate);

  return {
    device: session.deviceType || 'Unknown Device',
    location: session.location || 'Unknown Location',
    ip: maskIP(session.ipAddress),
    createdAgo,
    lastActiveAgo,
    isCurrent: session.isCurrent
  };
};

/**
 * Format time ago
 */
export const formatTimeAgo = (date) => {
  const now = new Date();
  const seconds = Math.floor((now - new Date(date)) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;

  return new Date(date).toLocaleDateString();
};

/**
 * Mask IP address for privacy
 */
export const maskIP = (ip) => {
  if (!ip) return 'Hidden';
  const parts = ip.split('.');
  if (parts.length === 4) {
    return `${parts[0]}.${parts[1]}.***.***.`;
  }
  return 'Hidden';
};

/**
 * Validate emergency contact
 */
export const validateEmergencyContact = (contact) => {
  if (!contact.name || contact.name.trim().length < 2) {
    return { isValid: false, error: 'Name is required (min 2 characters)' };
  }
  if (!validatePhone(contact.phone)) {
    return { isValid: false, error: 'Valid phone number is required' };
  }
  if (!contact.relationship || contact.relationship.trim().length < 2) {
    return { isValid: false, error: 'Relationship is required' };
  }
  return { isValid: true };
};

/**
 * Privacy level descriptions
 */
export const PRIVACY_LEVELS = {
  PUBLIC: 'public',
  FRIENDS: 'friends',
  PRIVATE: 'private'
};

export const getPrivacyLevelLabel = (level) => {
  const labels = {
    public: 'Public - Visible to everyone',
    friends: 'Friends Only - Visible to followers',
    private: 'Private - Only you can see'
  };
  return labels[level] || 'Unknown';
};

export const getPrivacyLevelDescription = (level) => {
  const descriptions = {
    public: 'Everyone in your gym can see your progress',
    friends: 'Only people you follow can see your progress',
    private: 'No one can see your progress'
  };
  return descriptions[level] || '';
};

/**
 * Data export formats
 */
export const EXPORT_FORMATS = {
  JSON: 'json',
  CSV: 'csv',
  PDF: 'pdf'
};

/**
 * Generate export filename
 */
export const generateExportFilename = (userId, format) => {
  const date = new Date().toISOString().split('T')[0];
  return `crunchfit-data-${userId}-${date}.${format}`;
};

/**
 * Account deletion confirmation steps
 */
export const ACCOUNT_DELETION_STEPS = [
  {
    id: 1,
    title: 'Confirmation',
    description: 'Confirm you want to delete your account'
  },
  {
    id: 2,
    title: 'Cancel Memberships',
    description: 'Cancel any active memberships'
  },
  {
    id: 3,
    title: 'Download Data',
    description: 'Download your fitness data (optional)'
  },
  {
    id: 4,
    title: 'Final Confirmation',
    description: 'Enter your password to confirm deletion'
  }
];

/**
 * Settings page sections
 */
export const SETTINGS_SECTIONS = {
  PROFILE: 'profile',
  MEMBERSHIP: 'membership',
  NOTIFICATIONS: 'notifications',
  PRIVACY: 'privacy',
  SECURITY: 'security'
};

export const getSectionLabel = (section) => {
  const labels = {
    profile: 'Profile',
    membership: 'Membership',
    notifications: 'Notifications',
    privacy: 'Privacy',
    security: 'Security'
  };
  return labels[section] || section;
};
