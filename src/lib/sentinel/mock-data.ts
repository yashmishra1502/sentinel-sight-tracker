import type {
  Alert,
  Camera,
  Department,
  Detection,
  KpiSummary,
  VehicleHistory,
  WatchlistEntry,
} from "./types";

/**
 * Development-only fixtures. Every read goes through `src/lib/sentinel/api.ts`,
 * so swapping these for real backend responses does not touch the UI.
 */

const departments: Department[] = ["POLICE", "MUNICIPAL", "GSRTC", "PANCHAYAT", "HEALTH"];

const places: Array<{ location: string; district: string; x: number; y: number }> = [
  { location: "Sarkhej Circle", district: "Ahmedabad", x: 41, y: 55 },
  { location: "SG Highway Jn", district: "Ahmedabad", x: 44, y: 51 },
  { location: "Ashram Road", district: "Ahmedabad", x: 47, y: 54 },
  { location: "Kalupur Gate", district: "Ahmedabad", x: 49, y: 57 },
  { location: "Sector 21 Chowk", district: "Gandhinagar", x: 52, y: 44 },
  { location: "Infocity Junction", district: "Gandhinagar", x: 55, y: 41 },
  { location: "Ring Road West", district: "Vadodara", x: 57, y: 66 },
  { location: "Alkapuri Square", district: "Vadodara", x: 60, y: 69 },
  { location: "Adajan Bridge", district: "Surat", x: 51, y: 80 },
  { location: "Ring Road Surat", district: "Surat", x: 54, y: 83 },
  { location: "Kalawad Road", district: "Rajkot", x: 26, y: 61 },
  { location: "Bhaktinagar Circle", district: "Rajkot", x: 29, y: 64 },
  { location: "Bhuj Bypass", district: "Kutch", x: 14, y: 38 },
  { location: "Palanpur Highway", district: "Banaskantha", x: 40, y: 26 },
  { location: "Mehsana Toll", district: "Mehsana", x: 45, y: 33 },
  { location: "Bhavnagar Port Rd", district: "Bhavnagar", x: 36, y: 74 },
  { location: "Junagadh Gate", district: "Junagadh", x: 24, y: 76 },
];

const statusPlan: Camera["status"][] = [
  "live",
  "live",
  "live",
  "live",
  "live",
  "live",
  "live",
  "connecting",
  "live",
  "live",
  "live",
  "no-signal",
  "live",
  "live",
  "live",
  "live",
  "offline",
  "live",
  "live",
  "live",
  "live",
  "error",
  "live",
  "live",
  "live",
];

export const cameras: Camera[] = Array.from({ length: 50 }, (_, index) => {
  const number = index + 1;
  const place = places[index % places.length]!;
  const status = statusPlan[index % statusPlan.length]!;
  return {
    id: `CAM-${String(number).padStart(3, "0")}`,
    name: `${place.location} ${number % 2 === 0 ? "North" : "South"}`,
    location: place.location,
    district: place.district,
    department: departments[index % departments.length]!,
    status,
    streamConnected: status === "live" || status === "connecting",
    aiActive: status === "live",
    lastHeartbeatSeconds: status === "live" ? (index % 7) + 1 : 40 + index,
    resolution: index % 3 === 0 ? "4K · 25 fps" : "1080p · 25 fps",
    x: place.x + ((index % 5) - 2) * 0.9,
    y: place.y + ((index % 4) - 1.5) * 0.9,
  };
});

export const cameraById = (id: string) => cameras.find((camera) => camera.id === id);

export const kpiSummary: KpiSummary = {
  cameras: 50,
  online: cameras.filter((camera) => camera.status === "live").length,
  offline: cameras.filter((camera) => camera.status !== "live").length,
  activeAlerts: 7,
  vehiclesDetected: 1284,
  watchlistMatches: 12,
  detectionTrend: 8.4,
  uptime: 99.2,
};

