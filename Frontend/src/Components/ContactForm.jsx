import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './ContactForm.css';

const ContactForm = () => {
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

            if (data.success) {
                toast.success('Thank you! Your message has been sent successfully.');
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    message: ''
                });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error sending message. Please try again.');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
                <label>Full Name</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                />
            </div>
            <div className="form-group">
                <label>Email address</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                />
            </div>
            <div className="form-group">
                <label>Phone Number</label>
                <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    required
                />
            </div>
            <div className="form-group">
                <label>Message</label>
                <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your message"
                    required
                    rows="4"
                />
            </div>
            <button 
                type="submit" 
                disabled={loading}
                className="send-message-btn"
            >
                {loading ? 'Sending...' : 'Send Message'}
            </button>
        </form>
    );
};

export default ContactForm; 