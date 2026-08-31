import com.github.gradle.node.npm.task.NpmTask

plugins {
    id("base")
    id("com.github.node-gradle.node") version "7.1.0"
    id("org.nosphere.gradle.github.actions") version "1.4.0"
}

node {
    download = true
    version = "24.20.0"
    nodeProjectDir = file("${layout.projectDirectory}/app/launch")
}

tasks {
    val npmInstall = named("npmInstall")

    val buildStarter = register<NpmTask>("buildStarter") {
        dependsOn(npmInstall)
        workingDir = layout.projectDirectory.file("app/launch")
        args = listOf("run", "build")
    }

    val copyLaunchAssets = register("copyLaunchAssets") {
        dependsOn(buildStarter)
        doLast {
            copy {
                from(layout.projectDirectory.dir("app/launch/build"))
                into(layout.buildDirectory.dir("launch"))
            }
            copy {
                from(layout.projectDirectory.dir("app/start"))
                into(layout.buildDirectory.dir("start"))
                include("*.html")
            }
        }
    }

    named("build") {
        dependsOn(copyLaunchAssets)
    }
}
