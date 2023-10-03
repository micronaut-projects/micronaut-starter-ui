// TooltipButton.js
import React from 'react'
import { Button } from 'react-materialize'
import {MuiThemeProvider, createTheme} from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'

const theme = createTheme({
  overrides: {
    MuiTooltip: {
      tooltip: {
        fontSize: '0.9em',
      },
    },
  },
})

const TooltipButton = ({ tooltip, children, ...props }) => {
  return (
    <MuiThemeProvider theme={theme}>
      <Tooltip
        enterDelay={600}
        enterNextDelay={350}
        enterTouchDelay={300}
        title={tooltip}
        arrow
        placement="top"
      >
        <span>
          <Button {...props}>{children}</Button>
        </span>
      </Tooltip>
    </MuiThemeProvider>
  )
}

export const TooltipWrapper = ({ tooltip, children }) => {
  return (
    <MuiThemeProvider theme={theme}>
      <Tooltip
        enterDelay={600}
        enterNextDelay={350}
        enterTouchDelay={300}
        title={tooltip}
        arrow
        placement="top"
      >
        {children}
      </Tooltip>
    </MuiThemeProvider>
  )
}

export default TooltipButton
