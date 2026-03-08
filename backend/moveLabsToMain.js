import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function moveLabsToMain() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Source collections
    const sourceCollections = [
      { name: 'exactadvancedlabs', desc: 'CO1 Labs' },
      { name: 'exactadvancedlabspart2', desc: 'CO3, CO4 Labs' },
      { name: 'exactadvancedlabspart3', desc: 'CO5 Labs' },
      { name: 'advancedlabs', desc: 'Original Advanced Labs' },
      { name: 'simpleadvancedlabs', desc: 'Simple Advanced Labs' }
    ];
    
    console.log('Moving labs to main labs collection...');
    
    // Clear main labs collection
    await mongoose.connection.db.collection('labs').deleteMany({});
    console.log('Cleared main labs collection');
    
    let totalMoved = 0;
    
    // Move each collection to main labs
    for (const source of sourceCollections) {
      try {
        const docs = await mongoose.connection.db.collection(source.name).find({}).toArray();
        
        if (docs.length > 0) {
          // Add category field to each lab
          const enrichedDocs = docs.map(doc => ({
            ...doc,
            category: doc.category || 'Advanced ML',
            difficulty: doc.difficulty || 4,
            estimatedTime: doc.estimatedTime || 90
          }));
          
          await mongoose.connection.db.collection('labs').insertMany(enrichedDocs);
          console.log(`✅ Moved ${docs.length} labs from ${source.name} (${source.desc})`);
          totalMoved += docs.length;
        } else {
          console.log(`⚠️  No labs found in ${source.name}`);
        }
      } catch (err) {
        console.log(`❌ Error moving ${source.name}: ${err.message}`);
      }
    }
    
    // Verify final count
    const finalCount = await mongoose.connection.db.collection('labs').countDocuments();
    console.log(`\n🎉 Successfully moved ${totalMoved} labs to main collection!`);
    console.log(`📊 Total labs in main collection: ${finalCount}`);
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

moveLabsToMain();
