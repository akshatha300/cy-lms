import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config({ path: './.env' });

const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/cylms';

const main = async () => {
  try {
    await mongoose.connect(MONGO);
    const count = await User.countDocuments();
    console.log('Connected to', MONGO);
    console.log('User count:', count);
    if (count > 0) {
      const u = await User.findOne().lean();
      console.log({ email: u.email, userId: u.userId, passwordSample: (u.password || '').slice(0,20) + '...' });
    }
    process.exit(0);
  } catch (err) {
    console.error('Error checking users:', err);
    process.exit(1);
  }
};

main();
