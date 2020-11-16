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

    this.__parts = `${version}`
      .split('-')[0]
      .replace(REGEX, '')
      .split(/[.]/gi)
      .map((i) => parseInt(i))
      .filter((i) => !isNaN(i))
      .slice(0, 3)
      .reduce(
        (acc, i, idx) => {
          acc[idx] = i
          return acc
        },
        [0, 0, 0]
      )
  }

  parts() {
    return this.__parts
  }

  basedVersion() {
    return this.parts().join('.')
  }

  gte(otherVersion) {
    const v1 = this.parts()
    const v2 = (otherVersion instanceof Version
      ? otherVersion
      : new Version(`${otherVersion}`)
    ).parts()

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
  Version,
  versionSupports,
  CAN_PUSH_TO_GITHUB,
}
