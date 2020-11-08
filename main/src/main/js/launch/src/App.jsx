import React, { Fragment, useState, useEffect, useRef, useMemo, useCallback } from "react";
import { ProgressBar } from "react-materialize";
import Col from "react-materialize/lib/Col";
import Icon from "react-materialize/lib/Icon";
import Row from "react-materialize/lib/Row";
import Dropdown from "react-materialize/lib/Dropdown";
import Divider from "react-materialize/lib/Divider";
import Button from "react-materialize/lib/Button";
import GitHubIcon from "@material-ui/icons/GitHub";

import {
  FeatureSelectorModal,
  FeatureSelectedList,
} from "./components/FeatureSelector";
import CodePreview from "./components/CodePreview";
import Diff from "./components/Diff";
import ErrorView, {ErrorViewData} from "./components/ErrorView";
import Header from "./components/Header";
import NextSteps from './components/NextSteps'
import StarterForm from "./components/StarterForm";
import {TooltipWrapper} from "./components/TooltipButton";
import Footer from "./components/Footer";

import {
  API_URL,
  SNAPSHOT_API_URL,
} from "./constants";

import messages from "./constants/messages.json";

import useAppTheme from "./hooks/useAppTheme";
import useLocalStorage from './hooks/useLocalStorage'

import {
  downloadBlob,
  makeNodeTree,
  responseHandler,
  debounceResponse,
} from "./utility";


import "./style.css";
import "./styles/button-row.css";
import "./styles/modal-overrides.css";
import "./styles/utility.css";

import Cache from "./helpers/Cache";
import { parseQuery } from './helpers/url'

const formResets = () => ({
    name: "demo",
    package: "com.example",
})
const initialForm =() => ({
    ...formResets(),
    type: "DEFAULT",
    javaVersion: ""
});

