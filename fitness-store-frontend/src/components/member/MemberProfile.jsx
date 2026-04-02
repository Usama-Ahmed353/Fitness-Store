import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../hooks/useLanguage';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Weight,
  Ruler,
  Heart,
  Target,
  Edit,
  Save,
  X,
  Upload,
} from 'lucide-react';

/**
 * MemberProfile - Display and edit member profile information
 */
const MemberProfile = () => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Fitness Street, Health City, HC 12345',
    profileImage: '/profile.jpg',
    dateOfBirth: '1990-05-15',
    gender: 'Male',
    height: 180, // cm
    weight: 75, // kg
    targetWeight: 70, // kg
    fitnessGoal: 'Weight Loss',
    medicalConditions: '',
    injuries: '',
    emergencyContact: 'Jane Doe',
    emergencyPhone: '+1 (555) 987-6543',
    membershipType: 'Premium',
    joinDate: '2023-01-15',
    nextRenewalDate: '2024-03-15',
  });

  const [editedProfile, setEditedProfile] = useState(profile);

  const fitnessGoals = [
    'Weight Loss',
    'Muscle Building',
    'General Fitness',
    'Athletic Performance',
    'Flexibility & Mobility',
  ];

  const handleEdit = () => {
    setEditedProfile(profile);
    setIsEditing(true);
  };

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
    // API call to save profile
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setEditedProfile((prev) => ({
          ...prev,
          profileImage: event.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const calculateBMI = () => {
    const heightInMeters = profile.height / 100;
    return (profile.weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1
            className={`text-4xl font-bold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            {t('member.profile.myProfile') || 'My Profile'}
          </h1>
          <p
            className={`text-sm mt-1 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            {t('member.profile.manageYourProfile') ||
              'Manage your personal information and fitness details'}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => (isEditing ? handleCancel() : handleEdit())}
          className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
            isEditing
              ? isDark
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
              : 'bg-accent text-white hover:bg-accent/90'
          }`}
        >
          {isEditing ? (
            <>
              <X className="w-4 h-4" />
              {t('member.profile.cancel') || 'Cancel'}
            </>
          ) : (
            <>
              <Edit className="w-4 h-4" />
              {t('member.profile.edit') || 'Edit'}
            </>
          )}
        </motion.button>
      </div>

      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`rounded-lg border p-6 ${
          isDark
            ? 'border-gray-700 bg-gray-800'
            : 'border-gray-200 bg-white'
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Image Section */}
          <div className="md:col-span-1 flex flex-col items-center">
            <div className="relative">
              <img
                src={isEditing ? editedProfile.profileImage : profile.profileImage}
                alt={profile.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-accent"
              />
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-accent text-white p-2 rounded-full cursor-pointer hover:bg-accent/90 transition-all">
                  <Upload className="w-5 h-5" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfileImageChange}
                  />
                </label>
              )}
            </div>
            <h2
              className={`text-2xl font-bold mt-4 text-center ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              {isEditing ? editedProfile.name : profile.name}
            </h2>
            <p
              className={`text-sm text-center mt-1 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              {profile.membershipType} {t('member.profile.member') || 'Member'}
            </p>

            {/* Membership Info */}
            <div
              className={`w-full mt-6 p-4 rounded-lg ${
                isDark ? 'bg-gray-700/50' : 'bg-gray-50'
              }`}
            >
              <div className="space-y-3 text-sm">
                <div>
                  <p
                    className={`font-semibold ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}
                  >
                    {t('member.profile.memberSince') || 'Member Since'}
                  </p>
                  <p
                    className={`font-bold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {new Date(profile.joinDate).toLocaleDateString(
                      'en-US'
                    )}
                  </p>
                </div>
                <div>
                  <p
                    className={`font-semibold ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}
                  >
                    {t('member.profile.nextRenewal') || 'Next Renewal'}
                  </p>
                  <p
                    className={`font-bold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {new Date(profile.nextRenewalDate).toLocaleDateString(
                      'en-US'
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact & Personal Info */}
          <div className="md:col-span-2 space-y-6">
            {/* Contact Section */}
            <div>
              <h3
                className={`text-lg font-bold mb-4 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                {t('member.profile.contactInformation') ||
                  'Contact Information'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <ProfileField
                  label={t('member.profile.fullName') || 'Full Name'}
                  value={isEditing ? editedProfile.name : profile.name}
                  icon={<User className="w-5 h-5" />}
                  onChange={(value) =>
                    setEditedProfile((prev) => ({
                      ...prev,
                      name: value,
                    }))
                  }
                  isEditing={isEditing}
                />

                {/* Email */}
                <ProfileField
                  label={t('member.profile.email') || 'Email'}
                  value={isEditing ? editedProfile.email : profile.email}
                  icon={<Mail className="w-5 h-5" />}
                  type="email"
                  onChange={(value) =>
                    setEditedProfile((prev) => ({
                      ...prev,
                      email: value,
                    }))
                  }
                  isEditing={isEditing}
                />

                {/* Phone */}
                <ProfileField
                  label={t('member.profile.phone') || 'Phone'}
                  value={isEditing ? editedProfile.phone : profile.phone}
                  icon={<Phone className="w-5 h-5" />}
                  type="tel"
                  onChange={(value) =>
                    setEditedProfile((prev) => ({
                      ...prev,
                      phone: value,
                    }))
                  }
                  isEditing={isEditing}
                />

                {/* Address */}
                <ProfileField
                  label={t('member.profile.address') || 'Address'}
                  value={isEditing ? editedProfile.address : profile.address}
                  icon={<MapPin className="w-5 h-5" />}
                  onChange={(value) =>
                    setEditedProfile((prev) => ({
                      ...prev,
                      address: value,
                    }))
                  }
                  isEditing={isEditing}
                  full
                />
              </div>
            </div>

            {/* Personal Details */}
            <div>
              <h3
                className={`text-lg font-bold mb-4 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                {t('member.profile.personalDetails') || 'Personal Details'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Date of Birth */}
                <ProfileField
                  label={t('member.profile.dateOfBirth') || 'Date of Birth'}
                  value={
                    isEditing
                      ? editedProfile.dateOfBirth
                      : profile.dateOfBirth
                  }
                  type="date"
                  onChange={(value) =>
                    setEditedProfile((prev) => ({
                      ...prev,
                      dateOfBirth: value,
                    }))
                  }
                  isEditing={isEditing}
                />

                {/* Gender */}
                <div>
                  <label
                    className={`text-sm font-semibold block mb-2 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    {t('member.profile.gender') || 'Gender'}
                  </label>
                  {isEditing ? (
                    <select
                      value={editedProfile.gender}
                      onChange={(e) =>
                        setEditedProfile((prev) => ({
                          ...prev,
                          gender: e.target.value,
                        }))
                      }
                      className={`w-full p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-accent ${
                        isDark
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300'
                      }`}
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  ) : (
                    <p
                      className={`p-2 ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      {profile.gender}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Fitness Information */}
            <div>
              <h3
                className={`text-lg font-bold mb-4 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                {t('member.profile.fitnessInformation') ||
                  'Fitness Information'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Height */}
                <ProfileField
                  label={t('member.profile.height') || 'Height (cm)'}
                  value={
                    isEditing ? editedProfile.height : profile.height
                  }
                  icon={<Ruler className="w-5 h-5" />}
                  type="number"
                  onChange={(value) =>
                    setEditedProfile((prev) => ({
                      ...prev,
                      height: parseInt(value),
                    }))
                  }
                  isEditing={isEditing}
                />

                {/* Current Weight */}
                <ProfileField
                  label={t('member.profile.currentWeight') ||
                    'Current Weight (kg)'}
                  value={
                    isEditing ? editedProfile.weight : profile.weight
                  }
                  icon={<Weight className="w-5 h-5" />}
                  type="number"
                  onChange={(value) =>
                    setEditedProfile((prev) => ({
                      ...prev,
                      weight: parseInt(value),
                    }))
                  }
                  isEditing={isEditing}
                />

                {/* Target Weight */}
                <ProfileField
                  label={t('member.profile.targetWeight') ||
                    'Target Weight (kg)'}
                  value={
                    isEditing
                      ? editedProfile.targetWeight
                      : profile.targetWeight
                  }
                  icon={<Target className="w-5 h-5" />}
                  type="number"
                  onChange={(value) =>
                    setEditedProfile((prev) => ({
                      ...prev,
                      targetWeight: parseInt(value),
                    }))
                  }
                  isEditing={isEditing}
                />

                {/* Fitness Goal */}
                <div>
                  <label
                    className={`text-sm font-semibold block mb-2 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    {t('member.profile.fitnessGoal') || 'Fitness Goal'}
                  </label>
                  {isEditing ? (
                    <select
                      value={editedProfile.fitnessGoal}
                      onChange={(e) =>
                        setEditedProfile((prev) => ({
                          ...prev,
                          fitnessGoal: e.target.value,
                        }))
                      }
                      className={`w-full p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-accent ${
                        isDark
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300'
                      }`}
                    >
                      {fitnessGoals.map((goal) => (
                        <option key={goal} value={goal}>
                          {goal}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p
                      className={`p-2 ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      {profile.fitnessGoal}
                    </p>
                  )}
                </div>

                {/* BMI */}
                <div
                  className={`p-3 rounded-lg ${
                    isDark ? 'bg-gray-700/50' : 'bg-gray-50'
                  }`}
                >
                  <label
                    className={`text-sm font-semibold block mb-1 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    {t('member.profile.bmi') || 'BMI'}
                  </label>
                  <p
                    className={`text-2xl font-bold flex items-center gap-2 ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    <Heart className="w-5 h-5 text-red-500" />
                    {calculateBMI()}
                  </p>
                </div>
              </div>
            </div>

            {/* Health Information */}
            <div>
              <h3
                className={`text-lg font-bold mb-4 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                {t('member.profile.healthInformation') ||
                  'Health Information'}
              </h3>
              <div className="space-y-4">
                {/* Medical Conditions */}
                <div>
                  <label
                    className={`text-sm font-semibold block mb-2 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    {t('member.profile.medicalConditions') ||
                      'Medical Conditions'}
                  </label>
                  {isEditing ? (
                    <textarea
                      value={editedProfile.medicalConditions}
                      onChange={(e) =>
                        setEditedProfile((prev) => ({
                          ...prev,
                          medicalConditions: e.target.value,
                        }))
                      }
                      placeholder={
                        t('member.profile.medicalPlaceholder') ||
                        'List any medical conditions (diabetes, hypertension, etc.)'
                      }
                      className={`w-full p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-accent resize-none ${
                        isDark
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 placeholder-gray-500'
                      }`}
                      rows="2"
                    />
                  ) : (
                    <p
                      className={`p-2 ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      {profile.medicalConditions || 'None reported'}
                    </p>
                  )}
                </div>

                {/* Injuries */}
                <div>
                  <label
                    className={`text-sm font-semibold block mb-2 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    {t('member.profile.injuries') || 'Previous Injuries'}
                  </label>
                  {isEditing ? (
                    <textarea
                      value={editedProfile.injuries}
                      onChange={(e) =>
                        setEditedProfile((prev) => ({
                          ...prev,
                          injuries: e.target.value,
                        }))
                      }
                      placeholder={
                        t('member.profile.injuriesPlaceholder') ||
                        'List any previous or current injuries'
                      }
                      className={`w-full p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-accent resize-none ${
                        isDark
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 placeholder-gray-500'
                      }`}
                      rows="2"
                    />
                  ) : (
                    <p
                      className={`p-2 ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      {profile.injuries || 'None reported'}
                    </p>
                  )}
                </div>

                {/* Emergency Contact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ProfileField
                    label={t('member.profile.emergencyContact') ||
                      'Emergency Contact'}
                    value={
                      isEditing
                        ? editedProfile.emergencyContact
                        : profile.emergencyContact
                    }
                    onChange={(value) =>
                      setEditedProfile((prev) => ({
                        ...prev,
                        emergencyContact: value,
                      }))
                    }
                    isEditing={isEditing}
                  />

                  <ProfileField
                    label={t('member.profile.emergencyPhone') ||
                      'Emergency Phone'}
                    value={
                      isEditing
                        ? editedProfile.emergencyPhone
                        : profile.emergencyPhone
                    }
                    type="tel"
                    onChange={(value) =>
                      setEditedProfile((prev) => ({
                        ...prev,
                        emergencyPhone: value,
                      }))
                    }
                    isEditing={isEditing}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        {isEditing && (
          <div className="mt-6 pt-6 border-t border-gray-700 dark:border-gray-600 flex gap-3">
            <button
              onClick={handleCancel}
              className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
                isDark
                  ? 'bg-gray-700 text-white hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
              }`}
            >
              {t('member.profile.cancel') || 'Cancel'}
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-3 rounded-lg font-semibold bg-accent text-white hover:bg-accent/90 transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              {t('member.profile.save') || 'Save Changes'}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

/**
 * ProfileField - Reusable component for profile fields
 */
const ProfileField = ({
  label,
  value,
  icon,
  type = 'text',
  onChange,
  isEditing,
  full = false,
}) => {
  const { isDark } = useTheme();

  return (
    <div className={full ? 'md:col-span-2' : ''}>
      <label
        className={`text-sm font-semibold block mb-2 flex items-center gap-2 ${
          isDark ? 'text-gray-300' : 'text-gray-700'
        }`}
      >
        {icon && icon}
        {label}
      </label>
      {isEditing ? (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-accent ${
            isDark
              ? 'bg-gray-700 border-gray-600 text-white'
              : 'bg-white border-gray-300'
          }`}
        />
      ) : (
        <p
          className={`p-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
        >
          {value}
        </p>
      )}
    </div>
  );
};

export default MemberProfile;
