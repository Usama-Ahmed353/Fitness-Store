require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

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

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    for (const userData of seedUsers) {
      const exists = await User.findOne({ email: userData.email });
      if (exists) {
        console.log(`✓ ${userData.role} already exists: ${userData.email}`);
      } else {
        await User.create(userData);
        console.log(`✓ Created ${userData.role}: ${userData.email}`);
      }
    }

    console.log('\n--- Test Credentials ---');
    console.log('Admin:       admin@fitnessstore.com / Admin@123');
    console.log('Super Admin: superadmin@fitnessstore.com / Super@123');
    console.log('Gym Owner:   gymowner@fitnessstore.com / Gym@1234');
    console.log('Member:      member@fitnessstore.com / Member@123');
    console.log('Trainer:     trainer@fitnessstore.com / Trainer@123');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
}

seed();
