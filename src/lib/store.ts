export interface TrialBooking {
  id: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  coach: string;
}

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // private mode / quota: demo state simply does not persist
  }
}

export const store = {
  bookedClasses: (): string[] => read<string[]>("forge-v3-booked-classes", []),
  setBookedClasses: (v: string[]) => write("forge-v3-booked-classes", v),
  trials: (): TrialBooking[] => read<TrialBooking[]>("forge-v3-trials", []),
  setTrials: (v: TrialBooking[]) => write("forge-v3-trials", v),
  heldPlan: (): { tier: string; addons: string[] } | null =>
    read<{ tier: string; addons: string[] } | null>("forge-v3-held-plan", null),
  setHeldPlan: (v: { tier: string; addons: string[] } | null) => write("forge-v3-held-plan", v),
  doneDays: (goal: string): number[] => read<number[]>(`forge-v3-done-${goal}`, []),
  setDoneDays: (goal: string, v: number[]) => write(`forge-v3-done-${goal}`, v),
};
