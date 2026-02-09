"use client";

import { useState } from "react";
import { Heartbeat } from "@/components/Heartbeat";
import { SplitPane } from "@/components/SplitPane";
import { SunderInput } from "@/components/SunderInput";
import { SunderOutput } from "@/components/SunderOutput";
import { useSunder } from "@/hooks/useSunder";

import { ThemeToggle } from "@/components/ThemeToggle";

export default function Home() {
  const [input, setInput] = useState("");
  const { engine, health } = useSunder();

  const sanitizedText = engine ? engine.protect(input) : input;

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
            <Heartbeat status={health} />
            <ThemeToggle />
          </div>
        </header>
      </div>

      <SplitPane
        left={<SunderInput value={input} onChange={setInput} />}
        right={<SunderOutput value={sanitizedText} />}
      />
    </main>
  );
}
