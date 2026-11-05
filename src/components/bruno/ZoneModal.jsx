import React, { useEffect } from 'react';
import { X, ExternalLink, Award, BookOpen, Mail, Phone, CheckCircle, Sparkles } from 'lucide-react';
import { identityData } from '../../data/portfolio';

function GithubIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

export default function ZoneModal({ data, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-800 dark:text-slate-100 flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-blue-500 animate-ping" />
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              {data.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* If it's a Project */}
          {data.technologies && (
            <div className="space-y-4">
              {data.type && (
                <div className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  {data.type}
                </div>
              )}

              <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
                {data.description}
              </p>

              {/* Metrics */}
              {data.metrics && data.metrics.length > 0 && (
                <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl p-4">
                  <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" /> Key Metrics & Impact
                  </div>
                  <ul className="space-y-1 text-sm text-emerald-900 dark:text-emerald-200">
                    {data.metrics.map((m, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Technologies */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                  Technologies & Architecture
                </h4>
                <div className="flex flex-wrap gap-2">
                  {data.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1.5 text-xs font-medium rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 flex flex-wrap gap-3">
                <a
                  href={identityData.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-xl text-sm hover:opacity-90 transition-opacity"
                >
                  <GithubIcon className="w-4 h-4" /> View on GitHub
                </a>
                <a
                  href={identityData.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-xl text-sm hover:bg-blue-700 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" /> Discuss on LinkedIn
                </a>
              </div>
            </div>
          )}

          {/* If it's Education & Honors */}
          {data.education && (
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-500 mb-3 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" /> Education
                </h4>
                <div className="space-y-3">
                  {data.education.map((edu) => (
                    <div
                      key={edu.id}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
                    >
                      <div className="font-bold text-slate-900 dark:text-white">
                        {edu.institution}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-300">
                        {edu.degree}
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        {edu.period} • {edu.result}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-500 mb-3 flex items-center gap-1.5">
                  <Award className="w-4 h-4" /> Certifications & Achievements
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {data.certifications.map((c) => (
                    <div
                      key={c.id}
                      className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm"
                    >
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {c.title}
                      </div>
                      <div className="text-xs text-slate-400">{c.issuer}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* If it's Contact */}
          {data.type === 'contact' && (
            <div className="space-y-4">
              <p className="text-slate-600 dark:text-slate-300">
                Interested in working together or discussing software engineering, Java, or AI/ML roles?
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href={`mailto:${identityData.email}`}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-blue-50 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <Mail className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="text-xs text-slate-500">Email Directly</div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">
                      {identityData.email}
                    </div>
                  </div>
                </a>

                <a
                  href={`tel:${identityData.phone}`}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <Phone className="w-5 h-5 text-emerald-600" />
                  <div>
                    <div className="text-xs text-slate-500">Phone / WhatsApp</div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">
                      {identityData.phone}
                    </div>
                  </div>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
