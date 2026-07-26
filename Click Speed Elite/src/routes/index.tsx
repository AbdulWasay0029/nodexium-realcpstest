import { createFileRoute } from "@tanstack/react-router";
import { ClickPad } from "@/components/ClickPad";
import { SeoSections, faqJsonLd } from "@/components/SeoSections";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "CPS Test — Click Speed Test (1s, 5s, 10s, 60s)" },
      {
        name: "description",
        content:
          "Free click speed test. Measure your CPS in 1, 5, 10, 60 seconds, get an animal rank, and share your score. Built for Minecraft PVP and competitive gamers.",
      },
      { property: "og:title", content: "CPS Test — How fast can you click?" },
      {
        property: "og:description",
        content: "Measure your clicks per second, earn an animal rank, and share the roast.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(faqJsonLd) }],
  }),
});

function Index() {
  return (
    <>
      <ClickPad
        mode="click"
        defaultDuration={5}
        title="Click Speed Test"
        subtitle="Click the pad as fast as you can. The timer starts on your first click and your CPS is scored the moment it ends."
      />
      <SeoSections />
    </>
  );
}
