# NITISH PRIYAN PORTFOLIO — MOBILE & TABLET RESPONSIVENESS AUDIT
**Target Deployment:** [https://nitishpriyan.vercel.app](https://nitishpriyan.vercel.app)  
**Audit Timestamp:** 2026-11-06T20:30:10+05:30  
**Tested Viewports:**
- Mobile Small: 375 $\times$ 667 px (iPhone SE)
- Mobile Medium: 390 $\times$ 844 px (iPhone 14 / 15)
- Mobile Large: 430 $\times$ 932 px (iPhone 15 Pro Max)
- Tablet Portrait: 768 $\times$ 1024 px (iPad Mini / Air)
- Tablet Landscape: 1024 $\times$ 768 px (iPad Pro)

---

## 1. INTRO LANDING PAGE MOBILE VIEWPORT AUDIT

### Layout Adaptation
- **Header:**
  - Owner identity (`NITISH PRIYAN R S`) and academic batch badge remain aligned on top-left.
  - Controls on top-right automatically hide auxiliary labels on small screens, preserving touch targets.
- **Hero Title & Value Cards:**
  - The main headline font scales fluidly using `text-3xl sm:text-5xl md:text-6xl`, preventing overflow or horizontal window scroll.
  - Value cards collapse from a 4-column desktop layout (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`) to a 2-column or 1-column card stack on mobile.
- **Call-to-Action Buttons:**
  - The primary `#start-exploring-btn` and secondary `#recruiter-dossier-btn` expand to full width (`w-full sm:w-auto`) on mobile, offering large, accessible thumb tap areas (> 48px height).
- **Controls & Locations Drawer:**
  - Controls grid automatically shifts to a 2-column keycap layout on viewports < 640px.

---

## 2. 2D EDITORIAL READER MOBILE AUDIT

### Mobile Navigation Drawer
- **Component File:** [`src/components/editorial/EditorialNavbar.tsx`](file:///d:/PORTFOLIO/src/components/editorial/EditorialNavbar.tsx)
- **Drawer Behavior:**
  - On screens narrower than 640px, the desktop navigation links are replaced by a glassmorphic mobile hamburger menu button.
  - Tapping the hamburger button opens a full-screen blurred dark overlay (`bg-black/80 backdrop-blur-xl`) with staggered animated links for Home, About, Projects, Skills, Education, Achievements, and Contact.
  - Tapping any link smooth-scrolls to the target section with an offset of 80px to account for the sticky header, and automatically dismisses the drawer.
- **Section Readability:**
  - **About:** Two-column split changes to a vertical flow: full biography text on top, followed by the 5 technical capability badges.
  - **Projects:** The 3 Flagship articles adapt from a 12-column desktop grid to single-column vertical cards. Interactive architecture workflow steps wrap neatly into numbered pills.
  - **Skills:** Skill bars and pill badges wrap cleanly with generous padding.
  - **Contact:** Dual quick-connect action buttons (Send Message via Email and Download Resume PDF) span full mobile width for effortless one-handed thumb interaction.

---

## 3. 3D PLAYGROUND MOBILE & TOUCH AUDIT

### Touch Steering & Virtual Joystick
- **Touch Input Driver:** `Nipple.js` (virtual dynamic joystick) & touch gesture listener in `Inputs.js`.
- **Behavior:**
  - Touching and dragging on the left half of the touchscreen spawns an analog directional thumb joystick to control acceleration, braking, and steering.
  - Dedicated virtual on-screen touch buttons trigger jump/drift and nitro boost.
- **HUD Adaptability:**
  - Top playground bar hides verbose text strings (e.g., hiding `"AI"` and `"M"` keyboard shortcut badges on mobile via `hidden sm:inline`) to prevent touch targets from colliding or crowding the top screen edge.
  - Bottom telemetry speedometer scales gracefully to avoid obstructing the driving camera view.

---

## 4. RESPONSIVENESS CHECKLIST

| Test Item | Desktop (1920x1080) | Tablet (768x1024) | Mobile (390x844) | Verification Status |
|---|---|---|---|---|
| **Zero Horizontal Scrollbar** | Passed (100% width) | Passed (100% width) | Passed (100% width) | **VERIFIED** |
| **Touch Target Size $\ge$ 44px** | N/A (Mouse cursor) | Passed ($\ge 44\text{px}$) | Passed ($\ge 48\text{px}$) | **VERIFIED** |
| **Text Legibility (No overlap)** | Passed | Passed | Passed | **VERIFIED** |
| **Image & Canvas Aspect Ratio** | 16:9 widescreen | 4:3 auto-adapt | 9:19.5 auto-fill | **VERIFIED** |
| **Modal Dialog Responsiveness** | Centered modal (max-w-2xl) | Centered modal | Full-screen bottom sheet | **VERIFIED** |
| **Resume PDF Direct Download** | Direct download | Direct download | Opens in mobile PDF viewer | **VERIFIED** |

