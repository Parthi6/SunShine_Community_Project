import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Container, Row, Col } from 'react-bootstrap';
import './ContactUs.css';

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.post(
                'http://localhost:4000/api/v1/message/create',
                formData
            );
            toast.success(data.message);
            setFormData({ name: '', email: '', phone: '', message: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error sending message');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="contact-wrapper">
            <Container>
                <div className="contact-content">
                    <Row>
                        <Col md={5}>
                            <div className="contact-info">
                                <h2>Contact Information</h2>
                                <div className="contact-details">
                                    <div className="contact-item">
                                        <i className="fas fa-phone"></i>
                                        <span>+94 123 456 789</span>
                                    </div>
                                    <div className="contact-item">
                                        <i className="fas fa-envelope"></i>
                                        <span>info@sunshinepre.com</span>
                                    </div>
                                    <div className="contact-item">
                                        <i className="fas fa-map-marker-alt"></i>
                                        <span>123 Education Street, City</span>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col md={7}>
                            <div className="contact-form">
                                <h2>Send us a Message</h2>
                                <form onSubmit={handleSubmit}>
                                    <Row>
                                        <Col md={6}>
                                            <div className="form-group">
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    placeholder="Your Name"
                                                    required
                                                />
                                            </div>
                                        </Col>
                                        <Col md={6}>
                                            <div className="form-group">
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    placeholder="Your Email"
                                                    required
                                                />
                                            </div>
                                        </Col>
                                    </Row>
                                    <div className="form-group">
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="Your Phone Number"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            placeholder="Your Message"
                                            required
                                            rows="4"
                                        ></textarea>
                                    </div>
                                    <button 
                                        type="submit" 
                                        className="submit-btn"
                                        disabled={loading}
                                    >
                                        {loading ? 'Sending...' : 'Send Message'}
                                    </button>
                                </form>
                            </div>
                        </Col>
                    </Row>
                </div>
            </Container>
        </div>
    );
};

export default ContactUs;