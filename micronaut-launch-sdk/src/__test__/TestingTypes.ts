export enum ApplicationTypeTestable {
    DEFAULT = 'DEFAULT',
    CLI = 'CLI',
    FUNCTION = 'FUNCTION',
    GRPC = 'GRPC',
    MESSAGING = 'MESSAGING',
}

export enum BuildToolTestable {
    GRADLE = 'GRADLE',
    GRADLE_KOTLIN = 'GRADLE_KOTLIN',
    MAVEN = 'MAVEN',
}

export enum TestFrameworkTestable {
    JUNIT = 'JUNIT',
    SPOCK = 'SPOCK',
    KOTEST = 'KOTEST',
}

export enum LanguageTestable {
    JAVA = 'JAVA',
    GROOVY = 'GROOVY',
    KOTLIN = 'KOTLIN',
}

export enum JdkVersionTestable {
    JDK_8 = 'JDK_8',
    JDK_9 = 'JDK_9',
    JDK_10 = 'JDK_10',
    JDK_11 = 'JDK_11',
    JDK_12 = 'JDK_12',
    JDK_13 = 'JDK_13',
    JDK_14 = 'JDK_14',
    JDK_15 = 'JDK_15',
}
