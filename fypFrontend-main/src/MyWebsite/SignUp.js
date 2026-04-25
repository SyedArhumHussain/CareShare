import React, { useState } from 'react';
import {
  Avatar,
  Button,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Container,
  Paper,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Divider,
  useTheme,
  alpha,
  CircularProgress
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  PersonAdd as PersonAddIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  LocationCity as LocationIcon,
  ChevronRight as ChevronRightIcon,
  ChevronLeft as ChevronLeftIcon,
  MedicalServices as MedicalServicesIcon
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import Navbar from '../components/Navbar';
import Footer from './Footer';

const SignUp = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: '',
    city: '',
    phone: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  // Steps for the registration process
  const steps = ['Account Type', 'Personal Information', 'Create Password'];

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validateStep = () => {
    const newErrors = {};
    
    // Validate based on current step
    if (activeStep === 0) {
      if (!formData.userType) {
        newErrors.userType = 'Please select an account type';
      }
    } else if (activeStep === 1) {
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
      
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      } else {
        const phoneRegex = /^[0-9+\s-]{10,15}$/;
        if (!phoneRegex.test(formData.phone)) {
          newErrors.phone = 'Please enter a valid phone number';
        }
      }
      
      if (!formData.city.trim()) {
        newErrors.city = 'City is required';
      }
    } else if (activeStep === 2) {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    // Clear any existing errors first
    setErrors({});
    
    if (validateStep()) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Only allow submission on the final step
    if (activeStep !== steps.length - 1) {
      console.log('Preventing submission - not on final step');
      return;
    }
    
    // Final validation for all steps
    if (!validateStep()) {
      return;
    }
    
    // Check all fields are filled
    const allFields = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      userType: formData.userType,
      city: formData.city,
      phone: formData.phone
    };
    
    const emptyFields = Object.entries(allFields)
      .filter(([key, value]) => !value || value.trim() === '')
      .map(([key]) => key);
    
    if (emptyFields.length > 0) {
      // Create error messages for empty fields
      const newErrors = {};
      emptyFields.forEach(field => {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      });
      
      setErrors(newErrors);
      
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: 'Please fill all the required fields',
        confirmButtonColor: theme.palette.primary.main
      });
      
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setErrors({ ...errors, confirmPassword: 'Passwords do not match' });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:4000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fname: formData.name.split(' ')[0],
          lname: formData.name.split(' ').slice(1).join(' '),
          email: formData.email,
          password: formData.password,
          userRole: formData.userType,
          city: formData.city,
          phone: formData.phone
        })
      });
      
      const data = await response.json();
      
      if (data.error) {
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: data.error,
          confirmButtonColor: theme.palette.primary.main
        });
      } else {
        Swal.fire({
          icon: 'success',
          title: 'Registration Successful',
          text: 'Your account has been created successfully. Please log in.',
          confirmButtonColor: theme.palette.primary.main
        }).then(() => {
          navigate('/signin');
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Server Error',
        text: 'Could not connect to the server. Please try again later.',
        confirmButtonColor: theme.palette.primary.main
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // List of cities in Pakistan
  const cities = [
    'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 
    'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala', 
    'Hyderabad', 'Abbottabad', 'Bahawalpur', 'Sargodha', 'Sukkur'
  ];

  // Different step content
  const getStepContent = (step) => {
    switch (step) {
      case 0:
  return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Select Account Type
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Choose which type of account you need. This will determine what you can do on the platform.
            </Typography>
            
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <Paper
                  elevation={formData.userType === 'donor' ? 6 : 1}
                  onClick={() => setFormData({ ...formData, userType: 'donor' })}
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    border: formData.userType === 'donor' 
                      ? `2px solid ${theme.palette.secondary.main}` 
                      : '2px solid transparent',
                    '&:hover': {
                      boxShadow: theme.shadows[6]
                    }
                  }}
                >
        <Box
          sx={{
                      width: 60, 
                      height: 60, 
                      borderRadius: '50%', 
                      bgcolor: alpha(theme.palette.secondary.main, 0.1),
            display: 'flex',
            alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                      mx: 'auto'
                    }}
                  >
                    <MedicalServicesIcon fontSize="large" color="secondary" />
                  </Box>
                  <Typography variant="h6" textAlign="center" gutterBottom>
                    Donor
                  </Typography>
                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    Donate unused medicines to help those in need
          </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Paper
                  elevation={formData.userType === 'receipient' ? 6 : 1}
                  onClick={() => setFormData({ ...formData, userType: 'receipient' })}
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    border: formData.userType === 'receipient' 
                      ? `2px solid ${theme.palette.primary.main}` 
                      : '2px solid transparent',
                    '&:hover': {
                      boxShadow: theme.shadows[6]
                    }
                  }}
                >
                  <Box 
                    sx={{ 
                      width: 60, 
                      height: 60, 
                      borderRadius: '50%', 
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                      mx: 'auto'
                    }}
                  >
                    <PersonIcon fontSize="large" color="primary" />
                  </Box>
                  <Typography variant="h6" textAlign="center" gutterBottom>
                    Recipient
                  </Typography>
                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    Request medicines you need from donors
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
            
            {errors.userType && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {errors.userType}
              </Alert>
            )}
          </Box>
        );
        
      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              We need some basic information to set up your account.
            </Typography>
            
                <TextField
              margin="normal"
                  required
                  fullWidth
              id="name"
              label="Full Name"
              name="name"
              autoComplete="name"
              value={formData.name}
              onChange={handleInputChange}
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
              margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
              value={formData.email}
              onChange={handleInputChange}
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
              margin="normal"
              required
              fullWidth
              id="phone"
              label="Phone Number"
              name="phone"
              autoComplete="tel"
              value={formData.phone}
              onChange={handleInputChange}
              error={!!errors.phone}
              helperText={errors.phone}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
            
            <FormControl 
              fullWidth 
              margin="normal" 
              required
              error={!!errors.city}
            >
              <InputLabel id="city-label">City</InputLabel>
              <Select
                labelId="city-label"
                id="city"
                name="city"
                value={formData.city}
                label="City"
                onChange={handleInputChange}
                startAdornment={
                  <InputAdornment position="start">
                    <LocationIcon color="action" />
                  </InputAdornment>
                }
              >
                {cities.map((city) => (
                  <MenuItem key={city} value={city}>
                    {city}
                  </MenuItem>
                ))}
              </Select>
              {errors.city && (
                <Typography variant="caption" color="error">
                  {errors.city}
                </Typography>
              )}
            </FormControl>
          </Box>
        );
        
      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Create Password
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Set a secure password for your account. It should be at least 6 characters long.
            </Typography>
            
                <TextField
              margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
              type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="new-password"
              value={formData.password}
              onChange={handleInputChange}
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={togglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={toggleConfirmPasswordVisibility}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              By signing up, you agree to our{' '}
              <Link component={RouterLink} to="/terms" color="primary">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link component={RouterLink} to="/privacy" color="primary">
                Privacy Policy
              </Link>
              .
            </Typography>
          </Box>
        );
        
      default:
        return 'Unknown step';
    }
  };

  return (
    <>
      <Navbar title="CareShare" />
      
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          py: 8,
          backgroundColor: alpha(theme.palette.primary.main, 0.02),
          backgroundImage: `radial-gradient(${alpha(theme.palette.primary.main, 0.05)} 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        }}
      >
        <Container component="main" maxWidth="sm">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Paper
              elevation={6}
              sx={{
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                borderRadius: 4,
                boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
              }}
            >
              <Avatar 
                sx={{ 
                  mb: 2, 
                  width: 56, 
                  height: 56, 
                  bgcolor: theme.palette.secondary.main,
                }}
              >
                <PersonAddIcon fontSize="large" />
              </Avatar>
              
              <Typography component="h1" variant="h4" fontWeight="bold" gutterBottom>
                Create Account
              </Typography>
              
              <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
                Join CareShare to start donating or requesting medicines
              </Typography>
              
              <Stepper activeStep={activeStep} sx={{ width: '100%', mb: 4 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              
              <Box component="form" noValidate onSubmit={handleSubmit} sx={{ width: '100%' }}>
                {getStepContent(activeStep)}
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    startIcon={<ChevronLeftIcon />}
                  >
                    Back
                  </Button>
                  
                  {activeStep === steps.length - 1 ? (
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={isLoading}
                      sx={{ 
                        minWidth: 100,
                        borderRadius: theme.shape.borderRadius * 3,
                      }}
                    >
                      {isLoading ? <CircularProgress size={24} /> : 'Sign Up'}
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleNext();
                      }}
                      endIcon={<ChevronRightIcon />}
                      sx={{ 
                        minWidth: 100,
                        borderRadius: theme.shape.borderRadius * 3,
                      }}
                    >
                      Next
                    </Button>
                  )}
                </Box>
              </Box>
              
              <Divider sx={{ width: '100%', my: 3 }} />
              
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Already have an account?{' '}
                  <Link component={RouterLink} to="/signin" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                    Sign In
                  </Link>
                </Typography>
              </Box>
            </Paper>
          </motion.div>
      </Container>
      </Box>
      
      <Footer />
    </>
  );
};

export default SignUp;