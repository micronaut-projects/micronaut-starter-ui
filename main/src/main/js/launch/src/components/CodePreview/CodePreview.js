// CodePreview.js
import React, {
  useState,
  forwardRef,
  useEffect,
  useMemo,
  useImperativeHandle,
  useRef,
} from 'react'

import { Button } from 'react-materialize'

import Icon from 'react-materialize/lib/Icon'
import Modal from 'react-materialize/lib/Modal'

import TreeView from '@material-ui/lab/TreeView'
import TreeItem from '@material-ui/lab/TreeItem'

import { Grid } from '@material-ui/core'

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism'

import { capitalize, makeNodeTree } from '../../utility'
import messages from '../../constants/messages.json'
import TooltipButton, { TooltipWrapper } from '../TooltipButton'
import CopyToClipboard from '../CopyToClipboard'

const CodePreview = (
  { lang, build, theme = 'light', disabled, onLoad, onClose, sharable },
  ref
) => {
  const triggerRef = useRef(null)
  const [showing, setShowing] = useState(null)
  const [preview, setPreview] = useState({})

  useImperativeHandle(ref, () => ({
    show: async (showing, json) => {
      setShowing(showing)
      const nodes = makeNodeTree(json.contents)
      setPreview(nodes)
      triggerRef.current.props.onClick()
    },
  }))

  const [currentFile, setCurrentFile] = useState({
    contents: null,
    language: null,
    path: null,
  })

  const shareLink = useMemo(() => {
    const { origin, pathname } = window.location
    let url = `${origin}${pathname}?${sharable}&route=preview`
    if (currentFile.path) {
      url += `&showing=${currentFile.path}`
    }
    return url
  }, [sharable, currentFile.path])

  const onModalClose = () => {
    setPreview({})
    setCurrentFile({
      contents: null,
      language: null,
      path: null,
    })
    setShowing(null)
    if (onClose instanceof Function) {
      onClose()
    }
  }

  const handleFileSelection = (key, contents, path) => {
    if (typeof contents === 'string') {
      let idx = key.lastIndexOf('.')
      let language
      if (idx > -1) {
        language = key.substring(idx + 1)
        if (language === 'gradle') {
          language = 'groovy'
        }
        if (language === 'bat') {
          language = 'batch'
        }
        if (language === 'kt') {
          language = 'kotlin'
        }
      } else {
        language = 'bash'
      }
      setCurrentFile({ contents, language, path })
    }
  }

  function extractDefaults(path) {
    if (!path || typeof path !== 'string') {
      return {
        defaultSelected: 'root',
      }
    }

    const parts = path.split('/')
    const defaultExpanded = []
    while (parts.length) {
      defaultExpanded.push(parts.join('/'))
      parts.pop()
    }
    return {
      defaultSelected: path,
      defaultExpanded,
    }
  }

  const { defaultSelected, defaultExpanded } = useMemo(
    () => extractDefaults(showing),
    [showing]
  )

  useEffect(() => {
    if (typeof showing !== 'string') {
      return
    }
    const parts = showing.split('/').filter((i) => i)
    let contents = preview
    let key = ''
    while (contents && typeof match !== 'string' && parts.length) {
      key = parts.shift()
      contents = contents[key]
    }
    if (key && contents) {
      handleFileSelection(key, contents, showing)
    }
  }, [preview, showing])

  const renderTree = (nodes, rootKey = '') => {
    if (nodes instanceof Object) {
      return Object.keys(nodes)
        .sort(function order(key1, key2) {
          let key1Object = typeof nodes[key1] === 'object'
          let key2Object = typeof nodes[key2] === 'object'
          if (key1Object && !key2Object) {
            return -1
          } else if (!key1Object && key2Object) {
            return 1
          } else {
            if (key1 < key2) return -1
            else if (key1 > key2) return +1
            else return 0
          }
        })
        .map((key) => {
          const children = nodes[key]
          const nodeId = `${rootKey}/${key}`
          return (
            <TreeItem
              key={nodeId}
              nodeId={nodeId}
              label={key}
              onClick={() => handleFileSelection(key, children, nodeId)}
            >
              {renderTree(children, nodeId)}
            </TreeItem>
          )
        })
    }
  }

  return (
    <React.Fragment>
      <TooltipButton
        tooltip={messages.tooltips.preview}
        disabled={disabled}
        waves="light"
        className={theme}
        style={{ marginRight: '5px', width: '100%' }}
        onClick={onLoad}
      >
        <Icon className="action-button-icon" left>
          search
        </Icon>
        Preview
      </TooltipButton>
      <Modal
        header={
          'Previewing a ' +
          capitalize(lang) +
          ' application using ' +
          capitalize(build)
        }
        className={'preview ' + theme}
        fixedFooter
        options={{
          onCloseStart: onModalClose,
          startingTop: '5%',
          endingTop: '5%',
        }}
        actions={
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
          >
            <div>
              <TooltipWrapper tooltip="Share This Configuraiton">
                <CopyToClipboard value={shareLink}>
                  Share link for this configuration
                </CopyToClipboard>
              </TooltipWrapper>
            </div>
            <Button waves="light" modal="close" flat>
              Close
            </Button>
          </div>
        }
        trigger={
          <Button
            ref={triggerRef}
            disabled={disabled}
            waves="light"
            className={theme}
            style={{ display: 'none' }}
            onClick={onLoad}
          >
            <Icon left>search</Icon>
            Preview
          </Button>
        }
      >
        <Grid container className="grid-container">
          <Grid
            item
            xs={3}
            className={'grid-column'}
            style={{ borderRight: '1px solid' }}
          >
            <TreeView
              key={defaultSelected}
              defaultCollapseIcon={<Icon>folder_open</Icon>}
              defaultExpandIcon={<Icon>folder</Icon>}
              defaultEndIcon={<Icon>description</Icon>}
              defaultExpanded={defaultExpanded}
              defaultSelected={defaultSelected}
            >
              {renderTree(preview)}
            </TreeView>
          </Grid>
          <Grid item xs={9} className={'grid-column'}>
            {currentFile.contents && (
              <SyntaxHighlighter
                className="codePreview"
                lineNumberContainerProps={{
                  className: 'lineNumbers',
                }}
                language={currentFile.language}
                style={theme === 'light' ? prism : darcula}
                showLineNumbers={true}
              >
                {currentFile.contents}
              </SyntaxHighlighter>
            )}
          </Grid>
        </Grid>
      </Modal>
    </React.Fragment>
  )
}

export default forwardRef(CodePreview)
