const nodemailer = require('nodemailer');
require('dotenv').config();

// Test email configuration
async function testEmailConfiguration() {
  console.log('🔍 Testing Email Configuration...\n');
  
  const emailUser = process.env.EMAIL_USER;
  const emailPassword = process.env.EMAIL_PASSWORD;
  
  if (!emailUser || !emailPassword) {
    console.log('❌ Email credentials not found in .env file');
    console.log('   Please add EMAIL_USER and EMAIL_PASSWORD to your .env file');
    console.log('   See EMAIL_SETUP_GUIDE.md for detailed instructions');
    return false;
  }
  
  console.log('✅ Email credentials found in .env file');
  console.log(`   EMAIL_USER: ${emailUser}`);
  console.log(`   EMAIL_PASSWORD: ${emailPassword.substring(0, 4)}... (hidden)\n`);
  
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
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
    
    console.log('🔗 Testing SMTP connection...');
    
    // Verify connection
    await transporter.verify();
    console.log('✅ SMTP connection successful!\n');
    
    // Send test email
    console.log('📧 Sending test email...');
    
    const testMail = {
      from: emailUser,
      to: emailUser, // Send to self for testing
      subject: 'CareShare Email Test - ' + new Date().toLocaleString(),
      html: `
        <h2>✅ Email Configuration Test Successful!</h2>
        <p>This is a test email from your CareShare application.</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>From:</strong> ${emailUser}</p>
        <p>If you received this email, your email configuration is working correctly!</p>
        <hr>
        <p><em>This email was sent from the CareShare email test script.</em></p>
      `
    };
    
    const result = await transporter.sendMail(testMail);
    
    console.log('✅ Test email sent successfully!');
    console.log(`   Message ID: ${result.messageId}`);
    console.log(`   Response: ${result.response}`);
    console.log(`   Check your inbox: ${emailUser}\n`);
    
    console.log('🎉 Email configuration is working perfectly!');
    console.log('   You can now use the admin panel to send emails to donors and recipients.');
    
    return true;
    
  } catch (error) {
    console.log('❌ Email configuration test failed:');
    console.log(`   Error: ${error.message}\n`);
    
    if (error.code === 'EAUTH') {
      console.log('💡 Authentication failed. Please check:');
      console.log('   1. Your Gmail has 2-Factor Authentication enabled');
      console.log('   2. You are using an App Password (not your regular password)');
      console.log('   3. The App Password is correct (16 characters with spaces)');
    } else if (error.code === 'ENOTFOUND') {
      console.log('💡 Network connection failed. Please check:');
      console.log('   1. Your internet connection');
      console.log('   2. Firewall settings');
    } else {
      console.log('💡 For troubleshooting help, see EMAIL_SETUP_GUIDE.md');
    }
    
    return false;
  }
}

// Run the test
testEmailConfiguration()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Unexpected error:', error);
    process.exit(1);
  }); 