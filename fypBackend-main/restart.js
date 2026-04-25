// restart.js - Script to properly restart the server
// This ensures all mongoose models are correctly loaded

console.log('Clearing module cache to ensure proper model loading...');

// Clear the module cache for our models
Object.keys(require.cache).forEach(function(key) {
  if (key.includes('/model/')) {
    delete require.cache[key];
    console.log(`Cleared cache for: ${key}`);
  }
});

// Reload database connection and models
require('./db');
console.log('Database connection reloaded');

// Reload all models
require('./model/User');
require('./model/Ask');
require('./model/Donate');
require('./model/Contact');
require('./model/MedicineRequest');
console.log('All models reloaded');

// Start the server
console.log('Starting server...');
require('./index'); 