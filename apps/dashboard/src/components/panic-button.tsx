"use client";

import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PanicButtonProps {
  onPanic: () => void;
}

export function PanicButton({ onPanic }: PanicButtonProps) {
  return (
    <Button
      variant="danger"
      size="sm"
      onClick={onPanic}
      title="Clear all session data immediately"
      className="bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400"
    >
      <ShieldAlert className="w-4 h-4" />
      Panic: Clear Session
    </Button>
  );
}
