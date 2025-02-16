import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <Container>
          <Row>
            <Col lg={4} md={6} className="footer-info">
              <div className="footer-logo">
                <img src="/Teacher/LOGO.png" alt="Sunshine Preschool" />
                <h3>Sunshine Preschool</h3>
              </div>
              <p>
                Nurturing young minds and building bright futures through quality early childhood education in Belihuloya.
              </p>
            </Col>

            <Col lg={2} md={6} className="footer-links">
              <h4>Quick Links</h4>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/programs">Programs</Link></li>
                <li><Link to="/gallery">Gallery</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </Col>

            <Col lg={3} md={6} className="footer-contact">
              <h4>Contact Us</h4>
              <div className="contact-info">
                <p>
                  <FaMapMarkerAlt className="icon" />
                  Belihuloya, Sri Lanka
                </p>
                <p>
                  <FaPhone className="icon" />
                  +94 123 456 789
                </p>
                <p>
                  <FaEnvelope className="icon" />
                  info@sunshinepreshool.com
                </p>
              </div>
            </Col>

            <Col lg={3} md={6} className="footer-social">
              <h4>Follow Us</h4>
              <div className="social-links">
                <a href="#" className="facebook"><FaFacebook /></a>
                <a href="#" className="instagram"><FaInstagram /></a>
                <a href="#" className="twitter"><FaTwitter /></a>
              </div>
              <div className="footer-hours">
                <h4>Hours</h4>
                <p>Monday - Friday: 8:00 AM - 5:00 PM</p>
                <p>Saturday: 8:00 AM - 12:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <div className="footer-bottom">
        <Container>
          <div className="copyright">
            &copy; {new Date().getFullYear()} Sunshine Preschool. All Rights Reserved.
          </div>
        </Container>
      </div>
    </footer>
  );
};

export default Footer; 