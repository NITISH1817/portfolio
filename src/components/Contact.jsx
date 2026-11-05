import React from 'react';
import { identityData } from '../data/portfolio';
import MagneticButton from './MagneticButton';

export default function Contact() {
  return (
    <section className="spatial-section min-h-screen flex items-center pb-24" id="contact">
      <div className="w-full max-w-[1440px] mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-32 relative z-10">
        
        {/* Left Side: Massive Statement */}
        <div className="w-full lg:w-1/2 flex justify-start">
          <h2 className="text-[clamp(4rem,10vw,8rem)] font-bold tracking-tighter leading-none text-[var(--text-primary)] uppercase">
            LET'S<br />CONNECT.
          </h2>
        </div>

        {/* Right Side: Links */}
        <div className="w-full lg:w-1/2 flex flex-col gap-12">
          
          <div className="flex flex-col gap-2">
            <p className="text-metadata text-[var(--text-secondary)]">EMAIL</p>
            <MagneticButton 
              href={`mailto:${identityData.email}`} 
              className="text-2xl md:text-4xl font-bold tracking-tight text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors"
              cursorData="connect"
            >
              {identityData.email}
            </MagneticButton>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-metadata text-[var(--text-secondary)]">PHONE</p>
            <MagneticButton 
              href={`tel:${identityData.phone.replace(/\s+/g, '')}`} 
              className="text-2xl md:text-4xl font-bold tracking-tight text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors"
              cursorData="connect"
            >
              {identityData.phone}
            </MagneticButton>
          </div>

          <div className="flex gap-8 mt-8 border-t border-[var(--border-color)] pt-8">
            <MagneticButton 
              href={identityData.linkedin} 
              className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors border-b border-transparent hover:border-[var(--accent)] pb-1"
              cursorData="connect"
            >
              LinkedIn
            </MagneticButton>
            <MagneticButton 
              href={identityData.github} 
              className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors border-b border-transparent hover:border-[var(--accent)] pb-1"
              cursorData="github"
            >
              GitHub
            </MagneticButton>
          </div>

        </div>
        
      </div>
    </section>
  );
}
