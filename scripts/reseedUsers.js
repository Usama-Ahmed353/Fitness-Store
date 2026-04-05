const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

async function reseed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected');

  // Delete old seed users
  const emails = [
    'admin@fitnessstore.com',
    'superadmin@fitnessstore.com',
    'gymowner@fitnessstore.com',
    'member@fitnessstore.com',
    'trainer@fitnessstore.com',
  ];
  await User.deleteMany({ email: { $in: emails } });
  console.log('Deleted old seed users');

  // Re-create with correct hashing
  const users = [
    { firstName: 'Admin', lastName: 'User', email: 'admin@fitnessstore.com', password: 'Admin@123', role: 'admin', isEmailVerified: true, isActive: true },
    { firstName: 'Super', lastName: 'Admin', email: 'superadmin@fitnessstore.com', password: 'Super@123', role: 'super_admin', isEmailVerified: true, isActive: true },
    { firstName: 'Gym', lastName: 'Owner', email: 'gymowner@fitnessstore.com', password: 'Gym@1234', role: 'gym_owner', isEmailVerified: true, isActive: true },
    { firstName: 'John', lastName: 'Member', email: 'member@fitnessstore.com', password: 'Member@123', role: 'member', isEmailVerified: true, isActive: true },
    { firstName: 'Trainer', lastName: 'Smith', email: 'trainer@fitnessstore.com', password: 'Trainer@123', role: 'trainer', isEmailVerified: true, isActive: true },
  ];

  for (const u of users) {
    await User.create(u);
    console.log(`Created ${u.role}: ${u.email}`);
  }

  console.log('\nDone. Test credentials:');
  console.log('Admin:       admin@fitnessstore.com / Admin@123');
  console.log('Super Admin: superadmin@fitnessstore.com / Super@123');
  console.log('Gym Owner:   gymowner@fitnessstore.com / Gym@1234');
  console.log('Member:      member@fitnessstore.com / Member@123');
  console.log('Trainer:     trainer@fitnessstore.com / Trainer@123');

  await mongoose.disconnect();
  process.exit(0);
}

reseed().catch(e => { console.error(e); process.exit(1); });
