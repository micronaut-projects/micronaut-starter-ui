import React from 'react'
import Icon from 'react-materialize/lib/Icon'
import Dropdown from 'react-materialize/lib/Dropdown'
import Divider from 'react-materialize/lib/Divider'
import Button from 'react-materialize/lib/Button'
import GitHubIcon from '@material-ui/icons/GitHub'
import TooltipButton, { TooltipWrapper } from './TooltipButton'

import messages from '../constants/messages.json'

const GenerateButtons = ({
  disabled,
  theme,
  generateProject,
  cloneProject,
  apiUrl,
  gitHubCreateHref,
  supportsPushToGithub,
}) => {
  return supportsPushToGithub === false ? (
    <TooltipButton
      tooltip={messages.tooltips.generate}
      disabled={disabled}
      waves="light"
      className={theme}
      style={{ marginRight: '5px', width: '100%' }}
    >
      <Icon className="xs-only" left>
        get_app
      </Icon>
      Generate project
    </TooltipButton>
  ) : (
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
      <Divider />
      <TooltipWrapper tooltip={messages.tooltips.generate}>
        <a
          role="button"
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
  )
}

export default GenerateButtons
