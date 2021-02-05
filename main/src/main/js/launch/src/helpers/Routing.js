import { parseQuery } from './url'

const BASE_PATH = 'launch'
const HANDLED_ROUTES = ['diff', 'preview']

export function parseAndConsumeQuery() {
  const { search } = window.location
  const results = parseQuery(search)
  // TODO: Do we want to sub out the share url once the site is loaded?
  // const [baseUrl] = window.location.toString().split('?', 2)
  // window.history.replaceState({}, document.title, baseUrl)
  return results
}

export function isDeepLinkReferral(shareData = {}) {
  return shareData.type || shareData.lang || shareData.test || shareData.build
}

export function resolveActionRoute() {
  const parts = window.location.pathname.split('/').filter((i) => i)
  const route = parts.pop().toLowerCase()
  if (route && HANDLED_ROUTES.includes(route)) {
    return route
  }
}

export function resetRoute(full = true) {
  const { search } = window.location
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
