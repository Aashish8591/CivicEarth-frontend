import React from 'react';
import { FaLeaf, FaUsers, FaShieldAlt } from 'react-icons/fa';

const AboutSection = () => {
  return (
    <section id='about' className="bg-[#F5F5E6] py-24 relative overflow-hidden">

      {/* Decorative Background Shapes */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-[#9EBC8A] rounded-full opacity-20 z-0"></div>
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-[#73946B] rounded-full opacity-20 z-0"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-extrabold text-[#537D5D] mb-6">
          Our Mission
        </h2>
        <p className="text-lg md:text-xl text-[#537D5D] mb-12">
          CivicEarth empowers communities to take action for a greener, safer environment. Every report counts, and together we make a real difference.
        </p>

        {/* Mission Highlights */}
        <div className="grid md:grid-cols-3 gap-8">

          <div className="bg-[#F5F5E6] border-l-4 border-[#537D5D] p-6 rounded-lg shadow-md hover:shadow-xl transition">
            <FaLeaf className="text-[#537D5D] text-4xl mb-4 mx-auto md:mx-0" />
            <h3 className="text-2xl font-semibold text-[#537D5D] mb-2">Protect Nature</h3>
            <p className="text-[#73946B]">
              Report environmental violations and help preserve forests, rivers, and ecosystems.
            </p>
          </div>

          <div className="bg-[#F5F5E6] border-l-4 border-[#537D5D] p-6 rounded-lg shadow-md hover:shadow-xl transition">
            <FaUsers className="text-[#537D5D] text-4xl mb-4 mx-auto md:mx-0" />
            <h3 className="text-2xl font-semibold text-[#537D5D] mb-2">Community Action</h3>
            <p className="text-[#73946B]">
              Engage with your community, raise awareness, and collaborate to tackle environmental issues.
            </p>
          </div>

          <div className="bg-[#F5F5E6] border-l-4 border-[#537D5D] p-6 rounded-lg shadow-md hover:shadow-xl transition">
            <FaShieldAlt className="text-[#537D5D] text-4xl mb-4 mx-auto md:mx-0" />
            <h3 className="text-2xl font-semibold text-[#537D5D] mb-2">Transparency & Safety</h3>
            <p className="text-[#73946B]">
              Track cases, monitor progress, and ensure accountability for every reported violation.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;

