import React, { useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  Tooltip,
  IconButton,
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Stack,
  Divider,
  InputAdornment,
  useTheme,
  alpha,
  FormControl,
  InputLabel,
  OutlinedInput,
  CircularProgress,
  Modal
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import MedicationIcon from '@mui/icons-material/Medication';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import EventIcon from '@mui/icons-material/Event';

import { useNavigate } from 'react-router';
import Swal from "sweetalert2";
import { PlusOutlined } from '@ant-design/icons';
import { Modal as AntModal, Spin, Upload } from 'antd';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Navbar from '../components/Navbar';
import Footer from './Footer';

// Styled components
const HeroSection = styled(Box)(({ theme }) => ({
  background: `linear-gradient(rgba(38, 70, 83, 0.8), rgba(42, 157, 143, 0.7)), url('/medine/donate5.jpg')`,
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
  marginBottom: theme.spacing(8),
  position: 'relative',
  zIndex: 10,
  [theme.breakpoints.down('sm')]: {
    marginTop: theme.spacing(-3),
  },
}));

const FormSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4, 6),
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

const SubmitButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5, 3),
  borderRadius: theme.shape.borderRadius * 3,
  fontWeight: 600,
  fontSize: '1rem',
  textTransform: 'none',
  boxShadow: theme.shadows[3],
  transition: 'all 0.3s ease',
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(2),
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: theme.shadows[6],
  },
}));

const StyledUploadButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.2, 3),
  borderRadius: theme.shape.borderRadius * 3,
  fontWeight: 600,
  textTransform: 'none',
  borderWidth: '2px',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
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

