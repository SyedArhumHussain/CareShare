import React from 'react';
import { Box, Paper, Typography, Container, Breadcrumbs, Link, useMediaQuery, useTheme, Divider } from '@mui/material';
import Navbar from './Navbar';
import Sidenav from './Sidenav';
import { motion } from 'framer-motion';
import NotFound from '../pages/NotFound404';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';

const DashboardLayout = ({ 
  children, 
  title, 
  description, 
  breadcrumbs = [], 
  isLoggedIn = false 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: 'spring',
        stiffness: 80,
        damping: 17,
        duration: 0.6 
      } 
    }
  };

  if (isLoggedIn !== 'admin') {
    return <NotFound />;
  }

  return (
    <div className='bgcolor'>
      <Navbar />
      <Box height={70} />
      <Box sx={{ display: 'flex' }}>
        <Sidenav />
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            p: { xs: 2, sm: 3, md: 4 },
            transition: 'all 0.3s ease',
            backgroundImage: 'linear-gradient(to bottom, rgba(240, 244, 248, 0.8), rgba(248, 249, 250, 1))',
            minHeight: 'calc(100vh - 70px)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Background Decorative Elements */}
          <Box 
            sx={{
              position: 'absolute',
              top: '10%',
              right: '-5%',
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(88,134,158,0.03) 0%, rgba(255,255,255,0) 70%)',
              zIndex: 0
            }}
          />
          <Box 
            sx={{
              position: 'absolute',
              bottom: '5%',
              left: '-3%',
              width: '250px',
              height: '250px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(88,134,158,0.02) 0%, rgba(255,255,255,0) 70%)',
              zIndex: 0
            }}
          />
          
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: { xs: 2.5, sm: 3.5 }, 
                  mb: 4, 
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 6px 30px rgba(0, 0, 0, 0.08)',
                  overflow: 'hidden',
                  position: 'relative',
                  border: '1px solid rgba(255, 255, 255, 0.8)',
                  zIndex: 1
                }}
              >
                {/* Decorative elements */}
                <Box sx={{ 
                  position: 'absolute', 
                  right: -20, 
                  top: -20, 
                  width: 120, 
                  height: 120, 
                  borderRadius: '50%', 
                  background: 'radial-gradient(circle, rgba(88,134,158,0.08) 0%, rgba(255,255,255,0) 70%)' 
                }} />
                <Box sx={{ 
                  position: 'absolute', 
                  left: -15, 
                  bottom: -15, 
                  width: 80, 
                  height: 80, 
                  borderRadius: '50%', 
                  background: 'radial-gradient(circle, rgba(88,134,158,0.05) 0%, rgba(255,255,255,0) 70%)' 
                }} />
                
                <Box sx={{ position: 'relative', zIndex: 2 }}>
                  <Breadcrumbs 
                    separator={<NavigateNextIcon fontSize="small" sx={{ color: '#637381' }} />} 
                    aria-label="breadcrumb"
                    sx={{ 
                      mb: 1.5,
                      '& .MuiBreadcrumbs-ol': {
                        flexWrap: isMobile ? 'wrap' : 'nowrap'
                      }
                    }}
                  >
                    <Link 
                      underline="hover" 
                      color="inherit" 
                      href="/admin"
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        color: '#637381',
                        fontWeight: 500,
                        fontSize: '0.875rem',
                        '&:hover': { color: '#58869e', transition: 'color 0.2s ease' }
                      }}
                    >
                      <HomeIcon sx={{ mr: 0.5, fontSize: 18 }} />
                      Dashboard
                    </Link>
                    
                    {breadcrumbs.map((item, index) => (
                      <Link
                        key={index}
                        color="inherit"
                        href={item.link || '#'}
                        underline="hover"
                        sx={{ 
                          color: index === breadcrumbs.length - 1 ? '#333' : '#637381',
                          fontWeight: index === breadcrumbs.length - 1 ? 600 : 500,
                          fontSize: '0.875rem',
                          '&:hover': { color: '#58869e', transition: 'color 0.2s ease' }
                        }}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </Breadcrumbs>
                  
                  <Typography 
                    variant="h4" 
                    component="h1" 
                    sx={{ 
                      fontWeight: 700, 
                      fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                      lineHeight: 1.2,
                      color: '#333',
                      mb: 1
                    }}
                  >
                    {title}
                  </Typography>
                  
                  {description && (
                    <Typography 
                      variant="body1" 
                      color="text.secondary" 
                      sx={{ 
                        maxWidth: 800,
                        lineHeight: 1.6,
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        color: '#637381'
                      }}
                    >
                      {description}
                    </Typography>
                  )}
                </Box>
              </Paper>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Container 
                maxWidth={false} 
                disableGutters
                sx={{ 
                  position: 'relative',
                  minHeight: '200px',
                  zIndex: 1
                }}
              >
                {children}
              </Container>
            </motion.div>
          </motion.div>
        </Box>
      </Box>
    </div>
  );
};

export default DashboardLayout; 