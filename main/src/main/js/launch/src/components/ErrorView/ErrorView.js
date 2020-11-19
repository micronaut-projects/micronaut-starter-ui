// ErrorView.js
import React, { useState } from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import Avatar from '@material-ui/core/Avatar'

import Alert from '@material-ui/lab/Alert'
import AssignmentIcon from '@material-ui/icons/Assignment'
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn'

import logo from '../../images/micronaut-white-icon.png'
import { copyToClipboard } from '../../utility'
import './error-view.css'

const ErrorView = ({
    hasError,
    message,
    severity,
    link,
    clipboard,
    onClose,
}) => {
    const open = Boolean(message && hasError)
    const [copied, setCopied] = useState(false)
    const copy = () => {
        setCopied(true)
        copyToClipboard(clipboard.text)
    }
    const ClipBoardIcon = copied ? AssignmentTurnedInIcon : AssignmentIcon

    return (
        <Snackbar
            className="error-view"
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            open={open}
            autoHideDuration={6000}
        >
            <Alert
                icon={<Avatar src={logo}>N</Avatar>}
                onClose={onClose}
                severity={severity}
                variant="filled"
            >
                {message}{' '}
                {link && (
                    <a
                        className="error-link"
                        href={link}
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                        {link}
                    </a>
                )}
                {clipboard && (
                    <div
                        className="pt-2 clipboard"
                        role="button"
                        onClick={() => copy()}
                    >
                        {clipboard.message}
                        <ClipBoardIcon />
                    </div>
                )}
            </Alert>
        </Snackbar>
    )
}

export default ErrorView
