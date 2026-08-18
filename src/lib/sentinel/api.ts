import {
  alerts,
  cameraById,
  cameras,
  confidenceBands,
  departmentActivity,
  detectionVolume,
  kpiSummary,
  topLocations,
  vehicleIndex,
  watchlist,
} from "./mock-data";
import type { Alert, Camera, KpiSummary, VehicleHistory, WatchlistEntry } from "./types";

/**
 * SENTINEL API layer.
 *
 * Every screen reads through these functions, so connecting the real backend is
 * a one-file change: flip USE_MOCK to false and set VITE_SENTINEL_API_URL.
 * Endpoint paths already match the agreed contract:
 *   /auth /cameras /cameras/:id /vehicles/:number /vehicles/:number/history
 *   /detections /alerts /watchlist /locations /analytics /users
 */

const USE_MOCK = true;

export const API_BASE_URL =
  (import.meta.env["VITE_SENTINEL_API_URL"] as string | undefined) ?? "/api";

export const ENDPOINTS = {
  auth: "/auth",
  cameras: "/cameras",
  camera: (id: string) => `/cameras/${id}`,
  vehicle: (number: string) => `/vehicles/${number}`,
  vehicleHistory: (number: string) => `/vehicles/${number}/history`,
  detections: "/detections",
  alerts: "/alerts",
  watchlist: "/watchlist",
  locations: "/locations",
  analytics: "/analytics",
  users: "/users",
} as const;

export class SentinelApiError extends Error {
  status: number;
  constructor(message: string, status = 500) {
    super(message);
    this.name = "SentinelApiError";
    this.status = status;
  }
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function request<T>(path: string, mock: () => T, latency = 420): Promise<T> {
  if (USE_MOCK) {
    await delay(latency);
    return mock();
  }
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    throw new SentinelApiError(
      response.status === 401 ? "Session expired" : "Unable to load data",
      response.status,
    );
  }
  return (await response.json()) as T;
}

export const sentinelApi = {
  getKpis: () => request<KpiSummary>(ENDPOINTS.analytics, () => kpiSummary, 320),
  getCameras: () => request<Camera[]>(ENDPOINTS.cameras, () => cameras, 380),
  getCamera: (id: string) =>
    request<Camera>(ENDPOINTS.camera(id), () => {
      const camera = cameraById(id);
      if (!camera) throw new SentinelApiError("Camera not found", 404);
      return camera;
    }),
  getAlerts: () => request<Alert[]>(ENDPOINTS.alerts, () => alerts, 340),
  getWatchlist: () => request<WatchlistEntry[]>(ENDPOINTS.watchlist, () => watchlist, 340),
  searchVehicle: (rawNumber: string) => {
    const number = rawNumber.replace(/[\s-]/g, "").toUpperCase();
    return request<VehicleHistory>(
      ENDPOINTS.vehicleHistory(number),
      () =>
        vehicleIndex[number] ?? {
          vehicleNumber: number,
          found: false,
          firstSeen: "—",
          lastSeen: "—",
          detections: [],
          cameras: 0,
          locations: 0,
          watchlist: null,
          vehicleType: "—",
          colour: "—",
          owner: null,
        },
      1150,
    );
  },
  getAnalytics: () =>
    request(
      ENDPOINTS.analytics,
      () => ({ detectionVolume, departmentActivity, topLocations, confidenceBands }),
      400,
    ),
};

export const queryKeys = {
  kpis: ["sentinel", "kpis"] as const,
  cameras: ["sentinel", "cameras"] as const,
  alerts: ["sentinel", "alerts"] as const,
  watchlist: ["sentinel", "watchlist"] as const,
  analytics: ["sentinel", "analytics"] as const,
  vehicle: (number: string) => ["sentinel", "vehicle", number] as const,
};
