import {
    BuildTool,
    ApplicationType,
    TestFramework,
    Language,
    JdkVersion,
    Feature,
} from './TypeDefs'

export type ActivityProps = {
    name: string
    package: string
    type: ApplicationType
    build?: BuildTool
    test?: TestFramework
    lang?: Language
    javaVersion?: JdkVersion
    features?: Record<string, Feature>
}

export class CreateCommand implements ActivityProps {
    name: string
    package: string
    type: ApplicationType
    build?: BuildTool
    test?: TestFramework
    lang?: Language
    javaVersion?: JdkVersion
    features?: Record<string, Feature>

    constructor(data: ActivityProps) {
        this.name = data.name
        this.package = data.package
        this.type = data.type
        this.build = data.build
        this.test = data.test
        this.lang = data.lang
        this.javaVersion = data.javaVersion
        this.features = data.features
    }

    buildFeaturesQuery(features: Record<string, any>): string {
        return Object.keys(features)
            .reduce((acc, feature) => {
                acc.push(`features=${feature}`)
                return acc
            }, [] as Array<string>)
            .join('&')
    }

    toUrl(prefix: string): string {
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

        const query = [] as string[]
        if (lang) {
            query.push(`lang=${lang}`)
        }
        if (build) {
            query.push(`build=${build}`)
        }

        if (test) {
            query.push(`test=${test}`)
        }

        if (javaVersion) {
            query.push(`javaVersion=${javaVersion}`)
        }

        if (features) {
            const featuresQuery = this.buildFeaturesQuery(features)
            query.push(featuresQuery)
        }

        return encodeURI(`${base}?${query.join('&')}`)
    }
}
