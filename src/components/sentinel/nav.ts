import {
  Activity,
  BarChart3,
  Bell,
  Cctv,
  FileText,
  Gauge,
  LayoutDashboard,
  ListChecks,
  Map,
  Search,
  Settings,
  Route as RouteIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  to: string;
  icon: typeof Gauge;
  badge?: string;
}

export const navSections: Array<{ heading: string; items: NavItem[] }> = [
  {
    heading: "Operations",
    items: [
      { label: "Overview", to: "/dashboard", icon: LayoutDashboard },
      { label: "Live Cameras", to: "/cameras", icon: Cctv },
      { label: "Vehicle Search", to: "/search", icon: Search },
      { label: "Vehicle Tracking", to: "/tracking", icon: RouteIcon },
      { label: "GIS Intelligence", to: "/gis", icon: Map },
    ],
  },
  {
    heading: "Intelligence",
    items: [
      { label: "Alerts", to: "/alerts", icon: Bell, badge: "7" },
      { label: "Watchlist", to: "/watchlist", icon: ListChecks },
      { label: "Camera Registry", to: "/registry", icon: Activity },
    ],
  },
  {
    heading: "Insight",
    items: [
      { label: "Analytics", to: "/analytics", icon: BarChart3 },
      { label: "Reports", to: "/reports", icon: FileText },
      { label: "Settings", to: "/settings", icon: Settings },
    ],
  },
];

export const mobileNavItems: NavItem[] = [
  { label: "Home", to: "/dashboard", icon: LayoutDashboard },
  { label: "Cameras", to: "/cameras", icon: Cctv },
  { label: "Search", to: "/search", icon: Search },
  { label: "Alerts", to: "/alerts", icon: Bell },
  { label: "Profile", to: "/settings", icon: Settings },
];
