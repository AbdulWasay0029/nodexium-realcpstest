import { createFileRoute } from "@tanstack/react-router";
import { ClickPad } from "@/components/ClickPad";

export const Route = createFileRoute("/right-click-test")({
  component: RightClickPage,
  head: () => ({
    meta: [
      { title: "Right Click Test — Right Mouse Button CPS" },
      {
        name: "description",
        content:
          "Test your right click speed. Measure right mouse button CPS over 1, 5, 10 or 60 seconds and compare against your best.",
      },
      { property: "og:title", content: "Right Click Test — Right Mouse Button CPS" },
      { property: "og:description", content: "Measure how fast you can right click." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/right-click-test" },
    ],
    links: [{ rel: "canonical", href: "/right-click-test" }],
  }),
});

function RightClickPage() {
  return (
    <ClickPad
      mode="rightclick"
      defaultDuration={5}
      title="Right Click Test"
      subtitle="Right click the pad as fast as you can. The context menu is disabled here so nothing interrupts your run."
    />
  );
}
