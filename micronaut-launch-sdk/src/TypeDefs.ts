export type HasDefaults = {
    test?: TestFramework
    build?: BuildTool
}

export enum ApplicationType {
    DEFAULT = 'DEFAULT',
    CLI = 'CLI',
    FUNCTION = 'FUNCTION',
    GRPC = 'GRPC',
    MESSAGING = 'MESSAGING',
}

export enum BuildTool {
    GRADLE = 'GRADLE',
    GRADLE_KOTLIN = 'GRADLE_KOTLIN',
    MAVEN = 'MAVEN',
}

export enum TestFramework {
    JUNIT = 'JUNIT',
    SPOCK = 'SPOCK',
    KOTEST = 'KOTEST',
}

export enum Language {
    JAVA = 'JAVA',
    GROOVY = 'GROOVY',
    KOTLIN = 'KOTLIN',
}

export enum JdkVersion {
    JDK_8 = 'JDK_8',
    JDK_9 = 'JDK_9',
    JDK_10 = 'JDK_10',
    JDK_11 = 'JDK_11',
    JDK_12 = 'JDK_12',
    JDK_13 = 'JDK_13',
    JDK_14 = 'JDK_14',
    JDK_15 = 'JDK_15',
}

export type ApplicationTypeRequest = {
    type: ApplicationType
}

export type Link = {
    href: string
    templated: boolean
}

export type Links = Record<string, Link>

export type Preview = {
    contents: Record<string, string>
    _links: Links
}

export type Feature = {
    name: string
    title: string
    description: string
    category: string
    preview: boolean
}

export type ApplicationTypeInfo = {
    value: ApplicationType
    name: string
    description: string
    title: string
    label: string
    features: Array<Feature>
}

export type TestFrameworkInfo = {
    value: TestFramework
    name: string
    description: string
    label: string
}

export type LanguageInfo = {
    value: Language
    name: string
    description: string
    label: string
    extension: string
    defaults: HasDefaults
}

export type BuildToolInfo = {
    value: BuildTool
    name: string
    description: string
    label: string
}

export type JdkVersionInfo = {
    value: JdkVersion
    name: string
    description: string
    label: string
}

export type ApplicationTypeList = {
    types: Array<ApplicationTypeInfo>
    _links: Links
}

export type FeatureList = {
    features: Array<Feature>
    _links: Links
}

export type Versions = {
    versions: Record<string, string>
    _links: Links
}

export type SelectOption<T> = {
    options: Array<T>
    defaultOption: T
}

export type SelectOptions = {
    type: SelectOption<ApplicationTypeInfo>
    test: SelectOption<TestFrameworkInfo>
    build: SelectOption<BuildToolInfo>
    jdkVersion: SelectOption<JdkVersion>
    lang: SelectOption<LanguageInfo>
}

export type Defaults = {
    lang: Record<Language, HasDefaults>
}

export type SelectOptionDefaults = {
    type: ApplicationTypeInfo
    test: TestFrameworkInfo
    build: BuildToolInfo
    jdkVersion: JdkVersion
    lang: LanguageInfo
}
