import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  CircularProgress,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  Pagination,
  Skeleton,
  Collapse,
  Divider,
  Paper,
  useTheme,
  alpha
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon,
  Healing as HealingIcon,
  EventAvailable as EventAvailableIcon,
  Person as PersonIcon,
  MedicationLiquid as MedicationIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  NearMe as NearMeIcon
} from '@mui/icons-material';
import Navbar from '../components/Navbar';
import Footer from './Footer';
import axios from 'axios';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';

// Custom styled hero section
const HeroSection = styled(Box)(({ theme }) => ({
  background: `linear-gradient(rgba(38, 70, 83, 0.8), rgba(42, 157, 143, 0.7)), url('/medine/medicine2.jpg')`,
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

// Animation variants for cards
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      type: 'spring',
      stiffness: 100,
      damping: 15
    }
  }
};

// Custom styled card
const MedicineCard = ({ medicine, index, onRequest }) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);
  
  // Calculate remaining time until expiration
  const calculateRemainingTime = (expiryDate) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  };
  
  const remainingDays = calculateRemainingTime(medicine.medicineExp);
  const expiryStatus = 
    remainingDays > 180 ? 'success' :
    remainingDays > 90 ? 'warning' : 'error';
  
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay: index * 0.1 }}
    >
      <Card 
        elevation={3}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 3,
          overflow: 'hidden',
          position: 'relative',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: theme.shadows[10],
          },
        }}
      >
        <Box 
          sx={{ 
            bgcolor: 'primary.main', 
            color: 'white',
            py: 2.5,
            px: 3,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box 
            sx={{ 
              position: 'absolute', 
              right: -20, 
              top: -20, 
              width: 120, 
              height: 120, 
              borderRadius: '50%', 
              bgcolor: alpha(theme.palette.common.white, 0.1),
              zIndex: 0
            }} 
          />
          
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              {medicine.medicineName}
            </Typography>
            
            <Chip 
              icon={<MedicationIcon />} 
              label={`${medicine.medicineQty} available`}
              size="small"
              sx={{ 
                bgcolor: alpha(theme.palette.common.white, 0.2),
                color: 'white',
                mr: 1
              }}
            />
          </Box>
        </Box>
        
        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mb: 1.5 
                }}
              >
                <EventAvailableIcon 
                  fontSize="small" 
                  sx={{ color: `${expiryStatus}.main`, mr: 1.5 }} 
                />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Expiry Date
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {medicine.medicineExp}
                    {remainingDays > 0 && (
                      <Typography component="span" variant="caption" sx={{ ml: 1, color: `${expiryStatus}.main` }}>
                        ({remainingDays} days left)
                      </Typography>
                    )}
                  </Typography>
                </Box>
              </Box>
              
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  mb: 1.5
                }}
              >
                <PersonIcon fontSize="small" sx={{ color: 'primary.main', mr: 1.5 }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Donated By
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {medicine.name || 'Anonymous Donor'}
                  </Typography>
                </Box>
              </Box>
              
              <Collapse in={expanded}>
                <Box sx={{ mt: 2 }}>
                  <Divider sx={{ my: 1.5 }} />
                  
                  <Typography variant="body2" color="text.secondary" paragraph>
                    <strong>Medicine Details:</strong> {medicine.medicineDetails || 'No additional details provided.'}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary">
                    <strong>Location:</strong> {medicine.city || 'Location not specified'}
                  </Typography>
                </Box>
              </Collapse>
            </Grid>
          </Grid>
        </CardContent>
        
        <Divider />
        
        <CardActions sx={{ p: 2, pt: 1.5, pb: 1.5, justifyContent: 'space-between' }}>
          <Button
            size="small"
            endIcon={expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            onClick={() => setExpanded(!expanded)}
            sx={{ color: 'text.secondary' }}
          >
            {expanded ? 'Less' : 'More'}
          </Button>
          
          <Button
            variant="contained"
            color="primary"
            startIcon={<NearMeIcon />}
            onClick={() => onRequest(medicine)}
            sx={{ borderRadius: 6, px: 2 }}
          >
            Request
          </Button>
        </CardActions>
      </Card>
    </motion.div>
  );
};

