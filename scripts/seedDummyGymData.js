require('dotenv').config();
const mongoose = require('mongoose');

const User = require('../models/User');
const Gym = require('../models/Gym');
const Member = require('../models/Member');
const Trainer = require('../models/Trainer');
const Class = require('../models/Class');
const ClassBooking = require('../models/ClassBooking');
const Payment = require('../models/Payment');
const Challenge = require('../models/Challenge');

const DUMMY_TAG = 'dummy-gym-v1';

const ensureUser = async ({ firstName, lastName, email, password, role, phone }) => {
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      firstName,
      lastName,
      email,
      password,
      role,
      phone,
      isActive: true,
      isEmailVerified: true,
    });
    return user;
  }

  const updates = {};
  if (user.role !== role) updates.role = role;
  if (!user.phone && phone) updates.phone = phone;
  if (Object.keys(updates).length > 0) {
    await User.findByIdAndUpdate(user._id, updates, { new: true });
    user = await User.findById(user._id);
  }

  return user;
};

const toIsoDay = (offsetDays = 0) => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + offsetDays);
  return d;
};

const run = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is missing in .env');
  }

  await mongoose.connect(process.env.MONGODB_URI);

  const owner = await ensureUser({
    firstName: 'Gym',
    lastName: 'Owner',
    email: 'gymowner@fitnessstore.com',
    password: 'Gym@1234',
    role: 'gym_owner',
    phone: '+1-555-700-0001',
  });

  let gym = await Gym.findOne({ ownerId: owner._id });
  if (!gym) {
    gym = await Gym.create({
      name: 'Prime Performance Center',
      ownerId: owner._id,
      email: 'prime.performance@fitnessstore.com',
      phone: '+1-555-700-9001',
      address: {
        street: '245 Iron Avenue',
        city: 'Houston',
        state: 'TX',
        zip: '77001',
        country: 'USA',
      },
      description: 'Performance-focused gym with strength, conditioning, and recovery zones.',
      amenities: ['Strength Zone', 'Cardio Deck', 'Recovery Lounge', 'Group Studios'],
      isActive: true,
      isVerified: true,
    });
  }

  const memberUsers = [];
  for (const userData of [
    { firstName: 'John', lastName: 'Member', email: 'member@fitnessstore.com', password: 'Member@123', role: 'member', phone: '+1-555-710-0001' },
    { firstName: 'Ava', lastName: 'Carter', email: 'member2@fitnessstore.com', password: 'Member@123', role: 'member', phone: '+1-555-710-0002' },
    { firstName: 'Noah', lastName: 'Blake', email: 'member3@fitnessstore.com', password: 'Member@123', role: 'member', phone: '+1-555-710-0003' },
  ]) {
    memberUsers.push(await ensureUser(userData));
  }

  const trainerUsers = [];
  for (const userData of [
    { firstName: 'Trainer', lastName: 'Smith', email: 'trainer@fitnessstore.com', password: 'Trainer@123', role: 'trainer', phone: '+1-555-720-0001' },
    { firstName: 'Mia', lastName: 'Reyes', email: 'trainer2@fitnessstore.com', password: 'Trainer@123', role: 'trainer', phone: '+1-555-720-0002' },
  ]) {
    trainerUsers.push(await ensureUser(userData));
  }

  const memberDocs = [];
  for (const user of memberUsers) {
    let member = await Member.findOne({ userId: user._id, gymId: gym._id });
    if (!member) {
      member = await Member.create({
        userId: user._id,
        gymId: gym._id,
        membershipPlan: 'peak',
        membershipStatus: 'active',
        memberSince: toIsoDay(-45),
        membershipExpiry: toIsoDay(320),
        checkInCount: Math.floor(Math.random() * 20) + 10,
        fitnessLevel: 'intermediate',
        points: Math.floor(Math.random() * 400) + 100,
      });
    }
    memberDocs.push(member);
  }

  const trainerDocs = [];
  for (const user of trainerUsers) {
    let trainer = await Trainer.findOne({ userId: user._id, gymId: gym._id });
    if (!trainer) {
      trainer = await Trainer.create({
        userId: user._id,
        gymId: gym._id,
        bio: 'Certified coach focused on results and safe progression.',
        specializations: ['strength', 'fat-loss', 'mobility'],
        certifications: ['NASM-CPT'],
        yearsExperience: 5,
        hourlyRate: 65,
        rating: 4.8,
        reviewCount: 24,
        availability: {
          days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
          timeSlots: ['06:00', '09:00', '18:00'],
        },
        isActive: true,
      });
    }
    trainerDocs.push(trainer);
  }

  const classSeeds = [
    { name: 'Morning Strength Lab', category: 'strength', duration: 60, maxCapacity: 24, difficulty: 'intermediate', dayOfWeek: 'monday', time: '06:30' },
    { name: 'Power HIIT Burn', category: 'hiit', duration: 45, maxCapacity: 20, difficulty: 'advanced', dayOfWeek: 'wednesday', time: '18:00' },
    { name: 'Mobility Recharge', category: 'mind_body', duration: 50, maxCapacity: 18, difficulty: 'beginner', dayOfWeek: 'friday', time: '19:00' },
  ];

  const classDocs = [];
  for (let i = 0; i < classSeeds.length; i++) {
    const seed = classSeeds[i];
    let cls = await Class.findOne({ gymId: gym._id, name: seed.name });
    if (!cls) {
      cls = await Class.create({
        gymId: gym._id,
        name: seed.name,
        category: seed.category,
        description: `${seed.name} - premium coached class for members.`,
        instructorId: trainerDocs[i % trainerDocs.length]._id,
        duration: seed.duration,
        maxCapacity: seed.maxCapacity,
        schedule: {
          dayOfWeek: seed.dayOfWeek,
          time: seed.time,
          recurring: true,
        },
        location: 'Studio A',
        difficulty: seed.difficulty,
        equipment: ['mat', 'dumbbells'],
        tags: ['dummy-data', 'test-ready'],
        isActive: true,
        isCanceled: false,
      });
    }
    classDocs.push(cls);
  }

  for (let i = 0; i < classDocs.length; i++) {
    const cls = classDocs[i];
    const member = memberDocs[i % memberDocs.length];

    const bookingExists = await ClassBooking.findOne({
      classId: cls._id,
      memberId: member._id,
      status: 'booked',
    });

    if (!bookingExists) {
      await ClassBooking.create({
        classId: cls._id,
        memberId: member._id,
        status: 'booked',
        bookedAt: toIsoDay(-(i + 1)),
      });
    }
  }

  for (const cls of classDocs) {
    const bookedCount = await ClassBooking.countDocuments({ classId: cls._id, status: 'booked' });
    await Class.findByIdAndUpdate(cls._id, { currentBookings: bookedCount });
  }

  for (let monthOffset = 0; monthOffset < 6; monthOffset++) {
    const paymentDate = new Date();
    paymentDate.setDate(10);
    paymentDate.setHours(10, 0, 0, 0);
    paymentDate.setMonth(paymentDate.getMonth() - monthOffset);

    for (let i = 0; i < memberUsers.length; i++) {
      const user = memberUsers[i];
      const slot = `${monthOffset}-${i}`;

      const exists = await Payment.findOne({
        gymId: gym._id,
        'metadata.seedTag': DUMMY_TAG,
        'metadata.slot': slot,
      });

      if (!exists) {
        await Payment.create({
          userId: user._id,
          gymId: gym._id,
          type: 'membership',
          amount: 89 + i * 10,
          currency: 'USD',
          status: 'completed',
          description: `Dummy monthly membership payment (${slot})`,
          metadata: { seedTag: DUMMY_TAG, slot },
          createdAt: paymentDate,
          updatedAt: paymentDate,
        });
      }
    }
  }

  const challengeSeeds = [
    {
      title: 'Spring Check-In Sprint',
      description: 'Complete 12 check-ins this month.',
      type: 'check_in',
      goal: 12,
      reward: '250',
      startDate: toIsoDay(-10),
      endDate: toIsoDay(20),
    },
    {
      title: 'Class Consistency Pro',
      description: 'Attend 8 classes before month end.',
      type: 'classes',
      goal: 8,
      reward: '200',
      startDate: toIsoDay(-7),
      endDate: toIsoDay(23),
    },
  ];

  for (const seed of challengeSeeds) {
    let challenge = await Challenge.findOne({ gymId: gym._id, title: seed.title });
    if (!challenge) {
      challenge = await Challenge.create({
        gymId: gym._id,
        title: seed.title,
        description: seed.description,
        type: seed.type,
        goal: seed.goal,
        startDate: seed.startDate,
        endDate: seed.endDate,
        reward: seed.reward,
        isActive: true,
      });
    }

    const existingParticipantIds = new Set((challenge.participants || []).map((p) => p.memberId.toString()));
    for (let i = 0; i < memberDocs.length; i++) {
      const member = memberDocs[i];
      if (!existingParticipantIds.has(member._id.toString())) {
        challenge.participants.push({
          memberId: member._id,
          progress: Math.min(seed.goal, i + 2),
          isCompleted: false,
        });
      }
    }
    await challenge.save();
  }

  const [membersCount, trainersCount, classesCount, bookingsCount, paymentsCount, challengesCount] = await Promise.all([
    Member.countDocuments({ gymId: gym._id, membershipStatus: 'active' }),
    Trainer.countDocuments({ gymId: gym._id, isActive: true }),
    Class.countDocuments({ gymId: gym._id, isActive: true }),
    ClassBooking.countDocuments({ classId: { $in: classDocs.map((c) => c._id) }, status: 'booked' }),
    Payment.countDocuments({ gymId: gym._id, 'metadata.seedTag': DUMMY_TAG }),
    Challenge.countDocuments({ gymId: gym._id, isActive: true }),
  ]);

  await mongoose.disconnect();

  console.log('DUMMY_GYM_READY');
  console.log(`Gym: ${gym.name}`);
  console.log(`Active Members: ${membersCount}`);
  console.log(`Active Trainers: ${trainersCount}`);
  console.log(`Classes: ${classesCount}`);
  console.log(`Challenges: ${challengesCount}`);
  console.log(`Bookings: ${bookingsCount}`);
  console.log(`Seeded Payments: ${paymentsCount}`);
};

run()
  .catch(async (error) => {
    console.error('DUMMY_GYM_SEED_FAILED', error.message);
    try {
      await mongoose.disconnect();
    } catch {
      // Ignore disconnect errors on failure path.
    }
    process.exit(1);
  });
