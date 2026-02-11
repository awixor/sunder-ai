import { cn } from "../../lib/utils"

export interface SettingToggleProps {
  label: string
  description: string
  active: boolean
  onToggle?: () => void
  disabled?: boolean
  badge?: string
}

export function SettingToggle({
  label,
  description,
  active,
  onToggle,
  disabled = false,
  badge
}: SettingToggleProps) {
  return (
    <button
      onClick={!disabled ? onToggle : undefined}
      disabled={disabled}
      className={cn(
        "flex items-center justify-between w-full p-3 rounded-xl transition-all border group",
        // Disabled State
        disabled &&
          "bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 opacity-60 cursor-not-allowed",
        // Active State (Enabled)
        !disabled &&
          active &&
          "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 cursor-pointer",
        // Inactive State (Enabled)
        !disabled &&
          !active &&
          "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-800 cursor-pointer"
      )}>
      <div className="flex flex-col items-start gap-0.5">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "font-semibold text-sm text-start",
              disabled && "text-slate-400 dark:text-slate-600",
              !disabled && active && "text-emerald-900 dark:text-emerald-400",
              !disabled && !active && "text-slate-700 dark:text-slate-300"
            )}>
            {label}
          </span>
          {badge && (
            <span className="p-0.5 text-[8px] uppercase tracking-wider rounded bg-slate-100 text-slate-500 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700">
              {badge}
            </span>
          )}
        </div>
        <span
          className={cn(
            "text-xs text-left",
            disabled
              ? "text-slate-400 dark:text-slate-600"
              : "text-slate-500 dark:text-slate-500"
          )}>
          {description}
        </span>
      </div>

      <div
        className={cn(
          "w-10 h-6 rounded-full p-1 transition-colors duration-200 flex items-center",
          disabled && "bg-slate-100 dark:bg-slate-800",
          !disabled && active && "bg-emerald-500",
          !disabled && !active && "bg-slate-300 dark:bg-slate-700"
        )}>
        <div
          className={cn(
            "w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200",
            active && !disabled ? "translate-x-4" : "translate-x-0"
          )}
        />
      </div>
    </button>
  )
}
