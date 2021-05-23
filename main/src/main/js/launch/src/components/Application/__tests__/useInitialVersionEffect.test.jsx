// Link.react.test.js
import React, { useState } from 'react'
import { create, act } from 'react-test-renderer'

import { useInitialVersionEffect } from '../useApplicationForm'

const TestView = ({ initialVersion, availableVersions, handlerWarning }) => {
  const [version, setSelectedVersion] = useState(null)

  useInitialVersionEffect(
    initialVersion,
    availableVersions,
    setSelectedVersion,
    handlerWarning
  )
  return <div className="test">{version?.version}</div>
}

const TEST_DATA = [
  { initialVersion: undefined, expected: '2.1', hasError: false },
  { initialVersion: null, expected: '2.1', hasError: false },
  { initialVersion: '2.1', expected: '2.1', hasError: false },
  { initialVersion: '2.0', expected: '2.1', hasError: true },
  { initialVersion: '2.2-SNAPSHOT', expected: '2.2-SNAPSHOT', hasError: false },
]

TEST_DATA.forEach(({ initialVersion, expected, hasError }) => {
  it(`Initial Version with value of "${initialVersion}"`, () => {
    let availableVersions = [{ version: '2.1' }, { version: '2.2-SNAPSHOT' }]

    let error = null
    const handlerWarning = (e) => {
      error = e
    }

    let testRenderer
    act(() => {
      testRenderer = create(
        <TestView
          initialVersion={initialVersion}
          availableVersions={availableVersions}
          handlerWarning={handlerWarning}
        />
      )
    })

    const testInstance = testRenderer.root
    expect(testRenderer.toJSON()).toMatchSnapshot()
    expect(testInstance.findByProps({ className: 'test' }).children).toEqual([
      expected,
    ])

    if (hasError) {
      expect(error).toEqual(
        `Micronaut Launch no longer supports version ${initialVersion} we're setting the configuration to the most recent release version ${availableVersions[0].version}`
      )
    }
  })
})
