import { cn } from "../../lib/utils"

export const OverlayTooltip = ({
  active,
  isDark
}: {
  active: boolean
  isDark: boolean
}) => {
  return (
    <div
      className={cn(
        "absolute right-full mr-4 px-3 py-1.5 rounded-lg text-sm font-semibold whitespace-nowrap shadow-xl transition-all duration-300 origin-right top-1/2 -translate-y-1/2",
        // Position and visibility
        "opacity-0 translate-x-4 scale-95 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-100",
        isDark ? "bg-gray-800 text-white" : "bg-white text-gray-800"
      )}>
      {active ? "Protected by Sunder" : "Enable Protection"}
      {/* Arrow */}
      <div
        className={cn(
          "absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 rotate-45",
          isDark ? "bg-gray-800" : "bg-white"
        )}
      />
    </div>
  )
}
