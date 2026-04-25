const express = require('express');
const router = express.Router();
const { createWorker } = require('tesseract.js');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Simple test endpoint to check OCR and server status
router.get('/testOCR', (req, res) => {
  try {
    // List all files in uploads directory
    const uploadsPath = path.join(__dirname, '..', 'uploads');
    let files = [];
    
    if (fs.existsSync(uploadsPath)) {
      files = fs.readdirSync(uploadsPath);
    }
    
    // Get server info
    const info = {
      tesseractVersion: require('tesseract.js/package.json').version,
      serverTime: new Date().toISOString(),
      uploadsDirectory: uploadsPath,
      uploadsExists: fs.existsSync(uploadsPath),
      files: files,
      tempDirectory: path.join(__dirname, '..', 'temp'),
      tempExists: fs.existsSync(path.join(__dirname, '..', 'temp'))
    };
    
    return res.json({
      success: true,
      message: 'OCR service is running',
      info
    });
  } catch (error) {
    console.error('Test endpoint error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
});

// Process an image and extract text using OCR
router.post('/processOCR', async (req, res) => {
  try {
    console.log('OCR Request received:', req.body);
    const { imageUrl } = req.body;
    
    if (!imageUrl) {
      console.log('Missing imageUrl parameter');
      return res.status(400).json({ success: false, error: 'Image URL is required' });
    }
    
    let imagePath;
    
    // If the image is hosted on our server or is a relative URL
    if (!imageUrl.startsWith('http')) {
      // Remove leading slash if present
      const cleanUrl = imageUrl.replace(/^\//, '');
      console.log('Processing local image path:', cleanUrl);
      
      // Check if it's an uploads path
      if (cleanUrl.includes('uploads/')) {
        imagePath = path.join(__dirname, '..', cleanUrl);
      } else {
        imagePath = path.join(__dirname, '..', 'uploads', cleanUrl);
      }
      
      console.log('Resolved image path:', imagePath);
      
      // Check if file exists
      if (!fs.existsSync(imagePath)) {
        console.log('File not found at path:', imagePath);
        
        // Try alternative path formats
        const alternativePath = path.join(__dirname, '..', cleanUrl.replace('uploads/', ''));
        console.log('Trying alternative path:', alternativePath);
        
        if (fs.existsSync(alternativePath)) {
          imagePath = alternativePath;
          console.log('Found file at alternative path');
        } else {
          return res.status(404).json({ success: false, error: 'Image file not found' });
        }
      }
    } else {
      console.log('Processing external image URL:', imageUrl);
      // For external images, download them first
      try {
        const response = await axios.get(imageUrl, { 
          responseType: 'arraybuffer',
          timeout: 10000 // 10 second timeout
        });
        
        console.log('External image downloaded successfully');
        const buffer = Buffer.from(response.data, 'binary');
        
        // Create a temporary file
        const tempDir = path.join(__dirname, '..', 'temp');
        if (!fs.existsSync(tempDir)) {
          fs.mkdirSync(tempDir, { recursive: true });
        }
        
        const tempFile = path.join(tempDir, `temp_${Date.now()}.jpg`);
        fs.writeFileSync(tempFile, buffer);
        imagePath = tempFile;
        console.log('Saved external image to:', imagePath);
      } catch (downloadError) {
        console.error('Error downloading external image:', downloadError.message);
        return res.status(500).json({ 
          success: false, 
          error: 'Failed to download image', 
          details: downloadError.message 
        });
      }
    }
    
    console.log('Starting OCR processing on image:', imagePath);
    
    // Initialize Tesseract.js worker
    const worker = await createWorker('eng');
    console.log('Tesseract worker initialized');
    
    // Recognize text in the image
    try {
      console.log('Starting text recognition...');
      const { data: { text } } = await worker.recognize(imagePath);
      console.log('Text recognition completed successfully');
      
      // Terminate worker
      await worker.terminate();
      console.log('Tesseract worker terminated');
      
      // Clean up temporary file if created
      if (imagePath.includes('temp_')) {
        fs.unlinkSync(imagePath);
        console.log('Temporary image file cleaned up');
      }
      
      // Return the extracted text
      return res.json({ success: true, text });
    } catch (recognitionError) {
      console.error('Text recognition error:', recognitionError);
      // Ensure worker is terminated even on error
      await worker.terminate();
      throw new Error(`OCR recognition failed: ${recognitionError.message}`);
    }
    
  } catch (error) {
    console.error('OCR processing error:', error.message);
    console.error('Error stack:', error.stack);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to process image with OCR', 
      details: error.message 
    });
  }
});

module.exports = router; 