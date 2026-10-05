/**
 * Deterministic geometry for the hero system map, in a 600×600 viewBox.
 * Pure functions: identical output on server and client, so no hydration drift.
 */

export const VIEWBOX = 600;
const CENTER = VIEWBOX / 2;
const CORE_RADIUS = 58;
export const NODE_ORBIT = 196;
export const MAX_NODES = 8;

export interface Point {
  x: number;
  y: number;
}

const round = (value: number) => Math.round(value * 100) / 100;

export function polar(angleDeg: number, radius: number): Point {
  const radians = (angleDeg * Math.PI) / 180;
  return { x: round(CENTER + radius * Math.cos(radians)), y: round(CENTER + radius * Math.sin(radians)) };
}

/** Percentage position inside the square container, for absolutely placed HTML nodes. */
export function toPercent(point: Point) {
  return { left: `${round((point.x / VIEWBOX) * 100)}%`, top: `${round((point.y / VIEWBOX) * 100)}%` };
}

export interface MapNode {
  angle: number;
  point: Point;
  /** Curved connection from the core to the node. */
  link: string;
}

/** Nodes evenly spaced on the orbit, first one at the top, each wired to the core. */
export function layoutNodes(count: number): MapNode[] {
  const step = 360 / Math.max(count, 1);
  return Array.from({ length: count }, (_, index) => {
    const angle = -90 + index * step;
    const start = polar(angle, CORE_RADIUS);
    const end = polar(angle, NODE_ORBIT - 30);
    const control = polar(angle + 16, (CORE_RADIUS + NODE_ORBIT) / 2);
    return {
      angle,
      point: polar(angle, NODE_ORBIT),
      link: `M ${start.x} ${start.y} Q ${control.x} ${control.y} ${end.x} ${end.y}`,
    };
  });
}

/** Chords between every other node give the graph its mesh. */
export function layoutChords(nodes: MapNode[]): string[] {
  if (nodes.length < 4) return [];
  const chords: string[] = [];
  for (let index = 0; index < nodes.length; index += 2) {
    const from = nodes[index];
    const to = nodes[(index + 2) % nodes.length];
    if (!from || !to) continue;
    // Control point pulled halfway toward the centre bows each chord inward.
    const controlX = round(CENTER + ((from.point.x + to.point.x) / 2 - CENTER) * 0.5);
    const controlY = round(CENTER + ((from.point.y + to.point.y) / 2 - CENTER) * 0.5);
    chords.push(`M ${from.point.x} ${from.point.y} Q ${controlX} ${controlY} ${to.point.x} ${to.point.y}`);
  }
  return chords;
}

/** Fixed constellation on the outer orbit: [angle, radius, dot radius]. */
const AMBIENT: ReadonlyArray<readonly [number, number, number]> = [
  [4, 268, 2.6],
  [31, 284, 1.8],
  [62, 262, 3],
  [93, 278, 2],
  [121, 288, 2.4],
  [152, 266, 1.6],
  [184, 280, 2.8],
  [213, 270, 2],
  [241, 286, 2.4],
  [269, 264, 1.8],
  [301, 279, 3],
  [332, 289, 2],
];

export interface AmbientDot extends Point {
  r: number;
}

export const ambientDots: AmbientDot[] = AMBIENT.map(([angle, radius, r]) => ({ ...polar(angle, radius), r }));

/** Short links between neighbouring ambient dots, skipping every third for a fragmented network look. */
export const ambientLinks: string[] = ambientDots.flatMap((dot, index) => {
  const next = ambientDots[(index + 1) % ambientDots.length];
  if (!next || index % 3 === 2) return [];
  return [`M ${dot.x} ${dot.y} L ${next.x} ${next.y}`];
});

/** Tick marks on the inner instrument ring. */
export const innerTicks: string[] = Array.from({ length: 24 }, (_, index) => {
  const angle = index * 15;
  const inner = polar(angle, index % 6 === 0 ? 110 : 116);
  const outer = polar(angle, 122);
  return `M ${inner.x} ${inner.y} L ${outer.x} ${outer.y}`;
});
