import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { red } from '@mui/material/colors';
import Swal from "sweetalert2";
import  MyLogo  from"../images/logoMed.png"
// import jwt_decode from 'jwt-decode';
// import jwt from 'jsonwebtoken';
// ResponsiveAppBar
import { Link, Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const pages = ['Home', 'About', 'Request Medicine', 'Available Medicines', 'Contact Us'];
// const settings = ['Login', 'SignUp', 'Dashboard', 'Account', 'Logout'];
const settings = ['Login', 'SignUp', 'Logout'];

function ResponsiveAppBar(props) {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const navigate = useNavigate();
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    // Clear token from localStorage and update isLoggedIn state
    setIsLoggedIn(false);
    Swal.fire({
      title: "Successul",
      text: "Log out Successfully.",
      icon: "success",
      confirmButtonColor: "#0875b8",
    });
    navigate('/signin')
    localStorage.removeItem('clientToken');
};

const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const decodedData = JSON.parse(atob(base64));
    console.log("dec",decodedData)
    return decodedData;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};
React.useEffect(() => {
  // Check token validity here
  const clientToken = JSON.parse(localStorage.getItem('clientToken')); // Retrieve token object from local storage
  const token = clientToken?.token; // Extract the token string
  console.log("token",token)

  if (token) {
    console.log("inside token",token)

   
    
    // Decode and verify the token's expiration date
    const decodedToken = decodeToken(token);
    const currentTime = Date.now() / 1000;
    if (decodedToken.exp > currentTime) {
      setIsLoggedIn(true);
      console.log('current', currentTime);
      console.log('decode', decodedToken.exp);
    } else {
      setIsLoggedIn(false);
      // If token is expired, you might want to clear it from local storage
      localStorage.removeItem('clientToken');
    }
  } else {
    setIsLoggedIn(false);
  }
}, []);

// const decodeToken = (token) => {
//   const base64Url = token.split('.')[1];
//   const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//   const decodedData = JSON.parse(atob(base64));
//   return decodedData;
// };




  return (
//     <AppBar position="static" sx={{ backgroundColor: "#58869e", color: 'white' }}>
//       <Container maxWidth="xl">
//         <Toolbar disableGutters>
//           <Avatar alt="Remy Sharp" src="/medine/ogp1.jpg" sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />


// <Typography
//       variant="h6"
//       noWrap
//       component="a"
//       href="/"
//       sx={{
//         mr: 5,
//         display: { xs: 'none', md: 'flex' },
//         fontFamily: 'monospace',
//         fontWeight: 700,
//         color: 'white',
//         textDecoration: 'none',
//         '&:hover': {
//           color: 'white', 
//           textDecoration: 'none', 
//         },
//       }}
//     >
//       MedBridge
//     </Typography>

//           <Button component={Link} to="/">
//             <Typography color='white'>
//               Home
//             </Typography>
//           </Button>

//           <Button component={Link} to="/about">
//             <Typography color='white'>
//               About
//             </Typography>
//           </Button>

//           <Button component={Link} to="/medicines">
//             <Typography color='white'>
//               Medicines
//             </Typography>
//           </Button>

//           <Button component={Link} to="/contact">
//             <Typography color='white'>
//               Contact Us
//             </Typography>
//           </Button>
//         </Toolbar>
//       </Container>
//     </AppBar>





<AppBar position="static" sx={{ backgroundColor: "#58869e", color: 'white' }}>
<Container maxWidth="xl">
  <Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between' }}>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {/* <Avatar alt="Remy Sharp" src={MyLogo}  sx={{ display: { xs: 'none', md: 'flex' }, mr: 1,width:90,height:50 }} /> */}
      <img src={MyLogo} width="100px" height="60px" />
      <Typography
        variant="h6"
        noWrap
        component={Link}
        to="/"
        sx={{
          mr: 5,
          display: { xs: 'none', md: 'flex' },
          fontFamily: 'monospace',
          fontWeight: 700,
          color: 'white',
          textDecoration: 'none',
          '&:hover': {
            color: 'white', 
            textDecoration: 'none', 
          },
        }}
      >
        CareShare
      </Typography>
      
      <Button component={Link} to="/">
        <Typography color='white'>
          Home
        </Typography>
      </Button>

      <Button component={Link} to="/about">
        <Typography color='white'>
          About
        </Typography>
      </Button>

      {/* Only show medicine request and available medicines if logged in */}
      {isLoggedIn && (
        <>
          <Button component={Link} to="/medicines" sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', px: 2, borderRadius: 1 }}>
            <Typography color='white'>
              Request Medicine
            </Typography>
          </Button>

          <Button component={Link} to="/available-medicines">
            <Typography color='white'>
              Available Medicines
            </Typography>
          </Button>
        </>
      )}

      <Button component={Link} to="/contact">
        <Typography color='white'>
          Contact Us
        </Typography>
      </Button>
    </div>
    
    <div>
      {console.log('hi',isLoggedIn)}
      {isLoggedIn ? (<Button onClick={handleLogout} color="inherit" sx={{'&:hover': {
            color: 'white', 
            textDecoration: 'none', 
          },}}>Logout</Button>):(<>
      <Button component={Link} to="/signin" color="inherit" sx={{'&:hover': {
            color: 'white', 
            textDecoration: 'none', 
          },}}>Login</Button>
      <Button component={Link} to="/signup" color="inherit" sx={{'&:hover': {
            color: 'white', 
            textDecoration: 'none', 
          },}}>Sign Up</Button></>
      )
          }
    </div>
  </Toolbar>
</Container>
</AppBar>
















  );
}
export default ResponsiveAppBar;