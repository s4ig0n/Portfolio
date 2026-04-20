import { useState, useEffect, useRef } from "react";

const NAV_LINKS = ["about", "skills", "research", "projects", "contact"];

const SKILLS = [
  { name: "C/C++", level: 85 },
  { name: "Python", level: 80 },
  { name: "Java", level: 70 },
  { name: "SQL/MySQL", level: 75 },
  { name: "HTML/CSS", level: 72 },
  { name: "Arduino", level: 65 },
  { name: "Raspberry Pi", level: 62 },
];

const EXPERIENCES = [
  {
    title: "Undergraduate Researcher",
    org: "Dept. of Mathematical Sciences, UWM",
    period: "May 2025 – Jul 2025",
    tags: ["Graph Theory", "Math Research"],
    desc: "Researched Truncated Square Graphs with a focus on Total Restricted Broadcast Domination. Analyzed single-vertex broadcasting, eccentricity, and graph connectivity relationships.",
    icon: "⬡",
  },
  {
    title: "Hardware Volunteer",
    org: "Discovery World, Milwaukee",
    period: "Jul 2024 – Sep 2024",
    tags: ["C++", "Python", "Arduino", "Raspberry Pi"],
    desc: "Redesigned the Wimshurst machine using Arduino + relays (C++). Rebuilt the Elements Display from scratch using Raspberry Pi (Python).",
    icon: "⚡",
  },
  {
    title: "SURF Recipient – Solar Sculpture",
    org: "College of Engineering & Applied Sciences, UWM",
    period: "Sep 2023 – Aug 2024",
    tags: ["PIC24", "MPLabs", "Embedded Systems"],
    desc: "Contributed to a Solar Sculpture that harvests sunlight by day and drives visual light performances at night using PIC24 microcontrollers.",
    icon: "☀",
  },
  {
    title: "ATL Tinkering Lab Member",
    org: "High School",
    period: "Earlier",
    tags: ["Robotics", "Arduino", "C++"],
    desc: "Built Arduino-controlled Lego robots. Developed a motor-based driver alertness system detecting drowsiness and impairment.",
    icon: "🤖",
  },
];

/* ── Tokens ──────────────────────────────────────────────────── */
const M = {
  bright:      "#00ff41",
  mid:         "#00c832",
  dim:         "#00852b",
  dark:        "#003b18",
  xdark:       "#00160a",
  bg:          "#020f02",
  glassBg:     "rgba(0,18,4,0.45)",
  glassBgHov:  "rgba(0,28,8,0.65)",
  glassBdr:    "rgba(0,255,65,0.22)",
  glassBdrHov: "rgba(0,255,65,0.55)",
  textSec:     "rgba(0,255,65,0.55)",
  textMut:     "rgba(0,255,65,0.28)",
};

/* ── Intersection observer hook ──────────────────────────────── */
function useIntersection(ref, threshold = 0.15) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return visible;
}

