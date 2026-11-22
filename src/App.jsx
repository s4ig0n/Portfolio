import { useState, useEffect } from "react";
import MatrixCursor from "./MatrixCursor.jsx";
import Skills from "./Skills.jsx";
import { M, liquidBlur, shadowHover, FadeIn, Card, FeatureCard, SiteStyles, LiquidButton, GridBackground } from "./theme.jsx";

const NAV_LINKS = ["home", "skills", "experience", "projects", "contact"];

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
    period: "May 2025 – Spring 2026",
    tags: ["Graph Theory", "MATLAB", "Academic Writing", "LaTeX"],
    desc: "Researched Truncated Square Graphs with a focus on Total Restricted Broadcast Domination, working on questions proposed by J. Cervantes and P. Harris. Analyzed single-vertex broadcasts, eccentricity, and graph connectivity relationships, and presented the findings at a conference in Fall 2025. A paper on the final results is in progress.",
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
    title: "SURF Recipient (Three-Time)",
    org: "College of Engineering & Applied Sciences, UWM",
    period: "Sep 2023 – Spring 2026",
    tags: ["PIC24", "MPLAB X", "Embedded Systems", "LC-3", "Testing", "Graph Theory"],
    desc: "First award: wrote bare-metal C firmware for a PIC24 on a solar sculpture that stores sunlight by day and drives light performances at night, working from circuit schematics with a circuit debugger in MPLAB X on Linux. Second award: tested and debugged an LC-3 visualization tool and wrote its documentation and user manual. Third award: funded the continuation of my graph theory research through Spring 2026.",
    icon: "☀️",
  },
];

