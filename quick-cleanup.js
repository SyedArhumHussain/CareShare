/**
 * Quick Database Cleanup Script for Care Share Project
 */

const mongoose = require('mongoose');
require('dotenv').config();

async function quickCleanup() {
  try {
    console.log('🧹 Quick Database Cleanup');
    console.log('=========================');
    
    // Connect to database
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect(process.env.mongo_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('✅ Connected to MongoDB successfully');
    console.log('📊 Database:', mongoose.connection.db.databaseName);
    
    // Get all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    if (collections.length === 0) {
      console.log('ℹ️  Database is already empty');
      await mongoose.disconnect();
      return;
    }
    
    console.log('🗂️  Found collections:', collections.map(c => c.name).join(', '));
    
    // Clean all collections
    console.log('🗑️  Cleaning all collections...');
    
    let totalDeleted = 0;
    for (const collection of collections) {
      try {
        const deleteResult = await mongoose.connection.db.collection(collection.name).deleteMany({});
        console.log(`   ✅ ${collection.name}: ${deleteResult.deletedCount} documents deleted`);
        totalDeleted += deleteResult.deletedCount;
      } catch (error) {
        console.log(`   ❌ Error cleaning ${collection.name}:`, error.message);
      }
    }
    
    console.log('');
    console.log(`🎉 Cleanup completed! Total documents deleted: ${totalDeleted}`);
    
    // Verify cleanup
    console.log('🔍 Verifying cleanup...');
    const remainingCollections = await mongoose.connection.db.listCollections().toArray();
    let hasData = false;
    
    for (const collection of remainingCollections) {
      const count = await mongoose.connection.db.collection(collection.name).countDocuments();
      if (count > 0) {
        console.log(`   ⚠️  ${collection.name} still has ${count} documents`);
        hasData = true;
      }
    }
    
    if (!hasData) {
      console.log('✅ All collections are now empty');
    }
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  } finally {
    await mongoose.disconnect();
    console.log('📡 Disconnected from MongoDB');
  }
}

// Run the cleanup
quickCleanup(); 