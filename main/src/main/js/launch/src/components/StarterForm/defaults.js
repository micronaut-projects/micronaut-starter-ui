const options = {
  type: {
    options: [
      {
        name: 'default',
        title: 'Micronaut Application',
        description: 'A Micronaut Application',
        value: 'DEFAULT',
        label: 'Micronaut Application',
      },
      {
        name: 'cli',
        title: 'Micronaut CLI Application',
        description: 'A Command Line Application',
        value: 'CLI',
        label: 'Command Line Application',
      },
      {
        name: 'function',
        title: 'Micronaut Serverless Function',
        description: 'A Function Application for Serverless',
        value: 'FUNCTION',
        label: 'Function Application for Serverless',
      },
      {
        name: 'grpc',
        title: 'Micronaut gRPC Application',
        description: 'A gRPC Application',
        value: 'GRPC',
        label: 'gRPC Application',
      },
      {
        name: 'messaging',
        title: 'Micronaut Messaging Application',
        description: 'A Messaging-Driven Application',
        value: 'MESSAGING',
        label: 'Messaging-Driven Application',
      },
    ],
    defaultOption: {
      name: 'default',
      title: 'Micronaut Application',
      description: 'A Micronaut Application',
      value: 'DEFAULT',
      label: 'Micronaut Application',
    },
  },
  jdkVersion: {
    options: [
      {
        value: 'JDK_8',
        name: 'JDK_8',
        description: 'JDK_8',
        label: '8',
      },
      {
        value: 'JDK_9',
        name: 'JDK_9',
        description: 'JDK_9',
        label: '9',
      },
      {
        value: 'JDK_10',
        name: 'JDK_10',
        description: 'JDK_10',
        label: '10',
      },
      {
        value: 'JDK_11',
        name: 'JDK_11',
        description: 'JDK_11',
        label: '11',
      },
      {
        value: 'JDK_12',
        name: 'JDK_12',
        description: 'JDK_12',
        label: '12',
      },
      {
        value: 'JDK_13',
        name: 'JDK_13',
        description: 'JDK_13',
        label: '13',
      },
      {
        value: 'JDK_14',
        name: 'JDK_14',
        description: 'JDK_14',
        label: '14',
      },
      {
        value: 'JDK_15',
        name: 'JDK_15',
        description: 'JDK_15',
        label: '15',
      },
    ],
    defaultOption: {
      value: 'JDK_11',
      name: 'JDK_11',
      description: 'JDK_11',
      label: '11',
    },
  },
  lang: {
    options: [
      {
        name: 'java',
        extension: 'java',
        description: 'java',
        value: 'JAVA',
        label: 'Java',
        defaults: {
          test: 'JUNIT',
          build: 'GRADLE',
        },
      },
      {
        name: 'groovy',
        extension: 'groovy',
        description: 'groovy',
        value: 'GROOVY',
        label: 'Groovy',
        defaults: {
          test: 'SPOCK',
          build: 'GRADLE',
        },
      },
      {
        name: 'kotlin',
        extension: 'kt',
        description: 'kotlin',
        value: 'KOTLIN',
        label: 'Kotlin',
        defaults: {
          test: 'KOTEST',
          build: 'GRADLE_KOTLIN',
        },
      },
    ],
    defaultOption: {
      name: 'java',
      extension: 'java',
      description: 'java',
      value: 'JAVA',
      label: 'Java',
      defaults: {
        test: 'JUNIT',
        build: 'GRADLE',
      },
    },
  },
  test: {
    options: [
      {
        name: 'junit',
        description: 'junit',
        value: 'JUNIT',
        label: 'Junit',
        defaults: {
          lang: 'JAVA',
          build: 'GRADLE',
        },
      },
      {
        name: 'spock',
        description: 'spock',
        value: 'SPOCK',
        label: 'Spock',
      },
      {
        name: 'kotest',
        description: 'kotest',
        value: 'KOTEST',
        label: 'Kotest',
        defaults: {
          lang: 'KOTLIN',
          build: 'GRADLE_KOTLIN',
        },
      },
    ],
    defaultOption: {
      name: 'junit',
      description: 'junit',
      value: 'JUNIT',
      label: 'Junit',
      defaults: {
        lang: 'JAVA',
        build: 'GRADLE',
      },
    },
  },
  build: {
    options: [
      {
        value: 'GRADLE',
        label: 'Gradle',
        description: 'Gradle',
      },
      {
        value: 'GRADLE_KOTLIN',
        label: 'Gradle Kotlin',
        description: 'Gradle Kotlin',
        defaults: {
          lang: 'KOTLIN',
          test: 'KOTEST',
        },
      },
      {
        value: 'MAVEN',
        label: 'Maven',
        description: 'Maven',
      },
    ],
    defaultOption: {
      value: 'GRADLE',
      label: 'Gradle',
      description: 'Gradle',
    },
  },
}

const defaults = Object.keys(options).reduce((acc, key) => {
  const val = options[key].options.reduce((acc, opt) => {
    const val = opt['defaults']
    if (val) {
      acc[opt.value] = opt['defaults']
    }
    return acc
  }, {})

  if (Object.keys(val).length) {
    acc[key] = val
  }
  return acc
}, {})

console.log(JSON.stringify(defaults, null, 2))
