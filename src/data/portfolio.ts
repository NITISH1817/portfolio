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
  resumeUrl: string;
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
  type: 'FLAGSHIP PROJECT' | 'TEAM PROJECT' | 'INDIVIDUAL PROJECT';
  status?: string;
  technologies: string[];
  githubUrl: string;
  liveUrl?: string;
  repoStatus?: 'Public Repository' | 'Hugging Face Spaces' | 'Private Academic Repository';
  isPublicRepo?: boolean;
  metrics?: string[];
  features?: string[];
  problemStatement?: string;
  solution?: string;
  technicalDecisions?: { title: string; rationale: string }[];
  architectureSteps?: string[];
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
  category: 'Patent' | 'Hackathon' | 'Certification' | 'Coding' | 'Academic';
}

export const identityData: IdentityData = {
  name: "NITISH PRIYAN R S",
  shortName: "NITISH PRIYAN",
  role: "Computer Science & Engineering Student | Software Engineer | Java Developer | AI/ML Engineer",
  location: "Tamil Nadu, India",
  batch: "Batch of 2028",
  cgpa: "7.8",
  introduction: "Computer Science undergraduate (Batch of 2028) and aspiring Software Engineer with strong proficiency in Java, backed by an Oracle Certified Associate Java SE 17 Developer credential and AWS Cloud Practitioner certification. Hands-on experience across Full-Stack Development, Machine Learning and MLOps. Built and deployed 10+ projects spanning a patent-filed AI e-governance platform, an AI campus digital twin, and MLOps decision-support systems using Java, Python, TypeScript, REST APIs, React, and Git. Solved 250+ DSA problems in Java on LeetCode.",
  aboutStory: [
    "I am a Computer Science undergraduate (Batch of 2028) at Bannari Amman Institute of Technology with a 7.8 CGPA and an aspiring Software Engineer with strong proficiency in Java.",
    "Certified as an Oracle Certified Associate: Java SE 17 Developer and AWS Cloud Practitioner, with over 250+ Data Structures & Algorithms problems solved in Java on LeetCode.",
    "Proven track record of building and deploying 10+ production-grade projects: from filing a patent for GovScheme (an AI-powered welfare discovery platform with sub-50ms matching) to engineering NEXORA (an AI campus digital twin with 129/129 tests passing and 253 kB bundle) and production MLOps pipelines."
  ],
  interests: [
    "Enterprise Java & Software Engineering",
    "Artificial Intelligence & MLOps Lifecycle",
    "Data Structures & Algorithmic Optimization (250+ Java DSA)",
    "Distributed Web Services & REST API Design",
    "Interactive 3D Graphics & Three.js Systems"
  ],
  careerObjectives: "To leverage strong Java engineering, full-stack development, and machine learning competencies to build scalable, resilient, and human-centered software products that solve mission-critical real-world challenges.",
  email: "nitishpriyan1807@gmail.com",
  phone: "+91 9442497220",
  linkedin: "https://www.linkedin.com/in/nitish-priyan/",
  github: "https://github.com/NITISH1817",
  leetcode: "https://leetcode.com/u/NITISH1817/",
  dsaStats: "250+ DSA Problems Solved in Java (LeetCode)",
  resumeUrl: "/resume/Nitish_Priyan_Resume_Blue.pdf"
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
    title: "01 — SOFTWARE & BACKEND ENGINEERING",
    technologies: ["Java", "Python", "TypeScript", "C", "C++", "SQL", "FastAPI", "Node.js", "REST APIs", "JWT Authentication"]
  },
  {
    id: "cap-02",
    title: "02 — AI, MACHINE LEARNING & MLOPS",
    technologies: ["Scikit-learn", "XGBoost", "MLflow", "Gemini AI", "DVC", "Evidently AI", "NLP", "Computer Vision"]
  },
  {
    id: "cap-03",
    title: "03 — WEB & 3D INTERACTIVE SYSTEMS",
    technologies: ["React", "Three.js", "WebSockets", "Tesseract.js", "Tailwind CSS", "HTML5 & CSS3"]
  },
  {
    id: "cap-04",
    title: "04 — DATABASES & ORM",
    technologies: ["MySQL", "PostgreSQL", "MongoDB", "SQLAlchemy", "SQLite"]
  },
  {
    id: "cap-05",
    title: "05 — DEVOPS, TESTING & TOOLS",
    technologies: ["Docker", "Git", "GitHub", "CI/CD", "Automated Testing (129/129 Passing)"]
  }
];

