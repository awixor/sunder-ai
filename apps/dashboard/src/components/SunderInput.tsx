import React from "react";

interface SunderInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function SunderInput({ value, onChange }: SunderInputProps) {
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-bold mb-4 text-zinc-900 dark:text-zinc-100">
        Input
      </h2>
      <textarea
        className="flex-1 w-full p-4 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono text-sm leading-relaxed"
        placeholder="Paste sensitive text here..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
      />
    </div>
  );
}
