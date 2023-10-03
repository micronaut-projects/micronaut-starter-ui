// ErrorViewData.js
export const FALLBACK_ERROR_MESSAGE = 'something went wrong.'
export default class ErrorViewData {
  static SUCCESS = 'success'
  static ERROR = 'error'
  static INFO = 'info'
  static WARN = 'warning'

  constructor({ message, severity = 'error', link = null, clipboard = null }) {
    this.message = message
    this.severity = severity
    this.link = link || null
    this.clipboard = clipboard || null
  }

  static ofNone() {
    return new ErrorViewData({ message: '', severity: ErrorViewData.INFO })
  }

  static ofSuccess(message, link, clipboard) {
    return new ErrorViewData({
      message,
      severity: ErrorViewData.SUCCESS,
      link,
      clipboard,
    })
  }

  static ofInfo(message, link, clipboard) {
    return new ErrorViewData({
      message,
      severity: ErrorViewData.INFO,
      link,
      clipboard,
    })
  }

  static ofError(message, link, clipboard) {
    return new ErrorViewData({
      message,
      severity: ErrorViewData.ERROR,
      link,
      clipboard,
    })
  }

  static ofWarn(message, link, clipboard) {
    return new ErrorViewData({
      message,
      severity: ErrorViewData.WARN,
      link,
      clipboard,
    })
  }

  static fromCaught(error) {
    return new ErrorViewData({
      message: error.message,
      severity: ErrorViewData.SUCCESS,
    })
  }
}

export const errorHandlersFactory = (setError) => {
  const onResponseError = async (response) => {
    if (response instanceof Error) {
      return setError(new ErrorViewData(response))
    }
    const payload = ErrorViewData.ofError(FALLBACK_ERROR_MESSAGE)
    if (!(response.json instanceof Function)) {
      return setError(payload)
    }
    try {
      const json = await response.json()
      const message =
        json._embedded?.errors?.[0].message ?? json.message ?? payload.message

      setError(ErrorViewData.ofError(message))
    } catch (err) {
      setError(payload)
    }
  }

  return {
    onClear: () => setError(ErrorViewData.ofNone()),
    onError: (message) => setError(ErrorViewData.ofError(message)),
    onInfo: (message) => setError(ErrorViewData.ofInfo(message)),
    onSuccess: (message) => setError(ErrorViewData.ofSuccess(message)),
    onWarn: (message) => setError(ErrorViewData.ofWarn(message)),
    onResponseError,
  }
}
