import React, { useState, useEffect } from 'react';
// import logo from '../../assets/img/brand/argon-react.png';
import './Footer.css';
import logo1 from './logo1.png';

const Footer = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 480);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 480);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const iconSize = isSmallScreen ? '12px' : '28px';

  const handleScrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      });
    }
  };

  return (
    <div className="footer-container">
      <div className="footer-content">
        {/* Logo and Description */}
        <div className="footer-section">
          <img src={logo1} alt="FT Plane Logo" className="logo" />
          <p className="description">
          Every question has an answer, every vision a path. Stay inspired, stay connected.
          </p>
          {/* <div className="social-icons" style={{ display: 'flex', gap: '10px' }}>
            <div className="icon-circle" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width={iconSize} height={iconSize} viewBox="0 0 10 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.33184 16.0709V8.15025H8.72115L9.03786 5.36255H6.33184L6.33586 3.96718C6.33586 3.24008 6.40976 2.85068 7.52724 2.85068H9.02111V0.0625H6.63126C3.76063 0.0625 2.7504 1.41477 2.7504 3.6892V5.36277H0.960938V8.15072H2.7504V15.9586C3.44753 16.0884 4.16824 16.157 4.90618 16.157C5.38288 16.157 5.85909 16.1283 6.33184 16.0709Z" fill="#17181C" />
              </svg>
            </div>

            <div className="icon-circle" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width={iconSize} height={iconSize} viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.923828 1.93206C0.923828 1.39015 1.11484 0.943081 1.49685 0.590855C1.87886 0.238613 2.3755 0.0625 2.98672 0.0625C3.58704 0.0625 4.07273 0.235898 4.44384 0.582726C4.82585 0.940382 5.01686 1.40641 5.01686 1.98083C5.01686 2.50106 4.83132 2.93457 4.46021 3.2814C4.0782 3.63906 3.57611 3.81788 2.95397 3.81788H2.9376C2.33728 3.81788 1.85159 3.63906 1.48048 3.2814C1.10937 2.92374 0.923828 2.47396 0.923828 1.93206ZM1.13667 16.157V5.29728H4.77128V16.157H1.13667ZM6.78505 16.157H10.4197V10.0931C10.4197 9.71377 10.4633 9.42114 10.5506 9.21523C10.7034 8.84673 10.9354 8.53513 11.2465 8.28045C11.5575 8.02575 11.9477 7.89841 12.4171 7.89841C13.6395 7.89841 14.2508 8.71668 14.2508 10.3532V16.157H17.8854V9.93054C17.8854 8.32651 17.5034 7.10994 16.7393 6.28083C15.9753 5.45172 14.9657 5.03716 13.7105 5.03716C12.3025 5.03716 11.2055 5.63868 10.4197 6.8417V6.87421H10.4033L10.4197 6.8417V5.29728H6.78505C6.80688 5.64409 6.8178 6.72247 6.8178 8.53243C6.8178 10.3424 6.80688 12.8839 6.78505 16.157Z" fill="#17181C" />
              </svg>
            </div>

            <div className="icon-circle" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width={iconSize} height={iconSize} viewBox="0 0 22 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.5 1.96784C20.7191 2.29097 19.8869 2.50515 19.0194 2.60915C19.9119 2.1065 20.5931 1.31663 20.9133 0.364581C20.0812 0.83256 19.1624 1.16312 18.1833 1.34758C17.3932 0.554001 16.2671 0.0625 15.0386 0.0625C12.6551 0.0625 10.7362 1.88737 10.7362 4.1245C10.7362 4.44639 10.7651 4.7559 10.8359 5.05056C7.25675 4.8859 4.08969 3.26778 1.96212 0.802847C1.59069 1.41072 1.37281 2.1065 1.37281 2.85552C1.37281 4.26193 2.14062 5.50863 3.28513 6.23041C2.59344 6.21803 1.91488 6.02861 1.34 5.73024C1.34 5.74262 1.34 5.75872 1.34 5.77481C1.34 7.74824 2.83231 9.38741 4.78925 9.76501C4.43881 9.85538 4.05687 9.89872 3.6605 9.89872C3.38488 9.89872 3.10662 9.88386 2.84544 9.82939C3.40325 11.4376 4.98613 12.6199 6.86825 12.6583C5.4035 13.7391 3.54369 14.3903 1.53031 14.3903C1.17725 14.3903 0.838625 14.3755 0.5 14.3346C2.40706 15.4946 4.66719 16.157 7.1045 16.157C15.0267 16.157 19.358 9.96681 19.358 4.60115C19.358 4.42163 19.3514 4.24831 19.3423 4.07622C20.1967 3.50425 20.9146 2.7899 21.5 1.96784Z" fill="#17181C" />
              </svg>
            </div>
          </div> */}
        </div>

        {/* Address Links */}
        {/* <div className="footer-section">
          <h3 className="heading">Address</h3>
          <ul className="link-list">
            <li className="link-item">Integrations</li>
            <li className="link-item">Hello</li>
            <li className="link-item">Intercom</li>
            <li className="link-item">Customer</li>
          </ul>
        </div> */}

        {/* About Links */}
        <div className="footer-section">
          <h3 className="heading">About</h3>
          <ul className="link-list">
            <li className="link-item" onClick={() => handleScrollToSection('about')}>About us</li>
            <li className="link-item" onClick={() => handleScrollToSection('aboutTPP')}>About TPP</li>
            <li className="link-item" onClick={() => handleScrollToSection('whychooseus')}>Why choose us</li>
            <li className="link-item" onClick={() => handleScrollToSection('Testimonials')}>Testimonials</li>
            <li className="link-item" onClick={() => handleScrollToSection('faq')}>FAQ</li>
          </ul>
        </div>

        {/* Support Links */}
        <div className="footer-section1">
          <h3 className="heading">Support</h3>
          <ul className="link-list">
            <li className="link-item">thepilotprep@gmail.com</li>
          </ul>
        </div>
      </div>

      {/* Copyright Section */}
      {/* <div className="copyright">
        <hr className="dividerfooter" />
        <p>© Thepilotprep 2024 All rights reserved</p>
      </div> */}
    </div>
  );
};

export default Footer;
