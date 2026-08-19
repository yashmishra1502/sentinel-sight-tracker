import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { getDemoSession } from "@/lib/demo-auth";

export type UserRole =
  | "admin"
  | "control_room_operator"
  | "field_officer"
  | "supervisor";

export interface Profile {
  id: string;
  name: string;
  email: string;
  designation: string | null;
  department: string;
  employee_id: string;
  role: UserRole;
  mobile_number: string | null;
}

interface AuthState {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
}

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
  });

  useEffect(() => {
    let mounted = true;

    // TEMPORARY: no Supabase project is connected yet. If a demo
    // session exists in localStorage (created on the login/register
    // page), use it and skip Supabase entirely so the app doesn't
    // crash trying to reach a backend that isn't there.
    const demo = getDemoSession();
    if (demo) {
      setState({ user: { id: demo.id } as User, profile: demo.profile, loading: false });
      return () => {
        mounted = false;
      };
    }

    async function loadProfile(userId: string): Promise<Profile | null> {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();
      return (data as Profile) ?? null;
    }

    try {
      supabase.auth.getSession().then(async ({ data: { session } }) => {
        if (!mounted) return;
        if (session?.user) {
          const profile = await loadProfile(session.user.id);
          if (mounted) setState({ user: session.user, profile, loading: false });
        } else {
          setState({ user: null, profile: null, loading: false });
        }
      });

      const { data: listener } = supabase.auth.onAuthStateChange(
        async (_event, session) => {
          if (!mounted) return;
          if (session?.user) {
            const profile = await loadProfile(session.user.id);
            if (mounted) setState({ user: session.user, profile, loading: false });
          } else {
            setState({ user: null, profile: null, loading: false });
          }
        },
      );

      return () => {
        mounted = false;
        listener.subscription.unsubscribe();
      };
    } catch (err) {
      // Supabase isn't connected (no env vars) — fall back to "logged out"
      // instead of crashing the app. User will be routed to /login.
      console.warn("[useAuth] Supabase not configured, no demo session found:", err);
      setState({ user: null, profile: null, loading: false });
      return () => {
        mounted = false;
      };
    }
  }, []);

  return state;
}
