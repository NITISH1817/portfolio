import React from 'react';
import { GraduationCap, Calendar, Award, BookOpen, School, CheckCircle2 } from 'lucide-react';
import { educationList } from '../../data/portfolio';

export default function EditorialEducation() {
  return (
    <section id="education" className="py-24 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs tracking-widest uppercase">
              <span>04</span>
              <span className="w-8 h-px bg-emerald-500/40" />
              <span>Academic Foundation</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-sans">
              EDUCATION & <br />
              ACADEMICS
            </h2>
          </div>
          <p className="text-sm font-mono text-slate-400 max-w-md">
            Verified academic track record from Bannari Amman Institute of Technology and Saratha Matriculation Higher Secondary School.
          </p>
        </div>

        {/* Education Timeline Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Institution 1: Bannari Amman Inst of Tech */}
          <div className="p-8 rounded-3xl bg-[#090E1A] border border-emerald-500/30 relative overflow-hidden flex flex-col justify-between space-y-6 shadow-xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[90px] pointer-events-none" />

            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/30">
                  UNDERGRADUATE DEGREE
                </span>
                <span className="text-xs font-mono text-slate-400">
                  2024 – May 2028 (Expected)
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  Bannari Amman Institute of Technology
                </h3>
                <p className="text-sm font-mono text-cyan-300 mt-1">
                  B.E. Computer Science and Engineering
                </p>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 w-fit">
                <Award className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-mono text-slate-300">
                  Cumulative Grade: <strong className="text-amber-400 font-bold">CGPA 7.8 / 10.0</strong>
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                Comprehensive training across core computing foundations: Data Structures & Algorithms, Java SE 17 Object-Oriented Engineering, Database Systems, Computer Networks, and Machine Learning.
              </p>
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-wrap gap-2 relative z-10">
              {[
                "Data Structures & Algorithms",
                "Java SE 17 OOP",
                "Database Management Systems",
                "Machine Learning",
                "Computer Networks"
              ].map((topic) => (
                <span key={topic} className="px-2.5 py-1 rounded-lg bg-white/5 text-[11px] font-mono text-slate-300 border border-white/5">
                  {topic}
                </span>
              ))}
            </div>
          </div>

          {/* Institution 2: Saratha Matriculation */}
          <div className="p-8 rounded-3xl bg-[#090E1A] border border-white/10 relative overflow-hidden flex flex-col justify-between space-y-6 shadow-xl">
            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-white/5 text-slate-300 text-xs font-mono border border-white/10">
                  HIGHER SECONDARY (HSC)
                </span>
                <span className="text-xs font-mono text-slate-400">
                  2023 – 2024
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  Saratha Matriculation Higher Secondary School
                </h3>
                <p className="text-sm font-mono text-slate-300 mt-1">
                  Higher Secondary Certificate (HSC)
                </p>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 w-fit">
                <Award className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono text-slate-300">
                  Academic Result: <strong className="text-emerald-400 font-bold">93.1%</strong>
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                Rigorous higher secondary foundation with high academic distinction in Mathematics, Physics, Chemistry, and Computer Science.
              </p>
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-wrap gap-2 relative z-10">
              {[
                "Mathematics",
                "Computer Science",
                "Physics",
                "Chemistry"
              ].map((topic) => (
                <span key={topic} className="px-2.5 py-1 rounded-lg bg-white/5 text-[11px] font-mono text-slate-300 border border-white/5">
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
