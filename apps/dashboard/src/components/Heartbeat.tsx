import React from "react";

interface HeartbeatProps {
  status: "loading" | "active" | "error";
}

export function Heartbeat({ status }: HeartbeatProps) {
  if (status === "loading") {
    return (
      <div className="flex items-center gap-2 text-yellow-500">
        <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
        <span className="text-xs font-mono">IGNITING ENGINE...</span>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex items-center gap-2 text-red-500">
        <div className="w-2 h-2 rounded-full bg-red-500" />
        <span className="text-xs font-mono">ENGINE FAILURE</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-emerald-500">
      <div className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </div>
      <span className="text-xs font-mono">WASM ENGINE ACTIVE</span>
    </div>
  );
}
