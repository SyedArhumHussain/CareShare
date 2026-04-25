# Troubleshooting Guide for CareShare

## Common Medicine Request Issues

### Error: "Donate.findOne is not a function"

This error occurs when the Mongoose model is not properly imported in the routes file.

**Fix:**
1. Open `routes/medicineRequestRoutes.js`
2. Replace:
   ```javascript
   const Donate = require('../model/Donate');
   ```
   With:
   ```javascript
   const mongoose = require('mongoose');
   require('../model/Donate');
   const Donate = mongoose.model('Donate');
   ```

3. Restart your server

Alternatively, run the fix script:
```
node fix-medicine-requests.js
```

### Missing Uploads Directory

If you get errors about missing directories when uploading prescription files:

**Fix:**
```
mkdir -p uploads/prescriptions
```

### Email Configuration Issues

If emails aren't being sent:

1. Check your `.env` file to ensure EMAIL_USER and EMAIL_PASSWORD are set
2. If using Gmail, make sure you're using an App Password, not your regular password
3. Test your email configuration with:
   ```
   node -e "const nodemailer = require('nodemailer'); const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD } }); transporter.verify().then(() => console.log('Email configuration is correct')).catch(err => console.error('Email configuration error:', err));"
   ```

## General Troubleshooting Steps

1. Check server logs for specific error messages
2. Ensure MongoDB is running and accessible
3. Verify all required npm packages are installed:
   ```
   npm install mongoose express multer nodemailer
   ```
4. Make sure models are properly registered before using them
5. If all else fails, try the restart script:
   ```
   node restart.js
   ```

## Application Startup Checklist

1. Database connection is established
2. All models are loaded in the correct order
3. Uploads directory exists and is writable
4. Environment variables are properly set
5. Port 4000 is available for the server 