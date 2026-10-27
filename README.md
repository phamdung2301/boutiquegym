# FORGE — Boutique Gym (v3.0)

React + Vite + TypeScript + Three.js (React Three Fiber) + Framer Motion.

- **Run locally:** `npm install` then `npm run dev` (or `npm run build` + `npm run preview`).
- **Deploy:** Vercel import, build command `npm run build`, output directory `dist`. Do NOT serve the repo root with GitHub Pages — it contains Vite source, not a built site.
- **Demo only:** all bookings, plans and held memberships are saved in the browser's localStorage.

## v3 — what changed from v2

- Full-bleed procedural squat-rack 3D hero (boxes/cylinders only, no torus knot), with a vertical side index.
- Class timetable board with per-class spot booking and cancellation.
- Strength Lab: barbell weight slider drives the plate breakdown and the 3D barbell plates.
- Membership as a comparison table, not cards, plus add-ons and a held-plan save.
- Weekly workout planner with a per-goal plan grid and done tracking.
- Trainer roster + trial booking, separate from class booking.
