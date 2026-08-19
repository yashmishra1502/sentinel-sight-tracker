import { useEffect, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth, type UserRole } from "@/hooks/use-auth";

export function RequireAuth({
  children,
  allowedRoles,
}: {
  children: ReactNode;
  allowedRoles?: UserRole[];
}) {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate({ to: "/login" });
      return;
    }

    if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
      navigate({ to: "/dashboard" });
    }
  }, [loading, user, profile, allowedRoles, navigate]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm font-semibold text-muted-foreground">
          Checking session…
        </p>
      </div>
    );
  }

  if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
    return null;
  }

  return <>{children}</>;
}
