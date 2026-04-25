import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../appStore';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import PeopleIcon from '@mui/icons-material/People';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import '../Dash.css';
import ChatIcon from '@mui/icons-material/Chat';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ReceiptIcon from '@mui/icons-material/Receipt';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { Typography, Badge, Tooltip, useMediaQuery, Avatar } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { motion } from 'framer-motion';

const drawerWidth = 260;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  backgroundColor: '#ffffff',
  borderRight: '1px solid rgba(0, 0, 0, 0.05)',
  boxShadow: '0 6px 18px rgba(0, 0, 0, 0.06)',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
  backgroundColor: '#ffffff',
  borderRight: '1px solid rgba(0, 0, 0, 0.05)',
  boxShadow: '0 6px 18px rgba(0, 0, 0, 0.06)',
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

export default function Sidenav() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const open = useAppStore((state) => state.dopen);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Animation variants for drawer items
  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        type: 'spring',
        stiffness: 100,
        damping: 15 
      }
    }
  };

  // Define menu categories
  const menuCategories = [
    {
      title: "Overview",
      items: [
        { 
          text: "Dashboard", 
          icon: <HomeIcon />, 
          path: "/admin"
        }
      ]
    },
    {
      title: "Inventory",
      items: [
        { 
          text: "Medicines", 
          icon: <MedicalServicesIcon />, 
          path: "/allMedicine"
        },
        { 
          text: "Medicine Requests", 
          icon: <ReceiptIcon />, 
          path: "/medicinerequest"
        }
      ]
    },
    {
      title: "Users",
      items: [
        { 
          text: "Donors", 
          icon: <PeopleIcon />, 
          path: "/donors"
        },
        { 
          text: "Recipients", 
          icon: <EmojiPeopleIcon />, 
          path: "/recipients"
        },
        { 
          text: "User Feedback", 
          icon: <ChatIcon />, 
          path: "/feedback"
        }
      ]
    }
  ];

  return (
    <>
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Box height={30}/>
      <Drawer 
        variant="permanent" 
        open={open}
      >
        <DrawerHeader sx={{ 
          backgroundColor: 'rgba(88, 134, 158, 0.02)',
          display: 'flex',
          justifyContent: open ? 'space-between' : 'center',
          padding: '16px 8px',
          borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
        }}>
          {open && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              style={{ display: 'flex', alignItems: 'center', marginLeft: '8px' }}
            >
              <Avatar 
                sx={{ 
                  bgcolor: 'rgba(88, 134, 158, 0.1)', 
                  color: '#58869e', 
                  width: 40, 
                  height: 40, 
                  mr: 1.5,
                  boxShadow: '0 2px 10px rgba(88, 134, 158, 0.15)' 
                }}
              >
                <AdminPanelSettingsIcon sx={{ fontSize: 22 }} />
              </Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight="700" color="#365b6f">
                  CareShare
                </Typography>
                <Typography variant="caption" sx={{ color: '#637381' }}>
                  Admin Portal
                </Typography>
              </Box>
            </motion.div>
          )}
          <IconButton
            onClick={() => useAppStore.getState().updateOpen(!open)}
            sx={{
              backgroundColor: 'rgba(88, 134, 158, 0.1)',
              '&:hover': {
                backgroundColor: 'rgba(88, 134, 158, 0.2)',
                transform: 'scale(1.05)',
              },
              transition: 'all 0.2s ease',
              color: '#58869e',
              width: 30,
              height: 30
            }}
          >
            {theme.direction === 'rtl' ? <ChevronRightIcon fontSize="small" /> : <ChevronLeftIcon fontSize="small" />}
          </IconButton>
        </DrawerHeader>
        <Box 
          sx={{ 
            mt: 1, 
            overflowY: 'auto',
            height: 'calc(100vh - 80px)',
            '&::-webkit-scrollbar': {
              width: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0,0,0,0.1)',
              borderRadius: '10px',
            },
            pb: 2
          }}
        >
          {menuCategories.map((category, categoryIndex) => (
            <React.Fragment key={`category-${categoryIndex}`}>
              {open && (
                <Typography
                  variant="caption"
                  sx={{
                    px: 3,
                    mt: categoryIndex > 0 ? 3 : 1,
                    mb: 1,
                    display: 'block',
                    color: '#637381',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    fontSize: '0.7rem',
                    letterSpacing: '0.5px'
                  }}
                >
                  {category.title}
                </Typography>
              )}
              
              <List sx={{ px: 2 }}>
                {category.items.map((item, index) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <motion.div
                      key={item.text}
                      initial="hidden"
                      animate="visible"
                      variants={itemVariants}
                      transition={{ delay: index * 0.1 }}
                    >
                      <ListItem 
                        disablePadding 
                        sx={{ 
                          display: 'block',
                          mb: 0.8,
                        }} 
                        onClick={() => {navigate(item.path)}}
                      >
                        <Tooltip 
                          title={!open ? item.text : ""} 
                          placement="right"
                          arrow
                        >
                          <ListItemButton
                            sx={{
                              minHeight: 48,
                              justifyContent: open ? 'initial' : 'center',
                              px: 2.5,
                              borderRadius: '10px',
                              position: 'relative',
                              backgroundColor: isActive ? 'rgba(88, 134, 158, 0.12)' : 'transparent',
                              '&:hover': {
                                backgroundColor: isActive ? 'rgba(88, 134, 158, 0.16)' : 'rgba(88, 134, 158, 0.08)',
                                transform: 'translateY(-2px)',
                                transition: 'transform 0.2s ease'
                              },
                              transition: 'all 0.2s ease',
                              '&::before': isActive ? {
                                content: '""',
                                position: 'absolute',
                                left: 0,
                                top: '25%',
                                height: '50%',
                                width: '4px',
                                backgroundColor: '#58869e',
                                borderRadius: '0 4px 4px 0'
                              } : {}
                            }}
                          >
                            <ListItemIcon
                              sx={{
                                minWidth: 0,
                                mr: open ? 3 : 'auto',
                                justifyContent: 'center',
                                color: isActive ? '#58869e' : '#637381',
                                transition: 'color 0.2s ease'
                              }}
                            >
                              {item.icon}
                            </ListItemIcon>
                            <ListItemText 
                              primary={
                                <Typography 
                                  variant="body2" 
                                  sx={{ 
                                    fontWeight: isActive ? 600 : 500,
                                    color: isActive ? '#333' : '#637381',
                                    transition: 'color 0.2s ease',
                                    fontSize: '0.9rem',
                                  }}
                                >
                                  {item.text}
                                </Typography>
                              } 
                              sx={{ 
                                opacity: open ? 1 : 0,
                                ml: 0.5
                              }} 
                            />
                          </ListItemButton>
                        </Tooltip>
                      </ListItem>
                    </motion.div>
                  );
                })}
              </List>
              
              {categoryIndex < menuCategories.length - 1 && open && (
                <Divider sx={{ mt: 1.5, opacity: 0.5, mx: 2 }} />
              )}
            </React.Fragment>
          ))}
        </Box>
      </Drawer>
    </Box>
    </>
  );
}
