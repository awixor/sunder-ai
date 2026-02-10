import { Chat } from "@/types/chat";

const DB_NAME = "sunder-chat-db";
const DB_VERSION = 1;
const STORE_NAME = "chats";

export class ChatHistoryService {
  private static instance: ChatHistoryService;
  private dbPromise: Promise<IDBDatabase> | null = null;

  private constructor() {}

  public static getInstance(): ChatHistoryService {
    if (!ChatHistoryService.instance) {
      ChatHistoryService.instance = new ChatHistoryService();
    }
    return ChatHistoryService.instance;
  }

  private async getDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        reject(new Error("Failed to open database"));
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: "id" });
        }
      };
    });

    return this.dbPromise;
  }

  async saveChat(chat: Chat): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(chat);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getChats(): Promise<Chat[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const chats = (request.result as Chat[]).sort(
          (a, b) => b.timestamp - a.timestamp,
        );
        resolve(chats);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async getChat(id: string): Promise<Chat | undefined> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async deleteChat(id: string): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clearChats(): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  generateTitle(content: string): string {
    return content.slice(0, 50) + (content.length > 50 ? "..." : "");
  }
}

export const chatHistory = ChatHistoryService.getInstance();
