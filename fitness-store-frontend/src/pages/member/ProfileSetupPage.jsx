import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Upload, X, Check } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';

// Validation schema
const profileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  birthday: z.string().nonempty('Birthday is required'),
  emergencyContactName: z.string().min(2, 'Emergency contact name is required'),
  emergencyContactPhone: z.string().regex(/^\d{10}$|^\d{3}-\d{3}-\d{4}$/, 'Valid phone number required'),
  medicalNotes: z.string().optional(),
});

const ProfileSetupPage = () => {
  const navigate = useNavigate();
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
  });

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }

      // Validate file type
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        toast.error('Only JPG, PNG, and WebP images are allowed');
        return;
      }

      setPhotoFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);

      toast.success('Photo selected');
    }
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  const uploadPhotoToCloudinary = async (file) => {
    setUploadingPhoto(true);
    try {
      // Mock Cloudinary upload - in production, use actual Cloudinary API
      // const formData = new FormData();
      // formData.append('file', file);
      // formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_PRESET);
      // const response = await axios.post(
      //   `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_NAME}/image/upload`,
      //   formData
      // );
      // return response.data.secure_url;

      // Simulate upload
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return photoPreview; // Use data URL in demo
    } catch (error) {
      throw new Error('Failed to upload photo');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const onSubmit = async (data) => {
    if (!photoFile && !photoPreview) {
      toast.error('Please upload a profile photo');
      return;
    }

    setIsSubmitting(true);
    try {
      let photoUrl = photoPreview;

      // Upload photo if it's a new file
      if (photoFile) {
        photoUrl = await uploadPhotoToCloudinary(photoFile);
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Save profile data
      const profileData = {
        ...data,
        photoUrl,
      };

      localStorage.setItem('profileData', JSON.stringify(profileData));

      toast.success('Profile completed successfully!');
      navigate('/member/dashboard');
    } catch (error) {
      toast.error(error.message || 'Failed to save profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-dark-navy via-dark-navy/95 to-accent/5 py-12 px-4"
    >
      <div className="max-w-2xl mx-auto">
        <Card variant="default" className="border border-accent/30 p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Complete Your Profile</h1>
            <p className="text-light-bg/70">
              Add your personal information to get started
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Photo Upload Section */}
            <div>
              <label className="text-lg font-semibold text-white mb-4 block">Profile Photo</label>
              
              {photoPreview ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-4"
                >
                  <div className="relative w-32 h-32 mx-auto">
                    <img
                      src={photoPreview}
                      alt="Profile preview"
                      className="w-full h-full object-cover rounded-lg border-2 border-accent"
                    />
                    <motion.button
                      type="button"
                      onClick={handleRemovePhoto}
                      whileHover={{ scale: 1.1 }}
                      className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors"
                    >
                      <X size={16} />
                    </motion.button>
                  </div>
                  <p className="text-center text-light-bg/70 text-sm mt-4">
                    {uploadingPhoto ? 'Uploading...' : 'Photo selected'}
                  </p>
                </motion.div>
              ) : (
                <label className="block">
                  <div className="border-2 border-dashed border-accent/40 rounded-lg p-8 text-center cursor-pointer hover:border-accent/70 transition-colors">
                    <div className="flex flex-col items-center">
                      <Upload size={40} className="text-accent mb-3" />
                      <p className="font-semibold text-white mb-1">Click to upload or drag and drop</p>
                      <p className="text-light-bg/70 text-sm">PNG, JPG, WebP (max. 5MB)</p>
                    </div>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  label="First Name"
                  placeholder="John"
                  {...register('firstName')}
                  error={errors.firstName?.message}
                />
              </div>
              <div>
                <Input
                  label="Last Name"
                  placeholder="Doe"
                  {...register('lastName')}
                  error={errors.lastName?.message}
                />
              </div>
            </div>

            {/* Birthday */}
            <div>
              <Input
                label="Birthday"
                type="date"
                {...register('birthday')}
                error={errors.birthday?.message}
              />
            </div>

            {/* Emergency Contact */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Emergency Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Contact Name"
                  placeholder="Jane Doe"
                  {...register('emergencyContactName')}
                  error={errors.emergencyContactName?.message}
                />
                <Input
                  label="Contact Phone"
                  placeholder="(555) 123-4567"
                  {...register('emergencyContactPhone')}
                  error={errors.emergencyContactPhone?.message}
                />
              </div>
            </div>

            {/* Medical Notes */}
            <div>
              <label className="text-lg font-semibold text-white mb-2 block">Medical Notes (Optional)</label>
              <textarea
                {...register('medicalNotes')}
                placeholder="Any injuries, allergies, or medical conditions we should know about?"
                className="w-full bg-dark-navy/50 border border-accent/30 rounded-lg p-3 text-white placeholder-light-bg/50 focus:outline-none focus:border-accent resize-none"
                rows={4}
              />
              <p className="text-light-bg/60 text-xs mt-2">
                This information helps us create a safer, more personalized experience
              </p>
            </div>

            {/* Terms Confirmation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-accent/10 border border-accent/30 rounded-lg p-4"
            >
              <p className="text-light-bg/80 text-sm">
                By completing your profile, you agree to our{' '}
                <a href="/terms" className="text-accent hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="/privacy" className="text-accent hover:underline">
                  Privacy Policy
                </a>
              </p>
            </motion.div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={isSubmitting || uploadingPhoto}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Saving Profile...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Check size={20} />
                  Complete Profile
                </span>
              )}
            </Button>
          </form>
        </Card>
      </div>
    </motion.div>
  );
};

export default ProfileSetupPage;
