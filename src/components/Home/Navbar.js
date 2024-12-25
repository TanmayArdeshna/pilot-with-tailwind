import React from "react";
import logo from '../../assets/img/brand/argon-react.png';

const StyledContainer = () => {
  return (
    <div className="absolute top-0 left-0 w-[calc(100%-80px)] bg-white shadow-md py-4 px-12 border-b border-[#0D4E87] mt-4 rounded-lg mx-[40px]">
      <div className="grid grid-cols-[2fr,1fr,1fr,1fr,1fr,1fr,1fr] items-center gap-2">
        {/* Logo */}
        <div className="col-span-1 flex items-center">
          <img src={logo} alt="Logo" className="h-12 w-auto" />
        </div>

        {/* Navigation Links */}
        <div className="text-center">
          <a href="#aboutTPP" className="text-[#0D4E87] relative after:content-[''] after:block after:w-[100%] after:h-[2px] after:bg-[#0D4E87] after:scale-x-0 hover:after:scale-x-100 after:origin-center after:transition-transform after:duration-300 after:ease-in-out after:mt-1">
            About TPP
          </a>
        </div>
        <div className="text-center">
          <a href="#services" className="text-[#0D4E87] relative after:content-[''] after:block after:w-[100%] after:h-[2px] after:bg-[#0D4E87] after:scale-x-0 hover:after:scale-x-100 after:origin-center after:transition-transform after:duration-300 after:ease-in-out after:mt-1">
            TPP Services
          </a>
        </div>
        <div className="text-center">
          <a href="#partner" className="text-[#0D4E87] relative after:content-[''] after:block after:w-[100%] after:h-[2px] after:bg-[#0D4E87] after:scale-x-0 hover:after:scale-x-100 after:origin-center after:transition-transform after:duration-300 after:ease-in-out after:mt-1">
            Partner
          </a>
        </div>
        <div className="text-center">
          <a href="#testimonials" className="text-[#0D4E87] relative after:content-[''] after:block after:w-[100%] after:h-[2px] after:bg-[#0D4E87] after:scale-x-0 hover:after:scale-x-100 after:origin-center after:transition-transform after:duration-300 after:ease-in-out after:mt-1">
            Testimonials
          </a>
        </div>
        <div className="text-center">
          <a href="#faq" className="text-[#0D4E87] relative after:content-[''] after:block after:w-[100%] after:h-[2px] after:bg-[#0D4E87] after:scale-x-0 hover:after:scale-x-100 after:origin-center after:transition-transform after:duration-300 after:ease-in-out after:mt-1">
            FAQ
          </a>
        </div>

        {/* Button */}
        <div className="flex justify-center">
          <button className="bg-[#0D4E87] text-white font-medium py-3 px-5 rounded-md hover:bg-[#003F6F]">
            Let’s Fly
          </button>
        </div>
      </div>
    </div>
  );
};

export default StyledContainer;
