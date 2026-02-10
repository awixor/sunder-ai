"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, MessageSquare, Trash2, Plus } from "lucide-react";
import {
  ChatHeader,
  ModelConfigPanel,
  ChatErrorBanner,
  ChatEmptyState,
  ChatInput,
  MessageBubble,
} from "@/components/chat";
import { useChatSession } from "@/hooks/use-chat-session";
import { Button } from "@/components/ui/button";
import { InlineConfirmation } from "@/components/ui/inline-confirmation";

export default function ChatPage() {
  const { state, actions, chats } = useChatSession();
  const [showClearConfirmation, setShowClearConfirmation] = useState(false);

  const {
    messages,
    input,
    isLoading,
    isProtected,
    originalContent,
    error,
    config,
    showConfig,
    status,
  } = state;

  const {
    setInput,
    setIsProtected,
    setConfig,
    setShowConfig,
    setError,
    sendMessage,
    stop,
    clearSession,
    loadSession,
    deleteChat,
    clearAllChats,
    reveal,
  } = actions;

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex h-[calc(100vh-180px)] gap-6">
      <div className="w-64 flex flex-col gap-4">
        <Button
          onClick={clearSession}
          className="w-full justify-start gap-2"
          variant="outline"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </Button>

        <div className="flex-1 overflow-y-auto space-y-1 pr-2 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className="group relative flex items-center gap-2 p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
              onClick={() => loadSession(chat.id)}
            >
              <MessageSquare className="w-4 h-4 text-zinc-400" />
              <span className="flex-1 truncate text-sm text-zinc-600 dark:text-zinc-400">
                {chat.title}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteChat(chat.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-opacity h-6 w-6"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-zinc-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors mb-2"
            onClick={() => setShowClearConfirmation(true)}
            disabled={chats.length === 0}
          >
            <Trash2 className="w-4 h-4" />
            <span className="text-xs font-medium">Clear all history</span>
          </Button>

          <InlineConfirmation
            isOpen={showClearConfirmation}
            onConfirm={async () => {
              await clearAllChats();
              setShowClearConfirmation(false);
            }}
            onCancel={() => setShowClearConfirmation(false)}
            description="This will permanently delete all your chat history. This action cannot be undone."
            confirmLabel="Delete"
            variant="destructive"
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <ChatHeader
          modelName={config.model || ""}
          isLoading={isLoading}
          onToggleConfig={() => setShowConfig(!showConfig)}
          onStop={stop}
        />

        {showConfig && (
          <ModelConfigPanel config={config} onChange={setConfig} />
        )}

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

        <div className="mt-4">
          <ChatInput
            value={input}
            isLoading={isLoading}
            isProtected={isProtected}
            onChange={setInput}
            onToggleProtection={setIsProtected}
            onSubmit={(e) => sendMessage(e)}
          />
        </div>
      </div>
    </div>
  );
}
