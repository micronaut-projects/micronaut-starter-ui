// CodePreview.js
import React, { useState, forwardRef } from 'react'

import { Button } from 'react-materialize'

import Icon from 'react-materialize/lib/Icon'
import Modal from 'react-materialize/lib/Modal'

import TreeView from '@material-ui/lab/TreeView'
import TreeItem from '@material-ui/lab/TreeItem'

import { Grid } from '@material-ui/core'

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism'

import { capitalize } from '../../utility'
import messages from '../../constants/messages.json'
import TooltipButton from '../TooltipButton'

const CodePreview = (
    { preview, lang, build, theme = 'light', disabled, onLoad, onClose },
    ref
) => {
    const [currentFile, setCurrentFile] = useState({
        contents: null,
        language: null,
    })

    const onModalClose = () => {
        setCurrentFile({
            contents: null,
            language: null,
        })
        if (onClose instanceof Function) {
            onClose()
        }
    }

    const handleFileSelection = (key, contents) => {
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
            setCurrentFile({ contents, language })
        }
    }

    const renderTree = (nodes) => {
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
                    let children = nodes[key]
                    return (
                        <TreeItem
                            key={key}
                            nodeId={key}
                            label={key}
                            onClick={() => handleFileSelection(key, children)}
                        >
                            {renderTree(children)}
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
                    <Button waves="light" modal="close" flat>
                        Close
                    </Button>
                }
                trigger={
                    <Button
                        ref={ref}
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
                            defaultCollapseIcon={<Icon>folder_open</Icon>}
                            defaultExpandIcon={<Icon>folder</Icon>}
                            defaultEndIcon={<Icon>description</Icon>}
                            defaultExpanded={['src', 'main']}
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
