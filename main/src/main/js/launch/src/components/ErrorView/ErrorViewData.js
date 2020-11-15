// ErrorViewData.js
export default class ErrorViewData {
    static SUCCESS = 'success'
    static ERROR = 'error'
    static INFO = 'info'
    static WARN = 'warn'

    constructor({
        message,
        severity = 'error',
        link = null,
        clipboard = null,
    }) {
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
