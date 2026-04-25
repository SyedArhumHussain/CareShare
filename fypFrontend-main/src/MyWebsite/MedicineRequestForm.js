import React, { useState, useEffect } from 'react';
import {
  Avatar,
  Button,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Link,
  Grid,
  Box,
  Typography,
  Container,
  Paper,
  Alert,
  CircularProgress,
  useTheme,
  alpha,
  InputAdornment,
  Divider,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Tooltip,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from './Footer';
import {
  CloudUpload as CloudUploadIcon,
  MedicalServices as MedicalServicesIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  Medication as MedicationIcon,
  Assignment as AssignmentIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  MyLocation as MyLocationIcon,
} from '@mui/icons-material';
import Swal from "sweetalert2";
import axios from 'axios';

// Styled components
const HeroSection = styled(Box)(({ theme }) => ({
  background: `linear-gradient(rgba(38, 70, 83, 0.8), rgba(42, 157, 143, 0.7)), url('/medine/medicine3.jpg')`,
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

const FormContainer = styled(Paper)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden',
  boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
  marginTop: theme.spacing(-6),
  position: 'relative',
  zIndex: 10,
  [theme.breakpoints.down('sm')]: {
    marginTop: theme.spacing(-3),
  },
}));

const FormSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4, 5),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3, 2),
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  position: 'relative',
  display: 'inline-block',
  marginBottom: theme.spacing(1),
  fontWeight: 700,
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -8,
    left: 0,
    width: 60,
    height: 3,
    backgroundColor: theme.palette.secondary.main,
    borderRadius: 2,
  },
}));

const UploadButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5, 3),
  borderRadius: theme.shape.borderRadius * 3,
  borderWidth: '2px',
  transition: 'all 0.3s ease',
  textTransform: 'none',
  fontWeight: 600,
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
  },
}));

const PreviewCard = styled(Card)(({ theme }) => ({
  overflow: 'hidden',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[2],
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: theme.shadows[6],
  },
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5, 3),
  borderRadius: theme.shape.borderRadius * 3,
  fontWeight: 600,
  fontSize: '1rem',
  textTransform: 'none',
  boxShadow: theme.shadows[3],
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: theme.shadows[6],
  },
}));

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

