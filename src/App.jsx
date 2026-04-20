import { useState, useEffect, useRef } from "react";

const NAV_LINKS = ["about", "skills", "research", "projects", "contact"];

const SKILLS = [
  { name: "Python", level: 95 },
  { name: "Django", level: 90 },
  { name: "C/C++", level: 75 },
  { name: "Java", level: 70 },
  { name: "SQL/MySQL", level: 80 },
  { name: "HTML/CSS", level: 90 },
];

const EXPERIENCES = [
  {
    title: "Undergraduate Researcher",
    org: "Dept. of Mathematical Sciences, UWM",
    period: "May 2025 – Present",
    tags: ["Graph Theory", "MATLAB", "Academic Writing", "LaTex"],
    desc: "Researched Truncated Square Graphs with a focus on Total Restricted Broadcast Domination. Analyzed single-vertex broadcasting, eccentricity, and graph connectivity relationships.",
    icon: "📝",
  },
  {
    title: "Exhibit Maintenance",
    org: "Discovery World, Milwaukee",
    period: "Jul 2024 – Sep 2024",
    tags: ["C++", "Python", "Arduino", "Raspberry Pi"],
    desc: "Designed a 3D circuit for the Wimshurst machine using Arduino + relays (C++). Rebuilt the Elements Display using Raspberry Pi (Python) and touch pads for more user interaction.",
    icon: "⚡",
  },
  {
    title: "SURF Recipient – Solar Sculpture Project",
    org: "College of Engineering & Applied Sciences, UWM",
    period: "Sep 2023 – Aug 2024",
    tags: ["PIC24", "MPLabs", "Embedded Systems", "PICKIT"],
    desc: "Contributed to a Solar Sculpture that harvests sunlight by day and drives visual light performances at night using PIC24 microcontrollers.",
    icon: "☀",
  },
];

// ── Matrix palette tokens ──────────────────────────────────────
const M = {
  bright:      "#00ff41",
  mid:         "#00b300",
  dim:         "#007a00",
  dark:        "#003b00",
  glow:        "rgba(0,255,65,0.15)",
  glassBg:     "rgba(0,20,0,0.45)",
  glassBgHov:  "rgba(0,30,0,0.60)",
  glassBdr:    "rgba(0,255,65,0.25)",
  glassBdrHov: "rgba(0,255,65,0.55)",
  blur:        "blur(14px) saturate(160%)",
  shadow:      "0 4px 32px rgba(0,255,65,0.08), 0 1.5px 8px rgba(0,0,0,0.5)",
  shadowHov:   "0 8px 40px rgba(0,255,65,0.18), 0 2px 12px rgba(0,0,0,0.6)",
  bg:          "#020f02",
  textSec:     "#00b300",
};

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

