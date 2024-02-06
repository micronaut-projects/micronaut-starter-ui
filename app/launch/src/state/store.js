import { useEffect, useMemo } from 'react'
import {
  atom,
  selector,
  selectorFamily,
  useRecoilCallback,
  useRecoilState,
  useRecoilValue,
  useRecoilValueLoadable,
  useSetRecoilState,
} from 'recoil'

import { sharableLink } from '../helpers/Routing'

import { setStorageValue } from '../hooks/useLocalStorage'
import { formResets } from './factories/formResets'

import { StarterSDK } from './factories/StarterSDK'
import { loadVersions } from './factories/versionLoader'

const INITIAL_FORM_DATA_STORAGE_KEY = 'INITIAL_FORM_DATA'

const versionLoader = loadVersions()

const defaultValueSelectorFactory = (key, fallback) =>
  selector({
    key: `STATE_DEFAULTS/${key}`,
    get: ({ get }) => {
      const initial = get(initialValueState)
      return initial[key] ?? fallback
    },
  })

export const initialValueState = atom({
  key: 'INITIAL_VALUE_STATE',
  default: {},
})

export const selectedVersionState = atom({
  key: 'SELECTED_VERSION_STATE',
  default: null,
  effects_UNSTABLE: [
    ({ onSet }) => {
      onSet((version) => {
        setStorageValue('SELECTED_MN_VERSION', version)
      })
    },
  ],
})

export const availableVersionsState = selector({
  key: 'AVAILABLE_VERSIONS_STATE',
  get: () => versionLoader,
})

export const baseUrlState = selector({
  key: 'BASE_URL_STATE',
  get: ({ get }) => {
    const selectedVersion = get(selectedVersionState)
    return selectedVersion?.api
  },
})

export const sdkFactoryState = atom({
  key: 'MICRONAUT_SDK_CREATOR_STATE',
  default: ({ baseUrl }) => new StarterSDK({ baseUrl }),
})

export const sdkState = selector({
  key: 'MICRONAUT_SDK_STATE',
  get: ({ get }) => {
    const baseUrl = get(baseUrlState)
    if (!baseUrl) return null
    const factory = get(sdkFactoryState)
    return factory({ baseUrl })
  },
})

export const optionsState = selector({
  key: 'SELECT_OPTIONS_STATE',
  get: async ({ get }) => {
    const sdk = get(sdkState)
    if (!sdk) return {}
    const results = await sdk.selectOptions()
    return results
  },
})

export const optionsForState = selectorFamily({
  key: 'SELECT_OPTIONS_FOR_STATE',
  get:
    (key) =>
    ({ get }) => {
      const opts = get(optionsState)
      return opts[key]
    },
})

// Start Form Fields
export const nameState = atom({
  key: 'NAME_STATE',
  default: defaultValueSelectorFactory('name'),
})

export const packageState = atom({
  key: 'PACKAGE_STATE',
  default: defaultValueSelectorFactory('package'),
})

export const appTypeState = atom({
  key: 'TYPE_STATE',
  default: defaultValueSelectorFactory('type'),
})

export const testState = atom({
  key: 'TEST_STATE',
  default: defaultValueSelectorFactory('test'),
})

export const langState = atom({
  key: 'LANG_STATE',
  default: defaultValueSelectorFactory('lang'),
})

export const buildState = atom({
  key: 'BUILD_STATE',
  default: defaultValueSelectorFactory('build'),
})

export const javaVersionState = atom({
  key: 'JAVA_VERSION_STATE',
  default: defaultValueSelectorFactory('javaVersion'),
})

export const featuresState = atom({
  key: 'FEATURES_STATE',
  default: defaultValueSelectorFactory('features', []),
})
// End Form Data

export const availableFeaturesState = selector({
  key: 'FEATURES_FOR_TYPE_STATE',
  get: async ({ get }) => {
    const sdk = get(sdkState)
    const type = get(appTypeState)
    if (!sdk || !type) return []
    const { features } = await sdk.features({ type })
    return features
  },
})

export const starterFormState = selector({
  key: 'STARTER_FORM_STATE',
  get: ({ get }) => {
    const type = get(appTypeState)
    const name = get(nameState)
    const pkg = get(packageState)
    const build = get(buildState)
    const lang = get(langState)
    const test = get(testState)
    const javaVersion = get(javaVersionState)
    const features = get(featuresState)

    // This technically causes a side effect,
    // but done here since selectors don't support
    // recoil effects.
    return setStorageValue(INITIAL_FORM_DATA_STORAGE_KEY, {
      type,
      name,
      package: pkg,
      javaVersion,
      lang,
      build,
      test,
      features,
    })
  },
})

export const createCommandState = selector({
  key: 'CREATE_COMMAND_STATE',
  get: ({ get }) => {
    const form = get(starterFormState)
    const baseUrl = get(baseUrlState)
    return StarterSDK.createCommand(form, baseUrl)
  },
})

export const sharableLinkState = selector({
  key: 'SHARABLE_LINK_STATE',
  get: ({ get }) => {
    const form = get(starterFormState)
    const selectedVersion = get(selectedVersionState)
    return sharableLink(form, selectedVersion?.version)
  },
})

