import React from 'react';
import searchLogo from '../assets/search.png';
import alertLogo from '../assets/alert.png';
import messageLogo from '../assets/message.png';
import captureLogo from '../assets/camera.png';

const Header = () => {
  return (
    <div className='header h-1/7 w-full flex justify-between bg-gradient-to-b from-[#1F2937] to-[#4B5563] sticky top-0'>
      <div className="left m-5 p-1 md:h-10 md:w-72 flex items-center gap-2 border border-solid border-[#374151] rounded-lg">
        <img src={searchLogo} alt="Search Icon" className='md:w-6 md:h-6 w-3 h-3'/>
        <input 
          type="text" 
          placeholder='Type to Search...' 
          className='md:h-8 flex-1 md:text-base text-[#9CA3AF] font-light outline-none bg-transparent' 
        />
      </div>
      <div className="right hidden md:flex m-5 h-[5svh] gap-6 items-center">
        <img src={alertLogo} alt="Alert Logo" className='w-6 h-6' />
        <img src={messageLogo} alt="Message Logo" className='w-6 h-6' />
        <img src={captureLogo} alt="Capture Logo" className='w-6 h-6' />
      </div>
      <div className='m-5 flex gap-2'>
        <button className="bg-transparent hover:bg-[#FF7849] text-[#F9FAFB] font-semibold py-2 px-4 border border-[#FF7849] rounded-full">
          Login
        </button>
        <button className="bg-transparent hover:bg-[#FF7849] text-[#F9FAFB] font-semibold py-2 px-4 border border-[#FF7849] rounded-full">
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default Header;