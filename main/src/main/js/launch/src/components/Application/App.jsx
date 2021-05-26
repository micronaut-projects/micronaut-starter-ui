import React, { Fragment, useState, useRef, useMemo, useCallback } from 'react'
import { ProgressBar } from 'react-materialize'
import Col from 'react-materialize/lib/Col'

import Row from 'react-materialize/lib/Row'

import useAppTheme from '../../hooks/useAppTheme'

import { resetRoute } from '../../helpers/Routing'
import { downloadBlob } from '../../utility'

import { FeatureSelectorModal } from '../FeatureSelector'
import CodePreview from '../CodePreview'
import Diff from '../Diff'
import ErrorView, { ErrorViewData } from '../ErrorView'
import GenerateButtons from '../GenerateButtons/GenerateButtons'
import Header from '../Header'
import NextSteps from '../NextSteps'
import StarterForm from '../StarterForm'
import Footer from '../Footer'
import { FeatureSelectedList } from '../FeatureSelector/FeatureSelected'

import {
  useHandleShareLinkEffect,
  useOnInitialLoadEffect,
} from './useApplicationForm'

import { errorHandlersFactory } from '../ErrorView/ErrorViewData'
import {
  useGetStarterForm,
  useInitialData,
  useInitializeVersionEffect,
  useResetStarterForm,
} from '../../state/store'

import ApplicationState from '../../state/ApplicationState'
import Lang from '../../helpers/Lang'
import { AppLoadingBackdrop } from './AppLoadingBackdrop'



export default function Root() {
  return (
    <ApplicationState>
      <App />
    </ApplicationState>
  )
}

export function App() {
  const initialData = useInitialData()
  // Error Handling
  const [error, setError] = useState(ErrorViewData.ofSuccess(''))
  const hasError = Boolean(error.message)

  const errorHandlers = useMemo(() => {
    return errorHandlersFactory(setError)
  }, [setError])

  return (
    <React.Suspense fallback={<AppLoadingBackdrop />}>
      <AppContainer initialData={initialData} errorHandlers={errorHandlers} />
      <ErrorView
        hasError={hasError}
        severity={error.severity}
        message={error.message}
        link={error.link}
        clipboard={error.clipboard}
        onClose={errorHandlers.onClear}
      />
    </React.Suspense>
  )
}

export function AppContainer({ initialData, errorHandlers }) {
  // Refs
  const previewView = useRef()
  const diffView = useRef()

  // UI
  const [theme, toggleTheme] = useAppTheme()
  const [loading, setLoading] = useState(false)

  // Next Steps
  const [nextStepsInfo, setNextStepsInfo] = useState({})
  const onCloseNextSteps = () => setNextStepsInfo({})
  // Start Over
  const resetForm = useResetStarterForm()
  const onStartOver = () => {
    onCloseNextSteps()
    resetForm()
  }

  
  useInitializeVersionEffect(
    useCallback(
      ({ requested, using }) => {
        const message = Lang.trans('error.versionNoLongerSupported', {
          requestedVersion: requested,
          currentVersion: using,
        })
        errorHandlers.onWarn(message)
      },
      [errorHandlers]
    )
  )

  // Routing
  const routingHandlers = useMemo(() => {
    return {
      onCloned: (repoCreatedInfo) => {
        setNextStepsInfo(repoCreatedInfo)
      },

      preview: async (payload, sdk, opts = { showing: null }) => {
        try {
          const json = await sdk.preview(payload)
          previewView.current.show(json, opts.showing)
        } catch (error) {
          errorHandlers.onResponseError(error)
        } finally {
          setLoading(false)
        }
      },

      diff: async (payload, sdk) => {
        try {
          const text = await sdk.diff(payload)
          if (text === '') {
            throw new Error(
              'No features have been selected. Please choose one or more features and try again.'
            )
          }
          diffView.current.show(text)
        } catch (error) {
          errorHandlers.onResponseError(error)
        } finally {
          setLoading(false)
        }
      },

      create: async (payload, sdk) => {
        try {
          const blob = await sdk.create(payload)
          downloadBlob(blob, `${payload.name}.zip`)
          setNextStepsInfo({ show: true, type: 'zip' })
        } catch (error) {
          errorHandlers.onResponseError(error)
        } finally {
          setLoading(false)
        }
      },
    }
  }, [errorHandlers])

  useOnInitialLoadEffect(
    initialData,
    routingHandlers.onCloned,
    errorHandlers.onError
  )
  // Share Initial Routing Routing
  useHandleShareLinkEffect(initialData, routingHandlers)

  // Preflight for any async activity
  const requestPrep = (event) => {
    if (event && event.preventDefault instanceof Function) {
      event.preventDefault()
    }
    errorHandlers.onClear()
    setLoading(true)
  }

  const getFormData = useGetStarterForm()
  // GitHub Clone Feat
  const cloneProject = async (e) => {
    setLoading(true)
  }

  // Create Feat
  const generateProject = async (e) => {
    requestPrep(e)
    const { createPayload, sdk } = await getFormData()
    routingHandlers.create(createPayload, sdk)
  }

  // Preview Feat
  const loadPreview = async (e) => {
    requestPrep(e)
    const { createPayload, sdk } = await getFormData()
    routingHandlers.preview(createPayload, sdk)
  }
  const clearPreview = () => resetRoute()

  // Diff Feat
  const loadDiff = async (e) => {
    requestPrep(e)
    const { createPayload, sdk } = await getFormData()
    routingHandlers.diff(createPayload, sdk)
  }
  const clearDiff = () => resetRoute()

  const disabled = loading

  return (
    <Fragment>
      <div id="mn-main-container" className="mn-main-container sticky">
        <div className="container">
          <Header theme={theme} onToggleTheme={toggleTheme} />

          <div className="mn-container">
            <form onSubmit={generateProject} autoComplete="off">
              <StarterForm
                theme={theme}
                onError={errorHandlers.onResponseError}
              />

              <Row className="button-row">
                <Col s={3} className="xs6">
                  <FeatureSelectorModal theme={theme} />
                </Col>
                <Col s={3} className="xs6">
                  <Diff
                    ref={diffView}
                    theme={theme}
                    disabled={disabled}
                    onLoad={loadDiff}
                    onClose={clearDiff}
                  />
                </Col>
                <Col s={3} className="xs6">
                  <CodePreview
                    ref={previewView}
                    theme={theme}
                    disabled={disabled}
                    onLoad={loadPreview}
                    onClose={clearPreview}
                  />
                </Col>
                <Col s={3} className="xs6">
                  <GenerateButtons
                    theme={theme}
                    disabled={disabled}
                    cloneProject={cloneProject}
                    generateProject={generateProject}
                  />
                </Col>
              </Row>
            </form>
            <div className="progress-container">
              {loading && <ProgressBar />}
            </div>
          </div>
        </div>
      </div>
      <div className="container mn-feature-container">
        <FeatureSelectedList theme={theme} />
      </div>
      <Footer />
      {nextStepsInfo.show && (
        <NextSteps
          onClose={onCloseNextSteps}
          onStartOver={onStartOver}
          info={nextStepsInfo}
          theme={theme}
        />
      )}
    </Fragment>
  )
}
