plugins {
    id("com.gradle.enterprise") version("3.15")
}

gradleEnterprise {
    server = "https://ge.micronaut.io"
    buildScan {
        publishAlways()
        this.javaClass.getMethod("publishIfAuthenticated").invoke(this)
    }
}