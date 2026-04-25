const express = require('express');
const router = express.Router();
require('dotenv').config();

// Audio processing for Gemini Live API
router.post('/gemini-audio', async (req, res) => {
  try {
    const { audioData, mimeType, action } = req.body;
    
    // Validate audio data
    if (!audioData) {
      return res.status(400).json({ error: 'Audio data is required' });
    }
    
    // For now, we'll just acknowledge the audio reception
    // The actual Google Gemini integration should be done on the frontend
    // to avoid exposing the API key on the server
    
    res.json({ 
      success: true, 
      message: 'Audio data received',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error processing Gemini audio:', error);
    res.status(500).json({ error: 'Server error processing audio' });
  }
});

// Text processing for enhanced chatbot responses
router.post('/gemini-text', async (req, res) => {
  try {
    const { message, language, context } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    // Enhanced fallback responses based on CareShare context
    const careShareContext = {
      platform: 'CareShare Medicine Donation Platform',
      features: [
        'Medicine donation',
        'Medicine requests', 
        'City-based matching',
        'Admin approval system',
        'Email notifications'
      ],
      supportedLanguages: ['English', 'Urdu']
    };
    
    res.json({
      success: true,
      response: message,
      context: careShareContext,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error processing Gemini text:', error);
    res.status(500).json({ error: 'Server error processing text' });
  }
});

module.exports = router; 