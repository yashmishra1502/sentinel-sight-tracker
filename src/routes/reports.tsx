import { createFileRoute } from "@tanstack/react-router";
import { FileDown } from "lucide-react";

import { AppShell } from "@/components/sentinel/app-shell";
import { PageHeading, SectionCard } from "@/components/sentinel/primitives";

const reports = [
  { name: "Vehicle Movement Report", detail: "Full detection trail with camera IDs, timestamps and confidence." },
  { name: "Watchlist Match Summary", detail: "All watchlist hits in a selected period with officer actions." },
  { name: "Camera Health Report", detail: "Uptime, offline windows and AI service availability per source." },
  { name: "District Activity Report", detail: "Detection volume and hotspot ranking by district." },
];

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports — SENTINEL" },
      {
        name: "description",
        content:
          "Generate case-ready reports: vehicle movement trails, watchlist matches, camera health and district activity.",
      },
      { property: "og:title", content: "Reports — SENTINEL" },
      { property: "og:description", content: "Case-ready exports from the CCTV intelligence network." },
    ],
  }),
  component: ReportsPage,
});

function ReportsPage() {
  return (
    <AppShell>
      <div className="space-y-5">
        <PageHeading
          eyebrow="Case output"
          title="Reports"
          description="Every report is generated from the same detection records shown in the command centre."
        />
        <div className="grid gap-4 lg:grid-cols-2">
          {reports.map((report) => (
            <SectionCard key={report.name} title={report.name}>
              <p className="text-sm leading-relaxed text-muted-foreground">{report.detail}</p>
              <button className="mt-3 inline-flex min-h-10 items-center gap-1.5 rounded-md border border-border bg-surface px-3 text-xs font-bold tracking-wide text-foreground uppercase hover:bg-accent">
                <FileDown className="size-4" aria-hidden /> Generate PDF
              </button>
            </SectionCard>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
