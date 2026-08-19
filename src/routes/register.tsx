import { useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";

import { SectionCard, PageHeading } from "@/components/sentinel/primitives";
import { supabase } from "@/integrations/supabase/client";
import { buildDemoProfile, saveDemoSession } from "@/lib/demo-auth";
import type { UserRole } from "@/hooks/use-auth";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Register — SENTINEL" },
      {
        name: "description",
        content: "Create an official account for SENTINEL Gujarat CCTV Intelligence Platform.",
      },
    ],
  }),
  component: RegisterPage,
});

const ROLES = [
  { value: "admin", label: "Admin" },
  { value: "control_room_operator", label: "Control Room Operator" },
  { value: "field_officer", label: "Field Officer" },
  { value: "supervisor", label: "Supervisor" },
];

function RegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    designation: "",
    department: "",
    employeeId: "",
    role: "",
    password: "",
    mobileNumber: "",
  });

  function handleChange(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (
      !form.name ||
      !form.email ||
      !form.department ||
      !form.employeeId ||
      !form.role ||
      !form.password
    ) {
      setError("Sabhi required fields bharein.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password kam se kam 6 characters ka hona chahiye.");
      return;
    }

    setLoading(true);

    // TEMPORARY DEMO REGISTER: no Supabase project/database is
    // connected yet. Save the form straight into a local mock
    // profile instead of calling Supabase. Replace this block with
    // the commented-out Supabase flow below once a backend is
    // connected.
    const demoProfile = buildDemoProfile({
      identifier: form.email,
      name: form.name,
      designation: form.designation,
      department: form.department,
      employeeId: form.employeeId,
      role: form.role as UserRole,
      mobileNumber: form.mobileNumber,
    });
    saveDemoSession(demoProfile);
    setLoading(false);
    navigate({ to: "/dashboard" });
    return;

    /* --- Real Supabase auth (re-enable once backend is connected) ---
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (!authData.user) {
      setError("User create nahi ho paya. Dobara try karein.");
      setLoading(false);
      return;
    }

    const { error: profileError } = await supabase.from("profiles").insert({
      id: authData.user.id,
      name: form.name,
      email: form.email,
      designation: form.designation,
      department: form.department,
      employee_id: form.employeeId,
      role: form.role,
      mobile_number: form.mobileNumber,
    });

    setLoading(false);

    if (profileError) {
      setError(profileError.message);
      return;
    }

    navigate({ to: "/login" });
    */
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md space-y-5">
        <PageHeading
          eyebrow="SENTINEL"
          title="Officer Registration"
          description="Register with your official details to get access to the command center."
        />

        <SectionCard title="" subtitle="" bodyClassName="p-5 sm:p-6">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Field label="Full Name" id="name">
              <input
                id="name"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Full name"
                className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm focus:border-ring focus:outline-none"
              />
            </Field>

            <Field label="Official Email" id="email">
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="name@department.gov.in"
                className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm focus:border-ring focus:outline-none"
              />
            </Field>

            <Field label="Designation" id="designation">
              <input
                id="designation"
                value={form.designation}
                onChange={(e) => handleChange("designation", e.target.value)}
                placeholder="e.g. Inspector"
                className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm focus:border-ring focus:outline-none"
              />
            </Field>

            <Field label="Department" id="department">
              <input
                id="department"
                value={form.department}
                onChange={(e) => handleChange("department", e.target.value)}
                placeholder="e.g. Police, GSRTC, Municipal"
                className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm focus:border-ring focus:outline-none"
              />
            </Field>

            <Field label="Employee ID" id="employeeId">
              <input
                id="employeeId"
                value={form.employeeId}
                onChange={(e) => handleChange("employeeId", e.target.value)}
                placeholder="e.g. GJP-00123"
                className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm focus:border-ring focus:outline-none"
              />
            </Field>

            <Field label="Role" id="role">
              <select
                id="role"
                value={form.role}
                onChange={(e) => handleChange("role", e.target.value)}
                className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm focus:border-ring focus:outline-none"
              >
                <option value="">Select role</option>
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Mobile Number" id="mobileNumber">
              <input
                id="mobileNumber"
                type="tel"
                value={form.mobileNumber}
                onChange={(e) => handleChange("mobileNumber", e.target.value)}
                placeholder="10-digit mobile number"
                className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm focus:border-ring focus:outline-none"
              />
            </Field>

            <Field label="Password" id="password">
              <input
                id="password"
                type="password"
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                placeholder="Minimum 6 characters"
                className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm focus:border-ring focus:outline-none"
              />
            </Field>

            {error && (
              <p className="text-sm font-semibold text-destructive">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-12 w-full items-center justify-center rounded-md bg-royal text-sm font-bold tracking-wide text-royal-foreground uppercase transition-colors hover:bg-royal/90 disabled:opacity-60"
            >
              {loading ? "Registering..." : "Register"}
            </button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-royal hover:underline">
                Login
              </Link>
            </p>
          </form>
        </SectionCard>
      </div>
    </div>
  );
}

function Field({
  label,
  id,
  children,
}: {
  label: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="text-xs font-bold tracking-wide text-muted-foreground uppercase"
      >
        {label}
      </label>
      {children}
    </div>
  );
}
