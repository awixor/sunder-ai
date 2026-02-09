"use client";

import { AnalyticsCard } from "@/components/analytics-card";
import { RiskBreakdown } from "@/components/risk-breakdown";
import { useSunder } from "@/context/sunder-context";

export default function AnalyticsPage() {
  const { analytics } = useSunder();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Leak Analytics
        </h2>
        <p className="text-zinc-500 text-sm mt-1">
          Track what sensitive data has been protected
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnalyticsCard analytics={analytics} />
        <RiskBreakdown analytics={analytics} />
      </div>
    </div>
  );
}
