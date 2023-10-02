import com.github.gradle.node.npm.task.NpmTask

plugins {
    id("base")
    id("com.github.node-gradle.node") version "7.0.0"
    id("org.nosphere.gradle.github.actions") version "1.3.2"
}

node {
    download = true
    nodeProjectDir = file("${layout.projectDirectory}/app/launch")
}

tasks {
    val npmInstall = named("npmInstall")

    val buildStarter by registering(NpmTask::class) {
        dependsOn(npmInstall)
        workingDir = layout.projectDirectory.file("app/launch")
        args = listOf("run", "build")
    }

    val copyLaunchAssets by registering {
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

