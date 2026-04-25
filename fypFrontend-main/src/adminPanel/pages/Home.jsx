import React, { useState, useEffect } from 'react'
import Sidenav from '../components/Sidenav'
import Navbar from '../components/Navbar'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import '../Dash.css'
import NotFound from './NotFound404'
import axios from 'axios';
import CountUp from 'react-countup';
import MedicineList from './medicines/MedicineList';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import PeopleIcon from '@mui/icons-material/People';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import { motion } from 'framer-motion';
import { Divider, Paper, CircularProgress, useMediaQuery, useTheme, Button, Avatar, IconButton } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ChatIcon from '@mui/icons-material/Chat';
import ReportIcon from '@mui/icons-material/Report';
import { Link } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DashboardLayout from '../components/DashboardLayout';

const Home = () => {
    const [rows, setRows] = useState(0);
    const [rows1, setRows1] = useState(0);
    const [rows2, setRows2] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));
    
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                await Promise.all([
                    getProductDetails(),
                    getProductDetailsDonor(),
                    getMedicine()
                ]);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
        
        const clientToken = JSON.parse(localStorage.getItem('clientToken'));
        const token = clientToken?.data;
        if (token) {
            setIsLoggedIn(token);
        } else {
            setIsLoggedIn(false);
        }
    }, []);
    
    const getProductDetails = async () => {
        try {
            const response = await axios.get('http://localhost:4000/receipient');
            setRows(response?.data?.length || 0);
        } catch (error) {
            console.error(error);
        }
    };
    
    const getProductDetailsDonor = async () => {
        try {
            const response = await axios.get('http://localhost:4000/donor');
            setRows1(response?.data?.length || 0);
        } catch (error) {
            console.error(error);
        }
    };
    
    const getMedicine = async () => {
        try {
            const response = await axios.get('http://localhost:4000/askDonator');
            setRows2(response?.data?.database?.length || 0);
        } catch (error) {
            console.error(error);
        }
    };

    // Dashboard quick action items
    const quickActions = [
        {
            title: "Approve Medicine",
            icon: <MedicalServicesIcon sx={{ color: '#4CAF50' }}/>,
            link: "/allMedicine",
            color: "rgba(76, 175, 80, 0.1)"
        },
        {
            title: "Manage Donations",
            icon: <ReceiptIcon sx={{ color: '#58869e' }}/>,
            link: "/medicinerequest",
            color: "rgba(88, 134, 158, 0.1)"
        },
        {
            title: "View Feedback",
            icon: <ChatIcon sx={{ color: '#9C27B0' }}/>,
            link: "/feedback",
            color: "rgba(156, 39, 176, 0.1)"
        }
    ];

    const breadcrumbs = [
        { label: 'Dashboard', link: '/admin' }
    ];

    return (
        <>
            {isLoggedIn === 'admin' ? (
                <DashboardLayout 
                    title="Dashboard"
                    description="Welcome to the CareShare admin panel. Here's an overview of your platform's key metrics and latest activity."
                    breadcrumbs={breadcrumbs}
                    isLoggedIn={isLoggedIn}
                >
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
                            <CircularProgress sx={{ color: '#58869e' }} />
                        </Box>
                    ) : (
                        <>
                            {/* Stats Cards */}
                            <Grid container spacing={3} sx={{ mb: 4 }}>
                                <Grid item xs={12} md={4}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <Card 
                                            sx={{ 
                                                height: '100%',
                                                borderRadius: 4,
                                                overflow: 'hidden',
                                                position: 'relative',
                                                boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                                                transition: 'all 0.3s ease',
                                                border: '1px solid rgba(255,255,255,0.6)',
                                                '&:hover': {
                                                    transform: 'translateY(-5px)',
                                                    boxShadow: '0 15px 35px rgba(0,0,0,0.12)'
                                                }
                                            }}
                                        >
                                            <Box sx={{ 
                                                background: 'linear-gradient(135deg, #58869e 0%, #365b6f 100%)',
                                                height: '100%',
                                                width: '100%',
                                                position: 'absolute'
                                            }}/>
                                            
                                            {/* Decorative elements */}
                                            <Box sx={{ 
                                                position: 'absolute',
                                                right: -30,
                                                top: -30,
                                                width: 120,
                                                height: 120,
                                                borderRadius: '50%',
                                                background: 'rgba(255,255,255,0.1)',
                                                zIndex: 1
                                            }}/>
                                            
                                            <CardContent sx={{ 
                                                position: 'relative', 
                                                height: '100%', 
                                                p: { xs: 2.5, sm: 3 },
                                                zIndex: 2
                                            }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                    <Box>
                                                        <Typography variant="h6" component="div" sx={{ color: '#fff', fontWeight: 600, mb: 0.5 }}>
                                                            Total Medicines
                                                        </Typography>
                                                        <Typography variant="h3" component="div" sx={{ 
                                                            color: '#fff', 
                                                            fontWeight: 700,
                                                            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                        }}>
                                                            <CountUp delay={0.2} end={rows2} duration={1.5} />
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ 
                                                        backgroundColor: 'rgba(255, 255, 255, 0.15)', 
                                                        borderRadius: '12px', 
                                                        p: 1.5,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                                    }}>
                                                        <MedicalServicesIcon sx={{ fontSize: 30, color: '#fff' }} />
                                                    </Box>
                                                </Box>
                                                
                                                <Button 
                                                    component={Link} 
                                                    to="/allMedicine"
                                                    variant="text" 
                                                    sx={{ 
                                                        mt: 2, 
                                                        color: 'rgba(255,255,255,0.9)',
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(255,255,255,0.1)',
                                                        },
                                                        fontSize: '0.875rem',
                                                        fontWeight: 500,
                                                        textTransform: 'none'
                                                    }}
                                                >
                                                    View details
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </Grid>
                                
                                <Grid item xs={12} md={4}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1, duration: 0.5 }}
                                    >
                                        <Card 
                                            sx={{ 
                                                height: '100%',
                                                borderRadius: 4,
                                                overflow: 'hidden',
                                                position: 'relative',
                                                boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                                                transition: 'all 0.3s ease',
                                                border: '1px solid rgba(255,255,255,0.6)',
                                                '&:hover': {
                                                    transform: 'translateY(-5px)',
                                                    boxShadow: '0 15px 35px rgba(0,0,0,0.12)'
                                                }
                                            }}
                                        >
                                            <Box sx={{ 
                                                background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
                                                height: '100%',
                                                width: '100%',
                                                position: 'absolute'
                                            }}/>
                                            
                                            {/* Decorative elements */}
                                            <Box sx={{ 
                                                position: 'absolute',
                                                right: -30,
                                                top: -30,
                                                width: 120,
                                                height: 120,
                                                borderRadius: '50%',
                                                background: 'rgba(255,255,255,0.1)',
                                                zIndex: 1
                                            }}/>
                                            
                                            <CardContent sx={{ 
                                                position: 'relative', 
                                                height: '100%', 
                                                p: { xs: 2.5, sm: 3 },
                                                zIndex: 2
                                            }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                    <Box>
                                                        <Typography variant="h6" component="div" sx={{ color: '#fff', fontWeight: 600, mb: 0.5 }}>
                                                            Total Donors
                                                        </Typography>
                                                        <Typography variant="h3" component="div" sx={{ 
                                                            color: '#fff', 
                                                            fontWeight: 700,
                                                            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                        }}>
                                                            <CountUp delay={0.3} end={rows1} duration={1.5} />
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ 
                                                        backgroundColor: 'rgba(255, 255, 255, 0.15)', 
                                                        borderRadius: '12px', 
                                                        p: 1.5,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                                    }}>
                                                        <PeopleIcon sx={{ fontSize: 30, color: '#fff' }} />
                                                    </Box>
                                                </Box>
                                                
                                                <Button 
                                                    component={Link} 
                                                    to="/donors"
                                                    variant="text" 
                                                    sx={{ 
                                                        mt: 2, 
                                                        color: 'rgba(255,255,255,0.9)',
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(255,255,255,0.1)',
                                                        },
                                                        fontSize: '0.875rem',
                                                        fontWeight: 500,
                                                        textTransform: 'none'
                                                    }}
                                                >
                                                    View details
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </Grid>
                                
                                <Grid item xs={12} md={4}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2, duration: 0.5 }}
                                    >
                                        <Card 
                                            sx={{ 
                                                height: '100%',
                                                borderRadius: 4,
                                                overflow: 'hidden',
                                                position: 'relative',
                                                boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                                                transition: 'all 0.3s ease',
                                                border: '1px solid rgba(255,255,255,0.6)',
                                                '&:hover': {
                                                    transform: 'translateY(-5px)',
                                                    boxShadow: '0 15px 35px rgba(0,0,0,0.12)'
                                                }
                                            }}
                                        >
                                            <Box sx={{ 
                                                background: 'linear-gradient(135deg, #42A5F5 0%, #1976D2 100%)',
                                                height: '100%',
                                                width: '100%',
                                                position: 'absolute'
                                            }}/>
                                            
                                            {/* Decorative elements */}
                                            <Box sx={{ 
                                                position: 'absolute',
                                                right: -30,
                                                top: -30,
                                                width: 120,
                                                height: 120,
                                                borderRadius: '50%',
                                                background: 'rgba(255,255,255,0.1)',
                                                zIndex: 1
                                            }}/>
                                            
                                            <CardContent sx={{ 
                                                position: 'relative', 
                                                height: '100%', 
                                                p: { xs: 2.5, sm: 3 },
                                                zIndex: 2
                                            }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                    <Box>
                                                        <Typography variant="h6" component="div" sx={{ color: '#fff', fontWeight: 600, mb: 0.5 }}>
                                                            Total Recipients
                                                        </Typography>
                                                        <Typography variant="h3" component="div" sx={{ 
                                                            color: '#fff', 
                                                            fontWeight: 700,
                                                            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                        }}>
                                                            <CountUp delay={0.4} end={rows} duration={1.5} />
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ 
                                                        backgroundColor: 'rgba(255, 255, 255, 0.15)', 
                                                        borderRadius: '12px', 
                                                        p: 1.5,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                                    }}>
                                                        <EmojiPeopleIcon sx={{ fontSize: 30, color: '#fff' }} />
                                                    </Box>
                                                </Box>
                                                
                                                <Button 
                                                    component={Link} 
                                                    to="/recipients"
                                                    variant="text" 
                                                    sx={{ 
                                                        mt: 2, 
                                                        color: 'rgba(255,255,255,0.9)',
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(255,255,255,0.1)',
                                                        },
                                                        fontSize: '0.875rem',
                                                        fontWeight: 500,
                                                        textTransform: 'none'
                                                    }}
                                                >
                                                    View details
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </Grid>
                            </Grid>
                            
                            {/* Quick Actions and Recent Users */}
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6, duration: 0.5 }}
                                    >
                                        <Card sx={{ 
                                            borderRadius: 3,
                                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                            height: '100%'
                                        }}>
                                            <CardContent sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
                                                <Box sx={{ p: 2.5, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                                    <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5 }}>
                                                        Quick Actions
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Common tasks and shortcuts
                                                    </Typography>
                                                </Box>
                                                
                                                <Box sx={{ flexGrow: 1, p: 2.5 }}>
                                                    <Grid container spacing={2}>
                                                        {quickActions.map((action, index) => (
                                                            <Grid item xs={12} sm={6} key={index}>
                                                                <Button
                                                                    component={Link}
                                                                    to={action.link}
                                                                    fullWidth
                                                                    sx={{
                                                                        p: 2,
                                                                        borderRadius: 2,
                                                                        backgroundColor: action.color,
                                                                        color: 'text.primary',
                                                                        textTransform: 'none',
                                                                        justifyContent: 'flex-start',
                                                                        '&:hover': {
                                                                            backgroundColor: action.color,
                                                                            opacity: 0.9
                                                                        }
                                                                    }}
                                                                >
                                                                    <Box sx={{ mr: 2 }}>
                                                                        {action.icon}
                                                                    </Box>
                                                                    <Typography variant="body2" fontWeight={500}>
                                                                        {action.title}
                                                                    </Typography>
                                                                </Button>
                                                            </Grid>
                                                        ))}
                                                    </Grid>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </Grid>
                                
                                <Grid item xs={12} md={6}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.7, duration: 0.5 }}
                                    >
                                        <Card sx={{ 
                                            borderRadius: 3,
                                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                            height: '100%'
                                        }}>
                                            <CardContent sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
                                                <Box sx={{ p: 2.5, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                                    <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5 }}>
                                                        Latest Medicines
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Recently added medicines from donors
                                                    </Typography>
                                                </Box>
                                                
                                                <Box sx={{ flexGrow: 1, p: 2.5 }}>
                                                    <MedicineList />
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </Grid>
                            </Grid>
                        </>
                    )}
                </DashboardLayout>
            ) : (
                <NotFound/>
            )}
        </>
    );
};

export default Home;
