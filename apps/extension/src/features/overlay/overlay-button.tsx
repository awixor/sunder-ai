import React from "react"

import { cn } from "../../lib/utils"

interface OverlayButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
  isReady?: boolean
  children: React.ReactNode
}

export const OverlayButton = React.forwardRef<
  HTMLButtonElement,
  OverlayButtonProps
>(({ className, active, isReady = true, children, ...props }, ref) => {
  return (
    <button
      ref={ref}
      disabled={!isReady}
      className={cn(
        "group relative flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-all duration-500 ease-out",
        // Active State
        active && "bg-emerald-600 shadow-green-500/30 hover:bg-emerald-500",
        // Inactive (Unified Dark Theme)
        !active &&
          "bg-gray-950 border border-gray-700 shadow-2xl shadow-black/50 hover:border-gray-500 hover:bg-gray-900",
        // Loading State
        !isReady && "opacity-50 cursor-wait",
        className
      )}
      {...props}>
      {children}
    </button>
  )
})

OverlayButton.displayName = "OverlayButton"
