"use client";

import { useState, useCallback, useRef } from "react";
import { SplitPane } from "@/components/split-pane";
import { SunderInput } from "@/components/sunder-input";
import { SunderOutput } from "@/components/sunder-output";
import { AutoRevealToggle } from "@/components/auto-reveal-toggle";
import { PanicButton } from "@/components/panic-button";
import { useSunder } from "@/context/sunder-context";

const DEBOUNCE_MS = 150;

export function ShieldExample() {
  const [input, setInput] = useState("");
  const [processedText, setProcessedText] = useState("");
  const [autoReveal, setAutoReveal] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { protect, reveal, clear, refreshMap } = useSunder();

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

  const handlePanic = useCallback(() => {
    clear();
    setInput("");
    setProcessedText("");
  }, [clear]);

  const finalText = autoReveal ? reveal(processedText) : processedText;

  return (
    <div className="space-y-4 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 bg-white dark:bg-zinc-950 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Interactive Demo
          </h3>
          <p className="text-zinc-500 text-sm">Try it yourself locally</p>
        </div>
        <div className="flex items-center gap-3">
          <AutoRevealToggle enabled={autoReveal} onToggle={setAutoReveal} />
          <PanicButton onPanic={handlePanic} />
        </div>
      </div>

      <div className="h-100">
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
      </div>
    </div>
  );
}
