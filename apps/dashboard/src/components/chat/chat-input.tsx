"use client";

import { Send, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatInputProps {
  value: string;
  isLoading: boolean;
  onChange: (value: string) => void;
  onSubmit: (e?: React.SubmitEvent) => void;
}

export function ChatInput({
  value,
  isLoading,
  onChange,
  onSubmit,
}: ChatInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <form onSubmit={onSubmit} className="mt-4 flex gap-2">
      <div className="flex-1 relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message... (sensitive data will be protected)"
          rows={1}
          className="w-full px-4 py-3 pr-12 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <Shield className="w-4 h-4 text-green-500" />
        </div>
      </div>
      <Button
        type="submit"
        disabled={!value.trim() || isLoading}
        className="px-4 py-3 rounded-xl"
      >
        <Send className="w-5 h-5" />
      </Button>
    </form>
  );
}
