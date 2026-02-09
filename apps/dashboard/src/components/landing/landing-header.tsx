import { ThemeToggle } from "@/components/theme-toggle";
import { Shield } from "lucide-react";
import Link from "next/link";

export function LandingHeader() {
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800`}
    >
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
            <Shield className="w-5 h-5 fill-current" />
          </div>
          <span className="font-bold text-lg text-slate-900 dark:text-white">
            Sunder
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <ThemeToggle />

          <Link
            href="/shield"
            className="hidden md:inline-flex items-center justify-center px-4 py-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-medium hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
          >
            Launch App
          </Link>
        </div>
      </div>
    </header>
  );
}