/* ── FadeIn ──────────────────────────────────────────────────── */
function FadeIn({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const visible = useIntersection(ref);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/* ── SkillBar ─────────────────────────────────────────────────── */
function SkillBar({ name, level, delay }) {
  const ref = useRef(null);
  const visible = useIntersection(ref);
  return (
    <div ref={ref} style={{ marginBottom: "18px" }}>
      <div style={{
        display: "flex", justifyContent: "space-between",
        marginBottom: "6px", fontFamily: "'Space Mono', monospace",
        fontSize: "12px",
      }}>
        <span style={{ color: M.bright }}>{name}</span>
        <span style={{ color: M.mid }}>{level}%</span>
      </div>
      <div style={{
        background: "rgba(0,255,65,0.06)", borderRadius: "3px",
        height: "5px", overflow: "hidden",
        border: `1px solid ${M.glassBdr}`,
      }}>
        <div style={{
          height: "100%",
          width: visible ? `${level}%` : "0%",
          background: `linear-gradient(90deg, ${M.dim}, ${M.bright})`,
          borderRadius: "3px",
          transition: `width 1.2s cubic-bezier(.4,0,.2,1) ${delay}s`,
          boxShadow: `0 0 10px ${M.bright}55`,
        }} />
      </div>
    </div>
  );
}

/* ── Glass Card ──────────────────────────────────────────────── */
function Card({ children, style = {}, featured = false }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        background: hovered ? M.glassBgHov : M.glassBg,
        backdropFilter: "blur(16px) saturate(160%)",
        WebkitBackdropFilter: "blur(16px) saturate(160%)",
        border: `1px solid ${hovered ? M.glassBdrHov : M.glassBdr}`,
        borderRadius: "16px",
        padding: "28px",
        transition: "all 0.3s ease",
        transform: hovered ? "translateY(-4px)" : "none",
        boxShadow: hovered
          ? `0 8px 40px rgba(0,255,65,0.18), 0 2px 12px rgba(0,0,0,0.6), inset 0 1px 0 rgba(0,255,65,0.15)`
          : `0 4px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(0,255,65,0.08)`,
        overflow: "hidden",
        ...style,
      }}
    >
      {/* top-edge glass sheen */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "1px",
        background: `linear-gradient(90deg, transparent, rgba(0,255,65,0.35), transparent)`,
        pointerEvents: "none",
      }} />
      {/* inner light reflection */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        background: "linear-gradient(160deg, rgba(0,255,65,0.05) 0%, transparent 50%)",
        pointerEvents: "none", borderRadius: "inherit",
      }} />
      {children}
    </div>
  );
}

