import React from 'react';
import { identityData } from '../data/portfolio';

export default function About() {
  return (
    <section className="spatial-section min-h-screen flex items-center" id="about">
      <div className="w-full flex flex-col md:flex-row gap-12 md:gap-32">
        
        {/* Left Column: Title */}
        <div className="w-full md:w-1/3 flex flex-col gap-2">
          <p className="text-metadata text-[var(--text-secondary)]">01</p>
          <h2 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">IDENTITY</h2>
        </div>
        
        {/* Right Column: Content */}
        <div className="w-full md:w-2/3 flex flex-col gap-12 max-w-2xl">
          
          <div className="flex flex-col gap-4">
            <h3 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase text-[var(--text-primary)]">
              {identityData.name}
            </h3>
            <p className="text-body text-[var(--text-secondary)]">
              {identityData.role}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-12 gap-x-8 mt-4 pt-12 border-t border-[var(--border-color)]">
            
            <div className="flex flex-col gap-3">
              <p className="text-metadata text-[var(--text-secondary)]">EDUCATION</p>
              <div className="text-[var(--text-primary)] text-sm font-medium uppercase tracking-tight flex flex-col gap-1">
                <p>Bannari Amman Institute of Technology</p>
                <p>B.E. Computer Science and Engineering</p>
                <p className="text-[var(--text-secondary)]">Expected 2028</p>
                <p className="mt-2 text-[var(--accent)] font-bold">CGPA {identityData.cgpa}</p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-metadata text-[var(--text-secondary)]">LOCATION</p>
              <p className="text-[var(--text-primary)] text-sm font-medium uppercase tracking-tight">{identityData.location}</p>
            </div>

            <div className="flex flex-col gap-4 sm:col-span-2">
              <p className="text-metadata text-[var(--text-secondary)]">FOCUS AREAS</p>
              <div className="flex flex-wrap gap-2">
                {(identityData.primaryFocus || identityData.interests || []).map((focus, index) => (
                  <span 
                    key={index} 
                    className="px-4 py-2 border border-[var(--border-color)] text-[var(--text-primary)] text-xs font-medium uppercase tracking-tight hover:border-[var(--accent)] transition-colors"
                  >
                    {focus}
                  </span>
                ))}
              </div>
            </div>

          </div>

        </div>
        
      </div>
    </section>
  );
}
