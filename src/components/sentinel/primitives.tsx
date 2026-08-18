import { AlertTriangle, Inbox, Loader2, ShieldAlert, WifiOff } from "lucide-react";
import type { ReactNode } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { AlertSeverity, CameraStatus, WatchlistStatus } from "@/lib/sentinel/types";

/* ---------------------------------------------- status badge */

type Tone = "success" | "warning" | "critical" | "info" | "neutral" | "royal";

const toneClasses: Record<Tone, string> = {
  success: "bg-success/12 text-success border-success/25",
  warning: "bg-warning/15 text-warning-foreground border-warning/35",
  critical: "bg-critical/12 text-critical border-critical/25",
  info: "bg-info/12 text-info border-info/25",
  royal: "bg-royal/10 text-royal border-royal/25",
  neutral: "bg-muted text-muted-foreground border-border",
};

export function StatusBadge({
  tone = "neutral",
  children,
  dot = true,
  className,
  pulse = false,
}: {
  tone?: Tone;
  children: ReactNode;
  dot?: boolean;
  className?: string;
  pulse?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase",
        toneClasses[tone],
        className,
      )}
    >
      {dot ? (
        <span
          aria-hidden
          className={cn("size-1.5 rounded-full bg-current", pulse && "animate-pulse")}
        />
      ) : null}
      {children}
    </span>
  );
}

export const cameraStatusMeta: Record<CameraStatus, { label: string; tone: Tone }> = {
  live: { label: "Live", tone: "success" },
  connecting: { label: "Connecting", tone: "info" },
  offline: { label: "Offline", tone: "neutral" },
  "no-signal": { label: "No signal", tone: "warning" },
  error: { label: "Error", tone: "critical" },
};

export const severityMeta: Record<AlertSeverity, { label: string; tone: Tone }> = {
  critical: { label: "Critical", tone: "critical" },
  high: { label: "High", tone: "warning" },
  medium: { label: "Medium", tone: "info" },
  low: { label: "Low", tone: "neutral" },
  resolved: { label: "Resolved", tone: "success" },
};

export const watchlistMeta: Record<WatchlistStatus, { tone: Tone }> = {
  WATCH: { tone: "warning" },
  STOLEN: { tone: "critical" },
  WANTED: { tone: "critical" },
  CLEARED: { tone: "success" },
};

/* ---------------------------------------------- page + section headings */

export function PageHeading({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
      <div className="min-w-0">
        {eyebrow ? <p className="label-caps mb-1.5">{eyebrow}</p> : null}
        <h1 className="text-2xl font-extrabold text-foreground sm:text-3xl">{title}</h1>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}

export function SectionCard({
  title,
  subtitle,
  actions,
  children,
  className,
  bodyClassName,
}: {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={cn("panel overflow-hidden", className)}>
      {title ? (
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border px-4 py-3 sm:px-5">
          <div className="min-w-0">
            <h2 className="truncate text-sm font-bold text-foreground">{title}</h2>
            {subtitle ? (
              <p className="mt-0.5 truncate text-xs text-muted-foreground">{subtitle}</p>
            ) : null}
          </div>
          {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
        </div>
      ) : null}
      <div className={cn("p-4 sm:p-5", bodyClassName)}>{children}</div>
    </section>
  );
}

/* ---------------------------------------------- KPI card */

export function KpiCard({
  label,
  value,
  icon: Icon,
  context,
  trend,
  tone = "royal",
}: {
  label: string;
  value: string;
  icon: typeof Inbox;
  context?: string;
  trend?: string;
  tone?: Tone;
}) {
  return (
    <article className="panel group relative flex flex-col gap-3 p-4 transition-shadow hover:shadow-[var(--shadow-lift)]">
      <div className="flex items-start justify-between gap-3">
        <span className="label-caps min-w-0 truncate">{label}</span>
        <span
          className={cn(
            "grid size-8 shrink-0 place-items-center rounded-md border",
            toneClasses[tone],
          )}
        >
          <Icon className="size-4" aria-hidden />
        </span>
      </div>
      <p className="tabular font-display text-3xl leading-none font-extrabold text-foreground sm:text-4xl">
        {value}
      </p>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
        {context ? <span className="min-w-0">{context}</span> : null}
        {trend ? (
          <span className="rounded bg-success/12 px-1.5 py-0.5 font-semibold text-success">
            {trend}
          </span>
        ) : null}
      </div>
    </article>
  );
}

/* ---------------------------------------------- confidence meter */

export function ConfidenceMeter({ value, className }: { value: number; className?: string }) {
  const tone = value >= 95 ? "bg-success" : value >= 85 ? "bg-royal" : "bg-warning";
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className="h-1.5 w-full min-w-16 overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Detection confidence"
      >
        <div className={cn("h-full rounded-full", tone)} style={{ width: `${value}%` }} />
      </div>
      <span className="tabular shrink-0 text-xs font-semibold text-foreground">{value}%</span>
    </div>
  );
}

/* ---------------------------------------------- data states */

export function LoadingState({ rows = 3, label = "Loading data" }: { rows?: number; label?: string }) {
  return (
    <div className="space-y-3" role="status" aria-live="polite" aria-label={label}>
      {Array.from({ length: rows }).map((_, index) => (
        <Skeleton key={index} className="h-16 w-full rounded-lg" />
      ))}
    </div>
  );
}

export function KpiSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton key={index} className="h-32 rounded-lg" />
      ))}
    </div>
  );
}

export function EmptyState({
  title = "No data found",
  description,
  action,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border px-6 py-12 text-center">
      <Inbox className="size-6 text-muted-foreground" aria-hidden />
      <div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export function ErrorState({
  title = "Unable to load data",
  description = "The service did not respond. Retry or contact the control room.",
  onRetry,
  variant = "error",
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
  variant?: "error" | "offline" | "unauthorized";
}) {
  const Icon = variant === "offline" ? WifiOff : variant === "unauthorized" ? ShieldAlert : AlertTriangle;
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-3 rounded-lg border border-critical/25 bg-critical/5 px-6 py-10 text-center"
    >
      <Icon className="size-6 text-critical" aria-hidden />
      <div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      {onRetry ? (
        <button
          onClick={onRetry}
          className="rounded-md border border-border bg-surface px-3 py-1.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
        >
          Retry
        </button>
      ) : null}
    </div>
  );
}

export function ProcessingState({ label = "Analyzing video…" }: { label?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center gap-3 rounded-lg border border-royal/25 bg-royal/6 px-4 py-3"
    >
      <Loader2 className="size-4 animate-spin text-royal" aria-hidden />
      <div className="min-w-0">
        <p className="label-caps text-royal">AI Processing</p>
        <p className="truncate text-sm font-medium text-foreground">{label}</p>
      </div>
    </div>
  );
}
