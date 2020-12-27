import axios, { AxiosInstance } from 'axios'
import {
    HttpAdapter,
    Config,
    HttpAdapterConstructor,
} from './HttpAdapter'

export const AxiosHttpAdapter: HttpAdapterConstructor = class AxiosHttpAdapter
    implements HttpAdapter {
    private id = Math.floor(Math.random() * Math.floor(9999))

    private instance: AxiosInstance

    constructor(config: Config) {
        this.instance = axios.create({ baseURL: config.baseUrl })

    }

    private log(...args: any): void {
        console.log(`[${this.id} HttpAdapter]`, ...args)
    }

    async get<T>(url: string) {
        const response = await this.instance.get<T>(url, {
            headers: { 'Content-Type': 'application/json' },
        })
        return response.data
    }

    async post<T>(url: string, data: any) {
        const response = await this.instance.post<T>(url, data)
        return response.data
    }
}
