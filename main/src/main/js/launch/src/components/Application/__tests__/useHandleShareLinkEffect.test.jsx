// Link.react.test.js
import React from 'react'
import { create, act } from 'react-test-renderer'
import { MicronautStarterSDK } from '../../../micronaut'

import { useHandleShareLinkEffect } from '../useApplicationForm'

const TestView = ({ sdk, initialData, routingHandlers }) => {
  useHandleShareLinkEffect(sdk, initialData, routingHandlers)
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
  }`, () => {
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

    let testRenderer
    act(() => {
      testRenderer = create(
        <TestView
          sdk={sdk}
          initialData={{ ...initialData }}
          routingHandlers={routingHandlers}
        />
      )
    })

    if (hasError) {
      expect(action?.key).toEqual(undefined)
    } else {
      expect(action?.key).toEqual(initialData?.activity)
    }
  })
})
