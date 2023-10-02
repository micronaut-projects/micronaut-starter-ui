plugins {
    id("com.gradle.enterprise") version("3.15")
    id("com.gradle.common-custom-user-data-gradle-plugin") version "1.11.3"
}

gradleEnterprise {
    server = "https://ge.micronaut.io"
    buildScan {
        publishAlways()
        this.javaClass.getMethod("publishIfAuthenticated").invoke(this)
        val vendor = providers.systemProperty("java.vendor")
        if (vendor.isPresent) {
            tag("vendor:" + vendor.get().lowercase().replace(Regex("\\W+"), "_"))
        }
        tag("jdk:" + JavaVersion.current().majorVersion)
    }
}