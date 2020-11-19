import _ from 'lodash'

export const defaultsSpreader = (defaults) => (key, value, touched) => {
  const spread = {
    [key]: value.replace(/[^a-z\d.\-_]/gi, ''),
  }
  const recipe = _.get(defaults, [key, value])
  if (recipe) {
    Object.keys(recipe).forEach((aKey) => {
      if (touched[aKey] !== true) {
        spread[aKey] = recipe[aKey]
      }
    })
  }
  touched[key] = true
  return spread
}
