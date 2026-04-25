const express = require('express');
const router = express.Router();
const MedicineRequest = require('../model/MedicineRequest');
const mongoose = require('mongoose');
// First make sure the model is loaded
require('../model/Donate');
// Then get a reference to it
const Donate = mongoose.model('Donate');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/prescriptions';
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'prescription-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif|pdf/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    
    cb(new Error('Only image and PDF files are allowed'));
  }
});

// Create real email transporter using Gmail SMTP
const createEmailTransporter = () => {
  const emailUser = process.env.EMAIL_USER;
  const emailPassword = process.env.EMAIL_PASSWORD;
  
  if (!emailUser || !emailPassword) {
    console.warn('⚠️  Email credentials not configured. Email functionality will be simulated.');
    console.warn('⚠️  Please set EMAIL_USER and EMAIL_PASSWORD in your .env file');
    
    // Return mock transporter if credentials not configured
    return {
      async sendMail(mailOptions) {
        console.log('\n📧 ===== EMAIL SIMULATION (No SMTP configured) =====');
        console.log('📬 FROM:', mailOptions.from);
        console.log('📬 TO:', mailOptions.to);
        console.log('📋 SUBJECT:', mailOptions.subject);
        console.log('📄 CONTENT PREVIEW:', mailOptions.html.replace(/<[^>]*>/g, '').substring(0, 100) + '...');
        console.log('✅ EMAIL SIMULATED - Please configure EMAIL_USER and EMAIL_PASSWORD in .env');
        console.log('==========================================\n');
        
        return {
          messageId: 'simulation-' + Date.now() + '@careshare.local',
          response: 'Email simulated (SMTP not configured)'
        };
      }
    };
  }
  
  // Create real Gmail SMTP transporter
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

const transporter = createEmailTransporter();

// Helper to safely extract latitude and longitude from a "lat,lng" string.
function parseCoordinates(locationStr) {
  if (!locationStr || typeof locationStr !== 'string') {
    return { lat: 'N/A', lng: 'N/A' };
  }
  const parts = locationStr.split(',');
  if (parts.length < 2) {
    return { lat: 'N/A', lng: 'N/A' };
  }
  return {
    lat: parts[0].trim(),
    lng: parts[1].trim()
  };
}

// Test email functionality
router.get('/testEmail', async (req, res) => {
  try {
    console.log('Testing email configuration...');
    
    const testMail = {
      from: process.env.EMAIL_USER || 'caresharefyp@gmail.com',
      to: process.env.EMAIL_USER || 'caresharefyp@gmail.com', // Send to self for testing
      subject: 'CareShare Email Test',
      html: `
        <h2>Email Test</h2>
        <p>This is a test email to verify the email configuration is working.</p>
        <p>Time: ${new Date().toLocaleString()}</p>
        <p>If you receive this, the email system is working correctly.</p>
      `
    };
    
    const result = await transporter.sendMail(testMail);
    console.log('Test email sent successfully:', result.messageId);
    
    res.json({
      success: true,
      message: 'Test email sent successfully',
      messageId: result.messageId,
      to: testMail.to
    });
    
  } catch (error) {
    console.error('Test email failed:', error);
    res.json({
      success: false,
      message: 'Test email failed',
      error: error.message,
      details: error
    });
  }
});

// Check if medicine is available in inventory
router.get('/checkMedicine', async (req, res) => {
  try {
    const { medicineName } = req.query;
    
    if (!medicineName) {
      return res.status(400).json({ error: 'Medicine name is required' });
    }
    
    // Check if medicine exists and is approved
    const medicine = await Donate.findOne({
      medicineName: medicineName,
      status: 'approved'
    });
    
    res.json({ available: !!medicine });
  } catch (error) {
    console.error('Error checking medicine availability:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Submit a medicine request
router.post('/medicineRequest', upload.single('prescription'), async (req, res) => {
  try {
    console.log('Medicine request received:', req.body);
    
    const { name, email, phoneNumber, address, city, location, medicineName, medicineQty, reason } = req.body;
    
    // Validate required fields
    if (!name || !email || !phoneNumber || !address || !medicineName || !medicineQty) {
      console.error('Missing required fields in medicine request');
      return res.status(400).json({ error: 'All required fields must be provided' });
    }
    
    // Log the prescription file if uploaded
    if (req.file) {
      console.log('Prescription file received:', req.file.filename);
    } else {
      console.log('No prescription file uploaded with request');
    }
    
    // Step 1: City-based donor validation
    if (city) {
      console.log(`Checking for donors in city: ${city}`);
      
      // Check if there's at least one donor in the same city
      const donorInCity = await Donate.findOne({
        city: city,
        status: 'approved'
      });
      
      if (!donorInCity) {
        console.log(`No donors found in city: ${city}`);
        return res.status(400).json({ 
          error: 'No donors available in your city at the moment.',
          message: 'No donors available in your city at the moment.'
        });
      }
      
      console.log(`Found donor(s) in city: ${city}`);
    }
    
    // Check if medicine exists and is available
    const medicine = await Donate.findOne({
      medicineName: medicineName,
      status: 'approved'
    });
    
    console.log('Medicine search result:', medicine ? 'Found' : 'Not found');
    
    if (!medicine) {
      console.error(`Medicine not found or not available: ${medicineName}`);
      return res.status(404).json({ error: 'Medicine not found or not available' });
    }
    
    // Check if quantity is valid
    const availableQty = parseInt(medicine.medicineQty);
    const requestedQty = parseInt(medicineQty);
    
    if (isNaN(availableQty) || isNaN(requestedQty)) {
      console.error('Invalid quantity values', { available: medicine.medicineQty, requested: medicineQty });
      return res.status(400).json({ 
        error: 'Invalid quantity values',
        message: 'Could not process the request due to invalid quantity values.'
      });
    }
    
    if (availableQty < requestedQty) {
      console.error(`Insufficient quantity: available=${availableQty}, requested=${requestedQty}`);
      return res.status(400).json({ 
        error: 'Insufficient quantity',
        message: `Only ${availableQty} units available, but ${requestedQty} were requested.`
      });
    }
    
    // Create new request
    const medicineRequest = new MedicineRequest({
      name,
      email,
      phoneNumber,
      address,
      city: city || '',
      location: location || '',
      medicineName,
      medicineQty: requestedQty,
      reason: reason || '',
      prescriptionUrl: req.file ? `/uploads/prescriptions/${req.file.filename}` : null,
      status: 'pending'
    });
    
    console.log('Creating medicine request with data:', {
      name,
      email,
      phoneNumber,
      medicineName,
      medicineQty: requestedQty,
      hasPrescription: !!req.file
    });
    
    await medicineRequest.save();
    console.log('Medicine request saved with ID:', medicineRequest._id);
    
    // Send confirmation email to recipient - quick and direct
    const mailOptions = {
      from: 'caresharefyp@gmail.com',
      to: email,
      subject: 'Medicine Request Received - CareShare',
      html: `
        <h2>Your Medicine Request Has Been Received</h2>
        <p>Dear ${name},</p>
        <p>Thank you for your medicine request. We have received your request for <strong>${medicineName}</strong>.</p>
        <p>Your request is currently under review. You will be notified once it is approved.</p>
        <p>Request Details:</p>
        <ul>
          <li>Medicine: ${medicineName}</li>
          <li>Quantity: ${requestedQty}</li>
          <li>Delivery Address: ${address}</li>
        </ul>
        <p>If you have any questions, please reply to this email.</p>
        <p>Warm regards,<br>CareShare Team</p>
      `
    };
    
    // Send email immediately without blocking the response
    transporter.sendMail(mailOptions).catch(err => {
      console.log('Email sending skipped due to:', err.message);
    });
    
    res.status(201).json({ 
      success: true, 
      message: 'Medicine request submitted successfully',
      requestId: medicineRequest._id
    });
  } catch (error) {
    console.error('Error submitting medicine request:', error);
    res.status(500).json({ error: 'Server error processing request. Please try again.' });
  }
});

// Get all medicine requests (for admin)
router.get('/medicineRequests', async (req, res) => {
  try {
    const requests = await MedicineRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    console.error('Error fetching medicine requests:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Approve a medicine request
router.post('/approveMedicineRequest/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get the request details first
    const request = await MedicineRequest.findById(id);
    
    if (!request) {
      return res.status(404).json({ error: 'Medicine request not found' });
    }
    
    // Find the medicine in the database
    const medicine = await Donate.findOne({ 
      medicineName: request.medicineName,
      status: 'approved'
    });
    
    if (!medicine) {
      return res.status(404).json({ 
        error: 'Medicine not found or not available',
        message: 'The requested medicine is no longer available.'
      });
    }
    
    // Check if there's enough quantity available
    const availableQty = parseInt(medicine.medicineQty);
    const requestedQty = parseInt(request.medicineQty);
    
    if (isNaN(availableQty) || isNaN(requestedQty)) {
      return res.status(400).json({ 
        error: 'Invalid quantity values',
        message: 'Could not process the request due to invalid quantity values.'
      });
    }
    
    if (availableQty < requestedQty) {
      return res.status(400).json({ 
        error: 'Insufficient quantity',
        message: `Only ${availableQty} units available, but ${requestedQty} were requested.`
      });
    }
    
    // ---------- Proceed with approval ----------
    // Calculate the new quantity
    const newQuantity = availableQty - requestedQty;

    // Update the medicine quantity in the database
    await Donate.findByIdAndUpdate(
      medicine._id,
      { medicineQty: newQuantity.toString() }
    );

    // Update request status
    await MedicineRequest.findByIdAndUpdate(
      id,
      {
        status: 'approved',
        donorInfo: {
          name: medicine.name,
          email: medicine.email,
          phone: medicine.mobile
        }
      }
    );

    res.json({
      success: true,
      message: 'Medicine request approved successfully',
      updatedQuantity: newQuantity
    });
  } catch (error) {
    console.error('Error approving medicine request:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Reject a medicine request
router.post('/rejectMedicineRequest/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Update request status
    const request = await MedicineRequest.findByIdAndUpdate(
      id, 
      { status: 'rejected' },
      { new: true }
    );
    
    if (!request) {
      return res.status(404).json({ error: 'Medicine request not found' });
    }
    
    // Send rejection email to recipient - quick and direct
    const mailOptions = {
      from: process.env.EMAIL_USER || 'caresharefyp@gmail.com',
      to: request.email,
      subject: 'Medicine Request Update - CareShare',
      html: `
        <h2>Your Medicine Request Status</h2>
        <p>Dear ${request.name},</p>
        <p>We regret to inform you that your request for <strong>${request.medicineName}</strong> cannot be fulfilled at this time.</p>
        <p>This may be due to one of the following reasons:</p>
        <ul>
          <li>The medicine is no longer available</li>
          <li>Your request information was incomplete or did not meet our requirements</li>
          <li>There was an issue with the prescription or documentation provided</li>
        </ul>
        <p>You are welcome to submit a new request or contact us for more information.</p>
        <p>Thank you for your understanding.</p>
        <p>Warm regards,<br>CareShare Team</p>
      `
    };
    
    // Send email immediately without blocking
    transporter.sendMail(mailOptions).catch(err => {
      console.log('Rejection email skipped due to:', err.message);
    });
    
    res.json({ success: true, message: 'Medicine request rejected successfully' });
  } catch (error) {
    console.error('Error rejecting medicine request:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Send donor contact information to the recipient
router.post('/sendMedicineEmail/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the request
    const request = await MedicineRequest.findById(id);
    
    if (!request) {
      return res.status(404).json({ error: 'Medicine request not found' });
    }
    
    if (request.status !== 'approved') {
      return res.status(400).json({ error: 'Cannot send donor information for unapproved requests' });
    }
    
    // Find donor information if not already stored
    if (!request.donorInfo.name) {
      const medicine = await Donate.findOne({ medicineName: request.medicineName });
      
      if (medicine) {
        request.donorInfo = {
          name: medicine.name,
          email: medicine.email,
          phone: medicine.mobile
        };
        
        await request.save();
      } else {
        return res.status(404).json({ error: 'Donor information not found' });
      }
    }
    
    // ----- Compose & send two emails (donor + recipient) -----
    const medicine = await Donate.findOne({ medicineName: request.medicineName });

    if (!medicine) {
      return res.status(404).json({ error: 'Donor information not found' });
    }

    const donorCoords = parseCoordinates(medicine.location);
    const recipientCoords = parseCoordinates(request.location);

    const donorMail = {
      from: process.env.EMAIL_USER || 'caresharefyp@gmail.com',
      to: medicine.email,
      subject: 'CareShare: A recipient will collect your donated medicine',
      html: `
        <h2>Recipient Details for Medicine Pickup</h2>
        <p>Dear ${medicine.name || 'Donor'},</p>
        <p>The following recipient will collect <strong>${request.medicineName}</strong> (Quantity: ${request.medicineQty}). Please coordinate with them for hand-over.</p>
        <h3>Recipient Information</h3>
        <ul>
          <li><strong>Name:</strong> ${request.name}</li>
          <li><strong>Email:</strong> ${request.email}</li>
          <li><strong>Phone:</strong> ${request.phoneNumber || 'N/A'}</li>
          <li><strong>Location (lat, lng):</strong> ${recipientCoords.lat}, ${recipientCoords.lng}</li>
          <li><strong>Google Maps Link:</strong> @https://www.google.com/maps?q=${recipientCoords.lat},${recipientCoords.lng}</li>
        </ul>
        <p>Thank you for supporting CareShare!</p>
      `
    };

    const recipientMail = {
      from: process.env.EMAIL_USER || 'caresharefyp@gmail.com',
      to: request.email,
      subject: 'CareShare: Donor contact information for your medicine pickup',
      html: `
        <h2>Donor Contact Information</h2>
        <p>Dear ${request.name},</p>
        <p>Your request for <strong>${request.medicineName}</strong> has been approved and is ready for pickup.</p>
        <h3>Donor Information</h3>
        <ul>
          <li><strong>Name:</strong> ${medicine.name}</li>
          <li><strong>Email:</strong> ${medicine.email}</li>
          <li><strong>Phone:</strong> ${medicine.mobile || 'N/A'}</li>
          <li><strong>Location (lat, lng):</strong> ${donorCoords.lat}, ${donorCoords.lng}</li>
          <li><strong>Google Maps Link:</strong> @https://www.google.com/maps?q=${donorCoords.lat},${donorCoords.lng}</li>
        </ul>
        <p>Please reach out to the donor to arrange a convenient pickup time.</p>
        <p>Warm regards,<br/>CareShare Team</p>
      `
    };

    // Test email sending with proper error handling
    try {
      console.log('Attempting to send emails...');
      console.log('Donor email:', medicine.email);
      console.log('Recipient email:', request.email);
      
      const emailResults = await Promise.allSettled([
        transporter.sendMail(donorMail),
        transporter.sendMail(recipientMail)
      ]);
      
      let emailsSent = 0;
      let emailErrors = [];
      
      emailResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          emailsSent++;
          console.log(`Email ${index + 1} sent successfully:`, result.value.messageId);
        } else {
          emailErrors.push(result.reason.message);
          console.error(`Email ${index + 1} failed:`, result.reason.message);
        }
      });
      
      // Update flag regardless of email status
      request.donorContactShared = true;
      await request.save();
      
      if (emailsSent > 0) {
        res.json({ 
          success: true, 
          message: `${emailsSent} out of 2 emails sent successfully`,
          emailsSent: emailsSent,
          errors: emailErrors
        });
      } else {
        res.json({ 
          success: false, 
          message: 'Failed to send emails',
          errors: emailErrors
        });
      }
      
    } catch (error) {
      console.error('Error in email sending process:', error);
      res.json({ 
        success: false, 
        message: 'Email sending failed: ' + error.message,
        error: error.message
      });
    }
  } catch (error) {
    console.error('Error sending donor information:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 