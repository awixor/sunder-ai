import { useCallback, useEffect, useRef } from "react"

import { getCaretPosition, setCaretPosition } from "../utils/dom-utils"

/**
 * Sets value on native input/textarea elements using the prototype setter
 * to bypass React's synthetic event system (needed for sites like ChatGPT).
 */
const setNativeValue = (
  element: HTMLTextAreaElement | HTMLInputElement,
  value: string
) => {
  const valueSetter = Object.getOwnPropertyDescriptor(element, "value")?.set
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

export const useInputProtection = (
  targetElement: HTMLElement | null,
  isProtected: boolean,
  isReady: boolean,
  protect: (text: string) => string
) => {
  // Use a ref for `protect` so the effect doesn't re-run when it changes
  const protectRef = useRef(protect)
  protectRef.current = protect

  const handleInput = useCallback((e: Event) => {
    const target = e.target as HTMLElement
    let currentValue = ""
    let currentCursor = 0

    if (
      target instanceof HTMLTextAreaElement ||
      target instanceof HTMLInputElement
    ) {
      currentValue = target.value
      currentCursor = target.selectionStart || 0
    } else {
      currentValue = target.innerText
      const pos = getCaretPosition(target)
      currentCursor = pos.end
    }

    const protectedText = protectRef.current(currentValue)
    if (protectedText === currentValue) return

    const delta = protectedText.length - currentValue.length
    const newCursor = Math.max(
      0,
      Math.min(protectedText.length, currentCursor + delta)
    )

    if (
      target instanceof HTMLTextAreaElement ||
      target instanceof HTMLInputElement
    ) {
      setNativeValue(target, protectedText)
      target.selectionStart = target.selectionEnd = newCursor
    } else if (target.isContentEditable) {
      target.innerText = protectedText
      try {
        setCaretPosition(target, newCursor)
      } catch (err) {
        console.error("Failed to set caret:", err)
      }
      target.dispatchEvent(new Event("input", { bubbles: true }))
    }
  }, [])

  useEffect(() => {
    if (!targetElement || !isProtected || !isReady) return

    targetElement.addEventListener("input", handleInput)
    return () => targetElement.removeEventListener("input", handleInput)
  }, [targetElement, isProtected, isReady, handleInput])
}
