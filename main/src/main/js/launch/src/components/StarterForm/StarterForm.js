// StarterForm.js
import React, { useMemo, useState, useCallback, useRef } from 'react'
import { TextInput } from 'react-materialize'
import Col from 'react-materialize/lib/Col'
import Row from 'react-materialize/lib/Row'

import { MicronautStarterSDK, LOCAL_DEFAULTS } from '../../micronaut'
import { useMicronautApiOptions } from '../../hooks/useMicronautSdk'

import RadioGroup from '../RadioGroup'
import Select from '../Select'

import { defaultsSpreader, useInitialChangeWatcher } from './StarterFormRecipes'

import {
  useStarterFormKeyboardEvents,
  useStarterVersionKeyboardEvents,
} from './useStarterFormKeyboardEvents'

const StarterForm = ({
  setForm,
  form,
  versions,
  setSelectedVersion,
  selectedVersion,
  onError,
}) => {
  const touched = useRef({})

  const [ready, onReady] = useState(false)
  const onLoaded = useCallback(() => onReady(true), [onReady])

  const { options, defaults } = useMicronautApiOptions(
    selectedVersion?.api,
    onLoaded,
    onError
  )

  const formDataBuilder = useMemo(() => {
    const remoteDefaults = MicronautStarterSDK.extractDefaults(options)
    if (Object.keys(remoteDefaults).length) {
      return defaultsSpreader(remoteDefaults)
    }
    return defaultsSpreader(LOCAL_DEFAULTS)
  }, [options])

  const handleChange = useCallback(
    (event) => {
      // Strip out any non alphanumeric characters (or ".","-","_") from the input.
      const { name: key, value } = event.target
      if (!key || typeof value !== 'string') return

      const spread = formDataBuilder(key, value, touched.current)
      return setForm((draft) => ({
        ...draft,
        ...spread,
      }))
    },
    [setForm, formDataBuilder]
  )

  const handleVersionChange = useCallback(
    (event) => {
      const { value } = event.target
      if (!value) return
      setSelectedVersion(versions.find((v) => v.value === value))
    },
    [versions, setSelectedVersion]
  )

  //----------------------------------------------------------
  // Base the Options for any given type or set loading values
  //-------------------------------------------------------
  const defaultType = useMemo(
    () => [{ value: form.type, label: 'Loading...' }],
    [form.type]
  )
  const APP_TYPES = options.type ? options.type.options : defaultType

  const defaultJdk = useMemo(() => {
    return [{ value: form.javaVersion, label: 'Loading...' }]
  }, [form.javaVersion])

  const JAVA_OPTS = options.jdkVersion ? options.jdkVersion.options : defaultJdk
  const LANG_OPTS = options.lang ? options.lang.options : []
  const BUILD_OPTS = options.build ? options.build.options : []
  const TEST_OPTS = options.test ? options.test.options : []

  useStarterVersionKeyboardEvents(
    handleVersionChange,
    selectedVersion,
    versions
  )

  useStarterFormKeyboardEvents(handleChange, form, {
    APP_TYPES,
    LANG_OPTS,
    BUILD_OPTS,
    TEST_OPTS,
    JAVA_OPTS,
  })

  //----------------------------------------------------------
  // handle changes for any non-exsiting default values
  // on the initial form data or reset to defaults in event
  // the newly selected api has different sets of values
  // for any given type.
  //-------------------------------------------------------

  // Extract primitives for useEffect dep watching
  const { type, javaVersion, lang, build, test } = form

  // Watch For Initial Changes On App Props
  useInitialChangeWatcher('type', type, APP_TYPES, defaults, handleChange)
  useInitialChangeWatcher(
    'javaVersion',
    javaVersion,
    JAVA_OPTS,
    defaults,
    handleChange,
    'jdkVersion'
  )

  useInitialChangeWatcher('lang', lang, LANG_OPTS, defaults, handleChange)
  useInitialChangeWatcher('build', build, BUILD_OPTS, defaults, handleChange)
  useInitialChangeWatcher('test', test, TEST_OPTS, defaults, handleChange)

  //----------------------------------------------------------
  // Render
  //-------------------------------------------------------
  return (
    <Row className="mn-starter-form-main">
      <Col s={8} m={6} l={3}>
        <Select
          tabIndex={1}
          className="mn-input"
          label="Application Type"
          value={form.type}
          name="type"
          onChange={handleChange}
          options={APP_TYPES}
        ></Select>
      </Col>
      <Col s={4} m={6} l={3}>
        <Select
          tabIndex={1}
          label="Java Version"
          value={form.javaVersion}
          name="javaVersion"
          onChange={handleChange}
          options={JAVA_OPTS}
        ></Select>
      </Col>
      <Col s={8} m={6} l={3}>
        <TextInput
          tabIndex={1}
          required
          className="mn-input"
          label="Base Package"
          name="package"
          placeholder="ex: com.mycompany"
          value={form.package}
          onChange={handleChange}
        />
      </Col>
      <Col s={4} m={6} l={3}>
        <TextInput
          required
          tabIndex={1}
          className="mn-input"
          label="Name"
          name="name"
          placeholder="ex: myapp"
          value={form.name}
          onChange={handleChange}
        />
      </Col>
      <Col m={3} s={12} className="mn-radio">
        <RadioGroup
          tabIndex={1}
          label="Micronaut Version"
          id="micronautApi"
          name="micronautApi"
          value={selectedVersion?.value}
          onChange={handleVersionChange}
          options={versions}
          loading={!ready}
          expected={2}
        />
      </Col>
      <Col m={3} s={12} className="mn-radio">
        <RadioGroup
          tabIndex={1}
          label="Language"
          id="lang"
          name="lang"
          value={form.lang}
          onChange={handleChange}
          options={LANG_OPTS}
          loading={!ready}
        />
      </Col>
      <Col m={3} s={12} className="mn-radio">
        <RadioGroup
          tabIndex={1}
          label="Build"
          id="build"
          name="build"
          value={form.build}
          onChange={handleChange}
          options={BUILD_OPTS}
          loading={!ready}
        />
      </Col>
      <Col m={3} s={12} className="mn-radio">
        <RadioGroup
          tabIndex={1}
          label="Test Framework"
          id="test"
          name="test"
          value={form.test}
          onChange={handleChange}
          options={TEST_OPTS}
          loading={!ready}
        />
      </Col>
    </Row>
  )
}

export default StarterForm
