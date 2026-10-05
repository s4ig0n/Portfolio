import { useState, useEffect, useRef } from "react";
import MatrixCursor from "./MatrixCursor.jsx";

const NAV_LINKS = ["home", "skills", "experience", "projects", "contact"];

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
    title: "Quality Assurance Intern",
    org: "Mercury Security – HID Global",
    period: "May 2026 – Aug 2026",
    tags: ["MQTT", "Docker", "QEMU", "Jenkins", "TestRail", "Jira", "SonarQube", "Bitbucket","Access Control", "Embedded Linux", "Web UI"],
    desc: "Built a cross-architecture MQTT file transfer pipeline between an x64 Windows host and an ARM-based MP series Linux controller. Validated 2 release and 2 hotfix targets for access control controllers through TestRail runs on Jenkins builds, resolved Jira bugs across controller firmware and its web configuration interface, and ran compatibility testing across the full lineup of SIOs, readers, and locks.",
    icon: "🔐",
  },
  {
    title: "Web Developer – Mothers Against Gun Violence",
    org: "Nonprofit Client Project, Milwaukee · Mentored by Direct Supply",
    period: "Jan 2026 – May 2026",
    tags: ["Web Dev", "Branding", "Accessibility", "Donation Plugin", "UI/UX","WordPress"],
    desc: "Redesigned a Milwaukee nonprofit's website with a four-person team under a new brand identity. Integrated a donation plugin to simplify online giving, and added pages for the founder's story and a map of Milwaukee murals honoring gun violence victims while improving accessibility.",
    icon: "🌐",
  },
  {
    title: "Undergraduate Researcher – Graph Theory",
    org: "Dept. of Mathematical Sciences, UWM · MAA, NSF",
    period: "May 2025 – Aug 2025",
    tags: ["Graph Theory", "MATLAB", "Academic Writing", "LaTeX"],
    desc: "Researched Truncated Square Graphs with a focus on Total Restricted Broadcast Domination, working on questions proposed by J. Cervantes and P. Harris. Analyzed single-vertex broadcasts, eccentricity, and graph connectivity relationships.",
    icon: "📊",
  },
  {
    title: "Exhibit Maintenance",
    org: "Discovery World, Milwaukee",
    period: "Jul 2024 – Sep 2024",
    tags: ["C++", "Python", "Arduino", "Raspberry Pi","3D Modeling", "Relays"],
    desc: "Designed a 3D circuit for the Wimshurst machine using Arduino + relays (C++). Rebuilt the Elements Display using Raspberry Pi (Python) and touch pads for more user interaction.",
    icon: "🤖",
  },
  {
    title: "SURF Recipient (Two-Time)",
    org: "College of Engineering & Applied Sciences, UWM",
    period: "Sep 2023 – Dec 2024",
    tags: ["PIC24", "MPLAB X", "Embedded Systems", "LC-3", "Testing"],
    desc: "Advanced a Solar Sculpture that harvests sunlight by day and drives visual light performances at night using a PIC24 microcontroller and circuit debugger in MPLAB X on Linux. In the second term, tested and debugged an LC-3 visualization tool and wrote its documentation and user manual.",
    icon: "☀️",
  },
];

const PROJECTS = [
  { icon: "📡", title: "MQTT File Transfer Pipeline", desc: "Cross-architecture pipeline between an x64 Windows host and an ARM-based Linux access controller, deployed with Docker and QEMU. JSON messages carry file metadata, and the controller bundles requested files into a single tar archive that downloads automatically to the PC.", tags: ["MQTT", "Docker", "QEMU", "ARM Linux"] },
  { icon: "🗓️", title: "Scheduling Management Web App", desc: "Role-based scheduling system with dedicated dashboards for students, TAs, instructors, and admins. Built the Django backend and responsive Bootstrap UI in a scrum-based team.", tags: ["Django", "Bootstrap", "Python", "Agile"] },
  { icon: "🧮", title: "LC-3 Visualization Tool", desc: "Tested and debugged an educational LC-3 visualization tool as a SURF fellow, and wrote its project documentation and user manual.", tags: ["LC-3", "Testing", "Documentation"] },
  { icon: "☀️", title: "Solar Light Sculpture", desc: "Engineered a solar-powered sculpture that stores energy during the day and drives interactive light performances at night using PIC24 and MPLAB X.", tags: ["PIC24", "MPLAB X", "Embedded"] },
  { icon: "⚗️", title: "Wimshurst Machine Redesign", desc: "Modernized a classic electrostatic generator at Discovery World using Arduino and relay-based control, programmed in C++.", tags: ["Arduino", "C++", "Hardware"] },
  { icon: "🫐", title: "Elements Display (Raspberry Pi)", desc: "Rebuilt the periodic elements interactive display from scratch at Discovery World using a Raspberry Pi, programmed in Python.", tags: ["Raspberry Pi", "Python", "Linux"] },
];

