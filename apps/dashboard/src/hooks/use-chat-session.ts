"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useChat, type UIMessage } from "@ai-sdk/react";
import { useSunder } from "@/context/sunder-context";
import { useChatHistory } from "@/hooks/use-chat-history";
import { AIProvider, DEFAULT_MODELS, type AIServiceConfig } from "@/types/ai";
import { chatHistory } from "@/lib/chat-history";
import type { Chat, Message } from "@/types/chat";

export interface ChatSessionState {
  messages: UIMessage[];
  input: string;
  isProtected: boolean;
  originalContent: Record<string, string>;
  isLoading: boolean;
  error: string | null;
  currentChatId: string | null;
  config: AIServiceConfig;
  showConfig: boolean;
  status: "streaming" | "submitted" | "ready" | "error";
}

export interface ChatSessionActions {
  setInput: (value: string) => void;
  setIsProtected: (value: boolean) => void;
  setConfig: (config: AIServiceConfig) => void;
  setShowConfig: (show: boolean) => void;
  setError: (error: string | null) => void;
  sendMessage: (event?: React.SubmitEvent) => Promise<void>;
  stop: () => void;
  clearSession: () => void;
  loadSession: (chatId: string) => Promise<void>;
  deleteChat: (id: string) => Promise<void>;
  clearAllChats: () => Promise<void>;
  reveal: (text: string) => string;
}

export interface UseChatSessionReturn {
  state: ChatSessionState;
  actions: ChatSessionActions;
  chats: Chat[];
}

function getMessageContent(m: UIMessage): string {
  if ("content" in m && typeof m.content === "string") return m.content;
  if (Array.isArray(m.parts)) {
    return m.parts
      .filter((p) => p.type === "text")
      .map((p) => p.text)
      .join("");
  }
  return "";
}

export function useChatSession(): UseChatSessionReturn {
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
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  const lastSaveTimeRef = useRef<number>(0);
  const messagesRef = useRef<UIMessage[]>([]);

  const { protect, reveal } = useSunder();
  const {
    chats,
    saveChat: persistChat,
    loadChat,
    deleteChat,
    clearAllChats,
  } = useChatHistory();

  const convertToChatMessages = useCallback(
    (uiMessages: UIMessage[], originals: Record<string, string>): Message[] => {
      return uiMessages.map((m) => {
        const content = getMessageContent(m);
        return {
          role: m.role as "user" | "assistant" | "system",
          content,
          originalContent: originals[m.id],
        };
      });
    },
    [],
  );

  const saveCurrentSession = useCallback(
    async (
      msgs: UIMessage[],
      chatId: string,
      currentOriginals: Record<string, string>,
    ) => {
      if (!msgs.length) return;

      const chatMessages = convertToChatMessages(msgs, currentOriginals);

      const firstUserMsg = chatMessages.find((m) => m.role === "user");
      const title = firstUserMsg
        ? chatHistory.generateTitle(
            firstUserMsg.originalContent || firstUserMsg.content,
          )
        : "New Chat";

      const chat: Chat = {
        id: chatId,
        title,
        timestamp: Date.now(),
        messages: chatMessages,
      };

      await persistChat(chat);
    },
    [convertToChatMessages, persistChat],
  );

  const { messages, setMessages, sendMessage, status, stop } = useChat({
    onFinish: async (result) => {
      if (currentChatId) {
        const allMessages = result?.messages || messagesRef.current;
        await saveCurrentSession(allMessages, currentChatId, originalContent);
      }
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

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    if (status === "streaming" && currentChatId) {
      const now = Date.now();
      if (now - lastSaveTimeRef.current > 1000) {
        saveCurrentSession(messages, currentChatId, originalContent);
        lastSaveTimeRef.current = now;
      }
    }
  }, [status, messages, currentChatId, originalContent, saveCurrentSession]);

  const handleSendMessage = useCallback(
    async (event?: React.SubmitEvent) => {
      event?.preventDefault();

      if (!text.trim() || isLoading) return;

      const originalText = text.trim();
      const processedText = isProtected ? protect(originalText) : originalText;

      setText("");
      setError(null);

      let activeChatId = currentChatId;
      if (!activeChatId) {
        activeChatId = crypto.randomUUID();
        setCurrentChatId(activeChatId);
      }

      const userMessageId = crypto.randomUUID();

      const nextOriginals = {
        ...originalContent,
        [userMessageId]: originalText,
      };
      setOriginalContent(nextOriginals);

      const userMessage: UIMessage = {
        id: userMessageId,
        role: "user",
        parts: [{ type: "text", text: processedText }] as const,
      } as UIMessage;

      const newMessages = [...messages, userMessage];

      await saveCurrentSession(newMessages, activeChatId, nextOriginals);

      await sendMessage(userMessage, {
        body: { config },
      });
    },
    [
      text,
      isLoading,
      isProtected,
      protect,
      originalContent,
      currentChatId,
      messages,
      saveCurrentSession,
      sendMessage,
      config,
      setText,
    ],
  );

  const clearSession = useCallback(() => {
    setMessages([]);
    setOriginalContent({});
    setCurrentChatId(null);
    setError(null);
    setText("");
  }, [setMessages, setText]);

  const loadSession = useCallback(
    async (chatId: string) => {
      const chat = await loadChat(chatId);
      if (chat) {
        setCurrentChatId(chat.id);

        const originals: Record<string, string> = {};
        const uiMessages: UIMessage[] = chat.messages.map((m, i) => {
          const id = `${chat.id}-${i}`;

          if (m.originalContent) {
            originals[id] = m.originalContent;
          }

          return {
            id,
            role: m.role,
            content: m.content,
            parts: [{ type: "text", text: m.content }],
          } as unknown as UIMessage;
        });

        setOriginalContent(originals);
        setMessages(uiMessages);
      }
    },
    [loadChat, setMessages],
  );

  return {
    state: {
      messages,
      input: text,
      isProtected,
      originalContent,
      isLoading,
      error,
      currentChatId,
      config,
      showConfig,
      status,
    },
    actions: {
      setInput: setText,
      setIsProtected,
      setConfig,
      setShowConfig,
      setError,
      sendMessage: handleSendMessage,
      stop,
      clearSession,
      loadSession,
      deleteChat,
      clearAllChats,
      reveal,
    },
    chats,
  };
}
