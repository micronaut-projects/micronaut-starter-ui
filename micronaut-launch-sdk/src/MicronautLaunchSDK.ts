import { ActivityProps, CreateCommand } from './CreateCommand'
import {
    ApplicationTypeInfo,
    ApplicationTypeList,
    ApplicationTypeRequest,
    Defaults,
    FeatureList,
    HasDefaults,
    Language,
    Preview,
    SelectOptionDefaults,
    SelectOptions,
    Versions,
} from './TypeDefs'

import { HttpAdapter, Config } from './http'
import { CacheApi, CACHE_10_MIN, SessionStorageAdapter } from './Cache'
import { MicronautLaunchError } from './MicronautLaunchError'

export class MicronautLaunchSDK {
    baseUrl: string
    adapter: HttpAdapter
    _cache: CacheApi
    constructor(config: Config) {
        this.baseUrl = config.baseUrl
        this.adapter = new HttpAdapter(config)
        this._cache = new CacheApi(
            new SessionStorageAdapter(`micronaut-sdk:${config.baseUrl}`)
        )
    }

    private urlBuilder(url: string): string {
        return `${this.baseUrl}${url}`
    }

    private async get<T>(url: string) {
        return this.adapter.get<T>(url).catch((error) => {
            if (error.response) {
                error.message = error.response.data.message
            }
            throw error
        })
    }

    private cache<T>(url: string): Promise<T> {
        return this._cache.cache<T>(url, () => this.get<T>(url), CACHE_10_MIN)
    }

    /**
     * Provides a description of the API.
     */
    description() {
        return this.get<string>('/')
    }

    /**
     * Get Select Options / and defaults for starter
     */
    selectOptions() {
        return this.cache<SelectOptions>('/select-options')
    }

    /**
     * Informationtion about feature versions provided by this instance.
     */
    versions() {
        return this.cache<Versions>(`/versions`)
    }

    /**
     * List the application types.
     */
    applicationTypes() {
        return this.get<ApplicationTypeList>(`/application-types`)
    }

    /**
     * Get a specific application type.
     * @param params the Application Type request params
     */
    applicationTypeInfo(params: ApplicationTypeRequest) {
        return this.get<ApplicationTypeInfo>(
            `/application-types/${params.type}`
        )
    }

    /**
     * Get a list of features for a given Application Type
     * @param params the Application Type request params
     */
    features(params: ApplicationTypeRequest) {
        return this.get<FeatureList>(
            `/application-types/${params.type}/features`
        )
    }

    /**
     * Diffs the whole application for all selected features.
     * @param configuration
     */
    diff(configuration: CreateCommand) {
        const createCommand = new CreateCommand(configuration)
        return this.get<string>(createCommand.toUrl('diff'))
    }

    /**
     * Previews the contents of a generated application.
     * @param configuration The create command data
     */
    preview(configuration: ActivityProps) {
        const createCommand = new CreateCommand(configuration)
        return this.get<Preview>(createCommand.toUrl('preview'))
    }

    /**
     * Creates an application, generating a ZIP file as the response.
     * @param  {Object} configuration The create command data
     */
    create(configuration: ActivityProps) {
        const createCommand = new CreateCommand(configuration)
        return this.get<Blob>(createCommand.toUrl('create'))
    }

    /**
     * Get The HREF for the clone to github feature.
     * @param configuration The create command data
     */
    gitHubHref(configuration: ActivityProps) {
        const createCommand = new CreateCommand(configuration)
        return this.urlBuilder(createCommand.toUrl('github'))
    }

    /**
     * Get The HREF for the clone to github feature.
     * @param baseUrl the baseUrl
     * @param configuration The create command data
     */
    static githubHrefForUrl(baseUrl: string, configuration: ActivityProps) {
        if (!baseUrl) {
            return '#'
        }
        const createCommand = new CreateCommand(configuration)
        return `${baseUrl}${createCommand.toUrl('github')}`
    }

    /**
     * Extract correlative defaults for given types
     * These can be used to change the state of the UI
     */
    static extractDefaults(options: SelectOptions): Defaults {
        return {
            lang: options.lang.options.reduce((acc, lang) => {
                acc[lang.value] = {
                    build: lang.defaults.build,
                    test: lang.defaults.test,
                }
                return acc
            }, {} as Record<Language, HasDefaults>),
        }
    }

    /**
     * Extract The Default values of a given select option aray
     */
    static extractDefaultOptions(options: SelectOptions): SelectOptionDefaults {
        return {
            lang: options.lang.defaultOption,
            test: options.test.defaultOption,
            build: options.build.defaultOption,
            type: options.type.defaultOption,
            jdkVersion: options.jdkVersion.defaultOption,
        }
    }
}
