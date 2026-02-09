// AI Service Types and Configuration

export enum AIProvider {
  OpenAI = "openai",
  Grok = "grok",
  Anthropic = "anthropic",
  Ollama = "ollama",
  Custom = "custom",
}

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
  provider: AIProvider.OpenAI,
  model: "gpt-4o-mini",
};

export const PROVIDER_ENDPOINTS: Record<AIProvider, string> = {
  [AIProvider.OpenAI]: "https://api.openai.com/v1/chat/completions",
  [AIProvider.Grok]: "https://api.x.ai/v1",
  [AIProvider.Anthropic]: "https://api.anthropic.com/v1/messages",
  [AIProvider.Ollama]: "http://localhost:11434/api/chat",
  [AIProvider.Custom]: "",
};

export const DEFAULT_MODELS: Record<AIProvider, string> = {
  [AIProvider.OpenAI]: "gpt-4o-mini",
  [AIProvider.Grok]: "grok-3-mini-fast-beta",
  [AIProvider.Anthropic]: "claude-3-haiku-20240307",
  [AIProvider.Ollama]: "llama3.2",
  [AIProvider.Custom]: "",
};
