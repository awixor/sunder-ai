import { useEffect, useState } from "react"

export const useTheme = () => {
  const [isDark, setIsDark] = useState(false)

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

  return isDark
}
