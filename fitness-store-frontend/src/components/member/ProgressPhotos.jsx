import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../hooks/useLanguage';
import { Upload, Trash2, ChevronLeft, ChevronRight, X } from 'lucide-react';

/**
 * ProgressPhotos - Display and manage progress photos for body transformation tracking
 */
const ProgressPhotos = ({ photos = [], onUploadPhoto, onDeletePhoto }) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);

  // Sort photos by date (newest first)
  const sortedPhotos = [...photos].sort(
    (a, b) => new Date(b.dateAdded) - new Date(a.dateAdded)
  );

  const handlePrevPhoto = () => {
    setSelectedPhotoIndex((prev) =>
      prev === 0 ? sortedPhotos.length - 1 : prev - 1
    );
  };

  const handleNextPhoto = () => {
    setSelectedPhotoIndex((prev) =>
      prev === sortedPhotos.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3
          className={`text-2xl font-bold mb-2 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}
        >
          {t('member.progressPhotos.title') || 'Progress Photos'}
        </h3>
        <p
          className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
        >
          {t('member.progressPhotos.description') ||
            'Track your body transformation with regular progress photos'}
        </p>
      </div>

      {/* Upload Section */}
      <div
        className={`p-6 rounded-lg border-2 border-dashed transition-all cursor-pointer ${
          isDark
            ? 'border-gray-600 hover:border-accent/50 hover:bg-gray-700/30'
            : 'border-gray-300 hover:border-accent/50 hover:bg-gray-50'
        }`}
        onClick={() => document.getElementById('photo-upload').click()}
      >
        <input
          id="photo-upload"
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const files = Array.from(e.target.files);
            files.forEach((file) => {
              onUploadPhoto?.(file);
            });
          }}
        />
        <div className="text-center">
          <Upload
            className={`w-8 h-8 mx-auto mb-3 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}
          />
          <p className={`font-semibold ${isDark ? 'text-white' : ''}`}>
            {t('member.progressPhotos.uploadPhotos') ||
              'Click to upload progress photos'}
          </p>
          <p
            className={`text-sm mt-1 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            {t('member.progressPhotos.supportedFormats') ||
              'PNG, JPG, GIF up to 10MB'}
          </p>
        </div>
      </div>

      {/* Photos Grid */}
      {sortedPhotos.length > 0 ? (
        <>
          {/* Grid View */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sortedPhotos.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                className="relative group"
              >
                <div
                  className={`rounded-lg overflow-hidden aspect-square cursor-pointer ${
                    isDark ? 'bg-gray-700' : 'bg-gray-200'
                  }`}
                  onClick={() => setSelectedPhotoIndex(index)}
                >
                  <img
                    src={photo.imageUrl}
                    alt={`Progress ${photo.dateAdded}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Date Badge */}
                <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {new Date(photo.dateAdded).toLocaleDateString('en-US')}
                </div>

                {/* Delete Button */}
                <motion.button
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  onClick={() => onDeletePhoto?.(photo.id)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>

                {/* View Button */}
                <motion.button
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg"
                >
                  <span
                    className={`text-white font-semibold ${
                      isDark ? '' : ''
                    }`}
                  >
                    {t('member.progressPhotos.view') || 'View'}
                  </span>
                </motion.button>
              </motion.div>
            ))}
          </div>

          {/* Lightbox */}
          {selectedPhotoIndex !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPhotoIndex(null)}
              className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-4xl"
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedPhotoIndex(null)}
                  className="absolute -top-12 right-0 text-white hover:text-gray-300"
                >
                  <X className="w-8 h-8" />
                </button>

                {/* Image */}
                <img
                  src={sortedPhotos[selectedPhotoIndex].imageUrl}
                  alt="Progress"
                  className="w-full rounded-lg"
                />

                {/* Navigation Buttons */}
                {sortedPhotos.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevPhoto}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-lg transition-all"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={handleNextPhoto}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-lg transition-all"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}

                {/* Photo Info */}
                <div className="mt-4 text-center text-white">
                  <p className="text-sm">
                    {selectedPhotoIndex + 1} of {sortedPhotos.length}
                  </p>
                  <p className="text-xs mt-1 text-gray-300">
                    {new Date(
                      sortedPhotos[selectedPhotoIndex].dateAdded
                    ).toLocaleDateString('en-US')}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </>
      ) : (
        // Empty State
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`text-center py-12 rounded-lg ${
            isDark ? 'bg-gray-700/30' : 'bg-gray-50'
          }`}
        >
          <div
            className={`text-4xl mb-3 ${isDark ? 'text-gray-600' : ''}`}
          >
            📸
          </div>
          <p
            className={`font-semibold ${
              isDark ? 'text-gray-300' : 'text-gray-900'
            }`}
          >
            {t('member.progressPhotos.noPhotos') ||
              'No progress photos yet'}
          </p>
          <p
            className={`text-sm mt-1 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            {t('member.progressPhotos.uploadFirst') ||
              'Upload your first progress photo to get started'}
          </p>
        </motion.div>
      )}

      {/* Stats */}
      {sortedPhotos.length > 0 && (
        <div
          className={`p-4 rounded-lg text-center ${
            isDark ? 'bg-gray-700/30' : 'bg-gray-50'
          }`}
        >
          <p
            className={`text-sm font-semibold ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            {t('member.progressPhotos.totalPhotos') || 'Total Photos'}{' '}
            <span
              className={`font-bold text-lg ml-2 ${
                isDark ? 'text-accent' : 'text-accent'
              }`}
            >
              {sortedPhotos.length}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default ProgressPhotos;
