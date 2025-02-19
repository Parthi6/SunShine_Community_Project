import React, { useContext, useEffect } from 'react'
import "./App.css"
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import AboutUs from './pages/AboutUs'
import Gallery from './pages/Gallery'
import ContactUs from './pages/ContactUs'
import Enrollment from './pages/Enrollment'
import Login from './pages/Login'
import Register from './pages/Register'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import Navbar from './Components/Navbar'
import { Context } from './main'
import axios from 'axios'
import AdminLogin from './pages/Admin/AdminLogin'
import AdminSignup from './pages/Admin/AdminSignup'
import AdminDashboard from './pages/Admin/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import { isAdminRoute } from './utils/routeUtils'
import Students from './pages/Admin/Students/Students'
import AttendanceManagement from './pages/Admin/Attendance/AttendanceManagement'
import Messages from './pages/Admin/Messages/Messages'
import Enrollments from './pages/Admin/Enrollments/Enrollments'

// Create a wrapper component to handle the navbar logic
const AppContent = () => {
  const location = useLocation();
  const { isAuthenticated, setIsAuthenticated, setUser } = useContext(Context);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/admin/me",
          {
            withCredentials: true,
          }
        );
        if (data.success) {
          setIsAuthenticated(true);
          setUser(data.user);
        }
      } catch (error) {
        setIsAuthenticated(false);
        setUser({});
      }
    };
    checkAuth();
  }, []);

  return (
    <>
      {!isAdminRoute(location.pathname) && <Navbar />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/aboutus' element={<AboutUs />} />
        <Route path='/gallery' element={<Gallery />} />
        <Route path='/enrollment' element={<Enrollment />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/admin/login' element={<AdminLogin />} />
        <Route path='/admin/signup' element={<AdminSignup />} />
        <Route 
          path='/admin/dashboard' 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="/admin/students" element={<Students />} />
        <Route 
          path="/admin/attendance" 
          element={
            <ProtectedRoute>
              <AttendanceManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/messages" 
          element={
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          } 
        />
        <Route path="/admin/enrollments" element={<Enrollments />} />
        <Route path="/contact" element={<ContactUs />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition:Bounce
      />
    </Router>
  );
};

export default App;