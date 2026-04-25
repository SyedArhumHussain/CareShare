import './App.css';
// Import components (updating to use new Navbar component)
import Navbar from './components/Navbar';
import Products from './MyWebsite/Products';
import About from './MyWebsite/About';
import Buy from './MyWebsite/Buy';
import Contact from './MyWebsite/Contact';
import Footer from './MyWebsite/Footer';
import Cards from './MyWebsite/Cards';
import Hero from './MyWebsite/Hero';
import Work from './MyWebsite/Work';
import MedicineCards from './MyWebsite/MedicineCards';
import AppDashboard from './adminPanel/AppDashboard'
import { 
  Routes,
  Route,
  useLocation
} from 'react-router-dom';
import Carousel from './MyWebsite/Carousel';
import New from './MyWebsite/New';
import Donate from './MyWebsite/Donate';
import Login from './MyWebsite/Login'
import SignUp from './MyWebsite/SignUp';
import MainPage from './MyWebsite/MainPage';
import Ask from './MyWebsite/Ask.js';
import Settings from './adminPanel/pages/Settings';
import AboutDashboard from './adminPanel/pages/AboutDashboard';
import Medicines from './adminPanel/pages/Medicines';
import Account from './adminPanel/pages/Account';
import UserFeedback from './adminPanel/pages/UserFeedback';
import Home from './adminPanel/pages/Home';
import NotFound from '../src/adminPanel/pages/NotFound404'
import DonateForm from './MyWebsite/DonateForm';
import MedicineRequestForm from './MyWebsite/MedicineRequestForm';
import ProtectedRoute from './components/ProtectedRoute';
import Chatbot from './MyWebsite/Chatbot';
import { useState, useEffect } from 'react';

function App() {
  const location = useLocation();
  const [isAdminPage, setIsAdminPage] = useState(false);
  
  // Check if current path is an admin path
  useEffect(() => {
    const adminPathPatterns = [
      '/admin',
      '/donors',
      '/recipients',
      '/allMedicine',
      '/account',
      '/feedback',
      '/medicinerequest'
    ];
    
    const currentPath = location.pathname;
    const isAdmin = adminPathPatterns.some(pattern => 
      currentPath === pattern || currentPath.startsWith(`${pattern}/`)
    );
    
    setIsAdminPage(isAdmin);
  }, [location.pathname]);
  
  return (
    <>
      <Routes>
        <Route path='/' element={<MainPage/>}/>
        <Route path='/signin' element={<Login/>}/>
        <Route path='/signup' element={<SignUp/>}/>
        <Route path='/ask' element={<Ask/>}/>
        <Route 
          path='/donate' 
          element={
            <ProtectedRoute>
              <DonateForm/>
            </ProtectedRoute>
          }
        />
        <Route path='/about' element={<About/>}/>
        <Route path='/contact' element={<Contact/>}/>
        
        {/* Protected routes that require authentication */}
        <Route 
          path='/medicines' 
          element={
            <ProtectedRoute>
              <MedicineRequestForm/>
            </ProtectedRoute>
          }
        />
        <Route 
          path='/available-medicines' 
          element={
            <ProtectedRoute>
              <MedicineCards/>
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route path='/admin' element={<Home/>}/>   
        <Route exact path="/donors" element={<AboutDashboard/>}></Route>
        <Route exact path="/recipients" element={<Settings/>}></Route>
        <Route exact path="/allMedicine" element={<Medicines/>}></Route>
        <Route exact path="/account" element={<Account/>}></Route>
        <Route exact path="/feedback" element={<UserFeedback/>}></Route>
        <Route exact path="/medicinerequest" element={<Medicines/>}></Route>
   
        <Route path='*' element={<NotFound/>}/>
      </Routes>
      
      {/* Chatbot is available on all user-facing pages but not admin pages */}
      {!isAdminPage && <Chatbot />}
    </>
  );
}

export default App;
