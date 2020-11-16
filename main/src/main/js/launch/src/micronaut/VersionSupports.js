const STARTER_CORE = 'STARTER_CORE'
const CAN_PUSH_TO_GITHUB = 'CAN_PUSH_TO_GITHUB'
const SUPPORTED_CAPABILITIES = {
  '1.0.0': [STARTER_CORE],
  '2.2.0': [CAN_PUSH_TO_GITHUB],
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
      .slice(0, 2)
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

const versionSupports = (currentVersion, capability) => {
  const idx = Object.values(SUPPORTED_CAPABILITIES).findIndex((i) =>
    i.includes(capability)
  )
  if (idx === -1) {
    return false
  }
  const supportedVersion = Object.keys(SUPPORTED_CAPABILITIES)[idx]
  return new Version(currentVersion).gte(supportedVersion)
}

module.exports = {
  versionSupports,
  CAN_PUSH_TO_GITHUB,
}
