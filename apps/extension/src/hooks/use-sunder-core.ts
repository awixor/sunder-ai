// We import init and SunderVault dynamically because WASM needs async loading
import init, { SunderVault } from "@sunder/core"
import { useEffect, useRef, useState } from "react"

export const useSunderCore = () => {
  const [isReady, setIsReady] = useState(false)
  const vaultRef = useRef<SunderVault | null>(null)

  useEffect(() => {
    const loadWasm = async () => {
      try {
        await init() // Initialize the WASM module
        vaultRef.current = new SunderVault()
        setIsReady(true)
        console.log("Sunder Core (WASM) initialized successfully")
      } catch (error) {
        console.error("Failed to initialize Sunder Core WASM:", error)
      }
    }

    loadWasm()
  }, [])

  const protect = (text: string) => {
    if (!vaultRef.current) return text
    return vaultRef.current.protect(text)
  }

  const reveal = (text: string) => {
    if (!vaultRef.current) return text
    return vaultRef.current.reveal(text)
  }

  return { isReady, protect, reveal }
}
