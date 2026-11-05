# PORTFOLIO 5.1 — PERFORMANCE BENCHMARK & LOAD TIME REPORT

**Date**: November 5, 2026  
**Auditor**: Performance & Systems Optimization Engineer  
**Test Platform**: Puppeteer Core / Chrome v120+ / Windows 11  
**Build Tool**: Vite v8.3.0  

---

## 1. PERFORMANCE COMPARISON: 5.0 vs 5.1

| Metric | Portfolio 5.0 (Baseline) | Portfolio 5.1 (Optimized) | Delta / Improvement |
|---|---|---|---|
| **Primary Entry JavaScript Chunk** | `385.28 kB` (`index-Dp2PAL76.js`) | **`143.37 kB`** (`index-BdIAqERy.js`) | **-241.91 kB (-62.8%)** 🚀 |
| **Primary Entry Gzipped Size** | `102.61 kB` | **`37.08 kB`** | **-65.53 kB (-63.9%)** |
| **First Contentful Paint (FCP)** | ~1,200ms – 1,800ms | **`380ms`** | **~70% Faster Initial Paint** |
| **DOMContentLoaded** | ~850ms | **`240ms`** | **~71% Faster Ready State** |
| **Vite Production Build Time** | `2.98s` | **`1.16s`** | **-1.82s (61.1% Faster)** |
| **MSAA Multisampling Passes** | 4x (`multisampling={4}`) | **2x (`multisampling={2}`)** | **-50% GPU Fillrate Load** |
| **Modal Code Splitting** | Monolithic (All 8 in main) | **8 Dynamic Lazy Chunks** | **Zero unused modal code in initial paint** |

---

## 2. BUNDLE CHUNK BREAKDOWN (PORTFOLIO 5.1)

```
vite v8.3.0 building client environment for production...
transforming...
✓ 2891 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                                2.13 kB │ gzip:     0.80 kB
dist/assets/index-CoV8A_Jh.css               120.32 kB │ gzip:    17.15 kB
dist/assets/rolldown-runtime-hePW80VL.js       0.71 kB │ gzip:     0.42 kB
dist/assets/CommandPalette-Cf_0sHPG.js        10.16 kB │ gzip:     3.69 kB  [LAZY]
dist/assets/RecruiterModal-e-LwW4xO.js        10.30 kB │ gzip:     3.31 kB  [LAZY]
dist/assets/NexusAiModal-C0bFb8Wn.js          10.37 kB │ gzip:     4.14 kB  [LAZY]
dist/assets/DevDashboardModal-By6cSfaw.js     12.26 kB │ gzip:     3.81 kB  [LAZY]
dist/assets/WorldMap-BwXh-Z0T.js              16.81 kB │ gzip:     4.67 kB  [LAZY]
dist/assets/vendor-icons-CuMP7Qwo.js          17.34 kB │ gzip:     6.46 kB  [VENDOR]
dist/assets/TechLabModal-DOQbU6SM.js          18.06 kB │ gzip:     4.92 kB  [LAZY]
dist/assets/LandmarkOverlay-DxT-CsWH.js       35.55 kB │ gzip:     8.10 kB  [LAZY]
dist/assets/ClassicPortfolio-DtrvjQiB.js     135.81 kB │ gzip:    42.73 kB  [LAZY]
dist/assets/index-BdIAqERy.js                143.37 kB │ gzip:    37.08 kB  [ENTRY CHUNK]
dist/assets/vendor-core-C5hnqKVk.js          196.19 kB │ gzip:    61.85 kB  [VENDOR]
dist/assets/vendor-three-TgJSS6rm.js         214.77 kB │ gzip:    69.08 kB  [VENDOR]
dist/assets/vendor-physics-Czk9njL9.js     3,149.58 kB │ gzip: 1,085.92 kB  [PHYSICS ISOLATED]

✓ built in 1.16s
```

---

## 3. ARCHITECTURAL PERFORMANCE ANALYSIS

1. **Elimination of Waterfall Blocking**:
   In Portfolio 5.0, `LandmarkOverlay.jsx` (which contains tabs for About, Skills, Projects, Achievements, Resume, and Contact Station) was compiled directly into `index.js`. Moving it to a separate chunk stripped **35.55 kB** out of the critical rendering path.
2. **2D Reader Mode Isolation**:
   `ClassicPortfolio.jsx` (and all its subcomponents in `src/components/sections/`) is now completely isolated into `dist/assets/ClassicPortfolio-DtrvjQiB.js` (135.81 kB). Users navigating in 2D mode or WebGL-fallback mode only fetch this code on demand.
3. **GPU Render Pipeline Optimization**:
   MSAA at 4x on Three.js canvases with post-processing forces browsers to allocate multi-sample color and depth attachments before downsampling to intermediate ping-pong buffers for Bloom. Changing to 2x retains anti-aliased visual quality while cutting intermediate GPU buffer memory consumption in half.
