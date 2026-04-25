import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
  Stack,
  TextField,
  Button,
  useTheme,
  InputAdornment,
  Snackbar,
  Alert,
  Tooltip,
  Zoom
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  ArrowForward as ArrowForwardIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  Send as SendIcon,
  ContactSupport as ContactSupportIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';

// Wrapper component for motion effects
const MotionBox = motion(Box);
const MotionIconButton = motion(IconButton);
const MotionStack = motion(Stack);

const Footer = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();
  
  // State for newsletter form
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Simplified footer links - removed Support section
  const footerLinks = [
    {
      title: 'Quick Links',
      links: [
        { name: 'Home', url: '/' },
        { name: 'About Us', url: '/about' },
        { name: 'Available Medicines', url: '/medicines' },
        { name: 'Donate Medicine', url: '/donate' },
        { name: 'Contact Us', url: '/contact' }
      ]
    }
  ];

  // Social media links with improved animations
  const socialLinks = [
    { 
      name: 'Facebook', 
      icon: <FacebookIcon />, 
      url: 'https://facebook.com',
      color: '#1877F2'
    },
    { 
      name: 'Twitter', 
      icon: <TwitterIcon />, 
      url: 'https://twitter.com',
      color: '#1DA1F2'
    },
    { 
      name: 'Instagram', 
      icon: <InstagramIcon />, 
      url: 'https://instagram.com',
      color: '#E4405F'
    },
    { 
      name: 'LinkedIn', 
      icon: <LinkedInIcon />, 
      url: 'https://linkedin.com',
      color: '#0A66C2'
    }
  ];

  // Contact info with clickable actions
  const contactInfo = [
    { 
      icon: <PhoneIcon fontSize="small" />, 
      text: '+92 300 1234567',
      action: 'tel:+923001234567',
      tooltip: 'Call us'
    },
    { 
      icon: <EmailIcon fontSize="small" />, 
      text: 'info@careshare.org',
      action: 'mailto:info@careshare.org',
      tooltip: 'Email us'
    },
    { 
      icon: <LocationIcon fontSize="small" />, 
      text: 'Karachi, Pakistan',
      action: 'https://maps.google.com/?q=Karachi,Pakistan',
      tooltip: 'View on map'
    }
  ];

  // Handle scroll to top
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Handle snackbar close
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <Box 
      sx={{ 
        bgcolor: 'background.paper',
        position: 'relative',
        pt: 8,
        pb: 3,
        boxShadow: '0 -5px 20px rgba(0,0,0,0.05)'
      }}
    >
      {/* Scroll to top button */}
      <MotionBox
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        sx={{
          position: 'absolute',
          top: -25,
          right: { xs: 20, md: 50 },
          zIndex: 10
        }}
      >
        <Tooltip title="Back to top" placement="top">
          <IconButton
            aria-label="scroll to top"
            onClick={handleScrollToTop}
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              boxShadow: 3,
              '&:hover': {
                bgcolor: 'primary.dark',
              },
              width: 50,
              height: 50
            }}
          >
            <KeyboardArrowUpIcon fontSize="medium" />
          </IconButton>
        </Tooltip>
      </MotionBox>

      <Container maxWidth="lg">
        {/* Main footer content */}
        <Grid container spacing={5}>
          {/* Logo and contact info */}
          <Grid item xs={12} md={6}>
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Typography 
                variant="h4" 
                component={RouterLink}
                to="/"
                sx={{ 
                  color: 'primary.main',
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'block',
                  mb: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    textShadow: '0 0 15px rgba(21, 101, 192, 0.5)',
                    transform: 'translateY(-2px)',
                  }
                }}
              >
                CareShare
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ maxWidth: 350, mb: 4 }}
              >
                Connecting those with surplus medication to those in need, 
                reducing waste and improving healthcare access across Pakistan.
              </Typography>
            </MotionBox>
            
            {/* Contact information */}
            <Typography variant="h6" fontWeight="600" gutterBottom>
              Contact Us
            </Typography>
            
            <MotionStack 
              spacing={2} 
              sx={{ mb: 4 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
            >
              {contactInfo.map((contact, index) => (
                <MotionBox
                  key={index}
                  component="a"
                  href={contact.action}
                  target={contact.action.startsWith('http') ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  whileHover={{ y: -5, x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1.5,
                    textDecoration: 'none',
                    color: 'inherit',
                    cursor: 'pointer'
                  }}
                >
                  <Tooltip title={contact.tooltip} TransitionComponent={Zoom}>
                    <Box 
                      sx={{ 
                        color: 'white',
                        bgcolor: 'primary.main',
                        borderRadius: '50%',
                        p: 1,
                        display: 'flex',
                        boxShadow: 2
                      }}
                    >
                      {contact.icon}
                    </Box>
                  </Tooltip>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    {contact.text}
                  </Typography>
                </MotionBox>
              ))}
            </MotionStack>

            {/* Social media with interactive effects */}
            <Typography variant="h6" fontWeight="600" gutterBottom>
              Follow Us
            </Typography>
            <Stack direction="row" spacing={1}>
              {socialLinks.map((social, index) => (
                <MotionIconButton 
                  key={index}
                  component="a"
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  whileHover={{ 
                    scale: 1.2, 
                    boxShadow: `0 0 10px ${social.color}`,
                    backgroundColor: social.color 
                  }}
                  sx={{ 
                    color: 'white',
                    bgcolor: 'grey.700',
                    '&:hover': {
                      color: 'white',
                    }
                  }}
                >
                  {social.icon}
                </MotionIconButton>
              ))}
            </Stack>
          </Grid>

          {/* Footer links with animations */}
          {footerLinks.map((section, index) => (
            <Grid item xs={12} sm={6} md={6} key={index}>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                {section.title}
              </Typography>
              <Box component="ul" sx={{ listStyle: 'none', pl: 0, m: 0 }}>
                {section.links.map((link, linkIndex) => (
                  <MotionBox 
                    component="li" 
                    sx={{ mb: 1.5 }} 
                    key={linkIndex}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Link
                      component={RouterLink}
                      to={link.url}
                      color="text.secondary"
                      sx={{ 
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        '&:hover': {
                          color: 'primary.main',
                        },
                        '&::before': {
                          content: '"›"',
                          marginRight: '8px',
                          fontSize: '18px',
                          color: theme.palette.primary.main,
                          opacity: 0,
                          transition: 'opacity 0.2s, transform 0.2s',
                          transform: 'translateX(-5px)',
                        },
                        '&:hover::before': {
                          opacity: 1,
                          transform: 'translateX(0)',
                        }
                      }}
                    >
                      {link.name}
                    </Link>
                  </MotionBox>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Copyright and bottom links */}
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          justifyContent: 'space-between', 
          alignItems: 'center'
        }}>
          <Typography variant="body2" color="text.secondary">
            © {currentYear} CareShare. All rights reserved.
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Button
              component={RouterLink}
              to="/contact"
              startIcon={<ContactSupportIcon />}
              variant="outlined"
              size="small"
              sx={{ 
                borderRadius: 20,
                textTransform: 'none',
                borderWidth: '2px',
                '&:hover': {
                  borderWidth: '2px',
                  bgcolor: 'rgba(21, 101, 192, 0.08)',
                }
              }}
            >
              Need Help?
            </Button>
          </Stack>
        </Box>
      </Container>

      {/* Snackbar for newsletter subscription feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbarSeverity} 
          sx={{ width: '100%', borderRadius: 2 }}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Footer;