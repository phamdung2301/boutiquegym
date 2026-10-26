import { useState } from "react";
import { motion } from "framer-motion";
import Hero3D from "./components/Hero3D";

export default function App() {
  const [paused, setPaused] = useState(false);
  return (
    <>
      <header className="topbar">
        <a className="logo" href="#top">FORGE<span>.</span></a>
        <nav aria-label="Chính"><a href="#classes">Lớp tập</a><a href="#trial">Trải nghiệm</a></nav>
        <a className="btn btn-volt" href="#trial">Tập thử demo</a>
      </header>
      <main>
        <section id="top">
          <div className="hero-grid">
            <div>
              <p className="eyebrow">BOUTIQUE GYM — ĐÀ NẴNG · SMALL CLASS · BIG RESULT</p>
              <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                TẬP ÍT NGƯỜI. <em>KẾT QUẢ RÕ RÀNG.</em>
              </motion.h1>
              <p className="lede">Lớp tối đa 12 người, huấn luyện viên sửa form từng người. Kéo chuột qua cảnh 3D để xoay khối kim loại volt.</p>
              <p className="demo-note">Concept demo — FORGE v2.0.</p>
            </div>
            <Hero3D paused={paused} />
          </div>
        </section>
        <div className="marquee" aria-hidden="true"><span>HIIT • STRENGTH • PILATES • BOXING •&nbsp;</span><span>HIIT • STRENGTH • PILATES • BOXING •&nbsp;</span></div>
      </main>
      <footer><p>FORGE — Concept demo · FORGE v2.0 — 2026-10-26</p></footer>
      <button className="pause-btn" onClick={() => setPaused((p) => !p)}>{paused ? "▶ Tiếp tục chuyển động" : "⏸ Tạm dừng chuyển động"}</button>
    </>
  );
}
