// fix-medicine-requests.js
// This script fixes issues with the medicine request routes

const mongoose = require('mongoose');
const fs = require('fs');

// Create uploads directory if it doesn't exist
if (!fs.existsSync('./uploads/prescriptions')) {
  fs.mkdirSync('./uploads/prescriptions', { recursive: true });
  console.log('Created uploads directory for prescriptions');
}

// Connect to the database
console.log('Connecting to MongoDB...');
mongoose.connect(process.env.mongo_URL || 'mongodb+srv://ahmedrazaamjad101:i15mBUjLijMGxiN4@cluster0.czyj5cd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => {
    console.log('Connected to MongoDB');
    
    // Load models (order is important)
    require('./model/User');
    require('./model/Ask');
    require('./model/Donate');
    require('./model/Contact');
    require('./model/MedicineRequest');
    
    // Get reference to the Donate model
    const Donate = mongoose.model('Donate');
    
    // Test if findOne works correctly
    Donate.findOne()
      .then(result => {
        console.log('✅ Donate.findOne() is working correctly!');
        if (result) {
          console.log('Found medicine:', result.medicineName);
        } else {
          console.log('No donations found in database');
        }
        
        // Fix the routes file
        fixRoutesFile();
      })
      .catch(err => {
        console.error('❌ Error with Donate.findOne():', err);
        process.exit(1);
      });
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });

function fixRoutesFile() {
  const routesFile = './routes/medicineRequestRoutes.js';
  
  try {
    let content = fs.readFileSync(routesFile, 'utf8');
    
    // Check if the file already has the correct import
    if (content.includes("const mongoose = require('mongoose')") && 
        content.includes("const Donate = mongoose.model('Donate')")) {
      console.log('✅ Routes file already has correct imports');
    } else {
      // Fix the import
      content = content.replace(
        "const Donate = require('../model/Donate');",
        "const mongoose = require('mongoose');\n// First make sure the model is loaded\nrequire('../model/Donate');\n// Then get a reference to it\nconst Donate = mongoose.model('Donate');"
      );
      
      fs.writeFileSync(routesFile, content, 'utf8');
      console.log('✅ Updated imports in routes file');
    }
    
    console.log('\n✅ All fixes applied successfully!');
    console.log('\nYou can now start the server with:');
    console.log('node index.js');
    
    process.exit(0);
  } catch (err) {
    console.error('Error fixing routes file:', err);
    process.exit(1);
  }
} 