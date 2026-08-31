// TextInput.js
import React, { forwardRef } from 'react'
import MaterialTextInput from 'react-materialize/lib/TextInput'

const TextInput = ({ onChangeText, ...rest }, ref) => {
  const onChange = (event) => {
    if (onChangeText instanceof Function) {
      const text = event.target.value
      onChangeText(text)
    }
    if (rest.onChange instanceof Function) {
      rest.onChange(event)
    }
  }

  return <MaterialTextInput ref={ref} {...rest} onChange={onChange} />
}

export default forwardRef(TextInput)
