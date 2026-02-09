"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { SunderVault } from "@sunder/core";
import type {
  SunderHealth,
  VaultConfig,
  CustomRule,
  Analytics,
  ConfigKey,
} from "@/types";
import { DEFAULT_CONFIG, DEFAULT_ANALYTICS } from "@/types";

export function useSunderHook() {
  const [health, setHealth] = useState<SunderHealth>("loading");
  const [map, setMap] = useState<Map<string, string>>(new Map());
  const [rules, setRules] = useState<CustomRule[]>([]);
  const [config, setConfig] = useState<VaultConfig>(DEFAULT_CONFIG);
  const [analytics, setAnalytics] = useState<Analytics>(DEFAULT_ANALYTICS);
  const engineRef = useRef<SunderVault | null>(null);

  const syncState = useCallback(() => {
    const vault = engineRef.current;
    if (!vault) return;

    try {
      const rawMap = vault.get_identity_map();
      const newMap = new Map<string, string>();
      rawMap.forEach((value: string, key: string) => {
        newMap.set(key, value);
      });

      const rawRules = vault.get_rules();
      const rawAnalytics = vault.get_analytics();

      setMap(newMap);
      setRules(rawRules || []);
      setAnalytics(rawAnalytics || DEFAULT_ANALYTICS);
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
          engineRef.current = vault;
          setHealth("active");
          syncState();
        }
      } catch (err) {
        console.error("Sunder Engine failed to ignite:", err);
        if (mounted) {
          setHealth("error");
        }
      }
    }

    initSunder();
    return () => {
      mounted = false;
    };
  }, [syncState]);

  const protect = useCallback((input: string): string => {
    const vault = engineRef.current;
    if (!vault) {
      console.warn("[Sunder] protect called but vault not initialized");
      return input;
    }
    const result = vault.protect(input);
    console.log("[Sunder] protect:", {
      input,
      result,
      changed: input !== result,
    });
    return result;
  }, []);

  const refreshMap = useCallback(() => {
    syncState();
  }, [syncState]);

  const reveal = useCallback((input: string): string => {
    const vault = engineRef.current;
    if (!vault) return input;
    return vault.reveal(input);
  }, []);

  const clear = useCallback(() => {
    const vault = engineRef.current;
    if (!vault) return;
    vault.clear_vault();
    syncState();
  }, [syncState]);

  const configure = useCallback(
    (key: ConfigKey, value: boolean) => {
      const vault = engineRef.current;
      if (!vault) return;
      const newConfig = { ...config, [key]: value };
      setConfig(newConfig);
      vault.configure(
        newConfig.identity,
        newConfig.contact,
        newConfig.technical,
      );
    },
    [config],
  );

  const addRule = useCallback(
    (pattern: string, category: string = "SECRET") => {
      const vault = engineRef.current;
      if (!vault) return;
      const categoryRules = rules.filter((r) =>
        r.replacement.startsWith(`[${category}_`),
      );
      const ruleIndex = categoryRules.length + 1;
      const replacement = `[${category}_${ruleIndex}]`;
      vault.add_rule(pattern, replacement);
      syncState();
    },
    [rules, syncState],
  );

  const removeRule = useCallback(
    (pattern: string) => {
      const vault = engineRef.current;
      if (!vault) return;
      vault.remove_rule(pattern);
      syncState();
    },
    [syncState],
  );

  return useMemo(
    () => ({
      engine: engineRef.current,
      health,
      map,
      rules,
      config,
      analytics,
      protect,
      reveal,
      clear,
      configure,
      addRule,
      removeRule,
      refreshMap,
    }),
    [
      health,
      map,
      rules,
      config,
      analytics,
      protect,
      reveal,
      clear,
      configure,
      addRule,
      removeRule,
      refreshMap,
    ],
  );
}