export default function MedicineRequestForm() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [availableMedicines, setAvailableMedicines] = useState([]);
  const [prescription, setPrescription] = useState(null);
  const [prescriptionPreview, setPrescriptionPreview] = useState(null);
  const [errormsg, setErrormsg] = useState(null);
  const [activeStep, setActiveStep] = useState(0);

  // Get URL parameters for pre-filling form
  const [searchParams] = React.useState(new URLSearchParams(window.location.search));
  const prefilledMedicineName = searchParams.get('medicineName');
  const prefilledQuantity = searchParams.get('medicineQty');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
    city: '',
    location: '',
    medicineName: prefilledMedicineName || '',
    medicineQty: prefilledQuantity ? parseInt(prefilledQuantity) : 1,
    reason: ''
  });

  // Steps for form process
  const steps = ['Personal Details', 'Medicine Information', 'Review & Submit'];

  // State to handle geolocation capture
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // Fetch available medicines
  useEffect(() => {
    fetchAvailableMedicines();
  }, []);

  const fetchAvailableMedicines = async () => {
    try {
      const response = await axios.get('http://localhost:4000/askDonator');
      if (response.data && response.data.database) {
        // Get current date for expiry comparison
        const currentDate = new Date();
        
        // Filter only approved medicines that are not expired
        const availableMedicines = response.data.database.filter(medicine => {
          // Check if medicine is approved
          const isApproved = medicine.status === 'approved';
          
          // Check if medicine is not expired
          const expiryDate = new Date(medicine.medicineExp);
          const isNotExpired = expiryDate > currentDate;
          
          // Check if quantity is greater than 0
          const hasQuantity = parseInt(medicine.medicineQty) > 0;
          
          return isApproved && isNotExpired && hasQuantity;
        });
        
        setAvailableMedicines(availableMedicines);
      }
    } catch (error) {
      console.error('Error fetching medicines:', error);
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Could not load available medicines. Please try again later.",
        confirmButtonColor: theme.palette.primary.main,
      });
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // If medicine changes, update quantity max value
    if (name === 'medicineName') {
      const selectedMedicine = availableMedicines.find(
        medicine => medicine.medicineName === value
      );
      
      if (selectedMedicine) {
        // Reset to 1 when medicine changes, or max value if max is less than 1
        const maxQty = parseInt(selectedMedicine.medicineQty);
        const initialQty = maxQty > 0 ? Math.min(1, maxQty) : 0;
        
        setFormData({
          ...formData,
          [name]: value,
          medicineQty: initialQty
        });
      } else {
        setFormData({
          ...formData,
          [name]: value,
          medicineQty: 0
        });
      }
    } else if (name === 'medicineQty') {
      // For quantity, ensure it's within valid range
      const maxQty = getMaxQuantity();
      let newQty = parseInt(value);
      
      // Ensure quantity is valid
      if (isNaN(newQty) || newQty < 1) {
        newQty = 1;
      } else if (newQty > maxQty) {
        newQty = maxQty;
      }
      
      setFormData({
        ...formData,
        [name]: newQty
      });
    } else {
      // For other fields, just update normally
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    // Clear error message when user types
    if (errormsg) {
      setErrormsg(null);
    }
  };

  // Handle prescription file upload
  const handlePrescriptionUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPrescription(file);
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPrescriptionPreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Clear error message when prescription is uploaded
      if (errormsg) {
        setErrormsg(null);
      }
    }
  };

  // Navigate between steps
  const handleNext = () => {
    if (activeStep === 0) {
      // Validate personal details
      if (!formData.name || !formData.email || !formData.phoneNumber || !formData.address) {
        setErrormsg('Please complete all required personal details');
        return;
      }
      
      // Simple email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setErrormsg('Please enter a valid email address');
        return;
      }
      
      // Simple phone validation
      const phoneRegex = /^\+?[0-9\s-]{10,15}$/;
      if (!phoneRegex.test(formData.phoneNumber)) {
        setErrormsg('Please enter a valid phone number');
        return;
      }
    } else if (activeStep === 1) {
      // Validate medicine information
      if (!formData.medicineName) {
        setErrormsg('Please select a medicine');
        return;
      }
      
      // Check if the selected medicine is still available
      const selectedMedicine = availableMedicines.find(
        medicine => medicine.medicineName === formData.medicineName
      );
      
      if (!selectedMedicine) {
        setErrormsg('The selected medicine is no longer available. Please select another medicine.');
        return;
      }
      
      // Validate quantity
      const maxQty = parseInt(selectedMedicine.medicineQty);
      if (formData.medicineQty <= 0 || formData.medicineQty > maxQty) {
        setErrormsg(`Please enter a valid quantity between 1 and ${maxQty}`);
        return;
      }

      if (!prescription) {
        setErrormsg('Please upload a prescription for the medicine');
        return;
      }
    }
    
    setActiveStep((prevStep) => prevStep + 1);
    setErrormsg(null);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    setErrormsg(null);
  };

  // Submit form
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    // Start loading state
    setLoading(true);
    
    try {
      // Create form data for file upload
      const requestFormData = new FormData();
      requestFormData.append('name', formData.name);
      requestFormData.append('email', formData.email);
      requestFormData.append('phoneNumber', formData.phoneNumber);
      requestFormData.append('address', formData.address);
      requestFormData.append('city', formData.city);
      requestFormData.append('location', formData.location);
      requestFormData.append('medicineName', formData.medicineName);
      requestFormData.append('medicineQty', formData.medicineQty);
      requestFormData.append('reason', formData.reason || '');
      
      // Add prescription file if available
      if (prescription) {
        requestFormData.append('prescription', prescription);
      }
      
      console.log('Sending medicine request with data:', {
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        location: formData.location,
        medicineName: formData.medicineName,
        medicineQty: formData.medicineQty,
        hasPrescription: !!prescription
      });
      
      // Send request to backend
      const response = await axios.post('http://localhost:4000/medicineRequest', requestFormData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      const data = response.data;
      
      setLoading(false);
      
      if (data.error) {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: data.error,
          confirmButtonColor: theme.palette.primary.main,
        });
        setErrormsg(data.error);
      } else {
        // Clear form
        setFormData({
          name: '',
          email: '',
          phoneNumber: '',
          address: '',
          city: '',
          location: '',
          medicineName: '',
          medicineQty: 1,
          reason: ''
        });
        setPrescription(null);
        setPrescriptionPreview(null);
        
        Swal.fire({
          title: "Request Submitted",
          text: "Your medicine request has been submitted successfully. You will be notified when it is approved.",
          icon: "success",
          confirmButtonColor: theme.palette.primary.main,
        }).then(() => {
          navigate('/');
        });
      }
    } catch (error) {
      setLoading(false);
      console.error("Error submitting request:", error);
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: error.response?.data?.error || "An error occurred while submitting your request. Please try again.",
        confirmButtonColor: theme.palette.primary.main,
      });
    }
  };

  // Get the max quantity available for selected medicine
  const getMaxQuantity = () => {
    if (!formData.medicineName) return 1;
    
    const selectedMedicine = availableMedicines.find(
      medicine => medicine.medicineName === formData.medicineName
    );
    
    // If medicine is not found (might have been filtered out due to expiry)
    // or quantity is not available, return 0
    if (!selectedMedicine) {
      return 0;
    }
    
    return parseInt(selectedMedicine.medicineQty) || 1;
  };

  // Function to capture current GPS coordinates
  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const coordsString = `${latitude}, ${longitude}`;
          setFormData((prev) => ({
            ...prev,
            address: coordsString,
            location: coordsString,
          }));
          setIsGettingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          Swal.fire({
            icon: 'error',
            title: 'Location Error',
            text: 'Could not get your current location. Please allow location access and try again.',
            confirmButtonColor: theme.palette.primary.main,
          });
          setIsGettingLocation(false);
        }
      );
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Geolocation Not Supported',
        text: 'Your browser does not support geolocation.',
        confirmButtonColor: theme.palette.primary.main,
      });
      setIsGettingLocation(false);
    }
  };

  // Render different steps
  const getStepContent = (step) => {
    switch (step) {
      case 0:
  return (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                <motion.div variants={itemVariants}>
                  <TextField
                    name="name"
                    required
                    fullWidth
                    id="name"
                    label="Full Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    autoFocus
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </motion.div>
                </Grid>
                <Grid item xs={12} sm={6}>
                <motion.div variants={itemVariants}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </motion.div>
                </Grid>
                <Grid item xs={12} sm={6}>
                <motion.div variants={itemVariants}>
                  <TextField
                    required
                    fullWidth
                    id="phoneNumber"
                    label="Phone Number"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </motion.div>
                </Grid>
                <Grid item xs={12} sm={6}>
                <motion.div variants={itemVariants}>
                  <TextField
                    required
                    fullWidth
                    id="city"
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <HomeIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </motion.div>
                </Grid>
                <Grid item xs={12}>
                <motion.div variants={itemVariants}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TextField
                      required
                      fullWidth
                      id="address"
                      label="Delivery Location (Coordinates)"
                      name="address"
                      value={formData.address}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <MyLocationIcon color="action" />
                          </InputAdornment>
                        ),
                        readOnly: true,
                      }}
                    />
                    <Tooltip title="Capture Current Location">
                      <IconButton
                        color="primary"
                        onClick={getCurrentLocation}
                        disabled={isGettingLocation}
                        sx={{
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) },
                        }}
                      >
                        {isGettingLocation ? (
                          <CircularProgress size={24} />
                        ) : (
                          <MyLocationIcon />
                        )}
                      </IconButton>
                    </Tooltip>
                  </Box>
                </motion.div>
                </Grid>
                </Grid>
          </motion.div>
        );
      
      case 1:
        return (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                <motion.div variants={itemVariants}>
                  <FormControl fullWidth required>
                    <InputLabel id="medicine-name-label">Medicine Name</InputLabel>
                    <Select
                      labelId="medicine-name-label"
                      id="medicineName"
                      name="medicineName"
                      value={formData.medicineName}
                      label="Medicine Name"
                      onChange={handleInputChange}
                      startAdornment={
                        <InputAdornment position="start">
                          <MedicationIcon color="action" />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="">
                        <em>Select a medicine</em>
                      </MenuItem>
                      {availableMedicines.length > 0 ? (
                        availableMedicines.map((medicine) => (
                          <MenuItem 
                            key={medicine._id} 
                            value={medicine.medicineName}
                          >
                            {medicine.medicineName} ({medicine.medicineQty} available) - Expires: {medicine.medicineExp}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>
                          <em>No medicines currently available</em>
                        </MenuItem>
                      )}
                    </Select>
                  </FormControl>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Note: Only non-expired and available medicines are shown
                  </Typography>
                </motion.div>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                <motion.div variants={itemVariants}>
                  <TextField
                    type="number"
                    required
                    fullWidth
                    id="medicineQty"
                    label="Quantity"
                    name="medicineQty"
                    value={formData.medicineQty}
                    onChange={handleInputChange}
                    inputProps={{ min: 1, max: getMaxQuantity() }}
                  />
                </motion.div>
                </Grid>
                
                <Grid item xs={12}>
                <motion.div variants={itemVariants}>
                  <TextField
                    fullWidth
                    id="reason"
                    label="Reason for Request (Optional)"
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    multiline
                    rows={3}
                    placeholder="Please explain why you need this medicine..."
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                          <InfoIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </motion.div>
                </Grid>
                
                <Grid item xs={12}>
                <motion.div variants={itemVariants}>
                  <SectionTitle variant="subtitle1">
                    Upload Prescription <span style={{ color: theme.palette.error.main }}>*</span>
                  </SectionTitle>
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: 2 }}>
                    <UploadButton
                    variant="outlined"
                    component="label"
                    startIcon={<CloudUploadIcon />}
                    sx={{ 
                        borderColor: prescription ? theme.palette.success.main : theme.palette.primary.main,
                        color: prescription ? theme.palette.success.main : theme.palette.primary.main,
                      }}
                    >
                      {prescription ? 'Change Prescription' : 'Select Prescription File'}
                    <input
                      type="file"
                      hidden
                      accept="image/jpeg,image/png,image/gif,application/pdf"
                      onChange={handlePrescriptionUpload}
                    />
                    </UploadButton>
                    
                    {prescription && (
                      <Typography variant="body2" color="success.main" sx={{ display: 'flex', alignItems: 'center' }}>
                        <CheckCircleIcon fontSize="small" sx={{ mr: 0.5 }} />
                        {prescription.name}
                    </Typography>
                  )}
                  </Box>
                </motion.div>
              </Grid>
              
              {prescriptionPreview && prescription?.type.includes('image') && (
                <Grid item xs={12}>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <PreviewCard>
                      <CardContent>
                        <Typography variant="subtitle2" gutterBottom>
                          Prescription Preview:
                        </Typography>
                        <Box sx={{ textAlign: 'center' }}>
                        <img 
                          src={prescriptionPreview} 
                          alt="Prescription Preview" 
                            style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px' }} 
                        />
                        </Box>
                      </CardContent>
                    </PreviewCard>
                  </motion.div>
                </Grid>
              )}
            </Grid>
          </motion.div>
        );
        
      case 2:
        return (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <Typography variant="h6" gutterBottom sx={{ color: theme.palette.primary.main }}>
                Review Your Request
              </Typography>
              <Typography variant="body2" paragraph>
                Please review your medicine request details before submission.
              </Typography>
            </motion.div>
            
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <motion.div variants={itemVariants}>
                    <SectionTitle variant="subtitle1">
                      Personal Information
                    </SectionTitle>
                    <Divider sx={{ mb: 2, mt: 1 }} />
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">Full Name:</Typography>
                        <Typography variant="body1" fontWeight="medium">{formData.name}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">Email:</Typography>
                        <Typography variant="body1" fontWeight="medium">{formData.email}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">Phone Number:</Typography>
                        <Typography variant="body1" fontWeight="medium">{formData.phoneNumber}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">Location (Coordinates):</Typography>
                        <Typography variant="body1" fontWeight="medium">{formData.address}</Typography>
                      </Grid>
                    </Grid>
                  </motion.div>
                </Grid>
                
                <Grid item xs={12}>
                  <motion.div variants={itemVariants}>
                    <SectionTitle variant="subtitle1" sx={{ mt: 2 }}>
                      Medicine Details
                    </SectionTitle>
                    <Divider sx={{ mb: 2, mt: 1 }} />
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">Medicine Name:</Typography>
                        <Typography variant="body1" fontWeight="medium">{formData.medicineName}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">Quantity:</Typography>
                        <Typography variant="body1" fontWeight="medium">{formData.medicineQty}</Typography>
                      </Grid>
                      {formData.reason && (
                        <Grid item xs={12}>
                          <Typography variant="body2" color="text.secondary">Reason:</Typography>
                          <Typography variant="body1" fontWeight="medium">{formData.reason}</Typography>
                        </Grid>
                      )}
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">Prescription:</Typography>
                        <Typography variant="body1" fontWeight="medium" sx={{ display: 'flex', alignItems: 'center' }}>
                          <AssignmentIcon fontSize="small" sx={{ mr: 1, color: theme.palette.success.main }} />
                          {prescription?.name}
                        </Typography>
                      </Grid>
                    </Grid>
                  </motion.div>
                </Grid>
              </Grid>
            </Paper>
            
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <motion.div variants={itemVariants}>
                <Typography variant="body2" color="text.secondary">
                  By clicking "Submit Request", you confirm that all information provided is accurate.
                </Typography>
              </motion.div>
            </Box>
          </motion.div>
        );
        
      default:
        return "Unknown step";
    }
  };

  return (
    <>
      <Navbar title="CareShare" />
      
      {/* Hero section */}
      <HeroSection>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
              Request Medicine
            </Typography>
            <Typography variant="h5" sx={{ maxWidth: 800, mx: 'auto', mb: 4, opacity: 0.9 }}>
              We connect you with donors to help you access the medicines you need
            </Typography>
          </motion.div>
        </Container>
      </HeroSection>
      
      {/* Form section */}
      <Box sx={{ bgcolor: alpha(theme.palette.primary.main, 0.03), py: 8 }}>
        <Container maxWidth="md">
          <FormContainer elevation={4}>
            <Box sx={{ px: 3, py: 4, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </motion.div>
            </Box>
            
            <FormSection>
              {errormsg && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                    {errormsg}
                  </Alert>
                </motion.div>
              )}
              
              <Box component="form" sx={{ mt: 1 }}>
                {getStepContent(activeStep)}
                
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
              <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    variant="outlined"
                sx={{ 
                      borderRadius: theme.shape.borderRadius * 3,
                      px: 3, 
                      borderWidth: '2px',
                      textTransform: 'none',
                      fontWeight: 600,
                    }}
                  >
                    Back
              </Button>
              
                  {activeStep === steps.length - 1 ? (
                    <SubmitButton
                      variant="contained"
                      color="primary"
                      onClick={handleSubmit}
                      disabled={loading}
                    >
                      {loading ? (
                        <CircularProgress size={24} sx={{ color: 'white' }} />
                      ) : (
                        "Submit Request"
                      )}
                    </SubmitButton>
                  ) : (
                    <SubmitButton
                      variant="contained"
                      color="primary"
                      onClick={handleNext}
                    >
                      Continue
                    </SubmitButton>
                  )}
                </Box>
              </Box>
            </FormSection>
          </FormContainer>
          
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              &copy; {new Date().getFullYear()} CareShare. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
      
      <Footer />
    </>
  );
} 