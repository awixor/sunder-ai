"use client";

import { useState } from "react";
import { Shield } from "lucide-react";
import type { UIMessage } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";

interface MessageBubbleProps {
  message: UIMessage;
  reveal: (text: string) => string;
  originalContent?: string;
  isStreaming?: boolean;
}

function getMessageText(message: UIMessage): string {
  return message.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("");
}

export function MessageBubble({
  message,
  reveal,
  originalContent,
  isStreaming,
}: MessageBubbleProps) {
  const [showOriginal, setShowOriginal] = useState(false);
  const isUser = message.role === "user";
  const textContent = getMessageText(message);

  const displayContent = isUser
    ? showOriginal && originalContent
      ? originalContent
      : textContent
    : showOriginal
      ? reveal(textContent)
      : textContent;

  const hasProtection = isUser
    ? originalContent && originalContent !== textContent
    : /\[[A-Z]+_\d+\]/.test(textContent);

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-xl px-4 py-3 ${
          isUser
            ? "bg-blue-600 text-white"
            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
        }`}
      >
        <p className="whitespace-pre-wrap text-sm">
          {displayContent}
          {isStreaming && !isUser && (
            <span className="inline-block w-2 h-4 bg-zinc-500 ml-1 animate-pulse" />
          )}
        </p>
        {hasProtection && (
          <Button
            variant="inline"
            size="sm"
            onClick={() => setShowOriginal(!showOriginal)}
            className="mt-2 text-xs p-0"
          >
            <Shield className="w-3 h-3" />
            {showOriginal ? "Show protected" : "Show original"}
          </Button>
        )}
      </div>
    </div>
  );
}
