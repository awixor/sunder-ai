import { createOpenAI } from "@ai-sdk/openai";
import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { AIProvider, DEFAULT_MODELS } from "@/types/ai";

// ============================================================================
// Types
// ============================================================================

enum MessageRole {
  User = "user",
  Assistant = "assistant",
  System = "system",
}

interface SimpleMessage {
  role: MessageRole;
  content: string;
}

interface ChatConfig {
  provider?: AIProvider;
  model?: string;
  apiKey?: string;
}

interface ChatRequestBody {
  messages: unknown[];
  config?: ChatConfig;
}

// ============================================================================
// Provider Configuration
// ============================================================================

const PROVIDER_BASE_URLS: Partial<Record<AIProvider, string>> = {
  [AIProvider.Grok]: "https://api.x.ai/v1",
  [AIProvider.Ollama]: "http://localhost:11434/v1",
  // OpenAI uses default SDK URL
};

const PROVIDER_ENV_VARS: Partial<Record<AIProvider, string>> = {
  [AIProvider.OpenAI]: "OPENAI_API_KEY",
  [AIProvider.Grok]: "XAI_API_KEY",
  // Ollama doesn't need an env var
};

// ============================================================================
// Helpers
// ============================================================================

/**
 * Extract text content from messages.
 * Handles both UIMessage (parts-based) and simple (content-based) formats.
 */
function normalizeMessages(messages: unknown[]): SimpleMessage[] {
  return messages.map((msg) => {
    const m = msg as Record<string, unknown>;
    let content = "";

    // Handle parts-based messages (UIMessage format from AI SDK)
    if (Array.isArray(m.parts)) {
      content = m.parts
        .filter(
          (p): p is { type: "text"; text: string } =>
            typeof p === "object" &&
            p !== null &&
            (p as Record<string, unknown>).type === "text",
        )
        .map((p) => p.text)
        .join("");
    }
    // Handle simple content-based messages
    else if (typeof m.content === "string") {
      content = m.content;
    }

    return {
      role: m.role as MessageRole,
      content,
    };
  });
}

/**
 * Get the API key for a provider from config or environment.
 */
function getApiKey(
  provider: AIProvider,
  config?: ChatConfig,
): string | undefined {
  // User-provided key takes priority
  if (config?.apiKey) {
    return config.apiKey;
  }

  // Ollama doesn't need a real API key
  if (provider === AIProvider.Ollama) {
    return "ollama";
  }

  // Check environment variable
  const envVar = PROVIDER_ENV_VARS[provider];
  return envVar ? process.env[envVar] : undefined;
}

/**
 * Create a JSON error response.
 */
function errorResponse(message: string, status: number): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

// ============================================================================
// Route Handler
// ============================================================================

export async function POST(request: Request): Promise<Response> {
  try {
    const body: ChatRequestBody = await request.json();
    const { messages, config } = body;

    // Resolve provider and model
    const provider = config?.provider ?? AIProvider.OpenAI;
    const model = config?.model ?? DEFAULT_MODELS[provider];

    // Debug logging (remove in production)
    console.log("[Chat API] Provider:", provider, "Model:", model);
    console.log("[Chat API] Messages:", JSON.stringify(messages, null, 2));

    // Get API key
    const apiKey = getApiKey(provider, config);
    if (!apiKey) {
      const envVar = PROVIDER_ENV_VARS[provider] ?? "API_KEY";
      return errorResponse(
        `API key required. Set ${envVar} environment variable or provide in config.`,
        400,
      );
    }

    // Create AI provider instance
    const ai = createOpenAI({
      apiKey,
      baseURL: PROVIDER_BASE_URLS[provider],
    });

    // Normalize messages based on provider requirements
    const modelMessages =
      provider === AIProvider.Ollama
        ? normalizeMessages(messages)
        : await convertToModelMessages(messages as UIMessage[]);

    // Stream the response
    const result = streamText({
      model: ai(model),
      messages: modelMessages,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("[Chat API] Error:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return errorResponse(message, 500);
  }
}
