import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Download, Mail, Phone, MapPin, Award, BookOpen, Sparkles, CheckCircle2, Send } from 'lucide-react';
import { identityData, skillCategories, projects, educationList, certificationsList, achievementsList } from '../../../data/portfolio';

function GithubIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function LinkedInIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

export default function LandmarkOverlay({ landmarkId, initialProject = null, onClose }) {
  const [selectedProject, setSelectedProject] = useState(initialProject);
  const [formStatus, setFormStatus] = useState('idle'); // 'idle' | 'sending' | 'sent'
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!landmarkId) return null;

  const handleDownloadResume = () => {
    // Generate a downloadable text/markdown resume or trigger direct download
    const resumeContent = `NITISH PRIYAN R S
Full Stack Developer | AI/ML Engineer | Software Developer
Email: ${identityData.email} | Phone: ${identityData.phone}
Location: ${identityData.location}
GitHub: ${identityData.github} | LinkedIn: ${identityData.linkedin}

SUMMARY:
${identityData.introduction}

EDUCATION:
${educationList.map(e => `- ${e.degree}, ${e.institution} (${e.period}) - ${e.result}`).join('\n')}

CERTIFICATIONS:
${certificationsList.map(c => `- ${c.title} (${c.issuer})`).join('\n')}

PROJECTS:
${projects.map(p => `\n* ${p.title} (${p.type})\n  Tech: ${p.technologies.join(', ')}\n  ${p.description}`).join('\n')}

ACHIEVEMENTS:
${achievementsList.map(a => `- ${a.title}: ${a.subtitle}`).join('\n')}
`;

    const blob = new Blob([resumeContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Nitish_Priyan_Resume.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    setFormStatus('sending');
    setTimeout(() => {
      setFormStatus('sent');
      setFormData({ name: '', email: '', message: '' });
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900/95 text-slate-100 rounded-3xl shadow-2xl border border-slate-700/60 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-blue-500 animate-ping" />
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
              EXPLORING LANDMARK
            </span>
            <span className="text-slate-600">/</span>
            <span className="text-sm font-bold text-white uppercase tracking-wider">
              {landmarkId === 'about' && 'About Nitish Priyan'}
              {landmarkId === 'skills' && 'Technical Capabilities'}
              {landmarkId === 'projects' && 'Interactive Projects Showcase'}
              {landmarkId === 'experience' && 'Experience & Certifications'}
              {landmarkId === 'resume' && 'Curriculum Vitae / Resume'}
              {landmarkId === 'contact' && 'Contact Station'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-8">
          {/* ================= LANDMARK 1: ABOUT ME ================= */}
          {landmarkId === 'about' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                <div>
                  <h1 className="text-3xl font-black text-white tracking-tight">
                    {identityData.name}
                  </h1>
                  <p className="text-blue-400 font-medium text-sm md:text-base mt-1">
                    {identityData.role}
                  </p>
                  <p className="text-slate-400 text-xs flex items-center gap-1.5 mt-2">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" /> {identityData.location}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={identityData.github}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                  >
                    <GithubIcon className="w-5 h-5" />
                  </a>
                  <a
                    href={identityData.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                  >
                    <LinkedInIcon className="w-5 h-5" />
                  </a>
                </div>
              </div>

              {/* Introduction */}
              <div className="bg-blue-950/30 border border-blue-800/40 rounded-2xl p-5">
                <p className="text-lg text-blue-200 font-medium leading-relaxed">
                  "{identityData.introduction}"
                </p>
              </div>

              {/* Developer Journey */}
              <div>
                <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-3">
                  Developer Journey
                </h3>
                <div className="space-y-3 text-slate-300 leading-relaxed text-sm md:text-base">
                  {identityData.aboutStory.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              </div>

              {/* Interests & Career Objectives */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-purple-400 mb-3 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" /> Areas of Focus
                  </h4>
                  <ul className="space-y-2 text-sm text-slate-300">
                    {identityData.interests.map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-emerald-400 mb-3 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Career Objectives
                  </h4>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {identityData.careerObjectives}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ================= LANDMARK 2: SKILLS ================= */}
          {landmarkId === 'skills' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Technical Arsenal</h2>
                <p className="text-sm text-slate-400 mt-1">
                  Categorized technical competencies with authentic hands-on experience levels.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {skillCategories.map((cat) => (
                  <div
                    key={cat.id}
                    className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-3"
                  >
                    <h3 className="text-xs font-mono font-bold tracking-widest text-pink-400 uppercase">
                      {cat.category}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {cat.skills.map((skill) => (
                        <div
                          key={skill.name}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs"
                        >
                          <span className="font-semibold text-white">{skill.name}</span>
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                              skill.level === 'Proficient'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : skill.level === 'Advanced'
                                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                            }`}
                          >
                            {skill.level}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= LANDMARK 3: PROJECTS ================= */}
          {landmarkId === 'projects' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Featured Projects</h2>
                <p className="text-sm text-slate-400 mt-1">
                  Production architectures, research platforms, and machine learning pipelines.
                </p>
              </div>

              {/* Project Card List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    onClick={() => setSelectedProject(proj)}
                    className="group cursor-pointer p-5 rounded-2xl bg-slate-800/40 hover:bg-slate-800 border border-slate-700/60 hover:border-blue-500/50 transition-all space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                        <span className="text-blue-400 font-bold">{`PROJECT ${proj.number}`}</span>
                        <span className="px-2 py-0.5 rounded-full bg-slate-700 text-[10px]">
                          {proj.type}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors mt-2">
                        {proj.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-3">
                        {proj.description}
                      </p>
                    </div>

                    <div className="pt-2">
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {proj.technologies.slice(0, 4).map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-[11px] text-slate-300 font-mono"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-700/40 text-xs font-semibold text-blue-400">
                        <span>Inspect Architecture & Specs</span>
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Selected Project Detailed Drawer */}
              {selectedProject && (
                <div className="p-6 rounded-2xl bg-slate-950 border border-blue-500/50 space-y-4 animate-in fade-in">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs font-mono text-blue-400 font-bold">
                        {`PROJECT ${selectedProject.number} • ${selectedProject.type}`}
                      </div>
                      <h3 className="text-xl font-bold text-white mt-1">
                        {selectedProject.title}
                      </h3>
                      <p className="text-xs text-slate-400">{selectedProject.subtitle}</p>
                    </div>
                    <button
                      onClick={() => setSelectedProject(null)}
                      className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800 text-slate-400 hover:text-white"
                    >
                      Close Details
                    </button>
                  </div>

                  <p className="text-sm text-slate-300 leading-relaxed">
                    {selectedProject.description}
                  </p>

                  {selectedProject.metrics && (
                    <div className="bg-emerald-950/30 border border-emerald-800/40 rounded-xl p-3.5 space-y-1.5">
                      <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" /> Quantifiable Impact
                      </div>
                      <ul className="text-xs text-emerald-200 space-y-1">
                        {selectedProject.metrics.map((m, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            {m}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 pt-2">
                    <a
                      href={selectedProject.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-slate-950 font-bold text-xs hover:bg-slate-200 transition-colors"
                    >
                      <GithubIcon className="w-4 h-4" /> View GitHub Repository
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= LANDMARK 4: EXPERIENCE & ACHIEVEMENTS ================= */}
          {landmarkId === 'experience' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Experience & Honors</h2>
                <p className="text-sm text-slate-400 mt-1">
                  Certifications, competitive hackathons, academic excellence, and coding achievements.
                </p>
              </div>

              {/* Education Section */}
              <div className="space-y-3">
                <h3 className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" /> Academic Background
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {educationList.map((edu) => (
                    <div
                      key={edu.id}
                      className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-1"
                    >
                      <div className="font-bold text-white text-sm">{edu.institution}</div>
                      <div className="text-xs text-blue-400 font-semibold">{edu.degree}</div>
                      <div className="text-xs text-slate-400 font-mono">
                        {edu.period} • <span className="text-amber-400 font-bold">{edu.result}</span>
                      </div>
                      {edu.description && (
                        <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                          {edu.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications Section */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase flex items-center gap-1.5">
                  <Award className="w-4 h-4" /> Professional Certifications
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {certificationsList.map((cert) => (
                    <div
                      key={cert.id}
                      className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 flex flex-col justify-between"
                    >
                      <div>
                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center text-lg mb-2">
                          🏆
                        </div>
                        <div className="font-bold text-white text-xs leading-snug">
                          {cert.title}
                        </div>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-2 font-mono">
                        {cert.issuer}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Achievements & Hackathons */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> Notable Achievements & Hackathons
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {achievementsList.map((ach) => (
                    <div
                      key={ach.id}
                      className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-1.5"
                    >
                      <div className="text-xs font-bold text-white">{ach.title}</div>
                      <div className="text-xs text-emerald-400 font-semibold">{ach.subtitle}</div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {ach.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= LANDMARK 5: RESUME ================= */}
          {landmarkId === 'resume' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-2xl font-bold text-white">Curriculum Vitae</h2>
                  <p className="text-sm text-slate-400">
                    Comprehensive overview of academic background, skills, and engineering experience.
                  </p>
                </div>
                <button
                  onClick={handleDownloadResume}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold text-xs shadow-lg active:scale-95 transition-all shrink-0"
                >
                  <Download className="w-4 h-4" /> Download Resume PDF
                </button>
              </div>

              {/* Resume Paper Preview */}
              <div className="p-6 md:p-8 rounded-2xl bg-slate-950 border border-slate-800 space-y-6 font-mono text-xs">
                <div>
                  <h3 className="text-base font-bold text-white">{identityData.name}</h3>
                  <div className="text-cyan-400">{identityData.role}</div>
                  <div className="text-slate-500 mt-1">
                    {identityData.email} • {identityData.phone} • {identityData.location}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-slate-400 font-bold uppercase tracking-wider text-[11px] border-b border-slate-800 pb-1">
                    SUMMARY
                  </div>
                  <p className="text-slate-300 font-sans text-xs leading-relaxed pt-1">
                    {identityData.introduction}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="text-slate-400 font-bold uppercase tracking-wider text-[11px] border-b border-slate-800 pb-1">
                    EDUCATION
                  </div>
                  {educationList.map((e) => (
                    <div key={e.id} className="pt-1">
                      <div className="text-white font-bold">{e.degree} — {e.institution}</div>
                      <div className="text-slate-400">{e.period} | Result: {e.result}</div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <div className="text-slate-400 font-bold uppercase tracking-wider text-[11px] border-b border-slate-800 pb-1">
                    CORE CERTIFICATIONS & HONORS
                  </div>
                  {certificationsList.map((c) => (
                    <div key={c.id} className="text-slate-300">
                      • {c.title} — <span className="text-slate-500">{c.issuer}</span>
                    </div>
                  ))}
                  <div className="text-slate-300">
                    • 170+ Data Structures & Algorithms Problems Solved in Java (LeetCode)
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= LANDMARK 6: CONTACT ================= */}
          {landmarkId === 'contact' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Transmission & Contact</h2>
                <p className="text-sm text-slate-400 mt-1">
                  Feel free to reach out for software engineering roles, collaboration, or technical discussions.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Channels */}
                <div className="space-y-3">
                  <a
                    href={`mailto:${identityData.email}`}
                    className="flex items-center gap-3 p-4 rounded-2xl bg-slate-800/40 hover:bg-slate-800 border border-slate-700/60 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400">Direct Email</div>
                      <div className="text-sm font-bold text-white">{identityData.email}</div>
                    </div>
                  </a>

                  <a
                    href={identityData.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 p-4 rounded-2xl bg-slate-800/40 hover:bg-slate-800 border border-slate-700/60 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                      <LinkedInIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400">LinkedIn Profile</div>
                      <div className="text-sm font-bold text-white">in/nitish-priyan</div>
                    </div>
                  </a>

                  <a
                    href={identityData.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 p-4 rounded-2xl bg-slate-800/40 hover:bg-slate-800 border border-slate-700/60 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-slate-500/10 text-slate-200 flex items-center justify-center">
                      <GithubIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400">GitHub Repository</div>
                      <div className="text-sm font-bold text-white">github.com/NITISH1817</div>
                    </div>
                  </a>
                </div>

                {/* Interactive Contact Form */}
                <form
                  onSubmit={handleSendMessage}
                  className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-3"
                >
                  <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-2">
                    Send a Message
                  </h3>

                  <div>
                    <input
                      type="text"
                      required
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <input
                      type="email"
                      required
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <textarea
                      required
                      rows={3}
                      placeholder="Your Message..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={formStatus === 'sending' || formStatus === 'sent'}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-colors disabled:opacity-75"
                  >
                    {formStatus === 'sending' ? (
                      'Transmitting Message...'
                    ) : formStatus === 'sent' ? (
                      'Message Received! Thank you.'
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" /> Send Transmission
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

