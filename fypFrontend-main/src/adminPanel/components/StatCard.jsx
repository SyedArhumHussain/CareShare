import React from 'react';
import { Box, Card, CardContent, Typography, IconButton, useTheme, useMediaQuery, Button } from '@mui/material';
import { motion } from 'framer-motion';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import CountUp from 'react-countup';
import { Link } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const StatCard = ({ 
  title, 
  count, 
  icon, 
  color = 'linear-gradient(135deg, #58869e 0%, #365b6f 100%)',
  changePercent = null,
  isPositive = true,
  delay = 0,
  link,
  subtitle
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: 'spring',
        stiffness: 70,
        damping: 15,
        delay 
      }}
      whileHover={{ 
        y: -6,
        transition: { type: 'spring', stiffness: 200, damping: 10 }
      }}
    >
      <Card 
        elevation={0}
        sx={{ 
          height: '100%',
          borderRadius: 4,
          overflow: 'hidden',
          position: 'relative',
          boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
          transition: 'all 0.3s ease',
          border: '1px solid rgba(255,255,255,0.6)',
          '&:hover': {
            boxShadow: '0 15px 50px rgba(0,0,0,0.12)',
          }
        }}
      >
        {/* Background gradient */}
        <Box 
          sx={{ 
            background: color,
            height: '100%',
            width: '100%',
            position: 'absolute',
            opacity: 1
          }}
        />
        
        {/* Decorative elements */}
        <Box 
          sx={{ 
            position: 'absolute',
            right: -30,
            top: -30,
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
            zIndex: 1
          }}
        />
        <Box 
          sx={{ 
            position: 'absolute',
            left: -20,
            bottom: -20,
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
            zIndex: 1
          }}
        />
        
        <CardContent 
          sx={{ 
            position: 'relative', 
            height: '100%', 
            p: { xs: 2.5, sm: 3 },
            zIndex: 2,
            '&:last-child': {
              paddingBottom: { xs: 2.5, sm: 3 }
            }
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography 
                variant="subtitle1" 
                component="div" 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.95)', 
                  fontWeight: 600, 
                  mb: 0.5,
                  fontSize: { xs: '0.9rem', sm: '1rem' } 
                }}
              >
                {title}
              </Typography>
              {subtitle && (
                <Typography
                  variant="caption"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.75)',
                    fontSize: '0.75rem',
                    display: 'block',
                    mb: 1
                  }}
                >
                  {subtitle}
                </Typography>
              )}
              <Typography 
                variant={isMobile ? "h4" : "h3"} 
                component="div" 
                sx={{ 
                  color: '#fff', 
                  fontWeight: 700,
                  lineHeight: 1.2,
                  letterSpacing: '-0.5px',
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                <CountUp 
                  delay={delay * 0.8} 
                  end={count} 
                  duration={2} 
                  separator="," 
                />
              </Typography>
              
              {changePercent !== null && (
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    mt: 1.5,
                    backgroundColor: isPositive ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    px: 1.2,
                    py: 0.5,
                    width: 'fit-content'
                  }}
                >
                  {isPositive ? (
                    <TrendingUpIcon sx={{ color: 'rgb(255, 255, 255)', fontSize: 16, mr: 0.5, opacity: 0.9 }} />
                  ) : (
                    <TrendingDownIcon sx={{ color: 'rgb(255, 255, 255)', fontSize: 16, mr: 0.5, opacity: 0.9 }} />
                  )}
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: 'rgb(255, 255, 255)',
                      fontWeight: 600,
                      opacity: 0.9
                    }}
                  >
                    {isPositive ? '+' : ''}{changePercent}%
                  </Typography>
                </Box>
              )}
              
              {link && (
                <Button
                  component={Link}
                  to={link}
                  variant="text"
                  size="small"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    mt: 2,
                    color: 'rgba(255, 255, 255, 0.85)',
                    fontWeight: 500,
                    fontSize: '0.8rem',
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      color: '#fff'
                    },
                    padding: '4px 10px',
                    minWidth: 'auto'
                  }}
                >
                  View details
                </Button>
              )}
            </Box>

            <Box 
              sx={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.15)', 
                borderRadius: '50%', 
                p: { xs: 1.2, sm: 1.5 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
              }}
            >
              {React.cloneElement(icon, { 
                sx: { 
                  fontSize: { xs: 28, sm: 34 },
                  color: '#fff'
                } 
              })}
            </Box>
          </Box>
          
          {!isMobile && (
            <Box sx={{ position: 'absolute', bottom: 16, right: 16 }}>
              <IconButton 
                size="small" 
                sx={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  color: '#fff'
                }}
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatCard; 