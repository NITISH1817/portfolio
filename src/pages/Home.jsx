import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Cursor from '../components/Cursor';
import About from '../components/About';
import Stats from '../components/Stats';
import Projects from '../components/Projects';
import EngineeringCore from '../components/EngineeringCore';
import Terminal from '../components/Terminal';
import ProjectLab from '../components/ProjectLab';
import LeetCode from '../components/LeetCode';
import Achievements from '../components/Achievements';
import Certifications from '../components/Certifications';
import Contact from '../components/Contact';

export default function Home() {
  return (
    <div className="dark bg-black text-white min-h-screen selection:bg-white/20">
      <Cursor />
      <Navbar />
      <Hero />
      <About />
      <EngineeringCore />
      <Stats />
      <Projects />
      <Terminal />
      <ProjectLab />
      <LeetCode />
      <Achievements />
      <Certifications />
      <Contact />
    </div>
  );
}
