import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/sentinel/app-shell";
import { PageHeading, SectionCard } from "@/components/sentinel/primitives";
import {
  confidenceBands,
  departmentActivity,
  detectionVolume,
  topLocations,
} from "@/lib/sentinel/sample-analytics";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — SENTINEL" },
      {
        name: "description",
        content:
          "Detection volume, camera uptime, department activity, most active locations and AI confidence distribution.",
      },
      { property: "og:title", content: "Analytics — SENTINEL" },
      { property: "og:description", content: "Operational trends across the CCTV intelligence network." },
    ],
  }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const max = Math.max(...detectionVolume.map((point) => point.detections));

  return (
    <AppShell>
      <div className="space-y-5">
        <PageHeading
          eyebrow="Insight"
          title="Analytics"
          description="Readability first: volume, uptime and confidence trends that a control room can act on."
        />

        <SectionCard title="Detection Volume" subtitle="Detections and watchlist matches by hour">
          <div className="flex h-56 items-end gap-1.5">
            {detectionVolume.map((point) => (
              <div key={point.hour} className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
                <div className="flex w-full flex-1 items-end">
                  <div
                    className="w-full rounded-t bg-royal/85"
                    style={{ height: `${(point.detections / max) * 100}%` }}
                    title={`${point.detections} detections at ${point.hour}:00`}
                  />
                </div>
                <span className="tabular text-[10px] text-muted-foreground">{point.hour}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        <div className="grid gap-4 lg:grid-cols-2">
          <SectionCard title="Department Activity" bodyClassName="space-y-3 p-4 sm:p-5">
            {departmentActivity.map((row) => (
              <div key={row.department}>
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="font-semibold text-foreground">{row.department}</span>
                  <span className="tabular text-muted-foreground">
                    {row.cameras} cams · {row.detections} detections
                  </span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-navy"
                    style={{ width: `${(row.detections / 512) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </SectionCard>

          <SectionCard title="AI Confidence Distribution" bodyClassName="space-y-3 p-4 sm:p-5">
            {confidenceBands.map((band) => (
              <div key={band.band}>
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="font-semibold text-foreground">{band.band}</span>
                  <span className="tabular text-muted-foreground">{band.share}%</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-success" style={{ width: `${band.share}%` }} />
                </div>
              </div>
            ))}
          </SectionCard>
        </div>

        <SectionCard title="Most Active Locations" bodyClassName="p-0">
          <ul className="divide-y divide-border">
            {topLocations.map((row) => (
              <li key={row.location} className="flex items-center justify-between gap-3 px-4 py-3">
                <span className="min-w-0 truncate text-sm font-semibold text-foreground">
                  {row.location}
                </span>
                <span className="tabular shrink-0 text-xs text-muted-foreground">
                  {row.detections} detections · {row.uptime}% uptime
                </span>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </AppShell>
  );
}
