import { createFileRoute } from "@tanstack/react-router";
import { ClickPad } from "@/components/ClickPad";

export const Route = createFileRoute("/spacebar-counter")({
  component: SpacebarPage,
  head: () => ({
    meta: [
      { title: "Spacebar Counter — Space Bar Speed Test" },
      {
        name: "description",
        content:
          "Count spacebar presses per second. Test your space bar speed over 1, 5, 10 or 60 seconds and share your rank.",
      },
      { property: "og:title", content: "Spacebar Counter — Space Bar Speed Test" },
      { property: "og:description", content: "How many times can you hit space in 5 seconds?" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/spacebar-counter" },
    ],
    links: [{ rel: "canonical", href: "/spacebar-counter" }],
  }),
});

function SpacebarPage() {
  return (
    <ClickPad
      mode="spacebar"
      defaultDuration={5}
      title="Spacebar Counter"
      subtitle="Hit the spacebar as fast as you can. On touch devices, tap the pad instead — every tap counts as a press."
    />
  );
}
