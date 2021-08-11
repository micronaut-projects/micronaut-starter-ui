// Diff.js
import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useMemo,
} from 'react'

import { Button } from 'react-materialize'

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { Grid } from '@material-ui/core'

import Icon from 'react-materialize/lib/Icon'
import Modal from 'react-materialize/lib/Modal'
import { darcula } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { prism } from 'react-syntax-highlighter/dist/cjs/styles/prism'

import messages from '../constants/messages.json'

import { DIFF_SHORTCUT } from '../constants/shortcuts'
import useKeyboardShortcuts from '../hooks/useKeyboardShortcuts'
import { useStarterForm } from '../state/store'
import { capitalize } from '../utility'
import TooltipButton from './TooltipButton'

const Diff = ({ theme = 'light', disabled, onLoad, onClose }, ref) => {
  const { lang, build } = useStarterForm()

  const [diff, setDiff] = useState(null)
  useKeyboardShortcuts(DIFF_SHORTCUT.keys, onLoad, disabled)

  useImperativeHandle(ref, () => ({
    show: async (text) => {
      setDiff(text)
    },
  }))

  const options = useMemo(() => {
    function onCloseStart(event) {
      setDiff('')
      onClose(event)
    }
    return {
      onCloseStart: onCloseStart,
      startingTop: '5%',
      endingTop: '5%',
    }
  }, [onClose, setDiff])

  return (
    <React.Fragment>
      <TooltipButton
        tooltip={messages.tooltips.diff}
        disabled={disabled}
        waves="light"
        className={theme}
        style={{ marginRight: '5px', width: '100%' }}
        onClick={onLoad}
        tabIndex={1}
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
        open={!!diff}
        options={options}
        actions={
          <Button waves="light" modal="close" flat>
            Close
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
