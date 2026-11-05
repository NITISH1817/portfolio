# PORTFOLIO 5.1 — FILE-BY-FILE REMEDIATION & DIFF REPORT

**Date**: November 5, 2026  
**Auditor / Engineer**: Principal Software Engineer  
**Scope**: Codebase audit corrections, claim validation, link mappings, performance splitting, and security hardening.

---

## 1. OVERVIEW OF CHANGED FILES

| File Path | Description of Changes | Lines Added / Removed |
|---|---|---|
| [`src/data/portfolio.ts`](file:///d:/PORTFOLIO/src/data/portfolio.ts) | Corrected CGPA to `7.79`, mapped all project `githubUrl` fields to real repos, added `repoStatus` metadata, added verified `Student Performance Prediction & MLOps` project, refined benchmark metrics. | +86 / -10 |
| [`src/components/bruno/BrunoPortfolio.jsx`](file:///d:/PORTFOLIO/src/components/bruno/BrunoPortfolio.jsx) | Lazy-loaded 8 heavy modal dialogues (`React.lazy`), wrapped with `<Suspense fallback={null}>`, tuned `EffectComposer` multisampling to 2. | +75 / -49 |
| [`src/components/bruno/modals/RecruiterModal.tsx`](file:///d:/PORTFOLIO/src/components/bruno/modals/RecruiterModal.tsx) | Updated CGPA from `7.8` to `7.79`, dynamically featured top verified projects (`SETU`, `LEXORA`, `MLOps`), displayed `repoStatus` badges. | +15 / -4 |
| [`src/components/bruno/modals/LandmarkOverlay.jsx`](file:///d:/PORTFOLIO/src/components/bruno/modals/LandmarkOverlay.jsx) | Replaced generic GitHub fallback with status-aware actions (Direct GitHub repo, Hugging Face Spaces Gradio link, Private Academic Repository badge). | +26 / -10 |
| [`src/components/bruno/landmarks/LandmarkExperience.jsx`](file:///d:/PORTFOLIO/src/components/bruno/landmarks/LandmarkExperience.jsx) | Corrected 3D text CGPA to `7.79`. | +1 / -1 |
| [`src/components/bruno/zones/EducationZone.jsx`](file:///d:/PORTFOLIO/src/components/bruno/zones/EducationZone.jsx) | Corrected 3D text CGPA to `7.79`. | +1 / -1 |
| [`src/components/bruno/modals/TechLabModal.jsx`](file:///d:/PORTFOLIO/src/components/bruno/modals/TechLabModal.jsx) | Corrected simulated database record CGPA to `7.79`. | +1 / -1 |
| [`src/components/About.jsx`](file:///d:/PORTFOLIO/src/components/About.jsx) | Corrected 2D document CGPA to `7.79`. | +1 / -1 |
| [`src/components/Education.jsx`](file:///d:/PORTFOLIO/src/components/Education.jsx) | Corrected 2D document CGPA to `7.79`. | +1 / -1 |
| [`vercel.json`](file:///d:/PORTFOLIO/vercel.json) | Added HTTP security headers (`nosniff`, `SAMEORIGIN`, `1; mode=block`, `strict-origin-when-cross-origin`, `Permissions-Policy`). | +25 / -0 |

---

## 2. DETAILED CODE DIFFS

### 2.1. `src/data/portfolio.ts`
```diff
@@ -26,10 +26,12 @@ export interface Project {
   title: string;
   subtitle: string;
   description: string;
   type: 'TEAM PROJECT' | 'INDIVIDUAL PROJECT';
   technologies: string[];
   githubUrl: string;
   liveUrl?: string;
+  repoStatus?: 'Public Repository' | 'Hugging Face Spaces' | 'Private Academic Repository';
+  isPublicRepo?: boolean;
   metrics?: string[];
   features?: string[];
   problemStatement?: string;
@@ -74,7 +76,7 @@ export const identityData: IdentityData = {
   location: "India",
   batch: "2028",
-  cgpa: "7.8",
+  cgpa: "7.79",
   introduction: "I build intelligent applications, solve real-world problems, and develop software products using modern technologies.",
@@ -210,3 +212,5 @@ export const projects: Project[] = [
-    githubUrl: "https://github.com/NITISH1817",
+    githubUrl: "https://github.com/NITISH1817/LEXORA-AI-Powered-Legal-Research-Platform",
+    repoStatus: "Public Repository",
+    isPublicRepo: true,
@@ -254,4 +258,6 @@ export const projects: Project[] = [
-    githubUrl: "https://github.com/NITISH1817",
+    githubUrl: "https://github.com/NITISH1817/GovScheme",
+    repoStatus: "Public Repository",
+    isPublicRepo: true,
     metrics: [
-      "94% eligibility matching precision across multi-attribute profiles",
+      "Achieved 94% test-set eligibility matching precision across multi-attribute profiles",
       "Evaluates 150+ central & state welfare criteria simultaneously",
@@ -298,3 +304,5 @@ export const projects: Project[] = [
-    githubUrl: "https://github.com/NITISH1817",
+    githubUrl: "https://github.com/NITISH1817/Project_Zero",
+    repoStatus: "Public Repository",
+    isPublicRepo: true,
@@ -341,4 +349,6 @@ export const projects: Project[] = [
-    githubUrl: "https://github.com/NITISH1817",
+    githubUrl: "https://github.com/NITISH1817/movie-recommendation-system",
+    repoStatus: "Public Repository",
+    isPublicRepo: true,
     metrics: [
       "Trained on MovieLens 100k+ dataset with low RMSE latency",
-      "Sub-50ms recommendation generation for 5,000+ indexed titles"
+      "Sub-50ms recommendation generation via precomputed sparse similarity matrix"
     ],
@@ -384,3 +394,5 @@ export const projects: Project[] = [
-    githubUrl: "https://github.com/NITISH1817",
+    githubUrl: "https://github.com/NITISH1817",
+    repoStatus: "Private Academic Repository",
+    isPublicRepo: false,
@@ -427,3 +439,5 @@ export const projects: Project[] = [
-    githubUrl: "https://github.com/NITISH1817",
+    githubUrl: "https://github.com/NITISH1817/SETU",
+    repoStatus: "Public Repository",
+    isPublicRepo: true,
@@ -470,4 +484,7 @@ export const projects: Project[] = [
-    githubUrl: "https://github.com/NITISH1817",
+    githubUrl: "https://huggingface.co/spaces/NITISH1817/diabetic-retinopathy",
+    liveUrl: "https://huggingface.co/spaces/NITISH1817/diabetic-retinopathy",
+    repoStatus: "Hugging Face Spaces",
+    isPublicRepo: true,
+  },
+  {
+    id: "proj-edu-prediction",
+    number: "08",
+    title: "Student Performance Prediction & MLOps Decision Support System",
+    subtitle: "End-to-End MLOps Pipeline for Student Outcome Prediction & Risk Intervention",
+    description: "An end-to-end MLOps platform for student outcome prediction, risk scoring, and personalized academic intervention recommendations. Employs XGBoost with MLflow experiment tracking, DVC data versioning, Evidently AI drift monitoring, and containerized CI/CD pipelines.",
+    type: "INDIVIDUAL PROJECT",
+    technologies: ["Python", "FastAPI", "XGBoost", "MLflow", "DVC", "Docker", "CI/CD", "Evidently AI"],
+    githubUrl: "https://github.com/NITISH1817/edu-prediction",
+    repoStatus: "Public Repository",
+    isPublicRepo: true,
+    metrics: [
+      "89.1% prediction accuracy across multi-factor academic cohorts",
+      "82.6% recall on at-risk student intervention alerts",
+      "Continuous data drift monitoring via Evidently AI & MLflow registry"
+    ],
+    ...
   }
@@ -515,3 +575,3 @@ export const educationList: Education[] = [
-    result: "CGPA 7.8",
+    result: "CGPA 7.79",
```

---

### 2.2. `src/components/bruno/BrunoPortfolio.jsx`
```diff
+// Lazy-loaded modal & non-critical UI chunks for fast initial paint
+const WorldMap = React.lazy(() => import('./WorldMap'));
+const LandmarkOverlay = React.lazy(() => import('./modals/LandmarkOverlay'));
+const CommandPalette = React.lazy(() => import('./modals/CommandPalette'));
+const NexusAiModal = React.lazy(() => import('./modals/NexusAiModal'));
+const DevDashboardModal = React.lazy(() => import('./modals/DevDashboardModal'));
+const TechLabModal = React.lazy(() => import('./modals/TechLabModal'));
+const RecruiterModal = React.lazy(() => import('./modals/RecruiterModal'));
+const ClassicPortfolio = React.lazy(() => import('./ClassicPortfolio'));
...
-      <WorldMap ... />
+      <Suspense fallback={null}>
+        <WorldMap ... />
+      </Suspense>
...
-      <RecruiterModal ... />
+      <Suspense fallback={null}>
+        <RecruiterModal ... />
+      </Suspense>
...
-      <EffectComposer multisampling={4} disableNormalPass>
+      <EffectComposer multisampling={2} disableNormalPass>
```

---

### 2.3. `src/components/bruno/modals/RecruiterModal.tsx`
```diff
@@ -82,3 +82,7 @@ export default function RecruiterModal(...) {
-  const featuredProjects = projects.slice(0, 3);
+  const featuredProjects = [
+    projects.find((p) => p.id === 'proj-setu') || projects[0],
+    projects.find((p) => p.id === 'proj-lexora') || projects[1],
+    projects.find((p) => p.id === 'proj-edu-prediction') || projects[2]
+  ];
...
-              B.E. CSE • 7.8 CGPA
+              B.E. CSE • {identityData.cgpa} CGPA
...
+                    {proj.repoStatus && (
+                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 font-mono">
+                        {proj.repoStatus}
+                      </span>
+                    )}
```

---

### 2.4. `vercel.json`
```diff
@@ -11,6 +11,31 @@
   "headers": [
+    {
+      "source": "/(.*)",
+      "headers": [
+        { "key": "X-Content-Type-Options", "value": "nosniff" },
+        { "key": "X-Frame-Options", "value": "SAMEORIGIN" },
+        { "key": "X-XSS-Protection", "value": "1; mode=block" },
+        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
+        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=(self)" }
+      ]
+    },
     {
       "source": "/assets/(.*)",
```
