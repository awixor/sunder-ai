import { AIProvider, DEFAULT_MODELS, type AIServiceConfig } from "@/types/ai";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select-native";

interface ModelConfigPanelProps {
  config: AIServiceConfig;
  onChange: (config: AIServiceConfig) => void;
}

const PROVIDER_LABELS: Record<AIProvider, string> = {
  // [AIProvider.OpenAI]: "OpenAI",
  // [AIProvider.Grok]: "Grok (xAI)",
  // [AIProvider.Anthropic]: "Anthropic",
  [AIProvider.Ollama]: "Ollama (Local)",
  // [AIProvider.Custom]: "Custom (OpenAI Compatible)",
};

export function ModelConfigPanel({ config, onChange }: ModelConfigPanelProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provider = e.target.value as AIProvider;
    onChange({
      ...config,
      provider,
      model: DEFAULT_MODELS[provider] || "",
    });
  };

  return (
    <div className="mb-4 p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="provider">Provider</Label>
        <Select id="provider" value={config.provider} onChange={handleChange}>
          {Object.values(AIProvider).map((provider) => (
            <option key={provider} value={provider}>
              {PROVIDER_LABELS[provider]}
            </option>
          ))}
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="model">Model</Label>
        <Input
          id="model"
          type="text"
          value={config.model || ""}
          onChange={(e) => onChange({ ...config, model: e.target.value })}
          placeholder={DEFAULT_MODELS[config.provider]}
        />
      </div>
    </div>
  );
}
