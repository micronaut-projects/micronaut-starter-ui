import React, { Fragment, useState, useRef, useMemo, useCallback } from 'react'
import { ProgressBar } from 'react-materialize'
import Col from 'react-materialize/lib/Col'

import Row from 'react-materialize/lib/Row'

import useAppTheme from '../../hooks/useAppTheme'
import useMicronautSdk from '../../hooks/useMicronautSdk'

import { parseAndConsumeQuery, resetRoute } from '../../helpers/Routing'
import { downloadBlob } from '../../utility'

import { FeatureSelectorModal, FeatureSelectedList } from '../FeatureSelector'
import CodePreview from '../CodePreview'
import Diff from '../Diff'
import ErrorView, { ErrorViewData } from '../ErrorView'
import GenerateButtons from '../GenerateButtons/GenerateButtons'
import Header from '../Header'
import NextSteps from '../NextSteps'
import StarterForm from '../StarterForm'
import Footer from '../Footer'

import {
  useApplicationForm,
  useFeaturesHandler,
  useHandleShareLinkEffect,
  useInitialVersionEffect,
  useOnInitialLoadEffect,
} from './useApplicationForm'

import {
  useAvailableFeatures,
  useAvailableVersions,
} from './useApplicationFormInitializer'
import { errorHandlersFactory } from '../ErrorView/ErrorViewData'

export default function App() {
  const shareData = useRef(parseAndConsumeQuery())

  const [loading, setLoading] = useState(false)

  // Error Handling
  const [error, setError] = useState(ErrorViewData.ofSuccess(''))
  const hasError = Boolean(error.message)

  const errorHandlers = useMemo(() => {
    return errorHandlersFactory(setError)
  }, [setError])

  const { availableVersions, initialized } = useAvailableVersions(
    setLoading,
    errorHandlers.onResponseError
  )

  return (
    <>
      <AppContainer
        initialData={shareData.current}
        availableVersions={availableVersions}
        initialized={initialized && !loading}
        errorHandlers={errorHandlers}
      />
      <ErrorView
        hasError={hasError}
        severity={error.severity}
        message={error.message}
        link={error.link}
        clipboard={error.clipboard}
        onClose={errorHandlers.onClear}
      />
    </>
  )
}

export function AppContainer({
  initialData,
  availableVersions,
  initialized,
  errorHandlers,
}) {
  // Refs
  const previewView = useRef()
  const diffView = useRef()

  // UI
  const [theme, toggleTheme] = useAppTheme()
  const [loading, setLoading] = useState(false)

  // Next Steps
  const [nextStepsInfo, setNextStepsInfo] = useState({})
  const onCloseNextSteps = () => setNextStepsInfo({})

  // Form Data
  const {
    form,
    setForm,
    selectedVersion,
    setSelectedVersion,
    selectedFeatures,
    setSelectedFeatures,
    resetHandlers,
    createPayload,
    sharable,
  } = useApplicationForm(initialData)
  const featureHandlers = useFeaturesHandler(setSelectedFeatures)

  useInitialVersionEffect(
    initialData.version,
    availableVersions,
    setSelectedVersion,
    errorHandlers.onWarn
  )

  // Selected API Related Data
  const apiUrl = selectedVersion?.api
  const sdk = useMicronautSdk(apiUrl)

  const { availableFeatures, loadingFeatures } = useAvailableFeatures(
    sdk,
    form.type,
    errorHandlers.onResponseError
  )

  // Routing
  const routingHandlers = useMemo(() => {
    return {
      preview: async (payload, mnSdk, opts = { showing: null }) => {
        try {
          const json = await mnSdk.preview(payload)
          previewView.current.show(json, opts.showing)
        } catch (error) {
          errorHandlers.onResponseError(error)
        } finally {
          setLoading(false)
        }
      },

      diff: async (payload, mnSdk) => {
        try {
          const text = await mnSdk.diff(payload)
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

      create: async (payload, mnSdk) => {
        try {
          const blob = await mnSdk.create(payload)
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

  // Handle Initial Load, and setting info if from a GH Repo Generation
  const onRepoCreated = useCallback((repoCreatedInfo) => {
    setNextStepsInfo(repoCreatedInfo)
  }, [])
  useOnInitialLoadEffect(initialData, onRepoCreated, errorHandlers.onError)

  // Share Initial Routing Routing
  useHandleShareLinkEffect(sdk, initialData, routingHandlers)

  // Preflight for any async activity
  const requestPrep = (event) => {
    if (event && event.preventDefault instanceof Function) {
      event.preventDefault()
    }
    errorHandlers.onClear()
    setLoading(true)
  }

  // GitHub Clone Feat
  const cloneProject = async (e) => {
    setLoading(true)
  }

  // Create Feat
  const generateProject = (e) => {
    requestPrep(e)
    routingHandlers.create(createPayload, sdk)
  }

  // Preview Feat
  const loadPreview = (e) => {
    requestPrep(e)
    routingHandlers.preview(createPayload, sdk)
  }
  const clearPreview = () => resetRoute()

  // Diff Feat
  const loadDiff = async (e) => {
    requestPrep(e)
    routingHandlers.diff(createPayload, sdk)
  }
  const clearDiff = () => resetRoute()

  // Start Over
  const onStartOver = () => {
    resetHandlers.onResetAll()
    onCloseNextSteps()
  }

  const disabled =
    !initialized || loading || loadingFeatures || !form.name || !form.package

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
                onError={errorHandlers.onResponseError}
              />

              <Row className="button-row">
                <Col s={3} className="xs6">
                  <FeatureSelectorModal
                    theme={theme}
                    loading={loadingFeatures}
                    features={availableFeatures}
                    selectedFeatures={selectedFeatures}
                    onAddFeature={featureHandlers.addFeature}
                    onRemoveFeature={featureHandlers.removeFeature}
                    onRemoveAllFeatures={featureHandlers.removeAllFeatures}
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
              {loading && <ProgressBar />}
            </div>
          </div>
        </div>
      </div>
      <div className="container mn-feature-container">
        <FeatureSelectedList
          theme={theme}
          selectedFeatures={selectedFeatures}
          onRemoveFeature={featureHandlers.removeFeature}
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
    </Fragment>
  )
}
