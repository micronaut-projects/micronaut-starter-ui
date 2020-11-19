export const parseQuery = (query) => {
    if (typeof query !== 'string' || !query.includes('=')) {
        return {}
    }

    return query.split('&').reduce((acc, val) => {
        const [key, value] = val.split('=')
        acc[key] = decodeURIComponent(value)
        return acc
    }, {})
}
