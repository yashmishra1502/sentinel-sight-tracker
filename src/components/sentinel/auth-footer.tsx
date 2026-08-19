import { ShieldCheck } from "lucide-react";

export function AuthFooter() {
  return (
    <footer className="w-full border-t border-[#1e2b4d] bg-[#0a1330]">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <p className="text-xs text-slate-400">
          © {new Date().getFullYear()} SENTINEL — Gujarat Police CCTV Intelligence Platform
        </p>
        <div className="hidden items-center gap-1.5 text-xs font-medium text-slate-400 sm:flex">
          <ShieldCheck className="h-4 w-4" />
          <span>Government Grade Security</span>
        </div>
      </div>
    </footer>
  );
}
