import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Avatar,
  Divider,
  Card,
  CardContent,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from '@mui/lab';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import {
  Healing as HealingIcon,
  Volunteer as VolunteerIcon,
  Timeline as TimelineIcon,
  People as PeopleIcon,
  FavoriteBorder as FavoriteIcon,
  SupervisedUserCircle as SupervisedUserCircleIcon,
  Lightbulb as LightbulbIcon,
} from '@mui/icons-material';
import Navbar from '../components/Navbar';
import Footer from './Footer';

// Custom styled components
const HeroSection = styled(Box)(({ theme }) => ({
  background: `linear-gradient(rgba(38, 70, 83, 0.8), rgba(42, 157, 143, 0.7)), url('/medine/do8.jpg')`,
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

const SectionTitle = styled(Typography)(({ theme }) => ({
  position: 'relative',
  display: 'inline-block',
  marginBottom: theme.spacing(1),
  fontWeight: 700,
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -10,
    left: 0,
    width: 80,
    height: 4,
    backgroundColor: theme.palette.secondary.main,
    borderRadius: 2,
  },
}));

const TeamMemberCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease',
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden',
  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
  },
}));

const ValueCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  borderRadius: theme.shape.borderRadius * 2,
  transition: 'all 0.3s ease',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8],
  },
}));

// Container animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
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
    },
  },
};

