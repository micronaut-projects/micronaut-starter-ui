import { useEffect, useState } from 'react'
import { MicronautStarterSDK } from '../../micronaut'

const useOnMount = (callback) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(callback, [])
}

export function useAvailableFeatures(sdk, applicationType, onError) {
  const [availableFeatures, setAvailableFeatures] = useState([])
  const [loadingFeatures, setLoadingFeatures] = useState(false)

  // Use Effect to load the features based on the form.type [DEFAULT, CLI, etc...]
  // And the baseUrl of the sdk. Only trying if initialized
  useEffect(() => {
    let mounted = true
    function ifMounted(cb) {
      if (mounted) return cb()
    }

    const loadFeatures = async () => {
      setLoadingFeatures(true)
      try {
        const data = await sdk.features({ type: applicationType })
        ifMounted(() => setAvailableFeatures(data.features))
      } catch (error) {
        ifMounted(() => onError(error))
      } finally {
        ifMounted(() => setLoadingFeatures(false))
      }
    }

    if (sdk?.baseUrl) {
      loadFeatures()
    }
    return () => (mounted = false)
  }, [sdk, applicationType, onError])

  return { availableFeatures, loadingFeatures }
}

/** */
export function useAvailableVersions(onLoading, onError) {
  const [initialized, setInitialized] = useState(false)
  const [availableVersions, setAvailableVersions] = useState([])
  useOnMount(() => {
    const loadVersions = async () => {
      onLoading(true)
      try {
        const versions = await MicronautStarterSDK.loadVersions()
        setAvailableVersions(versions)
      } catch (error) {
        await onError(error)
      } finally {
        setInitialized(true)
        onLoading(false)
      }
    }
    loadVersions()
  })

  return {
    availableVersions,
    initialized,
  }
}
