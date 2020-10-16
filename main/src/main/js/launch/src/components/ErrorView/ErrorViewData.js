// ErrorViewData.js
export default class ErrorViewData {
    static SUCCESS = "success";
    static ERROR = "error";
    static INFO = "info";
    static WARN = "warn";

    constructor({message, severity = "error", link  = null}) {
        this.message = message
        this.severity = severity
        this.link = link || null
    }

    static ofNone() {
        return new ErrorViewData({message: "", severity: ErrorViewData.INFO})
    }

    static ofSuccess(message, link) {
        return new ErrorViewData({message, severity: ErrorViewData.SUCCESS, link})
    }

    static ofInfo(message, link) {
        return new ErrorViewData({message, severity: ErrorViewData.INFO, link})
    }

    static ofError(message, link) {
        return new ErrorViewData({message, severity: ErrorViewData.ERROR, link})
    }

    static ofWarn(message, link) {
        return new ErrorViewData({message, severity: ErrorViewData.WARN, link})
    }

    static fromCaught(error) {
        return new ErrorViewData({message: error.message, severity: ErrorViewData.SUCCESS})
    }
}