import React from "react";

interface SplitPaneProps {
  left: React.ReactNode;
  right: React.ReactNode;
}

export function SplitPane({ left, right }: SplitPaneProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full w-full">
      <div className="h-full overflow-hidden">{left}</div>
      <div className="h-full overflow-hidden border-t md:border-t-0 md:border-l border-zinc-200 dark:border-zinc-800 pt-4 md:pt-0 md:pl-4">
        {right}
      </div>
    </div>
  );
}
