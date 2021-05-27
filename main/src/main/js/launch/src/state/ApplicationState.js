import { RecoilRoot } from 'recoil'

import { ACTIVITY_KEY, isDeepLinkReferral } from '../helpers/Routing'
import { getStorageValue } from '../hooks/useLocalStorage'
import { formResets } from './factories/formResets'
import {
  initialValueGenerator,
  providedDefaults,
} from './factories/providedDefaults'
import { StarterSDK } from './factories/StarterSDK'

import { initialValueState } from './store'

const INITIAL_FORM_DATA_STORAGE_KEY = 'INITIAL_FORM_DATA'

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

function extractAccessoryData(query = {}) {
  const { debug, cloneUrl, htmlUrl, error, version } = query
  return {
    version: version ?? getStorageValue('SELECTED_MN_VERSION', null)?.version,
    debug,
    cloneUrl,
    htmlUrl,
    error,
  }
}

export default function ApplicationState({ initialData, children }) {
  function initializeState({ set }) {
    const query = providedDefaults()
    const isReferral = isDeepLinkReferral(query)
    const initialValueData = initialValueGenerator(
      INITIAL_FORM_DATA_STORAGE_KEY,
      initialForm(query),
      isReferral
    )
    const accessory = extractAccessoryData(query)
    const init = Object.assign({}, initialValueData, accessory, initialData)

    set(initialValueState, init)
  }

  return <RecoilRoot initializeState={initializeState}>{children}</RecoilRoot>
}