// ── Matrix palette tokens ──────────────────────────────────────
const M = {
  bright:      "#f5f5f5",
  mid:         "#c9c9c9",
  dim:         "#8a8a8a",
  dark:        "#3a3a3a",
  glow:        "rgba(255,255,255,0.10)",
  glassBg:     "rgba(255,255,255,0.045)",
  glassBgHov:  "rgba(255,255,255,0.08)",
  glassBdr:    "rgba(255,255,255,0.14)",
  glassBdrHov: "rgba(255,255,255,0.30)",
  bg:          "#000000",
  textSec:     "#b5b5b5",
};

const liquidBlur = "blur(22px) saturate(180%) brightness(1.08)";

const shadowRest = `
  0 0 0 0.5px rgba(255,255,255,0.14),
  0 2px 0 0 rgba(255,255,255,0.10) inset,
  0 -1px 0 0 rgba(0,0,0,0.5) inset,
  0 8px 32px rgba(0,0,0,0.55),
  0 2px 8px rgba(0,0,0,0.4),
  0 0 40px rgba(255,255,255,0.04)
`;

const shadowHover = `
  0 0 0 0.5px rgba(255,255,255,0.3),
  0 2px 0 0 rgba(255,255,255,0.18) inset,
  0 -1px 0 0 rgba(0,0,0,0.5) inset,
  0 20px 60px rgba(0,0,0,0.6),
  0 8px 24px rgba(0,0,0,0.5),
  0 0 60px rgba(255,255,255,0.10)
`;


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

// Phones fire mouseenter on tap and never mouseleave, which leaves cards stuck "lifted".
// Only enable hover effects on devices that can actually hover.
const canHover = typeof window !== "undefined" && window.matchMedia?.("(hover: hover)").matches;

function Card({ children, style = {} }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="glass-card"
      onMouseEnter={() => canHover && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "rgba(0,28,0,0.38)",
        backdropFilter: liquidBlur,
        WebkitBackdropFilter: liquidBlur,
        borderRadius: "18px",
        position: "relative",
        overflow: "hidden",
        transition: "box-shadow 0.3s ease, transform 0.3s ease",
        boxShadow: hovered ? shadowHover : shadowRest,
        transform: hovered ? "translateY(-5px) scale(1.012)" : "translateY(0) scale(1)",
        ...style,
      }}
    >
      {/* Specular top-edge highlight */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: "inherit", pointerEvents: "none", zIndex: 0,
        background: `linear-gradient(170deg, rgba(0,255,65,${hovered ? "0.22" : "0.16"}) 0%, rgba(0,255,65,0.05) 20%, transparent 48%)`,
        transition: "background 0.3s ease",
      }} />
      {/* Bottom lens curve */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "45%",
        borderRadius: "0 0 18px 18px", pointerEvents: "none", zIndex: 0,
        background: "linear-gradient(to top, rgba(0,0,0,0.28), transparent)",
      }} />
      {/* Scanline texture */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: "inherit", pointerEvents: "none", zIndex: 0,
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.015) 2px, rgba(0,255,65,0.015) 3px)",
        opacity: 0.6,
      }} />
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}

