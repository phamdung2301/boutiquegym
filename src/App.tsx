import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import Rig3D from "./components/Rig3D";
import { CLASSES, DAYS, DAY_NAMES, TIERS, FEATURES, ADDONS, TRAINERS, GOALS, PLANS, fmtVND } from "./data";
import type { ClassType, Goal } from "./data";
import { BAR_KG, estimate1RM, loadCode, platesPerSide } from "./lib/plates";
import { store } from "./lib/store";
import type { TrialBooking } from "./lib/store";

const TYPES: ("All" | ClassType)[] = ["All", "Strength", "HIIT", "Mobility", "Combat", "Endurance"];

function AnimatedNumber({ value, suffix = "" }: { value: string | number; suffix?: string }) {
  return (
    <motion.span key={String(value)} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      {value}{suffix}
    </motion.span>
  );
}

function Roll({ text }: { text: string }) {
  // v3.1 rolling-text hover: the label slides up and its duplicate
  // slides in, instead of a button merely changing colour on hover.
  return (
    <span className="roll" aria-label={text}>
      <span>{text}</span>
      <span aria-hidden="true">{text}</span>
    </span>
  );
}

function SectionHead({ index, title, blurb, tech }: { index: string; title: string; blurb: string; tech?: string }) {
  return (
    <motion.div className="section-head" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.4 }}>
      <div className="section-index mono">{index}</div>
      {tech && <p className="mono tech-label">{tech}</p>}
      <h2>
        <span className="mask-line">
          <motion.span initial={{ y: "110%" }} whileInView={{ y: "0%" }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
            {title}
          </motion.span>
        </span>
      </h2>
      <p>{blurb}</p>
    </motion.div>
  );
}

function Intensity({ n }: { n: number }) {
  return (
    <span className="intensity" aria-label={`Intensity ${n} of 5`}>
      {[1, 2, 3, 4, 5].map((i) => <i key={i} className={i <= n ? "on" : ""} />)}
    </span>
  );
}

