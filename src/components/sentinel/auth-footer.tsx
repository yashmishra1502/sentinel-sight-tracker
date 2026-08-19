import { ShieldCheck } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function AuthFooter() {
  return (
    <footer className="w-full border-t border-[#1e2b4d] bg-[#0a1330]">
      <div className="mx-auto flex h-16 max-w-5xl flex-col items-center justify-between gap-2 px-4 sm:flex-row sm:px-6">
        <Link
          to="/"
          className="text-xs text-slate-400 transition-colors hover:text-white"
        >
          © {new Date().getFullYear()} SENTINEL — Gujarat Police CCTV Intelligence Platform
        </Link>
        <div className="hidden items-center gap-1.5 text-xs font-medium text-slate-400 sm:flex">
          <ShieldCheck className="h-4 w-4" />
          <span>Government Grade Security</span>
        </div>
      </div>
    </footer>
  );
}
