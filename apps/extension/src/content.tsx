import cssText from "data-text:./style.css"
import type { PlasmoCSConfig, PlasmoGetStyle } from "plasmo"

import SunderOverlay from "~features/sunder-overlay"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

console.log("SUNDER: Content script loaded! 🚀")

export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText.replaceAll(":root", ":host(plasmo-csui)")
  return style
}

const PlasmoInline = () => {
  return <SunderOverlay />
}

export default PlasmoInline
