export type TestMode = "click" | "spacebar" | "rightclick";

export interface Rank {
  name: string;
  emoji: string;
  hype: string;
}

export function rankFor(cps: number): Rank {
  if (cps < 3)
    return {
      name: "Turtle",
      emoji: "🐢",
      hype: "A sleepy turtle just lapped you. Try using a finger next time.",
    };
  if (cps < 5)
    return { name: "Snail Deluxe", emoji: "🐌", hype: "Steady, calm, and completely harmless in PVP." };
  if (cps < 7)
    return { name: "Human", emoji: "🧍", hype: "Perfectly average. The clicking world's beige wall." };
  if (cps < 9)
    return { name: "Rabbit", emoji: "🐇", hype: "Quick fingers. You'd survive a bridge fight. Barely." };
  if (cps < 11)
    return { name: "Wolf", emoji: "🐺", hype: "Server-legal and genuinely scary. Nice jitter." };
  if (cps < 14)
    return { name: "Cheetah", emoji: "🐆", hype: "Butterfly territory. Anti-cheat is watching you." };
  if (cps < 18)
    return { name: "Hummingbird", emoji: "🐦", hype: "Your mouse switch is filing a complaint." };
  return { name: "Machine", emoji: "🤖", hype: "Either you're inhuman or that's a macro. We won't tell." };
}

export function shareText(cps: number, duration: number) {
  const r = rankFor(cps);
  return `${r.emoji} ${cps.toFixed(2)} CPS in ${duration}s — rank: ${r.name}. ${r.hype}`;
}

export function buildResultPath(cps: number, clicks: number, duration: number, mode: TestMode) {
  const p = new URLSearchParams({
    cps: cps.toFixed(2),
    clicks: String(clicks),
    d: String(duration),
    m: mode,
  });
  return `/result?${p.toString()}`;
}

export const DURATIONS = [1, 2, 5, 10, 15, 30, 60, 100] as const;

export const MODE_LABEL: Record<TestMode, string> = {
  click: "Left click",
  spacebar: "Spacebar",
  rightclick: "Right click",
};

const KEY = "cps-best-v1";

export function readBest(mode: TestMode, duration: number): number {
  if (typeof window === "undefined") return 0;
  try {
    const all = JSON.parse(localStorage.getItem(KEY) ?? "{}");
    return Number(all?.[`${mode}-${duration}`] ?? 0);
  } catch {
    return 0;
  }
}

export function writeBest(mode: TestMode, duration: number, cps: number): boolean {
  if (typeof window === "undefined") return false;
  try {
    const all = JSON.parse(localStorage.getItem(KEY) ?? "{}");
    const k = `${mode}-${duration}`;
    if (cps > Number(all?.[k] ?? 0)) {
      all[k] = Number(cps.toFixed(2));
      localStorage.setItem(KEY, JSON.stringify(all));
      return true;
    }
  } catch {
    /* ignore */
  }
  return false;
}
