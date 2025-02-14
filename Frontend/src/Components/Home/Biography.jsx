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
          <h3>Welcome to Sunshine Preschool</h3>
          <p>
            Welcome to Sunshine Preschool, Belihuloya! We are passionate about Montessori education and dedicated to nurturing the growth and development of young minds. Our approach is based on the principles of Dr. Maria Montessori, ensuring that every child receives the highest standard of education in a warm, supportive, and fun environment.
          </p>
         
        </div>
      </div>
    </div>
  );
};

export default Biography;