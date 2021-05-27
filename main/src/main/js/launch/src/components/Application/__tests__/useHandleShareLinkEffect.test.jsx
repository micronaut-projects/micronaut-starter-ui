// Link.react.test.js
import React, { useLayoutEffect } from 'react'
import { create, act } from 'react-test-renderer'
import { useRecoilState } from 'recoil'
import { MicronautStarterSDK } from '../../../micronaut'
import ApplicationState from '../../../state/ApplicationState'
import { selectedVersionState } from '../../../state/store'
import { useHandleShareLinkEffect } from '../useOnMountRouting'

const useMount = (cb) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(() => cb(), [])
}

const TestView = ({ initialData, routingHandlers }) => {
  useHandleShareLinkEffect(initialData, routingHandlers)
  const [, setVersion] = useRecoilState(selectedVersionState)
  useMount(() => {
    setVersion({ api: 'https://pretend.com' })
  })
  return <div></div>
}

const TEST_DATA = [
  { initialData: { type: 'DEFAULT', activity: 'diff' }, hasError: false },
  { initialData: { type: 'DEFAULT', activity: 'preview' }, hasError: false },
  { initialData: { type: 'DEFAULT', activity: 'create' }, hasError: false },
  { initialData: { type: 'DEFAULT', activity: 'notHandled' }, hasError: true },
  { initialData: { activity: 'create' }, hasError: true },
  {
    initialData: { build: 'ANY', activity: 'diff' },
    explain: 'valid by build',
    hasError: false,
  },
  {
    initialData: { lang: 'ANY', activity: 'diff' },
    explain: 'valid by lang',
    hasError: false,
  },
  {
    initialData: { test: 'ANY', activity: 'diff' },
    explain: 'valid by test',
    hasError: false,
  },
]

TEST_DATA.forEach(({ initialData, explain, hasError }) => {
  it(`Test Deep Linking Effect "${explain || initialData.activity}" ${
    hasError ? 'w/ Error' : ''
  }`, async () => {
    // Routing
    let action = null
    const sdk = new MicronautStarterSDK({ baseUrl: 'http://localhost' })
    const routingHandlers = {
      preview: (payload, mnSdk, opts = { showing: null }) => {
        action = { key: 'preview', payload }
      },

      diff: (payload, mnSdk) => {
        action = { key: 'diff', payload }
      },

      create: (payload, mnSdk) => {
        action = { key: 'create', payload }
      },
    }

    act(() => {
      create(
        <ApplicationState initialData={initialData}>
          <TestView
            sdk={sdk}
            initialData={{ ...initialData }}
            routingHandlers={routingHandlers}
          />
        </ApplicationState>
      )
    })

    if (hasError) {
      expect(action?.key).toEqual(undefined)
    } else {
      expect(action?.key).toEqual(initialData?.activity)
    }
  })
})
