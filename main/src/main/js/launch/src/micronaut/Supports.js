const STARTER_CORE = 'STARTER_CORE'
const PUSH_TO_GITHUB = 'PUSH_TO_GITHUB'
const SUPPORTED_FEATURES = {
  '1.0.0': [STARTER_CORE],
  '2.2.0': [PUSH_TO_GITHUB],
}

const REGEX = new RegExp('[^0-9.]', 'ig')

class Version {
  constructor(version) {
    this.version = version
  }

  parts() {
    const parts = this.version
      .replace(REGEX, '')
      .split(/[.]/gi)
      .filter((i) => !isNaN(i))
      .map((i) => parseInt(i))
      .reduce(
        (acc, i, idx) => {
          acc[idx] = i
          return acc
        },
        [0, 0, 0]
      )

    return parts
  }

  gte(otherVersion) {
    const v1 = this.parts()
    const v2 = new Version(otherVersion).parts()

    for (var i = 0; i < v1.length; i++) {
      if (v1[i] > v2[i]) {
        return true
      } else if (v1[i] < v2[i]) {
        return false
      }
    }
    return v1[2] === v2[2]
  }

  toString() {
    return this.version
  }
}

const isSupported = (currentVersion, feature) => {
  const idx = Object.values(SUPPORTED_FEATURES).findIndex((i) =>
    i.includes(feature)
  )
  if (idx === -1) {
    return false
  }
  const supportedVersion = Object.keys(SUPPORTED_FEATURES)[idx]
  return new Version(currentVersion).gte(supportedVersion)
}

module.exports = {
  isSupported,
  PUSH_TO_GITHUB,
}
