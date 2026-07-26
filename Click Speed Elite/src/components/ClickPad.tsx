import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import {
  DURATIONS,
  MODE_LABEL,
  readBest,
  writeBest,
  type TestMode,
} from "@/lib/cps";
import { ResultModal } from "./ResultModal";
import { cn } from "@/lib/utils";

interface Ripple {
  id: number;
  x: number;
  y: number;
}

interface Props {
  mode: TestMode;
  defaultDuration?: number;
  title: string;
  subtitle: string;
}

export function ClickPad({ mode, defaultDuration = 5, title, subtitle }: Props) {
  const reduced = useReducedMotion();
  const [duration, setDuration] = useState(defaultDuration);
  const [clicks, setClicks] = useState(0);
  const [running, setRunning] = useState(false);
  const [remaining, setRemaining] = useState(defaultDuration);
  const [finished, setFinished] = useState<{ cps: number; clicks: number } | null>(null);
  const [best, setBest] = useState(0);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [announce, setAnnounce] = useState("");

  const startedAt = useRef(0);
  const rafId = useRef(0);
  const clicksRef = useRef(0);
  const rippleId = useRef(0);
  const padRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setBest(readBest(mode, duration));
  }, [mode, duration]);

  const stop = useCallback(() => {
    cancelAnimationFrame(rafId.current);
    setRunning(false);
    const total = clicksRef.current;
    const cps = total / duration;
    setFinished({ cps, clicks: total });
    const isBest = writeBest(mode, duration, cps);
    setBest(readBest(mode, duration));
    setAnnounce(
      `Test complete. ${total} clicks in ${duration} seconds. ${cps.toFixed(2)} clicks per second.${
        isBest ? " New personal best." : ""
      }`,
    );
  }, [duration, mode]);

  const tick = useCallback(() => {
    const elapsed = (performance.now() - startedAt.current) / 1000;
    const left = Math.max(0, duration - elapsed);
    setRemaining(left);
    if (left <= 0) {
      stop();
      return;
    }
    rafId.current = requestAnimationFrame(tick);
  }, [duration, stop]);

  const reset = useCallback(() => {
    cancelAnimationFrame(rafId.current);
    clicksRef.current = 0;
    setClicks(0);
    setRunning(false);
    setFinished(null);
    setRemaining(duration);
    setRipples([]);
    setAnnounce("Test reset. Ready to start.");
  }, [duration]);

  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration, mode]);

  useEffect(() => () => cancelAnimationFrame(rafId.current), []);

  const registerHit = useCallback(
    (x?: number, y?: number) => {
      if (finished) return;
      if (!running) {
        clicksRef.current = 0;
        startedAt.current = performance.now();
        setRunning(true);
        setAnnounce(`Timer started. ${duration} seconds.`);
        rafId.current = requestAnimationFrame(tick);
      }
      clicksRef.current += 1;
      setClicks(clicksRef.current);

      if (!reduced && x !== undefined && y !== undefined) {
        const id = ++rippleId.current;
        setRipples((r) => [...r.slice(-6), { id, x, y }]);
        window.setTimeout(() => setRipples((r) => r.filter((i) => i.id !== id)), 480);
      }
    },
    [duration, finished, reduced, running, tick],
  );

  // Low-latency pointer handling: fire on pointerdown, never on click.
  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      if (mode === "spacebar") return;
      if (mode === "rightclick" && e.button !== 2) return;
      if (mode === "click" && e.button !== 0) return;
      const rect = e.currentTarget.getBoundingClientRect();
      registerHit(e.clientX - rect.left, e.clientY - rect.top);
    },
    [mode, registerHit],
  );

  // Keyboard support: Space / Enter always count as a hit on the focused pad.
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === " " || e.key === "Spacebar" || e.key === "Enter") {
        e.preventDefault();
        if (e.repeat) return;
        const rect = e.currentTarget.getBoundingClientRect();
        registerHit(rect.width / 2, rect.height / 2);
      }
    },
    [registerHit],
  );

  // Spacebar mode also listens globally once the pad has been focused/armed.
  useEffect(() => {
    if (mode !== "spacebar") return;
    const handler = (e: KeyboardEvent) => {
      if (e.key !== " " && e.key !== "Spacebar") return;
      const target = e.target as HTMLElement | null;
      if (target && target !== document.body && target !== padRef.current) return;
      e.preventDefault();
      if (e.repeat) return;
      registerHit();
    };
    window.addEventListener("keydown", handler, { passive: false });
    return () => window.removeEventListener("keydown", handler);
  }, [mode, registerHit]);

  const liveCps = running && clicks > 0 ? clicks / Math.max(0.001, duration - remaining) : 0;
  const progress = ((duration - remaining) / duration) * 100;

  return (
    <section className="w-full" aria-labelledby="test-heading">
      <div className="mb-6 text-center">
        <h1 id="test-heading" className="text-4xl sm:text-5xl">
          {title}
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">{subtitle}</p>
      </div>

      <fieldset className="mb-5">
        <legend className="mb-2 block text-center text-xs uppercase tracking-widest text-muted-foreground">
          Test duration
        </legend>
        <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Test duration in seconds">
          {DURATIONS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDuration(d)}
              aria-pressed={duration === d}
              className={cn(
                "num glow-hover tap-safe min-h-11 rounded-lg border px-3 text-sm",
                duration === d
                  ? "border-accent/60 bg-accent/15 text-foreground"
                  : "border-border bg-card/40 text-muted-foreground",
              )}
            >
              {d}s
            </button>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-3 sm:grid-cols-4">
        <Stat label="Timer" value={`${remaining.toFixed(remaining < 10 ? 2 : 1)}s`} />
        <Stat label="Clicks" value={String(clicks)} />
        <Stat label="Live CPS" value={liveCps.toFixed(2)} />
        <Stat label="Best" value={best ? best.toFixed(2) : "—"} />
      </div>

      <div
        className="mt-3 h-1 w-full overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-label="Time elapsed"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
      >
        <div className="h-full bg-accent transition-[width] duration-100" style={{ width: `${progress}%` }} />
      </div>

      <button
        ref={padRef}
        type="button"
        onPointerDown={onPointerDown}
        onKeyDown={onKeyDown}
        onContextMenu={(e) => e.preventDefault()}
        disabled={!!finished}
        aria-describedby="pad-help"
        className={cn(
          "glass tap-safe relative mt-4 flex h-[46vh] min-h-[280px] w-full flex-col items-center justify-center overflow-hidden rounded-3xl",
          "transition-transform duration-100 hover:border-white/20 hover:shadow-[var(--glow-accent)]",
          "active:scale-[0.98] disabled:opacity-60 motion-reduce:active:scale-100",
        )}
      >
        {ripples.map((r) => (
          <span
            key={r.id}
            className="ripple"
            style={{ left: r.x - 90, top: r.y - 90, width: 180, height: 180 }}
            aria-hidden="true"
          />
        ))}
        <span className="num text-6xl sm:text-8xl">{running ? clicks : finished ? finished.clicks : 0}</span>
        <span className="mt-3 max-w-sm px-6 text-sm text-muted-foreground">
          {finished
            ? "Test finished — check your result"
            : running
              ? mode === "spacebar"
                ? "Keep hitting space!"
                : "Keep clicking!"
              : mode === "spacebar"
                ? "Press Space to start the timer"
                : mode === "rightclick"
                  ? "Right click here to start the timer"
                  : "Click here to start the timer"}
        </span>
      </button>

      <p id="pad-help" className="mt-3 text-center text-xs text-muted-foreground">
        Mode: {MODE_LABEL[mode]}. Keyboard users: focus the pad and press Space or Enter to count a click. Press R to
        reset.
      </p>

      <div className="mt-4 flex justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="glow-hover tap-safe min-h-11 rounded-xl border border-border bg-card/50 px-5 text-sm font-medium"
        >
          Reset test
        </button>
      </div>

      <p aria-live="polite" role="status" className="sr-only">
        {announce}
      </p>

      {finished && (
        <ResultModal
          cps={finished.cps}
          clicks={finished.clicks}
          duration={duration}
          mode={mode}
          onClose={reset}
        />
      )}
      <ResetKeyListener onReset={reset} />
    </section>
  );
}

function ResetKeyListener({ onReset }: { onReset: () => void }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && ["INPUT", "TEXTAREA"].includes(t.tagName)) return;
      if (e.key.toLowerCase() === "r" && !e.metaKey && !e.ctrlKey) onReset();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onReset]);
  return null;
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-2xl px-4 py-3 text-center">
      <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="num mt-1 text-2xl">{value}</div>
    </div>
  );
}
