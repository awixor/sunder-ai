"use client";

import { VaultTable } from "@/components/vault-table";
import { PanicButton } from "@/components/panic-button";
import { useSunder } from "@/context/sunder-context";

export default function VaultPage() {
  const { map, clear } = useSunder();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Identity Vault
          </h2>
          <p className="text-zinc-500 text-sm mt-1">
            Local memory only — tokens are never persisted
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-zinc-500 font-mono">
            {map.size} Active Identities
          </div>
          <PanicButton onPanic={clear} />
        </div>
      </div>

      <VaultTable map={map} />
    </div>
  );
}
