import axios, { AxiosInstance } from 'axios'

export type HttpAdapterConfig = {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
    headers?: Record<string, string>
}

export type Config = {
    baseUrl: string
}

export class HttpAdapter {
    private instance: AxiosInstance

    constructor(config: Config) {
        this.instance = axios.create({ baseURL: config.baseUrl })
    }

    async get<T>(url: string) {
        console.log({ url })
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
