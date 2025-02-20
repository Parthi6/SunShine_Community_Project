import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Context } from "../main";
import axios from 'axios';
import { toast } from 'react-toastify';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import './Navbar.css';

const NavbarComponent = () => {
    const { isAuthenticated, setIsAuthenticated } = useContext(Context);
    const navigateTo = useNavigate();

    const handleLogout = async () => {
        try {
            const res = await axios.get("http://localhost:4000/api/v1/user/parent/logout", {
                withCredentials: true,
            });
            
            setIsAuthenticated(false);
            toast.success(res.data.message);
            navigateTo('/login');
        } catch (err) {
            toast.error(err.response.data.message);
        }
    };

    return (
        <Navbar expand="lg" className="sunshine-navbar" fixed="top">
            <Container>
                <Navbar.Brand as={Link} to="/" className="brand-container">
                    <img
                        src="/Teacher/LOGO.png"
                        alt="SUN SHINE PRE SCHOOL"
                        className="navbar-logo"
                    />
                    <div className="brand-text">
                        <span className="brand-name">SUNSHINE</span>
                        <span className="brand-subtitle">PRE SCHOOL</span>
                    </div>
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                    <Nav className="align-items-center">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        <Nav.Link as={Link} to="/aboutus">About Us</Nav.Link>
                        <Nav.Link as={Link} to="/gallery">Gallery</Nav.Link>
                        <Nav.Link as={Link} to="/contact">Contact Us</Nav.Link>
                        
                        {isAuthenticated ? (
                            <Button 
                                variant="sunshine-secondary"
                                onClick={handleLogout}
                                className="ms-lg-3"
                            >
                                Logout
                            </Button>
                        ) : (
                            <Button 
                                variant="sunshine-primary"
                                as={Link}
                                to="/enrollment"
                                className="ms-lg-3"
                            >
                                <span>Enrollment</span>
                            </Button>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavbarComponent; 