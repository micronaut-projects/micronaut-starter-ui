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
import GenerateButtons from './components/GenerateButtons'
import Header from './components/Header'
import NextSteps from './components/NextSteps'
import StarterForm from './components/StarterForm'
import Footer from './components/Footer'

import { API_URL, SNAPSHOT_API_URL } from './constants'

import useAppTheme from './hooks/useAppTheme'
import useLocalStorage from './hooks/useLocalStorage'
import useMicronautSdk from './hooks/useMicronautSdk'
import { MicronautStarterSDK } from './micronaut'

import { downloadBlob, makeNodeTree } from './utility'

import './style.css'
import './styles/button-row.css'
import './styles/modal-overrides.css'
import './styles/font-overrides.css'
import './styles/utility.css'

import { parseQuery } from './helpers/url'

const formResets = () => ({
  name: 'demo',
  package: 'com.example',
  type: 'DEFAULT',
})

const initialForm = (queryData) => {
  const { type, javaVersion, lang, build, test } = queryData
  return {
    ...formResets(),
    type: type || 'DEFAULT',
    javaVersion: javaVersion || '',
    lang,
    build,
    test,
  }
}

const EMPTY_VERSIONS = []
export default function App() {
  const queryData = useRef(parseQuery(window.location.search))

  const [form, setForm] = useLocalStorage(
    'INITIAL_FORM_DATA',
    initialForm(queryData.current),
    !!queryData.current.type
  )

  const [availableVersions, setAvailableVersions] = useState(EMPTY_VERSIONS)
  const [micronautApi, setMicronautApi] = useState(false)
  const sdk = useMicronautSdk(micronautApi)

  const [featuresAvailable, setFeaturesAvailable] = useState([])
  const [featuresSelected, setFeaturesSelected] = useState(
    MicronautStarterSDK.reconstructFeatures(queryData.current.features)
  )
  const [initializationAttempted, setInitializationAttempted] = useState(false)

  const [loadingFeatures, setLoadingFeatures] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [preview, setPreview] = useState({})
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
  const previewButton = useRef()
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
    const { error, htmlUrl } = queryData.current
    return !!error || !!htmlUrl || false
  })

  useEffect(() => {
    const [baseUrl] = window.location.toString().split('?', 2)
    const { error, htmlUrl, cloneUrl } = queryData.current
    if (!error && !htmlUrl) {
      return // nothing more to do
    }
    window.history.replaceState({}, document.title, baseUrl)
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

  // Create Feat
  const generateProject = async (e) => {
    requestPrep(e)
    try {
      const blob = await sdk.create(createPayload)
      downloadBlob(blob, `${form.name}.zip`)
      setNextStepsInfo({ show: true, type: 'zip' })
    } catch (error) {
      await handleResponseError(error)
    } finally {
      setDownloading(false)
    }
  }

  const routePreview = useCallback(async (payload, mnSdk) => {
    try {
      const json = await mnSdk.preview(payload)
      const nodes = makeNodeTree(json.contents)
      setPreview(nodes)
      previewButton.current.props.onClick()
    } catch (error) {
      await handleResponseError(error)
    } finally {
      setDownloading(false)
    }
  }, [])

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
      const route = queryData.current.route || ''
      if (!route) return

      // Remove the route
      delete queryData.current.route

      // This is a common react problem
      // Since we have to wait for the SDK to get initialized
      // but can't watch the create / features objects,
      // we need to rebuild at routing time.
      const features = MicronautStarterSDK.reconstructFeatures(
        queryData.current.features
      )
      const create = {
        ...initialForm(queryData.current),
        features,
      }

      switch (route.toUpperCase()) {
        case 'PREVIEW':
          return routePreview(create, sdk)
        case 'DIFF':
          return routeDiff(create, sdk)
        default:
          break
      }
    }
    if (sdk) {
      handleDeepLink()
    }
  }, [sdk, routePreview, routeDiff])

  // Preview Feat
  const loadPreview = (e) => {
    requestPrep(e)
    routePreview(createPayload, sdk)
  }

  const clearPreview = () => {
    setPreview({})
  }

  // Diff Feat
  const loadDiff = async (e) => {
    requestPrep(e)
    routeDiff(createPayload, sdk)
  }

  const clearDiff = () => {
    setDiff(null)
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
                    onLoad={loadDiff}
                    onClose={clearDiff}
                    disabled={disabled}
                  />
                </Col>
                <Col s={3} className="xs6">
                  <CodePreview
                    ref={previewButton}
                    theme={theme}
                    preview={preview}
                    lang={form.lang}
                    build={form.build}
                    onLoad={loadPreview}
                    onClose={clearPreview}
                    disabled={disabled}
                  />
                </Col>
                <Col s={3} className="xs6">
                  <GenerateButtons
                    theme={theme}
                    disabled={disabled}
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
