import React, { useState } from 'react';
import { Link as ScrollLink } from "react-scroll";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


const Navbar = ({ isLoggedIn, userRole }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();

  // Function to close menu when clicking a link
  const toggleMenu = () => setIsOpen(false);

  return (
    <nav className="bg-[#537D5D] shadow-md w-full">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <div className="cursor-pointer">
          <a href="/">
            <img src="/logo.jpg" alt="CivicEarth Logo" className="h-16 w-16 rounded-full" />
          </a>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-8 items-center text-[#F5F5E6]">
          <ScrollLink to="about" 
                    smooth={true} 
                    duration={600} 
                    offset={-80}  
                    className="hover:text-[#9EBC8A]">
              About Us 
          </ScrollLink>
          <ScrollLink
            to="how-it-works"
            smooth={true}
            duration={600}
            offset={-80}
            className="cursor-pointer hover:text-[#9EBC8A]"
          >
            How It Works
          </ScrollLink>

          {/* Role-based link: only for authority/admin */}
          {userRole === 'authority' && (
            <Link
              to="authority"
              smooth={true}
              duration={600}
              offset={-80}
              className="cursor-pointer hover:text-[#9EBC8A]"
            >
              Authority Dashboard
            </Link>
          )}

          {/* Report Case button: requires login */}
          {isLoggedIn ? (
            <button className="bg-[#73946B] text-[#F5F5E6] px-6 py-3 rounded-md hover:bg-[#9EBC8A]">
              Report Case
            </button>
          ) : (
            <Link to="/login">
              <button className="bg-[#73946B] text-[#F5F5E6] px-6 py-3 rounded-md hover:bg-[#9EBC8A]">
                Login to Report
              </button>
            </Link>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setIsOpen(!isOpen)} className="text-[#F5F5E6] focus:outline-none">
            {isOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-6 pb-4 flex flex-col gap-4 text-[#F5F5E6] bg-[#537D5D]">
            <ScrollLink
            to="about"
            smooth={true}
            duration={500}
            className="cursor-pointer hover:text-[#9EBC8A]"
            onClick={() => setIsOpen(false)}
          >
            About Us
          </ScrollLink>
          <ScrollLink
            to="how-it-works"
            smooth={true}
            duration={500}
            className="cursor-pointer hover:text-[#9EBC8A]"
            onClick={() => setIsOpen(false)}
          >
            How It Works
          </ScrollLink>
           <div
              onClick={() => { navigate("/reportedcases");
                setIsOpen(false);
              }
              }
              className="bg-[#73946B] hover:bg-[#9EBC8A] text-[#F5F5E6] px-6 py-3 rounded-full font-semibold cursor-pointer shadow-md transform hover:scale-105 transition-all">
              Reported Cases
            </div>

          {userRole === 'authority' && (
            <a href="/authority" className="hover:text-[#9EBC8A]" onClick={toggleMenu}>Authority Dashboard</a>
          )}

          {isLoggedIn ? (
            <button className="bg-[#73946B] text-[#F5F5E6] px-6 py-3 rounded-md hover:bg-[#9EBC8A]">
              Report Case
            </button>
          ) : (
            <Link to="/login" onClick={() => setIsOpen(false)}>
              <button className="bg-[#73946B] text-[#F5F5E6] px-6 py-3 rounded-md hover:bg-[#9EBC8A]">
                Login to Report
              </button>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
