import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Typography, Paper, Container, Button } from '@mui/material';
import { LockOutlined as LockIcon } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = () => {
      try {
        const clientToken = JSON.parse(localStorage.getItem('clientToken'));
        const token = clientToken?.token;
        
        if (!token) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }
        
        // Decode and verify token
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const decodedToken = JSON.parse(atob(base64));
        const currentTime = Date.now() / 1000;
        
        if (decodedToken.exp > currentTime) {
          setIsAuthenticated(true);
        } else {
          // Token expired
          localStorage.removeItem('clientToken');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Add a slight delay to show loading state
    const timer = setTimeout(() => {
      checkAuth();
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          bgcolor: 'background.default'
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 3, color: 'text.secondary' }}>
          Verifying your access...
        </Typography>
      </Box>
    );
  }
  
  if (!isAuthenticated) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          bgcolor: 'background.default',
          py: 8
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={6}
            sx={{
              p: 5,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              borderRadius: 4
            }}
          >
            <Box
              sx={{
                width: 70,
                height: 70,
                borderRadius: '50%',
                bgcolor: 'error.light',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 3
              }}
            >
              <LockIcon sx={{ fontSize: 40, color: 'white' }} />
            </Box>
            
            <Typography variant="h4" gutterBottom fontWeight="bold">
              Access Restricted
            </Typography>
            
            <Typography variant="body1" color="text.secondary" textAlign="center" paragraph>
              You need to be logged in to access this page. Please sign in to continue.
            </Typography>
            
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Button
                component={RouterLink}
                to="/signin"
                variant="contained"
                size="large"
                sx={{ minWidth: 120 }}
                state={{ from: location.pathname }}
              >
                Sign In
              </Button>
              
              <Button
                component={RouterLink}
                to="/signup"
                variant="outlined"
                size="large"
                sx={{ minWidth: 120 }}
              >
                Sign Up
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
    );
  }
  
  return children;
};

export default ProtectedRoute; 