plugins {
    id("com.gradle.develocity") version("4.5.0")
    id("com.gradle.common-custom-user-data-gradle-plugin") version "2.8.0"
}

develocity {
    server.set("https://ge.micronaut.io")
    buildScan {
        publishing.onlyIf { it.isAuthenticated }
        val vendor = providers.systemProperty("java.vendor")
        if (vendor.isPresent) {
            tag("vendor:" + vendor.get().lowercase().replace(Regex("\\W+"), "_"))
        }
        tag("jdk:" + JavaVersion.current().majorVersion)
    }
}
