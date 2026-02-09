"use client";

import { ShieldAlert } from "lucide-react";

interface PanicButtonProps {
  onPanic: () => void;
}

export function PanicButton({ onPanic }: PanicButtonProps) {
  return (
    <button
      onClick={onPanic}
      className="flex items-center gap-2 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400 rounded-md text-sm font-medium transition-colors"
      title="Clear all session data immediately"
    >
      <ShieldAlert className="w-4 h-4" />
      Panic: Clear Session
    </button>
  );
}
