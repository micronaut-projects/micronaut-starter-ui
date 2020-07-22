// ErrorView.js
import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import Avatar from "@material-ui/core/Avatar";

import Alert from "@material-ui/lab/Alert";
import logo from "../../images/micronaut-white-icon.png";
const ErrorView = ({ error, errorMessage, onClose }) => {
    const open = Boolean(errorMessage && error);

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
                severity="error"
            >
                {errorMessage}
            </Alert>
        </Snackbar>
    );
};

export default React.memo(
    ErrorView,
    (next, prev) =>
        next.errorMessage === prev.errorMessage && next.error === prev.error
);
