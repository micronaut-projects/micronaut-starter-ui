export const parseQuery = (query) => {
  if (typeof query !== 'string' || !query.includes('=')) {
    return {}
  }
  return query
    .replace('?', '')
    .split('&')
    .reduce((acc, part) => {
      const [key, value] = part.split('=')
      const entry = acc[key]

      if (!entry) {
        // No Entry
        acc[key] = decodeURIComponent(value)
      } else if (!Array.isArray(entry)) {
        // This is the second occurrence suggesting it should be converted to an array
        acc[key] = [entry, value]
      } else {
        // The Third or > occurrence and we already have an array to push onto
        acc[key].push(value)
      }
      return acc
    }, {})
}
