"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePauseOffscreen } from "@/components/animations/pause-offscreen";
import { GeometricShape } from "@/components/hero/geometric-shape";
import {
  ambientDots,
  ambientLinks,
  innerTicks,
  layoutChords,
  layoutNodes,
  MAX_NODES,
  NODE_ORBIT,
  toPercent,
  VIEWBOX,
} from "@/components/hero/system-map-geometry";
import { LogoMark } from "@/components/layout/logo";
import { ROUTES } from "@/lib/constants/routes";
import { getServiceIcon } from "@/lib/constants/service-icons";
import type { ServiceSummary } from "@/lib/supabase/queries/services";
import { cn } from "@/lib/utils/cn";

export type HeroMapService = Pick<ServiceSummary, "slug" | "title" | "icon">;

const PARALLAX_SPRING = { stiffness: 70, damping: 20, mass: 0.6 };
const CENTER = VIEWBOX / 2;

function clamp(value: number) {
  return Math.max(-1, Math.min(1, value));
}

/** Layer offset in pixels for a given depth, driven by the smoothed pointer position (-1..1). */
function useDepth(x: MotionValue<number>, y: MotionValue<number>, depth: number) {
  return { x: useTransform(x, (value) => value * depth), y: useTransform(y, (value) => value * depth) };
}

interface HeroVisualProps {
  services: HeroMapService[];
}

/**
 * Interactive "system map": Inovexa's core wired to each published service.
 * Each node links to its service page; hovering or focusing one lights up its
 * connection. Layers drift with the pointer for depth. Ambient motion uses
 * only CSS transforms and stroke offsets, pauses while the hero is off-screen,
 * and stops for reduced motion.
 */
