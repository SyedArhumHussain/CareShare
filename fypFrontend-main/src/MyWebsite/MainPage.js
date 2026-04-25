import React from 'react'
import Navbar from '../components/Navbar'
import { Box, Container, Typography, Button, Grid, Paper, Stack, Divider, useTheme, useMediaQuery, createTheme, ThemeProvider } from '@mui/material'
import { styled } from '@mui/material/styles'
import { 
  VolunteerActivism, 
  Healing, 
  AccessibilityNew, 
  LocalHospital, 
  ArrowForward, 
  CheckCircleOutline, 
  VerifiedUser,
  Security
} from '@mui/icons-material'
import Cards from './Cards'
import Carousel from './Carousel'
import Footer from './Footer'
import { motion } from 'framer-motion'

// Custom theme colors - CareShare brand palette
const careShareTheme = createTheme({
  palette: {
    primary: {
      main: '#2A9D8F',    // Teal - represents healthcare
    },
    secondary: {
      main: '#E76F51',    // Warm Orange - represents community
    },
    accent: {
      main: '#E9C46A',    // Soft Yellow - represents hope
    },
    background: {
      default: '#F8F9FA', // Light Gray - clean appearance
    },
    text: {
      primary: '#264653', // Dark Gray - readability
    },
    success: {
      main: '#83C5BE',    // Soft Green - positive feedback
    },
    error: {
      main: '#E63946',    // Subdued Red - alerts
    },
  },
});

// Theme-based custom components with proper MUI theming access
const HeroSection = styled(Box)(({ theme }) => ({
  background: `linear-gradient(rgba(38, 70, 83, 0.8), rgba(42, 157, 143, 0.7)), url('/medine/hero-bg.jpg')`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  color: 'white',
  padding: '120px 0 80px',
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
    padding: '100px 0 60px',
  },
}));

// Primary CTA button
const PrimaryCTA = styled(Button)(({ theme }) => ({
  background: theme.palette.secondary.main,
  color: 'white',
  padding: '12px 24px',
  borderRadius: '30px',
  fontWeight: '700',
  textTransform: 'none',
  fontSize: '16px',
  boxShadow: '0 4px 10px rgba(231, 111, 81, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: '#d05a3d',
    boxShadow: '0 6px 15px rgba(231, 111, 81, 0.4)',
    transform: 'translateY(-3px)'
  }
}));

// Secondary CTA button
const SecondaryCTA = styled(Button)(() => ({
  color: 'white',
  padding: '11px 24px',
  borderRadius: '30px',
  fontWeight: '600',
  textTransform: 'none',
  fontSize: '16px',
  border: '2px solid white',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    transform: 'translateY(-3px)'
  }
}));

// Impact statistic card with cohesive design
const StatCard = styled(Paper)(({ theme }) => ({
  padding: '24px',
  textAlign: 'center',
  borderRadius: '16px',
  backgroundColor: 'white',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
  transition: 'all 0.3s ease',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '6px',
    background: theme.palette.primary.main,
  },
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 15px 40px rgba(0, 0, 0, 0.12)',
  }
}));

// Section title with consistent styling
const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '2.5rem',
  fontWeight: 700,
  marginBottom: '16px',
  position: 'relative',
  display: 'inline-block',
  color: theme.palette.text.primary,
  [theme.breakpoints.down('sm')]: {
    fontSize: '2rem',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-10px',
    left: '0',
    width: '60px',
    height: '4px',
    background: theme.palette.primary.main,
    borderRadius: '2px',
  }
}));

// How it works step card
const StepCard = styled(Paper)(() => ({
  padding: '32px 24px',
  borderRadius: '16px',
  height: '100%',
  background: 'white',
  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.05)',
  transition: 'all 0.3s ease',
  position: 'relative',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.1)',
  }
}));

// Feature card highlighting platform benefits
const FeatureCard = styled(Paper)(() => ({
  padding: '24px',
  borderRadius: '16px',
  height: '100%',
  background: 'white',
  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.05)',
  transition: 'all 0.3s ease',
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 25px rgba(0, 0, 0, 0.08)',
  }
}));

