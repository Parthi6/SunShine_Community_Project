import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { FaGraduationCap, FaHeart, FaUsers, FaStar, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import './AboutUs.css';
import axios from 'axios';
import { useState } from 'react';
import ContactForm from '../components/ContactForm';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const AboutUs = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: ""
    });

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:4000/api/v1/contact/send', formData);
            if (response.data.success) {
                toast.success('Message sent successfully!');
                setFormData({ name: '', email: '', phone: '', message: '' });
            }
        } catch (error) {
            toast.error('Failed to send message. Please try again.');
            console.error('Error:', error);
        }
    };

    return (
        <div className="about-us-wrapper">
            {/* Welcome Section */}
            <div className="welcome-section">
                <h1 className="welcome-title">
                    WELCOME TO SUNSHINE PRE SCHOOL
                </h1>
                <p className="welcome-subtitle">
                    <span>NURTURING YOUNG MINDS</span>
                    <span>BUILDING BRIGHT FUTURES</span>
                </p>
            </div>

            {/* Hero Image Section */}
            <div className="about-hero">
                <img src="/Teacher/Kids.png" alt="Kids at Sunshine Pre School" />
            </div>

            {/* Quick Contact Info */}
            <div className="quick-contact">
                <Container>
                    <Row>
                        <Col md={4}>
                            <div className="contact-item">
                                <FaPhone className="contact-icon" />
                                <div>
                                    <h4>Call Us</h4>
                                    <p>+1 234 567 8900</p>
                                </div>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="contact-item">
                                <FaEnvelope className="contact-icon" />
                                <div>
                                    <h4>Email Us</h4>
                                    <p>info@sunshine.edu</p>
                                </div>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="contact-item">
                                <FaMapMarkerAlt className="contact-icon" />
                                <div>
                                    <h4>Visit Us</h4>
                                    <p>123 Education St, City</p>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* Mission & Vision Section */}
            
            <Container className="section mission-vision-section">
                
                <Row className="align-items-center">
                    <Col md={6}>
                        <div className="mission-content">
                            <h2>Our Mission</h2>
                            <p>
                                At Sunshine Pre School, we are dedicated to providing a nurturing 
                                and stimulating environment where children can grow, learn, and 
                                discover their potential through play-based learning and creative 
                                exploration.
                            </p>
                            <h2>Our Vision</h2>
                            <p>
                                To be a leading early childhood education center that empowers 
                                children to become confident, curious, and compassionate lifelong 
                                learners.
                            </p>
                        </div>
                    </Col>
                    <Col md={6} className="text-center">
                        <img 
                            src="./Teacher/LOGO.png" 
                            alt="Sunshine Pre School Logo" 
                            className="logo-image"
                        />
                    </Col>
                </Row>
            </Container>

            {/* Divider */}
            <div className="section-divider">
                <Container>
                  
                </Container>
            </div>

            {/* Values Section */}
            <div className="values-section">
                <Container className="text-center">
                    <div className="title-wrapper">
                        <h2 style={{
                            color: '#FF6B6B',
                            fontSize: '2.8rem',
                            fontWeight: '700',
                            marginBottom: '1rem',
                            textDecoration: 'none',
                            position: 'relative',
                            paddingBottom: '20px',  // Add space for the gradient line
                        }}>
                            Our Core Values
                            <div style={{
                                content: '""',
                                position: 'absolute',
                                bottom: '0',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '80px',
                                height: '3px',
                                background: 'linear-gradient(to right, #FF6B6B, #4ECDC4)'
                            }}></div>
                        </h2>
                        <div className="section-subtitle">
                            Guiding principles that shape our approach to education
                        </div>
                    </div>
                    <Row className="values-cards">
                        <Col md={3} sm={6} className="mb-4">
                            <div className="value-card">
                                <div className="value-icon">
                                    <FaHeart />
                                </div>
                                <h3>Nurturing Care</h3>
                                <p>Providing a loving and supportive environment for every child</p>
                            </div>
                        </Col>
                        <Col md={3} sm={6} className="mb-4">
                            <div className="value-card">
                                <div className="value-icon">
                                    <FaGraduationCap />
                                </div>
                                <h3>Quality Education</h3>
                                <p>Delivering excellence in early childhood education</p>
                            </div>
                        </Col>
                        <Col md={3} sm={6} className="mb-4">
                            <div className="value-card">
                                <div className="value-icon">
                                    <FaUsers />
                                </div>
                                <h3>Community</h3>
                                <p>Building strong partnerships with families</p>
                            </div>
                        </Col>
                        <Col md={3} sm={6} className="mb-4">
                            <div className="value-card">
                                <div className="value-icon">
                                    <FaStar />
                                </div>
                                <h3>Innovation</h3>
                                <p>Embracing creative and modern teaching methods</p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* Why Choose Us Section */}
            <div className="why-choose-section">
                <Container className="text-center">
                    <div className="title-wrapper">
                        <h2 style={{
                            color: '#FF6B6B',
                            fontSize: '2.8rem',
                            fontWeight: '700',
                            marginBottom: '1rem',
                            textDecoration: 'none',
                            position: 'relative',
                            paddingBottom: '20px',
                        }}>
                            Why Choose Sunshine Pre School?
                            <div style={{
                                content: '""',
                                position: 'absolute',
                                bottom: '0',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '80px',
                                height: '3px',
                                background: 'linear-gradient(to right, #FF6B6B, #4ECDC4)'
                            }}></div>
                        </h2>
                        <div className="section-subtitle">
                            Discover what makes our preschool special
                        </div>
                    </div>
                    <Row className="why-choose-cards">
                        <Col md={4}>
                            <div className="why-choose-card">
                                <div className="why-choose-icon">
                                    <FaGraduationCap />
                                </div>
                                <h3>Experienced Teachers</h3>
                                <p>Our qualified educators are passionate about early childhood development, bringing years of expertise to nurture your child's growth.</p>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="why-choose-card">
                                <div className="why-choose-icon">
                                    <FaHeart />
                                </div>
                                <h3>Safe Environment</h3>
                                <p>State-of-the-art facilities with comprehensive safety measures ensure your child's well-being is our top priority.</p>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="why-choose-card">
                                <div className="why-choose-icon">
                                    <FaStar />
                                </div>
                                <h3>Holistic Development</h3>
                                <p>Focus on social, emotional, and cognitive growth through our comprehensive curriculum and engaging activities.</p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* Teacher Section */}
            <div className="teacher-section">
                <Container className="text-center">
                    <div className="title-wrapper">
                        <h2 style={{
                            color: '#FF6B6B',
                            fontSize: '2.8rem',
                            fontWeight: '700',
                            marginBottom: '1rem',
                            textDecoration: 'none',
                            position: 'relative',
                            paddingBottom: '20px',
                        }}>
                            Our Expert Teachers
                            <div style={{
                                content: '""',
                                position: 'absolute',
                                bottom: '0',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '80px',
                                height: '3px',
                                background: 'linear-gradient(to right, #FF6B6B, #4ECDC4)'
                            }}></div>
                        </h2>
                        <div className="section-subtitle">
                            Meet our dedicated team of early childhood educators
                        </div>
                    </div>
                    <Row>
                        <Col lg={4} md={6} className="mb-4">
                            <Card className="teacher-card">
                                <div className="teacher-img-wrapper">
                                    <Card.Img variant="top" src="/Teacher/1.jpeg" />
                                    <div className="teacher-overlay">
                                        <p>10+ years of experience in early childhood education</p>
                                    </div>
                                </div>
                                <Card.Body>
                                    <Card.Title>Sarah Wilson</Card.Title>
                                    <Card.Subtitle className="mb-2">Early Childhood Educator</Card.Subtitle>
                                    <Card.Text>Specializes in creative arts and emotional development</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col lg={4} md={6} className="mb-4">
                            <Card className="teacher-card">
                                <div className="teacher-img-wrapper">
                                    <Card.Img variant="top" src="/Teacher/2.jpg" />
                                    <div className="teacher-overlay">
                                        <p>Expert in play-based learning methodologies</p>
                                    </div>
                                </div>
                                <Card.Body>
                                    <Card.Title>Michael Johnson</Card.Title>
                                    <Card.Subtitle className="mb-2">Pre-School Teacher</Card.Subtitle>
                                    <Card.Text>Focuses on STEM activities and cognitive development</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col lg={4} md={6} className="mb-4">
                            <Card className="teacher-card">
                                <div className="teacher-img-wrapper">
                                    <Card.Img variant="top" src="/Teacher/3.jpg" />
                                    <div className="teacher-overlay">
                                        <p>Certified in special education and inclusive learning</p>
                                    </div>
                                </div>
                                <Card.Body>
                                    <Card.Title>Emily Davis</Card.Title>
                                    <Card.Subtitle className="mb-2">Child Development Specialist</Card.Subtitle>
                                    <Card.Text>Expert in social-emotional learning and development</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* Add gradient divider */}
            <div className="gradient-divider"></div>

            {/* Contact Form Section with Map */}
            <div className="contact-section">
                <Container>
                    <Row className="g-4">
                        <Col lg={6}>
                            <div className="contact-form-container">
                                <Card className="contact-card shadow-lg border-0">
                                    <Card.Body className="p-5">
                                        <div className="text-center mb-4">
                                            <h2 className="contact-title fw-bold mb-2">Get in Touch</h2>
                                            <p className="text-muted">We'd love to hear from you</p>
                                        </div>
                                        <ContactForm />
                                    </Card.Body>
                                </Card>
                            </div>
                        </Col>
                        <Col lg={6}>
                            <div className="map-container">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3962.43215503154!2d80.7837193!3d6.717001!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae38b14eae640d5%3A0xa9d35d5cc5e99f3!2sSunshine%20Pre%20School!5e0!3m2!1sen!2slk!4v1739529570771!5m2!1sen!2slk"
                                    width="100%"
                                    style={{ 
                                        border: 0,
                                        borderRadius: '15px',
                                        height: '100%',
                                        minHeight: '600px'
                                    }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Sunshine Pre School Location"
                                ></iframe>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    );
};

export default AboutUs; 