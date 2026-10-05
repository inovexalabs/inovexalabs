/**
 * Animated illustrations an admin can assign to a capability. Keep in sync
 * with the `capabilities_visual_check` constraint in supabase/migrations.
 */
export const CAPABILITY_VISUALS = {
  interface: "Interface being assembled",
  neural: "Neural network",
  shield: "Shield and scan",
  orbit: "Orbiting particles",
} as const;

export type CapabilityVisualKey = keyof typeof CAPABILITY_VISUALS;

export const CAPABILITY_VISUAL_KEYS = Object.keys(CAPABILITY_VISUALS) as CapabilityVisualKey[];

export function isCapabilityVisualKey(value: string): value is CapabilityVisualKey {
  return Object.hasOwn(CAPABILITY_VISUALS, value);
}
