// ErrorView.js
import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import Avatar from "@material-ui/core/Avatar";

import Alert from "@material-ui/lab/Alert";
import logo from "../../images/micronaut-white-icon.png";
const ErrorView = ({ hasError, message, severity, onClose }) => {
    const open = Boolean(message && hasError);

    return (
        <Snackbar
            className="error-view"
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            open={open}
            // autoHideDuration={6000}
        >
            <Alert
                icon={<Avatar src={logo}>N</Avatar>}
                onClose={onClose}
                severity={severity}
                variant="filled"
            >
                {message}
            </Alert>
        </Snackbar>
    );
};

export default React.memo(
    ErrorView,
    (next, prev) =>
        next.message === prev.message && next.hasError === prev.hasError
);
