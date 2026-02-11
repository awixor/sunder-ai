import { useStorage } from "@plasmohq/storage/hook"

import { Spinner } from "../components/ui/spinner"
import { useAIInputTarget } from "../hooks/use-ai-target"
import { useInputProtection } from "../hooks/use-input-protection"
import { usePageHydration } from "../hooks/use-page-hydration"
import { useSunderCore } from "../hooks/use-sunder-core"
import { HydrationButton } from "./overlay/hydration-button"
import { OverlayButton } from "./overlay/overlay-button"
import { OverlayIcon } from "./overlay/overlay-icon"
import { OverlayTooltip } from "./overlay/overlay-tooltip"

const SunderOverlay = () => {
  const [isProtected, setIsProtected] = useStorage<boolean>(
    `sunder-active-${window.location.hostname}`,
    false
  )
  const targetElement = useAIInputTarget()
  const { isReady, protect, getIdentityMap } = useSunderCore()
  const { isRevealed, toggleHydration } = usePageHydration(getIdentityMap)

  useInputProtection(targetElement, isProtected, isReady, protect)

  const isConnected = !!targetElement
  const isLoading = !isConnected || !isReady
  const showHydrationButton = isReady && isProtected

  return (
    <div className="fixed z-[99] flex flex-col items-center pointer-events-none gap-3 bottom-6 right-6">
      {showHydrationButton && (
        <div className="pointer-events-auto">
          <HydrationButton isRevealed={isRevealed} onClick={toggleHydration} />
        </div>
      )}

      <div className="relative pointer-events-auto group">
        <OverlayButton
          active={isProtected}
          isReady={isReady}
          onClick={() => !isLoading && setIsProtected(!isProtected)}
          className="opacity-100 scale-100 w-14 h-14">
          {isLoading ? (
            <Spinner className="w-6 h-6 text-emerald-500" />
          ) : (
            <OverlayIcon active={isProtected} />
          )}
        </OverlayButton>

        {!isLoading && <OverlayTooltip active={isProtected} />}
      </div>
    </div>
  )
}

export default SunderOverlay
