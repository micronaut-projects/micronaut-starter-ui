// FeatureSelector.js
import React, { useMemo, useRef, useState } from 'react'

import { Button } from 'react-materialize'
import Col from 'react-materialize/lib/Col'
import Icon from 'react-materialize/lib/Icon'
import Modal from 'react-materialize/lib/Modal'
import Preloader from 'react-materialize/lib/Preloader'
import Row from 'react-materialize/lib/Row'
import messages from '../../constants/messages.json'
import { ModalKeyboardHandler } from '../../helpers/ModalKeyboardHandler'
import {
  useSelectedFeatures,
  useSelectedFeaturesHandlers,
} from '../../state/store'

import TextInput from '../TextInput'
import TooltipButton from '../TooltipButton'
import FeatureAvailable from './FeatureAvailable'

import './feature-selector.css'

const keyboardEventHandler = new ModalKeyboardHandler({
  sectionKey: 'modal-group',
  headerHeight: 24,
})

const featureSorter = (a, b) => {
  return a.category < b.category ? -1 : a.name < b.name ? -1 : 1
}

const featureCategoryReducer = (map, result) => {
  if (!map[result.category]) {
    map[result.category] = [result]
  } else {
    map[result.category].push(result)
  }
  return map
}

const FeatureAvailableGroup = ({ category, entities, toggleFeatures }) => {
  return (
    <Row className={`modal-group category ${category}`}>
      <Col s={12}>
        <h6>{category}</h6>
      </Col>
      {entities.map((feature, i) => (
        <Col s={12} key={i}>
          <FeatureAvailable feature={feature} toggleFeatures={toggleFeatures} />
        </Col>
      ))}
    </Row>
  )
}

export const FeatureSelectorModal = ({ theme = 'light' }) => {
  const inputRef = useRef(null)

  const [selectedFeatures, , features, loading] = useSelectedFeatures()
  const { onAddFeature, onRemoveFeature, onRemoveAllFeatures } =
    useSelectedFeaturesHandlers()

  const [search, setSearch] = useState('')

  const selectedFeatureKeys = Object.keys(selectedFeatures)
  const availableFeatures = useMemo(() => {
    return features.map((feature) => {
      return {
        ...feature,
        selected: selectedFeatureKeys.includes(feature.name),
      }
    })
  }, [features, selectedFeatureKeys])

  const searchResults = useMemo(() => {
    if (!search.length) {
      return availableFeatures
    }
    const lcSearch = search.toLowerCase()
    return availableFeatures.filter((feature) => {
      const { name, description, category } = feature
      return (
        name.toLowerCase().includes(lcSearch) ||
        description.toLowerCase().includes(lcSearch) ||
        category.toLowerCase().includes(lcSearch)
      )
    })
  }, [search, availableFeatures])

  const groupedResults = useMemo(() => {
    return searchResults.sort(featureSorter).reduce(featureCategoryReducer, {})
  }, [searchResults])

  const toggleFeatures = (event, feature) => {
    if (event && event.preventDefault) {
      event.preventDefault()
    }
    feature.selected ? onRemoveFeature(feature) : onAddFeature(feature)
  }

  const removeAll = (event) => {
    event.preventDefault()
    onRemoveAllFeatures()
  }

  const onModalClose = (event) => {
    const { firstElementChild } = event
    firstElementChild.scrollTop = 0
  }

  const onModalOpen = () => {
    if (inputRef.current && typeof inputRef.current.focus === 'function') {
      setTimeout(() => {
        inputRef.current.focus()
      }, 300)
    }
  }

  return (
    <div id="feature-selector-wrapper" style={{ marginBottom: 0 }}>
      <Modal
        className={`mn-feature-modal modal-lg ${theme}`}
        fixedFooter
        actions={[
          <Button waves="light" onClick={removeAll} flat>
            Remove All ({selectedFeatureKeys.length})
          </Button>,
          <Button waves="light" modal="close" flat>
            Done
          </Button>,
        ]}
        options={{
          onOpenStart: onModalOpen,
          onOpenEnd: keyboardEventHandler.onOpenEnd,
          onCloseEnd: keyboardEventHandler.onCloseEnd,
          onCloseStart: onModalClose,
          startingTop: '5%',
          endingTop: '5%',
        }}
        trigger={
          <TooltipButton
            tooltip={messages.tooltips.features}
            waves="light"
            className={theme}
            style={{ marginRight: '5px', width: '100%' }}
            tabIndex={1}
          >
            <Icon className="action-button-icon" left>
              add
            </Icon>
            Features
          </TooltipButton>
        }
      >
        <h4>
          <div className="modal-header">
            <TextInput
              ref={inputRef}
              id="features-selector-search-input"
              className="mn-input"
              label="Search Features"
              placeholder="ex: cassandra"
              name="search"
              s={12}
              autoComplete="off"
              value={search}
              onChangeText={setSearch}
            />
          </div>
        </h4>
        {loading ? (
          <Preloader />
        ) : (
          <Col s={12}>
            {searchResults.length === 0 && <p>No matching features</p>}
            {Object.keys(groupedResults).map((key) => {
              return (
                <FeatureAvailableGroup
                  key={key}
                  category={key}
                  entities={groupedResults[key]}
                  toggleFeatures={toggleFeatures}
                />
              )
            })}
          </Col>
        )}
      </Modal>
    </div>
  )
}

export default FeatureSelectorModal
