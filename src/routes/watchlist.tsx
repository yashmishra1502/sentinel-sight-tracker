import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useState } from "react";

import { AppShell } from "@/components/sentinel/app-shell";
import {
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeading,
  SectionCard,
  StatusBadge,
  watchlistMeta,
} from "@/components/sentinel/primitives";
import { queryKeys, sentinelApi } from "@/lib/sentinel/api";

export const Route = createFileRoute("/watchlist")({
  head: () => ({
    meta: [
      { title: "Watchlist Intelligence — SENTINEL" },
      {
        name: "description",
        content:
          "Manage watched, stolen and wanted vehicles. Every detection is matched against this list in real time.",
      },
      { property: "og:title", content: "Watchlist Intelligence — SENTINEL" },
      { property: "og:description", content: "Watched, stolen and wanted vehicles in one register." },
    ],
  }),
  component: WatchlistPage,
});

function WatchlistPage() {
  const [query, setQuery] = useState("");
  const watchlist = useQuery({ queryKey: queryKeys.watchlist, queryFn: sentinelApi.getWatchlist });
  const rows = (watchlist.data ?? []).filter((entry) =>
    entry.vehicleNumber.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <AppShell>
      <div className="space-y-5">
        <PageHeading
          eyebrow="Vehicle register"
          title="Watchlist Intelligence"
          description="Detections are matched against these entries; a match raises an immediate control-room alert."
          actions={
            <button className="inline-flex min-h-10 items-center gap-1.5 rounded-md bg-royal px-4 text-sm font-bold tracking-wide text-royal-foreground uppercase hover:bg-royal/90">
              <Plus className="size-4" aria-hidden /> Add to Watchlist
            </button>
          }
        />

        <SectionCard title="Registered Vehicles" subtitle={`${rows.length} entries`} bodyClassName="p-0">
          <div className="border-b border-border p-3 sm:p-4">
            <label htmlFor="watchlist-search" className="sr-only">
              Search watchlist
            </label>
            <input
              id="watchlist-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search registration number"
              className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm focus:border-ring focus:outline-none"
            />
          </div>

          {watchlist.isPending ? (
            <div className="p-4">
              <LoadingState rows={3} label="Loading watchlist" />
            </div>
          ) : watchlist.isError ? (
            <div className="p-4">
              <ErrorState onRetry={() => watchlist.refetch()} />
            </div>
          ) : rows.length === 0 ? (
            <div className="p-4">
              <EmptyState title="No matching watchlist entries" />
            </div>
          ) : (
            <>
              {/* Mobile: stacked cards */}
              <ul className="divide-y divide-border lg:hidden">
                {rows.map((entry) => (
                  <li key={entry.id} className="space-y-2 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="tabular text-sm font-bold text-foreground">
                        {entry.vehicleNumber}
                      </span>
                      <StatusBadge tone={watchlistMeta[entry.status].tone}>{entry.status}</StatusBadge>
                    </div>
                    <p className="text-xs text-muted-foreground">{entry.reason}</p>
                    <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                      <span>Added {entry.added}</span>
                      <span className="tabular">Last seen {entry.lastSeen ?? "—"}</span>
                    </div>
                    <Link
                      to="/vehicle/$number"
                      params={{ number: entry.vehicleNumber }}
                      className="inline-flex min-h-10 w-full items-center justify-center rounded-md border border-border bg-surface text-xs font-semibold text-foreground hover:bg-accent"
                    >
                      View Profile
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Desktop: table */}
              <div className="hidden lg:block">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left">
                      {["Vehicle", "Status", "Reason", "Added", "Last seen", "Action"].map((head) => (
                        <th key={head} className="label-caps px-4 py-2.5">
                          {head}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((entry) => (
                      <tr key={entry.id} className="border-b border-border last:border-0">
                        <td className="tabular px-4 py-3 font-bold text-foreground">
                          {entry.vehicleNumber}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge tone={watchlistMeta[entry.status].tone}>
                            {entry.status}
                          </StatusBadge>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{entry.reason}</td>
                        <td className="px-4 py-3 text-muted-foreground">{entry.added}</td>
                        <td className="tabular px-4 py-3 text-muted-foreground">
                          {entry.lastSeen ?? "—"}
                        </td>
                        <td className="px-4 py-3">
                          <Link
                            to="/vehicle/$number"
                            params={{ number: entry.vehicleNumber }}
                            className="font-semibold text-royal hover:underline"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </SectionCard>
      </div>
    </AppShell>
  );
}
