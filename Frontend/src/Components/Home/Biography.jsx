import React from 'react';
import "./Biography.css";

const Biography = ({ imageUrl }) => {
  return (
    <div className='container biography'>
      <div className='bio-content'>
        <div className='image'>
          <img src={imageUrl} alt='aboutimage' />
        </div>
        <div className='text'>
          <h3>Nurturing Young Minds</h3>
          <p style={{ 
            color: 'black', 
            fontSize: '18px', 
            fontWeight: '500',
            lineHeight: '1.8',
            letterSpacing: '0.3px'
          }}>
            At Sunshine Preschool Belihuloya, we embrace the Montessori philosophy of education. Through personalized attention and expert guidance, we help each child discover their unique potential. Our nurturing environment, built on Dr. Maria Montessori's time-tested principles, provides the perfect setting for children to learn, grow, and thrive in their early years.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Biography;