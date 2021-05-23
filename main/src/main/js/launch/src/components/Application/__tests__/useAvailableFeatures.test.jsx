// Link.react.test.js
import React from 'react'
import { create, act } from 'react-test-renderer'

import { useAvailableFeatures } from '../useApplicationFormInitializer'

const MockTypes = {
  DEFAULT: { features: ['a', 'b', 'c'] },
}
const MockSdk = {
  baseUrl: 'http://pretend.com',
  features: async ({ type }) => {
    const types = MockTypes[type]
    if (!types) {
      throw new Error('Invalid Type')
    }
    return types
  },
}

const TestView = ({ sdk, applicationType, onError }) => {
  const { availableFeatures } = useAvailableFeatures(
    sdk,
    applicationType,
    onError
  )

  return (
    <div className="test">{JSON.stringify(availableFeatures, null, 2)}</div>
  )
}

const TEST_DATA = [
  { initialData: { type: 'DEFAULT' }, hasError: false },
  { initialData: { type: 'BOOM' }, hasError: true },
]

TEST_DATA.forEach(({ initialData, hasError }) => {
  it(`Initial Form Data with "${initialData.type}"`, async () => {
    let error = null
    const onError = (e) => {
      error = e
    }

    let testRenderer
    act(() => {
      testRenderer = create(
        <TestView
          sdk={MockSdk}
          applicationType={initialData.type}
          onError={onError}
        />
      )
    })
    await act(() => Promise.resolve())

    expect(testRenderer.toJSON()).toMatchSnapshot()
    if (hasError) {
      expect(error).not.toBeNull()
    } else {
      expect(error).toBeNull()
    }
  })
})
