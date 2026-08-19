import { useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";

import { SectionCard, PageHeading } from "@/components/sentinel/primitives";
import { supabase } from "@/integrations/supabase/client";

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

const DESIGNATIONS = [
  { value: "police_inspector", label: "Police Inspector" },
  { value: "police_sub_inspector", label: "Police Sub-Inspector (PSI)" },
  { value: "police_constable", label: "Police Constable" },
  { value: "traffic_police_officer", label: "Traffic Police Officer" },
  { value: "acp", label: "ACP / Assistant Commissioner" },
  { value: "municipal_officer", label: "Municipal Officer" },
  { value: "rto_officer", label: "RTO Officer" },
  { value: "fire_emergency_officer", label: "Fire & Emergency Officer" },
  { value: "control_room_officer", label: "Control Room Officer" },
  { value: "superintendent_of_police", label: "Superintendent of Police" },
];

const DEPARTMENTS = [
  { value: "health", label: "Health" },
  { value: "police", label: "Police" },
  { value: "gsrtc", label: "GSRTC" },
  { value: "panchayat", label: "Panchayat" },
  { value: "municipal", label: "Municipal" },
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
      !form.designation ||
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
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-2xl space-y-5">
        <PageHeading
          eyebrow="SENTINEL"
          title="Officer Registration"
          description="Register with your official details to get access to the command center."
        />

        <SectionCard title="" subtitle="" bodyClassName="p-5 sm:p-6">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Personal details */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                Personal Details
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Full Name" id="name" required>
                  <input
                    id="name"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Full name"
                    className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm focus:border-ring focus:outline-none"
                  />
                </Field>

                <Field label="Official Email" id="email" required>
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="name@department.gov.in"
                    className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm focus:border-ring focus:outline-none"
                  />
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

                <Field label="Employee ID" id="employeeId" required>
                  <input
                    id="employeeId"
                    value={form.employeeId}
                    onChange={(e) => handleChange("employeeId", e.target.value)}
                    placeholder="e.g. GJP-00123"
                    className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm focus:border-ring focus:outline-none"
                  />
                </Field>
              </div>
            </div>

            {/* Posting details */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                Posting Details
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Department" id="department" required>
                  <select
                    id="department"
                    value={form.department}
                    onChange={(e) => handleChange("department", e.target.value)}
                    className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm focus:border-ring focus:outline-none"
                  >
                    <option value="">Select department</option>
                    {DEPARTMENTS.map((d) => (
                      <option key={d.value} value={d.value}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Designation" id="designation" required>
                  <select
                    id="designation"
                    value={form.designation}
                    onChange={(e) => handleChange("designation", e.target.value)}
                    className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm focus:border-ring focus:outline-none"
                  >
                    <option value="">Select designation</option>
                    {DESIGNATIONS.map((d) => (
                      <option key={d.value} value={d.value}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Access Role" id="role" required>
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
              </div>
            </div>

            {/* Security */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                Security
              </h3>
              <Field label="Password" id="password" required>
                <input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm focus:border-ring focus:outline-none"
                />
              </Field>
            </div>

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
  required = false,
}: {
  label: string;
  id: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="text-xs font-bold tracking-wide text-muted-foreground uppercase"
      >
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </label>
      {children}
    </div>
  );
}
