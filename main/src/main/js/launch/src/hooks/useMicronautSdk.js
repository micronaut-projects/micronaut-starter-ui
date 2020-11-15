import { useMemo } from 'react'
import { MicronautStarterSDK } from '../micronaut'

export default function useMicronautSdk(baseUrl) {
  return useMemo(() => {
    return baseUrl && new MicronautStarterSDK({ baseUrl: baseUrl })
  }, [baseUrl])
}
