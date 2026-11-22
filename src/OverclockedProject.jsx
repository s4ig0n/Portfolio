import { useState, useEffect } from "react";
import MatrixCursor from "./MatrixCursor.jsx";
import PixelIcon from "./PixelIcon.jsx";
import { M, liquidBlur, useFitHeadings, FadeIn, Card, FeatureCard, SiteStyles, LiquidButton, GridBackground } from "./theme.jsx";

const ASSETS = `${import.meta.env.BASE_URL}projects/overclocked`;
const GITHUB_URL = "https://github.com/ALL-Applied-AI-Network/overclocked";

const NAV = [
  { id: "top", label: "top" },
  { id: "overview", label: "overview" },
  { id: "approach", label: "approach" },
  { id: "results", label: "results" },
  { id: "video", label: "video" },
];

const STEPS = [
  { title: "Look", desc: "Table, wrist, and side cameras find a part and the destination bin. Color and silhouette detection runs first, with OWLv2 open-vocabulary detection on an NVIDIA DGX Spark." },
  { title: "Pick", desc: "The wrist RGB-D camera refines where the gripper should close before the FANUC ER-4iA moves in." },
  { title: "Check", desc: "A side camera and a classifier on frozen NVIDIA C-RADIOv2 features decide whether the part is actually held before it gets carried." },
  { title: "Look again", desc: "If the grasp looks empty, the arm skips the carry, looks at the table again, and retries. Dropped and hand-moved cubes get picked back up." },
];

const STATS = [
  { value: "12 / 12", label: "cubes placed across three clean real-cell runs after recalibration" },
  { value: "0.958", label: "held-out AUC for the grasp check, on 107 labeled crops from 41 grasps" },
  { value: "1.39 ms", label: "grasp-check inference with TensorRT FP16" },
];

function SectionHeader({ index, label, title }) {
  return (
    <FadeIn>
      <div style={{ marginBottom: "48px" }}>
        <p style={{ fontFamily: "'Space Mono', monospace", color: M.mid, fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "8px" }}>{index} / {label}</p>
        <h2 className="section-title">{title}</h2>
        <div style={{ width: "48px", height: "3px", background: `linear-gradient(90deg, ${M.mid}, ${M.bright})`, borderRadius: "2px", marginTop: "12px" }} />
      </div>
    </FadeIn>
  );
}

