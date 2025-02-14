import React from 'react';
import Hero from '../Components/Home/Hero';
import Biography from '../Components/Home/Biography';
import Messages from '../Components/Home/Messages';
import Facilities from '../Components/Home/Facilities';
import './Home.css';  // Import CSS for wave background and other styles

const Home = () => {
  return (
    <>
      {/* Hero Section */}
      <Hero />

      {/* Biography Section */}
      <Biography imageUrl={"Images/about.png"} />

      {/* Facilities Section */}
      <Facilities />

      {/* Teacher Section */}
      {/* <Messages /> */}

      {/* Wave Background */}
      <div className="wave"></div>
    </>
  );
};

export default Home;