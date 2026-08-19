/**
 * Illustrative analytics series used by the Analytics screen until the
 * aggregation service is wired up. No operational (camera / vehicle) data
 * lives here — that all comes from the live database via `sentinelApi`.
 */

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
