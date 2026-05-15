import { useEffect, useState, type ReactNode, type FormEvent } from "react";
import { Logo } from "./Logo";
import { Lock } from "lucide-react";

const STORAGE_KEY = "od360_auth";
const PASSWORD = "migros2026";

export function PasswordGate({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const [ready, setReady] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem(STORAGE_KEY) === "1") {
      setUnlocked(true);
    }
    setReady(true);
  }, []);

  if (!ready) return null;
  if (unlocked) return <>{children}</>;

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (value === PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, "1");
      setUnlocked(true);
    } else {
      setError(true);
      setValue("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden p-6">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <span className="od-blob od-blob-a" style={{ width: 520, height: 520, top: -160, left: -120 }} />
        <span className="od-blob od-blob-b" style={{ width: 480, height: 480, bottom: -120, right: -140 }} />
      </div>
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-2xl border border-border bg-card/80 backdrop-blur-xl p-8 shadow-2xl"
      >
        <div className="flex flex-col items-center text-center">
          <Logo className="h-14 w-14 drop-shadow-[0_4px_16px_rgba(237,118,37,0.5)]" />
          <h1 className="mt-4 text-xl font-semibold bg-gradient-to-r from-[#ED7625] to-[#B8470F] bg-clip-text text-transparent">
            OneDemand 360
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">Demo erişimi için şifre gerekli</p>
        </div>
        <div className="mt-6">
          <label className="text-xs font-medium text-muted-foreground">Şifre</label>
          <div className="mt-1.5 relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              autoFocus
              type="password"
              value={value}
              onChange={(e) => { setValue(e.target.value); setError(false); }}
              className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#ED7625]/40"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="mt-2 text-xs text-red-500">Şifre hatalı.</p>}
        </div>
        <button
          type="submit"
          className="mt-5 w-full rounded-lg bg-gradient-to-r from-[#ED7625] to-[#F39455] py-2.5 text-sm font-medium text-white shadow-[0_8px_22px_-10px_rgba(237,118,37,0.7)] hover:opacity-95 transition"
        >
          Giriş Yap
        </button>
        <p className="mt-4 text-center text-[11px] text-muted-foreground">Migros One · Internal AI Demo</p>
      </form>
    </div>
  );
}
