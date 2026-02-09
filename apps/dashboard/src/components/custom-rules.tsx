"use client";

import { useState, memo, useCallback } from "react";
import { Plus, Trash, Shield, Lock, ChevronDown } from "lucide-react";

export type TokenCategory = "PROJECT" | "PERSON" | "ORG" | "LOCATION";

export interface CustomRule {
  pattern: string;
  replacement: string;
}

interface CustomRulesProps {
  rules: CustomRule[];
  onAddRule: (pattern: string, category: TokenCategory) => void;
  onRemoveRule: (pattern: string) => void;
}

interface RuleItemProps {
  rule: CustomRule;
  onRemove: (pattern: string) => void;
}

const CATEGORY_OPTIONS: {
  value: TokenCategory;
  label: string;
  desc: string;
}[] = [
  { value: "PROJECT", label: "Project", desc: "Codenames, initiatives" },
  { value: "PERSON", label: "Person", desc: "Names, aliases" },
  { value: "ORG", label: "Organization", desc: "Company names" },
  { value: "LOCATION", label: "Location", desc: "Addresses, places" },
];

const RuleItem = memo(function RuleItem({ rule, onRemove }: RuleItemProps) {
  const handleRemove = useCallback(() => {
    onRemove(rule.pattern);
  }, [rule.pattern, onRemove]);

  const category = rule.replacement.match(/\[([A-Z_]+)_\d+\]/)?.[1] || "SECRET";
  const categoryInfo = CATEGORY_OPTIONS.find((c) => c.value === category);

  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 group">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-md bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
          <Lock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <div className="font-mono text-sm text-zinc-900 dark:text-zinc-100">
            {rule.pattern}
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <span className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400">
              {categoryInfo?.label || category}
            </span>
            <span>→ {rule.replacement}</span>
          </div>
        </div>
      </div>
      <button
        onClick={handleRemove}
        className="text-zinc-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
        aria-label="Remove rule"
      >
        <Trash className="w-4 h-4" />
      </button>
    </div>
  );
});

export const CustomRules = memo(function CustomRules({
  rules,
  onAddRule,
  onRemoveRule,
}: CustomRulesProps) {
  const [pattern, setPattern] = useState("");
  const [category, setCategory] = useState<TokenCategory>("PROJECT");

  const handleAdd = useCallback(() => {
    if (pattern.trim()) {
      onAddRule(pattern.trim(), category);
      setPattern("");
    }
  }, [pattern, category, onAddRule]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && pattern.trim()) {
        handleAdd();
      }
    },
    [pattern, handleAdd],
  );

  return (
    <div className="space-y-4 border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl bg-white dark:bg-zinc-900/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-zinc-500" />
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
            Project Codenames
          </h3>
        </div>
        {rules.length > 0 && (
          <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
            {rules.length} Active
          </span>
        )}
      </div>

      <div className="space-y-2">
        {rules.map((rule) => (
          <RuleItem key={rule.pattern} rule={rule} onRemove={onRemoveRule} />
        ))}
        {rules.length === 0 && (
          <div className="text-sm text-zinc-500 italic p-3 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg">
            No custom rules set. Add project names to protect.
          </div>
        )}
      </div>

      <div className="space-y-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <input
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter text to protect (e.g., Project Neptune)"
            className="flex-1 px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
          />
          <div className="relative">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as TokenCategory)}
              className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 appearance-none cursor-pointer"
            >
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label} — {opt.desc}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
          </div>
          <button
            onClick={handleAdd}
            disabled={!pattern.trim()}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Add Rule
          </button>
        </div>
      </div>
    </div>
  );
});
