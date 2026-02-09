"use client";

import { useState, useCallback, useRef } from "react";
import { Heartbeat } from "@/components/heartbeat";
import { SplitPane } from "@/components/split-pane";
import { SunderInput } from "@/components/sunder-input";
import { SunderOutput } from "@/components/sunder-output";
import { useSunder } from "@/hooks/use-sunder";

import { ThemeToggle } from "@/components/theme-toggle";
import { VaultTable } from "@/components/vault-table";
import { PanicButton } from "@/components/panic-button";
import { AutoRevealToggle } from "@/components/auto-reveal-toggle";
import { RuleConfig } from "@/components/rule-config";
import { CustomRules } from "@/components/custom-rules";
import { AnalyticsCard } from "@/components/analytics-card";
import { RiskBreakdown } from "@/components/risk-breakdown";

const DEBOUNCE_MS = 150;

export default function Home() {
  const [input, setInput] = useState("");
  const [processedText, setProcessedText] = useState("");
  const [autoReveal, setAutoReveal] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const {
    health,
    map,
    rules,
    config,
    analytics,
    protect,
    reveal,
    clear,
    configure,
    addRule,
    removeRule,
    refreshMap,
  } = useSunder();

  const handleInputChange = useCallback(
    (newInput: string) => {
      setInput(newInput);

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        const protected_ = protect(newInput);
        setProcessedText(protected_);
        refreshMap();
      }, DEBOUNCE_MS);
    },
    [protect, refreshMap],
  );

  const finalText = autoReveal ? reveal(processedText) : processedText;

  return (
    <main className="min-h-screen bg-zinc-50 p-12 dark:bg-black ">
      <div className="max-w-5xl mx-auto space-y-8 ">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              SUNDER <span className="text-blue-600">AI</span>
            </h1>
            <p className="text-slate-500">Local-First Privacy Shield v0.1.0</p>
          </div>
          <div className="flex items-center gap-4">
            <AutoRevealToggle enabled={autoReveal} onToggle={setAutoReveal} />
            <PanicButton
              onPanic={() => {
                clear();
                setInput("");
                setProcessedText("");
              }}
            />
            <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800" />
            <Heartbeat status={health} />
            <ThemeToggle />
          </div>
        </header>

        <section>
          <SplitPane
            left={
              <SunderInput
                value={input}
                onChange={handleInputChange}
                placeholder="Paste sensitive data here (emails, credit cards)..."
              />
            }
            right={<SunderOutput value={finalText} />}
          />
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Leak Analytics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnalyticsCard analytics={analytics} />
            <RiskBreakdown analytics={analytics} />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Rule Engine
          </h2>
          <RuleConfig config={config} onConfigChange={configure} />
          <CustomRules
            rules={rules}
            onAddRule={addRule}
            onRemoveRule={removeRule}
          />
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Identity Vault{" "}
              <span className="text-zinc-400 font-normal ml-2 text-sm">
                (Local Memory Only)
              </span>
            </h2>
            <div className="text-xs text-zinc-500 font-mono">
              {map.size} Active Identities
            </div>
          </div>
          <VaultTable map={map} />
        </section>
      </div>
    </main>
  );
}
