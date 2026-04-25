/**
 * Selective Database Cleanup Script for Care Share Project
 * This script allows you to clean specific collections or view data before cleanup
 */

const mongoose = require('mongoose');
require('dotenv').config();

// Import all models
require('./model/User');
require('./model/Ask');
require('./model/Donate');
require('./model/Contact');
require('./model/MedicineRequest');

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.mongo_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB successfully');
    return true;
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error);
    return false;
  }
}

async function viewCollectionData() {
  const collections = await mongoose.connection.db.listCollections().toArray();
  
  if (collections.length === 0) {
    console.log('ℹ️  No collections found in database');
    return;
  }
  
  console.log('\n📊 Database Overview:');
  console.log('====================');
  
  for (const collection of collections) {
    const count = await mongoose.connection.db.collection(collection.name).countDocuments();
    console.log(`   ${collection.name}: ${count} documents`);
    
    if (count > 0 && count <= 3) {
      console.log('   Sample data:');
      const samples = await mongoose.connection.db.collection(collection.name).find({}).limit(3).toArray();
      samples.forEach((doc, index) => {
        const preview = JSON.stringify(doc, null, 2).substring(0, 150) + '...';
        console.log(`     ${index + 1}. ${preview}`);
      });
    }
    console.log('');
  }
}

async function cleanSpecificCollections() {
  const collections = await mongoose.connection.db.listCollections().toArray();
  
  if (collections.length === 0) {
    console.log('ℹ️  No collections found to clean');
    return;
  }
  
  console.log('\n🗂️  Available collections:');
  collections.forEach((col, index) => {
    console.log(`   ${index + 1}. ${col.name}`);
  });
  
  const answer = await askQuestion('\nEnter collection numbers to clean (comma-separated), or "all" for all collections: ');
  
  let collectionsToClean = [];
  
  if (answer.toLowerCase() === 'all') {
    collectionsToClean = collections;
  } else {
    const indices = answer.split(',').map(s => parseInt(s.trim()) - 1);
    collectionsToClean = indices
      .filter(i => i >= 0 && i < collections.length)
      .map(i => collections[i]);
  }
  
  if (collectionsToClean.length === 0) {
    console.log('❌ No valid collections selected');
    return;
  }
  
  console.log('\n📋 Collections to clean:');
  collectionsToClean.forEach(col => console.log(`   - ${col.name}`));
  
  const confirmation = await askQuestion('\nType "CONFIRM" to proceed with cleanup: ');
  
  if (confirmation !== 'CONFIRM') {
    console.log('❌ Operation cancelled');
    return;
  }
  
  console.log('\n🗑️  Cleaning selected collections...');
  
  let totalDeleted = 0;
  for (const collection of collectionsToClean) {
    try {
      const deleteResult = await mongoose.connection.db.collection(collection.name).deleteMany({});
      console.log(`   ✅ ${collection.name}: ${deleteResult.deletedCount} documents deleted`);
      totalDeleted += deleteResult.deletedCount;
    } catch (error) {
      console.log(`   ❌ Error cleaning ${collection.name}:`, error.message);
    }
  }
  
  console.log(`\n🎉 Cleanup completed! Total documents deleted: ${totalDeleted}`);
}

async function main() {
  console.log('🧹 Care Share Database Management Tool');
  console.log('======================================');
  
  const connected = await connectToDatabase();
  if (!connected) {
    rl.close();
    return;
  }
  
  while (true) {
    console.log('\n📋 Available options:');
    console.log('   1. View database overview');
    console.log('   2. Clean specific collections');
    console.log('   3. Clean ALL collections (dangerous!)');
    console.log('   4. Exit');
    
    const choice = await askQuestion('\nSelect an option (1-4): ');
    
    switch (choice) {
      case '1':
        await viewCollectionData();
        break;
        
      case '2':
        await cleanSpecificCollections();
        break;
        
      case '3':
        console.log('\n⚠️  WARNING: This will delete ALL data from ALL collections!');
        const confirm = await askQuestion('Type "DELETE ALL" to confirm: ');
        if (confirm === 'DELETE ALL') {
          const collections = await mongoose.connection.db.listCollections().toArray();
          let totalDeleted = 0;
          
          for (const collection of collections) {
            const deleteResult = await mongoose.connection.db.collection(collection.name).deleteMany({});
            console.log(`   ✅ ${collection.name}: ${deleteResult.deletedCount} documents deleted`);
            totalDeleted += deleteResult.deletedCount;
          }
          
          console.log(`\n🎉 All data deleted! Total documents removed: ${totalDeleted}`);
        } else {
          console.log('❌ Operation cancelled');
        }
        break;
        
      case '4':
        console.log('👋 Goodbye!');
        await mongoose.disconnect();
        rl.close();
        return;
        
      default:
        console.log('❌ Invalid option. Please select 1-4.');
    }
  }
}

// Run the main function
main().catch(error => {
  console.error('❌ Unexpected error:', error);
  mongoose.disconnect();
  rl.close();
}); 