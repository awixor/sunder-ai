"use client";

import { cn } from "@/lib/utils";

interface SwitchProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  iconOn?: React.ReactNode;
  iconOff?: React.ReactNode;
}

export function Switch({
  checked,
  onCheckedChange,
  className,
  iconOn,
  iconOff,
  ...props
}: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      data-state={checked ? "checked" : "unchecked"}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "peer inline-flex h-8 w-14 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-950 disabled:cursor-not-allowed disabled:opacity-50",
        checked
          ? "bg-emerald-500 dark:bg-emerald-600 hover:bg-emerald-600"
          : "bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600",
        className,
      )}
      {...props}
    >
      <span
        data-state={checked ? "checked" : "unchecked"}
        className={cn(
          "pointer-events-none block h-7 w-7 rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-0 dark:bg-zinc-50",
        )}
      >
        {iconOff && (
          <span
            className={cn(
              "absolute inset-0 flex h-full w-full items-center justify-center transition-opacity",
              checked
                ? "opacity-0 duration-100 ease-out"
                : "opacity-100 duration-200 ease-in",
            )}
          >
            {iconOff}
          </span>
        )}
        {iconOn && (
          <span
            className={cn(
              "absolute inset-0 flex h-full w-full items-center justify-center transition-opacity",
              checked
                ? "opacity-100 duration-200 ease-in"
                : "opacity-0 duration-100 ease-out",
            )}
          >
            {iconOn}
          </span>
        )}
      </span>
    </button>
  );
}
