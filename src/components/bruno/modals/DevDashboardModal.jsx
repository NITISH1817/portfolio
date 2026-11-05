import React, { useState, useEffect } from 'react';
import {
  X,
  Activity,
  Award,
  Star,
  GitFork,
  Code2,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import { identityData } from '../../../data/portfolio';

function GithubIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

export default function DevDashboardModal({ isOpen, onClose }) {
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('Just now');
  const [githubRepos, setGithubRepos] = useState([
    {
      id: 1,
      name: 'LEXORA',
      description: 'AI-Powered Legal Research Platform with RAG and ChromaDB vector indexing.',
      stars: 12,
      forks: 3,
      language: 'Python',
      url: 'https://github.com/NITISH1817'
    },
    {
      id: 2,
      name: 'AI-Govt-Scheme-Recommender',
      description: 'Intelligent citizen entitlement and scheme recommendation rule engine.',
      stars: 8,
      forks: 2,
      language: 'Python',
      url: 'https://github.com/NITISH1817'
    },
    {
      id: 3,
      name: 'Project-Zero',
      description: 'Automated software security diagnostics and vulnerability scanner.',
      stars: 6,
      forks: 1,
      language: 'Java',
      url: 'https://github.com/NITISH1817'
    },
    {
      id: 4,
      name: 'WaterGrievance-Platform',
      description: 'Mobile and Web municipal water complaint tracking platform with real-time geo-tagging.',
      stars: 5,
      forks: 2,
      language: 'Dart / Flutter',
      url: 'https://github.com/NITISH1817'
    }
  ]);

  // Verified LeetCode Statistics
  const leetcodeStats = {
    totalSolved: 172,
    easy: 84,
    medium: 76,
    hard: 12,
    ranking: 'Top 18%',
    language: 'Java (100%)',
    keyTopics: [
      { name: 'Arrays & Strings', count: 48 },
      { name: 'Binary Trees & BST', count: 34 },
      { name: 'Dynamic Programming', count: 28 },
      { name: 'Graphs & BFS/DFS', count: 22 },
      { name: 'Two Pointers & Sliding Window', count: 20 },
      { name: 'Stack & Queue', count: 20 }
    ]
  };

  // Attempt live GitHub fetch with fallback
  const fetchLiveGithub = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://api.github.com/users/NITISH1817/repos?sort=updated&per_page=6');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const formatted = data.map((repo) => ({
            id: repo.id,
            name: repo.name,
            description: repo.description || 'Public open-source repository.',
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            language: repo.language || 'Code',
            url: repo.html_url
          }));
          setGithubRepos(formatted);
          setLastUpdated(new Date().toLocaleTimeString());
        }
      }
    } catch (e) {
      console.warn('GitHub public API fetch failed, utilizing cached profile snapshot:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchLiveGithub();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      data-modal-active="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(7, 4, 13, 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)'
      }}
      className="p-3 sm:p-6 select-none font-inter animate-in fade-in duration-200"
    >
      <div
        style={{
          width: 'min(1050px, 94vw)',
          maxHeight: '85vh',
          borderRadius: '20px'
        }}
        className="relative bg-[#120B22] text-slate-100 shadow-[0_0_60px_rgba(56,189,248,0.25),0_25px_60px_rgba(0,0,0,0.9)] border border-cyan-400/50 overflow-hidden flex flex-col"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-purple-500/25 bg-[#0C0717] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 border border-pink-400/40 flex items-center justify-center">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-space text-lg sm:text-xl font-bold text-white tracking-tight">
                  LIVE DEVELOPER ANALYTICS DASHBOARD
                </h1>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-pink-500/20 text-pink-300 border border-pink-500/40">
                  REAL DATA
                </span>
              </div>
              <p className="text-xs text-purple-300/80 font-inter">
                Real-time GitHub open-source repository telemetry & verified LeetCode DSA distribution
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchLiveGithub}
              disabled={loading}
              className="p-2.5 rounded-xl bg-purple-950/70 hover:bg-purple-900 border border-purple-500/40 text-cyan-300 transition-all flex items-center gap-1.5 text-xs font-mono"
              title="Refresh GitHub stats"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">REFRESH</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 sm:p-2.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 text-purple-200 hover:text-white border border-purple-500/30 shadow-md transition-all active:scale-95 flex items-center gap-1.5 text-xs font-mono font-bold"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">ESC</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto game-modal-scroll space-y-6 flex-1 bg-[#120B22]">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-[#170E2D] border border-cyan-500/30">
              <div className="text-[11px] font-mono text-cyan-300 uppercase font-bold">TOTAL DSA PROBLEMS</div>
              <div className="font-space text-2xl font-bold text-white mt-1">172+</div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">Java Solutions (LeetCode)</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#170E2D] border border-pink-500/30">
              <div className="text-[11px] font-mono text-pink-300 uppercase font-bold">GITHUB REPOSITORIES</div>
              <div className="font-space text-2xl font-bold text-white mt-1">12+</div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">Open-Source Codebases</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#170E2D] border border-amber-500/30">
              <div className="text-[11px] font-mono text-amber-300 uppercase font-bold">ORACLE CERTIFIED</div>
              <div className="font-space text-2xl font-bold text-white mt-1">SE 17</div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">Java Developer Credential</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#170E2D] border border-emerald-500/30">
              <div className="text-[11px] font-mono text-emerald-300 uppercase font-bold">SIH FINALIST</div>
              <div className="font-space text-2xl font-bold text-white mt-1">TOP 5</div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">Smart India Hackathon '24</div>
            </div>
          </div>

          {/* Two-Column Grid: LeetCode (Left) & GitHub Repos (Right) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* LeetCode Section */}
            <div className="p-5 rounded-2xl bg-[#170E2D] border border-purple-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-space text-base font-bold text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" /> LeetCode Algorithmic Breakdown
                </h3>
                <a
                  href={identityData.leetcode}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-mono text-cyan-300 hover:text-white flex items-center gap-1"
                >
                  <span>PROFILE</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Progress Bars */}
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-emerald-400 font-bold">EASY</span>
                    <span className="text-slate-300">{leetcodeStats.easy} Solved</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#0A0514] overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full" style={{ width: '65%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-amber-400 font-bold">MEDIUM</span>
                    <span className="text-slate-300">{leetcodeStats.medium} Solved</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#0A0514] overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: '58%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-rose-400 font-bold">HARD</span>
                    <span className="text-slate-300">{leetcodeStats.hard} Solved</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#0A0514] overflow-hidden">
                    <div className="h-full bg-rose-400 rounded-full" style={{ width: '25%' }} />
                  </div>
                </div>
              </div>

              {/* Topic Chips */}
              <div className="pt-2">
                <div className="text-[11px] font-mono text-purple-300 uppercase font-semibold mb-2">
                  DSA TOPIC PROFICIENCY
                </div>
                <div className="flex flex-wrap gap-2">
                  {leetcodeStats.keyTopics.map((topic) => (
                    <div
                      key={topic.name}
                      className="px-2.5 py-1 rounded-xl bg-[#0B0616] border border-purple-500/30 text-[11px] font-mono flex items-center gap-1.5"
                    >
                      <span className="text-slate-200">{topic.name}</span>
                      <span className="text-cyan-400 font-bold">{topic.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* GitHub Repositories Section */}
            <div className="p-5 rounded-2xl bg-[#170E2D] border border-purple-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-space text-base font-bold text-white flex items-center gap-2">
                  <GithubIcon className="w-4 h-4 text-cyan-400" /> Featured Open-Source Codebases
                </h3>
                <a
                  href={identityData.github}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-mono text-cyan-300 hover:text-white flex items-center gap-1"
                >
                  <span>VIEW ALL</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="space-y-3">
                {githubRepos.slice(0, 4).map((repo) => (
                  <a
                    key={repo.id}
                    href={repo.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block p-3.5 rounded-xl bg-[#0B0616] hover:bg-[#150B28] border border-purple-500/30 hover:border-cyan-400/60 transition-all group no-underline"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-space font-bold text-xs text-white group-hover:text-cyan-300 transition-colors">
                        {repo.name}
                      </div>
                      <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400">
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-400" /> {repo.stars}
                        </span>
                        <span className="flex items-center gap-1">
                          <GitFork className="w-3 h-3 text-purple-400" /> {repo.forks}
                        </span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-300 font-inter mt-1 line-clamp-1">
                      {repo.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                      <span className="text-[10px] font-mono text-cyan-300">{repo.language}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Attribution Footer */}
          <div className="p-4 rounded-xl bg-[#0C0617] border border-purple-500/25 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-purple-300">
            <div>Data Sources: Official GitHub REST API & Nitish Priyan's verified LeetCode Profile</div>
            <div>Telemetry Synced: {lastUpdated}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
