import { AuthHeader } from "@/components/sentinel/auth-header";
import { AuthFooter } from "@/components/sentinel/auth-footer";
import { useState, useEffect } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";

import { SectionCard, PageHeading } from "@/components/sentinel/primitives";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — SENTINEL" },
      {
        name: "description",
        content: "Secure login for SENTINEL Gujarat CCTV Intelligence Platform.",
      },
    ],
  }),
  component: LoginPage,
});

function generateCaptcha() {
  const a = Math.floor(Math.random() * 10) + 1;
  const b = Math.floor(Math.random() * 10) + 1;
  return { a, b, answer: a + b };
}

function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [captcha, setCaptcha] = useState(generateCaptcha());

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    setCaptchaInput("");
  };

  useEffect(() => {
    refreshCaptcha();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!identifier || !password) {
      setError("Email/Employee ID aur Password dono bharein.");
      return;
    }

    if (parseInt(captchaInput, 10) !== captcha.answer) {
      setError("Captcha galat hai. Dobara try karein.");
      refreshCaptcha();
      return;
    }

    setLoading(true);

    let loginEmail = identifier;
    const looksLikeEmail = identifier.includes("@");

    if (!looksLikeEmail) {
      const { data: emailData, error: lookupError } = await supabase.rpc(
        "get_email_by_employee_id",
        { emp_id: identifier },
      );

      if (lookupError || !emailData) {
        setError("Employee ID nahi mila.");
        setLoading(false);
        refreshCaptcha();
        return;
      }
      loginEmail = emailData as string;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError("Login fail hua. Email/ID ya password check karein.");
      refreshCaptcha();
      return;
    }

    navigate({ to: "/dashboard" });
  }

    return (
    <div className="flex min-h-screen flex-col bg-background">
      <AuthHeader />

      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-md space-y-5">
          <PageHeading
            eyebrow="SENTINEL"
            title="Officer Login"
            description="Sign in with your official email or employee ID to access the command center."
          />

          <SectionCard title="" subtitle="" bodyClassName="p-5 sm:p-6">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-1.5">
                <label
                  htmlFor="identifier"
                  className="text-xs font-bold tracking-wide text-muted-foreground uppercase"
                >
                  Official Email / Employee ID
                </label>
                <input
                  id="identifier"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="name@department.gov.in or GJP-00123"
                  className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm focus:border-ring focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="text-xs font-bold tracking-wide text-muted-foreground uppercase"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm focus:border-ring focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="captcha"
                  className="text-xs font-bold tracking-wide text-muted-foreground uppercase"
                >
                  Security Check: {captcha.a} + {captcha.b} = ?
                </label>
                <div className="flex gap-2">
                  <input
                    id="captcha"
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value)}
                    placeholder="Answer"
                    className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm focus:border-ring focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={refreshCaptcha}
                    className="inline-flex h-11 items-center justify-center rounded-md border border-border bg-surface px-3 text-sm font-semibold hover:bg-accent"
                    aria-label="Refresh captcha"
                  >
                    ↻
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-sm font-semibold text-destructive">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-12 w-full items-center justify-center rounded-md bg-royal text-sm font-bold tracking-wide text-royal-foreground uppercase transition-colors hover:bg-royal/90 disabled:opacity-60"
              >
                {loading ? "Logging in..." : "Login"}
              </button>

              <p className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link to="/register" className="font-semibold text-royal hover:underline">
                  Register
                </Link>
              </p>
            </form>
          </SectionCard>
        </div>
      </div>

      <AuthFooter />
    </div>
  );
}
}
