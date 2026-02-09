import { memo } from "react";
import { Shield, TrendingUp } from "lucide-react";
import type { Analytics } from "@/types";

interface AnalyticsCardProps {
  analytics: Analytics;
}

export const AnalyticsCard = memo(function AnalyticsCard({
  analytics,
}: AnalyticsCardProps) {
  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/50 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
              Disasters Averted
            </h3>
            <p className="text-xs text-zinc-500">
              Sensitive data protected this session
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
          <TrendingUp className="w-4 h-4" />
          <span className="text-xs font-medium">Active</span>
        </div>
      </div>

      <div className="text-center py-4">
        <div className="text-5xl font-black text-zinc-900 dark:text-zinc-100 tabular-nums">
          {analytics.total}
        </div>
        <div className="text-sm text-zinc-500 mt-1">Total Redactions</div>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
        <StatItem label="Emails" value={analytics.email} color="blue" />
        <StatItem label="Phones" value={analytics.phone} color="purple" />
        <StatItem label="IPs" value={analytics.ip_addr} color="orange" />
        <StatItem label="Paths" value={analytics.path} color="cyan" />
        <StatItem label="Secrets" value={analytics.secret} color="red" />
        <StatItem label="Custom" value={analytics.custom} color="green" />
      </div>
    </div>
  );
});

interface StatItemProps {
  label: string;
  value: number;
  color: "blue" | "purple" | "orange" | "cyan" | "red" | "green";
}

const colorMap = {
  blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
  purple:
    "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
  orange:
    "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
  cyan: "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400",
  red: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
  green: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
};

function StatItem({ label, value, color }: StatItemProps) {
  return (
    <div className={`p-2 rounded-lg text-center ${colorMap[color]}`}>
      <div className="text-lg font-bold tabular-nums">{value}</div>
      <div className="text-xs opacity-80">{label}</div>
    </div>
  );
}
