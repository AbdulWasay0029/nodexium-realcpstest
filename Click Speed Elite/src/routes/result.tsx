import { createFileRoute, Link } from "@tanstack/react-router";
import { MODE_LABEL, rankFor, shareText, type TestMode } from "@/lib/cps";

interface Search {
  cps: number;
  clicks: number;
  d: number;
  m: TestMode;
}

export const Route = createFileRoute("/result")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    cps: Number(s.cps) || 0,
    clicks: Number(s.clicks) || 0,
    d: Number(s.d) || 5,
    m: (["click", "spacebar", "rightclick"].includes(String(s.m)) ? s.m : "click") as TestMode,
  }),
  component: ResultPage,
  head: ({ match }) => {
    const { cps, d } = match.search as Search;
    const r = rankFor(cps);
    const title = `${cps.toFixed(2)} CPS — ${r.name} rank | CPS Test`;
    return {
      meta: [
        { title },
        { name: "description", content: shareText(cps, d) },
        { property: "og:title", content: title },
        { property: "og:description", content: shareText(cps, d) },
        { property: "og:type", content: "website" },
      ],
    };
  },
});

function ResultPage() {
  const { cps, clicks, d, m } = Route.useSearch() as Search;
  const rank = rankFor(cps);

  return (
    <section className="mx-auto max-w-md text-center">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">
        {MODE_LABEL[m]} · {d}s test
      </p>
      <h1 className="num mt-2 text-7xl">{cps.toFixed(2)}</h1>
      <p className="text-xs uppercase tracking-widest text-muted-foreground">clicks per second</p>

      <div className="glass mt-6 rounded-3xl p-6">
        <p className="text-xl font-semibold">
          <span aria-hidden="true">{rank.emoji}</span> {rank.name}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">{rank.hype}</p>
        <p className="num mt-4 text-sm text-muted-foreground">
          {clicks} clicks · {d}s
        </p>
      </div>

      <Link
        to="/"
        className="glow-hover tap-safe mt-6 inline-flex min-h-11 items-center rounded-xl border border-accent/50 bg-accent/15 px-6 text-sm font-medium"
      >
        Beat this score
      </Link>
    </section>
  );
}
