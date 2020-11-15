// Diff.js
import React, { forwardRef } from 'react'

import { Button } from 'react-materialize'

import Icon from 'react-materialize/lib/Icon'
import Modal from 'react-materialize/lib/Modal'

import { Grid } from '@material-ui/core'

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism'

import TooltipButton from './TooltipButton'
import messages from '../constants/messages.json'
import { capitalize } from '../utility'

const Diff = (
    { diff, lang, build, theme = 'light', disabled, onLoad, onClose },
    ref
) => {
    return (
        <React.Fragment>
            <TooltipButton
                tooltip={messages.tooltips.diff}
                disabled={disabled}
                waves="light"
                className={theme}
                style={{ marginRight: '5px', width: '100%' }}
                onClick={onLoad}
            >
                <Icon className="action-button-icon" left>
                    compare_arrows
                </Icon>
                Diff
            </TooltipButton>

            <Modal
                header={
                    'Showing Diff for a ' +
                    capitalize(lang) +
                    ' application using ' +
                    capitalize(build)
                }
                className={'diff ' + theme}
                fixedFooter
                options={{
                    onCloseStart: onClose,
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
                        <Icon left>compare_arrows</Icon>
                        Diff
                    </Button>
                }
            >
                <Grid container className="grid-container">
                    <Grid item xs={12} className={'grid-column'}>
                        {diff && (
                            <SyntaxHighlighter
                                className="codePreview"
                                lineNumberContainerProps={{
                                    className: 'lineNumbers',
                                }}
                                language="diff"
                                style={theme === 'light' ? prism : darcula}
                                showLineNumbers={true}
                            >
                                {diff}
                            </SyntaxHighlighter>
                        )}
                    </Grid>
                </Grid>
            </Modal>
        </React.Fragment>
    )
}

export default forwardRef(Diff)
