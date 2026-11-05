# NITISH.DEV - Premium Developer Portfolio

A cinematic, interactive developer portfolio built for Nitish Priyan R S.

## 1. Final Project Structure

```text
d:\PORTFOLIO\
  ├── src/
  │   ├── animations/ 
  │   │   ├── variants.js
  │   │   └── transitions.js
  │   ├── components/ 
  │   │   ├── About.jsx
  │   │   ├── Achievements.jsx
  │   │   ├── Certifications.jsx
  │   │   ├── Contact.jsx
  │   │   ├── Cursor.jsx
  │   │   ├── EngineeringCore.jsx
  │   │   ├── GitHub.jsx
  │   │   ├── Hero.jsx
  │   │   ├── LeetCode.jsx
  │   │   ├── MagneticButton.jsx
  │   │   ├── Navbar.jsx
  │   │   ├── ProjectCard.jsx
  │   │   ├── Projects.jsx
  │   │   └── Stats.jsx
  │   ├── data/ 
  │   │   ├── achievements.js
  │   │   ├── certifications.js
  │   │   ├── profile.js
  │   │   ├── projects.js
  │   │   └── skills.js
  │   ├── pages/
  │   │   └── Home.jsx
  │   ├── App.jsx
  │   ├── main.jsx
  │   ├── index.css
  │   └── utils.js
  ├── index.html
  ├── package.json
  └── vite.config.js
```

## 2. Setup Instructions

1. Ensure Node.js is installed.
2. Clone or open the repository.
3. Install dependencies:
   ```bash
   npm install
   ```

## 3. Run Command

To start the local development server:
```bash
npm run dev
```
The site will be available at `http://localhost:5173`.

## 4. Build Command

To create an optimized production build:
```bash
npm run build
```

## 5. Deployment Instructions

1. Run `npm run build`.
2. The generated `dist` folder can be uploaded directly to Vercel, Netlify, or GitHub Pages.
3. If using Vercel/Netlify, simply connect your GitHub repository and the platform will automatically detect Vite and configure the build settings.

## 6. List of Environment Variables

*No environment variables are required for this project.* (GitHub API calls are unauthenticated to prevent rate-limit leaks).

## 7. Known Placeholders

Please replace the following placeholders before deploying:
- `src/data/profile.js`: Replace the empty `linkedin` and `leetcode` URLs with your actual profile links.
- `src/data/projects.js`: Update the descriptions if you wish to expand upon the resume bullet points. You may also want to add screenshot URLs if you have image assets for the projects.
- `public/`: Add your preferred favicon and update the `href` in `index.html`.