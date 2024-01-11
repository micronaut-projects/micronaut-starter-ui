import { CacheApi, SessionStorageAdapter } from '../helpers/Cache'
import { VERSION_FEED_URL } from './constants'
import { CreateCommand } from './CreateCommand'

const responseHandler =
  (type = 'json') =>
  (response) => {
    if (!response.ok) {
      throw response
    }
    return response[type]()
  }

export class MicronautStarterSDK {
  constructor({ baseUrl }) {
    this.cacheApi = new CacheApi(new SessionStorageAdapter(`${baseUrl}`))
    this.baseUrl = baseUrl
  }

  _urlBuilder(url) {
    if (url.startsWith('http')) {
      return url
    }
    return `${this.baseUrl}${url}`
  }

  _cache(url, handler) {
    return this.cacheApi.cache(url, () => this.get(url).then(handler))
  }

  /**
   * Underlying GET Request
   * @param  {String} url the url
   * @return {Promise<Response>}   the unhandled fetch response
   */
  get(url) {
    return fetch(this._urlBuilder(url), {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    })
  }

  /**
   * Provides a description of the API.
   * @return {Promise<String>}  description
   */
  async description() {
    return this._cache('/', responseHandler('text'))
  }

  /**
   * Get Select Options / and defaults for starter
   * @return {Promise<Object>}  Select Options
   */
  async selectOptions() {
    return this._cache('/select-options', responseHandler('json'))
  }

  /**
   * Information about feature versions provided by this instance.
   * @return {Promise<Object>} version information
   */
  async versions() {
    return this._cache(`/versions`, responseHandler('json'))
  }

  /**
   * List the application types.
   * @return {Promise<Object>} The types
   */
  async applicationTypes() {
    return this._cache(`/application-types`, responseHandler('json'))
  }

  /**
   * Get a specific application type.
   * @return {Promise<Object>} The type
   */
  async applicationTypeInfo({ type }) {
    return this._cache(`/application-types/${type}`, responseHandler('json'))
  }

  /**
   * Get a list of features for a given Application Type
   * @param  {String} options.type Application Type
   * @return {Promise<Array>}               List of features
   */
  async features({ type }) {
    return this._cache(
      `/application-types/${type}/features`,
      responseHandler('json')
    )
  }

  /**
   * Diffs the whole application for all selected features.
   * @param  {Object} configuration command parameters
   * @return {Promise<String>}         A textual diff
   */
  async diff(configuration) {
    const createCommand = new CreateCommand(configuration, this.baseUrl)
    return this.get(createCommand.toUrl('diff')).then(responseHandler('text'))
  }

  /**
   * Previews the contents of a generated application.
   * @param  {Object} configuration command parameters
   * @return {Promise<Object>}         [description]
   */
  async preview(configuration) {
    const createCommand = new CreateCommand(configuration, this.baseUrl)
    return this.get(createCommand.toUrl('preview')).then(
      responseHandler('json')
    )
  }

  /**
   * Creates an application, generating a ZIP file as the response.
   * @param  {Object} configuration command parameters
   * @return {Promise<Blob>} A ZIP file containing the generated application.
   */
  async create(configuration) {
    const createCommand = new CreateCommand(configuration, this.baseUrl)
    return this.get(createCommand.toUrl('create')).then(responseHandler('blob'))
  }

  /**
   * Get The HREF for the clone to github feature.
   * @param  {Object} configuration command parameters
   * @return {String} The link will begin processing the github workflow with redirects
   */
  gitHubHref(configuration) {
    const createCommand = new CreateCommand(configuration, this.baseUrl)
    return createCommand.toUrl('github')
  }

  static createCommand(configuration, baseUrl) {
    return new CreateCommand(configuration, baseUrl)
  }


  static curlCommand(baseUrl, configuration) {
    if (!baseUrl) {
      console.warn('No URL provided for curlCommand')
      return ''
    }
    const createCommand = new CreateCommand(configuration, baseUrl)
    return createCommand.toCurl()
  }

  static cliCommand(configuration) {
    const createCommand = new CreateCommand(configuration)
    return createCommand.toCli()
  }

  /**
   * Extract correlative defaults for given types
   * These can be used to change the state of the UI
   * @param  {Object} options Select Optons keyed by type
   * @return {Object}         defaults keyed by type
   */
  static extractDefaults(options) {
    return Object.keys(options).reduce((acc, key) => {
      const val = options[key].options.reduce((acc, opt) => {
        const val = opt['defaults']
        if (val) {
          acc[opt.value] = opt['defaults']
        }
        return acc
      }, {})

      if (Object.keys(val).length) {
        acc[key] = val
      }
      return acc
    }, {})
  }

  /**
   * Extract The Default values of a given select option aray
   * @param  {Object} options Select Options keyed by type
   * @return {Object}         Select Option defaults keyed by type
   */
  static extractDefaultOptions(options) {
    return Object.keys(options).reduce((acc, key) => {
      acc[key] = options[key].defaultOption.value
      return acc
    }, {})
  }

  /**
   * Rebuild features array of string into an object suitable for select options
   * @note This is mostly for reconstruction from query parameter data.
   *
   * @param {Array<String>} features  An Array of Strings
   * @return {Object<String,Object>}  Select Option keyed by feature name
   */
  static reconstructFeatures(features) {
    if (!features) {
      return {}
    }

    if (!Array.isArray(features)) {
      features = [features]
    }

    return features.reduce((acc, feature) => {
      acc[feature] = { name: feature }
      return acc
    }, {})
  }

  static async loadVersion({ baseUrl, key, order }) {
    const mn = new this({ baseUrl })
    const result = await mn.versions()
    const version = result.versions['micronaut.version']
    return {
      key: key,
      label: version,
      version: version,
      value: baseUrl,
      api: baseUrl,
      order,
    }
  }

  static async loadVersions() {
    const { versions } = await fetch(VERSION_FEED_URL).then(
      responseHandler('json')
    )

    const maybeLoadVersion = (version) =>
      this.loadVersion(version).catch((i) => null)

    return (
      await Promise.all(
        versions.sort((a, b) => a.order - b.order).map(maybeLoadVersion)
      )
    ).filter((i) => i)
  }
}
