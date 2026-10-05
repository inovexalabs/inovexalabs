import { useId } from "react";
import { isCapabilityVisualKey, type CapabilityVisualKey } from "@/lib/constants/capability-visuals";
import { cn } from "@/lib/utils/cn";

const LINE = "rgb(147 184 255 / 0.55)";
const FAINT = "rgb(147 184 255 / 0.2)";
const LILAC = "#CDB2FF";
const BLUE = "#6FA1FF";
const PANEL = "#0E1B3F";

/** SVG children animate around their own box rather than the viewBox origin. */
const OWN_BOX = "[transform-box:fill-box]";

interface CapabilityVisualProps {
  visual: string;
  /** Visible position, e.g. "01". */
  number: string;
  className?: string;
}

/**
 * Dark "instrument window" with a small animated illustration. Decorative:
 * the card's heading and text carry the meaning. CSS-only animation, paused
 * off-screen by the surrounding PauseOffscreen and stopped for reduced motion.
 */
export function CapabilityVisual({ visual, number, className }: CapabilityVisualProps) {
  const key: CapabilityVisualKey = isCapabilityVisualKey(visual) ? visual : "interface";

  return (
    <div
      aria-hidden="true"
      data-tone="dark"
      className={cn("relative h-52 overflow-hidden rounded-lg navy-gradient sm:h-60", className)}
    >
      <div className="absolute inset-0 grid-lines" />
      <div className="absolute left-1/2 top-1/2 size-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(115_87_217/0.32),transparent)]" />
      <span className="absolute left-4 top-3.5 font-display text-base font-semibold tabular-nums text-fg/70">{number}</span>
      <svg viewBox="0 0 320 200" fill="none" className="absolute inset-0 mx-auto size-full max-w-[24rem]">
        {key === "interface" ? <InterfaceGlyph /> : null}
        {key === "neural" ? <NeuralGlyph /> : null}
        {key === "shield" ? <ShieldGlyph /> : null}
        {key === "orbit" ? <OrbitGlyph /> : null}
      </svg>
    </div>
  );
}

/** Digital products: an app window laying itself out, with a phone alongside. */
function InterfaceGlyph() {
  const blocks = [
    { x: 120, y: 70, width: 106, height: 7 },
    { x: 120, y: 84, width: 82, height: 7 },
    { x: 120, y: 98, width: 96, height: 7 },
  ];

  return (
    <>
      <rect x="54" y="34" width="184" height="128" rx="12" fill={PANEL} stroke={LINE} />
      <path d="M54 56 H238" stroke={FAINT} />
      <circle cx="68" cy="45" r="3" fill="#A879FF" />
      <circle cx="79" cy="45" r="3" fill={BLUE} />
      <circle cx="90" cy="45" r="3" fill={FAINT} />

      <rect x="66" y="68" width="42" height="82" rx="6" fill="rgb(77 141 255 / 0.12)" stroke="rgb(77 141 255 / 0.3)" />
      {[78, 92, 106].map((y) => (
        <rect key={y} x="74" y={y} width="26" height="5" rx="2.5" fill={FAINT} />
      ))}

      {blocks.map((block, index) => (
        <rect
          key={block.y}
          {...block}
          rx="3.5"
          fill="rgb(205 178 255 / 0.6)"
          className={cn("origin-left animate-build", OWN_BOX)}
          style={{ animationDelay: `${index * 0.22}s` }}
        />
      ))}
      <rect
        x="120"
        y="114"
        width="50"
        height="36"
        rx="6"
        fill="rgb(77 141 255 / 0.22)"
        stroke="rgb(77 141 255 / 0.45)"
        className={cn("origin-left animate-build", OWN_BOX)}
        style={{ animationDelay: "0.66s" }}
      />
      <rect
        x="176"
        y="114"
        width="50"
        height="36"
        rx="6"
        fill="rgb(168 121 255 / 0.2)"
        stroke="rgb(168 121 255 / 0.45)"
        className={cn("origin-left animate-build", OWN_BOX)}
        style={{ animationDelay: "0.88s" }}
      />

      <g className="animate-bob">
        <rect x="222" y="80" width="52" height="94" rx="11" fill={PANEL} stroke="rgb(205 178 255 / 0.75)" />
        <path d="M240 88 H256" stroke={FAINT} strokeWidth="2" strokeLinecap="round" />
        <rect x="230" y="98" width="36" height="24" rx="5" fill="rgb(77 141 255 / 0.28)" />
        <rect x="230" y="128" width="30" height="5" rx="2.5" fill={FAINT} />
        <rect x="230" y="138" width="22" height="5" rx="2.5" fill={FAINT} />
        <circle cx="248" cy="162" r="4" stroke={FAINT} />
      </g>
    </>
  );
}

