import { useState, useEffect } from "react";
import MatrixCursor from "./MatrixCursor.jsx";
import Skills from "./Skills.jsx";
import PixelIcon from "./PixelIcon.jsx";
import About from "./About.jsx";
import { M, liquidBlur, useFitHeadings, FadeIn, Card, FeatureCard, SiteStyles, LiquidButton, GridBackground } from "./theme.jsx";

const MOBILE_NAV = ["home", "skills", "experience", "projects", "contact"];
const NAV_LINKS = ["home", "about", "skills", "experience", "research", "projects", "leadership", "contact"];

// Experience first, then research, each as its own section.
const TIMELINE_SECTIONS = [
  { id: "experience", index: "03", title: "Experience", match: (e) => e.kind !== "research" },
  { id: "research", index: "04", title: "Research", match: (e) => e.kind === "research" },
];

const EXPERIENCES = [
  {
    title: "Quality Assurance Intern",
    org: "Mercury Security – HID Global · Cypress, CA",
    period: "May 2026 – Aug 2026",
    tags: ["MQTT", "Docker", "QEMU", "Embedded Linux", "RS-485", "TLS", "Wireshark", "Jenkins", "TestRail", "Jira", "SonarQube", "Bitbucket", "Grafana"],
    desc: "Built a cross-architecture MQTT file transfer pipeline between an x64 Windows host and an ARM-based Linux controller with Docker and QEMU, and tracked down broker DNS failures with Wireshark. Validated 2 releases and 2 hotfixes through TestRail runs on Jenkins builds and automated tests on physical controller rigs, resolved Jira bugs in controller firmware and its web configuration interface, and ran compatibility testing of readers, locks, and SIOs over RS-485. Also built a Grafana dashboard of release test results for people outside engineering.",
    icon: "lock",
  },
  {
    title: "Undergraduate Researcher – Graph Theory",
    kind: "research",
    org: "Dept. of Mathematical Sciences, UWM · MAA, NSF",
    period: "May 2025 – Spring 2026",
    tags: ["Graph Theory", "Academic Writing", "LaTeX"],
    desc: "Researched Truncated Square Graphs with a focus on Total Restricted Broadcast Domination, working on questions proposed by J. Cervantes and P. Harris. Analyzed single-vertex broadcasts, eccentricity, and graph connectivity relationships, and presented the findings at a conference in Fall 2025. A paper on the final results is in progress.",
    icon: "chart",
  },
  {
    title: "Exhibit Maintenance",
    org: "Discovery World, Milwaukee",
    period: "Jul 2024 – Sep 2024",
    tags: ["C++", "Python", "Arduino", "Raspberry Pi","3D Modeling", "Relays"],
    desc: "Redesigned and built a 3D circuit for the Wimshurst machine using an Arduino Uno and relays programmed in C++. Rebuilt the Elements Display with a Raspberry Pi (Python) and touch pads to get visitors interacting with it.",
    icon: "lightbulb",
  },
  {
    title: "SURF Fellow – LC-3 Visualization Tool",
    kind: "research",
    org: "Support for Undergraduate Research Fellows\nCollege of Engineering & Applied Sciences, UWM",
    period: "Sep 2024 – Dec 2024",
    tags: ["LC-3", "Testing", "Debugging", "Documentation"],
    desc: "Tested and debugged an educational LC-3 visualization tool, and wrote its project documentation and user manual.",
    icon: "monitor",
  },
  {
    title: "SURF Fellow – Solar Light Sculpture",
    kind: "research",
    org: "Support for Undergraduate Research Fellows\nCollege of Engineering & Applied Sciences, UWM",
    period: "Sep 2023 – Aug 2024",
    tags: ["PIC24", "C", "MPLAB X", "Oscilloscope", "Embedded Systems"],
    desc: "Wrote bare-metal C firmware for a PIC24 on a solar sculpture that stores sunlight by day and drives light performances at night, working from circuit schematics with an oscilloscope and circuit debugger in MPLAB X on Linux.",
    icon: "sun",
  },
];

