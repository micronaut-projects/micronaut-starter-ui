export class MicronautLaunchError extends Error {
    status: Number
    name = 'MicronautLaunchError'

    constructor(message: string, status: Number) {
        super(message)
        this.status = status
    }
}
