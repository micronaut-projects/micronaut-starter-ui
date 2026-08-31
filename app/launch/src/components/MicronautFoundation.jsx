//MicronautFoundation.js
import React from 'react'
import MicronautFoundationLogo from '../images/micronaut-foundation-logo.svg?react'

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