function FadeIn({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const visible = useIntersection(ref);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

function SkillBar({ name, level, delay }) {
  const ref = useRef(null);
  const visible = useIntersection(ref);
  return (
    <div ref={ref} style={{ marginBottom: "18px" }}>
      <div style={{
        display: "flex", justifyContent: "space-between",
        marginBottom: "6px", fontFamily: "'Space Mono', monospace", fontSize: "13px",
      }}>
        <span style={{ color: M.bright }}>{name}</span>
        <span style={{ color: M.mid }}>{level}%</span>
      </div>
      <div style={{ background: M.dark, borderRadius: "4px", height: "6px", overflow: "hidden" }}>
        <div style={{
          height: "100%",
          width: visible ? `${level}%` : "0%",
          background: `linear-gradient(90deg, ${M.mid}, ${M.bright})`,
          borderRadius: "4px",
          transition: `width 1.2s cubic-bezier(.4,0,.2,1) ${delay}s`,
          boxShadow: `0 0 12px ${M.bright}55`,
        }} />
      </div>
    </div>
  );
}

function Card({ children, style = {} }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background:          hovered ? M.glassBgHov : M.glassBg,
        backdropFilter:      M.blur,
        WebkitBackdropFilter: M.blur,
        border:              `1px solid ${hovered ? M.glassBdrHov : M.glassBdr}`,
        borderRadius:        "16px",
        padding:             "28px",
        transition:          "all 0.3s ease",
        transform:           hovered ? "translateY(-4px)" : "none",
        boxShadow:           hovered ? M.shadowHov : M.shadow,
        position:            "relative",
        overflow:            "hidden",
        ...style,
      }}
    >
      {/* Apple-style top-edge glass sheen */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: "inherit", pointerEvents: "none",
        background: "linear-gradient(160deg, rgba(0,255,65,0.07) 0%, transparent 55%)",
      }} />
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("about");
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
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

  const glowStyle = {
    position: "fixed",
    left: cursorPos.x - 200, top: cursorPos.y - 200,
    width: 400, height: 400,
    background: `radial-gradient(circle, ${M.glow} 0%, transparent 70%)`,
    pointerEvents: "none", zIndex: 0,
    transition: "left 0.1s, top 0.1s",
  };

  return (
    <div style={{ background: M.bg, minHeight: "100vh", color: M.bright, fontFamily: "'DM Sans', sans-serif", overflowX: "hidden" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: rgba(0,255,65,0.2); color: #00ff41; }
        html { scroll-behavior: smooth; }
        a { color: inherit; text-decoration: none; }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-12px); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(0,255,65,0.4); }
          50%       { box-shadow: 0 0 0 8px rgba(0,255,65,0); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        .tag {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 999px;
          font-size: 11px;
          font-family: 'Space Mono', monospace;
          background: rgba(0,255,65,0.08);
          border: 1px solid rgba(0,255,65,0.25);
          color: #00b300;
          margin: 3px;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          transition: background 0.2s, border-color 0.2s, color 0.2s;
        }
        .tag:hover {
          background: rgba(0,255,65,0.15);
          border-color: rgba(0,255,65,0.5);
          color: #00ff41;
        }

        .nav-link {
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          letter-spacing: 1px;
          text-transform: uppercase;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          color: #007a00;
        }
        .nav-link:hover, .nav-link.active {
          color: #00ff41;
          background: rgba(0,255,65,0.08);
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
        .grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px; }
        .dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: #00ff41;
          animation: pulse-glow 2s infinite;
          display: inline-block;
          margin-right: 8px;
        }
      `}</style>

      {/* Cursor glow */}
      <div style={glowStyle} />

      {/* Background grid */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        backgroundImage: `linear-gradient(rgba(0,255,65,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,65,0.04) 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }} />

      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "rgba(2,15,2,0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(0,255,65,0.12)" : "none",
        transition: "all 0.3s ease",
        padding: "16px 32px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "14px", color: M.bright, fontWeight: 700 }}>
          GN<span style={{ animation: "blink 1.2s infinite", display: "inline-block" }}>_</span>
        </span>
        <div style={{ display: "flex", gap: "4px" }}>
          {NAV_LINKS.map(l => (
            <span key={l} className={`nav-link ${activeSection === l ? "active" : ""}`} onClick={() => scrollTo(l)}>{l}</span>
          ))}
        </div>
      </nav>

      {/* HERO */}
      <section id="about" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1, padding: "0 24px" }}>
        <div style={{ textAlign: "center", maxWidth: 1000 }}>
          <div style={{ position: "absolute", top: "20%", left: "10%", width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,255,65,0.12), transparent)", animation: "float 6s ease-in-out infinite", filter: "blur(40px)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: "25%", right: "8%", width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,179,0,0.10), transparent)", animation: "float 8s ease-in-out infinite 2s", filter: "blur(50px)", pointerEvents: "none" }} />

          <div style={{ opacity: 0.8, fontFamily: "'Space Mono', monospace", fontSize: "12px", letterSpacing: "3px", color: M.mid, marginBottom: "20px", textTransform: "uppercase" }}>
            <span className="dot" />Junior @ UWM · CS with Honors
          </div>

          <h1 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(48px, 10vw, 90px)",
            fontWeight: 800, lineHeight: 1.0, letterSpacing: "-3px",
            background: `linear-gradient(135deg, #ccffcc 20%, ${M.bright} 60%, ${M.mid} 100%)`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            marginBottom: "24px",
          }}>
            Gourilakshmi<br />Neerajkumar
          </h1>

          <p style={{ fontSize: "17px", color: M.dim, maxWidth: 520, margin: "0 auto 36px", lineHeight: 1.7, fontWeight: 300 }}>
            Call me gouri.<br /> I build things and occassionally break things- usually on purpose ;)
          </p>

          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => scrollTo("projects")} style={{
              padding: "14px 32px", borderRadius: "12px", border: `1px solid ${M.mid}`, cursor: "pointer",
              background: "linear-gradient(135deg, rgba(0,100,0,0.7), rgba(0,179,0,0.5))",
              backdropFilter: M.blur, WebkitBackdropFilter: M.blur,
              color: M.bright, fontWeight: 700, fontSize: "14px", fontFamily: "'Space Mono', monospace",
              letterSpacing: "0.5px", transition: "all 0.2s",
              boxShadow: "0 0 20px rgba(0,255,65,0.15)",
            }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 0 32px rgba(0,255,65,0.35)"; e.currentTarget.style.borderColor = M.bright; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 0 20px rgba(0,255,65,0.15)"; e.currentTarget.style.borderColor = M.mid; }}
            >
              View Work →
            </button>
            <a href="mailto:neerajk2@uwm.edu" style={{
              padding: "14px 32px", borderRadius: "12px", cursor: "pointer",
              border: `1px solid ${M.glassBdr}`, background: M.glassBg,
              backdropFilter: M.blur, WebkitBackdropFilter: M.blur,
              color: M.mid, fontWeight: 600, fontSize: "14px", fontFamily: "'Space Mono', monospace",
              transition: "all 0.2s", display: "inline-block",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = M.glassBgHov; e.currentTarget.style.borderColor = M.glassBdrHov; e.currentTarget.style.color = M.bright; }}
              onMouseLeave={e => { e.currentTarget.style.background = M.glassBg; e.currentTarget.style.borderColor = M.glassBdr; e.currentTarget.style.color = M.mid; }}
            >
              Contact
            </a>
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" style={{ position: "relative", zIndex: 1 }}>
        <div className="section">
          <FadeIn>
            <div style={{ marginBottom: "48px" }}>
              <p style={{ fontFamily: "'Space Mono', monospace", color: M.mid, fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "8px" }}>02 / skills</p>
              <h2 className="section-title">Tech Stack</h2>
              <div style={{ width: "48px", height: "3px", background: `linear-gradient(90deg, ${M.mid}, ${M.bright})`, borderRadius: "2px", marginTop: "12px" }} />
            </div>
          </FadeIn>

          <div className="grid-2">
            <FadeIn delay={0.1}>
              <Card>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "18px", marginBottom: "28px", color: M.bright }}>Proficiency</h3>
                {SKILLS.map((s, i) => <SkillBar key={s.name} {...s} delay={i * 0.08} />)}
              </Card>
            </FadeIn>
            <FadeIn delay={0.2}>
              <Card style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div>
                  <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "18px", marginBottom: "16px", color: M.bright }}>Hardware & Embedded</h3>
                  {["Arduino Uno", "Raspberry Pi", "PIC24 Microcontroller", "MPLab X", "PICKIT3"].map(t => <span key={t} className="tag">{t}</span>)}
                </div>
                <div>
                  <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "18px", marginBottom: "16px", color: M.bright }}>Domains</h3>
                  {["Graph Theory", "Embedded Systems", "Software Dev", "Web Dev", "AI"].map(t => <span key={t} className="tag">{t}</span>)}
                </div>
                <div>
                  <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "18px", marginBottom: "16px", color: M.bright }}>Tools</h3>
                  {["Git", "Linux", "LaTex", "MS Office"].map(t => <span key={t} className="tag">{t}</span>)}
                </div>
              </Card>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* RESEARCH */}
      <section id="research" style={{ position: "relative", zIndex: 1 }}>
        <div className="section">
          <FadeIn>
            <div style={{ marginBottom: "48px" }}>
              <p style={{ fontFamily: "'Space Mono', monospace", color: M.mid, fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "8px" }}>03 / research</p>
              <h2 className="section-title">Experience &<br />Research</h2>
              <div style={{ width: "48px", height: "3px", background: `linear-gradient(90deg, ${M.mid}, ${M.bright})`, borderRadius: "2px", marginTop: "12px" }} />
            </div>
          </FadeIn>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {EXPERIENCES.map((exp, i) => (
              <FadeIn key={exp.title} delay={i * 0.1}>
                <Card style={{ display: "flex", gap: "20px" }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: "12px", flexShrink: 0,
                    background: "linear-gradient(135deg, rgba(0,255,65,0.10), rgba(0,179,0,0.10))",
                    border: "1px solid rgba(0,255,65,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px",
                  }}>
                    {exp.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", marginBottom: "4px" }}>
                      <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "17px", fontWeight: 700, color: M.bright }}>{exp.title}</h3>
                      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", color: M.mid, whiteSpace: "nowrap" }}>{exp.period}</span>
                    </div>
                    <p style={{ fontSize: "13px", color: M.dim, marginBottom: "10px", fontFamily: "'Space Mono', monospace" }}>{exp.org}</p>
                    <p style={{ fontSize: "14px", color: M.textSec, lineHeight: 1.65, marginBottom: "12px" }}>{exp.desc}</p>
                    <div>{exp.tags.map(t => <span key={t} className="tag">{t}</span>)}</div>
                  </div>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS / AWARDS */}
      <section id="projects" style={{ position: "relative", zIndex: 1 }}>
        <div className="section">
          <FadeIn>
            <div style={{ marginBottom: "48px" }}>
              <p style={{ fontFamily: "'Space Mono', monospace", color: M.mid, fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "8px" }}>04 / projects</p>
              <h2 className="section-title">Awards &<br />Projects</h2>
              <div style={{ width: "48px", height: "3px", background: `linear-gradient(90deg, ${M.mid}, ${M.bright})`, borderRadius: "2px", marginTop: "12px" }} />
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div style={{
              borderRadius: "20px", padding: "40px",
              background: "linear-gradient(135deg, rgba(0,255,65,0.06) 0%, rgba(0,100,0,0.08) 100%)",
              backdropFilter: M.blur, WebkitBackdropFilter: M.blur,
              border: "1px solid rgba(0,255,65,0.2)", boxShadow: M.shadow,
              marginBottom: "20px", position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", inset: 0, borderRadius: "inherit", pointerEvents: "none", background: "linear-gradient(160deg, rgba(0,255,65,0.07) 0%, transparent 55%)" }} />
              <div style={{ position: "absolute", right: -60, top: -60, width: 220, height: 220, borderRadius: "50%", border: "1px solid rgba(0,255,65,0.15)", animation: "spin-slow 20s linear infinite" }} />
              <div style={{ position: "absolute", right: -30, top: -30, width: 140, height: 140, borderRadius: "50%", border: "1px solid rgba(0,179,0,0.12)" }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", color: M.mid, letterSpacing: "2px", marginBottom: "16px" }}>🏆 ISRO · 2021 · NATIONAL</div>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "26px", fontWeight: 800, marginBottom: "12px", color: M.bright }}>Space Habitat Award</h3>
                <p style={{ color: M.textSec, lineHeight: 1.7, maxWidth: "600px", marginBottom: "16px" }}>
                  Designed a secondary habitat for humans on Gliese 667 cc — selected as the most Earth-like planet. Placed <strong style={{ color: M.bright }}>3rd out of 240+ national teams</strong>.
                </p>
                <span className="tag">Astrophysics Research</span>
                <span className="tag">Report Writing</span>
                <span className="tag">Team Collaboration</span>
              </div>
            </div>
          </FadeIn>

          <div className="grid-2">
            {[
              { icon: "☀️", title: "Solar Light Sculpture", desc: "Engineered a solar-powered sculpture that stores energy during the day and drives interactive light performances at night using PIC24 and MPLabs.", tags: ["PIC24", "MPLabs", "Embedded"] },
              { icon: "⚗️", title: "Wimshurst Machine Redesign", desc: "Modernized a classic electrostatic generator at Discovery World using Arduino and relay-based control, programmed in C++.", tags: ["Arduino", "C++", "Hardware"] },
              { icon: "🫐", title: "Elements Display (Raspberry Pi)", desc: "Rebuilt the periodic elements interactive display from scratch at Discovery World using a Raspberry Pi, programmed in Python.", tags: ["Raspberry Pi", "Python", "Linux"] },
            ].map((p, i) => (
              <FadeIn key={p.title} delay={0.2 + i * 0.05}>
                <Card>
                  <div style={{ fontSize: "28px", marginBottom: "16px" }}>{p.icon}</div>
                  <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "17px", marginBottom: "10px", color: M.bright }}>{p.title}</h3>
                  <p style={{ fontSize: "14px", color: M.textSec, lineHeight: 1.65 }}>{p.desc}</p>
                  <div style={{ marginTop: "16px" }}>{p.tags.map(t => <span key={t} className="tag">{t}</span>)}</div>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{ position: "relative", zIndex: 1 }}>
        <div className="section" style={{ textAlign: "center" }}>
          <FadeIn>
            <p style={{ fontFamily: "'Space Mono', monospace", color: M.mid, fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "16px" }}>05 / contact</p>
            <h2 className="section-title" style={{ marginBottom: "16px" }}>Let's Connect</h2>
            <p style={{ color: M.dim, marginBottom: "40px", fontSize: "15px" }}>Open to internships, research, and cool projects.</p>
            <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
              <a href="mailto:neerajk2@uwm.edu" style={{
                padding: "14px 32px", borderRadius: "12px",
                background: "linear-gradient(135deg, rgba(0,100,0,0.7), rgba(0,179,0,0.5))",
                backdropFilter: M.blur, WebkitBackdropFilter: M.blur,
                border: `1px solid ${M.mid}`, color: M.bright,
                fontWeight: 700, fontSize: "14px", fontFamily: "'Space Mono', monospace",
                transition: "all 0.2s", display: "inline-block",
                boxShadow: "0 0 20px rgba(0,255,65,0.15)",
              }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 0 32px rgba(0,255,65,0.35)"; e.currentTarget.style.borderColor = M.bright; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 0 20px rgba(0,255,65,0.15)"; e.currentTarget.style.borderColor = M.mid; }}
              >
                neerajk2@uwm.edu
              </a>
              <a href="https://www.linkedin.com/in/gourilakshmineerajkumar" target="_blank" rel="noopener noreferrer" style={{
                padding: "14px 32px", borderRadius: "12px",
                border: `1px solid ${M.glassBdr}`, background: M.glassBg,
                backdropFilter: M.blur, WebkitBackdropFilter: M.blur,
                color: M.mid, fontWeight: 600, fontSize: "14px", fontFamily: "'Space Mono', monospace",
                transition: "all 0.2s", display: "inline-block",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = M.glassBgHov; e.currentTarget.style.borderColor = M.glassBdrHov; e.currentTarget.style.color = M.bright; }}
                onMouseLeave={e => { e.currentTarget.style.background = M.glassBg; e.currentTarget.style.borderColor = M.glassBdr; e.currentTarget.style.color = M.mid; }}
              >
                LinkedIn ↗
              </a>
            </div>
          </FadeIn>
        </div>
        <div style={{ borderTop: `1px solid ${M.dark}`, textAlign: "center", padding: "24px", fontFamily: "'Space Mono', monospace", fontSize: "11px", color: M.dark }}>
          © 2025 Gourilakshmi Neerajkumar
        </div>
      </section>
    </div>
  );
}