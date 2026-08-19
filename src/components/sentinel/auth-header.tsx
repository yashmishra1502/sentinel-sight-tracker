import { ShieldCheck } from "lucide-react";

export function AuthHeader() {
  return (
    <header className="w-full border-b border-[#1e2b4d] bg-[#0a1330]">
      <div className="mx-auto flex h-20 max-w-5xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Gujarat Police"
            className="h-12 w-12 object-contain sm:h-14 sm:w-14"
          />
          <div>
            <p className="text-lg font-extrabold tracking-wide text-white sm:text-xl">
              SENTINEL
            </p>
            <p className="text-[10px] font-semibold tracking-[0.2em] text-slate-400 sm:text-xs">
              GUJARAT POLICE
            </p>
          </div>
        </div>

        <div className="hidden items-center gap-1.5 text-xs font-medium text-emerald-400 sm:flex">
          <ShieldCheck className="h-4 w-4" />
          <span>Secure</span>
          <span className="text-slate-600">•</span>
          <span>Trusted</span>
          <span className="text-slate-600">•</span>
          <span>Connected</span>
        </div>
      </div>
    </header>
  );
}
