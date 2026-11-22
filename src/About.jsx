// About: a short intro on the left, the facts as a terminal printout on the right.
import { M, FadeIn, Card } from "./theme.jsx";

const body = { fontSize: "16px", color: M.textSec, lineHeight: 1.75 };
const strong = { color: M.bright, fontWeight: 500 };

const WHOAMI = [
  ["school", "University of Wisconsin-Milwaukee"],
  ["major", "Computer Science, Honors College"],
  ["minor", "Information Science & Technology"],
  ["certificate", "Artificial Intelligence"],
  ["gpa", "3.7, Dean's List"],
  ["graduating", "May 2027"],
  ["status", "open to full-time roles starting 2027"],
];

const Prompt = () => <span style={{ color: "#00ff41" }}>gouri@uwm</span>;

export default function About() {
  return (
    <div className="about-split">
      <FadeIn>
        <p style={{ ...body, marginBottom: "16px" }}>
          Hi, I'm <span style={strong}>Gouri</span>. I'm a senior at the University of Wisconsin-Milwaukee studying computer science.
        </p>
        <p style={{ ...body, marginBottom: "16px" }}>
          My work focuses on <span style={strong}>embedded systems</span>, <span style={strong}>computer architecture</span>, and <span style={strong}>test automation</span>. This summer I tested firmware for ARM-based access controllers at Mercury Security. On my own I've built a cache simulator, a SIMD matrix multiply, and a test harness for an MQTT device.
        </p>
        <p style={body}>
          Outside of class I run the Student Association of India and teach Python to elementary and middle schoolers with Girls Who Code.
        </p>
      </FadeIn>

      <FadeIn delay={0.1}>
        <Card style={{ padding: 0 }}>
          <div style={{ display: "flex", gap: "6px", padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            {["#3a3a3a", "#3a3a3a", "#00b300"].map((c, i) => <span key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
          </div>
          <div style={{ padding: "18px 20px 22px", fontFamily: "'VT323', monospace", fontSize: "19px", lineHeight: 1.5 }}>
            <div style={{ color: M.mid, marginBottom: "4px" }}><Prompt />:~$ whoami</div>
            {WHOAMI.map(([k, v]) => (
              <div key={k} className="about-term-row">
                <span style={{ color: M.dim }}>{k}</span>
                <span style={{ color: M.bright }}>{v}</span>
              </div>
            ))}
            <div style={{ color: M.mid, marginTop: "6px" }}>
              <Prompt />:~$ <span style={{ animation: "blink 1.2s infinite", display: "inline-block" }}>_</span>
            </div>
          </div>
        </Card>
      </FadeIn>
    </div>
  );
}
