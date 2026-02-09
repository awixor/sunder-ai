"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { SunderVault } from "@sunder/core";

type SunderHealth = "loading" | "active" | "error";
type ConfigKey = "identity" | "contact" | "technical";

interface VaultConfig {
  identity: boolean;
  contact: boolean;
  technical: boolean;
}

interface CustomRule {
  pattern: string;
  replacement: string;
}

interface SunderState {
  engine: SunderVault | null;
  health: SunderHealth;
  map: Map<string, string>;
  rules: CustomRule[];
  config: VaultConfig;
}

const DEFAULT_CONFIG: VaultConfig = {
  identity: true,
  contact: true,
  technical: true,
};

export function useSunder() {
  const [state, setState] = useState<SunderState>({
    engine: null,
    health: "loading",
    map: new Map(),
    rules: [],
    config: DEFAULT_CONFIG,
  });

  const syncState = useCallback((vault: SunderVault) => {
    try {
      const rawMap = vault.get_identity_map();
      const newMap = new Map<string, string>();

      rawMap.forEach((value: string, key: string) => {
        newMap.set(key, value);
      });

      const rawRules = vault.get_rules();

      setState((prev) => ({
        ...prev,
        map: newMap,
        rules: rawRules || [],
      }));
    } catch (e) {
      console.error("Failed to sync state:", e);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    async function initSunder() {
      try {
        const wasm = await import("@sunder/core/pkg/sunder_core");
        await wasm.default();
        const vault = new wasm.SunderVault();

        if (mounted) {
          setState((prev) => ({
            ...prev,
            engine: vault,
            health: "active",
          }));
          syncState(vault);
        }
      } catch (err) {
        console.error("Sunder Engine failed to ignite:", err);
        if (mounted) {
          setState((prev) => ({ ...prev, health: "error" }));
        }
      }
    }

    initSunder();
    return () => {
      mounted = false;
    };
  }, [syncState]);

  const protect = useCallback(
    (input: string) => {
      if (!state.engine) return input;
      const result = state.engine.protect(input);
      syncState(state.engine);
      return result;
    },
    [state.engine, syncState],
  );

  const reveal = useCallback(
    (input: string) => {
      if (!state.engine) return input;
      return state.engine.reveal(input);
    },
    [state.engine],
  );

  const clear = useCallback(() => {
    if (!state.engine) return;
    state.engine.clear_vault();
    syncState(state.engine);
  }, [state.engine, syncState]);

  const configure = useCallback(
    (key: ConfigKey, value: boolean) => {
      if (!state.engine) return;
      const newConfig = { ...state.config, [key]: value };
      setState((prev) => ({ ...prev, config: newConfig }));
      state.engine.configure(
        newConfig.identity,
        newConfig.contact,
        newConfig.technical,
      );
    },
    [state.engine, state.config],
  );

  const addRule = useCallback(
    (pattern: string, category: string = "SECRET") => {
      if (!state.engine) return;
      const categoryRules = state.rules.filter((r) =>
        r.replacement.startsWith(`[${category}_`),
      );
      const ruleIndex = categoryRules.length + 1;
      const replacement = `[${category}_${ruleIndex}]`;
      state.engine.add_rule(pattern, replacement);
      syncState(state.engine);
    },
    [state.engine, state.rules, syncState],
  );

  const removeRule = useCallback(
    (pattern: string) => {
      if (!state.engine) return;
      state.engine.remove_rule(pattern);
      syncState(state.engine);
    },
    [state.engine, syncState],
  );

  // Memoize return object to prevent unnecessary re-renders
  return useMemo(
    () => ({
      engine: state.engine,
      health: state.health,
      map: state.map,
      rules: state.rules,
      config: state.config,
      protect,
      reveal,
      clear,
      configure,
      addRule,
      removeRule,
    }),
    [state, protect, reveal, clear, configure, addRule, removeRule],
  );
}
