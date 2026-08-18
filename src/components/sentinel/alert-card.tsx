import { Link } from "@tanstack/react-router";
import { Cctv, MapPin, Route as RouteIcon, Siren } from "lucide-react";

import { StatusBadge, severityMeta } from "@/components/sentinel/primitives";
import type { Alert } from "@/lib/sentinel/types";
import { cn } from "@/lib/utils";

export function AlertCard({ alert, compact = false }: { alert: Alert; compact?: boolean }) {
  const meta = severityMeta[alert.severity];
  const isCritical = alert.severity === "critical";

  return (
    <article
      className={cn(
        "panel relative overflow-hidden p-4",
        isCritical && "border-critical/35 bg-critical/4",
      )}
    >
      <span
        className={cn(
          "absolute inset-y-0 left-0 w-1",
          alert.severity === "critical" && "bg-critical",
          alert.severity === "high" && "bg-warning",
          alert.severity === "medium" && "bg-info",
          alert.severity === "low" && "bg-muted-foreground/40",
          alert.severity === "resolved" && "bg-success",
        )}
        aria-hidden
      />

      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 pl-2">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "grid size-7 shrink-0 place-items-center rounded-md",
                isCritical ? "bg-critical text-critical-foreground marker-pulse" : "bg-muted text-foreground",
              )}
            >
              <Siren className="size-4" aria-hidden />
            </span>
            <h3 className="min-w-0 truncate text-sm font-bold text-foreground">{alert.title}</h3>
            <StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{alert.note}</p>
        </div>
        <span className="tabular shrink-0 text-xs font-semibold text-muted-foreground">
          {alert.time}
        </span>
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 pl-2 sm:grid-cols-4">
        <div className="min-w-0">
          <dt className="label-caps">Vehicle</dt>
          <dd className="tabular truncate text-sm font-bold text-foreground">{alert.vehicleNumber}</dd>
        </div>
        <div className="min-w-0">
          <dt className="label-caps">Camera</dt>
          <dd className="truncate text-sm font-semibold text-foreground">{alert.cameraId}</dd>
        </div>
        <div className="min-w-0">
          <dt className="label-caps">Location</dt>
          <dd className="truncate text-sm font-medium text-foreground">{alert.location}</dd>
        </div>
        <div className="min-w-0">
          <dt className="label-caps">Confidence</dt>
          <dd className="tabular truncate text-sm font-semibold text-foreground">
            {alert.confidence ? `${alert.confidence}%` : "—"}
          </dd>
        </div>
      </dl>

      {!compact ? (
        <div className="mt-4 grid gap-2 pl-2 sm:grid-cols-3">
          <Link
            to="/cameras"
            className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-md bg-navy px-3 text-xs font-semibold text-navy-foreground transition-colors hover:bg-navy-muted"
          >
            <Cctv className="size-3.5" aria-hidden /> View Camera
          </Link>
          <Link
            to="/gis"
            className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-md border border-border bg-surface px-3 text-xs font-semibold text-foreground transition-colors hover:bg-accent"
          >
            <RouteIcon className="size-3.5" aria-hidden /> View Route
          </Link>
          <Link
            to="/vehicle/$number"
            params={{ number: alert.vehicleNumber }}
            className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-md border border-border bg-surface px-3 text-xs font-semibold text-foreground transition-colors hover:bg-accent"
          >
            <MapPin className="size-3.5" aria-hidden /> View Details
          </Link>
        </div>
      ) : null}
    </article>
  );
}