// Icon container with consistent styling
const IconContainer = styled(Box)(({ bgcolor }) => ({
  width: '64px',
  height: '64px',
  borderRadius: '50%',
  backgroundColor: bgcolor || 'rgba(42, 157, 143, 0.1)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '16px',
}));

const MainPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Statistics data reflecting community impact
  const stats = [
    { 
      value: '2,500+', 
      label: 'Medicines Donated', 
      icon: <VolunteerActivism sx={{ fontSize: 40, color: theme.palette.secondary.main }} />,
      color: 'rgba(231, 111, 81, 0.1)'
    },
    { 
      value: '1,800+', 
      label: 'People Helped', 
      icon: <AccessibilityNew sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      color: 'rgba(42, 157, 143, 0.1)'
    },
    { 
      value: '85+', 
      label: 'Medicine Types', 
      icon: <LocalHospital sx={{ fontSize: 40, color: '#E9C46A' }} />,
      color: 'rgba(233, 196, 106, 0.1)'
    },
    { 
      value: '12', 
      label: 'Cities Covered', 
      icon: <Healing sx={{ fontSize: 40, color: theme.palette.text.primary }} />,
      color: 'rgba(38, 70, 83, 0.1)'
    },
  ];

  // How the platform works - steps
  const howItWorks = [
    {
      title: 'Register',
      description: 'Create a free account as a donor or recipient. Verification ensures safety and trust for all users.',
      icon: <VerifiedUser sx={{ fontSize: 30, color: theme.palette.primary.main }} />
    },
    {
      title: 'List or Browse',
      description: 'Donors can list unused medicines, while recipients can search for needed medications.',
      icon: <LocalHospital sx={{ fontSize: 30, color: theme.palette.secondary.main }} />
    },
    {
      title: 'Connect Securely',
      description: 'Our platform facilitates safe communication between donors and recipients.',
      icon: <Security sx={{ fontSize: 30, color: '#E9C46A' }} />
    },
    {
      title: 'Complete Exchange',
      description: 'Finalize the medicine exchange with our guided process ensuring satisfaction for both parties.',
      icon: <CheckCircleOutline sx={{ fontSize: 30, color: theme.palette.text.primary }} />
    }
  ];

  // Key features/benefits
  const features = [
    {
      title: 'Quality Verification',
      description: 'All medicines undergo verification for expiry date and condition before being listed.',
      icon: <VerifiedUser sx={{ fontSize: 36, color: theme.palette.primary.main }} />
    },
    {
      title: 'Secure Exchange',
      description: 'Our platform ensures safe and private exchanges between donors and recipients.',
      icon: <Security sx={{ fontSize: 36, color: theme.palette.secondary.main }} />
    },
    {
      title: 'Community Support',
      description: 'Join a growing community committed to reducing medicine waste and helping those in need.',
      icon: <VolunteerActivism sx={{ fontSize: 36, color: '#E9C46A' }} />
    }
  ];

  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <ThemeProvider theme={careShareTheme}>
      <Box sx={{ background: theme.palette.background.default }}>
        <Navbar title="CareShare" />
        
        {/* Hero Section */}
        <HeroSection>
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
            <Grid container spacing={6} alignItems="center">
              <Grid item xs={12} md={7}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                >
                  <Typography 
                    variant="h1" 
                    component="h1"
                    sx={{ 
                      fontWeight: 800,
                      fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
                      lineHeight: 1.2,
                      mb: 2,
                      letterSpacing: '-0.5px'
                    }}
                  >
                    Share Medicines, <br />
                    <Typography 
                      component="span" 
                      variant="h1"
                      sx={{ 
                        fontWeight: 800, 
                        fontSize: 'inherit',
                        color: '#E9C46A',
                        textShadow: '1px 1px 3px rgba(0,0,0,0.2)'
                      }}
                    >
                      Save Lives
                    </Typography>
                  </Typography>
                  
                  <Typography 
                    variant="h6"
                    sx={{ 
                      fontWeight: 400,
                      fontSize: { xs: '1rem', md: '1.1rem' },
                      lineHeight: 1.6,
                      mb: 4,
                      maxWidth: '600px',
                      color: 'rgba(255, 255, 255, 0.9)'
                    }}
                  >
                    CareShare connects medicine donors with recipients in need, reducing waste and
                    improving healthcare access. Our secure platform makes sharing unused medicines 
                    safe, easy, and impactful.
                  </Typography>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    <Stack 
                      direction={{ xs: 'column', sm: 'row' }} 
                      spacing={{ xs: 2, sm: 3 }}
                    >
                      <PrimaryCTA 
                        endIcon={<ArrowForward />}
                        href="/donate"
                      >
                        Donate Medicines
                      </PrimaryCTA>
                      <SecondaryCTA 
                        variant="outlined"
                        href="/available-medicines"
                      >
                        Find Medicines
                      </SecondaryCTA>
                    </Stack>
                  </motion.div>
                </motion.div>
              </Grid>
              
              <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <Grid container spacing={3}>
                    {stats.map((stat, index) => (
                      <Grid item xs={6} key={index}>
                        <motion.div variants={itemVariants}>
                          <StatCard elevation={3}>
                            <Box 
                              sx={{ 
                                width: 70, 
                                height: 70, 
                                borderRadius: '50%', 
                                backgroundColor: stat.color,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mb: 2
                              }}
                            >
                              {stat.icon}
                            </Box>
                            <Typography 
                              variant="h4" 
                              component="div" 
                              sx={{ 
                                fontWeight: 700, 
                                mb: 1,
                                color: theme.palette.text.primary
                              }}
                            >
                              {stat.value}
                            </Typography>
                            <Typography 
                              variant="body1" 
                              sx={{ 
                                fontWeight: 500,
                                color: 'rgba(38, 70, 83, 0.8)'
                              }}
                            >
                              {stat.label}
                            </Typography>
                          </StatCard>
                        </motion.div>
                      </Grid>
                    ))}
                  </Grid>
                </motion.div>
              </Grid>
            </Grid>
          </Container>
        </HeroSection>
        
        {/* Stats Section for Mobile Only */}
        <Box 
          sx={{ 
            py: 6, 
            px: 2, 
            display: { xs: 'block', md: 'none' },
            background: 'white'
          }}
        >
          <Container>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <Grid container spacing={3}>
                {stats.map((stat, index) => (
                  <Grid item xs={6} key={index}>
                    <motion.div variants={itemVariants}>
                      <StatCard elevation={2}>
                        <Box 
                          sx={{ 
                            width: 60, 
                            height: 60, 
                            borderRadius: '50%', 
                            backgroundColor: stat.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 2
                          }}
                        >
                          {React.cloneElement(stat.icon, { sx: { fontSize: 30 } })}
                        </Box>
                        <Typography 
                          variant="h5" 
                          component="div" 
                          sx={{ 
                            fontWeight: 700, 
                            mb: 1,
                            color: theme.palette.text.primary
                          }}
                        >
                          {stat.value}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 500,
                            color: 'rgba(38, 70, 83, 0.8)'
                          }}
                        >
                          {stat.label}
                        </Typography>
                      </StatCard>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          </Container>
        </Box>
        
        {/* How It Works Section */}
        <Box sx={{ py: 8, background: 'white' }}>
          <Container>
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <SectionTitle variant="h2" component="h2" align="center">
                  How CareShare Works
                </SectionTitle>
                <Typography 
                  variant="h6" 
                  color="textSecondary"
                  sx={{ 
                    maxWidth: '700px', 
                    mx: 'auto', 
                    mt: 3,
                    color: 'rgba(38, 70, 83, 0.7)',
                    fontWeight: 400
                  }}
                >
                  Our platform makes medicine sharing simple, secure, and impactful through our
                  easy four-step process.
                </Typography>
              </motion.div>
            </Box>
            
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <Grid container spacing={4}>
                {howItWorks.map((step, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <motion.div variants={itemVariants}>
                      <StepCard elevation={2}>
                        <Box sx={{ position: 'relative', mb: 3 }}>
                          <IconContainer>
                            {step.icon}
                          </IconContainer>
                          <Typography 
                            sx={{ 
                              position: 'absolute',
                              top: -10,
                              right: 0,
                              width: 30,
                              height: 30,
                              borderRadius: '50%',
                              backgroundColor: theme.palette.primary.main,
                              color: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 700,
                              fontSize: '1rem'
                            }}
                          >
                            {index + 1}
                          </Typography>
                        </Box>
                        <Typography 
                          variant="h5" 
                          component="h3" 
                          gutterBottom
                          sx={{ 
                            fontWeight: 700, 
                            mb: 2,
                            color: theme.palette.text.primary
                          }}
                        >
                          {step.title}
                        </Typography>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            color: 'rgba(38, 70, 83, 0.7)', 
                            lineHeight: 1.6 
                          }}
                        >
                          {step.description}
                        </Typography>
                      </StepCard>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          </Container>
        </Box>
        
        {/* Features Section */}
        <Box 
          sx={{ 
            py: 8, 
            backgroundColor: 'rgba(42, 157, 143, 0.05)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: -50,
              right: -50,
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(42, 157, 143, 0.1) 0%, rgba(42, 157, 143, 0) 70%)'
            }}
          />
          
          <Container>
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <SectionTitle variant="h2" component="h2" align="center">
                  Why Choose CareShare
                </SectionTitle>
                <Typography 
                  variant="h6" 
                  color="textSecondary"
                  sx={{ 
                    maxWidth: '700px', 
                    mx: 'auto', 
                    mt: 3,
                    color: 'rgba(38, 70, 83, 0.7)',
                    fontWeight: 400
                  }}
                >
                  Our platform provides a safe, reliable way to share medicines with those who need them most.
                </Typography>
              </motion.div>
            </Box>
            
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <Grid container spacing={4}>
                {features.map((feature, index) => (
                  <Grid item xs={12} md={4} key={index}>
                    <motion.div variants={itemVariants}>
                      <FeatureCard elevation={2}>
                        <IconContainer bgcolor={`rgba(${index === 0 ? '42, 157, 143' : index === 1 ? '231, 111, 81' : '233, 196, 106'}, 0.1)`}>
                          {feature.icon}
                        </IconContainer>
                        <Typography 
                          variant="h5" 
                          component="h3" 
                          gutterBottom
                          sx={{ 
                            fontWeight: 700, 
                            mb: 2,
                            color: theme.palette.text.primary
                          }}
                        >
                          {feature.title}
                        </Typography>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            color: 'rgba(38, 70, 83, 0.7)', 
                            lineHeight: 1.6,
                            mb: 2
                          }}
                        >
                          {feature.description}
                        </Typography>
                      </FeatureCard>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
            
            <Box 
              sx={{ 
                textAlign: 'center',
                mt: 6
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Button
                  variant="contained"
                  size="large"
                  href="/signup"
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: 'white',
                    padding: '12px 30px',
                    borderRadius: '30px',
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '16px',
                    boxShadow: '0 4px 15px rgba(42, 157, 143, 0.3)',
                    '&:hover': {
                      backgroundColor: '#228a7d',
                      boxShadow: '0 6px 20px rgba(42, 157, 143, 0.4)',
                    }
                  }}
                >
                  Join Our Community
                </Button>
              </motion.div>
            </Box>
          </Container>
        </Box>
        
        {/* Services cards section (using the existing Cards component) */}
        <Cards/>
        
        {/* Testimonials section (using the existing Carousel component) */}
        <Carousel/>
        
        <Footer/>
      </Box>
    </ThemeProvider>
  )
}

export default MainPage
