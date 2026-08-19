import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Filter, Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

import { AppShell } from "@/components/sentinel/app-shell";
import { DetectionTimeline } from "@/components/sentinel/detection-timeline";
import {
  EmptyState,
  ErrorState,
  PageHeading,
  ProcessingState,
  SectionCard,
  StatusBadge,
} from "@/components/sentinel/primitives";
import { VehicleSummary } from "@/components/sentinel/vehicle-summary";
import { queryKeys, sentinelApi } from "@/lib/sentinel/api";
import { cn } from "@/lib/utils";

const searchSchema = z.object({
  q: z.string().optional(),
});

export const Route = createFileRoute("/search")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Vehicle Search — SENTINEL" },
      {
        name: "description",
        content:
          "Search a vehicle registration number across the connected CCTV network and reconstruct its movement from ANPR detections.",
      },
      { property: "og:title", content: "Vehicle Search — SENTINEL" },
      {
        property: "og:description",
        content: "Enter a plate, get detections, cameras, locations, confidence and watchlist status.",
      },
    ],
  }),
  component: SearchPage,
});

function FilterPanel({ open, cameraIds }: { open: boolean; cameraIds: string[] }) {
  if (!open) return null;
  const fields: Array<{ label: string; options: string[] }> = [
    { label: "Date range", options: ["Today", "Last 24 hours", "Last 7 days", "Custom"] },
    { label: "Department", options: ["All", "POLICE", "MUNICIPAL", "GSRTC", "PANCHAYAT", "HEALTH"] },
    { label: "Location", options: ["All districts", "Ahmedabad", "Gandhinagar", "Surat", "Rajkot"] },
    { label: "Camera", options: ["All cameras", ...cameraIds] },
    { label: "Min. confidence", options: ["70%", "80%", "90%", "95%"] },
    { label: "Watchlist status", options: ["Any", "Match only", "No match"] },
  ];
  return (
    <div className="grid gap-3 border-t border-border pt-4 sm:grid-cols-2 lg:grid-cols-3">
      {fields.map((field) => (
        <div key={field.label} className="min-w-0">
          <label
            htmlFor={`filter-${field.label}`}
            className="label-caps block"
          >
            {field.label}
          </label>
          <select
            id={`filter-${field.label}`}
            className="mt-1.5 h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:border-ring focus:outline-none"
          >
            {field.options.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}

function SearchPage() {
  const { q } = Route.useSearch();
  const navigate = useNavigate();
  const [input, setInput] = useState(q ?? "");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const plate = (q ?? "").replace(/[\s-]/g, "").toUpperCase();
  const result = useQuery({
    queryKey: queryKeys.vehicle(plate),
    queryFn: () => sentinelApi.searchVehicle(plate),
    enabled: plate.length >= 4,
  });
  const cameras = useQuery({ queryKey: queryKeys.cameras, queryFn: sentinelApi.getCameras });

  return (
    <AppShell>
      <div className="space-y-5">
        <PageHeading
          eyebrow="ANPR intelligence"
          title="Search Across CCTV Network"
          description="Every registered camera, live and archived, is queried through the detection index. Results are structured AI output — camera, timestamp, plate and confidence."
        />

        <section className="panel p-4 sm:p-5">
          <form
            className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto_auto]"
            onSubmit={(event) => {
              event.preventDefault();
              navigate({ to: "/search", search: { q: input.trim().toUpperCase() } });
            }}
          >
            <div className="min-w-0">
              <label htmlFor="vehicle-number" className="label-caps block">
                Enter vehicle registration number
              </label>
              <input
                id="vehicle-number"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="GJ01AB1234"
                autoComplete="off"
                className="tabular mt-1.5 h-14 w-full rounded-md border border-input bg-background px-4 text-lg font-bold tracking-[0.18em] uppercase placeholder:font-medium placeholder:tracking-widest placeholder:text-muted-foreground focus:border-ring focus:outline-none sm:text-xl"
              />
            </div>
            <button
              type="submit"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-royal px-6 text-sm font-bold tracking-wide text-royal-foreground uppercase transition-colors hover:bg-royal/90 lg:mt-6"
            >
              <Search className="size-4" aria-hidden /> Search Vehicle
            </button>
            <button
              type="button"
              onClick={() => setFiltersOpen((value) => !value)}
              className={cn(
                "inline-flex min-h-12 items-center justify-center gap-2 rounded-md border px-4 text-sm font-semibold lg:mt-6",
                filtersOpen
                  ? "border-royal bg-royal/10 text-royal"
                  : "border-border bg-surface text-foreground hover:bg-accent",
              )}
              aria-expanded={filtersOpen}
            >
              <SlidersHorizontal className="size-4" aria-hidden /> Filters
            </button>
          </form>

          <div className="mt-4">
            <FilterPanel open={filtersOpen} cameraIds={(cameras.data ?? []).map((c) => c.id)} />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="label-caps flex items-center gap-1.5">
              <Filter className="size-3.5" aria-hidden /> Filters apply to the next search
            </span>
          </div>
        </section>

        {plate.length < 4 ? (
          <EmptyState
            title="Awaiting a registration number"
            description="Enter a plate above to query detections across all connected departments."
          />
        ) : result.isPending ? (
          <div className="space-y-3">
            <ProcessingState label={`Analyzing feeds for ${plate}…`} />
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-28 animate-pulse rounded-lg bg-muted" />
              ))}
            </div>
          </div>
        ) : result.isError ? (
          <ErrorState onRetry={() => result.refetch()} />
        ) : !result.data.found ? (
          <SectionCard title="No match" subtitle={`Target vehicle ${plate} not detected`}>
            <EmptyState
              title="Target vehicle not detected"
              description="No ANPR detection recorded for this plate in the selected window. Widen the date range or verify the number."
            />
          </SectionCard>
        ) : (
          <div className="space-y-4">
            <VehicleSummary vehicle={result.data} />
            <SectionCard
              title="Detection Timeline"
              subtitle={`${result.data.detections.length} detections across ${result.data.cameras} cameras`}
              actions={<StatusBadge tone="royal">ANPR verified</StatusBadge>}
              bodyClassName="p-3 sm:p-4"
            >
              <DetectionTimeline detections={result.data.detections} />
            </SectionCard>
          </div>
        )}
      </div>
    </AppShell>
  );
}
