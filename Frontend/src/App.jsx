import React, { useContext, useEffect } from 'react'
import "./App.css"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import AboutUs from './pages/AbouUs'
import Gallery from './pages/Gallery'
import ContactUs from './pages/ContactUs'
import Enrollment from './pages/Enrollment'
import Login from './pages/Login'
import Register from './pages/Register'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import Navbar from './Components/Navbar'
import { Context } from './main'
import axios from 'axios'


const App = () => {
  const { isAuthenticated, setIsAuthenticated, setUser } = useContext(Context);
  useEffect(()=>{
    const fetchUser =async() =>{
      try {
        const response = await axios.get("http://localhost:4000/api/v1/user/parent/me", {withCredentials: true});
        setIsAuthenticated(true);
        setUser(response.data.user);
      } catch (error) {
        setIsAuthenticated(false);
        setUser({});
        
      }
    };
    fetchUser();
  }, [isAuthenticated]);


  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/aboutus' element={<AboutUs />} />
          <Route path='/gallery' element={<Gallery />} />
          <Route path='/enrollment' element={<Enrollment />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
        </Routes>

        <ToastContainer position="top-center" />

      </Router>

    </>
  )
}

export default App