// StarterForm.js
import React, { useMemo, useState, useEffect, useCallback, useRef } from 'react'
import { TextInput } from 'react-materialize'
import Col from 'react-materialize/lib/Col'
import Row from 'react-materialize/lib/Row'

import {
  MicronautStarterSDK,
  LOCAL_DEFAULTS,
  LOCAL_SELECT_OPTIONS,
} from '../../micronaut'
import useMicronautSdk from '../../hooks/useMicronautSdk'

import RadioGroup from '../RadioGroup'
import Select from '../Select'

import { defaultsSpreader } from './StarterFormRecipes'

const StarterForm = ({
  setForm,
  onDefaults,
  form,
  versions,
  setSelectedVersion,
  selectedVersion,
  onReady,
  ...props
}) => {
  const [options, setOptions] = useState(LOCAL_SELECT_OPTIONS)
  const touched = useRef({})

  const sdk = useMicronautSdk(selectedVersion?.api)

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
  // Load and Setup Options
  //-------------------------------------------------------
  useEffect(() => {
    async function load(apiUrl) {
      try {
        const data = await sdk.selectOptions()
        setOptions(data)
      } finally {
        onReady(true)
      }
    }
    if (sdk) {
      load(sdk)
    }
  }, [sdk, onReady])

  //----------------------------------------------------------
  // Extract the Defaults
  //-------------------------------------------------------
  const defaults = useMemo(
    () => MicronautStarterSDK.extractDefaultOptions(options),
    [options]
  )

  //----------------------------------------------------------
  // Base the Options for any given type or set loading values
  //-------------------------------------------------------
  const APP_TYPES = options.type
    ? options.type.options
    : [{ value: form.type, label: 'Loading...' }]
  const JAVA_OPTS = options.jdkVersion
    ? options.jdkVersion.options
    : [{ value: form.javaVersion, label: 'Loading...' }]
  const LANG_OPTS = options.lang ? options.lang.options : []
  const BUILD_OPTS = options.build ? options.build.options : []
  const TEST_OPTS = options.test ? options.test.options : []

  //----------------------------------------------------------
  // handle changes for any non-exsiting default values
  // on the initial form data or reset to defaults in event
  // the newly selected api has different sets of values
  // for any given type.
  //-------------------------------------------------------

  // Extract primitives for useEffect dep watching
  const { type, javaVersion, lang, build, test } = form

  // Application Type watcher
  useEffect(() => {
    if (!type || !APP_TYPES.find((opt) => opt.value === type)) {
      handleChange({ target: { name: 'type', value: defaults.type } })
    }
  }, [APP_TYPES, handleChange, defaults, type])

  // Java Version watcher
  useEffect(() => {
    if (!javaVersion || !JAVA_OPTS.find((opt) => opt.value === javaVersion)) {
      handleChange({
        target: { name: 'javaVersion', value: defaults.jdkVersion },
      })
    }
  }, [JAVA_OPTS, handleChange, defaults, javaVersion])

  // Language watcher
  useEffect(() => {
    if (!lang || !LANG_OPTS.find((opt) => opt.value === lang)) {
      handleChange({ target: { name: 'lang', value: defaults.lang } })
    }
  }, [LANG_OPTS, handleChange, defaults, lang])

  // Build Tool watcher
  useEffect(() => {
    if (!build || !BUILD_OPTS.find((opt) => opt.value === build)) {
      handleChange({ target: { name: 'build', value: defaults.build } })
    }
  }, [BUILD_OPTS, handleChange, defaults, build])

  // Test Framework watcher
  useEffect(() => {
    if (!test || !TEST_OPTS.find((opt) => opt.value === test)) {
      handleChange({ target: { name: 'test', value: defaults.test } })
    }
  }, [TEST_OPTS, handleChange, defaults, test])

  //----------------------------------------------------------
  // Render
  //-------------------------------------------------------
  return (
    <Row className="mn-starter-form-main">
      <Col s={8} m={6} l={3}>
        <Select
          className="mn-input"
          label="Application Type"
          value={form.type}
          name="type"
          options={APP_TYPES}
          onChange={handleChange}
        ></Select>
      </Col>
      <Col s={4} m={6} l={3}>
        <Select
          label="Java Version"
          value={form.javaVersion}
          name="javaVersion"
          onChange={handleChange}
          options={JAVA_OPTS}
        ></Select>
      </Col>
      <Col s={8} m={6} l={3}>
        <TextInput
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
          label="Micronaut Version"
          id="micronautApi"
          name="micronautApi"
          value={selectedVersion?.value}
          onChange={handleVersionChange}
          options={versions}
          loading={!APP_TYPES.length}
          expected={2}
        />
      </Col>
      <Col m={3} s={12} className="mn-radio">
        <RadioGroup
          label="Language"
          id="lang"
          name="lang"
          value={form.lang}
          onChange={handleChange}
          options={LANG_OPTS}
          loading={!LANG_OPTS.length}
        />
      </Col>
      <Col m={3} s={12} className="mn-radio">
        <RadioGroup
          label="Build"
          id="build"
          name="build"
          value={form.build}
          onChange={handleChange}
          options={BUILD_OPTS}
          loading={!BUILD_OPTS.length}
        />
      </Col>
      <Col m={3} s={12} className="mn-radio">
        <RadioGroup
          label="Test Framework"
          id="test"
          name="test"
          value={form.test}
          onChange={handleChange}
          options={TEST_OPTS}
          loading={!TEST_OPTS.length}
        />
      </Col>
    </Row>
  )
}

export default StarterForm