/** Intelligent systems: a small neural network with signals passing through it. */
function NeuralGlyph() {
  const layers = [
    { x: 92, ys: [62, 100, 138] },
    { x: 160, ys: [48, 84, 116, 152] },
    { x: 228, ys: [80, 120] },
  ] as const;

  const edges: { d: string; key: string }[] = [];
  for (let layer = 0; layer < layers.length - 1; layer++) {
    const from = layers[layer];
    const to = layers[layer + 1];
    if (!from || !to) continue;
    for (const y1 of from.ys) {
      for (const y2 of to.ys) {
        edges.push({ key: `${layer}-${y1}-${y2}`, d: `M ${from.x} ${y1} L ${to.x} ${y2}` });
      }
    }
  }

  const signals = [
    "M 92 62 L 160 84",
    "M 92 138 L 160 116",
    "M 92 100 L 160 48",
    "M 160 84 L 228 80",
    "M 160 152 L 228 120",
  ];

  return (
    <>
      {edges.map((edge) => (
        <path key={edge.key} d={edge.d} stroke={FAINT} strokeWidth="1" />
      ))}
      {signals.map((d, index) => (
        <path
          key={d}
          d={d}
          pathLength={100}
          stroke={index % 2 === 0 ? LILAC : BLUE}
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeDasharray="14 86"
          className="animate-data-flow"
          style={{ animationDelay: `${-index * 0.7}s`, animationDuration: `${2.4 + (index % 3) * 0.5}s` }}
        />
      ))}
      {layers.map((layer, layerIndex) =>
        layer.ys.map((y, nodeIndex) => (
          <g key={`${layer.x}-${y}`}>
            <circle cx={layer.x} cy={y} r={layerIndex === 2 ? 10 : 8} fill={PANEL} stroke={LINE} strokeWidth="1.5" />
            <circle
              cx={layer.x}
              cy={y}
              r="3.5"
              fill={layerIndex === 2 ? BLUE : LILAC}
              className="animate-twinkle"
              style={{ animationDelay: `${-(layerIndex * 0.9 + nodeIndex * 0.5)}s` }}
            />
          </g>
        )),
      )}
    </>
  );
}

/** Secure infrastructure: a locked shield under a moving scan, inside a guarded perimeter. */
function ShieldGlyph() {
  const id = useId().replace(/:/g, "");
  const clipId = `shield-clip-${id}`;
  const scanId = `shield-scan-${id}`;
  const shieldPath = "M160 50 L194 63 V98 C194 122 180 139 160 148 C140 139 126 122 126 98 V63 Z";

  return (
    <>
      <defs>
        <clipPath id={clipId}>
          <path d={shieldPath} />
        </clipPath>
        <linearGradient id={scanId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={BLUE} stopOpacity="0" />
          <stop offset="0.5" stopColor={BLUE} stopOpacity="0.55" />
          <stop offset="1" stopColor={BLUE} stopOpacity="0" />
        </linearGradient>
      </defs>

      <g className={cn("origin-center animate-spin-slow [animation-duration:40s]", OWN_BOX)}>
        <circle cx="160" cy="100" r="80" stroke={LINE} strokeDasharray="3 9" />
        {[
          [216.6, 43.4],
          [103.4, 43.4],
          [103.4, 156.6],
          [216.6, 156.6],
        ].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="3" fill={BLUE} />
        ))}
      </g>
      <circle cx="160" cy="100" r="62" stroke={FAINT} />

      <path d={shieldPath} fill={PANEL} stroke={LINE} strokeWidth="1.5" strokeLinejoin="round" />
      <g clipPath={`url(#${clipId})`}>
        <rect x="120" y="92" width="80" height="18" fill={`url(#${scanId})`} className="animate-scan" />
      </g>

      <path d="M152 96 V90 A8 8 0 0 1 168 90 V96" stroke={LILAC} strokeWidth="2.5" strokeLinecap="round" />
      <rect x="147" y="96" width="26" height="22" rx="5" fill={PANEL} stroke={LILAC} strokeWidth="2.5" />
      <circle cx="160" cy="106" r="2.5" fill={LILAC} />
      <path d="M160 108 V112" stroke={LILAC} strokeWidth="2" strokeLinecap="round" />
    </>
  );
}

/** Experimental technology: particles orbiting a nucleus, with scattered sparks. */
function OrbitGlyph() {
  const id = useId().replace(/:/g, "");
  const coreId = `orbit-core-${id}`;
  const orbits = [
    { angle: 0, duration: 7, color: BLUE },
    { angle: 60, duration: 9, color: LILAC },
    { angle: 120, duration: 11, color: "#A879FF" },
  ];
  const sparks = [
    [62, 48],
    [262, 40],
    [276, 150],
    [48, 160],
    [216, 176],
    [104, 24],
  ];

  return (
    <>
      <defs>
        <radialGradient id={coreId}>
          <stop offset="0" stopColor="#E2D2FF" />
          <stop offset="0.6" stopColor="#A879FF" />
          <stop offset="1" stopColor="#7357D9" />
        </radialGradient>
      </defs>

      {orbits.map((orbit, index) => (
        <g key={orbit.angle} transform={`rotate(${orbit.angle} 160 100)`}>
          <ellipse cx="160" cy="100" rx="104" ry="32" stroke={FAINT} />
          <ellipse
            cx="160"
            cy="100"
            rx="104"
            ry="32"
            pathLength={100}
            stroke={orbit.color}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray="0.1 99.9"
            className="animate-data-flow"
            style={{ animationDuration: `${orbit.duration}s`, animationDelay: `${-index * 2.3}s` }}
          />
        </g>
      ))}

      <circle cx="160" cy="100" r="15" stroke={LILAC} className={cn("origin-center animate-halo", OWN_BOX)} />
      <circle cx="160" cy="100" r="15" fill={`url(#${coreId})`} />

      {sparks.map(([cx, cy], index) => (
        <circle
          key={`${cx}-${cy}`}
          cx={cx}
          cy={cy}
          r="1.8"
          fill={index % 2 === 0 ? LILAC : BLUE}
          className="animate-twinkle"
          style={{ animationDelay: `${-index * 0.6}s` }}
        />
      ))}
    </>
  );
}
