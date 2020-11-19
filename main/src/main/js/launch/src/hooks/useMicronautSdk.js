import { useMemo } from 'react'
import MicronautLaunchSDK from "micronaut-launch-sdk"

export default function useMicronautSdk(baseUrl) {
  return useMemo(() => {
    return baseUrl && new MicronautLaunchSDK({ baseUrl: baseUrl })
  }, [baseUrl])
}