const PROJECTS = [
  { icon: "🧠", title: "Cache Simulator", link: "https://github.com/s4ig0n/Cache-Simulator", desc: "C++ cache simulator that replays Valgrind traces of real C programs. Configurable size, block size, and associativity, LRU and FIFO, write-back and write-through, an optional L2, and multi-core MESI coherence. Matches Cachegrind's L1 miss counts within 0.06% across 16 configurations, with 33 checks running in CI.", tags: ["C++", "Valgrind", "MESI", "Python", "GitHub Actions"] },
  { icon: "⚡", title: "eight-wide", link: "https://github.com/s4ig0n/eight-wide", desc: "AVX2/FMA matrix multiply in C, benchmarked against naive and cache-friendly scalar kernels at N=512. Loop order gave 3.7x, SIMD another 3.9x, and 128×128 cache blocking took it to 17.8x over naive (1.64 to 29.15 GFLOP/s).", tags: ["C", "AVX2", "FMA", "CMake"] },
  { icon: "🧪", title: "MQTT Device Test Harness", link: "https://github.com/s4ig0n/mqtt-device-test-harness", desc: "47 pytest tests for a simulated MQTT thermostat, driven only through its messaging interface: connection lifecycle, Last Will, JSON Schema telemetry, command edge cases, and fault injection. Found a retained-message bug in the amqtt broker that violates MQTT 3.1.1 and fixed two race conditions behind flaky tests.", tags: ["Python", "pytest", "MQTT", "JSON Schema", "CI"] },
  { icon: "📡", title: "MQTT File Transfer Pipeline", desc: "Cross-architecture pipeline between an x64 Windows host and an ARM-based Linux access controller, deployed with Docker and QEMU. JSON messages carry file metadata, and the controller bundles requested files into a single tar archive that downloads automatically to the PC.", tags: ["MQTT", "Docker", "QEMU", "ARM Linux"] },
  { icon: "🗓️", title: "Scheduling Management Web App", desc: "Role-based scheduling system with dedicated dashboards for students, TAs, instructors, and admins. Built the Django backend and responsive Bootstrap UI in a scrum-based team.", tags: ["Django", "Bootstrap", "Python", "Agile"] },
  { icon: "🧮", title: "LC-3 Visualization Tool", desc: "Tested and debugged an educational LC-3 visualization tool as a SURF fellow, and wrote its project documentation and user manual.", tags: ["LC-3", "Testing", "Documentation"] },
  { icon: "☀️", title: "Solar Light Sculpture", desc: "Engineered a solar-powered sculpture that stores energy during the day and drives interactive light performances at night using PIC24 and MPLAB X.", tags: ["PIC24", "MPLAB X", "Embedded"] },
  { icon: "⚗️", title: "Wimshurst Machine Redesign", desc: "Modernized a classic electrostatic generator at Discovery World using Arduino and relay-based control, programmed in C++.", tags: ["Arduino", "C++", "Hardware"] },
  { icon: "🫐", title: "Elements Display (Raspberry Pi)", desc: "Rebuilt the periodic elements interactive display from scratch at Discovery World using a Raspberry Pi, programmed in Python.", tags: ["Raspberry Pi", "Python", "Linux"] },
];

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (window.location.hash === "#projects") {
      requestAnimationFrame(() => document.getElementById("projects")?.scrollIntoView());
    }
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

      <SiteStyles />

      {/* Y2K x Matrix cursor: glow torch + pixel arrow + glyph trail */}
      <MatrixCursor />

      <GridBackground />

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

          <h1 className="name-pixel">Gourilakshmi<br />Neerajkumar</h1>

          <p style={{ fontSize: "17px", color: M.dim, maxWidth: 520, margin: "0 auto 36px", lineHeight: 1.7, fontWeight: 300 }}>
            Call me gouri.<br /> I build things and occassionally break things- usually on purpose ;)
          </p>

          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <LiquidButton href="#experience" onClick={() => scrollTo("experience")}>View Work →</LiquidButton>
            <LiquidButton href="#contact" onClick={() => scrollTo("contact")}>Contact</LiquidButton>
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
          <Skills />
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
                    <h3 className="exp-title" style={{ fontFamily: "'VT323', monospace", fontSize: "28px", color: M.bright }}>{exp.title}</h3>
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
              <h3 style={{ fontFamily: "'VT323', monospace", fontSize: "35px", marginBottom: "12px", color: M.bright }}>Dean's List Student</h3>
              <p style={{ color: M.textSec, lineHeight: 1.7, maxWidth: "600px", marginBottom: "16px" }}>
                Consistent academic excellence over full-time coursework, <strong style={{ color: M.bright }}>maintaining a GPA of 3.7 or higher every semester.</strong>
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

          <FadeIn delay={0.2}>
            <Card style={{ marginBottom: "20px" }}>
              <div className="banner-row">
                <div className="banner-main">
                  <div className="banner-eyebrow">⚙️ Team Lead · NVIDIA + Rockwell Automation Hackathon · Nov 2026</div>
                  <h3>Overclocked</h3>
                  <p>Vision-guided pick and place on a real FANUC robot cell that checks every grasp and looks again after a miss.</p>
                </div>
                <a className="status-pill" href="#/projects/overclocked">View project →</a>
              </div>
            </Card>
          </FadeIn>

          <div className="grid-2">
            {PROJECTS.map((p, i) => (
              <FadeIn key={p.title} delay={0.2 + i * 0.05}>
                <Card>
                  <div style={{ fontSize: "28px", marginBottom: "16px" }}>{p.icon}</div>
                  <h3 style={{ fontFamily: "'VT323', monospace", fontSize: "23px", marginBottom: "10px", color: M.bright }}>{p.title}</h3>
                  <p style={{ fontSize: "14px", color: M.textSec, lineHeight: 1.65 }}>{p.desc}</p>
                  <div style={{ marginTop: "16px" }}>{p.tags.map(t => <span key={t} className="tag">{t}</span>)}</div>
                  {p.link && <a className="repo-link" href={p.link} target="_blank" rel="noopener noreferrer">GitHub ↗</a>}
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
            <p style={{ color: M.dim, marginBottom: "40px", fontSize: "15px" }}>Graduating May 2027. Open to full-time roles starting in 2027, research, and cool projects.</p>
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
              Resume (1 page) ↓
            </a>
            <a
              href={`${import.meta.env.BASE_URL}resume/Gourilakshmi_Neerajkumar_CV.pdf`}
              download="Gourilakshmi_Neerajkumar_CV.pdf"
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
              Full CV ↓
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
