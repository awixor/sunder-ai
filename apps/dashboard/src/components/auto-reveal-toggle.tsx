"use client";

import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AutoRevealToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export function AutoRevealToggle({ enabled, onToggle }: AutoRevealToggleProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => onToggle(!enabled)}
      className={
        enabled
          ? "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300"
          : "bg-zinc-50 text-zinc-600 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
      }
    >
      {enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
      {enabled ? "Auto-Reveal: ON" : "Auto-Reveal"}
    </Button>
  );
}
