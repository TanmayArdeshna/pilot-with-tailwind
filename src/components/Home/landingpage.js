import React from 'react';
import Navbar from './Navbar'; // Adjust path if necessary
import Footer from './Footer';
import './LandingPage.css'; // Import the CSS file

const LandingPage = () => {
  return (
    <div className="landing-container landing-page">
      <Navbar /> {/* Include the Navbar component */}
      {/* <Footer /> */}
    </div>
  );
};

export default LandingPage;
