import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import '../Dash.css';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';
import StatCard from '../components/StatCard';
import DonorsList from './medicines/DonorsList';
import { Paper, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import PeopleIcon from '@mui/icons-material/People';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import NotFound from './NotFound404'

const AboutDashboard = () => {
  const [donorsCount, setDonorsCount] = useState(0);
  const [recipientsCount, setRecipientsCount] = useState(0);
  const [medicinesCount, setMedicinesCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          getRecipientsCount(),
          getDonorsCount(),
          getMedicinesCount()
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    const clientToken = JSON.parse(localStorage.getItem('clientToken'));
    const token = clientToken?.data;
    if (token) {
      setIsLoggedIn(token);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const getRecipientsCount = async () => {
    try {
      const response = await axios.get('http://localhost:4000/receipient');
      setRecipientsCount(response?.data?.length || 0);
    } catch (error) {
      console.error(error);
    }
  };

  const getDonorsCount = async () => {
    try {
      const response = await axios.get('http://localhost:4000/donor');
      setDonorsCount(response?.data?.length || 0);
    } catch (error) {
      console.error(error);
    }
  };

  const getMedicinesCount = async () => {
    try {
      const response = await axios.get('http://localhost:4000/askDonator');
      setMedicinesCount(response?.data?.database?.length || 0);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      await Promise.all([
        getRecipientsCount(),
        getDonorsCount(),
        getMedicinesCount()
      ]);
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setLoading(false);
    }
  };

  const breadcrumbs = [
    { label: 'Donors', link: '/donors' }
  ];

  return (
    <DashboardLayout 
      title="Donors Management" 
      description="View and manage donor information and their donations"
      breadcrumbs={breadcrumbs}
      isLoggedIn={isLoggedIn}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Medicines"
            count={medicinesCount}
            icon={<MedicalServicesIcon sx={{ fontSize: 30 }} />}
            color="linear-gradient(135deg, #58869e 0%, #365b6f 100%)"
            delay={0}
            link="/allMedicine"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Donors"
            count={donorsCount}
            icon={<PeopleIcon sx={{ fontSize: 30 }} />}
            color="linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)"
            delay={0.2}
            link="/donors"
            subtitle="Active contributors"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Recipients"
            count={recipientsCount}
            icon={<EmojiPeopleIcon sx={{ fontSize: 30 }} />}
            color="linear-gradient(135deg, #42A5F5 0%, #1976D2 100%)"
            delay={0.4}
            link="/recipients"
          />
        </Grid>
      </Grid>

      <Box height={24} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <Paper 
          elevation={0} 
          sx={{ 
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
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
          
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              Donors List
            </Typography>
            <DonorsList onRefresh={handleRefresh} />
          </Box>
        </Paper>
      </motion.div>
    </DashboardLayout>
  );
};

export default AboutDashboard;





















