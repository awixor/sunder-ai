import React from "react"

import { EyeIcon, EyeOffIcon } from "../../lib/icons"
import { cn } from "../../lib/utils"

interface HydrationButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isRevealed: boolean
}

export const HydrationButton = React.forwardRef<
  HTMLButtonElement,
  HydrationButtonProps
>(({ className, isRevealed, ...props }, ref) => {
  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        "group relative flex items-center justify-center w-10 h-10 rounded-full shadow-lg transition-all duration-300 ease-out",
        // Active (Revealed) State - distinct color (e.g. Amber/Orange for caution/reveal)
        isRevealed &&
          "bg-amber-600 hover:bg-amber-500 text-white shadow-amber-500/30",
        // Inactive (Hidden) State
        !isRevealed &&
          "bg-gray-900 border border-gray-700 text-gray-400 hover:text-gray-200 hover:bg-gray-800 shadow-xl",
        className
      )}
      {...props}>
      {isRevealed ? (
        <EyeOffIcon className="w-5 h-5 transition-transform group-hover:scale-110" />
      ) : (
        <EyeIcon className="w-5 h-5 transition-transform group-hover:scale-110" />
      )}
    </button>
  )
})

HydrationButton.displayName = "HydrationButton"
