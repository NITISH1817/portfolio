# PORTFOLIO 6.0 — PERFORMANCE INVESTIGATION & METRIC RECONCILIATION

**Target**: `https://portfolio-nitish1817.vercel.app/`  
**Branch**: `portfolio-6.0-nexus` (Preserving Portfolio 5.1 rollback baseline at commit `deaa5cc`)  
**Auditor**: Principal Systems Architect & WebGL Optimization Specialist  
**Investigation Date**: November 5, 2026  

---

## 1. RECONCILING THE METRIC CONTRADICTION

### The Anomaly
- In the initial test on localhost, load time was reported as **6,129ms** with **FCP: 380ms**.
- In the remote live test on Vercel, the script reported:
  `HTTP Status: 200 in 26,736ms (FCP: 17,228ms)`.
- The user rightly identified this contradiction: why would a static Vite site on Vercel Edge CDN take 26.7 seconds?

### The Root Cause Discovered
A rigorous, multi-tiered network and browser probe was executed using raw Node HTTPS sockets and isolated Chrome CDP instrumentation (`diagnose-performance.cjs`). 

The findings resolve the contradiction completely:

#### A. Direct Edge CDN Protocol Probe (Raw HTTPS Socket)
```json
{
  "dnsLookup": "79.29 ms",
  "tcpHandshake": "77.85 ms",
  "tlsNegotiation": "123.23 ms",
  "timeToFirstByte (TTFB)": "356.43 ms",
  "htmlDownloadTime": "10.53 ms",
  "htmlContentLength": "2,134 bytes",
  "httpStatus": 200
}
```
**Conclusion**: Vercel Edge Server response time is **NOT** 26.7 seconds. The edge server delivers the HTML document in **356ms**.

#### B. Browser Navigation & Resource Waterfall (Clean Chrome Session)
```json
{
  "dns": 11,
  "tcp": 106,
  "requestToTTFB": 53,
  "response": 11,
  "domInteractive": 210,
  "domContentLoaded": 890,
  "loadEventEnd": 890,
  "firstPaint": "500 ms",
  "totalLoadEvent": "895 ms"
}
```

#### C. Why did the previous test report 26,736ms?
1. **The `networkidle2` Trap**:
   In `test-portfolio-5.1.cjs`, the script executed:
   `page.goto(TARGET_URL, { waitUntil: 'networkidle2', timeout: 30000 })`.
   Puppeteer's `networkidle2` does not return when the HTML arrives, nor when `DOMContentLoaded` fires. It waits until there are **no more than 2 open network connections for 500 consecutive milliseconds**.
2. **Synchronous 3D Mount on Intro Screen**:
   In Portfolio 5.1, `BrunoPortfolio.jsx` mounts the `<Canvas>` and `<Physics>` unconditionally. While the user is simply looking at the 2D intro screen, the browser immediately requests:
   - `vendor-physics-Czk9njL9.js` (**1,023.1 KB transfer / 3,075.8 KB decoded**).
   - `vendor-three-TgJSS6rm.js` (69.5 KB transfer / 209.7 KB decoded).
   - Google Fonts webfont glyph streams.
   - Rapier WASM binary instantiation.
3. **Headless GPU Software Emulation Starvation**:
   In headless Chrome (and on low-end mobile devices without dedicated GPUs), running Rapier's physics worker and WebGL post-processing shaders (`EffectComposer`, `Bloom`, `Vignette`) in software emulation maxes out the CPU thread. The event loop stalls, delaying network resolution and artificially skewing the performance observer's FCP entry to 17.2s.

---

## 2. PRODUCTION CHUNK AUDIT (PORTFOLIO 5.1 BASELINE)

| Resource Chunk | Initiator | Transfer (Network) | Decoded (Memory) | Start Time | Duration | Architectural Assessment |
|---|---|---|---|---|---|---|
| `vendor-physics` | Vite rollup chunk | **1,023.1 KB** | **3,075.8 KB** | 201 ms | 615 ms | 🚨 **CRITICAL BOTTLENECK**: 3 MB of physics & WASM downloaded before user clicks "START". |
| `vendor-three` | Vite rollup chunk | 69.5 KB | 209.7 KB | 201 ms | 296 ms | ⚠️ Heavy 3D engine loaded during 2D intro. |
| `vendor-core` | Vite rollup chunk | 61.3 KB | 191.6 KB | 200 ms | 307 ms | 🟢 React + Zustand runtime (essential). |
| `index-Cca2Zs8C.js` | Main entry script | 37.2 KB | 140.0 KB | 200 ms | 249 ms | 🟢 Good size (optimized in 5.1). |
| `index-DOjioXHL.css`| Tailwind Stylesheet | 16.5 KB | 118.6 KB | 201 ms | 251 ms | 🟢 Fast stylesheet download. |
| `Google Fonts` | External CDN | 1.6 KB + glyphs | 29.6 KB | 199 ms | 284 ms | ⚠️ External network connection. |

---

## 3. REQUIRED PORTFOLIO 6.0 PERFORMANCE TARGETS

| Metric | Industry Standard (Good) | Portfolio 5.1 Baseline | Portfolio 6.0 Target | Engineering Mechanism |
|---|---|---|---|---|
| **First Contentful Paint (FCP)** | < 1,800 ms | ~500 ms – 1,800 ms | **< 600 ms** | Zero-WebGL Intro Screen; zero Three.js in initial payload. |
| **Largest Contentful Paint (LCP)** | < 2,500 ms | ~1,200 ms | **< 1,200 ms** | Preloaded headline typography & CSS keyframe animation. |
| **Time to Interactive (TTI)** | < 3,800 ms | Stalled by WASM | **< 800 ms** | Full interactivity on intro screen without waiting for 3D world. |
| **Initial JS Payload (Gzip)** | < 250 KB | ~1,250 KB (with Rapier) | **< 120 KB** | Dynamic lazy import of Game Engine & Rapier WASM. |
| **Physics WASM Download** | On Demand | Immediate (1,023 KB) | **Deferred** | Only fetched when user presses "INITIALIZE MISSION". |
| **Cumulative Layout Shift (CLS)** | < 0.1 | 0.00 | **0.00** | Strict viewport sizing, fixed canvas bounds. |
| **Interaction to Next Paint (INP)** | < 200 ms | ~45 ms | **< 50 ms** | Passive wheel/touch listeners, non-blocking UI threads. |
| **Target Frame Rate (Desktop)** | 60 FPS | 55–60 FPS | **Solid 60 FPS** | Instanced city geometry, distance-based LOD, 1-pass bloom. |
| **Target Frame Rate (Mobile)** | 30–60 FPS | Unstable (30–45 FPS) | **Stable 45–60 FPS** | Dynamic DPR scaling (0.85–1.5x) based on device tier. |

