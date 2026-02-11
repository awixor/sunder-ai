import { cn } from "../../lib/utils"

export const OverlayIcon = ({
  active,
  isDark
}: {
  active: boolean
  isDark: boolean
}) => {
  return (
    <div
      className={cn(
        "transition-transform duration-300",
        active ? "scale-110" : "group-hover:scale-110"
      )}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn(
          "w-7 h-7 transition-colors duration-300",
          active
            ? "text-white drop-shadow-md"
            : isDark
              ? "text-gray-300"
              : "text-gray-600"
        )}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        {active && (
          <path d="M9 12l2 2 4-4" className="animate-[draw_0.4s_ease-out]" />
        )}
      </svg>
    </div>
  )
}
