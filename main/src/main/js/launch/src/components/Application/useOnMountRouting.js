import { useEffect, useRef } from 'react'

import { resolveActionRoute, isDeepLinkReferral } from '../../helpers/Routing'

import { useCurrenSdk } from '../../state/store'

export function useOnMountRouting(initialData, routingHandlers, onError) {
  const sdk = useCurrenSdk()
  useHandleRepoClonedRouteEvent(
    initialData,
    routingHandlers.onRepoCreated,
    onError
  )
  useHandleShareLinkRouteEffect(sdk, initialData, routingHandlers)
}

export function useHandleRepoClonedRouteEvent(
  initialData,
  onRepoCreated,
  onError
) {
  // Use Effect Hook For Error Handling and
  // GitHub on complete callback
  useEffect(() => {
    const { error, htmlUrl, cloneUrl } = initialData
    if (!error && !htmlUrl) {
      return // nothing more to do
    }
    setTimeout(() => {
      if (cloneUrl) {
        onRepoCreated({
          cloneUrl,
          htmlUrl,
          show: true,
          type: 'clone',
        })
      } else if (error) {
        onError(new Error(error.replaceAll('+', ' ')))
      }
    }, 500)
  }, [initialData, onRepoCreated, onError])
}

export function useHandleShareLinkRouteEffect(
  sdk,
  initialData,
  routingHandlers = {}
) {
  const isReferral = isDeepLinkReferral(initialData)
  const shareData = useRef(initialData)

  // Deep Linking
  useEffect(() => {
    function handleDeepLink() {
      const activity = resolveActionRoute(shareData.current)
      if (!activity) {
        return
      }

      // If we're not able to handle the route,
      // discard and reset the history state
      if (!isReferral || !Object.keys(routingHandlers).includes(activity)) {
        return
      }

      // This is a common react problem
      // Since we have to wait for the SDK to get initialized
      // but can't watch the create / features objects,
      // we need to rebuild at routing time.
      const { showing, ...payload } = shareData.current
      // Trigger the route handler
      routingHandlers[activity](payload, sdk, { showing })
    }

    if (sdk?.baseUrl && shareData.current) {
      handleDeepLink()
      // Null out the share data now that the route was handled
      shareData.current = null
    }
  }, [sdk, routingHandlers, isReferral, shareData])
}
