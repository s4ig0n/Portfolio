import "./overclocked.css";

export default function RobotArmAnimation({ compact = false }) {
  return (
    <div className={`oc-arm-scene ${compact ? "oc-arm-scene-compact" : ""}`} aria-label="Animated robot arm moving a box into a bin">
      <svg viewBox="0 0 320 190" role="img" aria-hidden="true">
        <defs>
          <linearGradient id="oc-arm-metal" x1="0" x2="1">
            <stop offset="0" stopColor="#ccffcc" />
            <stop offset="1" stopColor="#00b300" />
          </linearGradient>
          <linearGradient id="oc-box-fill" x1="0" x2="1">
            <stop offset="0" stopColor="#00ff41" />
            <stop offset="1" stopColor="#009e2a" />
          </linearGradient>
          <filter id="oc-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <path className="oc-floor-line" d="M18 151 H302" />
        <path className="oc-scan-path" d="M103 62 C160 26, 231 31, 276 79" />

        <g className="oc-arm-base">
          <rect x="42" y="130" width="72" height="20" rx="6" />
          <rect x="55" y="105" width="46" height="29" rx="8" />
          <circle cx="78" cy="108" r="14" />
        </g>

        <g className="oc-arm-moving">
          <path className="oc-arm-link" d="M78 108 L118 50 Q122 44 130 48 L143 57 Q149 61 144 68 L98 116 Z" />
          <circle className="oc-joint" cx="129" cy="58" r="13" />
          <path className="oc-arm-link oc-arm-link-two" d="M129 58 L205 72 Q214 74 212 83 L209 92 Q207 100 198 96 L124 76 Z" />
          <circle className="oc-joint" cx="205" cy="84" r="11" />
          <g className="oc-gripper">
            <rect x="199" y="91" width="14" height="18" rx="4" />
            <path d="M200 106 v16 h-8" />
            <path d="M212 106 v16 h8" />
          </g>
        </g>

        <g className="oc-source-stack">
          <rect x="188" y="129" width="24" height="22" rx="3" />
          <rect x="215" y="129" width="24" height="22" rx="3" />
        </g>

        <g className="oc-moving-box" filter="url(#oc-glow)">
          <rect x="188" y="127" width="24" height="24" rx="3" />
          <path d="M192 133 h16 M200 129 v20" />
        </g>

        <g className="oc-bin">
          <path d="M258 119 h42 l-6 32 h-30 z" />
          <path d="M254 119 h50" />
          <rect x="268" y="132" width="20" height="4" rx="2" />
        </g>

        <g className="oc-vision-pulse">
          <circle cx="205" cy="118" r="22" />
          <circle cx="205" cy="118" r="8" />
        </g>
      </svg>
      <div className="oc-arm-caption">
        <span className="oc-live-dot" /> look&nbsp;&nbsp; pick&nbsp;&nbsp; check&nbsp;&nbsp; place
      </div>
    </div>
  );
}
