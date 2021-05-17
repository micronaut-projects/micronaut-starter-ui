import { useEffect, useMemo, useState } from 'react'
import { MicronautStarterSDK } from '../micronaut'
import { smartSetState, takeAtLeast } from '../utility'

export default function useMicronautSdk(baseUrl) {
  return useMemo(() => {
    return baseUrl && new MicronautStarterSDK({ baseUrl: baseUrl })
  }, [baseUrl])
}

export const useMicronautApiOptions = (apiUrl, onLoaded, onError) => {
  const [options, setOptions] = useState({})
  const sdk = useMicronautSdk(apiUrl)
  useEffect(() => {
    async function load(apiUrl) {
      try {
        const data = await takeAtLeast(() => sdk.selectOptions(), 700)
        setOptions(smartSetState(data))
      } catch (error) {
        typeof onError === 'function' && onError(error)
      } finally {
        typeof onLoaded === 'function' && onLoaded()
      }
    }
    if (sdk) {
      load(sdk)
    }
  }, [sdk, onLoaded, onError])

  const defaults = useMemo(
    () => MicronautStarterSDK.extractDefaultOptions(options),
    [options]
  )
  return { options, defaults }
}
