import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Fab,
  Paper,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  Zoom,
  Tooltip,
  Avatar,
  Box,
  CircularProgress,
  Alert,
  Button,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Chat as ChatIcon,
  Close as CloseIcon,
  Send as SendIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  VolumeUp as VolumeUpIcon,
  VolumeOff as VolumeOffIcon,
  Settings as SettingsIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import './chatbot.css';

// Note: In production, use environment variables for API keys
const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

const GeminiAudioChatbot = () => {
  const theme = useTheme();
  const [messages, setMessages] = useState([
    {
      text: "🎙️ Hi! I'm CareShare's AI assistant with voice capabilities. You can speak to me or type your questions about medicine donations. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Refs for audio processing
  const audioContextRef = useRef(null);
  const audioStreamRef = useRef(null);
  const websocketRef = useRef(null);
  const messageEndRef = useRef(null);
  const audioOutputRef = useRef(null);
  
  // Audio configuration
  const SAMPLE_RATE = 16000;
  const CHUNK_SIZE = 1024;

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Initialize audio context and check permissions
  const initializeAudio = useCallback(async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Audio recording not supported in this browser');
      }

      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: SAMPLE_RATE,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true
        } 
      });
      
      audioStreamRef.current = stream;
      
      // Initialize Web Audio API
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({
        sampleRate: SAMPLE_RATE
      });
      
      return true;
    } catch (error) {
      console.error('Error initializing audio:', error);
      setErrorMessage('Microphone access denied or not available');
      return false;
    }
  }, []);

  // Connect to Gemini Live API (simulated - you'll need to implement actual WebSocket connection)
  const connectToGemini = useCallback(async () => {
    if (!GEMINI_API_KEY) {
      setErrorMessage('Gemini API key not configured. Please set REACT_APP_GEMINI_API_KEY environment variable.');
      return false;
    }

    try {
      setIsLoading(true);
      
      // In a real implementation, you would connect to Gemini Live API WebSocket
      // For now, we'll simulate the connection
      setTimeout(() => {
        setIsConnected(true);
        setIsLoading(false);
        addMessage('🔗 Connected to AI voice assistant!', 'system');
      }, 1000);
      
      return true;
    } catch (error) {
      console.error('Error connecting to Gemini:', error);
      setErrorMessage('Failed to connect to AI service');
      setIsLoading(false);
      return false;
    }
  }, []);

  // Start voice recording
  const startRecording = async () => {
    if (!audioContextRef.current || !audioStreamRef.current) {
      const success = await initializeAudio();
      if (!success) return;
    }

    if (!isConnected) {
      const connected = await connectToGemini();
      if (!connected) return;
    }

    try {
      setIsRecording(true);
      setErrorMessage('');
      
      // Create audio processor
      const source = audioContextRef.current.createMediaStreamSource(audioStreamRef.current);
      const processor = audioContextRef.current.createScriptProcessor(CHUNK_SIZE, 1, 1);
      
      processor.onaudioprocess = (event) => {
        if (isRecording) {
          const inputBuffer = event.inputBuffer.getChannelData(0);
          // Convert Float32Array to PCM16
          const pcm16Buffer = new Int16Array(inputBuffer.length);
          for (let i = 0; i < inputBuffer.length; i++) {
            pcm16Buffer[i] = Math.max(-32768, Math.min(32767, inputBuffer[i] * 32768));
          }
          
          // Send audio data to Gemini Live API (simulated)
          sendAudioToGemini(pcm16Buffer);
        }
      };
      
      source.connect(processor);
      processor.connect(audioContextRef.current.destination);
      
    } catch (error) {
      console.error('Error starting recording:', error);
      setErrorMessage('Failed to start recording');
      setIsRecording(false);
    }
  };

  // Stop voice recording
  const stopRecording = () => {
    setIsRecording(false);
    
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  // Send audio data to Gemini Live API (simulated)
  const sendAudioToGemini = (audioData) => {
    // In real implementation, send audio data to Gemini Live API WebSocket
    // For now, we'll simulate processing
    if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
      const audioMessage = {
        type: 'audio',
        data: Array.from(audioData),
        mimeType: 'audio/pcm'
      };
      websocketRef.current.send(JSON.stringify(audioMessage));
    }
  };

  // Add message to chat
  const addMessage = (text, sender, isAudio = false) => {
    const newMessage = {
      text,
      sender,
      timestamp: new Date(),
      isAudio
    };
    setMessages(prev => [...prev, newMessage]);
  };

  // Handle text input submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    addMessage(userMessage, 'user');
    setIsLoading(true);

    try {
      // Send to enhanced backend for processing
      const response = await fetch('http://localhost:4000/gemini-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          language: 'en',
          context: 'careshare'
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Generate contextual response for CareShare
        const botResponse = generateCareShareResponse(userMessage);
        addMessage(botResponse, 'bot');
        
        // Speak the response if audio is enabled
        if (audioEnabled) {
          speakText(botResponse);
        }
      } else {
        addMessage('Sorry, I encountered an error. Please try again.', 'bot');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      addMessage('Connection error. Please check your internet and try again.', 'bot');
    }

    setIsLoading(false);
  };

  // Generate CareShare-specific responses
  const generateCareShareResponse = (input) => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('donate') || lowerInput.includes('donation')) {
      return `To donate medicines on CareShare:\n\n1. 📝 Create an account\n2. 🏥 Click "Donate Medicine"\n3. 📋 Fill in medicine details (name, quantity, expiry)\n4. 🏙️ Specify your city for local matching\n5. 📸 Upload medicine images\n6. ✅ Submit for admin approval\n\nYour donations help people in your city access needed medications!`;
    }
    
    if (lowerInput.includes('request') || lowerInput.includes('need')) {
      return `To request medicines on CareShare:\n\n1. 📝 Create an account\n2. 🔍 Browse available medicines or click "Request Medicine"\n3. 🏙️ Enter your city (we match with local donors)\n4. 📋 Fill request details and upload prescription\n5. ⏳ Wait for admin approval\n6. 📧 Receive donor contact info via email\n\nWe only show requests where donors exist in your city!`;
    }
    
    if (lowerInput.includes('city') || lowerInput.includes('location')) {
      return `🏙️ CareShare uses city-based matching to connect donors and recipients locally:\n\n✅ Benefits:\n• Faster medicine delivery\n• Local community support\n• Reduced shipping costs\n• Better coordination\n\n📍 When you submit a request, we verify donors exist in your city first. This ensures successful matches!`;
    }
    
    if (lowerInput.includes('admin') || lowerInput.includes('approval')) {
      return `👨‍💼 Our admin team reviews:\n\n📋 Medicine Donations:\n• Verify medicine details\n• Check expiry dates\n• Approve/reject submissions\n\n📝 Medicine Requests:\n• Review prescriptions\n• Validate recipient info\n• Send contact details to both parties\n\n📧 Admins can send emails to connect donors and recipients after approval!`;
    }
    
    if (lowerInput.includes('voice') || lowerInput.includes('audio') || lowerInput.includes('speak')) {
      return `🎙️ Voice Features:\n\n• Speak your questions naturally\n• I can respond with voice\n• Supports English and Urdu\n• Toggle audio on/off in settings\n\nJust click the microphone button to start talking!`;
    }
    
    // Default response
    return `I'm here to help with CareShare! I can assist you with:\n\n🏥 Medicine donations\n💊 Medicine requests\n🏙️ City-based matching\n👨‍💼 Admin processes\n🎙️ Voice interactions\n\nWhat would you like to know more about?`;
  };

  // Text-to-speech functionality
  const speakText = (text) => {
    if (!audioEnabled || !window.speechSynthesis) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 0.8;
    
    // Try to use a female voice if available
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(voice => 
      voice.name.toLowerCase().includes('female') || 
      voice.name.toLowerCase().includes('zira') ||
      voice.name.toLowerCase().includes('hazel')
    );
    
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }
    
    window.speechSynthesis.speak(utterance);
  };

  // Toggle recording
  const handleMicClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <Zoom in={!isOpen}>
        <Fab
          color="primary"
          onClick={() => setIsOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            zIndex: 1000,
            background: 'linear-gradient(45deg, #2E7D32 30%, #4CAF50 90%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #1B5E20 30%, #388E3C 90%)',
            }
          }}
        >
          <ChatIcon />
        </Fab>
      </Zoom>

      {/* Chat Window */}
      <Zoom in={isOpen}>
        <Paper
          elevation={8}
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            width: { xs: '90vw', sm: 400 },
            height: { xs: '80vh', sm: 500 },
            zIndex: 1001,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 3,
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <Box
            sx={{
              background: 'linear-gradient(45deg, #2E7D32 30%, #4CAF50 90%)',
              color: 'white',
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 32, height: 32 }}>
                🤖
              </Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  CareShare AI
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  {isConnected ? '🟢 Connected' : '🟡 Connecting...'}
                </Typography>
              </Box>
            </Box>
            <Box>
              <IconButton
                size="small"
                onClick={() => setShowSettings(!showSettings)}
                sx={{ color: 'white', mr: 1 }}
              >
                <SettingsIcon />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => setIsOpen(false)}
                sx={{ color: 'white' }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Settings Panel */}
          {showSettings && (
            <Box sx={{ p: 2, bgcolor: 'grey.100', borderBottom: 1, borderColor: 'grey.300' }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={audioEnabled}
                    onChange={(e) => setAudioEnabled(e.target.checked)}
                    size="small"
                  />
                }
                label="Voice Responses"
              />
            </Box>
          )}

          {/* Error Display */}
          {errorMessage && (
            <Alert severity="warning" onClose={() => setErrorMessage('')} sx={{ m: 1 }}>
              {errorMessage}
            </Alert>
          )}

          {/* Messages */}
          <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
            {messages.map((message, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                  mb: 2
                }}
              >
                <Paper
                  elevation={1}
                  sx={{
                    p: 1.5,
                    maxWidth: '80%',
                    bgcolor: message.sender === 'user' ? 'primary.main' : 'grey.100',
                    color: message.sender === 'user' ? 'white' : 'text.primary',
                    borderRadius: 2,
                    whiteSpace: 'pre-line'
                  }}
                >
                  <Typography variant="body2">{message.text}</Typography>
                  {message.isAudio && (
                    <VolumeUpIcon sx={{ fontSize: 16, ml: 1, opacity: 0.7 }} />
                  )}
                </Paper>
              </Box>
            ))}
            
            {isLoading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                <CircularProgress size={24} />
              </Box>
            )}
            <div ref={messageEndRef} />
          </Box>

          {/* Input Area */}
          <Box sx={{ p: 2, borderTop: 1, borderColor: 'grey.300' }}>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                size="small"
                placeholder="Type or speak your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title={isRecording ? 'Stop Recording' : 'Start Voice Input'}>
                        <IconButton
                          onClick={handleMicClick}
                          color={isRecording ? 'error' : 'primary'}
                          disabled={isLoading}
                        >
                          {isRecording ? <MicOffIcon /> : <MicIcon />}
                        </IconButton>
                      </Tooltip>
                      <IconButton
                        type="submit"
                        color="primary"
                        disabled={!input.trim() || isLoading}
                      >
                        <SendIcon />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </form>
            
            {/* Recording Indicator */}
            {isRecording && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    bgcolor: 'error.main',
                    borderRadius: '50%',
                    animation: 'pulse 1s infinite'
                  }}
                />
                <Typography variant="caption" color="error">
                  Recording... Speak now
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>
      </Zoom>

      {/* CSS for pulse animation */}
      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.3; }
          100% { opacity: 1; }
        }
      `}</style>
    </>
  );
};

export default GeminiAudioChatbot; 