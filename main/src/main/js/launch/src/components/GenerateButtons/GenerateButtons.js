import React, { useMemo } from 'react'
import Icon from 'react-materialize/lib/Icon'
import Dropdown from 'react-materialize/lib/Dropdown'
import Button from 'react-materialize/lib/Button'
import GitHubIcon from '@material-ui/icons/GitHub'
import { TooltipWrapper } from '../TooltipButton'

import messages from '../../constants/messages.json'
import OtherCommands from '../OtherCommands'
import { MicronautStarterSDK } from '../../micronaut'

import useKeyboardShortcuts from '../../hooks/useKeyboardShortcuts'
import { GENERATE_SHORTCUT } from '../../constants/shortcuts'
import { useGitHubShareLink, useStarterForm } from '../../state/store'

const GenerateButtons = ({
  disabled,
  theme,
  generateProject,
  cloneProject,
  baseUrl,
}) => {
  const createPayload = useStarterForm()
  const gitHubCreateHref = useGitHubShareLink()

  useKeyboardShortcuts(GENERATE_SHORTCUT.keys, generateProject, disabled)

  return (
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
            outDuration: 250,
          }}
          disabled={disabled}
          style={{ width: '100%' }}
          className={theme}
          node="button"
          tabIndex={1}
        >
          <Icon className="action-button-icon" left>
            build
          </Icon>
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
          style={{
            alignItems: 'center',
            display: 'flex',
          }}
          onClick={cloneProject}
        >
          <GitHubIcon
            style={{
              marginLeft: '4px',
              marginRight: '28px',
            }}
            fontSize="small"
            className="action-button-icon"
          >
            clone_app
          </GitHubIcon>
          Push to GitHub
        </a>
      </TooltipWrapper>

      <TooltipWrapper tooltip={messages.tooltips.generate}>
        <a
          role="button"
          href="#create"
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

      <OtherCommands
        baseUrl={baseUrl}
        createPayload={createPayload}
        theme={theme}
        trigger={
          <a role="button" href="#other-commands" waves="light">
            <Icon className="action-button-icon" left>
              code
            </Icon>
            Commands
          </a>
        }
      />
    </Dropdown>
  )
}

export default GenerateButtons
