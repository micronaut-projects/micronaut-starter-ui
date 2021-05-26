import { useEffect, useRef } from 'react'

import {
  resolveActionRoute,
  isDeepLinkReferral,
  ACTIVITY_KEY,
} from '../../helpers/Routing'

import { useCurrenSdk } from '../../state/store'

export function useOnMountRouting(initialData, routingHandlers, onError) {
  useOnInitialLoadEffect(initialData, routingHandlers.onRepoCreated, onError)
  useHandleShareLinkEffect(initialData, routingHandlers)
}

export function useOnInitialLoadEffect(initialData, onRepoCreated, onError) {
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

export function useHandleShareLinkEffect(initialData, routingHandlers = {}) {
  const sdk = useCurrenSdk()
  const isReferral = isDeepLinkReferral(initialData)
  const shareData = useRef(initialData)

  // Deep Linking
  useEffect(() => {
    async function handleDeepLink() {
      const activity = resolveActionRoute(shareData.current)
      if (!activity) {
        return
      }

      // If we're not able to handle the route,
      // discard and reset the history state
      if (!isReferral || !Object.keys(routingHandlers).includes(activity)) {
        return
      }

      const { showing } = shareData.current
      delete shareData.current[ACTIVITY_KEY]
      delete shareData.current.showing

      // This is a common react problem
      // Since we have to wait for the SDK to get initialized
      // but can't watch the create / features objects,
      // we need to rebuild at routing time.
      const payload = shareData.current
      await routingHandlers[activity](payload, sdk, { showing })
    }

    if (sdk?.baseUrl) {
      handleDeepLink()
    }
  }, [sdk, routingHandlers, isReferral, shareData])
}
