import { Cctv, Clock, ListChecks, MapPin, ScanLine } from "lucide-react";

import { StatusBadge, watchlistMeta } from "@/components/sentinel/primitives";
import type { VehicleHistory } from "@/lib/sentinel/types";

export function VehicleSummary({ vehicle }: { vehicle: VehicleHistory }) {
  const match = vehicle.watchlist && vehicle.watchlist.status !== "CLEARED" ? vehicle.watchlist : null;

  const cards = [
    { label: "First seen", value: vehicle.firstSeen, icon: Clock },
    { label: "Last seen", value: vehicle.lastSeen, icon: Clock },
    { label: "Detections", value: String(vehicle.detections.length).padStart(2, "0"), icon: ScanLine },
    { label: "Cameras", value: String(vehicle.cameras).padStart(2, "0"), icon: Cctv },
    { label: "Locations", value: String(vehicle.locations).padStart(2, "0"), icon: MapPin },
    { label: "Watchlist", value: match ? match.status : "No match", icon: ListChecks },
  ];

  return (
    <section className="space-y-4">
      <div className="panel grid gap-3 p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:p-5">
        <div className="min-w-0">
          <p className="label-caps">Vehicle intelligence</p>
          <h2 className="tabular font-display mt-1 text-2xl font-extrabold tracking-[0.14em] text-foreground sm:text-3xl">
            {vehicle.vehicleNumber}
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {vehicle.colour} {vehicle.vehicleType}
            {vehicle.owner ? ` · ${vehicle.owner.name}` : ""}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge tone="success">Tracking available</StatusBadge>
          {match ? (
            <StatusBadge tone={watchlistMeta[match.status].tone} pulse>
              Watchlist {match.status}
            </StatusBadge>
          ) : (
            <StatusBadge tone="neutral">No watchlist match</StatusBadge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
        {cards.map((card) => (
          <article key={card.label} className="panel p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="label-caps min-w-0 truncate">{card.label}</span>
              <card.icon className="size-4 shrink-0 text-royal" aria-hidden />
            </div>
            <p className="tabular font-display mt-2 text-xl leading-tight font-extrabold text-foreground sm:text-2xl">
              {card.value}
            </p>
          </article>
        ))}
      </div>

      {match ? (
        <div
          role="alert"
          className="panel border-critical/35 bg-critical/6 p-4 text-sm text-foreground"
        >
          <p className="font-bold">Watchlist match — immediate action advised</p>
          <p className="mt-1 text-muted-foreground">
            {match.reason} · Added by {match.addedBy} ({match.added})
          </p>
        </div>
      ) : null}
    </section>
  );
}
