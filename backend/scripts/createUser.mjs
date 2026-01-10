import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config({ path: './.env' });

const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/cylms';

const email = process.env.CREATE_EMAIL || process.argv[2];
const password = process.env.CREATE_PASSWORD || process.argv[3] || 'changeme123';
const name = process.env.CREATE_NAME || process.argv[4] || 'Imported User';

if (!email) {
  console.error('Usage: node scripts/createUser.mjs <email> [password] [name]');
  process.exit(1);
}

const main = async () => {
  try {
    await mongoose.connect(MONGO);
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      console.log('User already exists:', exists.email);
      process.exit(0);
    }
    const u = new User({ name, email, password });
    await u.save();
    console.log('Created user', u.email);
    process.exit(0);
  } catch (err) {
    console.error('Error creating user:', err);
    process.exit(1);
  }
};

main();
