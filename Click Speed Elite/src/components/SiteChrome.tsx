import { Link } from "@tanstack/react-router";

const links = [
  { to: "/", label: "CPS Test" },
  { to: "/spacebar-counter", label: "Spacebar Counter" },
  { to: "/right-click-test", label: "Right Click Test" },
];

export function SiteNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/70 backdrop-blur-xl">
      <nav aria-label="Primary" className="mx-auto flex max-w-5xl items-center gap-1 px-4 py-3 sm:gap-3">
        <Link to="/" className="mr-auto font-display text-sm font-bold tracking-tight">
          <span className="text-accent">/</span>cps
        </Link>
        <ul className="flex items-center gap-1">
          {links.map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                activeOptions={{ exact: true }}
                activeProps={{ "aria-current": "page", className: "text-foreground border-accent/50 bg-accent/10" }}
                inactiveProps={{ className: "text-muted-foreground border-transparent" }}
                className="tap-safe inline-flex min-h-11 items-center rounded-lg border px-3 text-xs transition-colors hover:text-foreground sm:text-sm"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border py-8 text-center text-xs text-muted-foreground">
      <p>Built for gamers who click too much. No signup, no ads, no nonsense.</p>
    </footer>
  );
}
