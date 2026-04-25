import React, { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';
import './chatbot.css';
import ReactMarkdown from 'react-markdown';
import { useTheme } from '@mui/material/styles';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { 
  Fab, 
  Paper, 
  Typography, 
  IconButton, 
  TextField, 
  InputAdornment, 
  Zoom, 
  Grow, 
  Tooltip, 
  Badge,
  Avatar,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  Chip
} from '@mui/material';
import { 
  Chat as ChatIcon, 
  Close as CloseIcon, 
  Send as SendIcon, 
  Mic as MicIcon, 
  MicOff as MicOffIcon, 
  VolumeUp as VolumeUpIcon, 
  VolumeOff as VolumeOffIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

// Fallback responses for common queries to use when API is unavailable
const FALLBACK_RESPONSES = {
  // Greetings
  greeting: {
    en: "Hello! How can I help you with medicine donations or requests today?",
    ur: "السلام علیکم! میں آج آپ کی دوا کے عطیات یا درخواستوں میں کیسے مدد کر سکتا ہوں؟"
  },
  // Help responses
  help: {
    en: "I can help you donate medicines, request medicines, learn about the platform, or contact support.",
    ur: "میں آپ کی ادویات کا عطیہ کرنے، ادویات کی درخواست کرنے، پلیٹ فارم کے بارے میں جاننے، یا سپورٹ سے رابطہ کرنے میں مدد کر سکتا ہوں۔"
  },
  // Donation information
  donate: {
    en: "To donate: Create account, click 'Donate Medicine', fill medicine details, upload images, and submit. Our team will review it.",
    ur: "عطیہ کرنے کے لیے: اکاؤنٹ بنائیں، 'دوا کا عطیہ' پر کلک کریں، دوا کی تفصیلات بھریں، تصاویر اپلوڈ کریں اور جمع کریں۔"
  },
  // Request information
  request: {
    en: "To request: Create account, browse medicines or click 'Request Medicine', select what you need, provide details and prescription, then submit.",
    ur: "درخواست کے لیے: اکاؤنٹ بنائیں، ادویات دیکھیں یا 'دوا کی درخواست' پر کلک کریں، اپنی ضرورت منتخب کریں، تفصیلات اور نسخہ دیں۔"
  },
  // About the platform
  about: {
    en: "CareShare connects medicine donors with recipients. We help reduce medicine waste by letting people donate unused medicines to those in need.",
    ur: "کیئر شیئر دوا کے عطیہ دہندگان کو ضرورت مندوں سے جوڑتا ہے۔ ہم غیر استعمال شدہ ادویات کا عطیہ کرکے دوا کا ضیاع کم کرتے ہیں۔"
  },
  // Contact information
  contact: {
    en: "Contact us at support@careshare.org or visit our Contact page for more options.",
    ur: "ہم سے support@careshare.org پر رابطہ کریں یا مزید آپشنز کے لیے ہمارا رابطہ صفحہ دیکھیں۔"
  },
  // Default fallback response
  default: {
    en: "I help with medicine donations, requests, and platform info. What do you need to know?",
    ur: "میں دوا کے عطیات، درخواستوں، اور پلیٹ فارم کی معلومات میں مدد کرتا ہوں۔ آپ کو کیا جاننا ہے؟"
  }
};

// Generate a fallback response based on user input
const generateFallbackResponse = (userInput) => {
  // Determine language
  const isUrdu = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(userInput) || 
                /\b(aap|ap|tum|aap ka|ap ka|kya|kaise|kyun|kese|mein|main|mujhe|hum|humein|dawa|dua|medicine|madad|help urdu|pakistan|lahore|karachi)\b/i.test(userInput);
  
  const lang = isUrdu ? 'ur' : 'en';
  const input = userInput.toLowerCase();
  
  // Check for greetings
  if (/\b(hi|hello|hey|salam|asalam|assalam|aoa|greet|namaste)\b/i.test(input)) {
    return FALLBACK_RESPONSES.greeting[lang];
  }
  
  // Check for help requests
  if (/\b(help|madad|guide|assist|support|how|kaise|kese)\b/i.test(input)) {
    return FALLBACK_RESPONSES.help[lang];
  }
  
  // Check for donation queries
  if (/\b(donat|contribute|give|send|provide|atiya|dena|bhej|donator)\b/i.test(input)) {
    return FALLBACK_RESPONSES.donate[lang];
  }
  
  // Check for request queries
  if (/\b(request|need|want|get|receive|chahiye|darkh?wast|lena|mil|recipient)\b/i.test(input)) {
    return FALLBACK_RESPONSES.request[lang];
  }
  
  // Check for about queries
  if (/\b(about|what is|who are|platform|website|careshare|kya hai|kon hai|bare|information)\b/i.test(input)) {
    return FALLBACK_RESPONSES.about[lang];
  }
  
  // Check for contact queries
  if (/\b(contact|connect|reach|email|phone|call|message|rabta|sampark)\b/i.test(input)) {
    return FALLBACK_RESPONSES.contact[lang];
  }
  
  // Check for medical/health queries (including COVID-19)
  if (/\b(covid|corona|virus|19|symptoms|nuqsanat|bimari|sehat|health|medical|dawa|ilaj)\b/i.test(input)) {
    const medicalResponse = lang === 'ur' 
      ? "میں CareShare کا اسسٹنٹ ہوں اور طبی مشورہ نہیں دے سکتا۔ کسی بھی صحت کے مسئلے کے لیے ڈاکٹر سے رجوع کریں۔ میں صرف دوا کے عطیات میں مدد کر سکتا ہوں۔"
      : "I'm CareShare assistant and cannot provide medical advice. Please consult a healthcare professional for any health concerns. I can only help with medicine donations.";
    return medicalResponse;
  }
  
  // Default response
  return FALLBACK_RESPONSES.default[lang];
};

const Chatbot = () => {
  const theme = useTheme();
  const [messages, setMessages] = useState([
    {
      text: "🎙️ Hi there! I'm CareShare's enhanced AI assistant with voice capabilities. How can I help with medicine donations or requests today? You can type or speak in English or Urdu.",
      sender: 'bot',
    },
  ]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [newMessageAlert, setNewMessageAlert] = useState(0);
  const [useFallback, setUseFallback] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en-US');
  const messageEndRef = useRef(null);
  const inputRef = useRef(null);

  // React Speech Recognition hook
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Increment new message alert when bot responds and chatbot is closed
  useEffect(() => {
    if (!isOpen && messages.length > 0 && messages[messages.length - 1].sender === 'bot') {
      setNewMessageAlert(prev => prev + 1);
    }
  }, [messages, isOpen]);

  // Reset alert counter when opening the chatbot
  useEffect(() => {
    if (isOpen) {
      setNewMessageAlert(0);
    }
  }, [isOpen]);

  // Show welcome notification after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNotification(true);
    }, 3000); // Show notification after 3 seconds
    
    return () => clearTimeout(timer);
  }, []);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle notification close
  const handleNotificationClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowNotification(false);
  };

  // Open chatbot when notification is clicked
  const handleNotificationClick = () => {
    setIsOpen(true);
    setShowNotification(false);
  };

  // Detect if text is primarily Urdu
  const isUrduText = (text) => {
    if (!text) return false;
    
    // Check for Urdu Unicode character ranges
    const urduPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
    // Count Urdu characters
    let urduCount = 0;
    for (const char of text) {
      if (urduPattern.test(char)) {
        urduCount++;
      }
    }
    // If more than 40% of characters are Urdu, consider it Urdu text
    return urduCount > text.length * 0.4;
  };

  // Language switching function
  const switchLanguage = useCallback(() => {
    const newLanguage = currentLanguage === 'en-US' ? 'ur-PK' : 'en-US';
    setCurrentLanguage(newLanguage);
    
    // Stop current recognition if running
    if (listening) {
      SpeechRecognition.stopListening();
    }
  }, [currentLanguage, listening]);

  // Start speech recognition with current language
  const startListening = useCallback(() => {
    if (!browserSupportsSpeechRecognition) {
      alert('Your browser does not support speech recognition.');
      return;
    }

    resetTranscript();
    SpeechRecognition.startListening({
      continuous: true,
      language: currentLanguage,
      interimResults: true
    });
  }, [browserSupportsSpeechRecognition, resetTranscript, currentLanguage]);

  // Stop speech recognition
  const stopListening = useCallback(() => {
    SpeechRecognition.stopListening();
  }, []);

  // Define handleSubmit with useCallback to avoid recreation on every render
  const handleSubmit = useCallback(async (e, overrideInput = null) => {
    if (e) e.preventDefault();
    const userInput = overrideInput || input.trim();
    if (!userInput) return;

    // Stop recording if active
    if (listening) {
      stopListening();
    }

    const userMessage = { text: userInput, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    resetTranscript();
    setIsLoading(true);

    // If we're in fallback mode, generate a response without API call
    if (useFallback) {
      // Simulate a slight delay to make it feel more natural
      setTimeout(() => {
        const fallbackResponse = generateFallbackResponse(userInput);
        setMessages(prev => [...prev, { text: fallbackResponse, sender: 'bot' }]);
        setIsLoading(false);
      }, 800);
      return;
    }

    try {
      // Check if API key is available
      const apiKey = process.env.REACT_APP_PERPLEXITY_API_KEY;
      console.log('API Key loaded:', apiKey ? 'Yes (length: ' + apiKey.length + ')' : 'No');
      
      if (!apiKey) {
        console.error('Perplexity API key is missing. Please add it to your environment variables.');
        throw new Error('API_KEY_MISSING');
      }
      
      // Build properly alternating conversation history
      const conversationHistory = [];
      
      // Process messages to ensure proper alternation
      const filteredMessages = messages.slice(1); // Skip the initial welcome message
      
      // Group consecutive messages from the same sender and take the last one
      const groupedMessages = [];
      let currentGroup = null;
      
      for (const msg of filteredMessages) {
        if (!currentGroup || currentGroup.sender !== msg.sender) {
          if (currentGroup) {
            groupedMessages.push(currentGroup);
          }
          currentGroup = { ...msg };
        } else {
          // Update with the latest message from the same sender
          currentGroup = { ...msg };
        }
      }
      
      if (currentGroup) {
        groupedMessages.push(currentGroup);
      }
      
      // Convert to API format ensuring alternation
      for (const msg of groupedMessages) {
        const role = msg.sender === 'user' ? 'user' : 'assistant';
        conversationHistory.push({
          role: role,
          content: msg.text,
        });
      }
      
      console.log('Conversation history:', conversationHistory);
      
      const response = await axios.post(
        'https://api.perplexity.ai/chat/completions',
        {
          model: 'sonar',
          messages: [
            {
              role: 'system',
              content: 'You are CareShare assistant for a medicine donation platform. Give SHORT, DIRECT answers only. Do NOT use markdown formatting, headings, bullet points, or any special characters. Keep responses under 2-3 sentences maximum. Answer in plain text only. If user asks in Urdu, respond in Urdu. If user asks in English, respond in English. Be helpful but extremely concise. For medical questions, provide basic information but always recommend consulting healthcare professionals.'
            },
            ...conversationHistory,
            { role: 'user', content: userInput },
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      console.log('Perplexity API response:', response.data);
      const botResponse = response.data.choices[0].message.content;
      console.log('Bot response:', botResponse);
      // Add bot response directly without streaming
      setMessages(prev => [...prev, { text: botResponse, sender: 'bot' }]);
    } catch (error) {
      console.error('Perplexity API error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error message:', error.message);
      
      // If API fails, switch to fallback mode
      if (error.message === 'API_KEY_MISSING' || 
          (error.response && (error.response.status === 401 || error.response.status === 403))) {
        setUseFallback(true);
        // Generate fallback response
        const fallbackResponse = generateFallbackResponse(userInput);
        setMessages(prev => [...prev, { text: fallbackResponse, sender: 'bot' }]);
      } else {
        // Custom error handling
        let errorMessage;
        
        if (error.message === 'API_KEY_MISSING') {
          errorMessage = isUrduText(userInput)
            ? '❌ براہ کرم منتظم سے رابطہ کریں۔ API کلید غائب ہے۔'
            : '❌ Please contact administrator. API key is missing.';
        } else if (error.response && error.response.status === 429) {
          errorMessage = isUrduText(userInput)
            ? '❌ بہت زیادہ درخواستیں۔ براہ کرم کچھ دیر بعد کوشش کریں۔'
            : '❌ Too many requests. Please try again later.';
        } else if (error.response && error.response.status === 401) {
          errorMessage = isUrduText(userInput)
            ? '❌ API توثیق کی خرابی۔ براہ کرم منتظم سے رابطہ کریں۔'
            : '❌ API authentication error. Please contact administrator.';
        } else {
          // Add more specific error message with details for debugging
          const errorDetails = error.response?.data?.error?.message || error.message;
          errorMessage = isUrduText(userInput)
            ? `❌ افسوس، کچھ غلط ہو گیا۔ براہ کرم بعد میں دوبارہ کوشش کریں۔ Error: ${errorDetails}`
            : `❌ Oops, something went wrong. Please try again later. Error: ${errorDetails}`;
        }
          
        setMessages((prev) => [
          ...prev,
          {
            text: errorMessage,
            sender: 'bot',
          },
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [input, listening, stopListening, resetTranscript, useFallback, messages, isUrduText]);

  // Update input field with transcript in real-time (no auto-submit)
  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  // Initialize on component mount
  useEffect(() => {
    // Check if Perplexity API key is available
    const apiKey = process.env.REACT_APP_PERPLEXITY_API_KEY;
    console.log('API Key loaded:', apiKey ? 'Yes (length: ' + apiKey.length + ')' : 'No');
    if (!apiKey) {
      console.warn('Perplexity API key not found. Chatbot will use fallback responses.');
      setUseFallback(true);
    }
  }, []);

  // Focus input when opening chatbot
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 300);
    }
  }, [isOpen]);

  // Toggle speech recognition
  const toggleRecording = () => {
    if (!browserSupportsSpeechRecognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    if (listening) {
      stopListening();
    } else {
      setInput('');
      resetTranscript();
      startListening();
    }
  };

  // Manual submit function for speech transcript
  const submitSpeechTranscript = () => {
    if (transcript.trim()) {
      handleSubmit(null, transcript);
      resetTranscript(); // Clear the transcript after submission
    }
  };

  const speakMessage = (text) => {
    if ('speechSynthesis' in window) {
      // If already speaking, stop it
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Detect language for the specific message
      const isUrdu = isUrduText(text);
      
      // Set appropriate language
      utterance.lang = isUrdu ? 'ur' : 'en-US';
      
      // Adjust speech parameters
      utterance.rate = isUrdu ? 0.8 : 1;
      utterance.volume = 1;
      utterance.pitch = 1;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="chatbot-container">
      {/* Welcome notification */}
      <Snackbar
        open={showNotification}
        autoHideDuration={8000}
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        sx={{ mb: 8, mr: { xs: 1, sm: 2 } }} // Position it above the chatbot button
      >
        <Alert
          severity="info"
          variant="filled"
          onClick={handleNotificationClick}
          onClose={handleNotificationClose}
          sx={{
            width: '100%',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            cursor: 'pointer',
            bgcolor: '#2A9D8F',
            animation: 'pulse 2s infinite',
            '& .MuiAlert-icon': {
              mr: 1,
              color: 'white'
            },
            '& .MuiAlert-message': {
              color: 'white'
            }
          }}
          icon={<ChatIcon fontSize="inherit" />}
        >
          Need help? Our chatbot is here to assist you with medicine requests and more!
        </Alert>
      </Snackbar>

      <Zoom in={!isOpen}>
        <Badge
          badgeContent={newMessageAlert}
          color="secondary"
          overlap="circular"
          invisible={newMessageAlert === 0}
        >
          <Fab
            className="chatbot-toggle"
            aria-label="chat with assistant"
            onClick={() => setIsOpen(true)}
            sx={{
              bgcolor: theme.palette.primary.main,
              '&:hover': {
                bgcolor: theme.palette.primary.dark,
                transform: 'scale(1.05) translateY(-5px)',
              },
              transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              boxShadow: '0 10px 25px rgba(42, 157, 143, 0.3)',
            }}
          >
            <ChatIcon fontSize="medium" />
          </Fab>
        </Badge>
      </Zoom>

      <Grow in={isOpen} timeout={300}>
        <Paper
          className="chatbot-window"
          elevation={12}
          sx={{
            overflow: 'hidden',
            borderRadius: theme.shape.borderRadius * 1.5,
            width: { xs: '95vw', sm: 400 },
            height: { xs: '50vh', sm: 350 },
            display: 'flex',
            flexDirection: 'column',
            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            boxShadow: '0 15px 40px rgba(0, 0, 0, 0.15)',
          }}
        >
          {/* Header */}
          <Box
            className="chatbot-header"
            sx={{
              display: 'flex',
              alignItems: 'center',
              p: '12px 16px',
              background: `linear-gradient(120deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              color: 'white',
              boxShadow: '0 3px 10px rgba(0, 0, 0, 0.1)'
            }}
          >
            <Avatar
              sx={{
                bgcolor: 'white',
                color: theme.palette.primary.main,
                width: 32,
                height: 32,
                mr: 1.5,
                border: `2px solid white`
              }}
            >
              <ChatIcon fontSize="small" />
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle1" fontWeight="600" sx={{ lineHeight: 1.2 }}>
                CareShare Assistant
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, opacity: 0.9, mt: 0.2 }}>
                <Typography variant="caption" sx={{ fontSize: '0.65rem' }}>
                  🎙️ Voice Mode
                </Typography>
                <Chip 
                  label={currentLanguage === 'ur-PK' ? 'اردو' : 'EN'} 
                  size="small"
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    fontSize: '0.6rem',
                    height: 16,
                    '& .MuiChip-label': {
                      px: 0.5,
                      py: 0
                    }
                  }}
                />
                {listening && (
                  <Typography variant="caption" sx={{ color: '#ffcccc', fontSize: '0.65rem' }}>
                    🔴 Listening...
                  </Typography>
                )}
              </Box>
            </Box>
            <IconButton 
              size="small" 
              onClick={() => setIsOpen(false)} 
              sx={{ 
                color: 'white',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.15)',
                  transform: 'rotate(90deg)',
                },
                transition: 'all 0.3s ease-in-out'
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Messages container */}
          <Box 
            className="messages-container"
            sx={{
              flexGrow: 1,
              overflowY: 'auto',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
              bgcolor: theme.palette.background.default,
            }}
          >
            {messages.map((msg, idx) => {
              const msgIsUrdu = isUrduText(msg.text);
              return (
                <Box 
                  key={idx} 
                  className={`message ${msg.sender}`}
                  sx={{
                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '80%',
                    position: 'relative',
                    animationDuration: '0.3s',
                    animationFillMode: 'both',
                    animationName: msg.sender === 'user' ? 'slideInRight' : 'slideInLeft',
                  }}
                >
                  <Paper
                    elevation={1}
                    sx={{
                      p: 1.5,
                      borderRadius: msg.sender === 'user' 
                        ? '18px 18px 4px 18px' 
                        : '18px 18px 18px 4px',
                      bgcolor: msg.sender === 'user'
                        ? theme.palette.primary.main
                        : theme.palette.background.paper,
                      color: msg.sender === 'user'
                        ? 'white'
                        : theme.palette.text.primary,
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': msg.sender === 'user' ? {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: '100%',
                        height: '100%',
                        backgroundImage: `linear-gradient(120deg, ${theme.palette.primary.light}20, ${theme.palette.primary.main})`,
                        opacity: 0.3,
                        zIndex: 0,
                      } : {},
                    }}
                    dir={msgIsUrdu ? 'rtl' : 'ltr'}
                  >
                    {msg.sender === 'bot' ? (
                      <Box
                        className="bot-message-wrapper"
                        sx={{ position: 'relative', zIndex: 1 }}
                      >
                        <Box 
                          className="markdown-content"
                          sx={{ 
                            fontSize: '0.95rem', 
                            lineHeight: 1.6,
                            '& p': { mt: 0, mb: 1 },
                            '& p:last-child': { mb: 0 },
                            direction: msgIsUrdu ? 'rtl' : 'ltr',
                          }}
                        >
                          <ReactMarkdown>{msg.text}</ReactMarkdown>
                        </Box>
                        <Tooltip 
                          title={isSpeaking ? (msgIsUrdu ? "روکیں" : "Stop") : (msgIsUrdu ? "سنیں" : "Listen")}
                          placement="top"
                        >
                          <IconButton
                            onClick={() => speakMessage(msg.text.replace(/[*#_`]/g, ''))}
                            className={`speak-btn ${isSpeaking ? 'speaking' : ''}`}
                            size="small"
                            sx={{
                              position: 'absolute',
                              bottom: -8,
                              right: msgIsUrdu ? 'auto' : -8,
                              left: msgIsUrdu ? -8 : 'auto',
                              bgcolor: isSpeaking 
                                ? `${theme.palette.primary.main}15` 
                                : theme.palette.background.paper,
                              color: isSpeaking 
                                ? theme.palette.primary.main 
                                : theme.palette.text.secondary,
                              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                              border: `1px solid ${theme.palette.divider}`,
                              '&:hover': {
                                bgcolor: isSpeaking 
                                  ? `${theme.palette.primary.main}25`
                                  : theme.palette.action.hover,
                              },
                              transition: 'all 0.2s ease',
                              zIndex: 5,
                            }}
                          >
                            {isSpeaking ? <VolumeUpIcon fontSize="small" /> : <VolumeOffIcon fontSize="small" />}
                          </IconButton>
                        </Tooltip>
                      </Box>
                    ) : (
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 500, 
                          position: 'relative', 
                          zIndex: 1,
                          direction: msgIsUrdu ? 'rtl' : 'ltr',
                        }}
                      >
                        {msg.text}
                      </Typography>
                    )}
                  </Paper>
                </Box>
              );
            })}
            
            {isLoading && (
              <Box 
                className="message bot loading"
                sx={{
                  alignSelf: 'flex-start',
                  maxWidth: '60%',
                  animationName: 'slideInLeft',
                  animationDuration: '0.3s',
                  animationFillMode: 'both',
                }}
              >
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    borderRadius: '18px 18px 18px 4px',
                    bgcolor: theme.palette.background.paper,
                  }}
                >
                  <Box 
                    className="typing-indicator"
                    sx={{
                      display: 'flex',
                      gap: 0.7,
                      justifyContent: 'center',
                      alignItems: 'center',
                      p: 0.3,
                    }}
                  >
                    <span></span><span></span><span></span>
                  </Box>
                </Paper>
              </Box>
            )}
            
            <div ref={messageEndRef} />
          </Box>

          {/* Input area */}
          <Paper 
            component="form"
            onSubmit={handleSubmit}
            elevation={3}
            sx={{ 
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              borderTop: `1px solid ${theme.palette.divider}`,
              bgcolor: theme.palette.background.paper,
              position: 'relative',
              zIndex: 2,
            }}
          >
            <TextField
              inputRef={inputRef}
              fullWidth
              placeholder={currentLanguage === 'ur-PK' ? "اردو یا انگریزی میں اپنا پیغام ٹائپ کریں..." : "Type your message in English or Urdu..."}
              value={listening ? transcript : input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              variant="outlined"
              size="small"
              inputProps={{ 
                style: { 
                  direction: isUrduText(listening ? transcript : input) ? 'rtl' : 'ltr',
                  paddingRight: listening && transcript ? '45px' : '14px',
                }
              }}
              InputProps={{
                sx: { 
                  borderRadius: '24px',
                  bgcolor: theme.palette.background.default,
                  pl: 1.5,
                  pr: listening && transcript ? 0 : 1.5,
                  transition: 'all 0.3s ease',
                },
                startAdornment: listening && (
                  <InputAdornment position="start">
                    <Box 
                      className="recording-indicator"
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: 'error.main',
                        mr: 1,
                        animation: 'pulse 1.5s infinite',
                      }}
                    />
                  </InputAdornment>
                ),
                endAdornment: listening && transcript && (
                  <InputAdornment position="end" sx={{ pr: 0.3 }}>
                    <Tooltip title="Submit Voice Message">
                      <IconButton
                        edge="end"
                        size="small"
                        onClick={submitSpeechTranscript}
                        sx={{ 
                          color: 'white',
                          bgcolor: theme.palette.success.main,
                          '&:hover': {
                            bgcolor: theme.palette.success.dark,
                          },
                          transition: 'all 0.2s ease',
                          height: 30,
                          width: 30,
                        }}
                      >
                        <CheckCircleIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
            />
            
            <Tooltip title={currentLanguage === 'ur-PK' ? "اردو" : "English"}>
              <IconButton
                type="button"
                onClick={switchLanguage}
                disabled={isLoading}
                size="small"
                sx={{
                  p: 0.5,
                  bgcolor: currentLanguage === 'ur-PK' ? '#4CAF50' : '#2196F3',
                  color: 'white',
                  minWidth: 32,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: currentLanguage === 'ur-PK' ? '#45a049' : '#1976D2',
                  },
                }}
              >
                <Chip 
                  label={currentLanguage === 'ur-PK' ? 'اردو' : 'EN'} 
                  size="small"
                  sx={{ 
                    bgcolor: 'transparent',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '0.7rem',
                    '& .MuiChip-label': {
                      px: 0.5
                    }
                  }}
                />
              </IconButton>
            </Tooltip>
            
            <Tooltip title={listening ? "Stop Recording" : `Start Voice Input (${currentLanguage === 'ur-PK' ? 'Urdu' : 'English'})`}>
              <IconButton
                type="button"
                onClick={toggleRecording}
                disabled={isLoading || !browserSupportsSpeechRecognition}
                color={listening ? "error" : "default"}
                size="medium"
                sx={{
                  p: 1,
                  bgcolor: listening ? 'error.light' : theme.palette.grey[100],
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: listening ? 'error.main' : theme.palette.grey[200],
                  },
                  '&.Mui-disabled': {
                    bgcolor: 'action.disabledBackground',
                    color: 'action.disabled',
                  },
                }}
              >
                {listening ? <MicOffIcon /> : <MicIcon />}
              </IconButton>
            </Tooltip>

            <Tooltip title="Send Message">
              <span>
                <IconButton
                  type="submit"
                  disabled={isLoading || (!input.trim() && !transcript.trim())}
                  color="primary"
                  size="medium"
                  sx={{
                    p: 1,
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                    '&.Mui-disabled': {
                      bgcolor: 'action.disabledBackground',
                      color: 'action.disabled',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    <SendIcon />
                  )}
                </IconButton>
              </span>
            </Tooltip>
          </Paper>
        </Paper>
      </Grow>
    </div>
  );
};

export default Chatbot;