export default function App() {
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [weight, setWeight] = useState(100);
  const [reps, setReps] = useState(5);
  const [day, setDay] = useState(0);
  const [typeFilter, setTypeFilter] = useState<"All" | ClassType>("All");
  const [booked, setBooked] = useState<string[]>(() => store.bookedClasses());
  const [trials, setTrials] = useState<TrialBooking[]>(() => store.trials());
  const [tier, setTier] = useState("pro");
  const [addons, setAddons] = useState<string[]>([]);
  const [heldPlan, setHeldPlan] = useState(() => store.heldPlan());
  const [goal, setGoal] = useState<Goal>("strength");
  const [doneDays, setDoneDays] = useState<number[]>(() => store.doneDays("strength"));
  const [planDay, setPlanDay] = useState(0);
  const [trialName, setTrialName] = useState("");
  const [trialPhone, setTrialPhone] = useState("");
  const [trialDate, setTrialDate] = useState("");
  const [trialTime, setTrialTime] = useState("07:00");
  const [trialCoach, setTrialCoach] = useState("Minh Tran");
  const [trialSaved, setTrialSaved] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [nowTick, setNowTick] = useState(() => new Date());
  const [trialSheetOpen, setTrialSheetOpen] = useState(false);
  const [planSheetOpen, setPlanSheetOpen] = useState(false);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 25 });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => { store.setBookedClasses(booked); }, [booked]);
  useEffect(() => { store.setTrials(trials); }, [trials]);

  // v3.1 floor-counter side index: the section currently in view wins.
  useEffect(() => {
    const ids = ["hero", "timetable", "strength", "membership", "planner", "trainers"];
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: [0, 0.25, 0.5] },
    );
    ids.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);

  // v3.1 countdown clock, refreshed every 30s.
  useEffect(() => {
    const t = window.setInterval(() => setNowTick(new Date()), 30000);
    return () => window.clearInterval(t);
  }, []);

  const plates = useMemo(() => platesPerSide(weight), [weight]);
  const oneRM = estimate1RM(weight, reps);
  const dayClasses = CLASSES.filter((c) => c.day === day && (typeFilter === "All" || c.type === typeFilter));
  const bookedClasses = CLASSES.filter((c) => booked.includes(c.id));

  const switchGoal = (g: Goal) => {
    setGoal(g);
    setDoneDays(store.doneDays(g));
    setPlanDay(0);
    setPlanSheetOpen(false);
  };

  // v3.1 countdown: for today, time until the next class of the
  // selected day; for another day, that day's first class instead.
  const todayIdx = (nowTick.getDay() + 6) % 7;
  const sortedDayClasses = [...dayClasses].sort((a, b) => a.time.localeCompare(b.time));
  const minutesNow = nowTick.getHours() * 60 + nowTick.getMinutes();
  const toMinutes = (t: string) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
  const nextToday = day === todayIdx ? sortedDayClasses.find((c) => toMinutes(c.time) > minutesNow) : undefined;
  const nextClass = nextToday ?? sortedDayClasses[0];
  const nextInMin = nextClass ? (day === todayIdx && nextToday ? toMinutes(nextClass.time) - minutesNow : null) : null;
  const nextLabel = !nextClass
    ? "NO CLASSES THIS DAY — TRY ANOTHER DAY OR TYPE"
    : nextInMin !== null
      ? `NEXT CLASS IN ${Math.floor(nextInMin / 60)}H ${String(nextInMin % 60).padStart(2, "0")}M — ${nextClass.name.toUpperCase()} AT ${nextClass.time} WITH ${nextClass.coach.toUpperCase()}`
      : `FIRST CLASS ${DAY_NAMES[day].toUpperCase()} — ${nextClass.name.toUpperCase()} AT ${nextClass.time} WITH ${nextClass.coach.toUpperCase()}`;

  // v3.1 streak: consecutive done days ending at day i.
  const streakFor = (i: number) => {
    let n = 0;
    for (let d = i; d >= 0 && doneDays.includes(d); d--) n++;
    return n;
  };
  const weekPct = doneDays.length / 7;
  const ringC = 2 * Math.PI * 26;
  const toggleDone = (d: number) => {
    const next = doneDays.includes(d) ? doneDays.filter((x) => x !== d) : [...doneDays, d];
    setDoneDays(next);
    store.setDoneDays(goal, next);
  };

  const tierPrice = TIERS.find((t) => t.id === tier)?.price ?? 0;
  const addonsTotal = ADDONS.filter((a) => addons.includes(a.id)).reduce((s, a) => s + a.price, 0);
  const monthlyTotal = tierPrice + addonsTotal;

  const holdPlan = () => {
    const held = { tier, addons };
    setHeldPlan(held);
    store.setHeldPlan(held);
  };

  const submitTrial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trialName.trim() || !trialPhone.trim() || !trialDate) return;
    const t: TrialBooking = {
      id: `trial-${Date.now()}`, name: trialName.trim(), phone: trialPhone.trim(),
      date: trialDate, time: trialTime, coach: trialCoach,
    };
    setTrials((prev) => [...prev, t]);
    setTrialSaved(true);
  };

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });

  const sideIndex = [
    { n: "01", id: "hero", label: "RIG" },
    { n: "02", id: "timetable", label: "BOARD" },
    { n: "03", id: "strength", label: "LAB" },
    { n: "04", id: "membership", label: "PLANS" },
    { n: "05", id: "planner", label: "WEEK" },
    { n: "06", id: "trainers", label: "COACHES" },
  ];

  return (
    <div className="page">
      <motion.div className="scroll-progress" style={{ scaleX: progress }} />
      <header className="topbar">
        <button className="wordmark" onClick={() => scrollTo("hero")}>FORGE<span>ĐÀ NẴNG</span></button>
        <nav className="topnav mono">
          <button onClick={() => scrollTo("timetable")}>BOARD</button>
          <button onClick={() => scrollTo("strength")}>LAB</button>
          <button onClick={() => scrollTo("membership")}>PLANS</button>
          <button onClick={() => scrollTo("planner")}>WEEK</button>
          <button onClick={() => scrollTo("trainers")}>COACHES</button>
        </nav>
        <button className="pause-btn mono" onClick={() => setPaused((p) => !p)} aria-pressed={paused}>
          {paused ? "▶ RESUME MOTION" : "❚❚ PAUSE MOTION"}
        </button>
      </header>

      {/* 1 — FULL-BLEED RIG HERO */}
      <section id="hero" className="hero-viewport">
        <Rig3D plates={plates} variant="rack" paused={paused} reducedMotion={reducedMotion} height="100%" />
        <div className="hero-overlay">
          <p className="mono hero-kicker">BOUTIQUE GYM — EST. ĐÀ NẴNG — SMALL GROUPS, HEAVY BARS</p>
          <p className="mono tech-label">01 · SCROLL TURNS THE RIG — 3D, NOT A POSTER</p>
          <h1>
            {["BUILT", "ON THE"].map((line, i) => (
              <span key={line} className="mask-line">
                <motion.span initial={{ y: "110%" }} animate={{ y: "0%" }} transition={{ duration: 0.7, delay: 0.1 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}>{line}</motion.span>
              </span>
            ))}
            <span className="mask-line">
              <motion.span initial={{ y: "110%" }} animate={{ y: "0%" }} transition={{ duration: 0.7, delay: 0.34, ease: [0.22, 1, 0.36, 1] }}><em>RACK.</em></motion.span>
            </span>
          </h1>
          <p className="hero-sub">No mirrors for posing. One rack, one barbell, one plan — and a coach who knows your numbers.</p>
          <div className="hero-cta-row">
            <button className="btn-volt" onClick={() => scrollTo("timetable")}><Roll text="SEE THIS WEEK'S BOARD ↓" /></button>
            <button className="btn-ghost" onClick={() => setTrialSheetOpen(true)}><Roll text="BOOK A FREE TRIAL" /></button>
          </div>
          <p className="mono hero-load">RIG LOAD NOW: {weight} KG — {loadCode(weight)}</p>
        </div>
        <nav className="side-index mono" aria-label="Section index">
          {sideIndex.map((s) => (
            <button key={s.n} className={activeSection === s.id ? "active" : ""} onClick={() => scrollTo(s.id)}><b>{s.n}</b><span>{s.label}</span></button>
          ))}
        </nav>
      </section>

      {/* 2 — CLASS TIMETABLE BOARD */}
      <section id="timetable" className="section board-section room-board">
        <SectionHead index="02 / THE BOARD" tech="LIVE BOARD — SPOTS UPDATE ON BOOK · COUNTDOWN REFRESHES EVERY 30S" title="THIS WEEK, ON THE WALL" blurb="Every class, every coach, every open spot — pick a day, filter by type, book a spot. Spots come back when you cancel. Demo only: bookings live in your browser." />
        <p className="mono next-countdown" aria-live="polite">⏱ {nextLabel}</p>
        <div className="day-strip">
          {DAYS.map((d, i) => (
            <button key={d} className={day === i ? "active" : ""} onClick={() => setDay(i)}>
              <span className="mono">{d}</span><span>{DAY_NAMES[i]}</span>
            </button>
          ))}
        </div>
        <div className="filter-row mono">
          {TYPES.map((t) => (
            <button key={t} className={typeFilter === t ? "active" : ""} onClick={() => setTypeFilter(t)}>{t.toUpperCase()}</button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={`${day}-${typeFilter}`} className="board" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
            <div className="board-head mono"><span>TIME</span><span>CLASS</span><span>COACH</span><span>INTENSITY</span><span>SPOTS</span><span></span></div>
            {dayClasses.length === 0 && <p className="board-empty">No {typeFilter} class on {DAY_NAMES[day]}. Try another type.</p>}
            {dayClasses.map((c, i) => {
              const isBooked = booked.includes(c.id);
              const spotsLeft = c.spots - (isBooked ? 1 : 0);
              return (
                <motion.div key={c.id} className="board-row" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                  <b className="board-time">{c.time}</b>
                  <div><strong>{c.name}</strong><span className="board-room mono">{c.room} · {c.type.toUpperCase()}</span></div>
                  <span>{c.coach}</span>
                  <Intensity n={c.intensity} />
                  <span className="spots">
                    <AnimatedNumber value={spotsLeft} /> left
                    <span className="spots-bar" aria-hidden="true"><span style={{ width: `${Math.max(0, Math.round((spotsLeft / c.spots) * 100))}%` }} /></span>
                  </span>
                  <button
                    className={isBooked ? "btn-cancel" : "btn-book"}
                    onClick={() => setBooked((prev) => isBooked ? prev.filter((x) => x !== c.id) : [...prev, c.id])}
                  >
                    <Roll text={isBooked ? "CANCEL" : spotsLeft > 0 ? "BOOK SPOT" : "FULL"} />
                  </button>
                  <p className="board-detail mono">{c.room.toUpperCase()} · {c.type.toUpperCase()} · INTENSITY {c.intensity}/5 · {c.coach.toUpperCase()} RUNS THIS CLASS · {c.spots} SPOTS TOTAL</p>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        <div className="my-bookings">
          <h3 className="mono">MY BOOKINGS — DEMO, SAVED IN THIS BROWSER</h3>
          {bookedClasses.length === 0 && trials.length === 0 && <p>No bookings yet. Book a class above or a trial below.</p>}
          {bookedClasses.map((c) => (
            <div key={c.id} className="booking-line">
              <span>{DAY_NAMES[c.day]} {c.time} — {c.name} with {c.coach}</span>
              <button onClick={() => setBooked((prev) => prev.filter((x) => x !== c.id))}>Cancel</button>
            </div>
          ))}
          {trials.map((t) => (
            <div key={t.id} className="booking-line">
              <span>TRIAL {t.date} {t.time} — {t.name} with {t.coach}</span>
              <button onClick={() => setTrials((prev) => prev.filter((x) => x.id !== t.id))}>Cancel</button>
            </div>
          ))}
        </div>
      </section>

      {/* 3 — STRENGTH LAB */}
      <section id="strength" className="section lab-section room-lab">
        <SectionHead index="03 / STRENGTH LAB" tech="PLATES SLIDE ON, STAGGERED — NOT AN INSTANT JUMP · EPLEY ESTIMATE" title="LOAD THE BAR. WATCH IT CHANGE." blurb="Drag the weight and the 3D barbell loads or unloads plates in front of you — heaviest plate closest to the centre, exactly like a real rack. Then check your estimated 1RM from a working set." />
        <div className="lab-layout">
          <div className="lab-controls">
            <label className="mono" htmlFor="weight">BARBELL WEIGHT</label>
            <div className="lab-weight"><AnimatedNumber value={weight} /><span>KG</span></div>
            <input id="weight" type="range" min={20} max={180} step={2.5} value={weight} onChange={(e) => setWeight(Number(e.target.value))} />
            <div className="lab-scale mono"><span>20 KG · BAR ONLY</span><span>180 KG</span></div>
            <div className="lab-field">
              <label className="mono" htmlFor="reps">REPS YOU LIFTED AT THIS WEIGHT</label>
              <input id="reps" type="number" min={1} max={20} value={reps} onChange={(e) => setReps(Math.max(1, Math.min(20, Number(e.target.value) || 1)))} />
            </div>
            <div className="lab-result">
              <span className="mono">ESTIMATED 1RM (EPLEY)</span>
              <strong><AnimatedNumber value={oneRM} /> KG</strong>
              <p>Worked at {weight} kg × {reps} reps. A rough estimate, not a test — ask a coach before maxing out.</p>
            </div>
            <div className="lab-plates">
              <span className="mono">PLATES PER SIDE</span>
              <strong>{loadCode(weight)}</strong>
              <div className="plate-chips">
                {plates.length === 0 && <span className="chip">BAR ONLY — {BAR_KG} KG</span>}
                {plates.map((p, i) => <span key={i} className="chip">{p} KG</span>)}
              </div>
              <p className="mono lab-code">LOAD CODE: FG-{weight}KG — SHOW THIS AT THE RACK</p>
              <div className="rm-chart">
                <span className="mono">EST. 1RM BY REPS AT {weight} KG</span>
                <div className="rm-bars">
                  {[1, 3, 5, 8, 10, 12].map((r) => {
                    const v = estimate1RM(weight, r);
                    const max = estimate1RM(weight, 12);
                    return (
                      <div key={r} className={`rm-bar ${r === reps ? "current" : ""}`}>
                        <span style={{ height: `${Math.round((v / max) * 100)}%` }} />
                        <b>{v}</b><i>{r} REP{r > 1 ? "S" : ""}</i>
                      </div>
                    );
                  })}
                </div>
                <p>Your reps input ({reps}) is highlighted. Change reps and the highlight moves.</p>
              </div>
            </div>
          </div>
          <div className="lab-3d">
            <Rig3D plates={plates} variant="barbell" paused={paused} reducedMotion={reducedMotion} height="480px" />
            <p className="mono lab-caption">BARBELL CLOSE-UP — PLATES UPDATE AS YOU DRAG. MOVE YOUR CURSOR TO INSPECT THE LOAD.</p>
          </div>
        </div>
      </section>

      {/* 4 — MEMBERSHIP COMPARISON TABLE */}
      <section id="membership" className="section room-plans">
        <SectionHead index="04 / MEMBERSHIP" tech="SELECTED COLUMN HIGHLIGHTED · HEADER + TOTAL BAR STICK" title="COMPARE, DON'T GUESS" blurb="Rows are features, columns are tiers. Pick a tier, add what you actually use, and the monthly total updates live. Holding a plan saves it in this browser — demo only." />
        <div className="table-wrap">
          <table className="compare-table">
            <thead>
              <tr>
                <th>FEATURE</th>
                {TIERS.map((t) => (
                  <th key={t.id} className={tier === t.id ? "selected" : ""}>
                    <button onClick={() => setTier(t.id)}>{t.name}</button>
                    <div className="tier-price"><AnimatedNumber value={fmtVND(t.price)} /></div>
                    <div className="tier-note">{t.note}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FEATURES.map((f) => (
                <tr key={f.label}>
                  <td>{f.label}</td>
                  {f.values.map((v, i) => (
                    <td key={i} className={tier === TIERS[i].id ? "selected" : ""}>{v === true ? "✓" : v === false ? "—" : v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="addons-row">
          {ADDONS.map((a) => (
            <label key={a.id} className={addons.includes(a.id) ? "addon on" : "addon"}>
              <input type="checkbox" checked={addons.includes(a.id)} onChange={() => setAddons((prev) => prev.includes(a.id) ? prev.filter((x) => x !== a.id) : [...prev, a.id])} />
              <span>{a.name}</span><b>+{fmtVND(a.price)}/mo</b>
            </label>
          ))}
        </div>
        <div className="total-bar">
          <div>
            <span className="mono">YOUR PLAN — {TIERS.find((t) => t.id === tier)?.name}</span>
            <strong><AnimatedNumber value={fmtVND(monthlyTotal)} /> / MONTH</strong>
          </div>
          <button className="btn-volt" onClick={holdPlan}><Roll text="HOLD THIS PLAN (DEMO)" /></button>
        </div>
        {heldPlan && (
          <p className="held-note">✓ Held in this browser: {TIERS.find((t) => t.id === heldPlan.tier)?.name}
            {heldPlan.addons.length > 0 ? ` + ${heldPlan.addons.map((id) => ADDONS.find((a) => a.id === id)?.name).join(", ")}` : " — no add-ons"}.
            A coach will not contact you from this demo; book a trial below for a real conversation.</p>
        )}
      </section>

      {/* 5 — WEEKLY WORKOUT PLANNER */}
      <section id="planner" className="section planner-section room-week">
        <SectionHead index="05 / WEEK PLANNER" tech="PROGRESS RING + STREAK · DAY DETAIL OPENS AS A SHEET" title="ONE WEEK, ALREADY WRITTEN" blurb="Pick a goal and the whole week fills in. Tap a day to see the session, tick it done, and watch the week fill up. Progress is saved in this browser." />
        <div className="goal-row">
          {GOALS.map((g) => (
            <button key={g.id} className={goal === g.id ? "active" : ""} onClick={() => switchGoal(g.id)}>
              <strong>{g.label}</strong><span>{g.blurb}</span>
            </button>
          ))}
        </div>
        <div className="planner-progress-wrap">
          <svg className="progress-ring" viewBox="0 0 64 64" aria-hidden="true">
            <circle cx="32" cy="32" r="26" />
            <circle cx="32" cy="32" r="26" className="ring-fill" strokeDasharray={ringC} strokeDashoffset={ringC * (1 - weekPct)} />
          </svg>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${weekPct * 100}%` }} />
            <span className="mono">{doneDays.length} / 7 DAYS DONE — {Math.round(weekPct * 100)}%</span>
          </div>
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={goal} className="week-grid" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
            {PLANS[goal].map((d, i) => (
              <button key={i} className={`week-cell ${planDay === i ? "active" : ""} ${doneDays.includes(i) ? "done" : ""}`} onClick={() => { setPlanDay(i); setPlanSheetOpen(true); }}>
                <span className="mono">{DAYS[i]}</span>
                <strong>{d.title}</strong>
                <span>{d.focus} · {d.minutes ? `${d.minutes} min` : "Rest"}</span>
                <span className="week-check">{doneDays.includes(i) ? `✓ DONE${streakFor(i) > 1 ? ` · 🔥 ×${streakFor(i)} STREAK` : ""}` : "○ NOT DONE"}</span>
              </button>
            ))}
          </motion.div>
        </AnimatePresence>
        <AnimatePresence>
          {planSheetOpen && (
            <div className="sheet-backdrop" onClick={() => setPlanSheetOpen(false)}>
              <motion.div key={`${goal}-${planDay}`} className="sheet plan-sheet" onClick={(e) => e.stopPropagation()} initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
                <div className="sheet-head">
                  <span className="mono">{DAY_NAMES[planDay].toUpperCase()} — {PLANS[goal][planDay].focus.toUpperCase()}</span>
                  <button className="sheet-close" onClick={() => setPlanSheetOpen(false)} aria-label="Close day detail">✕</button>
                </div>
                <h3>{PLANS[goal][planDay].title}</h3>
                <ul>{PLANS[goal][planDay].exercises.map((ex) => <li key={ex}>{ex}</li>)}</ul>
                <button className={doneDays.includes(planDay) ? "btn-cancel" : "btn-volt"} onClick={() => toggleDone(planDay)}>
                  <Roll text={doneDays.includes(planDay) ? "UNDO — NOT DONE" : "MARK DONE ✓"} />
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </section>

      {/* 6 — TRAINER ROSTER + TRIAL BOOKING */}
      <section id="trainers" className="section room-coaches">
        <SectionHead index="06 / COACHES" tech="SPECIALTY TAGS + STATS · TRIAL OPENS AS A SHEET" title="MEET THE FLOOR" blurb="Scroll the roster sideways. Every coach runs real classes on the board above — pick one for your free trial and the sheet fills in with that coach." />
        <div className="roster">
          {TRAINERS.map((t, i) => (
            <motion.article key={t.id} className="trainer" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
              <div className="trainer-avatar mono">{t.name.split(" ").map((w) => w[0]).join("")}</div>
              <strong>{t.name}</strong>
              <span className="mono">{t.role}</span>
              <div className="trainer-tags">
                {t.specialty.split(" / ").map((tag) => <span key={tag} className="tag mono">{tag}</span>)}
              </div>
              <p className="trainer-classes">{t.classes}</p>
              <p className="mono trainer-stats">★ {t.rating.toFixed(1)} RATING · {t.classes.split(" · ").length} CLASSES ON THE BOARD · {t.role.toUpperCase()}</p>
              <div className="trainer-foot"><span className="mono">★ {t.rating.toFixed(1)}</span><button onClick={() => { setTrialCoach(t.name); setTrialSheetOpen(true); }}><Roll text={`TRIAL WITH ${t.name.split(" ")[0].toUpperCase()} →`} /></button></div>
            </motion.article>
          ))}
        </div>

        <div className="trial-cta">
          <div>
            <h3>FREE TRIAL — DEMO ONLY</h3>
            <p>Pick a coach above, or open the trial sheet here. The form saves only in your browser — no real booking is created and nobody will call you from it.</p>
          </div>
          <button className="btn-volt" onClick={() => setTrialSheetOpen(true)}><Roll text="OPEN TRIAL SHEET →" /></button>
        </div>
        <AnimatePresence>
          {trialSheetOpen && (
            <div className="sheet-backdrop" onClick={() => setTrialSheetOpen(false)}>
              <motion.form className="sheet trial-sheet" onSubmit={submitTrial} onClick={(e) => e.stopPropagation()} initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
                <div className="sheet-head">
                  <h3>FREE TRIAL — DEMO ONLY</h3>
                  <button type="button" className="sheet-close" onClick={() => setTrialSheetOpen(false)} aria-label="Close trial form">✕</button>
                </div>
                <p>This form saves only in your browser. No real booking is created and nobody will call you from it.</p>
                <div className="trial-grid">
                  <label>YOUR NAME<input required value={trialName} onChange={(e) => setTrialName(e.target.value)} placeholder="e.g. Nguyen Van A" /></label>
                  <label>PHONE<input required value={trialPhone} onChange={(e) => setTrialPhone(e.target.value)} placeholder="09xx xxx xxx" /></label>
                  <label>DATE<input required type="date" value={trialDate} onChange={(e) => setTrialDate(e.target.value)} /></label>
                  <label>TIME
                    <select value={trialTime} onChange={(e) => setTrialTime(e.target.value)}>
                      <option>06:00</option><option>07:00</option><option>12:00</option><option>18:00</option><option>19:30</option>
                    </select>
                  </label>
                  <label>COACH
                    <select value={trialCoach} onChange={(e) => setTrialCoach(e.target.value)}>
                      {TRAINERS.map((t) => <option key={t.id}>{t.name}</option>)}
                    </select>
                  </label>
                  <button className="btn-volt" type="submit"><Roll text="SAVE TRIAL (DEMO)" /></button>
                </div>
                {trialSaved && <p className="held-note">✓ Trial saved in this browser — it now appears in My Bookings under The Board.</p>}
              </motion.form>
            </div>
          )}
        </AnimatePresence>
      </section>

      <footer className="footer">
        <div><strong>FORGE</strong><span className="mono">BOUTIQUE GYM — ĐÀ NẴNG</span></div>
        <p className="mono">FORGE v3.1 — 2026-10-27 · CONCEPT SITE · ALL BOOKINGS ARE DEMOS SAVED IN YOUR BROWSER ONLY</p>
      </footer>
    </div>
  );
}
