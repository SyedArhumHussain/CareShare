// Utility script to update medicine status
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Connect to database
mongoose.connect(process.env.mongo_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
  process.exit(1);
});

// Load the Donate model
require('../model/Donate');
const Donate = mongoose.model('Donate');

// Function to update all pending medicines to approved
async function updateAllToApproved() {
  try {
    const result = await Donate.updateMany(
      { status: 'pending' },
      { $set: { status: 'approved' } }
    );
    
    console.log(`Updated ${result.modifiedCount} medicines to approved status`);
    
    // Show all medicines after update
    const allMedicines = await Donate.find({});
    console.log('\nAll medicines in database:');
    allMedicines.forEach(med => {
      console.log(`- ${med.medicineName}: ${med.status}`);
    });
    
    mongoose.disconnect();
  } catch (err) {
    console.error('Error updating medicines:', err);
    mongoose.disconnect();
  }
}

// Call the function to update medicines
updateAllToApproved(); 