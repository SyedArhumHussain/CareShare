const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Donate = mongoose.model("Donate")
const jwt = require('jsonwebtoken');
const bcrypt =require('bcryptjs'); 
// const db = require("../askDb")
const nodemailer = require('nodemailer');

const Ask = mongoose.model("Ask");
require('dotenv').config()

// Create email transporter using environment variables
const createEmailTransporter = () => {
  const emailUser = process.env.EMAIL_USER;
  const emailPassword = process.env.EMAIL_PASSWORD;
  
  if (!emailUser || !emailPassword) {
    console.warn('⚠️  Email credentials not configured in donateRoutes. Using simulation mode.');
    return null;
  }
  
  return nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: emailUser,
      pass: emailPassword
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

const emailTransporter = createEmailTransporter();

//sendEmail api - Updated to use environment variables
const sendEmail = async function (email, isApproval = true) {
  try {
    if (!emailTransporter) {
      console.log(`📧 Email simulation: ${isApproval ? 'Approval' : 'Decline'} email would be sent to: ${email}`);
      return { success: true, simulated: true };
    }

    const subject = isApproval ? "CareShare - Medicine has been approved" : "CareShare - Medicine has been declined";
    const message = isApproval 
      ? "your donated medicine has been approved" 
      : "your donated medicine has been declined";

    const mailoptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
      html: `<html><body>Dear User,<br/><br/> ${message} <br/><br/><p style="color:#2F5496">Regards,<br/>CareShare<br/></body></html>`
    };

    const result = await emailTransporter.sendMail(mailoptions);
    console.log(`✅ ${isApproval ? 'Approval' : 'Decline'} email sent successfully to: ${email}`);
    return { success: true, messageId: result.messageId };
    
  } catch (error) {
    console.error(`❌ Failed to send ${isApproval ? 'approval' : 'decline'} email to ${email}:`, error.message);
    return { success: false, error: error.message };
  }
};

// Removed old sendEmail2 function - using updated sendEmail function for both approval and decline





router.post('/donate', async (req, res) => {  
    console.log('Medicine donation submission received');
    console.log('Request body:', req.body);
    
    const {name, email, mobile, medicineName, medicineQty, medicineImg, medicineExp, address, city, location} = req.body;
    
    // Validate required fields
    if(!name || !email || !medicineName || !medicineQty || !medicineImg || !medicineExp) {
        console.log('Missing required fields in donation submission');
        return res.status(422).send({error: 'Please fill out all the required fields'});
    }

    try {
        console.log(`Processing donation for medicine: ${medicineName}`);
        
        // Create new donation document
        const donation = new Donate({
            name,
            email,
            address,
            city,
            location,
            mobile: mobile || '',
            medicineName,
            medicineQty,
            medicineImg, 
            medicineExp,
            status: 'pending' // Always set the initial status to pending
        });
        
        // Save the donation to the database
        const savedDonation = await donation.save();
        console.log('Medicine donation saved successfully with ID:', savedDonation._id);
        console.log('Donation data:', {
            name,
            email,
            medicineName,
            medicineQty,
            medicineExp,
            status: 'pending'
        });
        
        // Return success response
        return res.status(200).send({
            success: true,
            message: 'Medicine donation submitted successfully',
            donationId: savedDonation._id
        });
    } catch (err) {
        console.error('Error saving medicine donation:', err);
        return res.status(500).send({
            error: err.message,
            message: 'Failed to process medicine donation'
        });
    }
});


router.get('/askDonator',async(req,res)=>{
    try {
        console.log('Fetching all medicine donations...');
        const donations = await Donate.find();
        console.log(`Found ${donations.length} medicine donations`);
        
        if (!donations || donations.length === 0) {
            console.log('No medicine donations found in database');
        } else {
            console.log('Medicine donations retrieved successfully');
            // Log the first item to help with debugging
            if (donations.length > 0) {
                console.log('Sample donation:', JSON.stringify(donations[0]));
            }
        }
        
        res.send({database: donations});
    } catch (error) {
        console.error('Error fetching medicine donations:', error);
        res.status(500).send({
            error: 'Failed to retrieve medicine donations',
            details: error.message
        });
    }
})

// router.put('/approveStatus',async(req,res)=>{
//     const {medicineName} = req.body
//     const database = await Donate.findOne({name:medicineName});
//     const user = new Donate({
        
//         status:'approved'

//     })
//     console.log(database)
//     res.send({database})
// })

router.put('/approveStatus', async (req, res) => {
    try {
      const { medicineName ,email } = req.body;
      console.log('Medicine name in request:', medicineName);
      // Find the medicine by its name in the database
      const database = await Donate.findOne({ medicineName: medicineName });
      console.log('database name in request:', database);
      // If the medicine exists, update its status to 'approved'
      if (database) {
        database.status = 'approved';
        await database.save(); // Save the changes
  
        console.log('Medicine status updated:', database);


  // sendEmail()



  sendEmail(email);

        res.send({ message: 'Medicine status updated', database });
      } else {
        res.status(404).send({ message: 'Medicine not found' });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send({ message: 'Internal server error' });
    }
  });


router.delete('/deleteMedicine', async (req, res) => {
  try {
    const { medicineName , email } = req.body;

    console.log('Medicine name to delete:', medicineName);

    // Find and remove the medicine by its name from the database
    const deletedMedicine = await Donate.findOneAndDelete({ medicineName: medicineName });

    if (deletedMedicine) {
      console.log('Medicine deleted:', deletedMedicine);
      sendEmail2(email)
      res.send({ message: 'Medicine deleted', deletedMedicine });
    } else {
      console.log('Medicine not found');
      res.status(404).send({ message: 'Medicine not found' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
});

// Add endpoint to update medicine by ID
router.put('/askDonator/:id', async (req, res) => {
  try {
    console.log(`Updating medicine with ID: ${req.params.id}`);
    console.log('Update data:', req.body);
    
    const updatedMedicine = await Donate.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!updatedMedicine) {
      console.log('Medicine not found for update');
      return res.status(404).send({ message: 'Medicine not found' });
    }
    
    console.log('Medicine updated successfully:', updatedMedicine);
    res.send({ 
      message: 'Medicine updated successfully', 
      medicine: updatedMedicine 
    });
  } catch (error) {
    console.error('Error updating medicine:', error);
    res.status(500).send({ 
      message: 'Failed to update medicine', 
      error: error.message 
    });
  }
});

// Add endpoint to delete medicine by ID
router.delete('/askDonator/:id', async (req, res) => {
  try {
    console.log(`Deleting medicine with ID: ${req.params.id}`);
    
    const deletedMedicine = await Donate.findByIdAndDelete(req.params.id);
    
    if (!deletedMedicine) {
      console.log('Medicine not found for deletion');
      return res.status(404).send({ message: 'Medicine not found' });
    }
    
    console.log('Medicine deleted successfully:', deletedMedicine);
    res.send({ 
      message: 'Medicine deleted successfully', 
      medicine: deletedMedicine 
    });
  } catch (error) {
    console.error('Error deleting medicine:', error);
    res.status(500).send({ 
      message: 'Failed to delete medicine', 
      error: error.message 
    });
  }
});

module.exports = router;