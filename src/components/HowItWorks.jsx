import React from 'react';
import { FaSignInAlt, FaMapMarkerAlt, FaCheckCircle } from 'react-icons/fa';

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="bg-[#F5F5E6] py-24">
        
      <div className="max-w-7xl mx-auto px-6 text-center">
        
        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-extrabold text-[#537D5D] mb-6">
          How It Works
        </h2>
        <p className="text-lg md:text-xl text-[#73946B] mb-12">
          Reporting environmental violations is easy and transparent. Follow these simple steps to make a difference.
        </p>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Step 1 */}
          <div className="bg-[#F5F5E6] border-l-4 border-[#537D5D] p-6 rounded-lg shadow-md hover:shadow-xl transition">
            <FaSignInAlt className="text-[#537D5D] text-4xl mb-4 mx-auto md:mx-0" />
            <h3 className="text-2xl font-semibold text-[#537D5D] mb-2">Sign In</h3>
            <p className="text-[#73946B]">
              Create an account or log in as a user or authority to start reporting cases and accessing the dashboard.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-[#F5F5E6] border-l-4 border-[#537D5D] p-6 rounded-lg shadow-md hover:shadow-xl transition">
            <FaMapMarkerAlt className="text-[#537D5D] text-4xl mb-4 mx-auto md:mx-0" />
            <h3 className="text-2xl font-semibold text-[#537D5D] mb-2">Report a Case</h3>
            <p className="text-[#73946B]">
              Select the location and details of the environmental violation to report it quickly and efficiently.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-[#F5F5E6] border-l-4 border-[#537D5D] p-6 rounded-lg shadow-md hover:shadow-xl transition">
            <FaCheckCircle className="text-[#537D5D] text-4xl mb-4 mx-auto md:mx-0" />
            <h3 className="text-2xl font-semibold text-[#537D5D] mb-2">Track & Monitor</h3>
            <p className="text-[#73946B]">
              Monitor the status of reported cases and stay updated on actions taken by authorities.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
