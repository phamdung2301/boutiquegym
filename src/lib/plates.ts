// Barbell plate breakdown. Bar = 20kg. Plates are loaded per side, so the
// total must be 20 + 2 * (sum of one side). Slider steps of 2.5kg keep it valid.
export const BAR_KG = 20;
export const PLATE_SIZES = [25, 20, 15, 10, 5, 2.5, 1.25];

export function platesPerSide(totalKg: number): number[] {
  let remaining = (totalKg - BAR_KG) / 2;
  const out: number[] = [];
  for (const size of PLATE_SIZES) {
    while (remaining >= size - 1e-9) {
      out.push(size);
      remaining -= size;
    }
  }
  return out;
}

export function plateRadiusKg(kg: number): number {
  // Radius grows with plate weight so the 3D barbell reads at a glance.
  return 0.22 + kg * 0.012;
}

export function plateColorKg(kg: number): string {
  if (kg >= 25) return "#E11D2E";
  if (kg >= 20) return "#8A7F7A";
  if (kg >= 15) return "#3A2A2A";
  if (kg >= 10) return "#CFC6BC";
  if (kg >= 5) return "#A89A90";
  return "#EDE6DA";
}

// Epley formula for a rough 1RM estimate from a working set.
export function estimate1RM(weightKg: number, reps: number): number {
  if (reps <= 1) return weightKg;
  return Math.round(weightKg * (1 + reps / 30));
}

export function loadCode(totalKg: number): string {
  const perSide = platesPerSide(totalKg);
  if (perSide.length === 0) return "BAR ONLY";
  const counts = new Map<number, number>();
  perSide.forEach((p) => counts.set(p, (counts.get(p) ?? 0) + 1));
  const parts = [...counts.entries()].map(([kg, n]) => `${n}×${kg}`);
  return `${parts.join(" + ")} / SIDE`;
}
