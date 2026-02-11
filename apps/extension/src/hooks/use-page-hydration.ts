import { useCallback, useEffect, useRef, useState } from "react"

const TOKEN_REGEX = /\[[A-Z_]+_\d+\]/g

export const usePageHydration = (getIdentityMap: () => Map<string, string>) => {
  const [isRevealed, setIsRevealed] = useState(false)
  const originalTextMap = useRef(new WeakMap<Node, string>())
  const modifiedNodes = useRef(new Set<Node>())
  const observerRef = useRef<MutationObserver | null>(null)
  // Guard to prevent infinite loops: our own DOM mutations trigger the observer
  const isProcessingRef = useRef(false)

  const restoreOriginals = useCallback(() => {
    isProcessingRef.current = true
    modifiedNodes.current.forEach((node) => {
      const original = originalTextMap.current.get(node)
      if (original !== undefined && node.textContent !== original) {
        node.textContent = original
      }
    })
    modifiedNodes.current.clear()
    originalTextMap.current = new WeakMap()
    // Allow observer to run again after a microtask
    queueMicrotask(() => {
      isProcessingRef.current = false
    })
  }, [])

  useEffect(() => {
    if (!isRevealed) {
      restoreOriginals()
      observerRef.current?.disconnect()
      return
    }

    const map = getIdentityMap()
    if (!map || map.size === 0) return

    const processNode = (node: Node) => {
      if (node.nodeType !== Node.TEXT_NODE) return
      const text = node.textContent
      if (!text || !text.includes("[")) return

      const matches = text.match(TOKEN_REGEX)
      if (!matches) return

      // Check if any match exists in the identity map
      let hasReplacements = false
      for (const match of matches) {
        if (map.has(match)) {
          hasReplacements = true
          break
        }
      }
      if (!hasReplacements) return

      // Back up original text before first modification
      if (!originalTextMap.current.has(node)) {
        originalTextMap.current.set(node, text)
        modifiedNodes.current.add(node)
      }

      const newText = text.replace(TOKEN_REGEX, (match) => {
        return map.get(match) || match
      })

      if (newText !== text) {
        isProcessingRef.current = true
        node.textContent = newText
        // Re-enable observer after microtask to avoid self-triggering
        queueMicrotask(() => {
          isProcessingRef.current = false
        })
      }
    }

    // Initial scan of all existing text nodes
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT
    )
    let current: Node | null
    while ((current = walker.nextNode())) {
      processNode(current)
    }

    // Observe new/changed content (e.g. streaming AI responses)
    observerRef.current = new MutationObserver((mutations) => {
      // Skip if we caused this mutation ourselves
      if (isProcessingRef.current) return

      for (const mutation of mutations) {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((addedNode) => {
            if (addedNode.nodeType === Node.TEXT_NODE) {
              processNode(addedNode)
            } else if (addedNode.nodeType === Node.ELEMENT_NODE) {
              const w = document.createTreeWalker(
                addedNode,
                NodeFilter.SHOW_TEXT
              )
              let child: Node | null
              while ((child = w.nextNode())) processNode(child)
            }
          })
        }
        // Intentionally NOT handling characterData to avoid loops.
        // New streamed content arrives as new childList nodes anyway.
      }
    })

    observerRef.current.observe(document.body, {
      childList: true,
      subtree: true
    })

    return () => {
      restoreOriginals()
      observerRef.current?.disconnect()
    }
  }, [isRevealed, getIdentityMap, restoreOriginals])

  return {
    isRevealed,
    toggleHydration: () => setIsRevealed((prev) => !prev)
  }
}
