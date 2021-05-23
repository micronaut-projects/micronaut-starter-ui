import { useEffect, useMemo, useRef, useState } from 'react'
import { MicronautStarterSDK } from '../../micronaut'

import {
  resetRoute,
  resolveActionRoute,
  isDeepLinkReferral,
  ACTIVITY_KEY,
  parseAndConsumeQuery,
  sharableLink,
} from '../../helpers/Routing'
import useLocalStorage from '../../hooks/useLocalStorage'
import Lang from '../../helpers/Lang'

export function useShareData() {
  return useRef(parseAndConsumeQuery())
}

function formResets(fallbacks = {}) {
  const { name, package: pkg, type } = fallbacks
  return {
    name: typeof name === 'string' ? name : 'demo',
    package: typeof pkg === 'string' ? pkg : 'com.example',
    type: typeof type === 'string' ? type : 'DEFAULT',
  }
}

const initialForm = (initialData) => {
  const { javaVersion, lang, build, test } = initialData
  const parsed = {
    javaVersion: typeof javaVersion === 'string' ? javaVersion : '', // This is specifically "" to work with the SelectOption component
    lang: typeof lang === 'string' ? lang : null,
    build: typeof build === 'string' ? build : null,
    test: typeof test === 'string' ? test : null,
  }
  return {
    ...parsed,
    ...formResets(initialData),
  }
}

export function useInitialVersionEffect(
  initialVersion,
  availableVersions = [],
  setSelectedVersion,
  handleWarning
) {
  useEffect(() => {
    const hasVersions =
      Array.isArray(availableVersions) && availableVersions.length > 0

    const checkRequestedVersion = (hasVersions, versions) => {
      if (hasVersions && initialVersion) {
        const match = versions.find((v) => v.version === initialVersion)
        if (!match) {
          const message = Lang.trans('error.versionNoLongerSupported', {
            requestedVersion: initialVersion,
            currentVersion: versions[0].version,
          })
          handleWarning(message)
        }
      }
    }

    checkRequestedVersion(hasVersions, availableVersions)

    hasVersions &&
      setSelectedVersion((version) => {
        return (
          availableVersions.find((v) => v.version === version?.version) ||
          availableVersions.find((v) => v.version === initialVersion) ||
          availableVersions[0]
        )
      })
  }, [availableVersions, initialVersion, setSelectedVersion, handleWarning])
}

export function useFeaturesHandler(setFeaturesSelected) {
  return useMemo(() => {
    const addFeature = (feature) => {
      setFeaturesSelected(({ ...draft }) => {
        draft[feature.name] = feature
        return draft
      })
    }

    const removeFeature = (feature) => {
      setFeaturesSelected(({ ...draft }) => {
        delete draft[feature.name]
        return draft
      })
    }

    const removeAllFeatures = () => {
      setFeaturesSelected({})
    }

    return {
      addFeature,
      removeFeature,
      removeAllFeatures,
    }
  }, [setFeaturesSelected])
}

export function useOnInitialLoadEffect(initialData, onRepoCreated, onError) {
  // Use Effect Hook For Error Handling and
  // GitHub on complete callback
  useEffect(() => {
    const { error, htmlUrl, cloneUrl } = initialData
    if (!error && !htmlUrl) {
      return // nothing more to do
    }
    resetRoute()
    setTimeout(() => {
      if (cloneUrl) {
        onRepoCreated({
          cloneUrl,
          htmlUrl,
          show: true,
          type: 'clone',
        })
      } else if (error) {
        onError(error.replaceAll('+', ' '))
      }
    }, 500)
  }, [initialData, onRepoCreated, onError])
}

export function useHandleShareLinkEffect(
  sdk,
  initialData,
  routingHandlers = {}
) {
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
        // Push back and return
        resetRoute()
        return
      }

      const { showing } = shareData.current

      delete shareData.current[ACTIVITY_KEY]
      delete shareData.current.showing

      // This is a common react problem
      // Since we have to wait for the SDK to get initialized
      // but can't watch the create / features objects,
      // we need to rebuild at routing time.
      const payload = {
        ...initialForm(shareData.current),
        features: MicronautStarterSDK.reconstructFeatures(
          shareData.current.features
        ),
      }

      await routingHandlers[activity](payload, sdk, { showing })
    }

    if (sdk?.baseUrl) {
      handleDeepLink()
    }
  }, [sdk, routingHandlers, isReferral, shareData])
}

const EMPTY_DATA = {}

export function useApplicationForm(initialData = EMPTY_DATA) {
  // Form Data
  const isReferral = isDeepLinkReferral(initialData)

  const [form, setForm] = useLocalStorage(
    'INITIAL_FORM_DATA',
    initialForm(initialData),
    isReferral
  )

  const [selectedFeatures, setSelectedFeatures] = useState(
    MicronautStarterSDK.reconstructFeatures(initialData.features)
  )

  const [selectedVersion, setSelectedVersion] = useLocalStorage(
    'SELECTED_MN_VERSION',
    null,
    isReferral
  )

  const resetHandlers = useMemo(() => {
    const onResetFeatures = () => {
      setSelectedFeatures({})
    }

    const onResetForm = () => {
      setForm((form) => ({ ...form, ...formResets() }))
    }

    const onResetAll = () => {
      onResetForm()
      onResetFeatures()
    }

    return { onResetForm, onResetFeatures, onResetAll }
  }, [setForm, setSelectedFeatures])

  const createPayload = { ...form, features: selectedFeatures }

  const sharable = useMemo(() => {
    return sharableLink(form, selectedFeatures, selectedVersion?.version)
  }, [selectedFeatures, form, selectedVersion?.version])

  return {
    sharable,
    createPayload,
    form,
    setForm,
    selectedFeatures,
    setSelectedFeatures,
    selectedVersion,
    setSelectedVersion,
    resetHandlers,
  }
}
