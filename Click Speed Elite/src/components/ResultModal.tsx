import { useEffect, useRef, useState } from "react";
import { buildResultPath, rankFor, shareText, type TestMode } from "@/lib/cps";
import { MODE_LABEL } from "@/lib/cps";

interface Props {
  cps: number;
  clicks: number;
  duration: number;
  mode: TestMode;
  onClose: () => void;
}

export function ResultModal({ cps, clicks, duration, mode, onClose }: Props) {
  const rank = rankFor(cps);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [copied, setCopied] = useState<"link" | "text" | null>(null);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    setShareUrl(window.location.origin + buildResultPath(cps, clicks, duration, mode));
  }, [cps, clicks, duration, mode]);

  useEffect(() => {
    closeRef.current?.focus();
    const prev = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const nodes = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button, a[href], input, [tabindex]:not([tabindex="-1"])',
      );
      if (!nodes?.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      prev?.focus?.();
    };
  }, [onClose]);

  const text = shareText(cps, duration);

  const copy = async (what: "link" | "text") => {
    try {
      await navigator.clipboard.writeText(what === "link" ? shareUrl : `${text} ${shareUrl}`);
      setCopied(what);
      window.setTimeout(() => setCopied(null), 1800);
    } catch {
      setCopied(null);
    }
  };

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "My CPS score", text, url: shareUrl });
      } catch {
        /* cancelled */
      }
    } else {
      copy("text");
    }
  };

  const downloadCard = () => {
    const c = document.createElement("canvas");
    c.width = 1200;
    c.height = 630;
    const g = c.getContext("2d");
    if (!g) return;
    g.fillStyle = "#0B0F19";
    g.fillRect(0, 0, 1200, 630);
    g.strokeStyle = "rgba(255,255,255,0.05)";
    for (let x = 0; x < 1200; x += 24) {
      g.beginPath();
      g.moveTo(x, 0);
      g.lineTo(x, 630);
      g.stroke();
    }
    for (let y = 0; y < 630; y += 24) {
      g.beginPath();
      g.moveTo(0, y);
      g.lineTo(1200, y);
      g.stroke();
    }
    g.fillStyle = "#A1A1AA";
    g.font = "500 28px Inter, sans-serif";
    g.textAlign = "center";
    g.fillText(`${MODE_LABEL[mode]} · ${duration}s test`, 600, 150);
    g.fillStyle = "#FFFFFF";
    g.font = "700 160px 'JetBrains Mono', monospace";
    g.fillText(cps.toFixed(2), 600, 320);
    g.font = "600 42px 'Plus Jakarta Sans', sans-serif";
    g.fillText(`${rank.emoji} ${rank.name} · ${clicks} clicks`, 600, 400);
    g.fillStyle = "#A1A1AA";
    g.font = "400 26px Inter, sans-serif";
    g.fillText(rank.hype.slice(0, 70), 600, 470);
    g.fillStyle = "#22d3ee";
    g.font = "600 24px Inter, sans-serif";
    g.fillText("CPS Test", 600, 560);

    const a = document.createElement("a");
    a.download = `cps-${cps.toFixed(2)}.png`;
    a.href = c.toDataURL("image/png");
    a.click();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="result-title"
        aria-describedby="result-desc"
        className="glass pop-in w-full max-w-md rounded-3xl p-6 text-center shadow-2xl"
      >
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          {MODE_LABEL[mode]} · {duration}s
        </p>
        <h2 id="result-title" className="num mt-2 text-6xl">
          {cps.toFixed(2)}
        </h2>
        <p className="text-xs uppercase tracking-widest text-muted-foreground">clicks per second</p>

        <div className="mt-5 rounded-2xl border border-border bg-card/40 p-4">
          <p className="text-lg font-semibold">
            <span aria-hidden="true">{rank.emoji}</span> {rank.name}
          </p>
          <p id="result-desc" className="mt-1 text-sm text-muted-foreground">
            {rank.hype}
          </p>
          <p className="num mt-3 text-sm text-muted-foreground">
            {clicks} clicks · {duration}s
          </p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={nativeShare}
            className="glow-hover tap-safe min-h-11 rounded-xl border border-accent/50 bg-accent/15 px-4 text-sm font-medium"
          >
            Share result
          </button>
          <button
            type="button"
            onClick={() => copy("link")}
            className="glow-hover tap-safe min-h-11 rounded-xl border border-border bg-card/50 px-4 text-sm font-medium"
          >
            {copied === "link" ? "Link copied" : "Copy link"}
          </button>
          <button
            type="button"
            onClick={() => copy("text")}
            className="glow-hover tap-safe min-h-11 rounded-xl border border-border bg-card/50 px-4 text-sm font-medium"
          >
            {copied === "text" ? "Copied roast" : "Copy roast"}
          </button>
          <button
            type="button"
            onClick={downloadCard}
            className="glow-hover tap-safe min-h-11 rounded-xl border border-border bg-card/50 px-4 text-sm font-medium"
          >
            Download image
          </button>
        </div>

        <label className="mt-4 block text-left">
          <span className="text-[11px] uppercase tracking-widest text-muted-foreground">Shareable URL</span>
          <input
            readOnly
            value={shareUrl}
            onFocus={(e) => e.currentTarget.select()}
            className="num mt-1 w-full rounded-lg border border-input bg-background/60 px-3 py-2 text-xs text-muted-foreground"
          />
        </label>

        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="glow-hover tap-safe mt-4 min-h-11 w-full rounded-xl border border-border bg-card/50 px-4 text-sm font-medium"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
