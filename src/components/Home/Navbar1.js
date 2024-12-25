import React, { useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/img/brand/argon-react.png'; // Adjust the path as necessary
import worldMap from '../Home/map.png';
import planeImage from '../Home/planeImage.png';
import blueBackgroundImage from '../Home/bluebackground.png';
import captainImage from '../Home/pilot.png';
// import wizzAirLogo from '../Home/wizz.png';
// import aerLingusLogo from '../Home/airlingus.png';
// import norwegianLogo from '../Home/norwegian.png';
import airindiaLogo from '../Home/air india.png';
import airiniaexpressLogo from '../Home/airindiaexpress.png';
import airjapan from '../Home/airjapan.png';
import cathay from '../Home/cathay.png';
import emirates from '../Home/emirates.png';
import etihad from '../Home/etihad.png';
import flydubai from '../Home/flydubai.png';
import indigo from '../Home/indigo.png';  
import qatar from '../Home/qatar.png';
import vistara from '../Home/vistara.png';
import './Navbar.css';
import { useState } from 'react';
import aboutImage from './about.png';
import aboutborder from './aboutborder.png';
import studentImage from './studentimage.png';
import Image1 from './1.png';
import Image2 from './2.png';
import Image3 from './3.png';
import Image4 from './4.png';
import Image5 from './5.png';
import axios from "axios";


const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [visibleFaq, setVisibleFaq] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalSlides = 3;
  const navigate = useNavigate();
  const [stats, setStats] = useState({
      attemptedInMonth: 0,
      attemptedInDay: 0,
      attemptedInWeek: 0,
    });
  const [/* loading */, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch attempted questions stats
        const attemptedResponse = await axios.get(
          `https://auth.thepilotprep.com/v2/jdbuhb/cebfyuch/with-auth-token/cwidbshyu/ijvihebvuheb/attempted-questions`
        );
  
        if (attemptedResponse.data && attemptedResponse.data.data) {
          const attemptedData = attemptedResponse.data.data;
          setStats((prevStats) => ({
            ...prevStats,
            attemptedInMonth: attemptedData.attemptedInMonth,
            attemptedInDay: attemptedData.attemptedInDay,
            attemptedInWeek: attemptedData.attemptedInWeek,
          }));
        } else {
          console.error("Failed to load attempted questions data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchStats();
  }, []);
  

  const showSlide = (index) => {
    if (index >= totalSlides) {
      setCurrentIndex(0);
    } else if (index < 0) {
      setCurrentIndex(totalSlides - 1);
    } else {
      setCurrentIndex(index);
    }
  };

  const nextSlide = () => {
    showSlide(currentIndex + 1);
  };

  const prevSlide = () => {
    showSlide(currentIndex - 1);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleFaq = (index) => {
    if (visibleFaq === index) {
      // Closing FAQ
      setVisibleFaq(null);
      // Reset footer position with a slight delay to allow for animation
      setTimeout(() => {
        const footer = document.querySelector('.footer-container');
        if (footer) {
          footer.style.marginTop = '0px';
          footer.style.transition = 'margin-top 0s step-start';
        }
      }, 50);
    } else {
      // Opening FAQ
      setVisibleFaq(index);
      // Push footer down
      setTimeout(() => {
        const footer = document.querySelector('.footer-container');
        if (footer) {
          footer.style.marginTop = '70px';
          footer.style.transition = 'margin-top 0s step-start';
        }
      }, 50);
    }
  };


  const handleButtonClick = () => {
    navigate('/auth/login');
  };

  const handleScrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    }
  };

  return (
    <div>
      {/* Navbar Section */}
      <div className="navbar">
        <div>
          <Link to="/">
            <img src={logo} alt="Logo" className="logoImage" />
          </Link>
        </div>
        <nav className={`navLinks ${isMenuOpen ? 'open' : ''}`}>
          <ul className="navList">
            <li className="navli">
              <a href="#about" className="navLink" onClick={() => handleScrollToSection('about')}>About us</a>
            </li>
            <li className='navli'>
              <a href="#aboutTPP" className="navLink" onClick={() => handleScrollToSection('aboutTPP')}>About TPP</a>
            </li>
            <li className='navli'>
              <a href="#whychooseus" className="navLink" onClick={() => handleScrollToSection('whychooseus')}>Why choose us</a>
            </li>
            <li className='navli'>
              <a href="#Testimonials" className="navLink" onClick={() => handleScrollToSection('Testimonials')}>Testimonials </a>
            </li>
            <li className='navli'>
              <a href="#faq" className="navLink" onClick={() =>  handleScrollToSection('faq')}>FAQ</a>

            </li>
            <li className="navli"><button className="ctaButton" onClick={handleButtonClick}>
              Let’s Fly
            </button></li>
          </ul>
        </nav>


        {/* Hamburger Menu Button */}
        <button className="hamburgerButton" onClick={toggleMenu}>
          <span className="hamburgerIcon">&#9776;</span>
        </button>
      </div>

      {/* Background Map */}
      <div className="mapContainer">
        <img src={worldMap} alt="World Map" className="mapImage" />
      </div>

      {/* "Upcoming Assignment?" Label */}
      {/* <div className="upcomingAssignment">
        Upcoming Assignment?
      </div> */}

      {/* Plane Image */}
      <div className="planeContainer">
        <img src={planeImage} alt="Plane" className="planeImage" />
      </div>

      {/* "Improve Your Chance by 90% with Pass" Text */}
      <div className="improveChanceText">
        World’s Most Reliable Preparation Tool For Pilots
      </div>

      {/* Sub-text */}
      {/* <div className="subText">
        Next Generation Online Pilot Assessment Preparation
      </div> */}

      {/* What You Get Container */}
      <div className="whatYouGetSection">
        <div className="whatYouGetContainer">
          <h2 className="whatYouGetTitle">What You Get</h2>
          <hr className="divider-line7" />

          {/* Features Section */}
          <div className="features">
            <div className="featureItem">
              <div className="iconWrapper">
                <img src={Image1} alt="Adapt, Cut-E, COMPASS, PILAPT and Mollymawk" /><p>Adapt, Cut-E, COMPASS, PILAPT and Mollymawk</p>
              </div>
              {/* <p>Adapt, Cut-E, COMPASS, PILAPT and Mollymawk</p> */}
            </div>

            <div className="featureItem">
              <div className="iconWrapper">
                <img src={Image2} alt="CPL/ATPL Training Assistance" /><p>CPL/ATPL Training Assistance</p>
              </div>
              {/* <p>CPL/ATPL Training Assistance</p> */}
            </div>

            <div className="featureItem">
              <div className="iconWrapper">
                <img src={Image3} alt="Reasoning, Math and Physics" /><p>Reasoning, Math and Physics</p>
              </div>
              {/* <p>Reasoning, Math and Physics</p> */}
            </div>

            <div className="featureItem">
              <div className="iconWrapper">
                <img src={Image4} alt="Progress Checking vs Other Users-out" /><p>Progress Checking vs Other Users-out</p>
              </div>
              {/* <p>Progress Checking vs Other Users-out</p> */}
            </div>

            <div className="featureItem">
              <div className="iconWrapper">
                <img src={Image5} alt="Mobile Friendly and a Forum" /><p>Mobile Friendly and a Forum</p>
              </div>
              {/* <p>Mobile Friendly and a Forum</p> */}
            </div>
          </div>

          <button className="tryNowButton" onClick={handleButtonClick}>Try Now</button>

          {/* Divider */}
          <hr className="divider" />

          {/* Test Completed Section */}
          <h2 className="testCompletedTitle">Test Completed</h2>
          <hr className="divider-line8" />
          <div className="testStatsContainer">
            <div className="testCard">
              <div className="numberBackground">
                <h3 className="numberText">{stats.attemptedInMonth}</h3>
              </div>
              <p className="statText">in Last 30 days</p>
            </div>
            <div className="testCard">
              <div className="numberBackground">
                <h3 className="numberText">{stats.attemptedInWeek}</h3>
              </div>
              <p className="statText">in Last 07 days</p>
            </div>
            <div className="testCard">
              <div className="numberBackground">
                <h3 className="numberText">{stats.attemptedInDay}</h3>
              </div>
              <p className="statText">in Last 24 Hours</p>
            </div>
          </div>
        </div>
      </div>

      {/* Blue Background Section */}
      <div className="blueBackgroundSection" style={{ backgroundImage: `url(${blueBackgroundImage})` }}>
        <div className="blueContent">
          <div className="textContainer">
            <h2 className="blueText">
              <span style={{ color: '#FF5C00' }}>Hello, Future Captain,</span> With me as your co-pilot, your career is cleared for takeoff to new milestones.
            </h2>
            <button className="letsFlyButton" onClick={handleButtonClick}>Let’s Fly</button>
          </div>
          <div className="captainImageWrapper">
            <img src={captainImage} alt="Captain" className="captainImage" />
          </div>
        </div>
      </div>

      {/* Logos Section */}
      <div className="logosSection">
        <h2 className="logoHeading">Our students currently flying with:</h2>
        <hr className="divider-line9" />
        <div class="logosWrapper">
          <div className="logosContainer">
            {/* <img src={wizzAirLogo} alt="Wizz Air" className="logoImage" />
            <img src={aerLingusLogo} alt="Aer Lingus" className="logoImage" />
            <img src={norwegianLogo} alt="Norwegian" className="logoImage" /> */}
            <img src={airindiaLogo} alt="airindiaLogo" className="logoImage" />
            <img src={airiniaexpressLogo} alt="airiniaexpressLogo" className="logoImage" />
            <img src={airjapan} alt="airjapan" className="logoImage" />
            <img src={cathay} alt="cathay" className="logoImage" />
            <img src={emirates} alt="emirates" className="logoImage" />
            <img src={etihad} alt="etihad" className="logoImage" />
            <img src={flydubai} alt="flydubai" className="logoImage" />
            <img src={indigo} alt="indigo" className="logoImage" />
            <img src={qatar} alt="qatar" className="logoImage" />
            <img src={vistara} alt="vistara" className="logoImage" />
          </div>
        </div>
      </div>

      <div id='aboutTPP' className="frontpage2">
        <h2 className="frontpage2-heading">TPP features</h2>
        <hr className="divider-line3" />
        <p className="frontpage2-subheading">Created by actual pilot assessors</p>
        <div class="carousel-wrapper">
          <div className={`feature-cards ${window.innerWidth <= 480 ? 'translate-small' : 'translate-large'
            }`}
            style={{
              '--current-index': currentIndex,
            }}>
            <div className="feature-card">
              <div className="iconWrapper2">
                {/* SVG for CPL / ATPL Question training */}
                <svg width="30" height="30" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_142_3297)">
                    <path d="M22.1094 1.56252C21.4219 1.71095 20.8672 2.14845 20.5781 2.77345L20.3906 3.16408L20.3984 8.20314C20.3984 11.8516 20.4297 13.3125 20.4922 13.4922C20.6797 14 21.0625 14.4219 21.5312 14.6563C21.9688 14.8672 22.0625 14.8828 23.2422 14.9219C24.0703 14.9453 24.5547 14.9922 24.6719 15.0625C25.0312 15.2735 25.0781 15.5469 25.0781 17.6641C25.0781 18.8203 25.1094 19.6094 25.1484 19.5938C25.1875 19.5781 26.2344 18.6016 27.4688 17.4219C28.7031 16.2422 29.8047 15.2031 29.9141 15.1172C30.1016 14.9688 30.2656 14.961 33.8281 14.9219L37.5391 14.8828L37.9531 14.6563C38.1875 14.5235 38.4766 14.2891 38.6016 14.1328C39.0781 13.5235 39.0625 13.75 39.0625 8.27345C39.0625 4.62502 39.0391 3.1797 38.9688 2.95314C38.8438 2.53908 38.2891 1.9297 37.8281 1.70314L37.4609 1.52345L29.9219 1.51564C25.7734 1.50783 22.2578 1.52345 22.1094 1.56252ZM30.1953 3.21095C30.8047 3.32033 31.1875 3.52345 31.6875 3.9922C32.2891 4.56252 32.5391 5.16408 32.5391 6.01564C32.5391 6.93752 32.2578 7.52345 31.4766 8.21877C30.8281 8.78908 30.6641 9.07814 30.5938 9.75783C30.5391 10.3516 30.3984 10.5938 30.0234 10.75C29.6797 10.8985 29.2969 10.7891 29.0547 10.4844C28.9062 10.2969 28.8906 10.1953 28.9219 9.57033C28.9766 8.53908 29.4375 7.65627 30.2266 7.07033C31.0547 6.44533 31.0547 5.41408 30.2266 4.97658C29.5234 4.60939 28.5938 5.1797 28.5938 5.98439C28.5938 6.46877 28.0391 6.93752 27.5859 6.83595C27.4609 6.81252 27.2656 6.6797 27.1406 6.5547C26.9375 6.34377 26.9141 6.26564 26.9219 5.82814C26.9375 4.63283 27.9766 3.45314 29.2188 3.21095C29.7031 3.1172 29.6875 3.1172 30.1953 3.21095ZM30.0781 12.2266C30.3906 12.3906 30.5469 12.6406 30.5469 12.9922C30.5469 13.2344 30.4922 13.3516 30.2812 13.5625C30.0625 13.7813 29.9531 13.8281 29.6875 13.8281C28.9922 13.8281 28.5703 13 28.9922 12.4688C29.2734 12.1094 29.6797 12.0156 30.0781 12.2266Z" fill="white" />
                    <path d="M11.3359 8.71094C7.75 9.34375 4.66406 12.0703 3.47656 15.6484C2.99219 17.1172 2.96875 17.4297 2.96875 22.2812V26.6406H5.9375H8.90625V26.2656C8.90625 25.8906 8.89844 25.8828 8.47656 25.5938C8 25.2578 7.17969 24.4219 6.80469 23.8828C6.375 23.2578 5.92969 22.2656 5.72656 21.4922C5.44531 20.4375 5.42969 18.9531 5.69531 17.9297C5.95312 16.9219 6.34375 16.1406 6.70312 15.8984C7.03125 15.6797 7.16406 15.6562 9.45312 15.2969C10.9062 15.0703 11.2188 15.0469 12.8906 15.0391C14.6406 15.0391 14.8203 15.0547 16.6797 15.3359C17.7578 15.5 18.75 15.6953 18.8906 15.7578C19.4141 16.0078 19.8047 16.6719 20.125 17.8672C20.2422 18.2891 20.2734 18.6641 20.2656 19.7266C20.2656 20.9375 20.2422 21.1172 20.0547 21.7422C19.5781 23.3047 18.7031 24.5547 17.4453 25.4766C17.1953 25.6641 16.9844 25.8125 16.9844 25.8203C16.9766 25.8203 16.9453 26.0078 16.9141 26.2266L16.8594 26.6406H19.9141H22.9688V22.7891C22.9688 18.9766 22.9062 17.8906 22.6641 16.9766L22.5781 16.6719L22.0312 16.5859C21.2109 16.4531 20.3984 16.0391 19.8203 15.4531C18.8828 14.5 18.6719 13.8594 18.6719 11.9062V10.5625L18.4219 10.375C17.5859 9.74219 16.1953 9.10156 15.0547 8.82031C14.1953 8.60938 12.2656 8.55469 11.3359 8.71094Z" fill="white" />
                    <path d="M11.3279 16.7656C11.2185 16.7812 10.367 16.9062 9.43727 17.0469L7.74196 17.2891L7.5779 17.6797C7.16384 18.625 7.08571 20.0234 7.37477 21.1328C7.87477 23.0391 9.36696 24.5625 11.3279 25.1641C12.0857 25.3984 13.5857 25.4219 14.3748 25.2109C16.9763 24.5078 18.6091 22.3594 18.6013 19.6406C18.6013 18.6328 18.2888 17.2656 18.0623 17.2656C18.0232 17.2656 17.2888 17.1562 16.4373 17.0234C15.1404 16.8203 14.6091 16.7812 13.2029 16.7578C12.281 16.7422 11.4373 16.7422 11.3279 16.7656Z" fill="white" />
                    <path d="M10.625 28.6406C10.625 30.8359 10.6562 30.9766 11.2656 31.5234C11.75 31.9688 12.2031 32.1328 12.8906 32.1328C13.8203 32.1328 14.5703 31.6875 14.9531 30.9219C15.1562 30.5156 15.1562 30.5 15.1562 28.6172C15.1562 27.5703 15.1328 26.7188 15.1016 26.7188C15.0625 26.7188 14.8125 26.7969 14.5312 26.8828C13.6328 27.1797 11.9609 27.1172 10.7656 26.75C10.6328 26.7109 10.625 26.8359 10.625 28.6406Z" fill="white" />
                    <path d="M4.34375 31.2969C3.125 31.5938 1.99219 32.4922 1.46094 33.5938C0.992188 34.5547 0.9375 34.8984 0.9375 36.8125V38.5156H12.9375H24.9375L24.9062 36.6953C24.875 34.9531 24.8672 34.8594 24.6562 34.2578C24.3984 33.5156 23.875 32.6953 23.375 32.2656C22.9062 31.8516 21.8906 31.3594 21.2969 31.2578C21.0391 31.2109 19.8906 31.1719 18.7422 31.1719H16.6484L16.3672 31.7109C15.6406 33.0859 14.4219 33.8281 12.8906 33.8281C11.3359 33.8281 10.0781 33.0547 9.35156 31.6641L9.10156 31.1719L6.95312 31.1797C5.375 31.1797 4.67969 31.2109 4.34375 31.2969Z" fill="white" />
                  </g>
                  <defs>
                    <clipPath id="clip0_142_3297">
                      <rect width="36" height="36" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <h3 className="feature-title">CPL / ATPL Question training</h3>
              <p className="feature-description">Your trusted question bank for CPL and ATPL exams. Practice real-exam questions, deepen your knowledge, and boost your readiness for success.</p>
            </div>
            <div className="feature-card">
              <div className="iconWrapper2">
                {/* SVG for Psychometric Training */}
                <svg width="35" height="30" viewBox="0 0 39 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.1828 0.249023C10.1926 0.785156 6.77365 3.30762 6.10568 6.22559C6.02658 6.54199 5.88595 7.36816 5.78927 8.07129C5.56076 9.63574 5.41134 10.2246 5.0422 11.0068C4.62912 11.8945 4.39181 12.1934 2.1506 14.5928C1.04318 15.7793 0.0939586 16.8164 0.0500133 16.8955C0.00606798 16.9746 -0.00272108 17.1768 0.0324352 17.3525C0.0763805 17.625 0.181849 17.7217 0.937709 18.1963C3.10861 19.5762 3.06466 19.5498 3.5129 20.3936C3.86447 21.0703 3.96994 21.2021 4.40939 21.4746C4.97189 21.8262 5.05978 22.0107 4.86642 22.3887C4.74337 22.6348 4.73458 22.7227 4.83126 23.1006C4.92794 23.4785 4.91915 23.751 4.76095 25.0342C4.56759 26.6514 4.59396 27.0381 4.91915 27.5039C5.16525 27.8467 5.70138 28.1016 6.18478 28.1016C6.40451 28.1016 7.6965 27.9258 9.05001 27.7061C10.4035 27.4863 11.6692 27.3105 11.8537 27.3105C12.2932 27.3105 12.7766 27.7148 12.9084 28.1719C12.9524 28.3564 13.0139 29.4727 13.049 30.6768L13.1106 32.8477H18.8586H24.5979V32.6455C24.5979 32.54 24.5012 31.9336 24.3869 31.3096C23.9826 29.1914 23.9123 27.1172 24.176 25.5264L24.2727 24.9375H28.1662H32.051L32.3147 25.4033C32.6574 26.001 33.176 26.4756 33.9055 26.8184C34.4328 27.0645 34.5647 27.0908 35.3733 27.0908C36.2082 27.0908 36.2785 27.0732 36.9201 26.7656C38.0891 26.1855 38.801 25.1396 38.8977 23.8564C38.9504 23.2061 38.757 22.2129 38.5813 22.2129C38.5373 22.2129 37.8781 22.96 37.1223 23.8828C35.5754 25.7549 35.3996 25.9307 35.1184 25.8252C34.8635 25.7285 33.3957 23.7246 33.3869 23.4609C33.3869 23.2324 33.677 22.916 33.8967 22.916C34.0813 22.916 34.3274 23.1709 34.8723 23.9092C35.0744 24.1904 35.2766 24.4102 35.3205 24.3926C35.4699 24.3398 38.924 20.0771 38.9768 19.8838C39.0471 19.6201 38.9504 19.3213 38.7219 19.0664C38.5901 18.9258 38.4406 18.873 38.1506 18.873C37.7287 18.873 37.7902 18.8291 36.8498 19.9102L36.5949 20.2002L36.0061 20.0947C34.1428 19.752 32.385 20.9033 31.9279 22.7666L31.7785 23.3555H24.844H17.9094L16.5383 21.2549L15.1584 19.1543L14.4026 19.0576C9.28732 18.3984 6.60665 12.7295 9.39279 8.4668C10.5266 6.72656 12.3283 5.61035 14.4289 5.33789C15.1057 5.24121 15.2287 5.25 15.4133 5.37305L15.633 5.51367V8.79199V12.0615L17.3469 14.7773C18.3049 16.2891 19.0608 17.5898 19.0608 17.7041C19.0608 18.0381 18.1467 18.5391 16.9162 18.873C16.5822 18.9697 16.2922 19.0664 16.2658 19.084C16.2483 19.1104 16.7141 19.8838 17.3117 20.8066L18.4016 22.4766L21.8117 22.4502L25.2131 22.4326L25.9514 20.8945C26.7776 19.1719 27.2258 18.0293 27.5246 16.8779C27.6301 16.4561 27.7531 16.0518 27.7883 15.9902C27.841 15.9111 28.3684 15.8848 29.9152 15.8848H31.9719L32.2795 16.3594C33.1233 17.6777 34.4592 18.3105 35.9006 18.082C37.676 17.8008 38.9416 16.2979 38.9152 14.5225C38.9065 13.9248 38.7307 13.3008 38.5725 13.2744C38.4934 13.2656 37.8342 13.9951 36.9992 15.0146C36.2082 15.9902 35.5051 16.7988 35.426 16.8252C35.3557 16.8516 35.2063 16.8428 35.092 16.7988C34.8283 16.7021 33.3869 14.6982 33.3869 14.4346C33.3869 14.1973 33.6418 13.9512 33.8967 13.9512C34.134 13.9512 34.2922 14.1094 34.7844 14.8125C34.9953 15.1113 35.2238 15.3574 35.2854 15.3574C35.4436 15.3574 38.8625 11.1914 38.9592 10.875C39.1262 10.3037 38.5988 9.75 37.9924 9.86426C37.7551 9.9082 37.5705 10.0576 37.1399 10.5762C36.7004 11.1035 36.5598 11.2266 36.4192 11.1826C36.3225 11.1475 35.927 11.1035 35.5402 11.0771C33.7649 10.9629 32.2619 12.123 31.8928 13.8809L31.7961 14.3906H28.342H24.8879L24.4836 15.1992C24.2639 15.6475 23.8684 16.2803 23.6047 16.5967C23.1037 17.1943 22.0227 18.082 21.7766 18.082C21.7063 18.082 21.5569 17.9941 21.4602 17.8799C21.2668 17.6777 17.9797 12.4922 17.8918 12.2549C17.8654 12.1758 17.9182 12.0176 18.0149 11.8945L18.1906 11.666H21.5129C25.5119 11.666 25.257 11.5957 25.1955 12.6855L25.1604 13.4238H26.6194H28.0871L28.1486 13.0195C28.2453 12.2637 28.2014 10.0576 28.0695 9.20508C27.9904 8.74805 27.8235 8.04492 27.6916 7.64941L27.4455 6.91992H29.757H32.0686L32.2444 7.27148C32.8596 8.48438 34.1692 9.1875 35.6281 9.09961C36.9377 9.01172 37.9485 8.32617 38.5461 7.11328C38.8625 6.48926 38.8801 6.39258 38.8801 5.6543C38.8801 4.90723 38.7307 4.19531 38.5813 4.19531C38.5461 4.19531 37.843 5.00391 37.0256 5.99707C36.217 6.99023 35.4699 7.8252 35.382 7.85156C35.2942 7.87793 35.136 7.84277 35.0305 7.77246C34.7844 7.60547 33.3869 5.67188 33.3869 5.4873C33.3869 5.23242 33.5012 5.05664 33.7209 4.97754C34.0197 4.86328 34.2219 5.0127 34.7492 5.75977C34.9953 6.10254 35.2326 6.38379 35.2766 6.39258C35.3733 6.39258 38.7395 2.34961 38.9152 2.00684C39.1877 1.49707 38.757 0.855469 38.1418 0.855469C37.7551 0.864258 37.6584 0.925781 37.052 1.66406C36.7883 1.98926 36.5598 2.23535 36.5422 2.21777C36.5158 2.2002 36.2434 2.13867 35.927 2.09473C34.5119 1.86621 33.0002 2.56934 32.2795 3.80859C32.1652 4.00195 32.007 4.43262 31.9279 4.74902L31.7785 5.33789H27.9289C25.7317 5.33789 24.0617 5.37305 24.0354 5.41699C24.009 5.46094 24.1408 5.79492 24.3254 6.16406C24.7209 6.9375 25.0022 7.93066 25.0813 8.80957C25.1779 9.84668 25.4504 9.77637 21.5217 9.80273C18.5949 9.82031 18.1291 9.81152 17.9533 9.68848L17.7424 9.55664V6.16406C17.7424 4.00195 17.7776 2.71875 17.8303 2.60449C18.0324 2.23535 19.8518 2.48145 21.0735 3.05273C21.6623 3.33398 22.594 3.95801 22.8752 4.27441C23.0334 4.4502 23.1301 4.45898 24.3957 4.45898C25.4944 4.45898 25.7404 4.43262 25.7404 4.33594C25.7404 4.15137 24.4924 3.03516 23.675 2.49023C22.2424 1.52344 20.4934 0.802734 18.6652 0.416016C17.6545 0.205078 15.1936 0.108398 14.1828 0.249023Z" fill="white" />
                </svg>
              </div>
              <h3 className="feature-title">Psychometric Training</h3>
              <p className="feature-description">Practice ADAPT, Cut-E, COMPASS, PILAPT and Mollymawk tests covering key competencies and enhance your psychometric skills.</p>
            </div>
            <div className="feature-card">
              <div className="iconWrapper2">
                {/* SVG for Personalised Dashboard */}
                <svg width="35" height="33" viewBox="0 0 35 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.7959 0.181377C20.5587 0.383702 20.4262 0.753468 20.489 1.06044C20.5448 1.33951 20.8727 1.64649 21.1797 1.70928L21.4378 1.75811L18.5494 4.64647C16.9588 6.23716 15.6402 7.53483 15.6053 7.53483C15.5774 7.53483 14.6006 6.68367 13.4425 5.63716C12.2844 4.59763 11.2169 3.63485 11.0704 3.50927C10.8541 3.31392 10.7565 3.27904 10.4704 3.27904C10.2262 3.27904 10.0797 3.3209 9.9332 3.43252C9.64716 3.65578 2.49603 10.1162 1.97278 10.6255C1.64487 10.9464 1.53324 11.1069 1.49836 11.3092C1.44255 11.6302 1.60301 12.0069 1.86813 12.1813C2.14022 12.3557 2.60766 12.3348 2.87975 12.1395C2.99835 12.0418 4.74253 10.486 6.74485 8.67203C8.74716 6.85809 10.4146 5.37205 10.4495 5.37205C10.4844 5.37205 11.5588 6.31391 12.8355 7.46506C14.4192 8.88831 15.2355 9.57901 15.396 9.62087C15.9262 9.76738 15.9122 9.78133 19.4494 6.25809C22.3099 3.39764 22.7424 2.99299 22.7424 3.16043C22.7424 3.57903 23.1471 3.97671 23.5727 3.97671C23.8308 3.97671 24.1727 3.79531 24.3122 3.58601C24.4308 3.41159 24.4517 3.2302 24.4727 2.24648C24.5076 0.781374 24.4727 0.530212 24.1727 0.230214L23.9424 -1.71661e-05H22.4773H21.0122L20.7959 0.181377Z" fill="white" />
                  <path d="M19.9026 8.37209C19.8189 8.40697 19.7212 8.49767 19.6794 8.57441C19.5817 8.75581 19.5747 17.8604 19.6724 17.8604C19.7073 17.8604 19.9654 17.7139 20.2445 17.5325C21.1375 16.9534 22.3445 16.5 23.4747 16.3046L24.0328 16.2139V12.3976C24.0328 8.83255 24.0259 8.58139 23.9073 8.46278C23.7956 8.35116 23.6073 8.3372 21.9189 8.32325C20.8933 8.31627 19.9864 8.3372 19.9026 8.37209Z" fill="white" />
                  <path d="M7.93078 10.8697C7.81915 10.9883 7.81217 11.5604 7.81217 17.672V24.3487H7.04473H6.2773V20.2743V16.1929L6.12381 16.0883C5.99125 15.9906 5.6773 15.9767 4.07265 15.9767H2.16801L2.02848 16.1581C1.88197 16.3394 1.88197 16.4022 1.88197 20.3441V24.3487H1.25406C0.570346 24.3487 0.298254 24.4324 0.109883 24.7115C-0.0366277 24.9138 -0.0366277 25.5278 0.109883 25.7301C0.374998 26.1068 -0.0156976 26.0929 8.30752 26.0929H15.9889L15.94 25.6185C15.8842 25.0185 16.0098 23.7976 16.2261 22.9743C16.5191 21.8301 17.161 20.5255 17.8307 19.7092L18.1377 19.3255V16.479C18.1377 14.0162 18.1238 13.6116 18.0261 13.479C17.9214 13.3255 17.9075 13.3255 15.94 13.3255C14.2377 13.3255 13.9447 13.3395 13.854 13.4371C13.7563 13.5348 13.7424 14.1278 13.7424 18.9487V24.3487H12.9749H12.2075V17.665C12.2075 11.2744 12.2005 10.9674 12.0819 10.8627C11.9703 10.7581 11.7191 10.7441 9.99588 10.7441C8.19589 10.7441 8.03543 10.7511 7.93078 10.8697Z" fill="white" />
                  <path d="M26.8722 15.7325C26.7188 15.9279 26.7188 15.9348 26.7188 19.5278C26.7188 22.6743 26.7327 23.1488 26.8304 23.2883L26.935 23.4418H30.6885C33.9536 23.4418 34.4559 23.4278 34.5327 23.3371C34.6652 23.1767 34.5815 21.8581 34.4001 21.1395C34.2117 20.3999 33.6117 19.1581 33.1513 18.5581C31.8257 16.8069 29.8792 15.7534 27.6467 15.586C27.0257 15.5372 27.0187 15.5372 26.8722 15.7325Z" fill="white" />
                  <path d="M23.4475 17.9371C18.7591 18.9208 16.1987 24.0557 18.2359 28.3673C18.9894 29.951 20.1824 31.1719 21.7173 31.9184C23.3917 32.7277 25.4707 32.8812 27.2428 32.3231C28.4498 31.9394 29.4893 31.2836 30.4033 30.3138C31.6172 29.0231 32.287 27.4812 32.4195 25.6743C32.4893 24.6836 32.8102 24.7673 28.8126 24.7673H25.4707L25.4498 21.3766C25.4289 18.1185 25.4219 17.9859 25.2963 17.8883C25.101 17.7487 24.2428 17.7697 23.4475 17.9371Z" fill="white" />
                </svg>
              </div>
              <h3 className="feature-title">Personalised Dashboard</h3>
              <p className="feature-description">Discover your strengths and weaknesses with algorithm-driven insights. Pinpoint areas for improvement, focus on key topics, and track progress for optimal exam readiness.</p>
            </div>
            <div className="feature-card">
              <div className="iconWrapper2">
                {/* SVG for Practice Everywhere */}
                <svg width="32" height="28" viewBox="0 0 36 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M32.625 0.25H3.375C1.51172 0.25 0 1.76173 0 3.625V28.375C0 30.2383 1.51172 31.75 3.375 31.75H32.625C34.4883 31.75 36 30.2383 36 28.375V3.625C36 1.76173 34.4883 0.25 32.625 0.25ZM31.5 11.5H4.5V5.59375C4.5 5.1297 4.87968 4.75 5.34375 4.75H30.6563C31.1203 4.75 31.5 5.1297 31.5 5.59375V11.5Z" fill="white" />
                </svg>
              </div>
              <h3 className="feature-title">Practice Everywhere</h3>
              <p className="feature-description">Practice ATPL, Reasoning, Math, Physics, HR interviews, Aviation English and our Personality Test, all with detailed explanations.</p>
            </div>
            <div className="feature-card">
              <div className="iconWrapper2">
                {/* SVG for Progress Tracking and Analytics */}
                <svg width="32" height="38" viewBox="0 0 32 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.30499 0.671912C6.53936 1.00785 5.08624 2.23441 4.45342 3.92973C4.24249 4.50785 4.10186 5.50004 4.16436 6.00785C4.35186 7.5391 5.76592 9.99223 8.21124 13.0469C9.17999 14.2579 9.29717 14.2657 10.1253 13.2735C11.9534 11.086 13.594 8.51566 14.1331 7.00785C14.3597 6.3516 14.4144 5.2266 14.2503 4.50785C14.0315 3.57035 13.6253 2.87504 12.8753 2.11723C12.1644 1.39847 11.4847 0.992225 10.6097 0.75785C9.98467 0.585975 8.94561 0.546912 8.30499 0.671912ZM10.3128 3.19535C11.5394 3.74223 12.1644 5.21098 11.7034 6.46098C11.469 7.07816 10.7581 7.80473 10.1565 8.01566C8.66436 8.5391 7.08624 7.65629 6.72686 6.09379C6.53155 5.25004 6.79717 4.40629 7.46905 3.74223C8.02374 3.20316 8.60967 2.96879 9.35967 3.00785C9.72686 3.02348 10.0784 3.09379 10.3128 3.19535Z" fill="white" />
                  <path d="M15.2419 1.26567C14.9997 1.35942 14.9372 1.68754 15.0856 2.00786C15.4059 2.67973 16.2497 2.29692 15.9606 1.61723C15.8981 1.45317 15.7653 1.31254 15.6481 1.26567C15.5309 1.21879 15.4372 1.18754 15.4294 1.19536C15.4216 1.19536 15.3356 1.22661 15.2419 1.26567Z" fill="white" />
                  <path d="M15.8205 2.7344C15.6486 2.9219 15.6486 3.01565 15.8908 3.82034C16.1642 4.75784 16.2111 5.71878 16.0392 6.57815C15.8048 7.7344 15.8048 7.7969 16.0314 7.94534C16.3205 8.14065 16.6095 8.0469 16.7501 7.71097C17.0705 6.94534 17.1955 5.22659 17.008 4.2969C16.883 3.6719 16.6173 2.88284 16.4845 2.72659C16.3283 2.55472 15.9845 2.55472 15.8205 2.7344Z" fill="white" />
                  <path d="M24.1406 8.92191C21.6875 9.57035 18.3594 12.211 14.4688 16.6172C12.4375 18.9141 9.99219 22.2266 8.69531 24.4297C8.35938 24.9922 8.21875 25.1719 8.125 25.1407C8.05469 25.1172 6.92969 24.9219 5.625 24.7032C4 24.4297 3.21875 24.336 3.125 24.3829C2.89844 24.5079 2.25 25.2344 2.25 25.3672C2.25 25.4375 2.28125 25.5547 2.32031 25.6329C2.36719 25.711 3.38281 26.3594 4.59375 27.086C6.54688 28.2579 6.78906 28.4219 6.74219 28.5625C6.71094 28.6563 6.67188 29.0391 6.64844 29.4297L6.60938 30.1329L5.91406 30.8438C5.19531 31.586 5.10156 31.7813 5.32812 32.086C5.39062 32.1719 5.53125 32.2266 5.67969 32.2266C5.89062 32.2266 6.03906 32.125 6.57031 31.6016C7.15625 31.0235 7.22656 30.9766 7.40625 31.0469C7.52344 31.0938 7.875 31.1016 8.26562 31.0704C8.63281 31.0391 9.02344 31.0157 9.14062 31.0079C9.34375 30.9922 9.4375 31.1329 10.6719 33.1797L11.9844 35.3672L12.2812 35.3907C12.5469 35.4141 12.6172 35.375 12.9609 35.0313C13.2891 34.7032 13.3438 34.6016 13.3438 34.3438C13.3438 34.1797 13.1641 33.0079 12.9531 31.75C12.7344 30.4844 12.5625 29.4375 12.5781 29.4297C12.5938 29.4219 12.9688 29.1875 13.4219 28.9219C17.7812 26.3047 23.2344 21.6954 26.0703 18.2188C28.9766 14.6641 29.6953 11.9375 28.2188 10.0704C27.8203 9.55473 27.1016 9.05473 26.5156 8.88285C25.9688 8.71879 24.8438 8.74223 24.1406 8.92191ZM24.5859 11.6797C25.3125 12.0157 26.2344 13.1954 26.2344 13.7969C26.2344 14.0235 25.9766 14.2344 25.7656 14.1797C25.6719 14.1563 25.5078 13.9141 25.3359 13.5704C25.0234 12.9219 24.6094 12.5157 24.0547 12.3125C23.4922 12.1016 23.3672 11.8672 23.6641 11.5704C23.8438 11.3907 24 11.4063 24.5859 11.6797ZM17.3125 16.9844C17.4688 17.1407 17.4141 17.4219 17.1641 17.7032C16.8672 18.0469 16.6562 18.1172 16.4609 17.9375C16.2422 17.7344 16.2812 17.5157 16.6016 17.1875C16.8984 16.8829 17.1406 16.8125 17.3125 16.9844ZM15.875 18.7032C15.9453 18.7969 16 18.9063 16 18.9297C16 18.961 15.5547 19.5391 15.0078 20.2266C13.9062 21.6016 13.25 22.4844 12.4453 23.6485C11.8906 24.461 11.7422 24.625 11.5703 24.625C11.4531 24.625 11.1562 24.3516 11.1562 24.2422C11.1562 24.0235 13.2734 21.1094 14.6641 19.4063C15.4297 18.4688 15.6328 18.3516 15.875 18.7032Z" fill="white" />
                  <path d="M30.2968 8.92192C29.9999 8.99223 29.9218 9.31254 30.1015 9.71098C30.1874 9.89067 30.2968 10.086 30.3593 10.1407C30.4921 10.2735 30.9374 10.2813 31.0624 10.1563C31.2109 10.0079 31.1718 9.61723 30.9765 9.28129C30.789 8.94536 30.5937 8.84379 30.2968 8.92192Z" fill="white" />
                  <path d="M2.44531 10.9063C2.32031 10.9688 1.78125 11.4531 1.25781 11.9844C0.320313 12.9375 0.296875 12.9688 0.296875 13.3047C0.296875 13.5 0.359375 13.75 0.4375 13.8828C0.546875 14.0547 1.84375 14.875 5.53125 17.0859C8.25 18.7188 10.5156 20.0625 10.5703 20.0781C10.6172 20.0938 10.9141 19.7734 11.2109 19.3672C12.4219 17.7578 13.8438 16.1016 15.5391 14.3047C16.2266 13.5703 16.5859 13.1406 16.5156 13.1172C16.4609 13.0938 16.2109 13.0547 15.9688 13.0234C15.6016 12.9766 15.5313 12.9453 15.5703 12.8359C15.7266 12.4609 15.7578 12.2266 15.6875 11.9688C15.5156 11.3281 14.6563 10.9141 14.1016 11.1953C14.0078 11.2422 13.6641 11.5469 13.3281 11.8672L12.7344 12.4609L12.3047 12.4063L11.875 12.3516L11.2656 13.1172C10.1094 14.5625 9.85156 14.7813 9.24219 14.7813C8.61719 14.7813 8.19531 14.3672 6.52344 12.1484C6.15625 11.6641 5.85156 11.3281 5.74219 11.3047C5.4375 11.2344 2.84375 10.7969 2.75781 10.7969C2.71875 10.8047 2.57813 10.8516 2.44531 10.9063Z" fill="white" />
                  <path d="M30.8363 11.0078C30.7582 11.1016 30.7269 11.4219 30.7191 12.1953C30.7113 13.3828 30.5785 14.0156 30.0941 15.1328C29.7035 16.0625 29.7426 16.4219 30.2582 16.4219C30.5551 16.4219 30.6722 16.2969 30.9379 15.6797C31.4847 14.4062 31.7426 13.1719 31.6879 11.9844C31.6644 11.3594 31.6332 11.1641 31.516 11.0391C31.3363 10.8437 30.9847 10.8281 30.8363 11.0078Z" fill="white" />
                  <path d="M1.82818 17.0938C1.63287 17.2813 1.67193 17.6328 1.9063 17.8203C2.30474 18.1328 2.79693 17.9531 2.79693 17.4922C2.79693 17.086 2.11724 16.8047 1.82818 17.0938Z" fill="white" />
                  <path d="M2.9609 17.7734C2.87496 17.8828 2.84371 18.0703 2.85934 18.3125C2.87496 18.4297 6.12496 20.5469 6.56246 20.7109C6.86715 20.8281 7.12496 20.6641 7.15621 20.3203C7.17184 20.1328 7.13278 20.0078 7.03903 19.9219C6.9609 19.8594 6.13278 19.3203 5.19528 18.7344C3.49215 17.6719 3.17184 17.5313 2.9609 17.7734Z" fill="white" />
                  <path d="M23.4222 22.1485C22.1722 23.3672 20.4925 24.8203 18.8128 26.125C18.1488 26.6485 17.6097 27.1094 17.6253 27.1563C17.6644 27.2891 23.5081 36.9922 23.641 37.1406C23.805 37.336 24.2503 37.461 24.5706 37.3985C24.7894 37.3594 25.0472 37.1563 25.7503 36.4766C26.2347 35.9922 26.6878 35.5078 26.7503 35.3906C26.9066 35.086 26.891 34.7891 26.5863 32.961L26.305 31.3125L26.8831 30.7266C27.2035 30.3985 27.5081 30.0547 27.555 29.961C27.7581 29.5625 27.6019 28.8906 27.2269 28.5391C26.9691 28.3047 26.4144 28.2344 26.0863 28.3985C25.8128 28.5391 25.8597 28.6641 25.5785 27.0313L25.3988 25.961L26.016 25.3516C26.68 24.6953 26.8206 24.3985 26.7113 23.9219C26.6175 23.5078 26.4847 23.3047 26.2113 23.1406C25.9144 22.9531 25.3206 22.9375 25.0941 23.1016C24.93 23.211 24.9222 23.1953 24.8363 22.6485C24.6331 21.3906 24.5785 21.1094 24.5238 21.1094C24.5003 21.1172 24.0003 21.5781 23.4222 22.1485Z" fill="white" />
                </svg>
              </div>
              <h3 className="feature-title">Progress Tracking and Analytics</h3>
              <p className="feature-description">Practice Cut-E, COMPASS, PILAPT and Mollymawk tests covering key competencies and enhance your psychometric skills.</p>
            </div>
            <div className="feature-card">
              <div className="iconWrapper2">
                {/* SVG for User Friendly */}
                <svg width="21" height="31" viewBox="0 0 21 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.68225 0.114178C4.25824 0.277723 3.80395 0.719902 3.59195 1.16814L3.42234 1.53157L3.40417 7.75842L3.39206 13.9792L1.69603 16.5475L0 19.1097V24.9307C0 30.679 0 30.7578 0.121145 30.8789C0.24229 31.0001 0.321034 31.0001 4.38544 31.0001H8.53466L8.6558 30.8426C8.77695 30.6911 8.783 30.6063 8.783 29.3404V28.0017L9.52804 27.2627L10.267 26.5177L14.8402 26.5056L19.4135 26.4874L19.8193 26.2875C20.3039 26.0513 20.6613 25.6697 20.8369 25.2033C20.9581 24.8762 20.9581 24.8277 20.9459 13.1433L20.9278 1.41043L20.7703 1.10756C20.5643 0.72596 20.1706 0.332237 19.8132 0.156578L19.5346 0.0172615L12.2659 0.00514603C5.12443 -0.00696754 4.99117 -0.00696754 4.68225 0.114178ZM19.9283 13.2523V23.0045H13.6833C8.18939 23.0045 7.44435 22.9924 7.47464 22.9136C7.49281 22.8652 7.97739 22.0293 8.55888 21.0541C10.2186 18.2556 10.2367 18.2253 10.3397 17.8316C10.5941 16.8443 10.0914 15.7903 9.15855 15.33C8.84963 15.1785 8.74666 15.1604 8.20756 15.1604C7.66847 15.1604 7.5655 15.1785 7.25658 15.33C6.7296 15.5904 6.42068 15.9902 5.397 17.7286C4.88214 18.5948 4.45813 19.3096 4.44602 19.3096C4.4339 19.3096 4.42179 15.754 4.42179 11.4049V3.50018H12.1751H19.9283V13.2523Z" fill="white" />
                  <path d="M11.7991 5.49901C11.1571 5.60804 10.4241 6.22588 10.091 6.92246C9.32777 8.5458 9.90927 10.6477 11.3085 11.3018C11.6114 11.4412 11.7386 11.4654 12.205 11.4654C12.6774 11.4654 12.7986 11.4412 13.0893 11.3018C14.216 10.7446 14.858 9.22421 14.5673 7.7947C14.2523 6.21376 13.1136 5.26883 11.7991 5.49901Z" fill="white" />
                  <path d="M11.0239 12.4649C9.35811 12.6527 8.01946 13.1494 7.40768 13.8157C7.18356 14.058 7.03818 14.3184 7.09876 14.3729C7.11087 14.3911 7.26836 14.3608 7.45008 14.3124C7.83774 14.2094 8.51615 14.1973 8.90382 14.2881C9.37628 14.3972 9.92143 14.7 10.3333 15.0816C10.83 15.548 11.1692 16.2083 11.2783 16.8988L11.3509 17.3713H12.417H13.4891L13.5558 17.1411C13.6588 16.8019 14.0464 16.2325 14.3977 15.9054C14.7612 15.5723 15.2821 15.2936 15.7546 15.1907C16.0938 15.1119 16.966 15.1362 17.2507 15.221C17.3779 15.2634 17.384 15.2512 17.384 14.8818C17.384 13.7309 16.2815 12.9555 14.113 12.58C13.3014 12.4407 11.7871 12.3862 11.0239 12.4649Z" fill="white" />
                  <path d="M15.8092 16.0932C15.2338 16.2809 14.7613 16.6868 14.4948 17.238C14.3494 17.5408 14.3252 17.6559 14.3252 18.1284C14.3252 18.6251 14.3434 18.7159 14.5251 19.0794C14.7553 19.5458 15.0824 19.8668 15.5609 20.0849C16.0515 20.3151 16.7844 20.3151 17.2751 20.0849C17.7294 19.8729 18.111 19.5155 18.329 19.0854C18.4865 18.7705 18.5047 18.6735 18.5047 18.1587C18.5047 17.6862 18.4805 17.5287 18.3654 17.2864C18.1594 16.8261 17.8566 16.505 17.4326 16.2809C17.0934 16.0932 16.9904 16.075 16.5058 16.0568C16.209 16.0508 15.894 16.0629 15.8092 16.0932ZM16.6693 16.6686C16.8208 16.7776 16.8995 17.032 16.8995 17.3773V17.6741H17.2327C17.6264 17.6741 17.8323 17.7589 17.9232 17.9588C18.0201 18.1768 18.008 18.2677 17.8384 18.4312C17.7112 18.5585 17.6385 18.5827 17.3054 18.5827H16.9177L16.8874 19.0067C16.8511 19.4489 16.7844 19.5882 16.5482 19.679C16.3847 19.7396 16.0879 19.6185 16.0273 19.461C16.0091 19.4065 15.9909 19.1823 15.9909 18.9703V18.5827H15.573C15.1066 18.5827 14.937 18.4918 14.8643 18.2071C14.834 18.0739 14.8643 18.0072 15.0097 17.8558C15.1793 17.6923 15.2277 17.6741 15.5912 17.6741H15.9909V17.2683C15.9909 16.9351 16.0152 16.8382 16.1242 16.7231C16.2696 16.5717 16.5119 16.5414 16.6693 16.6686Z" fill="white" />
                </svg>
              </div>
              <h3 className="feature-title">User Friendly</h3>
              <p className="feature-description">Practice Cut-E, COMPASS, PILAPT and Mollymawk tests covering key competencies and enhance your psychometric skills.</p>
            </div>
          </div>
        </div>
        <button class="prev-btn" onClick={prevSlide}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="feather feather-arrow-left"
          >
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <button class="next-btn" onClick={nextSlide}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="feather feather-arrow-right"
          >
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </div>

      {/*about section */}
      <div id="about" className="about-container">
        <img src={aboutborder} alt="Zigzag Border" className="zigzag-border" />

        <div className="about-background">
          <div className="about-section">
            <div className="about-content">
              <h2 className="about-heading">About Us</h2>
              <hr className="divider-line2" />
              <h3 className="about-title">
                Welcome to The Pilot Prep: Your Global Guide to Success in Aviation
              </h3>
              <p className="about-description">
                Access the most comprehensive and updated database of CPL as well as ATPL MCQs, encompassing all essential topics. Our extensive resource collection provides premier study materials for pilot examinations globally.
              </p>
            </div>
            <div className="about-image-container">
              <div className="about-image-background"></div>
              <img src={aboutImage} alt="About Us" className="about-image" />
              <div className="help-card">
                <h3 className='helptext1'>Looking for help?</h3>
              </div>
              <button
                className="help-card2"
                onClick={() => {
                  const phoneNumber = "+917600534858"; // Replace with your WhatsApp number
                  const message = "Hello, I need assistance."; // Predefined message (optional)
                  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
                  window.open(whatsappLink, "_blank"); // Open WhatsApp link in a new tab
                }}
              >
                <h5 className="helptext">CONTACT US</h5>
              </button>
            </div>
          </div>
        </div>
      </div>


      {/*why choose us*/}
      <div id="whychooseus" className="why-choose-section">
        <h2 className="why-choose-heading">Why Choose The Pilot Prep?</h2>
        <hr className="divider-line" />
        <div className="why-choose-content">
          <div className="why-choose-text">
            <div className="feature-wcs">
              <h3 className="feature-title-wcs">World’s Largest Question Database</h3>
              <p className="feature-description-wcs feature-description-wcs">Access the most comprehensive and up-to-date CPL and ATPL ground subject MCQs, expertly covering all essential topics. Our database is the top resource for pilot exams worldwide.</p>
            </div>
            <div className="feature-wcs">
              <h3 className="feature-title-wcs">Expert-Curated Content</h3>
              <p className="feature-description-wcs feature-description-2-wcs">Our questions are compiled by aviation experts to ensure you’re fully prepared for any test, from foundational assessments to advanced airline qualification exams.</p>
            </div>
            <div className="feature-wcs">
              <h3 className="feature-title-wcs">Personalized Learning Insights</h3>
              <p className="feature-description-wcs feature-description-2-wcs">Our intelligent algorithms analyze your performance, helping you identify areas for improvement and adjust your study strategy for maximum success.</p>
            </div>
            <div className="feature">
              <h3 className="feature-title-wcs">AI Integrated</h3>
              <p className="feature-description-wcs feature-description-2-wcs">Now at each step, our AI ‘preppy’ will help solve your doubts instantly.</p>
            </div>
          </div>
          <div className="why-choose-image">
            <img src={studentImage} alt="Student" className="student-image" />
            <div className="satisfaction-badge">100% Student Satisfaction</div>
          </div>
        </div>
      </div>

      {/*what people say*/}
      <div  id="Testimonials" className="testimonial-section">
        <svg className="background-svg-2" width="262" height="225" viewBox="0 0 262 225" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M120.545 224.253V122.995C120.545 76.3848 110.5 37.8104 90.4089 7.27241C69.5145 -23.2656 39.3783 -43.3564 0.000335693 -53V-10.8094C24.1093 -4.38029 41.3874 7.67419 51.8346 25.3541C62.2818 42.2304 68.309 64.3303 69.9163 91.6537H24.1093V224.253H120.545ZM261.362 224.253V122.995C261.362 76.3848 251.317 37.8104 231.226 7.27241C210.332 -23.2656 180.195 -43.3564 140.818 -53V-10.8094C164.926 -4.38029 182.205 7.67419 192.652 25.3541C203.099 42.2304 209.126 64.3303 210.733 91.6537H164.926V224.253H261.362Z" fill="url(#paint0_linear_142_3190)" fill-opacity="0.5" />
          <defs>
            <linearGradient id="paint0_linear_142_3190" x1="244.865" y1="208.929" x2="0.740888" y2="-56.4224" gradientUnits="userSpaceOnUse">
              <stop stop-color="#E8F1FF" />
              <stop offset="1" stop-color="#F7FAFF" />
            </linearGradient>
          </defs>
        </svg>

        <svg className="background-svg-1" width="262" height="278" viewBox="0 0 262 278" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M140.817 277.253V175.995C140.817 129.385 150.863 90.8104 170.953 60.2724C191.848 29.7344 221.984 9.64355 261.362 0V42.1906C237.253 48.6197 219.975 60.6742 209.528 78.3541C199.08 95.2304 193.053 117.33 191.446 144.654H237.253V277.253H140.817ZM0 277.253V175.995C0 129.385 10.0454 90.8104 30.1362 60.2724C51.0306 29.7344 81.1668 9.64355 120.545 0V42.1906C96.4358 48.6197 79.1577 60.6742 68.7105 78.3541C58.2633 95.2304 52.2361 117.33 50.6288 144.654H96.4358V277.253H0Z" fill="url(#paint0_linear_142_3189)" fill-opacity="0.5" />
          <defs>
            <linearGradient id="paint0_linear_142_3189" x1="16.4977" y1="261.929" x2="260.621" y2="-3.42244" gradientUnits="userSpaceOnUse">
              <stop stop-color="#E8F1FF" />
              <stop offset="1" stop-color="#F7FAFF" />
            </linearGradient>
          </defs>
        </svg>
        <div className="testimonial-header">
          <h2 className="testimonial-title">What people say</h2>
          <p className="testimonial-subtitle">Our customers are our top priority<br></br> Let’s hear what they have to say.</p>
        </div>
        <div className="testimonial-cards">

          <div className="testimonial-card testimonial-card-fl">
            {/* <img src="path/to/logo1.png" alt="Company Logo" className="company-logo" /> */}
            <div className="profile-icon">
              <svg width="20px" height="20px" viewBox="0 0 61.80355 61.80355" xmlns="http://www.w3.org/2000/svg">

                <title />

                <g data-name="Layer 2" id="Layer_2">

                  <g data-name="—ÎÓÈ 1" id="_ÎÓÈ_1">

                    <circle cx="30.8999" cy="30.8999" fill="#9f82bb" r="30.8999" />

                    <path d="M23.255 38.68l15.907.121v12.918l-15.907-.121V38.68z" fill="#f9dca4" fill-rule="evenodd" />

                    <path d="M53.478 51.993A30.814 30.814 0 0 1 30.9 61.8a31.547 31.547 0 0 1-9.23-1.402 31.124 31.124 0 0 1-13.626-8.704l1.283-3.1 13.925-6.212c0 4.535 1.519 7.06 7.648 7.153 7.57.113 8.261-2.515 8.261-7.19l12.79 6.282z" fill="#ffffff" fill-rule="evenodd" />

                    <path d="M39.166 38.778v3.58c0 .297-.004.802-.029 1.273-4.155 5.56-14.31 2.547-15.771-5.053z" fill-rule="evenodd" opacity="0.11" />

                    <path d="M31.129 8.432c21.281 0 12.988 35.266 0 35.266-12.266 0-21.281-35.266 0-35.266z" fill="#ffe8be" fill-rule="evenodd" />

                    <path d="M18.365 24.045c-3.07 1.34-.46 7.687 1.472 7.658a31.978 31.978 0 0 1-1.472-7.658z" fill="#f9dca4" fill-rule="evenodd" />

                    <path d="M44.14 24.045c3.07 1.339.46 7.687-1.471 7.658a31.997 31.997 0 0 0 1.471-7.658z" fill="#f9dca4" fill-rule="evenodd" />

                    <path d="M22.035 35.1a1.879 1.879 0 0 1-.069-.504v-.005a1.422 1.422 0 0 1 1.22-1.361 1.046 1.046 0 0 0 .907 1.745 4.055 4.055 0 0 0 .981-.27c.293-.134.607-.289.943-.481a13.439 13.439 0 0 0 1.426-1.014 3.04 3.04 0 0 1 1.91-.787 2.015 2.015 0 0 1 1.293.466 2.785 2.785 0 0 1 .612.654 2.77 2.77 0 0 1 .612-.654 2.015 2.015 0 0 1 1.292-.466 3.039 3.039 0 0 1 1.911.787 13.42 13.42 0 0 0 1.426 1.014c.336.192.65.347.943.48a4.054 4.054 0 0 0 .981.271 1.046 1.046 0 0 0 .906-1.745 1.422 1.422 0 0 1 1.22 1.36h.002l-.001.006a1.879 1.879 0 0 1-.069.504c-.78 3.631-7.373 2.769-9.223.536-1.85 2.233-8.444 3.095-9.223-.536z" fill="#8a5c42" fill-rule="evenodd" />

                    <path d="M26.431 5.74h9.504a8.529 8.529 0 0 1 8.504 8.504v6.59H17.927v-6.59a8.529 8.529 0 0 1 8.504-8.504z" fill="#464449" fill-rule="evenodd" />

                    <path d="M12.684 19.828h36.998a1.372 1.372 0 0 1 1.369 1.368 1.372 1.372 0 0 1-1.369 1.37H12.684a1.372 1.372 0 0 1-1.368-1.37 1.372 1.372 0 0 1 1.368-1.368z" fill="#333" fill-rule="evenodd" />

                    <path d="M17.927 15.858H44.44v3.97H17.927z" fill="#677079" />

                    <path d="M29.42 48.273v13.49a29.098 29.098 0 0 0 3.528-.03v-13.46z" fill="#d5e1ed" fill-rule="evenodd" />

                    <path d="M23.255 42.176l6.164 7.281-8.837 2.918-.023-9.023 2.696-1.176z" fill="#d5e1ed" fill-rule="evenodd" />

                    <path d="M39.192 42.176l-6.164 7.281 8.838 2.918.022-9.023-2.696-1.176z" fill="#d5e1ed" fill-rule="evenodd" />

                    <path d="M24.018 45.933l5.09 1.98a2.581 2.581 0 0 1 4.05.04l5.19-2.02v7.203l-5.193-2.016a2.581 2.581 0 0 1-4.044.039l-5.093 1.977z" fill="#464449" fill-rule="evenodd" />

                    <path d="M15.115 46.012l3.304-1.474v14.638a34.906 34.906 0 0 1-3.304-1.706z" fill="#8a5c42" fill-rule="evenodd" />

                    <path d="M46.933 46.163l-3.304-1.625v14.527a31.278 31.278 0 0 0 3.304-1.745z" fill="#8a5c42" fill-rule="evenodd" />

                  </g>

                </g>

              </svg>
            </div>
            <p className="testimonial-text">"Thepilotprep.com is a fantastic resource! The questions are realistic, and the feedback helped me focus on exactly what I needed. Highly recommend!"</p>
            <p className="testimonial-author">— Prince</p>
          </div>
          <div className="testimonial-card2">
            {/* <img src="path/to/logo1.png" alt="Company Logo" className="company-logo" />  */}
            <div className="profile-icon">
              <svg width="20px" height="20px" viewBox="0 0 61.80355 61.80355" xmlns="http://www.w3.org/2000/svg">

                <title />

                <g data-name="Layer 2" id="Layer_2">

                  <g data-name="—ÎÓÈ 1" id="_ÎÓÈ_1">

                    <circle cx="30.8999" cy="30.8999" fill="#9f82bb" r="30.8999" />

                    <path d="M23.255 38.68l15.907.121v12.918l-15.907-.121V38.68z" fill="#f9dca4" fill-rule="evenodd" />

                    <path d="M53.478 51.993A30.814 30.814 0 0 1 30.9 61.8a31.547 31.547 0 0 1-9.23-1.402 31.124 31.124 0 0 1-13.626-8.704l1.283-3.1 13.925-6.212c0 4.535 1.519 7.06 7.648 7.153 7.57.113 8.261-2.515 8.261-7.19l12.79 6.282z" fill="#ffffff" fill-rule="evenodd" />

                    <path d="M39.166 38.778v3.58c0 .297-.004.802-.029 1.273-4.155 5.56-14.31 2.547-15.771-5.053z" fill-rule="evenodd" opacity="0.11" />

                    <path d="M31.129 8.432c21.281 0 12.988 35.266 0 35.266-12.266 0-21.281-35.266 0-35.266z" fill="#ffe8be" fill-rule="evenodd" />

                    <path d="M18.365 24.045c-3.07 1.34-.46 7.687 1.472 7.658a31.978 31.978 0 0 1-1.472-7.658z" fill="#f9dca4" fill-rule="evenodd" />

                    <path d="M44.14 24.045c3.07 1.339.46 7.687-1.471 7.658a31.997 31.997 0 0 0 1.471-7.658z" fill="#f9dca4" fill-rule="evenodd" />

                    <path d="M22.035 35.1a1.879 1.879 0 0 1-.069-.504v-.005a1.422 1.422 0 0 1 1.22-1.361 1.046 1.046 0 0 0 .907 1.745 4.055 4.055 0 0 0 .981-.27c.293-.134.607-.289.943-.481a13.439 13.439 0 0 0 1.426-1.014 3.04 3.04 0 0 1 1.91-.787 2.015 2.015 0 0 1 1.293.466 2.785 2.785 0 0 1 .612.654 2.77 2.77 0 0 1 .612-.654 2.015 2.015 0 0 1 1.292-.466 3.039 3.039 0 0 1 1.911.787 13.42 13.42 0 0 0 1.426 1.014c.336.192.65.347.943.48a4.054 4.054 0 0 0 .981.271 1.046 1.046 0 0 0 .906-1.745 1.422 1.422 0 0 1 1.22 1.36h.002l-.001.006a1.879 1.879 0 0 1-.069.504c-.78 3.631-7.373 2.769-9.223.536-1.85 2.233-8.444 3.095-9.223-.536z" fill="#8a5c42" fill-rule="evenodd" />

                    <path d="M26.431 5.74h9.504a8.529 8.529 0 0 1 8.504 8.504v6.59H17.927v-6.59a8.529 8.529 0 0 1 8.504-8.504z" fill="#464449" fill-rule="evenodd" />

                    <path d="M12.684 19.828h36.998a1.372 1.372 0 0 1 1.369 1.368 1.372 1.372 0 0 1-1.369 1.37H12.684a1.372 1.372 0 0 1-1.368-1.37 1.372 1.372 0 0 1 1.368-1.368z" fill="#333" fill-rule="evenodd" />

                    <path d="M17.927 15.858H44.44v3.97H17.927z" fill="#677079" />

                    <path d="M29.42 48.273v13.49a29.098 29.098 0 0 0 3.528-.03v-13.46z" fill="#d5e1ed" fill-rule="evenodd" />

                    <path d="M23.255 42.176l6.164 7.281-8.837 2.918-.023-9.023 2.696-1.176z" fill="#d5e1ed" fill-rule="evenodd" />

                    <path d="M39.192 42.176l-6.164 7.281 8.838 2.918.022-9.023-2.696-1.176z" fill="#d5e1ed" fill-rule="evenodd" />

                    <path d="M24.018 45.933l5.09 1.98a2.581 2.581 0 0 1 4.05.04l5.19-2.02v7.203l-5.193-2.016a2.581 2.581 0 0 1-4.044.039l-5.093 1.977z" fill="#464449" fill-rule="evenodd" />

                    <path d="M15.115 46.012l3.304-1.474v14.638a34.906 34.906 0 0 1-3.304-1.706z" fill="#8a5c42" fill-rule="evenodd" />

                    <path d="M46.933 46.163l-3.304-1.625v14.527a31.278 31.278 0 0 0 3.304-1.745z" fill="#8a5c42" fill-rule="evenodd" />

                  </g>

                </g>

              </svg>
            </div>
            <p className="testimonial-text">"An absolute must for pilot exam prep! Easy to use, accurate questions, and great explanations. It really boosted my confidence!"</p>
            <p className="testimonial-author">— Dhruv</p>
          </div>
          <div className="testimonial-card">
            {/* <img src="path/to/logo1.png" alt="Company Logo" className="company-logo" />  */}
            <div className="profile-icon">
              <svg width="20px" height="20px" viewBox="0 0 61.80355 61.80355" xmlns="http://www.w3.org/2000/svg">

                <title />

                <g data-name="Layer 2" id="Layer_2">

                  <g data-name="—ÎÓÈ 1" id="_ÎÓÈ_1">

                    <circle cx="30.8999" cy="30.8999" fill="#9f82bb" r="30.8999" />

                    <path d="M23.255 38.68l15.907.121v12.918l-15.907-.121V38.68z" fill="#f9dca4" fill-rule="evenodd" />

                    <path d="M53.478 51.993A30.814 30.814 0 0 1 30.9 61.8a31.547 31.547 0 0 1-9.23-1.402 31.124 31.124 0 0 1-13.626-8.704l1.283-3.1 13.925-6.212c0 4.535 1.519 7.06 7.648 7.153 7.57.113 8.261-2.515 8.261-7.19l12.79 6.282z" fill="#ffffff" fill-rule="evenodd" />

                    <path d="M39.166 38.778v3.58c0 .297-.004.802-.029 1.273-4.155 5.56-14.31 2.547-15.771-5.053z" fill-rule="evenodd" opacity="0.11" />

                    <path d="M31.129 8.432c21.281 0 12.988 35.266 0 35.266-12.266 0-21.281-35.266 0-35.266z" fill="#ffe8be" fill-rule="evenodd" />

                    <path d="M18.365 24.045c-3.07 1.34-.46 7.687 1.472 7.658a31.978 31.978 0 0 1-1.472-7.658z" fill="#f9dca4" fill-rule="evenodd" />

                    <path d="M44.14 24.045c3.07 1.339.46 7.687-1.471 7.658a31.997 31.997 0 0 0 1.471-7.658z" fill="#f9dca4" fill-rule="evenodd" />

                    <path d="M22.035 35.1a1.879 1.879 0 0 1-.069-.504v-.005a1.422 1.422 0 0 1 1.22-1.361 1.046 1.046 0 0 0 .907 1.745 4.055 4.055 0 0 0 .981-.27c.293-.134.607-.289.943-.481a13.439 13.439 0 0 0 1.426-1.014 3.04 3.04 0 0 1 1.91-.787 2.015 2.015 0 0 1 1.293.466 2.785 2.785 0 0 1 .612.654 2.77 2.77 0 0 1 .612-.654 2.015 2.015 0 0 1 1.292-.466 3.039 3.039 0 0 1 1.911.787 13.42 13.42 0 0 0 1.426 1.014c.336.192.65.347.943.48a4.054 4.054 0 0 0 .981.271 1.046 1.046 0 0 0 .906-1.745 1.422 1.422 0 0 1 1.22 1.36h.002l-.001.006a1.879 1.879 0 0 1-.069.504c-.78 3.631-7.373 2.769-9.223.536-1.85 2.233-8.444 3.095-9.223-.536z" fill="#8a5c42" fill-rule="evenodd" />

                    <path d="M26.431 5.74h9.504a8.529 8.529 0 0 1 8.504 8.504v6.59H17.927v-6.59a8.529 8.529 0 0 1 8.504-8.504z" fill="#464449" fill-rule="evenodd" />

                    <path d="M12.684 19.828h36.998a1.372 1.372 0 0 1 1.369 1.368 1.372 1.372 0 0 1-1.369 1.37H12.684a1.372 1.372 0 0 1-1.368-1.37 1.372 1.372 0 0 1 1.368-1.368z" fill="#333" fill-rule="evenodd" />

                    <path d="M17.927 15.858H44.44v3.97H17.927z" fill="#677079" />

                    <path d="M29.42 48.273v13.49a29.098 29.098 0 0 0 3.528-.03v-13.46z" fill="#d5e1ed" fill-rule="evenodd" />

                    <path d="M23.255 42.176l6.164 7.281-8.837 2.918-.023-9.023 2.696-1.176z" fill="#d5e1ed" fill-rule="evenodd" />

                    <path d="M39.192 42.176l-6.164 7.281 8.838 2.918.022-9.023-2.696-1.176z" fill="#d5e1ed" fill-rule="evenodd" />

                    <path d="M24.018 45.933l5.09 1.98a2.581 2.581 0 0 1 4.05.04l5.19-2.02v7.203l-5.193-2.016a2.581 2.581 0 0 1-4.044.039l-5.093 1.977z" fill="#464449" fill-rule="evenodd" />

                    <path d="M15.115 46.012l3.304-1.474v14.638a34.906 34.906 0 0 1-3.304-1.706z" fill="#8a5c42" fill-rule="evenodd" />

                    <path d="M46.933 46.163l-3.304-1.625v14.527a31.278 31.278 0 0 0 3.304-1.745z" fill="#8a5c42" fill-rule="evenodd" />

                  </g>

                </g>

              </svg>
            </div>
            <p className="testimonial-text">"This site made studying so much easier! Thepilotprep.com offers exactly what you need to pass with confidence."</p>
            <p className="testimonial-author">— Nidhi</p>
          </div>
          <div className="testimonial-card2">
            {/* <img src="path/to/logo1.png" alt="Company Logo" className="company-logo" />  */}
            <div className="profile-icon">
              <svg width="20px" height="20px" viewBox="0 0 61.80355 61.80355" xmlns="http://www.w3.org/2000/svg">

                <title />

                <g data-name="Layer 2" id="Layer_2">

                  <g data-name="—ÎÓÈ 1" id="_ÎÓÈ_1">

                    <circle cx="30.8999" cy="30.8999" fill="#9f82bb" r="30.8999" />

                    <path d="M23.255 38.68l15.907.121v12.918l-15.907-.121V38.68z" fill="#f9dca4" fill-rule="evenodd" />

                    <path d="M53.478 51.993A30.814 30.814 0 0 1 30.9 61.8a31.547 31.547 0 0 1-9.23-1.402 31.124 31.124 0 0 1-13.626-8.704l1.283-3.1 13.925-6.212c0 4.535 1.519 7.06 7.648 7.153 7.57.113 8.261-2.515 8.261-7.19l12.79 6.282z" fill="#ffffff" fill-rule="evenodd" />

                    <path d="M39.166 38.778v3.58c0 .297-.004.802-.029 1.273-4.155 5.56-14.31 2.547-15.771-5.053z" fill-rule="evenodd" opacity="0.11" />

                    <path d="M31.129 8.432c21.281 0 12.988 35.266 0 35.266-12.266 0-21.281-35.266 0-35.266z" fill="#ffe8be" fill-rule="evenodd" />

                    <path d="M18.365 24.045c-3.07 1.34-.46 7.687 1.472 7.658a31.978 31.978 0 0 1-1.472-7.658z" fill="#f9dca4" fill-rule="evenodd" />

                    <path d="M44.14 24.045c3.07 1.339.46 7.687-1.471 7.658a31.997 31.997 0 0 0 1.471-7.658z" fill="#f9dca4" fill-rule="evenodd" />

                    <path d="M22.035 35.1a1.879 1.879 0 0 1-.069-.504v-.005a1.422 1.422 0 0 1 1.22-1.361 1.046 1.046 0 0 0 .907 1.745 4.055 4.055 0 0 0 .981-.27c.293-.134.607-.289.943-.481a13.439 13.439 0 0 0 1.426-1.014 3.04 3.04 0 0 1 1.91-.787 2.015 2.015 0 0 1 1.293.466 2.785 2.785 0 0 1 .612.654 2.77 2.77 0 0 1 .612-.654 2.015 2.015 0 0 1 1.292-.466 3.039 3.039 0 0 1 1.911.787 13.42 13.42 0 0 0 1.426 1.014c.336.192.65.347.943.48a4.054 4.054 0 0 0 .981.271 1.046 1.046 0 0 0 .906-1.745 1.422 1.422 0 0 1 1.22 1.36h.002l-.001.006a1.879 1.879 0 0 1-.069.504c-.78 3.631-7.373 2.769-9.223.536-1.85 2.233-8.444 3.095-9.223-.536z" fill="#8a5c42" fill-rule="evenodd" />

                    <path d="M26.431 5.74h9.504a8.529 8.529 0 0 1 8.504 8.504v6.59H17.927v-6.59a8.529 8.529 0 0 1 8.504-8.504z" fill="#464449" fill-rule="evenodd" />

                    <path d="M12.684 19.828h36.998a1.372 1.372 0 0 1 1.369 1.368 1.372 1.372 0 0 1-1.369 1.37H12.684a1.372 1.372 0 0 1-1.368-1.37 1.372 1.372 0 0 1 1.368-1.368z" fill="#333" fill-rule="evenodd" />

                    <path d="M17.927 15.858H44.44v3.97H17.927z" fill="#677079" />

                    <path d="M29.42 48.273v13.49a29.098 29.098 0 0 0 3.528-.03v-13.46z" fill="#d5e1ed" fill-rule="evenodd" />

                    <path d="M23.255 42.176l6.164 7.281-8.837 2.918-.023-9.023 2.696-1.176z" fill="#d5e1ed" fill-rule="evenodd" />

                    <path d="M39.192 42.176l-6.164 7.281 8.838 2.918.022-9.023-2.696-1.176z" fill="#d5e1ed" fill-rule="evenodd" />

                    <path d="M24.018 45.933l5.09 1.98a2.581 2.581 0 0 1 4.05.04l5.19-2.02v7.203l-5.193-2.016a2.581 2.581 0 0 1-4.044.039l-5.093 1.977z" fill="#464449" fill-rule="evenodd" />

                    <path d="M15.115 46.012l3.304-1.474v14.638a34.906 34.906 0 0 1-3.304-1.706z" fill="#8a5c42" fill-rule="evenodd" />

                    <path d="M46.933 46.163l-3.304-1.625v14.527a31.278 31.278 0 0 0 3.304-1.745z" fill="#8a5c42" fill-rule="evenodd" />

                  </g>

                </g>

              </svg>
            </div>
            <p className="testimonial-text">"I loved using thepilotprep.com! It’s well-structured, with spot-on practice questions that reflect the actual exam"</p>
            <p className="testimonial-author">— Manav</p>
          </div>
          <div className="testimonial-card testimonial-card-fl">
            {/* <img src="path/to/logo1.png" alt="Company Logo" className="company-logo" /> */}
            <div className="profile-icon">
              <svg width="20px" height="20px" viewBox="0 0 61.80355 61.80355" xmlns="http://www.w3.org/2000/svg">

                <title />

                <g data-name="Layer 2" id="Layer_2">

                  <g data-name="—ÎÓÈ 1" id="_ÎÓÈ_1">

                    <circle cx="30.8999" cy="30.8999" fill="#9f82bb" r="30.8999" />

                    <path d="M23.255 38.68l15.907.121v12.918l-15.907-.121V38.68z" fill="#f9dca4" fill-rule="evenodd" />

                    <path d="M53.478 51.993A30.814 30.814 0 0 1 30.9 61.8a31.547 31.547 0 0 1-9.23-1.402 31.124 31.124 0 0 1-13.626-8.704l1.283-3.1 13.925-6.212c0 4.535 1.519 7.06 7.648 7.153 7.57.113 8.261-2.515 8.261-7.19l12.79 6.282z" fill="#ffffff" fill-rule="evenodd" />

                    <path d="M39.166 38.778v3.58c0 .297-.004.802-.029 1.273-4.155 5.56-14.31 2.547-15.771-5.053z" fill-rule="evenodd" opacity="0.11" />

                    <path d="M31.129 8.432c21.281 0 12.988 35.266 0 35.266-12.266 0-21.281-35.266 0-35.266z" fill="#ffe8be" fill-rule="evenodd" />

                    <path d="M18.365 24.045c-3.07 1.34-.46 7.687 1.472 7.658a31.978 31.978 0 0 1-1.472-7.658z" fill="#f9dca4" fill-rule="evenodd" />

                    <path d="M44.14 24.045c3.07 1.339.46 7.687-1.471 7.658a31.997 31.997 0 0 0 1.471-7.658z" fill="#f9dca4" fill-rule="evenodd" />

                    <path d="M22.035 35.1a1.879 1.879 0 0 1-.069-.504v-.005a1.422 1.422 0 0 1 1.22-1.361 1.046 1.046 0 0 0 .907 1.745 4.055 4.055 0 0 0 .981-.27c.293-.134.607-.289.943-.481a13.439 13.439 0 0 0 1.426-1.014 3.04 3.04 0 0 1 1.91-.787 2.015 2.015 0 0 1 1.293.466 2.785 2.785 0 0 1 .612.654 2.77 2.77 0 0 1 .612-.654 2.015 2.015 0 0 1 1.292-.466 3.039 3.039 0 0 1 1.911.787 13.42 13.42 0 0 0 1.426 1.014c.336.192.65.347.943.48a4.054 4.054 0 0 0 .981.271 1.046 1.046 0 0 0 .906-1.745 1.422 1.422 0 0 1 1.22 1.36h.002l-.001.006a1.879 1.879 0 0 1-.069.504c-.78 3.631-7.373 2.769-9.223.536-1.85 2.233-8.444 3.095-9.223-.536z" fill="#8a5c42" fill-rule="evenodd" />

                    <path d="M26.431 5.74h9.504a8.529 8.529 0 0 1 8.504 8.504v6.59H17.927v-6.59a8.529 8.529 0 0 1 8.504-8.504z" fill="#464449" fill-rule="evenodd" />

                    <path d="M12.684 19.828h36.998a1.372 1.372 0 0 1 1.369 1.368 1.372 1.372 0 0 1-1.369 1.37H12.684a1.372 1.372 0 0 1-1.368-1.37 1.372 1.372 0 0 1 1.368-1.368z" fill="#333" fill-rule="evenodd" />

                    <path d="M17.927 15.858H44.44v3.97H17.927z" fill="#677079" />

                    <path d="M29.42 48.273v13.49a29.098 29.098 0 0 0 3.528-.03v-13.46z" fill="#d5e1ed" fill-rule="evenodd" />

                    <path d="M23.255 42.176l6.164 7.281-8.837 2.918-.023-9.023 2.696-1.176z" fill="#d5e1ed" fill-rule="evenodd" />

                    <path d="M39.192 42.176l-6.164 7.281 8.838 2.918.022-9.023-2.696-1.176z" fill="#d5e1ed" fill-rule="evenodd" />

                    <path d="M24.018 45.933l5.09 1.98a2.581 2.581 0 0 1 4.05.04l5.19-2.02v7.203l-5.193-2.016a2.581 2.581 0 0 1-4.044.039l-5.093 1.977z" fill="#464449" fill-rule="evenodd" />

                    <path d="M15.115 46.012l3.304-1.474v14.638a34.906 34.906 0 0 1-3.304-1.706z" fill="#8a5c42" fill-rule="evenodd" />

                    <path d="M46.933 46.163l-3.304-1.625v14.527a31.278 31.278 0 0 0 3.304-1.745z" fill="#8a5c42" fill-rule="evenodd" />

                  </g>

                </g>

              </svg>
            </div>
            <p className="testimonial-text">"Efficient, reliable, and effective! thepilotprep.com was my go-to study tool, and it made all the difference"</p>
            <p className="testimonial-author">— Dev</p>
          </div>
        </div>
      </div>

      {/* FAQ section */}
      <div id="faq" className="faq-section">
        <h1>FAQs</h1>
        {[
          {
            question: "What is thepilotprep.com?",
            answer: "Thepilotprep.com is an online assessment tool specifically designed to help aspiring pilots prepare for their Commercial Pilot License (CPL) and Airline Transport Pilot License (ATPL) exams. We provide realistic multiple-choice questions (MCQs) and practice exams tailored to these pilot certifications.",
          },
          {
            question: "What types of tests do you offer?",
            answer: "We offer a comprehensive range of MCQ tests for both CPL and ATPL exams. Our question bank covers essential subjects such as Air Law, Navigation, Meteorology, Aircraft General Knowledge, Flight Planning, and more, ensuring you get thorough preparation in all key areas..",
          },
          {
            question: "Are the questions on thepilotprep.com similar to real CPL and ATPL exams?",
            answer: "Yes! Our questions are crafted to closely mirror the style, difficulty, and format of actual CPL and ATPL exams. We regularly update our question bank to keep up with current standards and syllabus changes, giving you the most accurate practice experience.",
          },
          {
            question: "How can I track my progress?",
            answer: "Our platform includes a progress tracking feature that records your scores and shows your improvement over time. You can review your past results, see which areas need more attention, and measure your readiness for the real exams.", 
          },
          {
            question: "Can I retake tests or review my answers?",
            answer: "Absolutely. You can retake any test as many times as you like and review detailed explanations for each answer to reinforce your understanding. This helps you identify and improve on areas where you may need extra practice.", 
          },
        ].map((faq, index) => (
          <div key={index} className={`faq-item ${visibleFaq === index ? 'expanded' : ''}`}>
            <div className="faq-question" onClick={() => toggleFaq(index)}>
              <p>{faq.question}</p>
              <span className="arrow">
                {visibleFaq === index ? (
                  <svg
                    width="19"
                    height="12"
                    viewBox="0 0 19 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1.23926 1.88428L9.388 10.1035L17.5368 1.88428"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg
                    width="11"
                    height="20"
                    viewBox="0 0 11 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1.31836 18.1826L9.43028 9.92603L1.31836 1.66944"
                      stroke="#094E86"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>
            </div>
            {visibleFaq === index && (
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};

export default Navbar;
