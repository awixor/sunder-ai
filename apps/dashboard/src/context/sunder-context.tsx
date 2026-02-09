"use client";

import { createContext, useContext, ReactNode } from "react";
import { useSunderHook } from "@/hooks/use-sunder";

type SunderContextType = ReturnType<typeof useSunderHook>;

const SunderContext = createContext<SunderContextType | null>(null);

interface SunderProviderProps {
  children: ReactNode;
}

export function SunderProvider({ children }: SunderProviderProps) {
  const sunder = useSunderHook();

  return (
    <SunderContext.Provider value={sunder}>{children}</SunderContext.Provider>
  );
}

export function useSunder() {
  const context = useContext(SunderContext);

  if (!context) {
    throw new Error("useSunder must be used within a SunderProvider");
  }

  return context;
}
