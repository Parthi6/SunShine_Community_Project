import React from 'react';
import './Facilities.css';

const Facilities = () => {
  const facilitiesList = [
    { 
      title: "Spacious Classrooms", 
      description: "Bright, airy, and designed for hands-on learning.", 
      imageUrl: "/Images/F1.png"
    },
    { 
      title: "Outdoor Play Area", 
      description: "A safe and fun environment for physical development.", 
      imageUrl: "/Images/F2.png" 
    },
    { 
      title: "Art & Creativity", 
      description: "Encouraging creativity through various mediums.", 
      imageUrl: "/Images/F3.png" 
    },
    { 
      title: "Music and Dancing", 
      description: "Fun ways to explore rhythm and physical movement.", 
      imageUrl: "/Images/F4.png" 
    },
    { 
      title: "Healthy Food", 
      description: "Healthy meals to fuel your child's learning and growth.", 
      imageUrl: "/Images/F5.png" 
    },
    { 
      title: "Field Trips", 
      description: "Exciting real-world learning experiences.", 
      imageUrl: "/Images/F6.png" 
    }
  ];

  return (
    <div className='facilities-container'>
      <h2>Our Preschool Facilities</h2>
      <div className='facilities-list'>
        {facilitiesList.map((facility, index) => (
          <div key={index} className='facility-card'>
            <div className='facility-icon'>
              <img src={facility.imageUrl} alt={facility.title} />
            </div>
            <div className='facility-text'>
              <h3>{facility.title}</h3>
              <p>{facility.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Facilities;