export const watchlist: WatchlistEntry[] = [
  {
    id: "WL-1",
    vehicleNumber: "GJ01AB1234",
    status: "WATCH",
    reason: "Suspect vehicle — Zone 4 enquiry",
    addedBy: "Insp. R. Solanki",
    added: "Today · 09:12",
    lastSeen: "10:31",
  },
  {
    id: "WL-2",
    vehicleNumber: "GJ05XY4567",
    status: "STOLEN",
    reason: "FIR 214/2026 — vehicle theft",
    addedBy: "PSI M. Chauhan",
    added: "Yesterday · 18:40",
    lastSeen: "08:22",
  },
  {
    id: "WL-3",
    vehicleNumber: "GJ18GH8899",
    status: "WANTED",
    reason: "Court warrant — traffic offence chain",
    addedBy: "Insp. D. Vaghela",
    added: "16 Aug · 11:05",
    lastSeen: "07:58",
  },
  {
    id: "WL-4",
    vehicleNumber: "GJ27PQ3321",
    status: "WATCH",
    reason: "Cross-district movement monitoring",
    addedBy: "Ctrl Room Ahmedabad",
    added: "15 Aug · 22:16",
    lastSeen: null,
  },
  {
    id: "WL-5",
    vehicleNumber: "GJ06KL7742",
    status: "CLEARED",
    reason: "Verified — released from watch",
    addedBy: "Insp. R. Solanki",
    added: "12 Aug · 14:30",
    lastSeen: "Yesterday · 19:04",
  },
];

const trackedDetections: Detection[] = [
  {
    id: "DET-1",
    vehicleNumber: "GJ01AB1234",
    cameraId: "CAM-007",
    cameraName: "Ashram Road South",
    location: "Ahmedabad",
    timestamp: "2026-08-18T10:05:00+05:30",
    time: "10:05 AM",
    confidence: 96,
    plateConfidence: 97,
    direction: "North-bound",
    vehicleType: "Sedan",
    colour: "White",
  },
  {
    id: "DET-2",
    vehicleNumber: "GJ01AB1234",
    cameraId: "CAM-015",
    cameraName: "Sector 21 Chowk North",
    location: "Ahmedabad",
    timestamp: "2026-08-18T10:18:00+05:30",
    time: "10:18 AM",
    confidence: 94,
    plateConfidence: 93,
    direction: "North-bound",
    vehicleType: "Sedan",
    colour: "White",
  },
  {
    id: "DET-3",
    vehicleNumber: "GJ01AB1234",
    cameraId: "CAM-029",
    cameraName: "Infocity Junction South",
    location: "Gandhinagar",
    timestamp: "2026-08-18T10:31:00+05:30",
    time: "10:31 AM",
    confidence: 97,
    plateConfidence: 97,
    direction: "North-bound",
    vehicleType: "Sedan",
    colour: "White",
  },
  {
    id: "DET-4",
    vehicleNumber: "GJ01AB1234",
    cameraId: "CAM-041",
    cameraName: "Sector 21 Chowk North",
    location: "Gandhinagar",
    timestamp: "2026-08-18T10:47:00+05:30",
    time: "10:47 AM",
    confidence: 95,
    plateConfidence: 96,
    direction: "East-bound",
    vehicleType: "Sedan",
    colour: "White",
  },
];

export const trackedVehicle: VehicleHistory = {
  vehicleNumber: "GJ01AB1234",
  found: true,
  firstSeen: "10:05 AM",
  lastSeen: "10:47 AM",
  detections: trackedDetections,
  cameras: 4,
  locations: 2,
  watchlist: watchlist[0]!,
  vehicleType: "Sedan",
  colour: "White",
  owner: { name: "Record on file · RTO Ahmedabad", district: "Ahmedabad", registeredAt: "2019" },
};

const secondVehicle: VehicleHistory = {
  vehicleNumber: "GJ05XY4567",
  found: true,
  firstSeen: "08:22 AM",
  lastSeen: "09:04 AM",
  detections: [
    {
      ...trackedDetections[0]!,
      id: "DET-11",
      vehicleNumber: "GJ05XY4567",
      cameraId: "CAM-011",
      cameraName: "Kalawad Road South",
      location: "Rajkot",
      time: "08:22 AM",
      confidence: 92,
      plateConfidence: 90,
      vehicleType: "Hatchback",
      colour: "Silver",
    },
    {
      ...trackedDetections[1]!,
      id: "DET-12",
      vehicleNumber: "GJ05XY4567",
      cameraId: "CAM-023",
      cameraName: "Bhaktinagar Circle North",
      location: "Rajkot",
      time: "09:04 AM",
      confidence: 89,
      plateConfidence: 91,
      vehicleType: "Hatchback",
      colour: "Silver",
    },
  ],
  cameras: 2,
  locations: 1,
  watchlist: watchlist[1]!,
  vehicleType: "Hatchback",
  colour: "Silver",
  owner: { name: "Record on file · RTO Rajkot", district: "Rajkot", registeredAt: "2021" },
};

