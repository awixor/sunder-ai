import { useState } from "react";
import { Shield, EyeOff } from "lucide-react";
import type { UIMessage } from "@ai-sdk/react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

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

  const displayContent = (() => {
    if (!showOriginal) return textContent;
    if (isUser) return originalContent || textContent;

    return reveal(textContent);
  })();

  const hasProtection = isUser
    ? originalContent && originalContent !== textContent
    : /\[[A-Z]+_\d+\]/.test(textContent);

  return (
    <div
      className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}
    >
      <div className="relative max-w-[80%] group">
        <div
          className={cn(
            "relative rounded-2xl px-5 py-4 shadow-sm",
            isUser
              ? "bg-blue-600 text-white"
              : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100",
          )}
        >
          <div className="relative z-10 min-h-6">
            <AnimatePresence mode="wait">
              <motion.p
                key={showOriginal ? "original" : "protected"}
                initial={{ opacity: 0, filter: "blur(4px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(4px)" }}
                transition={{ duration: 0.3 }}
                className="whitespace-pre-wrap text-sm leading-relaxed"
              >
                {displayContent}
                {isStreaming && !isUser && (
                  <span className="inline-block w-2 h-4 bg-zinc-500 ml-1 animate-pulse" />
                )}
              </motion.p>
            </AnimatePresence>
          </div>

          {hasProtection && (
            <div className="absolute -top-3 -right-3 z-20">
              <motion.button
                onClick={() => setShowOriginal(!showOriginal)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full shadow-lg ring-2 ring-white dark:ring-zinc-950 transition-colors",
                  showOriginal
                    ? "bg-red-500  text-white hover:bg-red-600"
                    : "bg-emerald-500 text-white hover:bg-emerald-600",
                )}
                title={showOriginal ? "Hide original" : "Show original"}
              >
                <AnimatePresence mode="wait">
                  {showOriginal ? (
                    <motion.div
                      key="hide"
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 90 }}
                    >
                      <EyeOff className="h-4 w-4" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="show"
                      initial={{ scale: 0, rotate: 90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: -90 }}
                    >
                      <Shield className="h-4 w-4" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
