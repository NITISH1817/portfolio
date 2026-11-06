import React, { useState } from 'react';
import { 
  ExternalLink, 
  Sparkles, 
  Award, 
  CheckCircle2, 
  ArrowUpRight, 
  Terminal, 
  Cpu, 
  Layers, 
  Box, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';
import { GithubIcon } from './Icons';
import { projects } from '../../data/portfolio';

export default function EditorialProjects() {
  const [showArchive, setShowArchive] = useState(false);

  // The 3 Flagships from data/portfolio.ts
  const flagshipGovScheme = projects.find(p => p.id === 'proj-govscheme') || projects[0];
  const flagshipNexora = projects.find(p => p.id === 'proj-nexora') || projects[1];
  const flagshipMlops = projects.find(p => p.id === 'proj-mlops') || projects[2];

  // Secondary archive
  const archiveProjects = projects.filter(p => !['proj-govscheme', 'proj-nexora', 'proj-mlops'].includes(p.id));

  return (
    <section id="projects" className="py-24 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs tracking-widest uppercase">
              <span>02</span>
              <span className="w-8 h-px bg-cyan-500/40" />
              <span>Selected Work</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-sans">
              FLAGSHIP ENGINEERING <br />
              SYSTEMS
            </h2>
          </div>
          <p className="text-sm font-mono text-slate-400 max-w-md">
            Three production-grade platforms exhibiting patent-filed algorithms, automated unit/integration test suites, and reproducible MLOps pipelines.
          </p>
        </div>

        {/* =========================================================================
            FLAGSHIP 01: GOVSCHEME (PATENT FILED)
           ========================================================================= */}
        <article className="rounded-3xl bg-gradient-to-b from-[#0F1424] to-[#0A0D18] border border-amber-500/30 p-6 sm:p-10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
            {/* Project Header & Narrative */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 text-xs font-mono font-bold border border-amber-500/30 flex items-center gap-1.5 shadow-sm shadow-amber-500/10">
                  <Award className="w-3.5 h-3.5" />
                  FLAGSHIP 01 • PATENT FILED
                </span>
                <span className="px-3 py-1 rounded-full bg-white/5 text-slate-300 text-xs font-mono border border-white/10">
                  E-GOVERNANCE INTELLIGENCE
                </span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
                  {flagshipGovScheme.title}
                </h3>
                <p className="text-sm font-mono text-amber-400/90 mt-1">
                  {flagshipGovScheme.subtitle}
                </p>
              </div>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
                {flagshipGovScheme.description}
              </p>

              {/* Verified Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {(flagshipGovScheme.metrics || []).map((m, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-black/40 border border-white/5 text-xs font-mono text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{m}</span>
                  </div>
                ))}
              </div>

              {/* Technology Stack Chips */}
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Technology Stack</span>
                <div className="flex flex-wrap gap-2">
                  {flagshipGovScheme.technologies.map((tech) => (
                    <span 
                      key={tech}
                      className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-slate-200 hover:border-amber-400/50 hover:text-amber-300 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <a
                  href={flagshipGovScheme.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-mono text-xs transition-all active:scale-95 shadow-md shadow-amber-500/20"
                >
                  <GithubIcon className="w-4 h-4" />
                  <span>VIEW ON GITHUB</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Architecture & Visual Schematic Blueprint */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-5 rounded-2xl bg-black/60 border border-white/10 space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-white/10 text-amber-400">
                  <span className="font-bold flex items-center gap-2">
                    <Terminal className="w-4 h-4" />
                    SYSTEM ARCHITECTURE
                  </span>
                  <span className="text-[10px] bg-amber-500/10 px-2 py-0.5 rounded text-amber-300 border border-amber-500/20">
                    MCDA ENGINE
                  </span>
                </div>

                <div className="space-y-2.5">
                  {(flagshipGovScheme.architectureSteps || [
                    "Multilingual Voice/Text Citizen Intake (10 Languages)",
                    "Client-Side OCR Document Parsing (Tesseract.js)",
                    "MCDA Hybrid Eligibility Decision Engine",
                    "MongoDB Distributed Scheme Catalog",
                    "Google Gemini AI Natural Language Explanations",
                    "Real-Time WebSocket Application Tracking"
                  ]).map((step, sIdx) => (
                    <div key={sIdx} className="flex items-center gap-2.5 text-slate-300">
                      <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px] font-bold shrink-0">
                        0{sIdx + 1}
                      </span>
                      <span className="text-xs">{step}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-white/10 text-[11px] text-slate-400">
                  <span className="text-amber-400 font-bold">Patent Feature:</span> Multi-Criteria Decision Analysis (MCDA) yields explainable mathematical matching in &lt;50ms latency.
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* =========================================================================
            FLAGSHIP 02: NEXORA (DIGITAL TWIN)
           ========================================================================= */}
        <article className="rounded-3xl bg-gradient-to-b from-[#0B1220] to-[#070B14] border border-cyan-500/30 p-6 sm:p-10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
            {/* Narrative */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-300 text-xs font-mono font-bold border border-cyan-500/30 flex items-center gap-1.5 shadow-sm shadow-cyan-500/10">
                  <Box className="w-3.5 h-3.5" />
                  FLAGSHIP 02 • PRODUCTION DEPLOYED
                </span>
                <span className="px-3 py-1 rounded-full bg-white/5 text-slate-300 text-xs font-mono border border-white/10">
                  129 TESTS PASSING • 253 KB BUNDLE
                </span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
                  {flagshipNexora.title}
                </h3>
                <p className="text-sm font-mono text-cyan-400/90 mt-1">
                  {flagshipNexora.subtitle}
                </p>
              </div>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
                {flagshipNexora.description}
              </p>

              {/* Verified Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {(flagshipNexora.metrics || []).map((m, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-black/40 border border-white/5 text-xs font-mono text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{m}</span>
                  </div>
                ))}
              </div>

              {/* Technology Stack Chips */}
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Technology Stack</span>
                <div className="flex flex-wrap gap-2">
                  {flagshipNexora.technologies.map((tech) => (
                    <span 
                      key={tech}
                      className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-slate-200 hover:border-cyan-400/50 hover:text-cyan-300 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <a
                  href={flagshipNexora.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-xs transition-all active:scale-95 shadow-md shadow-cyan-500/20"
                >
                  <GithubIcon className="w-4 h-4" />
                  <span>VIEW REPOSITORY</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Architecture Blueprint */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-5 rounded-2xl bg-black/60 border border-white/10 space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-white/10 text-cyan-400">
                  <span className="font-bold flex items-center gap-2">
                    <Cpu className="w-4 h-4" />
                    SPATIAL & ML ENGINE
                  </span>
                  <span className="text-[10px] bg-cyan-500/10 px-2 py-0.5 rounded text-cyan-300 border border-cyan-500/20">
                    5 ML MODELS
                  </span>
                </div>

                <div className="space-y-2.5">
                  {[
                    "IoT Sensor & Facility Telemetry Ingestion",
                    "FastAPI Async Data Pipeline",
                    "5 Predictive Machine Learning Models (Scikit-learn)",
                    "PostgreSQL / SQLAlchemy Storage Layer",
                    "Three.js 3D Campus Spatial Rendering",
                    "Sustainability Analytics & Simulation Sandbox"
                  ].map((step, sIdx) => (
                    <div key={sIdx} className="flex items-center gap-2.5 text-slate-300">
                      <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[10px] font-bold shrink-0">
                        0{sIdx + 1}
                      </span>
                      <span className="text-xs">{step}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-white/10 text-[11px] text-slate-400">
                  <span className="text-cyan-400 font-bold">Optimization:</span> Tree-shaken dynamic chunking cut initial JS payload by 85% to 253.33 kB.
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* =========================================================================
            FLAGSHIP 03: STUDENT PERFORMANCE & MLOPS
           ========================================================================= */}
        <article className="rounded-3xl bg-gradient-to-b from-[#100D1E] to-[#0A0714] border border-purple-500/30 p-6 sm:p-10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
            {/* Narrative */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3 py-1 rounded-full bg-purple-500/15 text-purple-300 text-xs font-mono font-bold border border-purple-500/30 flex items-center gap-1.5 shadow-sm shadow-purple-500/10">
                  <Cpu className="w-3.5 h-3.5" />
                  FLAGSHIP 03 • END-TO-END MLOPS
                </span>
                <span className="px-3 py-1 rounded-full bg-white/5 text-slate-300 text-xs font-mono border border-white/10">
                  89.1% ACCURACY • 82.6% RECALL
                </span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
                  {flagshipMlops.title}
                </h3>
                <p className="text-sm font-mono text-purple-400/90 mt-1">
                  {flagshipMlops.subtitle}
                </p>
              </div>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
                {flagshipMlops.description}
              </p>

              {/* Verified Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {(flagshipMlops.metrics || []).map((m, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-black/40 border border-white/5 text-xs font-mono text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <span>{m}</span>
                  </div>
                ))}
              </div>

              {/* Technology Stack Chips */}
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Technology Stack</span>
                <div className="flex flex-wrap gap-2">
                  {flagshipMlops.technologies.map((tech) => (
                    <span 
                      key={tech}
                      className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-slate-200 hover:border-purple-400/50 hover:text-purple-300 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <a
                  href={flagshipMlops.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold font-mono text-xs transition-all active:scale-95 shadow-md shadow-purple-500/20"
                >
                  <GithubIcon className="w-4 h-4" />
                  <span>VIEW REPOSITORY</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Architecture Blueprint */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-5 rounded-2xl bg-black/60 border border-white/10 space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-white/10 text-purple-400">
                  <span className="font-bold flex items-center gap-2">
                    <Terminal className="w-4 h-4" />
                    MLOPS LIFECYCLE
                  </span>
                  <span className="text-[10px] bg-purple-500/10 px-2 py-0.5 rounded text-purple-300 border border-purple-500/20">
                    DRIFT MONITORING
                  </span>
                </div>

                <div className="space-y-2.5">
                  {[
                    "Academic Feature Extraction & Normalization",
                    "DVC Data Versioning Pipeline",
                    "XGBoost Inference Engine",
                    "MLflow Metric & Artifact Tracking",
                    "Evidently AI Drift Monitoring",
                    "FastAPI Prediction Endpoint & CI/CD"
                  ].map((step, sIdx) => (
                    <div key={sIdx} className="flex items-center gap-2.5 text-slate-300">
                      <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-[10px] font-bold shrink-0">
                        0{sIdx + 1}
                      </span>
                      <span className="text-xs">{step}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-white/10 text-[11px] text-slate-400">
                  <span className="text-purple-400 font-bold">Reliability:</span> Automated Kolmogorov-Smirnov statistical tests monitor covariate shift across academic term intakes.
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* =========================================================================
            CURATED ARCHIVE TOGGLE
           ========================================================================= */}
        <div className="pt-6">
          <div className="text-center">
            <button
              onClick={() => setShowArchive(!showArchive)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white font-mono text-xs transition-all active:scale-95 cursor-pointer"
            >
              <span>{showArchive ? 'HIDE CURATED ARCHIVE' : `VIEW ${archiveProjects.length} MORE VERIFIED PROJECTS`}</span>
              {showArchive ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {showArchive && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 animate-in fade-in duration-300">
              {archiveProjects.map((p) => (
                <div 
                  key={p.id}
                  className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>{p.type}</span>
                      <span className="text-cyan-400">{p.status}</span>
                    </div>
                    <h4 className="text-xl font-bold text-white tracking-tight">{p.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed font-sans">{p.description}</p>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-white/5">
                    <div className="flex flex-wrap gap-1.5">
                      {p.technologies.slice(0, 5).map(t => (
                        <span key={t} className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 text-slate-300">
                          {t}
                        </span>
                      ))}
                    </div>

                    <a
                      href={p.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-mono text-amber-400 hover:text-amber-300 transition-colors"
                    >
                      <GithubIcon className="w-3.5 h-3.5" />
                      <span>View Code</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
