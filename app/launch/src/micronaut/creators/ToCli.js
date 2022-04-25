import {NO_SELECTION_VALUE} from "../../state/store";

function deriveCommand(type) {
  switch (type) {
    case 'DEFAULT':
      return 'create-app'
    default:
      return `create-${type}-app`.toLowerCase()
  }
}

function buildFeaturesArgs(features) {
  const entries = Object.keys(features)
  if (entries.length) {
    return `${entries.join(',')}`
  }
}

export default class ToCli {
  static make(createCommand) {
    const { lang, build, test, javaVersion } = createCommand
    const jdk = javaVersion ? javaVersion.replace('JDK_', '') : null
    const command = deriveCommand(createCommand.type)
    const applicationName = createCommand.applicationName()

    const features = buildFeaturesArgs(createCommand.features)
    const cloudprovider = createCommand.cloudProvider != null && createCommand.cloudProvider !== NO_SELECTION_VALUE ? createCommand.cloudProvider : ''
    const opts = { build, jdk, lang, test, features, cloudprovider }
    const args = Object.keys(opts).reduce((acc, key) => {
      const value = opts[key]
      if (value) {
        acc.push(`--${key}=${value}`)
      }
      return acc
    }, [])

    return ['mn', command, ...args, applicationName].join(' ').toLowerCase()
  }
}