export const vehicleIndex: Record<string, VehicleHistory> = {
  GJ01AB1234: trackedVehicle,
  GJ05XY4567: secondVehicle,
};

export const alerts: Alert[] = [
  {
    id: "ALR-4821",
    title: "Watchlist match",
    severity: "critical",
    vehicleNumber: "GJ01AB1234",
    cameraId: "CAM-029",
    location: "Gandhinagar · Infocity Junction",
    time: "10:31 AM",
    confidence: 97,
    note: "Suspect vehicle matched active watchlist entry WL-1.",
    acknowledged: false,
  },
  {
    id: "ALR-4820",
    title: "Stolen vehicle detected",
    severity: "critical",
    vehicleNumber: "GJ05XY4567",
    cameraId: "CAM-023",
    location: "Rajkot · Bhaktinagar Circle",
    time: "09:04 AM",
    confidence: 89,
    note: "FIR 214/2026 vehicle detected moving east.",
    acknowledged: false,
  },
  {
    id: "ALR-4818",
    title: "Repeated loitering pattern",
    severity: "high",
    vehicleNumber: "GJ18GH8899",
    cameraId: "CAM-015",
    location: "Ahmedabad · Sector 21 Chowk",
    time: "08:47 AM",
    confidence: 93,
    note: "Same plate detected 5 times within 20 minutes.",
    acknowledged: false,
  },
  {
    id: "ALR-4815",
    title: "Camera stream degraded",
    severity: "medium",
    vehicleNumber: "—",
    cameraId: "CAM-012",
    location: "Ahmedabad · Kalupur Gate",
    time: "08:12 AM",
    confidence: 0,
    note: "No signal for 6 minutes. Municipal NVR unreachable.",
    acknowledged: true,
  },
  {
    id: "ALR-4811",
    title: "Low ANPR confidence batch",
    severity: "low",
    vehicleNumber: "—",
    cameraId: "CAM-034",
    location: "Surat · Adajan Bridge",
    time: "07:38 AM",
    confidence: 61,
    note: "12 plates below 70% confidence — glare suspected.",
    acknowledged: true,
  },
  {
    id: "ALR-4802",
    title: "Watchlist match resolved",
    severity: "resolved",
    vehicleNumber: "GJ06KL7742",
    cameraId: "CAM-008",
    location: "Vadodara · Alkapuri Square",
    time: "Yesterday · 19:04",
    confidence: 95,
    note: "Verified at checkpoint. Entry cleared by control room.",
    acknowledged: true,
  },
];

export const detectionVolume = [
  { hour: "00", detections: 42, matches: 0 },
  { hour: "02", detections: 28, matches: 1 },
  { hour: "04", detections: 33, matches: 0 },
  { hour: "06", detections: 96, matches: 2 },
  { hour: "08", detections: 184, matches: 3 },
  { hour: "10", detections: 232, matches: 4 },
  { hour: "12", detections: 176, matches: 1 },
  { hour: "14", detections: 158, matches: 0 },
  { hour: "16", detections: 195, matches: 1 },
  { hour: "18", detections: 210, matches: 2 },
  { hour: "20", detections: 148, matches: 1 },
  { hour: "22", detections: 88, matches: 0 },
];

export const departmentActivity = [
  { department: "POLICE", cameras: 18, detections: 512 },
  { department: "MUNICIPAL", cameras: 12, detections: 318 },
  { department: "GSRTC", cameras: 9, detections: 224 },
  { department: "PANCHAYAT", cameras: 6, detections: 142 },
  { department: "HEALTH", cameras: 5, detections: 88 },
];

export const topLocations = [
  { location: "SG Highway Jn · Ahmedabad", detections: 264, uptime: 99.8 },
  { location: "Infocity Junction · Gandhinagar", detections: 218, uptime: 99.4 },
  { location: "Ring Road · Surat", detections: 187, uptime: 98.1 },
  { location: "Alkapuri Square · Vadodara", detections: 152, uptime: 99.0 },
  { location: "Kalawad Road · Rajkot", detections: 131, uptime: 97.6 },
];

export const confidenceBands = [
  { band: "95-100%", share: 46 },
  { band: "90-94%", share: 31 },
  { band: "80-89%", share: 16 },
  { band: "70-79%", share: 5 },
  { band: "<70%", share: 2 },
];
