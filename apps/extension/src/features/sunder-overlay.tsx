import { useEffect, useRef, useState } from "react"

import { useAIInputTarget } from "../hooks/use-ai-target"
import { useSunderCore } from "../hooks/use-sunder-core"

const SunderOverlay = () => {
  const [isProtected, setIsProtected] = useState(false)
  const targetElement = useAIInputTarget()
  const { isReady, protect } = useSunderCore()
  const isConnected = !!targetElement

  // Simple theme detection (can be expanded to observe DOM mutations on body class)
  const [isDark, setIsDark] = useState(false)

  // Track cursor position to restore it after modification
  const cursorRef = useRef<number>(0)

  useEffect(() => {
    // Check initial preference
    const checkTheme = () => {
      // Check for common dark mode classes on body/html (ChatGPT/Gemini often use these)
      const hasDarkClass =
        document.documentElement.classList.contains("dark") ||
        document.documentElement.classList.contains("theme-dark") ||
        document.body.classList.contains("dark-theme")

      // Fallback to media query
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches

      setIsDark(hasDarkClass || prefersDark)
    }

    checkTheme()

    // Optional: Observe class changes on html/body for dynamic theme switching
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style"]
    })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!targetElement || !isProtected || !isReady) return

    const handleInput = (e: Event) => {
      // Simple debounce or just run? WASM is fast.
      // Let's try direct.
      const target = e.target as HTMLElement
      let currentValue = ""

      if (
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLInputElement
      ) {
        currentValue = target.value
        cursorRef.current = target.selectionStart
      } else {
        currentValue = target.innerText
        // Handling cursor in contenteditable is harder, skip for now
      }

      const protectedText = protect(currentValue)

      if (protectedText !== currentValue) {
        // Prevent infinite loop if we update value
        // React overrides value settters, so we need to be careful.
        // For now, let's just log or set value directly if possible.
        // Setting value directly on controlled inputs often fails to update React state.
        // We need to dispatch a change event after setting value.

        // This is a naive implementation - better one involves dispatching input event
        /*
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")?.set;
        if (nativeInputValueSetter && target instanceof HTMLTextAreaElement) {
            nativeInputValueSetter.call(target, protectedText);
            target.dispatchEvent(new Event('input', { bubbles: true }));
        }
        */

        // For MVP: Just console log the sanitization
        console.log("Sunder Sanitizing:", {
          original: currentValue,
          protected: protectedText
        })

        // If we want to replace, let's do it carefully
        if (target instanceof HTMLTextAreaElement) {
          // Updating value directly might conflict with React.
          // But let's try setting it for now to see if it works.
          // target.value = protectedText
          // target.selectionStart = target.selectionEnd = cursorRef.current
        }
      }
    }

    // Capture/Bubble phase matters. Let's use capture to intercept early?
    // Or bubble to process after change.
    targetElement.addEventListener("input", handleInput)
    return () => targetElement.removeEventListener("input", handleInput)
  }, [targetElement, isProtected, isReady, protect])

  return (
    <div
      className="fixed z-[2147483647] flex items-center justify-end pointer-events-none"
      style={{ bottom: "24px", right: "24px", position: "fixed" }}>
      {/* Search State / Loading Pill */}
      {!isConnected && (
        <div
          className={`
            flex items-center gap-2 px-4 py-2 rounded-full shadow-lg border backdrop-blur-md transition-all duration-300
            ${isDark ? "bg-gray-900/80 border-gray-700 text-gray-400" : "bg-white/80 border-gray-200 text-gray-500"}
         `}>
          <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
          <span className="text-xs font-medium">Scanning...</span>
        </div>
      )}

      {/* Main Button */}
      <button
        onClick={() => isReady && isConnected && setIsProtected(!isProtected)}
        disabled={!isReady}
        style={{ pointerEvents: "auto" }}
        className={`
          group relative flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-all duration-500 ease-out
          ${!isConnected ? "scale-0 opacity-0 w-0 h-0 overflow-hidden" : "scale-100 opacity-100"}
          ${
            isProtected
              ? "bg-gradient-to-br from-emerald-500 to-green-600 shadow-green-500/30"
              : isDark
                ? "bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 shadow-black/40 hover:border-gray-500"
                : "bg-white border border-gray-200 shadow-gray-200/50 hover:border-gray-300"
          }
          ${!isReady && isConnected ? "opacity-50 cursor-wait" : ""}
        `}
        title={
          !isReady
            ? "Initializing Sunder Core..."
            : isProtected
              ? "Sunder: Protection Active"
              : "Sunder: Click to Protect"
        }>
        {/* Glow Effect */}
        {isProtected && (
          <div className="absolute inset-0 rounded-full bg-green-400 opacity-20 animate-ping" />
        )}

        {/* Icon */}
        <div
          className={`transition-transform duration-300 ${isProtected ? "scale-110" : "group-hover:scale-110"}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`w-7 h-7 transition-colors duration-300 ${
              isProtected
                ? "text-white drop-shadow-md"
                : isDark
                  ? "text-gray-300"
                  : "text-gray-600"
            }`}>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            {isProtected && (
              <path
                d="M9 12l2 2 4-4"
                className="animate-[draw_0.4s_ease-out]"
              />
            )}
          </svg>
        </div>
      </button>

      {/* Tooltip / Status - Only show when protected or hovering */}
      <div
        className={`
        absolute right-full mr-4 px-3 py-1.5 rounded-lg text-sm font-semibold whitespace-nowrap shadow-xl
        transition-all duration-300 origin-right
        ${
          isProtected
            ? "opacity-100 translate-x-0 scale-100"
            : "opacity-0 translate-x-4 scale-95 pointer-events-none"
        }
        ${isDark ? "bg-gray-800 text-white" : "bg-white text-gray-800"}
      `}>
        {isProtected ? "Protected by Sunder" : "Enable Protection"}
        {/* Arrow */}
        <div
          className={`absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 ${isDark ? "bg-gray-800" : "bg-white"}`}
        />
      </div>
    </div>
  )
}

export default SunderOverlay
