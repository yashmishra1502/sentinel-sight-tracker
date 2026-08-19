
import { Link, useRouterState } from "@tanstack/react-router";
import { Bell, Menu, Search, ShieldCheck, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import { StatusBadge } from "@/components/sentinel/primitives";
import { mobileNavItems, navSections } from "@/components/sentinel/nav";
import { cn } from "@/lib/utils";

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex min-w-0 items-center gap-2.5">
      <img
        src="/logo.png"
        alt="Sentinel"
        className="size-9 shrink-0 rounded-md object-cover"
      />
      <span className="min-w-0">
        <span className="font-display block truncate text-base leading-none font-extrabold tracking-[0.14em] text-navy-foreground">
          SENTINEL
        </span>
        {!compact ? (
          <span className="mt-1 block truncate text-[10px] font-medium tracking-[0.12em] text-navy-foreground/60 uppercase">
            Gujarat CCTV Intelligence
          </span>
        ) : null}
      </span>
    </Link>
  );
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav
      className="flex-1 space-y-5 overflow-y-auto px-3 py-4"
      aria-label="Main navigation"
    >
      {navSections.map((section) => (
        <div key={section.heading}>
          <p className="px-2 pb-2 text-[10px] font-semibold tracking-[0.14em] text-navy-foreground/45 uppercase">
            {section.heading}
          </p>

          <ul className="space-y-0.5">
            {section.items.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={onNavigate}
                  activeProps={{
                    className: "bg-sidebar-accent text-navy-foreground",
                    "aria-current": "page",
                  }}
                  className="flex min-h-11 items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium text-navy-foreground/75 transition-colors hover:bg-sidebar-accent/70 hover:text-navy-foreground"
                >
                  <item.icon className="size-4 shrink-0" aria-hidden />

                  <span className="min-w-0 flex-1 truncate">
                    {item.label}
                  </span>

                  {item.badge ? (
                    <span className="tabular shrink-0 rounded-full bg-critical px-1.5 py-0.5 text-[10px] font-bold text-critical-foreground">
                      {item.badge}
                    </span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function OfficerCard() {
  return (
    <div className="border-t border-sidebar-border px-3 py-3">
      <div className="flex min-w-0 items-center gap-2.5 rounded-md bg-sidebar-accent/60 px-2.5 py-2">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-royal text-xs font-bold text-royal-foreground">
          RS
        </span>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-navy-foreground">
            Insp. R. Solanki
          </p>

          <p className="truncate text-[11px] text-navy-foreground/60">
            Control Room · Gandhinagar
          </p>
        </div>
      </div>

      <p className="mt-2.5 flex items-center gap-1.5 px-1 text-[11px] font-semibold tracking-wide text-success uppercase">
        <span className="size-1.5 rounded-full bg-success" aria-hidden />
        System Operational
      </p>
    </div>
  );
}

function useClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());

    const id = setInterval(() => setNow(new Date()), 1000);

    return () => clearInterval(id);
  }, []);

  return now
    ? now.toLocaleTimeString("en-IN", {
        hour12: false,
        timeZone: "Asia/Kolkata",
      })
    : "--:--:--";
}

function TopBar({ onOpenMenu }: { onOpenMenu: () => void }) {
  const clock = useClock();

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface/95 backdrop-blur">
      <div className="flex items-center gap-2 px-3 py-2.5 sm:gap-3 sm:px-5">
        <button
          onClick={onOpenMenu}
          className="grid size-11 shrink-0 place-items-center rounded-md border border-border text-foreground lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="size-5" aria-hidden />
        </button>

        <form
          className="min-w-0 flex-1"
          role="search"
          onSubmit={(event) => event.preventDefault()}
        >
          <label htmlFor="global-search" className="sr-only">
            Global search
          </label>

          <div className="relative">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />

            <input
              id="global-search"
              placeholder="Search vehicles, cameras, locations…"
              className="h-10 w-full rounded-md border border-input bg-background pr-3 pl-9 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none"
            />
          </div>
        </form>

        <div className="hidden items-center gap-3 xl:flex">
          <StatusBadge tone="success">
            48/50 Cameras Online
          </StatusBadge>

          <StatusBadge tone="royal" dot={false}>
            <ShieldCheck className="size-3" aria-hidden />
            AI Services Nominal
          </StatusBadge>
        </div>

        <span className="tabular hidden shrink-0 text-sm font-semibold text-foreground sm:block">
          {clock}
          <span className="ml-1 text-[11px] font-medium text-muted-foreground">
            IST
          </span>
        </span>

        <Link
          to="/alerts"
          className="relative grid size-11 shrink-0 place-items-center rounded-md border border-border text-foreground transition-colors hover:bg-accent"
          aria-label="Alerts: 7 active"
        >
          <Bell className="size-4.5" aria-hidden />
          <span
            className="absolute top-1 right-1 size-2 rounded-full bg-critical"
            aria-hidden
          />
        </Link>

        <Link
          to="/settings"
          className="hidden size-11 shrink-0 place-items-center rounded-full bg-navy text-xs font-bold text-navy-foreground sm:grid"
          aria-label="Officer profile"
        >
          RS
        </Link>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto border-t border-border px-3 py-1.5 xl:hidden">
        <StatusBadge tone="success">48/50 Online</StatusBadge>
        <StatusBadge tone="critical">7 Active Alerts</StatusBadge>
        <StatusBadge tone="royal">ANPR Active</StatusBadge>
      </div>
    </header>
  );
}

function BottomNav() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface/98 backdrop-blur lg:hidden"
      aria-label="Primary mobile navigation"
    >
      <ul className="grid grid-cols-5">
        {mobileNavItems.map((item) => (
          <li key={item.to}>
            <Link
              to={item.to}
              activeProps={{
                className: "text-royal",
                "aria-current": "page",
              }}
              className="flex min-h-14 flex-col items-center justify-center gap-1 px-1 py-2 text-[11px] font-semibold text-muted-foreground"
            >
              <item.icon className="size-5" aria-hidden />
              <span className="truncate">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-navy lg:flex">
        <div className="flex h-16 items-center border-b border-sidebar-border px-4">
          <Brand />
        </div>
        <NavList />
        <OfficerCard />
      </aside>

      {/* Mobile sidebar (drawer) */}
      {menuOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMenuOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-72 max-w-[85%] flex-col bg-navy">
            <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
              <Brand compact />
              <button
                onClick={() => setMenuOpen(false)}
                className="grid size-9 place-items-center rounded-md text-navy-foreground"
                aria-label="Close navigation menu"
              >
                <X className="size-5" aria-hidden />
              </button>
            </div>
            <NavList onNavigate={() => setMenuOpen(false)} />
            <OfficerCard />
          </aside>
        </div>
      ) : null}

      {/* Main content area */}
      <div className="lg:pl-64">
        <TopBar onOpenMenu={() => setMenuOpen(true)} />
        <main className="px-3 py-4 pb-20 sm:px-5 sm:py-6 lg:pb-6">
          {children}
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
