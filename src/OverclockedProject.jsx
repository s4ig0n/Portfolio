import { useEffect } from "react";
import MatrixCursor from "./MatrixCursor.jsx";
import RobotArmAnimation from "./RobotArmAnimation.jsx";
import "./overclocked.css";

const ASSET_ROOT = `${import.meta.env.BASE_URL}projects/overclocked`;
const GITHUB_URL = "https://github.com/ALL-Applied-AI-Network/overclocked";

const FLOW = [
  { number: "01", title: "Look", text: "Table, wrist, and side cameras locate a part and the destination bin." },
  { number: "02", title: "Pick", text: "The FANUC ER-4iA refines the grasp with wrist RGB and depth, then closes on the part." },
  { number: "03", title: "Check", text: "A TensorRT grasp classifier and wrist-camera check decide whether the pick held." },
  { number: "04", title: "Look again", text: "If the grasp misses, the system skips the carry, observes again, and retries." },
];

function ExternalArrow() {
  return <span aria-hidden="true">↗</span>;
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

      <section className="oc-hero">
        <div className="oc-hero-copy">
          <p className="oc-kicker">Rockwell Automation + NVIDIA · Physical AI Hackathon · 2026</p>
          <h1>A robot that looks before it moves.</h1>
          <p className="oc-lede">
            Team Overclocked built a perception-driven pick-and-place system for a FANUC ER-4iA. Multi-camera vision finds loose parts, checks each grasp, and looks again after a miss so the arm can recover instead of carrying an empty gripper.
          </p>
          <div className="oc-actions">
            <a className="oc-button oc-button-primary" href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
              GitHub <ExternalArrow />
            </a>
            <a className="oc-button oc-button-secondary" href={`${ASSET_ROOT}/showcase-final.mp4`} target="_blank" rel="noopener noreferrer">
              Watch final video <ExternalArrow />
            </a>
          </div>
          <div className="oc-tech-row" aria-label="Project technologies">
            {['Python', 'OpenCV', 'OWLv2', 'NVIDIA C-RADIO', 'TensorRT', 'FANUC ER-4iA'].map((item) => <span key={item}>{item}</span>)}
          </div>
        </div>

        <div className="oc-hero-visual">
          <img src={`${ASSET_ROOT}/real-cell.png`} alt="FANUC ER-4iA robot over the physical pick-and-place work cell" />
          <div className="oc-image-overlay" />
          <div className="oc-hero-label">REAL CELL · TEAM OVERCLOCKED</div>
          <RobotArmAnimation />
        </div>
      </section>

      <section className="oc-metrics" aria-label="Project results">
        <div><strong>12 / 12</strong><span>cubes placed across three clean runs</span></div>
        <div><strong>1.39 ms</strong><span>TensorRT FP16 grasp-check benchmark</span></div>
        <div><strong>3 cameras</strong><span>table, wrist, and side perception</span></div>
      </section>

      <section className="oc-section oc-intro-grid">
        <div>
          <p className="oc-section-label">THE PROBLEM</p>
          <h2>Fixed coordinates fail when the real world shifts.</h2>
        </div>
        <div className="oc-body-copy">
          <p>
            A taught pick position works until a part lands a few millimeters away, a fixture moves, or a camera is reseated. The result can be a silent miss, a controller fault, or another round of manual calibration.
          </p>
          <p>
            Overclocked closes the loop between perception and action. The policy observes the cell before each move, targets what the cameras actually see, verifies the grasp, and recovers when the pick fails.
          </p>
        </div>
      </section>

      <section className="oc-section">
        <div className="oc-section-heading">
          <p className="oc-section-label">HOW IT WORKS</p>
          <h2>Look. Pick. Check. Look again.</h2>
        </div>
        <div className="oc-flow">
          {FLOW.map((step) => (
            <article className="oc-flow-card" key={step.number}>
              <span>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
        <figure className="oc-wide-media">
          <img src={`${ASSET_ROOT}/workflow.png`} alt="Six-step workflow from table camera detection through grasp checking and repeated observation" />
          <figcaption>The final system combined open-vocabulary detection, wrist-camera refinement, grasp verification, and a recovery loop.</figcaption>
        </figure>
      </section>

      <section className="oc-section oc-results-section">
        <div className="oc-section-heading">
          <p className="oc-section-label">EVIDENCE ON HARDWARE</p>
          <h2>Recovery mattered as much as the first pick.</h2>
          <p className="oc-section-deck">After stale calibration produced 0 successful runs out of 3, the recalibrated policy placed 12 of 12 cubes across three clean real-cell runs with no faults.</p>
        </div>
        <div className="oc-evidence-grid">
          <figure>
            <img src={`${ASSET_ROOT}/vision-finds-parts.png`} alt="Three camera views showing the AI-enabled FANUC robot locating cubes" />
            <figcaption>OWLv2 answered all five looks in the recorded models-on run.</figcaption>
          </figure>
          <figure>
            <img src={`${ASSET_ROOT}/result-12-of-12.png`} alt="Result graphic comparing stale calibration with 12 of 12 cubes placed after recalibration" />
            <figcaption>Small shifts had a large effect, so the system was designed to observe and respond.</figcaption>
          </figure>
        </div>
      </section>

      <section className="oc-section oc-video-section" id="showcase">
        <div className="oc-section-heading">
          <p className="oc-section-label">FINAL SHOWCASE</p>
          <h2>See the full system in motion.</h2>
        </div>
        <video controls preload="metadata" poster={`${ASSET_ROOT}/workflow.png`}>
          <source src={`${ASSET_ROOT}/showcase-final.mp4`} type="video/mp4" />
          Your browser does not support the video player.
        </video>
        <div className="oc-video-links">
          <a href={`${ASSET_ROOT}/showcase-final.mp4`} target="_blank" rel="noopener noreferrer">Open final video <ExternalArrow /></a>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">Explore the code <ExternalArrow /></a>
        </div>
      </section>

      <footer className="oc-footer">
        <a href="#projects">← More portfolio projects</a>
        <span>Team Overclocked · 2026</span>
      </footer>
    </main>
  );
}
