import _ from 'lodash'
import messages from '../constants/messages.json'

class LangApi {
  constructor() {
    this._cache_data = {}
  }

  trans(message, sub = {}) {
    return this._cache_data[message] || this._exec(message, sub)
  }

  _cache(key, message) {
    this._cache_data[key] = message
    return message
  }

  _exec(str, sub = {}) {
    const message = _.get(messages, str, str)
    // If there are no opts passed in we can skip interpolation
    if (_.isEmpty(sub)) return this._cache(message, sub)

    var compiled = _.template(message, { interpolate: /{{([\s\S]+?)}}/g })
    return compiled(sub)
  }
}

const langApi = new LangApi()

export default langApi
