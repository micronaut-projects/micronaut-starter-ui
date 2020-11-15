export const API_URL =
    process.env.REACT_APP_API_URL || 'https://launch.micronaut.io'

export const SNAPSHOT_API_URL =
    process.env.REACT_APP_SNAPSHOT_API_URL || 'https://snapshot.micronaut.io'

export const JAVA_VERSIONS = [8, 9, 10, 11, 12, 13, 14, 15]

export const LANG_OPTS = [
    { label: 'Java', value: 'java' },
    { label: 'Kotlin', value: 'kotlin' },
    { label: 'Groovy', value: 'groovy' },
]

export const BUILD_OPTS = [
    { label: 'Gradle', value: 'gradle' },
    { label: 'Maven', value: 'maven' },
]

export const TEST_OPTS = [
    { value: 'junit', label: 'JUnit' },
    { value: 'spock', label: 'Spock' },
    { value: 'kotest', label: 'KoTest' },
]

export const JAVA_OPTS = JAVA_VERSIONS.map((v) => ({
    label: v.toString(),
    value: v.toString(),
}))

// Defaults
export const DEFAULT_JAVA_VERSION = 11
export const DEFAULT_LANG = LANG_OPTS[0].value
export const DEFAULT_BUILD = BUILD_OPTS[0].value
export const DEFAULT_TEST_FW = TEST_OPTS[0].value
