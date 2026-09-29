import { useEffect, useRef } from "react";

// Glyphs that fall off the cursor: half-width katakana + binary, Matrix-style
const GLYPHS = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓ0110101".split("");
const pick = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

const GLOW_SIZE = 400; // diameter of the torch glow, in px

// Chunky pixel arrow with a chrome-green gradient (the Y2K half).
// The hover version turns white-hot and picks up a little sparkle.
const arrowSvg = (hover) => `
<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32' shape-rendering='crispEdges'>
  <defs>
    <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0' stop-color='#f5fff5'/>
      <stop offset='.45' stop-color='${hover ? "#e8e8e8" : "#00ff41"}'/>
      <stop offset='1' stop-color='${hover ? "#8a8a8a" : "#00802b"}'/>
    </linearGradient>
  </defs>
  <path d='M2 2 L2 24 L8 18 L12 27 L16 25 L12 17 L20 17 Z' fill='url(#g)' stroke='#000' stroke-width='2'/>
  ${hover ? "<path d='M25 3 L26.5 7.5 L31 9 L26.5 10.5 L25 15 L23.5 10.5 L19 9 L23.5 7.5 Z' fill='#00ff41' stroke='#000' stroke-width='1'/>" : ""}
</svg>`;

const toCursor = (svg, fallback) =>
  `url("data:image/svg+xml,${encodeURIComponent(svg.trim())}") 2 2, ${fallback}`;

export default function MatrixCursor() {
  const canvasRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    // Touch devices have no cursor, so skip everything there
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const cleanups = [];

    // 1) Swap the system cursor for the pixel arrow
    const style = document.createElement("style");
    style.textContent = `
      html, body, * { cursor: ${toCursor(arrowSvg(false), "auto")} !important; }
      a, a *, button, button *, [role="button"], .side-nav-item, .side-nav-item * {
        cursor: ${toCursor(arrowSvg(true), "pointer")} !important;
      }
    `;
    document.head.appendChild(style);
    cleanups.push(() => style.remove());

    // 2) Torch glow: moved straight through the DOM (no React state, no CSS transition),
    //    at most once per frame, using transform so the browser never has to re-layout.
    const glow = glowRef.current;
    let glowX = 0, glowY = 0, glowFrame = null;
    const paintGlow = () => {
      glowFrame = null;
      glow.style.transform = `translate3d(${glowX - GLOW_SIZE / 2}px, ${glowY - GLOW_SIZE / 2}px, 0)`;
      glow.style.opacity = "1";
    };
    const moveGlow = (e) => {
      glowX = e.clientX;
      glowY = e.clientY;
      if (!glowFrame) glowFrame = requestAnimationFrame(paintGlow);
    };
    const hideGlow = () => { glow.style.opacity = "0"; };
    window.addEventListener("mousemove", moveGlow);
    document.documentElement.addEventListener("mouseleave", hideGlow);
    cleanups.push(() => {
      window.removeEventListener("mousemove", moveGlow);
      document.documentElement.removeEventListener("mouseleave", hideGlow);
      if (glowFrame) cancelAnimationFrame(glowFrame);
    });

    // 3) Glyph trail + click burst (skipped if the visitor prefers reduced motion)
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const particles = [];
      let raf = null;
      let last = { x: -999, y: -999 };

      const resize = () => {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      };
      resize();

      const tick = () => {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.03; // gentle gravity so glyphs "rain" down
          p.life -= 0.018;
          if (p.life <= 0) { particles.splice(i, 1); continue; }
          if (!p.sparkle && Math.random() < 0.08) p.char = pick(); // glyphs flicker/mutate

          ctx.font = `${p.size}px 'Space Mono', monospace`;
          ctx.globalAlpha = p.life;
          // Freshly spawned glyphs flash white, like the head of a Matrix column
          ctx.fillStyle = p.sparkle ? "#ffffff" : p.life > 0.85 ? "#ccffcc" : "#00ff41";
          ctx.shadowColor = p.sparkle ? "#ffffff" : "#00ff41";
          ctx.shadowBlur = 8;
          ctx.fillText(p.char, p.x, p.y);
        }
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
        raf = particles.length ? requestAnimationFrame(tick) : null;
      };

      const spawn = (x, y, vx, vy, sparkle = false) => {
        if (particles.length > 90) particles.shift();
        particles.push({
          x, y, vx, vy,
          life: 1,
          char: sparkle ? "✦" : pick(),
          sparkle,
          size: sparkle ? 12 : 11 + Math.random() * 5,
        });
        if (!raf) raf = requestAnimationFrame(tick);
      };

      const onMove = (e) => {
        const dx = e.clientX - last.x, dy = e.clientY - last.y;
        if (dx * dx + dy * dy < 16 * 16) return; // one glyph every ~16px of movement
        last = { x: e.clientX, y: e.clientY };
        const sparkle = Math.random() < 0.12;
        spawn(e.clientX + 6, e.clientY + 22, (Math.random() - 0.5) * 0.4, 0.6 + Math.random() * 0.8, sparkle);
      };

      const onDown = (e) => {
        for (let i = 0; i < 12; i++) {
          const a = (i / 12) * Math.PI * 2;
          const speed = 1.5 + Math.random() * 1.5;
          spawn(e.clientX, e.clientY, Math.cos(a) * speed, Math.sin(a) * speed - 1, i % 4 === 0);
        }
      };

      window.addEventListener("mousemove", onMove);
      window.addEventListener("mousedown", onDown);
      window.addEventListener("resize", resize);
      cleanups.push(() => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mousedown", onDown);
        window.removeEventListener("resize", resize);
        if (raf) cancelAnimationFrame(raf);
      });
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <>
      {/* Torch glow: sits behind the page content (zIndex 0), same look as before */}
      <div
        ref={glowRef}
        aria-hidden="true"
        style={{
          position: "fixed", top: 0, left: 0,
          width: GLOW_SIZE, height: GLOW_SIZE,
          background: "radial-gradient(circle, rgba(255,255,255,0.10) 0%, transparent 70%)",
          pointerEvents: "none", zIndex: 0,
          opacity: 0, transition: "opacity 0.3s ease",
          willChange: "transform",
        }}
      />
      {/* Glyph trail: sits on top of everything */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", pointerEvents: "none", zIndex: 9999 }}
      />
    </>
  );
}