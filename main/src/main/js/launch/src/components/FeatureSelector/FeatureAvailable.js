// FeatureSelector.js
import React from "react";

import { Button, Card } from "react-materialize";
import Icon from "react-materialize/lib/Icon";

const FeatureAvailable = ({ feature, toggleFeatures }) => {
    return (
        <Card
            id={`mn-feature-${feature.name}`}
            className={`mn-feature-selection hoverable ${feature.selected &&
                "selected"}`}
            title={feature.preview != null && feature.preview ? feature.name + " (preview)" : feature.name}
            onClick={(e) => toggleFeatures(e, feature)}
        >
            <p className="grey-text">{feature.description}</p>
            {feature.selected && (
                <Button
                    floating
                    small
                    style={{ position: "absolute", top: -12, right: -15 }}
                    className="black remove-button"
                >
                    <Icon>close</Icon>
                </Button>
            )}
        </Card>
    );
};

export default FeatureAvailable;
