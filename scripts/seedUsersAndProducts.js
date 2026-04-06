require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');

const seedUsers = [
  {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@fitnessstore.com',
    password: 'Admin@123',
    role: 'admin',
    isEmailVerified: true,
    isActive: true,
  },
  {
    firstName: 'Super',
    lastName: 'Admin',
    email: 'superadmin@fitnessstore.com',
    password: 'Super@123',
    role: 'super_admin',
    isEmailVerified: true,
    isActive: true,
  },
  {
    firstName: 'Gym',
    lastName: 'Owner',
    email: 'gymowner@fitnessstore.com',
    password: 'Gym@1234',
    role: 'gym_owner',
    isEmailVerified: true,
    isActive: true,
  },
  {
    firstName: 'John',
    lastName: 'Member',
    email: 'member@fitnessstore.com',
    password: 'Member@123',
    role: 'member',
    isEmailVerified: true,
    isActive: true,
  },
  {
    firstName: 'Trainer',
    lastName: 'Smith',
    email: 'trainer@fitnessstore.com',
    password: 'Trainer@123',
    role: 'trainer',
    isEmailVerified: true,
    isActive: true,
  },
];

const seedProducts = [
  {
    title: 'Whey Protein Isolate 2lb',
    description: 'High-quality whey isolate with 25g protein per scoop for muscle growth and recovery.',
    price: 59.99,
    discount: 10,
    category: 'supplements',
    brand: 'Optimum Nutrition',
    stock: 150,
    tags: ['protein', 'whey', 'recovery'],
    isFeatured: true,
    weight: 900,
    images: [{ url: 'https://placehold.co/600x600?text=Whey+Protein', alt: 'Whey Protein Isolate' }],
  },
  {
    title: 'BCAA Energy Drink Mix',
    description: 'BCAA blend with caffeine to support muscle recovery, reduce fatigue, and boost endurance.',
    price: 29.99,
    discount: 0,
    category: 'supplements',
    brand: 'EVL',
    stock: 200,
    tags: ['bcaa', 'energy', 'amino', 'endurance'],
    isFeatured: false,
    weight: 500,
    images: [{ url: 'https://placehold.co/600x600?text=BCAA+Mix', alt: 'BCAA Energy Drink' }],
  },
  {
    title: 'Creatine Monohydrate 500g',
    description: 'Micronized creatine monohydrate to improve strength, power, and performance.',
    price: 24.99,
    discount: 5,
    category: 'supplements',
    brand: 'MuscleTech',
    stock: 300,
    tags: ['creatine', 'strength', 'power'],
    isFeatured: true,
    weight: 500,
    images: [{ url: 'https://placehold.co/600x600?text=Creatine', alt: 'Creatine Monohydrate' }],
  },
  {
    title: 'Adjustable Dumbbell Set 5-50lbs',
    description: 'Space-saving adjustable dumbbells with quick-change mechanism for home training.',
    price: 349.99,
    discount: 15,
    category: 'strength',
    brand: 'Bowflex',
    stock: 30,
    tags: ['dumbbell', 'adjustable', 'home-gym', 'strength'],
    isFeatured: true,
    weight: 23000,
    images: [{ url: 'https://placehold.co/600x600?text=Dumbbells', alt: 'Adjustable Dumbbell Set' }],
  },
  {
    title: 'Olympic Barbell 20kg',
    description: 'Competition-grade 20kg Olympic barbell with premium knurling and high load capacity.',
    price: 199.99,
    discount: 0,
    category: 'strength',
    brand: 'Rogue',
    stock: 25,
    tags: ['barbell', 'olympic', 'weightlifting'],
    isFeatured: false,
    weight: 20000,
    images: [{ url: 'https://placehold.co/600x600?text=Barbell', alt: 'Olympic Barbell' }],
  },
  {
    title: 'Resistance Bands Set (5 Pack)',
    description: 'Portable resistance bands set with door anchor and handles for full-body workouts.',
    price: 34.99,
    discount: 20,
    category: 'accessories',
    brand: 'FitSimplify',
    stock: 500,
    tags: ['bands', 'resistance', 'portable', 'stretching'],
    isFeatured: true,
    weight: 400,
    images: [{ url: 'https://placehold.co/600x600?text=Resistance+Bands', alt: 'Resistance Bands Set' }],
  },
  {
    title: 'Premium Yoga Mat 6mm',
    description: 'Non-slip eco-friendly yoga mat with alignment lines and extra cushioning.',
    price: 44.99,
    discount: 0,
    category: 'yoga',
    brand: 'Manduka',
    stock: 120,
    tags: ['yoga', 'mat', 'eco-friendly', 'non-slip'],
    isFeatured: false,
    weight: 1200,
    images: [{ url: 'https://placehold.co/600x600?text=Yoga+Mat', alt: 'Premium Yoga Mat' }],
  },
  {
    title: 'Foam Roller 18 inch',
    description: 'High-density foam roller for deep tissue release and mobility work.',
    price: 27.99,
    discount: 10,
    category: 'recovery',
    brand: 'TriggerPoint',
    stock: 180,
    tags: ['foam-roller', 'recovery', 'massage', 'mobility'],
    isFeatured: false,
    weight: 600,
    images: [{ url: 'https://placehold.co/600x600?text=Foam+Roller', alt: 'Foam Roller' }],
  },
  {
    title: 'Men Training Compression Shirt',
    description: 'Moisture-wicking compression shirt with four-way stretch for high-intensity training.',
    price: 39.99,
    discount: 25,
    category: 'apparel',
    brand: 'UnderArmour',
    stock: 250,
    tags: ['shirt', 'compression', 'training', 'men'],
    isFeatured: true,
    weight: 200,
    images: [{ url: 'https://placehold.co/600x600?text=Compression+Shirt', alt: 'Compression Training Shirt' }],
  },
  {
    title: 'Women High-Waist Leggings',
    description: 'Squat-proof high-waist leggings with soft stretch fabric and hidden pocket.',
    price: 49.99,
    discount: 15,
    category: 'apparel',
    brand: 'Lululemon',
    stock: 200,
    tags: ['leggings', 'women', 'high-waist', 'squat-proof'],
    isFeatured: true,
    weight: 250,
    images: [{ url: 'https://placehold.co/600x600?text=Leggings', alt: 'High-Waist Leggings' }],
  },
  {
    title: 'Spinning Bike Pro',
    description: 'Indoor cycling bike with magnetic resistance and adjustable fit for home workouts.',
    price: 499.99,
    discount: 10,
    category: 'cardio',
    brand: 'Peloton',
    stock: 15,
    tags: ['bike', 'spinning', 'cardio', 'indoor'],
    isFeatured: true,
    weight: 45000,
    images: [{ url: 'https://placehold.co/600x600?text=Spin+Bike', alt: 'Spinning Bike Pro' }],
  },
  {
    title: 'Jump Rope Speed Cable',
    description: 'Adjustable speed rope with smooth bearings for fast, controlled rotations.',
    price: 14.99,
    discount: 0,
    category: 'cardio',
    brand: 'CrossRope',
    stock: 400,
    tags: ['jump-rope', 'cardio', 'speed', 'conditioning'],
    isFeatured: false,
    weight: 300,
    images: [{ url: 'https://placehold.co/600x600?text=Jump+Rope', alt: 'Speed Jump Rope' }],
  },
  {
    title: 'Gym Duffel Bag 40L',
    description: 'Durable duffel with wet-dry compartments and shoe pocket for gym essentials.',
    price: 54.99,
    discount: 0,
    category: 'accessories',
    brand: 'Nike',
    stock: 90,
    tags: ['bag', 'gym-bag', 'duffel', 'storage'],
    isFeatured: false,
    weight: 800,
    images: [{ url: 'https://placehold.co/600x600?text=Gym+Bag', alt: 'Gym Duffel Bag' }],
  },
  {
    title: 'Protein Bar Variety Pack (12ct)',
    description: '12-pack protein bars with 20g protein each and low sugar profile.',
    price: 29.99,
    discount: 10,
    category: 'nutrition',
    brand: 'QuestBar',
    stock: 350,
    tags: ['protein-bar', 'snack', 'high-protein', 'low-sugar'],
    isFeatured: true,
    weight: 720,
    images: [{ url: 'https://placehold.co/600x600?text=Protein+Bars', alt: 'Protein Bar Variety Pack' }],
  },
  {
    title: 'Weightlifting Belt Leather',
    description: '10mm leather lifting belt for core support during heavy compound lifts.',
    price: 69.99,
    discount: 0,
    category: 'accessories',
    brand: 'Rogue',
    stock: 75,
    tags: ['belt', 'weightlifting', 'powerlifting', 'support'],
    isFeatured: false,
    weight: 900,
    images: [{ url: 'https://placehold.co/600x600?text=Lifting+Belt', alt: 'Weightlifting Belt' }],
  },
  {
    title: 'Massage Gun Deep Tissue',
    description: 'Percussion massage gun with multiple speeds and attachments for muscle recovery.',
    price: 129.99,
    discount: 20,
    category: 'recovery',
    brand: 'Theragun',
    stock: 60,
    tags: ['massage-gun', 'recovery', 'percussion', 'deep-tissue'],
    isFeatured: true,
    weight: 1000,
    images: [{ url: 'https://placehold.co/600x600?text=Massage+Gun', alt: 'Deep Tissue Massage Gun' }],
  },
  {
    title: 'Kettlebell Cast Iron 16kg',
    description: 'Single-cast iron kettlebell with wide grip for functional strength workouts.',
    price: 44.99,
    discount: 0,
    category: 'strength',
    brand: 'Rogue',
    stock: 100,
    tags: ['kettlebell', 'cast-iron', 'functional', 'strength'],
    isFeatured: false,
    weight: 16000,
    images: [{ url: 'https://placehold.co/600x600?text=Kettlebell', alt: 'Cast Iron Kettlebell 16kg' }],
  },
  {
    title: 'Treadmill Foldable Home',
    description: 'Foldable treadmill with incline levels, heart-rate monitor, and compact frame.',
    price: 699.99,
    discount: 12,
    category: 'cardio',
    brand: 'NordicTrack',
    stock: 10,
    tags: ['treadmill', 'foldable', 'home-gym', 'running'],
    isFeatured: true,
    weight: 65000,
    images: [{ url: 'https://placehold.co/600x600?text=Treadmill', alt: 'Foldable Home Treadmill' }],
  },
  {
    title: 'Electrolyte Hydration Powder (30 packs)',
    description: 'Zero-sugar hydration mix with sodium, potassium, and magnesium.',
    price: 22.99,
    discount: 0,
    category: 'nutrition',
    brand: 'LMNT',
    stock: 400,
    tags: ['electrolyte', 'hydration', 'zero-sugar', 'recovery'],
    isFeatured: false,
    weight: 210,
    images: [{ url: 'https://placehold.co/600x600?text=Electrolytes', alt: 'Electrolyte Hydration Powder' }],
  },
];

async function seed() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is missing in environment');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    for (const userData of seedUsers) {
      const exists = await User.findOne({ email: userData.email });
      if (exists) {
        console.log(`User exists: ${userData.email}`);
      } else {
        await User.create(userData);
        console.log(`Created user: ${userData.email}`);
      }
    }

    const adminUser = await User.findOne({ email: 'admin@fitnessstore.com' });

    for (const productData of seedProducts) {
      const exists = await Product.findOne({ title: productData.title });
      if (exists) {
        console.log(`Product exists: ${productData.title}`);
      } else {
        await Product.create({
          ...productData,
          createdBy: adminUser?._id,
        });
        console.log(`Created product: ${productData.title}`);
      }
    }

    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();

    console.log('\n--- Seed Complete ---');
    console.log(`Total users in DB: ${totalUsers}`);
    console.log(`Total products in DB: ${totalProducts}`);

    console.log('\nDemo Login Credentials:');
    console.log('Admin:     admin@fitnessstore.com     / Admin@123');
    console.log('Member:    member@fitnessstore.com    / Member@123');
    console.log('Gym Owner: gymowner@fitnessstore.com  / Gym@1234');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error.message);
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
  }
}

seed();