//----------------------
// State Hooks
//---------------------
const useDerivedDefultsEffect = (select, setter) => {
  useEffect(() => {
    if (!select) return
    const { defaultOption, options } = select
    setter((value) => {
      if (!value) return defaultOption.value
      const idx = options.findIndex((v) => v.value === value)
      if (idx < 0) return defaultOption.value
      return value
    })
  }, [select, setter])
}

export function useCurrenSdk() {
  return useRecoilValue(sdkState)
}

export function useInitialData() {
  return useRecoilValue(initialValueState)
}

export function useSharableLink() {
  return useRecoilValue(sharableLinkState)
}

export function useAvailableVersions() {
  return useRecoilValue(availableVersionsState)
}

export function useAvailableFeatures() {
  const loadable = useRecoilValueLoadable(availableFeaturesState)
  switch (loadable.state) {
    case 'hasValue':
      return { features: loadable.contents, loading: false, error: null }
    case 'loading':
      return { features: [], loading: true, error: null }
    default:
      return { features: [], loading: false, error: loadable.contents }
  }
}

export function useSelectedVersions() {
  const [value, setter] = useRecoilState(selectedVersionState)
  const defaultVersion = useRecoilValue(initialValueState).version
  const options = useAvailableVersions()
  useEffect(() => {
    if (!value) {
      let idx = Math.max(
        0,
        options.findIndex((opt) => opt.version === defaultVersion)
      )
      setter(options[idx])
    }
  }, [value, setter, options, defaultVersion])
  return [value, setter, options]
}

export function useConfigureInitialVersionEffect(onError) {
  const [value, setter] = useRecoilState(selectedVersionState)
  const options = useAvailableVersions()
  const { version: defaultVersion } = useRecoilValue(initialValueState)

  return useEffect(() => {
    if (!value && options?.length) {
      const idx = options.findIndex((opt) => opt.version === defaultVersion)
      if (defaultVersion && idx < 0) {
        onError({ requested: defaultVersion, using: options[0].version })
      }
      setter(options[Math.max(idx, 0)])
    }
  }, [value, setter, options, onError, defaultVersion])
}

export function useSelectedFeatures() {
  const [value, setter] = useRecoilState(featuresState)
  const { features, loading } = useAvailableFeatures()
  return [value, setter, features, loading]
}

export function useSelectedFeaturesValue() {
  return useRecoilValue(featuresState)
}

export function useSelectedFeaturesHandlers() {
  const setFeatures = useSetRecoilState(featuresState)
  return useMemo(() => {
    const onAddFeature = (feature) => {
      setFeatures(({ ...draft }) => {
        draft[feature.name] = feature
        return draft
      })
    }

    const onRemoveFeature = (feature) => {
      setFeatures(({ ...draft }) => {
        delete draft[feature.name]
        return draft
      })
    }

    const onRemoveAllFeatures = () => {
      setFeatures({})
    }
    return { onAddFeature, onRemoveFeature, onRemoveAllFeatures }
  }, [setFeatures])
}

export const useAppName = () => useRecoilState(nameState)
export const useAppPackage = () => useRecoilState(packageState)

const useSelectOptionsForType = (key) => {
  const loadable = useRecoilValueLoadable(optionsForState(key))
  switch (loadable.state) {
    case 'hasValue':
      return loadable.contents
    default:
      return null
  }
}

export const useApplicationType = () => {
  const [value, setter] = useRecoilState(appTypeState)
  const select = useSelectOptionsForType('type')
  useDerivedDefultsEffect(select, setter)
  return [value, setter, select]
}

export const useTestFramework = () => {
  const [value, setter] = useRecoilState(testState)
  const select = useSelectOptionsForType('test')
  useDerivedDefultsEffect(select, setter)
  return [value, setter, select]
}

export const useLanguage = () => {
  const [value, setter] = useRecoilState(langState)
  const select = useSelectOptionsForType('lang')
  useDerivedDefultsEffect(select, setter)
  return [value, setter, select]
}

export const useBuild = () => {
  const [value, setter] = useRecoilState(buildState)
  const select = useSelectOptionsForType('build')
  useDerivedDefultsEffect(select, setter)
  return [value, setter, select]
}

export const useJavaVersion = () => {
  const [value, setter] = useRecoilState(javaVersionState)
  const select = useSelectOptionsForType('jdkVersion')
  useDerivedDefultsEffect(select, setter)
  return [value, setter, select]
}

export const useStarterForm = () => {
  return useRecoilValue(starterFormState)
}

export const useCreateCommand = () => {
  return useRecoilValue(createCommandState)
}

export const useGetStarterForm = () => {
  return useRecoilCallback(({ snapshot }) => async () => {
    const createPayload = await snapshot.getPromise(starterFormState)
    const sdk = await snapshot.getPromise(sdkState)
    return { createPayload, sdk }
  })
}

export const useResetStarterForm = () => {
  return useRecoilCallback(({ set, snapshot }) => async () => {
    const options = await snapshot.getPromise(optionsState)
    const resets = formResets({})

    set(nameState, resets.name)
    set(packageState, resets.package)

    set(appTypeState, options.type.defaultOption.value)
    set(buildState, options.build.defaultOption.value)
    set(langState, options.lang.defaultOption.value)
    set(testState, options.test.defaultOption.value)
    set(javaVersionState, options.jdkVersion.defaultOption.value)
    set(featuresState, {})
  })
}
