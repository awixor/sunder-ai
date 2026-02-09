"use client";
import { useState, useEffect } from "react";
import { SunderVault } from "@sunder/core";

export type SunderHealth = "loading" | "active" | "error";

export function useSunder() {
  const [engine, setEngine] = useState<SunderVault | null>(null);
  const [health, setHealth] = useState<SunderHealth>("loading");

  useEffect(() => {
    async function initSunder() {
      try {
        const wasm = await import("@sunder/core/pkg/sunder_core");
        await wasm.default();
        setEngine(new wasm.SunderVault());
        setHealth("active");
      } catch (err) {
        console.error("Sunder Engine failed to ignite:", err);
        setHealth("error");
      }
    }
    initSunder();
  }, []);

  return { engine, health };
}
