import * as React from 'react';
import { styled, alpha, useTheme } from '@mui/material/styles';
import MuiAppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MoreIcon from '@mui/icons-material/MoreVert';
import { useAppStore } from '../appStore';
import Button from '@mui/material/Button';
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { motion } from 'framer-motion';
import useMediaQuery from '@mui/material/useMediaQuery';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import { Divider } from '@mui/material';

const AppBar = styled(MuiAppBar, {
})(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
  background: 'linear-gradient(90deg, #58869e 0%, #365b6f 100%)',
}));

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: '50px',
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
  backdropFilter: 'blur(4px)',
  border: '1px solid rgba(255, 255, 255, 0.15)'
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('md')]: {
      width: '25ch',
    },
    fontSize: '0.9rem'
  },
}));

export default function Navbar() {
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [profileAnchor, setProfileAnchor] = React.useState(null);
  const navigate = useNavigate();
  const updateOpen = useAppStore((state) => state.updateOpen)
  const dopen = useAppStore((state) => state.dopen)
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const isProfileMenuOpen = Boolean(profileAnchor);

  const handleLogout = () => {
    // Clear token from localStorage and update isLoggedIn state
    localStorage.removeItem('clientToken');
    Swal.fire({
      title: "Successful",
      text: "Logged out successfully.",
      icon: "success",
      confirmButtonColor: "#0875b8",
    });
    navigate('/signin')
  };

  const handleProfileMenuOpen = (event) => {
    setProfileAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleProfileMenuClose = () => {
    setProfileAnchor(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const mobileMenuId = 'primary-search-account-menu-mobile';

  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
      PaperProps={{
        elevation: 3,
        sx: {
          mt: 1.5,
          overflow: 'visible',
          borderRadius: 2,
          '&:before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: 'background.paper',
            transform: 'translateY(-50%) rotate(45deg)',
            zIndex: 0,
          },
        },
      }}
    >
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <Avatar 
            sx={{ 
              width: 36, 
              height: 36,
              bgcolor: '#fff', 
              color: '#58869e',
              fontWeight: 'bold',
              boxShadow: '0 0 0 2px rgba(255, 255, 255, 0.2)',
            }}
          >
            A
          </Avatar>
        </IconButton>
        <p>Profile</p>
      </MenuItem>
      <MenuItem onClick={handleLogout}>
        <IconButton
          size="large"
          color="inherit"
        >
          <LogoutIcon sx={{ color: theme.palette.error.main }} />
        </IconButton>
        <Typography sx={{ color: theme.palette.error.main }}>Logout</Typography>
      </MenuItem>
    </Menu>
  );
  
  const profileMenu = (
    <Menu
      anchorEl={profileAnchor}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      id="profile-menu"
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isProfileMenuOpen}
      onClose={handleProfileMenuClose}
      PaperProps={{
        elevation: 3,
        sx: {
          minWidth: 220,
          mt: 1.5,
          overflow: 'visible',
          borderRadius: 2,
          '&:before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: 'background.paper',
            transform: 'translateY(-50%) rotate(45deg)',
            zIndex: 0,
          },
        },
      }}
    >
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
        <Typography variant="subtitle1" fontWeight={600}>Admin</Typography>
        <Typography variant="body2" color="text.secondary">admin@careshare.com</Typography>
      </Box>
      <MenuItem 
        onClick={handleLogout}
        sx={{ 
          py: 1.5,
          color: theme.palette.error.main
        }}
      >
        <LogoutIcon sx={{ mr: 2, fontSize: 20 }}/>
        Logout
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" elevation={0} 
        sx={{ 
          background: 'linear-gradient(90deg, #58869e 0%, #365b6f 100%)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ 
              mr: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                transform: 'scale(1.05)',
              },
              transition: 'all 0.2s ease',
            }}
            onClick={()=>updateOpen(!dopen)}
          >
            <MenuIcon />
          </IconButton>
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <MedicalServicesIcon sx={{ mr: 1, fontSize: 28 }} />
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ 
                  display: { xs: 'none', sm: 'block' },
                  fontWeight: 700,
                  letterSpacing: '0.5px',
                  fontSize: '1.2rem',
                  color: '#fff',
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                CareShare Admin
              </Typography>
            </Box>
          </motion.div>
          
          {!isMobile && (
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
              />
            </Search>
          )}
          
          <Box sx={{ flexGrow: 1 }} />
          
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
            <Box component="span">
              <Tooltip title="Dashboard">
                <IconButton 
                  size="medium"
                  sx={{ 
                    mr: 1, 
                    color: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    '&:hover': { 
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    },
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => navigate('/admin')}
                >
                  <DashboardIcon />
                </IconButton>
              </Tooltip>
            </Box>
            
            <Box 
              onClick={handleProfileMenuOpen}
              sx={{ 
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '6px 12px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                },
              }}
            >
              <Avatar 
                sx={{ 
                  bgcolor: '#fff', 
                  color: '#58869e',
                  width: 36, 
                  height: 36,
                  mr: 1,
                  fontWeight: 'bold',
                  boxShadow: '0 0 0 2px rgba(255, 255, 255, 0.2)',
                }}
              >
                A
              </Avatar>
              {!isTablet && (
                <>
                  <Box sx={{ ml: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2, color: '#fff' }}>
                      Admin
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.9, lineHeight: 1.2, color: '#fff' }}>
                      Administrator
                    </Typography>
                  </Box>
                  <KeyboardArrowDownIcon sx={{ ml: 0.5, fontSize: 18, color: 'rgba(255,255,255,0.7)' }} />
                </>
              )}
            </Box>
          </Box>
          
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit" 
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)', 
                  transform: 'scale(1.05)',
                },
                transition: 'all 0.2s ease'
              }}
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {profileMenu}
    </Box>
  );
}