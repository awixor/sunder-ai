// AI Service Types and Configuration

export type AIProvider = "openai" | "anthropic" | "ollama" | "custom";

export interface AIServiceConfig {
  provider: AIProvider;
  apiKey?: string;
  endpoint?: string;
  model?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
  // Original content before protection (for user messages)
  originalContent?: string;
}

export interface AIResponse {
  content: string;
  model?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export const DEFAULT_AI_CONFIG: AIServiceConfig = {
  provider: "openai",
  model: "gpt-4o-mini",
};

export const PROVIDER_ENDPOINTS: Record<AIProvider, string> = {
  openai: "https://api.openai.com/v1/chat/completions",
  anthropic: "https://api.anthropic.com/v1/messages",
  ollama: "http://localhost:11434/api/chat",
  custom: "",
};
