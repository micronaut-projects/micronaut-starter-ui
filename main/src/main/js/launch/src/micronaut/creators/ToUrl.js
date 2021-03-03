function buildFeaturesQuery(features) {
  return Object.keys(features)
    .reduce((array, feature) => {
      array.push(`features=${feature}`)
      return array
    }, [])
    .join('&')
}

export default class ToUrl {
  static make(createCommand, prefix) {
    if (!prefix) {
      console.error(
        "A prefix is required, should be one of 'diff', 'preview', 'github', 'create'"
      )
    }
    const {
      type,
      lang,
      build,
      test,
      javaVersion,
      features,
      baseUrl,
    } = createCommand

    const applicationName = createCommand.applicationName()
    const base = `/${prefix}/${type.toLowerCase()}/${applicationName}`

    const query = [
      lang && `lang=${lang}`,
      build && `build=${build}`,
      test && `test=${test}`,
      javaVersion && `javaVersion=${javaVersion}`,
    ].filter((i) => i)

    const featuresQuery = buildFeaturesQuery(features)
    if (featuresQuery) {
      query.push(featuresQuery)
    }
    return encodeURI(`${baseUrl}${base}?${query.join('&')}`)
  }
}
