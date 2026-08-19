import Footer from "@/components/Footer";
import { ThemeToggle } from "../components/theme-toggle";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
ArrowRight,
Bell,
Building2,
Bus,
Cctv,
Cpu,
Database,
HeartPulse,
Landmark,
Layers,
MapPin,
Radar,
ScanLine,
Search,
Shield,
ShieldCheck,
Siren,
} from "lucide-react";

import { StatusBadge } from "@/components/sentinel/primitives";

export const Route = createFileRoute("/")({
head: () => ({
meta: [
{ title: "SENTINEL — Gujarat Police CCTV Intelligence Platform" },
{
name: "description",
content:
"SENTINEL unifies heterogeneous government CCTV systems with AI vehicle detection, ANPR, cross-camera tracking and real-time watchlist alerts.",
},
{ property: "og", content: "SENTINEL — Gujarat Police CCTV Intelligence Platform" },
{
property: "og",
content:
"SENTINEL unifies heterogeneous government CCTV systems with AI vehicle detection, ANPR, cross-camera tracking and real-time watchlist alerts.",
},
{ property: "og", content: "website" },
{ name: "twitter", content: "summary_large_image" },
],
}),
component: Landing,
});

function TopNav() {
return (
<header className="sticky top-0 z-30 border-b border-border bg-navbar/95 backdrop-blur">
<div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
<img src="/logo.png" alt="Sentinel" className="size-9 shrink-0 rounded-md object-cover" />
<div className="min-w-0 flex-1">
<p className="font-display truncate text-base leading-none font-extrabold tracking-[0.16em] text-foreground">
SENTINEL
</p>
<p className="truncate text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase">
Gujarat Police Innovation Hackathon 2026
</p>
</div>
<nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
<a href="#dataset" className="hover:text-foreground">
Dataset
</a>
<a href="#departments" className="hover:text-foreground">
Departments
</a>
<a href="#workflow" className="hover:text-foreground">
Workflow
</a>
<Link to="/architecture" className="hover:text-foreground">
Architecture
</Link>
</nav>
<ThemeToggle />
<Link
       to="/dashboard"
       className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-md bg-royal px-3 text-sm font-semibold text-royal-foreground transition-colors hover:bg-royal/90 sm:px-4"
     >
Command Center
<ArrowRight className="size-4" aria-hidden />
</Link>
</div>
</header>
);
}

