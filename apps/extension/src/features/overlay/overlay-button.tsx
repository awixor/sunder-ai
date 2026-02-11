import React from "react"

import { cn } from "../../lib/utils"

interface OverlayButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
  isDark?: boolean
  isReady?: boolean
  children: React.ReactNode
}

export const OverlayButton = React.forwardRef<
  HTMLButtonElement,
  OverlayButtonProps
>(({ className, active, isDark, isReady = true, children, ...props }, ref) => {
  return (
    <button
      ref={ref}
      disabled={!isReady}
      className={cn(
        "group relative flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-all duration-500 ease-out",
        // Active State
        active &&
          "bg-gradient-to-br from-emerald-500 to-green-600 shadow-green-500/30",
        // Inactive Dark
        !active &&
          isDark &&
          "bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 shadow-black/40 hover:border-gray-500",
        // Inactive Light
        !active &&
          !isDark &&
          "bg-white border border-gray-200 shadow-gray-200/50 hover:border-gray-300",
        // Loading State
        !isReady && "opacity-50 cursor-wait",
        className
      )}
      {...props}>
      {/* Glow Effect for active state */}
      {active && (
        <div className="absolute inset-0 rounded-full bg-green-400 opacity-20 animate-ping" />
      )}
      {children}
    </button>
  )
})

OverlayButton.displayName = "OverlayButton"
