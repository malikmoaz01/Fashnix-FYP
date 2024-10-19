import React from 'react';
import searchLogo from '../../assets/search.png';
import alertLogo from '../../assets/alert.png';
import messageLogo from '../../assets/message.png';
import captureLogo from '../../assets/camera.png';

const Header = () => {
  return (
    <div className='header h-1/7 w-auto flex justify-between bg-gradient-to-b from-[#8B0000] to-[#FF4500] sticky top-0'>
      <div className="left m-5 p-1 md:h-10 md:w-72 flex items-center gap-2 border border-solid border-[#322F66] rounded-lg h-5 w-40">
        <img src={searchLogo} alt="Search Icon" className='md:w-6 md:h-6 w-3 h-3'/>
        <input type="text" placeholder='Type to Search...' className='md:h-8 flex-1 md:text-base text-[#858EB3] md:font-light outline-0 border-0 bg-transparent h-4 text-sm font-extralight'/>
      </div>
      <div className="right hidden md:flex m-5 h-[5svh] md:p-2 md:gap-6 border border-solid border-[#322F66] rounded-lg p-0.5 gap-1.5 items-center">
        <img src={alertLogo} alt="Alert Logo"/>
        <img src={messageLogo} alt="Message Logo" />
        <img src={captureLogo} alt="Capture Logo" />
      </div>
      <div className='m-5'>
      <button className="text-white px-4 py-1 rounded-full bg-blue-600 hover:bg-blue-700 transition duration-300">Login</button>
      <button className="text-white px-4 py-1 rounded-full bg-green-600 hover:bg-green-700 transition duration-300">Sign Up</button>
      </div>
    </div>
  );
}

export default Header;