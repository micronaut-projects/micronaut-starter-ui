// OciHomeOfMicronaut.js
import React from 'react'
import { ReactComponent as OciLogo } from '../images/oci-logo.svg'

const OciHomeOfMicronaut = ({ theme }) => {
  return (
    <a
      title="Discover OCI solutions with Micronaut"
      href="https://objectcomputing.com/products/micronaut"
    >
      <OciLogo className="oci-logo" />
    </a>
  )
}

export default OciHomeOfMicronaut
