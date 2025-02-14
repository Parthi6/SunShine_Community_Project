import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import {Context} from "../main";
import axios from 'axios';
import { toast } from 'react-toastify';
import './Navbar.css';

const Navbar = () => {

    const [show, setShow] = useState(false);
    const { isAuthenticated, setAuthenticated} = useContext(Context);
    
    const navigateTo = useNavigate();

    const handleLogout = async () =>{
        await axios
            .get("http://localhost:4000/api/v1/user/parent/logout", {
                withCredentials: true,
                })
                .then(res=>{
                    toast.success(res.data.message);
                    setAuthenticated(false);
                })
                .catch(err=>{
                    toast.error(err.response.data.message);
                });
        };
        const gotoLogin = ()=>{
            navigateTo("/login");
        }


  return (
    <nav className='container'>
       <div className="logo">
       <img src="/Images/logo.png" alt="logo" className="logo-img" />
       </div>
       <div className={show ? "navlinks showmenu": "navLinks"}>
            <div className="links">
                <Link to={"/"} >Home</Link>
                <Link to={"/aboutus"} >About Us</Link>
                <Link to={"/gallery"} >Gallery</Link>
                <Link to={"/enrollment"} >Enrollment</Link>
              
            </div>
            {isAuthenticated ? (<button className='logoutBtn btn' onClick={handleLogout}>LOGOUT</button>):(<button className='loginBtn btn' onClick={gotoLogin}>LOGIN</button>)}
        </div>
    </nav>
  )
}

export default Navbar