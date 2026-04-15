import React from 'react';
import heroImage from '/heroImg.jpg'; 

const Hero = () => {
  return (
    <section id= "hero" className="bg-[#F5F5E6]">
      <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col-reverse md:flex-row items-center gap-8">

        {/* Text Content */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-[#537D5D] mb-4">
            CivicEarth: Empowering Communities
          </h1>
          <p className="text-lg md:text-xl text-[#73946B] mb-6">
            Report environmental violations, track ongoing cases, and make your community safer and greener.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button className="bg-[#73946B] text-[#F5F5E6] px-6 py-3 rounded-md hover:bg-[#9EBC8A]">
              Report a Case
            </button>
            <button className="bg-[#537D5D] text-[#F5F5E6] px-6 py-3 rounded-md hover:bg-[#9EBC8A]">
              Learn More
            </button>
          </div>
        </div>

        {/* Hero Image */}
        <div className="flex-1">
          <img src={heroImage} alt="Environmental Awareness" className="w-full rounded-lg shadow-lg" />
        </div>

      </div>
    </section>
  );
};

export default Hero;
