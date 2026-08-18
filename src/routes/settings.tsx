import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/sentinel/app-shell";
import { PageHeading, SectionCard } from "@/components/sentinel/primitives";

const officer = [
  { label: "Officer", value: "Insp. R. Chauhan" },
  { label: "Badge ID", value: "GJP-44821" },
  { label: "Jurisdiction", value: "Ahmedabad City — Traffic" },
  { label: "Clearance", value: "Level 3 — Intelligence" },
];

const preferences = [
  { label: "Watchlist match alerts", value: "Enabled" },
  { label: "Offline camera notifications", value: "Enabled" },
  { label: "Minimum ANPR confidence", value: "85%" },
  { label: "Detection retention", value: "90 days" },
];

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — SENTINEL" },
      {
        name: "description",
        content:
          "Officer profile, jurisdiction, clearance level and control-room alert preferences for the SENTINEL platform.",
      },
      { property: "og:title", content: "Settings — SENTINEL" },
      { property: "og:description", content: "Officer profile and control-room alert preferences." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <AppShell>
      <div className="space-y-5">
        <PageHeading eyebrow="Account" title="Settings" description="Profile and alert thresholds for this console." />
        <div className="grid gap-4 lg:grid-cols-2">
          {[
            { title: "Officer Profile", rows: officer },
            { title: "Alert Preferences", rows: preferences },
          ].map((group) => (
            <SectionCard key={group.title} title={group.title} bodyClassName="p-0">
              <ul className="divide-y divide-border">
                {group.rows.map((row) => (
                  <li key={row.label} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                    <span className="text-muted-foreground">{row.label}</span>
                    <span className="font-semibold text-foreground">{row.value}</span>
                  </li>
                ))}
              </ul>
            </SectionCard>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
