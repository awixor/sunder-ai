"use client";

import { memo, useMemo } from "react";
import { PieChart } from "lucide-react";

interface Analytics {
  total: number;
  email: number;
  phone: number;
  ip_addr: number;
  path: number;
  secret: number;
  custom: number;
}

interface RiskBreakdownProps {
  analytics: Analytics;
}

interface SliceData {
  label: string;
  value: number;
  color: string;
  percentage: number;
}

export const RiskBreakdown = memo(function RiskBreakdown({
  analytics,
}: RiskBreakdownProps) {
  const slices = useMemo((): SliceData[] => {
    const total = analytics.total || 1; // Prevent division by zero
    const data = [
      { label: "Emails", value: analytics.email, color: "#3b82f6" },
      { label: "Phones", value: analytics.phone, color: "#8b5cf6" },
      { label: "IPs", value: analytics.ip_addr, color: "#f97316" },
      { label: "Paths", value: analytics.path, color: "#06b6d4" },
      { label: "Secrets", value: analytics.secret, color: "#ef4444" },
      { label: "Custom", value: analytics.custom, color: "#22c55e" },
    ];

    return data
      .filter((d) => d.value > 0)
      .map((d) => ({
        ...d,
        percentage: Math.round((d.value / total) * 100),
      }));
  }, [analytics]);

  const gradientStops = useMemo(() => {
    if (slices.length === 0) return "conic-gradient(#e4e4e7 0deg 360deg)";

    let currentAngle = 0;
    const stops: string[] = [];

    slices.forEach((slice) => {
      const angle = (slice.percentage / 100) * 360;
      stops.push(
        `${slice.color} ${currentAngle}deg ${currentAngle + angle}deg`,
      );
      currentAngle += angle;
    });

    return `conic-gradient(${stops.join(", ")})`;
  }, [slices]);

  if (analytics.total === 0) {
    return (
      <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/50 p-6">
        <div className="flex items-center gap-2 mb-4">
          <PieChart className="w-4 h-4 text-zinc-500" />
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
            Risk Breakdown
          </h3>
        </div>
        <div className="text-center py-8 text-zinc-500 text-sm">
          No data to display yet. Start protecting sensitive information.
        </div>
      </div>
    );
  }

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/50 p-6">
      <div className="flex items-center gap-2 mb-4">
        <PieChart className="w-4 h-4 text-zinc-500" />
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
          Risk Breakdown
        </h3>
      </div>

      <div className="flex items-center gap-6">
        {/* Donut Chart */}
        <div
          className="w-32 h-32 rounded-full shrink-0 relative"
          style={{ background: gradientStops }}
        >
          <div className="absolute inset-4 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center">
            <span className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              {analytics.total}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-2">
          {slices.map((slice) => (
            <div key={slice.label} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: slice.color }}
              />
              <span className="text-sm text-zinc-600 dark:text-zinc-400 flex-1">
                {slice.label}
              </span>
              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 tabular-nums">
                {slice.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});