export const skillCategories: SkillCategory[] = [
  {
    id: "lang",
    category: "Programming Languages",
    skills: [
      { name: "Java", level: "Proficient" },
      { name: "Python", level: "Proficient" },
      { name: "TypeScript", level: "Proficient" },
      { name: "C", level: "Advanced" },
      { name: "C++", level: "Advanced" },
      { name: "SQL", level: "Proficient" }
    ]
  },
  {
    id: "aiml",
    category: "AI, ML & MLOps",
    skills: [
      { name: "Scikit-learn", level: "Proficient" },
      { name: "XGBoost", level: "Proficient" },
      { name: "MLflow", level: "Proficient" },
      { name: "Gemini AI", level: "Proficient" },
      { name: "DVC", level: "Advanced" },
      { name: "Evidently AI", level: "Advanced" }
    ]
  },
  {
    id: "backend",
    category: "Web & Backend Development",
    skills: [
      { name: "FastAPI", level: "Proficient" },
      { name: "Node.js", level: "Proficient" },
      { name: "React", level: "Proficient" },
      { name: "Three.js", level: "Advanced" },
      { name: "REST API Design", level: "Proficient" },
      { name: "JWT Authentication", level: "Proficient" },
      { name: "WebSockets", level: "Advanced" }
    ]
  },
  {
    id: "databases",
    category: "Databases & Storage",
    skills: [
      { name: "MySQL", level: "Proficient" },
      { name: "PostgreSQL", level: "Proficient" },
      { name: "MongoDB", level: "Proficient" },
      { name: "SQLAlchemy", level: "Proficient" },
      { name: "SQLite", level: "Proficient" }
    ]
  },
  {
    id: "devops",
    category: "DevOps & Core Concepts",
    skills: [
      { name: "Docker", level: "Advanced" },
      { name: "Git & GitHub", level: "Proficient" },
      { name: "CI/CD", level: "Advanced" },
      { name: "DSA (250+ Solved)", level: "Proficient" },
      { name: "OOP & Systems Design", level: "Proficient" }
    ]
  }
];

export const softSkillsList: string[] = [
  "Teamwork",
  "Problem Solving",
  "Critical Thinking",
  "Communication"
];

export const languagesList: string[] = [
  "English — Professional Proficiency",
  "Tamil — Native"
];

