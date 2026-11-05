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
  category: 'Hackathon' | 'Certification' | 'Coding' | 'Academic';
}

export const identityData: IdentityData = {
  name: "NITISH PRIYAN R S",
  shortName: "NITISH PRIYAN",
  role: "Full Stack Developer | AI/ML Engineer | Software Developer",
  location: "India",
  batch: "2028",
  cgpa: "7.79",
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
  dsaStats: "170+ DSA Problems Solved in Java (LeetCode)"
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
    githubUrl: "https://github.com/NITISH1817/LEXORA-AI-Powered-Legal-Research-Platform",
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
    id: "proj-gov-scheme",
    number: "02",
    title: "AI-Powered Government Scheme Eligibility Recommender",
    subtitle: "Intelligent Citizen Entitlement & Welfare Matching Engine",
    description: "A machine learning entitlement engine that democratizes access to state and central welfare schemes. Analyzes socioeconomic, demographic, and agricultural profiles to match citizens with eligible subsidies, loans, and education programs with clear qualifying criteria.",
    type: "INDIVIDUAL PROJECT",
    technologies: ["Python", "Scikit-learn", "Machine Learning", "FastAPI", "React.js", "MySQL"],
    githubUrl: "https://github.com/NITISH1817/GovScheme",
    repoStatus: "Public Repository",
    isPublicRepo: true,
    metrics: [
      "Achieved 94% test-set eligibility matching precision across multi-attribute profiles",
      "Evaluates 150+ central & state welfare criteria simultaneously",
      "Multilingual profile input designed for accessibility"
    ],
    features: [
      "Dynamic questionnaire with conditional attribute evaluation",
      "Instant eligibility scoring with required document checklists",
      "Direct portal application links with tracking guidelines"
    ],
    problemStatement: "Rural and low-income citizens frequently forfeit critical government subsidies, scholarships, and agricultural grants due to fragmented eligibility criteria spread across dozens of departmental gazettes.",
    solution: "A multi-attribute machine learning engine that ingests socioeconomic, demographic, and agricultural citizen profiles and evaluates qualification logic against 150+ state and central welfare schemes with 94% precision.",
    technicalDecisions: [
      {
        title: "Scikit-learn Multi-Output Classifier",
        rationale: "Tuned on demographic indicator matrices with high cross-validation stability against noisy citizen survey data."
      },
      {
        title: "Dynamic Conditional Branching",
        rationale: "Designed an adaptive questionnaire that prunes irrelevant input paths, cutting completion time from 15 minutes to under 3 minutes."
      },
      {
        title: "Relational Criteria Schema",
        rationale: "Stored verified departmental criteria and document requirements with strict foreign-key integrity in MySQL to ensure auditability."
      }
    ],
    architectureSteps: [
      "Citizen Demographic Intake",
      "Attribute Normalization & Imputation",
      "Scikit-Learn Inference Engine",
      "Rule-Based Eligibility Filtering",
      "MySQL Scheme Catalog",
      "Ranked Recommendation Output"
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
    githubUrl: "https://github.com/NITISH1817/Project_Zero",
    repoStatus: "Public Repository",
    isPublicRepo: true,
    metrics: [
      "Automated problem deduplication with 88% semantic accuracy",
      "Active collaboration workspace adopted across student departments"
    ],
    features: [
      "Natural language problem intake & automated tag clustering",
      "Skill-matching algorithm for project collaborator discovery",
      "Milestone tracking and mentor review workflow"
    ],
    problemStatement: "Student engineering teams and campus labs often duplicate project efforts and struggle to discover interdisciplinary collaborators with complementary skill sets across departments.",
    solution: "An intelligent innovation platform utilizing NLP topic modeling and ChromaDB embeddings to cluster unsolved campus problems, eliminate duplicate project submissions, and recommend collaborators based on skill affinities.",
    technicalDecisions: [
      {
        title: "Embedding-Based Deduplication",
        rationale: "Computed semantic cosine similarity thresholds (0.88) to automatically flag duplicate problem statements upon submission."
      },
      {
        title: "Vector Affinity Matching",
        rationale: "Clustered student capability profiles against open project technology requirements to suggest optimal team formation."
      },
      {
        title: "Event-Driven Milestone Webhooks",
        rationale: "Leveraged Node.js and FastAPI webhooks to notify mentors and collaborators upon milestone delivery."
      }
    ],
    architectureSteps: [
      "Problem Statement Intake",
      "NLP Embedding & Deduplication",
      "ChromaDB Clustering Engine",
      "Collaborator Affinity Matcher",
      "Project Milestone Tracker",
      "Collaborative Workspace"
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
    number: "05",
    title: "WaterGrievance Application",
    subtitle: "Geo-Tagged Citizen Water Supply & Infrastructure Grievance Portal",
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
  },
  {
    id: "proj-setu",
    number: "06",
    title: "SETU — Government Service Interoperability Platform",
    subtitle: "Event-Driven Orchestration Platform for Fragmented Citizen Portals",
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
    number: "07",
    title: "Diabetic Retinopathy Classification System",
    subtitle: "Deep Learning Medical Image Diagnostics with Grad-CAM Explainability",
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
    id: "proj-edu-prediction",
    number: "08",
    title: "Student Performance Prediction & MLOps Decision Support System",
    subtitle: "End-to-End MLOps Pipeline for Student Outcome Prediction & Risk Intervention",
    description: "An end-to-end MLOps platform for student outcome prediction, risk scoring, and personalized academic intervention recommendations. Employs XGBoost with MLflow experiment tracking, DVC data versioning, Evidently AI drift monitoring, and containerized CI/CD pipelines.",
    type: "INDIVIDUAL PROJECT",
    technologies: ["Python", "FastAPI", "XGBoost", "MLflow", "DVC", "Docker", "CI/CD", "Evidently AI"],
    githubUrl: "https://github.com/NITISH1817/edu-prediction",
    repoStatus: "Public Repository",
    isPublicRepo: true,
    metrics: [
      "89.1% prediction accuracy across multi-factor academic cohorts",
      "82.6% recall on at-risk student intervention alerts",
      "Continuous data drift monitoring via Evidently AI & MLflow registry"
    ],
    features: [
      "XGBoost early-warning risk scoring classifier",
      "MLflow experiment tracking with hyperparameter tuning",
      "Automated model & data drift detection with Evidently AI",
      "Containerized microservice architecture with Docker"
    ],
    problemStatement: "Academic institutions often identify at-risk students only after semester exam failures, lacking early-warning diagnostic indicators to deploy personalized tutoring and academic counseling.",
    solution: "A production-grade MLOps platform integrating XGBoost classification with MLflow experiment tracking and DVC data pipelines. Evaluates multi-variate academic, behavioral, and demographic features to flag at-risk students with 82.6% recall and 89.1% accuracy.",
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
      "Academic Intake & Feature Pipeline",
      "DVC Data Versioning",
      "XGBoost Inference Engine",
      "MLflow Metric Tracking",
      "Evidently AI Drift Monitoring",
      "FastAPI Prediction Endpoint"
    ]
  }
];

export const educationList: Education[] = [
  {
    id: "edu-01",
    institution: "BANNARI AMMAN INSTITUTE OF TECHNOLOGY",
    degree: "B.E. Computer Science and Engineering",
    period: "2024 – 2028 (Expected)",
    result: "CGPA 7.79",
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
