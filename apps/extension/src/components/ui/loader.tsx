import { cn } from "../../lib/utils"

export const Loader = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex space-x-1", className)}>
      <div className="w-1.5 h-1.5 bg-current rounded-full animate-[bounce_1s_infinite_0ms]" />
      <div className="w-1.5 h-1.5 bg-current rounded-full animate-[bounce_1s_infinite_200ms]" />
      <div className="w-1.5 h-1.5 bg-current rounded-full animate-[bounce_1s_infinite_400ms]" />
    </div>
  )
}
