import React, { useEffect, useState } from 'react'
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import Swal from "sweetalert2";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CircularProgress from '@mui/material/CircularProgress';

import './signin.css'
function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      CareShare
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

export default function Ask() {
  
  const location = useLocation(); 
  const searchParams = new URLSearchParams(location.search);
  const medicineName = searchParams.get('medicineName') 
  const [fdata, setFdata] = useState({
    name: '',
    email: '',
    address: '',
    location: '', // <-- Add location field
    medicineName: medicineName,
    medicineQty: 0,
    reason: '',
    phoneNumber: ''
  })
  const [loading, setLoading] = useState(false);
  const [prescription, setPrescription] = useState(null);
  const [prescriptionPreview, setPrescriptionPreview] = useState(null);
  const [medicineAvailable, setMedicineAvailable] = useState(true);
  // State for location loading
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  useEffect(() => {
    // Set initial medicine quantity from URL
    setFdata({ ...fdata, medicineQty: Number(searchParams.get('medicineQty')) })
    
    // Check if medicine is available
    checkMedicineAvailability(medicineName);
  }, [])

  const navigate = useNavigate();
  const [errormsg, setErrormsg] = useState(null);

  // Check if medicine is available in database
  const checkMedicineAvailability = async (medicineName) => {
    try {
      const response = await fetch(`http://localhost:4000/checkMedicine?medicineName=${encodeURIComponent(medicineName)}`);
      const data = await response.json();
      
      if (!data.available) {
        setMedicineAvailable(false);
        Swal.fire({
          icon: "error",
          title: "Medicine Not Available",
          text: "Sorry, this medicine is no longer available in our inventory.",
          confirmButtonColor: "#0875b8",
        });
      }
    } catch (error) {
      console.error("Error checking medicine availability:", error);
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
    }
  };

  // Function to capture current GPS coordinates
  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const coordsString = `${latitude},${longitude}`;
          setFdata((prev) => ({
            ...prev,
            location: coordsString,
            address: coordsString // Optionally set address to coords for consistency
          }));
          setIsGettingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          Swal.fire({
            icon: 'error',
            title: 'Location Error',
            text: 'Could not get your current location. Please allow location access and try again.',
            confirmButtonColor: '#0875b8',
          });
          setIsGettingLocation(false);
        }
      );
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Geolocation Not Supported',
        text: 'Your browser does not support geolocation.',
        confirmButtonColor: '#0875b8',
      });
      setIsGettingLocation(false);
    }
  };

  const Sendtobackend = async () => {
    // Form validation
    if (!fdata.name || !fdata.email || !fdata.address || !fdata.phoneNumber || !fdata.location) {
      setErrormsg('All fields are required, including current location.');
      return;
    }
    
    // Check if medicine is available before proceeding
    if (!medicineAvailable) {
      Swal.fire({
        icon: "error",
        title: "Medicine Not Available",
        text: "Sorry, this medicine is no longer available in our inventory.",
        confirmButtonColor: "#0875b8",
      });
      return;
    }

    // Start loading state
    setLoading(true);
    
    try {
      // Create form data for file upload
      const formData = new FormData();
      formData.append('name', fdata.name);
      formData.append('email', fdata.email);
      formData.append('address', fdata.address);
      formData.append('location', fdata.location); // <-- Send location field
      formData.append('medicineName', fdata.medicineName);
      formData.append('medicineQty', fdata.medicineQty);
      formData.append('reason', fdata.reason);
      formData.append('phoneNumber', fdata.phoneNumber);
      
      // Add prescription file if available
      if (prescription) {
        formData.append('prescription', prescription);
      }
      
      // Send request to backend
      const response = await fetch('http://localhost:4000/medicineRequest', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      setLoading(false);
      
      if (data.error) {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: data.error,
          confirmButtonColor: "#0875b8",
        });
        setErrormsg(data.error);
      } else {
        navigate("/");
        Swal.fire({
          title: "Request Submitted",
          text: "Your medicine request has been submitted successfully. You will be notified when it is approved.",
          icon: "success",
          confirmButtonColor: "#0875b8",
        });
      }
    } catch (error) {
      setLoading(false);
      console.error("Error submitting request:", error);
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "An error occurred while submitting your request. Please try again.",
        confirmButtonColor: "#0875b8",
      });
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      name: data.get('name'),
      email: data.get('email'),
    });
  };

  return (
    <div className="a">
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: '#58869e' }}>
              <AddToPhotosIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Request Medicine
            </Typography>
            {
              errormsg ? <h5 style={{color:"red"}}>{errormsg}</h5> : null 
            }
            {!medicineAvailable && (
              <Typography variant="body1" color="error" sx={{ mt: 2 }}>
                This medicine is currently not available. Please check back later.
              </Typography>
            )}
            <Box sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12}>
                  <TextField
                    autoComplete="given-name"
                    name="Name"
                    required
                    fullWidth
                    id="Name"
                    label="Full Name"
                    autoFocus
                    onClick={() => setErrormsg(null)}
                    onChange={(e) => setFdata({ ...fdata, name: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email"
                    name="email"
                    autoComplete="email"
                    onClick={() => setErrormsg(null)}
                    onChange={(e) => setFdata({ ...fdata, email: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="phoneNumber"
                    label="Phone Number"
                    name="phoneNumber"
                    autoComplete="tel"
                    onClick={() => setErrormsg(null)}
                    onChange={(e) => setFdata({ ...fdata, phoneNumber: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    fullWidth
                    id="medicineName"
                    label="Medicine Name"
                    name="medicineName"
                    value={medicineName}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    type='number'
                    InputProps={{
                      inputProps: {
                        step: "1",
                        min: 1,
                        max: fdata.medicineQty,
                      }
                    }}
                    fullWidth
                    id="medicineQty"
                    label="Medicine Quantity"
                    name="medicineQty"
                    value={fdata.medicineQty}
                    onChange={(e) => setFdata({ ...fdata, medicineQty: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    required
                    fullWidth
                    id="Address"
                    label="Address"
                    name="Address"
                    autoComplete="address-line1"
                    onClick={() => setErrormsg(null)}
                    onChange={(e) => setFdata({ ...fdata, address: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    fullWidth
                    id="reason"
                    label="Reason for Request"
                    name="reason"
                    multiline
                    rows={4}
                    onClick={() => setErrormsg(null)}
                    onChange={(e) => setFdata({ ...fdata, reason: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Upload Prescription (Optional)
                  </Typography>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<CloudUploadIcon />}
                    fullWidth
                    sx={{ mb: 2 }}
                  >
                    Upload Prescription
                    <input
                      type="file"
                      accept="image/*, application/pdf"
                      style={{ display: 'none' }}
                      onChange={handlePrescriptionUpload}
                    />
                  </Button>
                  {prescriptionPreview && (
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                      <Typography variant="subtitle2">Prescription Preview:</Typography>
                      {prescription.type.includes('image') ? (
                        <img 
                          src={prescriptionPreview} 
                          alt="Prescription Preview" 
                          style={{ maxWidth: '100%', maxHeight: '200px', marginTop: '8px' }} 
                        />
                      ) : (
                        <Box sx={{ p: 2, bgcolor: '#f0f0f0', borderRadius: 1, mt: 1 }}>
                          <Typography variant="body2">{prescription.name}</Typography>
                        </Box>
                      )}
                    </Box>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={getCurrentLocation}
                    disabled={isGettingLocation}
                    startIcon={<CloudUploadIcon />}
                    sx={{ mb: 2 }}
                  >
                    {isGettingLocation ? 'Getting Location...' : 'Capture Current Location'}
                  </Button>
                  {fdata.location && (
                    <Typography variant="body2" color="text.secondary">
                      <strong>Coordinates:</strong> {fdata.location}
                    </Typography>
                  )}
                  <Typography variant="caption" color="text.secondary">
                    Click the button to capture your current coordinates (required).
                  </Typography>
                </Grid>
              </Grid>
              <Button
                disabled={loading || !medicineAvailable}
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={Sendtobackend}
              >
                {loading ? <CircularProgress size={24} /> : "Submit Request"}
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href="/" variant="body2">
                    Back to Home
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Copyright sx={{ mt: 5 }} />
        </Container>
      </ThemeProvider>
    </div>
  );
}