function HeroVisual() {
const cams = [
{ id: "CAM-007", x: 30, y: 62, time: "10:05" },
{ id: "CAM-015", x: 44, y: 50, time: "10:18" },
{ id: "CAM-029", x: 62, y: 38, time: "10:31" },
{ id: "CAM-041", x: 78, y: 26, time: "10:47" },
];
return (
<div className="panel overflow-hidden bg-navy p-0 shadow-[var(--shadow-lift)]">
<div className="flex items-center justify-between gap-2 border-b border-navy-muted/50 px-3 py-2.5">
<span className="flex items-center gap-2 text-[11px] font-semibold tracking-wider text-navy-foreground/80 uppercase">
<Layers className="size-3.5" aria-hidden /> Command Preview
</span>
<StatusBadge tone="success" pulse>
Live
</StatusBadge>
</div>

  <div className="grid gap-3 p-3 lg:grid-cols-[1.55fr_1fr]">
    <div className="relative aspect-4/3 overflow-hidden rounded-md border border-navy-muted/60 bg-navy-muted/25 sm:aspect-16/10">
      <div className="grid-backdrop absolute inset-0" aria-hidden />
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
        <path
          d="M12,36 L20,24 L34,20 L46,24 L54,20 L62,28 L60,40 L66,50 L62,62 L66,74 L56,88 L44,86 L36,78 L26,80 L20,70 L26,58 L18,50 L24,42 Z"
          className="fill-royal/12 stroke-royal/60"
          strokeWidth="0.5"
        />
        <polyline
          points={cams.map((cam) => `${cam.x},${cam.y}`).join(" ")}
          fill="none"
          className="stroke-royal/40"
          strokeWidth="1"
        />
        <polyline
          points={cams.map((cam) => `${cam.x},${cam.y}`).join(" ")}
          fill="none"
          className="flow-dash stroke-royal"
          strokeWidth="0.6"
        />
        {cams.map((cam) => (
          <g key={cam.id}>
            <circle cx={cam.x} cy={cam.y} r="2.6" className="fill-royal/25" />
            <circle cx={cam.x} cy={cam.y} r="1.1" className="fill-success" />
            <text x={cam.x + 3} y={cam.y - 1.5} className="fill-navy-foreground text-[2.6px] font-bold">
              {cam.id} · {cam.time}
            </text>
          </g>
        ))}
      </svg>
      <div className="absolute top-3 left-3 rounded-md border border-critical/50 bg-critical/15 px-2.5 py-1.5">
        <p className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-critical-foreground uppercase">
          <Siren className="size-3" aria-hidden /> Watchlist match · CAM-029
        </p>
      </div>
      <div className="absolute bottom-3 left-3 rounded-md border border-navy-muted/60 bg-navy/85 px-2.5 py-1.5">
        <p className="label-caps text-navy-foreground/60">Tracked vehicle</p>
        <p className="tabular text-sm font-extrabold text-navy-foreground">GJ01AB1234</p>
      </div>
    </div>

    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
      {[
        { id: "CAM-029", place: "Gandhinagar", state: "LIVE" },
        { id: "CAM-041", place: "Gandhinagar", state: "LIVE" },
      ].map((cam) => (
        <div
          key={cam.id}
          className="relative aspect-video overflow-hidden rounded-md border border-navy-muted/60 bg-navy-muted/25"
        >
          <div className="grid-backdrop absolute inset-0" aria-hidden />
          <div className="scanline absolute inset-x-0 top-0 h-6 bg-royal/12" aria-hidden />
          <div className="absolute inset-0 grid place-items-center text-navy-foreground/40">
            <Cctv className="size-6" aria-hidden />
          </div>
          <span className="tabular absolute top-2 left-2 rounded bg-navy/80 px-1.5 py-0.5 text-[10px] font-bold text-navy-foreground">
            {cam.id}
          </span>
          <span className="absolute top-2 right-2 flex items-center gap-1 rounded bg-success/20 px-1.5 py-0.5 text-[10px] font-bold text-success">
            <span className="size-1.5 rounded-full bg-success" aria-hidden /> {cam.state}
          </span>
          <span className="absolute bottom-2 left-2 rounded bg-navy/80 px-1.5 py-0.5 text-[10px] font-medium text-navy-foreground/85">
            {cam.place}
          </span>
        </div>
      ))}
      <div className="rounded-md border border-navy-muted/60 bg-navy-muted/25 p-3">
        <p className="label-caps text-navy-foreground/55">Detection</p>
        <p className="tabular mt-1 text-sm font-bold text-navy-foreground">
          ANPR · 97% confidence
        </p>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-navy/60">
          <div className="h-full w-[97%] rounded-full bg-success" />
        </div>
        <p className="mt-2 text-[11px] text-navy-foreground/60">
          4 detections · 4 cameras · 2 locations
        </p>
      </div>
    </div>
  </div>
</div>

);
}

function Hero() {
return (
<section className="relative overflow-hidden bg-background">
<div className="grid-backdrop absolute inset-0 opacity-60" aria-hidden />
<div
     className="absolute -top-32 -right-24 size-96 rounded-full bg-royal/20 blur-3xl"
     aria-hidden
   />
<div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
<div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:items-center">
<div className="min-w-0">
<StatusBadge tone="royal" dot={false} className="bg-royal/15 text-foreground">
<ShieldCheck className="size-3" aria-hidden /> Government CCTV Intelligence
</StatusBadge>
<h1 className="font-display mt-5 text-3xl leading-[1.08] font-extrabold text-foreground sm:text-5xl lg:text-6xl">
See Every Camera.
<br />
Track Every Movement.
</h1>
<p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
A unified intelligence platform connecting heterogeneous government CCTV systems with
AI-powered vehicle detection, tracking and real-time alerts.
</p>
<div className="mt-7 flex flex-col gap-3 sm:flex-row">
<Link
             to="/dashboard"
             className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-royal px-6 text-sm font-bold tracking-wide text-royal-foreground uppercase transition-colors hover:bg-royal/90"
           >
Explore Command Center <ArrowRight className="size-4" aria-hidden />
</Link>
<Link
             to="/architecture"
             className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-border px-6 text-sm font-bold tracking-wide text-foreground uppercase transition-colors hover:bg-accent"
           >
View System Architecture
</Link>
</div>
<dl className="mt-9 grid max-w-lg grid-cols-3 gap-4 border-t border-border pt-6">
{[
{ k: "Cameras unified", v: "50" },
{ k: "Departments", v: "5" },
{ k: "Avg. ANPR conf.", v: "96%" },
].map((item) => (
<div key={item.k} className="min-w-0">
<dd className="tabular font-display text-2xl font-extrabold text-foreground sm:text-3xl">
{item.v}
</dd>
<dt className="mt-1 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
{item.k}
</dt>
</div>
))}
</dl>
</div>
<HeroVisual />
</div>
</div>
</section>
);
}

