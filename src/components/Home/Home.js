import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaLightbulb, FaAward, FaClipboardCheck, FaMobileAlt, FaChartLine } from 'react-icons/fa';
import logo from '../../assets/img/brand/argon-react.png';
import homeImage1 from '../Home/homeimage1.jpg'; // Import the images
import homeImage2 from '../Home/homeimage2.jpg';
import homeImage3 from '../Home/homeimage3.jpg';
import homeImage4 from '../Home/homeimage4.jpg';

const Home = () => {
  const navigate = useNavigate();
  const footerRef = useRef(null); // Reference for footer
  const aboutUsRef = useRef(null); // Reference for About Us
  const heroRef = useRef(null); // Reference for Hero Section (Home)
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentImage, setCurrentImage] = useState(homeImage1);
  const [imageOpacity, setImageOpacity] = useState(1);

  // Detect scroll and toggle navbar transparency
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Function to rotate between images every minute with fade-in effect
  useEffect(() => {
    const images = [homeImage1, homeImage2, homeImage3, homeImage4];
    let currentIndex = 0;

    const changeImage = () => {
      setImageOpacity(0);
      setTimeout(() => {
        currentIndex = (currentIndex + 1) % images.length;
        setCurrentImage(images[currentIndex]);
        setImageOpacity(1);
      }, 500);
    };

    const intervalId = setInterval(changeImage, 30000); // Change the image every 30 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  const navbarStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 50px',
    backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.9)' : '#ffffff',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    position: 'fixed',
    top: 0,
    width: '100%',
    zIndex: 1000,
    transition: 'background-color 0.3s ease',
  };

  const logoContainerStyle = {
    display: 'flex',
    alignItems: 'center',
  };

  const logoStyle = {
    height: '40px',
  };

  const linksContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  };

  const linkStyle = {
    textDecoration: 'none',
    color: '#0B3D91',
    fontSize: '1rem',
    fontWeight: '600',
    padding: '10px 15px',
    cursor: 'pointer',
    transition: 'color 0.2s ease',
  };

  const buttonLinkStyle = {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#0B3D91',
    fontSize: '1rem',
    fontWeight: '600',
    padding: '10px 15px',
    cursor: 'pointer',
    transition: 'color 0.2s ease',
  };

  const rightSectionStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  };

  const signUpBtnStyle = {
    padding: '10px 20px',
    backgroundColor: '#3FA2F6',
    border: 'none',
    borderRadius: '25px',
    fontWeight: '600',
    color: '#ffffff',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  };

  const heroSectionStyle = {
    height: '100vh',
    backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.7)), url(${currentImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    textAlign: 'center',
    flexDirection: 'column',
    paddingTop: '80px',
    opacity: imageOpacity,
    transition: 'opacity 1s ease-in-out',
  };

  const heroTextStyle = {
    maxWidth: '700px',
    marginBottom: '30px',
  };

  const heroHeadingStyle = {
    fontSize: '4rem',
    fontWeight: '700',
    color: '#FAFFAF',
  };

  const heroSubTextStyle = {
    fontSize: '1.5rem',
    margin: '20px 0',
    color: '#f5f5f5',
  };

  const ctaBtnStyle = {
    padding: '15px 30px',
    backgroundColor: '#3FA2F6',
    border: 'none',
    borderRadius: '25px',
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#ffffff',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  };

  // About Us Section Styles
  const aboutSectionStyle = {
    padding: '60px 50px',
    backgroundColor: '#FFD700', // Matching yellow color
    textAlign: 'center',
  };

  const aboutHeadingStyle = {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#0B3D91', // Dark blue for contrast
    marginBottom: '20px',
  };

  const aboutTextStyle = {
    fontSize: '1.2rem',
    maxWidth: '800px',
    margin: '0 auto',
    color: '#333', // Darker text color for readability
  };

  // Our Services Section Styles
  const servicesSectionStyle = {
    padding: '60px 50px',
    backgroundColor: '#f6f6f6',
    textAlign: 'center',
  };

  const serviceBoxStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    marginBottom: '40px',
  };

  const serviceIconStyle = {
    fontSize: '3rem',
    color: '#FFD700',
    marginBottom: '20px',
  };

  const serviceHeadingStyle = {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#0B3D91',
    marginBottom: '15px',
  };

  const serviceTextStyle = {
    fontSize: '1rem',
    color: '#666',
    maxWidth: '600px',
  };

  // Footer Section Styles
  const footerStyle = {
    backgroundColor: '#1C1C1C',
    color: '#fff',
    padding: '40px 50px',
    display: 'flex',
    justifyContent: 'space-between',
    gap: '30px',
  };

  const footerColumnStyle = {
    display: 'flex',
    flexDirection: 'column',
  };

  const footerHeadingStyle = {
    color: '#3795BD',
    marginBottom: '15px',
    fontSize: '1.2rem',
    fontWeight: '600',
  };

  const footerLinkStyle = {
    textDecoration: 'none',
    color: '#3795BD',
    fontSize: '1rem',
    marginBottom: '8px',
    cursor: 'pointer',
  };

  const handleScrollToFooter = () => {
    footerRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToAboutUs = () => {
    aboutUsRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToHome = () => {
    heroRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      {/* Navbar */}
      <nav style={navbarStyle}>
        <div style={logoContainerStyle}>
          <Link to="/">
            <img src={logo} alt="Logo" style={logoStyle} />
          </Link>
        </div>
        {/* Full navbar for web */}
        <div className="desktop-links" style={linksContainerStyle}>
          <div style={linkStyle} onClick={handleScrollToHome}>Home</div>
          <div style={linkStyle} onClick={handleScrollToAboutUs}>About Us</div>
          <div style={linkStyle} onClick={handleScrollToFooter}>Contact Us</div>
          <button onClick={() => navigate('/auth/login')} style={buttonLinkStyle}>Log In</button>
        </div>
        {/* Right section for signup */}
        <div style={rightSectionStyle}>
          <button className="desktop-signup" style={signUpBtnStyle} onClick={() => navigate('/auth/register')}>Sign Up</button>
          <button className="mobile-login" style={signUpBtnStyle} onClick={() => navigate('/auth/login')}>Log in </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div ref={heroRef} style={heroSectionStyle}>
        <div style={heroTextStyle}>
          <h1 style={heroHeadingStyle}>MOCK EXAMS FOR PILOTS</h1>
          <p style={heroSubTextStyle}>The best SACAA pilot exams question bank</p>
          <button style={ctaBtnStyle} onClick={() => navigate('/auth/register')}>Sign Up</button>
        </div>  
      </div>

      {/* About Us Section */}
      <section ref={aboutUsRef} style={aboutSectionStyle}>
        <h2 style={aboutHeadingStyle}>ABOUT US</h2>
        <p style={aboutTextStyle}>
          We offer CPL, ATPL, Instrument Rating, Night Rating, and General Radio exam preparation for SACAA pilot exams.
          Our database is aligned with SACAA and offers the best mock exams to help you pass on your first try!
        </p>
      </section>

      {/* Our Services Section */}
      <section style={servicesSectionStyle}>
        <h2 style={aboutHeadingStyle}>OUR SERVICES</h2>
        <div style={serviceBoxStyle}>
          <FaClipboardCheck style={serviceIconStyle} />
          <h3 style={serviceHeadingStyle}>Psychometric Test Training</h3>
          <p style={serviceTextStyle}>
            Tailored preparation for tests like ADAPT, Cut-E, COMPASS, and PILAPT to sharpen core pilot skills.
          </p>
        </div>
        <div style={serviceBoxStyle}>
          <FaLightbulb style={serviceIconStyle} />
          <h3 style={serviceHeadingStyle}>ATPL Exam Refresher</h3>
          <p style={serviceTextStyle}>
            Extensive question banks covering math, reasoning, and physics to ensure you're well-prepared.
          </p>
        </div>
        <div style={serviceBoxStyle}>
          <FaChartLine style={serviceIconStyle} />
          <h3 style={serviceHeadingStyle}>Performance Tracking Tools</h3>
          <p style={serviceTextStyle}>
            Personalized dashboards to monitor progress and refine study plans for optimal results.
          </p>
        </div>
        <div style={serviceBoxStyle}>
          <FaAward style={serviceIconStyle} />
          <h3 style={serviceHeadingStyle}>Interview & Personality Test Coaching</h3>
          <p style={serviceTextStyle}>
            Focused training for HR and personality evaluations to help you stand out in interviews.
          </p>
        </div>
        <div style={serviceBoxStyle}>
          <FaMobileAlt style={serviceIconStyle} />
          <h3 style={serviceHeadingStyle}>Mobile Access</h3>
          <p style={serviceTextStyle}>
            Study from anywhere with our flexible, mobile-friendly tools.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer style={footerStyle} ref={footerRef}>
        <div style={footerColumnStyle}>
          <h4 style={footerHeadingStyle}>CONTACT</h4>
          <p style={{ marginBottom: '8px', color: '#ffffff' }}>Email: support@thepilotprep.com</p>
          <p style={{ color: '#ffffff' }}>Website: www.thepilotprep.com</p>
        </div>
        <div style={footerColumnStyle}>
          <h4 style={footerHeadingStyle}>QUICK LINKS</h4>
          <a href="#!" style={footerLinkStyle}>Home</a>
          <a href="#!" style={footerLinkStyle}>About Us</a>
          <a href="#!" style={footerLinkStyle}>Contact Us</a>
          <a href="#!" style={footerLinkStyle}>Privacy Policy</a>
        </div>
      </footer>

      {/* CSS for responsiveness */}
      <style jsx>{`
        @media (max-width: 740px) {
          .desktop-links {
            display: none !important; /* Hide the links on mobile */
          }

          .desktop-signup {
            display: none; /* Hide the signup button on mobile */
          }

          .mobile-login {
            display: block !important; /* Show Sign In button on mobile */
          }
        }

        @media (min-width: 740px) {
          .mobile-login {
            display: none; /* Hide mobile login button on desktop */
          }
        }

        footer {
          background-color: #1C1C1C;
          color: #fff;
          padding: 40px 50px;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default Home;
