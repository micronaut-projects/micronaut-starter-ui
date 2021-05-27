import { parseQuery } from './url'

export const BASE_PATH = 'launch'
export const ACTIVITY_KEY = 'activity'
export const VERSION_KEY = 'version'
export const FEATURES_KEY = 'features'

export const PREVIEW_ACTIVITY = 'preview'
export const DIFF_ACTIVITY = 'diff'
export const CREATE_ACTIVITY = 'create'

export const HANDLED_ACTIVITIES = [
  PREVIEW_ACTIVITY,
  DIFF_ACTIVITY,
  CREATE_ACTIVITY,
]

export function sharableLink(form, version) {
  const { features, ...rest } = form

  const parts = [
    ...Object.keys(rest).reduce((acc, key) => {
      acc.push(`${key}=${rest[key]}`)
      return acc
    }, []),
    ...Object.keys(features).map((feature) => `${FEATURES_KEY}=${feature}`),
  ]
  if (version) {
    parts.push(`${VERSION_KEY}=${version}`)
  }
  return parts.join('&')
}

export function fullyQualifySharableLink(sharable, options = {}) {
  const { origin, pathname } = window.location
  const { activity } = options
  let url = `${origin}${pathname}?${sharable}`
  if (activity) {
    url += `&${ACTIVITY_KEY}=${activity}`
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
  return !!(
    shareData.type ||
    shareData.lang ||
    shareData.test ||
    shareData.build
  )
}

export function resolveActionRoute(queryData) {
  if (!queryData instanceof Object) {
    return
  }
  const { activity } = queryData
  if (activity && HANDLED_ACTIVITIES.includes(activity)) {
    return activity
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
