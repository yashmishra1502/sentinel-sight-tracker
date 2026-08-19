// Shared domain types for SENTINEL. These mirror the live database schema
// (cameras, detections, watchlist, alerts) exposed through `sentinelApi`.

export type CameraStatus = "live" | "connecting" | "offline" | "no-signal" | "error";

export type StreamType = "hls" | "mjpeg" | "mp4" | "webrtc";

export type Department = "POLICE" | "HEALTH" | "GSRTC" | "PANCHAYAT" | "MUNICIPAL";

export interface Camera {
  /** Operational camera code, e.g. CAM-029. */
  id: string;
  /** Database primary key, used for updates and deletes. */
  dbId: string;
  name: string;
  location: string;
  district: string;
  department: Department;
  status: CameraStatus;
  streamUrl: string | null;
  streamType: StreamType;
  streamConnected: boolean;
  aiActive: boolean;
  lastHeartbeatSeconds: number | null;
  resolution: string;
  /** Normalised map coordinates (0-100) used by the GIS surface. */
  x: number;
  y: number;
}

export interface CameraInput {
  code: string;
  name: string;
  location: string;
  district: string;
  department: Department;
  status: CameraStatus;
  streamUrl: string;
  streamType: StreamType;
  aiActive: boolean;
  resolution: string;
  x: number;
  y: number;
}

export interface Detection {
  id: string;
  vehicleNumber: string;
  cameraId: string;
  cameraName: string;
  location: string;
  timestamp: string;
  time: string;
  confidence: number;
  plateConfidence: number;
  direction: string;
  vehicleType: string;
  colour: string;
}

export interface VehicleHistory {
  vehicleNumber: string;
  found: boolean;
  firstSeen: string;
  lastSeen: string;
  detections: Detection[];
  cameras: number;
  locations: number;
  watchlist: WatchlistEntry | null;
  vehicleType: string;
  colour: string;
  owner: { name: string; district: string; registeredAt: string } | null;
}

export type AlertSeverity = "critical" | "high" | "medium" | "low" | "resolved";

export interface Alert {
  id: string;
  title: string;
  severity: AlertSeverity;
  vehicleNumber: string;
  cameraId: string;
  location: string;
  time: string;
  confidence: number;
  note: string;
  acknowledged: boolean;
}

export type WatchlistStatus = "WATCH" | "STOLEN" | "WANTED" | "CLEARED";

export interface WatchlistEntry {
  id: string;
  vehicleNumber: string;
  status: WatchlistStatus;
  reason: string;
  addedBy: string;
  added: string;
  lastSeen: string | null;
}

export interface KpiSummary {
  cameras: number;
  online: number;
  offline: number;
  activeAlerts: number;
  vehiclesDetected: number;
  watchlistMatches: number;
  detectionTrend: number;
  uptime: number;
}