export const projects: Project[] = [
  {
    id: "proj-govscheme",
    number: "01",
    title: "GOVSCHEME — AI Welfare Discovery & Lifecycle Administration Platform",
    subtitle: "Patent-Filed Hybrid Eligibility & E-Governance Intelligence Platform",
    status: "Patent Filed",
    description: "An AI-powered citizen entitlement platform that democratizes access to 75+ state and central welfare schemes across 10 official Indian languages. Features a patent-filed hybrid eligibility decision engine (MCDA), semantic search, client-side OCR for document analysis, multilingual voice interface, and WebSocket-driven real-time application tracking with explainable matching.",
    type: "FLAGSHIP PROJECT",
    technologies: ["React", "TypeScript", "Node.js", "MongoDB", "Google Gemini AI", "WebSockets", "Tesseract.js"],
    githubUrl: "https://github.com/NITISH1817/GovScheme",
    repoStatus: "Public Repository",
    isPublicRepo: true,
    metrics: [
      "Sub-50ms explainable eligibility matching across 75+ welfare schemes",
      "Patent filed for hybrid eligibility decision engine (MCDA)",
      "Supports 10 official Indian languages with voice interface & client-side OCR"
    ],
    features: [
      "75+ Central & State welfare schemes catalog",
      "Multilingual accessibility across 10 official Indian languages",
      "Hybrid eligibility decision engine with Multi-Criteria Decision Analysis (MCDA)",
      "Client-side OCR with Tesseract.js for instant document verification",
      "Real-time WebSocket application lifecycle status tracker",
      "Multilingual voice input interface powered by Google Gemini AI"
    ],
    problemStatement: "Citizens in rural and semi-urban communities often forfeit crucial governmental entitlements and financial aid due to complex bureaucratic criteria, language barriers, and manual document submission bottlenecks.",
    solution: "A patent-filed e-governance platform featuring an explainable MCDA hybrid eligibility engine, sub-50ms matching across 75+ schemes, client-side OCR document scanning, and 10 Indian language voice interactions.",
    technicalDecisions: [
      {
        title: "Patent-Filed Hybrid Eligibility Engine (MCDA)",
        rationale: "Engineered multi-criteria decision analysis to compute mathematically explainable matching scores with sub-50ms query latency."
      },
      {
        title: "Client-Side Tesseract.js OCR",
        rationale: "Executed OCR directly in the browser to maintain strict user privacy and eliminate heavy server-side image processing costs."
      },
      {
        title: "WebSocket Application State Machine",
        rationale: "Utilized bidirectional WebSockets to stream real-time lifecycle status updates as citizen applications traverse verification stages."
      }
    ],
    architectureSteps: [
      "Multilingual Voice/Text Citizen Intake (10 Languages)",
      "Client-Side OCR Document Parsing (Tesseract.js)",
      "MCDA Hybrid Eligibility Decision Engine",
      "MongoDB Distributed Scheme Catalog",
      "Google Gemini AI Natural Language Explanations",
      "Real-Time WebSocket Application Tracking"
    ]
  },
  {
    id: "proj-nexora",
    number: "02",
    title: "NEXORA — AI-Powered Campus Digital Twin",
    subtitle: "Interactive 3D Digital Twin with Predictive ML & Sustainability Analytics",
    status: "Production Deployed",
    description: "An AI-powered campus digital twin integrating 3D spatial visualization with five predictive machine learning models. Delivers real-time resource forecasting (energy, water, occupancy), anomaly detection, what-if simulations, optimization workflows, and comprehensive sustainability analytics. Built with 129 passing automated tests and optimized frontend bundle size.",
    type: "FLAGSHIP PROJECT",
    technologies: ["Python", "FastAPI", "React.js", "Three.js", "Scikit-learn", "SQLAlchemy", "PostgreSQL", "SQLite", "Docker", "JWT", "Git"],
    githubUrl: "https://github.com/NITISH1817/portfolio",
    repoStatus: "Public Repository",
    isPublicRepo: true,
    metrics: [
      "129/129 passing automated tests across all API endpoints & ML modules",
      "Initial frontend JS bundle reduced from 1.73 MB to 253.33 kB (85% optimization)",
      "Five production predictive ML models running live anomaly detection"
    ],
    features: [
      "Interactive 3D campus visualization with Three.js WebGPU/WebGL",
      "Five predictive ML models forecasting power, water, and space occupancy",
      "Real-time sensor anomaly detection with threshold alerts",
      "Interactive 'What-If' simulation sandbox for campus administration",
      "Sustainability analytics dashboard tracking carbon footprints",
      "Dockerized microservice architecture secured with JWT authentication"
    ],
    problemStatement: "Modern university campuses operate disconnected facility management systems, resulting in unmonitored energy spikes, delayed anomaly resolution, and inability to simulate operational interventions.",
    solution: "A unified AI campus digital twin combining interactive Three.js 3D spatial models with 5 Scikit-learn predictive algorithms, automated sensor anomaly detection, and interactive simulation controls.",
    technicalDecisions: [
      {
        title: "Frontend Code-Splitting & Tree-Shaking",
        rationale: "Optimized rollups and chunking to slash initial bundle weight from 1.73 MB to 253.33 kB, ensuring sub-500ms initial loads."
      },
      {
        title: "Test-Driven Development (TDD)",
        rationale: "Authored 129 comprehensive automated unit, integration, and regression tests ensuring 100% test pass rate across all services."
      },
      {
        title: "Dual Database Strategy (PostgreSQL & SQLite)",
        rationale: "Used SQLAlchemy abstraction supporting robust PostgreSQL in production and high-speed SQLite for isolated automated CI test runs."
      }
    ],
    architectureSteps: [
      "IoT Sensor & Facility Telemetry Ingestion",
      "FastAPI Async Data Pipeline",
      "5 Predictive Machine Learning Models (Scikit-learn)",
      "PostgreSQL / SQLAlchemy Storage Layer",
      "Three.js 3D Campus Spatial Rendering",
      "Sustainability Analytics & Simulation Sandbox"
    ]
  },
  {
    id: "proj-mlops",
    number: "03",
    title: "Student Performance Prediction & MLOps Decision Support System",
    subtitle: "End-to-End MLOps Pipeline for Student Outcome Prediction & Risk Intervention",
    status: "Production Deployed",
    description: "A production-grade end-to-end MLOps platform engineered to predict student academic outcomes, compute multi-factor risk scores, and deliver personalized intervention recommendations. Features XGBoost models tracked with MLflow, DVC data versioning, Evidently AI drift monitoring, and containerized Docker CI/CD pipelines.",
    type: "FLAGSHIP PROJECT",
    technologies: ["Python", "FastAPI", "XGBoost", "MLflow", "DVC", "Docker", "CI/CD", "Evidently AI"],
    githubUrl: "https://github.com/NITISH1817/Student-Performance-MLOps",
    repoStatus: "Public Repository",
    isPublicRepo: true,
    metrics: [
      "89.1% prediction accuracy across multi-cohort academic benchmark datasets",
      "82.6% recall on at-risk student intervention alerts",
      "Continuous data & model drift monitoring powered by MLflow and Evidently AI"
    ],
    features: [
      "XGBoost early-warning academic risk scoring classifier",
      "MLflow experiment tracking with automated hyperparameter logging",
      "Data version control (DVC) for reproducible feature engineering",
      "Continuous data and concept drift detection with Evidently AI",
      "Containerized microservice architecture with automated CI/CD deployment"
    ],
    problemStatement: "Educational institutions lack predictive diagnostic tools to detect struggling students early in the semester, leading to avoidable course dropouts and failures.",
    solution: "An end-to-end MLOps platform featuring an XGBoost classification pipeline tracked with MLflow, DVC, and Evidently AI, detecting at-risk students with 82.6% recall and 89.1% accuracy.",
    technicalDecisions: [
      {
        title: "XGBoost with Class-Weighted Penalty",
        rationale: "Tuned on imbalanced academic failure cohorts to prioritize recall (82.6%) for vulnerable students over raw precision."
      },
      {
        title: "MLflow & DVC Experiment Tracking",
        rationale: "Versioned feature matrices and tracked hyperparameters across 40+ training runs to guarantee model reproducibility."
      },
      {
        title: "Evidently AI Continuous Drift Detection",
        rationale: "Configured scheduled statistical tests (Kolmogorov-Smirnov) to monitor covariate shift in incoming semester grade distributions."
      }
    ],
    architectureSteps: [
      "Academic Feature Extraction & Normalization",
      "DVC Data Versioning Pipeline",
      "XGBoost Inference Engine",
      "MLflow Metric & Artifact Tracking",
      "Evidently AI Drift Monitoring",
      "FastAPI Prediction Endpoint & CI/CD"
    ]
  },
  {
    id: "proj-lexora",
    number: "04",
    title: "LEXORA — AI-Powered Legal Research Platform",
    subtitle: "Vector Search & Retrieval Augmented Generation for Legal Precedents",
    status: "Active",
    description: "An advanced AI-powered legal intelligence system that indexes complex statutes, judicial rulings, and precedents using semantic embeddings and ChromaDB. Delivers natural language citation analysis, automated case summarization, and precedent verification using Gemini AI and FastAPI.",
    type: "TEAM PROJECT",
    technologies: ["Python", "NLP", "FastAPI", "React.js", "ChromaDB", "Gemini AI", "Tailwind CSS"],
    githubUrl: "https://github.com/NITISH1817/LEXORA-AI",
    repoStatus: "Public Repository",
    isPublicRepo: true,
    metrics: [
      "Semantic similarity search across thousands of legal statutes",
      "Sub-second semantic retrieval using ChromaDB HNSW indexing",
      "Automated case brief generation reducing legal research overhead"
    ],
    features: [
      "Semantic search across statutory laws and precedent cases",
      "Automated legal citation extraction & cross-referencing",
      "Interactive query playground with source grounding"
    ],
    problemStatement: "Legal advocates and researchers spend hundreds of manual hours cross-referencing dense statutes and precedent case rulings across fragmented portals, where conventional keyword searches fail to detect semantic conceptual relevance.",
    solution: "An end-to-end legal intelligence platform that indexes statutory clauses and judicial rulings into ChromaDB with dense vector embeddings. Powered by FastAPI and Gemini AI RAG, it yields sub-second semantic search, automated precedent citation mapping, and verifiable grounded case briefs.",
    technicalDecisions: [
      {
        title: "ChromaDB HNSW Indexing",
        rationale: "Selected over PostgreSQL pgvector to maintain a low-overhead, embedded vector store with sub-100ms vector cosine distance lookups."
      },
      {
        title: "Hierarchical Clause Chunking",
        rationale: "Implemented hierarchical legal clause parsing with parent-document metadata tagging to prevent hallucinated, out-of-context legal citations."
      },
      {
        title: "FastAPI Async Worker Pools",
        rationale: "Configured asynchronous non-blocking worker pools to stream RAG-synthesized case briefs directly to the React frontend."
      }
    ],
    architectureSteps: [
      "Legal Corpus Ingestion",
      "Semantic Embedding Model",
      "ChromaDB HNSW Vector Store",
      "FastAPI Query Engine",
      "Gemini AI RAG Synthesis",
      "Interactive Citation UI"
    ]
  },
  {
    id: "proj-setu",
    number: "05",
    title: "SETU — Government Service Interoperability Platform",
    subtitle: "Event-Driven Orchestration Platform for Fragmented Citizen Portals",
    status: "Active",
    description: "A resilient backend architecture connecting isolated government departmental databases. Features role-based access control, cryptographic verification of citizen records, and asynchronous message queues to ensure reliable multi-departmental workflow orchestration.",
    type: "TEAM PROJECT",
    technologies: ["Java", "Java SE 17", "REST APIs", "Event-Driven Architecture", "RBAC", "MySQL"],
    githubUrl: "https://github.com/NITISH1817/SETU",
    repoStatus: "Public Repository",
    isPublicRepo: true,
    metrics: [
      "Architected event-driven microservices handling asynchronous payloads",
      "End-to-end audit logging & role-based access control compliance"
    ],
    features: [
      "Inter-departmental cryptographic citizen record verification",
      "Event-driven asynchronous messaging queue for service requests",
      "Granular role-based access control (RBAC) audit logs"
    ],
    problemStatement: "Fragmented government databases operate in silos, requiring citizens to repeatedly present redundant physical paperwork across departments with high bureaucratic delay and risk of identity forgery.",
    solution: "A resilient event-driven enterprise architecture written in Java SE 17 connecting disparate departmental databases through standardized REST APIs, role-based access control, cryptographic verification, and asynchronous message queues.",
    technicalDecisions: [
      {
        title: "Java SE 17 Modern Architecture",
        rationale: "Chose modern Java for strict type safety, predictable garbage collection, and robust concurrency primitives in public infrastructure."
      },
      {
        title: "Cryptographic Record Hashing",
        rationale: "Implemented SHA-256 hash chains on citizen identity verification payloads to ensure immutable inter-departmental audit logs."
      },
      {
        title: "Strict RBAC & Token Auth",
        rationale: "Architected fine-grained permission scopes guaranteeing that departments can only access authorized document slices."
      }
    ],
    architectureSteps: [
      "Citizen Auth & Single Sign-On",
      "Java Enterprise Gateway",
      "Cryptographic Record Verification",
      "RBAC Permission Enforcement",
      "Event-Driven Asynchronous Queue",
      "Inter-Departmental Database Sync"
    ]
  },
  {
    id: "proj-retinopathy",
    number: "06",
    title: "Diabetic Retinopathy Classification System",
    subtitle: "Deep Learning Medical Image Diagnostics with Grad-CAM Explainability",
    status: "Active",
    description: "Medical diagnostic deep learning system trained on retinal fundus photography to detect five stages of diabetic retinopathy. Implements EfficientNet-B3 with Grad-CAM heatmaps to provide explainable visual evidence for ophthalmologists.",
    type: "TEAM PROJECT",
    technologies: ["Python", "PyTorch", "EfficientNet-B3", "Grad-CAM", "Next.js", "Gradio"],
    githubUrl: "https://huggingface.co/spaces/NITISH1817/diabetic-retinopathy",
    liveUrl: "https://huggingface.co/spaces/NITISH1817/diabetic-retinopathy",
    repoStatus: "Hugging Face Spaces",
    isPublicRepo: true,
    metrics: [
      "71% validation accuracy on clinical retinal fundus benchmarks",
      "Grad-CAM visual attention overlays highlighting microaneurysms"
    ],
    features: [
      "5-stage classification (No DR, Mild, Moderate, Severe, Proliferative)",
      "Grad-CAM heatmap attention visualizations for clinicians",
      "Automated retinal vessel and microaneurysm contrast enhancement"
    ],
    problemStatement: "Diabetic retinopathy is a leading cause of preventable blindness worldwide, yet early screening is bottlenecked by the acute shortage of certified ophthalmologists to inspect retinal fundus photography.",
    solution: "A deep learning diagnostic pipeline built with PyTorch and EfficientNet-B3 that classifies fundus photography into five clinical severity stages, integrated with Grad-CAM visual heatmaps for clinical explainability.",
    technicalDecisions: [
      {
        title: "EfficientNet-B3 Feature Backbone",
        rationale: "Selected over ResNet-50 for superior parameter efficiency and high image feature extraction at 300x300 retinal resolutions."
      },
      {
        title: "Grad-CAM Diagnostic Explainability",
        rationale: "Generated class activation maps to visually highlight microaneurysms and hemorrhages, giving clinicians verifiable diagnostic rationales."
      },
      {
        title: "Clinical CLAHE Preprocessing",
        rationale: "Implemented CLAHE contrast normalization and elastic transforms to counteract clinical illumination variances across diverse eye clinics."
      }
    ],
    architectureSteps: [
      "Retinal Fundus Image Ingestion",
      "CLAHE Contrast Normalization",
      "EfficientNet-B3 Feature Extractor",
      "5-Stage Severity Classification",
      "Grad-CAM Explainability Engine",
      "Clinical Inspection Web App"
    ]
  },
  {
    id: "proj-movie",
    number: "07",
    title: "Movie Recommendation System",
    subtitle: "Hybrid Content-Based & Collaborative Recommendation Engine",
    status: "Active",
    description: "A recommendation engine synthesizing metadata extraction (genres, cast, keywords, directors) with user rating matrices. Implements cosine similarity on TF-IDF vectors alongside matrix factorization to deliver accurate, non-obvious film recommendations in real time.",
    type: "INDIVIDUAL PROJECT",
    technologies: ["Python", "Scikit-learn", "Collaborative Filtering", "Pandas", "Streamlit", "React.js"],
    githubUrl: "https://github.com/NITISH1817/movie-recommendation-system",
    repoStatus: "Public Repository",
    isPublicRepo: true,
    metrics: [
      "Trained on MovieLens 100k+ dataset with low RMSE latency",
      "Sub-50ms recommendation generation via precomputed sparse similarity matrix"
    ],
    features: [
      "Interactive hybrid recommendation slider (Content vs Collaborative)",
      "Dynamic movie posters and metadata preview modal",
      "Cold-start handling for new user taste profiles"
    ],
    problemStatement: "Traditional recommendation engines suffer from the cold-start dilemma for new users and over-specialize in narrow genre clusters, failing to balance popularity with serendipitous content discovery.",
    solution: "A hybrid recommendation engine synthesizing metadata extraction (genres, cast, keywords, directors) with user rating matrices, combining cosine similarity on TF-IDF vectors with collaborative filtering to deliver sub-50ms recommendations.",
    technicalDecisions: [
      {
        title: "Dynamic Blending Coefficient",
        rationale: "Formulated a dynamic blending coefficient allowing users to toggle between content-based similarity and collaborative matrix factorization."
      },
      {
        title: "Precomputed Sparse Matrices",
        rationale: "Precomputed high-dimensional sparse genre/keyword matrices on 5,000+ film titles to ensure sub-50ms query latency."
      },
      {
        title: "Bayesian Average Cold-Start",
        rationale: "Implemented weighted Bayesian-average popularity fallbacks for new users before initial rating feedback is recorded."
      }
    ],
    architectureSteps: [
      "MovieLens Dataset Ingestion",
      "TF-IDF Metadata Vectorizer",
      "Collaborative Matrix Factorization",
      "Hybrid Blending Pipeline",
      "Cosine Similarity Matrix",
      "Streamlit & React Interface"
    ]
  },
  {
    id: "proj-water",
    number: "08",
    title: "WaterGrievance Application",
    subtitle: "Geo-Tagged Citizen Water Supply & Infrastructure Grievance Portal",
    status: "Active",
    description: "A civic-tech mobile application enabling citizens to report water supply shortages, pipe leakages, and water contamination with GPS geo-tagging and image evidence. Includes an administrative dashboard for municipal engineers with automated SLA escalation.",
    type: "TEAM PROJECT",
    technologies: ["Flutter", "Node.js", "Express", "MySQL", "Geo-tagging", "REST APIs"],
    githubUrl: "https://github.com/NITISH1817",
    repoStatus: "Private Academic Repository",
    isPublicRepo: false,
    metrics: [
      "Real-time GPS validation preventing duplicate leak complaints",
      "40% faster grievance resolution dispatch for local municipal zones"
    ],
    features: [
      "One-tap photo reporting with automatic GPS geotag coordinates",
      "Live grievance resolution timeline & status notifications",
      "Municipal zoning heatmaps for recurring pipeline failures"
    ],
    problemStatement: "Citizens facing urban water supply disruptions and pipe leaks encounter cumbersome municipal reporting channels with no geo-tag validation, causing lost tickets and slow maintenance response times.",
    solution: "A civic-tech mobile application developed in Flutter with a Node.js/Express backend that allows citizens to capture photos, automatically geo-tag GPS coordinates, submit tickets, and track resolution timelines with automated municipal SLA escalation.",
    technicalDecisions: [
      {
        title: "Native Flutter GPS Geotagging",
        rationale: "Integrated native location services to bind strict latitude/longitude metadata to grievance photos, preventing duplicate fraud."
      },
      {
        title: "Municipal Spatial Queries",
        rationale: "Partitioned grievance reports by municipal district wards using MySQL spatial coordinates for instant engineer routing."
      },
      {
        title: "Automated SLA Escalation Workers",
        rationale: "Implemented background cron workers to escalate unresolved water leakage complaints after 48 hours to supervisory authorities."
      }
    ],
    architectureSteps: [
      "Citizen Photo & GPS Capture",
      "Flutter Mobile Client",
      "Node.js / Express API Gateway",
      "MySQL Spatial Data Store",
      "Municipal Engineer Dashboard",
      "Automated SLA Escalation"
    ]
  }
];

