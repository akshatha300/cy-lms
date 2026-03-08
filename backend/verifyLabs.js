import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function verifyLabs() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const count = await mongoose.connection.db.collection('labs').countDocuments();
    console.log('Total labs in main collection:', count);
    
    const labs = await mongoose.connection.db.collection('labs').find({}).limit(5).toArray();
    console.log('\nSample labs:');
    labs.forEach((lab, i) => {
      console.log(`${i+1}. ${lab.title || lab.name}`);
    });
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

verifyLabs();
