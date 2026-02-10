import { ShieldCheck } from "lucide-react";

export function ChatEmptyState() {
  return (
    <div className="h-full flex items-center justify-center text-zinc-400">
      <div className="text-center">
        <ShieldCheck className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p className="text-sm">
          Your messages are protected before being sent to AI
        </p>
        <p className="text-xs mt-1">
          Tokens like [EMAIL-001] replace sensitive data
        </p>
      </div>
    </div>
  );
}
