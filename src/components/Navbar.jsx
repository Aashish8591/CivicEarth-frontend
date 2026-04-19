import React, { useState } from 'react';
import { Link as ScrollLink } from "react-scroll";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ isLoggedIn, userRole }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(false);

  return (
    <nav className="bg-[#537D5D] shadow-md w-full">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <div className="cursor-pointer" onClick={() => navigate("/")}>
          <img src="/logo.jpg" alt="CivicEarth Logo" className="h-16 w-16 rounded-full" />
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-8 items-center text-[#F5F5E6]">

          <ScrollLink to="about" smooth duration={600} offset={-80} className="hover:text-[#9EBC8A]">
            About Us
          </ScrollLink>

          <ScrollLink to="how-it-works" smooth duration={600} offset={-80} className="cursor-pointer hover:text-[#9EBC8A]">
            How It Works
          </ScrollLink>

          {/* Authority Dashboard */}
          {userRole === 'authority' && (
            <button
              onClick={() => navigate("/authority-dashboard")}
              className="hover:text-[#9EBC8A]"
            >
              Authority Dashboard
            </button>
          )}

          {/* REPORT BUTTON */}
          {isLoggedIn ? (
            <button
              onClick={() => navigate("/report-issue")}
              className="bg-[#73946B] text-[#F5F5E6] px-6 py-3 rounded-md hover:bg-[#9EBC8A]"
            >
              Report Case
            </button>
          ) : (
            <div className="flex gap-3">

              {/* LOGIN */}
              <button
                onClick={() => navigate("/login")}
                className="bg-[#73946B] text-[#F5F5E6] px-5 py-2 rounded-md hover:bg-[#9EBC8A]"
              >
                Login
              </button>

              {/* SIGN UP */}
              <button
                onClick={() => navigate("/signup")}
                className="border border-[#F5F5E6] px-5 py-2 rounded-md hover:bg-[#9EBC8A]"
              >
                Sign Up
              </button>

            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setIsOpen(!isOpen)} className="text-[#F5F5E6]">
            {isOpen ? (
              <span>✖</span>
            ) : (
              <span>☰</span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-6 pb-4 flex flex-col gap-4 text-[#F5F5E6] bg-[#537D5D]">

          <ScrollLink to="about" smooth duration={500} onClick={toggleMenu}>
            About Us
          </ScrollLink>

          <ScrollLink to="how-it-works" smooth duration={500} onClick={toggleMenu}>
            How It Works
          </ScrollLink>

          <div
            onClick={() => {
              navigate("/reportedcases");
              toggleMenu();
            }}
            className="bg-[#73946B] px-6 py-3 rounded-full cursor-pointer"
          >
            Reported Cases
          </div>

          {userRole === 'authority' && (
            <div onClick={() => { navigate("/authority-dashboard"); toggleMenu(); }}>
              Authority Dashboard
            </div>
          )}

          {isLoggedIn ? (
            <button
              onClick={() => {
                navigate("/report-issue");
                toggleMenu();
              }}
              className="bg-[#73946B] px-6 py-3 rounded-md"
            >
              Report Case
            </button>
          ) : (
            <div className="flex flex-col gap-2">

              <button
                onClick={() => {
                  navigate("/login");
                  toggleMenu();
                }}
                className="bg-[#73946B] px-6 py-3 rounded-md"
              >
                Login
              </button>

              <button
                onClick={() => {
                  navigate("/signup");
                  toggleMenu();
                }}
                className="border border-[#F5F5E6] px-6 py-3 rounded-md"
              >
                Sign Up
              </button>

            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;