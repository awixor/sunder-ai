"use client";
import { useState, useEffect } from "react";
import { SunderVault } from "@sunder/core";

export type SunderHealth = "loading" | "active" | "error";

export function useSunder() {
  const [engine, setEngine] = useState<SunderVault | null>(null);
  const [health, setHealth] = useState<SunderHealth>("loading");
  const [map, setMap] = useState<Map<string, string>>(new Map());

  const updateMap = (vault: SunderVault) => {
    try {
      const rawMap = vault.get_identity_map();
      // Convert JsValue (Map) to TypeScript Map
      // Note: This requires careful handling as wasm-bindgen returns a Map-like object
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const jsMap = rawMap as any;
      const newMap = new Map<string, string>();
      jsMap.forEach((value: string, key: string) => {
        newMap.set(key, value);
      });
      setMap(newMap);
    } catch (e) {
      console.error("Failed to update map:", e);
    }
  };

  useEffect(() => {
    async function initSunder() {
      try {
        const wasm = await import("@sunder/core/pkg/sunder_core");
        await wasm.default();
        const vault = new wasm.SunderVault();
        setEngine(vault);
        setHealth("active");
        updateMap(vault);
      } catch (err) {
        console.error("Sunder Engine failed to ignite:", err);
        setHealth("error");
      }
    }
    initSunder();
  }, []);

  const protect = (input: string) => {
    if (!engine) return input;
    const result = engine.protect(input);
    updateMap(engine);
    return result;
  };

  const reveal = (input: string) => {
    if (!engine) return input;
    return engine.reveal(input);
  };

  const clear = () => {
    if (!engine) return;
    engine.clear_vault();
    updateMap(engine);
  };

  return { engine, health, map, protect, reveal, clear };
}