/* ── Main Component ──────────────────────────────────────────── */
export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("about");
  const [cursorPos, setCursorPos] = useState({ x: -200, y: -200 });
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onMove = (e) => setCursorPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setActiveSection(id);
  };

  return (
    <div style={{
      background: M.bg, minHeight: "100vh",
      color: M.bright, fontFamily: "'DM Sans', sans-serif",
      overflowX: "hidden",
    }}>

      {/* ── Global styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: rgba(0,255,65,0.18); color: #00ff41; }
        html { scroll-behavior: smooth; }
        a { color: inherit; text-decoration: none; }

        @keyframes float {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-14px); }
        }
        @keyframes pulse-glow {
          0%,100% { box-shadow: 0 0 0 0 rgba(0,255,65,0.45); }
          50%      { box-shadow: 0 0 0 8px rgba(0,255,65,0); }
        }
        @keyframes blink {
          0%,100% { opacity: 1; }
          50%      { opacity: 0; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes matrix-rain {
          0%   { background-position: 0 0; }
          100% { background-position: 0 100vh; }
        }
        @keyframes scan {
          0%   { top: -2px; }
          100% { top: 100%; }
        }

        .tag {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 999px;
          font-size: 11px;
          font-family: 'Space Mono', monospace;
          background: rgba(0,255,65,0.07);
          border: 1px solid rgba(0,255,65,0.22);
          color: #00c832;
          margin: 3px;
          transition: background 0.2s, border-color 0.2s;
        }
        .tag:hover {
          background: rgba(0,255,65,0.14);
          border-color: rgba(0,255,65,0.5);
        }
        .nav-link {
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          color: rgba(0,255,65,0.45);
        }
        .nav-link:hover, .nav-link.active {
          color: #00ff41;
          background: rgba(0,255,65,0.08);
          text-shadow: 0 0 12px rgba(0,255,65,0.5);
        }
        .section { max-width: 900px; margin: 0 auto; padding: 80px 24px; }
        .section-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(32px, 5vw, 52px);
          font-weight: 800;
          letter-spacing: -1px;
          margin-bottom: 8px;
          color: #00ff41;
        }
        .grid-2 {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 20px;
        }
        .dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #00ff41;
          animation: pulse-glow 2s infinite;
          display: inline-block;
          margin-right: 8px;
          box-shadow: 0 0 8px #00ff41;
        }

        /* Scrollbar */
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #020f02; }
        ::-webkit-scrollbar-thumb { background: #003b18; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #00852b; }
      `}</style>

      {/* ── Cursor glow ── */}
      <div style={{
        position: "fixed",
        left: cursorPos.x - 200, top: cursorPos.y - 200,
        width: 400, height: 400,
        background: "radial-gradient(circle, rgba(0,255,65,0.07) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0,
        transition: "left 0.08s, top 0.08s",
      }} />

      {/* ── Background grid (matrix green) ── */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        backgroundImage: `linear-gradient(rgba(0,255,65,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,65,0.04) 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }} />

      {/* ── Scanline overlay ── */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)",
      }} />

      {/* ── NAV ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "rgba(2,15,2,0.82)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? `1px solid rgba(0,255,65,0.12)` : "none",
        transition: "all 0.3s ease",
        padding: "16px 32px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <span style={{
          fontFamily: "'Space Mono', monospace", fontSize: "14px",
          color: M.bright, fontWeight: 700,
          textShadow: "0 0 16px rgba(0,255,65,0.6)",
        }}>
          GN<span style={{ animation: "blink 1.2s infinite", display: "inline-block" }}>_</span>
        </span>
        <div style={{ display: "flex", gap: "4px" }}>
          {NAV_LINKS.map(l => (
            <span key={l} className={`nav-link ${activeSection === l ? "active" : ""}`} onClick={() => scrollTo(l)}>{l}</span>
          ))}
        </div>
      </nav>

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section id="about" style={{
        minHeight: "100vh", display: "flex", alignItems: "center",
        justifyContent: "center", position: "relative", zIndex: 1, padding: "0 24px",
      }}>
        <div style={{ textAlign: "center", maxWidth: 750 }}>

          {/* Floating orbs */}
          <div style={{
            position: "absolute", top: "22%", left: "8%", width: 200, height: 200,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,255,65,0.12), transparent)",
            animation: "float 7s ease-in-out infinite", filter: "blur(45px)", pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", bottom: "20%", right: "6%", width: 250, height: 250,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,180,40,0.09), transparent)",
            animation: "float 9s ease-in-out infinite 2.5s", filter: "blur(55px)", pointerEvents: "none",
          }} />

          <div style={{
            opacity: 0.75, fontFamily: "'Space Mono', monospace",
            fontSize: "11px", letterSpacing: "3px", color: M.bright,
            marginBottom: "20px", textTransform: "uppercase",
          }}>
            <span className="dot" />Junior @ UWM · CS with Honors
          </div>

          <h1 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(48px, 10vw, 90px)",
            fontWeight: 800, lineHeight: 1.0, letterSpacing: "-3px",
            background: `linear-gradient(135deg, #ffffff 20%, ${M.bright} 60%, ${M.mid} 100%)`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            marginBottom: "24px",
            filter: "drop-shadow(0 0 30px rgba(0,255,65,0.25))",
          }}>
            Gourilakshmi<br />Neerajkumar
          </h1>

          <p style={{
            fontSize: "17px", color: "rgba(0,255,65,0.6)",
            maxWidth: 520, margin: "0 auto 40px", lineHeight: 1.7, fontWeight: 300,
          }}>
            CS student building at the intersection of hardware, math research, and software.
            I make things work — from graph theory to Arduino to embedded systems.
          </p>

          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            {/* Primary CTA — glass + green accent */}
            <button
              onClick={() => scrollTo("projects")}
              style={{
                padding: "14px 32px", borderRadius: "12px",
                background: "rgba(0,255,65,0.12)",
                backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
                border: `1px solid ${M.mid}`,
                color: M.bright, fontWeight: 700, fontSize: "14px",
                fontFamily: "'Space Mono', monospace", letterSpacing: "0.5px",
                cursor: "pointer", transition: "all 0.25s",
                boxShadow: "0 0 24px rgba(0,255,65,0.15), inset 0 1px 0 rgba(0,255,65,0.2)",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(0,255,65,0.22)";
                e.currentTarget.style.boxShadow = "0 0 40px rgba(0,255,65,0.35), inset 0 1px 0 rgba(0,255,65,0.3)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "rgba(0,255,65,0.12)";
                e.currentTarget.style.boxShadow = "0 0 24px rgba(0,255,65,0.15), inset 0 1px 0 rgba(0,255,65,0.2)";
              }}
            >
              View Work →
            </button>

            {/* Secondary CTA */}
            <a href="mailto:neerajk2@uwm.edu" style={{
              padding: "14px 32px", borderRadius: "12px",
              background: M.glassBg,
              backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
              border: `1px solid ${M.glassBdr}`,
              color: M.mid, fontWeight: 600, fontSize: "14px",
              fontFamily: "'Space Mono', monospace",
              transition: "all 0.25s",
              boxShadow: "inset 0 1px 0 rgba(0,255,65,0.08)",
            }}
              onMouseEnter={e => {
                e.currentTarget.style.background = M.glassBgHov;
                e.currentTarget.style.borderColor = M.glassBdrHov;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = M.glassBg;
                e.currentTarget.style.borderColor = M.glassBdr;
              }}
            >
              Contact
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SKILLS
      ══════════════════════════════════════════ */}
      <section id="skills" style={{ position: "relative", zIndex: 1 }}>
        <div className="section">
          <FadeIn>
            <div style={{ marginBottom: "48px" }}>
              <p style={{ fontFamily: "'Space Mono', monospace", color: M.dim, fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "8px" }}>02 / skills</p>
              <h2 className="section-title">Tech Stack</h2>
              <div style={{ width: "48px", height: "2px", background: `linear-gradient(90deg, ${M.bright}, transparent)`, marginTop: "12px" }} />
            </div>
          </FadeIn>

          <div className="grid-2">
            <FadeIn delay={0.1}>
              <Card>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "17px", marginBottom: "28px", color: M.bright }}>Proficiency</h3>
                {SKILLS.map((s, i) => <SkillBar key={s.name} {...s} delay={i * 0.08} />)}
              </Card>
            </FadeIn>

            <FadeIn delay={0.2}>
              <Card style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
                {[
                  { label: "Hardware & Embedded", items: ["Arduino Uno", "Raspberry Pi", "PIC24 Microcontroller", "MPLabs IDE"] },
                  { label: "Domains", items: ["Graph Theory", "Embedded Systems", "Robotics", "Math Research", "Software Dev"] },
                  { label: "Tools", items: ["Git", "Linux", "MS Office", "Callermax"] },
                ].map(({ label, items }) => (
                  <div key={label}>
                    <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "16px", marginBottom: "12px", color: M.bright }}>{label}</h3>
                    {items.map(t => <span key={t} className="tag">{t}</span>)}
                  </div>
                ))}
              </Card>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          RESEARCH / EXPERIENCE
      ══════════════════════════════════════════ */}
      <section id="research" style={{ position: "relative", zIndex: 1 }}>
        <div className="section">
          <FadeIn>
            <div style={{ marginBottom: "48px" }}>
              <p style={{ fontFamily: "'Space Mono', monospace", color: M.dim, fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "8px" }}>03 / research</p>
              <h2 className="section-title">Experience &<br />Research</h2>
              <div style={{ width: "48px", height: "2px", background: `linear-gradient(90deg, ${M.bright}, transparent)`, marginTop: "12px" }} />
            </div>
          </FadeIn>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {EXPERIENCES.map((exp, i) => (
              <FadeIn key={exp.title} delay={i * 0.1}>
                <Card style={{ display: "flex", gap: "20px" }}>
                  {/* Icon box — glass */}
                  <div style={{
                    width: 52, height: 52, borderRadius: "12px", flexShrink: 0,
                    background: "rgba(0,255,65,0.07)",
                    backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
                    border: `1px solid rgba(0,255,65,0.2)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "22px",
                    boxShadow: "inset 0 1px 0 rgba(0,255,65,0.15)",
                  }}>
                    {exp.icon}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", marginBottom: "4px" }}>
                      <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "16px", fontWeight: 700, color: M.bright }}>{exp.title}</h3>
                      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", color: M.dim, whiteSpace: "nowrap" }}>{exp.period}</span>
                    </div>
                    <p style={{ fontSize: "12px", color: M.textMut, marginBottom: "10px", fontFamily: "'Space Mono', monospace" }}>{exp.org}</p>
                    <p style={{ fontSize: "14px", color: "rgba(0,255,65,0.5)", lineHeight: 1.65, marginBottom: "12px" }}>{exp.desc}</p>
                    <div>{exp.tags.map(t => <span key={t} className="tag">{t}</span>)}</div>
                  </div>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          PROJECTS / AWARDS
      ══════════════════════════════════════════ */}
      <section id="projects" style={{ position: "relative", zIndex: 1 }}>
        <div className="section">
          <FadeIn>
            <div style={{ marginBottom: "48px" }}>
              <p style={{ fontFamily: "'Space Mono', monospace", color: M.dim, fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "8px" }}>04 / projects</p>
              <h2 className="section-title">Awards &<br />Projects</h2>
              <div style={{ width: "48px", height: "2px", background: `linear-gradient(90deg, ${M.bright}, transparent)`, marginTop: "12px" }} />
            </div>
          </FadeIn>

          {/* ISRO Feature Card */}
          <FadeIn delay={0.1}>
            <div style={{
              position: "relative", borderRadius: "20px", padding: "40px",
              background: "rgba(0,20,5,0.55)",
              backdropFilter: "blur(20px) saturate(160%)",
              WebkitBackdropFilter: "blur(20px) saturate(160%)",
              border: `1px solid rgba(0,255,65,0.28)`,
              marginBottom: "20px", overflow: "hidden",
              boxShadow: "0 8px 48px rgba(0,0,0,0.6), inset 0 1px 0 rgba(0,255,65,0.18)",
            }}>
              {/* Top sheen */}
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: "1px",
                background: "linear-gradient(90deg, transparent, rgba(0,255,65,0.5), transparent)",
                pointerEvents: "none",
              }} />
              {/* Inner gradient */}
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
                background: "linear-gradient(135deg, rgba(0,255,65,0.07) 0%, transparent 55%)",
                pointerEvents: "none",
              }} />

              {/* Decorative spinning rings */}
              <div style={{
                position: "absolute", right: -60, top: -60, width: 220, height: 220,
                borderRadius: "50%", border: "1px solid rgba(0,255,65,0.12)",
                animation: "spin-slow 20s linear infinite",
              }} />
              <div style={{
                position: "absolute", right: -28, top: -28, width: 130, height: 130,
                borderRadius: "50%", border: "1px solid rgba(0,255,65,0.08)",
              }} />

              <div style={{
                fontFamily: "'Space Mono', monospace", fontSize: "11px",
                color: M.mid, letterSpacing: "2px", marginBottom: "16px",
              }}>🏆 ISRO · 2021 · NATIONAL</div>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "26px", fontWeight: 800, marginBottom: "12px", color: M.bright }}>Space Habitat Award</h3>
              <p style={{ color: "rgba(0,255,65,0.5)", lineHeight: 1.7, maxWidth: "600px", marginBottom: "16px" }}>
                Designed a secondary habitat for humans on Gliese 667 cc — selected as the most Earth-like planet. Placed{" "}
                <strong style={{ color: M.bright }}>3rd out of 240+ national teams</strong>.
              </p>
              <span className="tag">Astrophysics Research</span>
              <span className="tag">Report Writing</span>
              <span className="tag">Team Collaboration</span>
            </div>
          </FadeIn>

          <div className="grid-2">
            {[
              {
                icon: "🤖", delay: 0.15,
                title: "Driver Alertness Monitor",
                desc: "Built a motor-based heart rate and eye-state detector that detects drowsiness or intoxication and takes precautionary action — with Arduino and Lego robotics.",
                tags: ["Arduino", "C++", "Robotics"],
              },
              {
                icon: "☀️", delay: 0.2,
                title: "Solar Light Sculpture",
                desc: "Engineered a solar-powered sculpture that stores energy during the day and drives interactive light performances at night using PIC24 and MPLabs.",
                tags: ["PIC24", "MPLabs", "Embedded"],
              },
              {
                icon: "⚗️", delay: 0.25,
                title: "Wimshurst Machine Redesign",
                desc: "Modernized a classic electrostatic generator at Discovery World using Arduino and relay-based control, programmed in C++.",
                tags: ["Arduino", "C++", "Hardware"],
              },
              {
                icon: "🫐", delay: 0.3,
                title: "Elements Display (Raspberry Pi)",
                desc: "Rebuilt the periodic elements interactive display from scratch at Discovery World using a Raspberry Pi, programmed in Python.",
                tags: ["Raspberry Pi", "Python", "Linux"],
              },
            ].map(({ icon, delay, title, desc, tags }) => (
              <FadeIn key={title} delay={delay}>
                <Card style={{ height: "100%" }}>
                  <div style={{ fontSize: "26px", marginBottom: "14px" }}>{icon}</div>
                  <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "16px", marginBottom: "10px", color: M.bright }}>{title}</h3>
                  <p style={{ fontSize: "14px", color: "rgba(0,255,65,0.48)", lineHeight: 1.65 }}>{desc}</p>
                  <div style={{ marginTop: "16px" }}>{tags.map(t => <span key={t} className="tag">{t}</span>)}</div>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CONTACT
      ══════════════════════════════════════════ */}
      <section id="contact" style={{ position: "relative", zIndex: 1 }}>
        <div className="section" style={{ textAlign: "center" }}>
          <FadeIn>
            <p style={{ fontFamily: "'Space Mono', monospace", color: M.dim, fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "16px" }}>05 / contact</p>
            <h2 className="section-title" style={{ marginBottom: "16px" }}>Let's Connect</h2>
            <p style={{ color: M.textSec, marginBottom: "40px", fontSize: "15px" }}>
              Open to internships, research, and cool projects.
            </p>

            <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
              <a href="mailto:neerajk2@uwm.edu" style={{
                padding: "14px 32px", borderRadius: "12px",
                background: "rgba(0,255,65,0.12)",
                backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
                border: `1px solid ${M.mid}`,
                color: M.bright, fontWeight: 700, fontSize: "14px",
                fontFamily: "'Space Mono', monospace",
                boxShadow: "0 0 24px rgba(0,255,65,0.15), inset 0 1px 0 rgba(0,255,65,0.2)",
                transition: "all 0.25s",
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "rgba(0,255,65,0.22)";
                  e.currentTarget.style.boxShadow = "0 0 40px rgba(0,255,65,0.3), inset 0 1px 0 rgba(0,255,65,0.3)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "rgba(0,255,65,0.12)";
                  e.currentTarget.style.boxShadow = "0 0 24px rgba(0,255,65,0.15), inset 0 1px 0 rgba(0,255,65,0.2)";
                }}
              >
                neerajk2@uwm.edu
              </a>

              <a href="https://www.linkedin.com/in/gourilakshmineerajkumar" target="_blank" rel="noopener noreferrer" style={{
                padding: "14px 32px", borderRadius: "12px",
                background: M.glassBg,
                backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
                border: `1px solid ${M.glassBdr}`,
                color: M.mid, fontWeight: 600, fontSize: "14px",
                fontFamily: "'Space Mono', monospace",
                transition: "all 0.25s",
                boxShadow: "inset 0 1px 0 rgba(0,255,65,0.08)",
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = M.glassBgHov;
                  e.currentTarget.style.borderColor = M.glassBdrHov;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = M.glassBg;
                  e.currentTarget.style.borderColor = M.glassBdr;
                }}
              >
                LinkedIn ↗
              </a>
            </div>
          </FadeIn>
        </div>

        <div style={{
          borderTop: "1px solid rgba(0,255,65,0.08)", textAlign: "center",
          padding: "24px", fontFamily: "'Space Mono', monospace",
          fontSize: "11px", color: M.textMut,
        }}>
          © 2025 Gourilakshmi Neerajkumar
        </div>
      </section>
    </div>
  );
}