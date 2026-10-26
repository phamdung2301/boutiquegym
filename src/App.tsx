import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import Hero3D from "./components/Hero3D";
import { classes, schedule, coaches, memberships, testimonials, money, typeLabel, type ClassType } from "./data";

type Filter = "all" | ClassType;

export default function App() {
  const [filter, setFilter] = useState<Filter>("all");
  const [calcPlan, setCalcPlan] = useState("pro");
  const [calcMonths, setCalcMonths] = useState(3);
  const [paused, setPaused] = useState(false);
  const [trialResult, setTrialResult] = useState("");
  const [name, setName] = useState("");
  const [trialClass, setTrialClass] = useState("hiit");
  const [trialDate, setTrialDate] = useState("");

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 25 });

  useEffect(() => {
    document.body.classList.toggle("motion-paused", paused);
  }, [paused]);

  const shown = useMemo(() => classes.filter((c) => filter === "all" || c.type === filter), [filter]);

  const plan = memberships.find((m) => m.id === calcPlan) ?? memberships[0];
  const discount = calcMonths >= 6 ? 0.1 : calcMonths >= 3 ? 0.05 : 0;
  const total = Math.round(plan.price * calcMonths * (1 - discount));

  function submitTrial(e: React.FormEvent) {
    e.preventDefault();
    if (trialDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (new Date(trialDate + "T00:00:00") < today) {
        setTrialResult("Ngày đã qua — vui lòng chọn ngày từ hôm nay trở đi (demo).");
        return;
      }
    }
    try {
      localStorage.setItem("forge-demo-trial", JSON.stringify({ name, cls: trialClass, date: trialDate }));
    } catch {
      /* demo storage may be unavailable */
    }
    setTrialResult(`Đã lưu demo: ${name} — ${trialDate}. Đây chưa phải đăng ký thật.`);
  }

  return (
    <>
      <header className="topbar">
        <a className="logo" href="#top">FORGE<span>.</span></a>
        <nav aria-label="Chính">
          <a href="#classes">Lớp tập</a>
          <a href="#schedule">Lịch</a>
          <a href="#coaches">Huấn luyện viên</a>
          <a href="#membership">Gói tập</a>
          <a href="#trial">Trải nghiệm</a>
        </nav>
        <a className="btn btn-volt" href="#trial">Tập thử demo</a>
      </header>
      <div className="progress" aria-hidden="true">
        <motion.div style={{ scaleX: progress, transformOrigin: "0 0", width: "100%", height: "100%", background: "#d6ff3f" }} />
      </div>

      <main>
        <section id="top">
          <div className="hero-grid">
            <div>
              <p className="eyebrow">BOUTIQUE GYM — ĐÀ NẴNG · SMALL CLASS · BIG RESULT</p>
              <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                TẬP ÍT NGƯỜI. <em>KẾT QUẢ RÕ RÀNG.</em>
              </motion.h1>
              <motion.p className="lede" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }}>
                Lớp tối đa 12 người, huấn luyện viên sửa form từng người, lịch tập rõ ràng theo tuần. Kéo chuột qua cảnh 3D để xoay khối kim loại volt.
              </motion.p>
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "1.25rem" }}>
                <a className="btn btn-volt" href="#classes">Xem lớp tập</a>
                <a className="btn" href="#membership">Tính gói tập</a>
              </div>
              <p className="demo-note">Concept demo — lớp, lịch và giá là dữ liệu minh họa, chưa phải đăng ký thật. FORGE v2.0.</p>
            </div>
            <Hero3D paused={paused} />
          </div>
        </section>

        <div className="marquee" aria-hidden="true">
          <span>HIIT • STRENGTH • PILATES • BOXING • SMALL CLASS •&nbsp;</span>
          <span>HIIT • STRENGTH • PILATES • BOXING • SMALL CLASS •&nbsp;</span>
        </div>

        <section id="classes">
          <p className="eyebrow">01 / LỚP TẬP</p>
          <h2>Chọn lớp theo mục tiêu</h2>
          <div className="filters" role="group" aria-label="Lọc lớp tập">
            <button className={filter === "all" ? "chip active" : "chip"} onClick={() => setFilter("all")}>Tất cả</button>
            <button className={filter === "strength" ? "chip active" : "chip"} onClick={() => setFilter("strength")}>Sức mạnh</button>
            <button className={filter === "cardio" ? "chip active" : "chip"} onClick={() => setFilter("cardio")}>Cardio</button>
            <button className={filter === "mobility" ? "chip active" : "chip"} onClick={() => setFilter("mobility")}>Dẻo dai</button>
          </div>
          <p role="status">Đang hiển thị {shown.length} / {classes.length} lớp.</p>
          <motion.div layout className="grid">
            <AnimatePresence mode="popLayout">
              {shown.map((c) => (
                <motion.article key={c.id} layout initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} whileHover={{ y: -4 }} className="card">
                  <h3>{c.name}</h3>
                  <p>{c.desc}</p>
                  <p>Cường độ: {c.intensity} · {typeLabel(c.type)}</p>
                  <p className="price">{money(c.price)} / buổi</p>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        </section>

        <section id="schedule">
          <p className="eyebrow">02 / LỊCH TUẦN</p>
          <h2>Lịch cố định, dễ duy trì</h2>
          {schedule.map((d) => (
            <p key={d.day}><strong>{d.day}:</strong> {d.items}</p>
          ))}
        </section>

        <section id="coaches">
          <p className="eyebrow">03 / HUẤN LUYỆN VIÊN</p>
          <h2>Người sửa form cho bạn</h2>
          <div className="grid">
            {coaches.map((c, i) => (
              <motion.article key={c.name} className="card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <h3>{c.name}</h3>
                <p><strong>{c.role}</strong></p>
                <p>{c.note}</p>
              </motion.article>
            ))}
          </div>
        </section>

        <section id="membership">
          <p className="eyebrow">04 / GÓI TẬP</p>
          <h2>Tính gói tập</h2>
          <form onSubmit={(e) => e.preventDefault()}>
            <label>
              Gói
              <select value={calcPlan} onChange={(e) => setCalcPlan(e.target.value)}>
                {memberships.map((m) => (
                  <option key={m.id} value={m.id}>{m.name} — {money(m.price)}/tháng</option>
                ))}
              </select>
            </label>
            <label>
              Số tháng
              <select value={calcMonths} onChange={(e) => setCalcMonths(parseInt(e.target.value, 10))}>
                <option value={1}>1 tháng — không giảm</option>
                <option value={3}>3 tháng — giảm 5%</option>
                <option value={6}>6 tháng — giảm 10%</option>
              </select>
            </label>
            <motion.p className="price" key={total} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              {plan.name} × {calcMonths} tháng: {money(total)} {discount ? `(đã giảm ${Math.round(discount * 100)}%)` : ""}
            </motion.p>
            <p className="demo-note">Giá tham khảo cho concept demo.</p>
          </form>
        </section>

        <section id="testimonials">
          <p className="eyebrow">05 / HỌC VIÊN</p>
          <h2>Học viên nói gì</h2>
          <div className="grid">
            {testimonials.map((t) => (
              <motion.article key={t.name} className="card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <p>“{t.text}”</p>
                <p><strong>{t.name}</strong></p>
              </motion.article>
            ))}
          </div>
        </section>

        <section id="trial">
          <p className="eyebrow">06 / TRẢI NGHIỆM</p>
          <h2>Đăng ký tập thử (demo)</h2>
          <form onSubmit={submitTrial}>
            <label>
              Họ tên
              <input value={name} onChange={(e) => setName(e.target.value)} required />
            </label>
            <label>
              Lớp muốn thử
              <select value={trialClass} onChange={(e) => setTrialClass(e.target.value)}>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </label>
            <label>
              Ngày
              <input type="date" value={trialDate} onChange={(e) => setTrialDate(e.target.value)} required />
            </label>
            <button className="btn btn-volt" type="submit">Lưu demo vào trình duyệt</button>
            <p className="demo-note">Demo: chỉ lưu ở trình duyệt của bạn, không gửi đi đâu và không giữ chỗ thật.</p>
            <p role="status">{trialResult}</p>
          </form>
        </section>

        <section id="faq">
          <p className="eyebrow">07 / FAQ</p>
          <h2>Câu hỏi thường gặp</h2>
          <details open>
            <summary>Chưa tập bao giờ có theo được không?</summary>
            <p>Được. Lớp chia theo cấp độ, huấn luyện viên điều chỉnh bài theo thể lực từng người.</p>
          </details>
          <details>
            <summary>Có cần mang giày riêng không?</summary>
            <p>Nên mang giày tập trong nhà, sạch và bám sàn tốt.</p>
          </details>
        </section>
      </main>

      <footer>
        <p>FORGE — Concept demo · FORGE v2.0 — 2026-10-26 · Lớp, lịch và giá là dữ liệu minh họa.</p>
      </footer>

      <button className="pause-btn" onClick={() => setPaused((p) => !p)} aria-pressed={paused}>
        {paused ? "▶ Tiếp tục chuyển động" : "⏸ Tạm dừng chuyển động"}
      </button>
    </>
  );
}
