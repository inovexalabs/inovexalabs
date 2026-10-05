import { useId } from "react";
import { cn } from "@/lib/utils/cn";

export type GeometricShapeKind = "icosahedron" | "cube" | "tetrahedron";

const paths: Record<GeometricShapeKind, string[]> = {
  // Hexagon outline with the inner faces of an icosahedron seen head-on
  icosahedron: [
    "M50 4 L90 27 L90 73 L50 96 L10 73 L10 27 Z",
    "M50 4 L30 40 L70 40 Z",
    "M30 40 L50 74 L70 40",
    "M10 27 L30 40 L10 73 L50 74 L90 73 L70 40 L90 27",
    "M50 74 L50 96",
  ],
  // Isometric wireframe cube
  cube: ["M50 6 L90 28 L90 72 L50 94 L10 72 L10 28 Z", "M10 28 L50 50 L90 28", "M50 50 L50 94", "M50 6 L50 50"],
  tetrahedron: ["M50 8 L92 84 L8 84 Z", "M50 8 L58 60 L92 84", "M58 60 L8 84"],
};

interface GeometricShapeProps {
  kind: GeometricShapeKind;
  className?: string;
}

/** Thin gradient wireframe solid. Decorative. */
export function GeometricShape({ kind, className }: GeometricShapeProps) {
  const gradientId = `geo-${useId().replace(/:/g, "")}`;

  return (
    <svg viewBox="0 0 100 100" fill="none" aria-hidden="true" className={cn("overflow-visible", className)}>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4D8DFF" />
          <stop offset="0.6" stopColor="#7357D9" />
          <stop offset="1" stopColor="#A879FF" />
        </linearGradient>
      </defs>
      {paths[kind].map((d) => (
        <path
          key={d}
          d={d}
          stroke={`url(#${gradientId})`}
          strokeWidth="1.6"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}
