import ErrorViewData, {
  errorHandlersFactory,
  FALLBACK_ERROR_MESSAGE,
} from '../ErrorViewData'

describe('Tests onResponse Errors', () => {
  const expected = 'THIS IS THE ERROR'

  function responseMocker(json) {
    return {
      json: () => json,
    }
  }

  const TEST_DATA = {
    'Test as "message"': {
      response: responseMocker({ message: expected }),
      expected,
    },

    'Test as "_embedded.errors[0].message"': {
      response: responseMocker({
        _embedded: {
          errors: [{ message: expected }, { message: 'INCORRECT_POSTION' }],
        },
      }),
      expected,
    },

    'Test as Error"': {
      response: new Error(expected),
      expected,
    },

    'Test as unhandled fallback"': {
      response: {},
      expected: FALLBACK_ERROR_MESSAGE,
    },
  }

  Object.entries(TEST_DATA).forEach(([test, { response, expected }]) => {
    it(test, async () => {
      let actual = null
      function setError(error) {
        actual = error
      }
      const errorHandler = errorHandlersFactory(setError)

      await errorHandler.onResponseError(response)

      expect(actual.message).toBe(expected)
    })
  })
})

describe('Test errorHandlersFactory', () => {
  const TEST_DATA = {
    [ErrorViewData.INFO]: { fn: 'onInfo' },
    [ErrorViewData.ERROR]: { fn: 'onError' },
    [ErrorViewData.SUCCESS]: { fn: 'onSuccess' },
    [ErrorViewData.WARN]: { fn: 'onWarn' },
  }

  Object.entries(TEST_DATA).forEach(([key, { fn }]) => {
    it(`${fn} Correctly Renders`, async () => {
      let actual = null
      function setError(error) {
        actual = error
      }
      const errorHandler = errorHandlersFactory(setError)
      await errorHandler[fn]('OK')
      expect(actual.severity).toBe(key)
      expect(actual.message).toBe('OK')
    })
  })
})
