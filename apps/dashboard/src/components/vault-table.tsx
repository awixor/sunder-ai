"use client";

interface VaultTableProps {
  map: Map<string, string>;
}

export function VaultTable({ map }: VaultTableProps) {
  const entries = Array.from(map.entries());

  if (entries.length === 0) {
    return (
      <div className="text-center p-8 text-zinc-500 dark:text-zinc-400 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg">
        Vault is empty. No active identities.
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden border border-zinc-200 dark:border-zinc-800 rounded-lg">
      <table className="w-full text-sm text-left">
        <thead className="bg-zinc-50 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 font-medium border-b border-zinc-200 dark:border-zinc-800">
          <tr>
            <th className="px-4 py-3">Token (Public)</th>
            <th className="px-4 py-3">Real Identity (Private)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-black">
          {entries.map(([token, value]) => (
            <tr
              key={token}
              className="group hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
            >
              <td className="px-4 py-3 font-mono text-blue-600 dark:text-blue-400">
                {token}
              </td>
              <td className="px-4 py-3 font-mono text-zinc-700 dark:text-zinc-300">
                {value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
