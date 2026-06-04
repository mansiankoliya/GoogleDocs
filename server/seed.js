import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://mansiaankoliya5876_db_user:NAkBShPr6hagl7uq@cluster0.i0aaskk.mongodb.net/googledocs');
    
    console.log('MongoDB connected. Seeding users...');
    
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);
    
    const usersToSeed = ['Mansi', 'Rahul'];
    
    for (const username of usersToSeed) {
      const existingUser = await User.findOne({ username });
      if (!existingUser) {
        await User.create({ username, password: passwordHash });
        console.log(`✅ Seeded user: ${username} (password: password123)`);
      } else {
        console.log(`ℹ️ User ${username} already exists.`);
      }
    }
    
    console.log('Seeding complete.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDB();
