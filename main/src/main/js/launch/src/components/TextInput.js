// TextInput.js
import React from 'react'
import MaterialTextInput from 'react-materialize/lib/TextInput'

const TextInput = ({ onChangeText, ...rest }) => {
    const onChange = (event) => {
        if (onChangeText instanceof Function) {
            const text = event.target.value
            onChangeText(text)
        }
        if (rest.onChange instanceof Function) {
            rest.onChange(event)
        }
    }

    return <MaterialTextInput {...rest} onChange={onChange} />
}

export default TextInput
