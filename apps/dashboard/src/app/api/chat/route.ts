import { createOpenAI } from "@ai-sdk/openai";
import { streamText, convertToModelMessages } from "ai";

export async function POST(request: Request) {
  try {
    const { messages, config } = await request.json();

    // Use env var or user-provided key
    const apiKey = config?.apiKey || process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error:
            "API key is required. Set OPENAI_API_KEY env var or provide in config.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const model = config?.model || "gpt-4o-mini";

    // Create OpenAI provider with custom API key
    const openai = createOpenAI({
      apiKey,
    });

    // Convert UI messages to model messages
    const modelMessages = await convertToModelMessages(messages);

    const result = streamText({
      model: openai(model),
      messages: modelMessages,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Internal server error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
