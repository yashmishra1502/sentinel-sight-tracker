import { supabase } from "@/integrations/supabase/client";

import type {
  Alert,
  AlertSeverity,
  Camera,
  CameraInput,
  CameraStatus,
  Department,
  Detection,
  KpiSummary,
  StreamType,
  VehicleHistory,
  WatchlistEntry,
  WatchlistStatus,
} from "./types";

/**
 * SENTINEL API layer. Every screen reads through these functions, which are
 * backed by the live operational database:
 *   cameras · detections · watchlist · alerts
 */

export class SentinelApiError extends Error {
  status: number;
  constructor(message: string, status = 500) {
    super(message);
    this.name = "SentinelApiError";
    this.status = status;
  }
}

const timeFmt = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Kolkata",
      })
    : "—";

const dateFmt = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Kolkata",
      })
    : "—";

type Row = Record<string, unknown>;

function mapCamera(row: Row): Camera {
  const heartbeat = row["last_heartbeat_at"] as string | null;
  const streamUrl = (row["stream_url"] as string | null) || null;
  return {
    id: row["code"] as string,
    dbId: row["id"] as string,
    name: row["name"] as string,
    location: (row["location"] as string) || "—",
    district: (row["district"] as string) || "—",
    department: (row["department"] as Department) ?? "POLICE",
    status: row["status"] as CameraStatus,
    streamUrl,
    streamType: (row["stream_type"] as StreamType) ?? "hls",
    streamConnected: Boolean(streamUrl) && row["status"] === "live",
    aiActive: Boolean(row["ai_active"]),
    lastHeartbeatSeconds: heartbeat
      ? Math.max(0, Math.round((Date.now() - new Date(heartbeat).getTime()) / 1000))
      : null,
    resolution: (row["resolution"] as string) || "—",
    x: Number(row["map_x"] ?? 50),
    y: Number(row["map_y"] ?? 50),
  };
}

function mapDetection(row: Row): Detection {
  const at = row["detected_at"] as string;
  return {
    id: row["id"] as string,
    vehicleNumber: row["vehicle_number"] as string,
    cameraId: (row["camera_code"] as string) || "—",
    cameraName: (row["camera_code"] as string) || "—",
    location: (row["location"] as string) || "—",
    timestamp: at,
    time: timeFmt(at),
    confidence: Number(row["confidence"] ?? 0),
    plateConfidence: Number(row["plate_confidence"] ?? 0),
    direction: (row["direction"] as string) || "—",
    vehicleType: (row["vehicle_type"] as string) || "—",
    colour: (row["colour"] as string) || "—",
  };
}

function mapWatchlist(row: Row): WatchlistEntry {
  return {
    id: row["id"] as string,
    vehicleNumber: row["vehicle_number"] as string,
    status: row["status"] as WatchlistStatus,
    reason: (row["reason"] as string) || "—",
    addedBy: (row["added_by"] as string) || "—",
    added: dateFmt(row["created_at"] as string),
    lastSeen: row["last_seen_at"] ? dateFmt(row["last_seen_at"] as string) : null,
  };
}

function mapAlert(row: Row): Alert {
  return {
    id: row["id"] as string,
    title: row["title"] as string,
    severity: row["severity"] as AlertSeverity,
    vehicleNumber: (row["vehicle_number"] as string) || "—",
    cameraId: (row["camera_code"] as string) || "—",
    location: (row["location"] as string) || "—",
    time: dateFmt(row["created_at"] as string),
    confidence: Number(row["confidence"] ?? 0),
    note: (row["note"] as string) || "",
    acknowledged: Boolean(row["acknowledged"]),
  };
}

function unwrap<T>(result: { data: T | null; error: { message: string } | null }): T {
  if (result.error) throw new SentinelApiError(result.error.message);
  return result.data as T;
}

async function fetchCameras(): Promise<Camera[]> {
  const rows = unwrap(await supabase.from("cameras").select("*").order("code"));
  return (rows as Row[]).map(mapCamera);
}

async function fetchAlerts(): Promise<Alert[]> {
  const rows = unwrap(
    await supabase.from("alerts").select("*").order("created_at", { ascending: false }).limit(200),
  );
  return (rows as Row[]).map(mapAlert);
}

async function fetchWatchlist(): Promise<WatchlistEntry[]> {
  const rows = unwrap(
    await supabase.from("watchlist").select("*").order("created_at", { ascending: false }),
  );
  return (rows as Row[]).map(mapWatchlist);
}

