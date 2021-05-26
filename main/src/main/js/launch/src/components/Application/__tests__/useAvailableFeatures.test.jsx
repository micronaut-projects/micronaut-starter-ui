// Link.react.test.js
import React, { useEffect, useLayoutEffect } from 'react'
import { create, act } from 'react-test-renderer'
import { useRecoilState, useResetRecoilState } from 'recoil'
import ApplicationState from '../../../state/ApplicationState'
import {
  sdkFactoryState,
  sdkState,
  selectedVersionState,
  useApplicationType,
  useAvailableFeatures,
} from '../../../state/store'

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

const useMount = (cb) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(() => cb(), [])
}

const TestView = ({ sdk, applicationType, onError }) => {
  const { features, error } = useAvailableFeatures()
  const [, setVersion] = useRecoilState(selectedVersionState)
  const [, setType] = useApplicationType()
  const [, setSdkFactory] = useRecoilState(sdkFactoryState)

  useMount(() => {
    setVersion({ api: sdk.baseUrl })
    setSdkFactory(() => () => sdk)
    setType(applicationType)
  })

  useEffect(() => {
    if (error) onError(error)
  }, [error, onError])

  return <div className="test">{JSON.stringify(features, null, 2)}</div>
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
        <ApplicationState>
          <TestView
            sdk={MockSdk}
            applicationType={initialData.type}
            onError={onError}
          />
        </ApplicationState>
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
