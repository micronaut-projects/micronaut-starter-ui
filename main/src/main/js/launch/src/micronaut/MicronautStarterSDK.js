import { CacheApi, SessionStorageAdapter } from '../helpers/Cache'
import { CreateCommand } from './CreateCommand'
import { isSupported } from './Supports'

const responseHandler = (type = 'json') => (response) => {
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
    return `${this.baseUrl}${url}`
  }

  _cache(url, handler) {
    return this.cacheApi.cache(url, () => this.get(url).then(handler))
  }

  /**
   * Underlying GET Request
   * @param  {String} url the url
   * @return {Response}   the unhandled fetch response
   */
  get(url) {
    return fetch(this._urlBuilder(url), {
      headers: new Headers({
        method: 'GET',
        'X-API-VERSION': this.version,
        'Content-Type': 'application/json',
      }),
    })
  }

  /**
   * Create the Zip File of the Project
   * @param  {Object} configuration The command data
   * @return {[type]}        [description]
   */
  async create(configuration) {
    const createCommand = new CreateCommand(configuration)
    return this.get(createCommand.toUrl('create')).then(responseHandler('blob'))
  }

  /**
   * Get The HREF for the clone to github feature.
   * @param  {Object} configuration [description]
   * @return {[type]}        [description]
   */
  gitHubHref(configuration) {
    const createCommand = new CreateCommand(configuration)
    return this._urlBuilder(createCommand.toUrl('github'))
  }

  /**
   * Get Generated Preview for a given configuration
   * @param  {[type]} configuration [description]
   * @return {[type]}         [description]
   */
  async preview(configuration) {
    const createCommand = new CreateCommand(configuration)
    return this.get(createCommand.toUrl('preview')).then(
      responseHandler('json')
    )
  }

  /**
   * Get A Diff string for a given configuration
   * @param  {[type]} configuration [description]
   * @return {[type]}         [description]
   */
  async diff(configuration) {
    const createCommand = new CreateCommand(configuration)
    return this.get(createCommand.toUrl('diff')).then(responseHandler('text'))
  }

  /**
   * Get Select Options / And defaults for starter
   * @return {Object}  Select Options
   */
  async selectOptions() {
    return this._cache('/select-options', responseHandler('json'))
  }

  /**
   * Get a list of features for a given Application Type
   * @param  {String} options.type Application Type
   * @return {Array}               List of features
   */
  async features({ type }) {
    return this._cache(
      `/application-types/${type}/features`,
      responseHandler('json')
    )
  }

  /**
   * Ger version info
   * @return {[type]} [description]
   */
  async versions() {
    return this._cache(`/versions`, responseHandler('json'))
  }

  /**
   * Get The HREF for the clone to github feature.
   * @param {String}
   * @param  {Object} configuration The create command data
   * @return {String}               The Href string for the Push to GH action
   */
  static githubHrefForUrl(url, configuration) {
    if (!url) {
      return '#'
    }
    const createCommand = new CreateCommand(configuration)
    return `${url}${createCommand.toUrl('github')}`
  }

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

  static extractDefaultOptions(options) {
    return Object.keys(options).reduce((acc, key) => {
      acc[key] = options[key].defaultOption.value
      return acc
    }, {})
  }

  static isSupported(currentVersion, supportedFeature) {
    return isSupported(currentVersion, supportedFeature)
  }
}