export const educationList: Education[] = [
  {
    id: "edu-01",
    institution: "BANNARI AMMAN INSTITUTE OF TECHNOLOGY",
    degree: "B.E. Computer Science and Engineering",
    period: "2024 – 2028 (Expected May 2028)",
    result: "CGPA 7.8",
    description: "Core focus on Data Structures & Algorithms, Java SE 17 Object-Oriented Engineering, Database Systems, Computer Networks, and Machine Learning."
  },
  {
    id: "edu-02",
    institution: "SARATHA MATRICULATION HIGHER SECONDARY SCHOOL",
    degree: "Higher Secondary Certificate (HSC)",
    period: "2023 – 2024",
    result: "93.1%",
    description: "Academic excellence in Mathematics, Physics, Chemistry, and Computer Science."
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
    id: "ach-patent",
    title: "Patent Filed: GovScheme Platform",
    subtitle: "AI Welfare Discovery & Lifecycle Administration",
    description: "Patent filed for an innovative hybrid eligibility decision engine (MCDA), client-side OCR, multilingual voice interface, and sub-50ms welfare matching engine.",
    category: "Patent"
  },
  {
    id: "ach-dsa",
    title: "250+ DSA Problems Solved in Java",
    subtitle: "LeetCode & Algorithmic Problem Solving",
    description: "Solved 250+ Data Structures & Algorithms problems in Java on LeetCode covering Trees, Dynamic Programming, Graphs, Backtracking, and Binary Search.",
    category: "Coding"
  },
  {
    id: "ach-sih",
    title: "Smart India Hackathon (SIH 2025)",
    subtitle: "Selected Participant",
    description: "Selected to compete nationwide solving national-scale digital infrastructure challenges for public governance.",
    category: "Hackathon"
  }
];
