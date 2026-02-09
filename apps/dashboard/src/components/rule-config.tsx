"use client";

import { memo, useCallback } from "react";
import { User, Phone, Key } from "lucide-react";
import type { VaultConfig, ConfigKey } from "@/types";

interface RuleConfigProps {
  config: VaultConfig;
  onConfigChange: (key: ConfigKey, value: boolean) => void;
}

const CONFIG_ITEMS: {
  key: ConfigKey;
  label: string;
  desc: string;
  icon: typeof User;
}[] = [
  { key: "identity", label: "Identity", desc: "Names, SSNs, IDs", icon: User },
  {
    key: "contact",
    label: "Contact",
    desc: "Emails, Phones, Addresses",
    icon: Phone,
  },
  {
    key: "technical",
    label: "Technical",
    desc: "API Keys, IPs, SSH",
    icon: Key,
  },
];

interface ToggleCardProps {
  item: (typeof CONFIG_ITEMS)[number];
  checked: boolean;
  onChange: (key: ConfigKey, value: boolean) => void;
}

const ToggleCard = memo(function ToggleCard({
  item,
  checked,
  onChange,
}: ToggleCardProps) {
  const Icon = item.icon;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(item.key, e.target.checked);
    },
    [item.key, onChange],
  );

  return (
    <label className="flex items-center gap-3 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-all group">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={handleChange}
      />
      <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center peer-checked:bg-blue-500 peer-checked:dark:bg-blue-600 transition-colors">
        <Icon className="w-5 h-5 text-zinc-500 peer-checked:text-white group-has-checked:text-white transition-colors" />
      </div>
      <div className="flex-1">
        <div className="font-medium text-sm text-zinc-900 dark:text-zinc-100">
          {item.label}
        </div>
        <div className="text-xs text-zinc-500">{item.desc}</div>
      </div>
      <div
        className={`w-2 h-2 rounded-full ${checked ? "bg-green-500" : "bg-zinc-300 dark:bg-zinc-600"}`}
      />
    </label>
  );
});

export const RuleConfig = memo(function RuleConfig({
  config,
  onConfigChange,
}: RuleConfigProps) {
  return (
    <div className="space-y-3 border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl bg-white dark:bg-zinc-900/50">
      <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
        PII Categories
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {CONFIG_ITEMS.map((item) => (
          <ToggleCard
            key={item.key}
            item={item}
            checked={config[item.key]}
            onChange={onConfigChange}
          />
        ))}
      </div>
    </div>
  );
});
