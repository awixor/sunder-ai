"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Info, AlertTriangle } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

export type ConfirmationVariant = "destructive" | "warning" | "info";

interface InlineConfirmationProps {
  isOpen: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  title?: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmationVariant;
  className?: string;
}

const variantConfig: Record<
  ConfirmationVariant,
  {
    icon: typeof AlertCircle;
    containerClass: string;
    iconClass: string;
    confirmButtonVariant: "danger" | "primary";
  }
> = {
  destructive: {
    icon: AlertCircle,
    containerClass:
      "bg-red-50/50 dark:bg-red-900/10 border-red-100 dark:border-red-900/20 text-red-900 dark:text-red-100",
    iconClass: "text-red-600 dark:text-red-400",
    confirmButtonVariant: "danger",
  },
  warning: {
    icon: AlertTriangle,
    containerClass:
      "bg-amber-50/50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/20 text-amber-900 dark:text-amber-100",
    iconClass: "text-amber-600 dark:text-amber-400",
    confirmButtonVariant: "primary",
  },
  info: {
    icon: Info,
    containerClass:
      "bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/20 text-blue-900 dark:text-blue-100",
    iconClass: "text-blue-600 dark:text-blue-400",
    confirmButtonVariant: "primary",
  },
};

export function InlineConfirmation({
  isOpen,
  onConfirm,
  onCancel,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "destructive",
  className,
}: InlineConfirmationProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0, scale: 0.95 }}
          animate={{ opacity: 1, height: "auto", scale: 1 }}
          exit={{ opacity: 0, height: 0, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 350 }}
          className="overflow-hidden"
        >
          <div
            className={cn(
              "p-4 rounded-xl border backdrop-blur-md shadow-sm space-y-4",
              config.containerClass,
              className,
            )}
          >
            <div className="flex gap-3">
              <div
                className={cn(
                  "mt-0.5 p-1.5 rounded-lg bg-white/50 dark:bg-black/20 shadow-inner h-fit",
                  config.iconClass,
                )}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                {title && <h4 className="text-sm font-semibold">{title}</h4>}
                <p className="text-xs font-medium leading-relaxed opacity-90">
                  {description}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant={config.confirmButtonVariant}
                className="flex-1 h-8 text-[11px] font-bold shadow-sm"
                onClick={onConfirm}
              >
                {confirmLabel}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 h-8 text-[11px] font-semibold bg-white/50 dark:bg-black/20"
                onClick={onCancel}
              >
                {cancelLabel}
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
