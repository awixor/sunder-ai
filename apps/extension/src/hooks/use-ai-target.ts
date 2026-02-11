import { useEffect, useRef, useState } from "react"

export const useAIInputTarget = () => {
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null)
  const targetRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const findTarget = () => {
      // Based on user feedback and research:
      // ChatGPT: uses name="prompt-textarea"
      // Gemini: uses rich-textarea
      const selectors = [
        "#prompt-textarea", // Legacy ChatGPT
        "textarea[name='prompt-textarea']", // ChatGPT
        "rich-textarea div[contenteditable='true']", // Gemini (Specific inner div)
        "rich-textarea", // Gemini (Container fallback)
        "div[role='textbox']", // Semantic fallback (Gemini/Claude)
        "div[contenteditable='true']", // Generic fallback
        "textarea" // Generic fallback
      ]

      for (const selector of selectors) {
        const el = document.querySelector(selector) as HTMLElement
        if (el) {
          if (el !== targetRef.current) {
            console.log("Sunder: Target changed to:", selector)
            targetRef.current = el
            setTargetElement(el)
          }
          return // Found the best match
        }
      }
    }

    findTarget()
    const interval = setInterval(findTarget, 1000)
    return () => clearInterval(interval)
  }, [])

  return targetElement
}
