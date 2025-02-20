import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import './Hero.css';

const Hero = () => {
  return (
    <div className="hero-section">
      <div className="hero-background"></div>
      <div className="sun-patterns">
        {/* <div className="sun sun-1"></div> */}
        <div className="sun sun-2"></div>
        {/* <div className="sun sun-3"></div> */}
        <div className="sun sun-4"></div>
        <div className="sun sun-5"></div>
      </div>
      <Container>
        <Row className="align-items-center hero-content">
          <Col lg={6} className="hero-text">
            <h1 className="hero-title">
              <span className="welcome-text">WELCOME TO</  span>
              <div className="highlight-container">
                <span className="highlight">SUNSHINE</span><br />
                <span className="highlight">PRESCHOOL</span>
              </div>
            </h1>
            <p className="hero-subtitle" style={{ marginLeft: '-20px', marginTop: '-5px' }}>
              Nurturing Young Minds, Building Bright Futures
            </p>
            <div className="hero-buttons">
              <Button href="/enrollment" className="btn">
                <span>Enroll Now</span>
              </Button>
              <Button href="/aboutus" className="btn">
                <span>Learn More</span>
              </Button>
            </div>
          </Col>
          <Col lg={6} className="hero-image-container">
            <div className="floating-shapes">
              <div className="shape shape-1"></div>
              <div className="shape shape-2"></div>
              <div className="shape shape-3"></div>
            </div>
            <img 
              src="/Teacher/Header_photo.png" 
              alt="Sunshine Pre School" 
              className="hero-header-image"
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Hero;