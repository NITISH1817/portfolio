export interface IdentityData {
  name: string;
  shortName: string;
  role: string;
  location: string;
  batch: string;
  cgpa: string;
  introduction: string;
  aboutStory: string[];
  interests: string[];
  careerObjectives: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  leetcode: string;
  dsaStats: string;
}

export interface SkillCategory {
  id: string;
  category: string;
  skills: { name: string; level: 'Proficient' | 'Advanced' | 'Experienced'; icon?: string }[];
}

export interface Project {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  type: 'TEAM PROJECT' | 'INDIVIDUAL PROJECT';
  technologies: string[];
  githubUrl: string;
  liveUrl?: string;
  metrics?: string[];
  features?: string[];
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  date?: string;
  credentialUrl?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  period: string;
  result?: string;
  description?: string;
}

export interface Achievement {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: 'Hackathon' | 'Certification' | 'Coding' | 'Academic';
}

export const identityData: IdentityData = {
  name: "NITISH PRIYAN R S",
  shortName: "NITISH PRIYAN",
  role: "Full Stack Developer | AI/ML Engineer | Software Developer",
  location: "India",
  batch: "2028",
  cgpa: "7.8",
  introduction: "I build intelligent applications, solve real-world problems, and develop software products using modern technologies.",
  aboutStory: [
    "I am a passionate Computer Science student and software engineer driven by building high-impact systems at the intersection of AI/ML, backend engineering, and intuitive user experiences.",
    "My journey spans developing scalable microservices in Java and Python, training computer vision and deep learning models for medical diagnostics, and orchestrating intelligent vector-search applications using LLMs and ChromaDB.",
    "Whether architecting event-driven government interoperability platforms or building real-time citizen grievance mobile apps, I focus on clean architecture, robust data pipelines, and measurable real-world outcomes."
  ],
  interests: [
    "Artificial Intelligence & LLM Workflows",
    "Scalable Backend & Distributed Systems",
    "Data Structures & Algorithmic Problem Solving",
    "Cloud Architecture & MLOps Pipelines",
    "Clean Code & Domain-Driven Design"
  ],
  careerObjectives: "To leverage my skills in full-stack software development, Java systems, and AI engineering to build resilient, human-centered products that solve complex computational and operational challenges at scale.",
  email: "nitishpriyan1807@gmail.com",
  phone: "+91 9442497220",
  linkedin: "https://www.linkedin.com/in/nitish-priyan/",
  github: "https://github.com/NITISH1817",
  leetcode: "https://leetcode.com/u/NITISH1817/",
  dsaStats: "170+ DSA Problems Solved in Java"
};

export interface Capability {
  id: string;
  title: string;
  technologies: string[];
  hoverEvidence?: Record<string, string>;
}

export const capabilities: Capability[] = [
  {
    id: "cap-01",
    title: "01 — FULL STACK & SOFTWARE DEVELOPMENT",
    technologies: ["Java", "Python", "C", "C++", "React.js", "Flutter", "Node.js"]
  },
  {
    id: "cap-02",
    title: "02 — AI & MACHINE LEARNING",
    technologies: ["Scikit-learn", "TensorFlow", "PyTorch", "NLP", "Computer Vision", "Gemini AI"]
  },
  {
    id: "cap-03",
    title: "03 — BACKEND & API ENGINEERING",
    technologies: ["FastAPI", "Flask", "Node.js", "REST APIs", "Event-Driven Systems"]
  },
  {
    id: "cap-04",
    title: "04 — DATABASES & VECTOR STORAGE",
    technologies: ["MySQL", "SQLite", "ChromaDB (Vector DB)"]
  },
  {
    id: "cap-05",
    title: "05 — DEVOPS & TOOLS",
    technologies: ["Git", "GitHub", "Docker", "CI/CD", "Linux"]
  }
];

export const skillCategories: SkillCategory[] = [
  {
    id: "lang",
    category: "Programming Languages",
    skills: [
      { name: "Java", level: "Proficient" },
      { name: "Python", level: "Proficient" },
      { name: "C", level: "Advanced" },
      { name: "C++", level: "Advanced" },
      { name: "JavaScript", level: "Proficient" }
    ]
  },
  {
    id: "aiml",
    category: "AI & Machine Learning",
    skills: [
      { name: "Scikit-learn", level: "Proficient" },
      { name: "TensorFlow", level: "Advanced" },
      { name: "PyTorch", level: "Advanced" },
      { name: "NLP", level: "Advanced" },
      { name: "Computer Vision", level: "Advanced" },
      { name: "Gemini AI", level: "Proficient" }
    ]
  },
  {
    id: "frontend",
    category: "Frontend Development",
    skills: [
      { name: "React.js", level: "Proficient" },
      { name: "Flutter", level: "Experienced" },
      { name: "HTML5 & CSS3", level: "Proficient" },
      { name: "Tailwind CSS", level: "Proficient" },
      { name: "Three.js / WebGL", level: "Advanced" }
    ]
  },
  {
    id: "backend",
    category: "Backend & APIs",
    skills: [
      { name: "FastAPI", level: "Proficient" },
      { name: "Flask", level: "Advanced" },
      { name: "Node.js", level: "Advanced" },
      { name: "REST APIs", level: "Proficient" },
      { name: "Event-Driven Systems", level: "Advanced" }
    ]
  },
  {
    id: "databases",
    category: "Databases & Storage",
    skills: [
      { name: "MySQL", level: "Proficient" },
      { name: "SQLite", level: "Proficient" },
      { name: "ChromaDB (Vector DB)", level: "Advanced" }
    ]
  },
  {
    id: "tools",
    category: "Tools & DevOps",
    skills: [
      { name: "Git", level: "Proficient" },
      { name: "GitHub", level: "Proficient" },
      { name: "Docker", level: "Advanced" },
      { name: "CI/CD", level: "Experienced" },
      { name: "Linux / Shell", level: "Advanced" }
    ]
  }
];