// Reusable liquid glass feature card (used for Dean's List etc.)
function FeatureCard({ children }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="feature-card"
      onMouseEnter={() => canHover && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: "20px",
        background: "rgba(0,28,0,0.38)",
        backdropFilter: liquidBlur,
        WebkitBackdropFilter: liquidBlur,
        boxShadow: hovered ? shadowHover : shadowRest,
        transform: hovered ? "translateY(-4px)" : "none",
        transition: "box-shadow 0.3s ease, transform 0.3s ease",
        marginBottom: "20px", position: "relative", overflow: "hidden",
      }}
    >
      {/* Specular highlight */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: "inherit", pointerEvents: "none", zIndex: 0,
        background: `linear-gradient(170deg, rgba(0,255,65,${hovered ? "0.22" : "0.16"}) 0%, rgba(0,255,65,0.05) 20%, transparent 48%)`,
        transition: "background 0.3s ease",
      }} />
      {/* Bottom lens curve */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "45%",
        borderRadius: "0 0 20px 20px", pointerEvents: "none", zIndex: 0,
        background: "linear-gradient(to top, rgba(0,0,0,0.28), transparent)",
      }} />
      {/* Scanlines */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: "inherit", pointerEvents: "none", zIndex: 0,
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.015) 2px, rgba(0,255,65,0.015) 3px)",
        opacity: 0.6,
      }} />
      {/* Decorative rings */}
      <div style={{
        position: "absolute", right: -60, top: -60, width: 220, height: 220,
        borderRadius: "50%", border: "1px solid rgba(0,255,65,0.15)",
        animation: "spin-slow 20s linear infinite", zIndex: 0,
      }} />
      <div style={{
        position: "absolute", right: -30, top: -30, width: 140, height: 140,
        borderRadius: "50%", border: "1px solid rgba(0,179,0,0.12)", zIndex: 0,
      }} />
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── ScrollSpy: watches a thin band across the vertical center of the
  // viewport and marks whichever section is currently crossing it active.
  useEffect(() => {
    const sections = NAV_LINKS
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setActiveSection(id);
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
          background: rgba(0,255,65,0.07);
          border: 0.5px solid rgba(0,255,65,0.28);
          color: #00b300;
          margin: 3px;
          backdrop-filter: blur(12px) saturate(150%);
          -webkit-backdrop-filter: blur(12px) saturate(150%);
          box-shadow: 0 1px 0 0 rgba(0,255,65,0.14) inset, 0 1px 4px rgba(0,0,0,0.35);
          transition: all 0.2s;
        }
        .tag:hover {
          background: rgba(0,255,65,0.13);
          border-color: rgba(0,255,65,0.5);
          color: #00ff41;
          box-shadow: 0 1px 0 0 rgba(0,255,65,0.22) inset, 0 2px 10px rgba(0,0,0,0.4), 0 0 14px rgba(0,255,65,0.1);
          transform: translateY(-1px);
        }

        /* ── Sticky vertical ScrollSpy side nav ─────────────────── */
        
        .side-nav {
          position: fixed;
          top: 50%;
          right: 32px;
          transform: translateY(-50%);
          z-index: 100;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 16px;
        }
        .side-nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        }
        .side-nav-label {
          font-family: 'Space Mono', monospace;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          white-space: nowrap;
          font-size: 11px;
          font-weight: 400;
          color: #6b6b6b;
          opacity: 0.55;
          transform: translateX(0);
          transition: font-size 0.35s cubic-bezier(.4,0,.2,1),
                      font-weight 0.35s ease,
                      color 0.35s ease,
                      opacity 0.35s ease,
                      transform 0.35s ease;
        }
        .side-nav-item:hover .side-nav-label {
          opacity: 0.85;
          color: #c9c9c9;
        }
        .side-nav-label.active {
          font-size: 15px;
          font-weight: 700;
          color: #f5f5f5;
          opacity: 1;
          transform: translateX(-3px);
        }
        .side-nav-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #6b6b6b;
          opacity: 0.5;
          transition: all 0.35s ease;
          flex-shrink: 0;
        }
        .side-nav-item:hover .side-nav-dot {
          opacity: 0.85;
        }
        .side-nav-dot.active {
          width: 8px;
          height: 8px;
          background: #f5f5f5;
          opacity: 1;
          box-shadow: 0 0 0 4px rgba(255,255,255,0.10), 0 0 14px rgba(255,255,255,0.5);
        }
        @media (max-width: 900px) {
          .side-nav { right: 16px; gap: 14px; }
          .side-nav-label { display: none; }
          .side-nav-item { gap: 0; }
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
        /* ── Layout helpers ─────────────────────────────────── */
        a, button { -webkit-tap-highlight-color: transparent; }
        .glass-card { padding: 28px; }
        .feature-card { padding: 40px; }
        .hero { min-height: 100vh; min-height: 100svh; }
        .hero-name { font-size: clamp(30px, 9vw, 90px); letter-spacing: -3px; overflow-wrap: break-word; }

        /* Between: compact banner under Dean's List */
        .banner-row { display: flex; align-items: center; justify-content: space-between; gap: 16px 28px; flex-wrap: wrap; }
        .banner-main { flex: 1 1 320px; min-width: 0; }
        .banner-eyebrow { font-family: 'Space Mono', monospace; font-size: 11px; color: #c9c9c9; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 10px; }
        .banner-main h3 { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; color: #f5f5f5; margin-bottom: 6px; }
        .banner-main p { font-size: 14px; color: #b5b5b5; line-height: 1.6; }
        .status-pill {
          display: inline-flex; align-items: center; white-space: nowrap;
          padding: 6px 14px; border-radius: 999px;
          font-family: 'Space Mono', monospace; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; color: #00ff41;
          background: rgba(0,255,65,0.07); border: 0.5px solid rgba(0,255,65,0.4);
        }

        .dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: #00ff41;
          animation: pulse-glow 2s infinite;
          display: inline-block;
          margin-right: 8px;
        }

        /* ── Responsive: tablet ───────────────────────────────── */
        @media (max-width: 900px) {
          .section { padding-right: 46px; }
        }

        /* ── Responsive: phone ────────────────────────────────── */
        @media (max-width: 600px) {
          .section { padding: 56px 18px; }
          .glass-card { padding: 20px; }
          .feature-card { padding: 24px; }
          /* lighter blur keeps scrolling smooth on phones */
          .glass-card, .feature-card { backdrop-filter: blur(12px) !important; -webkit-backdrop-filter: blur(12px) !important; }
          .hero-name { letter-spacing: -1.5px; }
          .exp-title { font-size: 18px !important; }
          .exp-icon { width: 40px !important; height: 40px !important; font-size: 24px !important; }

          #home { padding: 0 18px !important; }

          /* Side nav becomes a liquid-glass bottom dock */
          .side-nav {
            top: auto; right: auto; left: 50%;
            bottom: calc(14px + env(safe-area-inset-bottom, 0px));
            transform: translateX(-50%);
            flex-direction: row; align-items: center; gap: 2px;
            padding: 6px; border-radius: 999px;
            max-width: calc(100vw - 16px); overflow-x: auto; scrollbar-width: none;
            background: linear-gradient(180deg, rgba(255,255,255,0.11) 0%, rgba(255,255,255,0.03) 55%, rgba(0,255,65,0.04) 100%);
            backdrop-filter: blur(24px) saturate(190%) brightness(1.12);
            -webkit-backdrop-filter: blur(24px) saturate(190%) brightness(1.12);
            border: 0.5px solid rgba(255,255,255,0.24);
            box-shadow:
              inset 0 1px 0 rgba(255,255,255,0.32),
              inset 0 -1px 0 rgba(0,0,0,0.45),
              inset 0 0 18px rgba(255,255,255,0.04),
              0 0 0 0.5px rgba(0,255,65,0.14),
              0 12px 32px rgba(0,0,0,0.55),
              0 2px 8px rgba(0,0,0,0.4);
          }
          .side-nav::-webkit-scrollbar { display: none; }
          /* specular sheen across the top half of the glass */
          .side-nav::before {
            content: ""; position: absolute; inset: 1px 1px 50% 1px; border-radius: 999px 999px 40px 40px;
            background: linear-gradient(180deg, rgba(255,255,255,0.16), rgba(255,255,255,0));
            pointer-events: none;
          }
          .side-nav-item {
            position: relative; gap: 0; padding: 9px 9px; border-radius: 999px;
            border: 0.5px solid transparent;
            transition: background 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease, transform 0.15s ease;
          }
          .side-nav-item:active { transform: scale(0.94); }
          /* active item = a small glass lens with a green glow */
          .side-nav-item.active {
            background: radial-gradient(120% 150% at 50% 0%, rgba(255,255,255,0.24) 0%, rgba(0,255,65,0.12) 55%, rgba(0,255,65,0.05) 100%);
            border-color: rgba(255,255,255,0.22);
            box-shadow:
              inset 0 1px 0 rgba(255,255,255,0.4),
              inset 0 -1px 2px rgba(0,0,0,0.35),
              0 0 14px rgba(0,255,65,0.28);
          }
          .side-nav-dot { display: none; }
          .side-nav-label, .side-nav-label.active {
            display: block; font-size: 10.5px; letter-spacing: 0; transform: none; opacity: 1;
          }
          .side-nav-label { color: #9a9a9a; font-weight: 400; }
          .side-nav-label.active { color: #ccffcc; font-weight: 700; text-shadow: 0 0 10px rgba(0,255,65,0.6); }
          .site-footer { padding-bottom: calc(84px + env(safe-area-inset-bottom, 0px)) !important; }
        }
      `}</style>

      {/* Y2K x Matrix cursor: glow torch + pixel arrow + glyph trail */}
      <MatrixCursor />

      {/* Background grid */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        backgroundImage: `linear-gradient(rgba(0,255,65,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,65,0.04) 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }} />

      {/* BRAND — small fixed mark, top-left, gains a glass backing once scrolled */}
      <div style={{
        position: "fixed", top: 0, left: 0, zIndex: 100,
        padding: "20px 28px",
        background: scrolled ? "rgba(22,22,29,0.75)" : "transparent",
        backdropFilter: scrolled ? liquidBlur : "none",
        WebkitBackdropFilter: scrolled ? liquidBlur : "none",
        borderBottomRightRadius: scrolled ? "14px" : 0,
        transition: "all 0.3s ease",
      }}>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "14px", color: M.bright, fontWeight: 700 }}>
          GLN<span style={{ animation: "blink 1.2s infinite", display: "inline-block" }}>_</span>
        </span>
      </div>

      {/* SIDE NAV — sticky vertical ScrollSpy nav, right edge */}
      <nav className="side-nav" aria-label="Section navigation">
        {NAV_LINKS.map((l) => (
          <div
            key={l}
            className={`side-nav-item ${activeSection === l ? "active" : ""}`}
            onClick={() => scrollTo(l)}
          >
            <span className={`side-nav-label ${activeSection === l ? "active" : ""}`}>{l}</span>
            <span className={`side-nav-dot ${activeSection === l ? "active" : ""}`} />
          </div>
        ))}
      </nav>

      {/* HERO */}
      <section id="home" className="hero" style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1, padding: "0 24px" }}>
        <div style={{ textAlign: "center", maxWidth: 1000 }}>
          <div style={{ position: "absolute", top: "20%", left: "10%", width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,255,65,0.12), transparent)", animation: "float 6s ease-in-out infinite", filter: "blur(40px)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: "25%", right: "8%", width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,179,0,0.10), transparent)", animation: "float 8s ease-in-out infinite 2s", filter: "blur(50px)", pointerEvents: "none" }} />

          <div style={{ opacity: 0.8, fontFamily: "'Space Mono', monospace", fontSize: "12px", letterSpacing: "3px", color: M.mid, marginBottom: "20px", textTransform: "uppercase" }}>
            <span className="dot" />Senior @ UWM · CS with Honors
          </div>

          <h1 className="hero-name" style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800, lineHeight: 1.0,
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
            <button onClick={() => scrollTo("experience")} style={{
              padding: "14px 32px", borderRadius: "12px", border: `1px solid ${M.mid}`, cursor: "pointer",
              background: "linear-gradient(135deg, rgba(0,100,0,0.7), rgba(0,179,0,0.5))",
              backdropFilter: liquidBlur, WebkitBackdropFilter: liquidBlur,
              color: M.bright, fontWeight: 700, fontSize: "14px", fontFamily: "'Space Mono', monospace",
              letterSpacing: "0.5px", transition: "all 0.2s",
              boxShadow: "0 0 0 0.5px rgba(0,255,65,0.18), 0 2px 0 0 rgba(0,255,65,0.12) inset, 0 8px 24px rgba(0,0,0,0.4)",
            }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = shadowHover; e.currentTarget.style.borderColor = M.bright; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 0 0 0.5px rgba(0,255,65,0.18), 0 2px 0 0 rgba(0,255,65,0.12) inset, 0 8px 24px rgba(0,0,0,0.4)"; e.currentTarget.style.borderColor = M.mid; }}
            >
              View Work →
            </button>
            <button onClick={() => scrollTo("contact")} style={{
              padding: "14px 32px", borderRadius: "12px", cursor: "pointer",
              border: `1px solid ${M.dim}`,
              background: "linear-gradient(135deg, rgba(58,58,58,0.95), rgba(105,105,105,0.88))",
              backdropFilter: "blur(22px)", WebkitBackdropFilter: "blur(22px)",
              color: M.bright, fontWeight: 600, fontSize: "14px", fontFamily: "'Space Mono', monospace",
              transition: "all 0.2s", display: "inline-block",
              boxShadow: "0 0 0 0.5px rgba(255,255,255,0.18), 0 2px 0 0 rgba(255,255,255,0.12) inset, 0 8px 24px rgba(0,0,0,0.4)",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "linear-gradient(135deg, rgba(80,80,80,0.95), rgba(135,135,135,0.9))"; e.currentTarget.style.borderColor = M.bright; e.currentTarget.style.boxShadow = shadowHover; }}
              onMouseLeave={e => { e.currentTarget.style.background = "linear-gradient(135deg, rgba(58,58,58,0.95), rgba(105,105,105,0.88))"; e.currentTarget.style.borderColor = M.dim; e.currentTarget.style.boxShadow = "0 0 0 0.5px rgba(255,255,255,0.18), 0 2px 0 0 rgba(255,255,255,0.12) inset, 0 8px 24px rgba(0,0,0,0.4)"; }}
            >
              Contact
            </button>
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
                <div style={{ marginTop: "22px" }}>
                  <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "12px", color: M.dim, marginBottom: "8px" }}>Also working with</p>
                  {["MATLAB", "Assembly", "Bootstrap"].map(t => <span key={t} className="tag">{t}</span>)}
                </div>
              </Card>
            </FadeIn>
            <FadeIn delay={0.2}>
              <Card style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                <div>
                  <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "18px", marginBottom: "8px", color: M.bright }}>Hardware & Embedded</h3>
                  {["Arduino Uno", "Raspberry Pi", "PIC24 Microcontroller", "MPLAB X", "PICKIT3", "ARM Linux Controllers", "Access Control (SIOs, Readers, Locks)"].map(t => <span key={t} className="tag">{t}</span>)}
                </div>
                <div>
                  <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "18px", marginBottom: "8px", color: M.bright }}>Domains</h3>
                  {["Embedded Systems", "Quality Assurance", "Software Dev", "Web Dev", "Graph Theory", "AI"].map(t => <span key={t} className="tag">{t}</span>)}
                </div>
                <div>
                  <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "18px", marginBottom: "8px", color: M.bright }}>QA & DevOps</h3>
                  {["Jenkins", "SonarQube", "TestRail", "Jira", "Bitbucket"].map(t => <span key={t} className="tag">{t}</span>)}
                </div>
                <div>
                  <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "18px", marginBottom: "8px", color: M.bright }}>Tools</h3>
                  {["Git", "Linux", "Docker", "QEMU", "MQTT", "LaTeX"].map(t => <span key={t} className="tag">{t}</span>)}
                </div>
              </Card>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* RESEARCH */}
      <section id="experience" style={{ position: "relative", zIndex: 1 }}>
        <div className="section">
          <FadeIn>
            <div style={{ marginBottom: "48px" }}>
              <p style={{ fontFamily: "'Space Mono', monospace", color: M.mid, fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "8px" }}>03 / experience</p>
              <h2 className="section-title">Experience &<br />Research</h2>
              <div style={{ width: "48px", height: "3px", background: `linear-gradient(90deg, ${M.mid}, ${M.bright})`, borderRadius: "2px", marginTop: "12px" }} />
            </div>
          </FadeIn>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {EXPERIENCES.map((exp, i) => (
              <FadeIn key={exp.title} delay={i * 0.1}>
                <Card>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "8px" }}>
                    <div className="exp-icon" style={{
                      width: 44, height: 44, borderRadius: "12px", flexShrink: 0,
                      background: "linear-gradient(135deg, rgba(0,255,65,0.10), rgba(0,179,0,0.10))",
                      border: "1px solid rgba(0,255,65,0.2)",
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: "30px",
                    }}>
                      {exp.icon}
                    </div>
                    <h3 className="exp-title" style={{ fontFamily: "'Syne', sans-serif", fontSize: "21px", fontWeight: 700, color: M.bright }}>{exp.title}</h3>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "4px 16px", marginBottom: "12px" }}>
                    <p style={{ fontSize: "13px", color: M.dim, fontFamily: "'Space Mono', monospace" }}>{exp.org}</p>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", color: M.mid, whiteSpace: "nowrap" }}>{exp.period}</span>
                  </div>
                  <p style={{ fontSize: "14px", color: M.textSec, lineHeight: 1.65, marginBottom: "12px" }}>{exp.desc}</p>
                  <div>{exp.tags.map(t => <span key={t} className="tag">{t}</span>)}</div>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS & ACHIEVEMENTS */}
      <section id="projects" style={{ position: "relative", zIndex: 1 }}>
        <div className="section">
          <FadeIn>
            <div style={{ marginBottom: "48px" }}>
              <p style={{ fontFamily: "'Space Mono', monospace", color: M.mid, fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "8px" }}>04 / projects & achievements</p>
              <h2 className="section-title">Projects <br/> & Achievements</h2>
              <div style={{ width: "48px", height: "3px", background: `linear-gradient(90deg, ${M.mid}, ${M.bright})`, borderRadius: "2px", marginTop: "12px" }} />
            </div>
          </FadeIn>

          {/* Dean's List — liquid glass FeatureCard */}
          <FadeIn delay={0.1}>
            <FeatureCard>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", color: M.mid, letterSpacing: "2px", marginBottom: "16px" }}>🏅 UWM · 2023–Present</div>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "26px", fontWeight: 800, marginBottom: "12px", color: M.bright }}>Dean's List Student</h3>
              <p style={{ color: M.textSec, lineHeight: 1.7, maxWidth: "600px", marginBottom: "16px" }}>
                Consistent academic excellence over fulltime coursework — <strong style={{ color: M.bright }}>maintaining a GPA of 3.7 or higher every semester.</strong>
              </p>
              {/* <span className="tag">Academic Excellence</span>
              <span className="tag">Full-time Student</span>
              <span className="tag">UWM Honors</span> */}
            </FeatureCard>
          </FadeIn>

          {/* Between: compact banner under Dean's List */}
          <FadeIn delay={0.15}>
            <Card style={{ marginBottom: "20px" }}>
              <div className="banner-row">
                <div className="banner-main">
                  <div className="banner-eyebrow">🏆 High Impact Award · MKE Tech FUSE · Oct 2026</div>
                  <h3>Between</h3>
                  <p>Keeping physical therapy patients on track between visits by putting their care plans in the calendar, reminders, and lock screen they already use.</p>
                </div>
                <span className="status-pill"><span className="dot" />In progress</span>
              </div>
            </Card>
          </FadeIn>

          <div className="grid-2">
            {PROJECTS.map((p, i) => (
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
            <h2 className="section-title" style={{ marginBottom: "16px" }}>Intrigued? <br/> Let's Connect</h2>
            <p style={{ color: M.dim, marginBottom: "40px", fontSize: "15px" }}>Open to internships, research, and cool projects.</p>
            <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
              <a href="mailto:neerajk2@uwm.edu" style={{
                padding: "14px 32px", borderRadius: "12px",
                background: "linear-gradient(135deg, rgba(0,100,0,0.7), rgba(0,179,0,0.5))",
                backdropFilter: liquidBlur, WebkitBackdropFilter: liquidBlur,
                border: `1px solid ${M.mid}`, color: M.bright,
                fontWeight: 700, fontSize: "14px", fontFamily: "'Space Mono', monospace",
                transition: "all 0.2s", display: "inline-block",
                boxShadow: "0 0 0 0.5px rgba(0,255,65,0.18), 0 2px 0 0 rgba(0,255,65,0.12) inset, 0 8px 24px rgba(0,0,0,0.4)",
              }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = shadowHover; e.currentTarget.style.borderColor = M.bright; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 0 0 0.5px rgba(0,255,65,0.18), 0 2px 0 0 rgba(0,255,65,0.12) inset, 0 8px 24px rgba(0,0,0,0.4)"; e.currentTarget.style.borderColor = M.mid; }}
              >
                Email ↗
              </a>
              <a href="https://www.linkedin.com/in/gourilakshmineerajkumar" target="_blank" rel="noopener noreferrer" style={{
                padding: "14px 32px", borderRadius: "12px",
                border: `1px solid ${M.glassBdr}`, background: M.glassBg,
                backdropFilter: liquidBlur, WebkitBackdropFilter: liquidBlur,
                color: M.mid, fontWeight: 600, fontSize: "14px", fontFamily: "'Space Mono', monospace",
                transition: "all 0.2s", display: "inline-block",
                boxShadow: "0 0 0 0.5px rgba(0,255,65,0.12), 0 8px 24px rgba(0,0,0,0.4)",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = M.glassBgHov; e.currentTarget.style.borderColor = M.glassBdrHov; e.currentTarget.style.color = M.bright; e.currentTarget.style.boxShadow = shadowHover; }}
                onMouseLeave={e => { e.currentTarget.style.background = M.glassBg; e.currentTarget.style.borderColor = M.glassBdr; e.currentTarget.style.color = M.mid; e.currentTarget.style.boxShadow = "0 0 0 0.5px rgba(0,255,65,0.12), 0 8px 24px rgba(0,0,0,0.4)"; }}
              >
                LinkedIn ↗
              </a>
                          {/* Resume download */}
            <a
              href={`${import.meta.env.BASE_URL}resume/Gourilakshmi_Neerajkumar_Resume.pdf`}
              download="Gourilakshmi_Neerajkumar_Resume.pdf"
              style={{
                padding: "14px 32px", borderRadius: "12px",
                border: `1px solid ${M.glassBdr}`, background: M.glassBg,
                backdropFilter: liquidBlur, WebkitBackdropFilter: liquidBlur,
                color: M.mid, fontWeight: 600, fontSize: "14px", fontFamily: "'Space Mono', monospace",
                transition: "all 0.2s", display: "inline-block",
                boxShadow: "0 0 0 0.5px rgba(0,255,65,0.12), 0 8px 24px rgba(0,0,0,0.4)",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = M.glassBgHov; e.currentTarget.style.borderColor = M.glassBdrHov; e.currentTarget.style.color = M.bright; e.currentTarget.style.boxShadow = shadowHover; }}
              onMouseLeave={e => { e.currentTarget.style.background = M.glassBg; e.currentTarget.style.borderColor = M.glassBdr; e.currentTarget.style.color = M.mid; e.currentTarget.style.boxShadow = "0 0 0 0.5px rgba(0,255,65,0.12), 0 8px 24px rgba(0,0,0,0.4)"; }}
            >
              Resume ↓
            </a>
            </div>
          </FadeIn>
        </div>
        <div className="site-footer" style={{ borderTop: `1px solid ${M.dark}`, textAlign: "center", padding: "24px", fontFamily: "'Space Mono', monospace", fontSize: "11px", color: M.dark }}>
          © 2026 Gourilakshmi Neerajkumar
        </div>
      </section>
    </div>
  );
}