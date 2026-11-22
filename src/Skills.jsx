import { M, FadeIn, Card } from "./theme.jsx";

const mono = { fontFamily: "'Space Mono', monospace" };
const Tags = ({ items }) => <div>{items.map((t) => <span key={t} className="tag">{t}</span>)}</div>;

// Skills as proof: one number per skill, tied to where it came from.
const PROOF = [
  { value: "0.06%", what: "gap to Cachegrind's L1 miss counts", where: "Cache Simulator · C++ · Valgrind · 16 configs" },
  { value: "17.8x", what: "faster matrix multiply than naive", where: "eight-wide · C · AVX2/FMA · N=512" },
  { value: "47", what: "pytest tests against an MQTT device", where: "MQTT harness · found a broker conformance bug" },
  { value: "2 + 2", what: "firmware releases and hotfixes validated", where: "Mercury Security · TestRail · Jenkins · ARM Linux" },
];
const ALL_TECH = ["C", "C++", "Python", "Java", "Bash", "MIPS Assembly", "TypeScript", "SQL", "Embedded Linux", "RISC-V", "PIC24", "AVX2/FMA", "Valgrind", "CMake", "pytest", "GitHub Actions", "Jenkins", "TestRail", "Docker", "QEMU", "MQTT", "Wireshark", "React", "Django"];

export default function Skills() {
  return (
    <>
      <p style={{ ...mono, fontSize: "11px", letterSpacing: "3px", color: M.mid, textTransform: "uppercase", marginBottom: "16px" }}>Real numbers. Real work.</p>
      <div className="grid-2" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
        {PROOF.map((p, i) => (
          <FadeIn key={p.value} delay={0.05 * i}>
            <Card style={{ height: "100%" }}>
              <div style={{ fontFamily: "'VT323', monospace", fontSize: "56px", lineHeight: 1, color: "#00ff41", marginBottom: "6px" }}>{p.value}</div>
              <div style={{ fontSize: "15px", color: M.bright, marginBottom: "6px" }}>{p.what}</div>
              <div style={{ ...mono, fontSize: "11px", color: M.dim, lineHeight: 1.6 }}>{p.where}</div>
            </Card>
          </FadeIn>
        ))}
      </div>
      <FadeIn delay={0.2}>
        <p style={{ ...mono, fontSize: "11px", letterSpacing: "3px", color: M.mid, textTransform: "uppercase", margin: "40px 0 12px" }}>Technologies</p>
        <Tags items={ALL_TECH} />
      </FadeIn>
    </>
  );
}
