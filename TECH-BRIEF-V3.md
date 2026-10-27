# FORGE v3.0 — Tech Brief (boutiquegym-v3)

Concept site only. All bookings are demos saved to the visitor's own
browser (`localStorage`); nothing is sent to a server and no real
booking is created.

## Why v3 is different from v2 (and from the spa v3)
- v2 failed on: same hero shape on both sites, same hero-grid /
  marquee / card-grid / single-form template, one demo form.
- v3 layout is a vertical "training floor", not a hero column layout:
  full-bleed 3D rig hero with the headline overlaid at the bottom of
  the viewport and a vertical side index (01–06, floor-counter style),
  then a full-width timetable board, then the Strength Lab, then a
  membership comparison TABLE (not cards), then a 7-day planner grid,
  then a horizontal trainer roster, then a trial form, then footer.
- No marquee section, no card grid, no left-rail / centre-stage /
  right-configurator layout (that layout belongs to the spa v3).

## 3D builder (procedural, R3F, no imported models)
- Squat rack from boxes: 4 uprights, top crossmembers, base feet,
  volt safety bars. Barbell: cylinder bar + collars + plate cylinders
  whose radius grows with plate weight.
- Bench (box + legs), dumbbells (cylinder handle + plate cylinders),
  kettlebells (sphere + inverted-U handle made of three straight
  bars), plate stacks, floor slab + volt guide line.
- The banned hero geometry from v2 is absent everywhere in `src/`
  (verified by grep). The barbell plates are the hero object, and they
  are functional: they load/unload from the Strength Lab weight.
- Cursor-lerp rotation (never snap), DPR cap 1.75, Canvas pauses via
  `frameloop="never"` on the global Pause button, IntersectionObserver
  standby when a canvas scrolls off-screen, and a static poster
  fallback under `prefers-reduced-motion`.

## Mechanisms learned (not copied) from the reference patterns
- From formex-exhibition: a configurator that creates a decision and
  emits a synced code (here: the Strength Lab "load code"
  FG-100KG + plates-per-side breakdown), while the form only collects
  contact; section backgrounds change by role (dark lab section).
- From zedpod-cabin: one procedural builder reused across views
  (hero rack + barbell close-up share the same barbell code),
  DPR cap + off-screen gating, and a model switch that syncs several
  numbers at once (here: tier + add-ons sync the monthly total,
  model/goal switch syncs the whole week plan).

## Interactive systems (5, all distinct)
1. Class timetable: day selector Mon–Sun + type filter; book a spot
   (spots decrease, animated), cancel (spot returns), booked classes
   listed in "My bookings".
2. Strength Lab: weight slider 20–180 kg (step 2.5) -> plate breakdown
   per side + load code + Epley 1RM estimate from a reps input; the
   3D barbell plates in both the hero and the close-up update.
3. Membership builder: 3 tiers as a comparison table (rows = features,
   columns = tiers) + 4 add-ons -> live monthly total; "Hold this plan"
   saves tier + add-ons to localStorage.
4. Weekly planner: goal (strength / fat loss / mobility) generates a
   7-day grid; clicking a day shows its session; marking done persists
   per goal in localStorage with a week-progress bar.
5. Trial booking: name / phone / date / time / coach form, saved to
   localStorage and listed in "My bookings"; a trainer's "Trial with X"
   button pre-fills the coach.

## Stack / run
Vite 7 + React 19 + TypeScript + three + @react-three/fiber +
framer-motion. `npm install`, `npm run dev`, `npm run build`.
Deploy: Vercel (build `npm run build`, output `dist`). Do NOT serve
the repo root from GitHub Pages — it is Vite source, not a built site.

## Verification (2026-10-26, this machine)
- `npm run typecheck` (tsc --noEmit): PASS, no output.
- `npm run build` (vite build): PASS, 453 modules, dist/index.html
  0.80 kB, CSS 11.70 kB, JS 1,274.86 kB (gzip 363.38 kB, three.js —
  chunk-size warning only, same as v2).
- Served `dist/` on 127.0.0.1: HTTP 200, title "FORGE — Boutique Gym
  Đà Nẵng", brand string present in the built JS.
- `grep -r "torus" src/`: NO MATCHES. `grep "FORGE v3.0" src/`:
  hit in `src/App.tsx` (footer).
- NOT verified: WebGL rendering on the user's own machine / browser,
  and real-device mobile layout (only source + build + HTTP checked).
