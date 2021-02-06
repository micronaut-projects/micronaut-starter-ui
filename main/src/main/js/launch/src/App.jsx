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

import { API_URL, SNAPSHOT_API_URL } from './constants'

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
} from './helpers/Routing'

import { downloadBlob } from './utility'

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

const EMPTY_VERSIONS = []
export default function App() {
  const shareData = useRef(parseAndConsumeQuery())

  const [form, setForm] = useLocalStorage(
    'INITIAL_FORM_DATA',
    initialForm(shareData.current),
    isDeepLinkReferral(shareData.current) // This will cause useLocalStorage to ignore on the first pass, since we're loading from a deepLink
  )

  const [availableVersions, setAvailableVersions] = useState(EMPTY_VERSIONS)
  const [micronautApi, setMicronautApi] = useState(false)
  const sdk = useMicronautSdk(micronautApi)

  const [featuresAvailable, setFeaturesAvailable] = useState([])
  const [featuresSelected, setFeaturesSelected] = useState(
    MicronautStarterSDK.reconstructFeatures(shareData.current.features)
  )
  const [initializationAttempted, setInitializationAttempted] = useState(false)

  const [loadingFeatures, setLoadingFeatures] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [diff, setDiff] = useState(null)

  const [nextStepsInfo, setNextStepsInfo] = useState({})

  // Error Handling
  const [error, setError] = useState(ErrorViewData.ofSuccess(''))
  const hasError = Boolean(error.message)
  const handleResponseError = async (response) => {
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
  }

  const [theme, toggleTheme] = useAppTheme()
  const previewView = useRef()
  const diffButton = useRef()

  const disabled =
    !initializationAttempted ||
    downloading ||
    loadingFeatures ||
    !form.name ||
    !form.package

  const appType = form.type

  // creates a watchable primitive to include in the useEffect deps
  const apiUrl = useMemo(() => {
    const version = availableVersions.find((v) => {
      return micronautApi === v.api
    })
    return version ? version.api : null
  }, [micronautApi, availableVersions])

  const [ready, setReady] = useState(() => {
    const { error, htmlUrl } = shareData.current
    return !!error || !!htmlUrl || false
  })

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

  useEffect(() => {
    const retrieveVersion = async (baseUrl) => {
      const mn = new MicronautStarterSDK({ baseUrl })
      const result = await mn.versions()
      const ver = result.versions['micronaut.version']
      return {
        label: ver,
        value: baseUrl,
        api: baseUrl,
      }
    }

    const initializeForm = async () => {
      setDownloading(true)
      try {
        const versions = (
          await Promise.all([
            retrieveVersion(API_URL).catch((i) => null),
            retrieveVersion(SNAPSHOT_API_URL).catch((i) => null),
          ])
        ).filter((i) => i)

        setAvailableVersions(versions ? versions : EMPTY_VERSIONS)
        setMicronautApi((micronautApi) =>
          Array.isArray(versions) && versions.length > 0
            ? (versions.find((v) => v.value === micronautApi) || versions[0])
                .value
            : false
        )
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
  }, [initializationAttempted, downloading, setMicronautApi])

  useEffect(() => {
    const loadFeatures = async () => {
      setLoadingFeatures(true)
      setError(ErrorViewData.ofNone())
      try {
        const data = await sdk.features({ type: appType })
        setFeaturesAvailable(data.features)
      } catch (error) {
        await handleResponseError(error)
      } finally {
        setLoadingFeatures(false)
      }
    }
    if (initializationAttempted && apiUrl) {
      loadFeatures()
    }
  }, [sdk, appType, apiUrl, initializationAttempted])

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

  const requestPrep = (event) => {
    if (event && event.preventDefault instanceof Function) {
      event.preventDefault()
    }
    setError(ErrorViewData.ofNone())
    setDownloading(true)
  }

  // GitHub Clone Feat
  const cloneProject = async (e) => {
    setDownloading(true)
  }

  const createPayload = { ...form, features: featuresSelected }

  // GitHub Create Ref
  const gitHubCreateHref = MicronautStarterSDK.githubHrefForUrl(
    apiUrl,
    createPayload
  )

  const sharable = useMemo(() => sharableLink(form, featuresSelected), [
    featuresSelected,
    form,
  ])

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
        previewView.current.show(opts.showing, json)
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
      setDiff(text)
      diffButton.current.props.onClick()
    } catch (error) {
      await handleResponseError(error)
    } finally {
      setDownloading(false)
    }
  }, [])

  useEffect(() => {
    function handleDeepLink() {
      const route = resolveActionRoute(shareData.current)
      if (!route) {
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
        !Object.keys(handlers).includes(route)
      ) {
        // Push back and return
        resetRoute()
        return
      }

      const { showing } = shareData.current
      // Remove the route
      delete shareData.current.route
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

      handlers[route](payload, sdk, { showing })
    }
    if (sdk) {
      handleDeepLink()
    }
  }, [sdk, routePreview, routeDiff, routeCreate])

  // Create Feat
  const generateProject = (e) => {
    routeCreate(createPayload, sdk)
    requestPrep(e)
  }

  // Preview Feat
  const loadPreview = (e) => {
    requestPrep(e)
    routePreview(createPayload, sdk)
  }

  const clearPreview = () => {
    resetRoute()
  }

  // Diff Feat
  const loadDiff = async (e) => {
    requestPrep(e)
    routeDiff(createPayload, sdk)
  }

  const clearDiff = () => {
    setDiff(null)
    resetRoute()
  }

  const onStartOver = () => {
    setForm((form) => ({ ...form, ...formResets() }))
    removeAllFeatures()
    setNextStepsInfo({})
  }

  const onCloseNextSteps = () => {
    setNextStepsInfo({})
  }

  return (
    <Fragment>
      <div id="mn-main-container" className="mn-main-container sticky">
        <div className="container">
          <Header theme={theme} onToggleTheme={toggleTheme} />

          <div className="mn-container">
            <form onSubmit={generateProject} autoComplete="off">
              <StarterForm
                theme={theme}
                versions={availableVersions}
                micronautApi={micronautApi}
                setMicronautApi={setMicronautApi}
                setForm={setForm}
                form={form}
                ready={ready}
                onReady={setReady}
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
                    ref={diffButton}
                    theme={theme}
                    diff={diff}
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
                    gitHubCreateHref={gitHubCreateHref}
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
