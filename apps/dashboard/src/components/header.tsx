"use client";

import { Nav } from "@/components/nav";
import { Heartbeat } from "@/components/heartbeat";
import { ThemeToggle } from "@/components/theme-toggle";
import { useSunder } from "@/context/sunder-context";
import { Shield } from "lucide-react";

export function Header() {
  const { health } = useSunder();

  return (
    <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 md:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Shield className="w-5 h-5 fill-current" />
            </div>
            <span className="font-bold text-lg text-slate-900 dark:text-white">
              Sunder
            </span>
          </div>

          <div className="hidden md:block w-px h-6 bg-slate-200 dark:bg-slate-800" />

          <Nav />
        </div>

        <div className="flex items-center gap-3">
          <Heartbeat status={health} />
          <div className="w-px h-5 bg-slate-200 dark:bg-slate-800" />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
