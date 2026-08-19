import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { AppShell } from "@/components/sentinel/app-shell";
import { GujaratMap, type MapLayers } from "@/components/sentinel/gujarat-map";
import {
  ErrorState,
  PageHeading,
  SectionCard,
  StatusBadge,
} from "@/components/sentinel/primitives";
import { queryKeys, sentinelApi } from "@/lib/sentinel/api";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/gis")({
  head: () => ({
    meta: [
      { title: "GIS Intelligence — SENTINEL" },
      {
        name: "description",
        content:
          "Geospatial view of the CCTV network with reconstructed vehicle routes, detection markers, heatmap and nearby camera lookup.",
      },
      { property: "og:title", content: "GIS Intelligence — SENTINEL" },
      {
        property: "og:description",
        content: "Where the vehicle went, which camera saw it, and when.",
      },
    ],
  }),
  component: GisPage,
});

function GisPage() {
  const [layers, setLayers] = useState<MapLayers>({
    cameras: true,
    route: true,
    heatmap: false,
    satellite: false,
    nearby: false,
  });
  const cameras = useQuery({ queryKey: queryKeys.cameras, queryFn: sentinelApi.getCameras });
  const route = useQuery({ queryKey: queryKeys.latestRoute, queryFn: sentinelApi.getLatestRoute });

  const toggles: Array<{ key: keyof MapLayers; label: string }> = [
    { key: "cameras", label: "Cameras" },
    { key: "route", label: "Vehicle Route" },
    { key: "nearby", label: "Nearby Cameras" },
    { key: "heatmap", label: "Heatmap" },
    { key: "satellite", label: "Satellite" },
  ];

  const waypoints = route.data ?? [];
  const trackedPlate = waypoints[0]?.vehicleNumber ?? null;
  const routeSummary = waypoints.length
    ? waypoints.map((detection) => detection.cameraId).join(" → ")
    : "No recent detections";

  return (
    <AppShell>
      <div className="space-y-5">
        <PageHeading
          eyebrow="Geospatial intelligence"
          title="GIS Intelligence"
          description="Camera positions, detection markers and reconstructed vehicle movement across districts."
          actions={
            trackedPlate ? (
              <StatusBadge tone="royal">Tracking {trackedPlate}</StatusBadge>
            ) : (
              <StatusBadge tone="royal" dot={false}>
                No active route
              </StatusBadge>
            )
          }
        />

        <div className="grid gap-4 xl:grid-cols-[1fr_20rem]">
          <SectionCard title="Network & Route" subtitle={routeSummary} bodyClassName="p-3 sm:p-4">
            {cameras.isPending ? (
              <div className="aspect-4/3 animate-pulse rounded-lg bg-muted sm:aspect-16/9" />
            ) : cameras.isError ? (
              <ErrorState onRetry={() => cameras.refetch()} />
            ) : (
              <GujaratMap
                cameras={cameras.data}
                route={waypoints}
                layers={layers}
                className="aspect-4/3 sm:aspect-16/9"
              />
            )}
          </SectionCard>

          <div className="space-y-4">
            <SectionCard title="Map Layers" bodyClassName="space-y-2 p-3 sm:p-4">
              {toggles.map((toggle) => (
                <button
                  key={toggle.key}
                  onClick={() =>
                    setLayers((prev) => ({ ...prev, [toggle.key]: !prev[toggle.key] }))
                  }
                  aria-pressed={layers[toggle.key]}
                  className={cn(
                    "flex min-h-11 w-full items-center justify-between rounded-md border px-3 text-sm font-semibold transition-colors",
                    layers[toggle.key]
                      ? "border-royal bg-royal/10 text-royal"
                      : "border-border bg-surface text-foreground hover:bg-accent",
                  )}
                >
                  {toggle.label}
                  <span
                    className={cn(
                      "size-2.5 rounded-full",
                      layers[toggle.key] ? "bg-royal" : "bg-muted-foreground/40",
                    )}
                    aria-hidden
                  />
                </button>
              ))}
            </SectionCard>

            <SectionCard title="Route Waypoints" bodyClassName="p-0">
              {waypoints.length === 0 ? (
                <p className="p-4 text-sm text-muted-foreground">
                  No detections recorded yet — waypoints appear here as ANPR events come in.
                </p>
              ) : (
                <ul className="divide-y divide-border">
                  {waypoints.map((detection) => (
                    <li key={detection.id} className="flex items-center justify-between gap-3 px-4 py-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-foreground">
                          {detection.cameraId}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">{detection.location}</p>
                      </div>
                      <span className="tabular shrink-0 text-xs font-semibold text-foreground">
                        {detection.time}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </SectionCard>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
