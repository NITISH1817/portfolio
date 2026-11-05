import React from 'react';
import { educationList } from '../../data/portfolio';

export default function Education() {
  return (
    <div className="min-h-[100vh] w-full flex items-center p-8 md:p-24 relative z-10 pointer-events-none">
      <div className="w-full max-w-7xl mx-auto pointer-events-auto">
        <h2 className="text-sm tracking-widest text-[#8B94A5] mb-16 text-center">04 / EDUCATION</h2>
        
        <div className="flex flex-col md:flex-row justify-center items-center gap-16 md:gap-32 relative">
          {/* Timeline Line */}
          <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/10 hidden md:block" />
          
          {educationList.map((edu, index) => (
            <div key={edu.id} className="relative flex flex-col items-center text-center gap-4 group" data-cursor="VIEW">
              <div className="text-sm tracking-[0.2em] text-[#5C6CFF]">{edu.period}</div>
              
              {/* Node */}
              <div className="w-4 h-4 rounded-full bg-[#141823] border-2 border-[#5C6CFF] relative z-10 group-hover:scale-150 transition-transform duration-500 shadow-[0_0_15px_#5C6CFF]" />
              
              <div className="mt-4 flex flex-col gap-2">
                <h3 className="text-xl font-bold tracking-tight text-[#F4F7FB]">{edu.degree}</h3>
                <p className="text-[#8B94A5] text-sm max-w-[200px]">{edu.institution}</p>
                {edu.result && <p className="text-[#35D7FF] text-sm mt-2 font-mono">{edu.result}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
