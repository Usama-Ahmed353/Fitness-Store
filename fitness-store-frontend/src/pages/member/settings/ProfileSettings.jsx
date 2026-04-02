import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Camera,
  Save,
  X,
  Phone,
  Cake,
  MapPin,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { useLanguage } from '../../../context/LanguageContext';
import {
  validatePhone,
  formatPhone,
  validateDateOfBirth,
  formatDate,
  validateEmergencyContact
} from '../../../utils/settingsCalculator';

const ProfileSettings = ({ userId, currentUser, onUnsavedChanges, onUpdate }) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    dateOfBirth: currentUser?.dateOfBirth || '',
    profilePhoto: currentUser?.profilePhoto || null,
    emergencyContact: {
      name: currentUser?.emergencyContact?.name || '',
      phone: currentUser?.emergencyContact?.phone || '',
      relationship: currentUser?.emergencyContact?.relationship || ''
    },
    medicalNotes: currentUser?.medicalNotes || '',
    fitnessGoals: currentUser?.fitnessGoals || ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [photoPreview, setPhotoPreview] = useState(currentUser?.profilePhoto);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    onUnsavedChanges(true);
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleEmergencyContactChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      emergencyContact: { ...prev.emergencyContact, [field]: value }
    }));
    onUnsavedChanges(true);
    if (errors[`emergencyContact.${field}`]) {
      setErrors(prev => ({ ...prev, [`emergencyContact.${field}`]: '' }));
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, photo: 'Image must be less than 5MB' }));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        setFormData(prev => ({ ...prev, profilePhoto: file }));
        onUnsavedChanges(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field);
  };

  const validateField = (field) => {
    const newErrors = { ...errors };

    if (field === 'phone' && formData.phone.trim()) {
      if (!validatePhone(formData.phone)) {
        newErrors.phone = 'Invalid phone number format';
      } else {
        delete newErrors.phone;
      }
    }

    if (field === 'dateOfBirth' && formData.dateOfBirth) {
      const { isValid, age } = validateDateOfBirth(formData.dateOfBirth);
      if (!isValid) {
        newErrors.dateOfBirth = 'You must be at least 18 years old';
      } else {
        delete newErrors.dateOfBirth;
      }
    }

    if (field === 'emergencyContact.phone' && formData.emergencyContact.phone.trim()) {
      if (!validatePhone(formData.emergencyContact.phone)) {
        newErrors['emergencyContact.phone'] = 'Invalid phone number format';
      } else {
        delete newErrors['emergencyContact.phone'];
      }
    }

    setErrors(newErrors);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';

    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = 'Invalid phone number';
    }

    if (formData.dateOfBirth) {
      const { isValid } = validateDateOfBirth(formData.dateOfBirth);
      if (!isValid) {
        newErrors.dateOfBirth = 'Must be 18+ years old';
      }
    }

    if (formData.emergencyContact.name || formData.emergencyContact.phone || formData.emergencyContact.relationship) {
      const ecValidation = validateEmergencyContact(formData.emergencyContact);
      if (!ecValidation.isValid) {
        newErrors['emergencyContact'] = ecValidation.error;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSaving(true);
    setSaveStatus(null);

    // Simulate API call
    setTimeout(() => {
      setSaveStatus({
        type: 'success',
        message: 'Profile updated successfully!'
      });
      setIsSaving(false);
      onUnsavedChanges(false);
      onUpdate?.();
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
          {t('settings.profile') || 'Profile'}
        </h2>
        <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {t('settings.profileDescription') || 'Update your personal information'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Photo Upload */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
        >
          <label className={`block text-sm font-medium mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            {t('settings.profilePhoto') || 'Profile Photo'}
          </label>

          <div className="flex items-center gap-6">
            {/* Photo Preview */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 overflow-hidden flex items-center justify-center">
                {photoPreview ? (
                  <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl">{currentUser?.avatar || '👤'}</span>
                )}
              </div>

              <label
                htmlFor="photo-input"
                className="absolute bottom-0 right-0 bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-full cursor-pointer transition-colors"
              >
                <Camera size={16} />
              </label>
              <input
                id="photo-input"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>

            <div>
              <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                {t('settings.uploadNewPhoto') || 'Upload a new photo'}
              </p>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {t('settings.photoRequirements') || 'JPG, PNG or GIF. 5MB max.'}
              </p>
              {errors.photo && (
                <p className="text-xs text-red-400 mt-1">{errors.photo}</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Basic Information */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`p-6 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
        >
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {t('settings.basicInfo') || 'Basic Information'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {t('common.firstName') || 'First Name'}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                onBlur={() => handleBlur('firstName')}
                className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                  errors.firstName
                    ? isDark
                      ? 'border-red-500 bg-red-500/10'
                      : 'border-red-400 bg-red-50'
                    : isDark
                    ? 'bg-gray-700 border-gray-600 focus:border-orange-400'
                    : 'bg-white border-gray-300 focus:border-orange-400'
                } text-${isDark ? 'white' : 'gray-900'} placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-400`}
              />
              {errors.firstName && <p className="text-xs text-red-400 mt-1">{errors.firstName}</p>}
            </div>

            {/* Last Name */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {t('common.lastName') || 'Last Name'}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                onBlur={() => handleBlur('lastName')}
                className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                  errors.lastName
                    ? isDark
                      ? 'border-red-500 bg-red-500/10'
                      : 'border-red-400 bg-red-50'
                    : isDark
                    ? 'bg-gray-700 border-gray-600 focus:border-orange-400'
                    : 'bg-white border-gray-300 focus:border-orange-400'
                } text-${isDark ? 'white' : 'gray-900'} placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-400`}
              />
              {errors.lastName && <p className="text-xs text-red-400 mt-1">{errors.lastName}</p>}
            </div>

            {/* Email (read-only) */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {t('common.email') || 'Email'}
              </label>
              <input
                type="email"
                value={formData.email}
                readOnly
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDark ? 'bg-gray-700 border-gray-600 text-gray-400' : 'bg-gray-100 border-gray-300 text-gray-600'
                } opacity-50 cursor-not-allowed`}
              />
              <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {t('settings.emailNote') || 'Contact support to change email'}
              </p>
            </div>

            {/* Phone */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                <Phone size={16} className="inline mr-1" />
                {t('common.phone') || 'Phone'}
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                onBlur={() => handleBlur('phone')}
                placeholder="(123) 456-7890"
                className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                  errors.phone
                    ? isDark
                      ? 'border-red-500 bg-red-500/10'
                      : 'border-red-400 bg-red-50'
                    : isDark
                    ? 'bg-gray-700 border-gray-600 focus:border-orange-400'
                    : 'bg-white border-gray-300 focus:border-orange-400'
                } text-${isDark ? 'white' : 'gray-900'} placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-400`}
              />
              {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone}</p>}
            </div>

            {/* Date of Birth */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                <Cake size={16} className="inline mr-1" />
                {t('common.dateOfBirth') || 'Date of Birth'}
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                onBlur={() => handleBlur('dateOfBirth')}
                className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                  errors.dateOfBirth
                    ? isDark
                      ? 'border-red-500 bg-red-500/10'
                      : 'border-red-400 bg-red-50'
                    : isDark
                    ? 'bg-gray-700 border-gray-600 focus:border-orange-400'
                    : 'bg-white border-gray-300 focus:border-orange-400'
                } text-${isDark ? 'white' : 'gray-900'} focus:outline-none focus:ring-1 focus:ring-orange-400`}
              />
              {errors.dateOfBirth && <p className="text-xs text-red-400 mt-1">{errors.dateOfBirth}</p>}
            </div>
          </div>
        </motion.div>

        {/* Emergency Contact */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`p-6 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
        >
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {t('settings.emergencyContact') || 'Emergency Contact'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Contact Name */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {t('common.name') || 'Name'}
              </label>
              <input
                type="text"
                value={formData.emergencyContact.name}
                onChange={(e) => handleEmergencyContactChange('name', e.target.value)}
                placeholder="Full name"
                className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                  isDark
                    ? 'bg-gray-700 border-gray-600 focus:border-orange-400'
                    : 'bg-white border-gray-300 focus:border-orange-400'
                } text-${isDark ? 'white' : 'gray-900'} placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-400`}
              />
            </div>

            {/* Contact Phone */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {t('common.phone') || 'Phone'}
              </label>
              <input
                type="tel"
                value={formData.emergencyContact.phone}
                onChange={(e) => handleEmergencyContactChange('phone', e.target.value)}
                placeholder="(123) 456-7890"
                className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                  errors['emergencyContact.phone']
                    ? isDark
                      ? 'border-red-500 bg-red-500/10'
                      : 'border-red-400 bg-red-50'
                    : isDark
                    ? 'bg-gray-700 border-gray-600 focus:border-orange-400'
                    : 'bg-white border-gray-300 focus:border-orange-400'
                } text-${isDark ? 'white' : 'gray-900'} placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-400`}
              />
              {errors['emergencyContact.phone'] && (
                <p className="text-xs text-red-400 mt-1">{errors['emergencyContact.phone']}</p>
              )}
            </div>

            {/* Relationship */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {t('settings.relationship') || 'Relationship'}
              </label>
              <input
                type="text"
                value={formData.emergencyContact.relationship}
                onChange={(e) => handleEmergencyContactChange('relationship', e.target.value)}
                placeholder="e.g., Spouse, Parent, Friend"
                className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                  isDark
                    ? 'bg-gray-700 border-gray-600 focus:border-orange-400'
                    : 'bg-white border-gray-300 focus:border-orange-400'
                } text-${isDark ? 'white' : 'gray-900'} placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-400`}
              />
            </div>
          </div>
        </motion.div>

        {/* Medical Notes & Fitness Goals */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`p-6 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
        >
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {t('settings.healthAndGoals') || 'Health & Goals'}
          </h3>

          <div className="space-y-4">
            {/* Medical Notes */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {t('settings.medicalNotes') || 'Medical Notes (Visible to Trainers)'}
              </label>
              <textarea
                name="medicalNotes"
                value={formData.medicalNotes}
                onChange={handleInputChange}
                placeholder="Any injuries, allergies, or health conditions trainers should know about..."
                rows="3"
                className={`w-full px-4 py-2 rounded-lg border transition-colors resize-none ${
                  isDark
                    ? 'bg-gray-700 border-gray-600 focus:border-orange-400 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 focus:border-orange-400 text-gray-900 placeholder-gray-600'
                } focus:outline-none focus:ring-1 focus:ring-orange-400`}
              />
            </div>

            {/* Fitness Goals */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {t('settings.fitnessGoals') || 'Fitness Goals'}
              </label>
              <textarea
                name="fitnessGoals"
                value={formData.fitnessGoals}
                onChange={handleInputChange}
                placeholder="What are your fitness objectives? (e.g., lose weight, build muscle, improve endurance)..."
                rows="3"
                className={`w-full px-4 py-2 rounded-lg border transition-colors resize-none ${
                  isDark
                    ? 'bg-gray-700 border-gray-600 focus:border-orange-400 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 focus:border-orange-400 text-gray-900 placeholder-gray-600'
                } focus:outline-none focus:ring-1 focus:ring-orange-400`}
              />
            </div>
          </div>
        </motion.div>

        {/* Save Status */}
        {saveStatus && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg flex items-center gap-3 ${
              saveStatus.type === 'success'
                ? isDark
                  ? 'bg-green-500/20 border border-green-500/30'
                  : 'bg-green-50 border border-green-200'
                : 'bg-red-500/20 border border-red-500/30'
            }`}
          >
            {saveStatus.type === 'success' ? (
              <CheckCircle size={20} className="text-green-400 flex-shrink-0" />
            ) : (
              <AlertCircle size={20} className="text-red-400 flex-shrink-0" />
            )}
            <p className={`font-medium ${saveStatus.type === 'success' ? (isDark ? 'text-green-400' : 'text-green-800') : (isDark ? 'text-red-400' : 'text-red-800')}`}>
              {saveStatus.message}
            </p>
          </motion.div>
        )}

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isSaving}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          {isSaving ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
              />
              {t('common.saving') || 'Saving...'}
            </>
          ) : (
            <>
              <Save size={20} />
              {t('common.saveChanges') || 'Save Changes'}
            </>
          )}
        </motion.button>
      </form>
    </div>
  );
};

export default ProfileSettings;
