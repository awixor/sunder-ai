"use client";

import { useState } from "react";
import { SplitPane } from "@/components/SplitPane";
import { SunderInput } from "@/components/SunderInput";
import { SunderOutput } from "@/components/SunderOutput";
import { useSunder } from "@/hooks/useSunder";

export default function Home() {
  const [input, setInput] = useState("");
  const { engine } = useSunder();

  const sanitizedText = engine ? engine.protect(input) : input;

  return (
    <main className="min-h-screen bg-zinc-50 p-12 bg-white dark:bg-black ">
      <div className="max-w-5xl mx-auto space-y-8 ">
        <header>
          <h1 className="text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            SUNDER <span className="text-blue-600">AI</span>
          </h1>
          <p className="text-slate-500">Local-First Privacy Shield v0.1.0</p>
        </header>
      </div>

      <SplitPane
        left={<SunderInput value={input} onChange={setInput} />}
        right={<SunderOutput value={sanitizedText} />}
      />
    </main>
  );
}
