// Select.js
import React from 'react'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import SelectProxy from '@material-ui/core/Select'

const Select = ({ name, label, options, id, value, onChange }) => {
    return (
        <div className="MuiFormControlOverrides select-wrapper input-field col">
            <FormControl>
                <InputLabel id={id}>{label}</InputLabel>
                <SelectProxy
                    name={name}
                    labelId={`${id}-select-label`}
                    id={`${id}-select`}
                    value={value}
                    onChange={onChange}
                >
                    {options.map((opt, idx) => (
                        <MenuItem
                            key={`select-${opt.value}-${idx}`}
                            value={opt.value}
                        >
                            {opt.label}
                        </MenuItem>
                    ))}
                </SelectProxy>
            </FormControl>
        </div>
    )
}

export default Select