const About = () => {
  const theme = useTheme();
  
  // Team members data
  const teamMembers = [
    {
      name: 'Mustafa Sharif',
      role: 'Team Leader',
      image: '/medine/volunteer3.jpg',
      bio: ' ',
    },
    {
      name: 'Rehma Warsi',
      role: 'Member 1',
      image: '/medine/volunteer.jpg',
      bio: ' ',
    },
    {
      name: 'Muhammad Asim',
      role: 'Member 2',
      image: '/medine/volunteer4.jpeg',
      bio: ' ',
    },
    {
      name: 'Syed Arhum Hussain',
      role: 'Member 3',
      image: '/medine/volunteer2.png',
      bio: ' ',
    },
  ];
  
  // Core values data
  const coreValues = [
    {
      title: 'Compassion',
      icon: <FavoriteIcon fontSize="large" color="secondary" />,
      description: 'We operate with empathy and understanding for both donors and recipients.',
    },
    {
      title: 'Integrity',
      icon: <SupervisedUserCircleIcon fontSize="large" color="primary" />,
      description: 'We maintain ethical standards and transparency in all our processes.',
    },
    {
      title: 'Innovation',
      icon: <LightbulbIcon fontSize="large" color="warning" />,
      description: 'We constantly seek new ways to improve healthcare accessibility and reduce waste.',
    },
    {
      title: 'Community',
      icon: <PeopleIcon fontSize="large" color="info" />,
      description: 'We build meaningful connections between donors and recipients for a healthier Pakistan.',
    },
  ];
  
  // Timeline events
  const timelineEvents = [
    {
      year: '2018',
      title: 'The Idea is Born',
      description: 'CareShare begins as a student project at a local university, aiming to reduce medicine waste.',
    },
    {
      year: '2019',
      title: 'First Collection Drive',
      description: 'Our team organizes the first medicine collection event in Karachi, gathering over 500 medicines.',
    },
    {
      year: '2020',
      title: 'Digital Platform Launch',
      description: 'The CareShare online platform is launched, connecting donors and recipients across Pakistan.',
    },
    {
      year: '2021',
      title: 'Nationwide Expansion',
      description: 'CareShare expands to five major cities with local medicine collection points.',
    },
    {
      year: '2023',
      title: 'Technology Upgrade',
      description: 'Introduction of our redesigned platform with enhanced features for better user experience.',
    },
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
              About CareShare
            </Typography>
            <Typography variant="h5" sx={{ maxWidth: 800, mx: 'auto', mb: 4, opacity: 0.9 }}>
              Connecting medicine donors with those in need for a healthier Pakistan
            </Typography>
          </motion.div>
        </Container>
      </HeroSection>
      
      {/* Mission Section */}
      <Box sx={{ py: 10 }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <Box 
                  component="img" 
                  src="/medine/medicine9.jpg" 
                  alt="Our Mission"
                  sx={{ 
                    width: '100%', 
                    borderRadius: 4, 
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                  }}
                />
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <SectionTitle variant="h3" gutterBottom>
                  Our Mission
                </SectionTitle>
                <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 3 }}>
                  CareShare is the leading online platform dedicated to unused medicine donation in Pakistan. We connect those with surplus medication to those in need, reducing waste and improving healthcare access across the country.
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  By eliminating the need to travel, individuals can effortlessly contribute to a healthier society. Browsing through our user-friendly interface, donors can select medicines they wish to donate, knowing they're making a meaningful difference.
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
            Join CareShare today and be a part of the movement that transforms healthcare accessibility in Pakistan. Your unused medicines can now find a purpose and make a significant impact on the lives of those who need it the most.
                </Typography>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* Vision Section - With Accent Background */}
      <Box sx={{ py: 10, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Box textAlign="center" mb={6}>
              <SectionTitle variant="h3" gutterBottom sx={{ '&::after': { left: 'calc(50% - 40px)' } }}>
                Our Vision
              </SectionTitle>
              <Typography 
                variant="h6" 
                color="text.secondary" 
                sx={{ maxWidth: 800, mx: 'auto', mb: 6 }}
              >
                We envision a Pakistan where everyone has access to essential medications, 
                regardless of their financial circumstances.
              </Typography>
            </Box>
          </motion.div>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Grid container spacing={4}>
              {coreValues.map((value, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <motion.div variants={itemVariants}>
                    <ValueCard elevation={3}>
                      <Box 
                        sx={{ 
                          width: 70, 
                          height: 70, 
                          borderRadius: '50%', 
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 2
                        }}
                      >
                        {value.icon}
                      </Box>
                      <Typography variant="h5" component="h3" gutterBottom fontWeight={600}>
                        {value.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {value.description}
                      </Typography>
                    </ValueCard>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>
      
      {/* Our Journey Timeline */}
      <Box sx={{ py: 10 }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Box textAlign="center" mb={6}>
              <SectionTitle variant="h3" gutterBottom sx={{ '&::after': { left: 'calc(50% - 40px)' } }}>
                Our Journey
              </SectionTitle>
              <Typography 
                variant="h6" 
                color="text.secondary" 
                sx={{ maxWidth: 800, mx: 'auto', mb: 6 }}
              >
                From a small idea to a nationwide platform, our journey has been focused on making medicine accessible to all.
              </Typography>
            </Box>
          </motion.div>
          
          <Timeline position="alternate">
            {timelineEvents.map((event, index) => (
              <TimelineItem key={index}>
                <TimelineOppositeContent color="text.secondary">
                  <Typography variant="h6" fontWeight="bold" color="primary.main">
                    {event.year}
                  </Typography>
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                  >
                    <TimelineDot color={index % 2 === 0 ? "primary" : "secondary"}>
                      <TimelineIcon />
                    </TimelineDot>
                  </motion.div>
                  {index < timelineEvents.length - 1 && <TimelineConnector />}
                </TimelineSeparator>
                <TimelineContent>
                  <motion.div
                    initial={{ opacity: 0, x: index % 2 === 0 ? 30 : -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                      <Typography variant="h6" component="h3" fontWeight="bold">
                        {event.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {event.description}
                      </Typography>
                    </Paper>
                  </motion.div>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </Container>
      </Box>
      
      {/* Team Section */}
      <Box sx={{ py: 10, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Box textAlign="center" mb={6}>
              <SectionTitle variant="h3" gutterBottom sx={{ '&::after': { left: 'calc(50% - 40px)' } }}>
                Our Team
              </SectionTitle>
              <Typography 
                variant="h6" 
                color="text.secondary" 
                sx={{ maxWidth: 800, mx: 'auto', mb: 6 }}
              >
                Meet the dedicated professionals working to make medicine donation accessible and efficient.
              </Typography>
            </Box>
          </motion.div>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Grid container spacing={4}>
              {teamMembers.map((member, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <motion.div variants={itemVariants}>
                    <TeamMemberCard>
                      <Box sx={{ position: 'relative', pt: '100%', overflow: 'hidden' }}>
                        <Avatar
                          src={member.image}
                          alt={member.name}
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            borderRadius: 0,
                          }}
                        />
                      </Box>
                      <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                        <Typography variant="h6" component="h3" gutterBottom fontWeight="bold">
                          {member.name}
                        </Typography>
                        <Typography variant="subtitle2" color="primary.main" gutterBottom>
                          {member.role}
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="body2" color="text.secondary">
                          {member.bio}
                        </Typography>
                      </CardContent>
                    </TeamMemberCard>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>
      
      <Footer />
    </>
  );
};

export default About;

