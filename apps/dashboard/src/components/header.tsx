"use client";

import { Nav } from "@/components/nav";
import { Heartbeat } from "@/components/heartbeat";
import { ThemeToggle } from "@/components/theme-toggle";
import { useSunder } from "@/context/sunder-context";

export function Header() {
  const { health } = useSunder();

  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 md:px-12 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              SUNDER <span className="text-blue-600">AI</span>
            </h1>
            <p className="text-xs text-slate-500">
              Local-First Privacy Shield v0.1.0
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Heartbeat status={health} />
            <div className="w-px h-5 bg-zinc-200 dark:bg-zinc-800" />
            <ThemeToggle />
          </div>
        </div>
        <Nav />
      </div>
    </header>
  );
}
