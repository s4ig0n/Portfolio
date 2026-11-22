/* eslint-disable react-refresh/only-export-components */
// Shared look for every page: palette, glass cards, fade-in, and the site CSS.
// App.jsx and OverclockedProject.jsx both import from here so they stay identical.
import { useState, useEffect, useRef } from "react";

// ── Matrix palette tokens ──────────────────────────────────────
export const M = {
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

export const liquidBlur = "blur(22px) saturate(180%) brightness(1.08)";

export const shadowRest = `
  0 0 0 0.5px rgba(255,255,255,0.14),
  0 2px 0 0 rgba(255,255,255,0.10) inset,
  0 -1px 0 0 rgba(0,0,0,0.5) inset,
  0 8px 32px rgba(0,0,0,0.55),
  0 2px 8px rgba(0,0,0,0.4),
  0 0 40px rgba(255,255,255,0.04)
`;

export const shadowHover = `
  0 0 0 0.5px rgba(255,255,255,0.3),
  0 2px 0 0 rgba(255,255,255,0.18) inset,
  0 -1px 0 0 rgba(0,0,0,0.5) inset,
  0 20px 60px rgba(0,0,0,0.6),
  0 8px 24px rgba(0,0,0,0.5),
  0 0 60px rgba(255,255,255,0.10)
`;


export function useIntersection(ref, threshold = 0.15) {
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

export function FadeIn({ children, delay = 0, className = "" }) {
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

// Phones fire mouseenter on tap and never mouseleave, which leaves cards stuck "lifted".
// Only enable hover effects on devices that can actually hover.
export const canHover = typeof window !== "undefined" && window.matchMedia?.("(hover: hover)").matches;

export function Card({ children, style = {} }) {
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
export function FeatureCard({ children }) {
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

export const SITE_CSS = `
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
        .plain-list { list-style: none; font-family: 'Space Mono', monospace; font-size: 13px; color: #f5f5f5; }
        .plain-list li { padding: 7px 0; border-bottom: 1px solid rgba(255,255,255,0.07); }
        .plain-list li:last-child { border-bottom: none; }
        .repo-link { display: inline-block; margin-top: 14px; font-family: 'Space Mono', monospace; font-size: 12px; color: #00b300; transition: color 0.2s; }
        .repo-link:hover { color: #00ff41; }
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
`;

export function SiteStyles() {
  return <style>{SITE_CSS}</style>;
}
