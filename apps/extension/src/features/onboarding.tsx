import { useSunderSettings } from "../hooks/use-sunder-settings"

export const Onboarding = () => {
  const { setSettings } = useSunderSettings()

  const handleGetStarted = () => {
    setSettings((prev) => ({ ...prev, isOnboarded: true }))
  }

  return (
    <div className="w-[350px] bg-slate-50 dark:bg-slate-900 overflow-hidden flex flex-col font-sans">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4 bg-white dark:bg-slate-950">
        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mb-2">
          <div className="w-8 h-8 rounded-full bg-emerald-500 shadow-lg animate-pulse" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Welcome to Sunder
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-[250px] mx-auto leading-relaxed">
            Your personal privacy shield for the AI age. Sanitize data locally
            before it leaves your browser.
          </p>
        </div>
      </div>

      {/* Features / Steps */}
      <div className="p-4 bg-slate-50 dark:bg-slate-900 space-y-4">
        <div className="space-y-3">
          <FeatureRow
            icon="🛡️"
            title="Local Processing"
            desc="Your data is sanitized via WASM"
          />
          <FeatureRow
            icon="🔒"
            title="PII Redaction"
            desc="Remove emails, phones, and more"
          />
        </div>

        <button
          onClick={handleGetStarted}
          className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-sm transition-all active:scale-[0.98] mt-2">
          Get Started
        </button>
      </div>
    </div>
  )
}

function FeatureRow({
  icon,
  title,
  desc
}: {
  icon: string
  title: string
  desc: string
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-lg bg-white dark:bg-slate-800 p-1.5 rounded-lg border border-slate-100 dark:border-slate-700 shadow-sm">
        {icon}
      </span>
      <div className="text-left">
        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">
          {title}
        </h3>
        <p className="text-[10px] text-slate-500 dark:text-slate-500 leading-tight">
          {desc}
        </p>
      </div>
    </div>
  )
}
