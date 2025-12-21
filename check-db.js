import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Counter from './models/Counter.js';

dotenv.config();

const checkDatabase = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB successfully');
    
    console.log('\n=== DATABASE INFO ===');
    console.log('Database:', mongoose.connection.name);
    console.log('Host:', mongoose.connection.host);
    console.log('Port:', mongoose.connection.port);
    
    console.log('\n=== COUNTERS ===');
    const counters = await Counter.find({});
    console.log('Counters found:', counters.length);
    counters.forEach(counter => {
      console.log(`- ${counter.id}: ${counter.seq}`);
    });
    
    console.log('\n=== USERS ===');
    const users = await User.find({});
    console.log('Total users found:', users.length);
    
    if (users.length > 0) {
      users.forEach(user => {
        console.log(`- ID: ${user.userId}, Email: ${user.email}, Name: ${user.name}, Role: ${user.role}`);
      });
    } else {
      console.log('No users found in database');
    }
    
    console.log('\n=== COLLECTIONS ===');
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections in database:');
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
};

checkDatabase();
