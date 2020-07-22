// TwitterLink.js
import React from "react";

import TwitterIcon from "@material-ui/icons/Twitter";

export const TwitterLink = ({ className, theme }) => {
    const backgroundColor =
        theme === "dark" ? "var(--theme-light)" : "var(--theme-dark)";
    const color = theme === "dark" ? "var(--theme-dark)" : "white";

    return (
        <a
            href="https://twitter.com/micronautfw"
            target="_blank"
            rel="noopener noreferrer"
            style={{
                backgroundColor,
            }}
            className={className}
        >
            <TwitterIcon className="twitter" style={{ color }} />
        </a>
    );
};
export default TwitterLink;