export const projects: Project[] = [
  {
    id: "proj-lexora",
    number: "01",
    title: "LEXORA — AI-Powered Legal Research Platform",
    subtitle: "Vector Search & Retrieval Augmented Generation for Legal Precedents",
    description: "An advanced AI-powered legal intelligence system that indexes complex statutes, judicial rulings, and precedents using semantic embeddings and ChromaDB. Delivers natural language citation analysis, automated case summarization, and precedent verification using Gemini AI and FastAPI.",
    type: "TEAM PROJECT",
    technologies: ["Python", "NLP", "FastAPI", "React.js", "ChromaDB", "Gemini AI", "Tailwind CSS"],
    githubUrl: "https://github.com/NITISH1817",
    metrics: [
      "Semantic similarity search across thousands of legal statutes",
      "Sub-second semantic retrieval using ChromaDB HNSW indexing",
      "Automated case brief generation reducing legal research overhead"
    ],
    features: [
      "Semantic search across statutory laws and precedent cases",
      "Automated legal citation extraction & cross-referencing",
      "Interactive query playground with source grounding"
    ]
  },
  {
    id: "proj-gov-scheme",
    number: "02",
    title: "AI-Powered Government Scheme Eligibility Recommender",
    subtitle: "Intelligent Citizen Entitlement & Welfare Matching Engine",
    description: "A machine learning entitlement engine that democratizes access to state and central welfare schemes. Analyzes socioeconomic, demographic, and agricultural profiles to match citizens with eligible subsidies, loans, and education programs with clear qualifying criteria.",
    type: "INDIVIDUAL PROJECT",
    technologies: ["Python", "Scikit-learn", "Machine Learning", "FastAPI", "React.js", "MySQL"],
    githubUrl: "https://github.com/NITISH1817",
    metrics: [
      "94% eligibility matching precision across multi-attribute profiles",
      "Evaluates 150+ central & state welfare criteria simultaneously",
      "Multilingual profile input designed for accessibility"
    ],
    features: [
      "Dynamic questionnaire with conditional attribute evaluation",
      "Instant eligibility scoring with required document checklists",
      "Direct portal application links with tracking guidelines"
    ]
  },
  {
    id: "proj-zero",
    number: "03",
    title: "Project Zero — Campus Innovation Engine",
    subtitle: "AI Problem Clustering & Collaborative Solution Incubator",
    description: "An intelligent platform that identifies, clusters, and prioritizes unsolved campus and community challenges. Employs NLP topic modeling and semantic embeddings to prevent duplicate initiatives and connect interdisciplinary student teams to high-impact projects.",
    type: "TEAM PROJECT",
    technologies: ["React.js", "FastAPI", "AI/ML", "ChromaDB", "Node.js", "Tailwind CSS"],
    githubUrl: "https://github.com/NITISH1817",
    metrics: [
      "Automated problem deduplication with 88% semantic accuracy",
      "Active collaboration workspace adopted across student departments"
    ],
    features: [
      "Natural language problem intake & automated tag clustering",
      "Skill-matching algorithm for project collaborator discovery",
      "Milestone tracking and mentor review workflow"
    ]
  },
  {
    id: "proj-movie",
    number: "04",
    title: "Movie Recommendation System",
    subtitle: "Hybrid Content-Based & Collaborative Recommendation Engine",
    description: "A recommendation engine synthesizing metadata extraction (genres, cast, keywords, directors) with user rating matrices. Implements cosine similarity on TF-IDF vectors alongside matrix factorization to deliver accurate, non-obvious film recommendations in real time.",
    type: "INDIVIDUAL PROJECT",
    technologies: ["Python", "Scikit-learn", "Collaborative Filtering", "Pandas", "Streamlit", "React.js"],
    githubUrl: "https://github.com/NITISH1817",
    metrics: [
      "Trained on MovieLens 100k+ dataset with low RMSE latency",
      "Sub-50ms recommendation generation for 5,000+ indexed titles"
    ],
    features: [
      "Interactive hybrid recommendation slider (Content vs Collaborative)",
      "Dynamic movie posters and metadata preview modal",
      "Cold-start handling for new user taste profiles"
    ]
  },
  {
    id: "proj-water",
    number: "05",
    title: "WaterGrievance Application",
    subtitle: "Geo-Tagged Citizen Water Supply & Infrastructure Grievance Portal",
    description: "A civic-tech mobile application enabling citizens to report water supply shortages, pipe leakages, and water contamination with GPS geo-tagging and image evidence. Includes an administrative dashboard for municipal engineers with automated SLA escalation.",
    type: "TEAM PROJECT",
    technologies: ["Flutter", "Node.js", "Express", "MySQL", "Geo-tagging", "REST APIs"],
    githubUrl: "https://github.com/NITISH1817",
    metrics: [
      "Real-time GPS validation preventing duplicate leak complaints",
      "40% faster grievance resolution dispatch for local municipal zones"
    ],
    features: [
      "One-tap photo reporting with automatic GPS geotag coordinates",
      "Live grievance resolution timeline & status notifications",
      "Municipal zoning heatmaps for recurring pipeline failures"
    ]
  },
  {
    id: "proj-setu",
    number: "06",
    title: "SETU — Government Service Interoperability Platform",
    subtitle: "Event-Driven Orchestration Platform for Fragmented Citizen Portals",
    description: "A resilient backend architecture connecting isolated government departmental databases. Features role-based access control, cryptographic verification of citizen records, and asynchronous message queues to ensure reliable multi-departmental workflow orchestration.",
    type: "TEAM PROJECT",
    technologies: ["Java", "Java SE 17", "REST APIs", "Event-Driven Architecture", "RBAC", "MySQL"],
    githubUrl: "https://github.com/NITISH1817",
    metrics: [
      "Architected event-driven microservices handling asynchronous payloads",
      "End-to-end audit logging & role-based access control compliance"
    ]
  },
  {
    id: "proj-retinopathy",
    number: "07",
    title: "Diabetic Retinopathy Classification System",
    subtitle: "Deep Learning Medical Image Diagnostics with Grad-CAM Explainability",
    description: "Medical diagnostic deep learning system trained on retinal fundus photography to detect five stages of diabetic retinopathy. Implements EfficientNet-B3 with Grad-CAM heatmaps to provide explainable visual evidence for ophthalmologists.",
    type: "TEAM PROJECT",
    technologies: ["Python", "PyTorch", "EfficientNet-B3", "Grad-CAM", "Next.js", "Gradio"],
    githubUrl: "https://github.com/NITISH1817",
    metrics: [
      "71% validation accuracy on clinical retinal fundus benchmarks",
      "Grad-CAM visual attention overlays highlighting microaneurysms"
    ]
  }
];