const LEADERSHIP = [
  { title: "President", org: "Student Association of India, UWM", period: "Aug 2024 – Present", desc: "Lead a 4-person officer team running 20+ cultural and social events for 1,000+ attendees on a limited budget." },
  { title: "Emotional Health Program Assistant", org: "Student Health and Wellness Center (SHAW), UWM", period: "Aug 2026 – Present", desc: "Co-facilitate You Can Help Prevent Suicide trainings and run programming for the Bandana Project, a student-led effort to reduce mental health stigma on campus. I handle training logistics and data; 203 people trained so far." },
  { title: "Teaching Assistant", org: "Girls Who Code, Milwaukee", period: "Sep 2026 – Present", desc: "Teach Python to elementary and middle school girls through hands-on coding activities." },
  { title: "Math Tutor", org: "Student Success Center, UWM", period: "Aug 2024 – Present", desc: "Helped 300+ students work through hard math concepts by breaking them down step by step." },
  { title: "Future Alumni Network Ambassador", org: "University Advancement, UWM", period: "Sep 2023 – May 2026", desc: "Reached 1,232+ alumni through outreach, raising $25,000+ for student scholarships and grants." },
  { title: "Orientation Leader", org: "UWM", period: "Summer 2024, Summer 2025", desc: "Two terms guiding 500+ incoming students through the move into academic and campus life." },
  { title: "International Advocacy Senator", org: "Student Association, UWM", period: "Aug 2024 – May 2025", desc: "Represented international students in the Student Association and pushed for campus policies that addressed their concerns." },
  { title: "ArtsECO Intern", org: "UWM", period: "May 2024 – Aug 2024", desc: "Planned lessons and hands-on workshops for a pre-college program for Milwaukee middle and high school students interested in arts careers." },
];

