"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useChat, type UIMessage } from "@ai-sdk/react";
import { Loader2 } from "lucide-react";
import { useSunder } from "@/context/sunder-context";
import { AIProvider, DEFAULT_MODELS, type AIServiceConfig } from "@/types/ai";
import {
  ChatHeader,
  ModelConfigPanel,
  ChatErrorBanner,
  ChatEmptyState,
  ChatInput,
  MessageBubble,
} from "@/components/chat";

export default function ChatPage() {
  const [config, setConfig] = useState<AIServiceConfig>({
    provider: AIProvider.Ollama,
    model: DEFAULT_MODELS[AIProvider.Ollama],
  });
  const [showConfig, setShowConfig] = useState(false);
  const [text, setText] = useState("");
  const [isProtected, setIsProtected] = useState(true);
  const [originalContent, setOriginalContent] = useState<
    Record<string, string>
  >({});
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { protect, reveal } = useSunder();

  const { messages, setMessages, sendMessage, status, stop } = useChat({
    onFinish: () => {
      scrollToBottom();
    },
    onError: (err) => {
      const message = err instanceof Error ? err.message : String(err);
      try {
        const parsed = JSON.parse(message);
        setError(parsed.error?.message || parsed.message || message);
      } catch {
        setError(message);
      }
    },
  });

  const isLoading = status === "streaming" || status === "submitted";

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSubmit = useCallback(
    async (event?: React.SubmitEvent) => {
      event?.preventDefault();

      if (!text.trim() || isLoading) return;

      const original = text.trim();
      const protected_ = isProtected ? protect(original) : original;

      setText("");
      setError(null);

      const userMessage: UIMessage = {
        id: crypto.randomUUID(),
        role: "user",
        parts: [{ type: "text", text: protected_ }],
      };

      setOriginalContent((prev) => ({ ...prev, [userMessage.id]: original }));

      await sendMessage(userMessage, {
        body: { config },
      });
    },
    [text, isLoading, protect, sendMessage, config, isProtected],
  );

  const clearChat = () => {
    setMessages([]);
    setOriginalContent({});
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)]">
      <ChatHeader
        modelName={config.model || ""}
        isLoading={isLoading}
        onToggleConfig={() => setShowConfig(!showConfig)}
        onStop={stop}
        onClear={clearChat}
      />

      {showConfig && <ModelConfigPanel config={config} onChange={setConfig} />}

      {error && (
        <ChatErrorBanner message={error} onDismiss={() => setError(null)} />
      )}

      <div className="flex-1 overflow-y-auto border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/50 p-4 space-y-4">
        {messages.length === 0 && <ChatEmptyState />}

        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            reveal={reveal}
            originalContent={originalContent[message.id]}
            isStreaming={
              status === "streaming" &&
              message === messages[messages.length - 1]
            }
          />
        ))}

        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <div className="flex justify-start">
            <div className="bg-zinc-100 dark:bg-zinc-800 rounded-xl px-4 py-3">
              <Loader2 className="w-5 h-5 animate-spin text-zinc-500" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <ChatInput
        value={text}
        isLoading={isLoading}
        isProtected={isProtected}
        onChange={setText}
        onToggleProtection={setIsProtected}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