const emptyVersions = [];
export default function App() {

  const [form, setForm] = useLocalStorage("LATEST_FORM_DATA", initialForm());

  const [availableVersions, setAvailableVersions] = useState(emptyVersions);
  const [micronautApi, setMicronautApi] = useState(false)

  const [featuresAvailable, setFeaturesAvailable] = useState([]);
  const [featuresSelected, setFeaturesSelected] = useState({});
  const [initializationAttempted, setInitializationAttempted] = useState(false);

  const [loadingFeatures, setLoadingFeatures] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [preview, setPreview] = useState({});
  const [diff, setDiff] = useState(null);

  const [nextStepsInfo, setNextStepsInfo] = useState({});

  // Error Handling
  const [error, setError] = useState(ErrorViewData.ofSuccess(""))
  const hasError = Boolean(error.message);
  const handleResponseError = async (response) => {
        if (response instanceof Error) {
          return setError(new ErrorViewData(response));
        }
        const payload = ErrorViewData.ofError("something went wrong.")
        if (!response.json instanceof Function) {
          return setError(payload);
        }
        try {
          const json = await response.json();
          const message = json.message || payload.message
          setError(ErrorViewData.ofError(message));
        } catch (e) {
          setError(payload);
        }
      }

  const [theme, toggleTheme] = useAppTheme();
  const previewButton = useRef();
  const diffButton = useRef();


  const disabled =
    !initializationAttempted || downloading || loadingFeatures || !form.name || !form.package;

  const appType = form.type;

  // creates a watchable primitive to include in the useEffect deps
  const apiUrl = useMemo(()=>{
      const version = availableVersions.find((v) => {
        return micronautApi === v.api;
      });
      return version ? version.api : null
  }, [micronautApi, availableVersions])

  const [ready, setReady] = useState(()=>{
      const [, query] = window.location.toString().split("?", 2)
      const { error, htmlUrl, } = parseQuery(query)
      return !!error || !!htmlUrl || false
  })

  useEffect(()=> {
    const [baseUrl, query] = window.location.toString().split("?", 2)
    const { error, htmlUrl, cloneUrl } = parseQuery(query)
    if(!error && !htmlUrl) {
      return // nothing more to do
    }
    window.history.replaceState({}, document.title, baseUrl );
    setTimeout(()=>{
      if(cloneUrl) {
        setNextStepsInfo({cloneUrl, htmlUrl, show: true, type: 'clone'})
      } else if (error) {
          setError(ErrorViewData.ofError(error.replaceAll("+", " ")))
      }
    }, 500)
  }, [])


  useEffect(() => {
    const retrieveVersion = async (baseUrl) => {
      const url = `${baseUrl}/versions`;
      const result = await Cache.cache(url, () =>
        fetch(url).then(responseHandler("json"))
      );

      const ver = result.versions['micronaut.version'];

      return {
        label: ver,
        value: baseUrl,
        api: baseUrl
      };
    };

    const initializeForm = async () => {
      setDownloading(true);
      try {
        const all = await Promise.all([retrieveVersion(API_URL).catch(i=>null), retrieveVersion(SNAPSHOT_API_URL).catch(i=>null)]);
        const versions = all.filter(i=>i)
        setAvailableVersions(versions ? versions : emptyVersions);
        setMicronautApi(micronautApi=>
          Array.isArray(versions) && versions.length > 0 ?
          (versions.find((v)=>v.value === micronautApi) || versions[0]).value : false
        )
      } catch (error) {
        await handleResponseError(error);
      } finally {
        setInitializationAttempted(true);
        setDownloading(false);
      }
    };
    if (!initializationAttempted && !downloading) {
      initializeForm();
    }
  }, [initializationAttempted, downloading, setMicronautApi]);


  useEffect(() => {
    const loadFeatures = async () => {
      setLoadingFeatures(true);
      setError(ErrorViewData.ofNone());
      try {
        const url = `${apiUrl}/application-types/${appType}/features`;
        const data = await Cache.cache(url, () =>
          fetch(url).then(responseHandler("json"))
        );
        setFeaturesAvailable(data.features);
      } catch (error) {
        await handleResponseError(error);
      } finally {
        setLoadingFeatures(false);
      }
    };
    if (initializationAttempted && apiUrl) {
      loadFeatures();
    }
  }, [appType, apiUrl, initializationAttempted]);

  const buildFeaturesQuery = () => {
    return Object.keys(featuresSelected)
      .reduce((array, feature) => {
        array.push(`features=${feature}`);
        return array;
      }, [])
      .join("&");
  };

  const buildFetchUrl = (prefix, form) => {
    if (!prefix) {
      console.error(
        "A prefix is required, should be one of 'diff', 'preview', 'github', 'create'"
      );
    }
    const {
      type,
      name,
      lang,
      build,
      test,
      javaVersion,
      package: pkg, // package is reserved keyword
    } = form;
    const features = buildFeaturesQuery();
    const fqpkg = `${pkg}.${name}`;
    const base = `${apiUrl}/${prefix}/${type.toLowerCase()}/${fqpkg}`;
    const query = [
      `lang=${lang}`,
      `build=${build}`,
      `test=${test}`,
      `javaVersion=${javaVersion}`,
    ];
    if (features) {
      query.push(features);
    }
    return encodeURI(`${base}?${query.join("&")}`);
  };


  const addFeature = (feature) => {
    setFeaturesSelected(({ ...draft }) => {
      draft[feature.name] = feature;
      return draft;
    });
  };

  const removeFeature = (feature) => {
    setFeaturesSelected(({ ...draft }) => {
      delete draft[feature.name];
      return draft;
    });
  };

  const removeAllFeatures = () => {
    setFeaturesSelected({});
  };

  const requestPrep = (event) => {
    if (event && event.preventDefault instanceof Function) {
      event.preventDefault();
    }
    setError(ErrorViewData.ofNone());
    setDownloading(true);
  };

 // GitHub Clone Feat
  const cloneProject = async (e) => {
    setDownloading(true)
  }
  const gitHubCreateHref = (apiUrl) ? buildFetchUrl("github", form) : "#"

  // Create Feat
  const generateProject = async (e) => {
    requestPrep(e);
    const url = buildFetchUrl("create", form);
    // Debounce the download event so the UI is not jumpy
    const debounced = debounceResponse(Date.now());
    try {
      const blob = await fetch(url)
        .then(debounced)
        .then(responseHandler("blob"));

      downloadBlob(blob, `${form.name}.zip`);
      setNextStepsInfo({show: true, type: 'zip'})
    } catch (error) {
      await handleResponseError(error);
    } finally {
      setDownloading(false);
    }
  };

  // Preview Feat
  const loadPreview = async (e) => {
    requestPrep(e);
    try {
      let url = buildFetchUrl("preview", form);
      // Debounce the preview gen event so the UI is not jumpy
      const debounced = debounceResponse(Date.now());
      const json = await fetch(url)
        .then(debounced)
        .then(responseHandler("json"));

      const nodes = makeNodeTree(json.contents);
      setPreview(nodes);
      previewButton.current.props.onClick();
    } catch (error) {
      await handleResponseError(error);
    } finally {
      setDownloading(false);
    }
  };
  const clearPreview = () => {
    setPreview({});
  };


  // Diff Feat
  const loadDiff = async (e) => {
    requestPrep(e);
    try {
      let url = buildFetchUrl("diff", form);
      // Debounce the preview gen event so the UI is not jumpy
      const debounced = debounceResponse(Date.now());
      const text = await fetch(url)
        .then(debounced)
        .then(responseHandler("text"));
      if (text === "") {
        throw new Error(
          "No features have been selected. Please choose one or more features and try again."
        );
      }
      setDiff(text);
      diffButton.current.props.onClick();
    } catch (error) {
      await handleResponseError(error);
    } finally {
      setDownloading(false);
    }
  };

  const clearDiff = () => {
    setDiff(null);
  };

  const onStartOver = () => {
      setForm(form=>({...form, ...formResets()}))
      setNextStepsInfo({})
  };

  const onCloseNextSteps = () => {
      setNextStepsInfo({})
  };

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
                  <Dropdown
                    id="build_now_dropdown"
                    trigger={
                      <Button
                        options={{
                          alignment: 'left',
                          autoTrigger: true,
                          closeOnClick: true,
                          constrainWidth: true,
                          container: null,
                          coverTrigger: true,
                          hover: false,
                          inDuration: 150,
                          onCloseEnd: null,
                          onCloseStart: null,
                          onOpenEnd: null,
                          onOpenStart: null,
                          outDuration: 250
                        }}
                        disabled={disabled}
                        style={{width: "100%"}}
                        className={theme}
                        node="button"
                      >
                      <Icon className="action-button-icon" left>build</Icon>
                      Generate project
                      </Button>
                    }
                  >
                    <TooltipWrapper tooltip={messages.tooltips.createRepo}>
                         <a
                            href={gitHubCreateHref}
                            disabled={disabled}
                            waves="light"
                            className={theme}
                            style={{alignItems: "center", display: "flex"}}
                            onClick={cloneProject}
                          >
                            <GitHubIcon style={{marginLeft: "4px", marginRight: "28px"}} fontSize="small" className="action-button-icon">clone_app</GitHubIcon>
                            Push to GitHub
                          </a>
                    </TooltipWrapper>
                    <Divider />
                    <TooltipWrapper tooltip={messages.tooltips.generate}>
                         <a
                            role='button'
                            href="/create"
                            tooltip={messages.tooltips.generate}
                            disabled={disabled}
                            waves="light"
                            className={theme}
                            onClick={generateProject}
                          >
                            <Icon className="action-button-icon" left>
                              get_app
                            </Icon>
                            Download Zip
                          </a>
                          </TooltipWrapper>
                  </Dropdown>

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
      {nextStepsInfo.show && <NextSteps
              onClose={onCloseNextSteps}
              onStartOver={onStartOver}
              info={nextStepsInfo}
              theme={theme}
              name={form.name}
              buildTool={form.build}
       />}
      <ErrorView
        hasError={hasError}
        severity={error.severity}
        message={error.message}
        link={error.link}
        clipboard={error.clipboard}
        onClose={() => setError(ErrorViewData.ofNone())}
      />
    </Fragment>
  );
}
