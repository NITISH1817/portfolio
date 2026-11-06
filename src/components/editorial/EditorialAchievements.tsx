import React from 'react';
import { 
  Award, 
  ShieldCheck, 
  Cloud, 
  Code, 
  Lightbulb, 
  Trophy, 
  ExternalLink,
  CheckCircle2,
  Terminal
} from 'lucide-react';
import { certificationsList, achievementsList, identityData } from '../../data/portfolio';

export default function EditorialAchievements() {
  return (
    <section id="achievements" className="py-24 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-mono text-xs tracking-widest uppercase">
              <span>05</span>
              <span className="w-8 h-px bg-amber-500/40" />
              <span>Credentials & Honors</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-sans">
              CERTIFICATIONS & <br />
              ACHIEVEMENTS
            </h2>
          </div>
          <p className="text-sm font-mono text-slate-400 max-w-md">
            Recognitions supported strictly by verified academic records, corporate certifications, and patent filings.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Column 1: Certifications */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-amber-300 uppercase">
              <Award className="w-4 h-4 text-amber-400" />
              <span>INDUSTRY CERTIFICATIONS</span>
            </div>

            <div className="space-y-4">
              {/* Oracle */}
              <div className="p-6 rounded-2xl bg-[#090E1A] border border-amber-500/30 hover:border-amber-500/50 transition-all space-y-2 relative overflow-hidden group">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                      ORACLE CORPORATION • 2024
                    </span>
                    <h4 className="text-lg font-bold text-white tracking-tight">
                      Oracle Certified Associate: Java SE 17 Developer
                    </h4>
                  </div>
                  <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  Official credential validating rigorous understanding of Java SE 17 object-oriented architecture, data types, collections, lambdas, streams, exception handling, and memory lifecycle.
                </p>
              </div>

              {/* AWS */}
              <div className="p-6 rounded-2xl bg-[#090E1A] border border-cyan-500/30 hover:border-cyan-500/50 transition-all space-y-2 relative overflow-hidden group">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
                      AMAZON WEB SERVICES • 2024
                    </span>
                    <h4 className="text-lg font-bold text-white tracking-tight">
                      AWS Cloud Practitioner Essentials
                    </h4>
                  </div>
                  <Cloud className="w-5 h-5 text-cyan-400 shrink-0" />
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  Demonstrates fundamental competency across cloud computing infrastructure, security boundaries, AWS compute (EC2/Lambda), storage (S3), and database governance.
                </p>
              </div>

              {/* Cisco */}
              <div className="p-6 rounded-2xl bg-[#090E1A] border border-white/10 hover:border-white/20 transition-all space-y-2 relative overflow-hidden group">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                      CISCO NETWORKING ACADEMY • 2024
                    </span>
                    <h4 className="text-lg font-bold text-white tracking-tight">
                      Introduction to Cybersecurity
                    </h4>
                  </div>
                  <ShieldCheck className="w-5 h-5 text-slate-400 shrink-0" />
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  Core principles of confidentiality, integrity, availability, threat surface modeling, and secure networked communication standards.
                </p>
              </div>
            </div>
          </div>

          {/* Column 2: Key Achievements */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-cyan-300 uppercase">
              <Trophy className="w-4 h-4 text-cyan-400" />
              <span>KEY ACHIEVEMENTS & PATENTS</span>
            </div>

            <div className="space-y-4">
              {/* GovScheme Patent */}
              <div className="p-6 rounded-2xl bg-[#090E1A] border border-amber-500/30 hover:border-amber-500/50 transition-all space-y-2 relative overflow-hidden group">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                      OFFICIAL PATENT FILED
                    </span>
                    <h4 className="text-lg font-bold text-white tracking-tight">
                      GovScheme Hybrid Eligibility Engine (MCDA)
                    </h4>
                  </div>
                  <Lightbulb className="w-5 h-5 text-amber-400 shrink-0" />
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  Patent filed for an innovative multi-criteria decision analysis (MCDA) algorithm computing sub-50ms eligibility matches across 75+ welfare programs in 10 official Indian languages.
                </p>
              </div>

              {/* LeetCode 250+ */}
              <div className="p-6 rounded-2xl bg-[#090E1A] border border-cyan-500/30 hover:border-cyan-500/50 transition-all space-y-2 relative overflow-hidden group">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
                      DATA STRUCTURES & ALGORITHMS
                    </span>
                    <h4 className="text-lg font-bold text-white tracking-tight">
                      250+ LeetCode Problems Solved in Java
                    </h4>
                  </div>
                  <Terminal className="w-5 h-5 text-cyan-400 shrink-0" />
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  Extensive algorithmic problem-solving in Java covering Binary Trees, Graphs, Dynamic Programming, Backtracking, Two Pointers, and Binary Search with optimal asymptotic time complexities.
                </p>
                <div className="pt-2">
                  <a
                    href={identityData.leetcode}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-amber-400 hover:text-amber-300 transition-colors"
                  >
                    <span>Inspect LeetCode Profile</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Smart India Hackathon */}
              <div className="p-6 rounded-2xl bg-[#090E1A] border border-purple-500/30 hover:border-purple-500/50 transition-all space-y-2 relative overflow-hidden group">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 font-bold">
                      NATIONAL HACKATHON
                    </span>
                    <h4 className="text-lg font-bold text-white tracking-tight">
                      Smart India Hackathon (SIH 2025) Selected Participant
                    </h4>
                  </div>
                  <Trophy className="w-5 h-5 text-purple-400 shrink-0" />
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  Selected to participate in the prestigious national innovation competition to architect mission-critical software solutions addressing central governance challenges.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
