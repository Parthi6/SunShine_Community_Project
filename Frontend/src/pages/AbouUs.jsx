import React from 'react';
import Message from '../Components/Home/Messages';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <div className="about-us-page">
      {/* Container 1: Pre-School Story + Image */}
      <div className="container container-1">
        <div className="story">
          <h2>Our Pre-School Story</h2>
          <p>
            Sunshine Preschool was founded with a mission to provide a nurturing and
            educational environment for young children. Our focus is on holistic development,
            blending both academic and social growth. We believe that every child is unique,
            and we strive to meet their individual needs.
          </p>
        </div>
        <div className="image">
          <img src="/path/to/sunshine-preschool.jpg" alt="Pre-School Story" />
        </div>
      </div>

      {/* Container 2: Founder and Image Details */}
      <div className="container container-2">
        <div className="founder-info">
          <h2>Founder</h2>
          <p>
            Our founder, Jane Doe, is a passionate educator with over 20 years of experience in early childhood education. She started Sunshine Preschool with the vision of creating a space where children can grow and explore in a safe, supportive environment.
          </p>
        </div>
        <div className="founder-image">
          <img src="/path/to/founder-image.jpg" alt="Founder" />
        </div>
      </div>

      {/* Container 3: Teachers */}
      <div className="container container-3">
        <h2>Meet Our Teachers</h2>
        <div className="teachers">
          <div className="teacher">
            <img src="/path/to/teacher1.jpg" alt="Teacher 1" />
            <p>SunShine - Lead Teacher</p>
          </div>
          <div className="teacher">
            <img src="/path/to/teacher2.jpg" alt="Teacher 2" />
            <p>Emily Johnson - Assistant Teacher</p>
          </div>
          <div className="teacher">
            <img src="/path/to/teacher3.jpg" alt="Teacher 3" />
            <p>Mark Brown - Specialist Teacher</p>
          </div>
        </div>
      </div>

      {/* Container 4: Send Message */}
      <div className="container container-4">
        <h2>Contact Us</h2>
        <Message /> {/* Import and use your existing Message component here */}
      </div>
    </div>
  );
};

export default AboutUs;