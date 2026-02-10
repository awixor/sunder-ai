import { AlertCircle, X } from "lucide-react";

interface ChatErrorBannerProps {
  message: string;
  onDismiss: () => void;
}

export function ChatErrorBanner({ message, onDismiss }: ChatErrorBannerProps) {
  return (
    <div className="mb-4 p-3 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/30 flex items-start gap-3">
      <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
      <div className="flex-1 text-sm text-red-700 dark:text-red-300">
        {message}
      </div>
      <button
        onClick={onDismiss}
        className="text-red-400 hover:text-red-600 dark:hover:text-red-200"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
