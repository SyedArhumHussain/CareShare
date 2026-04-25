import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Paper,
  Card,
  CardContent,
  IconButton,
  Divider,
  Snackbar,
  Alert,
  useTheme,
  alpha,
  InputAdornment
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import {
  Send as SendIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  YouTube as YouTubeIcon,
  Person as PersonIcon,
  Message as MessageIcon
} from '@mui/icons-material';
import Navbar from '../components/Navbar';
import Footer from './Footer';

// Custom styled components
const HeroSection = styled(Box)(({ theme }) => ({
  background: `linear-gradient(rgba(38, 70, 83, 0.8), rgba(42, 157, 143, 0.7)), url('/medine/contact.jpg')`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  color: 'white',
  padding: theme.spacing(10, 0),
  textAlign: 'center',
  position: 'relative',
  overflow: 'hidden',
  boxShadow: 'inset 0 -50px 50px -30px rgba(248, 249, 250, 0.2)',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '100px',
    background: 'linear-gradient(to top, #F8F9FA, transparent)',
    zIndex: 1
  },
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(8, 0),
  },
}));

const ContactCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'all 0.3s ease',
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden',
  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
  },
}));

const SocialIconButton = styled(IconButton)(({ theme }) => ({
  margin: theme.spacing(0.5),
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const Contact = () => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setFormData({
        name: '',
        email: '',
        message: ''
      });
      setSnackbar({
        open: true,
        message: 'Your message has been sent successfully!',
        severity: 'success'
      });
    }, 1500);
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
  };

  // Contact info data
  const contactInfo = [
    {
      icon: <PhoneIcon fontSize="large" color="primary" />,
      title: 'Phone',
      content: '+92 312 345 6789',
      description: 'Available Monday to Friday, 9am to 5pm'
    },
    {
      icon: <EmailIcon fontSize="large" color="primary" />,
      title: 'Email',
      content: 'info@careshare.org',
      description: 'We respond within 24 hours'
    },
    {
      icon: <LocationIcon fontSize="large" color="primary" />,
      title: 'Address',
      content: 'Karachi, Pakistan',
      description: 'Gulshan-e-Iqbal, Karachi, Sindh'
    },
  ];

  // Social media links
  const socialLinks = [
    { name: 'Facebook', icon: <FacebookIcon />, color: '#1877F2', url: 'https://facebook.com' },
    { name: 'Twitter', icon: <TwitterIcon />, color: '#1DA1F2', url: 'https://twitter.com' },
    { name: 'Instagram', icon: <InstagramIcon />, color: '#E4405F', url: 'https://instagram.com' },
    { name: 'YouTube', icon: <YouTubeIcon />, color: '#FF0000', url: 'https://youtube.com' },
  ];
  
  return (
    <>
      <Navbar title="CareShare" />
      
      {/* Hero Section */}
      <HeroSection>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
              Contact Us
            </Typography>
            <Typography variant="h5" sx={{ maxWidth: 800, mx: 'auto', mb: 4, opacity: 0.9 }}>
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </Typography>
          </motion.div>
        </Container>
      </HeroSection>
      
      {/* Contact Information Cards */}
      <Box sx={{ py: 10 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} sx={{ mb: 8 }}>
            {contactInfo.map((info, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <ContactCard>
                    <CardContent sx={{ p: 4, textAlign: 'center' }}>
                      <Box 
                        sx={{ 
                          display: 'inline-flex',
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          p: 2,
                          borderRadius: '50%',
                          mb: 2
                        }}
                      >
                        {info.icon}
                      </Box>
                      <Typography variant="h5" component="h3" gutterBottom fontWeight="bold">
                        {info.title}
                      </Typography>
                      <Typography variant="body1" color="primary.main" fontWeight="medium" gutterBottom>
                        {info.content}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {info.description}
                      </Typography>
                    </CardContent>
                  </ContactCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
          
          <Grid container spacing={6}>
            {/* Contact Form */}
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <Typography variant="h4" component="h2" gutterBottom fontWeight="bold">
                  Send Us a Message
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Have questions about medicine donation or need help with the platform? 
                  Fill out the form below and we'll get back to you soon.
                </Typography>
                
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 4 }}>
                  <TextField
                    fullWidth
                    margin="normal"
                    id="name"
                    name="name"
                    label="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    error={!!errors.name}
                    helperText={errors.name}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    margin="normal"
                    id="email"
                    name="email"
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    margin="normal"
                    id="message"
                    name="message"
                    label="Message"
                    multiline
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    error={!!errors.message}
                    helperText={errors.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 2 }}>
                          <MessageIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={isSubmitting}
                    endIcon={<SendIcon />}
                    sx={{ mt: 3, px: 4, py: 1.5, borderRadius: theme.shape.borderRadius * 3 }}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </Box>
              </motion.div>
            </Grid>
            
            {/* Map and Social Links */}
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <Paper
                  elevation={3}
                  sx={{
                    width: '100%',
                    height: 300,
                    borderRadius: theme.shape.borderRadius * 2,
                    overflow: 'hidden',
                    mb: 4
                  }}
                >
                  {/* Embed Google Maps here */}
                  <Box
                    component="iframe"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3618.8658123456789!2d67.0822454!3d24.8607!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33e06651d4bbf%3A0x9cf92f44555a0c23!2sGulshan-e-Iqbal%2C%20Karachi%2C%20Karachi%20City%2C%20Sindh%2C%20Pakistan!5e0!3m2!1sen!2s!4v1654682488089!5m2!1sen!2s"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    allowFullScreen=""
                    aria-hidden="false"
                    tabIndex="0"
                    title="CareShare Location"
                  />
                </Paper>
                
                <Typography variant="h5" component="h3" gutterBottom fontWeight="bold">
                  Follow Us
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Stay connected with us on social media for updates, stories, and more.
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1, mt: 3 }}>
                  {socialLinks.map((social, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ y: -5 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <SocialIconButton
                        component="a"
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.name}
                        sx={{ 
                          bgcolor: alpha(social.color, 0.1), 
                          color: social.color,
                          '&:hover': {
                            bgcolor: alpha(social.color, 0.2),
                          }
                        }}
                      >
                        {social.icon}
                      </SocialIconButton>
                    </motion.div>
                  ))}
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* FAQ or Additional Info Section */}
      <Box sx={{ py: 8, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
        <Container maxWidth="lg">
          <Box textAlign="center" sx={{ mb: 4 }}>
            <Typography variant="h4" component="h2" gutterBottom fontWeight="bold">
              We're Here to Help
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
              Our support team is available to assist you with any questions about medicine donation or using the platform.
            </Typography>
          </Box>
          
          <Box 
            component={Paper} 
            elevation={3}
            sx={{ 
              p: 4, 
              borderRadius: theme.shape.borderRadius * 2,
              textAlign: 'center'
            }}
          >
            <Typography variant="h6" gutterBottom fontWeight="medium">
              Operating Hours
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Monday to Friday: 9:00 AM - 5:00 PM (PKT)
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Saturday: 10:00 AM - 2:00 PM (PKT)
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Sunday: Closed
            </Typography>
          </Box>
        </Container>
      </Box>
      
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      
      <Footer />
    </>
  );
};

export default Contact;
