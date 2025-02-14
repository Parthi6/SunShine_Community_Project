import React, { useState, useEffect } from 'react';
import './hero.css'; // Import the CSS file

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    '/Images/hero1.jpg',
    '/Images/hero2.jpg',
    '/Images/hero3.jpeg',
  ];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 3000); // Change slide every 3 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div className="hero-container">
      <img src={slides[currentIndex]} alt="Hero Slide" className="hero-slide" />
      {/* Use symbols for navigation */}
      <button onClick={prevSlide} className="prev-button">&lt;</button> {/* < symbol */}
      <button onClick={nextSlide} className="next-button">&gt;</button> {/* > symbol */}
    </div>
  );
};

export default Hero;