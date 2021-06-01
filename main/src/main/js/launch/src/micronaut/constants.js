export const API_URL =
  process.env.REACT_APP_API_URL || 'https://launch.micronaut.io'

export const SNAPSHOT_API_URL =
  process.env.REACT_APP_SNAPSHOT_API_URL || 'https://snapshot.micronaut.io'

export const NEXT_API_URL =
  process.env.REACT_APP_NEXT_API_URL || 'https://next.micronaut.io'

const RELEASE = 'RELEASE'
const SNAPSHOT = 'SNAPSHOT'
const NEXT = 'NEXT'

export const DEFAULT_APIS = {
  [RELEASE]: { baseUrl: API_URL, key: RELEASE, order: 0 },
  [SNAPSHOT]: { baseUrl: SNAPSHOT_API_URL, key: SNAPSHOT, order: 1 },
  [NEXT]: { baseUrl: NEXT_API_URL, key: NEXT, order: 2 },
}
