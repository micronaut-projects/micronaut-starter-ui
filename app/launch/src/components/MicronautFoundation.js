//MicronautFoundation.js
import React from 'react'
import { ReactComponent as MicronautFoundationLogo } from '../images/micronaut-foundation-logo.svg'

const MicronautFoundation = ({theme}) => {
  return (
    <a
      title="Micronaut Foundation"
      href="https://micronaut.io/foundation"
      target="_blank"
      rel="noreferrer"
    >
      <MicronautFoundationLogo className="micronaut-foundation"/>
    </a>
  )
}

export default MicronautFoundation