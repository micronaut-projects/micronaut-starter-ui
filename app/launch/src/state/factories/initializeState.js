import { ACTIVITY_KEY, isDeepLinkReferral } from '../../helpers/Routing'
import { getStorageValue } from '../../hooks/useLocalStorage'
import { initialValueState } from '../store'
import { formResets } from './formResets'
import { initialValueGenerator, providedDefaults } from './providedDefaults'
import { StarterSDK } from './StarterSDK'

export const INITIAL_FORM_DATA_STORAGE_KEY = 'INITIAL_FORM_DATA'

const initialForm = (initialData) => {
  const { javaVersion, lang, build, test, features } = initialData
  const parsed = {
    javaVersion: typeof javaVersion === 'string' ? javaVersion : '', // This is specifically "" to work with the SelectOption component
    lang: typeof lang === 'string' ? lang : '',
    build: typeof build === 'string' ? build : '',
    test: typeof test === 'string' ? test : '',
    features: StarterSDK.reconstructFeatures(features),
    [ACTIVITY_KEY]: initialData[ACTIVITY_KEY],
  }
  return {
    ...parsed,
    ...formResets(initialData),
  }
}

function initialVersionResolver(query = {}) {
  const { version } = query
  return {
    // Non Form
    version: version ?? getStorageValue('SELECTED_MN_VERSION', null)?.version,
  }
}

function extractAccessoryData(query = {}) {
  const { debug, cloneUrl, htmlUrl, error, showing } = query
  return {
    // Clone To GH Related Keys
    cloneUrl,
    htmlUrl,
    error,

    // Code Preview Related Keys
    showing,

    // Dev Keys
    debug,
  }
}

export const initializeStateFactory =
  (initialData) =>
  ({ set }) => {
    const query = providedDefaults()
    const isReferral = isDeepLinkReferral(query)
    const initialValueData = initialValueGenerator(
      INITIAL_FORM_DATA_STORAGE_KEY,
      initialForm(query),
      isReferral
    )
    const accessory = extractAccessoryData(query)
    const versionData = initialVersionResolver(query)
    const init = Object.assign(
      {},
      initialValueData,
      accessory,
      versionData,
      initialData
    )

    set(initialValueState, init)
  }
