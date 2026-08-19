import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { AlertCard } from "@/components/sentinel/alert-card";
import { AppShell } from "@/components/sentinel/app-shell";
import {
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeading,
  StatusBadge,
} from "@/components/sentinel/primitives";
import { queryKeys, sentinelApi } from "@/lib/sentinel/api";
import type { AlertSeverity } from "@/lib/sentinel/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/alerts")({
  head: () => ({
    meta: [
      { title: "Alert Intelligence — SENTINEL" },
      {
        name: "description",
        content:
          "Real-time watchlist matches, stream failures and AI confidence alerts with camera, location, time and confidence context.",
      },
      { property: "og:title", content: "Alert Intelligence — SENTINEL" },
      { property: "og:description", content: "Every alert carries the action an officer should take next." },
    ],
  }),
  component: AlertsPage,
});

const filters: Array<AlertSeverity | "all"> = ["all", "critical", "high", "medium", "low", "resolved"];

function AlertsPage() {
  const [severity, setSeverity] = useState<AlertSeverity | "all">("all");
  const alerts = useQuery({ queryKey: queryKeys.alerts, queryFn: sentinelApi.getAlerts });
  const list = (alerts.data ?? []).filter(
    (alert) => severity === "all" || alert.severity === severity,
  );
  const criticalCount = (alerts.data ?? []).filter(
    (alert) => alert.severity === "critical" && !alert.acknowledged,
  ).length;

  return (
    <AppShell>
      <div className="space-y-5">
        <PageHeading
          eyebrow="Real-time intelligence"
          title="Alert Intelligence"
          description="Alerts raised by watchlist matching, AI detection and infrastructure health monitoring."
          actions={
            criticalCount > 0 ? (
              <StatusBadge tone="critical" pulse>
                {criticalCount} Critical
              </StatusBadge>
            ) : (
              <StatusBadge tone="success">No critical alerts</StatusBadge>
            )
          }
        />

        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setSeverity(filter)}
              className={cn(
                "min-h-9 rounded-full border px-3 text-xs font-semibold capitalize transition-colors",
                severity === filter
                  ? "border-royal bg-royal text-royal-foreground"
                  : "border-border bg-surface text-muted-foreground hover:bg-accent",
              )}
            >
              {filter}
            </button>
          ))}
        </div>

        {alerts.isPending ? (
          <LoadingState rows={4} label="Loading alerts" />
        ) : alerts.isError ? (
          <ErrorState onRetry={() => alerts.refetch()} />
        ) : list.length === 0 ? (
          <EmptyState title="No alerts in this category" />
        ) : (
          <div className="grid gap-3 xl:grid-cols-2">
            {list.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
