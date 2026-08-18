import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/sentinel/app-shell";
import { PageHeading, SectionCard } from "@/components/sentinel/primitives";

const layers = [
  {
    title: "Camera Ingestion Layer",
    detail:
      "RTSP/ONVIF feeds from Traffic, Municipal, Highway and Railway departments are normalised into a single stream registry with heartbeat monitoring.",
  },
  {
    title: "AI Inference Layer",
    detail:
      "ANPR plate recognition, vehicle attribute classification and anomaly scoring run per-frame, emitting detections with confidence values.",
  },
  {
    title: "Intelligence Layer",
    detail:
      "Detections are matched against the watchlist, correlated into vehicle journeys and enriched with district and jurisdiction metadata.",
  },
  {
    title: "Command Layer",
    detail:
      "Officers work from the command centre: KPIs, GIS route reconstruction, live CCTV wall, alerts and case-ready exports.",
  },
];

export const Route = createFileRoute("/architecture")({
  head: () => ({
    meta: [
      { title: "System Architecture — SENTINEL" },
      {
        name: "description",
        content:
          "How SENTINEL moves from camera ingestion to AI inference, watchlist correlation and command-centre action.",
      },
      { property: "og:title", content: "System Architecture — SENTINEL" },
      { property: "og:description", content: "Ingestion, inference, intelligence and command layers explained." },
    ],
  }),
  component: ArchitecturePage,
});

function ArchitecturePage() {
  return (
    <AppShell>
      <div className="space-y-5">
        <PageHeading
          eyebrow="Platform"
          title="System Architecture"
          description="A four-layer pipeline from raw municipal camera feeds to actionable control-room intelligence."
        />

        <div className="grid gap-4 lg:grid-cols-2">
          {layers.map((layer, index) => (
            <SectionCard key={layer.title} title={`0${index + 1} · ${layer.title}`}>
              <p className="text-sm leading-relaxed text-muted-foreground">{layer.detail}</p>
            </SectionCard>
          ))}
        </div>

        <SectionCard title="Data Flow">
          <ol className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2 lg:grid-cols-4">
            {["Camera feed", "AI detection", "Watchlist match", "Officer action"].map((step, index) => (
              <li key={step} className="rounded-md border border-border bg-surface px-3 py-2.5">
                <span className="label-caps block text-royal">Step {index + 1}</span>
                <span className="font-semibold text-foreground">{step}</span>
              </li>
            ))}
          </ol>
        </SectionCard>
      </div>
    </AppShell>
  );
}
