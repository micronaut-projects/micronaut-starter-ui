// Footer.js
import React from "react";
import OciHomeOfMicronaut from "../OciHomeOfMicronaut";
import PoweredByGoogle from "../PoweredByGoogle";

const Footer = ({ info, theme, onToggleTheme, onShowInfo }) => {
    return (
        <footer className="container mn-footer-container">
            <PoweredByGoogle />
            <OciHomeOfMicronaut />
        </footer>
    );
};

export default Footer;
