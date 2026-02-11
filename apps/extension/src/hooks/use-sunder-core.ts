// We import init and SunderVault dynamically because WASM needs async loading
import init, { SunderVault } from "@sunder/core"
import { useCallback, useEffect, useRef, useState } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { DEFAULT_SETTINGS, type SunderSettings } from "./use-sunder-settings"

export const useSunderCore = () => {
  const [isReady, setIsReady] = useState(false)
  const vaultRef = useRef<SunderVault | null>(null)

  // Use storage to get current settings
  const [settings] = useStorage<SunderSettings>(
    "sunder-settings",
    DEFAULT_SETTINGS
  )

  useEffect(() => {
    const loadWasm = async () => {
      try {
        await init() // Initialize the WASM module
        vaultRef.current = new SunderVault()

        // Initial configuration
        if (settings) {
          vaultRef.current.configure(
            settings.identity,
            settings.contact,
            settings.technical
          )
        }

        setIsReady(true)
        console.log("Sunder Core (WASM) initialized successfully")
      } catch (error) {
        console.error("Failed to initialize Sunder Core WASM:", error)
      }
    }

    if (!vaultRef.current) {
      loadWasm()
    }
  }, []) // Run once on mount to load WASM

  // Effect to re-configure vault when settings change
  useEffect(() => {
    if (isReady && vaultRef.current && settings) {
      console.log("Sunder Core: Updating configuration", settings)
      vaultRef.current.configure(
        settings.identity,
        settings.contact,
        settings.technical
      )
    }
  }, [isReady, settings])

  const protect = (text: string) => {
    if (!vaultRef.current) return text
    return vaultRef.current.protect(text)
  }

  const reveal = (text: string) => {
    if (!vaultRef.current) return text
    return vaultRef.current.reveal(text)
  }

  const getIdentityMap = useCallback((): Map<string, string> => {
    if (!vaultRef.current) return new Map<string, string>()

    // WASM returns a js_sys::Map which IS a native JS Map
    return vaultRef.current.get_identity_map() as Map<string, string>
  }, [isReady])

  return { isReady, protect, reveal, getIdentityMap }
}
