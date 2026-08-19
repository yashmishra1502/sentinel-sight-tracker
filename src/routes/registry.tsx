import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { AddCameraDialog } from "@/components/sentinel/add-camera-dialog";
import { AppShell } from "@/components/sentinel/app-shell";
import {
  ErrorState,
  LoadingState,
  PageHeading,
  SectionCard,
  StatusBadge,
  cameraStatusMeta,
} from "@/components/sentinel/primitives";
import { queryKeys, sentinelApi } from "@/lib/sentinel/api";

export const Route = createFileRoute("/registry")({
  head: () => ({
    meta: [
      { title: "Camera Registry — SENTINEL" },
      {
        name: "description",
        content:
          "Registry of all connected cameras with stream state, AI status, department ownership and last heartbeat.",
      },
      { property: "og:title", content: "Camera Registry — SENTINEL" },
      { property: "og:description", content: "Stream, AI and heartbeat health for every registered camera." },
    ],
  }),
  component: RegistryPage,
});

function RegistryPage() {
  const cameras = useQuery({ queryKey: queryKeys.cameras, queryFn: sentinelApi.getCameras });

  return (
    <AppShell>
      <div className="space-y-5">
        <PageHeading
          eyebrow="Infrastructure"
          title="Camera Registry"
          description="Source of truth for camera onboarding: vendor stream state, AI service state and heartbeat."
          actions={<AddCameraDialog />}
        />

        {cameras.isPending ? (
          <LoadingState rows={5} label="Loading registry" />
        ) : cameras.isError ? (
          <ErrorState onRetry={() => cameras.refetch()} />
        ) : (
          <SectionCard title="Registered Sources" subtitle={`${cameras.data.length} cameras`} bodyClassName="p-0">
            <ul className="divide-y divide-border">
              {cameras.data.map((camera) => {
                const meta = cameraStatusMeta[camera.status];
                return (
                  <li key={camera.id} className="grid gap-2 p-4 lg:grid-cols-[10rem_minmax(0,1fr)_auto] lg:items-center">
                    <div className="flex items-center gap-2">
                      <span className="tabular text-sm font-bold text-foreground">{camera.id}</span>
                      <StatusBadge tone={meta.tone} pulse={camera.status === "live"}>
                        {meta.label}
                      </StatusBadge>
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {camera.location} · {camera.district}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {camera.department} · {camera.resolution} · Stream{" "}
                        {camera.streamConnected ? "connected" : "unavailable"} · AI{" "}
                        {camera.aiActive ? "active" : "idle"}
                      </p>
                    </div>
                    <p className="tabular text-xs font-semibold text-muted-foreground">
                      Heartbeat {camera.lastHeartbeatSeconds}s ago
                    </p>
                  </li>
                );
              })}
            </ul>
          </SectionCard>
        )}
      </div>
    </AppShell>
  );
}
