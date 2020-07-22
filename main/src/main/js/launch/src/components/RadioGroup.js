// RadioGroup.js
import React from "react";

const RadioGroup = ({ name, label, options, id, value, onChange }) => {
    return (
        <div className="radio-group">
            {typeof label === "string" && (
                <label className="input-field">{label}</label>
            )}
            {options.map((option, idx) => {
                return (
                    <label
                        key={`${idx}-${option.value}`}
                        className="radio-label"
                        htmlFor={`${id}-radio-${idx}`}
                    >
                        <input
                            id={`${id}-radio-${idx}`}
                            type="radio"
                            name={name}
                            value={option.value}
                            checked={value === option.value}
                            onChange={onChange}
                        />
                        <span>{option.label}</span>
                    </label>
                );
            })}
        </div>
    );
};

export default RadioGroup;
