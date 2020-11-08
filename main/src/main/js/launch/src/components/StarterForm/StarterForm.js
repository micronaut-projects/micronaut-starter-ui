// StarterForm.js
import React, { useMemo, useState, useEffect, useCallback, useRef } from "react";
import { TextInput } from "react-materialize";
import Col from "react-materialize/lib/Col";
import Row from "react-materialize/lib/Row";
import RadioGroup from "../RadioGroup";
import Select from "../Select";

import {
  responseHandler,
  takeAtLeast,
} from "../../utility";
import {CacheApi, SessionStorageAdapter} from "../../helpers/Cache";

import { recipeSpreader, LOCAL_RECIPES } from './StarterFormRecipes'
const formDataBuilder = recipeSpreader(LOCAL_RECIPES)

const Cache = new CacheApi(new SessionStorageAdapter())

const StarterForm = ({ setForm, onDefaults, form, versions, setMicronautApi, micronautApi, onReady, ...props }) => {
    const [options, setOptions] = useState({});
    const touched = useRef({})

    const handleChange = useCallback((event) => {
        // Strip out any non alphanumeric characters (or ".","-","_") from the input.
        const { name: key, value } = event.target;
        if(!key || !value) return

        const spread = formDataBuilder(key, value, touched.current)
        return setForm((draft) => ({
          ...draft,
          ...spread
        }));
    }, [setForm]);
    //----------------------------------------------------------
    // Load and Setup Options
    //-------------------------------------------------------
    useEffect(()=>{
        async function load(apiUrl) {
            const optsUrl = `${apiUrl}/select-options`;
            const data = await Cache.cache(optsUrl, () =>
                takeAtLeast(()=>
                    fetch(optsUrl).then(responseHandler("json"))
                , 700)
            );
            setOptions(data)
            onReady(true)
        }
        if(micronautApi) {
            load(micronautApi)
        }
    }, [micronautApi, onReady])


    const APP_TYPES = options.types ? options.types.options : [{value: form.type, label: "Loading..." }]
    const JAVA_OPTS = options.jdkVersions ? options.jdkVersions.options : [{value: form.javaVersion, label: "Loading..." }]
    const LANG_OPTS = options.languages ? options.languages.options : []
    const BUILD_OPTS = options.buildTools ? options.buildTools.options : []
    const TEST_OPTS = options.testFrameworks ? options.testFrameworks.options : []

    //----------------------------------------------------------
    // Extract the Defaults
    //-------------------------------------------------------
    const defaults = useMemo(()=> options.types ? {
            type: options.types.defaultOption.value,
            javaVersion: options.jdkVersions.defaultOption.value,
            lang: options.languages.defaultOption.value,
            build: options.buildTools.defaultOption.value,
            testFw: options.testFrameworks.defaultOption.value,
    } : {}, [options])

    //----------------------------------------------------------
    // Emit changes for any non-exsiting default values
    // on the initial form data
    //-------------------------------------------------------

    // Extract primitives for useEffect dep watching
    const { type, javaVersion, lang, build, testFw } = form

    useEffect(()=>{
        if(!type) {
            handleChange({target: {name:'type', value: defaults.type}})
        }
        if(!javaVersion) {
            handleChange({target: {name:'javaVersion', value: defaults.javaVersion}})
        }
        if(!lang) {
            handleChange({target: {name:'lang', value: defaults.lang}})
        }
        if(!build) {
            handleChange({target: {name:'build', value: defaults.build}})
        }
        if(!testFw) {
            handleChange({target: {name:'testFw', value: defaults.testFw}})
        }
    }, [ type, javaVersion, lang, build, testFw, defaults, handleChange])

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
                    value={micronautApi}
                    onChange={({target: {value}})=>setMicronautApi(value)}
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
                    id="testFw"
                    name="testFw"
                    value={form.testFw}
                    onChange={handleChange}
                    options={TEST_OPTS}
                    loading={!TEST_OPTS.length}
                />
            </Col>
        </Row>
    );
};

export default StarterForm;
