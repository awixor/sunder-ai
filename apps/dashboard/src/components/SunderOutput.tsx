import React from "react";

interface SunderOutputProps {
  value: string;
}

export function SunderOutput({ value }: SunderOutputProps) {
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-bold mb-4 text-zinc-900 dark:text-zinc-100">
        Sunder-ed
      </h2>
      <div className="flex-1 w-full p-4 bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-auto font-mono text-sm leading-relaxed whitespace-pre-wrap">
        {value || (
          <span className="text-zinc-400 italic">
            Output will appear here...
          </span>
        )}
      </div>
    </div>
  );
}
