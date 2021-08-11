import React from 'react'
import { create, act } from 'react-test-renderer'
import ApplicationState from '../../../state/ApplicationState'

import { App } from '../App'

it(`Application Launches`, () => {
  let testRenderer
  act(() => {
    testRenderer = create(
      <ApplicationState initialData={{}}>
        <App />
      </ApplicationState>
    )
  })
  expect(testRenderer.toJSON()).toMatchSnapshot()
})
