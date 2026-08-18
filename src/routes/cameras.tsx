import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { AppShell } from "@/components/sentinel/app-shell";
import { CameraCard } from "@/components/sentinel/camera-card";
import {
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeading,
  StatusBadge,
} from "@/components/sentinel/primitives";
import { queryKeys, sentinelApi } from "@/lib/sentinel/api";
import type { CameraStatus, Department } from "@/lib/sentinel/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/cameras")({
  head: () => ({
    meta: [
      { title: "Live Camera Intelligence — SENTINEL" },
      {
        name: "description",
        content:
          "Monitor the unified CCTV wall: live, connecting, offline and degraded feeds with AI detection status per camera.",
      },
      { property: "og:title", content: "Live Camera Intelligence — SENTINEL" },
      {
        property: "og:description",
        content: "A single camera wall across five government departments and multiple vendors.",
      },
    ],
  }),
  component: CamerasPage,
});

const statusFilters: Array<{ label: string; value: CameraStatus | "all" }> = [
  { label: "All", value: "all" },
  { label: "Live", value: "live" },
  { label: "Connecting", value: "connecting" },
  { label: "No signal", value: "no-signal" },
  { label: "Offline", value: "offline" },
  { label: "Error", value: "error" },
];

const departmentFilters: Array<Department | "ALL"> = [
  "ALL",
  "POLICE",
  "MUNICIPAL",
  "GSRTC",
  "PANCHAYAT",
  "HEALTH",
];

function CamerasPage() {
  const [status, setStatus] = useState<CameraStatus | "all">("all");
  const [department, setDepartment] = useState<Department | "ALL">("ALL");
  const [query, setQuery] = useState("");
  const [density, setDensity] = useState<"comfort" | "dense">("comfort");

  const cameras = useQuery({ queryKey: queryKeys.cameras, queryFn: sentinelApi.getCameras });

  const filtered = useMemo(() => {
    const list = cameras.data ?? [];
    return list.filter((camera) => {
      const matchStatus = status === "all" || camera.status === status;
      const matchDept = department === "ALL" || camera.department === department;
      const term = query.trim().toLowerCase();
      const matchQuery =
        !term ||
        camera.id.toLowerCase().includes(term) ||
        camera.location.toLowerCase().includes(term) ||
        camera.district.toLowerCase().includes(term);
      return matchStatus && matchDept && matchQuery;
    });
  }, [cameras.data, status, department, query]);

  return (
    <AppShell>
      <div className="space-y-5">
        <PageHeading
          eyebrow="CCTV network"
          title="Live Camera Intelligence"
          description="Every connected source normalised into one wall. Video containers are integration points for the streaming service."
          actions={
            <>
              <StatusBadge tone="success">{cameras.data?.filter((c) => c.status === "live").length ?? 0} Live</StatusBadge>
              <div className="flex overflow-hidden rounded-md border border-border">
                {(["comfort", "dense"] as const).map((option) => (
                  <button
                    key={option}
                    onClick={() => setDensity(option)}
                    className={cn(
                      "min-h-10 px-3 text-xs font-semibold capitalize",
                      density === option
                        ? "bg-navy text-navy-foreground"
                        : "bg-surface text-muted-foreground hover:bg-accent",
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </>
          }
        />

        <section className="panel space-y-3 p-3 sm:p-4">
          <div>
            <label htmlFor="camera-search" className="label-caps">
              Filter cameras
            </label>
            <input
              id="camera-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Camera ID, location or district"
              className="mt-1.5 h-11 w-full rounded-md border border-input bg-background px-3 text-sm focus:border-ring focus:outline-none"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {statusFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setStatus(filter.value)}
                className={cn(
                  "min-h-9 rounded-full border px-3 text-xs font-semibold transition-colors",
                  status === filter.value
                    ? "border-royal bg-royal text-royal-foreground"
                    : "border-border bg-surface text-muted-foreground hover:bg-accent",
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {departmentFilters.map((dept) => (
              <button
                key={dept}
                onClick={() => setDepartment(dept)}
                className={cn(
                  "min-h-9 rounded-full border px-3 text-xs font-semibold transition-colors",
                  department === dept
                    ? "border-navy bg-navy text-navy-foreground"
                    : "border-border bg-surface text-muted-foreground hover:bg-accent",
                )}
              >
                {dept}
              </button>
            ))}
          </div>
        </section>

        {cameras.isPending ? (
          <LoadingState rows={4} label="Loading camera wall" />
        ) : cameras.isError ? (
          <ErrorState onRetry={() => cameras.refetch()} />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No cameras match these filters"
            description="Adjust status, department or search term."
          />
        ) : (
          <div
            className={cn(
              "grid gap-3",
              density === "comfort"
                ? "sm:grid-cols-2 xl:grid-cols-3"
                : "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
            )}
          >
            {filtered.map((camera) => (
              <CameraCard key={camera.id} camera={camera} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
