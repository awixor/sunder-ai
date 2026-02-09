"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, BarChart3, Settings, Database } from "lucide-react";

const navItems = [
  { href: "/", label: "Shield", icon: Shield },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/rules", label: "Rules", icon: Settings },
  { href: "/vault", label: "Vault", icon: Database },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-lg">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive
                ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            <Icon className="w-4 h-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
