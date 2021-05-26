// FeatureSelected.js
import React, { useMemo } from 'react'
import { useSelectedFeatures } from '../../state/store'

const closeButtonStyle = {
  cursor: 'pointer',
  float: 'right',
  fontSize: '16px',
  lineHeight: '32px',
  paddingLeft: '8px',
}

function useFeaturesHandler(setFeaturesSelected) {
  return useMemo(() => {
    const addFeature = (feature) => {
      setFeaturesSelected(({ ...draft }) => {
        draft[feature.name] = feature
        return draft
      })
    }

    const removeFeature = (feature) => {
      setFeaturesSelected(({ ...draft }) => {
        delete draft[feature.name]
        return draft
      })
    }

    const removeAllFeatures = () => {
      setFeaturesSelected({})
    }

    return [addFeature, removeFeature, removeAllFeatures]
  }, [setFeaturesSelected])
}

export function FeatureSelected({ feature, onRemoveFeature }) {
  return (
    <div style={{ marginRight: 10 }} className="chip">
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
  const [selectedFeatures, setSelectedFeatures] = useSelectedFeatures()
  const [, onRemoveFeature] = useFeaturesHandler(setSelectedFeatures)

  const selectedFeatureValues = useMemo(
    () =>
      Object.values(selectedFeatures).sort((a, b) => {
        return a.name > b.name ? 1 : -1
      }),
    [selectedFeatures]
  )

  const sRows = useMemo(
    () =>
      selectedFeatureValues.map((f, idx) => (
        <FeatureSelected
          key={`${f.name}-${idx}`}
          feature={f}
          onRemoveFeature={() => onRemoveFeature(f)}
        />
      )),
    [selectedFeatureValues, onRemoveFeature]
  )

  return (
    <div className="col s12">
      <h6>Included Features ({selectedFeatureValues.length})</h6>
      {sRows}
    </div>
  )
}
