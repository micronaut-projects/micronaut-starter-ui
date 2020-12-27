import axios, { AxiosInstance } from 'axios'

export type Config = {
    baseUrl: string
}

export type HttpAdapterConfig = {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
    headers?: Record<string, string>
}

export interface HttpAdapterConstructor {
    new (config: Config): HttpAdapter
}

export interface HttpAdapter {

    get<T>(url: string): Promise<T>
    post<T>(url: string, data: any): Promise<T>
}
