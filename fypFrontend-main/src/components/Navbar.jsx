import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  useScrollTrigger,
  Fade,
  useMediaQuery,
  alpha
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Info as InfoIcon,
  Healing as HealingIcon,
  Favorite as FavoriteIcon,
  ContactMail as ContactIcon,
  Login as LoginIcon,
  PersonAdd as SignUpIcon,
  Logout as LogoutIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  MedicalServices as MedicalServicesIcon
} from '@mui/icons-material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';

// Logo import (update path if needed)
import logo from '../images/logoMed.png';

// Scroll to top button component
function ScrollTop(props) {
  const { children } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event) => {
    const anchor = document.querySelector('#back-to-top-anchor');
    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <Fade in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1000 }}
      >
        {children}
      </Box>
    </Fade>
  );
}

const Navbar = ({ title = 'CareShare' }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Check authentication status
  useEffect(() => {
    const clientToken = JSON.parse(localStorage.getItem('clientToken'));
    const token = clientToken?.token;
    const role = clientToken?.data;
    
    if (token) {
      try {
        const decodedToken = decodeToken(token);
        const currentTime = Date.now() / 1000;
        
        if (decodedToken.exp > currentTime) {
          setIsLoggedIn(true);
          setUserRole(role);
        } else {
          setIsLoggedIn(false);
          localStorage.removeItem('clientToken');
        }
      } catch (error) {
        console.error('Error checking token:', error);
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, [location]);

  const decodeToken = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const decodedData = JSON.parse(atob(base64));
      return decodedData;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole('');
    localStorage.removeItem('clientToken');
    
    Swal.fire({
      title: "Success",
      text: "Logged out successfully.",
      icon: "success",
      confirmButtonColor: theme.palette.primary.main,
    });
    
    navigate('/signin');
    handleCloseUserMenu();
  };

  // Navigation items
  const navItems = [
    { name: 'Home', path: '/', icon: <HomeIcon /> },
    { name: 'About', path: '/about', icon: <InfoIcon /> },
    { name: 'Contact Us', path: '/contact', icon: <ContactIcon /> },
  ];

  // Role-based navigation items
  const roleBasedItems = isLoggedIn ? (
    userRole === 'donor' ? [
      { name: 'Donate Medicine', path: '/donate', icon: <FavoriteIcon /> }
    ] : userRole === 'receipient' ? [
      { name: 'Request Medicine', path: '/medicines', icon: <HealingIcon /> },
      { name: 'Available Medicines', path: '/available-medicines', icon: <MedicalServicesIcon /> }
    ] : []
  ) : [];

  // Combine navigation items
  const allNavItems = [...navItems, ...roleBasedItems];

  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { y: -10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  // Mobile drawer content
  const drawer = (
    <Box sx={{ width: 280 }} role="presentation" onClick={handleDrawerToggle}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        p: 3,
        background: `linear-gradient(to right, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.primary.light, 0.1)})`,
      }}>
        <Avatar 
          src={logo} 
          alt={title}
          sx={{ 
            width: 90, 
            height: 90, 
            mb: 2,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)'
            }
          }}
          variant="rounded"
        />
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 700, 
            color: theme.palette.primary.main,
            letterSpacing: '0.5px'
          }}
        >
          {title}
        </Typography>
      </Box>
      
      <Divider />
      
      <List sx={{ pt: 2, px: 2 }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {allNavItems.map((item) => (
            <motion.div key={item.name} variants={itemVariants}>
              <ListItem 
                button 
                component={Link} 
                to={item.path}
                selected={location.pathname === item.path}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  py: 1.2,
                  '&.Mui-selected': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.15),
                    },
                  },
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  }
                }}
              >
                <ListItemIcon sx={{ 
                  color: location.pathname === item.path ? theme.palette.primary.main : 'inherit',
                  minWidth: 40 
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.name} 
                  primaryTypographyProps={{ 
                    fontWeight: location.pathname === item.path ? 600 : 400
                  }}
                />
              </ListItem>
            </motion.div>
          ))}
        </motion.div>
      </List>
      
      <Divider sx={{ my: 2 }} />
      
      <List sx={{ px: 2 }}>
        {isLoggedIn ? (
          <ListItem 
            button 
            onClick={handleLogout}
            sx={{ 
              borderRadius: 2,
              py: 1.2,
              color: theme.palette.error.main,
              '&:hover': {
                backgroundColor: alpha(theme.palette.error.main, 0.05),
              }
            }}
          >
            <ListItemIcon sx={{ 
              color: theme.palette.error.main,
              minWidth: 40 
            }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Logout" 
              primaryTypographyProps={{ fontWeight: 500 }}
            />
          </ListItem>
        ) : (
          <>
            <ListItem 
              button 
              component={Link} 
              to="/signin"
              selected={location.pathname === '/signin'}
              sx={{ 
                borderRadius: 2, 
                mb: 1,
                py: 1.2,
                '&.Mui-selected': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.15),
                  },
                },
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.05),
                }
              }}
            >
              <ListItemIcon sx={{ 
                color: location.pathname === '/signin' ? theme.palette.primary.main : 'inherit',
                minWidth: 40 
              }}>
                <LoginIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Login" 
                primaryTypographyProps={{ 
                  fontWeight: location.pathname === '/signin' ? 600 : 400
                }}
              />
            </ListItem>
            
            <ListItem 
              button 
              component={Link} 
              to="/signup"
              selected={location.pathname === '/signup'}
              sx={{ 
                borderRadius: 2,
                py: 1.2,
                '&.Mui-selected': {
                  backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                  color: theme.palette.secondary.main,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.secondary.main, 0.15),
                  },
                },
                '&:hover': {
                  backgroundColor: alpha(theme.palette.secondary.main, 0.05),
                }
              }}
            >
              <ListItemIcon sx={{ 
                color: location.pathname === '/signup' ? theme.palette.secondary.main : 'inherit',
                minWidth: 40 
              }}>
                <SignUpIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Sign Up" 
                primaryTypographyProps={{ 
                  fontWeight: location.pathname === '/signup' ? 600 : 400
                }}
              />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        color="default" 
        elevation={0}
        sx={{
          borderBottom: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ py: 1 }}>
            {/* Mobile menu button */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ 
                mr: 2, 
                display: { md: 'none' },
                color: theme.palette.primary.main
              }}
            >
              <MenuIcon />
            </IconButton>
            
            {/* Logo and brand */}
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
              <Avatar
                src={logo}
                alt={title}
                variant="rounded"
                sx={{ 
                  width: { xs: 45, md: 55 }, 
                  height: { xs: 45, md: 55 },
                  mr: 1.5,
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
                  }
                }}
                component={Link}
                to="/"
              />
              <Typography
                variant="h5"
                noWrap
                component={Link}
                to="/"
                sx={{
                  fontWeight: 800,
                  letterSpacing: '.1rem',
                  color: theme.palette.primary.main,
                  textDecoration: 'none',
                  display: { xs: 'none', sm: 'flex' },
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    color: theme.palette.primary.dark,
                  }
                }}
              >
                {title}
              </Typography>
            </Box>

            {/* Desktop navigation */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                style={{ display: 'flex' }}
              >
                {allNavItems.map((item) => (
                  <motion.div key={item.name} variants={itemVariants}>
                    <Button
                      component={Link}
                      to={item.path}
                      startIcon={item.icon}
                      sx={{
                        mx: 0.7,
                        px: 2,
                        py: 1,
                        color: location.pathname === item.path ? theme.palette.primary.main : theme.palette.text.primary,
                        fontWeight: location.pathname === item.path ? 600 : 500,
                        position: 'relative',
                        overflow: 'hidden',
                        transition: 'color 0.2s ease',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          width: location.pathname === item.path ? '100%' : '0%',
                          height: '3px',
                          bottom: 0,
                          left: 0,
                          backgroundColor: theme.palette.primary.main,
                          transition: 'width 0.3s ease',
                          borderRadius: '3px 3px 0 0',
                        },
                        '&:hover': {
                          backgroundColor: 'transparent',
                          color: theme.palette.primary.main,
                        },
                        '&:hover::after': {
                          width: '100%',
                        }
                      }}
                    >
                      {item.name}
                    </Button>
                  </motion.div>
                ))}
              </motion.div>
            </Box>

            {/* Authentication buttons or user menu */}
            <Box sx={{ flexShrink: 0, display: { xs: 'none', md: 'flex' } }}>
              {isLoggedIn ? (
                <>
                  <Tooltip title="Account settings">
                    <IconButton 
                      onClick={handleOpenUserMenu} 
                      sx={{ 
                        p: 0.5, 
                        ml: 1,
                        border: '2px solid transparent',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: alpha(userRole === 'donor' ? theme.palette.secondary.main : theme.palette.primary.main, 0.1),
                          border: `2px solid ${userRole === 'donor' ? theme.palette.secondary.main : theme.palette.primary.main}`,
                        }
                      }}
                    >
                      <Avatar 
                        sx={{ 
                          bgcolor: userRole === 'donor' ? theme.palette.secondary.main : theme.palette.primary.main,
                          width: 40,
                          height: 40,
                          fontWeight: 'bold',
                          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                        }}
                      >
                        {userRole.charAt(0).toUpperCase()}
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{ 
                      mt: '45px',
                      '& .MuiPaper-root': {
                        borderRadius: 2,
                        boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
                        overflow: 'visible',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: -6,
                          right: 10,
                          width: 12,
                          height: 12,
                          bgcolor: 'background.paper',
                          transform: 'rotate(45deg)',
                          zIndex: 0,
                          boxShadow: '-3px -3px 5px rgba(0,0,0,0.04)',
                        },
                      }
                    }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >

                    <MenuItem 
                      onClick={handleLogout}
                      sx={{
                        py: 1.5,
                        px: 2.5,
                        borderRadius: 1,
                        mx: 0.5,
                        my: 0.5,
                        color: theme.palette.error.main,
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.error.main, 0.08),
                        }
                      }}
                    >
                      <ListItemIcon sx={{ color: theme.palette.error.main }}>
                        <LogoutIcon fontSize="small" />
                      </ListItemIcon>
                      <Typography>Logout</Typography>
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  style={{ display: 'flex' }}
                >
                  <motion.div variants={itemVariants}>
                    <Button
                      component={Link}
                      to="/signin"
                      startIcon={<LoginIcon />}
                      variant="outlined"
                      sx={{ 
                        mr: 2,
                        borderWidth: '2px',
                        borderRadius: '30px',
                        px: 2.5,
                        py: 0.8,
                        fontWeight: 600,
                        borderColor: theme.palette.primary.main,
                        color: theme.palette.primary.main,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderWidth: '2px',
                          backgroundColor: alpha(theme.palette.primary.main, 0.05),
                          transform: 'translateY(-3px)',
                          boxShadow: `0 6px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
                        }
                      }}
                    >
                      Login
                    </Button>
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <Button
                      component={Link}
                      to="/signup"
                      variant="contained"
                      startIcon={<SignUpIcon />}
                      sx={{ 
                        borderRadius: '30px',
                        px: 3,
                        py: 0.8,
                        fontWeight: 600,
                        boxShadow: `0 4px 10px ${alpha(theme.palette.secondary.main, 0.2)}`,
                        background: `linear-gradient(45deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.light} 100%)`,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-3px)',
                          boxShadow: `0 8px 15px ${alpha(theme.palette.secondary.main, 0.3)}`,
                        }
                      }}
                    >
                      Sign Up
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 280,
            boxShadow: '0 0 35px rgba(0,0,0,0.15)',
          },
        }}
      >
        {drawer}
      </Drawer>
      
      {/* Scroll to top button */}
      <ScrollTop>
        <Tooltip title="Scroll to top">
          <IconButton
            aria-label="scroll back to top"
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: 'white',
              boxShadow: '0 4px 15px rgba(42, 157, 143, 0.3)',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
                transform: 'translateY(-3px)',
                boxShadow: '0 6px 20px rgba(42, 157, 143, 0.4)',
              },
            }}
            size="large"
          >
            <KeyboardArrowUpIcon />
          </IconButton>
        </Tooltip>
      </ScrollTop>
      
      {/* Back to top anchor */}
      <div id="back-to-top-anchor" />
    </>
  );
};

export default Navbar; 