export const sentinelApi = {
  getCameras: fetchCameras,
  getAlerts: fetchAlerts,
  getWatchlist: fetchWatchlist,

  getCamera: async (code: string) => {
    const rows = unwrap(await supabase.from("cameras").select("*").eq("code", code).limit(1));
    const row = (rows as Row[])[0];
    if (!row) throw new SentinelApiError("Camera not found", 404);
    return mapCamera(row);
  },

  createCamera: async (input: CameraInput) => {
    const rows = unwrap(
      await supabase
        .from("cameras")
        .insert({
          code: input.code.trim().toUpperCase(),
          name: input.name.trim(),
          location: input.location.trim(),
          district: input.district.trim(),
          department: input.department,
          status: input.status,
          stream_url: input.streamUrl.trim() || null,
          stream_type: input.streamType,
          ai_active: input.aiActive,
          resolution: input.resolution.trim() || "1080p",
          map_x: input.x,
          map_y: input.y,
          last_heartbeat_at: new Date().toISOString(),
        })
        .select("*"),
    );
    return mapCamera((rows as Row[])[0]!);
  },

  deleteCamera: async (dbId: string) => {
    const { error } = await supabase.from("cameras").delete().eq("id", dbId);
    if (error) throw new SentinelApiError(error.message);
  },

  updateCameraStatus: async (dbId: string, status: CameraStatus) => {
    const { error } = await supabase
      .from("cameras")
      .update({ status, last_heartbeat_at: new Date().toISOString() })
      .eq("id", dbId);
    if (error) throw new SentinelApiError(error.message);
  },

  getKpis: async (): Promise<KpiSummary> => {
    const [cameras, alerts, detectionCount] = await Promise.all([
      fetchCameras(),
      fetchAlerts(),
      supabase.from("detections").select("id", { count: "exact", head: true }),
    ]);
    const online = cameras.filter((camera) => camera.status === "live").length;
    return {
      cameras: cameras.length,
      online,
      offline: cameras.length - online,
      activeAlerts: alerts.filter((alert) => !alert.acknowledged).length,
      vehiclesDetected: detectionCount.count ?? 0,
      watchlistMatches: alerts.filter(
        (alert) => alert.severity === "critical" && !alert.acknowledged,
      ).length,
      detectionTrend: 0,
      uptime: cameras.length ? Math.round((online / cameras.length) * 1000) / 10 : 0,
    };
  },

  /** Most recently detected vehicle, used for the default map route. */
  getLatestRoute: async (): Promise<Detection[]> => {
    const latest = unwrap(
      await supabase
        .from("detections")
        .select("vehicle_number")
        .order("detected_at", { ascending: false })
        .limit(1),
    ) as Row[];
    const plate = latest[0]?.["vehicle_number"] as string | undefined;
    if (!plate) return [];
    const rows = unwrap(
      await supabase
        .from("detections")
        .select("*")
        .eq("vehicle_number", plate)
        .order("detected_at", { ascending: true }),
    );
    return (rows as Row[]).map(mapDetection);
  },

  searchVehicle: async (rawNumber: string): Promise<VehicleHistory> => {
    const number = rawNumber.replace(/[\s-]/g, "").toUpperCase();
    const [detectionRows, watchRows] = await Promise.all([
      supabase
        .from("detections")
        .select("*")
        .eq("vehicle_number", number)
        .order("detected_at", { ascending: true }),
      supabase.from("watchlist").select("*").eq("vehicle_number", number).limit(1),
    ]);
    const detections = (unwrap(detectionRows) as Row[]).map(mapDetection);
    const watchRow = (unwrap(watchRows) as Row[])[0];
    const latest = detections[detections.length - 1];
    return {
      vehicleNumber: number,
      found: detections.length > 0,
      firstSeen: detections[0] ? dateFmt(detections[0].timestamp) : "—",
      lastSeen: latest ? dateFmt(latest.timestamp) : "—",
      detections,
      cameras: new Set(detections.map((detection) => detection.cameraId)).size,
      locations: new Set(detections.map((detection) => detection.location)).size,
      watchlist: watchRow ? mapWatchlist(watchRow) : null,
      vehicleType: latest?.vehicleType ?? "—",
      colour: latest?.colour ?? "—",
      owner: null,
    };
  },
};

export const queryKeys = {
  kpis: ["sentinel", "kpis"] as const,
  cameras: ["sentinel", "cameras"] as const,
  alerts: ["sentinel", "alerts"] as const,
  watchlist: ["sentinel", "watchlist"] as const,
  latestRoute: ["sentinel", "latest-route"] as const,
  vehicle: (number: string) => ["sentinel", "vehicle", number] as const,
};
