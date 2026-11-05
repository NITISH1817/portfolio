import React from 'react';

export default function Education() {
  return (
    <section className="spatial-section" id="education">
      <div className="w-full flex flex-col items-center gap-16 relative z-10">
        
        <div className="w-full md:w-1/3 flex flex-col gap-2">
          <p className="text-metadata text-[var(--text-secondary)]">04</p>
          <h2 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">EDUCATION</h2>
        </div>
        
        <div className="w-full md:w-2/3 flex flex-col relative border-l border-[var(--border-color)] ml-2 pl-8 md:pl-12 py-4">
          
          <div className="flex flex-col gap-12">
            
            <div className="relative group">
              <div className="absolute top-2 -left-[37px] md:-left-[53px] w-2 h-2 rounded-full bg-[var(--text-primary)]" />
              <div className="flex flex-col gap-2">
                <p className="font-mono text-sm text-[var(--text-secondary)]">2024 — 2028</p>
                <h3 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] uppercase">
                  B.E. Computer Science & Engineering
                </h3>
                <p className="text-body text-[var(--text-primary)] font-medium">
                  Bannari Amman Institute of Technology
                </p>
                <div className="flex gap-4 mt-2">
                  <span className="text-sm font-bold text-[var(--accent)]">
                    CGPA 7.8
                  </span>
                  <span className="text-sm font-medium text-[var(--text-secondary)]">
                    Expected May 2028
                  </span>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute top-2 -left-[37px] md:-left-[53px] w-2 h-2 rounded-full border border-[var(--border-color)] bg-[var(--bg-primary)] group-hover:border-[var(--text-primary)] transition-colors" />
              <div className="flex flex-col gap-2">
                <p className="font-mono text-sm text-[var(--text-secondary)]">2023 — 2024</p>
                <h3 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] uppercase">
                  Higher Secondary Certificate (HSC)
                </h3>
                <p className="text-body text-[var(--text-primary)] font-medium">
                  Saratha Matriculation Higher Secondary School
                </p>
                <div className="flex gap-4 mt-2">
                  <span className="text-sm font-bold text-[var(--text-primary)]">
                    93.1%
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
        
      </div>
    </section>
  );
}
