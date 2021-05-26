// FeatureSelected.js
import React, { useMemo } from 'react'
import {
  useAvailableFeatures,
  useSelectedFeaturesHandlers,
  useSelectedFeaturesValue,
} from '../../state/store'

const closeButtonStyle = {
  cursor: 'pointer',
  float: 'right',
  fontSize: '16px',
  lineHeight: '32px',
  paddingLeft: '8px',
}

export function FeatureSelected({ feature, onRemoveFeature, hasError }) {
  const style = { marginRight: 10 }
  if (hasError) {
    style.background = 'var(--theme-danger)'
    style.color = 'white'
  }
  return (
    <div style={style} className="chip">
      {feature.name}
      <i
        onClick={(e) => {
          e.preventDefault()
          onRemoveFeature(feature)
        }}
        className="material-icons"
        style={closeButtonStyle}
      >
        close
      </i>
    </div>
  )
}

export function FeatureSelectedList() {
  const selectedFeatures = useSelectedFeaturesValue()
  const { features: availableFeatures } = useAvailableFeatures()
  const { onRemoveFeature } = useSelectedFeaturesHandlers()

  const selectedFeatureValues = useMemo(
    () =>
      Object.values(selectedFeatures).sort((a, b) => {
        return a.name > b.name ? 1 : -1
      }),
    [selectedFeatures]
  )

  const sRows = useMemo(() => {
    const keys = availableFeatures.map((i) => i.name)

    return selectedFeatureValues.map((f, idx) => (
      <FeatureSelected
        key={`${f.name}-${idx}`}
        feature={f}
        hasError={keys.length && !keys.includes(f.name)}
        onRemoveFeature={() => onRemoveFeature(f)}
      />
    ))
  }, [selectedFeatureValues, onRemoveFeature, availableFeatures])

  return (
    <div className="col s12">
      <h6>Included Features ({selectedFeatureValues.length})</h6>
      {sRows}
    </div>
  )
}