const { Dragger } = Upload;

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const DonateForm = () => {
  const theme = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [location, setLocation] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [medicineName, setMedicineName] = useState('');
  const [medicineQty, setMedicineQty] = useState('');
  const [medicineImg, setMedicineImg] = useState(null);
  const [medicineExp, setMedicineExp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // For image preview
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState([]);

  // For location
  const [locationAddress, setLocationAddress] = useState('');

  // Load stored address from localStorage when component mounts
  useEffect(() => {
    const storedAddress = localStorage.getItem('medicineLocationAddress');
    if (storedAddress) {
      setLocationAddress(storedAddress);
    }
  }, []);



  // Function to get address from coordinates using Geocoding API
  const getAddressFromCoordinates = (lat, lng) => {
    if (window.google && window.google.maps) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results[0]) {
          setLocationAddress(results[0].formatted_address);
        } else {
          setLocationAddress('Address not found');
          console.error('Geocoder failed due to: ' + status);
        }
      });
    }
  };

  // Get current location
  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(`${latitude}, ${longitude}`);
          
          // Get address for current location
          getAddressFromCoordinates(latitude, longitude);
          
          setIsGettingLocation(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          Swal.fire({
            icon: "error",
            title: "Location Error",
            text: "Could not get your current location. Please allow location access and try again.",
            confirmButtonColor: theme.palette.primary.main,
          });
          setIsGettingLocation(false);
        }
      );
    } else {
      Swal.fire({
        icon: "error",
        title: "Location Not Supported",
        text: "Geolocation is not supported by your browser.",
        confirmButtonColor: theme.palette.primary.main,
      });
      setIsGettingLocation(false);
    }
  };



  const handleFormSubmit = async () => {
    // Validate required fields
    if (!name || !email || !mobile || !address || !city || !location || !medicineName || !medicineQty || !medicineExp || fileList.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Missing Information",
        text: "Please fill in all required fields including mobile number, city and current location.",
        confirmButtonColor: theme.palette.primary.main,
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Create the data object
    const data = {
      name,
      email,
      mobile,
      address,
      city,
      location, // Adding the location field to the data object
      medicineName,
      medicineQty,
      medicineImg: fileList[0].thumbUrl,
      medicineExp,
    };

    try {
      const response = await fetch('http://localhost:4000/donate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log('Data successfully sent to the API.');
        Swal.fire({
          title: "Successful",
          text: "Your donation has been submitted and is waiting for admin approval. Thank you for your contribution!",
          icon: "success",
          confirmButtonColor: theme.palette.primary.main,
        });
        navigate('/');
      } else {
        console.log('Failed to send data to the API.');
        Swal.fire({
          icon: "error",
          title: "Submission Failed",
          text: "Failed to submit your donation. Please try again.",
          confirmButtonColor: theme.palette.primary.main,
        });
      }
    } catch (error) {
      console.error('An error occurred while sending data:', error);
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Could not connect to the server. Please try again later.",
        confirmButtonColor: theme.palette.primary.main,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => setPreviewOpen(false);
  
  const handleFileChange = async ({ fileList }) => {
    setFileList(fileList);

    // Check if there's an uploaded image
    const uploadedImage = fileList.find(file => file.status === 'done');
    if (uploadedImage) {
      try {
        const base64Data = await getBase64(uploadedImage.originFileObj);
        setMedicineImg(base64Data); // Set the base64 encoded image data
      } catch (error) {
        console.error('Error while converting image to base64:', error);
      }
    } else {
      setMedicineImg(null); // No image uploaded
    }
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };

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
              Donate Medicines
            </Typography>
            <Typography variant="h5" sx={{ maxWidth: 800, mx: 'auto', mb: 4, opacity: 0.9 }}>
              Your unused medicines can save lives and help those in need
            </Typography>
          </motion.div>
        </Container>
      </HeroSection>
      
      {/* Form Section */}
      <Box sx={{ bgcolor: alpha(theme.palette.primary.main, 0.03), py: 8 }}>
        <Container maxWidth="md">
          <FormContainer elevation={4}>
            <Box sx={{ px: 3, py: 4, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
              <Typography 
                variant="h5" 
                fontWeight="bold" 
                align="center"
                sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1
                }}
              >
                <LocalHospitalIcon color="primary" fontSize="large" />
                Medicine Donation Form
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                align="center" 
                sx={{ mt: 1, mb: 0 }}
              >
                Fill in the details below to donate your unused medicines
              </Typography>
            </Box>
            
            <FormSection>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <SectionTitle variant="h6" gutterBottom>
                  Personal Information
                </SectionTitle>
                <Divider sx={{ mb: 3, mt: 1 }} />
                
                <Grid container spacing={3}>
                  {/* Name Field */}
                  <Grid item xs={12} sm={6}>
                    <motion.div variants={itemVariants}>
                      <TextField
                        label="Full Name"
                        fullWidth
                        required
                        variant="outlined"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
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
                  
                  {/* Email Field */}
                  <Grid item xs={12} sm={6}>
                    <motion.div variants={itemVariants}>
                      <TextField
                        label="Email Address"
                        fullWidth
                        required
                        variant="outlined"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                  
                  {/* Mobile Field */}
                  <Grid item xs={12} sm={6}>
                    <motion.div variants={itemVariants}>
                      <TextField
                        label="Mobile Number"
                        fullWidth
                        required
                        variant="outlined"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
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
                  
                  {/* City Field */}
                  <Grid item xs={12} sm={6}>
                    <motion.div variants={itemVariants}>
                      <TextField
                        label="City"
                        fullWidth
                        required
                        variant="outlined"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
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
                  
                  {/* Address Field */}
                  <Grid item xs={12}>
                    <motion.div variants={itemVariants}>
                      <TextField
                        label="Address"
                        fullWidth
                        required
                        variant="outlined"
                        multiline
                        rows={2}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                              <HomeIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </motion.div>
                  </Grid>
                  
                  {/* Location Field */}
                  <Grid item xs={12}>
                    <motion.div variants={itemVariants}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TextField
                          label="Medicine Location (Coordinates)"
                          required
                          fullWidth
                          variant="outlined"
                          value={location}
                          placeholder="Your current coordinates will appear here"
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
                              '&:hover': {
                                bgcolor: alpha(theme.palette.primary.main, 0.2),
                              }
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
                      {locationAddress && (
                        <Typography variant="caption" color="text.primary" sx={{ mt: 0.5, display: 'block' }}>
                          <strong>Address:</strong> {locationAddress}
                        </Typography>
                      )}
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                        Click the location button to capture your current coordinates.
                      </Typography>
                    </motion.div>
                  </Grid>
                </Grid>
                
                <SectionTitle variant="h6" gutterBottom sx={{ mt: 4 }}>
                  Medicine Details
                </SectionTitle>
                <Divider sx={{ mb: 3, mt: 1 }} />
                
                <Grid container spacing={3}>
                  {/* Medicine Name Field */}
                  <Grid item xs={12} sm={8}>
                    <motion.div variants={itemVariants}>
                      <TextField
                        label="Medicine Name"
                        fullWidth
                        required
                        variant="outlined"
                        value={medicineName}
                        onChange={(e) => setMedicineName(e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <MedicationIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </motion.div>
                  </Grid>
                  
                  {/* Quantity Field */}
                  <Grid item xs={12} sm={4}>
                    <motion.div variants={itemVariants}>
                      <TextField
                        label="Quantity"
                        fullWidth
                        required
                        type="number"
                        variant="outlined"
                        value={medicineQty}
                        onChange={(e) => setMedicineQty(e.target.value)}
                        inputProps={{ min: 1 }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <ProductionQuantityLimitsIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </motion.div>
                  </Grid>
                  
                  {/* Expiry Date Field */}
                  <Grid item xs={12} sm={6}>
                    <motion.div variants={itemVariants}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DatePicker']} sx={{ width: '100%', p: 0 }}>
                          <DatePicker
                            label="Medicine Expiry Date"
                            value={medicineExp}
                            onChange={(newValue) => setMedicineExp(newValue)}
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                required: true,
                                InputProps: {
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <EventIcon color="action" />
                                    </InputAdornment>
                                  ),
                                },
                              },
                            }}
                          />
                        </DemoContainer>
                      </LocalizationProvider>
                    </motion.div>
                  </Grid>
                  
                  {/* Medicine Image Upload */}
                  <Grid item xs={12}>
                    <motion.div variants={itemVariants}>
                      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mb: 1 }}>
                        Medicine Image <Box component="span" sx={{ color: 'error.main' }}>*</Box>
                      </Typography>
                      <Dragger
                        onPreview={handlePreview}
                        onRemove={(e) => {
                          const notRemovedImages = fileList.filter(imageItem => imageItem.name !== e.name);
                          setFileList({ fileList: notRemovedImages });
                        }}
                        multiple={false}
                        listType="picture-card"
                        showUploadList={{ showRemoveIcon: true }}
                        accept=".png,.jpeg,.jpg"
                        beforeUpload={(file) => {
                          return false;
                        }}
                        onChange={handleFileChange}
                        iconRender={() => {
                          return <Spin />;
                        }}
                        style={{ 
                          padding: '20px', 
                          background: alpha(theme.palette.primary.main, 0.03),
                          borderRadius: theme.shape.borderRadius * 2,
                          border: `2px dashed ${alpha(theme.palette.primary.main, 0.2)}`,
                        }}
                      >
                        <Box sx={{ p: 2, textAlign: 'center' }}>
                          <UploadFileIcon color="primary" fontSize="large" />
                          <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: 600 }}>
                            Click or drag file to upload
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Upload a clear image of the medicine package
                          </Typography>
                          <StyledUploadButton 
                            variant="outlined" 
                            color="primary" 
                            sx={{ mt: 2 }}
                            startIcon={<UploadFileIcon />}
                          >
                            Select Image
                          </StyledUploadButton>
                        </Box>
                      </Dragger>
                      <AntModal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                        <img
                          alt="Medicine preview"
                          style={{ width: '100%' }}
                          src={previewImage}
                        />
                      </AntModal>
                    </motion.div>
                  </Grid>
                  
                  {/* Submit Button */}
                  <Grid item xs={12} sx={{ textAlign: 'center' }}>
                    <motion.div variants={itemVariants}>
                      <SubmitButton
                        variant="contained"
                        color="primary"
                        fullWidth
                        startIcon={isSubmitting ? null : <PlayArrowIcon />}
                        onClick={handleFormSubmit}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <CircularProgress size={24} color="inherit" />
                        ) : (
                          "Donate Medicine"
                        )}
                      </SubmitButton>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        By submitting, you confirm that the information provided is accurate and the medicine is not expired.
                      </Typography>
                    </motion.div>
                  </Grid>
                </Grid>
              </motion.div>
            </FormSection>
          </FormContainer>
        </Container>
      </Box>
      

      
      <Footer />
    </>
  );
};

export default DonateForm;
