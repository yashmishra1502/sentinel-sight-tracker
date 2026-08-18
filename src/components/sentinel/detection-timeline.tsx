import { Link } from "@tanstack/react-router";
import { ArrowDown, Cctv, Clock, MapPin } from "lucide-react";

import { ConfidenceMeter, StatusBadge } from "@/components/sentinel/primitives";
import type { Detection } from "@/lib/sentinel/types";

function Thumbnail({ detection }: { detection: Detection }) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-md border border-border bg-navy sm:w-40 sm:shrink-0">
      <div className="grid-backdrop absolute inset-0 opacity-70" aria-hidden />
      <div className="absolute inset-0 grid place-items-center">
        <span className="tabular rounded border border-royal/60 bg-navy/85 px-2 py-1 text-[11px] font-bold tracking-wider text-navy-foreground">
          {detection.vehicleNumber}
        </span>
      </div>
      <span className="absolute top-1.5 left-1.5 rounded bg-navy/80 px-1.5 py-0.5 text-[10px] font-semibold text-navy-foreground/80">
        Plate crop
      </span>
    </div>
  );
}

export function DetectionTimeline({ detections }: { detections: Detection[] }) {
  return (
    <ol className="relative space-y-3">
      {detections.map((detection, index) => (
        <li key={detection.id} className="relative">
          <article className="panel p-3 sm:p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
              <div className="flex items-center gap-3 sm:w-24 sm:flex-col sm:items-start sm:gap-1">
                <span className="tabular text-sm font-extrabold text-foreground">
                  {detection.time}
                </span>
                <StatusBadge tone="royal" dot={false}>
                  #{index + 1}
                </StatusBadge>
              </div>

              <Thumbnail detection={detection} />

              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="flex items-center gap-1.5 text-sm font-bold text-foreground">
                    <Cctv className="size-3.5 text-royal" aria-hidden />
                    {detection.cameraId}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="size-3.5" aria-hidden />
                    {detection.location}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="size-3.5" aria-hidden />
                    {detection.direction}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {detection.cameraName} · {detection.colour} {detection.vehicleType} · Plate
                  confidence {detection.plateConfidence}%
                </p>
                <ConfidenceMeter value={detection.confidence} className="max-w-xs" />
                <div className="grid grid-cols-2 gap-2 pt-1 sm:max-w-sm">
                  <Link
                    to="/cameras"
                    className="inline-flex min-h-10 items-center justify-center rounded-md border border-border bg-surface px-2 text-xs font-semibold text-foreground transition-colors hover:bg-accent"
                  >
                    View Camera
                  </Link>
                  <Link
                    to="/gis"
                    className="inline-flex min-h-10 items-center justify-center rounded-md bg-navy px-2 text-xs font-semibold text-navy-foreground transition-colors hover:bg-navy-muted"
                  >
                    View on Map
                  </Link>
                </div>
              </div>
            </div>
          </article>

          {index < detections.length - 1 ? (
            <div className="flex items-center justify-center py-1" aria-hidden>
              <ArrowDown className="size-4 text-royal/70" />
            </div>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