const MedicineCards = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cards, setCards] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState('');
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    sortBy: 'name',
    city: 'all',
  });
  const [page, setPage] = useState(1);
  const [pageSize] = useState(6);
  const theme = useTheme();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check user login status
    const clientToken = JSON.parse(localStorage.getItem('clientToken'));
    const token = clientToken?.data;
    if (token) {
      setIsLoggedIn(token);
    }
    
    // Fetch available medicines
    async function fetchMedicines() {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:4000/askDonator');
        
        if (response.data && response.data.database) {
          setCards(response.data.database);
          
          // Debug: Log all medicines and their status
          console.log('All Medicines:', response.data.database);
          console.log('Medicines by status:', response.data.database.reduce((acc, med) => {
            acc[med.status] = acc[med.status] || [];
            acc[med.status].push(med.medicineName);
            return acc;
          }, {}));
          
          // Debug: Check if any approved medicines exist
          const approved = response.data.database.filter(med => med.status === 'approved');
          console.log('Approved Medicines Count:', approved.length);
          console.log('Approved Medicines:', approved);
        } else {
          setError('No data received from server');
        }
      } catch (err) {
        console.error('Error fetching medicines:', err);
        setError('Failed to load medicines. Please try again later.');
      } finally {
        setLoading(false);
      }
    } 
    
    fetchMedicines();
  }, []);
  
  // Filter and sort medicines based on search term and filters
  useEffect(() => {
    // First filter out medicines that are approved AND not expired AND have quantity > 0
    const currentDate = new Date();
    const approvedMedicines = cards.filter(card => {
      // Check if medicine is approved
      const isApproved = card.status === 'approved';
      
      // Check if medicine is not expired
      const expiryDate = new Date(card.medicineExp);
      const isNotExpired = expiryDate > currentDate;
      
      // Check if medicine has quantity greater than 0
      const hasQuantity = parseInt(card.medicineQty) > 0;
      
      return isApproved && isNotExpired && hasQuantity;
    });
    
    let filtered = [...approvedMedicines];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(medicine => 
        medicine.medicineName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply city filter
    if (filters.city !== 'all') {
      filtered = filtered.filter(medicine => 
        medicine.city && medicine.city.toLowerCase() === filters.city.toLowerCase()
      );
    }
    
    // Apply sorting
    switch (filters.sortBy) {
      case 'name':
        filtered.sort((a, b) => a.medicineName.localeCompare(b.medicineName));
        break;
      case 'expiry':
        filtered.sort((a, b) => new Date(a.medicineExp) - new Date(b.medicineExp));
        break;
      case 'quantity':
        filtered.sort((a, b) => parseInt(b.medicineQty) - parseInt(a.medicineQty));
        break;
      default:
        break;
    }
    
    setFilteredMedicines(filtered);
    setPage(1); // Reset to first page when filters change
  }, [cards, searchTerm, filters]);
  
  // Get current page of medicines
  const getCurrentPageItems = () => {
    const startIndex = (page - 1) * pageSize;
    return filteredMedicines.slice(startIndex, startIndex + pageSize);
  };
  
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  
  const handleClearSearch = () => {
    setSearchTerm('');
  };
  
  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePageChange = (event, value) => {
    setPage(value);
    // Scroll to top of medicines section
    document.getElementById('medicines-section').scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleRequestMedicine = (medicine) => {
    navigate(`/medicines?medicineName=${encodeURIComponent(medicine.medicineName)}&medicineQty=${encodeURIComponent(medicine.medicineQty)}`);
  };
  
  // Get unique cities from all medicines
  const cities = ['all', ...new Set(cards
    .filter(card => card.status === 'approved' && card.city && parseInt(card.medicineQty) > 0)
    .map(card => card.city))
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
              Available Medicines
            </Typography>
            <Typography variant="h5" sx={{ maxWidth: 800, mx: 'auto', mb: 4, opacity: 0.9 }}>
              Browse medicines donated by our community. These medications are verified and
              ready for you to request. Together, we're making healthcare more accessible.
            </Typography>
          </motion.div>
          
          <Paper
            component="form"
            elevation={3}
            sx={{
              p: 0.5,
              display: 'flex',
              alignItems: 'center',
              maxWidth: 600,
              mx: 'auto',
              borderRadius: 10,
              position: 'relative',
              zIndex: 2,
            }}
          >
            <InputAdornment position="start" sx={{ pl: 2 }}>
              <SearchIcon color="action" />
            </InputAdornment>
            <TextField
              fullWidth
              variant="standard"
              placeholder="Search for medicines..."
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                disableUnderline: true,
              }}
              sx={{ ml: 1, flex: 1 }}
            />
            {searchTerm && (
              <IconButton size="small" onClick={handleClearSearch} aria-label="clear search">
                <ClearIcon />
              </IconButton>
            )}
            <IconButton
              color={filterOpen ? 'primary' : 'default'}
              aria-label="filter list"
              onClick={() => setFilterOpen(!filterOpen)}
              sx={{ mr: 0.5 }}
            >
              <FilterListIcon />
            </IconButton>
          </Paper>
          
          <Collapse in={filterOpen}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                mt: 1,
                maxWidth: 600,
                mx: 'auto',
                borderRadius: 4,
                display: 'flex',
                flexWrap: 'wrap',
                gap: 2,
                position: 'relative',
                zIndex: 2,
              }}
            >
              <FormControl sx={{ minWidth: 200, flex: 1 }} size="small">
                <InputLabel id="sort-by-label">Sort By</InputLabel>
                <Select
                  labelId="sort-by-label"
                  id="sort-by"
                  name="sortBy"
                  value={filters.sortBy}
                  label="Sort By"
                  onChange={handleFilterChange}
                >
                  <MenuItem value="name">Name (A-Z)</MenuItem>
                  <MenuItem value="expiry">Expiry Date (Soonest)</MenuItem>
                  <MenuItem value="quantity">Quantity (Highest)</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl sx={{ minWidth: 200, flex: 1 }} size="small">
                <InputLabel id="city-label">City</InputLabel>
                <Select
                  labelId="city-label"
                  id="city"
                  name="city"
                  value={filters.city}
                  label="City"
                  onChange={handleFilterChange}
                >
                  {cities.map((city, index) => (
                    <MenuItem key={index} value={city}>
                      {city === 'all' ? 'All Cities' : city}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Paper>
          </Collapse>
        </Container>
      </HeroSection>
      
      {/* Medicines Section */}
      <Box id="medicines-section" sx={{ py: 6, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          {loading ? (
            <Grid container spacing={4}>
              {[...Array(6)].map((_, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card sx={{ height: '100%', borderRadius: 3 }}>
                    <Skeleton variant="rectangular" height={120} />
                    <CardContent>
                      <Skeleton variant="text" height={40} width="80%" />
                      <Skeleton variant="text" height={20} width="60%" />
                      <Skeleton variant="text" height={20} width="70%" />
                      <Skeleton variant="text" height={20} width="50%" />
                    </CardContent>
                    <CardActions>
                      <Skeleton variant="rectangular" height={36} width={120} sx={{ borderRadius: 1 }} />
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : error ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h5" color="error" gutterBottom>
                {error}
              </Typography>
              <Button 
                variant="contained" 
                onClick={() => window.location.reload()}
                sx={{ mt: 2 }}
              >
                Try Again
              </Button>
            </Box>
          ) : filteredMedicines.length > 0 ? (
            <>
              <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                  Showing {getCurrentPageItems().length} of {filteredMedicines.length} available medicines
                </Typography>
              </Box>
              
              <Grid container spacing={4}>
                {getCurrentPageItems().map((medicine, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <MedicineCard 
                      medicine={medicine} 
                      index={index}
                      onRequest={handleRequestMedicine}
                    />
                  </Grid>
                ))}
              </Grid>
              
              {filteredMedicines.length > pageSize && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                  <Pagination 
                    count={Math.ceil(filteredMedicines.length / pageSize)} 
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                    sx={{
                      '& .MuiPaginationItem-root': {
                        fontWeight: 500,
                      }
                    }}
                  />
                </Box>
              )}
            </>
          ) : (
            <Box 
              sx={{ 
                textAlign: 'center', 
                py: 8,
                px: 3,
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                borderRadius: 4
              }}
            >
              <HealingIcon sx={{ fontSize: 60, color: 'primary.light', mb: 2 }} />
              <Typography variant="h5" gutterBottom fontWeight="medium">
                No Medicines Available
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}>
                {searchTerm 
                  ? `No medicines matching "${searchTerm}" were found. Please try a different search term.` 
                  : 'There are no medicines available at the moment. Please check back later or request a specific medicine.'}
              </Typography>
              <Button
                component={RouterLink}
                to="/medicines"
                variant="contained"
                color="primary"
                sx={{ borderRadius: 8, px: 3, py: 1.2 }}
              >
                Request a Specific Medicine
              </Button>
            </Box>
          )}
        </Container>
      </Box>
      
      <Footer />
    </>
  );
};

export default MedicineCards;
