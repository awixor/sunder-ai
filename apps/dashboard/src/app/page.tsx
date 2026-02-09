"use client";

import { useState, useCallback, useRef } from "react";
import { SplitPane } from "@/components/split-pane";
import { SunderInput } from "@/components/sunder-input";
import { SunderOutput } from "@/components/sunder-output";
import { AutoRevealToggle } from "@/components/auto-reveal-toggle";
import { PanicButton } from "@/components/panic-button";
import { useSunder } from "@/context/sunder-context";

const DEBOUNCE_MS = 150;

export default function ShieldPage() {
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Privacy Shield
          </h2>
          <p className="text-zinc-500 text-sm mt-1">
            Paste sensitive data to redact before sharing with AI
          </p>
        </div>
        <div className="flex items-center gap-3">
          <AutoRevealToggle enabled={autoReveal} onToggle={setAutoReveal} />
          <PanicButton onPanic={handlePanic} />
        </div>
      </div>

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
  );
}
