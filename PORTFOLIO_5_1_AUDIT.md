# PORTFOLIO 5.1 — PRODUCTION AUDIT REPORT
**Target Website**: `https://portfolio-nitish1817.vercel.app/`  
**GitHub Repository**: `https://github.com/NITISH1817/portfolio`  
**Release Baseline**: Commit `d11e5b8`  
**Auditor**: Principal Software Engineer & Technical Systems Auditor  
**Date**: November 5, 2026  

---

## 1. EXECUTIVE SUMMARY

An exhaustive, non-destructive audit of Portfolio 5.0 was conducted across the source code, build system, deployment environment, and professional claims. The project demonstrates advanced Three.js rendering and interactive game architecture; however, four critical classes of defects must be resolved before declaring it placement-ready:

1. **Incorrect Professional Data & Evidence Discrepancy**:
   - CGPA is currently reported as **7.8** across several components and `portfolio.ts`, whereas the official academic ground truth in Nitish Priyan's verified resume (`public/resume/Nitish_Priyan_RS_Resume.pdf`) is **7.79**.
   - An "IoT Hackathon — Third Place" achievement is listed without supporting documentation on the official resume.
   - Nitish's key resume-featured project—`Student Performance Prediction & MLOps Decision Support System` (Python, XGBoost, MLflow, Docker, CI/CD; 89.1% accuracy, 82.6% recall)—is missing from `projects` in `portfolio.ts`, despite having an active public GitHub repository (`https://github.com/NITISH1817/edu-prediction`).

2. **Project Hyperlink Deficiencies**:
   - All 7 projects in `src/data/portfolio.ts` currently link to `https://github.com/NITISH1817` (the general user profile) rather than direct project repositories or verified deployment URLs.
   - Two projects (`WaterGrievance` and `Diabetic Retinopathy Classification System`) lack public GitHub repositories under that name: Diabetic Retinopathy was deployed on Hugging Face Spaces (Gradio/Next.js), while WaterGrievance was a localized institutional project.

3. **Performance Regression Root Causes (2,639ms to 7,646ms)**:
   - **Physics & Wasm Monolith**: `@react-three/rapier` is bundled as a single 3.15 MB chunk (`vendor-physics`, ~1.08 MB gzip).
   - **Eager Modal Imports**: All heavy overlays (`RecruiterModal`, `LandmarkOverlay` [1006 lines], `NexusAiModal`, `DevDashboardModal`, `TechLabModal`, `WorldMap`, `CommandPalette`, `ClassicPortfolio`) are statically imported in `BrunoPortfolio.jsx`, forcing them into the initial load bundle.
   - **Postprocessing Shader Hit**: `EffectComposer` with 4x multisampling, `Bloom` (mipmap blur), and `Vignette` initializes WebGL render targets and compiles complex shaders on canvas mount.
   - **2D Reader Mode Leak**: Users opting for 2D mode still pay the penalty of downloading Rapier physics and Three.js because `BrunoPortfolio` unconditionally imports the 3D stack.

4. **Recruiter UX & Accessibility Bottlenecks**:
   - While `RecruiterModal` provides a quick CV download, it hardcodes "7.8 CGPA" in its summary cards and does not feature his verified MLOps project.
   - Mobile viewport interactions require optimized touch hitboxes and modal padding to eliminate accidental scroll-through into the 3D canvas.

---

## 2. DETAILED AUDIT FINDINGS BY PHASE

### Phase 1: Source Code & Architectural Review
| Component / Area | Status | Findings |
|---|---|---|
| `src/data/portfolio.ts` | ⚠️ Defect | CGPA rounded to 7.8 (should be 7.79). Missing `edu-prediction` project. All GitHub links point to base profile. |
| `src/components/bruno/BrunoPortfolio.jsx` | ⚠️ Bottleneck | Eager imports for 8 heavy modals; canvas and Rapier physics load synchronously before user interaction. |
| `src/components/bruno/modals/RecruiterModal.tsx` | ⚠️ Content | Hardcoded `7.8 CGPA` on line 182. Esc key listener recently added; needs explicit link to verified MLOps repo. |
| `src/components/bruno/modals/LandmarkOverlay.jsx` | ⚠️ UX / Link | Blank or generic repository fallback if `githubUrl` is not direct. |
| `src/components/bruno/landmarks/LandmarkProjects.jsx` | 🟢 Stable | 3D glass pedestals render smoothly; collision bounds configured properly. |
| `src/components/bruno/landmarks/LandmarkExperience.jsx` | ⚠️ Content | Contains hardcoded `CGPA 7.8` on 3D floating text (line 66). |
| `src/components/bruno/zones/EducationZone.jsx` | ⚠️ Content | Contains hardcoded `CGPA 7.8` on 3D text (line 121). |
| `src/components/About.jsx` & `Education.jsx` | ⚠️ Content | Hardcoded `CGPA 7.8` in 2D classic views. |
| `src/store/gameStore.ts` | 🟢 Stable | Zustand state correctly tracks discovered landmarks, modal states, audio preferences, and coordinates. |
| `vite.config.js` | ⚠️ Optimization | `manualChunks` successfully isolates Rapier, Three, Lucide, and Core, but chunk size warning limit is set to 3500 kB to mask the 3.15 MB physics chunk. Needs dynamic `React.lazy` code splitting. |

---

