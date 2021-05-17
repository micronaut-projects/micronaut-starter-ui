import React, {
  Fragment,
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from 'react'
import { ProgressBar } from 'react-materialize'
import Col from 'react-materialize/lib/Col'

import Row from 'react-materialize/lib/Row'

import {
  FeatureSelectorModal,
  FeatureSelectedList,
} from './components/FeatureSelector'
import CodePreview from './components/CodePreview'
import Diff from './components/Diff'
import ErrorView, { ErrorViewData } from './components/ErrorView'
import GenerateButtons from './components/GenerateButtons/GenerateButtons'
import Header from './components/Header'
import NextSteps from './components/NextSteps'
import StarterForm from './components/StarterForm'
import Footer from './components/Footer'

import useAppTheme from './hooks/useAppTheme'
import useLocalStorage from './hooks/useLocalStorage'
import useMicronautSdk from './hooks/useMicronautSdk'
import { MicronautStarterSDK } from './micronaut'

import {
  resetRoute,
  resolveActionRoute,
  isDeepLinkReferral,
  parseAndConsumeQuery,
  sharableLink,
  ACTIVITY_KEY,
} from './helpers/Routing'

import { downloadBlob } from './utility'
import Lang from './helpers/Lang'

function formResets(fallbacks = {}) {
  const { name, package: pkg, type } = fallbacks
  return {
    name: typeof name === 'string' ? name : 'demo',
    package: typeof pkg === 'string' ? pkg : 'com.example',
    type: typeof type === 'string' ? type : 'DEFAULT',
  }
}

const initialForm = (shareData) => {
  const { javaVersion, lang, build, test } = shareData
  const parsed = {
    javaVersion: typeof javaVersion === 'string' ? javaVersion : '', // This is specifically "" to work with the SelectOption component
    lang: typeof lang === 'string' ? lang : null,
    build: typeof build === 'string' ? build : null,
    test: typeof test === 'string' ? test : null,
  }
  return {
    ...parsed,
    ...formResets(shareData),
  }
}

export default function App() {
  // Refs
  const previewView = useRef()
  const diffView = useRef()
  const shareData = useRef(parseAndConsumeQuery())

  // UI
  const [theme, toggleTheme] = useAppTheme()

  // Form Data
  const [form, setForm] = useLocalStorage(
    'INITIAL_FORM_DATA',
    initialForm(shareData.current),
    isDeepLinkReferral(shareData.current) // This will cause useLocalStorage to ignore on the first pass, since we're loading from a deepLink
  )

  // Available Features State
  const [featuresAvailable, setFeaturesAvailable] = useState([])
  const [featuresSelected, setFeaturesSelected] = useState(
    MicronautStarterSDK.reconstructFeatures(shareData.current.features)
  )
  const [loadingFeatures, setLoadingFeatures] = useState(false)
  const [nextStepsInfo, setNextStepsInfo] = useState({})

  // Processing State
  const [downloading, setDownloading] = useState(false)
  const [initializationAttempted, setInitializationAttempted] = useState(false)

  // Version & SDK State
  const [availableVersions, setAvailableVersions] = useState([])
  const [selectedVersion, setSelectedVersion] = useLocalStorage(
    'SELECTED_MN_VERSION',
    null,
    isDeepLinkReferral(shareData.current)
  )

  const apiUrl = selectedVersion?.api // creates a watchable primitive to include in the useEffect deps
  const sdk = useMicronautSdk(apiUrl)

  // Error Handling
  const [error, setError] = useState(ErrorViewData.ofSuccess(''))
  const hasError = Boolean(error.message)
  const handleResponseError = useCallback(async (response) => {
    if (response instanceof Error) {
      return setError(new ErrorViewData(response))
    }
    const payload = ErrorViewData.ofError('something went wrong.')
    if (!response.json instanceof Function) {
      return setError(payload)
    }
    try {
      const json = await response.json()
      const message = json.message || payload.message
      setError(ErrorViewData.ofError(message))
    } catch (e) {
      setError(payload)
    }
  }, [])

  // Use Effect Hook For Error Handling and
  // GitHub on complete callback
  useEffect(() => {
    const { error, htmlUrl, cloneUrl } = shareData.current
    if (!error && !htmlUrl) {
      return // nothing more to do
    }
    resetRoute()
    setTimeout(() => {
      if (cloneUrl) {
        setNextStepsInfo({
          cloneUrl,
          htmlUrl,
          show: true,
          type: 'clone',
        })
      } else if (error) {
        setError(ErrorViewData.ofError(error.replaceAll('+', ' ')))
      }
    }, 500)
  }, [])

  // Use Effect to Load the Micrionaut Version data
  // From each remote source
  useEffect(() => {
    const checkRequestedVersion = (hasVersions, versions) => {
      const requestedVersion = shareData.current.version
      if (hasVersions && requestedVersion) {
        const match = versions.find((v) => v.version === requestedVersion)
        if (!match) {
          const message = Lang.trans('error.versionNoLongerSupported', {
            requestedVersion,
            currentVersion: versions[0].version,
          })
          setError(ErrorViewData.ofWarn(message))
        }
      }
    }

    const initializeForm = async () => {
      setDownloading(true)
      try {
        const versions = await MicronautStarterSDK.loadVersions()
        const hasVersions = Array.isArray(versions) && versions.length > 0

        setAvailableVersions(versions)
        checkRequestedVersion(hasVersions, versions)

        hasVersions &&
          setSelectedVersion((version) => {
            return (
              versions.find((v) => v.version === version?.version) ||
              versions.find((v) => v.version === shareData.current.version) ||
              versions[0]
            )
          })
      } catch (error) {
        await handleResponseError(error)
      } finally {
        setInitializationAttempted(true)
        setDownloading(false)
      }
    }
    if (!initializationAttempted && !downloading) {
      initializeForm()
    }
  }, [initializationAttempted, downloading, setSelectedVersion])

  // Use Effect to load the features based on the form.type [DEFAULT, CLI, etc...]
  // And the baseUrl of the sdk. Only trying if initialized
  useEffect(() => {
    const loadFeatures = async () => {
      setLoadingFeatures(true)
      try {
        const data = await sdk.features({ type: form.type })
        setFeaturesAvailable(data.features)
      } catch (error) {
        await handleResponseError(error)
      } finally {
        setLoadingFeatures(false)
      }
    }
    if (initializationAttempted && sdk?.baseUrl) {
      loadFeatures()
    }
  }, [sdk, form.type, initializationAttempted])

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

  // GitHub Clone Feat
  const cloneProject = async (e) => {
    setDownloading(true)
  }

  const createPayload = { ...form, features: featuresSelected }

  const sharable = useMemo(() => {
    const version = availableVersions.find((version) => version.api === apiUrl)
    return sharableLink(form, featuresSelected, version && version.version)
  }, [featuresSelected, form, apiUrl, availableVersions])

  // Routing
  const routeCreate = useCallback(async (payload, mnSdk) => {
    try {
      const blob = await mnSdk.create(payload)
      downloadBlob(blob, `${payload.name}.zip`)
      setNextStepsInfo({ show: true, type: 'zip' })
    } catch (error) {
      await handleResponseError(error)
    } finally {
      setDownloading(false)
    }
  }, [])

  const routePreview = useCallback(
    async (payload, mnSdk, opts = { showing: null }) => {
      try {
        const json = await mnSdk.preview(payload)
        previewView.current.show(json, opts.showing)
      } catch (error) {
        await handleResponseError(error)
      } finally {
        setDownloading(false)
      }
    },
    []
  )

  const routeDiff = useCallback(async (payload, mnSdk) => {
    try {
      const text = await mnSdk.diff(payload)
      if (text === '') {
        throw new Error(
          'No features have been selected. Please choose one or more features and try again.'
        )
      }
      diffView.current.show(text)
    } catch (error) {
      await handleResponseError(error)
    } finally {
      setDownloading(false)
    }
  }, [])

  // Deep Linking
  useEffect(() => {
    function handleDeepLink() {
      const activity = resolveActionRoute(shareData.current)
      if (!activity) {
        return
      }

      const handlers = {
        preview: routePreview,
        diff: routeDiff,
        create: routeCreate,
      }

      // If we're not able to handle the route,
      // discard and reset the history state
      if (
        !isDeepLinkReferral(shareData.current) ||
        !Object.keys(handlers).includes(activity)
      ) {
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

      handlers[activity](payload, sdk, { showing })
    }
    if (sdk?.baseUrl) {
      handleDeepLink()
    }
  }, [sdk, routePreview, routeDiff, routeCreate])

  // Preflight for any async activity
  const requestPrep = (event) => {
    if (event && event.preventDefault instanceof Function) {
      event.preventDefault()
    }
    setError(ErrorViewData.ofNone())
    setDownloading(true)
  }

  // Create Feat
  const generateProject = (e) => {
    requestPrep(e)
    routeCreate(createPayload, sdk)
  }

  // Preview Feat
  const loadPreview = (e) => {
    requestPrep(e)
    routePreview(createPayload, sdk)
  }
  const clearPreview = () => resetRoute()

  // Diff Feat
  const loadDiff = async (e) => {
    requestPrep(e)
    routeDiff(createPayload, sdk)
  }
  const clearDiff = () => resetRoute()

  // Start Over
  const onStartOver = () => {
    setForm((form) => ({ ...form, ...formResets() }))
    removeAllFeatures()
    onCloseNextSteps()
  }

  // Next Steps
  const onCloseNextSteps = () => setNextStepsInfo({})

  const disabled =
    !initializationAttempted ||
    downloading ||
    loadingFeatures ||
    !form.name ||
    !form.package

  return (
    <Fragment>
      <div id="mn-main-container" className="mn-main-container sticky">
        <div className="container">
          <Header
            theme={theme}
            onToggleTheme={toggleTheme}
            sharable={sharable}
          />

          <div className="mn-container">
            <form onSubmit={generateProject} autoComplete="off">
              <StarterForm
                theme={theme}
                versions={availableVersions}
                selectedVersion={selectedVersion}
                setSelectedVersion={setSelectedVersion}
                setForm={setForm}
                form={form}
                onError={handleResponseError}
              />

              <Row className="button-row">
                <Col s={3} className="xs6">
                  <FeatureSelectorModal
                    theme={theme}
                    loading={loadingFeatures}
                    features={featuresAvailable}
                    selectedFeatures={featuresSelected}
                    onAddFeature={addFeature}
                    onRemoveFeature={removeFeature}
                    onRemoveAllFeatures={removeAllFeatures}
                  />
                </Col>
                <Col s={3} className="xs6">
                  <Diff
                    ref={diffView}
                    theme={theme}
                    lang={form.lang}
                    build={form.build}
                    disabled={disabled}
                    sharable={sharable}
                    onLoad={loadDiff}
                    onClose={clearDiff}
                  />
                </Col>
                <Col s={3} className="xs6">
                  <CodePreview
                    ref={previewView}
                    theme={theme}
                    lang={form.lang}
                    build={form.build}
                    sharable={sharable}
                    disabled={disabled}
                    onLoad={loadPreview}
                    onClose={clearPreview}
                  />
                </Col>
                <Col s={3} className="xs6">
                  <GenerateButtons
                    theme={theme}
                    disabled={disabled}
                    sharable={sharable}
                    cloneProject={cloneProject}
                    generateProject={generateProject}
                    createPayload={createPayload}
                    baseUrl={apiUrl}
                  />
                </Col>
              </Row>
            </form>
            <div className="progress-container">
              {downloading && <ProgressBar />}
            </div>
          </div>
        </div>
      </div>
      <div className="container mn-feature-container">
        <FeatureSelectedList
          theme={theme}
          selectedFeatures={featuresSelected}
          onRemoveFeature={removeFeature}
        />
      </div>
      <Footer />
      {nextStepsInfo.show && (
        <NextSteps
          onClose={onCloseNextSteps}
          onStartOver={onStartOver}
          info={nextStepsInfo}
          theme={theme}
          name={form.name}
          buildTool={form.build}
        />
      )}
      <ErrorView
        hasError={hasError}
        severity={error.severity}
        message={error.message}
        link={error.link}
        clipboard={error.clipboard}
        onClose={() => setError(ErrorViewData.ofNone())}
      />
    </Fragment>
  )
}
