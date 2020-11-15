export class CreateCommand {
  constructor({
    type,
    javaVersion,
    build,
    lang,
    test,
    name,
    package: _package,
    features,
  }) {
    this.type = type
    this.javaVersion = javaVersion
    this.name = name
    this.lang = lang
    this.build = build
    this.test = test
    this.package = _package
    this.features = features
  }

  buildFeaturesQuery(features) {
    return Object.keys(features)
      .reduce((array, feature) => {
        array.push(`features=${feature}`)
        return array
      }, [])
      .join('&')
  }

  toUrl(prefix) {
    if (!prefix) {
      console.error(
        "A prefix is required, should be one of 'diff', 'preview', 'github', 'create'"
      )
    }
    const {
      type,
      name,
      lang,
      build,
      test,
      javaVersion,
      package: pkg, // package is reserved keyword
      features,
    } = this

    const fqpkg = `${pkg}.${name}`
    const base = `/${prefix}/${type.toLowerCase()}/${fqpkg}`

    const query = [
      `lang=${lang}`,
      `build=${build}`,
      `test=${test}`,
      `javaVersion=${javaVersion}`,
    ]

    const featuresQuery = this.buildFeaturesQuery(features)
    if (featuresQuery) {
      query.push(featuresQuery)
    }
    return encodeURI(`${base}?${query.join('&')}`)
  }
}
