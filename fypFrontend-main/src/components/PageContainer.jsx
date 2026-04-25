import React from 'react';
import { Box, useTheme, alpha } from '@mui/material';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import Footer from '../MyWebsite/Footer';

/**
 * PageContainer Component
 * 
 * This component provides a consistent layout structure for all pages.
 * It includes the Navbar, a main content area with standard styling,
 * and the Footer.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Page content
 * @param {boolean} props.noPadding - If true, removes default padding
 * @param {Object} props.sx - Additional styles for the main content container
 * @param {boolean} props.hasPatternBackground - If true, adds a decorative pattern background
 */
const PageContainer = ({ 
  children, 
  noPadding = false,
  sx = {},
  hasPatternBackground = true
}) => {
  const theme = useTheme();

  // Page animation variants
  const pageVariants = {
    initial: {
      opacity: 0
    },
    in: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <>
      <Navbar title="CareShare" />
      
      <Box
        component={motion.div}
        initial="initial"
        animate="in"
        exit="exit"
        variants={pageVariants}
        sx={{
          minHeight: '100vh',
          pt: noPadding ? 0 : 6,
          pb: noPadding ? 0 : 8,
          ...(hasPatternBackground && {
            backgroundColor: alpha(theme.palette.primary.main, 0.02),
            backgroundImage: `radial-gradient(${alpha(theme.palette.primary.main, 0.05)} 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: -100,
              right: -100,
              width: 300,
              height: 300,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.primary.main, 0)} 70%)`,
              zIndex: 0,
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -100,
              left: -100,
              width: 300,
              height: 300,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.06)} 0%, ${alpha(theme.palette.secondary.main, 0)} 70%)`,
              zIndex: 0,
            }
          }),
          ...sx
        }}
      >
        {children}
      </Box>
      
      <Footer />
    </>
  );
};

export default PageContainer; 