import React from 'react';
import './Facilities.css';

const Facilities = () => {
  const facilitiesList = [
    { 
      title: "Spacious Classrooms", 
      description: "Bright, airy, and well-equipped spaces designed for interactive learning and discovery.", 
      imageUrl: "/Images/F1.png",
      color: "#FF6B6B"
    },
    { 
      title: "Outdoor Play Area", 
      description: "Safe and engaging playground where children develop physical skills and social bonds.", 
      imageUrl: "/Images/F2.png",
      color: "#4ECDC4"
    },
    { 
      title: "Art & Creativity", 
      description: "Dedicated spaces for artistic expression, crafts, and creative development.", 
      imageUrl: "/Images/F3.png",
      color: "#FFD93D"
    },
    { 
      title: "Music and Dancing", 
      description: "Joyful environment for exploring rhythm, movement, and musical expression.", 
      imageUrl: "/Images/F4.png",
      color: "#6C5CE7"
    },
    { 
      title: "Healthy Food", 
      description: "Nutritious and balanced meals prepared fresh daily in our hygienic kitchen.", 
      imageUrl: "/Images/F5.png",
      color: "#A8E6CF"
    },
    { 
      title: "Field Trips", 
      description: "Regular educational outings that connect learning with real-world experiences.", 
      imageUrl: "/Images/F6.png",
      color: "#FF8B94"
    }
  ];

  return (
    <div className='facilities-container'>
      <h2>Our Preschool Facilities</h2>
      <div className='facilities-list'>
        {facilitiesList.map((facility, index) => (
          <div 
            key={index} 
            className='facility-card'
            style={{ '--hover-color': facility.color }}
          >
            <div className='facility-icon'>
              <img src={facility.imageUrl} alt={facility.title} />
            </div>
            <div className='facility-content'>
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