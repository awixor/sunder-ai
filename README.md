# Sunder AI Monorepo

Sunder AI is a privacy-first, local-first AI dashboard and toolset designed to give users control over their data while interacting with large language models. The project utilizes a modern monorepo architecture to share core logic and UI components across different platforms.

## 🚀 Key Features

- **Privacy-First Architecture**: Built-in data protection layer that redacts sensitive information before it touches any AI provider.
- **Local AI Integration**: First-class support for **Ollama** and other local-first models, ensuring your data never leaves your machine.
- **Persistent History**: Full chat history and session management using **IndexedDB** for local-only, perpetual storage.
- **Hybrid Core**: High-performance "SunderVault" logic implemented in **Rust** and compiled to **WebAssembly** for use in web and extensions.
- **Aesthetic UI**: Premium user experience featuring:
  - Glassmorphism and dark mode support.
  - Fluid animations powered by **Framer Motion**.
  - Responsive sidebar with session management.
  - **Generic Confirmation Systems**: Animated, themed inline confirmation components.
- **Multi-Platform Ready**: Architected to support both a web dashboard and a browser extension.

## 📊 Development Progress

| Feature / Component          | Status |  Platform   | Notes                                                 |
| :--------------------------- | :----: | :---------: | :---------------------------------------------------- |
| **Monorepo Orchestration**   |   ✅   |   System    | Turborepo + pnpm setup                                |
| **Local AI (Ollama)**        |   ✅   |  Dashboard  | Full streaming & config support                       |
| **Privacy Redaction Engine** |   🏗️   | Core (WASM) | Ongoing: Local patterns (Names redaction in progress) |
| **IndexedDB Chat History**   |   ✅   |  Dashboard  | Persistent local-first storage                        |
| **Clear All History**        |   ✅   |  Dashboard  | Safe destructive action flow                          |
| **Browser Extension**        |   🏗️   |  Extension  | Basic Vite boilerplate ready                          |
| **Vault Audit Logs**         |   📋   |  Dashboard  | Roadmap: Transparency for redactions                  |
| **Multi-modal Support**      |   📋   |  Dashboard  | Roadmap: Ollama multimodal support                    |
| **Mobile Responsiveness**    |   🏗️   |  Dashboard  | Ongoing: Layout optimizations                         |

## 🏗 Project Structure

This project is a monorepo managed by **pnpm workspaces** and **Turborepo**.

### Apps

- **`apps/dashboard`**: The primary Next.js web application. It features a modern chat interface, model configuration, and session management.
- **`apps/extension`**: A Vite-based browser extension (Chrome/Firefox) that brings Sunder's privacy layer to the broader web.

### Packages

- **`packages/sunder-core`**: The project's brain. Contains Rust logic for data masking and vault management, compiled to WASM.
- - **`packages/sunder-ui`**: A shared library of React components and Tailwind configurations used across the dashboard and extension.

## 🛠 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (React 19)
- **Orchestration**: [Turborepo](https://turbo.build/repo)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **AI Core**: [Vercel AI SDK](https://sdk.vercel.ai/)
- **Language**: [Rust](https://www.rust-lang.org/) (via `wasm-pack`)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚦 Getting Started

### Prerequisites

- [pnpm](https://pnpm.io/) installed.
- [Rust](https://www.rust-lang.org/tools/install) and `wasm-pack` (if modifying core logic).
- [Ollama](https://ollama.com/) (for local AI features).

### Installation

```bash
pnpm install
```

### Development

Start the dashboard and extension development servers:

```bash
# Run everything
pnpm dev

# Run only the dashboard
pnpm --filter dashboard dev

# Run only the extension
pnpm --filter @sunder/extension dev
```

### Building

Build all applications and packages:

```bash
pnpm build
```

## 🦙 Running Ollama Locally

Sunder AI uses [Ollama](https://ollama.com/) as its default local AI provider. Follow these steps to get it running:

### 1. Install Ollama

```bash
# macOS (Homebrew)
brew install ollama

# Or download from https://ollama.com/download
```

### 2. Start the Ollama server

```bash
ollama serve
```

By default, Ollama runs on `http://localhost:11434`.

### 3. Pull a model

```bash
# Recommended for general use
ollama pull llama3.2

# Lightweight alternative
ollama pull gemma3:4b
```

### 4. Configure CORS (required for browser access)

The dashboard connects to Ollama from the browser, so CORS must be enabled:

```bash
# macOS / Linux
OLLAMA_ORIGINS="*" ollama serve
```

Or set it permanently via environment variable:

```bash
# Add to ~/.zshrc or ~/.bashrc
export OLLAMA_ORIGINS="*"
```

### 5. Verify

Open the Sunder dashboard (`pnpm dev`), navigate to the chat page, and select your model. Messages will be processed locally.

## 🧩 Testing the Browser Extension

### Development Mode

```bash
pnpm --filter @sunder/extension dev
```

This starts the Plasmo dev server with hot reload.

### Loading in Chrome

1. Open `chrome://extensions`
2. Enable **Developer mode** (top-right toggle)
3. Click **Load unpacked**
4. Select `apps/extension/build/chrome-mv3-dev` (for dev) or `apps/extension/build/chrome-mv3-prod` (for production build)

### Testing the Overlay

1. Navigate to a supported AI chat site (ChatGPT, Claude, Gemini, Perplexity, DeepSeek, or Copilot)
2. The Sunder **shield button** appears in the bottom-right corner
3. Click the shield to **enable protection** (turns green)
4. Type sensitive data (e.g., `My email is test@example.com`) — it gets replaced with tokens like `[EMAIL_1]`
5. Send the message — the AI responds using the token
6. Click the **eye button** (appears above the shield) to **reveal** original values in the chat
7. Click again to **hide** them back to tokens

### Production Build

```bash
pnpm --filter @sunder/extension build
```

The production build strips hot reload and debug tools. Load from `apps/extension/build/chrome-mv3-prod`.

## 🔐 Privacy Model

Sunder AI operates on a **Zero-Trust** principle toward external AI providers.

1.  **Intercept**: User input is intercepted by the `sunder-core` logic.
2.  **Protect**: Sensitive patterns (PII, secrets) are redacted or tokenized locally.
3.  **Transmit**: Only safe, redacted content is sent to the AI API.
4.  **Reveal**: The UI allows you to toggle the visibility of the original content locally, without ever re-sending it.
