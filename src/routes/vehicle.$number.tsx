import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/sentinel/app-shell";
import { DetectionTimeline } from "@/components/sentinel/detection-timeline";
import { GujaratMap } from "@/components/sentinel/gujarat-map";
import {
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeading,
  ProcessingState,
  SectionCard,
} from "@/components/sentinel/primitives";
import { VehicleSummary } from "@/components/sentinel/vehicle-summary";
import { queryKeys, sentinelApi } from "@/lib/sentinel/api";

export const Route = createFileRoute("/vehicle/$number")({
  head: () => ({
    meta: [
      { title: "Vehicle Intelligence — SENTINEL" },
      {
        name: "description",
        content:
          "Full vehicle intelligence profile: detections, cameras, locations, confidence, route and watchlist status.",
      },
      { property: "og:title", content: "Vehicle Intelligence — SENTINEL" },
      { property: "og:description", content: "Detections, route and watchlist status for a tracked vehicle." },
    ],
  }),
  component: VehiclePage,
});

function VehiclePage() {
  const { number } = Route.useParams();
  const plate = number.toUpperCase();
  const result = useQuery({
    queryKey: queryKeys.vehicle(plate),
    queryFn: () => sentinelApi.searchVehicle(plate),
  });
  const cameras = useQuery({ queryKey: queryKeys.cameras, queryFn: sentinelApi.getCameras });

  return (
    <AppShell>
      <div className="space-y-5">
        <PageHeading eyebrow="Vehicle profile" title={plate} description="Reconstructed movement from ANPR detections across the connected network." />

        {result.isPending ? (
          <div className="space-y-3">
            <ProcessingState label={`Reconstructing movement for ${plate}…`} />
            <LoadingState rows={3} />
          </div>
        ) : result.isError ? (
          <ErrorState onRetry={() => result.refetch()} />
        ) : !result.data.found ? (
          <EmptyState
            title="Target vehicle not detected"
            description="No detections recorded for this registration number."
          />
        ) : (
          <>
            <VehicleSummary vehicle={result.data} />
            <div className="grid gap-4 xl:grid-cols-[1.15fr_1fr]">
              <SectionCard title="Detection Timeline" bodyClassName="p-3 sm:p-4">
                <DetectionTimeline detections={result.data.detections} />
              </SectionCard>
              <SectionCard title="Movement Map" bodyClassName="p-3 sm:p-4">
                <GujaratMap
                  cameras={cameras.data ?? []}
                  route={result.data.detections}
                  layers={{ cameras: true, route: true, heatmap: false, satellite: false, nearby: false }}
                  className="aspect-4/3"
                />
              </SectionCard>
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
