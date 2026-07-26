import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const TIERS = [
  { range: "1–4 CPS", who: "Casual browsing speed", note: "Fine for office work, hopeless in PVP." },
  { range: "5–7 CPS", who: "Average human", note: "The global average sits around 6.5 CPS." },
  { range: "8–10 CPS", who: "Competitive gamer", note: "Comfortable range for most Minecraft servers." },
  { range: "11–14 CPS", who: "Butterfly / jitter clicker", note: "Strong PVP tier — check your server rules." },
  { range: "15+ CPS", who: "Drag clicking territory", note: "Often banned as it borders on auto-clicking." },
];

const METHODS = [
  { name: "Regular", cps: "4–8", learn: "Instant", risk: "None", best: "Everyday use, casual play" },
  { name: "Jitter", cps: "10–14", learn: "Hard", risk: "Arm strain", best: "Minecraft PVP, allowed on most servers" },
  { name: "Butterfly", cps: "12–16", learn: "Medium", risk: "Double-click abuse", best: "Bridging and combos" },
  { name: "Drag", cps: "20–100+", learn: "Very hard", risk: "Often banned", best: "Score chasing only" },
];

const FAQS = [
  {
    q: "What is a good CPS for Minecraft PVP?",
    a: "Most PVP players land between 8 and 12 CPS. Anything above 10 gives you a real advantage in melee fights, while many servers cap legal clicking around 15 CPS before anti-cheat flags you.",
  },
  {
    q: "How do I increase my clicks per second?",
    a: "Rest your wrist, use a light mouse with low actuation switches, and practise in short 5 second bursts rather than long sessions. Learning jitter or butterfly clicking gives the biggest jump, but build up slowly to avoid strain.",
  },
  {
    q: "Is drag clicking bannable?",
    a: "On many Minecraft servers, yes. Drag clicking can push you past 20 CPS which most anti-cheat plugins treat as auto-clicking. Check your server rules before using it in ranked play.",
  },
  {
    q: "Does my mouse affect my CPS score?",
    a: "Significantly. Mice with light, tactile switches and a textured side make jitter and drag clicking far easier. Debounce time also matters — high debounce drops fast double clicks.",
  },
  {
    q: "Which test duration should I use?",
    a: "Use 5 seconds for your headline score — it is the standard everyone compares. Use 10 or 60 seconds to measure stamina, and 1 second to measure raw burst speed.",
  },
  {
    q: "Is this click speed test accurate?",
    a: "Yes. The timer starts on your very first click and runs on a high-resolution frame clock, so no click is lost and nothing is rounded until the final result.",
  },
];

export function SeoSections() {
  return (
    <div className="mx-auto mt-20 max-w-3xl space-y-16">
      <section aria-labelledby="good-cps">
        <h2 id="good-cps" className="text-2xl sm:text-3xl">
          What is a good CPS?
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Clicks per second measures how many times you can press your mouse button in one second. The average person
          scores around 6.5 CPS in a five second test. Competitive gamers train well past that. Here is how the tiers
          break down.
        </p>
        <ul className="mt-6 space-y-2">
          {TIERS.map((t) => (
            <li key={t.range} className="glass flex flex-wrap items-baseline gap-x-4 gap-y-1 rounded-xl px-4 py-3">
              <span className="num text-sm text-accent">{t.range}</span>
              <span className="text-sm font-medium">{t.who}</span>
              <span className="w-full text-xs text-muted-foreground sm:w-auto sm:flex-1">{t.note}</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="methods">
        <h2 id="methods" className="text-2xl sm:text-3xl">
          Clicking methods compared
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Four techniques dominate click speed tests. Each trades difficulty and risk for raw speed.
        </p>
        <div className="glass mt-6 overflow-x-auto rounded-2xl">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Comparison of clicking methods by speed, difficulty and risk</caption>
            <thead className="text-xs uppercase tracking-widest text-muted-foreground">
              <tr>
                <th scope="col" className="px-4 py-3">Method</th>
                <th scope="col" className="px-4 py-3">Typical CPS</th>
                <th scope="col" className="px-4 py-3">Difficulty</th>
                <th scope="col" className="px-4 py-3">Risk</th>
                <th scope="col" className="px-4 py-3">Best for</th>
              </tr>
            </thead>
            <tbody>
              {METHODS.map((m) => (
                <tr key={m.name} className="border-t border-border">
                  <th scope="row" className="px-4 py-3 font-medium">{m.name}</th>
                  <td className="num px-4 py-3 text-accent">{m.cps}</td>
                  <td className="px-4 py-3 text-muted-foreground">{m.learn}</td>
                  <td className="px-4 py-3 text-muted-foreground">{m.risk}</td>
                  <td className="px-4 py-3 text-muted-foreground">{m.best}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="faq">
        <h2 id="faq" className="text-2xl sm:text-3xl">
          Frequently asked questions
        </h2>
        <Accordion type="single" collapsible className="mt-4">
          {FAQS.map((f, i) => (
            <AccordionItem key={f.q} value={`item-${i}`}>
              <AccordionTrigger className="text-left text-base font-medium">{f.q}</AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  );
}

export const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};
