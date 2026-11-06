# NITISH PRIYAN PORTFOLIO — COMPLETE DEFECT REGISTER
**Target Deployment:** [https://nitishpriyan.vercel.app](https://nitishpriyan.vercel.app)  
**Audit Timestamp:** 2026-11-06T20:30:10+05:30  
**Status Key:** `CONFIRMED DEFECT` (Reproduced in code/runtime) | `POTENTIAL RISK` (Architectural or edge-case exposure)

---

## DEFECT REGISTER MATRIX

| Issue ID | Category | Component | File Path | Severity | Status |
|---|---|---|---|---|---|
| **AUD-001** | Content Inconsistency | Nexus AI Assistant Modal | `src/components/bruno/modals/NexusAiModal.jsx:115` | **HIGH** | `CONFIRMED DEFECT` |
| **AUD-002** | Content Inconsistency | Command Palette & AI Store | `src/components/bruno/modals/NexusAiModal.jsx:104`, `CommandPalette.jsx:155` | **MEDIUM** | `CONFIRMED DEFECT` |
| **AUD-003** | Mock Data Quality | Tech Lab SQL Sandbox | `src/components/bruno/modals/TechLabModal.jsx:121-123` | **LOW** | `CONFIRMED DEFECT` |
| **AUD-004** | SEO & Social Sharing | HTML Root Metadata | `index.html:13-21` | **MEDIUM** | `CONFIRMED DEFECT` |
| **AUD-005** | Production Security | HTTP Response Headers | `vercel.json:11-36` | **LOW** | `POTENTIAL RISK` |
| **AUD-006** | Accessibility (A11y) | 2D Editorial Mobile Navbar | `src/components/editorial/EditorialNavbar.tsx:155` | **LOW** | `CONFIRMED DEFECT` |
| **AUD-007** | Memory & Event Lifecycle | Three.js Inputs Dispatcher | `src/engine/folio/Game/Inputs/Inputs.js:1` & `Game.js:282` | **MEDIUM** | `POTENTIAL RISK` |

---

## DETAILED DEFECT SPECIFICATIONS

### ISSUE AUD-001: Outdated College & Hackathon in Nexus AI Fallback Prompt
- **Issue ID:** `AUD-001`
- **Classification:** `CONFIRMED DEFECT`
- **Severity:** **HIGH**
- **Exact Page / Component:** Nexus AI Assistant Modal (`NexusAiModal`)
- **File Path:** [`src/components/bruno/modals/NexusAiModal.jsx`](file:///d:/PORTFOLIO/src/components/bruno/modals/NexusAiModal.jsx#L115)
- **Evidence:**
  ```javascript
  // Line 115 in src/components/bruno/modals/NexusAiModal.jsx
  return `I am **NEXUS AI**, Nitish Priyan's portfolio intelligence assistant. I can answer specific questions regarding his:
  ...
  4. **Academic Credentials & Hackathons** (Sri Eshwar College of Engineering, SIH 2024)
  5. **Contact & GitHub Repositories**`;
  ```
- **User Impact:** When a recruiter or visitor opens the AI Assistant without asking a direct question, the suggested prompts cite "Sri Eshwar College of Engineering" and "SIH 2024", directly contradicting the resume source of truth (**Bannari Amman Institute of Technology**, Expected 2028, and **SIH 2025**).
- **Root Cause:** A hardcoded string template from an earlier project configuration was not updated when synchronizing the knowledge base.
- **Recommended Correction:**
  Update line 115 to:
  ```javascript
  4. **Academic Credentials & Hackathons** (Bannari Amman Institute of Technology, SIH 2025)
  ```
- **How to Test the Correction:**
  1. In the 3D world, click the **AI** header button or press `A`.
  2. Type an unrecognized prompt (e.g., "Hello").
  3. Verify the fallback response list displays `Bannari Amman Institute of Technology, SIH 2025`.

---

### ISSUE AUD-002: Reference to Unverified Legacy Demo "Project Zero"
- **Issue ID:** `AUD-002`
- **Classification:** `CONFIRMED DEFECT`
- **Severity:** **MEDIUM**
- **Exact Page / Component:** Nexus AI Assistant, Command Palette, and Game Store
- **File Path:** [`src/components/bruno/modals/NexusAiModal.jsx`](file:///d:/PORTFOLIO/src/components/bruno/modals/NexusAiModal.jsx#L104), [`src/components/bruno/modals/CommandPalette.jsx`](file:///d:/PORTFOLIO/src/components/bruno/modals/CommandPalette.jsx#L155), [`src/store/gameStore.ts`](file:///d:/PORTFOLIO/src/store/gameStore.ts#L55)
- **Evidence:**
  - `NexusAiModal.jsx:104`: `"Featured repos include LEXORA, AI Govt Scheme Recommender, and Project Zero."`
  - `CommandPalette.jsx:155`: `"Flagship creations: LEXORA, Govt Scheme, Project Zero"`
  - `gameStore.ts:55`: `"Visit the Projects Exhibition to inspect Lexora, AI Govt Scheme Recommender, and Project Zero."`
- **User Impact:** Displays a non-existent or unlisted repository name ("Project Zero") not present on the candidate's verified resume.
- **Root Cause:** Placeholder demo project name inherited from initial template scaffolding.
- **Recommended Correction:** Replace "Project Zero" with the verified third flagship: **"Student Performance MLOps"**.
- **How to Test the Correction:**
  1. Open Command Palette (`C` or `K`), search for "Project".
  2. In Nexus AI, ask "What are your GitHub repositories?".
  3. Confirm only verified projects (GovScheme, NEXORA, Student Performance MLOps, LEXORA) appear.

---

### ISSUE AUD-003: Project Names Formatted as "Candidates" with Fake CGPAs in Tech Lab Mock Database
- **Issue ID:** `AUD-003`
- **Classification:** `CONFIRMED DEFECT`
- **Severity:** **LOW**
- **Exact Page / Component:** Tech Lab Interactive SQL Query Sandbox
- **File Path:** [`src/components/bruno/modals/TechLabModal.jsx`](file:///d:/PORTFOLIO/src/components/bruno/modals/TechLabModal.jsx#L121-L123)
- **Evidence:**
  ```javascript
  // Lines 120-123 in src/components/bruno/modals/TechLabModal.jsx
  const sampleDatabase = [
    { id: 1, name: 'Nitish Priyan R S', role: 'Software / AI Engineer', cgpa: 7.8, batch: '2028' },
    { id: 2, name: 'Lexora Platform', role: 'AI Legal Research', cgpa: 9.2, batch: '2024' },
    { id: 3, name: 'AI Govt Scheme', role: 'Citizen Eligibility', cgpa: 8.9, batch: '2024' },
    { id: 4, name: 'Project Zero', role: 'Security Diagnostics', cgpa: 8.5, batch: '2024' }
  ];
  ```
- **User Impact:** When viewing the SQL tab in Tech Lab, projects (`Lexora Platform`, `AI Govt Scheme`) are listed as rows with arbitrary CGPA numbers (`9.2`, `8.9`), causing potential recruiter misunderstanding regarding academic records.
- **Root Cause:** A student/candidate table schema was populated with project names instead of software engineering entities.
- **Recommended Correction:**
  Refactor table schema to `systems_benchmark` (columns: `id`, `project_name`, `architecture`, `latency_ms`, `accuracy_pct`) or use realistic team member names rather than mixing projects with student CGPA metrics.
- **How to Test the Correction:**
  1. Open Tech Lab modal (`LAB` icon or via Lab area kiosk).
  2. Click the **Database / SQL** tab.
  3. Run the query and verify clean software/project metrics without contradictory CGPA values.

---

### ISSUE AUD-004: Missing OpenGraph & Twitter Social Thumbnail Images
- **Issue ID:** `AUD-004`
- **Classification:** `CONFIRMED DEFECT`
- **Severity:** **MEDIUM**
- **Exact Page / Component:** Global HTML Head
- **File Path:** [`index.html`](file:///d:/PORTFOLIO/index.html#L13-L21)
- **Evidence:**
  ```html
  <!-- index.html lines 13-21 -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content="NITISH PRIYAN R S | Software Engineer | Java Developer | AI/ML Engineer" />
  <meta property="og:description" content="..." />
  <meta property="twitter:card" content="summary_large_image" />
  <!-- Missing: og:image, og:url, twitter:image, canonical link -->
  ```
- **User Impact:** When the portfolio link is shared on LinkedIn, Twitter/X, Discord, or Slack, preview cards display a blank gray square rather than a rich branded preview.
- **Root Cause:** `<meta property="og:image">` and `<meta property="og:url">` were omitted during initial setup.
- **Recommended Correction:**
  Add a dedicated 1200x630 social preview card (`/og-image.png`) and include:
  ```html
  <meta property="og:image" content="https://nitishpriyan.vercel.app/og-image.png" />
  <meta property="og:url" content="https://nitishpriyan.vercel.app" />
  <meta property="twitter:image" content="https://nitishpriyan.vercel.app/og-image.png" />
  <link rel="canonical" href="https://nitishpriyan.vercel.app" />
  ```
- **How to Test the Correction:**
  Run the URL through the [Twitter Card Validator](https://cards-dev.twitter.com/validator) or [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/).

---

### ISSUE AUD-005: Absence of HSTS and CSP Security Headers in vercel.json
- **Issue ID:** `AUD-005`
- **Classification:** `POTENTIAL RISK`
- **Severity:** **LOW**
- **Exact Page / Component:** Production Vercel Edge Configuration
- **File Path:** [`vercel.json`](file:///d:/PORTFOLIO/vercel.json#L11-L36)
- **Evidence:**
  `vercel.json` configures `X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`, `Referrer-Policy`, and `Permissions-Policy`, but does not configure:
  1. `Strict-Transport-Security` (`max-age=63072000; includeSubDomains; preload`)
  2. `Content-Security-Policy` (CSP)
- **User Impact:** While Vercel enforces HTTPS at the DNS/routing layer, without explicit HSTS headers browsers may initially attempt an insecure connection before being redirected.
- **Root Cause:** Minimal security header template was utilized.
- **Recommended Correction:** Add `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` into the global headers array in `vercel.json`.
- **How to Test the Correction:**
  Inspect response headers using `curl -I https://nitishpriyan.vercel.app` and verify presence of `Strict-Transport-Security`.

---

### ISSUE AUD-006: Icon-Only Mobile Navigation Button Missing Accessible Name
- **Issue ID:** `AUD-006`
- **Classification:** `CONFIRMED DEFECT`
- **Severity:** **LOW**
- **Exact Page / Component:** Editorial Navbar Mobile Toggle Group
- **File Path:** [`src/components/editorial/EditorialNavbar.tsx`](file:///d:/PORTFOLIO/src/components/editorial/EditorialNavbar.tsx#L155)
- **Evidence:**
  ```tsx
  // Line 155 in src/components/editorial/EditorialNavbar.tsx
  {onReturn3D && (
    <button
      onClick={onReturn3D}
      className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono"
    >
      <Box className="w-4 h-4" />
    </button>
  )}
  ```
- **User Impact:** Screen reader users navigating the 2D reader mode on mobile hear "button" with no label or announcement of what the button triggers.
- **Root Cause:** Missing `aria-label="Return to 3D Exploration World"` or `title`.
- **Recommended Correction:**
  Add `aria-label="Return to 3D World"` and `title="Return to 3D World"`.
- **How to Test the Correction:**
  Run Lighthouse Accessibility audit or test using Chrome Screen Reader / VoiceOver on iOS.

---

### ISSUE AUD-007: Window Keyboard Listeners in Inputs.js Not Unregistered on Game Destruction
- **Issue ID:** `AUD-007`
- **Classification:** `POTENTIAL RISK`
- **Severity:** **MEDIUM**
- **Exact Page / Component:** Three.js Game Engine Inputs Dispatcher
- **File Path:** `src/engine/folio/Game/Inputs/Inputs.js` & [`src/engine/folio/Game/Game.js`](file:///d:/PORTFOLIO/src/engine/folio/Game/Game.js#L282)
- **Evidence:**
  When switching from the 3D engine to 2D reader mode, `Game.destroy()` disposes of the WebGPU renderer and sound engine, but `this.inputs` has no `destroy()` method to unbind its `window.addEventListener('keydown')` and `window.addEventListener('keyup')` listeners.
- **User Impact:** Pressing `W`, `A`, `S`, `D`, or arrow keys while browsing the 2D editorial portfolio continues firing Folio input action dispatches in memory.
- **Root Cause:** Folio engine was originally designed for single-page standalone 3D gaming without dynamic mounting/unmounting.
- **Recommended Correction:**
  Implement an `inputs.destroy()` method in `Inputs.js` that removes all window event listeners and invoke it within `Game.destroy()`.
- **How to Test the Correction:**
  1. Open 3D world, then click `2D` button.
  2. Press `W` repeatedly.
  3. Verify no residual action listeners are triggered in the browser console.

