import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Programs from './pages/Programs';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import AdminLogin from './pages/Admin/AdminLogin';
import AdminSignup from './pages/Admin/AdminSignup';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ProtectedRoute from './components/Routes/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route 
          path="/admin/dashboard/*" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App; 