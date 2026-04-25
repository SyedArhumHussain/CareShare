/**
 * Database Backup Script for Care Share Project
 * This script creates a JSON backup of all collections before cleanup
 */

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Import all models
require('./model/User');
require('./model/Ask');
require('./model/Donate');
require('./model/Contact');
require('./model/MedicineRequest');

async function createBackup() {
  try {
    console.log('💾 Care Share Database Backup Tool');
    console.log('==================================');
    
    // Connect to database
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect(process.env.mongo_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB successfully');
    
    // Create backup directory
    const backupDir = path.join(__dirname, 'database-backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir);
    }
    
    // Generate backup filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(backupDir, `careshare-backup-${timestamp}.json`);
    
    // Get all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    if (collections.length === 0) {
      console.log('ℹ️  No collections found to backup');
      await mongoose.disconnect();
      return;
    }
    
    console.log('🗂️  Found collections:', collections.map(c => c.name).join(', '));
    
    const backup = {
      timestamp: new Date().toISOString(),
      database: mongoose.connection.db.databaseName,
      collections: {}
    };
    
    let totalDocuments = 0;
    
    // Backup each collection
    for (const collection of collections) {
      console.log(`   📋 Backing up ${collection.name}...`);
      
      const documents = await mongoose.connection.db.collection(collection.name).find({}).toArray();
      backup.collections[collection.name] = {
        count: documents.length,
        data: documents
      };
      
      totalDocuments += documents.length;
      console.log(`   ✅ ${collection.name}: ${documents.length} documents backed up`);
    }
    
    // Write backup to file
    console.log('💾 Writing backup to file...');
    fs.writeFileSync(backupFile, JSON.stringify(backup, null, 2));
    
    // Get file size
    const stats = fs.statSync(backupFile);
    const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
    
    console.log('');
    console.log('🎉 Backup completed successfully!');
    console.log('📊 Backup Summary:');
    console.log('==================');
    console.log(`   Collections: ${collections.length}`);
    console.log(`   Total documents: ${totalDocuments}`);
    console.log(`   Backup file: ${backupFile}`);
    console.log(`   File size: ${fileSizeInMB} MB`);
    console.log('');
    console.log('💡 You can restore this backup using the restore-database.js script');
    
  } catch (error) {
    console.error('❌ Error creating backup:', error);
  } finally {
    await mongoose.disconnect();
    console.log('📡 Disconnected from MongoDB');
  }
}

// Run backup
if (require.main === module) {
  createBackup();
} else {
  module.exports = { createBackup };
} 