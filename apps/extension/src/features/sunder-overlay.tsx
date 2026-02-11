import { useEffect } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { Spinner } from "../components/ui/spinner"
import { useAIInputTarget } from "../hooks/use-ai-target"
import { useSunderCore } from "../hooks/use-sunder-core"
import { getCaretPosition, setCaretPosition } from "../utils/dom-utils"
import { OverlayButton } from "./overlay/overlay-button"
import { OverlayIcon } from "./overlay/overlay-icon"
import { OverlayTooltip } from "./overlay/overlay-tooltip"

const SunderOverlay = () => {
  const [isProtected, setIsProtected] = useStorage<boolean>(
    `sunder-active-${window.location.hostname}`,
    false
  )
  const targetElement = useAIInputTarget()
  const { isReady, protect } = useSunderCore()
  const isConnected = !!targetElement

  // Loading if either not connected (scanning) or not ready (WASM)
  const isLoading = !isConnected || !isReady

  useEffect(() => {
    if (!targetElement || !isProtected || !isReady) return

    const handleInput = (e: Event) => {
      const target = e.target as HTMLElement
      let currentValue = ""
      let currentCursor = 0

      // 1. Capture current state (Value + Cursor)
      if (
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLInputElement
      ) {
        currentValue = target.value
        currentCursor = target.selectionStart || 0
      } else {
        currentValue = target.innerText
        // For ContentEditable, we use our helper
        const pos = getCaretPosition(target)
        currentCursor = pos.end
      }

      // 2. Process Text
      const protectedText = protect(currentValue)

      // 3. Update if changed
      if (protectedText !== currentValue) {
        // Calculate logic cursor position
        const delta = protectedText.length - currentValue.length
        const newCursor = Math.max(
          0,
          Math.min(protectedText.length, currentCursor + delta)
        )

        // A. Handle Input/TextArea
        if (
          target instanceof HTMLTextAreaElement ||
          target instanceof HTMLInputElement
        ) {
          const setNativeValue = (
            element: HTMLTextAreaElement | HTMLInputElement,
            value: string
          ) => {
            const valueSetter = Object.getOwnPropertyDescriptor(
              element,
              "value"
            )?.set
            const prototype = Object.getPrototypeOf(element)
            const prototypeValueSetter = Object.getOwnPropertyDescriptor(
              prototype,
              "value"
            )?.set

            if (prototypeValueSetter && valueSetter !== prototypeValueSetter) {
              prototypeValueSetter.call(element, value)
            } else if (valueSetter) {
              valueSetter.call(element, value)
            } else {
              element.value = value
            }

            element.dispatchEvent(new Event("input", { bubbles: true }))
          }

          setNativeValue(target, protectedText)
          target.selectionStart = target.selectionEnd = newCursor
        }

        // B. Handle ContentEditable
        else if (target.isContentEditable) {
          target.innerText = protectedText
          try {
            setCaretPosition(target, newCursor)
          } catch (err) {
            console.error("Failed to set caret:", err)
          }
          target.dispatchEvent(new Event("input", { bubbles: true }))
        }
      }
    }

    targetElement.addEventListener("input", handleInput)
    return () => targetElement.removeEventListener("input", handleInput)
  }, [targetElement, isProtected, isReady, protect])

  return (
    <div
      className="fixed z-[2147483647] flex items-center justify-end pointer-events-none gap-3"
      style={{ bottom: "24px", right: "24px", position: "fixed" }}>
      <div className="relative pointer-events-auto group">
        {/* Button */}
        <OverlayButton
          active={isProtected}
          isReady={isReady} // Force button visible even if not ready, handled by icon swap
          onClick={() => !isLoading && setIsProtected(!isProtected)}
          className="opacity-100 scale-100 w-14 h-14" // Ensure always visible
        >
          {isLoading ? (
            <Spinner className="w-6 h-6 text-emerald-500" />
          ) : (
            <OverlayIcon active={isProtected} />
          )}
        </OverlayButton>

        {/* Tooltip - Only show when interactive */}
        {!isLoading && <OverlayTooltip active={isProtected} />}
      </div>
    </div>
  )
}

export default SunderOverlay