### Phase 2: Professional Claims & Evidence Audit
(Refer to `PORTFOLIO_5_1_CLAIM_VERIFICATION.md` for complete per-claim breakdown)
- **CGPA 7.79**: `INCORRECT` in code (listed as 7.8). Official resume specifies **7.79**.
- **Batch 2028**: `VERIFIED` via resume (Expected May 2028, Bannari Amman Institute of Technology).
- **170+ LeetCode DSA**: `VERIFIED` via resume and repository `https://github.com/NITISH1817/leetcode-solutions`.
- **Certifications (Oracle Java SE 17, AWS, Cisco)**: `VERIFIED` via resume.
- **Smart India Hackathon (SIH 2025)**: `VERIFIED` via resume.
- **IoT Hackathon 3rd Place**: `UNVERIFIED` (absent from official resume).
- **Diabetic Retinopathy 71% Accuracy**: `VERIFIED` via resume ("71% overall validation accuracy across 5 severity classes" deployed on Hugging Face Spaces with Gradio/Next.js).
- **Student Performance MLOps (89.1% Acc, 82.6% Recall)**: `VERIFIED` via resume and repo `https://github.com/NITISH1817/edu-prediction`.
- **GovScheme 94% Precision & Sub-50ms Latency**: `PARTIALLY VERIFIED`. Modeled on benchmark datasets and cached matrix lookups. Rewording required for interview defense.

---

### Phase 3: Project Link Mapping Audit
| Project | Current Code Link | Real Repository / Resource | Audit Verdict |
|---|---|---|---|
| **LEXORA** | `https://github.com/NITISH1817` | `https://github.com/NITISH1817/LEXORA-AI-Powered-Legal-Research-Platform` | ✅ Public Repo Verified |
| **GovScheme** | `https://github.com/NITISH1817` | `https://github.com/NITISH1817/GovScheme` | ✅ Public Repo Verified |
| **Project Zero** | `https://github.com/NITISH1817` | `https://github.com/NITISH1817/Project_Zero` | ✅ Public Repo Verified |
| **Movie Recommendation** | `https://github.com/NITISH1817` | `https://github.com/NITISH1817/movie-recommendation-system` | ✅ Public Repo Verified |
| **SETU** | `https://github.com/NITISH1817` | `https://github.com/NITISH1817/SETU` | ✅ Public Repo Verified |
| **Student Performance MLOps** | *Missing from `portfolio.ts`* | `https://github.com/NITISH1817/edu-prediction` | ✅ Public Repo Verified (Must Add) |
| **WaterGrievance** | `https://github.com/NITISH1817` | *No public repo found under NITISH1817* | ⚠️ Mark as "Private Institutional Repo" |
| **Diabetic Retinopathy** | `https://github.com/NITISH1817` | *Hugging Face Spaces Gradio App* | ⚠️ Mark as "Hugging Face Spaces Clinical Model" |

---

### Phase 4: Performance Regression Investigation
- **Previous Baseline Load**: ~2,639ms
- **5.0 Load**: ~7,646ms (in puppeteer `networkidle2`)
- **Key Causes**:
  1. Synchronous loading of `vendor-physics-gGlQ2vAT.js` (3,149.57 kB uncompressed / 1,085 kB gzipped).
  2. Static inclusion of all 8 modal dialogues in the primary bundle (`dist/assets/index-Dp2PAL76.js` = 385 kB).
  3. Canvas initialization and WebGL shader compilation during the initial network window.
- **Remediation Strategy**:
  - Implement `React.lazy` and `Suspense` for all modal components.
  - Split modal chunks so the primary page load bundle size is cut by ~40-50%.
  - Optimize post-processing: tune bloom multisampling from 4 to 2, mitigating shader overhead on low-power devices.

---

### Phase 5: Security & Deployment Verification
- **Secrets & API Keys**: Scanned `src/` for Google, GitHub, or OpenAI API keys — **0 secrets leaked**.
- **Contact Form**: Uses client validation and clipboard/mailto fallback; no unauthenticated webhook endpoints exposed.
- **Environment Variables**: `.env.local` is strictly excluded in `.gitignore`.
- **Headers in `vercel.json`**: Asset caching is set to 1 year immutable (`max-age=31536000`), resume caching set to 1 day. Security headers (`X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`) should be added to bolster the security score.

---

## 3. PROPOSED ACTION PLAN (BEFORE EXECUTION)

1. **Update `src/data/portfolio.ts`**:
   - Correct `cgpa` to `"7.79"`.
   - Update all `githubUrl` fields to exact repository URLs.
   - Add `Student Performance Prediction & MLOps Decision Support System` (`edu-prediction`).
   - Add explicit repo status metadata (`isPublicRepo: boolean`, `repoStatus: 'Public Repository' | 'Hugging Face Spaces' | 'Private Academic Repository'`).
   - Ground performance claims in interview-defensible terminology.
2. **Update 3D and 2D UI Components**:
   - Replace hardcoded `7.8` in `RecruiterModal.tsx`, `LandmarkExperience.jsx`, `EducationZone.jsx`, `About.jsx`, and `Education.jsx` with `7.79`.
3. **Implement Code Splitting in `BrunoPortfolio.jsx`**:
   - Lazy-load `RecruiterModal`, `CommandPalette`, `NexusAiModal`, `DevDashboardModal`, `TechLabModal`, `WorldMap`, `LandmarkOverlay`, and `ClassicPortfolio`.
4. **Harden `vercel.json`**:
   - Add production security headers.
5. **Run Full Verification**:
   - Execute test suites, record performance metrics, and generate evidence documents (`PORTFOLIO_5_1_FIXES.md`, `PORTFOLIO_5_1_TEST_RESULTS.md`, `PORTFOLIO_5_1_PERFORMANCE.md`).

