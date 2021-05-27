// CodePreview.js
import React, {
  useState,
  forwardRef,
  useEffect,
  useMemo,
  useImperativeHandle,
} from 'react'

import { Button } from 'react-materialize'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { Grid } from '@material-ui/core'
import TreeItem from '@material-ui/lab/TreeItem'
import TreeView from '@material-ui/lab/TreeView'
import Icon from 'react-materialize/lib/Icon'
import Modal from 'react-materialize/lib/Modal'

import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism'

import messages from '../../constants/messages.json'
import { PREVIEW_SHORTCUT } from '../../constants/shortcuts'
import {
  fullyQualifySharableLink,
  ACTIVITY_KEY,
  PREVIEW_ACTIVITY,
} from '../../helpers/Routing'
import useKeyboardShortcuts from '../../hooks/useKeyboardShortcuts'

import { useSharableLink, useStarterForm } from '../../state/store'
import { capitalize, makeNodeTree } from '../../utility'

import CopyToClipboard from '../CopyToClipboard'
import TooltipButton, { TooltipWrapper } from '../TooltipButton'

const CodePreview = ({ theme = 'light', disabled, onLoad, onClose }, ref) => {
  const { lang, build } = useStarterForm()
  const sharable = useSharableLink()

  const [showing, setShowing] = useState(null)
  const [preview, setPreview] = useState({})
  const open = Object.keys(preview).length > 0

  useKeyboardShortcuts(PREVIEW_SHORTCUT.keys, onLoad, disabled)

  useImperativeHandle(ref, () => ({
    show: async (json, showing) => {
      setShowing(showing || 'README.md')
      const nodes = makeNodeTree(json.contents)
      setPreview(nodes)
    },
  }))

  const [currentFile, setCurrentFile] = useState({
    contents: null,
    language: null,
    path: null,
  })

  const shareLink = useMemo(() => {
    let link = fullyQualifySharableLink(sharable, {
      [ACTIVITY_KEY]: PREVIEW_ACTIVITY,
    })
    if (currentFile.path) {
      link += `&showing=${currentFile.path}`
    }
    return link
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
        tabIndex={1}
      >
        <Icon className="action-button-icon" left>
          search
        </Icon>
        Preview
      </TooltipButton>
      <Modal
        open={open}
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
          <div className="code-preview footer-wrapper">
            <div className={currentFile.contents ? '' : 'hidden'}>
              <TooltipWrapper tooltip="Copy a link back to current file">
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: '1em',
                  }}
                >
                  <CopyToClipboard value={shareLink}></CopyToClipboard>
                  Link to This
                </div>
              </TooltipWrapper>
            </div>
            <Button waves="light" modal="close" flat>
              Close
            </Button>
          </div>
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