function Dataset() {
return (
<section id="dataset" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
<p className="label-caps">Challenge environment</p>
<h2 className="mt-2 max-w-2xl text-2xl font-extrabold text-foreground sm:text-4xl">
A Real Government CCTV Environment
</h2>
<p className="mt-4 max-w-3xl text-sm text-muted-foreground sm:text-base">
Designed around heterogeneous government CCTV infrastructure, multiple departments, live and
archived feeds, and a realistic multi-camera proving environment.
</p>

  <div className="mt-8 grid gap-4 sm:grid-cols-3">
    {[
      { value: "30+", label: "Cameras", note: "Provided across departments" },
      { value: "5", label: "Departments", note: "Different vendors and NVR stacks" },
      { value: "12 Hrs", label: "Feed per camera", note: "Live and archived footage" },
    ].map((stat) => (
      <article key={stat.label} className="panel p-5">
        <p className="tabular font-display text-4xl font-extrabold text-navy sm:text-5xl">
          {stat.value}
        </p>
        <p className="mt-2 text-sm font-bold tracking-wide text-foreground uppercase">
          {stat.label}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{stat.note}</p>
      </article>
    ))}
  </div>

  <article className="panel mt-4 grid gap-4 border-royal/35 bg-royal/6 p-5 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center">
    <p className="tabular font-display text-4xl font-extrabold text-royal sm:text-5xl">~50</p>
    <div className="min-w-0">
      <p className="text-sm font-bold tracking-wide text-foreground uppercase">
        Camera proving ground
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        Target evaluation environment. SENTINEL is architected to scale beyond this deployment
        without changing the operational interface.
      </p>
    </div>
  </article>
</section>

);
}

const departmentCards = [
{ name: "HEALTH", role: "CCTV Infrastructure", icon: HeartPulse },
{ name: "POLICE", role: "Public Safety", icon: Shield },
{ name: "GSRTC", role: "Transport", icon: Bus },
{ name: "PANCHAYAT", role: "Local Administration", icon: Landmark },
{ name: "MUNICIPAL", role: "Urban Infrastructure", icon: Building2 },
];

function Departments() {
return (
<section id="departments" className="border-y border-border bg-surface-2">
<div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
<p className="label-caps">Participating environment</p>
<h2 className="mt-2 text-2xl font-extrabold text-foreground sm:text-4xl">
Department Coverage
</h2>
<p className="mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
Five departments, different vendors, different infrastructure — one normalised intelligence
layer.
</p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {departmentCards.map((dept) => (
            <article key={dept.name} className="panel p-4">
              <dept.icon className="size-6 text-royal" aria-hidden />
              <p className="font-display mt-3 text-sm font-extrabold tracking-[0.12em] text-foreground">
                {dept.name}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{dept.role}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const workflowSteps = [
  {
    icon: Database,
    title: "Ingest",
    body: "Normalise heterogeneous NVR, RTSP and vendor feeds into one camera registry.",
  },
  {
    icon: Cpu,
    title: "Detect",
    body: "AI vehicle detection and ANPR extract plate, type and colour per frame.",
  },
  {
    icon: Radar,
    title: "Correlate",
    body: "Cross-camera tracking stitches sightings into a single movement trail.",
  },
  {
    icon: MapPin,
    title: "Map",
    body: "GIS intelligence plots the route across districts with time-ordered waypoints.",
  },
  {
    icon: Bell,
    title: "Alert",
    body: "Watchlist matches raise real-time alerts to the command center.",
  },
  {
    icon: ScanLine,
    title: "Act",
    body: "Officers review evidence, verify the crop and dispatch from one console.",
  },
];

function Workflow() {
  return (
    <section id="workflow" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
      <p className="label-caps">Operational workflow</p>
      <h2 className="mt-2 max-w-2xl text-2xl font-extrabold text-foreground sm:text-4xl">
        From Raw Feed to Actionable Intelligence
      </h2>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {workflowSteps.map((step, index) => (
          <article key={step.title} className="panel p-5">
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-md bg-royal/12 text-royal">
                <step.icon className="size-4.5" aria-hidden />
              </span>
              <span className="tabular text-xs font-bold text-muted-foreground">
                STEP {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <p className="font-display mt-3 text-base font-extrabold text-foreground">
              {step.title}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{step.body}</p>
          </article>
        ))}
      </div>

      <div className="panel mt-6 flex flex-col gap-4 border-royal/35 bg-royal/6 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="font-display text-base font-extrabold text-foreground">
            Run the demo trail: GJ01AB1234
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Search the plate, replay the timeline, then follow the route on the GIS map.
          </p>
        </div>
        <Link
          to="/search"
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-md bg-royal px-5 text-sm font-bold tracking-wide text-royal-foreground uppercase transition-colors hover:bg-royal/90"
        >
          <Search className="size-4" aria-hidden /> Start Vehicle Search
        </Link>
      </div>
    </section>
  );
}

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main>
        <Hero />
        <Dataset />
        <Departments />
        <Workflow />
      </main>
      <Footer />
    </div>
  );
}
