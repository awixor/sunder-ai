import { AIProvider, DEFAULT_MODELS, type AIServiceConfig } from "@/types/ai";

interface ModelConfigPanelProps {
  config: AIServiceConfig;
  onChange: (config: AIServiceConfig) => void;
}

export function ModelConfigPanel({ config, onChange }: ModelConfigPanelProps) {
  return (
    <div className="mb-4 p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 space-y-3">
      <div>
        <label className="block text-xs text-zinc-500 mb-1">Provider</label>
        <select
          value={config.provider}
          onChange={(e) => {
            const provider = e.target.value as AIProvider;
            onChange({
              ...config,
              provider,
              model: DEFAULT_MODELS[provider],
            });
          }}
          className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm"
        >
          <option value={AIProvider.OpenAI}>OpenAI</option>
          <option value={AIProvider.Grok}>Grok (xAI)</option>
          <option value={AIProvider.Ollama}>Ollama (Local - Free)</option>
        </select>
      </div>
      <div>
        <label className="block text-xs text-zinc-500 mb-1">Model</label>
        <input
          type="text"
          value={config.model || ""}
          onChange={(e) => onChange({ ...config, model: e.target.value })}
          placeholder={DEFAULT_MODELS[config.provider]}
          className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm"
        />
      </div>
      {config.provider !== AIProvider.Ollama && (
        <div>
          <label className="block text-xs text-zinc-500 mb-1">
            API Key (optional - uses server env if empty)
          </label>
          <input
            type="password"
            value={config.apiKey || ""}
            onChange={(e) => onChange({ ...config, apiKey: e.target.value })}
            placeholder={
              config.provider === AIProvider.Grok ? "xai-..." : "sk-..."
            }
            className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm"
          />
        </div>
      )}
    </div>
  );
}