export const educationList: Education[] = [
  {
    id: "edu-01",
    institution: "BANNARI AMMAN INSTITUTE OF TECHNOLOGY",
    degree: "B.E. Computer Science and Engineering",
    period: "2024 – 2028 (Expected)",
    result: "CGPA 7.8",
    description: "Focus on Algorithms, Object-Oriented Software Design, Distributed Systems, Machine Learning, and Cloud Computing."
  },
  {
    id: "edu-02",
    institution: "SARATHA MATRICULATION HIGHER SECONDARY SCHOOL",
    degree: "Higher Secondary Certificate (HSC)",
    period: "2023 – 2024",
    result: "93.1%",
    description: "Excellence in Mathematics, Computer Science, and Physics."
  }
];

export const certificationsList: Certification[] = [
  {
    id: "cert-01",
    title: "Oracle Certified Associate: Java SE 17 Developer",
    issuer: "Oracle Corporation",
    date: "2024"
  },
  {
    id: "cert-02",
    title: "AWS Cloud Practitioner Essentials",
    issuer: "Amazon Web Services (AWS)",
    date: "2024"
  },
  {
    id: "cert-03",
    title: "Introduction to Cybersecurity",
    issuer: "Cisco Networking Academy",
    date: "2024"
  }
];

export const achievementsList: Achievement[] = [
  {
    id: "ach-iot",
    title: "IoT Hackathon — Third Place",
    subtitle: "Hardware & Embedded Cloud Innovation",
    description: "Awarded 3rd place for engineering an IoT-enabled smart monitoring prototype integrating embedded microcontrollers, edge sensors, and real-time cloud analytics for industrial automation.",
    category: "Hackathon"
  },
  {
    id: "ach-sih",
    title: "Smart India Hackathon (SIH 2025)",
    subtitle: "Selected Participant",
    description: "Selected to compete nationwide solving national-scale problem statements for public digital infrastructure.",
    category: "Hackathon"
  },
  {
    id: "ach-dsa",
    title: "170+ DSA Problems Solved in Java",
    subtitle: "LeetCode & Competitive Platforms",
    description: "Consistent problem solver in core data structures (Trees, Dynamic Programming, Graphs, Backtracking, Two Pointers) on LeetCode.",
    category: "Coding"
  }
];
