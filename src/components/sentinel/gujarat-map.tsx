import { useState } from "react";

import type { Camera, Detection } from "@/lib/sentinel/types";
import { cn } from "@/lib/utils";

/**
 * Lightweight SVG GIS surface (schematic Gujarat outline in a 0-100 space).
 * Coordinates come from the API layer, so a real tile map (Leaflet/Mapbox) can
 * later replace this component without changing any caller.
 */

const GUJARAT_PATH =
  "M8,34 L14,24 L24,20 L33,22 L38,16 L47,15 L52,21 L58,24 L61,31 L58,38 L60,45 L57,52 L62,58 L61,66 L57,72 L59,80 L54,90 L47,92 L44,84 L38,80 L33,76 L28,80 L22,79 L18,72 L22,65 L18,58 L24,54 L20,48 L26,44 L20,40 L12,42 Z";

export interface MapLayers {
  cameras: boolean;
  route: boolean;
  heatmap: boolean;
  satellite: boolean;
  nearby: boolean;
}

export function GujaratMap({
  cameras,
  route = [],
  layers,
  className,
  onSelectCamera,
}: {
  cameras: Camera[];
  route?: Detection[];
  layers: MapLayers;
  className?: string;
  onSelectCamera?: (camera: Camera) => void;
}) {
  const [hovered, setHovered] = useState<string | null>(null);

  const routePoints = route
    .map((detection) => cameras.find((camera) => camera.id === detection.cameraId))
    .filter((camera): camera is Camera => Boolean(camera));

  const polyline = routePoints.map((camera) => `${camera.x},${camera.y}`).join(" ");

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-lg border border-border",
        layers.satellite ? "bg-navy" : "bg-surface-2",
        className,
      )}
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        className="h-full w-full"
        role="img"
        aria-label="Gujarat camera network map with vehicle route"
      >
        <defs>
          <pattern id="grid" width="5" height="5" patternUnits="userSpaceOnUse">
            <path
              d="M5 0 L0 0 0 5"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.15"
              className={layers.satellite ? "text-navy-foreground/12" : "text-border"}
            />
          </pattern>
          <radialGradient id="heat" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="oklch(0.555 0.215 26)" stopOpacity="0.42" />
            <stop offset="100%" stopColor="oklch(0.555 0.215 26)" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="100" height="100" fill="url(#grid)" />

        <path
          d={GUJARAT_PATH}
          className={
            layers.satellite
              ? "fill-navy-muted/45 stroke-royal/60"
              : "fill-royal/6 stroke-royal/45"
          }
          strokeWidth="0.4"
        />

        {layers.heatmap
          ? cameras
              .filter((_, index) => index % 3 === 0)
              .map((camera) => (
                <circle
                  key={`heat-${camera.id}`}
                  cx={camera.x}
                  cy={camera.y}
                  r={7}
                  fill="url(#heat)"
                />
              ))
          : null}

        {layers.route && polyline ? (
          <>
            <polyline
              points={polyline}
              fill="none"
              className="stroke-royal/35"
              strokeWidth="1.1"
              strokeLinecap="round"
            />
            <polyline
              points={polyline}
              fill="none"
              className="flow-dash stroke-royal"
              strokeWidth="0.55"
              strokeLinecap="round"
            />
          </>
        ) : null}

        {layers.cameras
          ? cameras.map((camera) => {
              const inRoute = routePoints.some((point) => point.id === camera.id);
              const colour =
                camera.status === "live"
                  ? "fill-success"
                  : camera.status === "error"
                    ? "fill-critical"
                    : "fill-warning";
              return (
                <g
                  key={camera.id}
                  onMouseEnter={() => setHovered(camera.id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => onSelectCamera?.(camera)}
                  className="cursor-pointer"
                >
                  {inRoute ? (
                    <circle cx={camera.x} cy={camera.y} r="2.4" className="fill-royal/25" />
                  ) : null}
                  <circle
                    cx={camera.x}
                    cy={camera.y}
                    r={inRoute ? 1.2 : 0.85}
                    className={inRoute ? "fill-royal" : colour}
                    stroke="white"
                    strokeWidth="0.22"
                  />
                </g>
              );
            })
          : null}

        {layers.route
          ? routePoints.map((camera, index) => (
              <text
                key={`label-${camera.id}`}
                x={camera.x + 2}
                y={camera.y - 1.4}
                className={cn(
                  "text-[2.4px] font-bold",
                  layers.satellite ? "fill-navy-foreground" : "fill-foreground",
                )}
              >
                {camera.id} · {route[index]?.time ?? ""}
              </text>
            ))
          : null}
      </svg>

      {hovered ? (
        <div className="pointer-events-none absolute top-3 left-3 rounded-md border border-border bg-surface px-3 py-2 text-xs shadow-[var(--shadow-panel)]">
          <p className="font-bold text-foreground">{hovered}</p>
          <p className="text-muted-foreground">
            {cameras.find((camera) => camera.id === hovered)?.location} ·{" "}
            {cameras.find((camera) => camera.id === hovered)?.department}
          </p>
        </div>
      ) : null}

      <div className="pointer-events-none absolute right-3 bottom-3 flex flex-col gap-1 rounded-md border border-border bg-surface/95 px-2.5 py-2 text-[11px]">
        {[
          { label: "Online camera", className: "bg-success" },
          { label: "Degraded", className: "bg-warning" },
          { label: "Route detection", className: "bg-royal" },
        ].map((item) => (
          <span key={item.label} className="flex items-center gap-1.5 text-muted-foreground">
            <span className={cn("size-2 rounded-full", item.className)} aria-hidden />
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}
