import { useStorage } from "@plasmohq/storage/hook"

export interface SunderSettings {
  identity: boolean
  contact: boolean
  technical: boolean
  isOnboarded: boolean
}

export const DEFAULT_SETTINGS: SunderSettings = {
  identity: true,
  contact: true,
  technical: true,
  isOnboarded: false
}

export const useSunderSettings = () => {
  const [settings, setSettings] = useStorage<SunderSettings>(
    "sunder-settings",
    DEFAULT_SETTINGS
  )

  const toggleSetting = (key: keyof SunderSettings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  return {
    settings,
    setSettings,
    toggleSetting
  }
}
