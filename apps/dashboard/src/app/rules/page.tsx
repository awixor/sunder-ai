"use client";

import { RuleConfig } from "@/components/rule-config";
import { CustomRules } from "@/components/custom-rules";
import { useSunder } from "@/context/sunder-context";

export default function RulesPage() {
  const { rules, config, configure, addRule, removeRule } = useSunder();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Rule Engine
        </h2>
        <p className="text-zinc-500 text-sm mt-1">
          Configure what data types to protect and add custom rules
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          PII Detection
        </h3>
        <RuleConfig config={config} onConfigChange={configure} />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Custom Rules
        </h3>
        <CustomRules
          rules={rules}
          onAddRule={addRule}
          onRemoveRule={removeRule}
        />
      </div>
    </div>
  );
}
