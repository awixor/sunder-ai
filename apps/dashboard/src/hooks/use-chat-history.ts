import { useState, useEffect, useCallback } from "react";
import { Chat } from "@/types/chat";
import { chatHistory } from "@/lib/chat-history";

interface UseChatHistoryReturn {
  chats: Chat[];
  isLoading: boolean;
  error: Error | null;
  saveChat: (chat: Chat) => Promise<void>;
  deleteChat: (id: string) => Promise<void>;
  clearAllChats: () => Promise<void>;
  loadChat: (id: string) => Promise<Chat | undefined>;
  refreshChats: () => Promise<void>;
}

export function useChatHistory(): UseChatHistoryReturn {
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchChats = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const history = await chatHistory.getChats();
      setChats(history);
    } catch (err) {
      console.error("Failed to load chat history:", err);
      setError(
        err instanceof Error ? err : new Error("Failed to load chat history"),
      );
      setChats([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  const saveChat = useCallback(
    async (chat: Chat) => {
      try {
        setError(null);
        await chatHistory.saveChat(chat);
        await fetchChats();
      } catch (err) {
        console.error("Failed to save chat:", err);
        setError(err instanceof Error ? err : new Error("Failed to save chat"));
        throw err;
      }
    },
    [fetchChats],
  );

  const deleteChat = useCallback(
    async (id: string) => {
      try {
        setError(null);
        await chatHistory.deleteChat(id);
        await fetchChats();
      } catch (err) {
        console.error("Failed to delete chat:", err);
        setError(
          err instanceof Error ? err : new Error("Failed to delete chat"),
        );
        throw err;
      }
    },
    [fetchChats],
  );

  const clearAllChats = useCallback(async () => {
    try {
      setError(null);
      await chatHistory.clearChats();
      setChats([]);
    } catch (err) {
      console.error("Failed to clear chat history:", err);
      setError(
        err instanceof Error ? err : new Error("Failed to clear chat history"),
      );
      throw err;
    }
  }, []);

  const loadChat = useCallback(async (id: string) => {
    try {
      setError(null);
      return await chatHistory.getChat(id);
    } catch (err) {
      console.error("Failed to load specific chat:", err);
      setError(err instanceof Error ? err : new Error("Failed to load chat"));
      return undefined;
    }
  }, []);

  return {
    chats,
    isLoading,
    error,
    saveChat,
    deleteChat,
    clearAllChats,
    loadChat,
    refreshChats: fetchChats,
  };
}
