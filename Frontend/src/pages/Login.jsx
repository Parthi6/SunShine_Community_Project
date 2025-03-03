import React, { useContext, useState } from 'react';
import { Context } from '../main';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Container, Form, Button, Card, Row, Col } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './Login.css';

const Login = () => {
    const { isAuthenticated, setIsAuthenticated } = useContext(Context);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

  const navigateTo = useNavigate();

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

  const handleLogin = async (e) => {
     e.preventDefault();
     
        // Show loading toast while validating
        const loadingToast = toast.loading("Validating your credentials...");
        
        // Check if all fields are filled
        if (!formData.email || !formData.password) {
            toast.dismiss(loadingToast);
            toast.error("Please fill all fields!");
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast.dismiss(loadingToast);
            toast.error("Please enter a valid email address!");
            return;
        }

        setLoading(true);
        try {
            // Update loading message
            toast.update(loadingToast, { 
                render: "Logging you in...",
                type: "info",
                isLoading: true 
            });
            
      const response = await axios.post(
                "http://localhost:4000/api/v1/user/parent/login",
                {
                    email: formData.email.trim().toLowerCase(),
                    password: formData.password
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
          withCredentials: true,
                }
            );

            if (response.data.success) {
                // Dismiss loading toast and show success
                toast.dismiss(loadingToast);
                toast.success("🎉 Login successful! Welcome back!", {
                    duration: 3000,
                    position: "top-center",
                });
                
                // Clear form data
                setFormData({
                    email: "",
                    password: "",
                });
                
       setIsAuthenticated(true);
                // Add slight delay before redirect for better UX
                setTimeout(() => {
       navigateTo("/");
                }, 2000);
            }
     } catch (error) {
            toast.dismiss(loadingToast);
            console.error("Login error:", error);
            
            // Handle different types of errors
            if (error.response?.data?.message) {
                // Server error message
                toast.error(`❌ ${error.response.data.message}`, {
                    duration: 4000,
                    position: "top-center",
                });
            } else if (!navigator.onLine) {
                // Network error
                toast.error("❌ No internet connection. Please check your network!", {
                    duration: 4000,
                    position: "top-center",
                });
            } else {
                // Generic error
                toast.error("❌ Login failed. Please try again later!", {
                    duration: 4000,
                    position: "top-center",
                });
            }
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }

    return (
        <Container className="login-container">
            <Row className="justify-content-center">
                <Col md={8} lg={5}>
                    <Card className="shadow-lg border-0 my-4">
                        <Card.Body className="p-5">
                            <div className="text-center mb-4">
                                <h2 className="fw-bold mb-2">Login</h2>
                                <p className="text-muted">Welcome back!</p>
                            </div>

                            <Form onSubmit={handleLogin}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Enter your email"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4 password-field">
                                    <Form.Label>Password</Form.Label>
                                    <div className="position-relative">
                                        <Form.Control
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="Enter password"
                                        />
                                        <button
                                            type="button"
                                            className="password-toggle"
                                            onClick={togglePasswordVisibility}
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                        >
                                            {!showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </button>
    </div>
                                </Form.Group>

                                <Button 
                                    variant="primary" 
                                    type="submit" 
                                    className="w-100 mb-3"
                                    disabled={loading}
                                >
                                    {loading ? 'Logging in...' : 'Login'}
                                </Button>

                                <div className="text-center">
                                    <p className="mb-0">
                                        Don't have an account?{' '}
                                        <Link to="/register" className="text-decoration-none">
                                            Sign up here
                                        </Link>
                                    </p>
    </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;