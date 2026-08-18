import { Link } from "@tanstack/react-router";
import { Cctv, Cpu, Expand, Loader2, MapPin, TriangleAlert, VideoOff } from "lucide-react";
import { useEffect, useState } from "react";

import { StatusBadge, cameraStatusMeta } from "@/components/sentinel/primitives";
import type { Camera } from "@/lib/sentinel/types";
import { cn } from "@/lib/utils";

function useTimestamp() {
  const [value, setValue] = useState("--:--:--");
  useEffect(() => {
    const tick = () =>
      setValue(new Date().toLocaleTimeString("en-IN", { hour12: false, timeZone: "Asia/Kolkata" }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return value;
}

/**
 * Camera feed surface. The inner container is the documented integration point
 * for the streaming team: mount the HLS/WebRTC <video> element in place of the
 * placeholder layer, keeping the status states below.
 */
function FeedSurface({ camera }: { camera: Camera }) {
  if (camera.status === "live") {
    return (
      <div
        data-stream-mount={camera.id}
        className="relative h-full w-full overflow-hidden bg-navy"
        aria-label={`Live feed placeholder for ${camera.id}`}
      >
        <div className="grid-backdrop absolute inset-0 opacity-80" aria-hidden />
        <div
          className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-royal/25 to-transparent"
          aria-hidden
        />
        <div className="scanline absolute inset-x-0 top-0 h-8 bg-royal/12" aria-hidden />
        <div className="absolute inset-0 grid place-items-center">
          <div className="flex flex-col items-center gap-1.5 text-navy-foreground/45">
            <Cctv className="size-7" aria-hidden />
            <span className="text-[10px] font-semibold tracking-[0.16em] uppercase">
              Stream slot · {camera.resolution}
            </span>
          </div>
        </div>
        <div
          className="absolute bottom-3 left-3 rounded border border-royal/50 bg-navy/70 px-2 py-1 text-[10px] font-semibold tracking-wide text-navy-foreground/85"
          aria-hidden
        >
          ANPR ZONE
        </div>
      </div>
    );
  }

  const map = {
    connecting: {
      icon: Loader2,
      label: "Connecting to vendor NVR…",
      spin: true,
      className: "text-info",
    },
    offline: { icon: VideoOff, label: "Camera offline", spin: false, className: "text-muted-foreground" },
    "no-signal": {
      icon: VideoOff,
      label: "No signal received",
      spin: false,
      className: "text-warning-foreground",
    },
    error: {
      icon: TriangleAlert,
      label: "Stream error · check gateway",
      spin: false,
      className: "text-critical",
    },
  } as const;

  const state = map[camera.status];
  const Icon = state.icon;
  return (
    <div className="grid h-full w-full place-items-center bg-navy-muted/12">
      <div className={cn("flex flex-col items-center gap-2 px-4 text-center", state.className)}>
        <Icon className={cn("size-6", state.spin && "animate-spin")} aria-hidden />
        <span className="text-xs font-semibold">{state.label}</span>
      </div>
    </div>
  );
}

export function CameraCard({ camera, compact = false }: { camera: Camera; compact?: boolean }) {
  const timestamp = useTimestamp();
  const meta = cameraStatusMeta[camera.status];

  return (
    <article className="panel overflow-hidden transition-shadow hover:shadow-[var(--shadow-lift)]">
      <div className="relative aspect-video w-full">
        <FeedSurface camera={camera} />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-2.5">
          <span className="tabular rounded bg-navy/80 px-2 py-1 text-[11px] font-bold tracking-wider text-navy-foreground">
            {camera.id}
          </span>
          <StatusBadge
            tone={meta.tone}
            pulse={camera.status === "live"}
            className="bg-navy/80 backdrop-blur"
          >
            {meta.label}
          </StatusBadge>
        </div>
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-2.5">
          <span className="flex min-w-0 items-center gap-1 rounded bg-navy/75 px-2 py-1 text-[11px] font-medium text-navy-foreground">
            <MapPin className="size-3 shrink-0" aria-hidden />
            <span className="truncate">{camera.district}</span>
          </span>
          <span className="tabular rounded bg-navy/75 px-2 py-1 text-[11px] font-semibold text-navy-foreground">
            {timestamp}
          </span>
        </div>
      </div>

      <div className="space-y-3 p-3">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">{camera.location}</p>
            <p className="truncate text-xs text-muted-foreground">
              {camera.department} · {camera.name}
            </p>
          </div>
          <span className="shrink-0 rounded border border-border px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
            {camera.department}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2 rounded-md bg-surface-2 px-2.5 py-2">
          <span className="flex items-center gap-1.5 text-xs font-medium text-foreground">
            <Cpu className="size-3.5 text-royal" aria-hidden />
            AI {camera.aiActive ? "Detection Active" : "Idle"}
          </span>
          <span
            className={cn(
              "size-2 rounded-full",
              camera.aiActive ? "bg-success" : "bg-muted-foreground/50",
            )}
            aria-hidden
          />
        </div>

        {!compact ? (
          <div className="grid grid-cols-2 gap-2">
            <Link
              to="/gis"
              className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-md border border-border bg-surface px-2 text-xs font-semibold text-foreground transition-colors hover:bg-accent"
            >
              <MapPin className="size-3.5" aria-hidden /> View on Map
            </Link>
            <Link
              to="/registry"
              className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-md bg-navy px-2 text-xs font-semibold text-navy-foreground transition-colors hover:bg-navy-muted"
            >
              <Expand className="size-3.5" aria-hidden /> Details
            </Link>
          </div>
        ) : null}
      </div>
    </article>
  );
}
