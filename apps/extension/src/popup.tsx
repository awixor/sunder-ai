import { SettingToggle } from "./components/ui/setting-toggle"
import { Onboarding } from "./features/onboarding"
import { useSunderSettings } from "./hooks/use-sunder-settings"

import "./style.css"

function IndexPopup() {
  const { settings, toggleSetting } = useSunderSettings()

  if (!settings.isOnboarded) {
    return <Onboarding />
  }

  return (
    <div className="w-[350px] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden flex flex-col font-sans">
      {/* Header */}
      <div className="bg-white dark:bg-slate-950 p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-500 to-green-600 bg-clip-text text-transparent">
          Sunder AI
        </h1>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Active
          </span>
        </div>
      </div>

      {/* Settings List */}
      <div className="p-4 space-y-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[10px] mb-2 text-opacity-70">
            Privacy Filters
          </h2>

          <SettingToggle
            label="Identity Protection"
            description="Redact names, SSNs, personal IDs"
            active={false}
            disabled={true}
            badge="Coming Soon"
            // onToggle={() => toggleSetting("identity")}
          />
          <SettingToggle
            label="Contact Info"
            description="Redact emails, phone numbers"
            active={settings.contact}
            onToggle={() => toggleSetting("contact")}
          />
          <SettingToggle
            label="Technical Data"
            description="Redact IP addresses, API keys (coming soon)"
            active={settings.technical}
            onToggle={() => toggleSetting("technical")}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="bg-slate-100 dark:bg-slate-950 p-3 text-center text-xs text-slate-500 border-t border-slate-200 dark:border-slate-800">
        Protected by Sunder Vault (Local WASM)
      </div>
    </div>
  )
}

export default IndexPopup
