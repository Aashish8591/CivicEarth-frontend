import React from "react";
import HeroSection from "../components/HeroSection";
import AboutSection from "../components/AboutSection";
import HowItWorks from "../components/HowItWorks";

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section id="hero">
        <HeroSection />
      </section>

      {/* About Section */}
      <section id="about">
        <AboutSection />
      </section>

      {/* How It Works Section */}
      <section id="how-it-works">
        <HowItWorks />
      </section>
    </div>
  );
};

export default Home;