const PROJECTS = [
  { title: "Cache Simulator", link: "https://github.com/s4ig0n/Cache-Simulator", desc: "C++ cache simulator that replays Valgrind traces of real C programs. Configurable size, block size, and associativity, LRU and FIFO, write-back and write-through, an optional L2, and multi-core MESI coherence. Matches Cachegrind's L1 miss counts within 0.06% across 16 configurations, with 33 checks running in CI.", tags: ["C++", "Valgrind", "MESI", "Python", "GitHub Actions"] },
  { title: "eight-wide", link: "https://github.com/s4ig0n/eight-wide", desc: "AVX2/FMA matrix multiply in C, benchmarked against naive and cache-friendly scalar kernels at N=512. Loop order gave 3.7x, SIMD another 3.9x, and 128×128 cache blocking took it to 17.8x over naive (1.64 to 29.15 GFLOP/s).", tags: ["C", "AVX2", "FMA", "CMake"] },
  { title: "MQTT Device Test Harness", link: "https://github.com/s4ig0n/mqtt-device-test-harness", desc: "47 pytest tests for a simulated MQTT thermostat, driven only through its messaging interface: connection lifecycle, Last Will, JSON Schema telemetry, command edge cases, and fault injection. Found a retained-message bug in the amqtt broker that violates MQTT 3.1.1 and fixed two race conditions behind flaky tests.", tags: ["Python", "pytest", "MQTT", "JSON Schema", "CI"] },
  { title: "On-Street Parking Estimation", desc: "Senior capstone with Inflow, Inc.: turning footage from vehicle-mounted patrol cameras into street parking occupancy maps. I own the computer vision side (YOLO vehicle detection, ALPR/OCR) and work directly with Inflow's CTO on the system design. In progress, through May 2027.", tags: ["Python", "YOLO", "ALPR/OCR", "Computer Vision"] },
  { title: "Heist", desc: "Two-person PayPal AI Hackathon project that sends adversarial AI customers after a merchant's AI support agent and counts the real PayPal sandbox refunds it gets talked into. I built the target support agent and a policy guard that allows, denies, or holds every money-moving call, with Vitest coverage on every rule.", tags: ["TypeScript", "Next.js", "Vercel AI SDK", "PayPal Agent Toolkit", "Vitest"] },
  { title: "trace", link: "https://github.com/s4ig0n/trace", desc: "Privacy-first browser app for keeping evidence. Original files are stored as immutable records in IndexedDB with SHA-256 hashes computed locally, plus case timelines, image redaction on copies, and PDF/ZIP report export. No accounts, analytics, or uploads, and it installs as an offline PWA.", tags: ["React", "TypeScript", "Vite", "IndexedDB", "Vitest"] },
  { title: "xv6 Priority Scheduler", desc: "Changing the xv6 kernel's scheduler on RISC-V from round robin to priority-based scheduling in C, building and testing in Docker. In progress.", tags: ["C", "xv6", "RISC-V", "Docker"] },
  { title: "MQTT File Transfer Pipeline", desc: "Cross-architecture pipeline between an x64 Windows host and an ARM-based Linux access controller, deployed with Docker and QEMU. JSON messages carry file metadata, and the controller bundles requested files into a single tar archive that downloads automatically to the PC.", tags: ["MQTT", "Docker", "QEMU", "ARM Linux"] },
  { title: "Mothers Against Gun Violence Website", desc: "Nonprofit client project mentored by Direct Supply. On a four-person team, redesigned a Milwaukee nonprofit's WordPress site under a new brand identity, added a donation plugin to simplify online giving, and built pages for the founder's story and a map of murals honoring gun violence victims, while improving accessibility.", tags: ["WordPress", "Accessibility", "UI/UX", "Client Work"] },
  { title: "UPAF Request Platform", desc: "Team client project for the United Performing Arts Fund. We built a JotForm request workflow with admin approval that creates the record, a PDF, and a calendar event, and moved 5,337 records from 2011 to 2026 out of Microsoft Access.", tags: ["JotForm", "Automation", "Data Migration", "Client Work"] },
  { title: "Scheduling Management Web App", desc: "Role-based scheduling system with dedicated dashboards for students, TAs, instructors, and admins. Built the Django backend and responsive Bootstrap UI in a scrum-based team.", tags: ["Django", "Bootstrap", "Python", "Agile"] },
  { title: "LC-3 Visualization Tool", desc: "Tested and debugged an educational LC-3 visualization tool as a SURF fellow, and wrote its project documentation and user manual.", tags: ["LC-3", "Testing", "Documentation"] },
  { title: "Solar Light Sculpture", desc: "Engineered a solar-powered sculpture that stores energy during the day and drives interactive light performances at night using PIC24 and MPLAB X.", tags: ["PIC24", "MPLAB X", "Embedded"] },
  { title: "Wimshurst Machine Redesign", desc: "Modernized a classic electrostatic generator at Discovery World using Arduino and relay-based control, programmed in C++.", tags: ["Arduino", "C++", "Hardware"] },
  { title: "Elements Display (Raspberry Pi)", desc: "Rebuilt the periodic elements interactive display from scratch at Discovery World using a Raspberry Pi, programmed in Python.", tags: ["Raspberry Pi", "Python", "Linux"] },
];

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  useFitHeadings();

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
            className={`side-nav-item ${activeSection === l ? "active" : ""} ${MOBILE_NAV.includes(l) ? "" : "nav-desktop-only"}`}
            onClick={() => scrollTo(l)}
          >
            <span className={`side-nav-label ${activeSection === l ? "active" : ""}`}>{l}</span>
            <span className={`side-nav-dot ${activeSection === l ? "active" : ""}`} />
          </div>
        ))}
      </nav>

      {/* HERO */}
      <section id="home" className="hero" style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1, padding: "0 24px" }}>
        <div style={{ textAlign: "center", maxWidth: 1000, width: "100%" }}>
          <div style={{ position: "absolute", top: "20%", left: "10%", width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,255,65,0.12), transparent)", animation: "float 6s ease-in-out infinite", filter: "blur(40px)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: "25%", right: "8%", width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,179,0,0.10), transparent)", animation: "float 8s ease-in-out infinite 2s", filter: "blur(50px)", pointerEvents: "none" }} />

          <div style={{ opacity: 0.8, fontFamily: "'Space Mono', monospace", fontSize: "12px", letterSpacing: "3px", color: M.mid, marginBottom: "20px", textTransform: "uppercase" }}>
            <span className="dot" />Senior @ UWM · CS with Honors
          </div>

          <h1 className="name-pixel">Gourilakshmi Neerajkumar</h1>

          <p style={{ fontSize: "17px", color: M.dim, maxWidth: 520, margin: "0 auto 36px", lineHeight: 1.7, fontWeight: 300 }}>
            Call me gouri.<br /> I build things and occassionally break things- usually on purpose ;)
          </p>

          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <LiquidButton href="#experience" onClick={() => scrollTo("experience")}>View Work →</LiquidButton>
            <LiquidButton href="#contact" onClick={() => scrollTo("contact")}>Contact</LiquidButton>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" style={{ position: "relative", zIndex: 1 }}>
        <div className="section">
          <FadeIn>
            <div style={{ marginBottom: "48px" }}>
              <p style={{ fontFamily: "'Space Mono', monospace", color: M.mid, fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "8px" }}>01 / about</p>
              <h2 className="section-title">About Me</h2>
              <div style={{ width: "48px", height: "3px", background: `linear-gradient(90deg, ${M.mid}, ${M.bright})`, borderRadius: "2px", marginTop: "12px" }} />
            </div>
          </FadeIn>
          <About />
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

      {/* EXPERIENCE, then RESEARCH */}
      {TIMELINE_SECTIONS.map((sec) => (
        <section key={sec.id} id={sec.id} style={{ position: "relative", zIndex: 1 }}>
          <div className="section">
            <FadeIn>
              <div style={{ marginBottom: "48px" }}>
                <p style={{ fontFamily: "'Space Mono', monospace", color: M.mid, fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "8px" }}>{sec.index} / {sec.id}</p>
                <h2 className="section-title">{sec.title}</h2>
                <div style={{ width: "48px", height: "3px", background: `linear-gradient(90deg, ${M.mid}, ${M.bright})`, borderRadius: "2px", marginTop: "12px" }} />
              </div>
            </FadeIn>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {EXPERIENCES.filter(sec.match).map((exp, i) => (
                <FadeIn key={exp.title} delay={i * 0.1}>
                  <Card>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                      <PixelIcon name={exp.icon} size={26} />
                      <h3 className="exp-title" style={{ fontFamily: "'VT323', monospace", fontSize: "28px", color: M.bright }}>{exp.title}</h3>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "4px 16px", marginBottom: "12px" }}>
                      <p style={{ fontSize: "13px", color: M.dim, fontFamily: "'Space Mono', monospace", whiteSpace: "pre-line", lineHeight: 1.6 }}>{exp.org}</p>
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
      ))}

      {/* PROJECTS & ACHIEVEMENTS */}
      <section id="projects" style={{ position: "relative", zIndex: 1 }}>
        <div className="section">
          <FadeIn>
            <div style={{ marginBottom: "48px" }}>
              <p style={{ fontFamily: "'Space Mono', monospace", color: M.mid, fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "8px" }}>05 / projects & achievements</p>
              <h2 className="section-title">Projects & Achievements</h2>
              <div style={{ width: "48px", height: "3px", background: `linear-gradient(90deg, ${M.mid}, ${M.bright})`, borderRadius: "2px", marginTop: "12px" }} />
            </div>
          </FadeIn>

          {/* Dean's List — liquid glass FeatureCard */}
          <FadeIn delay={0.1}>
            <FeatureCard>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", color: M.mid, letterSpacing: "2px", marginBottom: "16px" }}><PixelIcon name="book-open" size={14} style={{ marginRight: 8, marginTop: -2 }} />UWM · 2023–Present</div>
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
                  <div className="banner-eyebrow"><PixelIcon name="trophy" size={14} style={{ marginRight: 8, marginTop: -2 }} />High Impact Award · MKE Tech FUSE · Oct 2026</div>
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
                  <div className="banner-eyebrow one-line"><PixelIcon name="users" size={14} style={{ marginRight: 8, marginTop: -2 }} />NVIDIA + Rockwell Automation Hackathon · Nov 2026</div>
                  <div className="banner-eyebrow" style={{ paddingLeft: 22 }}>Team Lead</div>
                  <h3>Overclocked</h3>
                  <p>Vision-guided pick and place on a real FANUC robot cell that checks every grasp and looks again after a miss.</p>
                </div>
                <LiquidButton small href="#/projects/overclocked">View project →</LiquidButton>
              </div>
            </Card>
          </FadeIn>

          <div className="grid-2">
            {PROJECTS.map((p, i) => (
              <FadeIn key={p.title} delay={0.2 + i * 0.05}>
                <Card>
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

      {/* LEADERSHIP */}
      <section id="leadership" style={{ position: "relative", zIndex: 1 }}>
        <div className="section">
          <FadeIn>
            <div style={{ marginBottom: "48px" }}>
              <p style={{ fontFamily: "'Space Mono', monospace", color: M.mid, fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "8px" }}>06 / leadership</p>
              <h2 className="section-title">Leadership</h2>
              <div style={{ width: "48px", height: "3px", background: `linear-gradient(90deg, ${M.mid}, ${M.bright})`, borderRadius: "2px", marginTop: "12px" }} />
            </div>
          </FadeIn>
          <div className="grid-2" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
            {LEADERSHIP.map((l, i) => (
              <FadeIn key={l.title} delay={0.05 * i}>
                <Card style={{ height: "100%" }}>
                  <h3 style={{ fontFamily: "'VT323', monospace", fontSize: "24px", color: M.bright, marginBottom: "4px" }}>{l.title}</h3>
                  <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", color: M.dim, marginBottom: "2px" }}>{l.org}</p>
                  <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", color: M.mid, marginBottom: "12px" }}>{l.period}</p>
                  <p style={{ fontSize: "14px", color: M.textSec, lineHeight: 1.6 }}>{l.desc}</p>
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
            <p style={{ fontFamily: "'Space Mono', monospace", color: M.mid, fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "16px" }}>07 / contact</p>
            <h2 className="section-title" style={{ marginBottom: "16px" }}>Intrigued? Let's Connect</h2>
            <p style={{ color: M.dim, marginBottom: "40px", fontSize: "15px" }}>Graduating May 2027. Open to full-time roles starting in 2027, research, and cool projects.</p>
            <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
              <LiquidButton href="mailto:neerajk2@uwm.edu">Email ↗</LiquidButton>
              <LiquidButton href="https://www.linkedin.com/in/gourilakshmineerajkumar" external>LinkedIn ↗</LiquidButton>
              <LiquidButton href={`${import.meta.env.BASE_URL}resume/Gourilakshmi_Neerajkumar_Resume.pdf`} download="Gourilakshmi_Neerajkumar_Resume.pdf">Resume (1 page) ↓</LiquidButton>
              <LiquidButton href={`${import.meta.env.BASE_URL}resume/Gourilakshmi_Neerajkumar_CV.pdf`} download="Gourilakshmi_Neerajkumar_CV.pdf">Full CV ↓</LiquidButton>
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
