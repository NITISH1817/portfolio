import React from 'react';

const certs = [
  {
    issuer: 'ORACLE',
    name: 'Certified Associate:\nJava SE 17 Developer',
  },
  {
    issuer: 'AWS',
    name: 'Cloud Practitioner\nEssentials',
  },
  {
    issuer: 'CISCO',
    name: 'Introduction to\nCybersecurity',
  }
];

export default function Certifications() {
  return (
    <section className="spatial-section min-h-[50vh] flex items-center" id="certifications">
      <div className="w-full max-w-[1440px] mx-auto flex flex-col gap-12 relative z-10">
        
        <div className="w-full flex flex-col gap-2">
          <p className="text-metadata text-[var(--text-secondary)]">05</p>
          <h2 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">CERTIFICATIONS</h2>
        </div>
        
        <div className="w-full flex flex-col border-t border-[var(--border-color)]">
          {certs.map((cert, i) => (
            <div 
              key={i}
              className="flex flex-col md:flex-row md:items-center justify-between py-12 border-b border-[var(--border-color)] group hover:px-4 transition-all duration-500 cursor-pointer"
            >
              <div className="flex flex-col gap-4 w-full md:w-1/4">
                <p className="text-metadata text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
                  {cert.issuer}
                </p>
              </div>
              
              <div className="w-full md:w-1/2 mt-4 md:mt-0">
                <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-[var(--text-primary)] uppercase whitespace-pre-line group-hover:text-[var(--accent)] transition-colors">
                  {cert.name}
                </h3>
              </div>

              <div className="w-full md:w-1/4 flex md:justify-end mt-8 md:mt-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <span className="text-xs font-bold uppercase tracking-widest text-[var(--text-primary)] border-b border-[var(--text-primary)] pb-1">
                  VERIFIED
                </span>
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
}
