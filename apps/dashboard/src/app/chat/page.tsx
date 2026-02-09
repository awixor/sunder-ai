"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useChat, type UIMessage } from "@ai-sdk/react";
import {
  Send,
  Loader2,
  Shield,
  ShieldCheck,
  Trash2,
  Settings,
  AlertCircle,
  X,
} from "lucide-react";
import { useSunder } from "@/context/sunder-context";
import { AIProvider, DEFAULT_MODELS, type AIServiceConfig } from "@/types/ai";

export default function ChatPage() {
  const [config, setConfig] = useState<AIServiceConfig>({
    provider: AIProvider.Ollama,
    model: DEFAULT_MODELS[AIProvider.Ollama],
  });
  const [showConfig, setShowConfig] = useState(false);
  const [text, setText] = useState("");
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
      // Try to parse JSON error from stream
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

  // Submit with protection
  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      if (!text.trim() || isLoading) return;

      const original = text.trim();
      const protected_ = protect(original);

      // Clear input and any previous error
      setText("");
      setError(null);

      // Create the message to send
      const userMessage: UIMessage = {
        id: crypto.randomUUID(),
        role: "user",
        parts: [{ type: "text", text: protected_ }],
      };

      // Store original for later display
      setOriginalContent((prev) => ({ ...prev, [userMessage.id]: original }));

      // Send the protected message with model config
      await sendMessage(userMessage, {
        body: { config },
      });
    },
    [text, isLoading, protect, sendMessage, config],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setOriginalContent({});
  };

  // Extract text from message parts
  const getMessageText = (message: UIMessage): string => {
    return message.parts
      .filter((p): p is { type: "text"; text: string } => p.type === "text")
      .map((p) => p.text)
      .join("");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)]">
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
            onClick={() => setShowConfig(!showConfig)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <Settings className="w-4 h-4" />
            {config.model}
          </button>
          {isLoading && (
            <button
              onClick={() => stop()}
              className="px-3 py-1.5 text-sm rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/30 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
            >
              Stop
            </button>
          )}
          <button
            onClick={clearChat}
            className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-500"
            title="Clear chat"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showConfig && (
        <div className="mb-4 p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 space-y-3">
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Provider</label>
            <select
              value={config.provider}
              onChange={(e) => {
                const provider = e.target.value as AIProvider;
                setConfig({
                  ...config,
                  provider,
                  model: DEFAULT_MODELS[provider],
                });
              }}
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm"
            >
              <option value={AIProvider.OpenAI}>OpenAI</option>
              <option value={AIProvider.Grok}>Grok (xAI)</option>
              <option value={AIProvider.Ollama}>Ollama (Local - Free)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Model</label>
            <input
              type="text"
              value={config.model || ""}
              onChange={(e) => setConfig({ ...config, model: e.target.value })}
              placeholder={DEFAULT_MODELS[config.provider]}
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm"
            />
          </div>
          {config.provider !== AIProvider.Ollama && (
            <div>
              <label className="block text-xs text-zinc-500 mb-1">
                API Key (optional - uses server env if empty)
              </label>
              <input
                type="password"
                value={config.apiKey || ""}
                onChange={(e) =>
                  setConfig({ ...config, apiKey: e.target.value })
                }
                placeholder={
                  config.provider === AIProvider.Grok ? "xai-..." : "sk-..."
                }
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm"
              />
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/30 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div className="flex-1 text-sm text-red-700 dark:text-red-300">
            {error}
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-600 dark:hover:text-red-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/50 p-4 space-y-4">
        {messages.length === 0 && (
          <div className="h-full flex items-center justify-center text-zinc-400">
            <div className="text-center">
              <ShieldCheck className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">
                Your messages are protected before being sent to AI
              </p>
              <p className="text-xs mt-1">
                Tokens like [EMAIL-001] replace sensitive data
              </p>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            reveal={reveal}
            getMessageText={getMessageText}
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

      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <div className="flex-1 relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message... (sensitive data will be protected)"
            rows={1}
            className="w-full px-4 py-3 pr-12 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Shield className="w-4 h-4 text-green-500" />
          </div>
        </div>
        <button
          type="submit"
          disabled={!text.trim() || isLoading}
          className="px-4 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}

interface MessageBubbleProps {
  message: UIMessage;
  reveal: (text: string) => string;
  getMessageText: (message: UIMessage) => string;
  originalContent?: string;
  isStreaming?: boolean;
}

function MessageBubble({
  message,
  reveal,
  getMessageText,
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
    : reveal(textContent);

  const hasProtection =
    isUser && originalContent && originalContent !== textContent;

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
          <button
            onClick={() => setShowOriginal(!showOriginal)}
            className="mt-2 text-xs opacity-70 hover:opacity-100 flex items-center gap-1"
          >
            <Shield className="w-3 h-3" />
            {showOriginal ? "Show protected" : "Show original"}
          </button>
        )}
      </div>
    </div>
  );
}
