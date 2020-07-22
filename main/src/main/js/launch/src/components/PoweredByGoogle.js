// PoweredByGoogle.js
import React from "react";
import { ReactComponent as GoogleSvg } from "../images/google.svg";

const PoweredByGoogle = ({ theme }) => {
    return (
        <a
            alt="Powered by Google Cloud Run"
            href="https://cloud.google.com/run"
        >
            <GoogleSvg className="google-logo" />
        </a>
    );
};

export default PoweredByGoogle;
