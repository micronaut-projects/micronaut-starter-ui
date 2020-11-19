// Footer.js
import React from 'react'
import { Button } from 'react-materialize'
import Modal from 'react-materialize/lib/Modal'
import Icon from 'react-materialize/lib/Icon'

const InfoButton = ({ className = '', theme, style }) => {
    return (
        <Modal
            header="What's this?"
            className={theme}
            actions={
                <Button waves="light" modal="close" flat>
                    Close
                </Button>
            }
            trigger={
                <Button
                    style={style}
                    floating
                    className={`${theme} ${className}`}
                >
                    <Icon>info</Icon>
                </Button>
            }
        >
            <p>
                Micronaut Launch is a web application that allows you to create
                Micronaut projects through an interface instead of using the
                console CLI. You can set the application type, the project name,
                the language (Java, Kotlin, Groovy), the build tool (Maven,
                Gradle), the Java version and the features you need to develop
                your software.
            </p>
        </Modal>
    )
}

export default InfoButton
