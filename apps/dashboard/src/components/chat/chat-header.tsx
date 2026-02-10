"use client";

import { Settings, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatHeaderProps {
  modelName: string;
  isLoading: boolean;
  onToggleConfig: () => void;
  onStop: () => void;
  onClear: () => void;
}

export function ChatHeader({
  modelName,
  isLoading,
  onToggleConfig,
  onStop,
  onClear,
}: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          AI Chat
        </h2>
        <p className="text-zinc-500 text-sm mt-1">
          Your messages are protected before reaching the AI
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onToggleConfig}>
          <Settings className="w-4 h-4" />
          {modelName}
        </Button>
        {isLoading && (
          <Button variant="danger" size="sm" onClick={onStop}>
            Stop
          </Button>
        )}
        <Button
          variant="danger"
          size="icon"
          onClick={onClear}
          title="Clear chat"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
