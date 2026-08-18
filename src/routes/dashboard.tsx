import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  Bell,
  Car,
  Cctv,
  ListChecks,
  Search,
  SignalHigh,
  SignalZero,
} from "lucide-react";

import { AppShell } from "@/components/sentinel/app-shell";
import { AlertCard } from "@/components/sentinel/alert-card";
import { CameraCard } from "@/components/sentinel/camera-card";
import { GujaratMap } from "@/components/sentinel/gujarat-map";
import {
  ErrorState,
  KpiCard,
  KpiSkeleton,
  LoadingState,
  PageHeading,
  SectionCard,
  StatusBadge,
} from "@/components/sentinel/primitives";
import { queryKeys, sentinelApi } from "@/lib/sentinel/api";
import { trackedVehicle } from "@/lib/sentinel/mock-data";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Command Center — SENTINEL" },
      {
        name: "description",
        content:
          "Live operational overview: camera health, active alerts, vehicle detections and watchlist matches across the Gujarat CCTV network.",
      },
      { property: "og:title", content: "Command Center — SENTINEL" },
      {
        property: "og:description",
        content: "Camera health, alerts, detections and watchlist matches in one operational view.",
      },
    ],
  }),
  component: DashboardPage,
});

function QuickSearch() {
  return (
    <SectionCard
      title="Vehicle Lookup"
      subtitle="Search the full CCTV network by registration number"
    >
      <form
        className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]"
        action="/search"
        method="get"
      >
        <label htmlFor="quick-vehicle" className="sr-only">
          Vehicle registration number
        </label>
        <input
          id="quick-vehicle"
          name="q"
          placeholder="GJ01AB1234"
          className="tabular h-12 w-full rounded-md border border-input bg-background px-3 text-base font-semibold tracking-widest uppercase placeholder:font-normal placeholder:tracking-normal placeholder:text-muted-foreground focus:border-ring focus:outline-none"
        />
        <button
          type="submit"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-royal px-5 text-sm font-bold tracking-wide text-royal-foreground uppercase transition-colors hover:bg-royal/90"
        >
          <Search className="size-4" aria-hidden /> Search Vehicle
        </button>
      </form>
      <p className="mt-2 text-xs text-muted-foreground">
        Demo plates: GJ01AB1234 (watchlist match) · GJ05XY4567 (stolen)
      </p>
    </SectionCard>
  );
}

function DashboardPage() {
  const kpis = useQuery({ queryKey: queryKeys.kpis, queryFn: sentinelApi.getKpis });
  const cameras = useQuery({ queryKey: queryKeys.cameras, queryFn: sentinelApi.getCameras });
  const alerts = useQuery({ queryKey: queryKeys.alerts, queryFn: sentinelApi.getAlerts });

  return (
    <AppShell>
      <div className="space-y-5">
        <PageHeading
          eyebrow="Command center"
          title="Operational Overview"
          description="Unified status across all connected government CCTV sources, AI detection services and active intelligence."
          actions={
            <>
              <StatusBadge tone="success">System Operational</StatusBadge>
              <Link
                to="/gis"
                className="inline-flex min-h-10 items-center gap-1.5 rounded-md border border-border bg-surface px-3 text-sm font-semibold text-foreground hover:bg-accent"
              >
                Open GIS <ArrowRight className="size-4" aria-hidden />
              </Link>
            </>
          }
        />

        {kpis.isPending ? (
          <KpiSkeleton />
        ) : kpis.isError ? (
          <ErrorState onRetry={() => kpis.refetch()} />
        ) : (
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
            <KpiCard label="Cameras" value="50" icon={Cctv} context="Registered sources" tone="royal" />
            <KpiCard
              label="Online"
              value={String(kpis.data.online)}
              icon={SignalHigh}
              context="Streaming + AI active"
              tone="success"
            />
            <KpiCard
              label="Offline"
              value={String(kpis.data.offline)}
              icon={SignalZero}
              context="Vendor NVR unreachable"
              tone="warning"
            />
            <KpiCard
              label="Active Alerts"
              value="07"
              icon={Bell}
              context="2 critical"
              tone="critical"
            />
            <KpiCard
              label="Vehicles Detected"
              value="1,284"
              icon={Car}
              context="Last 24 hours"
              trend="+8.4%"
            />
            <KpiCard
              label="Watchlist Matches"
              value="12"
              icon={ListChecks}
              context="Today"
              tone="critical"
            />
          </div>
        )}

        <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
          <div className="space-y-4">
            <QuickSearch />
            <SectionCard
              title="Network Map"
              subtitle="Camera distribution and last tracked vehicle route"
              actions={
                <Link
                  to="/gis"
                  className="text-xs font-semibold text-royal hover:underline"
                >
                  Full GIS
                </Link>
              }
              bodyClassName="p-3 sm:p-4"
            >
              {cameras.isPending ? (
                <div className="aspect-4/3 animate-pulse rounded-lg bg-muted sm:aspect-16/9" />
              ) : cameras.isError ? (
                <ErrorState onRetry={() => cameras.refetch()} />
              ) : (
                <GujaratMap
                  cameras={cameras.data}
                  route={trackedVehicle.detections}
                  layers={{ cameras: true, route: true, heatmap: false, satellite: false, nearby: false }}
                  className="aspect-4/3 sm:aspect-16/9"
                />
              )}
            </SectionCard>
          </div>

          <div className="space-y-4">
            <SectionCard
              title="Priority Alerts"
              subtitle="Highest severity first"
              actions={
                <Link to="/alerts" className="text-xs font-semibold text-royal hover:underline">
                  All alerts
                </Link>
              }
              bodyClassName="space-y-3 p-3 sm:p-4"
            >
              {alerts.isPending ? (
                <LoadingState rows={2} label="Loading alerts" />
              ) : alerts.isError ? (
                <ErrorState onRetry={() => alerts.refetch()} />
              ) : (
                alerts.data
                  .slice(0, 3)
                  .map((alert) => <AlertCard key={alert.id} alert={alert} compact />)
              )}
            </SectionCard>
          </div>
        </div>

        <SectionCard
          title="Live Feed Sample"
          subtitle="Four highest-traffic corridors"
          actions={
            <Link to="/cameras" className="text-xs font-semibold text-royal hover:underline">
              Camera wall
            </Link>
          }
          bodyClassName="p-3 sm:p-4"
        >
          {cameras.isPending ? (
            <LoadingState rows={2} label="Loading cameras" />
          ) : cameras.isError ? (
            <ErrorState onRetry={() => cameras.refetch()} />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {cameras.data.slice(0, 4).map((camera) => (
                <CameraCard key={camera.id} camera={camera} compact />
              ))}
            </div>
          )}
        </SectionCard>
      </div>
    </AppShell>
  );
}
