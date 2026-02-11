import { ShieldExample } from "@/components/marketing/shield-example";

export default function DocsPage() {
  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen py-24 transition-colors duration-300">
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-8">
          Documentation
        </h1>

        <div className="space-y-12">
          {/* Getting Started */}
          {/* <section>
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
              Getting Started
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Sunder AI is a local-first privacy firewall that scrubs PII from
              AI prompts before they ever leave your browser. It allows you to
              use powerful AI models without compromising your sensitive data.
            </p>
          </section> */}

          {/* Installation */}
          {/* <section>
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
              Installation
            </h2>
            <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg font-mono text-sm text-slate-800 dark:text-slate-200">
              npm install @sunder-ai/core
            </div>
            <p className="text-slate-600 dark:text-slate-400 mt-4 leading-relaxed">
              Currently, Sunder AI is available as a library for integration
              into your own applications, or as a standalone dashboard.
            </p>
          </section> */}

          {/* Usage */}
          <section>
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
              Usage
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              To use Sunder in your application, initialize the Sunder engine
              and pass your text through the `protect` method.
            </p>

            <div className="my-8">
              <ShieldExample />
            </div>

            <pre className="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg font-mono text-sm text-slate-800 dark:text-slate-200 overflow-x-auto">
              {`import { Sunder } from '@sunder-ai/core';

const sunder = new Sunder();
const protectedText = sunder.protect("My email is john@example.com");

console.log(protectedText); 
// Output: "My email is [EMAIL_1]"`}
            </pre>
          </section>

          {/* Running Ollama Locally */}
          <section>
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
              🦙 Running Ollama Locally
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
              Sunder AI uses Ollama as its default local AI provider. Your data
              never leaves your machine.
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-slate-700 dark:text-slate-200 mb-2">
                  1. Install Ollama
                </h3>
                <pre className="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg font-mono text-sm text-slate-800 dark:text-slate-200 overflow-x-auto">
                  {`# macOS (Homebrew)
brew install ollama

# Or download from https://ollama.com/download`}
                </pre>
              </div>

              <div>
                <h3 className="text-lg font-medium text-slate-700 dark:text-slate-200 mb-2">
                  2. Start the server
                </h3>
                <pre className="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg font-mono text-sm text-slate-800 dark:text-slate-200 overflow-x-auto">
                  {`ollama serve`}
                </pre>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
                  Runs on{" "}
                  <code className="bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-xs">
                    http://localhost:11434
                  </code>{" "}
                  by default.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-slate-700 dark:text-slate-200 mb-2">
                  3. Pull a model
                </h3>
                <pre className="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg font-mono text-sm text-slate-800 dark:text-slate-200 overflow-x-auto">
                  {`# Recommended for general use
ollama pull llama3.2

# Lightweight alternative
ollama pull gemma3:4b`}
                </pre>
              </div>

              <div>
                <h3 className="text-lg font-medium text-slate-700 dark:text-slate-200 mb-2">
                  4. Enable CORS
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                  The dashboard connects to Ollama from the browser, so CORS
                  must be enabled:
                </p>
                <pre className="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg font-mono text-sm text-slate-800 dark:text-slate-200 overflow-x-auto">
                  {`# Start with CORS enabled
OLLAMA_ORIGINS="*" ollama serve

# Or set permanently in ~/.zshrc
export OLLAMA_ORIGINS="*"`}
                </pre>
              </div>
            </div>
          </section>

          {/* Browser Extension */}
          <section>
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
              🧩 Browser Extension
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
              The Sunder extension brings privacy protection directly into AI
              chat websites like ChatGPT, Claude, Gemini, Perplexity, DeepSeek,
              and Copilot.
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-slate-700 dark:text-slate-200 mb-2">
                  Loading in Chrome
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-slate-600 dark:text-slate-400">
                  <li>
                    Open{" "}
                    <code className="bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-xs">
                      chrome://extensions
                    </code>
                  </li>
                  <li>
                    Enable <strong>Developer mode</strong> (top-right toggle)
                  </li>
                  <li>
                    Click <strong>Load unpacked</strong>
                  </li>
                  <li>
                    Select the{" "}
                    <code className="bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-xs">
                      apps/extension/build/chrome-mv3-prod
                    </code>{" "}
                    directory
                  </li>
                </ol>
              </div>

              <div>
                <h3 className="text-lg font-medium text-slate-700 dark:text-slate-200 mb-2">
                  How It Works
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-slate-600 dark:text-slate-400">
                  <li>Navigate to a supported AI chat site</li>
                  <li>
                    Click the <strong>shield button</strong> (bottom-right) to
                    enable protection
                  </li>
                  <li>
                    Type sensitive data — it gets replaced with tokens like{" "}
                    <code className="bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-xs">
                      [EMAIL_1]
                    </code>
                  </li>
                  <li>Send your message — the AI responds using the tokens</li>
                  <li>
                    Click the <strong>eye button</strong> to reveal original
                    values in the chat
                  </li>
                </ol>
              </div>

              <div>
                <h3 className="text-lg font-medium text-slate-700 dark:text-slate-200 mb-2">
                  Supported Platforms
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    "ChatGPT",
                    "Claude",
                    "Gemini",
                    "Perplexity",
                    "DeepSeek",
                    "Copilot",
                  ].map((platform) => (
                    <span
                      key={platform}
                      className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-sm font-medium"
                    >
                      {platform}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
