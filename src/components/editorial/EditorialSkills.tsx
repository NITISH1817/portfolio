import React from 'react';
import { 
  Code2, 
  Cpu, 
  Globe, 
  Database, 
  Terminal, 
  GitBranch, 
  Sparkles,
  Layers,
  Server
} from 'lucide-react';

export default function EditorialSkills() {
  const skillGroups = [
    {
      id: 'programming',
      title: 'PROGRAMMING LANGUAGES',
      icon: Code2,
      accentColor: 'text-amber-400',
      borderColor: 'border-amber-500/20 hover:border-amber-500/40',
      bgGlow: 'bg-amber-500/5',
      description: 'Core typed systems, enterprise object-oriented engineering, and algorithmic problem-solving.',
      skills: [
        { name: 'Java', note: 'Oracle Certified Java SE 17' },
        { name: 'Python', note: 'Data Science & FastAPI' },
        { name: 'TypeScript', note: 'Type-Safe Web Apps' },
        { name: 'C', note: 'Systems & Memory' },
        { name: 'C++', note: 'Algorithms & Structures' },
        { name: 'SQL', note: 'Relational Queries & DDL' }
      ]
    },
    {
      id: 'aiml',
      title: 'AI, MACHINE LEARNING & MLOPS',
      icon: Cpu,
      accentColor: 'text-purple-400',
      borderColor: 'border-purple-500/20 hover:border-purple-500/40',
      bgGlow: 'bg-purple-500/5',
      description: 'Statistical modeling, experiment logging, concept drift monitoring, and multimodal LLM integration.',
      skills: [
        { name: 'Scikit-learn', note: 'Classification & Regression' },
        { name: 'XGBoost', note: 'Gradient Boosted Decision Trees' },
        { name: 'MLflow', note: 'Experiment Tracking & Artifacts' },
        { name: 'Gemini AI', note: 'Multimodal RAG & Voice' },
        { name: 'DVC', note: 'Data Version Control' },
        { name: 'Evidently AI', note: 'Continuous Drift Auditing' }
      ]
    },
    {
      id: 'web',
      title: 'FRONTEND & BACKEND ENGINEERING',
      icon: Globe,
      accentColor: 'text-cyan-400',
      borderColor: 'border-cyan-500/20 hover:border-cyan-500/40',
      bgGlow: 'bg-cyan-500/5',
      description: 'Distributed microservices, reactive UI state architectures, and WebGPU 3D spatial graphics.',
      skills: [
        { name: 'React', note: 'Modern Hooks & Architecture' },
        { name: 'Node.js', note: 'Runtime & Event Loop' },
        { name: 'FastAPI', note: 'High-Performance Async REST' },
        { name: 'Three.js', note: '3D WebGPU & Canvas' },
        { name: 'REST APIs', note: 'Contract Design & JSON' },
        { name: 'JWT', note: 'Stateless Token Security' },
        { name: 'WebSockets', note: 'Bi-directional Real-Time' }
      ]
    },
    {
      id: 'infra',
      title: 'DATABASES & DEVOPS INFRASTRUCTURE',
      icon: Database,
      accentColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/20 hover:border-emerald-500/40',
      bgGlow: 'bg-emerald-500/5',
      description: 'Persistent schema modeling, relational and document stores, containerized delivery, and Git versioning.',
      skills: [
        { name: 'MySQL', note: 'Relational ACID Databases' },
        { name: 'PostgreSQL', note: 'Enterprise Relational' },
        { name: 'MongoDB', note: 'Document Store & Aggregations' },
        { name: 'SQLAlchemy', note: 'Python ORM & Sessions' },
        { name: 'Docker', note: 'Containerization & Microservices' },
        { name: 'Git & GitHub', note: 'Trunk-Based Collaboration' }
      ]
    }
  ];

  return (
    <section id="skills" className="py-24 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-purple-400 font-mono text-xs tracking-widest uppercase">
              <span>03</span>
              <span className="w-8 h-px bg-purple-500/40" />
              <span>Capabilities</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-sans">
              TECHNICAL COMPETENCIES & <br />
              STACK
            </h2>
          </div>
          <p className="text-sm font-mono text-slate-400 max-w-md">
            Organized into four functional pillars. Displayed with restrained visual treatment without artificial percentage bars.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skillGroups.map((group) => {
            const Icon = group.icon;
            return (
              <div
                key={group.id}
                className={`p-6 sm:p-8 rounded-3xl bg-[#090E1A] border ${group.borderColor} transition-all duration-300 relative overflow-hidden flex flex-col justify-between space-y-6 group`}
              >
                <div className={`absolute top-0 right-0 w-64 h-64 ${group.bgGlow} rounded-full blur-[90px] pointer-events-none`} />

                <div className="space-y-3 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-xl bg-white/5 ${group.accentColor}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-mono font-bold text-sm tracking-wider uppercase text-white">
                        {group.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    {group.description}
                  </p>
                </div>

                {/* Skill Chips */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 relative z-10 pt-2">
                  {group.skills.map((skill) => (
                    <div
                      key={skill.name}
                      className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/15 transition-all flex flex-col justify-center"
                    >
                      <span className="font-mono font-bold text-xs text-slate-100">
                        {skill.name}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {skill.note}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

