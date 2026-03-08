import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function checkLabs() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\nAvailable collections:');
    collections.forEach(col => console.log('  -', col.name));
    
    // Check each lab collection
    const labCollections = [
      'exactadvancedlabs',
      'exactadvancedlabspart2', 
      'exactadvancedlabspart3',
      'advancedlabs',
      'simpleadvancedlabs',
      'labs'
    ];
    
    console.log('\nLab collection counts:');
    for (const colName of labCollections) {
      try {
        const count = await mongoose.connection.db.collection(colName).countDocuments();
        console.log(`  ${colName}: ${count} documents`);
      } catch (err) {
        console.log(`  ${colName}: Error - ${err.message}`);
      }
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkLabs();
