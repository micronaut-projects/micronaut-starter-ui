// Link.react.test.js
import React from 'react'
import { create, act } from 'react-test-renderer'
import { MicronautStarterSDK } from '../../../micronaut'
import ApplicationState from '../../../state/ApplicationState'
import { useHandleShareLinkRouteEffect } from '../useOnMountRouting'

const TestView = ({ sdk, initialData, routingHandlers }) => {
  useHandleShareLinkRouteEffect(sdk, initialData, routingHandlers)
  return <div></div>
}

const TestApp = ({ sdk, initialData, routingHandlers }) => (
  <ApplicationState>
    <TestView
      sdk={sdk}
      initialData={{ ...initialData }}
      routingHandlers={routingHandlers}
    />
  </ApplicationState>
)

it(`Test Duplicate Initialization Doesn't Re-Run Initial Routing`, async () => {
  const sdk = new MicronautStarterSDK({ baseUrl: 'http://localhost' })
  let action
  const routingHandlers = {
    preview: (payload, mnSdk, { showing = null }) => {
      if (action) action = { error: true }
      action = { key: 'preview', payload, showing: showing, sdk: mnSdk }
    },

    diff: (payload, mnSdk) => {
      if (action) action = { error: true }
      action = { key: 'diff', payload, sdk: mnSdk }
    },

    create: (payload, mnSdk) => {
      if (action) action = { error: true }
      action = { key: 'create', payload, sdk: mnSdk }
    },
  }

  let root
  act(() => {
    root = create(
      <TestApp
        sdk={sdk}
        initialData={{ activity: 'preview', type: 'DEFAULT' }}
        routingHandlers={routingHandlers}
      />
    )
  })
  expect(action.key).toEqual('preview')

  act(() => {
    root.update(
      <TestApp
        sdk={sdk}
        initialData={{ activity: 'diff', type: 'DEFAULT' }}
        routingHandlers={routingHandlers}
      />
    )
  })
  // The Key Doesn't Change
  expect(action.key).toEqual('preview')
})

const TEST_DATA = [
  { initialData: { type: 'DEFAULT', activity: 'diff' }, hasError: false },
  { initialData: { type: 'DEFAULT', activity: 'preview' }, hasError: false },
  {
    initialData: { type: 'DEFAULT', activity: 'preview', showing: 'README.md' },
    hasError: false,
  },
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
    const routingHandlers = {
      preview: (payload, mnSdk, { showing = null }) => {
        action = { key: 'preview', payload, showing: showing, sdk: mnSdk }
      },

      diff: (payload, mnSdk) => {
        action = { key: 'diff', payload, sdk: mnSdk }
      },

      create: (payload, mnSdk) => {
        action = { key: 'create', payload, sdk: mnSdk }
      },
    }
    const sdk = new MicronautStarterSDK({ baseUrl: 'http://localhost' })

    act(() => {
      create(
        <TestApp
          initialData={initialData}
          sdk={sdk}
          routingHandlers={routingHandlers}
        />
      )
    })

    if (hasError) {
      expect(action?.key).toEqual(undefined)
    } else {
      expect(action?.showing || null).toEqual(initialData?.showing || null)
      expect(action?.key).toEqual(initialData?.activity)
      expect(action.sdk).toEqual(sdk)
    }
  })
})
