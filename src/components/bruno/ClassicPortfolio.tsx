import React, { useState, useEffect } from 'react';
import EditorialNavbar from '../editorial/EditorialNavbar';
import EditorialHero from '../editorial/EditorialHero';
import EditorialAbout from '../editorial/EditorialAbout';
import EditorialProjects from '../editorial/EditorialProjects';
import EditorialSkills from '../editorial/EditorialSkills';
import EditorialEducation from '../editorial/EditorialEducation';
import EditorialAchievements from '../editorial/EditorialAchievements';
import EditorialContact from '../editorial/EditorialContact';
import EditorialFooter from '../editorial/EditorialFooter';

interface ClassicPortfolioProps {
  onReturn3D?: () => void;
  onExit?: () => void;
}

export default function ClassicPortfolio({ onReturn3D, onExit }: ClassicPortfolioProps) {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const sections = ['home', 'about', 'projects', 'skills', 'education', 'achievements', 'contact'];
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
      }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-[#070B14] text-slate-100 selection:bg-amber-500/30 selection:text-amber-200">
      {/* 1. Sticky Editorial Navigation */}
      <EditorialNavbar 
        onReturn3D={onReturn3D} 
        activeSection={activeSection} 
      />

      {/* 2. Main Content Stream */}
      <main className="w-full">
        {/* Hero Section */}
        <EditorialHero onReturn3D={onReturn3D} />

        {/* Identity & About */}
        <EditorialAbout />

        {/* Selected Flagship Projects */}
        <EditorialProjects />

        {/* Technical Capabilities & Stack */}
        <EditorialSkills />

        {/* Education & Academic Foundation */}
        <EditorialEducation />

        {/* Certifications & Achievements */}
        <EditorialAchievements />

        {/* Contact Transmission & Recruiter Dossier */}
        <EditorialContact onReturn3D={onReturn3D} />
      </main>

      {/* 3. Editorial Footer */}
      <EditorialFooter onReturn3D={onReturn3D} />
    </div>
  );
}