export function HeroVisual({ services }: HeroVisualProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, PARALLAX_SPRING);
  const smoothY = useSpring(pointerY, PARALLAX_SPRING);
  const farLayer = useDepth(smoothX, smoothY, 6);
  const midLayer = useDepth(smoothX, smoothY, 12);
  const nearLayer = useDepth(smoothX, smoothY, 18);
  const frontLayer = useDepth(smoothX, smoothY, 30);

  const mapped = services.slice(0, MAX_NODES);
  const nodes = layoutNodes(mapped.length);
  const chords = layoutChords(nodes);

  // Pause every ambient animation in the hero while it is scrolled out of view.
  usePauseOffscreen(rootRef, "[data-hero]");

  // Pointer parallax across the whole hero. Mouse and trackpad only.
  useEffect(() => {
    const root = rootRef.current;
    const stage = root?.closest<HTMLElement>("[data-hero]");
    if (!root || !stage || reduceMotion || !window.matchMedia("(pointer: fine)").matches) return;
    const map: HTMLElement = root;

    function handleMove(event: PointerEvent) {
      if (event.pointerType !== "mouse") return;
      const rect = map.getBoundingClientRect();
      pointerX.set(clamp((event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)));
      pointerY.set(clamp((event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)));
    }

    function handleLeave() {
      pointerX.set(0);
      pointerY.set(0);
    }

    stage.addEventListener("pointermove", handleMove, { passive: true });
    stage.addEventListener("pointerleave", handleLeave);
    return () => {
      stage.removeEventListener("pointermove", handleMove);
      stage.removeEventListener("pointerleave", handleLeave);
      handleLeave();
    };
  }, [reduceMotion, pointerX, pointerY]);

  return (
    <div
      ref={rootRef}
      className="relative mx-auto aspect-square w-full max-w-[21rem] xs:max-w-[26rem] sm:max-w-[32rem] lg:max-w-[36rem]"
    >
      {/* Far layer: slowly orbiting constellation */}
      <motion.div style={farLayer} className="absolute inset-0">
        <div className="absolute inset-0 animate-spin-slow">
          <svg viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`} fill="none" aria-hidden="true" className="size-full overflow-visible">
            <circle cx={CENTER} cy={CENTER} r={276} stroke="rgb(115 87 217 / 0.12)" />
            {ambientLinks.map((d) => (
              <path key={d} d={d} stroke="rgb(77 141 255 / 0.22)" strokeWidth={1} />
            ))}
            {ambientDots.map((dot, index) => (
              <circle
                key={`${dot.x}-${dot.y}`}
                cx={dot.x}
                cy={dot.y}
                r={dot.r}
                fill={index % 2 === 0 ? "#4D8DFF" : "#A879FF"}
                opacity={0.75}
              />
            ))}
          </svg>
        </div>
      </motion.div>

      {/* Instrument ring, counter-rotating */}
      <motion.div style={midLayer} className="absolute inset-0">
        <div className="absolute inset-0 animate-spin-slow [animation-direction:reverse] [animation-duration:90s]">
          <svg viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`} fill="none" aria-hidden="true" className="size-full">
            <circle cx={CENTER} cy={CENTER} r={122} stroke="rgb(115 87 217 / 0.28)" strokeDasharray="2 7" />
            {innerTicks.map((d) => (
              <path key={d} d={d} stroke="rgb(10 16 32 / 0.18)" strokeWidth={1} />
            ))}
          </svg>
        </div>
      </motion.div>

      {/* Graph: orbit, mesh and data flowing along each connection */}
      <motion.div style={midLayer} className="absolute inset-0">
        <svg viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`} fill="none" aria-hidden="true" className="size-full overflow-visible">
          <circle cx={CENTER} cy={CENTER} r={NODE_ORBIT} stroke="rgb(10 16 32 / 0.08)" />
          {chords.map((d) => (
            <path key={d} d={d} stroke="rgb(115 87 217 / 0.14)" strokeWidth={1} />
          ))}
          {nodes.map((node, index) => {
            const active = activeIndex === index;
            return (
              <g key={node.link}>
                <path
                  d={node.link}
                  style={{
                    stroke: active ? "#7357D9" : "rgb(115 87 217 / 0.3)",
                    strokeWidth: active ? 1.8 : 1.2,
                  }}
                  className="transition-[stroke,stroke-width] duration-300 ease-premium"
                />
                <path
                  d={node.link}
                  pathLength={100}
                  stroke={index % 2 === 0 ? "#4D8DFF" : "#A879FF"}
                  strokeWidth={2.6}
                  strokeLinecap="round"
                  strokeDasharray="7 93"
                  className="animate-data-flow"
                  style={{
                    animationDelay: `${-index * 0.55}s`,
                    animationDuration: `${2.8 + (index % 3) * 0.6}s`,
                    animationDirection: index % 2 === 0 ? "normal" : "reverse",
                  }}
                />
              </g>
            );
          })}
        </svg>
      </motion.div>

      {/* Core */}
      <motion.div
        style={nearLayer}
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 size-[19%] -translate-x-1/2 -translate-y-1/2"
      >
        <span className="absolute inset-0 animate-halo rounded-full border border-iris-500/40" />
        <span className="absolute inset-0 animate-halo rounded-full border border-electric-500/40 [animation-delay:1.8s]" />
        <span className="relative grid size-full place-items-center rounded-full bg-surface shadow-[0_0_0_1px_rgb(115_87_217/0.18),0_18px_40px_-12px_rgb(115_87_217/0.55)]">
          <span className="absolute inset-[9%] rounded-full brand-gradient-soft" />
          <LogoMark className="relative w-[52%]" />
        </span>
      </motion.div>

      {/* Service nodes: real links */}
      {mapped.length > 0 ? (
        <motion.ul style={nearLayer} aria-label="Our services" className="absolute inset-0">
          {mapped.map((service, index) => {
            const node = nodes[index];
            if (!node) return null;
            const Icon = getServiceIcon(service.icon);
            const position = toPercent(node.point);

            return (
              <li key={service.slug} className="absolute" style={position}>
                <Link
                  href={ROUTES.service(service.slug)}
                  onPointerEnter={() => setActiveIndex(index)}
                  onPointerLeave={() => setActiveIndex(null)}
                  onFocus={() => setActiveIndex(index)}
                  onBlur={() => setActiveIndex(null)}
                  className="group/node absolute left-0 top-0 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center rounded-full"
                >
                  <span className="block animate-bob" style={{ animationDelay: `${-index * 0.8}s` }}>
                    <span
                      className={cn(
                        "grid size-11 place-items-center rounded-full border border-line bg-surface text-iris-600 shadow-md sm:size-12",
                        "transition-[scale,box-shadow,color] duration-300 ease-premium",
                        "group-hover/node:scale-110 group-hover/node:text-electric-600 group-hover/node:shadow-glow-purple",
                        "group-focus-visible/node:scale-110 group-focus-visible/node:shadow-glow-purple",
                      )}
                    >
                      <Icon aria-hidden="true" className="size-5" />
                    </span>
                  </span>
                  <span className="pointer-events-none absolute top-full mt-1.5 hidden whitespace-nowrap rounded-full bg-bg/80 px-2 py-0.5 text-[0.8125rem] font-medium text-fg-muted transition-colors duration-300 group-hover/node:text-fg group-focus-visible/node:text-fg sm:block">
                    {service.title}
                  </span>
                  <span className="sr-only sm:hidden">{service.title}</span>
                </Link>
              </li>
            );
          })}
        </motion.ul>
      ) : null}

      {/* Floating geometry, closest to the viewer */}
      <motion.div style={frontLayer} aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute right-[1%] top-[3%] w-[13%] animate-float">
          <GeometricShape kind="icosahedron" />
        </div>
        <div className="absolute bottom-[5%] left-[2%] w-[11%] animate-float [animation-delay:-4s] [animation-duration:11s]">
          <GeometricShape kind="cube" />
        </div>
        <div className="absolute -left-[3%] top-[28%] hidden w-[7%] animate-float [animation-delay:-7s] [animation-duration:13s] sm:block">
          <GeometricShape kind="tetrahedron" />
        </div>
      </motion.div>
    </div>
  );
}
