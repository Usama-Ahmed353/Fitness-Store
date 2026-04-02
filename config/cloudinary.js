const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create storage for gym photos
const gymPhotoStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'crunchfit/gyms',
    format: 'png',
    public_id: (req, file) => {
      return `gym-${req.params.id || req.body.gymId}-${Date.now()}`;
    },
  },
});

// Create storage for profile photos
const profilePhotoStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'crunchfit/profiles',
    format: 'png',
    public_id: (req, file) => {
      return `user-${req.user.id}-${Date.now()}`;
    },
  },
});

// Create storage for class thumbnails
const classThumbStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'crunchfit/classes',
    format: 'png',
    public_id: (req, file) => {
      return `class-${req.params.id || req.body.classId}-${Date.now()}`;
    },
  },
});

// Create multer instances
const uploadGymPhotos = multer({
  storage: gymPhotoStorage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images are allowed.'));
    }
  },
});

const uploadProfilePhoto = multer({
  storage: profilePhotoStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG and PNG are allowed.'));
    }
  },
});

const uploadClassThumb = multer({
  storage: classThumbStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG and PNG are allowed.'));
    }
  },
});

module.exports = {
  cloudinary,
  uploadGymPhotos,
  uploadProfilePhoto,
  uploadClassThumb,
};
