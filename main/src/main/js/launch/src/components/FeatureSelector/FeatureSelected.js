// FeatureSelected.js
import React from "react";

const closeButtonStyle = {
    cursor: "pointer",
    float: "right",
    fontSize: "16px",
    lineHeight: "32px",
    paddingLeft: "8px",
};

const FeatureSelected = ({ feature, onRemoveFeature }) => {
    return (
        <div style={{ marginRight: 10 }} className="chip">
            {feature.name}
            <i
                onClick={(e) => {
                    e.preventDefault();
                    onRemoveFeature(feature);
                }}
                className="material-icons"
                style={closeButtonStyle}
            >
                close
            </i>
        </div>
    );
};

export default FeatureSelected;
