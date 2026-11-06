import React from 'react';
import { 
  GraduationCap, 
  MapPin, 
  CheckCircle2, 
  Terminal, 
  Cpu, 
  Layers, 
  FileCode,
  ShieldCheck
} from 'lucide-react';
import { identityData } from '../../data/portfolio';

export default function EditorialAbout() {
  return (
    <section id="about" className="py-24 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Section Marker */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2 text-amber-400 font-mono text-xs tracking-widest uppercase">
              <span>01</span>
              <span className="w-8 h-px bg-amber-500/40" />
              <span>Dossier</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-sans">
              IDENTITY & <br className="hidden sm:inline" />
              BACKGROUND
            </h2>
            <p className="text-sm font-mono text-slate-400 leading-relaxed">
              Academic foundation at Bannari Amman Institute of Technology, verified against official resume records.
            </p>

            {/* Quick Fact Card */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3.5 text-xs font-mono">
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <span className="text-slate-400">INSTITUTION</span>
                <span className="text-slate-200 text-right font-sans font-medium">Bannari Amman Inst. of Tech</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <span className="text-slate-400">DEGREE</span>
                <span className="text-cyan-300 font-medium">B.E. Computer Science</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <span className="text-slate-400">BATCH / GRADUATION</span>
                <span className="text-slate-200">2024 – May 2028</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <span className="text-slate-400">CUMULATIVE CGPA</span>
                <span className="text-amber-400 font-bold">7.8 / 10.0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">LOCATION</span>
                <span className="text-slate-200">Tamil Nadu, India</span>
              </div>
            </div>
          </div>

          {/* Right Narrative & Pillars */}
          <div className="lg:col-span-8 space-y-10">
            {/* Story prose */}
            <div className="space-y-5 text-base sm:text-lg text-slate-300 leading-relaxed font-sans">
              <p>
                I am a Computer Science undergraduate (Batch of 2028) at{' '}
                <strong className="text-white font-semibold">Bannari Amman Institute of Technology</strong> with a{' '}
                <span className="text-amber-300 font-mono font-medium">7.8 CGPA</span>. As a Software Engineer specializing in{' '}
                <strong className="text-cyan-300 font-semibold">Java</strong> and <strong className="text-cyan-300 font-semibold">AI/ML engineering</strong>, I architect scalable web applications, machine learning systems, and interactive digital interfaces that bridge theoretical computer science with resilient production software.
              </p>
              <p>
                My technical foundation is certified by Oracle as an{' '}
                <span className="text-white underline decoration-amber-500/50 underline-offset-4">
                  Oracle Certified Associate: Java SE 17 Developer
                </span>{' '}
                and by Amazon as an <span className="text-white underline decoration-cyan-500/50 underline-offset-4">AWS Cloud Practitioner</span>. On LeetCode, I have solved over{' '}
                <span className="text-amber-400 font-mono font-bold">250+ Data Structures & Algorithms</span> problems in Java, reinforcing rigorous computational complexity analysis across trees, graphs, dynamic programming, and binary search.
              </p>
              <p>
                Over the past two years, I have engineered and deployed 10+ projects. Notably, I conceptualized and filed a patent for{' '}
                <strong className="text-white">GovScheme</strong>—an AI citizen welfare entitlement platform with sub-50ms eligibility matching—and developed{' '}
                <strong className="text-white">NEXORA</strong>, a full-stack campus digital twin featuring 129 passing automated unit/integration tests and an 85% optimized JavaScript bundle.
              </p>
            </div>

            {/* Core Competency Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4">
              <div className="p-5 rounded-2xl bg-[#0B101D] border border-white/10 hover:border-amber-500/30 transition-all space-y-2.5">
                <div className="flex items-center gap-2 text-amber-400 font-mono text-xs">
                  <FileCode className="w-4 h-4" />
                  <span>JAVA & ENTERPRISE ENGINEERING</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Strong mastery of Java SE 17, Object-Oriented Design, memory models, REST APIs, and multi-threaded systems backed by official Oracle certification.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#0B101D] border border-white/10 hover:border-cyan-500/30 transition-all space-y-2.5">
                <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs">
                  <Cpu className="w-4 h-4" />
                  <span>AI, MACHINE LEARNING & MLOPS</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  End-to-end ML lifecycle with Scikit-learn, XGBoost, MLflow, DVC, and Evidently AI, building reproducible models with automated drift monitoring.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#0B101D] border border-white/10 hover:border-purple-500/30 transition-all space-y-2.5">
                <div className="flex items-center gap-2 text-purple-400 font-mono text-xs">
                  <Layers className="w-4 h-4" />
                  <span>FULL-STACK WEB & 3D INTERACTIVITY</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  TypeScript, React, FastAPI, Node.js, WebSockets, and Three.js 3D spatial simulations optimized with minimal bundle payloads.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#0B101D] border border-white/10 hover:border-emerald-500/30 transition-all space-y-2.5">
                <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs">
                  <Terminal className="w-4 h-4" />
                  <span>ALGORITHMIC RIGOR (250+ DSA)</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Consistently applying optimal time/space complexity, sorting/searching algorithms, and robust edge-case handling across all production codebases.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