const cardTitle = { fontFamily: "'VT323', monospace", fontSize: "24px", marginBottom: "10px", color: M.bright };
const cardText = { fontSize: "14px", color: M.textSec, lineHeight: 1.65 };
const caption = { fontFamily: "'Space Mono', monospace", fontSize: "11px", color: M.dim, marginTop: "12px", lineHeight: 1.6 };
const twoCol = { gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" };
const media = { width: "100%", display: "block", borderRadius: "10px" };

export default function OverclockedProject() {
  const [active, setActive] = useState("top");
  const [scrolled, setScrolled] = useState(false);
  useFitHeadings();

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Overclocked | GLN Portfolio";
    window.scrollTo(0, 0);
    return () => { document.title = previousTitle; };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }),
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    NAV.forEach(({ id }) => { const el = document.getElementById(id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setActive(id);
  };

  return (
    <div style={{ background: M.bg, minHeight: "100vh", color: M.bright, fontFamily: "'DM Sans', sans-serif", overflowX: "hidden" }}>
      <SiteStyles />
      <MatrixCursor />

      <GridBackground />

      {/* Brand mark, same as the home page; links back to projects */}
      <a href="#projects" aria-label="Back to portfolio projects" style={{
        position: "fixed", top: 0, left: 0, zIndex: 100, padding: "20px 28px",
        background: scrolled ? "rgba(22,22,29,0.75)" : "transparent",
        backdropFilter: scrolled ? liquidBlur : "none", WebkitBackdropFilter: scrolled ? liquidBlur : "none",
        borderBottomRightRadius: scrolled ? "14px" : 0, transition: "all 0.3s ease",
        fontFamily: "'Space Mono', monospace", fontSize: "14px", color: M.bright, fontWeight: 700,
      }}>
        ← GLN<span style={{ animation: "blink 1.2s infinite", display: "inline-block" }}>_</span>
      </a>

      <nav className="side-nav" aria-label="Section navigation">
        {NAV.map(({ id, label }) => (
          <div key={id} className={`side-nav-item ${active === id ? "active" : ""}`} onClick={() => scrollTo(id)}>
            <span className={`side-nav-label ${active === id ? "active" : ""}`}>{label}</span>
            <span className={`side-nav-dot ${active === id ? "active" : ""}`} />
          </div>
        ))}
      </nav>

      {/* HERO */}
      <section id="top" className="hero" style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1, padding: "0 24px" }}>
        <div style={{ textAlign: "center", maxWidth: 1000, width: "100%" }}>
          <div style={{ position: "absolute", top: "20%", left: "10%", width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,255,65,0.12), transparent)", animation: "float 6s ease-in-out infinite", filter: "blur(40px)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: "25%", right: "8%", width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,179,0,0.10), transparent)", animation: "float 8s ease-in-out infinite 2s", filter: "blur(50px)", pointerEvents: "none" }} />

          <div style={{ opacity: 0.8, fontFamily: "'Space Mono', monospace", fontSize: "12px", letterSpacing: "3px", color: M.mid, marginBottom: "20px", textTransform: "uppercase" }}>
            <span className="dot" />NVIDIA + Rockwell Automation Hackathon · Nov 2026
          </div>

          <h1 className="name-pixel">Overclocked</h1>

          <p style={{ fontSize: "17px", color: M.dim, maxWidth: 560, margin: "0 auto 36px", lineHeight: 1.7, fontWeight: 300 }}>
            Vision-guided pick and place on a real FANUC robot cell.<br />It checks every grasp and looks again after a miss.
          </p>

          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <LiquidButton href={GITHUB_URL} external>GitHub ↗</LiquidButton>
            <LiquidButton href="#video">Watch the demo ↓</LiquidButton>
          </div>
        </div>
      </section>

      {/* OVERVIEW */}
      <section id="overview" style={{ position: "relative", zIndex: 1 }}>
        <div className="section">
          <SectionHeader index="01" label="overview" title="The Problem & My Part" />
          <div className="grid-2" style={twoCol}>
            <FadeIn delay={0.1}>
              <Card>
                <h3 style={cardTitle}>Taught positions break</h3>
                <p style={cardText}>A fixed pick position works until a part lands a few millimeters off, a fixture moves, or a camera gets bumped. Then you get a silent miss, a controller fault, or another round of manual re-teaching.</p>
              </Card>
            </FadeIn>
            <FadeIn delay={0.2}>
              <Card>
                <h3 style={cardTitle}>What I did</h3>
                <p style={cardText}>Led Team Overclocked and wrote the Python pick-and-place policies: picking and placing, missed-grasp detection, and depth measurement. The policy checks whether a part is held before carrying it, and re-observes and retries when it isn't.</p>
              </Card>
            </FadeIn>
          </div>
          <FadeIn delay={0.25}>
            <div style={{ marginTop: "20px" }}>
              {["Python", "OpenCV", "OWLv2", "NVIDIA C-RADIOv2", "TensorRT", "DGX Spark", "Isaac Sim", "FANUC ER-4iA"].map(t => <span key={t} className="tag">{t}</span>)}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* APPROACH */}
      <section id="approach" style={{ position: "relative", zIndex: 1 }}>
        <div className="section">
          <SectionHeader index="02" label="approach" title="Look, Pick, Check, Repeat" />
          <div className="grid-2" style={twoCol}>
            {STEPS.map((s, i) => (
              <FadeIn key={s.title} delay={0.1 + i * 0.05}>
                <Card style={{ height: "100%" }}>
                  <h3 style={cardTitle}>{s.title}</h3>
                  <p style={cardText}>{s.desc}</p>
                </Card>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={0.2}>
            <Card style={{ marginTop: "20px" }}>
              <img src={`${ASSETS}/workflow.png`} alt="Six-step workflow from table camera detection through grasp checking and looking again" style={media} />
              <p style={caption}>The full loop. Nothing is picked from a hard-coded coordinate.</p>
            </Card>
          </FadeIn>
          <FadeIn delay={0.25}>
            <Card style={{ marginTop: "20px" }}>
              <h3 style={cardTitle}>Simulation first, then the real cell</h3>
              <p style={cardText}>We started with reinforcement learning in NVIDIA Isaac Sim, launched on Brev, plus mock scenes for geometry and safety checks. The simulated behavior didn't carry over to the arm, so final development and every number on this page come from the physical cell.</p>
            </Card>
          </FadeIn>
        </div>
      </section>

      {/* RESULTS */}
      <section id="results" style={{ position: "relative", zIndex: 1 }}>
        <div className="section">
          <SectionHeader index="03" label="results" title="Results on Real Hardware" />
          <FadeIn delay={0.1}>
            <FeatureCard>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", color: M.mid, letterSpacing: "2px", marginBottom: "16px" }}><PixelIcon name="bullseye" size={14} style={{ marginRight: 8, marginTop: -2 }} />REAL CELL · TEAM RESULT</div>
              <h3 style={{ fontFamily: "'VT323', monospace", fontSize: "35px", marginBottom: "12px", color: M.bright }}>12 of 12 cubes placed</h3>
              <p style={{ color: M.textSec, lineHeight: 1.7, maxWidth: "600px" }}>
                With stale calibration, 0 of 3 runs finished and the controller faulted three times. The camera-to-gripper offset had drifted about 13 mm between test days. <strong style={{ color: M.bright }}>After recalibrating, the system placed all 12 cubes across three clean runs.</strong>
              </p>
            </FeatureCard>
          </FadeIn>
          <div className="grid-2" style={twoCol}>
            {STATS.slice(1).map((s, i) => (
              <FadeIn key={s.value} delay={0.15 + i * 0.05}>
                <Card style={{ height: "100%" }}>
                  <h3 style={{ fontFamily: "'VT323', monospace", fontSize: "35px", marginBottom: "8px", color: "#00ff41" }}>{s.value}</h3>
                  <p style={cardText}>{s.label}</p>
                </Card>
              </FadeIn>
            ))}
            <FadeIn delay={0.25}>
              <Card style={{ height: "100%" }}>
                <img src={`${ASSETS}/vision-finds-parts.png`} alt="Three camera views locating cubes on the table" style={media} />
                <p style={caption}>Three camera views locating cubes during a recorded run.</p>
              </Card>
            </FadeIn>
            <FadeIn delay={0.3}>
              <Card style={{ height: "100%" }}>
                <img src={`${ASSETS}/result-12-of-12.png`} alt="Stale calibration compared with 12 of 12 cubes placed after recalibration" style={media} />
                <p style={caption}>Stale calibration versus recalibrated runs.</p>
              </Card>
            </FadeIn>
          </div>
          <FadeIn delay={0.2}>
            <Card style={{ marginTop: "20px" }}>
              <h3 style={cardTitle}>Limits</h3>
              <p style={cardText}>One staged empty grasp still passed the check. Screws and a hex key didn't fit the gripper jaws, and batteries only picked some of the time. Recalibrating after a change was still manual, and every trial ran on one cell with someone watching. It's a working prototype, not a production system.</p>
            </Card>
          </FadeIn>
        </div>
      </section>

      {/* VIDEO */}
      <section id="video" style={{ position: "relative", zIndex: 1 }}>
        <div className="section">
          <SectionHeader index="04" label="video" title="See It Run" />
          <FadeIn delay={0.1}>
            <Card>
              <video controls preload="metadata" poster={`${ASSETS}/workflow.png`} style={{ ...media, background: "#050805" }}>
                <source src={`${ASSETS}/showcase-final.mp4`} type="video/mp4" />
                Your browser does not support the video player.
              </video>
            </Card>
          </FadeIn>
          <FadeIn delay={0.15}>
            <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap", marginTop: "40px" }}>
              <LiquidButton href="#projects">← More projects</LiquidButton>
              <LiquidButton href={GITHUB_URL} external>GitHub ↗</LiquidButton>
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
