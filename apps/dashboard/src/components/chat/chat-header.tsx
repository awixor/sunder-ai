"use client";

import { Settings, Trash2 } from "lucide-react";

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
        <button
          onClick={onToggleConfig}
          className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <Settings className="w-4 h-4" />
          {modelName}
        </button>
        {isLoading && (
          <button
            onClick={onStop}
            className="px-3 py-1.5 text-sm rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/30 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
          >
            Stop
          </button>
        )}
        <button
          onClick={onClear}
          className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-500"
          title="Clear chat"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
