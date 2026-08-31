// RadioGroup.js
import React from 'react'

const RadioGroup = ({
  name,
  label,
  options,
  id,
  value,
  onChange,
  expected = 3,
  loading = false,
  tabIndex = 0,
}) => {
  const finalOpts = loading
    ? new Array(expected).fill().map((i) => ({ value: '', label: '...' }))
    : options

  return (
    <div className={['radio-group', loading ? 'loading' : ''].join(' ')}>
      {typeof label === 'string' && (
        <label className="input-field">{label}</label>
      )}
      {finalOpts.map((option, idx) => {
        return (
          <div key={idx.toString()} className="radio-row">
            <label
              key={`${idx}-${option.value}`}
              className="radio-label"
              htmlFor={`${id}-radio-${idx}`}
            >
              <input
                tabIndex={tabIndex}
                id={`${id}-radio-${idx}`}
                type="radio"
                name={name}
                value={option.value}
                checked={loading ? undefined : value === option.value}
                onChange={loading ? undefined : onChange}
              />
              <span className="radio-text">{option.label}</span>
            </label>
            <div className="loading-wrapper">
              <div className="loading-ghost" />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default RadioGroup
