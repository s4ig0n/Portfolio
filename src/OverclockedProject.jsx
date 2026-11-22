import { useEffect } from "react";
import MatrixCursor from "./MatrixCursor.jsx";
import "./overclocked.css";

const ASSET_ROOT = `${import.meta.env.BASE_URL}projects/overclocked`;
const GITHUB_URL = "https://github.com/ALL-Applied-AI-Network/overclocked";

const FLOW = [
  { number: "01", title: "Look", text: "Table, wrist, and side cameras locate a part and the destination bin." },
  { number: "02", title: "Pick", text: "The FANUC ER-4iA refines the grasp with wrist RGB and depth, then closes on the part." },
  { number: "03", title: "Check", text: "A TensorRT grasp classifier and wrist-camera check decide whether the pick held." },
  { number: "04", title: "Look again", text: "If the grasp misses, the system skips the carry, observes again, and retries." },
];

const METRICS = [
  { value: "12 / 12", label: "cubes placed across three clean runs" },
  { value: "1.39 ms", label: "TensorRT FP16 grasp-check benchmark" },
  { value: "3 cameras", label: "table, wrist, and side perception" },
];

function Heading({ index, label, title }) {
  return (
    <div className="oc-heading">
      <p className="oc-eyebrow">{index} / {label}</p>
      <h2 className="oc-title">{title}</h2>
      <div className="oc-rule" />
    </div>
  );
}

export default function OverclockedProject() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Overclocked | GLN Portfolio";
    window.scrollTo(0, 0);
    return () => {
      document.title = previousTitle;
    };
  }, []);

  return (
    <main className="oc-page">
      <MatrixCursor />
      <div className="oc-grid-bg" aria-hidden="true" />

      <header className="oc-topbar">
        <a className="oc-brand" href="#projects" aria-label="Back to portfolio projects">GLN<span>_</span></a>
        <a className="oc-back" href="#projects">← Back to portfolio</a>
      </header>

      <section className="oc-section oc-hero">
        <p className="oc-kicker"><span className="dot" />Team Lead · NVIDIA + Rockwell Automation Hackathon · 2026</p>
        <h1>Overclocked</h1>
        <p className="oc-lede">
          A robot that looks before it moves. Our team built a perception-driven pick-and-place system for a FANUC ER-4iA: multi-camera vision finds loose parts, checks each grasp, and looks again after a miss so the arm recovers instead of carrying an empty gripper. I led the team and wrote the Python pick-and-place policies.
        </p>
        <div className="oc-actions">
          <a className="oc-btn oc-btn-primary" href={GITHUB_URL} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
          <a className="oc-btn oc-btn-secondary" href="#showcase">Watch the video ↓</a>
        </div>
        <div>
          {["Python", "OpenCV", "OWLv2", "NVIDIA C-RADIO", "TensorRT", "Isaac Sim", "FANUC ER-4iA"].map((t) => <span key={t} className="tag">{t}</span>)}
        </div>
        <figure className="oc-glass oc-hero-photo">
          <img src={`${ASSET_ROOT}/real-cell.png`} alt="FANUC ER-4iA robot over the physical pick-and-place work cell" />
        </figure>
      </section>

      <section className="oc-section" aria-label="Project results" style={{ paddingTop: 0 }}>
        <div className="oc-grid-3">
          {METRICS.map((m) => (
            <div className="oc-glass oc-metric" key={m.value}>
              <strong>{m.value}</strong>
              <span>{m.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="oc-section">
        <Heading index="01" label="the problem" title="Fixed coordinates fail when the real world shifts." />
        <div className="oc-glass">
          <p className="oc-body">
            A taught pick position works until a part lands a few millimeters away, a fixture moves, or a camera is reseated. The result can be a silent miss, a controller fault, or another round of manual calibration.
          </p>
          <p className="oc-body">
            Overclocked closes the loop between perception and action. The policy observes the cell before each move, targets what the cameras actually see, verifies the grasp, and recovers when the pick fails.
          </p>
        </div>
      </section>

      <section className="oc-section">
        <Heading index="02" label="how it works" title="Look. Pick. Check. Look again." />
        <div className="oc-steps">
          {FLOW.map((step) => (
            <article className="oc-glass oc-step" key={step.number}>
              <span className="oc-step-num">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
        <figure className="oc-glass oc-figure">
          <img src={`${ASSET_ROOT}/workflow.png`} alt="Six-step workflow from table camera detection through grasp checking and repeated observation" />
          <figcaption>The final system combined open-vocabulary detection, wrist-camera refinement, grasp verification, and a recovery loop.</figcaption>
        </figure>
      </section>

      <section className="oc-section">
        <Heading index="03" label="evidence on hardware" title="Recovery mattered as much as the first pick." />
        <p className="oc-body" style={{ maxWidth: 680, marginBottom: 8 }}>
          With stale calibration, 0 of 3 runs finished. After recalibrating, the policy placed 12 of 12 cubes across three clean real-cell runs with no faults.
        </p>
        <div className="oc-grid-2">
          <figure className="oc-glass oc-figure">
            <img src={`${ASSET_ROOT}/vision-finds-parts.png`} alt="Three camera views showing the FANUC robot locating cubes" />
            <figcaption>OWLv2 answered all five looks in the recorded models-on run.</figcaption>
          </figure>
          <figure className="oc-glass oc-figure">
            <img src={`${ASSET_ROOT}/result-12-of-12.png`} alt="Result graphic comparing stale calibration with 12 of 12 cubes placed after recalibration" />
            <figcaption>Small shifts had a large effect, so the system was built to observe and respond.</figcaption>
          </figure>
        </div>
      </section>

      <section className="oc-section" id="showcase">
        <Heading index="04" label="final showcase" title="See the full system in motion." />
        <figure className="oc-glass oc-figure">
          <video controls preload="metadata" poster={`${ASSET_ROOT}/workflow.png`}>
            <source src={`${ASSET_ROOT}/showcase-final.mp4`} type="video/mp4" />
            Your browser does not support the video player.
          </video>
        </figure>
        <div className="oc-links">
          <a href={`${ASSET_ROOT}/showcase-final.mp4`} target="_blank" rel="noopener noreferrer">Open video in a new tab ↗</a>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">Explore the code ↗</a>
        </div>
      </section>

      <footer className="oc-footer">
        <a href="#projects">← More projects</a>
        <span>© 2026 Gourilakshmi Neerajkumar</span>
      </footer>
    </main>
  );
}
