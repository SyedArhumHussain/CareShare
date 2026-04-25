import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MedicineList from './medicines/MedicineList';
import MedicineRequests from './medicines/MedicineRequests';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Paper, CircularProgress, useMediaQuery, useTheme } from '@mui/material';
import DashboardLayout from '../components/DashboardLayout';
import axios from 'axios';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`medicine-tabpanel-${index}`}
      aria-labelledby={`medicine-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `medicine-tab-${index}`,
    'aria-controls': `medicine-tabpanel-${index}`,
  };
}

const fadeVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const Medicines = () => {
  const location = useLocation();
  const [tabValue, setTabValue] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Set the initial tab based on the route
  useEffect(() => {
    const checkAuth = () => {
      const clientToken = JSON.parse(localStorage.getItem('clientToken'));
      const token = clientToken?.data;
      if (token) {
        setIsLoggedIn(token);
      } else {
        setIsLoggedIn(false);
      }
    };

    checkAuth();

    if (location.pathname === '/medicinerequest') {
      setTabValue(1); // Set to medicine requests tab
    } else {
      setTabValue(0); // Default to medicine inventory tab
    }
  }, [location.pathname]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const breadcrumbs = [
    { label: tabValue === 0 ? 'Medicine Inventory' : 'Medicine Requests', link: tabValue === 0 ? '/allMedicine' : '/medicinerequest' }
  ];

  return (
    <DashboardLayout 
      title={tabValue === 0 ? "Medicine Inventory" : "Medicine Requests"} 
      description={tabValue === 0 ? "Manage all available medicines in the system" : "Review and manage medicine requests from recipients"}
      breadcrumbs={breadcrumbs}
      isLoggedIn={isLoggedIn}
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeVariants}
      >
        <Paper 
          elevation={0} 
          sx={{ 
            borderRadius: 3, 
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            mb: 3,
            position: 'relative'
          }}
        >
          {loading && (
            <Box sx={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              width: '100%', 
              height: '100%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              zIndex: 1
            }}>
              <CircularProgress sx={{ color: '#58869e' }} />
            </Box>
          )}
          
          <Box sx={{ 
            borderBottom: 1, 
            borderColor: 'divider',
            px: 3,
            pt: 2 
          }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              aria-label="medicine management tabs"
              sx={{
                '& .MuiTabs-indicator': {
                  backgroundColor: '#58869e',
                  height: 3
                },
                '& .MuiTab-root': {
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '1rem',
                  color: '#637381',
                  '&.Mui-selected': {
                    color: '#58869e',
                  }
                }
              }}
            >
              <Tab 
                label={isMobile ? "Inventory" : "Medicine Inventory"} 
                {...a11yProps(0)} 
                sx={{ py: 2 }}
              />
              <Tab 
                label={isMobile ? "Requests" : "Medicine Requests"} 
                {...a11yProps(1)} 
                sx={{ py: 2 }}
              />
            </Tabs>
          </Box>
          
          <Box sx={{ px: { xs: 2, sm: 3 }, pb: 3 }}>
            <TabPanel value={tabValue} index={0}>
              <MedicineList />
            </TabPanel>
            
            <TabPanel value={tabValue} index={1}>
              <MedicineRequests />
            </TabPanel>
          </Box>
        </Paper>
      </motion.div>
    </DashboardLayout>
  );
};

export default Medicines;