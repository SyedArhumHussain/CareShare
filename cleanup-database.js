/**
 * Database Cleanup Script for Care Share Project
 * This script will remove ALL data from ALL collections in your MongoDB database
 * 
 * WARNING: This action is IRREVERSIBLE. Use with caution!
 */

const mongoose = require('mongoose');
require('dotenv').config();

// Import all models to ensure they're registered
require('./fypBackend-main/model/User');
require('./fypBackend-main/model/Ask');
require('./fypBackend-main/model/Donate');
require('./fypBackend-main/model/Contact');
require('./fypBackend-main/model/MedicineRequest');

console.log('🧹 Care Share Database Cleanup Script');
console.log('=====================================');
console.log('⚠️  WARNING: This will DELETE ALL data from your database!');
console.log('⚠️  This action is IRREVERSIBLE!');
console.log('');

// Function to prompt user for confirmation
function promptUser() {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question('Are you absolutely sure you want to delete ALL data? (type "DELETE ALL" to confirm): ', (answer) => {
      rl.close();
      resolve(answer === 'DELETE ALL');
    });
  });
}

// Function to clean all collections
async function cleanDatabase() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    
    // Connect to database
    await mongoose.connect(process.env.mongo_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('✅ Connected to MongoDB successfully');
    console.log('📊 Current database:', mongoose.connection.db.databaseName);
    
    // Get all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    if (collections.length === 0) {
      console.log('ℹ️  Database is already empty - no collections found');
      await mongoose.disconnect();
      return;
    }
    
    console.log('🗂️  Found collections:', collections.map(c => c.name).join(', '));
    console.log('');
    
    // Get user confirmation
    const confirmed = await promptUser();
    
    if (!confirmed) {
      console.log('❌ Operation cancelled by user');
      await mongoose.disconnect();
      return;
    }
    
    console.log('');
    console.log('🗑️  Starting cleanup process...');
    
    // Clean each collection
    const results = {};
    
    for (const collection of collections) {
      try {
        const collectionName = collection.name;
        console.log(`   Cleaning collection: ${collectionName}...`);
        
        const deleteResult = await mongoose.connection.db.collection(collectionName).deleteMany({});
        results[collectionName] = deleteResult.deletedCount;
        
        console.log(`   ✅ Deleted ${deleteResult.deletedCount} documents from ${collectionName}`);
      } catch (error) {
        console.log(`   ❌ Error cleaning ${collection.name}:`, error.message);
        results[collection.name] = `Error: ${error.message}`;
      }
    }
    
    console.log('');
    console.log('📋 Cleanup Summary:');
    console.log('==================');
    
    let totalDeleted = 0;
    for (const [collectionName, count] of Object.entries(results)) {
      if (typeof count === 'number') {
        console.log(`   ${collectionName}: ${count} documents deleted`);
        totalDeleted += count;
      } else {
        console.log(`   ${collectionName}: ${count}`);
      }
    }
    
    console.log('');
    console.log(`🎉 Database cleanup completed successfully!`);
    console.log(`📊 Total documents deleted: ${totalDeleted}`);
    console.log('');
    
    // Verify cleanup
    console.log('🔍 Verifying cleanup...');
    const remainingCollections = await mongoose.connection.db.listCollections().toArray();
    const nonEmptyCollections = [];
    
    for (const collection of remainingCollections) {
      const count = await mongoose.connection.db.collection(collection.name).countDocuments();
      if (count > 0) {
        nonEmptyCollections.push(`${collection.name} (${count} docs)`);
      }
    }
    
    if (nonEmptyCollections.length === 0) {
      console.log('✅ Verification complete: All collections are now empty');
    } else {
      console.log('⚠️  Warning: Some collections still contain data:', nonEmptyCollections.join(', '));
    }
    
  } catch (error) {
    console.error('❌ Error during database cleanup:', error);
  } finally {
    await mongoose.disconnect();
    console.log('📡 Disconnected from MongoDB');
    console.log('');
    console.log('🏁 Cleanup script finished');
  }
}

// Alternative function for programmatic use (no user prompt)
async function forceCleanDatabase() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    
    await mongoose.connect(process.env.mongo_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('✅ Connected to MongoDB successfully');
    
    // Get all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    console.log('🗑️  Force cleaning all collections...');
    
    let totalDeleted = 0;
    for (const collection of collections) {
      const deleteResult = await mongoose.connection.db.collection(collection.name).deleteMany({});
      console.log(`   ✅ ${collection.name}: ${deleteResult.deletedCount} documents deleted`);
      totalDeleted += deleteResult.deletedCount;
    }
    
    console.log(`🎉 Force cleanup completed! Total deleted: ${totalDeleted}`);
    
  } catch (error) {
    console.error('❌ Error during force cleanup:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// Check if script is run directly or imported
if (require.main === module) {
  // Run with user confirmation
  cleanDatabase();
} else {
  // Export for programmatic use
  module.exports = { cleanDatabase, forceCleanDatabase }; 
} 