import { parseQuery } from './url'

const BASE_PATH = 'launch'
const HANDLED_ROUTES = ['diff', 'preview', 'create']

export function sharableLink(form, features, action) {
  return [
    ...Object.keys(form).reduce((acc, key) => {
      acc.push(`${key}=${form[key]}`)
      return acc
    }, []),
    ...Object.keys(features).map((feature) => `features=${feature}`),
  ].join('&')
}

export function fullyQualifySharableLink(sharable, options = {}) {
  const { origin, pathname } = window.location
  const { action } = options
  let url = `${origin}${pathname}?${sharable}`
  if (action) {
    url += `&route=${action}`
  }
  return url
}

export function parseAndConsumeQuery() {
  const { search } = window.location
  const results = parseQuery(search)
  // TODO: Do we want to sub out the share url once the site is loaded?
  const [baseUrl] = window.location.toString().split('?', 2)
  window.history.replaceState({}, document.title, baseUrl)
  return results
}

export function isDeepLinkReferral(shareData = {}) {
  return shareData.type || shareData.lang || shareData.test || shareData.build
}

export function resolveActionRoute(queryData) {
  if (!queryData instanceof Object) {
    return
  }
  const { route } = queryData
  if (route && HANDLED_ROUTES.includes(route)) {
    return route
  }
}

export function resetRoute(full = true) {
  const search = full ? '' : window.location.search
  window.history.replaceState({}, document.title, `/${BASE_PATH}${search}`)
}

export function updateRoute(route) {
  const { search } = window.location
  window.history.replaceState(
    {},
    document.title,
    `/${BASE_PATH}/${route}${search}`
  )
}

export function updateParams(search) {
  const { pathname } = window.location
  window.history.replaceState({}, document.title, `${pathname}?${search}`)
}
