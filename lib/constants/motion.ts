/** Shared motion language. Mirrors --ease-premium in app/globals.css. */
export const EASE_PREMIUM = [0.22, 1, 0.36, 1] as const;

export const DURATION = {
  fast: 0.18,
  base: 0.32,
  slow: 0.7,
} as const;

export const SPRING_SNAPPY = { type: "spring", stiffness: 420, damping: 34, mass: 0.6 } as const;
export const SPRING_SOFT = { type: "spring", stiffness: 180, damping: 18, mass: 0.4 } as const;
