import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  CardActions, 
  Button, 
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { VolunteerActivism, Medication } from '@mui/icons-material';
import { Link } from 'react-router-dom';

// Custom styled card component with hover effects
const ServiceCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease',
  overflow: 'hidden',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
  '&:hover': {
    transform: 'translateY(-12px)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
    '& .MuiCardMedia-root': {
      transform: 'scale(1.05)',
    },
  },
}));

// Styled card media with transition
const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
  height: 220,
  transition: 'transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)',
}));

// Styled section container
const SectionContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(10),
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.down('md')]: {
    paddingTop: theme.spacing(6),
    paddingBottom: theme.spacing(6),
  },
}));

// Section title with accent
const SectionTitle = styled(Typography)(({ theme }) => ({
  position: 'relative',
  display: 'inline-block',
  marginBottom: theme.spacing(1),
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

const Cards = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  const theme = useTheme();

  useEffect(() => { 
    const clientToken = JSON.parse(localStorage.getItem('clientToken'));
    
    if (clientToken && clientToken.data) {
      setIsLoggedIn(true);
      setUserRole(clientToken.data);
    }
  }, []);

  // Card data
  const cardsData = [
    {
      title: 'Donate Medicines',
      description: 'Donate your unused medicines and make a meaningful impact. Your contribution can help someone in need access essential medication they otherwise couldn\'t afford. Join our community of donors and be part of the solution to medication accessibility in Pakistan.',
      image: '/medine/donate2.jpeg',
      buttonText: 'Donate Now',
      link: '/donate',
      icon: <VolunteerActivism fontSize="large" sx={{ color: theme.palette.secondary.main }} />,
      role: 'donor'
    },
    {
      title: 'Request Medicines',
      description: 'Access the medicines you need through our platform. Browse available donations, request medications, and get connected with donors. We ensure all medicines are verified for safety and quality. Our service is completely free to help alleviate financial burdens for those in need.',
      image: '/medine/deserving.jpg',
      buttonText: 'Find Medicines',
      link: '/medicines',
      icon: <Medication fontSize="large" sx={{ color: theme.palette.primary.main }} />,
      role: 'receipient'
    }
  ];

  return (
    <Box sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.03), py: 2 }}>
      <SectionContainer maxWidth="lg">
        <Box textAlign="center" mb={6}>
          <SectionTitle variant="h2" component="h2" gutterBottom>
            Our Services
          </SectionTitle>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 700, mx: 'auto', mb: 2 }}
          >
            CareShare connects those with excess medicines to those who need them,
            creating a community of care and support.
          </Typography>
          <Divider sx={{ width: 100, mx: 'auto', my: 3, borderColor: alpha(theme.palette.primary.main, 0.2) }} />
        </Box>

        <Grid container spacing={4} alignItems="stretch">
          {cardsData.map((card, index) => (
            <Grid item xs={12} md={6} key={index}>
              <ServiceCard>
                <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                  <StyledCardMedia
                    component="img"
                    image={card.image}
                    alt={card.title}
                  />
                  <Box 
                    sx={{ 
                      position: 'absolute', 
                      top: 20, 
                      left: 20, 
                      bgcolor: 'background.paper', 
                      borderRadius: '50%', 
                      p: 1,
                      boxShadow: 3
                    }}
                  >
                    {card.icon}
                  </Box>
                </Box>

                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Typography gutterBottom variant="h4" component="h3" fontWeight="600">
                    {card.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    {card.description}
                  </Typography>
                </CardContent>

                <CardActions sx={{ p: 3, pt: 0 }}>
                  {isLoggedIn && userRole === card.role ? (
                    <Button 
                      variant="contained" 
                      component={Link} 
                      to={card.link}
                      color={card.role === 'donor' ? 'secondary' : 'primary'}
                      size="large"
                      sx={{ 
                        borderRadius: 8,
                        px: 3
                      }}
                    >
                      {card.buttonText}
                    </Button>
                  ) : (
                    <Button 
                      variant="outlined" 
                      component={Link} 
                      to="/signin"
                      sx={{ 
                        borderRadius: 8,
                        px: 3
                      }}
                    >
                      Sign In to {card.role === 'donor' ? 'Donate' : 'Request'}
                    </Button>
                  )}
                </CardActions>
              </ServiceCard>
            </Grid>
          ))}
        </Grid>
      </SectionContainer>
    </Box>
  );
};

export default Cards;
