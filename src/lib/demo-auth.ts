import type { Profile } from "@/hooks/use-auth";

/**
 * TEMPORARY DEMO AUTH
 * ---------------------------------------------------------------
 * No Supabase project is connected yet, so real auth (signIn/signUp)
 * has nothing to talk to. Until a backend/database is wired up, we
 * fake a "session" in localStorage so the Command Center UI can be
 * demoed end-to-end. Login/Register accept ANY input.
 *
 * Remove this file (and its usages in use-auth.ts, login.tsx,
 * register.tsx) once real Supabase auth is connected.
 */

const STORAGE_KEY = "sentinel_demo_session";

export interface DemoSession {
  id: string;
  profile: Profile;
}

export function saveDemoSession(profile: Profile) {
  const session: DemoSession = { id: profile.id, profile };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function getDemoSession(): DemoSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as DemoSession;
  } catch {
    return null;
  }
}

export function clearDemoSession() {
  localStorage.removeItem(STORAGE_KEY);
}

export function buildDemoProfile(input: {
  identifier: string;
  name?: string;
  designation?: string;
  department?: string;
  employeeId?: string;
  role?: Profile["role"];
  mobileNumber?: string;
}): Profile {
  const looksLikeEmail = input.identifier.includes("@");
  return {
    id: `demo-${Date.now()}`,
    name:
      input.name ||
      (looksLikeEmail ? input.identifier.split("@")[0] || input.identifier : input.identifier),
    email: looksLikeEmail ? input.identifier : `${input.identifier}@demo.local`,
    designation: input.designation ?? "Officer",
    department: input.department ?? "General",
    employee_id: input.employeeId ?? input.identifier,
    role: input.role ?? "control_room_operator",
    mobile_number: input.mobileNumber ?? null,
  };
}
