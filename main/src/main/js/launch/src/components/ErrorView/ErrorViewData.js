// ErrorViewData.js
export default class ErrorViewData {
    static SUCCESS = "success";
    static ERROR = "error";
    static INFO = "info";
    static WARN = "warn";

    constructor({message, severity = "error"}) {
        this.message = message
        this.severity = severity
    }

    static ofNone() {
        return new ErrorViewData({message: "", severity: ErrorViewData.INFO})
    }

    static ofSuccess(message) {
        return new ErrorViewData({message, severity: ErrorViewData.SUCCESS})
    }

    static ofError(message) {
        return new ErrorViewData({message, severity: ErrorViewData.ERROR})
    }

    static ofInfo(message) {
        return new ErrorViewData({message, severity: ErrorViewData.INFO})
    }

    static ofWarn(message) {
        return new ErrorViewData({message, severity: ErrorViewData.WARN})
    }

    static fromCaught(error) {
        return new ErrorViewData({message: error.message, severity: ErrorViewData.SUCCESS})
    }
}